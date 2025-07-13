import { useState } from 'react'
import { customerService } from '../services/supabase'

export const useCustomerActions = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: '' })

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
  }

  // Create customer
  const createCustomer = async (customerData) => {
    try {
      setLoading(true)
      setError(null)
      
      const newCustomer = await customerService.createCustomer(customerData)
      showToast('Customer created successfully!')
      return newCustomer
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update customer
  const updateCustomer = async (id, updates) => {
    try {
      setLoading(true)
      setError(null)
      
      const updatedCustomer = await customerService.updateCustomer(id, updates)
      showToast('Customer updated successfully!')
      return updatedCustomer
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete customer
  const deleteCustomer = async (id) => {
    try {
      setLoading(true)
      setError(null)
      
      await customerService.deleteCustomer(id)
      showToast('Customer deleted successfully!')
      return true
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    toast,
    createCustomer,
    updateCustomer,
    deleteCustomer
  }
}
