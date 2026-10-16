import { buildApp } from '../../src/app.js';
import { ApiKey } from '../../src/models/ApiKey.js';
import { generateApiKey } from '../../src/lib/hash.js';
import { connectMongo, closeMongo } from '../../src/lib/mongo.js';

type App = Awaited<ReturnType<typeof buildApp>>;

describe.skip('Auth Integration', () => {
  let app: App;
  let testApiKey: string;

  beforeAll(async () => {
    await connectMongo();
    app = await buildApp();
    await app.ready();

    const { key, keyHash, keyPrefix } = generateApiKey();
    testApiKey = key;

    await ApiKey.create({
      name: 'Test Key Auth',
      keyHash,
      keyPrefix,
      rateLimit: { capacity: 100, refillPerSec: 10 },
      isActive: true,
    });
  });

  afterAll(async () => {
    await ApiKey.deleteMany({ name: 'Test Key Auth' });
    await app.close();
    await closeMongo();
  });

  it('should return 401 without API key', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/chat',
      payload: { prompt: 'test' },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.error.code).toBe('MISSING_API_KEY');
  });

  it('should return 401 with invalid API key', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/chat',
      headers: { authorization: 'Bearer invalid_key_here' },
      payload: { prompt: 'test' },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.error.code).toBe('INVALID_API_KEY');
  });

  it('should return 400 with invalid body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/chat',
      headers: { authorization: `Bearer ${testApiKey}` },
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error.code).toBe('INVALID_REQUEST');
  });
});
