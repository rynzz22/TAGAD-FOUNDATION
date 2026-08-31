-- ==============================================================================
-- TAGAD SYSTEM — CANONICAL DOMAIN MODEL MIGRATION (BLUEPRINT V2)
-- Project: Talibon Analytics for Gender and Development (TAGAD)
-- Target: PostgreSQL / Supabase
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. CANONICAL ENUMS
-- ------------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE canonical_role AS ENUM (
    'ADMIN',
    'ENCODER',
    'VIEWER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE beneficiary_sex AS ENUM (
    'MALE',
    'FEMALE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE canonical_plan_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'REVISED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE canonical_program_status AS ENUM (
    'DRAFT',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. ORGANIZATIONAL & GEOGRAPHIC ENTITIES
-- ------------------------------------------------------------------------------

-- Canonical Offices Table
CREATE TABLE IF NOT EXISTS public.tagad_offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  head_name VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Canonical Barangays Table (25 Barangays of Talibon)
CREATE TABLE IF NOT EXISTS public.tagad_barangays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  captain_name VARCHAR(255),
  gad_focal_person VARCHAR(255),
  contact_number VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Households Table (Demographic grouping for 4Ps / Indigents)
CREATE TABLE IF NOT EXISTS public.tagad_households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_no VARCHAR(100) UNIQUE NOT NULL,
  barangay_id UUID NOT NULL REFERENCES public.tagad_barangays(id) ON DELETE RESTRICT,
  purok VARCHAR(100),
  is_4ps BOOLEAN NOT NULL DEFAULT FALSE,
  is_indigent BOOLEAN NOT NULL DEFAULT FALSE,
  head_name VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. IDENTITY & ROLE MANAGEMENT
-- ------------------------------------------------------------------------------

-- Canonical Users Table
CREATE TABLE IF NOT EXISTS public.tagad_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role canonical_role NOT NULL DEFAULT 'ENCODER',
  office_id UUID REFERENCES public.tagad_offices(id) ON DELETE SET NULL,
  barangay_id UUID REFERENCES public.tagad_barangays(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. BENEFICIARY REGISTRY (SEX-DISAGGREGATED DATA)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tagad_beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES public.tagad_households(id) ON DELETE SET NULL,
  office_id UUID REFERENCES public.tagad_offices(id) ON DELETE SET NULL,
  barangay_id UUID NOT NULL REFERENCES public.tagad_barangays(id) ON DELETE RESTRICT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  sex beneficiary_sex NOT NULL,
  birthdate DATE,
  age INT NOT NULL CHECK (age >= 0 AND age <= 130),
  sector VARCHAR(100) NOT NULL,
  contact_number VARCHAR(50),
  address_street TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  encoded_by UUID REFERENCES public.tagad_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. GAD PLANNING & OPERATIONAL PROGRAMS
-- ------------------------------------------------------------------------------

-- GAD Plan Header (Annual Mandatory 5% Statutory Matrix)
CREATE TABLE IF NOT EXISTS public.tagad_gad_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL REFERENCES public.tagad_offices(id) ON DELETE RESTRICT,
  fiscal_year INT NOT NULL,
  total_budget NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_budget >= 0),
  mandatory_gad_percentage NUMERIC(5, 2) NOT NULL DEFAULT 5.00 CHECK (mandatory_gad_percentage >= 5.00),
  gad_budget NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (gad_budget >= 0),
  status canonical_plan_status NOT NULL DEFAULT 'DRAFT',
  created_by UUID REFERENCES public.tagad_users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.tagad_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_gad_plan_office_year UNIQUE (office_id, fiscal_year)
);

-- Operational GAD Programs
CREATE TABLE IF NOT EXISTS public.tagad_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL REFERENCES public.tagad_offices(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sector VARCHAR(100) NOT NULL,
  fiscal_year INT NOT NULL,
  status canonical_program_status NOT NULL DEFAULT 'ACTIVE',
  budget_target NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (budget_target >= 0),
  budget_actual NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (budget_actual >= 0),
  target_male INT NOT NULL DEFAULT 0 CHECK (target_male >= 0),
  target_female INT NOT NULL DEFAULT 0 CHECK (target_female >= 0),
  actual_male INT NOT NULL DEFAULT 0 CHECK (actual_male >= 0),
  actual_female INT NOT NULL DEFAULT 0 CHECK (actual_female >= 0),
  created_by UUID REFERENCES public.tagad_users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.tagad_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GAD Plan Items (Detailed GPB Matrix Lines)
CREATE TABLE IF NOT EXISTS public.tagad_gad_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gad_plan_id UUID NOT NULL REFERENCES public.tagad_gad_plans(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.tagad_programs(id) ON DELETE SET NULL,
  gender_issue TEXT NOT NULL,
  cause_of_issue TEXT,
  gad_result TEXT NOT NULL,
  activity TEXT NOT NULL,
  performance_indicator TEXT NOT NULL,
  target_group VARCHAR(255) NOT NULL,
  timeline VARCHAR(100) NOT NULL,
  responsible_office VARCHAR(255) NOT NULL,
  budget NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (budget >= 0),
  fund_source VARCHAR(100) NOT NULL DEFAULT 'General Fund (5% GAD)',
  hgdg_score NUMERIC(5, 2) CHECK (hgdg_score >= 0 AND hgdg_score <= 20),
  attributed_percentage NUMERIC(5, 2) CHECK (attributed_percentage >= 0 AND attributed_percentage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. GAD ACCOMPLISHMENTS & MOV EVIDENCE (IMPLEMENTATION RESULTS)
-- ------------------------------------------------------------------------------

-- GAD Accomplishments (Quarterly / Annual Results)
CREATE TABLE IF NOT EXISTS public.tagad_accomplishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.tagad_programs(id) ON DELETE CASCADE,
  gad_plan_item_id UUID REFERENCES public.tagad_gad_plan_items(id) ON DELETE SET NULL,
  fiscal_year INT NOT NULL,
  quarter INT CHECK (quarter >= 1 AND quarter <= 4),
  actual_output TEXT NOT NULL,
  actual_beneficiary_male INT NOT NULL DEFAULT 0 CHECK (actual_beneficiary_male >= 0),
  actual_beneficiary_female INT NOT NULL DEFAULT 0 CHECK (actual_beneficiary_female >= 0),
  actual_budget_used NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (actual_budget_used >= 0),
  output_summary TEXT,
  remarks TEXT,
  variance_explanation TEXT,
  created_by UUID REFERENCES public.tagad_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MOV Attachments (Supabase Storage Metadata)
CREATE TABLE IF NOT EXISTS public.tagad_mov_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accomplishment_id UUID NOT NULL REFERENCES public.tagad_accomplishments(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size_bytes INT NOT NULL CHECK (file_size_bytes > 0),
  uploaded_by UUID REFERENCES public.tagad_users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tagad_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.tagad_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  before_state JSONB,
  after_state JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. INDEXES FOR PERFORMANCE & REPORTING
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_tagad_users_office ON public.tagad_users(office_id);
CREATE INDEX IF NOT EXISTS idx_tagad_beneficiaries_barangay ON public.tagad_beneficiaries(barangay_id);
CREATE INDEX IF NOT EXISTS idx_tagad_beneficiaries_sex ON public.tagad_beneficiaries(sex);
CREATE INDEX IF NOT EXISTS idx_tagad_beneficiaries_sector ON public.tagad_beneficiaries(sector);
CREATE INDEX IF NOT EXISTS idx_tagad_programs_year_office ON public.tagad_programs(fiscal_year, office_id);
CREATE INDEX IF NOT EXISTS idx_tagad_gad_plan_items_plan ON public.tagad_gad_plan_items(gad_plan_id);
CREATE INDEX IF NOT EXISTS idx_tagad_accomplishments_program ON public.tagad_accomplishments(program_id);
CREATE INDEX IF NOT EXISTS idx_tagad_mov_accomplishment ON public.tagad_mov_attachments(accomplishment_id);
CREATE INDEX IF NOT EXISTS idx_tagad_audit_logs_user_action ON public.tagad_audit_logs(user_id, action);
CREATE INDEX IF NOT EXISTS idx_tagad_audit_logs_created ON public.tagad_audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 9. SEED INITIAL REFERENCE DATA (OFFICES & 25 BARANGAYS)
-- ------------------------------------------------------------------------------

INSERT INTO public.tagad_offices (code, name, head_name) VALUES
  ('MPDC', 'Municipal Planning and Development Coordinator', 'Engr. Planning Officer'),
  ('MSWDO', 'Municipal Social Welfare and Development Office', 'Social Welfare Officer'),
  ('MHO', 'Municipal Health Office', 'Municipal Health Officer'),
  ('MAO', 'Municipal Agriculture Office', 'Municipal Agriculturist'),
  ('MO-GFPS', 'Mayor’s Office - GAD Focal Point System', 'GAD Focal Coordinator')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.tagad_barangays (name, code, captain_name) VALUES
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
