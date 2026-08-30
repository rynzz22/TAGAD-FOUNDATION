import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { ProgramStatus } from '@prisma/client';

export const getPrograms = async (req: Request, res: Response) => {
  const { year, office, status } = req.query;
  try {
    const where: any = {};
    if (year) where.fiscalYear = parseInt(year as string);
    if (office) {
      where.office = { OR: [{ code: office as string }, { name: office as string }, { id: office as string }] };
    }
    if (status) where.status = status as ProgramStatus;

    const programs = await prisma.program.findMany({
      where,
      include: {
        office: true,
        accomplishments: { include: { attachments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = programs.map(p => ({
      ...p,
      budget: Number(p.budgetTarget),
      year: p.fiscalYear,
      office: p.office?.code || p.officeId,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProgram = async (req: Request, res: Response) => {
  try {
    const { title, description, office, officeId, sector, budget, budgetTarget, year, fiscalYear, status, targetMale, targetFemale, actualMale, actualFemale } = req.body;

    let resolvedOfficeId = officeId;
    if (!resolvedOfficeId && office) {
      const foundOffice = await prisma.office.findFirst({
        where: { OR: [{ code: office }, { name: office }] }
      });
      if (foundOffice) resolvedOfficeId = foundOffice.id;
    }

    if (!resolvedOfficeId) {
      const defaultOffice = await prisma.office.findFirst();
      resolvedOfficeId = defaultOffice?.id;
    }

    const program = await prisma.program.create({
      data: {
        title,
        description,
        sector: sector || 'General',
        fiscalYear: parseInt(year || fiscalYear || new Date().getFullYear().toString()),
        officeId: resolvedOfficeId!,
        budgetTarget: parseFloat(budgetTarget || budget || '0'),
        budgetActual: 0,
        status: (status as ProgramStatus) || ProgramStatus.ACTIVE,
        targetMale: parseInt(targetMale || '0'),
        targetFemale: parseInt(targetFemale || '0'),
        actualMale: parseInt(actualMale || '0'),
        actualFemale: parseInt(actualFemale || '0'),
      },
      include: { office: true }
    });

    res.status(201).json({
      ...program,
      budget: Number(program.budgetTarget),
      year: program.fiscalYear,
      office: program.office?.code || program.officeId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const { title, description, office, officeId, sector, budget, budgetTarget, year, fiscalYear, status, targetMale, targetFemale, actualMale, actualFemale } = req.body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (sector !== undefined) data.sector = sector;
    if (year !== undefined || fiscalYear !== undefined) data.fiscalYear = parseInt(year || fiscalYear);
    if (budget !== undefined || budgetTarget !== undefined) data.budgetTarget = parseFloat(budgetTarget || budget);
    if (status !== undefined) data.status = status as ProgramStatus;
    if (targetMale !== undefined) data.targetMale = parseInt(targetMale);
    if (targetFemale !== undefined) data.targetFemale = parseInt(targetFemale);
    if (actualMale !== undefined) data.actualMale = parseInt(actualMale);
    if (actualFemale !== undefined) data.actualFemale = parseInt(actualFemale);

    if (officeId) {
      data.officeId = officeId;
    } else if (office) {
      const foundOffice = await prisma.office.findFirst({
        where: { OR: [{ code: office }, { name: office }] }
      });
      if (foundOffice) data.officeId = foundOffice.id;
    }

    const program = await prisma.program.update({
      where: { id: String(req.params.id) },
      data,
      include: { office: true }
    });

    res.json({
      ...program,
      budget: Number(program.budgetTarget),
      year: program.fiscalYear,
      office: program.office?.code || program.officeId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    await prisma.program.delete({ where: { id: String(req.params.id) } });
    res.json({ message: 'Program deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
