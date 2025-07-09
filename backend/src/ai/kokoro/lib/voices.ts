import path from 'path';
import fs from 'fs/promises';

export interface VoiceInfo {
  name: string;
  language: string;
  gender: string;
  traits?: string;
  targetQuality: string;
  overallGrade: string;
}

export const VOICES: Record<string, VoiceInfo> = {
  af_heart: {
    name: 'Heart',
    language: 'en-us',
    gender: 'Female',
    traits: '❤️',
    targetQuality: 'A',
    overallGrade: 'A',
  },
  // TODO Add more voices on demand
} as const;

const VOICE_DATA_URL: string =
  'https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/voices';

async function getVoiceFile(id: keyof typeof VOICES): Promise<ArrayBufferLike> {
  if (fs?.readFile) {
    const file = path.resolve(__dirname, `voices/${id}.bin`);
    const { buffer } = await fs.readFile(file);
    return buffer;
  }

  const url = `${VOICE_DATA_URL}/${id}.bin`;

  let cache;
  try {
    cache = await caches.open('kokoro-voices');
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      return await cachedResponse.arrayBuffer();
    }
  } catch (e) {
    console.warn('Unable to open cache', e);
  }

  // No cache, or cache failed to open. Fetch the file.
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  if (cache) {
    try {
      // NOTE: We use `new Response(buffer, ...)` instead of `response.clone()` to handle LFS files
      await cache.put(
        url,
        new Response(buffer, {
          headers: response.headers,
        }),
      );
    } catch (e) {
      console.warn('Unable to cache file', e);
    }
  }

  return buffer;
}

const VOICE_CACHE: Map<string, Float32Array> = new Map();
export async function getVoiceData(voice: keyof typeof VOICES): Promise<Float32Array> {
  if (VOICE_CACHE.has(voice)) {
    return VOICE_CACHE.get(voice);
  }

  const buffer = new Float32Array(await getVoiceFile(voice));
  VOICE_CACHE.set(voice, buffer);
  return buffer;
}
