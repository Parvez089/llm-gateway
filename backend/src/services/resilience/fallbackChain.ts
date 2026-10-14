import { logger } from '../../lib/logger.js';
import type { LLMProvider, ProviderRequest, ProviderResponse } from '../provider/provider.interface.js';
import { withRetry } from './retry.js';

export type FallbackAttempt = {
  model: string;
  success: boolean;
  error?: unknown;
  latencyMs: number;
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

    try {
      const response = await withRetry(
        () =>
          provider.call({
            ...baseRequest,
            model,
          }),
        { maxAttempts: 2, baseDelayMs: 300 }
      );

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
      attempts.push({
        model,
        success: false,
        error: err,
        latencyMs: Date.now() - startTime,
      });

      logger.warn({ err, model, attemptNumber: i + 1 }, 'Model failed, trying next in chain');

      // If last model in chain, throw
      if (i === chain.length - 1) {
        throw new Error(
          `All models in fallback chain failed: ${chain.join(', ')}`
        );
      }
    }
  }

  throw new Error('Empty fallback chain');
}