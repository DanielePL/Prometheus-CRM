import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51dummy_key')

// Subscription plans configuration
export const subscriptionPlans = [
  {
    id: 'rev1_tier1',
    name: 'REV1 Basic',
    price: 9,
    currency: 'USD',
    interval: 'month',
    tier: 'REV1',
    features: [
      'Core tracking',
      'Basic analytics',
      'Mobile app access',
      'Email support'
    ],
    popular: false
  },
  {
    id: 'rev1_tier2',
    name: 'REV1 Standard',
    price: 19,
    currency: 'USD',
    interval: 'month',
    tier: 'REV1',
    features: [
      'Everything in Basic',
      'AI Assistant',
      'Advanced analytics',
      'Priority support',
      'Custom workouts'
    ],
    popular: true
  },
  {
    id: 'rev1_tier3',
    name: 'REV1 Premium',
    price: 29,
    currency: 'USD',
    interval: 'month',
    tier: 'REV1',
    features: [
      'Everything in Standard',
      'Motion tracking',
      'VBT features',
      'Advanced biometrics',
      'Custom integrations'
    ],
    popular: false
  },
  {
    id: 'rev2_coaching',
    name: 'REV2 Coaching',
    price: 199,
    currency: 'USD',
    interval: 'month',
    tier: 'REV2',
    features: [
      'Client management platform',
      'Revenue sharing system',
      'Coach analytics',
      'White-label options',
      'API access'
    ],
    popular: false
  },
  {
    id: 'rev3_enterprise',
    name: 'REV3 Enterprise',
    price: 499,
    currency: 'USD',
    interval: 'month',
    tier: 'REV3',
    features: [
      'Multi-coach management',
      'Full analytics suite',
      'Custom development',
      'Dedicated support',
      'SLA guarantees'
    ],
    popular: false
  }
]

// Stripe service functions
export const stripeService = {
  // Get Stripe instance
  getStripe: async () => {
    return await stripePromise
  },

  // Create payment intent
  createPaymentIntent: async (planId, customerId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          customerId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw error
    }
  },

  // Process subscription
  processSubscription: async (paymentMethodId, planId, customerId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
          planId,
          customerId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to process subscription')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error processing subscription:', error)
      throw error
    }
  },

  // Get customer subscriptions
  getCustomerSubscriptions: async (customerId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/${customerId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      throw error
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  },

  // Get payment history
  getPaymentHistory: async (customerId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/payment-history/${customerId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment history')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching payment history:', error)
      throw error
    }
  }
}

export default stripeService
