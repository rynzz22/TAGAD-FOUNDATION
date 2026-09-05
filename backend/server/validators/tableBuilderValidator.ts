import { z } from 'zod';
import {
  StatisticalTableClassification,
  StatisticalVerificationStatus,
} from '@prisma/client';

export const classificationEnum = z.enum([
  'AGGREGATED_STATISTICS',
  'INDICATOR',
  'DERIVED_METRIC',
  'REFERENCE_DATA',
  'UNVERIFIED',
]);

export const verificationStatusEnum = z.enum([
  'UNVERIFIED',
  'PROVISIONAL',
  'VERIFIED',
]);

export const tableIdParamSchema = z.object({
  id: z.string().min(1, { message: 'Table ID or code is required' }),
});

export const indicatorIdParamSchema = z.object({
  indicatorId: z.string().min(1, { message: 'Indicator ID is required' }),
});

export const dimensionIdParamSchema = z.object({
  dimensionId: z.string().min(1, { message: 'Dimension ID is required' }),
});

export const tableDimensionParamSchema = z.object({
  id: z.string().min(1, { message: 'Table ID is required' }),
  dimensionId: z.string().min(1, { message: 'Dimension ID is required' }),
});

export const tableListQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  domain: z.string().optional(),
  isSystemTable: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  isArchived: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  classification: classificationEnum.optional(),
  verificationStatus: verificationStatusEnum.optional(),
  search: z.string().optional(),
});

export const createTableSchema = z.object({
  tableCode: z
    .string()
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, { message: 'Table code can only contain alphanumeric characters, dashes, and underscores' })
    .optional(),
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(500, { message: 'Title must not exceed 500 characters' }),
  domain: z
    .string()
    .min(2, { message: 'Domain is required' })
    .max(100, { message: 'Domain must not exceed 100 characters' }),
  classification: classificationEnum.optional().default('AGGREGATED_STATISTICS'),
  description: z.string().optional().nullable(),
  expectedUnit: z.string().max(100).optional().nullable(),
  rowGrain: z.string().max(255).optional().default('BARANGAY'),
  dimensionsSummary: z.string().max(255).optional().nullable(),
  measureStructure: z.string().max(255).optional().nullable(),
  sourceFormat: z.string().max(100).optional().nullable(),
  dimensionIds: z.array(z.string().uuid()).optional(),
});

export const updateTableSchema = z.object({
  title: z.string().min(3).max(500).optional(),
  domain: z.string().min(2).max(100).optional(),
  classification: classificationEnum.optional(),
  description: z.string().optional().nullable(),
  expectedUnit: z.string().max(100).optional().nullable(),
  rowGrain: z.string().max(255).optional().nullable(),
  dimensionsSummary: z.string().max(255).optional().nullable(),
  measureStructure: z.string().max(255).optional().nullable(),
  sourceFormat: z.string().max(100).optional().nullable(),
  verificationStatus: verificationStatusEnum.optional(),
  isArchived: z.boolean().optional(),
});

export const bindDimensionSchema = z.object({
  dimensionId: z.string().uuid({ message: 'Valid dimension UUID is required' }),
  displayOrder: z.number().int().min(0).optional(),
  isRequired: z.boolean().optional().default(true),
  allowedValues: z.any().optional().nullable(),
});

export const reorderDimensionsSchema = z.object({
  dimensions: z
    .array(
      z.object({
        dimensionId: z.string().uuid({ message: 'Valid dimension UUID is required' }),
        displayOrder: z.number().int().min(0),
      })
    )
    .min(1, { message: 'At least one dimension is required in reorder list' }),
});

export const createDimensionSchema = z.object({
  dimensionCode: z
    .string()
    .min(2, { message: 'Dimension code must be at least 2 characters' })
    .max(100, { message: 'Dimension code must not exceed 100 characters' })
    .regex(/^[A-Za-z0-9_-]+$/, { message: 'Dimension code can only contain alphanumeric characters, dashes, and underscores' }),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(255, { message: 'Name must not exceed 255 characters' }),
  description: z.string().optional().nullable(),
  dataType: z.string().max(50).optional().default('string'),
  vocabularySource: z.string().max(255).optional().nullable(),
  verificationStatus: verificationStatusEnum.optional().default('UNVERIFIED'),
});

export const createIndicatorSchema = z.object({
  indicatorCode: z
    .string()
    .min(2, { message: 'Indicator code must be at least 2 characters' })
    .max(100, { message: 'Indicator code must not exceed 100 characters' })
    .regex(/^[A-Za-z0-9_-]+$/, { message: 'Indicator code can only contain alphanumeric characters, dashes, and underscores' }),
  name: z
    .string()
    .min(2, { message: 'Indicator name must be at least 2 characters' })
    .max(255, { message: 'Indicator name must not exceed 255 characters' }),
  title: z
    .string()
    .min(2, { message: 'Indicator title must be at least 2 characters' })
    .max(500, { message: 'Indicator title must not exceed 500 characters' }),
  description: z.string().optional().nullable(),
  unit: z.string().max(100).optional().nullable(),
  classification: classificationEnum.optional().default('INDICATOR'),
  formula: z.string().optional().nullable(),
  numeratorDefinition: z.string().optional().nullable(),
  denominatorDefinition: z.string().optional().nullable(),
  verificationStatus: verificationStatusEnum.optional().default('UNVERIFIED'),
});

export const updateIndicatorSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  title: z.string().min(2).max(500).optional(),
  description: z.string().optional().nullable(),
  unit: z.string().max(100).optional().nullable(),
  classification: classificationEnum.optional(),
  formula: z.string().optional().nullable(),
  numeratorDefinition: z.string().optional().nullable(),
  denominatorDefinition: z.string().optional().nullable(),
  verificationStatus: verificationStatusEnum.optional(),
});
