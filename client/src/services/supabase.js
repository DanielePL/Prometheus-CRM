import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error)
  
  if (error.code === 'PGRST116') {
    return 'No data found'
  }
  
  if (error.code === '23505') {
    return 'Email already exists'
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

// Database table names
export const TABLES = {
  CUSTOMERS: 'customers',
  SUBSCRIPTIONS: 'subscriptions',
  TRANSACTIONS: 'transactions',
  COACHING_RELATIONSHIPS: 'coaching_relationships',
  ORGANIZATIONS: 'organizations'
}

// Customer service functions
export const customerService = {
  // Fetch all customers with optional filtering
  async getCustomers(filters = {}) {
    let query = supabase
      .from(TABLES.CUSTOMERS)
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    
    if (filters.tier) {
      query = query.eq('tier', filters.tier)
    }
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    const { data, error } = await query
    
    if (error) {
      throw new Error(handleSupabaseError(error))
    }
    
    return data || []
  },

  // Get single customer by ID
  async getCustomer(id) {
    const { data, error } = await supabase
      .from(TABLES.CUSTOMERS)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      throw new Error(handleSupabaseError(error))
    }
    
    return data
  },

  // Create new customer
  async createCustomer(customerData) {
    const { data, error } = await supabase
      .from(TABLES.CUSTOMERS)
      .insert([customerData])
      .select()
      .single()
    
    if (error) {
      throw new Error(handleSupabaseError(error))
    }
    
    return data
  },

  // Update customer
  async updateCustomer(id, updates) {
    const { data, error } = await supabase
      .from(TABLES.CUSTOMERS)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      throw new Error(handleSupabaseError(error))
    }
    
    return data
  },

  // Delete customer
  async deleteCustomer(id) {
    const { error } = await supabase
      .from(TABLES.CUSTOMERS)
      .delete()
      .eq('id', id)
    
    if (error) {
      throw new Error(handleSupabaseError(error))
    }
    
    return true
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback) {
    const subscription = supabase
      .channel('customers_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.CUSTOMERS 
        }, 
        callback
      )
      .subscribe()
    
    return subscription
  }
}
