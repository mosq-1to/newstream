import { Controller, Header, Post, Res } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import { Response } from 'express';

@Controller('test/tts')
export class AudioGenerationController {
  constructor(
    private readonly audioGenerationService: AudioGenerationService,
  ) {}

  @Post()
  async generateSpeech(@Res() res: Response) {
    const arrayBuffer = await this.audioGenerationService.generateSpeech(
      'Hey Matt! Today is Thursday, 10th of June, 2021. You have a meeting with John at 2:30 PM. and 3 tasks due today. Would you like me to read them out for you?',
    );

    // Convert ArrayBuffer to Node.js Buffer
    const buffer = Buffer.from(arrayBuffer);

    // Set headers
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', 'attachment; filename="audio.wav"');

    // Send the buffer as the response
    res.end(buffer);
  }
}
