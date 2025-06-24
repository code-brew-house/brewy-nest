import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TonalityService {
  private static readonly PROMPTS_BASE_PATH = 'prompts/';

  getTonality(clientId?: string): string {
    let path = TonalityService.PROMPTS_BASE_PATH + 'default.txt';

    if (clientId) {
      path = TonalityService.PROMPTS_BASE_PATH + clientId + '.txt';
    }

    return this.loadTonalityFromFile(path);
  }

  private loadTonalityFromFile(path: string): string {
    try {
      const filePath = join(process.cwd(), path);
      return readFileSync(filePath, 'utf8');
    } catch (error) {
      // Fallback to default if client-specific file doesn't exist
      const defaultPath = join(
        process.cwd(),
        TonalityService.PROMPTS_BASE_PATH + 'default.txt',
      );
      return readFileSync(defaultPath, 'utf8');
    }
  }
}
