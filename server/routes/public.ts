import { Router } from 'express';
import {
  getPublicDashboard,
  getPublicDemographics,
  getPublicPrograms,
  getPublicAccomplishments,
  getPublicGADPlans,
  getPublicOffices,
  getPublicBarangays,
  submitPublicFeedback,
  getPublicDatasets,
} from '../controllers/publicController';
import { enforcePIISafety } from '../middleware/piiSanitizer';
import { validate } from '../middleware/validate';
import { publicFeedbackSchema } from '../validation/schemas';

const router = Router();

// Apply PII Sanitizer middleware to all public endpoints
router.use(enforcePIISafety);

router.get('/dashboard', getPublicDashboard);
router.get('/demographics', getPublicDemographics);
router.get('/programs', getPublicPrograms);
router.get('/accomplishments', getPublicAccomplishments);
router.get('/gad-plans', getPublicGADPlans);
router.get('/offices', getPublicOffices);
router.get('/barangays', getPublicBarangays);
router.get('/datasets', getPublicDatasets);
router.post('/feedback', validate(publicFeedbackSchema), submitPublicFeedback);

export default router;
