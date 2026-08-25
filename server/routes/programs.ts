import { Router } from 'express';
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/admin/programController';
import { requireAuth, requireRole, requireOfficeScope } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);
router.get('/', getPrograms);
router.get('/:id', getProgramById);
router.post('/', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), createProgram);
router.put('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), updateProgram);
router.delete('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), deleteProgram);

export default router;
