// client/src/components/pages/Subscriptions.jsx - WEBHOOK INTEGRATION
import React, { useState, useEffect } from 'react'
import { 
  CreditCardIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  XMarkIcon,
  PhoneIcon,
  BellIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [isAutoRefreshOn, setIsAutoRefreshOn] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // MOCK: Mobile App Subscription Data (von Stripe Webhooks)
  const mobileAppSubscriptions = [
    {
      id: 'sub_1OH2xR2eZvKYlo2C0nP8JzYb',
      customer_name: 'Anna Schmidt',
      customer_email: 'anna.schmidt@gmail.com',
      plan: 'REV1 Standard',
      tier: 'REV1',
      price: 19,
      status: 'active',
      next_billing: '2025-08-14',
      started: '2025-07-14',
      payment_method: 'Visa ****4242',
      stripe_customer_id: 'cus_OH2xR123',
      app_user_id: 'user_45621',
      total_paid: 57, // 3 months
      device: 'iPhone 15 Pro'
    },
    {
      id: 'sub_1OH3xR2eZvKYlo2C0nP8JzYc',
      customer_name: 'Max Mueller',
      customer_email: 'max.mueller@outlook.com', 
      plan: 'REV1 Basic',
      tier: 'REV1',
      price: 9,
      status: 'active',
      next_billing: '2025-08-20',
      started: '2025-06-20',
      payment_method: 'Mastercard ****8901',
      stripe_customer_id: 'cus_OH3xR456',
      app_user_id: 'user_78234',
      total_paid: 18, // 2 months
      device: 'Samsung Galaxy S24'
    },
    {
      id: 'sub_1OH4xR2eZvKYlo2C0nP8JzYd',
      customer_name: 'Sarah Johnson',
      customer_email: 'sarah.j@icloud.com',
      plan: 'REV1 Premium', 
      tier: 'REV1',
      price: 29,
      status: 'active',
      next_billing: '2025-08-01',
      started: '2025-01-01',
      payment_method: 'Apple Pay ****1234',
      stripe_customer_id: 'cus_OH4xR789',
      app_user_id: 'user_12890',
      total_paid: 203, // 7 months
      device: 'iPhone 14'
    },
    {
      id: 'sub_1OH5xR2eZvKYlo2C0nP8JzYe',
      customer_name: 'Tom Wilson',
      customer_email: 'tom.wilson@yahoo.com',
      plan: 'REV2 Coaching Basic',
      tier: 'REV2', 
      price: 299,
      status: 'active',
      next_billing: '2025-08-15',
      started: '2024-11-15',
      payment_method: 'Visa ****5678',
      stripe_customer_id: 'cus_OH5xR012',
      app_user_id: 'user_56789',
      total_paid: 2691, // 9 months
      device: 'iPhone 13 Pro Max'
    },
    {
      id: 'sub_1OH6xR2eZvKYlo2C0nP8JzYf',
      customer_name: 'Lisa Chen',
      customer_email: 'lisa.chen@gmail.com',
      plan: 'REV2 Coaching Standard',
      tier: 'REV2',
      price: 399,
      status: 'cancelled',
      next_billing: null,
      started: '2024-12-01',
      payment_method: 'Amex ****9876',
      stripe_customer_id: 'cus_OH6xR345',
      app_user_id: 'user_34567',
      total_paid: 1596, // 4 months before cancel
      device: 'iPad Pro'
    },
    {
      id: 'sub_1OH7xR2eZvKYlo2C0nP8JzYg',
      customer_name: 'Robert Taylor',
      customer_email: 'robert.taylor@gmail.com',
      plan: 'REV2 Coaching Premium',
      tier: 'REV2',
      price: 499,
      status: 'active',
      next_billing: '2025-08-10',
      started: '2024-10-10',
      payment_method: 'Google Pay ****2468',
      stripe_customer_id: 'cus_OH7xR678',
      app_user_id: 'user_89012',
      total_paid: 4491, // 9 months
      device: 'Pixel 8 Pro'
    }
  ]

  // Webhook Events Mock Data
  const recentWebhookEvents = [
    {
      id: 'evt_1OH8xR2eZvKYlo2C',
      type: 'invoice.payment_succeeded',
      customer: 'Anna Schmidt',
      amount: 19,
      timestamp: '2025-07-14T15:30:00Z',
      status: 'processed'
    },
    {
      id: 'evt_1OH9xR2eZvKYlo2D', 
      type: 'customer.subscription.created',
      customer: 'New User',
      amount: 29,
      timestamp: '2025-07-14T14:15:00Z',
      status: 'processed'
    },
    {
      id: 'evt_1OHAxR2eZvKYlo2E',
      type: 'customer.subscription.deleted',
      customer: 'Lisa Chen',
      amount: 0,
      timestamp: '2025-07-14T13:45:00Z',
      status: 'processed'
    }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'past_due':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTierColor = (tier) => {
    switch (tier) {
      case 'REV1': return 'text-blue-400'
      case 'REV2': return 'text-orange-400' 
      case 'REV3': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const filteredSubscriptions = mobileAppSubscriptions.filter(sub => {
    const matchesSearch = 
      sub.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
    const matchesTier = tierFilter === 'all' || sub.tier === tierFilter
    
    return matchesSearch && matchesStatus && matchesTier
  })

  const activeSubscriptions = mobileAppSubscriptions.filter(sub => sub.status === 'active')
  const totalMRR = activeSubscriptions.reduce((sum, sub) => sum + sub.price, 0)
  const totalSubscriptions = mobileAppSubscriptions.length
  const todayRevenue = recentWebhookEvents
    .filter(event => event.type === 'invoice.payment_succeeded')
    .reduce((sum, event) => sum + event.amount, 0)

  useEffect(() => {
    if (isAutoRefreshOn) {
      const interval = setInterval(() => {
        setLastRefresh(new Date())
      }, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isAutoRefreshOn])

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Subscription Management</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Mobile App Integration</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoRefreshOn(!isAutoRefreshOn)}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                isAutoRefreshOn 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}
            >
              <ArrowPathIcon className={`w-4 h-4 ${isAutoRefreshOn ? 'animate-spin' : ''}`} />
              Auto-Refresh {isAutoRefreshOn ? 'ON' : 'OFF'}
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-6">
        Sales from Prometheus Mobile App via Stripe Webhooks
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Subscriptions</p>
              <p className="text-2xl font-bold text-green-400">{activeSubscriptions.length}</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              ✓
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Subscriptions</p>
              <p className="text-2xl font-bold text-blue-400">{totalSubscriptions}</p>
            </div>
            <CreditCardIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Webhooks (24h)</p>
              <p className="text-2xl font-bold text-orange-400">{recentWebhookEvents.length}</p>
            </div>
            <BellIcon className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Mobile Sales</p>
              <p className="text-2xl font-bold text-purple-400">${totalMRR.toLocaleString()}</p>
            </div>
            <PhoneIcon className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers, emails, or subscription IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="past_due">Past Due</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Tiers</option>
              <option value="REV1">REV1 ($9-29)</option>
              <option value="REV2">REV2 ($299-499)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Current Subscriptions from Mobile App */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg mb-6">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-white text-lg font-semibold">Current Subscriptions from Mobile App</h3>
          <p className="text-gray-400 text-sm">Received via Stripe Webhooks from Prometheus Fitness App</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Mobile User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Plan & Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Monthly $
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Next Billing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {subscription.customer_name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {subscription.customer_email}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {subscription.app_user_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-white">{subscription.plan}</div>
                      <div className={`text-xs font-medium ${getTierColor(subscription.tier)}`}>
                        {subscription.tier}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-400">
                      ${subscription.price}/mo
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {subscription.next_billing ? subscription.next_billing : 'Cancelled'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-orange-400">
                      ${subscription.total_paid}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {subscription.device}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-400 hover:text-blue-300" title="View Details">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-orange-400 hover:text-orange-300" title="Edit">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      {subscription.status === 'active' && (
                        <button className="text-red-400 hover:text-red-300" title="Cancel">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Webhook Events */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-white text-lg font-semibold">Recent Webhook Events</h3>
          <p className="text-gray-400 text-sm">Stripe Webhooks from the last 24 hours</p>
        </div>
        
        {recentWebhookEvents.length > 0 ? (
          <div className="p-6">
            <div className="space-y-4">
              {recentWebhookEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">{event.type}</div>
                      <div className="text-gray-400 text-sm">{event.customer}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-medium">
                      {event.amount > 0 ? `${event.amount}` : '—'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(event.timestamp).toLocaleString('en-US')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <BellIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No Webhook Events</p>
          </div>
        )}
      </div>

      {/* Webhook Integration Status */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="text-sm">
            <span className="text-white font-medium">Webhook Integration Active</span>
            <div className="text-blue-300">
              This CRM automatically receives all sales from the Prometheus Mobile App via Stripe Webhooks. 
              New subscriptions and payments appear here in real-time.
            </div>
            <div className="text-blue-400 text-xs mt-2">
              Webhook URL: http://localhost:8080/api/webhooks/stripe
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-400">
            Showing {filteredSubscriptions.length} of {totalSubscriptions} subscriptions
          </div>
          <div className="text-gray-400">
            Last Updated: <span className="text-white">{lastRefresh.toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subscriptions