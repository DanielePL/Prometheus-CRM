import React from 'react'
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { useAnalytics } from '../../hooks/useAnalytics'
import MetricCard from '../cards/MetricCard'
import RevenueChart from '../charts/RevenueChart'
import CustomerGrowthChart from '../charts/CustomerGrowthChart'
import TierDistributionChart from '../charts/TierDistributionChart'
import StatusBreakdownChart from '../charts/StatusBreakdownChart'

const Analytics = () => {
  const { analyticsData, loading, error } = useAnalytics()

  if (error) {
    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Analytics Dashboard</h2>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <ExclamationCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Analytics</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {loading ? 'Loading analytics...' : 'Real-time data'}
          </div>
          {loading && (
            <ArrowPathIcon className="w-5 h-5 text-orange-500 animate-spin" />
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Customers"
            value={analyticsData.totalCustomers}
            icon={UsersIcon}
            format="number"
            trend="up"
            trendValue="+12%"
          />
          <MetricCard
            title="Monthly Revenue"
            value={analyticsData.monthlyRevenue}
            icon={CurrencyDollarIcon}
            format="currency"
            trend="up"
            trendValue="+8.2%"
          />
          <MetricCard
            title="Average LTV"
            value={analyticsData.averageLTV}
            icon={ChartBarIcon}
            format="currency-decimal"
            trend="up"
            trendValue="+15.1%"
          />
          <MetricCard
            title="Conversion Rate"
            value={analyticsData.conversionRate}
            icon={ArrowTrendingUpIcon}
            format="percentage"
            trend="up"
            trendValue="+2.4%"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart 
            data={analyticsData.revenueChart} 
            loading={loading} 
          />
          <CustomerGrowthChart 
            data={analyticsData.customerGrowthChart} 
            loading={loading} 
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TierDistributionChart 
            data={analyticsData.tierDistribution} 
            loading={loading} 
          />
          <StatusBreakdownChart 
            data={analyticsData.statusBreakdown} 
            loading={loading} 
          />
        </div>

        {/* Additional Insights */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-orange-500 font-semibold text-sm mb-2">Revenue Growth</h4>
              <p className="text-gray-300 text-sm">
                Monthly recurring revenue is trending upward with strong performance in REV3 tier customers.
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-green-500 font-semibold text-sm mb-2">Customer Acquisition</h4>
              <p className="text-gray-300 text-sm">
                New customer acquisition has been steady with good conversion from trial to active status.
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-blue-500 font-semibold text-sm mb-2">Tier Performance</h4>
              <p className="text-gray-300 text-sm">
                REV3 customers show highest LTV. Focus on upselling REV1 and REV2 customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
