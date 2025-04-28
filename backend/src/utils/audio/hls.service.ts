import { Injectable } from '@nestjs/common';
import fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class HlsService {
  public getPlaylistFile = async (outputDir: string) => {
    const playlistFilePath = path.join(outputDir, 'playlist.m3u8');

    if (!fs.existsSync(playlistFilePath)) {
      return this.initializeHlsDirectory(outputDir);
    }

    return playlistFilePath;
  };

  private async appendToPlaylist(outputDir, duration, tsFilename) {
    const playlistPath = path.join(outputDir, 'playlist.m3u8');
    const line = `\n#EXTINF:${duration.toFixed(3)},\n${tsFilename}\n`;
    fs.appendFileSync(playlistPath, line);
  }

  public async appendPlaylistFile(outputDir, wavPath) {
    try {
      const tsPath = path.join(outputDir, `${path.basename(wavPath, '.wav')}.ts`);
      await this.convertWavToTs(wavPath, tsPath);
      const duration = await this.getDuration(tsPath);
      await this.appendToPlaylist(outputDir, duration, path.basename(tsPath));
    } catch (error) {
      console.error('Error processing wav:', error);
      throw error;
    }
  }

  public closePlaylistFile(outputDir: string) {
    const playlistPath = path.join(outputDir, 'playlist.m3u8');
    fs.appendFileSync(playlistPath, '#EXT-X-ENDLIST\n');
  }

  private initializeHlsDirectory(outputDir: string): string {
    const playlistFilePath = path.join(outputDir, 'playlist.m3u8');

    const initialContent = [
      '#EXTM3U',
      '#EXT-X-VERSION:3',
      '#EXT-X-PLAYLIST-TYPE:EVENT', // Signals this is a live event
      '#EXT-X-TARGETDURATION:4', // Must match your segment duration
      '#EXT-X-MEDIA-SEQUENCE:0',
    ].join('\n');

    fs.writeFileSync(playlistFilePath, initialContent);
    return playlistFilePath;
  }

  private convertWavToTs(wavPath, tsPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(wavPath)
        .audioCodec('aac')
        .audioBitrate('128k')
        .format('mpegts')
        .outputOptions('-f mpegts')
        .save(tsPath)
        .on('end', resolve)
        .on('error', reject);
    });
  }

  private getDuration(filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        const duration = metadata.format.duration;
        resolve(duration);
      });
    });
  }
}
