import express from 'express'
import stripeController from '../controllers/stripeController.js'

const router = express.Router()

// Create payment intent for one-time payments
router.post('/create-payment-intent', stripeController.createPaymentIntent)

// Create subscription
router.post('/create-subscription', stripeController.createSubscription)

// Cancel subscription
router.post('/cancel-subscription', stripeController.cancelSubscription)

// Get payment history for a customer
router.get('/payment-history/:customerId', stripeController.getPaymentHistory)

// Get customer subscriptions
router.get('/subscriptions/:customerId', stripeController.getCustomerSubscriptions)

// Stripe webhook endpoint
router.post('/webhooks', express.raw({ type: 'application/json' }), stripeController.handleWebhook)

export default router
