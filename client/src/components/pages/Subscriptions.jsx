import React, { useState, useEffect } from 'react'
import { 
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { subscriptionPlans } from '../../services/stripe'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import SubscriptionCard from '../subscription/SubscriptionCard'
import PaymentHistory from '../subscription/PaymentHistory'
import Toast from '../Toast'

const Subscriptions = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('default-customer') // In real app, get from auth
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  
  const { 
    subscriptions, 
    paymentHistory, 
    loading, 
    error, 
    getCurrentSubscription,
    createSubscription,
    cancelSubscription,
    createPaymentIntent 
  } = useSubscriptions(selectedCustomerId)

  const currentSubscription = getCurrentSubscription()

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
  }

  const hideToast = () => {
    setToast({ show: false, message: '', type: '' })
  }

  const handleSubscribe = async (plan) => {
    try {
      // In a real app, you would integrate with Stripe Elements for payment
      // For demo purposes, we'll simulate the process
      showToast(`Redirecting to payment for ${plan.name}...`, 'success')
      
      // Simulate payment process
      setTimeout(() => {
        showToast(`Successfully subscribed to ${plan.name}!`, 'success')
      }, 2000)
      
    } catch (error) {
      showToast(`Failed to subscribe: ${error.message}`, 'error')
    }
  }

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return

    try {
      const result = await cancelSubscription(currentSubscription.id)
      if (result.success) {
        showToast('Subscription cancelled successfully', 'success')
      }
    } catch (error) {
      showToast(`Failed to cancel subscription: ${error.message}`, 'error')
    }
  }

  if (error) {
    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Subscription Management</h2>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <ExclamationCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Subscriptions</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Subscription Management</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {loading ? 'Loading...' : 'Manage your subscription'}
          </div>
          {loading && (
            <ArrowPathIcon className="w-5 h-5 text-orange-500 animate-spin" />
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-white text-lg font-semibold">Active Subscription</h3>
                  <p className="text-gray-300">
                    You're currently subscribed to <span className="text-green-400 font-semibold">{currentSubscription.plan_name}</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Next billing: {new Date(currentSubscription.current_period_end * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-xl font-semibold">Choose Your Plan</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <InformationCircleIcon className="w-4 h-4" />
              Cancel anytime • Secure payments
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {subscriptionPlans.map((plan) => {
              const isCurrentPlan = currentSubscription?.plan_id === plan.id
              return (
                <SubscriptionCard
                  key={plan.id}
                  plan={plan}
                  currentPlan={currentSubscription}
                  isCurrentPlan={isCurrentPlan}
                  onSubscribe={handleSubscribe}
                  loading={loading}
                />
              )
            })}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Why Upgrade?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <CreditCardIcon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Secure Payments</h4>
              <p className="text-gray-400 text-sm">
                Industry-standard encryption and PCI compliance for secure transactions
              </p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">No Commitment</h4>
              <p className="text-gray-400 text-sm">
                Cancel or change your plan anytime. No long-term contracts required
              </p>
            </div>
            <div className="text-center">
              <ArrowPathIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Instant Access</h4>
              <p className="text-gray-400 text-sm">
                Immediate access to premium features after successful payment
              </p>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <PaymentHistory payments={paymentHistory} loading={loading} />

        {/* Security Notice */}
        <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-5 h-5 text-green-400" />
            <div className="text-sm">
              <span className="text-white font-medium">Secure & Encrypted:</span>
              <span className="text-gray-300 ml-1">
                All payments are processed securely through Stripe. We never store your payment information.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />
    </div>
  )
}

export default Subscriptions
