import express from 'express';
import { getGPBExcel, getGARExcel, getBeneficiariesPDF } from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/gpb-excel', getGPBExcel);
router.get('/gar-excel', getGARExcel);
router.get('/beneficiaries-pdf', getBeneficiariesPDF);

export default router;
