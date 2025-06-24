import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AudioAnalysisRequestService } from '../services/audioAnalysisRequest.service';
import {
  CreateAudioAnalysisRequestDto,
  UpdateAudioAnalysisRequestDto,
} from '../dtos/audioAnalysisRequest.dto';
import { AudioAnalysisRequestEntity } from '../entities/audioAnalysisRequest.entity';

@Controller('audio-analysis-requests')
export class AudioAnalysisRequestController {
  constructor(
    private readonly audioAnalysisRequestService: AudioAnalysisRequestService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('audioFile'))
  async create(
    @Body() createDto: CreateAudioAnalysisRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
          new FileTypeValidator({ fileType: '.(mp3|wav|m4a|flac)' }),
        ],
      }),
    )
    audioFile: any,
  ): Promise<AudioAnalysisRequestEntity> {
    return await this.audioAnalysisRequestService.create(createDto, audioFile);
  }

  @Get()
  async findAll(): Promise<AudioAnalysisRequestEntity[]> {
    return await this.audioAnalysisRequestService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AudioAnalysisRequestEntity> {
    return await this.audioAnalysisRequestService.findOne(+id);
  }

  @Get('client/:clientId')
  async findByClientId(
    @Param('clientId') clientId: string,
  ): Promise<AudioAnalysisRequestEntity[]> {
    return await this.audioAnalysisRequestService.findByClientId(clientId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAudioAnalysisRequestDto,
  ): Promise<AudioAnalysisRequestEntity> {
    return await this.audioAnalysisRequestService.update(+id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.audioAnalysisRequestService.remove(+id);
  }
}
