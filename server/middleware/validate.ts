import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../lib/response';
import { ValidationError } from '../lib/errors';

type RequestSource = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, source: RequestSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      // Replace with sanitized and typed data
      (req as any)[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues || (err as any).errors || [];
        const details = issues.map((e: any) => ({
          field: e.path ? e.path.join('.') : '',
          message: e.message,
        }));
        return sendError(res, new ValidationError('Validation failed on request ' + source, details));
      }
      return sendError(res, new ValidationError('Invalid request data'));
    }
  };
};
