import prisma, { isDatabaseConnected } from '../lib/prisma';
import { Request } from 'express';

export interface AuditLogParams {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  beforeState?: any;
  afterState?: any;
  req?: Request;
}

export class AuditService {
  public static async logActionTx(tx: any, params: AuditLogParams) {
    if (!isDatabaseConnected() || !tx) {
      return;
    }

    try {
      const ipAddress = params.req
        ? (params.req.headers['x-forwarded-for'] as string) || params.req.socket?.remoteAddress || null
        : null;

      const userAgent = params.req ? (params.req.headers['user-agent'] as string) || null : null;

      await tx.auditLog.create({
        data: {
          userId: params.userId || null,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId || null,
          beforeState: params.beforeState ? JSON.parse(JSON.stringify(params.beforeState)) : null,
          afterState: params.afterState ? JSON.parse(JSON.stringify(params.afterState)) : null,
          ipAddress: ipAddress ? String(ipAddress).slice(0, 45) : null,
          userAgent: userAgent ? String(userAgent).slice(0, 255) : null,
        },
      });
    } catch (error) {
      // In transaction context, we log warning so callers know if audit log failed
      console.warn('AuditService.logActionTx error:', error);
    }
  }

  public static async logAction(params: AuditLogParams) {
    if (!isDatabaseConnected()) {
      return;
    }

    try {
      const ipAddress = params.req
        ? (params.req.headers['x-forwarded-for'] as string) || params.req.socket.remoteAddress || null
        : null;

      const userAgent = params.req ? (params.req.headers['user-agent'] as string) || null : null;

      await prisma.auditLog.create({
        data: {
          userId: params.userId || null,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId || null,
          beforeState: params.beforeState ? JSON.parse(JSON.stringify(params.beforeState)) : null,
          afterState: params.afterState ? JSON.parse(JSON.stringify(params.afterState)) : null,
          ipAddress: ipAddress ? String(ipAddress).slice(0, 45) : null,
          userAgent: userAgent ? String(userAgent).slice(0, 255) : null,
        },
      });
    } catch {
      // Non-blocking error logging for audit logs so main business transaction does not abort
    }
  }

  public static async getLogs(params: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    entityType?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;

    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.action) where.action = { contains: params.action, mode: 'insensitive' };
    if (params.entityType) where.entityType = params.entityType;

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, fullName: true, email: true, role: true },
          },
        },
      }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
