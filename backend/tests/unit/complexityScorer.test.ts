import { scoreComplexity } from '../../src/services/router/complexityScorer.js';

describe('scoreComplexity', () => {
  it('should return low score for simple prompt', () => {
    const result = scoreComplexity('Hello');
    expect(result.score).toBeLessThan(40);
  });

  it('should return low score for translation request', () => {
    const result = scoreComplexity('Translate "hello" to Spanish');
    expect(result.score).toBeLessThan(40);
  });

  it('should return high score for complex analysis', () => {
    const result = scoreComplexity(
      'Analyze step-by-step and refactor this code to improve performance'
    );
    expect(result.score).toBeGreaterThanOrEqual(40);
  });

  it('should detect complex keywords', () => {
    const result = scoreComplexity('Please analyze and compare these two approaches');
    expect(result.signals.some((s) => s.includes('analyze'))).toBe(true);
    expect(result.signals.some((s) => s.includes('compare'))).toBe(true);
  });

  it('should detect code blocks', () => {
    const result = scoreComplexity('Review this code:\n```js\nconst x = 1;\n```');
    expect(result.signals.some((s) => s.includes('code_block'))).toBe(true);
  });

  it('should detect multiple questions', () => {
    const result = scoreComplexity('What is X? How does Y work? Why is Z important?');
    expect(result.signals.some((s) => s.includes('multiple_questions'))).toBe(true);
  });

  it('should reduce score for simple keywords', () => {
    const result = scoreComplexity('Summarize this text in two lines');
    expect(result.signals.some((s) => s.includes('simple_keyword'))).toBe(true);
  });

  it('should cap score at 100', () => {
    const result = scoreComplexity(
      'Analyze ' + 'complex '.repeat(50) + '```code``` refactor optimize derive prove'
    );
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('should not go below 0', () => {
    const result = scoreComplexity('translate summarize format list');
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty prompt', () => {
    const result = scoreComplexity('');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});