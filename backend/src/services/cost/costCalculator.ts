import { MODELS } from '../../config/models.js';

/**
 * Calculate the USD cost of an LLM call.
 *
 * @param model - Model name (e.g. 'gemini-2.5-flash')
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 * @returns Estimated cost in USD
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const config = MODELS[model as keyof typeof MODELS];

  if (!config) {
    return 0;
  }

  const inputCost = (inputTokens / 1_000_000) * config.inputCostPer1M;
  const outputCost = (outputTokens / 1_000_000) * config.outputCostPer1M;

  return inputCost + outputCost;
}