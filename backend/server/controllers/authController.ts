import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { sendSuccess, sendError } from '../lib/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password, req);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 401);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    const result = await AuthService.refreshToken(token);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 401);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthenticated', 401);
    }
    const profile = await AuthService.getMe(req.user.id);
    return sendSuccess(res, profile);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await AuthService.logout(req.user?.id, req);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};
