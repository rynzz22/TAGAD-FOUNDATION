import { Router } from 'express';
import { getBarangays, getBarangayById } from '../../controllers/admin/barangayController';

const router = Router();

router.get('/', getBarangays);
router.get('/:id', getBarangayById);

export default router;
