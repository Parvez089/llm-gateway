import { logger } from '../../lib/logger.js';

export type RetryOptions = {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (err: unknown) => boolean;
};

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 4000,
  shouldRetry: (err) => {
    // Retry only on transient errors
    const anyErr = err as { status?: number; code?: number; message?: string };
    const status = anyErr.status ?? anyErr.code;
    if (status === 429) return true; // rate limit
    if (status && status >= 500 && status < 600) return true; // server errors
    if (anyErr.message?.includes('UNAVAILABLE')) return true;
    if (anyErr.message?.includes('fetch failed')) return true;
    return false;
  },
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastErr: unknown;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;

      if (attempt === opts.maxAttempts) {
        break;
      }

      if (!opts.shouldRetry(err)) {
        logger.warn({ err }, 'Non-retryable error');
        throw err;
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        opts.baseDelayMs * 2 ** (attempt - 1) + Math.random() * 200,
        opts.maxDelayMs
      );

      logger.warn(
        { attempt, maxAttempts: opts.maxAttempts, delayMs: Math.round(delay) },
        'Retrying after failure'
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastErr;
}