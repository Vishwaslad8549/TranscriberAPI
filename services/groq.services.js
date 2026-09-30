import { readFile } from 'node:fs/promises';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export async function transcribeAudio(filePath) {
  const buffer = await readFile(filePath);

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: 'audio/mpeg' }), 'audio.mp3');
  form.append('model', 'whisper-large-v3-turbo');
  form.append('response_format', 'verbose_json');
  form.append('timestamp_granularities[]', 'segment');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.groqApiKey}` },
    body: form,
  });

  if (!res.ok) {
    console.error('Groq error:', res.status, await res.text());
    if (res.status === 429) throw new AppError('Transcription limit reached, try again later', 429);
    throw new AppError('Transcription service failed', 502);
  }

  const data = await res.json();
  return {
    text: data.text,
    language: data.language,
    duration: data.duration,
    segments: data.segments.map((s) => ({
      start: s.start,
      end: s.end,
      text: s.text.trim(),
    })),
  };
}