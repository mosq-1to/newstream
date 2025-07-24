export abstract class TextGenerationStrategy {
  abstract generateContent(prompt: string, modelAdvancement?: ModelAdvancement): Promise<string>;
}
