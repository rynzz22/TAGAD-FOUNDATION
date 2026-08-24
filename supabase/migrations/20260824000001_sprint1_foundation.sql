-- ==============================================================================
-- TAGAD SYSTEM — SPRINT 1 FOUNDATION & SYSTEM CORE MIGRATION
-- Project: Talibon Analytics for Gender and Development (TAGAD)
-- Target: Supabase / PostgreSQL
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. ENUMS
-- ------------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE app_role AS ENUM (
    'super_admin',
    'admin',
    'editor',
    'municipal_admin',
    'barangay_admin'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE gad_program_status AS ENUM (
    'DRAFT',
    'PROPOSED',
    'APPROVED',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE budget_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'REVISED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. ADMINISTRATIVE & ORGANIZATIONAL TABLES
-- ------------------------------------------------------------------------------

-- Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name app_role UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Offices Table (LGU Departments & Implementing Units)
CREATE TABLE IF NOT EXISTS public.offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  head_name VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Barangays Table (25 Barangays of Talibon)
CREATE TABLE IF NOT EXISTS public.barangays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  captain_name VARCHAR(255),
  gad_focal_person VARCHAR(255),
  contact_number VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  office_id UUID REFERENCES public.offices(id) ON DELETE SET NULL,
  barangay_id UUID REFERENCES public.barangays(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Roles Table (Many-to-Many RBAC Mapping)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_role_unique UNIQUE (user_id, role)
);

-- ------------------------------------------------------------------------------
-- 3. GAD CORE TABLES
-- ------------------------------------------------------------------------------

-- GAD Programs
CREATE TABLE IF NOT EXISTS public.gad_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  office_id UUID NOT NULL REFERENCES public.offices(id) ON DELETE RESTRICT,
  fiscal_year INT NOT NULL,
  status gad_program_status NOT NULL DEFAULT 'DRAFT',
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GAD Projects
CREATE TABLE IF NOT EXISTS public.gad_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.gad_programs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_sector VARCHAR(100) NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GAD Activities (Sex-Disaggregated Indicators & Timelines)
CREATE TABLE IF NOT EXISTS public.gad_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.gad_projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  performance_indicator TEXT,
  target_male INT NOT NULL DEFAULT 0,
  target_female INT NOT NULL DEFAULT 0,
  timeline_start DATE,
  timeline_end DATE,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. FINANCIAL & BUDGET TABLES
-- ------------------------------------------------------------------------------

-- Annual Budgets (Mandatory 5% Statutory GAD Allocation)
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fiscal_year INT UNIQUE NOT NULL,
  total_lgu_budget NUMERIC(14, 2) NOT NULL CHECK (total_lgu_budget >= 0),
  mandatory_gad_percentage NUMERIC(5, 2) NOT NULL DEFAULT 5.00 CHECK (mandatory_gad_percentage >= 5.00),
  mandatory_gad_budget NUMERIC(14, 2) NOT NULL CHECK (mandatory_gad_budget >= 0),
  status budget_status NOT NULL DEFAULT 'DRAFT',
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Budget Allocations per Implementing Office
CREATE TABLE IF NOT EXISTS public.budget_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  office_id UUID NOT NULL REFERENCES public.offices(id) ON DELETE RESTRICT,
  allocated_amount NUMERIC(14, 2) NOT NULL CHECK (allocated_amount >= 0),
  fund_source VARCHAR(100) NOT NULL DEFAULT 'General Fund (5% GAD)',
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expenditures & Disbursed Vouchers
CREATE TABLE IF NOT EXISTS public.expenditures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.gad_activities(id) ON DELETE CASCADE,
  allocation_id UUID REFERENCES public.budget_allocations(id) ON DELETE SET NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  or_number VARCHAR(100),
  disbursement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  particulars TEXT,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. DOCUMENTATION & ATTACHMENTS TABLES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.document_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES public.gad_activities(id) ON DELETE CASCADE,
  document_type_id UUID NOT NULL REFERENCES public.document_types(id) ON DELETE RESTRICT,
  file_name VARCHAR(255) NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_table VARCHAR(100) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. INDEXES FOR QUERY OPTIMIZATION
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_users_office ON public.users(office_id);
CREATE INDEX IF NOT EXISTS idx_users_barangay ON public.users(barangay_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_gad_programs_year_office ON public.gad_programs(fiscal_year, office_id);
CREATE INDEX IF NOT EXISTS idx_gad_projects_program ON public.gad_projects(program_id);
CREATE INDEX IF NOT EXISTS idx_gad_activities_project ON public.gad_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_budgets_year ON public.budgets(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_budget_allocations_budget ON public.budget_allocations(budget_id);
CREATE INDEX IF NOT EXISTS idx_expenditures_activity ON public.expenditures(activity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON public.audit_logs(user_id, action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 8. TRIGGER FUNCTIONS (AUTOMATIC UPDATED_AT TIMESTAMP)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_offices ON public.offices;
CREATE TRIGGER set_updated_at_offices BEFORE UPDATE ON public.offices FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_barangays ON public.barangays;
CREATE TRIGGER set_updated_at_barangays BEFORE UPDATE ON public.barangays FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_users ON public.users;
CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_gad_programs ON public.gad_programs;
CREATE TRIGGER set_updated_at_gad_programs BEFORE UPDATE ON public.gad_programs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_gad_projects ON public.gad_projects;
CREATE TRIGGER set_updated_at_gad_projects BEFORE UPDATE ON public.gad_projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_gad_activities ON public.gad_activities;
CREATE TRIGGER set_updated_at_gad_activities BEFORE UPDATE ON public.gad_activities FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_budgets ON public.budgets;
CREATE TRIGGER set_updated_at_budgets BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_budget_allocations ON public.budget_allocations;
CREATE TRIGGER set_updated_at_budget_allocations BEFORE UPDATE ON public.budget_allocations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_expenditures ON public.expenditures;
CREATE TRIGGER set_updated_at_expenditures BEFORE UPDATE ON public.expenditures FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barangays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gad_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gad_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gad_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenditures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.get_auth_user_roles()
RETURNS app_role[] AS $$
  SELECT COALESCE(array_agg(role), ARRAY[]::app_role[])
  FROM public.user_roles
  WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'admin', 'municipal_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Public Read Permissions (Offices & Barangays are public reference data)
CREATE POLICY "Public read access for offices" ON public.offices
  FOR SELECT USING (true);

CREATE POLICY "Public read access for barangays" ON public.barangays
  FOR SELECT USING (true);

CREATE POLICY "Public read access for document types" ON public.document_types
  FOR SELECT USING (true);

-- User Profiles: Users can read their own profile, Admins can view all
CREATE POLICY "Users view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admin manages user profiles" ON public.users
  FOR ALL USING (public.is_admin());

-- User Roles Policies
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- GAD Programs Policies
CREATE POLICY "Public read approved programs" ON public.gad_programs
  FOR SELECT USING (status IN ('APPROVED', 'ONGOING', 'COMPLETED') OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users insert programs" ON public.gad_programs
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Program authors and admins update programs" ON public.gad_programs
  FOR UPDATE USING (auth.uid() = created_by OR public.is_admin());

-- GAD Projects & Activities Policies
CREATE POLICY "Authenticated view projects" ON public.gad_projects
  FOR SELECT USING (true);

CREATE POLICY "Authenticated create projects" ON public.gad_projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authors/Admins update projects" ON public.gad_projects
  FOR UPDATE USING (auth.uid() = created_by OR public.is_admin());

CREATE POLICY "Authenticated view activities" ON public.gad_activities
  FOR SELECT USING (true);

CREATE POLICY "Authenticated create activities" ON public.gad_activities
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authors/Admins update activities" ON public.gad_activities
  FOR UPDATE USING (auth.uid() = created_by OR public.is_admin());

-- Budgets & Expenditures Policies
CREATE POLICY "Public read approved budgets" ON public.budgets
  FOR SELECT USING (status = 'APPROVED' OR auth.role() = 'authenticated');

CREATE POLICY "Admins manage budgets" ON public.budgets
  FOR ALL USING (public.is_admin());

CREATE POLICY "Authenticated view allocations" ON public.budget_allocations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins manage allocations" ON public.budget_allocations
  FOR ALL USING (public.is_admin());

CREATE POLICY "Authenticated view expenditures" ON public.expenditures
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert expenditures" ON public.expenditures
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins manage expenditures" ON public.expenditures
  FOR ALL USING (public.is_admin());

-- Documents Policies
CREATE POLICY "Authenticated view documents" ON public.documents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated upload documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Audit Logs Policies (Append-only by system, Viewable only by Admins)
CREATE POLICY "Admins view audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "System insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 10. SEED INITIAL DATA (ROLES & TALIBON'S 25 BARANGAYS)
-- ------------------------------------------------------------------------------

INSERT INTO public.roles (name, description) VALUES
  ('super_admin', 'Universal administrative access and system configuration'),
  ('admin', 'LGU GFPS Executive Administrator with full management access'),
  ('editor', 'Authorized GAD Focal Person for data encoding and updates'),
  ('municipal_admin', 'Municipal Planning and Social Welfare focal coordinator'),
  ('barangay_admin', 'Barangay Focal Person for local community programs')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.document_types (code, name, description) VALUES
  ('ATTENDANCE', 'Sex-Disaggregated Attendance Sheet', 'Official signed attendance roster of participants'),
  ('PHOTO', 'Activity Photo Documentation', 'Geotagged high-resolution photographs of activity'),
  ('FINANCIAL', 'Disbursement Voucher / Official Receipt', 'Proof of financial expenditure and liquidation'),
  ('EVALUATION', 'Client Satisfaction & Evaluation Summary', 'Pre/Post test and participant feedback summary')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.offices (code, name, head_name) VALUES
  ('MPDC', 'Municipal Planning and Development Coordinator', 'Engr. Planning Officer'),
  ('MSWDO', 'Municipal Social Welfare and Development Office', 'Social Welfare Officer'),
  ('MHO', 'Municipal Health Office', 'Municipal Health Officer'),
  ('MAO', 'Municipal Agriculture Office', 'Municipal Agriculturist'),
  ('MO-GFPS', 'Mayor’s Office - GAD Secretariat', 'GAD Focal Point Coordinator')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.barangays (name, code, captain_name) VALUES
  ('Bagacay', 'TLB-BAG', 'Hon. Barangay Captain'),
  ('Balintawak', 'TLB-BAL', 'Hon. Barangay Captain'),
  ('Burgos', 'TLB-BUR', 'Hon. Barangay Captain'),
  ('Busalian', 'TLB-BUS', 'Hon. Barangay Captain'),
  ('Calituban', 'TLB-CAL', 'Hon. Barangay Captain'),
  ('Cataban', 'TLB-CAT', 'Hon. Barangay Captain'),
  ('Guindacpan', 'TLB-GUI', 'Hon. Barangay Captain'),
  ('Magsaysay', 'TLB-MAG', 'Hon. Barangay Captain'),
  ('Mahanay', 'TLB-MAH', 'Hon. Barangay Captain'),
  ('Nocnocan', 'TLB-NOC', 'Hon. Barangay Captain'),
  ('Poblacion', 'TLB-POB', 'Hon. Barangay Captain'),
  ('Rizal', 'TLB-RIZ', 'Hon. Barangay Captain'),
  ('San Agustin', 'TLB-SAG', 'Hon. Barangay Captain'),
  ('San Carlos', 'TLB-SCA', 'Hon. Barangay Captain'),
  ('San Francisco', 'TLB-SFR', 'Hon. Barangay Captain'),
  ('San Isidro', 'TLB-SIS', 'Hon. Barangay Captain'),
  ('San Jose', 'TLB-SJO', 'Hon. Barangay Captain'),
  ('San Pedro', 'TLB-SPE', 'Hon. Barangay Captain'),
  ('San Roque', 'TLB-SRO', 'Hon. Barangay Captain'),
  ('Santo Niño', 'TLB-STN', 'Hon. Barangay Captain'),
  ('Sikatuna', 'TLB-SIK', 'Hon. Barangay Captain'),
  ('Suba', 'TLB-SUB', 'Hon. Barangay Captain'),
  ('Tanghaligi', 'TLB-TAN', 'Hon. Barangay Captain'),
  ('Tilmobo', 'TLB-TIL', 'Hon. Barangay Captain'),
  ('Zamora', 'TLB-ZAM', 'Hon. Barangay Captain')
ON CONFLICT (name) DO NOTHING;
