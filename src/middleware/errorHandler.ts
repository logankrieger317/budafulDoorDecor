import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors';
import { ErrorRequestHandler } from './types';

export const errorHandler: ErrorRequestHandler = (error: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
