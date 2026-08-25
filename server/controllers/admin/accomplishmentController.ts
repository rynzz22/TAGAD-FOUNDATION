import { Response } from 'express';
import { AccomplishmentService } from '../../services/AccomplishmentService';
import { sendSuccess, sendError } from '../../lib/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export const getAccomplishments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { year, quarter, programId, officeId } = req.query;
    const result = await AccomplishmentService.getAccomplishments(
      {
        year: year ? Number(year) : undefined,
        quarter: quarter ? Number(quarter) : undefined,
        programId: programId as string,
        officeId: officeId as string,
      },
      req.user
    );
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const createAccomplishment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const result = await AccomplishmentService.createAccomplishment(req.body, req.user, req);
    return sendSuccess(res, result, undefined, 201);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const updateAccomplishment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const result = await AccomplishmentService.updateAccomplishment(req.params.id, req.body, req.user, req);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const deleteAccomplishment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const result = await AccomplishmentService.deleteAccomplishment(req.params.id, req.user, req);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};
