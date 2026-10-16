import type { LLMProvider } from './provider.interface.js';
import { GeminiProvider } from './gemini.provider.js';
import { MockProvider } from './mock.provider.js';
import { env } from '../../config/env.js';

class ProviderRegistry {
  private providers = new Map<string, LLMProvider>();

  register(provider: LLMProvider): void {
    this.providers.set(provider.name, provider);
  }

  get(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  list(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const providerRegistry = new ProviderRegistry();

// Register Gemini provider (production)
providerRegistry.register(new GeminiProvider(env.GEMINI_API_KEY));

// Register Mock provider (for load testing)
providerRegistry.register(new MockProvider());