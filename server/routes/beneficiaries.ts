import { Router } from 'express';
import {
  getBeneficiaries,
  getBeneficiaryById,
  createBeneficiary,
  updateBeneficiary,
  archiveBeneficiary,
} from '../controllers/admin/beneficiaryController';
import { requireAuth, requireRole, requireOfficeScope } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);
router.get('/', getBeneficiaries);
router.get('/:id', getBeneficiaryById);
router.post('/', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), createBeneficiary);
router.put('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), updateBeneficiary);
router.delete('/:id', requireRole(Role.ADMIN, Role.ENCODER), requireOfficeScope(), archiveBeneficiary);

export default router;
