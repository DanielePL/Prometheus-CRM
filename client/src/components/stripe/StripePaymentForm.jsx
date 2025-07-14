import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { 
  CreditCardIcon,
  LockClosedIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const StripePaymentForm = ({ plan, customerId, onSuccess, onError, onCancel }) => {
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setProcessing(true)
    setError('')

    try {
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      // Create payment intent
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          customerId: customerId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await response.json()

      // For demo purposes, create a test payment method using Stripe test token
      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvc: '123',
        },
      })

      if (pmError) {
        throw new Error(pmError.message)
      }

      // Process subscription
      const subscriptionResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          planId: plan.id,
          customerId: customerId
        })
      })

      if (!subscriptionResponse.ok) {
        const errorData = await subscriptionResponse.json()
        throw new Error(errorData.error || 'Failed to create subscription')
      }

      const subscriptionData = await subscriptionResponse.json()
      
      if (subscriptionData.success) {
        onSuccess(subscriptionData.subscription)
      } else {
        throw new Error(subscriptionData.error || 'Subscription creation failed')
      }

    } catch (err) {
      console.error('Payment error:', err)
      setError(err.message)
      onError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Subscribe to {plan.name}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Close</span>
          ✕
        </button>
      </div>

      <div className="mb-6">
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <LockClosedIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">
              This is a demo using Stripe test mode. No real charges will be made.
            </span>
          </div>
        </div>

        <div className="text-center py-4">
          <div className="text-3xl font-bold text-gray-900">
            ${plan.price}
            <span className="text-lg font-normal text-gray-500">/{plan.interval}</span>
          </div>
          <p className="text-gray-600 mt-2">{plan.name}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <CreditCardIcon className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Test Card Information</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Card Number: 4242 4242 4242 4242</p>
            <p>Expiry: 12/25 | CVC: 123</p>
            <p className="text-xs text-blue-600">This is automatically filled for demo purposes</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={processing}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Subscribe for $${plan.price}/${plan.interval}`
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center">
          <LockClosedIcon className="h-3 w-3 mr-1" />
          Secured by Stripe
        </div>
      </div>
    </div>
  )
}

export default StripePaymentForm
