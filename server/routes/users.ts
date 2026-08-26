import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/admin/userController';
import { requireAuth, requireRole } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { uuidParamSchema } from '../validation/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth, requireRole(Role.ADMIN));
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', validate(uuidParamSchema, 'params'), updateUser);
router.delete('/:id', validate(uuidParamSchema, 'params'), deleteUser);

export default router;
