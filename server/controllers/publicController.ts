import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';
import { BeneficiaryService } from '../services/BeneficiaryService';
import { ProgramService } from '../services/ProgramService';
import { GADPlanService } from '../services/GADPlanService';
import { AccomplishmentService } from '../services/AccomplishmentService';
import { OfficeService } from '../services/OfficeService';
import { BarangayService } from '../services/BarangayService';
import { AuditService } from '../services/AuditService';
import { sendSuccess, sendError } from '../lib/response';

export const getPublicDashboard = async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const stats = await DashboardService.getPublicDashboardStats(year);
    return sendSuccess(res, stats);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getPublicDemographics = async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const barangayId = req.query.barangayId as string;
    const stats = await BeneficiaryService.getDemographicsAggregates({ year, barangayId });
    return sendSuccess(res, stats);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getPublicPrograms = async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const sector = req.query.sector as string;
    const programs = await ProgramService.getPublicPrograms({ year, sector });
    return sendSuccess(res, programs);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getPublicAccomplishments = async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const quarter = req.query.quarter ? parseInt(req.query.quarter as string, 10) : undefined;
    const accomplishments = await AccomplishmentService.getPublicAccomplishments({ year, quarter });
    return sendSuccess(res, accomplishments);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getPublicGADPlans = async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const officeId = req.query.officeId as string;
    const plans = await GADPlanService.getPublicGADPlans({ year, officeId });
    return sendSuccess(res, plans);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getPublicOffices = async (req: Request, res: Response) => {
  try {
    const offices = await OfficeService.getOffices(true);
    return sendSuccess(res, offices);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const getPublicBarangays = async (req: Request, res: Response) => {
  try {
    const barangays = await BarangayService.getBarangays();
    return sendSuccess(res, barangays);
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};

export const submitPublicFeedback = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    await AuditService.logAction({
      action: 'PUBLIC_FEEDBACK_SUBMITTED',
      entityType: 'Feedback',
      afterState: { name, email, subject, messageLength: message?.length },
      req,
    });
    return sendSuccess(res, { message: 'Feedback submitted successfully. Thank you for participating in Talibon GAD!' });
  } catch (error: any) {
    return sendError(res, error, error.statusCode || 500);
  }
};
