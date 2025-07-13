import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const TierDistributionChart = ({ data, loading }) => {
  const COLORS = {
    REV1: '#3B82F6', // Blue
    REV2: '#8B5CF6', // Purple  
    REV3: '#ff6600'  // Orange
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{`Tier: ${data.name}`}</p>
          <p className="text-orange-500 font-semibold">
            {`Customers: ${data.value} (${data.percentage}%)`}
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage}%`}
      </text>
    )
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-lg font-semibold">Tier Distribution</h3>
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
        <h3 className="text-white text-lg font-semibold">Tier Distribution</h3>
        <div className="text-sm text-gray-400">
          Customer tiers
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#fff' }}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value} ({entry.payload.percentage}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TierDistributionChart
