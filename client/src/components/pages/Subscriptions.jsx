import React, { useState, useEffect } from 'react'
import { 
  CreditCardIcon,
  ShieldCheckIcon,
  CheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { subscriptionPlans } from '../../services/stripe'
import StripePaymentForm from '../stripe/StripePaymentForm'
import SubscriptionManager from '../stripe/SubscriptionManager'
import Toast from '../Toast'

const Subscriptions = () => {
  const [selectedCustomerId] = useState('demo-customer-123') // In real app, get from auth
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  const [refreshSubscriptions, setRefreshSubscriptions] = useState(0)

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
  }

  const hideToast = () => {
    setToast({ show: false, message: '', type: '' })
  }

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan)
    setShowPaymentForm(true)
  }

  const handlePaymentSuccess = (subscription) => {
    setShowPaymentForm(false)
    setSelectedPlan(null)
    showToast(`Successfully subscribed to ${selectedPlan?.name}!`, 'success')
    setRefreshSubscriptions(prev => prev + 1) // Trigger refresh
  }

  const handlePaymentError = (error) => {
    showToast(`Payment failed: ${error}`, 'error')
  }

  const handlePaymentCancel = () => {
    setShowPaymentForm(false)
    setSelectedPlan(null)
  }

  const handleSubscriptionChange = () => {
    setRefreshSubscriptions(prev => prev + 1) // Trigger refresh
    showToast('Subscription updated successfully', 'success')
  }

  if (showPaymentForm && selectedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Subscription</h1>
        </div>
        
        <div className="max-w-md mx-auto">
          <StripePaymentForm
            plan={selectedPlan}
            customerId={selectedCustomerId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        </div>

        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="mt-1 text-gray-600">Choose the perfect plan for your needs</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <ShieldCheckIcon className="h-5 w-5" />
          <span>Secured by Stripe</span>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
              plan.popular 
                ? 'border-blue-500 shadow-md' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-gray-900">
                ${plan.price}
                <span className="text-lg font-normal text-gray-500">/{plan.interval}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{plan.tier} Tier</p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              Subscribe to {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Current Subscriptions */}
      <SubscriptionManager
        key={refreshSubscriptions} // Force re-render on refresh
        customerId={selectedCustomerId}
        onSubscriptionChange={handleSubscriptionChange}
      />

      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <CreditCardIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Demo Mode Active</h4>
            <p className="text-sm text-blue-700 mt-1">
              This is a demonstration using Stripe test mode. No real payments will be processed. 
              You can test the subscription flow using the test card information provided.
            </p>
          </div>
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  )
}

export default Subscriptions
