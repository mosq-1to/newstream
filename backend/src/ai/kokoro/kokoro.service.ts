import { Injectable, OnModuleInit } from "@nestjs/common";
import { KokoroTTS } from "./lib/kokoro";

@Injectable()
export class KokoroService implements OnModuleInit {
  private kokoro: KokoroTTS;
  constructor() {}

  async onModuleInit() {
    try {
      this.kokoro = await KokoroTTS.from_pretrained(
        "onnx-community/Kokoro-82M-v1.0-ONNX",
        {
          dtype: "fp32",
          device: "cpu",
        },
      );
    } catch (error) {
      console.error("Error initializing Kokoro", error);
    }
  }

  public async generateSpeech(text: string, outputFilePath: string) {
    const audio = await this.kokoro.generate(text);
    await audio.save(outputFilePath);
  }
}
