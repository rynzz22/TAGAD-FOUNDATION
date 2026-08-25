import prisma from '../lib/prisma';
import { Role } from '@prisma/client';
import { NotFoundError, OfficeScopeError } from '../lib/errors';
import { AuditService } from './AuditService';
import { Request } from 'express';

export class AccomplishmentService {
  public static async getAccomplishments(
    params: {
      year?: number;
      quarter?: number;
      programId?: string;
      officeId?: string;
    },
    actorUser?: { id: string; role: Role; officeId: string | null }
  ) {
    const where: any = {};

    if (params.year) {
      where.fiscalYear = Number(params.year);
    }
    if (params.quarter) {
      where.quarter = Number(params.quarter);
    }
    if (params.programId) {
      where.programId = params.programId;
    }

    if (actorUser && actorUser.role === Role.ENCODER && actorUser.officeId) {
      where.OR = [
        { program: { officeId: actorUser.officeId } },
        { gadPlanItem: { gadPlan: { officeId: actorUser.officeId } } },
      ];
    } else if (params.officeId) {
      where.OR = [
        { program: { officeId: params.officeId } },
        { gadPlanItem: { gadPlan: { officeId: params.officeId } } },
      ];
    }

    const accs = await prisma.gADAccomplishment.findMany({
      where,
      include: {
        program: { include: { office: true } },
        gadPlanItem: { include: { gadPlan: { include: { office: true } } } },
        attachments: true,
        createdBy: { select: { id: true, fullName: true } },
      },
      orderBy: [{ fiscalYear: 'desc' }, { quarter: 'desc' }, { createdAt: 'desc' }],
    });

    return accs.map((acc) => ({
      ...acc,
      actualBudgetUsed: Number(acc.actualBudgetUsed),
      actualBeneficiaryMale: acc.actualMale,
      actualBeneficiaryFemale: acc.actualFemale,
      createdByName: acc.createdBy?.fullName || 'System',
      gadPlan: acc.gadPlanItem
        ? {
            id: acc.gadPlanItem.id,
            year: acc.gadPlanItem.gadPlan.fiscalYear,
            office: acc.gadPlanItem.gadPlan.office.code || acc.gadPlanItem.gadPlan.office.name,
            activity: acc.gadPlanItem.activity,
            performanceIndicator: acc.gadPlanItem.performanceIndicator,
            budget: Number(acc.gadPlanItem.budget),
          }
        : acc.program
        ? {
            id: acc.program.id,
            year: acc.program.fiscalYear,
            office: acc.program.office.code || acc.program.office.name,
            activity: acc.program.title,
            performanceIndicator: acc.program.description || 'Target Program',
            budget: Number(acc.program.budgetTarget),
          }
        : null,
    }));
  }

  public static async createAccomplishment(
    data: any,
    actorUser: { id: string; role: Role; officeId: string | null },
    req?: Request
  ) {
    let targetPlanItemId: string | null = null;
    let targetProgramId: string | null = data.programId || null;

    if (data.gadPlanId) {
      const planItem = await prisma.gADPlanItem.findUnique({
        where: { id: String(data.gadPlanId) },
        include: { gadPlan: true },
      });

      if (planItem) {
        if (actorUser.role === Role.ENCODER && planItem.gadPlan.officeId !== actorUser.officeId) {
          throw new OfficeScopeError('Encoders can only encode accomplishments for their own office');
        }
        targetPlanItemId = planItem.id;
        targetProgramId = planItem.programId;
      } else {
        const program = await prisma.program.findUnique({ where: { id: String(data.gadPlanId) } });
        if (program) {
          if (actorUser.role === Role.ENCODER && program.officeId !== actorUser.officeId) {
            throw new OfficeScopeError('Encoders can only encode accomplishments for their own office');
          }
          targetProgramId = program.id;
        }
      }
    }

    if (targetProgramId && actorUser.role === Role.ENCODER) {
      const program = await prisma.program.findUnique({ where: { id: targetProgramId } });
      if (program && program.officeId !== actorUser.officeId) {
        throw new OfficeScopeError('Encoders cannot attach accomplishments to other offices\' programs');
      }
    }

    const acc = await prisma.gADAccomplishment.create({
      data: {
        gadPlanItemId: targetPlanItemId,
        programId: targetProgramId,
        fiscalYear: parseInt(String(data.fiscalYear || data.year || new Date().getFullYear()), 10),
        quarter: data.quarter ? parseInt(String(data.quarter), 10) : 1,
        actualOutput: data.actualOutput.trim(),
        actualMale: parseInt(String(data.actualMale || data.actualBeneficiaryMale || '0'), 10),
        actualFemale: parseInt(String(data.actualFemale || data.actualBeneficiaryFemale || '0'), 10),
        actualBudgetUsed: parseFloat(String(data.actualBudgetUsed || '0')),
        outputSummary: data.outputSummary || null,
        remarks: data.remarks || null,
        varianceExplanation: data.varianceExplanation || null,
        createdById: actorUser.id,
      },
      include: {
        program: { include: { office: true } },
        gadPlanItem: { include: { gadPlan: { include: { office: true } } } },
        attachments: true,
      },
    });

    await AuditService.logAction({
      userId: actorUser.id,
      action: 'ACCOMPLISHMENT_CREATED',
      entityType: 'GADAccomplishment',
      entityId: acc.id,
      afterState: { id: acc.id, actualOutput: acc.actualOutput, actualBudgetUsed: Number(acc.actualBudgetUsed) },
      req,
    });

    return {
      ...acc,
      actualBudgetUsed: Number(acc.actualBudgetUsed),
      actualBeneficiaryMale: acc.actualMale,
      actualBeneficiaryFemale: acc.actualFemale,
    };
  }

  public static async updateAccomplishment(
    id: string,
    data: any,
    actorUser: { id: string; role: Role; officeId: string | null },
    req?: Request
  ) {
    const existing = await prisma.gADAccomplishment.findUnique({
      where: { id },
      include: {
        program: true,
        gadPlanItem: { include: { gadPlan: true } },
      },
    });

    if (!existing) {
      throw new NotFoundError('Accomplishment');
    }

    if (actorUser.role === Role.ENCODER) {
      const officeId = existing.program?.officeId || existing.gadPlanItem?.gadPlan?.officeId;
      if (officeId && officeId !== actorUser.officeId) {
        throw new OfficeScopeError('Encoders cannot modify accomplishments of other offices');
      }
    }

    const updateData: any = {};
    if (data.actualOutput !== undefined) updateData.actualOutput = data.actualOutput.trim();
    if (data.actualMale !== undefined || data.actualBeneficiaryMale !== undefined) {
      updateData.actualMale = parseInt(String(data.actualMale || data.actualBeneficiaryMale), 10);
    }
    if (data.actualFemale !== undefined || data.actualBeneficiaryFemale !== undefined) {
      updateData.actualFemale = parseInt(String(data.actualFemale || data.actualBeneficiaryFemale), 10);
    }
    if (data.actualBudgetUsed !== undefined) {
      updateData.actualBudgetUsed = parseFloat(String(data.actualBudgetUsed));
    }
    if (data.outputSummary !== undefined) updateData.outputSummary = data.outputSummary;
    if (data.remarks !== undefined) updateData.remarks = data.remarks;
    if (data.varianceExplanation !== undefined) updateData.varianceExplanation = data.varianceExplanation;
    if (data.quarter !== undefined) updateData.quarter = parseInt(String(data.quarter), 10);

    const updated = await prisma.gADAccomplishment.update({
      where: { id },
      data: updateData,
      include: {
        program: { include: { office: true } },
        gadPlanItem: { include: { gadPlan: { include: { office: true } } } },
        attachments: true,
      },
    });

    await AuditService.logAction({
      userId: actorUser.id,
      action: 'ACCOMPLISHMENT_UPDATED',
      entityType: 'GADAccomplishment',
      entityId: id,
      beforeState: { id: existing.id, actualOutput: existing.actualOutput },
      afterState: { id: updated.id, actualOutput: updated.actualOutput },
      req,
    });

    return {
      ...updated,
      actualBudgetUsed: Number(updated.actualBudgetUsed),
      actualBeneficiaryMale: updated.actualMale,
      actualBeneficiaryFemale: updated.actualFemale,
    };
  }

  public static async deleteAccomplishment(
    id: string,
    actorUser: { id: string; role: Role; officeId: string | null },
    req?: Request
  ) {
    const existing = await prisma.gADAccomplishment.findUnique({
      where: { id },
      include: {
        program: true,
        gadPlanItem: { include: { gadPlan: true } },
      },
    });

    if (!existing) {
      throw new NotFoundError('Accomplishment');
    }

    if (actorUser.role === Role.ENCODER) {
      const officeId = existing.program?.officeId || existing.gadPlanItem?.gadPlan?.officeId;
      if (officeId && officeId !== actorUser.officeId) {
        throw new OfficeScopeError('Encoders cannot delete accomplishments of other offices');
      }
    }

    await prisma.gADAccomplishment.delete({ where: { id } });

    await AuditService.logAction({
      userId: actorUser.id,
      action: 'ACCOMPLISHMENT_DELETED',
      entityType: 'GADAccomplishment',
      entityId: id,
      beforeState: existing,
      req,
    });

    return { message: 'Accomplishment record deleted' };
  }

  /**
   * Public accomplishment feed with zero PII
   */
  public static async getPublicAccomplishments(params?: { year?: number; quarter?: number }) {
    const where: any = {};
    if (params?.year) where.fiscalYear = Number(params.year);
    if (params?.quarter) where.quarter = Number(params.quarter);

    const accomplishments = await prisma.gADAccomplishment.findMany({
      where,
      select: {
        id: true,
        fiscalYear: true,
        quarter: true,
        actualOutput: true,
        actualMale: true,
        actualFemale: true,
        actualBudgetUsed: true,
        outputSummary: true,
        program: {
          select: {
            id: true,
            title: true,
            sector: true,
            office: { select: { code: true, name: true } },
          },
        },
        gadPlanItem: {
          select: {
            id: true,
            activity: true,
            responsibleOffice: true,
          },
        },
      },
      orderBy: [{ fiscalYear: 'desc' }, { quarter: 'desc' }],
    });

    return accomplishments.map((a) => ({
      id: a.id,
      fiscalYear: a.fiscalYear,
      quarter: a.quarter,
      activityTitle: a.gadPlanItem?.activity || a.program?.title || 'GAD Project Activity',
      office: a.program?.office?.name || a.gadPlanItem?.responsibleOffice || 'LGU Talibon',
      actualOutput: a.actualOutput,
      actualBudgetUsed: Number(a.actualBudgetUsed),
      actualMale: a.actualMale,
      actualFemale: a.actualFemale,
      totalBeneficiaries: a.actualMale + a.actualFemale,
      outputSummary: a.outputSummary,
    }));
  }
}
