import { Request, Response } from 'express';
import Order from '../models/order.model';
import { AppError } from '../types/errors';
import { v4 as uuidv4 } from 'uuid';

export class OrderController {
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { customerInfo, items, total, orderNumber } = req.body;

      if (!customerInfo || !items || !total) {
        throw new AppError('Missing required order information', 400);
      }

      const order = await Order.create({
        orderNumber: orderNumber || `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`,
        customerFirstName: customerInfo.firstName,
        customerLastName: customerInfo.lastName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingStreet: customerInfo.address.street,
        shippingCity: customerInfo.address.city,
        shippingState: customerInfo.address.state,
        shippingZipCode: customerInfo.address.zipCode,
        orderItems: items,
        total: total,
        notes: customerInfo.notes,
        status: 'pending',
      });

      res.status(201).json({
        message: 'Order created successfully',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
        },
      });
    } catch (error) {
      console.error('Error creating order:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create order', 500);
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.status(200).json(order);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to retrieve order', 500);
    }
  }

  async getOrderByNumber(req: Request, res: Response): Promise<void> {
    try {
      const { orderNumber } = req.params;
      const order = await Order.findOne({ where: { orderNumber } });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.status(200).json(order);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to retrieve order', 500);
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findByPk(id);
      if (!order) {
        throw new AppError('Order not found', 404);
      }

      await order.update({ status });
      res.status(200).json({
        message: 'Order status updated successfully',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update order status', 500);
    }
  }
}

export const orderController = new OrderController();
