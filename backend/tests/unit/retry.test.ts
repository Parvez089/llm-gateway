import { withRetry } from '../../src/services/resilience/retry.js';

type MockFn<T> = () => Promise<T>;

function createMockFn<T>(): MockFn<T> & { calls: number } {
  const fn = (async () => {
    fn.calls++;
    return undefined as T;
  }) as MockFn<T> & { calls: number };
  fn.calls = 0;
  return fn;
}

describe('withRetry', () => {
  it('should return result on first success', async () => {
    let calls = 0;
    const fn = async (): Promise<string> => {
      calls++;
      return 'success';
    };

    const result = await withRetry(fn);
    expect(result).toBe('success');
    expect(calls).toBe(1);
  });

  it('should retry on retryable error (5xx)', async () => {
    let calls = 0;
    const fn = async (): Promise<string> => {
      calls++;
      if (calls === 1) {
        throw { status: 503, message: 'Service Unavailable' };
      }
      return 'success';
    };

    const result = await withRetry(fn, { maxAttempts: 2, baseDelayMs: 10 });
    expect(result).toBe('success');
    expect(calls).toBe(2);
  });

  it('should not retry on non-retryable error (4xx)', async () => {
    let calls = 0;
    const err = { status: 400, message: 'Bad Request' };
    const fn = async (): Promise<string> => {
      calls++;
      throw err;
    };

    await expect(
      withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 })
    ).rejects.toEqual(err);
    expect(calls).toBe(1);
  });

  it('should throw after maxAttempts exhausted', async () => {
    let calls = 0;
    const err = { status: 503, message: 'Service Unavailable' };
    const fn = async (): Promise<string> => {
      calls++;
      throw err;
    };

    await expect(
      withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 })
    ).rejects.toEqual(err);
    expect(calls).toBe(3);
  });

  it('should retry on 429 (rate limit)', async () => {
    let calls = 0;
    const fn = async (): Promise<string> => {
      calls++;
      if (calls === 1) {
        throw { status: 429, message: 'Too Many Requests' };
      }
      return 'ok';
    };

    const result = await withRetry(fn, { maxAttempts: 2, baseDelayMs: 10 });
    expect(result).toBe('ok');
    expect(calls).toBe(2);
  });
});