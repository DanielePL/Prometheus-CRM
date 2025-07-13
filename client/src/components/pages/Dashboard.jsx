import React from 'react'
import { ChartBarIcon } from '@heroicons/react/24/outline'

const Dashboard = () => {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Dashboard Overview</h2>
      </div>
      
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          <ChartBarIcon className="w-12 h-12" />
        </div>
        <h3 className="coming-soon-title">Dashboard Coming Soon</h3>
        <p className="coming-soon-subtitle">
          Your comprehensive CRM dashboard is under development
        </p>
        <p className="coming-soon-description">
          This dashboard will provide real-time insights into your customer journey, 
          revenue streams (REV 1-3), subscription metrics, and key performance indicators. 
          Track everything from individual app users to enterprise B2B clients in one unified view.
        </p>
      </div>
    </div>
  )
}

export default Dashboard
