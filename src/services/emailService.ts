import nodemailer from 'nodemailer';
import { CartItem } from '../types/models';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
}

interface OrderEmailParams {
  customerInfo: CustomerInfo;
  items: CartItem[];
  total: number;
  orderNumber: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendOrderConfirmationEmail({ customerInfo, items, total, orderNumber }: OrderEmailParams): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerInfo.email,
      subject: `Order Confirmation #${orderNumber}`,
      html: `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order, ${customerInfo.firstName} ${customerInfo.lastName}!</p>
        <h2>Order Details</h2>
        <p>Order Number: ${orderNumber}</p>
        <h3>Items:</h3>
        <ul>
          ${items.map(item => `
            <li>${item.name} - Quantity: ${item.quantity} - $${item.price}</li>
          `).join('')}
        </ul>
        <p>Total: $${total.toFixed(2)}</p>
        <h3>Shipping Address:</h3>
        <p>
          ${customerInfo.address.street}<br>
          ${customerInfo.address.city}, ${customerInfo.address.state} ${customerInfo.address.zipCode}
        </p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw new Error('Failed to send order confirmation email');
    }
  }

  async sendOrderStatusUpdateEmail(
    email: string,
    orderNumber: string,
    status: string
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Status Update #${orderNumber}`,
      html: `
        <h1>Order Status Update</h1>
        <p>Your order #${orderNumber} has been updated to: ${status}</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Order status update email sent successfully');
    } catch (error) {
      console.error('Error sending order status update email:', error);
      throw new Error('Failed to send order status update email');
    }
  }
}

export const emailService = new EmailService();
export default emailService;
