export const MODELS = {
  'gemini-3.5-flash-lite': {
    tier: 'cheap',
    provider: 'gemini',
    inputCostPer1M: 0.0375,
    outputCostPer1M: 0.15,
    timeoutMs: 5000,
  },
  'gemini-3.5-flash': {
    tier: 'cheap',
    provider: 'gemini',
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    timeoutMs: 8000,
  },
  'gemini-3.5-pro': {
    tier: 'quality',
    provider: 'gemini',
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.00,
    timeoutMs: 20000,
  },
} as const;

export const FALLBACK_CHAINS: Record<'cheap' | 'quality', readonly string[]> = {
  cheap: ['gemini-3.5-flash-lite', 'gemini-3.5-flash'],
  quality: ['gemini-3.5-pro', 'gemini-3.5-flash'],
};