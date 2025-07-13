import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const RevenueChart = ({ data, loading }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{`Month: ${label}`}</p>
          <p className="text-orange-500 font-semibold">
            {`Revenue: $${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-lg font-semibold">Monthly Revenue</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-700 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-orange-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">Monthly Revenue</h3>
        <div className="text-sm text-gray-400">
          Last 12 months
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#ff6600" 
            strokeWidth={3}
            dot={{ fill: '#ff6600', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ff6600', strokeWidth: 2, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart
