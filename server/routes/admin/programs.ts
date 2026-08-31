import { Router } from 'express';
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../../controllers/admin/programController';
import { requireRole, requireOfficeScope } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import {
  createProgramSchema,
  updateProgramSchema,
  paginationQuerySchema,
  uuidParamSchema,
} from '../../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', validate(paginationQuerySchema, 'query'), getPrograms);
router.get('/:id', validate(uuidParamSchema, 'params'), getProgramById);
router.post(
  '/',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(createProgramSchema),
  createProgram
);
router.put(
  '/:id',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(uuidParamSchema, 'params'),
  validate(updateProgramSchema),
  updateProgram
);
router.delete(
  '/:id',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(uuidParamSchema, 'params'),
  deleteProgram
);

export default router;
