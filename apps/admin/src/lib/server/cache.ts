import { createCacheFromEnv } from '@csweek/cache';
import { env } from '$env/dynamic/private';

export const cache = createCacheFromEnv(env);