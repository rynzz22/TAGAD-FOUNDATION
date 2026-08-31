import { Router } from 'express';
import {
  getOffices,
  getOfficeById,
  createOffice,
  updateOffice,
} from '../../controllers/admin/officeController';
import { requireRole } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { createOfficeSchema, updateOfficeSchema, uuidParamSchema } from '../../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', getOffices);
router.get('/:id', validate(uuidParamSchema, 'params'), getOfficeById);
router.post('/', requireRole(Role.ADMIN), validate(createOfficeSchema), createOffice);
router.put('/:id', requireRole(Role.ADMIN), validate(uuidParamSchema, 'params'), validate(updateOfficeSchema), updateOffice);

export default router;
