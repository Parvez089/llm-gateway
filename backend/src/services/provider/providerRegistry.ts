import type { LLMProvider } from './provider.interface.js';
import { GeminiProvider } from './gemini.provider.js';
import { env } from '../../config/env.js';

/**
 * Central registry for all LLM providers.
 * New providers (OpenAI, Claude, etc.) can be added here.
 */
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

// Register Gemini provider at startup
providerRegistry.register(new GeminiProvider(env.GEMINI_API_KEY));