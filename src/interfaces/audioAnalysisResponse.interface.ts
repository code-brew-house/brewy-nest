import { TonalityResult } from './tonalityResult.interface';

export interface AudioAnalysisResponse {
  fileName: string;
  fileFormat: string;
  fileSize: number;
  durationInSeconds: number;
  tonalityResult: TonalityResult;
  processingTimeMs: number;
}
