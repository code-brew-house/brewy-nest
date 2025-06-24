import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioAnalysisRequestModule } from './modules/audioAnalysisRequest.module';
import { AnthropicModule } from './modules/anthropic.module';

@Module({
  imports: [AudioAnalysisRequestModule, AnthropicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
