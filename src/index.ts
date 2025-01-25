import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { productRoutes } from './routes/productRoutes';
import { uploadRoutes } from './routes/upload.routes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './types/errors';
import { initializeDatabase } from './models';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS
const allowedOrigins = [
  'http://localhost:5173',  // Vite development
  'http://localhost:3000',  // Alternative local development
  'http://127.0.0.1:5173', // Vite development alternative
  'http://127.0.0.1:3000', // Alternative local development
  'https://budafuldoordecor.com',
  'https://www.budafuldoordecor.com',
  'https://budafuldoordecor.vercel.app', // Production frontend
  'https://www.budafuldoordecor.vercel.app', // Production frontend with www
  'https://budafuldoordecor-production.up.railway.app' // Railway backend
];

const corsOptions = {
  origin: function(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production') {
      // In development, log the origin for debugging
      console.log('Request origin:', origin);
      // Allow all origins in development
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('Blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(requestLogger);

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database first
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Only set up routes after database is initialized
    app.use('/api/products', productRoutes);
    app.use('/api/upload', uploadRoutes);

    // Error handling
    app.use(errorHandler);

    // 404 handler
    app.use((_req: Request, res: Response, next: NextFunction) => {
      next(new AppError('Route not found', 404));
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log('Environment:', process.env.NODE_ENV);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
