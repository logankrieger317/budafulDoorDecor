import express from 'express';
import { emailController } from '../controllers/emailController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

router.post(
  '/order-confirmation',
  asyncHandler(emailController.sendOrderConfirmationEmail.bind(emailController))
);

router.post(
  '/order-status-update',
  asyncHandler(emailController.sendOrderStatusUpdateEmail.bind(emailController))
);

export const emailRoutes = router;
export default router;
