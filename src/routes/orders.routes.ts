import express from 'express';
import { orderController } from '../controllers/orderController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

// Debug logging
console.log('[DEBUG] Setting up order routes');

// POST route for creating orders
router.post('/', (req, res, next) => {
  console.log('[DEBUG] POST /api/orders hit with body:', req.body);
  next();
}, asyncHandler(orderController.createOrder.bind(orderController)));

// GET route for retrieving order by number
router.get('/number/:orderNumber', (req, res, next) => {
  console.log('[DEBUG] GET /api/orders/number/:orderNumber hit with params:', req.params);
  next();
}, asyncHandler(orderController.getOrderByNumber.bind(orderController)));

// GET route for retrieving order by ID
router.get('/:id', (req, res, next) => {
  console.log('[DEBUG] GET /api/orders/:id hit with params:', req.params);
  next();
}, asyncHandler(orderController.getOrder.bind(orderController)));

// PATCH route for updating order status
router.patch('/:id/status', (req, res, next) => {
  console.log('[DEBUG] PATCH /api/orders/:id/status hit with params:', req.params, 'body:', req.body);
  next();
}, asyncHandler(orderController.updateOrderStatus.bind(orderController)));

console.log('[DEBUG] Order routes setup complete with routes:');
console.log('[DEBUG] - POST /');
console.log('[DEBUG] - GET /number/:orderNumber');
console.log('[DEBUG] - GET /:id');
console.log('[DEBUG] - PATCH /:id/status');

// Export only one version of the router
export const orderRoutes = router;
