import React from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'

const Settings = () => {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">System Settings</h2>
      </div>
      
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          <Cog6ToothIcon className="w-12 h-12" />
        </div>
        <h3 className="coming-soon-title">Settings Coming Soon</h3>
        <p className="coming-soon-subtitle">
          System configuration and administration
        </p>
        <p className="coming-soon-description">
          Configure system preferences, manage user roles and permissions, 
          set up integrations with Stripe and external services, customize 
          reporting dashboards, and manage data retention policies. 
          Enterprise features include white-label customization and API access controls.
        </p>
      </div>
    </div>
  )
}

export default Settings
