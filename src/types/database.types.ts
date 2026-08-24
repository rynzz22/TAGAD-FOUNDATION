/**
 * TAGAD System — Generated / Synchronized Database Types
 * Corresponding to PostgreSQL / Supabase Schema (Sprint 1 Foundation)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole =
  | 'super_admin'
  | 'admin'
  | 'editor'
  | 'municipal_admin'
  | 'barangay_admin';

export type GADProgramStatus =
  | 'DRAFT'
  | 'PROPOSED'
  | 'APPROVED'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED';

export type BudgetStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REVISED';

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string;
          name: AppRole;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: AppRole;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: AppRole;
          description?: string | null;
          created_at?: string;
        };
      };
      offices: {
        Row: {
          id: string;
          code: string;
          name: string;
          head_name: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          head_name?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          head_name?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      barangays: {
        Row: {
          id: string;
          name: string;
          code: string;
          captain_name: string | null;
          gad_focal_person: string | null;
          contact_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          captain_name?: string | null;
          gad_focal_person?: string | null;
          contact_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          captain_name?: string | null;
          gad_focal_person?: string | null;
          contact_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string; // references auth.users
          email: string;
          full_name: string;
          office_id: string | null;
          barangay_id: string | null;
          is_active: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          office_id?: string | null;
          barangay_id?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          office_id?: string | null;
          barangay_id?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: AppRole;
          assigned_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: AppRole;
          assigned_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: AppRole;
          assigned_by?: string | null;
          created_at?: string;
        };
      };
      gad_programs: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          office_id: string;
          fiscal_year: number;
          status: GADProgramStatus;
          created_by: string;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          office_id: string;
          fiscal_year: number;
          status?: GADProgramStatus;
          created_by: string;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          office_id?: string;
          fiscal_year?: number;
          status?: GADProgramStatus;
          created_by?: string;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      gad_projects: {
        Row: {
          id: string;
          program_id: string;
          title: string;
          description: string | null;
          target_sector: string;
          created_by: string;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          title: string;
          description?: string | null;
          target_sector: string;
          created_by: string;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          title?: string;
          description?: string | null;
          target_sector?: string;
          created_by?: string;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      gad_activities: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          performance_indicator: string | null;
          target_male: number;
          target_female: number;
          timeline_start: string | null;
          timeline_end: string | null;
          created_by: string;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          performance_indicator?: string | null;
          target_male?: number;
          target_female?: number;
          timeline_start?: string | null;
          timeline_end?: string | null;
          created_by: string;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          performance_indicator?: string | null;
          target_male?: number;
          target_female?: number;
          timeline_start?: string | null;
          timeline_end?: string | null;
          created_by?: string;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          fiscal_year: number;
          total_lgu_budget: number;
          mandatory_gad_percentage: number;
          mandatory_gad_budget: number;
          status: BudgetStatus;
          created_by: string;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fiscal_year: number;
          total_lgu_budget: number;
          mandatory_gad_percentage?: number;
          mandatory_gad_budget: number;
          status?: BudgetStatus;
          created_by: string;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          fiscal_year?: number;
          total_lgu_budget?: number;
          mandatory_gad_percentage?: number;
          mandatory_gad_budget?: number;
          status?: BudgetStatus;
          created_by?: string;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_allocations: {
        Row: {
          id: string;
          budget_id: string;
          office_id: string;
          allocated_amount: number;
          fund_source: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          budget_id: string;
          office_id: string;
          allocated_amount: number;
          fund_source?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          budget_id?: string;
          office_id?: string;
          allocated_amount?: number;
          fund_source?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      expenditures: {
        Row: {
          id: string;
          activity_id: string;
          allocation_id: string | null;
          amount: number;
          or_number: string | null;
          disbursement_date: string;
          particulars: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          allocation_id?: string | null;
          amount: number;
          or_number?: string | null;
          disbursement_date: string;
          particulars?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          activity_id?: string;
          allocation_id?: string | null;
          amount?: number;
          or_number?: string | null;
          disbursement_date?: string;
          particulars?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      document_types: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          activity_id: string | null;
          document_type_id: string;
          file_name: string;
          storage_path: string;
          file_size: number;
          mime_type: string;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id?: string | null;
          document_type_id: string;
          file_name: string;
          storage_path: string;
          file_size: number;
          mime_type: string;
          uploaded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          activity_id?: string | null;
          document_type_id?: string;
          file_name?: string;
          storage_path?: string;
          file_size?: number;
          mime_type?: string;
          uploaded_by?: string;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_table: string;
          entity_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_table: string;
          entity_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_table?: string;
          entity_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
