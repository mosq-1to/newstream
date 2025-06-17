import { Injectable } from "@nestjs/common";
import { KokoroService } from "../../ai/kokoro/kokoro.service";

@Injectable()
export class AudioGenerationService {
  constructor(private readonly kokoroService: KokoroService) {}

  public async generateSpeechFromText(
    text: string,
    outputFilePath: string,
  ): Promise<void> {
    return await this.kokoroService.generateSpeech(text, outputFilePath);
  }
}
