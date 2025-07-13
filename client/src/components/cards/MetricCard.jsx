import React from 'react'

const MetricCard = ({ title, value, icon: Icon, trend, trendValue, format = 'number' }) => {
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'currency-decimal':
        return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      default:
        return val.toLocaleString('en-US')
    }
  }

  const getTrendColor = () => {
    if (!trend) return ''
    return trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
  }

  const getTrendIcon = () => {
    if (!trend) return null
    return trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <Icon className="w-6 h-6 text-orange-500" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${getTrendColor()}`}>
            <span className="mr-1">{getTrendIcon()}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-white text-2xl font-bold">
          {formatValue(value)}
        </p>
      </div>
    </div>
  )
}

export default MetricCard
