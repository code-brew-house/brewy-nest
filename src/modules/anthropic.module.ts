import { Module } from '@nestjs/common';
import { AnthropicService } from '../services/anthropic.service';

@Module({
  providers: [AnthropicService],
  exports: [AnthropicService],
})
export class AnthropicModule {}
