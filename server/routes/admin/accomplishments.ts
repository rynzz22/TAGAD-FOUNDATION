import { Router } from 'express';
import {
  getAccomplishments,
  createAccomplishment,
  updateAccomplishment,
  deleteAccomplishment,
} from '../../controllers/admin/accomplishmentController';
import { requireRole, requireOfficeScope } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import {
  createAccomplishmentSchema,
  updateAccomplishmentSchema,
  paginationQuerySchema,
} from '../../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', validate(paginationQuerySchema, 'query'), getAccomplishments);
router.post(
  '/',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(createAccomplishmentSchema),
  createAccomplishment
);
router.put(
  '/:id',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(updateAccomplishmentSchema),
  updateAccomplishment
);
router.delete(
  '/:id',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  deleteAccomplishment
);

export default router;
