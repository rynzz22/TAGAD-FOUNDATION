import { Router, Request, Response, NextFunction } from 'express';
import { StatisticalCatalogService } from '../services/StatisticalCatalogService';
import { sendSuccess } from '../lib/response';
import { enforcePIISafety } from '../middleware/piiSanitizer';

const router = Router();

// Apply PII Sanitizer middleware to all statistical catalog endpoints
router.use(enforcePIISafety);

/**
 * GET /api/statistical-catalog/tables
 * Lists all registered statistical table definitions (69 tables)
 */
router.get('/tables', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const domain = req.query.domain as string | undefined;
    const classification = req.query.classification as any;
    const tables = await StatisticalCatalogService.getAllTableDefinitions({ domain, classification });
    sendSuccess(res, tables);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/statistical-catalog/tables/:tableNumber
 * Retrieves a single table definition by its table number (1-69)
 */
router.get('/tables/:tableNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tableNumber = parseInt(req.params.tableNumber, 10);
    const table = await StatisticalCatalogService.getTableDefinitionByNumber(tableNumber);
    if (!table) {
      return res.status(404).json({ success: false, error: 'Statistical table definition not found' });
    }
    sendSuccess(res, table);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/statistical-catalog/dimensions
 * Lists standard statistical dimensions
 */
router.get('/dimensions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dimensions = await StatisticalCatalogService.getDimensions();
    sendSuccess(res, dimensions);
  } catch (err) {
    next(err);
  }
});

export default router;
