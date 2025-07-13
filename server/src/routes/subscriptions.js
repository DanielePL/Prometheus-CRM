import express from 'express'
import stripeController from '../controllers/stripeController.js'

const router = express.Router()

// Get customer subscriptions
router.get('/:customerId', stripeController.getCustomerSubscriptions)

export default router
