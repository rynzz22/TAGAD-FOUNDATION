import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'tagad_talibon_jwt_secret_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'tagad_talibon_refresh_secret_key_2026';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  officeId?: string | null;
  barangayId?: string | null;
  jti?: string;
  sessionId?: string;
}

// In-memory token revocation & session store (with expiration timestamp)
const revokedTokens = new Map<string, number>(); // token / jti -> expiresAt
const activeRefreshSessions = new Map<string, { userId: string; jti: string; expiresAt: number }>();

// Periodic cleanup of expired tokens every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, expiresAt] of revokedTokens.entries()) {
    if (expiresAt < now) {
      revokedTokens.delete(key);
    }
  }
  for (const [key, session] of activeRefreshSessions.entries()) {
    if (session.expiresAt < now) {
      activeRefreshSessions.delete(key);
    }
  }
}, 15 * 60 * 1000).unref();

export const revokeToken = (tokenOrJti: string, ttlMs = 30 * 24 * 60 * 60 * 1000): void => {
  if (!tokenOrJti) return;
  revokedTokens.set(tokenOrJti, Date.now() + ttlMs);
};

export const isTokenRevoked = (tokenOrJti: string): boolean => {
  if (!tokenOrJti) return false;
  const expiresAt = revokedTokens.get(tokenOrJti);
  if (!expiresAt) return false;
  if (expiresAt < Date.now()) {
    revokedTokens.delete(tokenOrJti);
    return false;
  }
  return true;
};

export const registerRefreshSession = (sessionId: string, userId: string, jti: string, ttlMs = 30 * 24 * 60 * 60 * 1000): void => {
  activeRefreshSessions.set(sessionId, {
    userId,
    jti,
    expiresAt: Date.now() + ttlMs,
  });
};

export const invalidateSession = (sessionId: string): void => {
  if (!sessionId) return;
  const session = activeRefreshSessions.get(sessionId);
  if (session) {
    revokeToken(session.jti);
    activeRefreshSessions.delete(sessionId);
  }
  revokeToken(sessionId);
};

export const revokeAllUserSessions = (userId: string): void => {
  for (const [sessionId, session] of activeRefreshSessions.entries()) {
    if (session.userId === userId) {
      revokeToken(session.jti);
      activeRefreshSessions.delete(sessionId);
    }
  }
  revokeToken(`user_${userId}`);
};

export const signAccessToken = (payload: TokenPayload): string => {
  const jti = payload.jti || randomUUID();
  const sessionId = payload.sessionId || randomUUID();
  return jwt.sign({ ...payload, jti, sessionId }, JWT_SECRET, { expiresIn: '8h' });
};

export const signRefreshToken = (payload: TokenPayload): string => {
  const jti = payload.jti || randomUUID();
  const sessionId = payload.sessionId || randomUUID();
  registerRefreshSession(sessionId, payload.id, jti);
  return jwt.sign({ ...payload, jti, sessionId }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  if (isTokenRevoked(token)) {
    const err: any = new Error('Token has been revoked');
    err.name = 'TokenRevokedError';
    throw err;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
  if (decoded.jti && isTokenRevoked(decoded.jti)) {
    const err: any = new Error('Token has been revoked');
    err.name = 'TokenRevokedError';
    throw err;
  }
  if (decoded.sessionId && isTokenRevoked(decoded.sessionId)) {
    const err: any = new Error('Session has been invalidated');
    err.name = 'TokenRevokedError';
    throw err;
  }
  if (decoded.id && isTokenRevoked(`user_${decoded.id}`)) {
    const err: any = new Error('All user sessions have been invalidated');
    err.name = 'TokenRevokedError';
    throw err;
  }

  return decoded;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  if (isTokenRevoked(token)) {
    const err: any = new Error('Refresh token has been revoked');
    err.name = 'TokenRevokedError';
    throw err;
  }

  const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  if (decoded.jti && isTokenRevoked(decoded.jti)) {
    const err: any = new Error('Refresh token has been revoked or already rotated');
    err.name = 'TokenRevokedError';
    throw err;
  }
  if (decoded.sessionId && isTokenRevoked(decoded.sessionId)) {
    const err: any = new Error('Session has been invalidated');
    err.name = 'TokenRevokedError';
    throw err;
  }
  if (decoded.id && isTokenRevoked(`user_${decoded.id}`)) {
    const err: any = new Error('All user sessions have been invalidated');
    err.name = 'TokenRevokedError';
    throw err;
  }

  return decoded;
};

