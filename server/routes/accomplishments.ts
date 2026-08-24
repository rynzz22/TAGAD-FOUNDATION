import express from 'express';
import { getAccomplishments, createAccomplishment, updateAccomplishment, deleteAccomplishment } from '../controllers/gadController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getAccomplishments);
router.post('/', restrictTo('ADMIN', 'ENCODER'), createAccomplishment);
router.put('/:id', restrictTo('ADMIN', 'ENCODER'), updateAccomplishment);
router.delete('/:id', restrictTo('ADMIN'), deleteAccomplishment);

export default router;
