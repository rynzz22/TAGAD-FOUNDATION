import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getBeneficiaries = async (req: Request, res: Response) => {
  const { sex, barangay, sector, year, page = '1', limit = '10' } = req.query;
  const p = parseInt(page as string);
  const l = parseInt(limit as string);

  try {
    const where: any = { isArchived: false };
    if (sex) where.sex = sex;
    if (barangay) where.barangay = barangay;
    if (sector) where.sector = sector;
    if (year) {
      const yearStart = new Date(`${year}-01-01`);
      const yearEnd = new Date(`${year}-12-31`);
      where.dateEncoded = { gte: yearStart, lte: yearEnd };
    }

    const total = await prisma.beneficiary.count({ where });
    const beneficiaries = await prisma.beneficiary.findMany({
      where,
      skip: (p - 1) * l,
      take: l,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      data: beneficiaries,
      pagination: {
        total,
        page: p,
        limit: l,
        totalPages: Math.ceil(total / l),
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBeneficiary = async (req: any, res: Response) => {
  try {
    const beneficiary = await prisma.beneficiary.create({
      data: {
        ...req.body,
        encodedBy: req.user.id,
      },
    });
    res.status(201).json(beneficiary);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBeneficiary = async (req: Request, res: Response) => {
  try {
    const beneficiary = await prisma.beneficiary.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(beneficiary);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const archiveBeneficiary = async (req: Request, res: Response) => {
  try {
    await prisma.beneficiary.update({
      where: { id: parseInt(req.params.id) },
      data: { isArchived: true },
    });
    res.json({ message: 'Beneficiary archived' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBeneficiaryStats = async (req: Request, res: Response) => {
  try {
    const totalMale = await prisma.beneficiary.count({ where: { sex: 'MALE', isArchived: false } });
    const totalFemale = await prisma.beneficiary.count({ where: { sex: 'FEMALE', isArchived: false } });
    
    // Aggregations aren't globally simple in SQLite without raw query or grouping
    const byBarangay = await prisma.beneficiary.groupBy({
      by: ['barangay'],
      where: { isArchived: false },
      _count: { id: true }
    });

    const bySector = await prisma.beneficiary.groupBy({
      by: ['sector'],
      where: { isArchived: false },
      _count: { id: true }
    });

    res.json({ totalMale, totalFemale, byBarangay, bySector });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
