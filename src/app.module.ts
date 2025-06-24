import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioAnalysisRequestModule } from './modules/audioAnalysisRequest.module';
import { AnthropicModule } from './modules/anthropic.module';
import { AuthModule } from './modules/auth.module';
import { TonalityModule } from './modules/tonality.module';
import anthropicConfig from './config/anthropic.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [anthropicConfig],
    }),
    AudioAnalysisRequestModule,
    AnthropicModule,
    AuthModule,
    TonalityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
