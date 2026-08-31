import { Router, Request, Response, NextFunction } from 'express';
import { StatisticalCatalogService } from '../services/StatisticalCatalogService';
import { sendSuccess } from '../lib/response';
import { enforcePIISafety } from '../middleware/piiSanitizer';

const router = Router();

// Apply PII Sanitizer middleware to all statistical catalog endpoints
router.use(enforcePIISafety);

/**
 * Handler for querying table definitions with rich filtering and optional pagination
 */
const handleGetTables = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const domain = req.query.domain as string | undefined;
    const classification = req.query.classification as any;
    const search = req.query.search as string | undefined;
    const verificationStatus = req.query.verificationStatus as any;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const result = await StatisticalCatalogService.getAllTableDefinitions({
      domain,
      classification,
      search,
      verificationStatus,
      page,
      limit,
    });
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/statistical-catalog/domains
 * Lists the 9 canonical domains with summary counts & metadata
 */
router.get('/domains', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const domains = await StatisticalCatalogService.getDomainsSummary();
    sendSuccess(res, domains);
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

/**
 * GET /api/statistical-catalog/tables
 * Lists all registered statistical table definitions (69 tables) with filters & pagination
 */
router.get('/tables', handleGetTables);

/**
 * GET /api/statistical-catalog/tables/:tableNumberOrCode
 * Retrieves a single table definition by its table number (1-69) or table code (STAT-TAB-01)
 */
router.get('/tables/:tableNumberOrCode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const identifier = req.params.tableNumberOrCode;
    const table = await StatisticalCatalogService.getTableDefinitionByCodeOrNumber(identifier);
    if (!table) {
      return res.status(404).json({ success: false, error: 'Statistical table definition not found' });
    }
    sendSuccess(res, table);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/statistical-catalog
 * Root catalog query endpoint with filters & pagination
 */
router.get('/', handleGetTables);

/**
 * GET /api/statistical-catalog/:tableCode
 * Retrieves a single table definition by its table code (e.g. STAT-TAB-01)
 */
router.get('/:tableCode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tableCode = req.params.tableCode;
    const table = await StatisticalCatalogService.getTableDefinitionByCodeOrNumber(tableCode);
    if (!table) {
      return res.status(404).json({ success: false, error: 'Statistical table definition not found' });
    }
    sendSuccess(res, table);
  } catch (err) {
    next(err);
  }
});

export default router;

