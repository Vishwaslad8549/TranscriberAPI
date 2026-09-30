import { Router } from 'express';
import authRoutes from './auth.routes.js';
import transcribeRoutes from './transcribe.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/transcribe', transcribeRoutes);
// Later: router.use('/api/transcribe', transcribeRoutes);

export default router;