import cors from 'cors';
import { logger } from './logger';

export function configureCors(): cors.CorsOptions {
  const envOrigins = process.env.CORS_ORIGINS || process.env.ALLOWED_ORIGINS || '';
  const parsed = envOrigins
    .split(',')
    .map((o) => o.trim())
    .filter((o) => o.length > 0);

  const defaults = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ];

  if (process.env.APP_URL) {
    defaults.push(process.env.APP_URL.trim());
  }
  if (process.env.CLIENT_URL) {
    defaults.push(process.env.CLIENT_URL.trim());
  }

  const allowedOrigins = Array.from(new Set([...defaults, ...parsed]));

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.some((allowed) => {
        return allowed === origin || allowed === origin.replace(/\/$/, '');
      });

      if (isAllowed || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        logger.warn('CORS_ORIGIN_BLOCKED', { origin, allowedOrigins });
        callback(new Error(`CORS Error: Origin ${origin} not permitted by TAGAD security policy`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Request-Id',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['X-Request-Id'],
  };
}
