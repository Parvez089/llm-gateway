import { scoreComplexity } from './complexityScorer.js';
import type { RoutingDecision, RoutingMode } from './types.js';

const COMPLEXITY_THRESHOLD = 40;

/**
 * Routes a prompt to a tier (cheap or quality) based on:
 * - User preference (routing mode)
 * - Prompt complexity score
 */
export const routerEngine = {
  route(prompt: string, mode: RoutingMode = 'auto'): RoutingDecision {
    // Manual override
    if (mode === 'cheap') {
      return {
        tier: 'cheap',
        score: 0,
        reason: 'user_forced_cheap',
      };
    }

    if (mode === 'quality') {
      return {
        tier: 'quality',
        score: 100,
        reason: 'user_forced_quality',
      };
    }

    // Auto: score the prompt
    const { score, signals } = scoreComplexity(prompt);
    const tier = score >= COMPLEXITY_THRESHOLD ? 'quality' : 'cheap';

    return {
      tier,
      score,
      reason: signals.join(', ') || 'default',
    };
  },
};