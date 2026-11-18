import { createCacheFromEnv } from '@csweek/cache';
import { env } from '$env/dynamic/private';

// Redis-backed registration rate limiting and admin overview invalidation.
export const cache = createCacheFromEnv(env);
