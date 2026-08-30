import { Router } from 'express';
import {
  getAccomplishments,
  createAccomplishment,
  updateAccomplishment,
  deleteAccomplishment,
} from '../controllers/admin/accomplishmentController';
import { requireAuth, requireRole, requireOfficeScope } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { uuidParamSchema } from '../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);
router.get('/', getAccomplishments);
router.post('/', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), createAccomplishment);
router.put('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), validate(uuidParamSchema, 'params'), updateAccomplishment);
router.delete('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), validate(uuidParamSchema, 'params'), deleteAccomplishment);

export default router;
