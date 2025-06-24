import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { AudioInfo, AudioProcessingException } from './audioProcessing.service';
import { AnthropicConfig } from '../config/anthropic.config';
import * as fs from 'fs';
import * as path from 'path';

export interface TonalityResult {
  dominantTone: string;
  confidenceScore: number;
  toneDescription: string;
  emotionalRange: string;
  musicalKey?: string;
  additionalNotes?: string;
}

@Injectable()
export class AnthropicService {
  private tonalityAnalysisPrompt: string;
  private anthropic: Anthropic;
  private config: AnthropicConfig;

  constructor(private configService: ConfigService) {
    // Get configuration
    this.config = this.configService.get<AnthropicConfig>('anthropic');

    // Initialize Anthropic client
    if (!this.config.apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    this.anthropic = new Anthropic({
      apiKey: this.config.apiKey,
      maxRetries: this.config.maxRetries,
    });

    // Load the prompt from the prompts folder
    try {
      this.tonalityAnalysisPrompt = this.loadPromptFromFile('default.txt');
    } catch (error) {
      // Fall back to a default prompt if the file can't be loaded
      console.warn(
        'Failed to load prompt from file, using default:',
        error.message,
      );
      this.tonalityAnalysisPrompt = this.getDefaultPrompt();
    }
  }

  /**
   * Analyze the tonality of an audio file (based on its properties)
   *
   * @param audioInfo Information about the audio file including duration, format, and encoded content
   * @param clientId Client identifier for tonality provider
   * @param customPrompt Optional custom prompt for analysis
   * @returns Tonality analysis results
   */
  async analyzeTonality(
    audioInfo: AudioInfo,
    clientId: string,
    customPrompt?: string,
  ): Promise<TonalityResult> {
    try {
      // Create a modified prompt based on the parameters
      const systemPrompt = this.getTonality(clientId);

      // Build the prompt with audio information
      const audioInfoText = `Audio file name: ${audioInfo.fileName}
Format: ${audioInfo.fileFormat}
Duration: ${audioInfo.durationInSeconds.toFixed(2)} seconds
File size: ${audioInfo.fileSize} bytes
Base64 audio content: ${audioInfo.base64Content}`;

      // Append custom prompt to system prompt if not empty
      let finalSystemPrompt = systemPrompt;
      if (customPrompt) {
        finalSystemPrompt += `\n\nAdditional Instructions: ${customPrompt}`;
      }

      // Send to Claude via API
      const responseText = await this.callClaudeAPI(
        finalSystemPrompt,
        audioInfoText,
      );

      // Extract JSON part of the response
      const jsonResponse = this.extractJsonFromResponse(responseText);

      // Parse the response into a TonalityResult object
      return JSON.parse(jsonResponse) as TonalityResult;
    } catch (error) {
      throw new AudioProcessingException(
        `Failed to analyze audio tonality: ${error.message}`,
        error,
      );
    }
  }

  /**
   * Get tonality prompt based on client ID
   * This replaces the Java TonalityProvider.getTonality() method
   */
  private getTonality(clientId: string): string {
    try {
      // Try to load client-specific prompt
      const promptFileName = `clientId${clientId}.txt`;
      return this.loadPromptFromFile(promptFileName);
    } catch (error) {
      // Fall back to default prompt if client-specific prompt doesn't exist
      console.log(
        `No specific prompt found for client ${clientId}, using default`,
      );
      return this.tonalityAnalysisPrompt;
    }
  }

  /**
   * Load prompt from file in the prompts directory
   */
  private loadPromptFromFile(fileName: string): string {
    const filePath = path.join(this.config.promptsBasePath, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Prompt file not found: ${filePath}`);
    }

    return fs.readFileSync(filePath, 'utf-8').trim();
  }

  /**
   * Get default prompt for tonality analysis
   */
  private getDefaultPrompt(): string {
    return `You are an expert audio analyst. Analyze the following audio file and provide details about its tonality. 
Return your analysis in JSON format with fields: dominantTone, confidenceScore, toneDescription, 
emotionalRange, musicalKey, and additionalNotes.

The response should be valid JSON only, without any additional text.`;
  }

  /**
   * Call Claude API using Anthropic SDK
   */
  private async callClaudeAPI(
    systemPrompt: string,
    userMessage: string,
  ): Promise<string> {
    try {
      const message = await this.anthropic.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
        system: systemPrompt,
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw new AudioProcessingException(
        `Failed to call Claude API: ${error.message}`,
        error,
      );
    }
  }

  /**
   * Extract JSON from Claude's response, which might contain additional text
   */
  private extractJsonFromResponse(response: string): string {
    // Look for JSON object in the response
    const startIndex = response.indexOf('{');
    const endIndex = response.lastIndexOf('}');

    if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex) {
      return response.substring(startIndex, endIndex + 1);
    }

    // If no JSON found, throw an exception
    throw new AudioProcessingException(
      'Could not extract valid JSON from AI response',
    );
  }
}
