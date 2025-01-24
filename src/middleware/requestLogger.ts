import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from './types';

export const requestLogger: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });

  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};
