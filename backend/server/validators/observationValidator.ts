import { z } from 'zod';

export const observationTableParamSchema = z.object({
  tableId: z.string().optional(),
  id: z.string().optional(),
}).refine((data) => Boolean(data.tableId || data.id), {
  message: 'Table ID or code is required',
});

export const observationIdParamSchema = z.object({
  tableId: z.string().optional(),
  id: z.string().optional(),
  observationId: z.string().min(1, { message: 'Observation ID is required' }),
});

export const observationQuerySchema = z.object({
  datasetId: z.string().min(1, { message: 'datasetId query parameter is required' }),
  period: z.string().optional(),
  barangayId: z.string().optional(),
  indicatorId: z.string().optional(),
  page: z.union([z.string().regex(/^\d+$/).transform(Number), z.number()]).optional().default(1),
  limit: z.union([z.string().regex(/^\d+$/).transform(Number), z.number()]).optional().default(100),
});

export const createObservationSchema = z.object({
  datasetId: z.string().min(1, { message: 'Dataset ID is required' }),
  period: z.string().min(1, { message: 'Period is required' }).max(50, { message: 'Period must not exceed 50 characters' }),
  barangayId: z.string().optional().nullable(),
  indicatorId: z.string().optional().nullable(),
  numericValue: z.union([
    z.number().finite({ message: 'Numeric value must be a valid finite number' }),
    z.string().regex(/^-?\d+(\.\d+)?$/, { message: 'Numeric value must be a valid number string' }).transform(Number),
  ]),
  unit: z.string().max(100).optional().nullable(),
  dimensions: z.record(z.string(), z.any()).optional().nullable(),
  suppressionStatus: z.string().max(50).optional().default('NONE'),
  suppressionReason: z.string().max(255).optional().nullable(),
});

export const updateObservationSchema = z.object({
  period: z.string().min(1).max(50).optional(),
  barangayId: z.string().optional().nullable(),
  indicatorId: z.string().optional().nullable(),
  numericValue: z.union([
    z.number().finite({ message: 'Numeric value must be a valid finite number' }),
    z.string().regex(/^-?\d+(\.\d+)?$/, { message: 'Numeric value must be a valid number string' }).transform(Number),
  ]).optional(),
  unit: z.string().max(100).optional().nullable(),
  dimensions: z.record(z.string(), z.any()).optional().nullable(),
  suppressionStatus: z.string().max(50).optional(),
  suppressionReason: z.string().max(255).optional().nullable(),
});

export const bulkObservationItemSchema = z.object({
  id: z.string().optional(),
  period: z.string().min(1, { message: 'Period is required' }).max(50),
  barangayId: z.string().optional().nullable(),
  indicatorId: z.string().optional().nullable(),
  numericValue: z.union([
    z.number().finite({ message: 'Numeric value must be a valid finite number' }),
    z.string().regex(/^-?\d+(\.\d+)?$/, { message: 'Numeric value must be a valid number string' }).transform(Number),
  ]),
  unit: z.string().max(100).optional().nullable(),
  dimensions: z.record(z.string(), z.any()).optional().nullable(),
  suppressionStatus: z.string().max(50).optional().default('NONE'),
  suppressionReason: z.string().max(255).optional().nullable(),
});

export const bulkObservationSchema = z.object({
  datasetId: z.string().min(1, { message: 'Dataset ID is required' }),
  observations: z.array(bulkObservationItemSchema).min(1, { message: 'At least one observation is required' }),
});
