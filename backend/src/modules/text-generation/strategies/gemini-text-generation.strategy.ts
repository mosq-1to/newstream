import { TextGenerationStrategy } from "./text-generation.strategy";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class GeminiTextGenerationStrategy implements TextGenerationStrategy {
  private readonly model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const genAI = new GoogleGenerativeAI(
      this.configService.get<string>("GOOGLE_AI_API_KEY"),
    );
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateContent(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);

    return result.response.text();
  }
}
