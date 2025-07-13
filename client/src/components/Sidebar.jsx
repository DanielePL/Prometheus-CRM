import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  ChartPieIcon,
  MegaphoneIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: ChartBarIcon, exact: true },
    { path: '/customers', label: 'Customers', icon: UsersIcon },
    { path: '/subscriptions', label: 'Subscriptions', icon: CreditCardIcon },
    { path: '/analytics', label: 'Analytics', icon: ChartPieIcon },
    { path: '/campaigns', label: 'Campaigns', icon: MegaphoneIcon },
    { path: '/settings', label: 'Settings', icon: Cog6ToothIcon }
  ]

  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            🔥
          </div>
          <div className="sidebar-logo-text">Prometheus</div>
        </div>
        <div className="organization-name">CRM System</div>
        <div className="powered-by">Enterprise Customer Management</div>
      </div>
      
      <nav>
        <ul className="nav-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <IconComponent className="nav-icon w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
