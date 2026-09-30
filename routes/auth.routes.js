import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { googleLogin, me } from '../controllers/auth.controller.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: { message: 'Too many login attempts, try again later' },
});

router.post('/google', loginLimiter, asyncHandler(googleLogin));
router.get('/me', requireAuth, me);

export default router;