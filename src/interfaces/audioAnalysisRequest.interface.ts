export interface AudioAnalysisRequest {
  id: number;
  audioFileName: string;
  audioFilePath: string;
  clientId: string;
  customPrompt?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
