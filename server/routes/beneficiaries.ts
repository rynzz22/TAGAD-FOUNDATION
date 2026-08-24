import express from 'express';
import { getBeneficiaries, createBeneficiary, updateBeneficiary, archiveBeneficiary, getBeneficiaryStats } from '../controllers/beneficiaryController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getBeneficiaries);
router.get('/stats', getBeneficiaryStats);
router.post('/', restrictTo('ADMIN', 'ENCODER'), createBeneficiary);
router.put('/:id', restrictTo('ADMIN', 'ENCODER'), updateBeneficiary);
router.delete('/:id', restrictTo('ADMIN'), archiveBeneficiary);

export default router;
