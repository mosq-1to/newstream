import * as stream from 'stream';

export abstract class SpeechGenerationStrategy {
  abstract convertTextToSpeech(text: string): Promise<stream.Readable>;
}
