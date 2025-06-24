import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export interface AudioInfo {
  fileName: string;
  fileFormat: string;
  fileSize: number;
  durationInSeconds: number;
  base64Content: string;
}

export class AudioProcessingException extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'AudioProcessingException';
  }
}

@Injectable()
export class AudioProcessingService {
  private readonly SUPPORTED_FORMATS = [
    'mp3',
    'wav',
    'ogg',
    'flac',
    'aac',
    'm4a',
  ];

  /**
   * Process an audio file, extract information and convert it to base64
   *
   * @param audioFile The uploaded audio file
   * @returns Information about the processed audio and its base64 encoding
   */
  async processAudioFile(audioFile: UploadedFile): Promise<AudioInfo> {
    // Validate the file
    this.validateAudioFile(audioFile);

    try {
      // Get temp directory from config or use default
      const tempDir = process.env.TEMP_DIR || './temp';

      // Create temp directory if it doesn't exist
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Save the file to a temp location
      const originalFilename = audioFile.originalname;
      const fileExtension = path
        .extname(originalFilename)
        .toLowerCase()
        .substring(1);
      const tempFilename = `${uuidv4()}.${fileExtension}`;
      const tempFilePath = path.join(tempDir, tempFilename);

      // Write buffer to temp file
      fs.writeFileSync(tempFilePath, audioFile.buffer);

      // Extract audio information (placeholder - implement actual audio analysis)
      const durationInSeconds = await this.extractAudioDuration(tempFilePath);

      // Convert to base64
      const fileContent = fs.readFileSync(tempFilePath);
      const base64Content = fileContent.toString('base64');

      // Create result
      const audioInfo: AudioInfo = {
        fileName: originalFilename,
        fileFormat: fileExtension,
        fileSize: audioFile.size,
        durationInSeconds: durationInSeconds,
        base64Content: base64Content,
      };

      // Clean up
      fs.unlinkSync(tempFilePath);

      return audioInfo;
    } catch (error) {
      if (error instanceof AudioProcessingException) {
        throw error;
      }
      throw new AudioProcessingException(
        `Failed to process audio file: ${error.message}`,
        error,
      );
    }
  }

  /**
   * Validates that the uploaded file is acceptable
   */
  private validateAudioFile(file: UploadedFile): void {
    if (!file || file.size === 0) {
      throw new AudioProcessingException('Audio file is empty or not provided');
    }

    const filename = file.originalname;
    if (!filename || filename.trim() === '') {
      throw new AudioProcessingException('Audio filename is blank');
    }

    const extension = path.extname(filename).toLowerCase().substring(1);
    if (!this.SUPPORTED_FORMATS.includes(extension)) {
      throw new AudioProcessingException(
        `Unsupported file format: ${extension}. Supported formats are: ${this.SUPPORTED_FORMATS.join(', ')}`,
      );
    }
  }

  /**
   * Extract audio duration from file (placeholder implementation)
   * TODO: Implement actual audio duration extraction using a library like ffmpeg
   */
  private async extractAudioDuration(filePath: string): Promise<number> {
    // Placeholder implementation - replace with actual audio analysis
    // You can use libraries like:
    // - ffmpeg-static + fluent-ffmpeg
    // - music-metadata
    // - audio-duration

    try {
      // For now, return a placeholder duration
      // In a real implementation, you would analyze the actual audio file
      console.log(`Extracting duration from: ${filePath}`);
      return 0; // TODO: Implement actual duration extraction
    } catch (error) {
      throw new AudioProcessingException(
        `Error analyzing audio file: ${error.message}`,
        error,
      );
    }
  }
}
