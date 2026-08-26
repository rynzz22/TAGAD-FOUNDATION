import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../../controllers/admin/userController';
import { requireRole } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import {
  createUserSchema,
  updateUserSchema,
  uuidParamSchema,
} from '../../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

// Only ADMIN can access or manipulate users
router.use(requireRole(Role.ADMIN));

router.get('/', getUsers);
router.get('/:id', validate(uuidParamSchema, 'params'), getUserById);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(uuidParamSchema, 'params'), validate(updateUserSchema), updateUser);
router.delete('/:id', validate(uuidParamSchema, 'params'), deleteUser);

export default router;
