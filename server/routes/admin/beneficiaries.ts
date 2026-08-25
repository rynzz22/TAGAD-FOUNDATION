import { Router } from 'express';
import {
  getBeneficiaries,
  getBeneficiaryById,
  createBeneficiary,
  updateBeneficiary,
  archiveBeneficiary,
} from '../../controllers/admin/beneficiaryController';
import { requireRole, requireOfficeScope } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import {
  createBeneficiarySchema,
  updateBeneficiarySchema,
  paginationQuerySchema,
} from '../../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', validate(paginationQuerySchema, 'query'), getBeneficiaries);
router.get('/:id', getBeneficiaryById);
router.post(
  '/',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(createBeneficiarySchema),
  createBeneficiary
);
router.put(
  '/:id',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(updateBeneficiarySchema),
  updateBeneficiary
);
router.delete(
  '/:id',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  archiveBeneficiary
);
router.delete(
  '/:id/archive',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  archiveBeneficiary
);

export default router;
