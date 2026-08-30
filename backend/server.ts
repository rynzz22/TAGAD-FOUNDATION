import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import cors from 'cors';
import { validateJwtConfig } from './server/lib/jwt';

// Route imports
import authRoutes from './server/routes/auth';
import publicRoutes from './server/routes/public';
import adminRoutes from './server/routes/admin/index';

// Transitional legacy compatibility routes
import userRoutes from './server/routes/users';
import beneficiaryRoutes from './server/routes/beneficiaries';
import programRoutes from './server/routes/programs';
import gadPlanRoutes from './server/routes/gadPlans';
import accomplishmentRoutes from './server/routes/accomplishments';
import dashboardRoutes from './server/routes/dashboard';
import reportRoutes from './server/routes/reports';
import statisticalCatalogRoutes from './server/routes/statisticalCatalog';
import { sendError } from './server/lib/response';

function startServer() {
  // Validate critical security & JWT configuration
  try {
    validateJwtConfig();
  } catch (err: any) {
    console.error('FATAL: Startup configuration error:', err.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      system: "TAGAD - Talibon Analytics for Gender and Development",
      version: "2.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  // Canonical Target API Boundaries
  app.use('/api/auth', authRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/admin', adminRoutes);

  // Transitional Compatibility Layer (Delegates directly to hardened services)
  app.use('/api/users', userRoutes);
  app.use('/api/beneficiaries', beneficiaryRoutes);
  app.use('/api/programs', programRoutes);
  app.use('/api/gad-plans', gadPlanRoutes);
  app.use('/api/accomplishments', accomplishmentRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/statistical-catalog', statisticalCatalogRoutes);

  // Centralized Error Handling Middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled server error:', err);
    sendError(res, err, err.statusCode || 500);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TAGAD Backend Engine running on http://localhost:${PORT}`);
  });
}

startServer();
