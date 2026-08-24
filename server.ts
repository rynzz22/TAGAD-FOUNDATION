import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes (todo: create these)
import authRoutes from './server/routes/auth';
import userRoutes from './server/routes/users';
import beneficiaryRoutes from './server/routes/beneficiaries';
import programRoutes from './server/routes/programs';
import gadPlanRoutes from './server/routes/gadPlans';
import accomplishmentRoutes from './server/routes/accomplishments';
import dashboardRoutes from './server/routes/dashboard';
import reportRoutes from './server/routes/reports';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/beneficiaries', beneficiaryRoutes);
  app.use('/api/programs', programRoutes);
  app.use('/api/gad-plans', gadPlanRoutes);
  app.use('/api/accomplishments', accomplishmentRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reports', reportRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
