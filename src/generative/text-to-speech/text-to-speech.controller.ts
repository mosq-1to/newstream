import { Body, Controller, Post } from '@nestjs/common';
import { TextToSpeechService } from './text-to-speech.service';
import { GenerateTextToSpeechDto } from './dto/generate-text-to-speech.dto';

@Controller('text-to-speech')
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Post()
  generateSpeech(@Body() dto: GenerateTextToSpeechDto) {
    return this.textToSpeechService.generateSpeech(dto.text);
  }
}
