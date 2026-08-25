import prisma from '../lib/prisma';
import { Sex, Role } from '@prisma/client';
import { NotFoundError, OfficeScopeError, ForbiddenError } from '../lib/errors';
import { AuditService } from './AuditService';
import { Request } from 'express';
import { getFallbackDemographicsData } from '../lib/fallbackStore';

export class BeneficiaryService {
  public static async getBeneficiaries(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      sex?: 'MALE' | 'FEMALE';
      barangayId?: string;
      barangay?: string;
      sector?: string;
      officeId?: string;
      year?: number;
      isArchived?: boolean;
    },
    actorUser?: { id: string; role: Role; officeId: string | null }
  ) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      isArchived: params.isArchived !== undefined ? params.isArchived : false,
    };

    if (params.sex) {
      where.sex = params.sex as Sex;
    }

    if (params.barangayId) {
      where.barangayId = params.barangayId;
    } else if (params.barangay) {
      where.barangay = {
        OR: [{ name: params.barangay }, { code: params.barangay }, { id: params.barangay }],
      };
    }

    if (params.sector) {
      where.sector = params.sector;
    }

    if (params.officeId) {
      where.officeId = params.officeId;
    }

    if (params.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { middleName: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.year) {
      const yearStart = new Date(`${params.year}-01-01`);
      const yearEnd = new Date(`${params.year}-12-31T23:59:59.999Z`);
      where.createdAt = { gte: yearStart, lte: yearEnd };
    }

    const [total, beneficiaries] = await Promise.all([
      prisma.beneficiary.count({ where }),
      prisma.beneficiary.findMany({
        where,
        include: {
          barangay: { select: { id: true, name: true, code: true } },
          office: { select: { id: true, name: true, code: true } },
          encodedBy: { select: { id: true, fullName: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const formatted = beneficiaries.map((b) => ({
      ...b,
      barangay: b.barangay.name,
      office: b.office?.code || b.office?.name || '',
      program: 'General GAD',
      dateEncoded: b.createdAt,
      encodedBy: b.encodedBy?.fullName || 'System',
    }));

    return {
      data: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public static async getBeneficiaryById(
    id: string,
    actorUser?: { id: string; role: Role; officeId: string | null }
  ) {
    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id },
      include: {
        barangay: true,
        office: true,
        household: true,
        encodedBy: { select: { id: true, fullName: true, email: true } },
      },
    });

    if (!beneficiary) {
      throw new NotFoundError('Beneficiary');
    }

    return {
      ...beneficiary,
      barangay: beneficiary.barangay.name,
      office: beneficiary.office?.code || beneficiary.office?.name || '',
      dateEncoded: beneficiary.createdAt,
    };
  }

  public static async createBeneficiary(
    data: any,
    actorUser: { id: string; role: Role; officeId: string | null },
    req?: Request
  ) {
    let effectiveOfficeId = data.officeId;

    if (actorUser.role === Role.ENCODER) {
      effectiveOfficeId = actorUser.officeId;
    } else if (!effectiveOfficeId && data.office) {
      const foundOffice = await prisma.office.findFirst({
        where: { OR: [{ code: data.office }, { name: data.office }] },
      });
      if (foundOffice) effectiveOfficeId = foundOffice.id;
    }

    let resolvedBarangayId = data.barangayId;
    if (!resolvedBarangayId && data.barangay) {
      const foundBrgy = await prisma.barangay.findFirst({
        where: { OR: [{ name: data.barangay }, { code: data.barangay }] },
      });
      if (foundBrgy) resolvedBarangayId = foundBrgy.id;
    }

    if (!resolvedBarangayId) {
      const defaultBrgy = await prisma.barangay.findFirst();
      resolvedBarangayId = defaultBrgy?.id;
    }

    const beneficiary = await prisma.beneficiary.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        middleName: data.middleName ? data.middleName.trim() : null,
        sex: (data.sex?.toUpperCase() as Sex) || Sex.FEMALE,
        age: parseInt(String(data.age || '0'), 10),
        sector: data.sector || 'General',
        barangayId: resolvedBarangayId!,
        officeId: effectiveOfficeId || null,
        householdId: data.householdId || null,
        contactNumber: data.contactNumber || null,
        addressStreet: data.addressStreet || null,
        birthdate: data.birthdate ? new Date(data.birthdate) : null,
        encodedById: actorUser.id,
      },
      include: {
        barangay: true,
        office: true,
      },
    });

    await AuditService.logAction({
      userId: actorUser.id,
      action: 'BENEFICIARY_CREATED',
      entityType: 'Beneficiary',
      entityId: beneficiary.id,
      afterState: {
        id: beneficiary.id,
        sex: beneficiary.sex,
        age: beneficiary.age,
        sector: beneficiary.sector,
        barangayId: beneficiary.barangayId,
        officeId: beneficiary.officeId,
      },
      req,
    });

    return {
      ...beneficiary,
      barangay: beneficiary.barangay.name,
      office: beneficiary.office?.code || beneficiary.office?.name || '',
      dateEncoded: beneficiary.createdAt,
    };
  }

  public static async updateBeneficiary(
    id: string,
    data: any,
    actorUser: { id: string; role: Role; officeId: string | null },
    req?: Request
  ) {
    const existing = await prisma.beneficiary.findUnique({
      where: { id },
      include: { barangay: true, office: true },
    });

    if (!existing) {
      throw new NotFoundError('Beneficiary');
    }

    // Encoder office scoping verification
    if (actorUser.role === Role.ENCODER && existing.officeId && existing.officeId !== actorUser.officeId) {
      throw new OfficeScopeError('Encoders cannot modify beneficiaries encoded under other offices');
    }

    const updateData: any = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName.trim();
    if (data.lastName !== undefined) updateData.lastName = data.lastName.trim();
    if (data.middleName !== undefined) updateData.middleName = data.middleName ? data.middleName.trim() : null;
    if (data.sex !== undefined) updateData.sex = data.sex.toUpperCase() as Sex;
    if (data.age !== undefined) updateData.age = parseInt(String(data.age), 10);
    if (data.sector !== undefined) updateData.sector = data.sector;
    if (data.contactNumber !== undefined) updateData.contactNumber = data.contactNumber;
    if (data.addressStreet !== undefined) updateData.addressStreet = data.addressStreet;
    if (data.birthdate !== undefined) updateData.birthdate = data.birthdate ? new Date(data.birthdate) : null;
    if (data.householdId !== undefined) updateData.householdId = data.householdId;

    if (data.barangayId) {
      updateData.barangayId = data.barangayId;
    } else if (data.barangay) {
      const foundBrgy = await prisma.barangay.findFirst({
        where: { OR: [{ name: data.barangay }, { code: data.barangay }] },
      });
      if (foundBrgy) updateData.barangayId = foundBrgy.id;
    }

    if (actorUser.role === Role.ADMIN && data.officeId !== undefined) {
      updateData.officeId = data.officeId;
    }

    const updated = await prisma.beneficiary.update({
      where: { id },
      data: updateData,
      include: { barangay: true, office: true },
    });

    await AuditService.logAction({
      userId: actorUser.id,
      action: 'BENEFICIARY_UPDATED',
      entityType: 'Beneficiary',
      entityId: updated.id,
      beforeState: { id: existing.id, sex: existing.sex, sector: existing.sector },
      afterState: { id: updated.id, sex: updated.sex, sector: updated.sector },
      req,
    });

    return {
      ...updated,
      barangay: updated.barangay.name,
      office: updated.office?.code || updated.office?.name || '',
      dateEncoded: updated.createdAt,
    };
  }

  public static async archiveBeneficiary(
    id: string,
    actorUser: { id: string; role: Role; officeId: string | null },
    req?: Request
  ) {
    const existing = await prisma.beneficiary.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Beneficiary');
    }

    if (actorUser.role === Role.ENCODER && existing.officeId && existing.officeId !== actorUser.officeId) {
      throw new OfficeScopeError('Encoders cannot archive beneficiaries under other offices');
    }

    await prisma.beneficiary.update({
      where: { id },
      data: { isArchived: true },
    });

    await AuditService.logAction({
      userId: actorUser.id,
      action: 'BENEFICIARY_ARCHIVED',
      entityType: 'Beneficiary',
      entityId: id,
      req,
    });

    return { message: 'Beneficiary record archived successfully' };
  }

  /**
   * Strictly aggregated demographic metrics for public consumption with ZERO PII
   */
  public static async getDemographicsAggregates(params?: { year?: number; barangayId?: string }) {
    try {
      const where: any = { isArchived: false };

      if (params?.year) {
        const yearStart = new Date(`${params.year}-01-01`);
        const yearEnd = new Date(`${params.year}-12-31T23:59:59.999Z`);
        where.createdAt = { gte: yearStart, lte: yearEnd };
      }

      if (params?.barangayId) {
        where.barangayId = params.barangayId;
      }

      const [totalBeneficiaries, maleCount, femaleCount, bySectorData, byBarangayData, barangays] =
        await Promise.all([
          prisma.beneficiary.count({ where }),
          prisma.beneficiary.count({ where: { ...where, sex: Sex.MALE } }),
          prisma.beneficiary.count({ where: { ...where, sex: Sex.FEMALE } }),
          prisma.beneficiary.groupBy({
            by: ['sector'],
            where,
            _count: { id: true },
          }),
          prisma.beneficiary.groupBy({
            by: ['barangayId', 'sex'],
            where,
            _count: { id: true },
          }),
          prisma.barangay.findMany({ select: { id: true, name: true } }),
        ]);

      const brgyMap = new Map(barangays.map((b) => [b.id, b.name]));
      const byBarangayMap: Record<string, { barangay: string; male: number; female: number; total: number }> = {};

      barangays.forEach((b) => {
        byBarangayMap[b.id] = { barangay: b.name, male: 0, female: 0, total: 0 };
      });

      byBarangayData.forEach((item) => {
        if (!byBarangayMap[item.barangayId]) {
          byBarangayMap[item.barangayId] = {
            barangay: brgyMap.get(item.barangayId) || 'Unknown',
            male: 0,
            female: 0,
            total: 0,
          };
        }
        if (item.sex === Sex.MALE) {
          byBarangayMap[item.barangayId].male += item._count.id;
        } else {
          byBarangayMap[item.barangayId].female += item._count.id;
        }
        byBarangayMap[item.barangayId].total += item._count.id;
      });

      return {
        totals: {
          totalBeneficiaries,
          male: maleCount,
          female: femaleCount,
          femalePercentage: totalBeneficiaries > 0 ? (femaleCount / totalBeneficiaries) * 100 : 0,
          malePercentage: totalBeneficiaries > 0 ? (maleCount / totalBeneficiaries) * 100 : 0,
        },
        bySector: bySectorData.map((s) => ({
          sector: s.sector,
          count: s._count.id,
          percentage: totalBeneficiaries > 0 ? (s._count.id / totalBeneficiaries) * 100 : 0,
        })),
        byBarangay: Object.values(byBarangayMap),
      };
    } catch (err) {
      console.warn('BeneficiaryService.getDemographicsAggregates fallback:', err);
      return getFallbackDemographicsData(params?.year, params?.barangayId);
    }
  }
}
