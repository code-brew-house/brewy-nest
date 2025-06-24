import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioAnalysisRequestEntity } from '../entities/audioAnalysisRequest.entity';
import { AudioAnalysisResponse } from '../interfaces/audioAnalysisResponse.interface';
import { AudioProcessingService } from './audioProcessing.service';
import { AnthropicService } from './anthropic.service';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Injectable()
export class AudioAnalysisService {
  constructor(
    @InjectRepository(AudioAnalysisRequestEntity)
    private audioAnalysisRequestRepository: Repository<AudioAnalysisRequestEntity>,
    private audioProcessingService: AudioProcessingService,
    private anthropicService: AnthropicService,
  ) {}

  /**
   * Process audio file and analyze its tonality
   *
   * @param request The analysis request containing the audio file and analysis options
   * @returns Analysis results
   */
  async analyzeAudio(request: {
    audioFile: UploadedFile;
    clientId: string;
    customPrompt?: string;
  }): Promise<AudioAnalysisResponse> {
    const startTime = Date.now();

    // Process the audio file
    const audioFile = request.audioFile;
    const audioInfo =
      await this.audioProcessingService.processAudioFile(audioFile);

    // Analyze tonality using Claude
    const tonalityResult = await this.anthropicService.analyzeTonality(
      audioInfo,
      request.clientId,
      request.customPrompt ? request.customPrompt : undefined,
    );

    // Create the response
    const response: AudioAnalysisResponse = {
      fileName: audioInfo.fileName,
      fileFormat: audioInfo.fileFormat,
      fileSize: audioInfo.fileSize,
      durationInSeconds: audioInfo.durationInSeconds,
      tonalityResult: tonalityResult,
      processingTimeMs: Date.now() - startTime,
    };

    return response;
  }
}
