import React, { useState, useMemo } from 'react'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { useCustomers } from '../../hooks/useCustomers'
import { useCustomerActions } from '../../hooks/useCustomerActions'
import CustomerModal from '../modals/CustomerModal'
import DeleteConfirmModal from '../modals/DeleteConfirmModal'
import Toast from '../Toast'

const Customers = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Modal states
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [modalMode, setModalMode] = useState('create') // 'create' or 'edit'

  // Hooks
  const { createCustomer, updateCustomer, deleteCustomer, loading: actionLoading, toast } = useCustomerActions()

  // Supabase hook with filters
  const filters = useMemo(() => ({
    status: filterStatus,
    search: searchTerm
  }), [filterStatus, searchTerm])

  const { customers: dbCustomers, loading, error, refreshCustomers } = useCustomers(filters)

  // CRUD Handlers
  const handleAddCustomer = () => {
    setModalMode('create')
    setSelectedCustomer(null)
    setIsCustomerModalOpen(true)
  }

  const handleEditCustomer = (customer) => {
    setModalMode('edit')
    setSelectedCustomer(customer)
    setIsCustomerModalOpen(true)
  }

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer)
    setIsDeleteModalOpen(true)
  }

  const handleSaveCustomer = async (customerData) => {
    try {
      if (modalMode === 'create') {
        await createCustomer(customerData)
      } else {
        await updateCustomer(selectedCustomer.id, customerData)
      }
      setIsCustomerModalOpen(false)
      setSelectedCustomer(null)
      // Refresh customer list
      refreshCustomers()
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }

  const handleConfirmDelete = async (customerId) => {
    try {
      await deleteCustomer(customerId)
      setIsDeleteModalOpen(false)
      setSelectedCustomer(null)
      // Refresh customer list
      refreshCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const handleCloseModals = () => {
    if (!actionLoading) {
      setIsCustomerModalOpen(false)
      setIsDeleteModalOpen(false)
      setSelectedCustomer(null)
    }
  }

  // Mock customer data as fallback
  const mockCustomers = [
    { id: 1, name: "John Doe", email: "john@example.com", tier: "REV1", status: "active", mrr: 29, ltv: 348, join_date: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", tier: "REV2", status: "active", mrr: 199, ltv: 2388, join_date: "2024-02-20" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", tier: "REV1", status: "trial", mrr: 0, ltv: 0, join_date: "2024-07-10" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", tier: "REV3", status: "active", mrr: 499, ltv: 5988, join_date: "2024-03-05" },
    { id: 5, name: "David Brown", email: "david@example.com", tier: "REV1", status: "churned", mrr: 0, ltv: 58, join_date: "2024-05-12" },
    { id: 6, name: "Lisa Garcia", email: "lisa@example.com", tier: "REV2", status: "active", mrr: 299, ltv: 1794, join_date: "2024-04-18" },
    { id: 7, name: "Tom Anderson", email: "tom@example.com", tier: "REV1", status: "trial", mrr: 0, ltv: 0, join_date: "2024-07-08" },
    { id: 8, name: "Emily Davis", email: "emily@example.com", tier: "REV1", status: "active", mrr: 19, ltv: 228, join_date: "2024-06-22" },
    { id: 9, name: "Mark Thompson", email: "mark@example.com", tier: "REV2", status: "churned", mrr: 0, ltv: 398, join_date: "2024-01-30" },
    { id: 10, name: "Anna Martinez", email: "anna@example.com", tier: "REV1", status: "active", mrr: 29, ltv: 174, join_date: "2024-06-01" },
    { id: 11, name: "Chris Lee", email: "chris@example.com", tier: "REV3", status: "active", mrr: 699, ltv: 4194, join_date: "2024-02-14" },
    { id: 12, name: "Jessica Taylor", email: "jessica@example.com", tier: "REV1", status: "trial", mrr: 0, ltv: 0, join_date: "2024-07-11" }
  ]

  // Use database customers if available, fallback to mock data
  const customersData = dbCustomers.length > 0 ? dbCustomers : mockCustomers

  // Filter and search functionality (client-side for sorting only)
  const filteredCustomers = useMemo(() => {
    let filtered = [...customersData]

    // Additional client-side filtering if needed
    if (searchTerm && dbCustomers.length === 0) {
      // Only apply client-side search for mock data
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'all' && dbCustomers.length === 0) {
      // Only apply client-side status filter for mock data
      filtered = filtered.filter(customer => customer.status === filterStatus)
    }

    // Apply sorting (always client-side)
    filtered.sort((a, b) => {
      const dateField = a.join_date ? 'join_date' : 'joinDate'
      
      if (sortConfig.key === 'joinDate' || sortConfig.key === 'join_date') {
        const aDate = new Date(a[dateField])
        const bDate = new Date(b[dateField])
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate
      }
      
      if (sortConfig.key === 'mrr' || sortConfig.key === 'ltv') {
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key]
      }
      
      return sortConfig.direction === 'asc' 
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key])
    })

    return filtered
  }, [customersData, searchTerm, filterStatus, sortConfig, dbCustomers.length])

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    const badges = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      trial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      churned: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Tier badge component
  const TierBadge = ({ tier }) => {
    const colors = {
      REV1: 'bg-blue-500/20 text-blue-400',
      REV2: 'bg-purple-500/20 text-purple-400',
      REV3: 'bg-orange-500/20 text-orange-400'
    }
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[tier]}`}>
        {tier}
      </span>
    )
  }  // Sort icon component
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <FunnelIcon className="w-4 h-4 text-gray-500" />
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUpIcon className="w-4 h-4 text-orange-500" />
      : <ArrowDownIcon className="w-4 h-4 text-orange-500" />
  }

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <ArrowPathIcon className="w-6 h-6 text-orange-500 animate-spin" />
        <span className="text-gray-300">Loading customers...</span>
      </div>
    </div>
  )

  // Error component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
      <ExclamationCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-red-400 font-semibold mb-2">Error Loading Customers</h3>
      <p className="text-gray-300 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  )

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Customer Management</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {loading ? 'Loading...' : `${filteredCustomers.length} customers found`}
          </div>
          {dbCustomers.length === 0 && !loading && (
            <div className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">
              Using mock data
            </div>
          )}
          <button
            onClick={handleAddCustomer}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Customer
          </button>
          <button
            onClick={refreshCustomers}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-50"
            title="Refresh customers"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <ErrorMessage message={error} onRetry={refreshCustomers} />
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Content - only show if not loading */}
      {!loading && (
        <>
          {/* Search and Filter Controls */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'active', 'trial', 'churned'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    filterStatus === status
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900 border-b border-gray-700">
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-orange-500 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Customer
                        <SortIcon column="name" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-orange-500 transition-colors"
                      onClick={() => handleSort('mrr')}
                    >
                      <div className="flex items-center gap-2">
                        MRR
                        <SortIcon column="mrr" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-orange-500 transition-colors"
                      onClick={() => handleSort('ltv')}
                    >
                      <div className="flex items-center gap-2">
                        LTV
                        <SortIcon column="ltv" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-orange-500 transition-colors"
                      onClick={() => handleSort('join_date')}
                    >
                      <div className="flex items-center gap-2">
                        Join Date
                        <SortIcon column="join_date" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paginatedCustomers.map((customer) => {
                    const joinDateField = customer.join_date || customer.joinDate
                    return (
                      <tr 
                        key={customer.id} 
                        className="hover:bg-gray-750 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white font-semibold">{customer.name}</div>
                            <div className="text-gray-400 text-sm">{customer.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <TierBadge tier={customer.tier} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={customer.status} />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">
                            ${customer.mrr}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">
                            ${customer.ltv}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300">
                            {new Date(joinDateField).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditCustomer(customer)
                              }}
                              className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                              title="Edit customer"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteCustomer(customer)
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete customer"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-900 px-6 py-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                            currentPage === page
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredCustomers.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No customers found</div>
              <div className="text-gray-500 text-sm">
                {dbCustomers.length === 0 
                  ? "Connect to Supabase to see real customer data"
                  : "Try adjusting your search or filter criteria"
                }
              </div>
            </div>
          )}
        </>
      )}

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={handleCloseModals}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        customer={selectedCustomer}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => {}}
      />
    </div>
  )
}

export default Customers
