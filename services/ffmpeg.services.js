import { spawn } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import { AppError } from '../utils/AppError.js';

// Strips video, converts to mono 16kHz 32kbps MP3. Whisper doesn't need more,
// and a 1-hour recording becomes ~14MB.
export function extractAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const args = ['-y', '-i', inputPath, '-vn', '-ac', '1', '-ar', '16000', '-b:a', '32k', outputPath];
    const proc = spawn(ffmpegPath, args);

    let stderr = '';
    proc.stderr.on('data', (d) => (stderr += d));
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) return resolve();
      console.error('ffmpeg failed:', stderr.slice(-500));
      reject(new AppError('Could not read this file. Is it a valid audio/video file?', 422));
    });
  });
}