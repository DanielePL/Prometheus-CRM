import React from 'react'
import { 
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const PaymentHistory = ({ payments, loading }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-400" />
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />
      case 'canceled':
        return <XCircleIcon className="w-5 h-5 text-gray-400" />
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      succeeded: 'bg-green-500/20 text-green-400 border-green-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      canceled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      refunded: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
    
    return badges[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  const formatAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100) // Stripe amounts are in cents
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Payment History</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-600 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">Payment History</h3>
        <CreditCardIcon className="w-6 h-6 text-gray-400" />
      </div>

      {payments && payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div 
              key={payment.id || index} 
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-700/50 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(payment.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">
                      {payment.description || `Payment for ${payment.plan_name || 'Subscription'}`}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(payment.status)}`}>
                      {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {formatDate(payment.created || payment.date)}
                    {payment.payment_method && (
                      <span className="ml-2">
                        • **** {payment.payment_method.last4 || '****'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  payment.status === 'succeeded' ? 'text-green-400' : 
                  payment.status === 'failed' ? 'text-red-400' : 
                  'text-gray-300'
                }`}>
                  {formatAmount(payment.amount, payment.currency)}
                </p>
                {payment.receipt_url && (
                  <a 
                    href={payment.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 text-sm transition-colors"
                  >
                    View Receipt
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <CreditCardIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No payment history found</p>
          <p className="text-gray-500 text-sm mt-1">
            Payments will appear here once you subscribe to a plan
          </p>
        </div>
      )}
    </div>
  )
}

export default PaymentHistory
