import express from 'express';
import { getGADPlans, createGADPlan, updateGADPlan, updateGADPlanStatus, deleteGADPlan } from '../controllers/gadController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getGADPlans);
router.post('/', restrictTo('ADMIN', 'ENCODER'), createGADPlan);
router.put('/:id', restrictTo('ADMIN', 'ENCODER'), updateGADPlan);
router.patch('/:id/status', restrictTo('ADMIN'), updateGADPlanStatus);
router.delete('/:id', restrictTo('ADMIN'), deleteGADPlan);

export default router;
