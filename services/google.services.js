import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const client = new OAuth2Client(env.googleClientId);

export async function verifyGoogleToken(idToken) {
  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });
    payload = ticket.getPayload();
  } catch (err) {
    console.error('Google verify failed:', err.message);
    throw new AppError('Invalid Google token', 401);
  }

  if (!payload.email_verified) throw new AppError('Email not verified', 401);

  const { sub, email, name, picture } = payload;
  return { sub, email, name, picture };
}