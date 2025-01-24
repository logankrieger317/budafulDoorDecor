import nodemailer from 'nodemailer';
import { Request, Response } from 'express';

interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD?.replace(/^"|"$/g, '')
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  }
});

export const sendEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    const mailConfig: EmailConfig = {
      from: process.env.EMAIL_USER || '',
      to: process.env.RECIPIENT_EMAIL || '',
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    };

    await transporter.sendMail(mailConfig);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
