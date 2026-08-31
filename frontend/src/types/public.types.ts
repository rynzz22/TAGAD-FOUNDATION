export interface PublicDashboardSummary {
  totalBeneficiaries: number;
  totalMale: number;
  totalFemale: number;
  femalePercentage: number;
  totalPrograms: number;
  totalBudgetAllocated: number;
  totalBudgetUsed: number;
  budgetUtilizationRate: number;
  fiscalYear: number;
}

export interface SectorCount {
  sector: string;
  count: number;
  percentage?: number;
}

export interface BarangayBreakdown {
  barangay: string;
  male: number;
  female: number;
  total: number;
}

export interface PublicDashboardData {
  summary: PublicDashboardSummary;
  bySector: SectorCount[];
  byBarangay: BarangayBreakdown[];
}

export interface DemographicsTotals {
  totalBeneficiaries: number;
  male: number;
  female: number;
  femalePercentage: number;
  malePercentage: number;
}

export interface PublicDemographicsData {
  totals: DemographicsTotals;
  bySector: SectorCount[];
  byBarangay: BarangayBreakdown[];
}

export interface PublicProgram {
  id: string;
  title: string;
  description: string | null;
  sector: string;
  fiscalYear: number;
  status: 'ACTIVE' | 'COMPLETED';
  budgetTarget: number;
  budgetActual: number;
  targetMale: number;
  targetFemale: number;
  actualMale: number;
  actualFemale: number;
  office: string;
  officeName: string;
}

export interface PublicAccomplishment {
  id: string;
  fiscalYear: number;
  quarter: number;
  activityTitle: string;
  office: string;
  actualOutput: string;
  actualBudgetUsed: number;
  actualMale: number;
  actualFemale: number;
  totalBeneficiaries: number;
  outputSummary: string | null;
}

export interface PublicGADPlanItem {
  id: string;
  genderIssue: string;
  gadResult: string;
  activity: string;
  performanceIndicator: string;
  targetGroup: string;
  timeline: string;
  responsibleOffice: string;
  budget: number;
  fundSource: string;
}

export interface PublicGADPlan {
  id: string;
  fiscalYear: number;
  office: string;
  officeName: string;
  totalBudget: number;
  gadBudget: number;
  status: string;
  items: PublicGADPlanItem[];
}

export interface PublicOffice {
  id: string;
  code: string;
  name: string;
}

export interface PublicBarangay {
  id: string;
  name: string;
  code: string;
  isIsland?: boolean;
}

export interface PublicFeedbackPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}
