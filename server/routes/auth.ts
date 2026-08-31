import { Router } from 'express';
import { login, refreshToken, getMe, logout } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { loginSchema, refreshTokenSchema } from '../validation/schemas';

const router = Router();

router.post('/login', loginRateLimiter, validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refreshToken);
router.get('/me', requireAuth, getMe);
router.post('/logout', requireAuth, logout);

export default router;
