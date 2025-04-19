import {
  StyleTextToSpeech2Model,
  AutoTokenizer,
  Tensor,
  RawAudio,
} from '@huggingface/transformers';
import { phonemize } from './phonemize';
import { TextSplitterStream } from './splitter';
import { getVoiceData, VOICES } from './voices';

const STYLE_DIM = 256;
const SAMPLE_RATE = 24000;

export interface GenerateOptions {
  /** The voice */
  voice?: keyof typeof VOICES;
  /** The speaking speed */
  speed?: number;
}

export interface StreamProperties {
  /** The pattern to split the input text. If unset, the default sentence splitter will be used. */
  split_pattern?: RegExp;
}

export type StreamGenerateOptions = GenerateOptions & StreamProperties;

export class KokoroTTS {
  constructor(
    public model: StyleTextToSpeech2Model,
    public tokenizer: import('@huggingface/transformers').PreTrainedTokenizer,
  ) {}

  static async from_pretrained(
    model_id: string,
    {
      dtype = 'fp32',
      device = null,
      progress_callback = null,
    }: {
      dtype?: 'fp32' | 'fp16' | 'q8' | 'q4' | 'q4f16';
      device?: 'wasm' | 'webgpu' | 'cpu' | null;
      progress_callback?: import('@huggingface/transformers').ProgressCallback;
    } = {},
  ): Promise<KokoroTTS> {
    const model = StyleTextToSpeech2Model.from_pretrained(model_id, {
      progress_callback,
      dtype,
      device,
    });
    const tokenizer = AutoTokenizer.from_pretrained(model_id, {
      progress_callback,
    });

    const info = await Promise.all([model, tokenizer]);
    return new KokoroTTS(...info);
  }

  get voices(): Readonly<typeof VOICES> {
    return VOICES;
  }

  list_voices() {
    console.table(VOICES);
  }

  private _validate_voice(voice: string): 'a' | 'b' {
    if (!VOICES.hasOwnProperty(voice)) {
      console.error(`Voice "${voice}" not found. Available voices:`);
      console.table(VOICES);
      throw new Error(
        `Voice "${voice}" not found. Should be one of: ${Object.keys(VOICES).join(', ')}.`,
      );
    }
    const language = voice.at(0) as 'a' | 'b'; // "a" or "b"
    return language;
  }

  async generate(
    text: string,
    { voice = 'af_heart', speed = 1 }: GenerateOptions = {},
  ): Promise<RawAudio> {
    const language = this._validate_voice(voice);

    const phonemes = await phonemize(text, language);
    const { input_ids } = this.tokenizer(phonemes, {
      truncation: true,
    });

    return this.generate_from_ids(input_ids, { voice, speed });
  }

  async generate_from_ids(
    input_ids: Tensor,
    { voice = 'af_heart', speed = 1 }: GenerateOptions = {},
  ): Promise<RawAudio> {
    // Select voice style based on number of input tokens
    const num_tokens = Math.min(Math.max(input_ids.dims.at(-1) - 2, 0), 509);

    // Load voice style
    const data = await getVoiceData(voice);
    const offset = num_tokens * STYLE_DIM;
    const voiceData = data.slice(offset, offset + STYLE_DIM);

    // Prepare model inputs
    const inputs = {
      input_ids,
      style: new Tensor('float32', voiceData, [1, STYLE_DIM]),
      speed: new Tensor('float32', [speed], [1]),
    };

    // Generate audio
    const { waveform } = await this.model(inputs);
    return new RawAudio(waveform.data, SAMPLE_RATE);
  }

  async *stream(
    text: string | TextSplitterStream,
    {
      voice = 'af_heart',
      speed = 1,
      split_pattern = null,
    }: StreamGenerateOptions = {},
  ): AsyncGenerator<
    { text: string; phonemes: string; audio: RawAudio },
    void,
    void
  > {
    const language = this._validate_voice(voice);

    let splitter: TextSplitterStream;
    if (text instanceof TextSplitterStream) {
      splitter = text;
    } else if (typeof text === 'string') {
      splitter = new TextSplitterStream();
      const chunks = split_pattern
        ? text
            .split(split_pattern)
            .map((chunk) => chunk.trim())
            .filter((chunk) => chunk.length > 0)
        : [text];
      splitter.push(...chunks);
    } else {
      throw new Error(
        'Invalid input type. Expected string or TextSplitterStream.',
      );
    }
    for await (const sentence of splitter) {
      const phonemes = await phonemize(sentence, language);
      const { input_ids } = this.tokenizer(phonemes, {
        truncation: true,
      });

      // TODO: There may be some cases where - even with splitting - the text is too long.
      // In that case, we should split the text into smaller chunks and process them separately.
      // For now, we just truncate these exceptionally long chunks
      const audio = await this.generate_from_ids(input_ids, { voice, speed });
      yield { text: sentence, phonemes, audio };
    }
  }
}

export { TextSplitterStream };
