import { logger } from '../../lib/logger.js';
import type { LLMProvider, ProviderRequest, ProviderResponse } from '../provider/provider.interface.js';
import { withRetry } from './retry.js';
import { getCircuitState, recordFailure, recordSuccess } from './circuitBreaker.js';

export type FallbackAttempt = {
  model: string;
  success: boolean;
  error?: unknown;
  latencyMs: number;
  skipped?: boolean;
};

export type FallbackResult = {
  response: ProviderResponse;
  modelUsed: string;
  fallbackUsed: boolean;
  attempts: FallbackAttempt[];
};

export async function callWithFallback(
  provider: LLMProvider,
  chain: readonly string[],
  baseRequest: Omit<ProviderRequest, 'model'>
): Promise<FallbackResult> {
  const attempts: FallbackAttempt[] = [];

  for (let i = 0; i < chain.length; i++) {
    const model = chain[i]!;
    const startTime = Date.now();

    // Check circuit breaker
    const state = await getCircuitState(model);

    if (state === 'open') {
      logger.warn({ model }, 'Circuit OPEN — skipping model');
      attempts.push({
        model,
        success: false,
        latencyMs: Date.now() - startTime,
        skipped: true,
      });
      continue;
    }

    try {
      const response = await withRetry(
        () =>
          provider.call({
            ...baseRequest,
            model,
          }),
        { maxAttempts: 2, baseDelayMs: 300 }
      );

      // Success — reset circuit
      await recordSuccess(model);

      attempts.push({
        model,
        success: true,
        latencyMs: Date.now() - startTime,
      });

      return {
        response,
        modelUsed: model,
        fallbackUsed: i > 0,
        attempts,
      };
    } catch (err) {
      // Record failure for circuit breaker
      await recordFailure(model);

      attempts.push({
        model,
        success: false,
        error: err,
        latencyMs: Date.now() - startTime,
      });

      logger.warn(
        { err, model, attemptNumber: i + 1 },
        'Model failed, trying next in chain'
      );

      if (i === chain.length - 1) {
        throw new Error(
          `All models in fallback chain failed: ${chain.join(', ')}`
        );
      }
    }
  }

  throw new Error('Empty fallback chain');
}