import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// In-memory storage for demo (use proper database in production)
let subscriptions = []
let webhookEvents = []

const stripeWebhookController = {
  // Handle incoming Stripe webhooks
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature']
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event
    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
      console.log(`✅ Webhook verified: ${event.type}`)
    } catch (err) {
      console.log(`❌ Webhook signature verification failed: ${err.message}`)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Store webhook event
    const webhookEvent = {
      id: event.id,
      type: event.type,
      created: new Date(event.created * 1000).toISOString(),
      processed: false,
      data: event.data.object
    }

    try {
      // Process different event types
      switch (event.type) {
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object)
          webhookEvent.processed = true
          webhookEvent.customer_email = event.data.object.customer ? 
            await getCustomerEmail(event.data.object.customer) : 'Unknown'
          console.log('📱 New subscription from mobile app:', event.data.object.id)
          break

        case 'invoice.payment_succeeded':
          await handlePaymentSucceeded(event.data.object)
          webhookEvent.processed = true
          webhookEvent.customer_email = event.data.object.customer_email || 'Unknown'
          console.log('💳 Payment succeeded from mobile app:', event.data.object.id)
          break

        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object)
          webhookEvent.processed = true
          webhookEvent.customer_email = event.data.object.customer ? 
            await getCustomerEmail(event.data.object.customer) : 'Unknown'
          console.log('🔄 Subscription updated from mobile app:', event.data.object.id)
          break

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object)
          webhookEvent.processed = true
          webhookEvent.customer_email = event.data.object.customer ? 
            await getCustomerEmail(event.data.object.customer) : 'Unknown'
          console.log('❌ Subscription cancelled from mobile app:', event.data.object.id)
          break

        default:
          console.log(`🔔 Unhandled event type: ${event.type}`)
          webhookEvent.customer_email = 'N/A'
      }

      // Store webhook event (keep last 100 events)
      webhookEvents.unshift(webhookEvent)
      if (webhookEvents.length > 100) {
        webhookEvents = webhookEvents.slice(0, 100)
      }

    } catch (error) {
      console.error(`❌ Error processing webhook ${event.type}:`, error)
      webhookEvent.processed = false
      webhookEvent.error = error.message
    }

    res.json({ received: true, event_type: event.type })
  },

  // Get recent webhook events
  getRecentEvents: async (req, res) => {
    try {
      // Return events from last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const recentEvents = webhookEvents.filter(event => 
        new Date(event.created) > twentyFourHoursAgo
      )

      res.json({
        success: true,
        events: recentEvents.slice(0, 20) // Limit to 20 most recent
      })
    } catch (error) {
      console.error('Error fetching webhook events:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}

// Helper function to get customer email
async function getCustomerEmail(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    return customer.email || 'No email'
  } catch (error) {
    console.error('Error fetching customer:', error)
    return 'Unknown'
  }
}

// Handle new subscription created
async function handleSubscriptionCreated(subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer)
    const plan = subscription.items.data[0]?.price

    const subscriptionData = {
      id: subscription.id,
      customer_id: subscription.customer,
      customer_name: customer.name || 'Unknown',
      customer_email: customer.email || 'No email',
      plan_id: plan?.lookup_key || plan?.id || 'Unknown',
      plan_name: plan?.nickname || plan?.product?.name || 'Unknown Plan',
      amount: plan?.unit_amount || 0,
      currency: plan?.currency || 'eur',
      interval: plan?.recurring?.interval || 'month',
      status: subscription.status,
      created: new Date(subscription.created * 1000).toISOString(),
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      source: 'mobile_app'
    }

    // Store subscription (remove duplicates)
    subscriptions = subscriptions.filter(s => s.id !== subscription.id)
    subscriptions.unshift(subscriptionData)

    console.log('📱 Stored new mobile app subscription:', subscriptionData.id)
  } catch (error) {
    console.error('Error handling subscription created:', error)
    throw error
  }
}

// Handle payment succeeded
async function handlePaymentSucceeded(invoice) {
  try {
    // Update subscription payment info if it exists
    const subscriptionId = invoice.subscription
    if (subscriptionId) {
      const subIndex = subscriptions.findIndex(s => s.id === subscriptionId)
      if (subIndex !== -1) {
        subscriptions[subIndex].last_payment = new Date().toISOString()
        subscriptions[subIndex].last_payment_amount = invoice.amount_paid
        console.log('💳 Updated payment info for subscription:', subscriptionId)
      }
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
    throw error
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription) {
  try {
    const subIndex = subscriptions.findIndex(s => s.id === subscription.id)
    if (subIndex !== -1) {
      // Update existing subscription
      subscriptions[subIndex].status = subscription.status
      subscriptions[subIndex].current_period_end = new Date(subscription.current_period_end * 1000).toISOString()
      console.log('🔄 Updated subscription status:', subscription.id, subscription.status)
    } else {
      // If subscription doesn't exist, create it (might be first update we receive)
      await handleSubscriptionCreated(subscription)
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error)
    throw error
  }
}

// Handle subscription deleted/cancelled
async function handleSubscriptionDeleted(subscription) {
  try {
    const subIndex = subscriptions.findIndex(s => s.id === subscription.id)
    if (subIndex !== -1) {
      subscriptions[subIndex].status = 'canceled'
      subscriptions[subIndex].canceled_at = new Date().toISOString()
      console.log('❌ Marked subscription as cancelled:', subscription.id)
    }
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
    throw error
  }
}

// Export subscriptions data for API access
export const getSubscriptions = () => subscriptions
export const getWebhookEvents = () => webhookEvents

export default stripeWebhookController
