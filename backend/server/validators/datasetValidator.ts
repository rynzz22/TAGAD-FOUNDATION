import { z } from 'zod';
import { StatisticalPublicationStatus } from '@prisma/client';

export const publicationStatusEnum = z.enum([
  'DRAFT',
  'VALIDATED',
  'OFFICIAL',
  'PUBLISHED',
  'WITHDRAWN',
]);

export const datasetIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Dataset ID must be a valid UUID' }),
});

export const createDatasetSchema = z.object({
  datasetCode: z
    .string()
    .min(3, { message: 'Dataset code must be at least 3 characters' })
    .max(100, { message: 'Dataset code must not exceed 100 characters' })
    .regex(/^[A-Za-z0-9_-]+$/, { message: 'Dataset code can only contain alphanumeric characters, dashes, and underscores' }),
  name: z
    .string()
    .min(3, { message: 'Dataset name must be at least 3 characters' })
    .max(255, { message: 'Dataset name must not exceed 255 characters' }),
  description: z.string().optional().nullable(),
  sourceAgency: z.string().max(100).optional().nullable(),
  reportingYear: z
    .number()
    .int()
    .min(1900, { message: 'Reporting year must be 1900 or later' })
    .max(2100, { message: 'Reporting year must be 2100 or earlier' })
    .optional()
    .nullable(),
  reportingPeriod: z.string().max(100).optional().nullable(),
  surveyRound: z.string().max(100).optional().nullable(),
  geographicLevel: z.string().max(50).optional().default('MUNICIPALITY'),
  sourceFileName: z.string().max(255).optional().nullable(),
});

export const transitionDatasetSchema = z.object({
  targetStatus: publicationStatusEnum,
  reason: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  signOffBy: z.string().max(255).optional(),
  movDocumentUrl: z.string().url().optional().or(z.literal('')).nullable(),
});

export const withdrawDatasetSchema = z.object({
  reason: z
    .string()
    .min(3, { message: 'Revocation reason must be at least 3 characters' })
    .max(1000, { message: 'Revocation reason must not exceed 1000 characters' }),
  notes: z.string().max(2000).optional(),
});

export const datasetQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: publicationStatusEnum.optional(),
  year: z.string().regex(/^\d{4}$/).transform(Number).optional(),
  sourceAgency: z.string().optional(),
  search: z.string().optional(),
});
