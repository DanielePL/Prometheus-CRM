import React from 'react'
import { MegaphoneIcon } from '@heroicons/react/24/outline'

const Campaigns = () => {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Marketing Campaigns</h2>
      </div>
      
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          <MegaphoneIcon className="w-12 h-12" />
        </div>
        <h3 className="coming-soon-title">Campaigns Coming Soon</h3>
        <p className="coming-soon-subtitle">
          Comprehensive campaign management and attribution
        </p>
        <p className="coming-soon-description">
          Track influencer campaigns, paid advertising, content marketing, and organic growth. 
          Monitor ROI by acquisition channel, analyze conversion funnels, and optimize 
          customer acquisition costs. Full attribution tracking from first touch to conversion 
          with automated workflow management for onboarding and retention.
        </p>
      </div>
    </div>
  )
}

export default Campaigns
