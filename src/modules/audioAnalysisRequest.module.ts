import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioAnalysisRequestController } from '../controllers/audioAnalysisRequest.controller';
import { AudioAnalysisRequestService } from '../services/audioAnalysisRequest.service';
import { AudioAnalysisService } from '../services/audioAnalysis.service';
import { AudioProcessingService } from '../services/audioProcessing.service';
import { AnthropicService } from '../services/anthropic.service';
import { AudioAnalysisRequestEntity } from '../entities/audioAnalysisRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioAnalysisRequestEntity])],
  controllers: [AudioAnalysisRequestController],
  providers: [
    AudioAnalysisRequestService,
    AudioAnalysisService,
    AudioProcessingService,
    AnthropicService,
  ],
  exports: [AudioAnalysisRequestService],
})
export class AudioAnalysisRequestModule {}
