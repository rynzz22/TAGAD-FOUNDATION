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
  uuidParamSchema,
} from '../../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', validate(paginationQuerySchema, 'query'), getBeneficiaries);
router.get('/:id', validate(uuidParamSchema, 'params'), getBeneficiaryById);
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
  validate(uuidParamSchema, 'params'),
  validate(updateBeneficiarySchema),
  updateBeneficiary
);
router.delete(
  '/:id',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(uuidParamSchema, 'params'),
  archiveBeneficiary
);
router.delete(
  '/:id/archive',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(uuidParamSchema, 'params'),
  archiveBeneficiary
);

export default router;
