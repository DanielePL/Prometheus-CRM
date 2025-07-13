# Subscription Management System

Complete Stripe integration for the Prometheus CRM with subscription plans, payment processing, and billing management.

## Features

### Frontend Components
- **SubscriptionCard**: Beautiful subscription plan cards with pricing and features
- **PaymentHistory**: Payment history table with status tracking
- **Subscriptions Page**: Complete subscription management interface

### Backend Integration
- **Stripe API**: Full Stripe integration for payments and subscriptions
- **Webhook Handling**: Real-time payment status updates
- **Security**: PCI-compliant payment processing

### Subscription Plans
- **REV1 Basic**: $9/month - Core tracking, Basic analytics
- **REV1 Standard**: $19/month - AI Assistant, Advanced analytics (Most Popular)
- **REV1 Premium**: $29/month - Motion tracking, VBT features
- **REV2 Coaching**: $199/month - Client management, Revenue sharing
- **REV3 Enterprise**: $499/month - Multi-coach, Full analytics

## Setup Instructions

### 1. Environment Variables

#### Frontend (.env)
```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (.env)
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PORT=8080
NODE_ENV=development
```

### 2. Stripe Configuration

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Create products and prices in Stripe Dashboard:
   - REV1 Basic: $9/month
   - REV1 Standard: $19/month  
   - REV1 Premium: $29/month
   - REV2 Coaching: $199/month
   - REV3 Enterprise: $499/month

4. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhooks`
5. Configure webhook events:
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 3. Installation

```bash
# Install frontend dependencies
cd client
npm install @stripe/stripe-js

# Install backend dependencies  
cd ../server
npm install stripe
```

### 4. Usage

#### Start the servers
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client  
npm run dev
```

#### Access the subscription page
Navigate to `http://localhost:3000/subscriptions`

## API Endpoints

### Subscription Management
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/create-subscription` - Create new subscription
- `POST /api/stripe/cancel-subscription` - Cancel subscription
- `GET /api/subscriptions/:customerId` - Get customer subscriptions
- `GET /api/stripe/payment-history/:customerId` - Get payment history
- `POST /api/stripe/webhooks` - Stripe webhook handler

## Security Features

- PCI-compliant payment processing through Stripe
- No sensitive payment data stored locally
- Webhook signature verification
- HTTPS enforcement for production
- Secure customer data handling

## Payment Flow

1. Customer selects subscription plan
2. Redirected to Stripe Checkout (in production)
3. Payment processed securely by Stripe
4. Webhook confirms payment success
5. Customer tier updated in database
6. Access granted to premium features

## Demo Mode

The current implementation includes demo/mock data for development:
- Simulated payment success
- Mock subscription data
- Test payment history
- Demo webhook responses

For production deployment:
- Replace mock data with real Stripe API calls
- Implement proper customer ID mapping
- Set up production webhook endpoints
- Configure production Stripe keys

## Monitoring

- Payment success/failure tracking
- Subscription lifecycle monitoring
- Revenue analytics integration
- Customer tier progression tracking

## Support

For Stripe integration issues:
- Check Stripe Dashboard logs
- Verify webhook delivery
- Monitor payment intent status
- Review subscription events
