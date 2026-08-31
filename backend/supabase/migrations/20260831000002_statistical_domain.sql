-- ==============================================================================
-- TAGAD SYSTEM — STATISTICAL DOMAIN
-- Date: 2026-08-31
-- Purpose: Deploy the six statistical mother models defined in Prisma.
--
-- IMPORTANT:
-- This migration creates the statistical schema only.
-- It does NOT insert PSA/CBMS statistical data.
-- ==============================================================================


-- ------------------------------------------------------------------------------
-- 1. STATISTICAL ENUMS
-- ------------------------------------------------------------------------------

DO $$
BEGIN
  CREATE TYPE canonical_stat_classification AS ENUM (
    'AGGREGATED_STATISTICS',
    'INDICATOR',
    'DERIVED_METRIC',
    'REFERENCE_DATA',
    'UNVERIFIED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


DO $$
BEGIN
  CREATE TYPE canonical_stat_pub_status AS ENUM (
    'DRAFT',
    'VALIDATED',
    'OFFICIAL',
    'PUBLISHED',
    'WITHDRAWN'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


DO $$
BEGIN
  CREATE TYPE canonical_stat_verif_status AS ENUM (
    'UNVERIFIED',
    'PROVISIONAL',
    'VERIFIED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


-- ------------------------------------------------------------------------------
-- 2. STATISTICAL TABLE DEFINITIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tagad_statistical_table_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  table_number INTEGER NOT NULL UNIQUE,
  table_code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  domain VARCHAR(100) NOT NULL,

  classification canonical_stat_classification
    NOT NULL DEFAULT 'UNVERIFIED',

  description TEXT,
  expected_unit VARCHAR(100),

  row_grain VARCHAR(255)
    DEFAULT 'UNVERIFIED',

  dimensions_summary VARCHAR(255)
    DEFAULT 'UNVERIFIED',

  measure_structure VARCHAR(255)
    DEFAULT 'UNVERIFIED',

  source_format VARCHAR(100)
    DEFAULT 'UNVERIFIED',

  verification_status canonical_stat_verif_status
    NOT NULL DEFAULT 'UNVERIFIED',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stat_table_def_domain
  ON public.tagad_statistical_table_definitions(domain);

CREATE INDEX IF NOT EXISTS idx_stat_table_def_classification
  ON public.tagad_statistical_table_definitions(classification);


-- ------------------------------------------------------------------------------
-- 3. STATISTICAL DATASETS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tagad_statistical_datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  dataset_code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  source_agency VARCHAR(100),
  reporting_year INTEGER,
  reporting_period VARCHAR(100),
  survey_round VARCHAR(100),

  geographic_level VARCHAR(50)
    DEFAULT 'MUNICIPALITY',

  source_file_name VARCHAR(255),

  ingestion_batch_id UUID,

  imported_by_id UUID
    REFERENCES public.tagad_users(id)
    ON DELETE SET NULL,

  is_official BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,

  publication_status canonical_stat_pub_status
    NOT NULL DEFAULT 'DRAFT',

  verification_status canonical_stat_verif_status
    NOT NULL DEFAULT 'UNVERIFIED',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stat_dataset_year_agency
  ON public.tagad_statistical_datasets(reporting_year, source_agency);

CREATE INDEX IF NOT EXISTS idx_stat_dataset_publication_status
  ON public.tagad_statistical_datasets(publication_status);


-- ------------------------------------------------------------------------------
-- 4. STATISTICAL INDICATORS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tagad_statistical_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  indicator_code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,

  description TEXT,
  unit VARCHAR(100),

  classification canonical_stat_classification
    NOT NULL DEFAULT 'INDICATOR',

  formula TEXT,

  numerator_definition TEXT,
  denominator_definition TEXT,

  table_definition_id UUID
    REFERENCES public.tagad_statistical_table_definitions(id)
    ON DELETE SET NULL,

  verification_status canonical_stat_verif_status
    NOT NULL DEFAULT 'UNVERIFIED',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stat_indicator_table_definition
  ON public.tagad_statistical_indicators(table_definition_id);


-- ------------------------------------------------------------------------------
-- 5. STATISTICAL DIMENSIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tagad_statistical_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  dimension_code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,

  description TEXT,

  data_type VARCHAR(50)
    NOT NULL DEFAULT 'string',

  vocabulary_source VARCHAR(255),

  verification_status canonical_stat_verif_status
    NOT NULL DEFAULT 'UNVERIFIED',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------------------------
-- 6. STATISTICAL PROVENANCE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tagad_statistical_provenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  source_agency VARCHAR(100),
  source_file_name VARCHAR(255),
  source_document VARCHAR(255),

  dataset_code VARCHAR(100),
  table_code VARCHAR(50),

  reporting_period VARCHAR(100),

  imported_by_id UUID
    REFERENCES public.tagad_users(id)
    ON DELETE SET NULL,

  ingestion_batch_id UUID,

  methodology_notes TEXT,

  source_url VARCHAR(500),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------------------------
-- 7. STATISTICAL OBSERVATIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tagad_statistical_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  dataset_id UUID NOT NULL
    REFERENCES public.tagad_statistical_datasets(id)
    ON DELETE CASCADE,

  table_definition_id UUID NOT NULL
    REFERENCES public.tagad_statistical_table_definitions(id)
    ON DELETE RESTRICT,

  indicator_id UUID
    REFERENCES public.tagad_statistical_indicators(id)
    ON DELETE SET NULL,

  barangay_id UUID
    REFERENCES public.tagad_barangays(id)
    ON DELETE SET NULL,

  period VARCHAR(50) NOT NULL,

  numeric_value DECIMAL(18,4) NOT NULL,

  unit VARCHAR(100),

  dimensions JSONB,

  dimensions_hash VARCHAR(64),

  provenance_id UUID
    REFERENCES public.tagad_statistical_provenance(id)
    ON DELETE SET NULL,

  suppression_status VARCHAR(50)
    DEFAULT 'NONE',

  suppression_reason VARCHAR(255),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stat_observation_dataset_table
  ON public.tagad_statistical_observations(dataset_id, table_definition_id);

CREATE INDEX IF NOT EXISTS idx_stat_observation_barangay_period
  ON public.tagad_statistical_observations(barangay_id, period);

CREATE INDEX IF NOT EXISTS idx_stat_observation_indicator
  ON public.tagad_statistical_observations(indicator_id);


-- ==============================================================================
-- END STATISTICAL DOMAIN MIGRATION
-- ==============================================================================