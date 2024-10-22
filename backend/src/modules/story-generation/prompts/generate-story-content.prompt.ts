// Define Prompt class to inherit from
export class GenerateStoryContentPrompt {
  input: string;
  constructor(prompt: string) {
    this.input = `
        ### Instructions
          Your task is to take the provided article content and generate a new article content that will:
          * Contain all of the most important data from the original article
          * Have no repetitions
          * Inform straight-forward about what happened
          * be written in reporting - tone similar to what is heard in the radio news auditions.
          * Be between 100 and 200 words long
          * Be written in the past tense
          
         ### Prompt
          ${prompt}
        `;
  }
}
