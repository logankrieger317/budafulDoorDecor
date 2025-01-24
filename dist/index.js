"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = require("./routes/productRoutes");
const upload_routes_1 = require("./routes/upload.routes");
const requestLogger_1 = require("./middleware/requestLogger");
const errorHandler_1 = require("./middleware/errorHandler");
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
    'http://localhost:5173', // Local development
    'http://localhost:3000', // Alternative local development
    'https://budafuldoordecor.com',
    'https://www.budafuldoordecor.com',
    'https://budafuldoordecor.vercel.app', // Production frontend
    'https://www.budafuldoordecor.vercel.app' // Production frontend with www
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
// Middleware
app.use(express_1.default.json());
app.use(requestLogger_1.requestLogger);
// Health check route
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/products', productRoutes_1.productRoutes);
app.use('/api/upload', upload_routes_1.uploadRoutes);
// Error handling
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use((_req, res, next) => {
    next(new errors_1.AppError('Route not found', 404));
});
// Initialize database and start server
const startServer = async () => {
    try {
        const db = await (0, models_1.initializeDatabase)();
        console.log('Database initialized successfully');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
