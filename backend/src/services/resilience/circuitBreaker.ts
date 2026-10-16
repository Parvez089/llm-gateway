import { redis } from '../../lib/redis.js';
import { logger } from '../../lib/logger.js';

const FAILURE_THRESHOLD = 5;
const OPEN_DURATION_SECONDS = 30;
const HALF_OPEN_MAX_ATTEMPTS = 1;

export type CircuitState = 'closed' | 'open' | 'half-open';

function getKey(model: string): string {
  return `cb:${model}`;
}

export async function getCircuitState(model: string): Promise<CircuitState> {
  try {
    const key = getKey(model);
    const data = await redis.hgetall(key);

    if (!data.state) {
      return 'closed';
    }

    const state = data.state as CircuitState;

    // If open, check if enough time passed to try half-open
    if (state === 'open') {
      const openedAt = Number(data.openedAt ?? 0);
      const elapsed = Math.floor(Date.now() / 1000) - openedAt;

      if (elapsed >= OPEN_DURATION_SECONDS) {
        return 'half-open';
      }
    }

    return state;
  } catch (err) {
    logger.error({ err, model }, 'Circuit breaker get failed');
    return 'closed'; // fail open
  }
}

export async function recordSuccess(model: string): Promise<void> {
  try {
    const key = getKey(model);
    await redis.hset(key, {
      state: 'closed',
      failures: '0',
      openedAt: '0',
    });
  } catch (err) {
    logger.error({ err, model }, 'Circuit breaker record success failed');
  }
}

export async function recordFailure(model: string): Promise<void> {
  try {
    const key = getKey(model);
    const failures = await redis.hincrby(key, 'failures', 1);

    if (failures >= FAILURE_THRESHOLD) {
      await redis.hset(key, {
        state: 'open',
        openedAt: String(Math.floor(Date.now() / 1000)),
      });

      logger.warn(
        { model, failures },
        'Circuit breaker OPENED — too many failures'
      );
    }
  } catch (err) {
    logger.error({ err, model }, 'Circuit breaker record failure failed');
  }
}