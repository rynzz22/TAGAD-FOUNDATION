import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { UnauthorizedError, NotFoundError } from '../lib/errors';
import { AuditService } from './AuditService';
import { Request } from 'express';

export class AuthService {
  public static async login(email: string, passwordPlain: string, req?: Request) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        office: { select: { id: true, code: true, name: true } },
        barangay: { select: { id: true, code: true, name: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account has been deactivated. Please contact the administrator.', 'ACCOUNT_INACTIVE');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      officeId: user.officeId,
      barangayId: user.barangayId,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    await AuditService.logAction({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      req,
    });

    return {
      token: accessToken,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        fullName: user.fullName,
        role: user.role,
        officeId: user.officeId,
        office: user.office?.code || user.office?.name || '',
        officeDetails: user.office,
        barangayId: user.barangayId,
        barangayDetails: user.barangay,
      },
    };
  }

  public static async refreshToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User account not found or inactive', 'INVALID_REFRESH_TOKEN');
      }

      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        officeId: user.officeId,
        barangayId: user.barangayId,
      };

      const newAccessToken = signAccessToken(tokenPayload);
      const newRefreshToken = signRefreshToken(tokenPayload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }
  }

  public static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        office: true,
        barangay: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User profile');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.fullName,
      fullName: user.fullName,
      role: user.role,
      officeId: user.officeId,
      office: user.office?.code || user.office?.name || '',
      officeDetails: user.office,
      barangayId: user.barangayId,
      barangayDetails: user.barangay,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  public static async logout(userId?: string, req?: Request) {
    if (userId) {
      await AuditService.logAction({
        userId,
        action: 'USER_LOGOUT',
        entityType: 'User',
        entityId: userId,
        req,
      });
    }
    return { message: 'Logged out successfully' };
  }
}
