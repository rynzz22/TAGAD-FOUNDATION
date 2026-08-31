import { Response } from 'express';
import { OfficeService } from '../../services/OfficeService';
import { sendSuccess, sendError } from '../../lib/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export const getOffices = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const offices = await OfficeService.getOffices(false);
    return sendSuccess(res, offices);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getOfficeById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const office = await OfficeService.getOfficeById(req.params.id);
    return sendSuccess(res, office);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 404);
  }
};

export const createOffice = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const office = await OfficeService.createOffice(req.body, req.user?.id, req);
    return sendSuccess(res, office, undefined, 201);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const updateOffice = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const office = await OfficeService.updateOffice(req.params.id, req.body, req.user?.id, req);
    return sendSuccess(res, office);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};
