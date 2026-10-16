import {
  getCircuitState,
  recordSuccess,
  recordFailure,
} from '../../src/services/resilience/circuitBreaker.js';
import { redis } from '../../src/lib/redis.js';

const TEST_MODEL = 'test-model-cb';

describe('Circuit Breaker', () => {
  beforeEach(async () => {
    await redis.del(`cb:${TEST_MODEL}`);
  });

  afterAll(async () => {
    await redis.del(`cb:${TEST_MODEL}`);
    await redis.quit();
  });

  it('should return closed for new model', async () => {
    const state = await getCircuitState(TEST_MODEL);
    expect(state).toBe('closed');
  });

  it('should stay closed after success', async () => {
    await recordSuccess(TEST_MODEL);
    const state = await getCircuitState(TEST_MODEL);
    expect(state).toBe('closed');
  });

  it('should record failure but stay closed below threshold', async () => {
    for (let i = 0; i < 4; i++) {
      await recordFailure(TEST_MODEL);
    }
    const state = await getCircuitState(TEST_MODEL);
    expect(state).toBe('closed');

    const data = await redis.hgetall(`cb:${TEST_MODEL}`);
    expect(Number(data.failures)).toBe(4);
  });

  it('should open circuit after 5 failures', async () => {
    for (let i = 0; i < 5; i++) {
      await recordFailure(TEST_MODEL);
    }
    const state = await getCircuitState(TEST_MODEL);
    expect(state).toBe('open');
  });

  it('should reset to closed on success', async () => {
    for (let i = 0; i < 5; i++) {
      await recordFailure(TEST_MODEL);
    }
    await recordSuccess(TEST_MODEL);

    const state = await getCircuitState(TEST_MODEL);
    expect(state).toBe('closed');

    const data = await redis.hgetall(`cb:${TEST_MODEL}`);
    expect(Number(data.failures)).toBe(0);
  });
});