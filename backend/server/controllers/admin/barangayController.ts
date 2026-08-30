import { Response } from 'express';
import { BarangayService } from '../../services/BarangayService';
import { sendSuccess, sendError } from '../../lib/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export const getBarangays = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const barangays = await BarangayService.getBarangays();
    return sendSuccess(res, barangays);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getBarangayById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const barangay = await BarangayService.getBarangayById(req.params.id);
    return sendSuccess(res, barangay);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 404);
  }
};
