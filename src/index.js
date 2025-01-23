const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

// Configure CORS to accept requests from your frontend
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://budafuldoordecor.com',  // Add your production domain
  'https://www.budafuldoordecor.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Validate environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASSWORD', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Create email transporter
const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  debug: true, // Enable debug logs
  logger: true, // Enable logger
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD.replace(/^"|"$/g, '') // Remove quotes if present
  },
  tls: {
    // Required for Titan Mail
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Verification Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Test email endpoint
app.post('/api/email/test', async (req, res) => {
  try {
    console.log('Attempting to send test email...');
    await transporter.sendMail({
      from: {
        name: 'Budaful Door Designs',
        address: process.env.EMAIL_USER
      },
      to: process.env.EMAIL_USER,
      subject: 'Test Email',
      text: 'This is a test email to verify the email configuration.'
    });
    console.log('Test email sent successfully');
    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      details: error.message,
      stack: error.stack
    });
  }
});

// Simple test email endpoint
app.post('/api/email/simple-test', async (req, res) => {
  try {
    console.log('Sending simple test email...');
    
    const testResult = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ['Logankrieger317@gmail.com', 'contact@budafuldoordecor.com'], // Send to both addresses
      subject: 'Test Email from Budaful Door Designs (Multiple Recipients)',
      text: 'This is a test email to verify the email configuration is working correctly.',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify the email configuration is working correctly.</p>
        <p>If you received this email, it means the email service is configured properly.</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
        <p>Recipients: Multiple test recipients</p>
      `
    });

    console.log('Test email sent:', testResult);
    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      messageId: testResult.messageId
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      details: error.message,
      stack: error.stack
    });
  }
});

// Order confirmation email endpoint
app.post('/api/email/order-confirmation', async (req, res) => {
  try {
    const { customerEmail, customerName, items, totalAmount, shippingAddress } = req.body;
    
    // Create itemsList HTML
    const itemsList = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailResult = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Order Confirmation - Budaful Door Designs',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Thank You for Your Order!</h1>
          <p>Dear ${customerName},</p>
          <p>We've received your order and are processing it now. Here are your order details:</p>
          
          <h2 style="color: #666;">Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: left;">Quantity</th>
                <th style="padding: 10px; text-align: left;">Price</th>
                <th style="padding: 10px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total Amount:</strong></td>
                <td style="padding: 10px;"><strong>$${totalAmount.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>

          <h2 style="color: #666; margin-top: 20px;">Shipping Address</h2>
          <p>
            ${shippingAddress.street}<br>
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
          </p>

          <p style="margin-top: 20px;">
            If you have any questions about your order, please don't hesitate to contact us at ${process.env.EMAIL_USER}.
          </p>

          <p style="color: #666; font-style: italic;">
            Thank you for choosing Budaful Door Designs!
          </p>
        </div>
      `
    });

    console.log('Order confirmation email sent:', emailResult);
    res.json({ success: true, messageId: emailResult.messageId });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    res.status(500).json({ 
      error: 'Failed to send order confirmation email',
      details: error.message
    });
  }
});

// Order notification email endpoint (for admin)
app.post('/api/email/order-notification', async (req, res) => {
  try {
    const { customerEmail, customerName, items, totalAmount, shippingAddress } = req.body;
    
    // Create itemsList HTML
    const itemsList = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailResult = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to admin email
      subject: 'New Order Received - Budaful Door Designs',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">New Order Received!</h1>
          
          <h2 style="color: #666;">Customer Information</h2>
          <p>
            <strong>Name:</strong> ${customerName}<br>
            <strong>Email:</strong> ${customerEmail}
          </p>

          <h2 style="color: #666;">Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: left;">Quantity</th>
                <th style="padding: 10px; text-align: left;">Price</th>
                <th style="padding: 10px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total Amount:</strong></td>
                <td style="padding: 10px;"><strong>$${totalAmount.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>

          <h2 style="color: #666; margin-top: 20px;">Shipping Address</h2>
          <p>
            ${shippingAddress.street}<br>
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
          </p>
        </div>
      `
    });

    console.log('Order notification email sent:', emailResult);
    res.json({ success: true, messageId: emailResult.messageId });
  } catch (error) {
    console.error('Failed to send order notification email:', error);
    res.status(500).json({ 
      error: 'Failed to send order notification email',
      details: error.message
    });
  }
});

// Send order confirmation email
app.post('/api/email/order-confirmation-old', async (req, res) => {
  try {
    console.log('Received order confirmation request:', req.body);
    
    const { customerInfo, items, total, orderDate } = req.body;

    if (!customerInfo || !items || !total || !orderDate) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['customerInfo', 'items', 'total', 'orderDate'],
        received: Object.keys(req.body)
      });
    }

    // Format items for email
    const formattedItems = items.map(item => {
      const options = item.customOptions
        ? ` (Size: ${item.customOptions.width}${item.customOptions.length ? ` x ${item.customOptions.length}` : ''})`
        : '';
      
      return `
        Item: ${item.name}${options}
        Quantity: ${item.quantity}
        Price: $${item.price}
        Subtotal: $${(item.price * item.quantity).toFixed(2)}
      `;
    }).join('\n');

    // Send email to customer
    await transporter.sendMail({
      from: {
        name: 'Budaful Door Designs',
        address: process.env.EMAIL_USER
      },
      to: customerInfo.email,
      subject: 'Order Confirmation - Budaful Door Designs',
      html: `
        <h2>Thank you for your order!</h2>
        <p>Dear ${customerInfo.firstName} ${customerInfo.lastName},</p>
        <p>We've received your order and will process it shortly.</p>
        
        <h3>Order Details:</h3>
        <p>Order Date: ${new Date(orderDate).toLocaleString()}</p>
        
        <h4>Items:</h4>
        <pre>${formattedItems}</pre>
        
        <p><strong>Total: $${total.toFixed(2)}</strong></p>
        
        <h3>Shipping Information:</h3>
        <p>${customerInfo.address || 'No shipping address provided'}</p>
        
        ${customerInfo.notes ? `<h3>Order Notes:</h3><p>${customerInfo.notes}</p>` : ''}
        
        <p>If you have any questions, please contact us at ${process.env.EMAIL_USER} or call ${process.env.PHONE_NUMBER}.</p>
        
        <p>Thank you for shopping with Budaful Door Designs!</p>
      `
    });

    res.json({ success: true, message: 'Order confirmation email sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message,
      stack: error.stack
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Email configuration:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.EMAIL_USER
  });
});
