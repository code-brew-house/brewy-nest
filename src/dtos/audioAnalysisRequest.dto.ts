import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateAudioAnalysisRequestDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsOptional()
  customPrompt?: string;
}

export class UpdateAudioAnalysisRequestDto {
  @IsString()
  @IsOptional()
  customPrompt?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
