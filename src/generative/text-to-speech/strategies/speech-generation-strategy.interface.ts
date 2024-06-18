import { Readable } from 'stream';

export abstract class SpeechGenerationStrategy {
  abstract convertTextToSpeech(text: string): Promise<Readable>;
}
