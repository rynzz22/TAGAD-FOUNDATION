import prisma, { isDatabaseConnected } from '../lib/prisma';
import { NotFoundError, ConflictError } from '../lib/errors';
import { AuditService } from './AuditService';
import { Request } from 'express';
import { FALLBACK_OFFICES } from '../lib/fallbackStore';

export class OfficeService {
  public static async getOffices(activeOnly: boolean = false) {
    if (!isDatabaseConnected()) {
      if (activeOnly) {
        return FALLBACK_OFFICES.filter((o) => o.isActive);
      }
      return FALLBACK_OFFICES;
    }

    try {
      const where: any = {};
      if (activeOnly) where.isActive = true;

      return await prisma.office.findMany({
        where,
        orderBy: { code: 'asc' },
      });
    } catch {
      if (activeOnly) {
        return FALLBACK_OFFICES.filter((o) => o.isActive);
      }
      return FALLBACK_OFFICES;
    }
  }

  public static async getOfficeById(id: string) {
    if (!isDatabaseConnected()) {
      const office = FALLBACK_OFFICES.find((o) => o.id === id || o.code.toLowerCase() === id.toLowerCase());
      if (office) {
        return {
          ...office,
          users: [],
        };
      }
      throw new NotFoundError('Office');
    }

    try {
      const office = await prisma.office.findUnique({
        where: { id },
        include: {
          users: { select: { id: true, fullName: true, role: true, email: true } },
        },
      });

      if (!office) {
        throw new NotFoundError('Office');
      }

      return office;
    } catch (err: any) {
      if (err instanceof NotFoundError) throw err;
      const office = FALLBACK_OFFICES.find((o) => o.id === id || o.code.toLowerCase() === id.toLowerCase());
      if (office) {
        return {
          ...office,
          users: [],
        };
      }
      throw new NotFoundError('Office');
    }
  }

  public static async createOffice(data: any, actorUserId?: string, req?: Request) {
    const existing = await prisma.office.findUnique({ where: { code: data.code.toUpperCase().trim() } });
    if (existing) {
      throw new ConflictError(`Office with code '${data.code}' already exists`);
    }

    const office = await prisma.office.create({
      data: {
        code: data.code.toUpperCase().trim(),
        name: data.name.trim(),
        headName: data.headName || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    await AuditService.logAction({
      userId: actorUserId,
      action: 'OFFICE_CREATED',
      entityType: 'Office',
      entityId: office.id,
      afterState: office,
      req,
    });

    return office;
  }

  public static async updateOffice(id: string, data: any, actorUserId?: string, req?: Request) {
    const existing = await prisma.office.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Office');
    }

    const updated = await prisma.office.update({
      where: { id },
      data: {
        code: data.code ? data.code.toUpperCase().trim() : undefined,
        name: data.name ? data.name.trim() : undefined,
        headName: data.headName !== undefined ? data.headName : undefined,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
      },
    });

    await AuditService.logAction({
      userId: actorUserId,
      action: 'OFFICE_UPDATED',
      entityType: 'Office',
      entityId: id,
      beforeState: existing,
      afterState: updated,
      req,
    });

    return updated;
  }
}
