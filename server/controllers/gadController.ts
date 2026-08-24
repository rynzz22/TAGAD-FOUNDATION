import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GAD Plan
export const getGADPlans = async (req: Request, res: Response) => {
  const { year, office, status } = req.query;
  try {
    const where: any = {};
    if (year) where.year = parseInt(year as string);
    if (office) where.office = office;
    if (status) where.status = status;
    const plans = await prisma.gADPlan.findMany({ 
      where, 
      include: { accomplishments: true },
      orderBy: { createdAt: 'desc' } 
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createGADPlan = async (req: Request, res: Response) => {
  try {
    const plan = await prisma.gADPlan.create({ data: req.body });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGADPlan = async (req: Request, res: Response) => {
  try {
    const plan = await prisma.gADPlan.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGADPlanStatus = async (req: Request, res: Response) => {
  try {
    const plan = await prisma.gADPlan.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status },
    });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteGADPlan = async (req: Request, res: Response) => {
  try {
    await prisma.gADPlan.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'GAD Plan deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Accomplishments
export const getAccomplishments = async (req: Request, res: Response) => {
  try {
    const accs = await prisma.gADAccomplishment.findMany({
      include: { gadPlan: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(accs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAccomplishment = async (req: Request, res: Response) => {
  try {
    const acc = await prisma.gADAccomplishment.create({ data: req.body });
    res.status(201).json(acc);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAccomplishment = async (req: Request, res: Response) => {
  try {
    const acc = await prisma.gADAccomplishment.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(acc);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAccomplishment = async (req: Request, res: Response) => {
  try {
    await prisma.gADAccomplishment.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Accomplishment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
