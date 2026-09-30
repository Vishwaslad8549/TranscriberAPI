import multer from 'multer';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/AppError.js';

const ALLOWED_EXT = ['.mp3', '.mp4'];
const ALLOWED_MIME = ['audio/mpeg', 'audio/mp3', 'video/mp4'];

export const MAX_UPLOAD_MB = 200;

export const upload = multer({
  storage: multer.diskStorage({
    destination: os.tmpdir(),
    // Never use the user's filename on disk
    filename: (req, file, cb) => {
      const filename = `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXT.includes(ext) || !ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new AppError('Only MP3 and MP4 files are allowed', 400));
    }
    cb(null, true);
  },
});