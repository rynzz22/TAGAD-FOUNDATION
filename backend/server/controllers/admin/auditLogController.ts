import { Response } from 'express';
import { AuditService } from '../../services/AuditService';
import { sendSuccess, sendError } from '../../lib/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page, limit, userId, action, entityType } = req.query;
    const result = await AuditService.getLogs({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      userId: userId as string,
      action: action as string,
      entityType: entityType as string,
    });
    return sendSuccess(res, result.logs, result.pagination);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};
