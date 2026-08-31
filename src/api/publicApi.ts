import api from './axios';
import {
  PublicDashboardData,
  PublicDemographicsData,
  PublicProgram,
  PublicAccomplishment,
  PublicGADPlan,
  PublicOffice,
  PublicBarangay,
  PublicFeedbackPayload,
} from '../types/public.types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp?: string;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export const publicApi = {
  /**
   * Fetch executive public dashboard metrics (summary, sector, barangay)
   */
  async getDashboard(year?: number): Promise<PublicDashboardData> {
    const params = year ? { year } : {};
    const res = await api.get<ApiResponse<PublicDashboardData>>('/public/dashboard', { params });
    return res.data.data;
  },

  /**
   * Fetch aggregated demographic metrics (zero PII)
   */
  async getDemographics(params?: { year?: number; barangayId?: string }): Promise<PublicDemographicsData> {
    const res = await api.get<ApiResponse<PublicDemographicsData>>('/public/demographics', { params });
    return res.data.data;
  },

  /**
   * Fetch public GAD programs (ACTIVE or COMPLETED)
   */
  async getPrograms(params?: { year?: number; sector?: string }): Promise<PublicProgram[]> {
    const res = await api.get<ApiResponse<PublicProgram[]>>('/public/programs', { params });
    return res.data.data;
  },

  /**
   * Fetch public GAD accomplishments feed
   */
  async getAccomplishments(params?: { year?: number; quarter?: number }): Promise<PublicAccomplishment[]> {
    const res = await api.get<ApiResponse<PublicAccomplishment[]>>('/public/accomplishments', { params });
    return res.data.data;
  },

  /**
   * Fetch public approved GAD plans with line items
   */
  async getGADPlans(params?: { year?: number; officeId?: string }): Promise<PublicGADPlan[]> {
    const res = await api.get<ApiResponse<PublicGADPlan[]>>('/public/gad-plans', { params });
    return res.data.data;
  },

  /**
   * Fetch list of municipal offices for filtering
   */
  async getOffices(): Promise<PublicOffice[]> {
    const res = await api.get<ApiResponse<PublicOffice[]>>('/public/offices');
    return res.data.data;
  },

  /**
   * Fetch list of 25 barangays for filtering
   */
  async getBarangays(): Promise<PublicBarangay[]> {
    const res = await api.get<ApiResponse<PublicBarangay[]>>('/public/barangays');
    return res.data.data;
  },

  /**
   * Submit citizen GAD inquiry or feedback
   */
  async submitFeedback(payload: PublicFeedbackPayload): Promise<{ message: string }> {
    const res = await api.post<ApiResponse<{ message: string }>>('/public/feedback', payload);
    return res.data.data;
  },
};
