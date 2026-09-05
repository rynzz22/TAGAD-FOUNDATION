import { Response } from 'express';
import { ObservationService } from '../../services/ObservationService';
import { sendSuccess, sendError } from '../../lib/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { UnauthorizedError } from '../../lib/errors';

export const listObservations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tableId = req.params.tableId || req.params.id;
    const { datasetId, period, barangayId, indicatorId, page, limit } = req.query as any;

    const filter = {
      datasetId: String(datasetId),
      period: period ? String(period) : undefined,
      barangayId: barangayId ? String(barangayId) : undefined,
      indicatorId: indicatorId ? String(indicatorId) : undefined,
      page: page !== undefined ? Number(page) : 1,
      limit: limit !== undefined ? Number(limit) : 100,
    };

    const result = await ObservationService.listObservations(tableId, filter, req.user);
    return sendSuccess(res, result.observations, {
      table: result.table,
      dataset: result.dataset,
      pagination: result.pagination,
    });
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getObservationById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tableId = req.params.tableId || req.params.id;
    const observationId = req.params.observationId;

    const observation = await ObservationService.getObservationById(tableId, observationId, req.user);
    return sendSuccess(res, observation);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 404);
  }
};

export const createObservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const tableId = req.params.tableId || req.params.id;
    const observation = await ObservationService.createObservation(tableId, req.body, req.user, req);
    return sendSuccess(res, observation, undefined, 201);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const updateObservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const tableId = req.params.tableId || req.params.id;
    const observationId = req.params.observationId;
    const observation = await ObservationService.updateObservation(tableId, observationId, req.body, req.user, req);
    return sendSuccess(res, observation);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const deleteObservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const tableId = req.params.tableId || req.params.id;
    const observationId = req.params.observationId;
    const result = await ObservationService.deleteObservation(tableId, observationId, req.user, req);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const bulkSaveObservations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const tableId = req.params.tableId || req.params.id;
    const result = await ObservationService.bulkSaveObservations(tableId, req.body, req.user, req);
    return sendSuccess(res, result.data);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};
