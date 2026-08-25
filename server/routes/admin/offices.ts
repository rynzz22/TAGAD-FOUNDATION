import { Router } from 'express';
import {
  getOffices,
  getOfficeById,
  createOffice,
  updateOffice,
} from '../../controllers/admin/officeController';
import { requireRole } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { createOfficeSchema, updateOfficeSchema } from '../../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', getOffices);
router.get('/:id', getOfficeById);
router.post('/', requireRole(Role.ADMIN), validate(createOfficeSchema), createOffice);
router.put('/:id', requireRole(Role.ADMIN), validate(updateOfficeSchema), updateOffice);

export default router;
