# Budaful Door Designs Backend

Backend server for Budaful Door Designs e-commerce platform. Handles email notifications and order processing.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Fill in the required environment variables

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

- `EMAIL_USER`: Email address for sending notifications
- `EMAIL_PASSWORD`: Email password
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_SECURE`: Whether to use SSL/TLS
- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Frontend application URL for CORS

## API Endpoints

- `POST /api/email/order-confirmation`: Send order confirmation email to customer
- `POST /api/email/order-notification`: Send order notification to admin

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```
