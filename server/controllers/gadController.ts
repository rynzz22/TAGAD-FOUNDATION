import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { GADPlanStatus } from '@prisma/client';

// GAD Plans
export const getGADPlans = async (req: Request, res: Response) => {
  const { year, office, status } = req.query;
  try {
    const where: any = {};
    if (year) where.fiscalYear = parseInt(year as string);
    if (office) {
      where.office = { OR: [{ code: office as string }, { name: office as string }, { id: office as string }] };
    }
    if (status) where.status = status as GADPlanStatus;

    const plans = await prisma.gADPlan.findMany({ 
      where, 
      include: {
        office: true,
        items: {
          include: {
            program: true,
            accomplishments: { include: { attachments: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' } 
    });

    // Format for legacy/client compatibility
    const formatted = plans.flatMap(plan => {
      if (plan.items.length === 0) {
        return [{
          id: plan.id,
          year: plan.fiscalYear,
          office: plan.office.code || plan.office.name,
          genderIssue: '',
          causeOfIssue: '',
          gadResult: '',
          activity: '',
          performanceIndicator: '',
          targetGroup: '',
          timeline: '',
          responsibleOffice: plan.office.code || plan.office.name,
          budget: Number(plan.gadBudget),
          fundSource: 'General Fund (5% GAD)',
          status: plan.status,
          accomplishments: [],
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        }];
      }

      return plan.items.map(item => ({
        id: item.id,
        planId: plan.id,
        year: plan.fiscalYear,
        office: plan.office.code || plan.office.name,
        genderIssue: item.genderIssue,
        causeOfIssue: item.causeOfIssue || '',
        gadResult: item.gadResult,
        activity: item.activity,
        performanceIndicator: item.performanceIndicator,
        targetGroup: item.targetGroup,
        timeline: item.timeline,
        responsibleOffice: item.responsibleOffice,
        budget: Number(item.budget),
        fundSource: item.fundSource,
        status: plan.status,
        accomplishments: item.accomplishments.map(acc => ({
          ...acc,
          actualBudgetUsed: Number(acc.actualBudgetUsed),
        })),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createGADPlan = async (req: Request, res: Response) => {
  try {
    const {
      year,
      fiscalYear,
      office,
      officeId,
      genderIssue,
      causeOfIssue,
      gadResult,
      activity,
      performanceIndicator,
      targetGroup,
      timeline,
      responsibleOffice,
      budget,
      fundSource,
      status
    } = req.body;

    const fYear = parseInt(year || fiscalYear || new Date().getFullYear().toString());
    
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

    const itemBudget = parseFloat(budget || '0');

    // Upsert or find the parent GADPlan
    let plan = await prisma.gADPlan.findFirst({
      where: { officeId: resolvedOfficeId!, fiscalYear: fYear },
      include: { office: true }
    });

    if (!plan) {
      plan = await prisma.gADPlan.create({
        data: {
          officeId: resolvedOfficeId!,
          fiscalYear: fYear,
          gadBudget: itemBudget,
          totalBudget: itemBudget * 20, // Estimated 5% baseline
          status: (status as GADPlanStatus) || GADPlanStatus.DRAFT,
        },
        include: { office: true }
      });
    } else {
      await prisma.gADPlan.update({
        where: { id: plan.id },
        data: { gadBudget: { increment: itemBudget } }
      });
    }

    // Create item
    const item = await prisma.gADPlanItem.create({
      data: {
        gadPlanId: plan.id,
        genderIssue: genderIssue || 'Not Specified',
        causeOfIssue: causeOfIssue || '',
        gadResult: gadResult || '',
        activity: activity || '',
        performanceIndicator: performanceIndicator || '',
        targetGroup: targetGroup || '',
        timeline: timeline || '',
        responsibleOffice: responsibleOffice || plan.office.code || plan.office.name,
        budget: itemBudget,
        fundSource: fundSource || 'General Fund (5% GAD)',
      }
    });

    res.status(201).json({
      id: item.id,
      planId: plan.id,
      year: plan.fiscalYear,
      office: plan.office.code || plan.office.name,
      genderIssue: item.genderIssue,
      causeOfIssue: item.causeOfIssue,
      gadResult: item.gadResult,
      activity: item.activity,
      performanceIndicator: item.performanceIndicator,
      targetGroup: item.targetGroup,
      timeline: item.timeline,
      responsibleOffice: item.responsibleOffice,
      budget: Number(item.budget),
      fundSource: item.fundSource,
      status: plan.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGADPlan = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const {
      genderIssue,
      causeOfIssue,
      gadResult,
      activity,
      performanceIndicator,
      targetGroup,
      timeline,
      responsibleOffice,
      budget,
      fundSource,
      status
    } = req.body;

    // Check if it's an item or a plan header
    const existingItem = await prisma.gADPlanItem.findUnique({
      where: { id },
      include: { gadPlan: { include: { office: true } } }
    });

    if (existingItem) {
      const updateData: any = {};
      if (genderIssue !== undefined) updateData.genderIssue = genderIssue;
      if (causeOfIssue !== undefined) updateData.causeOfIssue = causeOfIssue;
      if (gadResult !== undefined) updateData.gadResult = gadResult;
      if (activity !== undefined) updateData.activity = activity;
      if (performanceIndicator !== undefined) updateData.performanceIndicator = performanceIndicator;
      if (targetGroup !== undefined) updateData.targetGroup = targetGroup;
      if (timeline !== undefined) updateData.timeline = timeline;
      if (responsibleOffice !== undefined) updateData.responsibleOffice = responsibleOffice;
      if (budget !== undefined) updateData.budget = parseFloat(budget);
      if (fundSource !== undefined) updateData.fundSource = fundSource;

      const updatedItem = await prisma.gADPlanItem.update({
        where: { id },
        data: updateData,
        include: { gadPlan: { include: { office: true } } }
      });

      if (status !== undefined) {
        await prisma.gADPlan.update({
          where: { id: updatedItem.gadPlanId },
          data: { status: status as GADPlanStatus }
        });
      }

      return res.json({
        id: updatedItem.id,
        planId: updatedItem.gadPlanId,
        year: updatedItem.gadPlan.fiscalYear,
        office: updatedItem.gadPlan.office.code || updatedItem.gadPlan.office.name,
        genderIssue: updatedItem.genderIssue,
        causeOfIssue: updatedItem.causeOfIssue,
        gadResult: updatedItem.gadResult,
        activity: updatedItem.activity,
        performanceIndicator: updatedItem.performanceIndicator,
        targetGroup: updatedItem.targetGroup,
        timeline: updatedItem.timeline,
        responsibleOffice: updatedItem.responsibleOffice,
        budget: Number(updatedItem.budget),
        fundSource: updatedItem.fundSource,
        status: status || updatedItem.gadPlan.status,
        createdAt: updatedItem.createdAt,
        updatedAt: updatedItem.updatedAt,
      });
    }

    // Otherwise update plan header
    const updatedPlan = await prisma.gADPlan.update({
      where: { id },
      data: { status: status as GADPlanStatus },
      include: { office: true }
    });

    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGADPlanStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    const existingItem = await prisma.gADPlanItem.findUnique({
      where: { id },
      select: { gadPlanId: true }
    });

    const targetPlanId = existingItem ? existingItem.gadPlanId : id;

    const plan = await prisma.gADPlan.update({
      where: { id: targetPlanId },
      data: { status: status as GADPlanStatus },
    });

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteGADPlan = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    
    // Check if it's an item
    const item = await prisma.gADPlanItem.findUnique({ where: { id } });
    if (item) {
      await prisma.gADPlanItem.delete({ where: { id } });
      return res.json({ message: 'GAD Plan item deleted' });
    }

    await prisma.gADPlan.delete({ where: { id } });
    res.json({ message: 'GAD Plan deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Accomplishments
export const getAccomplishments = async (req: Request, res: Response) => {
  try {
    const accs = await prisma.gADAccomplishment.findMany({
      include: {
        program: { include: { office: true } },
        gadPlanItem: { include: { gadPlan: { include: { office: true } } } },
        attachments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = accs.map(acc => ({
      ...acc,
      actualBudgetUsed: Number(acc.actualBudgetUsed),
      actualBeneficiaryMale: acc.actualMale,
      actualBeneficiaryFemale: acc.actualFemale,
      gadPlan: acc.gadPlanItem ? {
        id: acc.gadPlanItem.id,
        year: acc.gadPlanItem.gadPlan.fiscalYear,
        office: acc.gadPlanItem.gadPlan.office.code || acc.gadPlanItem.gadPlan.office.name,
        activity: acc.gadPlanItem.activity,
        performanceIndicator: acc.gadPlanItem.performanceIndicator,
        budget: Number(acc.gadPlanItem.budget),
      } : (acc.program ? {
        id: acc.program.id,
        year: acc.program.fiscalYear,
        office: acc.program.office.code || acc.program.office.name,
        activity: acc.program.title,
        performanceIndicator: acc.program.description,
        budget: Number(acc.program.budgetTarget),
      } : null)
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAccomplishment = async (req: Request, res: Response) => {
  try {
    const {
      gadPlanId,
      programId,
      actualOutput,
      actualBeneficiaryMale,
      actualBeneficiaryFemale,
      actualBudgetUsed,
      remarks,
      quarter,
      fiscalYear
    } = req.body;

    let targetPlanItemId: string | null = null;
    let targetProgramId: string | null = programId || null;

    if (gadPlanId) {
      // Check if gadPlanId points to a plan item or program
      const planItem = await prisma.gADPlanItem.findUnique({ where: { id: String(gadPlanId) } });
      if (planItem) {
        targetPlanItemId = planItem.id;
        targetProgramId = planItem.programId;
      } else {
        const program = await prisma.program.findUnique({ where: { id: String(gadPlanId) } });
        if (program) {
          targetProgramId = program.id;
        }
      }
    }

    const acc = await prisma.gADAccomplishment.create({
      data: {
        gadPlanItemId: targetPlanItemId,
        programId: targetProgramId,
        fiscalYear: parseInt(fiscalYear || new Date().getFullYear().toString()),
        quarter: quarter ? parseInt(quarter) : 1,
        actualOutput: actualOutput || '',
        actualMale: parseInt(actualBeneficiaryMale || '0'),
        actualFemale: parseInt(actualBeneficiaryFemale || '0'),
        actualBudgetUsed: parseFloat(actualBudgetUsed || '0'),
        remarks: remarks || '',
      },
      include: {
        program: true,
        gadPlanItem: true,
        attachments: true
      }
    });

    res.status(201).json({
      ...acc,
      actualBudgetUsed: Number(acc.actualBudgetUsed),
      actualBeneficiaryMale: acc.actualMale,
      actualBeneficiaryFemale: acc.actualFemale,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAccomplishment = async (req: Request, res: Response) => {
  try {
    const {
      actualOutput,
      actualBeneficiaryMale,
      actualBeneficiaryFemale,
      actualBudgetUsed,
      remarks,
      quarter
    } = req.body;

    const data: any = {};
    if (actualOutput !== undefined) data.actualOutput = actualOutput;
    if (actualBeneficiaryMale !== undefined) data.actualMale = parseInt(actualBeneficiaryMale);
    if (actualBeneficiaryFemale !== undefined) data.actualFemale = parseInt(actualBeneficiaryFemale);
    if (actualBudgetUsed !== undefined) data.actualBudgetUsed = parseFloat(actualBudgetUsed);
    if (remarks !== undefined) data.remarks = remarks;
    if (quarter !== undefined) data.quarter = parseInt(quarter);

    const acc = await prisma.gADAccomplishment.update({
      where: { id: String(req.params.id) },
      data,
    });

    res.json({
      ...acc,
      actualBudgetUsed: Number(acc.actualBudgetUsed),
      actualBeneficiaryMale: acc.actualMale,
      actualBeneficiaryFemale: acc.actualFemale,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAccomplishment = async (req: Request, res: Response) => {
  try {
    await prisma.gADAccomplishment.delete({ where: { id: String(req.params.id) } });
    res.json({ message: 'Accomplishment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
