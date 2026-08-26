import { Router } from 'express';
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/admin/programController';
import { requireAuth, requireRole, requireOfficeScope } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { uuidParamSchema } from '../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);
router.get('/', getPrograms);
router.get('/:id', validate(uuidParamSchema, 'params'), getProgramById);
router.post('/', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), createProgram);
router.put('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), validate(uuidParamSchema, 'params'), updateProgram);
router.delete('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), validate(uuidParamSchema, 'params'), deleteProgram);

export default router;
