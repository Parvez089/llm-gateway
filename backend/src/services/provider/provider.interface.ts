export interface LLMProvider {
  readonly name: string;
  call(req: ProviderRequest): Promise<ProviderResponse>;
}

export type ProviderRequest = {
  model: string;
  prompt: string;
  system?: string;
  temperature: number;
  maxTokens?: number;
};

export type ProviderResponse = {
  output: string;
  inputTokens: number;
  outputTokens: number;
  raw: unknown;
};