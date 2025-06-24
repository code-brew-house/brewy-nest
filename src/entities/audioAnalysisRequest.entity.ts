import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AudioAnalysisRequest } from '../interfaces/audioAnalysisRequest.interface';

@Entity('audio_analysis_requests')
export class AudioAnalysisRequestEntity implements AudioAnalysisRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  audioFileName: string;

  @Column({ nullable: false })
  audioFilePath: string;

  @Column({ nullable: false })
  clientId: string;

  @Column({ type: 'text', nullable: true })
  customPrompt: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
