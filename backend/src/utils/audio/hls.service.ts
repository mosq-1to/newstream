import { Injectable } from '@nestjs/common';
import fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class HlsService {
  private createEmptyPlaylistFile(playlistFilePath: string): string {
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

  async createPlaylistFile(
    outputDir: string,
    wavPaths: string[],
    shouldEndFile = false,
  ): Promise<string> {
    const playlistFilePath = path.join(outputDir, 'playlist.m3u8');

    if (wavPaths.length === 0) {
      return this.createEmptyPlaylistFile(playlistFilePath);
    }

    const concatFile = path.join(outputDir, `concat.txt`);
    const concatContent = wavPaths.map((p) => `file '${path.resolve(p)}'`).join('\n');
    fs.writeFileSync(concatFile, concatContent);

    return new Promise((resolve, reject) => {
      const ffmpegCommand = ffmpeg()
        .input(path.resolve(concatFile))
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions([
          '-f hls',
          '-hls_time 4',
          '-hls_playlist_type event',
          '-hls_segment_filename',
          path.join(outputDir, `segment_%03d.ts`),
          '-hls_list_size 0',
        ]);

      const flags = '-hls_flags omit_endlist+append_list';
      ffmpegCommand.outputOptions([flags]);

      // Check if playlist already exists to determine starting segment index
      if (fs.existsSync(playlistFilePath)) {
        const content = fs.readFileSync(playlistFilePath, 'utf-8');
        const lastSegmentMatch = content.match(/segment_(\d+)\.ts/g);

        if (lastSegmentMatch && lastSegmentMatch.length > 0) {
          // Get the last segment number and start from the next one
          const lastSegment = lastSegmentMatch[lastSegmentMatch.length - 1];
          const lastIndex = parseInt(lastSegment.match(/\d+/)[0], 10);
          ffmpegCommand.outputOptions([`-start_number ${lastIndex + 1}`]);
        }
      }

      ffmpegCommand
        .output(playlistFilePath)
        .on('end', async () => {
          if (shouldEndFile) {
            await this.addEndMarkerToPlaylist(playlistFilePath);
          }

          console.log('saved new playlist.m3u8');
          resolve(playlistFilePath);
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err.message);
          reject(new Error(`FFmpeg error: ${err.message}`));
        })
        .run();
    });
  }

  private async addEndMarkerToPlaylist(playlistFilePath: string): Promise<void> {
    try {
      // Read the current playlist content
      const playlistContent = fs.readFileSync(playlistFilePath, 'utf-8');

      // Check if the end marker already exists
      if (playlistContent.includes('#EXT-X-ENDLIST')) {
        return; // End marker already exists, no need to add it again
      }

      // Append the end marker to the playlist
      fs.appendFileSync(playlistFilePath, '\n#EXT-X-ENDLIST\n');
    } catch (error) {
      console.error(`Error adding end marker to playlist: ${error.message}`);
      throw error;
    }
  }

  public getPlaylistFile = async (outputDir: string) => {
    const playlistFilePath = path.join(outputDir, 'playlist.m3u8');

    if (!fs.existsSync(playlistFilePath)) {
      return this.createEmptyPlaylistFile(playlistFilePath);
    }

    return playlistFilePath;
  };
}
