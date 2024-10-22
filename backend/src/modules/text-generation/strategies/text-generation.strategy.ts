export abstract class TextGenerationStrategy {
  abstract prompt(query: string): Promise<string>;
}
