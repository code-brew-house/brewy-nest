import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('tonality_results')
export class TonalityResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ nullable: false })
  dominantTone: string; // e.g., "happy", "sad", "angry", "neutral"

  @Column({ nullable: false, type: 'double precision' })
  confidenceScore: number; // 0.0 to 1.0

  @Column({ nullable: false })
  toneDescription: string; // Detailed description of the tone

  @Column({ nullable: false })
  emotionalRange: string; // e.g., "high", "medium", "low"

  @Column({ nullable: true })
  musicalKey: string; // e.g., "C major", "A minor" (if applicable)

  @Column({ nullable: true })
  additionalNotes: string; // Any other observations
}
