import nodemailer from 'nodemailer';
import { CartItem, CustomerInfo } from '../types/models';

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
      throw error;
    }
  }

  async sendOrderNotificationEmail({ customerInfo, items, total, orderNumber }: OrderEmailParams): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${orderNumber}`,
      html: `
        <h1>New Order Received</h1>
        <p>Order Number: ${orderNumber}</p>
        <h2>Customer Details:</h2>
        <p>Name: ${customerInfo.firstName} ${customerInfo.lastName}</p>
        <p>Email: ${customerInfo.email}</p>
        <p>Phone: ${customerInfo.phone}</p>
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
        ${customerInfo.notes ? `<h3>Notes:</h3><p>${customerInfo.notes}</p>` : ''}
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Order notification email sent successfully');
    } catch (error) {
      console.error('Error sending order notification email:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
export default emailService;
