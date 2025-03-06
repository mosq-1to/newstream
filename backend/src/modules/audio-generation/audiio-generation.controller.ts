import { Controller, Post, Res } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import { Response } from 'express';
import { createReadStream, unlink, promises } from 'fs';
import ffmpeg from 'fluent-ffmpeg';

@Controller('test/tts')
export class AudioGenerationController {
  constructor(
    private readonly audioGenerationService: AudioGenerationService,
  ) {}

  @Post()
  async generateSpeech(@Res() res: Response) {
    const filePaths = await this.audioGenerationService.generateSpeech(
      'The sky above the port was the color of television, tuned to a dead channel.\n' +
        '"It\'s not like I\'m using," Case heard someone say, as he shouldered his way through the crowd around the door of the Chat. "It\'s like my body\'s developed this massive drug deficiency."\n' +
        'It was a Sprawl voice and a Sprawl joke. The Chatsubo was a bar for professional expatriates; you could drink there for a week and never hear two words in Japanese.\n' +
        '\n' +
        'These were to have an enormous impact, not only because they were associated with Constantine, but also because, as in so many other areas, the decisions taken by Constantine (or in his name) were to have great significance for centuries to come. One of the main issues was the shape that Christian churches were to take, since there was not, apparently, a tradition of monumental church buildings when Constantine decided to help the Christian church build a series of truly spectacular structures. The main form that these churches took was that of the basilica, a multipurpose rectangular structure, based ultimately on the earlier Greek stoa, which could be found in most of the great cities of the empire. Christianity, unlike classical polytheism, needed a large interior space for the celebration of its religious services, and the basilica aptly filled that need. We naturally do not know the degree to which the emperor was involved in the design of new churches, but it is tempting to connect this with the secular basilica that Constantine completed in the Roman forum (the so-called Basilica of Maxentius) and the one he probably built in Trier, in connection with his residence in the city at a time when he was still caesar.',
    );

    // Create a temporary file for the merged output
    const outputFilePath = `merged_${Date.now()}.wav`;

    // Create a temporary concat file
    const concatFilePath = `concat_${Date.now()}.txt`;

    // Create the concat file content
    const concatFileContent = filePaths
      .map((file) => `file '${file}'`)
      .join('\n');

    // Write the concat file
    await promises.writeFile(concatFilePath, concatFileContent);

    // Concatenate WAV files using FFmpeg's concat demuxer
    ffmpeg()
      .input(concatFilePath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .audioCodec('pcm_s16le')
      .format('wav')
      .on('start', (commandLine) => {
        console.log('FFmpeg command:', commandLine);
      })
      .on('end', () => {
        console.log('Concatenation finished');

        // Stream the merged file
        const readStream = createReadStream(outputFilePath);
        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Content-Disposition', 'inline; filename="merged.wav"');
        readStream.pipe(res);

        // Delete temp files after streaming
        readStream.on('close', () => {
          unlink(outputFilePath, () => {});
          unlink(concatFilePath, () => {});
          // Optionally clean up input files if they were temporary
          filePaths.forEach((filePath) => {
            unlink(filePath, () => {});
          });
        });
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        unlink(concatFilePath, () => {});
        res.status(500).send('Error processing audio');
      })
      .output(outputFilePath)
      .run();
  }
}
