import { Injectable } from '@nestjs/common';
import { unlink, promises } from 'node:fs';
import ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class AudioProcessingService {
  async mergeWavFiles(filePaths: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create a temporary file for the merged output
      const outputFilePath = `merged_${Date.now()}.wav`;

      // Create a temporary concat file
      const concatFilePath = `concat_${Date.now()}.txt`;

      // Create the concat file content
      const concatFileContent = filePaths
        .map((file) => `file '${file}'`)
        .join('\n');

      // Write the concat file
      promises
        .writeFile(concatFilePath, concatFileContent)
        .then(() => {
          // Concatenate WAV files using FFmpeg's concat demuxer
          return ffmpeg()
            .input(concatFilePath)
            .inputOptions(['-f', 'concat', '-safe', '0'])
            .audioCodec('pcm_s16le')
            .format('wav')
            .on('end', () => {
              // Clean up concat file
              unlink(concatFilePath, () => {});
              resolve(outputFilePath);
            })
            .on('error', (err) => {
              unlink(concatFilePath, () => {});
              reject(err);
            })
            .output(outputFilePath)
            .run();
        })
        .catch(reject);
    });
  }

  async cleanupFiles(filePaths: string[]): Promise<void> {
    const cleanupPromises = filePaths.map(
      (filePath) =>
        new Promise<void>((resolve) => {
          unlink(filePath, () => resolve());
        }),
    );
    await Promise.all(cleanupPromises);
  }
}
