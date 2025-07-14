// client/src/components/pages/Campaigns.jsx - INFLUENCER ROYALTY SYSTEM
import React, { useState } from 'react'
import { 
  UserGroupIcon,
  LinkIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  StarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

const Campaigns = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedLink, setCopiedLink] = useState(null)

  // ROYALTY STRUCTURE - INCLUDING DISCOUNT EVENTS!
  const royaltyRates = {
    // Regular Rates
    'rev1_basic': 2.00,      // $2 on $9 = 22.2%
    'rev1_standard': 4.00,   // $4 on $19 = 21.1% 
    'rev1_premium': 6.00,    // $6 on $29 = 20.7%
    
    // DISCOUNT EVENT RATES 🎉
    'launch_premium_99': 9.00, // 🔥 LAUNCH SPECIAL: $9 on $99/year = 9.1% MEGA MOTIVATION!
    'black_friday_basic': 1.50, // $1.50 on $6 (33% off)
    'summer_sale_standard': 3.00, // $3 on $15 (21% off)
    'influencer_special': 3.50, // Custom influencer discount rates
  }

  // ACTIVE DISCOUNT EVENTS
  const activeDiscountEvents = [
    {
      id: 'event_001',
      name: 'PROMETHEUS LAUNCH SPECIAL',
      description: 'Premium Annual at $99 (was $348/year)',
      plan: 'REV1 Premium Annual',
      original_price: 348, // $29 × 12
      discount_price: 99,
      discount_percentage: 71.5,
      royalty_amount: 9.00, // 🔥 LAUNCH MOTIVATION: $9 per sale = 9.1% rate!
      start_date: '2025-08-01',
      end_date: '2025-08-31',
      status: 'upcoming',
      promo_code: 'LAUNCH99',
      stripe_price_id: 'price_launch_premium_99',
      total_sales: 0,
      total_royalties_paid: 0,
      motivation_note: '🚀 MEGA LAUNCH BONUS: $9 per sale to drive influencer excitement!'
    },
    {
      id: 'event_002',
      name: 'SUMMER FITNESS SALE',
      description: 'All plans 25% off for summer motivation',
      plan: 'All REV1 Plans',
      discount_percentage: 25,
      start_date: '2025-07-15',
      end_date: '2025-07-31',
      status: 'active',
      promo_code: 'SUMMER25',
      royalty_adjustments: {
        'rev1_basic': 1.50,    // $1.50 on $6.75
        'rev1_standard': 3.00, // $3.00 on $14.25
        'rev1_premium': 4.50   // $4.50 on $21.75
      },
      total_sales: 1247,
      total_royalties_paid: 3741.00
    },
    {
      id: 'event_003',
      name: 'BLACK FRIDAY MEGA DEAL',
      description: 'Biggest discount of the year - 50% off everything',
      plan: 'All Plans',
      discount_percentage: 50,
      start_date: '2025-11-29',
      end_date: '2025-12-02',
      status: 'planned',
      promo_code: 'BLACKFRIDAY50',
      royalty_adjustments: {
        'rev1_basic': 1.00,    // $1.00 on $4.50
        'rev1_standard': 2.00, // $2.00 on $9.50
        'rev1_premium': 3.00   // $3.00 on $14.50
      },
      estimated_sales: 5000,
      estimated_royalties: 12000.00
    }
  ]

  // MOCK: Influencer Database
  const influencers = [
    {
      id: 'inf_001',
      name: 'Alex Fitness',
      handle: '@alexfitness',
      platform: 'YouTube',
      followers: 245000,
      tier: 'Celebrity',
      referral_code: 'ALEX_FITNESS_2025',
      status: 'active',
      total_clicks: 1247,
      conversions: 89,
      conversion_rate: 7.14,
      // Revolutionary Royalty Breakdown (including discount events):
      basic_referrals: 25,    // 25 × $2 = $50/month
      standard_referrals: 45, // 45 × $4 = $180/month  
      premium_referrals: 19,  // 19 × $6 = $114/month
      launch_special_sales: 15, // 15 × $9 = $135 (🔥 LAUNCH MEGA BONUS!)
      total_revenue: 2891,
      monthly_commission: 479.00, // $50 + $180 + $114 + $135
      total_commission_paid: 2064.00,
      subscribers_referred: 89,
      avg_subscriber_ltv: 324.50,
      joined_date: '2024-11-15',
      last_payout: '2025-07-01',
      bio: 'Fitness coach helping people build muscle and lose fat',
      email: 'alex@alexfitness.com',
      payment_method: 'PayPal'
    },
    {
      id: 'inf_002', 
      name: 'Sarah Gains',
      handle: '@sarahgains',
      platform: 'Instagram',
      followers: 89000,
      tier: 'Macro',
      referral_code: 'SARAH_GAINS_2025',
      status: 'active',
      total_clicks: 2156,
      conversions: 156,
      conversion_rate: 7.23,
      // Revolutionary Royalty Breakdown (including discount events):
      basic_referrals: 60,    // 60 × $2 = $120/month
      standard_referrals: 70, // 70 × $4 = $280/month  
      premium_referrals: 26,  // 26 × $6 = $156/month
      summer_sale_conversions: 25, // 25 × avg $2.67 = $66.75 (Summer Sale)
      total_revenue: 4234,
      monthly_commission: 622.75, // $120 + $280 + $156 + $66.75
      total_commission_paid: 3736.50,
      subscribers_referred: 156,
      avg_subscriber_ltv: 271.25,
      joined_date: '2024-12-01',
      last_payout: '2025-07-01',
      bio: 'Women\'s fitness & nutrition specialist',
      email: 'sarah@sarahgains.com',
      payment_method: 'Bank Transfer'
    },
    {
      id: 'inf_003',
      name: 'Mike Beast',
      handle: '@mikebeast',
      platform: 'TikTok', 
      followers: 1200000,
      tier: 'Celebrity',
      referral_code: 'MIKE_BEAST_2025',
      status: 'active',
      total_clicks: 5689,
      conversions: 234,
      conversion_rate: 4.11,
      // Revolutionary Royalty Breakdown:
      basic_referrals: 80,    // 80 × $2 = $160/month
      standard_referrals: 120, // 120 × $4 = $480/month  
      premium_referrals: 34,  // 34 × $6 = $204/month
      total_revenue: 8926,
      monthly_commission: 844.00, // $160 + $480 + $204 = INSANE!
      total_commission_paid: 5064.00,
      subscribers_referred: 234,
      avg_subscriber_ltv: 381.37,
      joined_date: '2024-10-01',
      last_payout: '2025-07-01',
      bio: 'Beast mode fitness content creator - PROMETHEUS PAYS!',
      email: 'mike@mikebeast.com',
      payment_method: 'Stripe Connect'
    },
    {
      id: 'inf_004',
      name: 'Emma Strong',
      handle: '@emmastrong',
      platform: 'YouTube',
      followers: 45000,
      tier: 'Mid',
      referral_code: 'EMMA_STRONG_2025',
      status: 'pending',
      total_clicks: 234,
      conversions: 12,
      conversion_rate: 5.13,
      // Revolutionary Royalty Breakdown:
      basic_referrals: 5,     // 5 × $2 = $10/month
      standard_referrals: 6,  // 6 × $4 = $24/month  
      premium_referrals: 1,   // 1 × $6 = $6/month
      total_revenue: 456,
      monthly_commission: 40.00, // $10 + $24 + $6
      total_commission_paid: 0,
      subscribers_referred: 12,
      avg_subscriber_ltv: 38.00,
      joined_date: '2025-07-01',
      last_payout: null,
      bio: 'Strength training for beginners - Just started with Prometheus!',
      email: 'emma@emmastrong.com',
      payment_method: 'PayPal'
    }
  ]

  // Recent Conversions with Revolutionary Royalties
  const recentConversions = [
    {
      id: 'conv_001',
      customer_name: 'John Miller',
      customer_email: 'john.miller@gmail.com',
      influencer: 'Alex Fitness',
      referral_code: 'ALEX_FITNESS_2025',
      subscription_plan: 'REV1 Standard',
      amount: 19,
      commission: 4.00, // Revolutionary $4 royalty!
      timestamp: '2025-07-14T14:30:00Z',
      status: 'confirmed'
    },
    {
      id: 'conv_002',
      customer_name: 'Lisa Anderson',
      customer_email: 'lisa.a@outlook.com',
      influencer: 'Sarah Gains',
      referral_code: 'SARAH_GAINS_2025', 
      subscription_plan: 'REV1 Premium',
      amount: 29,
      commission: 6.00, // Revolutionary $6 royalty!
      timestamp: '2025-07-14T13:15:00Z',
      status: 'confirmed'
    },
    {
      id: 'conv_003',
      customer_name: 'Ryan Thompson',
      customer_email: 'ryan.t@gmail.com',
      influencer: 'Mike Beast',
      referral_code: 'MIKE_BEAST_2025',
      subscription_plan: 'REV1 Basic',
      amount: 9,
      commission: 2.00, // Revolutionary $2 royalty!
      timestamp: '2025-07-14T11:45:00Z',
      status: 'confirmed'
    },
    {
      id: 'conv_004',
      customer_name: 'Amy Johnson',
      customer_email: 'amy.j@gmail.com',
      influencer: 'Emma Strong',
      referral_code: 'EMMA_STRONG_2025',
      subscription_plan: 'REV1 Standard',
      amount: 19,
      commission: 4.00, // Revolutionary $4 royalty!
      timestamp: '2025-07-14T10:20:00Z',
      status: 'confirmed'
    }
  ]

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Celebrity':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Macro':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Mid':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Micro':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  // Calculate tier based on followers (everyone gets same revolutionary rates!)
  const getInfluencerTier = (followers) => {
    if (followers >= 1000000) return 'Celebrity'
    if (followers >= 100000) return 'Macro'
    if (followers >= 10000) return 'Mid'
    return 'Micro'
  }

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Celebrity': return <TrophyIcon className="w-4 h-4" />
      case 'Macro': return <StarIcon className="w-4 h-4" />
      default: return <UserGroupIcon className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'paused':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-red-500/20 text-red-400 border-red-500/30'
    }
  }

  const copyInfluencerLink = (influencer) => {
    const link = `https://prometheus-app.com/signup?ref=${influencer.referral_code}`
    navigator.clipboard.writeText(link)
    setCopiedLink(influencer.id)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const totalRevenue = influencers.reduce((sum, inf) => sum + inf.total_revenue, 0)
  const totalCommissions = influencers.reduce((sum, inf) => sum + inf.total_commission_paid, 0)
  const totalSubscribers = influencers.reduce((sum, inf) => sum + inf.subscribers_referred, 0)
  const avgConversionRate = influencers.reduce((sum, inf) => sum + inf.conversion_rate, 0) / influencers.length

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Influencer Campaign Management</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Royalty tracking & attribution system
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Influencer
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-6">
        Track referral links, conversions, and commission payouts for influencer partnerships
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-800 border border-gray-700 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: ChartBarIcon },
          { id: 'influencers', label: 'Influencers', icon: UserGroupIcon },
          { id: 'conversions', label: 'Conversions', icon: CurrencyDollarIcon },
          { id: 'discount-events', label: 'Discount Events', icon: StarIcon },
          { id: 'links', label: 'Link Generator', icon: LinkIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p>
                </div>
                <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Commissions Paid</p>
                  <p className="text-2xl font-bold text-orange-400">${totalCommissions.toLocaleString()}</p>
                </div>
                <UserGroupIcon className="w-8 h-8 text-orange-400" />
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Referred Subscribers</p>
                  <p className="text-2xl font-bold text-blue-400">{totalSubscribers}</p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Conversion</p>
                  <p className="text-2xl font-bold text-purple-400">{avgConversionRate.toFixed(1)}%</p>
                </div>
                <TrophyIcon className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-white text-lg font-semibold">Top Performing Influencers</h3>
              <p className="text-gray-400 text-sm">Ranked by total revenue generated</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {influencers
                  .sort((a, b) => b.total_revenue - a.total_revenue)
                  .slice(0, 3)
                  .map((influencer, index) => (
                    <div key={influencer.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{influencer.name}</div>
                          <div className="text-gray-400 text-sm">{influencer.handle} • {influencer.platform}</div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${getTierBadge(influencer.tier)}`}>
                          {getTierIcon(influencer.tier)}
                          {influencer.tier} • Revolutionary Royalties
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">${influencer.total_revenue.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">{influencer.subscribers_referred} subscribers</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Influencers Tab */}
      {activeTab === 'influencers' && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Influencer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Platform & Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {influencers.map((influencer) => (
                  <tr key={influencer.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {influencer.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {influencer.handle}
                        </div>
                        <div className="text-xs text-gray-500">
                          {influencer.followers.toLocaleString()} followers
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-white">{influencer.platform}</div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${getTierBadge(influencer.tier)}`}>
                          {getTierIcon(influencer.tier)}
                          {influencer.tier} • $2-$6/user
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-white">{influencer.conversions} conversions</div>
                        <div className="text-sm text-gray-400">{influencer.conversion_rate}% rate</div>
                        <div className="text-xs text-gray-500">{influencer.total_clicks} clicks</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-400">
                        ${influencer.total_revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        ${influencer.avg_subscriber_ltv} avg LTV
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-orange-400">
                        ${influencer.monthly_commission.toLocaleString()}/mo
                      </div>
                      <div className="text-xs text-gray-400">
                        ${influencer.total_commission_paid.toLocaleString()} total
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(influencer.status)}`}>
                        {influencer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => copyInfluencerLink(influencer)}
                          className={`text-blue-400 hover:text-blue-300 ${copiedLink === influencer.id ? 'text-green-400' : ''}`}
                          title="Copy Referral Link"
                        >
                          {copiedLink === influencer.id ? <CheckIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                        </button>
                        <button className="text-orange-400 hover:text-orange-300" title="View Details">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-300" title="Edit">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conversions Tab */}
      {activeTab === 'conversions' && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-white text-lg font-semibold">Recent Conversions</h3>
            <p className="text-gray-400 text-sm">Latest customers acquired through influencer referrals</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Influencer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentConversions.map((conversion) => (
                  <tr key={conversion.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {conversion.customer_name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {conversion.customer_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-white">{conversion.influencer}</div>
                        <div className="text-xs text-gray-400">{conversion.referral_code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {conversion.subscription_plan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-400">
                        ${conversion.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-orange-400">
                        ${conversion.commission}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(conversion.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Discount Events Tab */}
      {activeTab === 'discount-events' && (
        <div className="space-y-6">
          {/* Add New Event Button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-xl font-semibold">Discount Events Management</h3>
              <p className="text-gray-400 text-sm">Create and manage special discount campaigns with custom royalty rates</p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Create Discount Event
            </button>
          </div>

          {/* Active/Upcoming Events */}
          <div className="grid gap-6">
            {activeDiscountEvents.map((event) => (
              <div key={event.id} className={`border rounded-lg p-6 ${
                event.status === 'active' ? 'bg-green-500/10 border-green-500/30' :
                event.status === 'upcoming' ? 'bg-orange-500/10 border-orange-500/30' :
                'bg-gray-800 border-gray-700'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white text-lg font-semibold">{event.name}</h4>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        event.status === 'active' ? 'bg-green-500 text-white' :
                        event.status === 'upcoming' ? 'bg-orange-500 text-white' :
                        'bg-gray-600 text-gray-300'
                      }`}>
                        {event.status.toUpperCase()}
                      </span>
                      {event.promo_code && (
                        <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 text-xs font-mono rounded">
                          {event.promo_code}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-gray-400 text-xs">Discount</div>
                        <div className="text-white font-bold text-lg">{event.discount_percentage}% OFF</div>
                        {event.original_price && event.discount_price && (
                          <div className="text-gray-400 text-sm">
                            <span className="line-through">${event.original_price}</span> → 
                            <span className="text-green-400 font-semibold"> ${event.discount_price}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-gray-400 text-xs">Period</div>
                        <div className="text-white font-semibold text-sm">
                          {new Date(event.start_date).toLocaleDateString()}
                        </div>
                        <div className="text-white font-semibold text-sm">
                          to {new Date(event.end_date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-gray-400 text-xs">Royalty Rate</div>
                        {event.royalty_amount ? (
                          <div className="text-orange-400 font-bold text-lg">${event.royalty_amount}</div>
                        ) : (
                          <div className="text-orange-400 font-bold text-sm">Variable</div>
                        )}
                        <div className="text-gray-400 text-xs">per conversion</div>
                      </div>
                      
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-gray-400 text-xs">Performance</div>
                        <div className="text-green-400 font-bold text-lg">
                          {event.total_sales || event.estimated_sales || 0}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {event.status === 'planned' ? 'estimated ' : ''}sales
                        </div>
                      </div>
                    </div>

                    {/* Royalty Breakdown for Multi-Plan Events */}
                    {event.royalty_adjustments && (
                      <div className="mt-4 p-4 bg-gray-600/30 rounded-lg">
                        <div className="text-white font-medium mb-2">Royalty Breakdown:</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {Object.entries(event.royalty_adjustments).map(([plan, amount]) => (
                            <div key={plan} className="flex justify-between text-sm">
                              <span className="text-gray-300">{plan.replace('rev1_', '').replace('_', ' ')}</span>
                              <span className="text-orange-400 font-semibold">${amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button className="text-blue-400 hover:text-blue-300" title="View Analytics">
                      <ChartBarIcon className="w-5 h-5" />
                    </button>
                    <button className="text-orange-400 hover:text-orange-300" title="Edit Event">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4">Discount Events Impact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  ${activeDiscountEvents.reduce((sum, event) => sum + (event.total_royalties_paid || 0), 0).toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">Total Royalties from Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {activeDiscountEvents.reduce((sum, event) => sum + (event.total_sales || 0), 0).toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">Total Event Sales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {activeDiscountEvents.filter(event => event.status === 'active').length}
                </div>
                <div className="text-gray-400 text-sm">Active Events</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Generator Tab */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Influencer Referral Links</h3>
            <p className="text-gray-400 text-sm mb-6">
              Copy and share these unique links with influencers for automatic tracking and commission calculation
            </p>
            
            <div className="space-y-4">
              {influencers.filter(inf => inf.status === 'active').map((influencer) => (
                <div key={influencer.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-medium">{influencer.name}</span>
                        <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 text-xs font-semibold rounded-full">
                          🚀 Revolutionary Royalties: $2-$6/user
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm font-mono bg-gray-600 p-2 rounded border">
                        https://prometheus-app.com/signup?ref={influencer.referral_code}
                      </div>
                    </div>
                    <button
                      onClick={() => copyInfluencerLink(influencer)}
                      className={`ml-4 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        copiedLink === influencer.id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {copiedLink === influencer.id ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-4 h-4" />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Structure */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Commission Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <div className="text-green-400 font-semibold text-lg">REV1 Basic</div>
                <div className="text-white text-3xl font-bold">$2</div>
                <div className="text-gray-300 text-sm">per $9 subscription</div>
                <div className="text-green-400 text-xs font-medium">22.2% Rate</div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <div className="text-blue-400 font-semibold text-lg">REV1 Standard</div>
                <div className="text-white text-3xl font-bold">$4</div>
                <div className="text-gray-300 text-sm">per $19 subscription</div>
                <div className="text-blue-400 text-xs font-medium">21.1% Rate</div>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                <div className="text-purple-400 font-semibold text-lg">REV1 Premium</div>
                <div className="text-white text-3xl font-bold">$6</div>
                <div className="text-gray-300 text-sm">per $29 subscription</div>
                <div className="text-purple-400 text-xs font-medium">20.7% Rate</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="text-center">
                <h4 className="text-orange-400 font-bold text-lg mb-2">🚀 REVOLUTIONARY ROYALTY SYSTEM</h4>
                <p className="text-white font-medium">EVERYONE gets the SAME amazing rates - no tier discrimination!</p>
                <p className="text-gray-300 text-sm mt-2">
                  Whether you have 1K or 1M followers, you earn the same per subscriber. 
                  Fair, transparent, and industry-leading payouts!
                </p>
                <div className="mt-4 text-orange-400 font-bold">
                  Example: 100 Standard referrals = $400/month = $4,800/year! 💰
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Campaigns