import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { productRoutes } from './routes/productRoutes';
import { orderRoutes } from './routes/orders.routes';
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
  'https://budafuldoordecor-production.up.railway.app', // Railway backend
  'https://budafuldoordecor-backend-production.up.railway.app', // Railway backend
  'https://budafuldoordecor-production-bb09.up.railway.app' // Railway backend
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

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Debug middleware to log all requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[DEBUG] ${req.method} ${req.path}`);
  console.log('[DEBUG] Request Body:', req.body);
  next();
});

// Debug route to list all registered routes
app.get('/api/debug/routes', (_req: Request, res: Response) => {
  const routes: string[] = [];
  
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push(`${Object.keys(middleware.route.methods).join(',')} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          const path = handler.route.path;
          const methods = Object.keys(handler.route.methods);
          routes.push(`${methods.join(',')} ${path}`);
        }
      });
    }
  });
  
  res.json({
    routes,
    timestamp: new Date().toISOString()
  });
});

// Routes
console.log('[DEBUG] Setting up routes...');
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
console.log('[DEBUG] Routes setup complete');

// List all registered routes
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) { // routes registered directly on the app
    console.log(`[DEBUG] Route: ${middleware.route.path}`);
  } else if (middleware.name === 'router') { // router middleware 
    middleware.handle.stack.forEach((handler: any) => {
      if (handler.route) {
        const path = handler.route.path;
        const methods = Object.keys(handler.route.methods);
        console.log(`[DEBUG] Route: ${methods.join(',')} ${path}`);
      }
    });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[DEBUG] Error:', err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

// Handle 404 errors for unmatched routes
app.use((req: Request, res: Response) => {
  console.error(`[DEBUG] Route not found: ${req.method} ${req.path}`);
  throw new AppError('Route not found', 404);
});

const startServer = async () => {
  try {
    // Initialize database
    const db = await initializeDatabase();
    console.log('Database initialized successfully');

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
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
