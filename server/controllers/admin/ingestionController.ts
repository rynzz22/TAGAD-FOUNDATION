import { Request, Response } from 'express';
import { CsvDiscoveryService } from '../../services/CsvDiscoveryService';
import { sendSuccess, sendError } from '../../lib/response';
import { ValidationError } from '../../lib/errors';

export class IngestionController {
  /**
   * Phase 1: Discover and profile raw CSV schema without writing to database
   */
  public static async discoverSchema(req: Request, res: Response) {
    try {
      const { csvContent, filename } = req.body;

      if (!csvContent || typeof csvContent !== 'string') {
        throw new ValidationError('csvContent is required as a raw CSV string');
      }

      const discoveryResult = CsvDiscoveryService.discoverSchema(csvContent, filename || 'dataset.csv');

      return sendSuccess(res, discoveryResult, { message: 'CSV Schema discovered successfully' });
    } catch (err: any) {
      return sendError(res, err);
    }
  }
}
