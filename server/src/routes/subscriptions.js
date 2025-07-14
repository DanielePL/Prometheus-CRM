import express from 'express'
import stripeController from '../controllers/stripeController.js'
import { getSubscriptions, getWebhookEvents } from '../controllers/stripeWebhookController.js'

const router = express.Router()

// Get all subscriptions from mobile app
router.get('/', (req, res) => {
  try {
    const subscriptions = getSubscriptions()
    
    // Sort by creation date (newest first)
    const sortedSubscriptions = subscriptions.sort((a, b) => 
      new Date(b.created) - new Date(a.created)
    )

    res.json({
      success: true,
      count: sortedSubscriptions.length,
      subscriptions: sortedSubscriptions
    })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get subscription statistics
router.get('/stats', (req, res) => {
  try {
    const subscriptions = getSubscriptions()
    
    const stats = {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'active').length,
      trialing: subscriptions.filter(s => s.status === 'trialing').length,
      canceled: subscriptions.filter(s => s.status === 'canceled').length,
      past_due: subscriptions.filter(s => s.status === 'past_due').length,
      unpaid: subscriptions.filter(s => s.status === 'unpaid').length,
      incomplete: subscriptions.filter(s => s.status === 'incomplete').length,
      total_revenue: subscriptions.reduce((sum, sub) => {
        if (sub.status === 'active' || sub.status === 'trialing') {
          return sum + (sub.amount || 0)
        }
        return sum
      }, 0),
      monthly_revenue: subscriptions.reduce((sum, sub) => {
        if ((sub.status === 'active' || sub.status === 'trialing') && sub.interval === 'month') {
          return sum + (sub.amount || 0)
        }
        return sum
      }, 0),
      yearly_revenue: subscriptions.reduce((sum, sub) => {
        if ((sub.status === 'active' || sub.status === 'trialing') && sub.interval === 'year') {
          return sum + (sub.amount || 0)
        }
        return sum
      }, 0)
    }

    res.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error calculating stats:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get recent webhook events
router.get('/events', (req, res) => {
  try {
    const events = getWebhookEvents()
    
    res.json({
      success: true,
      count: events.length,
      events: events.slice(0, 50) // Last 50 events
    })
  } catch (error) {
    console.error('Error fetching webhook events:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Legacy route - Get customer subscriptions (kept for backward compatibility)
router.get('/customer/:customerId', stripeController.getCustomerSubscriptions)

export default router
