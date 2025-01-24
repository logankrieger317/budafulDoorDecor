"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
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
const sendEmail = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const mailConfig = {
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
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            error: 'Failed to send email',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.sendEmail = sendEmail;
