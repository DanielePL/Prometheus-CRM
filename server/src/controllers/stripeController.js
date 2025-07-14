import Stripe from 'stripe'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Lazy initialization of Stripe to ensure environment variables are loaded
let stripe = null

const getStripe = () => {
  if (!stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required')
    }
    stripe = new Stripe(apiKey)
  }
  return stripe
}

// Function to get or create price for a plan
const getOrCreatePrice = async (planId) => {
  const planDetails = {
    'rev1_tier1': { amount: 900, name: 'REV1 Basic' },
    'rev1_tier2': { amount: 1900, name: 'REV1 Standard' },
    'rev1_tier3': { amount: 2900, name: 'REV1 Premium' },
    'rev2_coaching': { amount: 19900, name: 'REV2 Coaching' },
    'rev3_enterprise': { amount: 49900, name: 'REV3 Enterprise' }
  }

  const plan = planDetails[planId]
  if (!plan) {
    throw new Error(`Invalid plan ID: ${planId}`)
  }

  try {
    // Create a new price each time for testing
    const price = await getStripe().prices.create({
      unit_amount: plan.amount,
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      product_data: {
        name: plan.name,
        metadata: {
          plan_id: planId
        }
      }
    })
    
    return price.id
  } catch (error) {
    console.error(`Error creating price for ${planId}:`, error)
    throw error
  }
}

// Legacy subscription plans mapping (for backwards compatibility)
const planPrices = {
  'rev1_tier1': 'price_1dummy_tier1',
  'rev1_tier2': 'price_1dummy_tier2', 
  'rev1_tier3': 'price_1dummy_tier3',
  'rev2_coaching': 'price_1dummy_coaching',
  'rev3_enterprise': 'price_1dummy_enterprise'
}

const stripeController = {
  // Create payment intent for one-time payments
  createPaymentIntent: async (req, res) => {
    try {
      const { planId, customerId } = req.body

      if (!planId || !customerId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: planId, customerId'
        })
      }

      // Get plan details
      const planPricing = {
        'rev1_tier1': 900, // $9.00 in cents
        'rev1_tier2': 1900,
        'rev1_tier3': 2900,
        'rev2_coaching': 19900,
        'rev3_enterprise': 49900
      }

      const amount = planPricing[planId]
      if (!amount) {
        return res.status(400).json({
          success: false,
          error: 'Invalid plan ID'
        })
      }

      // Create payment intent
      const paymentIntent = await getStripe().paymentIntents.create({
        amount,
        currency: 'usd',
        metadata: {
          planId,
          customerId
        }
      })

      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })

    } catch (error) {
      console.error('Error creating payment intent:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  },

  // Create subscription
  createSubscription: async (req, res) => {
    try {
      const { paymentMethodId, planId, customerId } = req.body

      if (!paymentMethodId || !planId || !customerId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        })
      }

      // Get the payment method to check if it's already attached to a customer
      const paymentMethod = await getStripe().paymentMethods.retrieve(paymentMethodId)
      
      let stripeCustomer
      
      if (paymentMethod.customer) {
        // Payment method is already attached to a customer, use that customer
        stripeCustomer = await getStripe().customers.retrieve(paymentMethod.customer)
        console.log('Using existing customer:', stripeCustomer.id)
      } else {
        // Create new customer and attach payment method
        try {
          stripeCustomer = await getStripe().customers.create({
            metadata: { customerId }
          })
          
          // Attach payment method to customer
          await getStripe().paymentMethods.attach(paymentMethodId, {
            customer: stripeCustomer.id
          })
          
          console.log('Created new customer:', stripeCustomer.id)
        } catch (error) {
          console.error('Error creating Stripe customer:', error)
          return res.status(500).json({
            success: false,
            error: 'Failed to create customer'
          })
        }
      }

      // Set as default payment method
      await getStripe().customers.update(stripeCustomer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      })

      // Get or create price ID for plan
      const priceId = await getOrCreatePrice(planId)
      console.log('Using price ID:', priceId)

      // Create subscription
      const subscription = await getStripe().subscriptions.create({
        customer: stripeCustomer.id,
        items: [{ price: priceId }],
        metadata: {
          planId,
          customerId
        }
      })

      res.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          plan_id: planId
        }
      })

    } catch (error) {
      console.error('Error creating subscription:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  },

  // Cancel subscription
  cancelSubscription: async (req, res) => {
    try {
      const { subscriptionId } = req.body

      if (!subscriptionId) {
        return res.status(400).json({
          success: false,
          error: 'Missing subscription ID'
        })
      }

      // Cancel subscription at period end
      const subscription = await getStripe().subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      })

      res.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end
        }
      })

    } catch (error) {
      console.error('Error canceling subscription:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  },

  // Get customer subscriptions
  getCustomerSubscriptions: async (req, res) => {
    try {
      const { customerId } = req.params

      if (!customerId) {
        return res.status(400).json({
          success: false,
          error: 'Missing customer ID'
        })
      }

      // For demo purposes, return mock subscription data
      // In a real app, you would query your database for the customer's Stripe customer ID
      // and then fetch their subscriptions from Stripe
      
      const mockSubscriptions = [
        {
          id: 'sub_demo123',
          plan_id: 'rev1_tier2',
          plan_name: 'REV1 Standard',
          status: 'active',
          current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
          amount: 1900,
          currency: 'usd'
        }
      ]

      res.json({
        success: true,
        subscriptions: mockSubscriptions
      })

    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  },

  // Get payment history
  getPaymentHistory: async (req, res) => {
    try {
      const { customerId } = req.params

      if (!customerId) {
        return res.status(400).json({
          success: false,
          error: 'Missing customer ID'
        })
      }

      // For demo purposes, return mock payment data
      const mockPayments = [
        {
          id: 'pi_demo123',
          amount: 1900,
          currency: 'usd',
          status: 'succeeded',
          description: 'Payment for REV1 Standard',
          created: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60), // 7 days ago
          payment_method: {
            last4: '4242',
            brand: 'visa'
          },
          receipt_url: 'https://pay.stripe.com/receipts/demo'
        },
        {
          id: 'pi_demo124',
          amount: 900,
          currency: 'usd',
          status: 'succeeded',
          description: 'Payment for REV1 Basic',
          created: Math.floor(Date.now() / 1000) - (37 * 24 * 60 * 60), // 37 days ago
          payment_method: {
            last4: '4242',
            brand: 'visa'
          },
          receipt_url: 'https://pay.stripe.com/receipts/demo2'
        }
      ]

      res.json({
        success: true,
        payments: mockPayments
      })

    } catch (error) {
      console.error('Error fetching payment history:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  },

  // Handle Stripe webhooks
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature']
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event
    try {
      event = getStripe().webhooks.constructEvent(req.body, sig, endpointSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        // Update customer tier in database
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        console.log('Invoice payment succeeded:', invoice.id)
        // Update subscription status in database
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object
        console.log('Subscription updated:', subscription.id)
        // Update subscription in database
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        console.log('Subscription cancelled:', deletedSubscription.id)
        // Update customer tier in database
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  }
}

export default stripeController
