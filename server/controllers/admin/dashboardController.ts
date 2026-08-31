import { Response } from 'express';
import { DashboardService } from '../../services/DashboardService';
import { sendSuccess, sendError } from '../../lib/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const stats = await DashboardService.getAdminDashboardStats(year, req.user);
    return sendSuccess(res, stats);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};
