import { Request, Response } from 'express';
import { emailService } from '../services/emailService';
import { AppError } from '../types/errors';

export class EmailController {
  async sendOrderConfirmationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { customerInfo, items, total, orderNumber } = req.body;

      if (!customerInfo || !items || !total || !orderNumber) {
        throw new AppError('Missing required order information', 400);
      }

      await emailService.sendOrderConfirmationEmail({
        customerInfo,
        items,
        total,
        orderNumber,
      });

      res.status(200).json({ message: 'Order confirmation email sent successfully' });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to send order confirmation email', 500);
    }
  }

  async sendOrderNotificationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { customerInfo, items, total, orderNumber } = req.body;

      if (!customerInfo || !items || !total || !orderNumber) {
        throw new AppError('Missing required order information', 400);
      }

      await emailService.sendOrderNotificationEmail({
        customerInfo,
        items,
        total,
        orderNumber,
      });

      res.status(200).json({ message: 'Order notification email sent successfully' });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to send order notification email', 500);
    }
  }
}

export const emailController = new EmailController();
