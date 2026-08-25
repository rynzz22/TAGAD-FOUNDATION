import { Router, Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';
import { sendSuccess, sendError } from '../lib/response';

const router = Router();

// Legacy dashboard route returns public aggregates or full dashboard
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const stats = await DashboardService.getAdminDashboardStats(year);
    return res.json(stats);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const stats = await DashboardService.getAdminDashboardStats(year);
    return res.json(stats);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
});

export default router;
