"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const productRoutes_1 = require("./routes/productRoutes");
const routes_1 = __importDefault(require("./db/routes"));
const requestLogger_1 = require("./middleware/requestLogger");
const errorHandler_1 = require("./middleware/errorHandler");
const errors_1 = require("./types/errors");
// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const app = (0, express_1.default)();
// Configure CORS to accept requests from your frontend
const allowedOrigins = [
    'http://localhost:5173', // Local development
    'http://localhost:3000', // Alternative local development
    'https://budafuldoordecor.com',
    'https://www.budafuldoordecor.com'
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(requestLogger_1.requestLogger);
// Routes
app.use('/api/db', routes_1.default);
app.use('/api/products', productRoutes_1.productRoutes);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// Only validate email variables if we're using email features
if (process.env.USE_EMAIL === 'true') {
    const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASSWORD', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingEnvVars.length > 0) {
        console.error('Missing required environment variables:', missingEnvVars);
        process.exit(1);
    }
    // Create email transporter
    const transporter = nodemailer_1.default.createTransport({
        pool: true,
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        debug: true,
        logger: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD?.replace(/^"|"$/g, '')
        },
        tls: {
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2'
        }
    });
    // Verify email configuration
    transporter.verify((error) => {
        if (error) {
            console.error('SMTP Verification Error:', error);
        }
        else {
            console.log('SMTP Server is ready to take our messages');
        }
    });
}
// 404 handler
app.use((_req, res, next) => {
    next(new errors_1.AppError('Route not found', 404));
});
// Error handling
app.use(errorHandler_1.errorHandler);
// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
