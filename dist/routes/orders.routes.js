"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = express_1.default.Router();
// Debug logging
console.log('[DEBUG] Setting up order routes');
// POST route for creating orders
router.post('/', (req, res, next) => {
    console.log('[DEBUG] POST /api/orders hit with body:', req.body);
    next();
}, (0, asyncHandler_1.asyncHandler)(orderController_1.orderController.createOrder.bind(orderController_1.orderController)));
// GET route for retrieving order by number
router.get('/number/:orderNumber', (req, res, next) => {
    console.log('[DEBUG] GET /api/orders/number/:orderNumber hit with params:', req.params);
    next();
}, (0, asyncHandler_1.asyncHandler)(orderController_1.orderController.getOrderByNumber.bind(orderController_1.orderController)));
// GET route for retrieving order by ID
router.get('/:id', (req, res, next) => {
    console.log('[DEBUG] GET /api/orders/:id hit with params:', req.params);
    next();
}, (0, asyncHandler_1.asyncHandler)(orderController_1.orderController.getOrder.bind(orderController_1.orderController)));
// PATCH route for updating order status
router.patch('/:id/status', (req, res, next) => {
    console.log('[DEBUG] PATCH /api/orders/:id/status hit with params:', req.params, 'body:', req.body);
    next();
}, (0, asyncHandler_1.asyncHandler)(orderController_1.orderController.updateOrderStatus.bind(orderController_1.orderController)));
console.log('[DEBUG] Order routes setup complete with routes:');
console.log('[DEBUG] - POST /');
console.log('[DEBUG] - GET /number/:orderNumber');
console.log('[DEBUG] - GET /:id');
console.log('[DEBUG] - PATCH /:id/status');
// Export only one version of the router
exports.orderRoutes = router;
