import { GoogleGenAI } from '@google/genai';
import type {
  LLMProvider,
  ProviderRequest,
  ProviderResponse,
} from './provider.interface.js';

export class GeminiProvider implements LLMProvider {
  readonly name = 'gemini';
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async call(req: ProviderRequest): Promise<ProviderResponse> {
    const response = await this.client.models.generateContent({
      model: req.model,
      contents: req.prompt,
      config: {
        systemInstruction: req.system,
        temperature: req.temperature,
        maxOutputTokens: req.maxTokens,
      },
    });

    return {
      output: response.text ?? '',
      inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
      raw: response,
    };
  }
}