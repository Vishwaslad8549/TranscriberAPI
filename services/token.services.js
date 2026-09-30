import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export function signSession({ sub, email }) {
  return jwt.sign({ sub, email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError('Session expired or invalid', 401);
  }
}