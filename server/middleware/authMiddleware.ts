import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { verifyAccessToken, TokenPayload } from '../lib/jwt';
import { UnauthorizedError, ForbiddenError, OfficeScopeError } from '../lib/errors';
import { sendError } from '../lib/response';
import { Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
    officeId: string | null;
    office?: any;
    barangayId: string | null;
    barangay?: any;
  };
  officeScope?: string | null;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, new UnauthorizedError('Authorization token is missing or malformed', 'NO_TOKEN'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        office: { select: { id: true, code: true, name: true, isActive: true } },
        barangay: { select: { id: true, code: true, name: true } },
      },
    });

    if (!user) {
      return sendError(res, new UnauthorizedError('User account not found', 'USER_NOT_FOUND'));
    }

    if (!user.isActive) {
      return sendError(res, new UnauthorizedError('User account has been deactivated', 'ACCOUNT_INACTIVE'));
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      officeId: user.officeId,
      office: user.office,
      barangayId: user.barangayId,
      barangay: user.barangay,
    };

    next();
  } catch (err: any) {
    if (err?.name === 'TokenRevokedError') {
      return sendError(res, new UnauthorizedError('Authentication token has been revoked or invalidated', 'TOKEN_REVOKED'));
    }
    if (err?.name === 'TokenExpiredError') {
      return sendError(res, new UnauthorizedError('Authentication token expired', 'TOKEN_EXPIRED'));
    }
    return sendError(res, new UnauthorizedError('Invalid authentication token', 'INVALID_TOKEN'));
  }
};

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        new ForbiddenError(`Access denied: Requires one of [${allowedRoles.join(', ')}] role(s)`)
      );
    }

    next();
  };
};

/**
 * Enforces office boundary isolation:
 * - ADMIN: Unrestricted cross-office access.
 * - ENCODER: Strictly restricted to their assigned officeId.
 * - VIEWER: Read-only access across approved data; mutations forbidden.
 */
export const requireOfficeScope = () => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, new UnauthorizedError('Authentication required'));
    }

    const { role, officeId } = req.user;

    // ADMIN has cross-office authority
    if (role === Role.ADMIN) {
      req.officeScope = null; // null represents all offices
      return next();
    }

    // ENCODER must belong to an office
    if (role === Role.ENCODER) {
      if (!officeId) {
        return sendError(res, new ForbiddenError('Encoder account has no assigned office scope'));
      }

      // If client attempts to specify an officeId in body or query, enforce match
      const requestedOfficeId = req.body?.officeId || req.query?.officeId;
      if (requestedOfficeId && requestedOfficeId !== officeId) {
        return sendError(
          res,
          new OfficeScopeError(`Encoders cannot create or modify records for other offices. Assigned office: ${officeId}`)
        );
      }

      // Automatically set the verified office scope
      req.officeScope = officeId;
      if (req.body && typeof req.body === 'object') {
        req.body.officeId = officeId;
      }

      return next();
    }

    // VIEWER cannot perform data mutation operations
    if (role === Role.VIEWER) {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        return sendError(res, new ForbiddenError('Viewers have read-only access and cannot perform mutations'));
      }
      req.officeScope = null;
      return next();
    }

    return sendError(res, new ForbiddenError('Role unrecognized'));
  };
};

// Aliases for compatibility
export const protect = requireAuth;
export const restrictTo = (...roles: string[]) => {
  const mapped = roles.map((r) => r.toUpperCase() as Role);
  return requireRole(...mapped);
};
