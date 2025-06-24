import { registerAs } from '@nestjs/config';

export interface AnthropicConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  maxRetries: number;
  timeout: number;
  promptsBasePath: string;
}

export default registerAs('anthropic', (): AnthropicConfig => {
  const config: AnthropicConfig = {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '4096', 10),
    temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.7'),
    maxRetries: parseInt(process.env.ANTHROPIC_MAX_RETRIES || '3', 10),
    timeout: parseInt(process.env.ANTHROPIC_TIMEOUT || '30000', 10),
    promptsBasePath: process.env.PROMPTS_BASE_PATH || './prompts',
  };

  // Validate required configuration
  if (!config.apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required');
  }

  return config;
});
