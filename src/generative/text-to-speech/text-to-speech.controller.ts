import { Body, Controller, Post, Res } from '@nestjs/common';
import { TextToSpeechService } from './text-to-speech.service';
import { GenerateTextToSpeechDto } from './dto/generate-text-to-speech.dto';
import { Response } from 'express';

// For testing purposes
@Controller('text-to-speech')
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Post()
  generateSpeech(@Res() res: Response, @Body() dto: GenerateTextToSpeechDto) {
    return this.textToSpeechService.convertTextToSpeech(res, dto.text);
  }
}
