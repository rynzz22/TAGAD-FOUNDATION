import { Router } from 'express';
import { IngestionController } from '../../controllers/admin/ingestionController';

const router = Router();

// Phase 1: CSV Schema Discovery (Read-only profiling)
router.post('/discover-schema', IngestionController.discoverSchema);

export default router;
