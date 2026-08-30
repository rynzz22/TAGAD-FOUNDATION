import { Response } from 'express';
import { GADPlanService } from '../../services/GADPlanService';
import { sendSuccess, sendError } from '../../lib/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { GADPlanStatus } from '@prisma/client';

export const getGADPlans = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { year, officeId, office, status } = req.query;
    const result = await GADPlanService.getGADPlans(
      {
        year: year ? Number(year) : undefined,
        officeId: officeId as string,
        office: office as string,
        status: status as string,
      },
      req.user
    );
    // Return items array for table grid while attaching plans overview in meta
    return sendSuccess(res, result.items, { plans: result.plans });
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getGADPlanById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await GADPlanService.getGADPlanById(req.params.id);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 404);
  }
};

export const createGADPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const result = await GADPlanService.createGADPlan(req.body, req.user, req);
    return sendSuccess(res, result, undefined, 201);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const updateGADPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const result = await GADPlanService.updateGADPlan(req.params.id, req.body, req.user, req);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const updatePlanStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { status } = req.body;
    const result = await GADPlanService.updatePlanStatus(req.params.id, status as GADPlanStatus, req.user, req);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const deleteGADPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const result = await GADPlanService.deleteGADPlan(req.params.id, req.user, req);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};
