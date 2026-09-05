-- ==============================================================================
-- TAGAD SYSTEM — SPRINT 12: TABLE BUILDER & DIMENSION BINDINGS
-- Date: 2026-08-31
-- Purpose: Add system table flags and create tagad_table_dimension_bindings junction table.
--
-- IMPORTANT:
-- This migration is purely additive and backward-compatible.
-- It does NOT modify or delete any existing statistical table definitions or observations.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ADD SYSTEM AND ARCHIVE FLAGS TO STATISTICAL TABLE DEFINITIONS
-- ------------------------------------------------------------------------------

ALTER TABLE IF EXISTS public.tagad_statistical_table_definitions
  ADD COLUMN IF NOT EXISTS is_system_table BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_stat_table_def_system_archived
  ON public.tagad_statistical_table_definitions(is_system_table, is_archived);


-- ------------------------------------------------------------------------------
-- 2. CREATE TABLE DIMENSION BINDINGS JUNCTION TABLE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tagad_table_dimension_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  table_definition_id UUID NOT NULL
    REFERENCES public.tagad_statistical_table_definitions(id)
    ON DELETE CASCADE,

  dimension_id UUID NOT NULL
    REFERENCES public.tagad_statistical_dimensions(id)
    ON DELETE RESTRICT,

  display_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  allowed_values JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_table_dimension UNIQUE (table_definition_id, dimension_id)
);

CREATE INDEX IF NOT EXISTS idx_table_dim_binding_order
  ON public.tagad_table_dimension_bindings(table_definition_id, display_order);

CREATE INDEX IF NOT EXISTS idx_table_dim_binding_dim
  ON public.tagad_table_dimension_bindings(dimension_id);

-- ==============================================================================
-- END TABLE DIMENSION BINDINGS MIGRATION
-- ==============================================================================
