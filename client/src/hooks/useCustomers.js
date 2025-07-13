import { useState, useEffect, useCallback } from 'react'
import { customerService } from '../services/supabase'

export const useCustomers = (filters = {}) => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch customers function
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await customerService.getCustomers(filters)
      setCustomers(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Initial load
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  // Real-time subscription
  useEffect(() => {
    const subscription = customerService.subscribeToChanges((payload) => {
      console.log('Real-time customer change:', payload)
      
      switch (payload.eventType) {
        case 'INSERT':
          setCustomers(prev => [payload.new, ...prev])
          break
          
        case 'UPDATE':
          setCustomers(prev => 
            prev.map(customer => 
              customer.id === payload.new.id ? payload.new : customer
            )
          )
          break
          
        case 'DELETE':
          setCustomers(prev => 
            prev.filter(customer => customer.id !== payload.old.id)
          )
          break
          
        default:
          // Refetch for other events
          fetchCustomers()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchCustomers])

  // Create customer
  const createCustomer = async (customerData) => {
    try {
      setLoading(true)
      const newCustomer = await customerService.createCustomer(customerData)
      // Real-time subscription will handle the state update
      return newCustomer
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update customer
  const updateCustomer = async (id, updates) => {
    try {
      setLoading(true)
      const updatedCustomer = await customerService.updateCustomer(id, updates)
      // Real-time subscription will handle the state update
      return updatedCustomer
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete customer
  const deleteCustomer = async (id) => {
    try {
      setLoading(true)
      await customerService.deleteCustomer(id)
      // Real-time subscription will handle the state update
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Refresh customers manually
  const refreshCustomers = () => {
    fetchCustomers()
  }

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomers
  }
}
