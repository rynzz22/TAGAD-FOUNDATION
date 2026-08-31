import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { Sex } from '@prisma/client';

export const getDashboardStats = async (req: Request, res: Response) => {
  const { year } = req.query;
  const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

  try {
    const totalBeneficiaries = await prisma.beneficiary.count({ where: { isArchived: false } });
    const totalMale = await prisma.beneficiary.count({ where: { sex: Sex.MALE, isArchived: false } });
    const totalFemale = await prisma.beneficiary.count({ where: { sex: Sex.FEMALE, isArchived: false } });
    const totalPrograms = await prisma.program.count({ where: { fiscalYear: currentYear } });

    const programs = await prisma.program.findMany({ where: { fiscalYear: currentYear } });
    const totalBudgetAllocated = programs.reduce((acc, curr) => acc + Number(curr.budgetTarget), 0);
    
    const accomplishments = await prisma.gADAccomplishment.findMany({
      where: { fiscalYear: currentYear }
    });
    const totalBudgetUsed = accomplishments.reduce((acc, curr) => acc + Number(curr.actualBudgetUsed), 0);

    // Grouping
    const byBarangayData = await prisma.beneficiary.groupBy({
      by: ['barangayId', 'sex'],
      where: { isArchived: false },
      _count: { id: true }
    });

    const barangays = await prisma.barangay.findMany();
    const brgyMap = new Map(barangays.map(b => [b.id, b.name]));

    const bySectorData = await prisma.beneficiary.groupBy({
      by: ['sector'],
      where: { isArchived: false },
      _count: { id: true }
    });

    const gadPlansByStatusData = await prisma.gADPlan.groupBy({
      by: ['status'],
      where: { fiscalYear: currentYear },
      _count: { id: true }
    });

    const recentBeneficiaries = await prisma.beneficiary.findMany({
      where: { isArchived: false },
      include: { barangay: true, office: true },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    // Formatting for frontend
    const byBarangayMap: any = {};
    barangays.forEach(b => {
      byBarangayMap[b.name] = { barangay: b.name, male: 0, female: 0 };
    });

    byBarangayData.forEach(item => {
      const bName = brgyMap.get(item.barangayId) || 'Unknown';
      if (!byBarangayMap[bName]) byBarangayMap[bName] = { barangay: bName, male: 0, female: 0 };
      if (item.sex === Sex.MALE) byBarangayMap[bName].male += item._count.id;
      if (item.sex === Sex.FEMALE) byBarangayMap[bName].female += item._count.id;
    });

    const gadPlansByStatus: any = { DRAFT: 0, SUBMITTED: 0, APPROVED: 0, REVISED: 0 };
    gadPlansByStatusData.forEach(item => {
      gadPlansByStatus[item.status] = item._count.id;
    });

    res.json({
      summary: {
        totalBeneficiaries,
        totalMale,
        totalFemale,
        totalPrograms,
        totalBudgetAllocated,
        totalBudgetUsed,
        budgetUtilizationRate: totalBudgetAllocated > 0 ? (totalBudgetUsed / totalBudgetAllocated) * 100 : 0,
      },
      byBarangay: Object.values(byBarangayMap),
      bySector: bySectorData.map(item => ({ sector: item.sector, count: item._count.id })),
      gadPlansByStatus,
      recentBeneficiaries: recentBeneficiaries.map(b => ({
        ...b,
        barangay: b.barangay.name,
        office: b.office?.code || b.officeId || '',
        program: 'General GAD',
        dateEncoded: b.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
