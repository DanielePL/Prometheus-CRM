import React, { useState } from 'react'
import { 
  CheckIcon, 
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const SubscriptionCard = ({ 
  plan, 
  currentPlan, 
  isCurrentPlan, 
  onSubscribe, 
  loading,
  disabled = false 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const getButtonText = () => {
    if (isCurrentPlan) return 'Current Plan'
    if (currentPlan && plan.price > currentPlan.price) return 'Upgrade'
    if (currentPlan && plan.price < currentPlan.price) return 'Downgrade'
    return 'Subscribe'
  }

  const getButtonIcon = () => {
    if (isCurrentPlan) return <CheckIcon className="w-5 h-5" />
    if (currentPlan && plan.price > currentPlan.price) return <ArrowUpIcon className="w-5 h-5" />
    if (currentPlan && plan.price < currentPlan.price) return <ArrowDownIcon className="w-5 h-5" />
    return <SparklesIcon className="w-5 h-5" />
  }

  const getButtonStyles = () => {
    if (isCurrentPlan) {
      return 'bg-green-500/20 text-green-400 border-green-500/30 cursor-default'
    }
    if (disabled || loading) {
      return 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
    }
    if (plan.popular) {
      return 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
    }
    return 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-orange-500'
  }

  const getCardStyles = () => {
    let baseStyles = 'bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border p-6 transition-all duration-300'
    
    if (plan.popular) {
      return `${baseStyles} border-orange-500 ring-2 ring-orange-500/20 shadow-lg shadow-orange-500/10`
    }
    if (isCurrentPlan) {
      return `${baseStyles} border-green-500/50 ring-2 ring-green-500/20`
    }
    return `${baseStyles} border-gray-700 hover:border-orange-500/50 ${isHovered ? 'shadow-lg' : ''}`
  }

  return (
    <div 
      className={getCardStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="text-center mb-6">
        {plan.popular && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-4">
            <StarIcon className="w-3 h-3" />
            Most Popular
          </div>
        )}
        
        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-white">${plan.price}</span>
          <span className="text-gray-400">/{plan.interval}</span>
        </div>
        
        {plan.tier && (
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
              plan.tier === 'REV1' ? 'bg-blue-500/20 text-blue-400' :
              plan.tier === 'REV2' ? 'bg-purple-500/20 text-purple-400' :
              'bg-orange-500/20 text-orange-400'
            }`}>
              {plan.tier}
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        onClick={() => !isCurrentPlan && !disabled && !loading && onSubscribe(plan)}
        disabled={isCurrentPlan || disabled || loading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border font-semibold transition-all duration-200 ${getButtonStyles()}`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          getButtonIcon()
        )}
        {loading ? 'Processing...' : getButtonText()}
      </button>

      {/* Additional Info */}
      {isCurrentPlan && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400 text-sm text-center">
            ✓ You're currently subscribed to this plan
          </p>
        </div>
      )}
    </div>
  )
}

export default SubscriptionCard
