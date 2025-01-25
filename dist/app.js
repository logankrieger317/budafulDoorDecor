"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = require("./routes/productRoutes");
const upload_routes_1 = require("./routes/upload.routes");
const email_routes_1 = __importDefault(require("./routes/email.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'https://budafuldoordecor-production.up.railway.app',
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/products', productRoutes_1.productRoutes);
app.use('/api/upload', upload_routes_1.uploadRoutes);
app.use('/api/email', email_routes_1.default);
app.use('/api/orders', order_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.name === 'AppError') {
        res.status(err.statusCode || 500).json({
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            message: 'Something went wrong!',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    }
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: `Route ${req.url} not found`,
    });
});
exports.default = app;
