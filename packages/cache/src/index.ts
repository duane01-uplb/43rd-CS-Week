import { Redis } from '@upstash/redis';

export type Cache = {
	/** True when a Redis URL + token were provided (Upstash is reachable). */
	enabled: boolean;
	/**
	 * Read-through JSON cache. On a miss (or any Redis error) it computes the
	 * value via `fetcher` and stores it for `ttlSeconds`. Never throws —
	 * failures degrade to the fetcher so the site keeps working if Upstash is
	 * unreachable, times out, or is unconfigured. Values must be
	 * JSON-serializable (note: Postgres `Date` fields arrive back as ISO
	 * strings; rendering code already accepts `Date | string`).
	 */
	getJson<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T>;
	/** Delete one or more keys (no-op when Redis is unavailable). */
	bust(...keys: string[]): Promise<void>;
	/**
	 * Fixed-window counter: `incr` the key, seeding the window with `expire`
	 * on the first hit. Returns `{ ok, remaining }`. Fails open (`ok: true`)
	 * when Redis is unavailable so a cache outage never blocks registration.
	 */
	rateLimit(
		key: string,
		limit: number,
		windowSeconds: number
	): Promise<{ ok: boolean; remaining: number }>;
};

export function createCache(url: string | undefined, token: string | undefined): Cache {
	const redis = url && token ? new Redis({ url, token }) : null;
	const enabled = redis !== null;

	return {
		enabled,

		async getJson<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
			if (!redis) return fetcher();
			try {
				const cached = await redis.get<T>(key);
				if (cached !== null) return cached;
			} catch (e) {
				console.error(`[cache] get failed for ${key}:`, e);
			}
			const value = await fetcher();
			try {
				await redis.set(key, value as T, { ex: ttlSeconds });
			} catch (e) {
				console.error(`[cache] set failed for ${key}:`, e);
			}
			return value;
		},

		async bust(...keys: string[]): Promise<void> {
			if (!redis || keys.length === 0) return;
			try {
				await redis.del(...keys);
			} catch (e) {
				console.error(`[cache] del failed for ${keys.join(', ')}:`, e);
			}
		},

		async rateLimit(
			key: string,
			limit: number,
			windowSeconds: number
		): Promise<{ ok: boolean; remaining: number }> {
			if (!redis) return { ok: true, remaining: limit };
			try {
				const current = await redis.incr(key);
				if (current === 1) await redis.expire(key, windowSeconds);
				return { ok: current <= limit, remaining: Math.max(0, limit - current) };
			} catch (e) {
				console.error(`[cache] rateLimit failed for ${key}:`, e);
				return { ok: true, remaining: limit };
			}
		}
	};
}

export type EnvLike = Record<string, string | undefined>;

/**
 * Accepts any ``Record<string, string | undefined>`` (e.g. the `$env/dynamic/private`
 * `env` object) and builds a cache from the first matching Upstash variable
 * names it finds. Supports both the conventional names and the alternative
 * prefixes, so whichever block was pasted into the deployment env works.
 */
export function createCacheFromEnv(env: EnvLike): Cache {
	const urlKeys = [
		'UPSTASH_REDIS_REST_URL',
		'UPSTASH_RESDIS_REST_KV_REST_API_URL',
		'UPSTASH_REDIS_REST_KV_REST_API_URL',
		'UPSTASH_RESDIS_REST_REDIS_URL'
	];
	const tokenKeys = [
		'UPSTASH_REDIS_REST_TOKEN',
		'UPSTASH_RESDIS_REST_KV_REST_API_TOKEN',
		'UPSTASH_REDIS_REST_KV_REST_API_TOKEN',
		'UPSTASH_RESDIS_REST_REDIS_TOKEN'
	];
	const pick = (keys: string[]) => {
		for (const key of keys) {
			const value = env[key];
			if (value) return value;
		}
		return undefined;
	};
	return createCache(pick(urlKeys), pick(tokenKeys));
}

/**
 * Shared cache keys. Both apps write to the same Upstash instance, so these
 * must stay consistent — admin mutations bust web keys and vice versa.
 */
export const cacheKeys = {
	/** Homepage read (`upcoming` events + open count). */
	webHome: 'web:home',
	/** `/events` listing, by filter combination. */
	webEvents: (status: string | null, upcoming: boolean) =>
		`web:events:${status ?? 'all'}:${upcoming ? 'upcoming' : 'all'}`,
	/** Every `/events` variant, for blanket busting after an edit. */
	webEventsVariants: [
		'web:events:all:all',
		'web:events:all:upcoming',
		'web:events:open:all',
		'web:events:open:upcoming'
	],
	/** Event detail (event + its dynamic fields). */
	webEvent: (eventId: string) => `web:event:${eventId}`,
	/** Admin dashboard summary counts. */
	adminOverview: 'admin:overview',
	/** Registration rate-limit keys (per event+IP and per IP globally). */
	rlRegisterEvent: (eventId: string, ip: string) => `rl:register:event:${eventId}:${ip}`,
	rlRegisterGlobal: (ip: string) => `rl:register:global:${ip}`
};