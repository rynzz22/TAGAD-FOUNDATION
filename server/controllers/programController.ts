import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getPrograms = async (req: Request, res: Response) => {
  const { year, office, status } = req.query;
  try {
    const where: any = {};
    if (year) where.year = parseInt(year as string);
    if (office) where.office = office;
    if (status) where.status = status;
    const programs = await prisma.program.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProgram = async (req: Request, res: Response) => {
  try {
    const program = await prisma.program.create({ data: req.body });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const program = await prisma.program.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    await prisma.program.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Program deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
