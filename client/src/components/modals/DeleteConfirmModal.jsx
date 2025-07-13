import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const DeleteConfirmModal = ({ isOpen, onClose, customer, onConfirm, loading }) => {
  if (!isOpen || !customer) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={loading ? undefined : onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-lg border border-gray-700">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete Customer
            </h3>
            <p className="text-gray-300">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-300">
              <p><span className="font-medium">Name:</span> {customer.name}</p>
              <p><span className="font-medium">Email:</span> {customer.email}</p>
              <p><span className="font-medium">Tier:</span> {customer.tier}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-1 capitalize ${
                  customer.status === 'active' ? 'text-green-400' :
                  customer.status === 'trial' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {customer.status}
                </span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(customer.id)}
              disabled={loading}
              className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Delete Customer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
