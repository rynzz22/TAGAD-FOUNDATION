import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  const { year } = req.query;
  const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

  try {
    const totalBeneficiaries = await prisma.beneficiary.count({ where: { isArchived: false } });
    const totalMale = await prisma.beneficiary.count({ where: { sex: 'MALE', isArchived: false } });
    const totalFemale = await prisma.beneficiary.count({ where: { sex: 'FEMALE', isArchived: false } });
    const totalPrograms = await prisma.program.count({ where: { year: currentYear } });

    const programs = await prisma.program.findMany({ where: { year: currentYear } });
    const totalBudgetAllocated = programs.reduce((acc, curr) => acc + curr.budget, 0);
    
    const accomplishments = await prisma.gADAccomplishment.findMany({
      where: { gadPlan: { year: currentYear } }
    });
    const totalBudgetUsed = accomplishments.reduce((acc, curr) => acc + curr.actualBudgetUsed, 0);

    // Grouping
    const byBarangayData = await prisma.beneficiary.groupBy({
      by: ['barangay', 'sex'],
      where: { isArchived: false },
      _count: { id: true }
    });

    const bySectorData = await prisma.beneficiary.groupBy({
      by: ['sector'],
      where: { isArchived: false },
      _count: { id: true }
    });

    const gadPlansByStatusData = await prisma.gADPlan.groupBy({
      by: ['status'],
      where: { year: currentYear },
      _count: { id: true }
    });

    const recentBeneficiaries = await prisma.beneficiary.findMany({
      where: { isArchived: false },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    // Formatting for frontend
    const byBarangayMap: any = {};
    byBarangayData.forEach(item => {
      if (!byBarangayMap[item.barangay]) byBarangayMap[item.barangay] = { barangay: item.barangay, male: 0, female: 0 };
      if (item.sex === 'MALE') byBarangayMap[item.barangay].male += item._count.id;
      if (item.sex === 'FEMALE') byBarangayMap[item.barangay].female += item._count.id;
    });

    const gadPlansByStatus: any = { DRAFT: 0, SUBMITTED: 0, APPROVED: 0 };
    gadPlansByStatusData.forEach(item => {
      gadPlansByStatus[item.status] = item._count.id;
    });

    res.json({
      totalBeneficiaries,
      totalMale,
      totalFemale,
      totalPrograms,
      totalBudgetAllocated,
      totalBudgetUsed,
      byBarangay: Object.values(byBarangayMap),
      bySector: bySectorData.map(d => ({ sector: d.sector, count: d._count.id })),
      gadPlansByStatus,
      recentBeneficiaries
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
