import React, { useState, useEffect } from 'react'
import { 
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { stripeService } from '../../services/stripe'

const SubscriptionManager = ({ customerId, onSubscriptionChange }) => {
  const [subscriptions, setSubscriptions] = useState([])
  const [paymentHistory, setPaymentHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    loadSubscriptionData()
  }, [customerId])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      setError('')

      // Load subscriptions and payment history in parallel
      const [subsResponse, historyResponse] = await Promise.allSettled([
        stripeService.getCustomerSubscriptions(customerId),
        stripeService.getPaymentHistory(customerId)
      ])

      if (subsResponse.status === 'fulfilled') {
        setSubscriptions(subsResponse.value.subscriptions || [])
      } else {
        console.error('Failed to load subscriptions:', subsResponse.reason)
      }

      if (historyResponse.status === 'fulfilled') {
        setPaymentHistory(historyResponse.value.payments || [])
      } else {
        console.error('Failed to load payment history:', historyResponse.reason)
      }

    } catch (err) {
      console.error('Error loading subscription data:', err)
      setError('Failed to load subscription information')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async (subscriptionId) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return
    }

    try {
      setCancelling(subscriptionId)
      await stripeService.cancelSubscription(subscriptionId)
      
      // Reload subscription data
      await loadSubscriptionData()
      
      if (onSubscriptionChange) {
        onSubscriptionChange()
      }

    } catch (err) {
      console.error('Error cancelling subscription:', err)
      setError('Failed to cancel subscription')
    } finally {
      setCancelling(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      canceled: 'bg-red-100 text-red-800 border-red-200',
      past_due: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      incomplete: 'bg-gray-100 text-gray-800 border-gray-200'
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusStyles[status] || statusStyles.incomplete}`}>
        {status === 'active' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
        {status === 'canceled' && <XCircleIcon className="h-3 w-3 mr-1" />}
        {status === 'past_due' && <ExclamationTriangleIcon className="h-3 w-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const formatAmount = (amount, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading subscriptions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Subscriptions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Active Subscriptions</h3>
          <button
            onClick={loadSubscriptionData}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}

        {subscriptions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No active subscriptions found</p>
            <p className="text-sm text-gray-500 mt-1">Subscribe to a plan to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">
                        {subscription.plan_id || 'Unknown Plan'}
                      </h4>
                      {getStatusBadge(subscription.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Subscription ID: {subscription.id}
                    </p>
                    {subscription.current_period_end && (
                      <p className="text-sm text-gray-600">
                        Next billing: {formatDate(subscription.current_period_end)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {subscription.status === 'active' && (
                      <button
                        onClick={() => handleCancelSubscription(subscription.id)}
                        disabled={cancelling === subscription.id}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        {cancelling === subscription.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment History</h3>
        
        {paymentHistory.length === 0 ? (
          <div className="text-center py-8">
            <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No payment history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.map((payment, index) => (
                  <tr key={payment.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.created || Date.now() / 1000)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(payment.amount || 0, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status || 'unknown')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {payment.description || 'Subscription payment'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionManager
