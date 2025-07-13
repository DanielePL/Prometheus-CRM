import { useState, useEffect } from 'react'
import { stripeService } from '../services/stripe'

export const useSubscriptions = (customerId) => {
  const [subscriptions, setSubscriptions] = useState([])
  const [paymentHistory, setPaymentHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch subscriptions and payment history
  const fetchSubscriptions = async () => {
    if (!customerId) return

    try {
      setLoading(true)
      setError(null)

      const [subscriptionsData, paymentData] = await Promise.all([
        stripeService.getCustomerSubscriptions(customerId),
        stripeService.getPaymentHistory(customerId)
      ])

      setSubscriptions(subscriptionsData.subscriptions || [])
      setPaymentHistory(paymentData.payments || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching subscriptions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [customerId])

  // Get current active subscription
  const getCurrentSubscription = () => {
    return subscriptions.find(sub => sub.status === 'active') || null
  }

  // Process new subscription
  const createSubscription = async (planId, paymentMethodId) => {
    try {
      setLoading(true)
      const result = await stripeService.processSubscription(paymentMethodId, planId, customerId)
      
      // Refresh subscriptions after successful creation
      if (result.success) {
        await fetchSubscriptions()
      }
      
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Cancel subscription
  const cancelSubscription = async (subscriptionId) => {
    try {
      setLoading(true)
      const result = await stripeService.cancelSubscription(subscriptionId)
      
      // Refresh subscriptions after cancellation
      if (result.success) {
        await fetchSubscriptions()
      }
      
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create payment intent for one-time payments
  const createPaymentIntent = async (planId) => {
    try {
      setLoading(true)
      const result = await stripeService.createPaymentIntent(planId, customerId)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    subscriptions,
    paymentHistory,
    loading,
    error,
    getCurrentSubscription,
    createSubscription,
    cancelSubscription,
    createPaymentIntent,
    refetch: fetchSubscriptions
  }
}
