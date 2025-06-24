import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AudioAnalysisController } from '../controllers/audioAnalysis.controller';
import { AudioAnalysisRequestService } from '../services/audioAnalysisRequest.service';
import { AudioAnalysisService } from '../services/audioAnalysis.service';
import { AudioProcessingService } from '../services/audioProcessing.service';
import { AnthropicService } from '../services/anthropic.service';
import { AudioAnalysisRequestEntity } from '../entities/audioAnalysisRequest.entity';
import { TonalityResult } from '../entities/tonalityResult.entity';
import { UserEntity } from '../entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AudioAnalysisRequestEntity,
      TonalityResult,
      UserEntity,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AudioAnalysisController],
  providers: [
    AudioAnalysisRequestService,
    AudioAnalysisService,
    AudioProcessingService,
    AnthropicService,
    JwtAuthGuard,
  ],
  exports: [AudioAnalysisRequestService],
})
export class AudioAnalysisRequestModule {}
