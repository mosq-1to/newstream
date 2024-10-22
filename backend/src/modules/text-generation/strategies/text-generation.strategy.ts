export abstract class TextGenerationStrategy {
  abstract generateContent(prompt: string): Promise<string>;
}
