"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const models_1 = require("../models");
const uuid_1 = require("uuid");
const errors_1 = require("../types/errors");
const emailService_1 = require("../services/emailService");
class OrderController {
    async createOrder(req, res) {
        console.log('[DEBUG] Creating order with body:', req.body);
        const db = (0, models_1.getDatabase)();
        try {
            // Generate a unique order number
            const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            // Create the order
            const order = await db.Order.create({
                ...req.body,
                id: (0, uuid_1.v4)(),
                orderNumber,
                status: 'pending'
            });
            // Send confirmation email
            try {
                await emailService_1.emailService.sendOrderConfirmationEmail({
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
            }
            catch (emailError) {
                console.error('Failed to send order confirmation email:', emailError);
                // Don't throw the error as the order was still created successfully
            }
            res.status(201).json({
                success: true,
                data: order
            });
        }
        catch (error) {
            console.error('Error creating order:', error);
            throw new errors_1.AppError('Failed to create order', 500);
        }
    }
    async getOrder(req, res) {
        console.log('[DEBUG] Getting order with ID:', req.params.id);
        const db = (0, models_1.getDatabase)();
        try {
            const order = await db.Order.findByPk(req.params.id);
            if (!order) {
                throw new errors_1.AppError('Order not found', 404);
            }
            res.json({
                success: true,
                data: order
            });
        }
        catch (error) {
            console.error('Error retrieving order:', error);
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            throw new errors_1.AppError('Failed to retrieve order', 500);
        }
    }
    async getOrderByNumber(req, res) {
        console.log('[DEBUG] Getting order with number:', req.params.orderNumber);
        const db = (0, models_1.getDatabase)();
        try {
            const order = await db.Order.findOne({
                where: {
                    orderNumber: req.params.orderNumber
                }
            });
            if (!order) {
                throw new errors_1.AppError('Order not found', 404);
            }
            res.json({
                success: true,
                data: order
            });
        }
        catch (error) {
            console.error('Error retrieving order:', error);
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            throw new errors_1.AppError('Failed to retrieve order', 500);
        }
    }
    async updateOrderStatus(req, res) {
        console.log('[DEBUG] Updating order status. ID:', req.params.id, 'New status:', req.body.status);
        const db = (0, models_1.getDatabase)();
        try {
            const order = await db.Order.findByPk(req.params.id);
            if (!order) {
                throw new errors_1.AppError('Order not found', 404);
            }
            // Update the status
            await order.update({
                status: req.body.status
            });
            // Send status update email
            try {
                await emailService_1.emailService.sendOrderStatusUpdateEmail(order.customerEmail, order.orderNumber, order.status);
            }
            catch (emailError) {
                console.error('Failed to send order status update email:', emailError);
                // Don't throw the error as the order was still updated successfully
            }
            res.json({
                success: true,
                data: order
            });
        }
        catch (error) {
            console.error('Error updating order status:', error);
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            throw new errors_1.AppError('Failed to update order status', 500);
        }
    }
}
exports.orderController = new OrderController();
