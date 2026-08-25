import { Router } from 'express';
import {
  getAccomplishments,
  createAccomplishment,
  updateAccomplishment,
  deleteAccomplishment,
} from '../controllers/admin/accomplishmentController';
import { requireAuth, requireRole, requireOfficeScope } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);
router.get('/', getAccomplishments);
router.post('/', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), createAccomplishment);
router.put('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), updateAccomplishment);
router.delete('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), deleteAccomplishment);

export default router;
