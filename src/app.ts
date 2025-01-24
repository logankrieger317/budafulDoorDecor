import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/upload.routes';
import productRoutes from './routes/product.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);

// Basic error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
