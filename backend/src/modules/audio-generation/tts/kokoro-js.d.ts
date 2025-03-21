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
    stream: (splitter: ITextSplitterStreamInstance) => AsyncGenerator<{
      text: string;
      phonemes: string[];
      audio: {
        toWav: () => Promise<ArrayBuffer>;
        toBlob: () => Promise<Blob>;
        save: (path: string) => Promise<void>;
      };
    }>;
  }

  export interface ITextSplitterStreamInstance {
    push: (text: string) => void;
    close: () => void;
  }

  export interface ITextSplitterStream {
    new (): ITextSplitterStreamInstance;
  }

  export const KokoroTTS: {
    from_pretrained: (
      model: string,
      options: { dtype: string; device: string },
    ) => Promise<KokoroTTS>;
  };

  export const TextSplitterStream: ITextSplitterStream;
}
