import express from 'express'
import stripeWebhookController from '../controllers/stripeWebhookController.js'

const router = express.Router()

// Stripe webhook endpoint (raw body needed for signature verification)
router.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhookController.handleWebhook)

// Get recent webhook events
router.get('/recent', stripeWebhookController.getRecentEvents)

export default router
