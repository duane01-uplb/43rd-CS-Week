import { createCacheFromEnv } from '@csweek/cache';
import { env } from '$env/dynamic/private';

// Read-through cache + rate limiter backed by Upstash Redis. Fails open:
// when no Upstash REST variable is set or Redis is unreachable, loads hit
// the DB directly and rate limits allow through (see
// packages/cache/src/index.ts).
export const cache = createCacheFromEnv(env);