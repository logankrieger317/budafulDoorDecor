"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = require("./routes/productRoutes");
const orders_routes_1 = require("./routes/orders.routes");
const requestLogger_1 = require("./middleware/requestLogger");
const errors_1 = require("./types/errors");
const models_1 = require("./models");
// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Configure CORS
const allowedOrigins = [
    'http://localhost:5173', // Vite development
    'http://localhost:3000', // Alternative local development
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
    origin: function (origin, callback) {
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
app.use((0, cors_1.default)(corsOptions));
// Middleware for parsing request body
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(requestLogger_1.requestLogger);
const startServer = async () => {
    try {
        // Initialize database first
        const db = await (0, models_1.initializeDatabase)();
        console.log('Database initialized successfully');
        // Debug middleware to log all requests
        app.use((req, _res, next) => {
            console.log(`[DEBUG] ${req.method} ${req.path}`);
            console.log('[DEBUG] Request Body:', req.body);
            next();
        });
        // Health check route
        app.get('/health', (_req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                env: process.env.NODE_ENV,
                dbStatus: db ? 'connected' : 'disconnected'
            });
        });
        // Debug route to list all registered routes
        app.get('/api/debug/routes', (_req, res) => {
            const routes = [];
            app._router.stack.forEach((middleware) => {
                if (middleware.route) {
                    routes.push(`${Object.keys(middleware.route.methods).join(',')} ${middleware.route.path}`);
                }
                else if (middleware.name === 'router') {
                    middleware.handle.stack.forEach((handler) => {
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
        // Product routes
        app.use('/api/products', productRoutes_1.productRoutes);
        // Order routes
        app.use('/api/orders', orders_routes_1.orderRoutes);
        console.log('[DEBUG] Routes setup complete');
        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('[DEBUG] Error:', err);
            if (err instanceof errors_1.AppError) {
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
        app.use((req, res) => {
            console.error(`[DEBUG] Route not found: ${req.method} ${req.path}`);
            res.status(404).json({
                status: 'error',
                message: `Route not found: ${req.method} ${req.path}`
            });
        });
        // Start server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Start the server
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
