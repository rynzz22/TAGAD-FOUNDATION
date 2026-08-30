import { Response } from 'express';
import { ProgramService } from '../../services/ProgramService';
import { sendSuccess, sendError } from '../../lib/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export const getPrograms = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { year, officeId, office, sector, status, search } = req.query;
    const result = await ProgramService.getPrograms(
      {
        year: year ? Number(year) : undefined,
        officeId: officeId as string,
        office: office as string,
        sector: sector as string,
        status: status as string,
        search: search as string,
      },
      req.user
    );
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getProgramById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await ProgramService.getProgramById(req.params.id);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 404);
  }
};

export const createProgram = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const result = await ProgramService.createProgram(req.body, req.user, req);
    return sendSuccess(res, result, undefined, 201);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const updateProgram = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const result = await ProgramService.updateProgram(req.params.id, req.body, req.user, req);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const deleteProgram = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const result = await ProgramService.deleteProgram(req.params.id, req.user, req);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};
