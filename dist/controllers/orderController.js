"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = exports.OrderController = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const errors_1 = require("../types/errors");
const uuid_1 = require("uuid");
class OrderController {
    async createOrder(req, res) {
        try {
            const { customerInfo, items, total, orderNumber } = req.body;
            if (!customerInfo || !items || !total) {
                throw new errors_1.AppError('Missing required order information', 400);
            }
            const order = await order_model_1.default.create({
                orderNumber: orderNumber || `ORD-${Date.now()}-${(0, uuid_1.v4)().slice(0, 8)}`,
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
        }
        catch (error) {
            console.error('Error creating order:', error);
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            throw new errors_1.AppError('Failed to create order', 500);
        }
    }
    async getOrder(req, res) {
        try {
            const { id } = req.params;
            const order = await order_model_1.default.findByPk(id);
            if (!order) {
                throw new errors_1.AppError('Order not found', 404);
            }
            res.status(200).json(order);
        }
        catch (error) {
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            throw new errors_1.AppError('Failed to retrieve order', 500);
        }
    }
    async getOrderByNumber(req, res) {
        try {
            const { orderNumber } = req.params;
            const order = await order_model_1.default.findOne({ where: { orderNumber } });
            if (!order) {
                throw new errors_1.AppError('Order not found', 404);
            }
            res.status(200).json(order);
        }
        catch (error) {
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            throw new errors_1.AppError('Failed to retrieve order', 500);
        }
    }
    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await order_model_1.default.findByPk(id);
            if (!order) {
                throw new errors_1.AppError('Order not found', 404);
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
        }
        catch (error) {
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            throw new errors_1.AppError('Failed to update order status', 500);
        }
    }
}
exports.OrderController = OrderController;
exports.orderController = new OrderController();
