import { verifySession } from '../services/token.services.js';
import { AppError } from '../utils/AppError.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError('Not authenticated', 401);

  req.user = verifySession(token);
  next();
}