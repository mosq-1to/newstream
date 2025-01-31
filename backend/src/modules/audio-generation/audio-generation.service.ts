import { Injectable } from '@nestjs/common';

@Injectable()
export class AudioGenerationService {
  public generateSpeech(text: string) {
    // TODO Implement the text-to-speech generation
    return text;
  }
}
