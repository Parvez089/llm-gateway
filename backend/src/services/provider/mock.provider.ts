import type {
  LLMProvider,
  ProviderRequest,
  ProviderResponse,
} from './provider.interface.js';

export class MockProvider implements LLMProvider {
  readonly name = 'mock';

  async call(req: ProviderRequest): Promise<ProviderResponse> {
    // Simulate LLM latency (200-800ms)
    const latency = 200 + Math.random() * 600;
    await new Promise((resolve) => setTimeout(resolve, latency));

    const inputTokens = Math.ceil(req.prompt.length / 4);
    const outputTokens = 20 + Math.floor(Math.random() * 30);

    return {
      output: `[MOCK] Echo: ${req.prompt.slice(0, 80)}`,
      inputTokens,
      outputTokens,
      raw: { mock: true, model: req.model },
    };
  }
}