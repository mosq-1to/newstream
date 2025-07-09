import { Injectable } from '@nestjs/common';
import fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class HlsService {
  public async getPlaylistFile(outputDir: string): Promise<string> {
    const playlistFilePath = path.join(outputDir, 'playlist.m3u8');

    return fs.existsSync(playlistFilePath)
      ? playlistFilePath
      : this.initializeHlsDirectory(outputDir);
  }

  public async appendPlaylistFile(
    outputDir: string,
    wavPath: string,
    chunkIndex: number,
  ): Promise<void> {
    try {
      const tsFilename = `${path.basename(wavPath, '.wav')}.ts`;
      const tsPath = path.join(outputDir, tsFilename);

      await this.convertWavToTs(wavPath, tsPath);
      const duration = await this.getDuration(tsPath);
      this.appendToPlaylist(outputDir, duration, path.basename(tsPath), chunkIndex === 0);
    } catch (error) {
      console.error('Error processing wav:', error);
      throw error;
    }
  }

  public closePlaylistFile(outputDir: string): void {
    const playlistPath = path.join(outputDir, 'playlist.m3u8');
    fs.appendFileSync(playlistPath, '#EXT-X-ENDLIST\n');
  }

  private initializeHlsDirectory(outputDir: string): string {
    const playlistFilePath = path.join(outputDir, 'playlist.m3u8');
    const initialContent = [
      '#EXTM3U',
      '#EXT-X-VERSION:3',
      '#EXT-X-PLAYLIST-TYPE:EVENT',
      '#EXT-X-TARGETDURATION:4',
      '#EXT-X-MEDIA-SEQUENCE:0',
    ].join('\n');

    fs.writeFileSync(playlistFilePath, initialContent);
    return playlistFilePath;
  }

  private appendToPlaylist(
    outputDir: string,
    duration: number,
    tsFilename: string,
    isFirstChunk: boolean,
  ): void {
    const playlistPath = path.join(outputDir, 'playlist.m3u8');
    const line = [
      '',
      !isFirstChunk ? '#EXT-X-DISCONTINUITY' : '',
      `#EXTINF:${duration.toFixed(3)},`,
      tsFilename,
      '',
    ].join('\n');
    fs.appendFileSync(playlistPath, line);
  }

  private convertWavToTs(wavPath: string, tsPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(wavPath)
        .audioCodec('aac')
        .audioBitrate('128k')
        .format('mpegts')
        .outputOptions('-f mpegts')
        .save(tsPath)
        .on('end', () => resolve())
        .on('error', reject);
    });
  }

  private getDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration);
      });
    });
  }
}
