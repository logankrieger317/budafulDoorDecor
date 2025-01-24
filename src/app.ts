import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { productRoutes } from './routes/productRoutes';
import { uploadRoutes } from './routes/upload.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
