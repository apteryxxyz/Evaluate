import '@trpc-limiter/core';
import { createTRPCStoreLimiter } from '@trpc-limiter/memory';
import {
  createTRPCUpstashLimiter,
  defaultFingerPrint,
} from '@trpc-limiter/upstash';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import ms from 'enhanced-ms';
import { env } from '~/env';
import type { t } from './trpc';

const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export const aiRatelimiter = redis
  ? createTRPCUpstashLimiter<typeof t>({
      fingerprint: (ctx) => defaultFingerPrint(ctx.request),
      message: (hitInfo) =>
        `You have reached the rate limit for this action, try again in ${ms(hitInfo.reset - Date.now(), { shortFormat: true })}.`,
      rateLimitOpts: () => ({
        redis,
        limiter: Ratelimit.fixedWindow(5, '12h'),
        prefix: 'evaluate:ratelimit:ai',
      }),
    })
  : createTRPCStoreLimiter<typeof t>({
      fingerprint: (ctx) => defaultFingerPrint(ctx.request),
      message: (hitInfo) =>
        `You have reached the rate limit for this action, try again in ${ms(hitInfo * 1000, { shortFormat: true })}.`,
      max: 5,
      windowMs: ms('12h'),
    });
