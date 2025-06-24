import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioAnalysisRequestModule } from './modules/audioAnalysisRequest.module';
import { AnthropicModule } from './modules/anthropic.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [AudioAnalysisRequestModule, AnthropicModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
