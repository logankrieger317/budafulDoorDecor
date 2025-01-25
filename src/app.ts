import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { productRoutes } from './routes/productRoutes';
import { uploadRoutes } from './routes/upload.routes';
import emailRoutes from './routes/email.routes';
import orderRoutes from './routes/order.routes';

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://budafuldoordecor-production.up.railway.app',
    'https://budafuldoordecor-backend-production.up.railway.app'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  if (err.name === 'AppError') {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  } else {
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Route ${req.url} not found`,
  });
});

export default app;
