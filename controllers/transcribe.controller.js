import { rm, stat } from 'node:fs/promises';
import { extractAudio } from '../services/ffmpeg.services.js';
import { transcribeAudio } from '../services/groq.services.js';
import { AppError } from '../utils/AppError.js';

const GROQ_MAX_BYTES = 24 * 1024 * 1024; // free tier cap is ~25MB

export async function transcribe(req, res) {
  if (!req.file) throw new AppError('No file uploaded', 400);

  const inputPath = req.file.path;
  const audioPath = `${inputPath}.mp3`;

  try {
    await extractAudio(inputPath, audioPath);

    const { size } = await stat(audioPath);
    if (size > GROQ_MAX_BYTES) {
      throw new AppError('Recording too long for the free tier (about 90 minutes max)', 413);
    }

    const result = await transcribeAudio(audioPath);
    res.json(result);
  } finally {
    // Runs on success AND failure
    await Promise.allSettled([rm(inputPath, { force: true }), rm(audioPath, { force: true })]);
  }
}