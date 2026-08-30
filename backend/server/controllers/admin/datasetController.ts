import { Response } from 'express';
import { StatisticalDatasetService } from '../../services/StatisticalDatasetService';
import { sendSuccess, sendError } from '../../lib/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { StatisticalPublicationStatus } from '@prisma/client';
import { UnauthorizedError } from '../../lib/errors';

export const listDatasets = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page, limit, status, year, sourceAgency, search } = req.query;
    const filter = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as StatisticalPublicationStatus | undefined,
      year: year ? Number(year) : undefined,
      sourceAgency: sourceAgency as string | undefined,
      search: search as string | undefined,
    };

    const result = await StatisticalDatasetService.listDatasets(filter, req.user);
    return sendSuccess(res, result.datasets, { pagination: result.pagination });
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getDatasetById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dataset = await StatisticalDatasetService.getDatasetById(req.params.id, req.user);
    return sendSuccess(res, dataset);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 404);
  }
};

export const createDataset = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const newDataset = await StatisticalDatasetService.createDataset(
      req.body,
      req.user,
      req
    );
    return sendSuccess(res, newDataset, undefined, 201);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const validateDataset = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const { reason, notes, signOffBy, movDocumentUrl } = req.body || {};
    const result = await StatisticalDatasetService.transitionStatus(
      req.params.id,
      StatisticalPublicationStatus.VALIDATED,
      req.user,
      { reason, notes, signOffBy, movDocumentUrl },
      req
    );

    return sendSuccess(res, result.dataset, { transition: result.transition });
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const officializeDataset = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const { reason, notes, signOffBy, movDocumentUrl } = req.body || {};
    const result = await StatisticalDatasetService.transitionStatus(
      req.params.id,
      StatisticalPublicationStatus.OFFICIAL,
      req.user,
      { reason, notes, signOffBy, movDocumentUrl },
      req
    );

    return sendSuccess(res, result.dataset, { transition: result.transition });
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const publishDataset = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const { reason, notes, signOffBy, movDocumentUrl } = req.body || {};
    const result = await StatisticalDatasetService.transitionStatus(
      req.params.id,
      StatisticalPublicationStatus.PUBLISHED,
      req.user,
      { reason, notes, signOffBy, movDocumentUrl },
      req
    );

    return sendSuccess(res, result.dataset, { transition: result.transition });
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const withdrawDataset = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const { reason, notes } = req.body;
    const result = await StatisticalDatasetService.withdrawDataset(
      req.params.id,
      reason,
      req.user,
      notes,
      req
    );

    return sendSuccess(res, result.dataset, { transition: result.transition });
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 400);
  }
};

export const getDatasetHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const history = await StatisticalDatasetService.getDatasetHistory(req.params.id, req.user);
    return sendSuccess(res, history);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 404);
  }
};
