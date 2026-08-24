import express from 'express';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../controllers/programController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getPrograms);
router.post('/', restrictTo('ADMIN', 'ENCODER'), createProgram);
router.put('/:id', restrictTo('ADMIN', 'ENCODER'), updateProgram);
router.delete('/:id', restrictTo('ADMIN'), deleteProgram);

export default router;
