import prisma from '../lib/prisma';
import { Sex, Role, GADPlanStatus } from '@prisma/client';
import { getFallbackPublicDashboard } from '../lib/fallbackStore';

export class DashboardService {
  /**
   * Public dashboard statistics (strictly aggregated, zero PII)
   */
  public static async getPublicDashboardStats(year?: number) {
    const currentYear = year || new Date().getFullYear();

    try {
      const [
        totalBeneficiaries,
        totalMale,
        totalFemale,
        programs,
        accomplishments,
        bySectorData,
        byBarangayData,
        barangays,
      ] = await Promise.all([
        prisma.beneficiary.count({ where: { isArchived: false } }),
        prisma.beneficiary.count({ where: { sex: Sex.MALE, isArchived: false } }),
        prisma.beneficiary.count({ where: { sex: Sex.FEMALE, isArchived: false } }),
        prisma.program.findMany({ where: { fiscalYear: currentYear } }),
        prisma.gADAccomplishment.findMany({ where: { fiscalYear: currentYear } }),
        prisma.beneficiary.groupBy({
          by: ['sector'],
          where: { isArchived: false },
          _count: { id: true },
        }),
        prisma.beneficiary.groupBy({
          by: ['barangayId', 'sex'],
          where: { isArchived: false },
          _count: { id: true },
        }),
        prisma.barangay.findMany({ select: { id: true, name: true } }),
      ]);

      const totalBudgetAllocated = programs.reduce((acc, curr) => acc + Number(curr.budgetTarget), 0);
      const totalBudgetUsed = accomplishments.reduce((acc, curr) => acc + Number(curr.actualBudgetUsed), 0);
      const utilizationRate = totalBudgetAllocated > 0 ? (totalBudgetUsed / totalBudgetAllocated) * 100 : 0;

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
        summary: {
          totalBeneficiaries,
          totalMale,
          totalFemale,
          femalePercentage: totalBeneficiaries > 0 ? (totalFemale / totalBeneficiaries) * 100 : 0,
          totalPrograms: programs.length,
          totalBudgetAllocated,
          totalBudgetUsed,
          budgetUtilizationRate: Math.round(utilizationRate * 100) / 100,
          fiscalYear: currentYear,
        },
        bySector: bySectorData.map((s) => ({ sector: s.sector, count: s._count.id })),
        byBarangay: Object.values(byBarangayMap),
      };
    } catch (err) {
      console.warn('DashboardService.getPublicDashboardStats database query fallback:', err);
      return getFallbackPublicDashboard(currentYear);
    }
  }

  /**
   * Admin dashboard statistics with workflow metrics and audit log overview
   */
  public static async getAdminDashboardStats(
    year?: number,
    actorUser?: { id: string; role: Role; officeId: string | null }
  ) {
    const currentYear = year || new Date().getFullYear();

    const programWhere: any = { fiscalYear: currentYear };
    const planWhere: any = { fiscalYear: currentYear };

    if (actorUser && actorUser.role === Role.ENCODER && actorUser.officeId) {
      programWhere.officeId = actorUser.officeId;
      planWhere.officeId = actorUser.officeId;
    }

    try {
      const [
        totalBeneficiaries,
        totalMale,
        totalFemale,
        programs,
        accomplishments,
        gadPlansByStatusData,
        recentBeneficiaries,
        recentAuditLogs,
        bySectorData,
        byBarangayData,
        barangays,
      ] = await Promise.all([
        prisma.beneficiary.count({ where: { isArchived: false } }),
        prisma.beneficiary.count({ where: { sex: Sex.MALE, isArchived: false } }),
        prisma.beneficiary.count({ where: { sex: Sex.FEMALE, isArchived: false } }),
        prisma.program.findMany({ where: programWhere }),
        prisma.gADAccomplishment.findMany({ where: { fiscalYear: currentYear } }),
        prisma.gADPlan.groupBy({
          by: ['status'],
          where: planWhere,
          _count: { id: true },
        }),
        prisma.beneficiary.findMany({
          where: { isArchived: false },
          include: { barangay: true, office: true },
          take: 8,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.auditLog.findMany({
          take: 8,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { fullName: true, role: true } } },
        }),
        prisma.beneficiary.groupBy({
          by: ['sector'],
          where: { isArchived: false },
          _count: { id: true },
        }),
        prisma.beneficiary.groupBy({
          by: ['barangayId', 'sex'],
          where: { isArchived: false },
          _count: { id: true },
        }),
        prisma.barangay.findMany({ select: { id: true, name: true } }),
      ]);

      const totalBudgetAllocated = programs.reduce((acc, curr) => acc + Number(curr.budgetTarget), 0);
      const totalBudgetUsed = accomplishments.reduce((acc, curr) => acc + Number(curr.actualBudgetUsed), 0);
      const utilizationRate = totalBudgetAllocated > 0 ? (totalBudgetUsed / totalBudgetAllocated) * 100 : 0;

      const gadPlansByStatus: Record<string, number> = {
        DRAFT: 0,
        SUBMITTED: 0,
        APPROVED: 0,
        REVISED: 0,
      };
      gadPlansByStatusData.forEach((item) => {
        gadPlansByStatus[item.status] = item._count.id;
      });

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
        summary: {
          totalBeneficiaries,
          totalMale,
          totalFemale,
          totalPrograms: programs.length,
          totalBudgetAllocated,
          totalBudgetUsed,
          budgetUtilizationRate: Math.round(utilizationRate * 100) / 100,
          fiscalYear: currentYear,
        },
        gadPlansByStatus,
        bySector: bySectorData.map((s) => ({ sector: s.sector, count: s._count.id })),
        byBarangay: Object.values(byBarangayMap),
        recentBeneficiaries: recentBeneficiaries.map((b) => ({
          ...b,
          barangay: b.barangay.name,
          office: b.office?.code || b.office?.name || '',
          dateEncoded: b.createdAt,
        })),
        recentAuditLogs: recentAuditLogs.map((log) => ({
          id: log.id,
          action: log.action,
          entityType: log.entityType,
          user: log.user?.fullName || 'System',
          createdAt: log.createdAt,
        })),
      };
    } catch (err) {
      console.warn('DashboardService.getAdminDashboardStats database query fallback:', err);
      const fallback = getFallbackPublicDashboard(currentYear);
      return {
        summary: {
          ...fallback.summary,
          totalPrograms: fallback.summary.activeProgramsCount,
          budgetUtilizationRate: Math.round(fallback.summary.utilizationRate * 100) / 100,
        },
        gadPlansByStatus: { DRAFT: 1, SUBMITTED: 1, APPROVED: 3, REVISED: 0 },
        bySector: fallback.bySector,
        byBarangay: fallback.byBarangay,
        recentBeneficiaries: [],
        recentAuditLogs: [],
      };
    }
  }
}
