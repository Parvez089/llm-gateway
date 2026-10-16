import { calculateCost } from '../../src/services/cost/costCalculator.js';

describe('calculateCost', () => {
  it('should return 0 for unknown model', () => {
    expect(calculateCost('unknown-model', 100, 200)).toBe(0);
  });

  it('should calculate cost for gemini-3.5-flash-lite', () => {
    const cost = calculateCost('gemini-3.5-flash-lite', 1000, 500);
    expect(cost).toBeCloseTo(0.0001125, 10);
  });

  it('should calculate cost for gemini-3.5-flash', () => {
    const cost = calculateCost('gemini-3.5-flash', 1000, 500);
    expect(cost).toBeCloseTo(0.000225, 10);
  });

  it('should calculate cost for gemini-3.5-pro', () => {
    const cost = calculateCost('gemini-3.5-pro', 1000, 500);
    expect(cost).toBeCloseTo(0.00375, 10);
  });

  it('should handle zero tokens', () => {
    expect(calculateCost('gemini-3.5-flash', 0, 0)).toBe(0);
  });
});