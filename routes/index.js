import { Router } from 'express';
import authRoutes from './auth.routes.js';
import transcribeRoutes from './transcribe.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  const timestamp = new Date().toISOString();
  const userAgent = req.get('User-Agent') || 'Unknown';
  console.log(`🏥 Health check at ${timestamp} from: ${userAgent}`);
  res.json({
    status: 'ok',
    timestamp,
    uptime: process.uptime()
  });
});
router.use('/auth', authRoutes);
router.use('/transcribe', transcribeRoutes);
// Later: router.use('/api/transcribe', transcribeRoutes);

export default router;