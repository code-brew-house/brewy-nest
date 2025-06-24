import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Request,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AudioAnalysisService } from '../services/audioAnalysis.service';
import { TonalityResult } from '../entities/tonalityResult.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Controller('audio')
@UseGuards(JwtAuthGuard)
export class AudioAnalysisController {
  constructor(
    private readonly audioAnalysisService: AudioAnalysisService,
    @InjectRepository(TonalityResult)
    private readonly tonalityResultRepository: Repository<TonalityResult>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeAudio(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
          new FileTypeValidator({ fileType: '.(mp3|wav|m4a|flac)' }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    audioFile: Express.Multer.File,
    @Body('clientId') clientId: string,
    @Body('customPrompt') customPrompt?: string,
    @Request() req?: any,
  ) {
    if (!clientId) {
      throw new HttpException('clientId is required', HttpStatus.BAD_REQUEST);
    }

    // Get current user from JWT token and fetch full user entity
    const jwtPayload = req.user;
    const currentUser = await this.userRepository.findOne({
      where: { id: jwtPayload.sub },
    });

    if (!currentUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Create request object matching Java structure
    const request = {
      audioFile,
      clientId,
      customPrompt,
    };

    // Process the request
    const response = await this.audioAnalysisService.analyzeAudio(request);

    // Save tonality result if available
    if (response.tonalityResult) {
      const tonalityResultEntity = new TonalityResult();
      tonalityResultEntity.user = currentUser;
      tonalityResultEntity.dominantTone = response.tonalityResult.dominantTone;
      tonalityResultEntity.confidenceScore =
        response.tonalityResult.confidenceScore;
      tonalityResultEntity.toneDescription =
        response.tonalityResult.toneDescription;
      tonalityResultEntity.emotionalRange =
        response.tonalityResult.emotionalRange;
      tonalityResultEntity.musicalKey = response.tonalityResult.musicalKey;
      tonalityResultEntity.additionalNotes =
        response.tonalityResult.additionalNotes;

      await this.tonalityResultRepository.save(tonalityResultEntity);
    }

    return response;
  }
}
