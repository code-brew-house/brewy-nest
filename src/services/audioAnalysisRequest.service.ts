import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioAnalysisRequestEntity } from '../entities/audioAnalysisRequest.entity';
import {
  CreateAudioAnalysisRequestDto,
  UpdateAudioAnalysisRequestDto,
} from '../dtos/audioAnalysisRequest.dto';
import { AudioAnalysisService } from './audioAnalysis.service';

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
export class AudioAnalysisRequestService {
  constructor(
    @InjectRepository(AudioAnalysisRequestEntity)
    private audioAnalysisRequestRepository: Repository<AudioAnalysisRequestEntity>,
    private audioAnalysisService: AudioAnalysisService,
  ) {}

  async create(
    createDto: CreateAudioAnalysisRequestDto,
    audioFile: UploadedFile,
  ): Promise<AudioAnalysisRequestEntity> {
    // Create the analysis request entity
    const analysisRequest = this.audioAnalysisRequestRepository.create({
      ...createDto,
      status: 'pending',
      audioFileName: audioFile.originalname,
      audioFilePath: audioFile.path || '',
    });

    // Save the request first
    const savedRequest =
      await this.audioAnalysisRequestRepository.save(analysisRequest);

    try {
      // Process the audio analysis
      await this.audioAnalysisService.analyzeAudio({
        audioFile,
        clientId: createDto.clientId,
        customPrompt: createDto.customPrompt,
      });

      // Update the request with results
      savedRequest.status = 'completed';

      return await this.audioAnalysisRequestRepository.save(savedRequest);
    } catch (error) {
      // Update status to failed
      savedRequest.status = 'failed';
      await this.audioAnalysisRequestRepository.save(savedRequest);
      throw error;
    }
  }

  async findAll(): Promise<AudioAnalysisRequestEntity[]> {
    return await this.audioAnalysisRequestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AudioAnalysisRequestEntity> {
    const request = await this.audioAnalysisRequestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(
        `Audio analysis request with ID ${id} not found`,
      );
    }

    return request;
  }

  async findByClientId(
    clientId: string,
  ): Promise<AudioAnalysisRequestEntity[]> {
    return await this.audioAnalysisRequestRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: number,
    updateDto: UpdateAudioAnalysisRequestDto,
  ): Promise<AudioAnalysisRequestEntity> {
    const request = await this.findOne(id);

    Object.assign(request, updateDto);
    return await this.audioAnalysisRequestRepository.save(request);
  }

  async remove(id: number): Promise<void> {
    const request = await this.findOne(id);
    await this.audioAnalysisRequestRepository.remove(request);
  }
}
