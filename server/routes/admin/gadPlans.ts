import { Router } from 'express';
import {
  getGADPlans,
  getGADPlanById,
  createGADPlan,
  updateGADPlan,
  updatePlanStatus,
  deleteGADPlan,
} from '../../controllers/admin/gadPlanController';
import { requireRole, requireOfficeScope } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import {
  createGADPlanSchema,
  updateGADPlanSchema,
  updatePlanStatusSchema,
  paginationQuerySchema,
} from '../../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', validate(paginationQuerySchema, 'query'), getGADPlans);
router.get('/:id', getGADPlanById);
router.post(
  '/',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(createGADPlanSchema),
  createGADPlan
);
router.put(
  '/:id',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(updateGADPlanSchema),
  updateGADPlan
);
router.patch(
  '/:id/status',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  validate(updatePlanStatusSchema),
  updatePlanStatus
);
router.delete(
  '/:id',
  requireRole(Role.ADMIN, Role.ENCODER),
  requireOfficeScope(),
  deleteGADPlan
);

export default router;
