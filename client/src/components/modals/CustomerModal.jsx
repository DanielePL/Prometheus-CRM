import React, { useState, useEffect } from 'react'
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const CustomerModal = ({ isOpen, onClose, customer, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tier: 'REV1',
    status: 'trial',
    mrr: '',
    ltv: ''
  })
  
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Initialize form data when customer prop changes
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        tier: customer.tier || 'REV1',
        status: customer.status || 'trial',
        mrr: customer.mrr?.toString() || '',
        ltv: customer.ltv?.toString() || ''
      })
    } else {
      setFormData({
        name: '',
        email: '',
        tier: 'REV1',
        status: 'trial',
        mrr: '',
        ltv: ''
      })
    }
    setErrors({})
    setTouched({})
  }, [customer, isOpen])

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.mrr && isNaN(parseFloat(formData.mrr))) {
      newErrors.mrr = 'MRR must be a valid number'
    }

    if (formData.ltv && isNaN(parseFloat(formData.ltv))) {
      newErrors.ltv = 'LTV must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle blur for validation
  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      tier: true,
      status: true,
      mrr: true,
      ltv: true
    })

    if (validateForm()) {
      const submitData = {
        ...formData,
        mrr: formData.mrr ? parseFloat(formData.mrr) : 0,
        ltv: formData.ltv ? parseFloat(formData.ltv) : 0
      }
      onSave(submitData)
    }
  }

  // Close modal
  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-lg border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {customer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  className={`w-full pl-10 pr-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.name && touched.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter customer name"
                />
              </div>
              {errors.name && touched.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full pl-10 pr-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.email && touched.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Tier and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Tier Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tier
                </label>
                <select
                  name="tier"
                  value={formData.tier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="REV1">REV1</option>
                  <option value="REV2">REV2</option>
                  <option value="REV3">REV3</option>
                </select>
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="trial">Trial</option>
                  <option value="active">Active</option>
                  <option value="churned">Churned</option>
                </select>
              </div>
            </div>

            {/* MRR and LTV Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* MRR Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  MRR ($)
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="mrr"
                    value={formData.mrr}
                    onChange={handleChange}
                    onBlur={() => handleBlur('mrr')}
                    step="0.01"
                    min="0"
                    className={`w-full pl-10 pr-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      errors.mrr && touched.mrr
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.mrr && touched.mrr && (
                  <p className="text-red-400 text-sm mt-1">{errors.mrr}</p>
                )}
              </div>

              {/* LTV Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LTV ($)
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="ltv"
                    value={formData.ltv}
                    onChange={handleChange}
                    onBlur={() => handleBlur('ltv')}
                    step="0.01"
                    min="0"
                    className={`w-full pl-10 pr-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      errors.ltv && touched.ltv
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.ltv && touched.ltv && (
                  <p className="text-red-400 text-sm mt-1">{errors.ltv}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  customer ? 'Update Customer' : 'Create Customer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CustomerModal
