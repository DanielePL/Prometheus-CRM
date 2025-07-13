import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/pages/Dashboard'
import Customers from './components/pages/Customers'
import Subscriptions from './components/pages/Subscriptions'
import Analytics from './components/pages/Analytics'
import Campaigns from './components/pages/Campaigns'
import Settings from './components/pages/Settings'

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
