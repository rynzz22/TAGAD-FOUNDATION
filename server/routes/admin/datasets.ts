import { Router } from 'express';
import {
  listDatasets,
  getDatasetById,
  createDataset,
  validateDataset,
  officializeDataset,
  publishDataset,
  withdrawDataset,
  getDatasetHistory,
} from '../../controllers/admin/datasetController';
import { requireRole } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { Role } from '@prisma/client';
import {
  createDatasetSchema,
  transitionDatasetSchema,
  withdrawDatasetSchema,
  datasetIdParamSchema,
  datasetQuerySchema,
} from '../../validators/datasetValidator';

const router = Router();

// List all datasets with filtering, search, and pagination
router.get('/', validate(datasetQuerySchema, 'query'), listDatasets);

// Get single dataset by ID with provenance, observation metrics, and table definitions
router.get('/:id', validate(datasetIdParamSchema, 'params'), getDatasetById);

// Create a new statistical dataset header (Always initializes as DRAFT)
router.post(
  '/',
  requireRole(Role.SUPER_ADMIN, Role.ADMIN, Role.ENCODER),
  validate(createDatasetSchema, 'body'),
  createDataset
);

// State Transition: DRAFT -> VALIDATED (Requires ADMIN or SUPER_ADMIN)
router.post(
  '/:id/validate',
  requireRole(Role.SUPER_ADMIN, Role.ADMIN),
  validate(datasetIdParamSchema, 'params'),
  validate(transitionDatasetSchema, 'body'),
  validateDataset
);

// State Transition: VALIDATED -> OFFICIAL (Requires ADMIN or SUPER_ADMIN)
router.post(
  '/:id/official',
  requireRole(Role.SUPER_ADMIN, Role.ADMIN),
  validate(datasetIdParamSchema, 'params'),
  validate(transitionDatasetSchema, 'body'),
  officializeDataset
);

// State Transition: OFFICIAL -> PUBLISHED (Requires SUPER_ADMIN executive authority)
router.post(
  '/:id/publish',
  requireRole(Role.SUPER_ADMIN),
  validate(datasetIdParamSchema, 'params'),
  validate(transitionDatasetSchema, 'body'),
  publishDataset
);

// State Transition: ANY (Non-Withdrawn) -> WITHDRAWN (Requires Revocation Reason)
router.post(
  '/:id/withdraw',
  requireRole(Role.SUPER_ADMIN, Role.ADMIN),
  validate(datasetIdParamSchema, 'params'),
  validate(withdrawDatasetSchema, 'body'),
  withdrawDataset
);

// Audit History: Retrieve chronological governance audit trail for dataset
router.get(
  '/:id/history',
  validate(datasetIdParamSchema, 'params'),
  getDatasetHistory
);

export default router;
