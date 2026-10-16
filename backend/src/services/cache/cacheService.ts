import { redis } from '../../lib/redis.js';
import { logger } from '../../lib/logger.js';
import { buildCacheKey } from './cacheKey.js';
import type { ChatResponse } from '../../types/api.js';

const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours
const LOCK_TTL_SECONDS = 30;

export type CachedResponse = {
  output: string;
  model: string;
  tier: 'cheap' | 'quality';
  routingScore: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
};

export type CacheInput = {
  prompt: string;
  system?: string;
  model: string;
  temperature: number;
  maxTokens?: number;
};

/**
 * Try to get a cached response.
 * Returns null on cache miss.
 */
export async function getCached(input: CacheInput): Promise<CachedResponse | null> {
  const key = buildCacheKey(input);

  try {
    const raw = await redis.get(key);
    if (!raw) return null;

    return JSON.parse(raw) as CachedResponse;
  } catch (err) {
    logger.error({ err, key }, 'Cache get failed');
    return null;
  }
}

/**
 * Store a response in cache with TTL.
 */
export async function setCached(input: CacheInput, data: CachedResponse): Promise<void> {
  const key = buildCacheKey(input);

  try {
    await redis.set(key, JSON.stringify(data), 'EX', CACHE_TTL_SECONDS);
  } catch (err) {
    logger.error({ err, key }, 'Cache set failed');
  }
}

/**
 * Stampede protection: acquire a lock so only one request computes.
 * Returns true if lock acquired, false if another request is already computing.
 */
export async function acquireLock(input: CacheInput): Promise<boolean> {
  const key = buildCacheKey(input).replace('cache:', 'lock:');

  try {
    const result = await redis.set(key, '1', 'EX', LOCK_TTL_SECONDS, 'NX');
    return result === 'OK';
  } catch (err) {
    logger.error({ err, key }, 'Lock acquire failed');
    return true; // fail open — allow request
  }
}

export async function releaseLock(input: CacheInput): Promise<void> {
  const key = buildCacheKey(input).replace('cache:', 'lock:');

  try {
    await redis.del(key);
  } catch (err) {
    logger.error({ err, key }, 'Lock release failed');
  }
}