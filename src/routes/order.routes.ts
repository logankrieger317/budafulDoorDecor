import express from 'express';
import { orderController } from '../controllers/orderController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

router.post(
  '/',
  asyncHandler(orderController.createOrder.bind(orderController))
);

router.get(
  '/:id',
  asyncHandler(orderController.getOrder.bind(orderController))
);

router.get(
  '/number/:orderNumber',
  asyncHandler(orderController.getOrderByNumber.bind(orderController))
);

router.patch(
  '/:id/status',
  asyncHandler(orderController.updateOrderStatus.bind(orderController))
);

export const orderRoutes = router;
export default router;
