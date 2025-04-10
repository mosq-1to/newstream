declare module 'kokoro-js' {
  export interface KokoroTTS {
    generate(
      text: string,
      {
        voice,
        speed,
      }?: {
        voice?: 'af_heart';
        speed?: number;
      },
    ): Promise<{
      toWav: () => Promise<ArrayBuffer>;
      toBlob: () => Promise<Blob>;
      save: (path: string) => Promise<void>;
    }>;
    stream: (splitter: TextSplitterStreamInstance) => AsyncGenerator<{
      text: string;
      phonemes: string[];
      audio: {
        toWav: () => Promise<ArrayBuffer>;
        toBlob: () => Promise<Blob>;
        save: (path: string) => Promise<void>;
      };
    }>;
  }

  export interface TextSplitterStreamInstance {
    push: (text: string) => void;
    close: () => void;
  }

  export interface TextSplitterStream {
    new (): TextSplitterStreamInstance;
  }

  export const KokoroTTS: {
    from_pretrained: (
      model: string,
      options: { dtype: string; device: string },
    ) => Promise<KokoroTTS>;
  };

  export const TextSplitterStream: TextSplitterStream;
}
