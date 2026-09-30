import { verifyGoogleToken } from '../services/google.services.js';
import { signSession } from '../services/token.services.js';
import { AppError } from '../utils/AppError.js';

export async function googleLogin(req, res) {
  const { idToken } = req.body;
  if (!idToken || typeof idToken !== 'string') {
    throw new AppError('Missing idToken', 400);
  }

  const profile = await verifyGoogleToken(idToken);
  const token = signSession(profile);

  res.json({
    token,
    user: { name: profile.name, email: profile.email, picture: profile.picture },
  });
}

// Handy for the Angular guard to check a session is still valid
export function me(req, res) {
  res.json({ user: req.user });
}