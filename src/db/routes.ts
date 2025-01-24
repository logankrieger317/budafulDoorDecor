import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { healthCheck } from './queries';

const router = express.Router();
const healthCheckHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isHealthy = await healthCheck();
    if (isHealthy) {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    } else {
      res.status(503).json({ status: 'unhealthy', timestamp: new Date().toISOString() });
    }
  } catch (error) {
    next(error);
  }
};

router.get('/health', healthCheckHandler);

export default router;
