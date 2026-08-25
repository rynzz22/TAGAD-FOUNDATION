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
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);
router.get('/', getGADPlans);
router.get('/:id', getGADPlanById);
router.post('/', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), createGADPlan);
router.put('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), updateGADPlan);
router.patch('/:id/status', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), updatePlanStatus);
router.delete('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), deleteGADPlan);

export default router;
