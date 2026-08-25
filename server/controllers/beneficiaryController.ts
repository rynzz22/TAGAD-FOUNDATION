import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { Sex } from '@prisma/client';

export const getBeneficiaries = async (req: Request, res: Response) => {
  const { sex, barangay, sector, year, page = '1', limit = '10' } = req.query;
  const p = parseInt(page as string);
  const l = parseInt(limit as string);

  try {
    const where: any = { isArchived: false };
    if (sex) where.sex = sex as Sex;
    if (barangay) {
      where.barangay = { OR: [{ name: barangay as string }, { code: barangay as string }, { id: barangay as string }] };
    }
    if (sector) where.sector = sector as string;
    if (year) {
      const yearStart = new Date(`${year}-01-01`);
      const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`);
      where.createdAt = { gte: yearStart, lte: yearEnd };
    }

    const total = await prisma.beneficiary.count({ where });
    const beneficiaries = await prisma.beneficiary.findMany({
      where,
      include: {
        barangay: true,
        office: true,
      },
      skip: (p - 1) * l,
      take: l,
      orderBy: { createdAt: 'desc' },
    });

    const formatted = beneficiaries.map(b => ({
      ...b,
      barangay: b.barangay.name,
      office: b.office?.code || b.officeId || '',
      program: 'General GAD',
      dateEncoded: b.createdAt,
      encodedBy: b.encodedById,
    }));

    res.json({
      data: formatted,
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
    const {
      firstName,
      lastName,
      middleName,
      sex,
      age,
      barangay,
      barangayId,
      sector,
      office,
      officeId,
      contactNumber,
      addressStreet
    } = req.body;

    let resolvedBarangayId = barangayId;
    if (!resolvedBarangayId && barangay) {
      const foundBrgy = await prisma.barangay.findFirst({
        where: { OR: [{ name: barangay }, { code: barangay }] }
      });
      if (foundBrgy) resolvedBarangayId = foundBrgy.id;
    }

    if (!resolvedBarangayId) {
      const defaultBrgy = await prisma.barangay.findFirst();
      resolvedBarangayId = defaultBrgy?.id;
    }

    let resolvedOfficeId = officeId;
    if (!resolvedOfficeId && office) {
      const foundOffice = await prisma.office.findFirst({
        where: { OR: [{ code: office }, { name: office }] }
      });
      if (foundOffice) resolvedOfficeId = foundOffice.id;
    }

    const beneficiary = await prisma.beneficiary.create({
      data: {
        firstName,
        lastName,
        middleName: middleName || null,
        sex: (sex?.toUpperCase() as Sex) || Sex.FEMALE,
        age: parseInt(age || '0'),
        sector: sector || 'General',
        barangayId: resolvedBarangayId!,
        officeId: resolvedOfficeId,
        contactNumber: contactNumber || null,
        addressStreet: addressStreet || null,
        encodedById: req.user?.id || null,
      },
      include: {
        barangay: true,
        office: true,
      }
    });

    res.status(201).json({
      ...beneficiary,
      barangay: beneficiary.barangay.name,
      office: beneficiary.office?.code || beneficiary.officeId || '',
      dateEncoded: beneficiary.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBeneficiary = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      sex,
      age,
      barangay,
      barangayId,
      sector,
      contactNumber,
      addressStreet
    } = req.body;

    const data: any = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (middleName !== undefined) data.middleName = middleName;
    if (sex !== undefined) data.sex = sex.toUpperCase() as Sex;
    if (age !== undefined) data.age = parseInt(age);
    if (sector !== undefined) data.sector = sector;
    if (contactNumber !== undefined) data.contactNumber = contactNumber;
    if (addressStreet !== undefined) data.addressStreet = addressStreet;

    if (barangayId) {
      data.barangayId = barangayId;
    } else if (barangay) {
      const foundBrgy = await prisma.barangay.findFirst({
        where: { OR: [{ name: barangay }, { code: barangay }] }
      });
      if (foundBrgy) data.barangayId = foundBrgy.id;
    }

    const beneficiary = await prisma.beneficiary.update({
      where: { id: String(req.params.id) },
      data,
      include: { barangay: true, office: true }
    });

    res.json({
      ...beneficiary,
      barangay: beneficiary.barangay.name,
      office: beneficiary.office?.code || beneficiary.officeId || '',
      dateEncoded: beneficiary.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const archiveBeneficiary = async (req: Request, res: Response) => {
  try {
    await prisma.beneficiary.update({
      where: { id: String(req.params.id) },
      data: { isArchived: true },
    });
    res.json({ message: 'Beneficiary archived' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBeneficiaryStats = async (req: Request, res: Response) => {
  try {
    const totalMale = await prisma.beneficiary.count({ where: { sex: Sex.MALE, isArchived: false } });
    const totalFemale = await prisma.beneficiary.count({ where: { sex: Sex.FEMALE, isArchived: false } });
    
    const byBarangayData = await prisma.beneficiary.groupBy({
      by: ['barangayId'],
      where: { isArchived: false },
      _count: { id: true }
    });

    const barangays = await prisma.barangay.findMany();
    const brgyMap = new Map(barangays.map(b => [b.id, b.name]));

    const byBarangay = byBarangayData.map(b => ({
      barangay: brgyMap.get(b.barangayId) || 'Unknown',
      _count: b._count
    }));

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
