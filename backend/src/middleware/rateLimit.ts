import type { FastifyRequest, FastifyReply } from 'fastify';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { redis } from '../lib/redis.js';
import { logger } from '../lib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LUA_PATH = join(__dirname, '..', 'scripts', 'lua', 'tokenBucket.lua');

let luaScript: string | null = null;
let luaSha: string | null = null;

async function loadScript(): Promise<void> {
  if (luaSha) return;

  luaScript = await readFile(LUA_PATH, 'utf8');

  // এখানে @ts-expect-error কমেন্টটি মুছে ফেলা হয়েছে
  luaSha = (await redis.script('LOAD', luaScript)) as string;
}

export async function rateLimit(req: FastifyRequest, reply: FastifyReply) {
  if (!req.apiKey) {
    return;
  }

  try {
    await loadScript();

    const capacity = req.apiKey.rateLimit?.capacity ?? 60;
    const refillPerSec = req.apiKey.rateLimit?.refillPerSec ?? 1;
    const key = `rl:${req.apiKey._id.toString()}`;
    const now = Math.floor(Date.now() / 1000);

    const result = (await redis.evalsha(
      luaSha!,
      1,
      key,
      String(capacity),
      String(refillPerSec),
      String(now),
      '1'
    )) as [number, number, number];

    const [allowed, remaining, retryAfter] = result;

    reply.header('X-RateLimit-Limit', String(capacity));
    reply.header('X-RateLimit-Remaining', String(remaining));

    if (allowed === 0) {
      reply.header('Retry-After', String(retryAfter));

      req.log.warn(
        { apiKeyId: req.apiKey._id, remaining, retryAfter },
        'Rate limit exceeded'
      );

      return reply.code(429).send({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
          requestId: req.id,
        },
      });
    }
  } catch (err) {
    logger.error({ err }, 'Rate limit check failed');
  }
}