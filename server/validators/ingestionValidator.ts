import { z } from 'zod';

export const datasetTypeEnum = z.enum([
  'BENEFICIARY_REGISTRY',
  'HOUSEHOLD_SURVEY',
  'PROGRAM_CATALOG',
  'GAD_ACCOMPLISHMENT',
  'PROGRAM_MONITORING',
  'ACCOMPLISHMENT_REPORT',
]);

export const duplicateStrategyEnum = z.enum(['SKIP', 'UPDATE', 'APPEND']).default('SKIP');

export const ingestionModeEnum = z.enum(['STRICT', 'TOLERANT']).default('TOLERANT');

// Accepts either an object map { [sourceCol: string]: string } or an array of mapping objects
export const columnMappingSchema = z.union([
  z.record(z.string(), z.string()),
  z.array(
    z.object({
      sourceColumn: z.string().min(1),
      targetField: z.string().min(1),
    })
  ),
]);

export const csvPreviewSchema = z.object({
  csvContent: z.string().min(1, { message: 'csvContent is required and must not be empty' }),
  filename: z.string().optional().default('dataset.csv'),
  datasetType: datasetTypeEnum.optional(),
  confirmedMappings: columnMappingSchema.optional(),
  duplicateStrategy: duplicateStrategyEnum.optional().default('SKIP'),
  ingestionMode: ingestionModeEnum.optional().default('TOLERANT'),
  targetOfficeId: z.string().uuid().optional().nullable(),
});

export const csvExecuteSchema = z.object({
  csvContent: z.string().min(1, { message: 'csvContent is required and must not be empty' }),
  filename: z.string().optional().default('dataset.csv'),
  datasetType: datasetTypeEnum.optional(),
  confirmedMappings: columnMappingSchema.optional(),
  duplicateStrategy: duplicateStrategyEnum.optional().default('SKIP'),
  ingestionMode: ingestionModeEnum.optional().default('TOLERANT'),
  targetOfficeId: z.string().uuid().optional().nullable(),
});
