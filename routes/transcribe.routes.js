import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { upload } from '../middleware/upload.js';
import { transcribe } from '../controllers/transcribe.controller.js';

const router = Router();

// Keyed per user, so one person can't burn your Groq quota
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => req.user.sub,
  validate: { keyGeneratorIpFallback: false },
  message: { message: 'Hourly transcription limit reached' },
});

// Order matters: auth first, then limiter, then upload (don't save files for unauthenticated users)
router.post('/', requireAuth, limiter, upload.single('file'), asyncHandler(transcribe));

export default router;