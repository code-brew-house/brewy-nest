import { Module } from '@nestjs/common';
import { TonalityService } from '../services/tonality.service';

@Module({
  providers: [TonalityService],
  exports: [TonalityService],
})
export class TonalityModule {}
