import { useState, useEffect, useMemo } from 'react'
import { useCustomers } from './useCustomers'

export const useAnalytics = () => {
  const { customers, loading, error } = useCustomers()
  const [analyticsData, setAnalyticsData] = useState({
    totalCustomers: 0,
    monthlyRevenue: 0,
    averageLTV: 0,
    conversionRate: 0,
    revenueChart: [],
    customerGrowthChart: [],
    tierDistribution: [],
    statusBreakdown: []
  })

  const processAnalyticsData = useMemo(() => {
    if (!customers || customers.length === 0) {
      return {
        totalCustomers: 0,
        monthlyRevenue: 0,
        averageLTV: 0,
        conversionRate: 0,
        revenueChart: [],
        customerGrowthChart: [],
        tierDistribution: [],
        statusBreakdown: []
      }
    }

    // Basic KPIs
    const totalCustomers = customers.length
    const monthlyRevenue = customers.reduce((sum, customer) => sum + (customer.mrr || 0), 0)
    const averageLTV = customers.reduce((sum, customer) => sum + (customer.ltv || 0), 0) / totalCustomers
    const activeCustomers = customers.filter(customer => customer.status === 'active').length
    const conversionRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0

    // Revenue Chart Data (last 12 months)
    const revenueByMonth = {}
    const customersByMonth = {}
    
    customers.forEach(customer => {
      const joinDate = new Date(customer.join_date || customer.created_at)
      const monthKey = `${joinDate.getFullYear()}-${String(joinDate.getMonth() + 1).padStart(2, '0')}`
      
      if (!revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] = 0
        customersByMonth[monthKey] = 0
      }
      
      revenueByMonth[monthKey] += customer.mrr || 0
      customersByMonth[monthKey] += 1
    })

    // Generate last 12 months data
    const last12Months = []
    const currentDate = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      
      last12Months.push({
        month: monthName,
        revenue: revenueByMonth[monthKey] || 0,
        customers: customersByMonth[monthKey] || 0
      })
    }

    // Tier Distribution
    const tierCounts = customers.reduce((acc, customer) => {
      acc[customer.tier] = (acc[customer.tier] || 0) + 1
      return acc
    }, {})

    const tierDistribution = Object.entries(tierCounts).map(([tier, count]) => ({
      name: tier,
      value: count,
      percentage: ((count / totalCustomers) * 100).toFixed(1)
    }))

    // Status Breakdown
    const statusCounts = customers.reduce((acc, customer) => {
      acc[customer.status] = (acc[customer.status] || 0) + 1
      return acc
    }, {})

    const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      percentage: ((count / totalCustomers) * 100).toFixed(1)
    }))

    return {
      totalCustomers,
      monthlyRevenue,
      averageLTV,
      conversionRate,
      revenueChart: last12Months,
      customerGrowthChart: last12Months,
      tierDistribution,
      statusBreakdown
    }
  }, [customers])

  useEffect(() => {
    setAnalyticsData(processAnalyticsData)
  }, [processAnalyticsData])

  return {
    analyticsData,
    loading,
    error
  }
}
