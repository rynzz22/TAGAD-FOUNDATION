import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/admin/userController';
import { requireAuth, requireRole } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth, requireRole(Role.ADMIN));
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
