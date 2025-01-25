"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailController = exports.EmailController = void 0;
const emailService_1 = require("../services/emailService");
const errors_1 = require("../types/errors");
class EmailController {
    async sendOrderConfirmationEmail(req, res) {
        try {
            const { customerInfo, items, total, orderNumber } = req.body;
            if (!customerInfo || !items || !total || !orderNumber) {
                throw new errors_1.AppError('Missing required order information', 400);
            }
            await emailService_1.emailService.sendOrderConfirmationEmail({
                customerInfo,
                items,
                total,
                orderNumber,
            });
            res.status(200).json({ message: 'Order confirmation email sent successfully' });
        }
        catch (error) {
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            throw new errors_1.AppError('Failed to send order confirmation email', 500);
        }
    }
    async sendOrderNotificationEmail(req, res) {
        try {
            const { customerInfo, items, total, orderNumber } = req.body;
            if (!customerInfo || !items || !total || !orderNumber) {
                throw new errors_1.AppError('Missing required order information', 400);
            }
            await emailService_1.emailService.sendOrderNotificationEmail({
                customerInfo,
                items,
                total,
                orderNumber,
            });
            res.status(200).json({ message: 'Order notification email sent successfully' });
        }
        catch (error) {
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            throw new errors_1.AppError('Failed to send order notification email', 500);
        }
    }
}
exports.EmailController = EmailController;
exports.emailController = new EmailController();
