import { Router } from 'express';
import {
  getGADPlans,
  getGADPlanById,
  createGADPlan,
  updateGADPlan,
  updatePlanStatus,
  deleteGADPlan,
} from '../controllers/admin/gadPlanController';
import { requireAuth, requireRole, requireOfficeScope } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { uuidParamSchema } from '../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);
router.get('/', getGADPlans);
router.get('/:id', validate(uuidParamSchema, 'params'), getGADPlanById);
router.post('/', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), createGADPlan);
router.put('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), validate(uuidParamSchema, 'params'), updateGADPlan);
router.patch('/:id/status', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), validate(uuidParamSchema, 'params'), updatePlanStatus);
router.delete('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), validate(uuidParamSchema, 'params'), deleteGADPlan);

export default router;
