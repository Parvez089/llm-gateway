import { buildCacheKey, normalizePrompt } from '../../src/services/cache/cacheKey.js';

describe('normalizePrompt', () => {
  it('should lowercase text', () => {
    expect(normalizePrompt('HELLO WORLD')).toBe('hello world');
  });

  it('should trim whitespace', () => {
    expect(normalizePrompt('  hello  ')).toBe('hello');
  });

  it('should collapse multiple spaces', () => {
    expect(normalizePrompt('hello    world')).toBe('hello world');
  });

  it('should handle empty string', () => {
    expect(normalizePrompt('')).toBe('');
  });

  it('should handle tabs and newlines', () => {
    expect(normalizePrompt('hello\t\nworld')).toBe('hello world');
  });
});

describe('buildCacheKey', () => {
  it('should generate consistent keys for same input', () => {
    const input = {
      prompt: 'Hello World',
      model: 'gemini-3.5-flash',
      temperature: 0.3,
    };
    const key1 = buildCacheKey(input);
    const key2 = buildCacheKey(input);
    expect(key1).toBe(key2);
  });

  it('should generate same key for normalized prompts', () => {
    const key1 = buildCacheKey({
      prompt: 'Hello World',
      model: 'gemini-3.5-flash',
      temperature: 0.3,
    });
    const key2 = buildCacheKey({
      prompt: '  hello   world  ',
      model: 'gemini-3.5-flash',
      temperature: 0.3,
    });
    expect(key1).toBe(key2);
  });

  it('should generate different keys for different models', () => {
    const key1 = buildCacheKey({
      prompt: 'test',
      model: 'gemini-3.5-flash',
      temperature: 0.3,
    });
    const key2 = buildCacheKey({
      prompt: 'test',
      model: 'gemini-3.5-pro',
      temperature: 0.3,
    });
    expect(key1).not.toBe(key2);
  });

  it('should generate different keys for different temperatures', () => {
    const key1 = buildCacheKey({
      prompt: 'test',
      model: 'gemini-3.5-flash',
      temperature: 0.3,
    });
    const key2 = buildCacheKey({
      prompt: 'test',
      model: 'gemini-3.5-flash',
      temperature: 0.7,
    });
    expect(key1).not.toBe(key2);
  });

  it('should include system prompt in key', () => {
    const key1 = buildCacheKey({
      prompt: 'test',
      system: 'You are helpful',
      model: 'gemini-3.5-flash',
      temperature: 0.3,
    });
    const key2 = buildCacheKey({
      prompt: 'test',
      model: 'gemini-3.5-flash',
      temperature: 0.3,
    });
    expect(key1).not.toBe(key2);
  });

  it('should start with cache: prefix', () => {
    const key = buildCacheKey({
      prompt: 'test',
      model: 'gemini-3.5-flash',
      temperature: 0.3,
    });
    expect(key).toMatch(/^cache:/);
  });

  it('should have 64-char hash after prefix', () => {
    const key = buildCacheKey({
      prompt: 'test',
      model: 'gemini-3.5-flash',
      temperature: 0.3,
    });
    const hash = key.replace('cache:', '');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });
});