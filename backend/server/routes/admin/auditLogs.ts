import { Router } from 'express';
import { getAuditLogs } from '../../controllers/admin/auditLogController';
import { requireRole } from '../../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();

// Only ADMIN can view audit logs
router.use(requireRole(Role.ADMIN));
router.get('/', getAuditLogs);

export default router;
