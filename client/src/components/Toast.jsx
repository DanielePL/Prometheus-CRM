import React, { useState, useEffect } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline'

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const types = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
      textColor: 'text-green-400'
    },
    error: {
      icon: ExclamationCircleIcon,
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
      textColor: 'text-red-400'
    }
  }

  const config = types[type]
  const IconComponent = config.icon

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-lg max-w-sm`}>
        <IconComponent className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
        <p className={`text-sm font-medium ${config.textColor} flex-1`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-black/20 transition-colors ${config.iconColor}`}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast
