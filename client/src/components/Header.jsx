import React from 'react'
import { useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/customers':
        return 'Customers'
      case '/subscriptions':
        return 'Subscriptions'
      case '/analytics':
        return 'Analytics'
      case '/campaigns':
        return 'Campaigns'
      case '/settings':
        return 'Settings'
      default:
        return 'Prometheus CRM'
    }
  }

  const getPageSubtitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview of your CRM performance and key metrics'
      case '/customers':
        return 'Manage your customer database and relationships'
      case '/subscriptions':
        return 'Track and manage subscription revenue streams'
      case '/analytics':
        return 'Deep insights into customer behavior and performance'
      case '/campaigns':
        return 'Marketing campaigns and attribution tracking'
      case '/settings':
        return 'System configuration and preferences'
      default:
        return 'Enterprise Customer Relationship Management'
    }
  }

  return (
    <div className="header">
      <div>
        <h1 className="header-title">{getPageTitle()}</h1>
        <p className="header-subtitle">{getPageSubtitle()}</p>
      </div>
      <div className="header-actions">
        <div className="status-indicator">
          <div className="status-online"></div>
          System Online
        </div>
        <div className="text-sm text-gray-400">
          Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default Header
