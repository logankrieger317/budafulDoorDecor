import { Request, Response } from 'express';
import { getDatabase } from '../models';
import { Order, OrderCreationAttributes } from '../models/order.model';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../types/errors';
import { emailService } from '../services/emailService';

class OrderController {
  async createOrder(req: Request, res: Response) {
    console.log('[DEBUG] Creating order with body:', req.body);
    const db = getDatabase();

    try {
      // Generate a unique order number
      const orderNumber = req.body.orderNumber || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Transform the nested data structure to flat structure
      const orderData: OrderCreationAttributes = {
        orderNumber,
        customerFirstName: req.body.customerInfo.firstName,
        customerLastName: req.body.customerInfo.lastName,
        customerEmail: req.body.customerInfo.email,
        customerPhone: req.body.customerInfo.phone,
        shippingStreet: req.body.customerInfo.address.street,
        shippingCity: req.body.customerInfo.address.city,
        shippingState: req.body.customerInfo.address.state,
        shippingZipCode: req.body.customerInfo.address.zipCode,
        orderItems: req.body.items || [],
        total: req.body.total,
        notes: req.body.customerInfo.notes || '',
        status: 'pending' as const
      };

      console.log('[DEBUG] Transformed order data:', orderData);

      // Create the order with the transformed data
      const order = await db.Order.create(orderData);

      // Send confirmation email
      try {
        await emailService.sendOrderConfirmationEmail({
          customerInfo: {
            firstName: order.customerFirstName,
            lastName: order.customerLastName,
            email: order.customerEmail,
            phone: order.customerPhone,
            address: {
              street: order.shippingStreet,
              city: order.shippingCity,
              state: order.shippingState,
              zipCode: order.shippingZipCode
            }
          },
          items: order.orderItems,
          total: order.total,
          orderNumber: order.orderNumber
        });
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't throw the error as the order was still created successfully
      }

      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      throw new AppError('Failed to create order', 500);
    }
  }

  async getOrder(req: Request, res: Response) {
    console.log('[DEBUG] Getting order with ID:', req.params.id);
    const db = getDatabase();

    try {
      const order = await db.Order.findByPk(req.params.id);
      
      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Error retrieving order:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to retrieve order', 500);
    }
  }

  async getOrderByNumber(req: Request, res: Response) {
    console.log('[DEBUG] Getting order with number:', req.params.orderNumber);
    const db = getDatabase();

    try {
      const order = await db.Order.findOne({
        where: {
          orderNumber: req.params.orderNumber
        }
      });
      
      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Error retrieving order:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to retrieve order', 500);
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    console.log('[DEBUG] Updating order status. ID:', req.params.id, 'New status:', req.body.status);
    const db = getDatabase();

    try {
      const order = await db.Order.findByPk(req.params.id);
      
      if (!order) {
        throw new AppError('Order not found', 404);
      }

      // Update the status
      await order.update({
        status: req.body.status
      });

      // Send status update email
      try {
        await emailService.sendOrderStatusUpdateEmail(
          order.customerEmail,
          order.orderNumber,
          order.status
        );
      } catch (emailError) {
        console.error('Failed to send order status update email:', emailError);
        // Don't throw the error as the order was still updated successfully
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update order status', 500);
    }
  }
}

export const orderController = new OrderController();
