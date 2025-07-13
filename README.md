# PROMETHEUS CRM SYSTEM - COMPREHENSIVE CONCEPT

**Enterprise-Level Customer Relationship Management for Million+ Subscribers**

---

## 🎯 SYSTEM OVERVIEW

### **Core Mission**
Build a complete CRM ecosystem that tracks every customer interaction from first touchpoint to Rev 3, monitors all financial metrics, attribution sources, and provides actionable insights for scaling to 1M+ subscribers.

### **Technology Stack**
- **Database:** Supabase (PostgreSQL with real-time subscriptions)
- **Payment Processing:** Stripe API (subscriptions, invoicing, webhooks)
- **Frontend:** React with TypeScript
- **Backend:** Node.js/Express with Supabase Edge Functions
- **Analytics:** Custom dashboards + optional integration with Mixpanel/Amplitude
- **Real-time:** Supabase real-time subscriptions for live updates

---

## 📊 CUSTOMER JOURNEY MAPPING

### **Revenue Streams (REV 1-3)**
```
REV 1: Individual App Users ($9-29/month)
├── Tier 1: Basic ($9/month) - Core tracking, training plans
├── Tier 2: Standard ($19/month) - + AI Assistant, analytics  
├── Tier 3: Premium ($29/month) - + Motion tracking, VBT
├── Can have coaches OR use app independently
└── Largest volume target: 1M subscribers

REV 2: Coaching Software ($199-499/month)  
├── For independent coaches managing clients
├── CRM for up to 20-100+ clients
├── Client progress tracking & analytics
├── Revenue sharing from coached REV 1 users
└── Target: 20,000 coaches

REV 3: B2B/Enterprise Gym Software
├── For gyms/clubs managing multiple coaches
├── Coach oversight and performance tracking  
├── Coaches under B2B have REV 1 clients
├── Organizational reporting and analytics
└── Target: 500 B2B clients
```

### **Customer Lifecycle States**
1. **Lead** → Generated from various sources
2. **Prospect** → Engaged but not converted  
3. **Free Trial** → 10-day trial period
4. **REV 1 User** → Individual app subscriber (Tier 1-3)
5. **REV 1 + Coach** → App user with assigned coach
6. **REV 2 Coach** → Independent coach using coaching software
7. **REV 3 Organization** → B2B gym/club with multiple coaches
8. **Churned** → Cancelled subscription
9. **Reactivated** → Returned after churn

### **Revenue Relationship Mapping**
```
REV 3 (B2B Gym)
├── Has multiple REV 2 Coaches
│   ├── Coach A manages 15 REV 1 Users
│   ├── Coach B manages 22 REV 1 Users  
│   └── Coach C manages 8 REV 1 Users
└── Organization pays B2B software fees

REV 2 (Independent Coach)  
├── Manages 5-100+ REV 1 Users
├── Pays coaching software subscription
└── Receives revenue share from coached users

REV 1 (Individual Users)
├── Direct subscribers (no coach)
├── OR coached by REV 2 coach
├── OR coached by coach under REV 3 organization
└── Pay individual app subscription (Tier 1-3)
```

---

## 🏗️ DATABASE ARCHITECTURE

### **Core Tables Structure**

#### **customers**
```sql
- id (uuid, primary key)
- email (text, unique)
- name (text)
- phone (text)
- created_at (timestamp)
- updated_at (timestamp)
- stripe_customer_id (text, unique)
- customer_type (enum: 'lead', 'prospect', 'free_trial', 'rev1_user', 'rev2_coach', 'rev3_org')
- rev1_tier (enum: 'tier1', 'tier2', 'tier3') -- only for REV1 users
- has_coach (boolean) -- REV1 users with assigned coach
- assigned_coach_id (uuid, foreign key) -- links to REV2 coach
- parent_organization_id (uuid, foreign key) -- links to REV3 if applicable
- lifetime_value (decimal)
- total_spent (decimal)
- acquisition_cost (decimal)
- acquisition_source (text)
- acquisition_date (timestamp)
- free_trial_start (timestamp)
- free_trial_end (timestamp)
- last_activity (timestamp)
- risk_score (integer) -- churn prediction
```

#### **coaching_relationships**
```sql
- id (uuid, primary key)
- coach_id (uuid, foreign key) -- REV2 coach
- client_id (uuid, foreign key) -- REV1 user
- organization_id (uuid, foreign key) -- REV3 org (if applicable)
- relationship_start (timestamp)
- relationship_end (timestamp)
- status (enum: 'active', 'paused', 'ended')
- revenue_share_percentage (decimal) -- coach gets % of client subscription
- created_at (timestamp)
```

#### **organizations**
```sql
- id (uuid, primary key)
- name (text)
- organization_type (enum: 'gym', 'club', 'physio_clinic', 'sports_team')
- contact_email (text)
- contact_phone (text)
- address (text)
- coaches_count (integer)
- total_clients_count (integer) -- sum of all coaches' clients
- monthly_revenue (decimal)
- created_at (timestamp)
- status (enum: 'active', 'trial', 'churned')
```

#### **subscriptions**
```sql
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- stripe_subscription_id (text, unique)
- subscription_type (enum: 'rev1_individual', 'rev2_coaching', 'rev3_b2b')
- tier (enum: 'tier1', 'tier2', 'tier3') -- only for REV1
- status (enum: 'free_trial', 'active', 'cancelled', 'past_due', 'paused')
- current_period_start (timestamp)
- current_period_end (timestamp)
- price (decimal)
- currency (text)
- trial_start (timestamp) -- 10-day free trial
- trial_end (timestamp)
- converted_from_trial (boolean)
- created_at (timestamp)
- cancelled_at (timestamp)
- cancel_reason (text)
```

#### **revenue_sharing**
```sql
- id (uuid, primary key)
- rev1_user_id (uuid, foreign key) -- the paying user
- rev2_coach_id (uuid, foreign key) -- the coach receiving share
- rev3_organization_id (uuid, foreign key) -- B2B org (if applicable)
- subscription_id (uuid, foreign key)
- period_start (timestamp)
- period_end (timestamp)
- user_payment_amount (decimal) -- what REV1 user paid
- coach_share_amount (decimal) -- what coach receives
- coach_share_percentage (decimal)
- organization_share_amount (decimal) -- if under B2B
- prometheus_revenue (decimal) -- remaining revenue
- created_at (timestamp)
```

#### **transactions**
```sql
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- subscription_id (uuid, foreign key)
- stripe_payment_intent_id (text)
- amount (decimal)
- currency (text)
- status (enum: 'succeeded', 'failed', 'pending', 'refunded')
- transaction_type (enum: 'subscription', 'upgrade', 'one_time')
- created_at (timestamp)
- metadata (jsonb)
```

#### **attribution_sources**
```sql
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- source_type (enum: 'organic', 'influencer', 'paid_ads', 'referral', 'content', 'event')
- source_name (text) -- specific influencer, campaign name, etc.
- campaign_id (text)
- utm_source (text)
- utm_medium (text)
- utm_campaign (text)
- utm_content (text)
- first_touch (boolean)
- last_touch (boolean)
- attribution_weight (decimal) -- for multi-touch attribution
- created_at (timestamp)
```

#### **customer_interactions**
```sql
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- interaction_type (enum: 'email_open', 'email_click', 'app_login', 'feature_use', 'support_ticket', 'webinar_attend')
- interaction_data (jsonb)
- timestamp (timestamp)
- session_id (text)
```

#### **tier_transitions**
```sql
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- from_tier (text)
- to_tier (text)
- transition_date (timestamp)
- transition_reason (text)
- mrr_impact (decimal)
```

#### **influencer_campaigns**
```sql
- id (uuid, primary key)
- influencer_name (text)
- campaign_name (text)
- start_date (timestamp)
- end_date (timestamp)
- budget (decimal)
- leads_generated (integer)
- conversions (integer)
- revenue_generated (decimal)
- roi (decimal)
- status (enum: 'active', 'paused', 'completed')
```

---

## 🔗 STRIPE API INTEGRATION

### **Webhook Endpoints**
```javascript
// Stripe webhooks to handle real-time events
/webhooks/stripe

Event Types to Handle:
- customer.created
- customer.updated
- customer.deleted
- invoice.payment_succeeded
- invoice.payment_failed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- payment_intent.succeeded
- payment_intent.payment_failed
```

### **Subscription Management Flow**
```javascript
// Example: Handle subscription creation
stripe.subscriptions.create({
  customer: stripeCustomerId,
  items: [{ price: priceId }],
  metadata: {
    tier: 'rev1',
    acquisition_source: 'influencer_campaign_xyz'
  }
})
```

### **Revenue Recognition**
- Real-time MRR (Monthly Recurring Revenue) calculation
- ARR (Annual Recurring Revenue) projections
- Churn revenue impact tracking
- Upgrade/downgrade revenue flow

---

## 📈 KEY METRICS & ANALYTICS

### **Financial KPIs**
- **REV 1 Metrics:**
  - MRR by Tier (1-3): Individual subscription revenue
  - Free Trial Conversion Rate: 10-day trial to paid
  - ARPU by Tier: Average revenue per user per tier
  - Coached vs Uncoached Revenue: Performance comparison
  
- **REV 2 Metrics:**
  - Coaching Software MRR: Direct coach subscriptions  
  - Coach Client Portfolio Size: Average clients per coach
  - Revenue Share Performance: Coach earnings from client base
  - Coach Retention Rate: Coaching software churn
  
- **REV 3 Metrics:**
  - B2B Organization MRR: Enterprise subscription revenue
  - Coaches per Organization: Scale metric
  - Organization Client Penetration: Total REV1 users per B2B
  - Multi-tier Revenue per Organization: Combined REV1+2+3 revenue

### **Cross-Revenue Stream Analytics**
- **Total Ecosystem Revenue:** REV1 + REV2 + REV3 combined
- **Revenue Attribution:** Which stream drives which conversions
- **Customer Journey Value:** REV1 → coached → coach becomes REV2
- **Organization Impact:** B2B acquisition effect on REV1/2 volume

### **Customer Behavior Metrics**
- **Activation Rate:** Free trial to paid conversion
- **Feature Adoption:** Which features drive retention
- **Engagement Score:** Based on app usage patterns
- **Net Promoter Score (NPS):** Customer satisfaction
- **Time to Value:** Days from signup to first value

### **Attribution & Marketing**
- **Source Performance:** ROI by acquisition channel
- **Influencer Campaign ROI:** Revenue per influencer
- **Multi-touch Attribution:** Credit across touchpoints
- **Cohort Analysis:** Performance by acquisition month
- **Viral Coefficient:** Referral program effectiveness

---

## 🎯 CRM FEATURES & FUNCTIONALITY

### **Customer 360° View**
```
Customer Profile Dashboard:
├── Basic Info & Contact Details
├── Subscription History & Status
├── Payment History & Outstanding
├── Tier Progression Timeline
├── Attribution Source Journey
├── Interaction History
├── Support Ticket History
├── Engagement Score & Risk Assessment
├── Predictive Analytics (churn risk, upgrade probability)
└── Custom Notes & Tags
```

### **Automated Workflows**
- **Onboarding Sequences:** Tier-specific email flows
- **Churn Prevention:** At-risk customer identification
- **Upgrade Campaigns:** REV 1 → REV 2 → REV 3
- **Win-back Campaigns:** Re-engage churned customers
- **Payment Recovery:** Failed payment retry sequences

### **Segmentation Engine**
```
Dynamic Segments:
├── High-Value Customers (top 20% by LTV)
├── At-Risk Customers (high churn probability)
├── Upgrade Candidates (REV 1 ready for REV 2)
├── Recent Churns (last 30 days)
├── Trial Users (conversion optimization)
├── Influencer Leads (attribution tracking)
└── Custom Behavioral Segments
```

---

## 📊 DASHBOARD & REPORTING

### **Executive Dashboard**
- Real-time revenue metrics
- Customer growth trends
- Churn analysis
- Attribution performance
- Key business health indicators

### **Marketing Dashboard**
- Campaign performance by source
- Influencer ROI tracking
- Conversion funnel analysis
- Cost per acquisition trends
- Lead quality scoring

### **Customer Success Dashboard**
- Customer health scores
- At-risk customer alerts
- Upgrade opportunity pipeline
- Support ticket trends
- Feature adoption rates

### **Financial Dashboard**
- MRR/ARR breakdown by tier
- Revenue cohort analysis
- Payment failure rates
- Refund and chargeback tracking
- Forecasting models

---

## 🔧 TECHNICAL IMPLEMENTATION

### **Real-time Data Pipeline**
```
Stripe Webhooks → Supabase Edge Functions → Database Updates → Real-time UI Updates
```

### **API Architecture**
```javascript
// RESTful API Structure
/api/customers
/api/subscriptions
/api/analytics
/api/campaigns
/api/reports
/api/webhooks
```

### **Performance Optimization**
- Database indexing for complex queries
- Materialized views for analytics
- Redis caching for frequently accessed data
- Background job processing for heavy operations
- Real-time subscriptions for live dashboard updates

---

## 🚀 SCALABILITY CONSIDERATIONS

### **For 1M+ Subscribers**
- **Database Partitioning:** By customer tier or date ranges
- **Read Replicas:** Separate analytics workload
- **Caching Strategy:** Redis for hot data
- **Queue System:** Background processing for webhooks
- **CDN Integration:** For dashboard assets

### **Data Retention Strategy**
- **Hot Data:** Last 12 months (fast access)
- **Warm Data:** 1-3 years (archived but accessible)
- **Cold Data:** 3+ years (long-term storage)

---

## 📱 USER INTERFACE MOCKUP

### **Main Navigation**
```
Prometheus CRM
├── 📊 Dashboard
├── 👥 Customers
├── 💳 Subscriptions
├── 📈 Analytics
├── 🎯 Campaigns
├── 💰 Revenue
├── ⚠️  Alerts
└── ⚙️  Settings
```

### **Customer List View**
```
[Search/Filter Bar]
┌─────────────────────────────────────────────────┐
│ Customer Name | Tier | MRR | LTV | Status | Risk │
├─────────────────────────────────────────────────┤
│ John Doe      | REV2 | $29 | $348| Active | 🟢   │
│ Jane Smith    | REV1 | $9  | $108| Active | 🟡   │
│ Mike Johnson  | REV3 | $199| $2388|Active | 🟢   │
└─────────────────────────────────────────────────┘
```

---

## 🔄 DEVELOPMENT PHASES

### **Phase 1: Foundation (4-6 weeks)**
- Database schema setup
- Basic Stripe integration
- Customer CRUD operations
- Simple dashboard

### **Phase 2: Core CRM (6-8 weeks)**
- Subscription management
- Payment tracking
- Basic analytics
- Attribution system

### **Phase 3: Advanced Features (8-10 weeks)**
- Predictive analytics
- Automated workflows
- Advanced dashboards
- Reporting system

### **Phase 4: Scale & Optimize (4-6 weeks)**
- Performance optimization
- Advanced integrations
- Mobile responsiveness
- Enterprise features

---

## 💡 ADVANCED FEATURES (Future)**

### **AI-Powered Insights**
- Churn prediction models
- Optimal pricing recommendations
- Customer lifetime value forecasting
- Personalized upgrade timing

### **Advanced Attribution**
- Multi-touch attribution modeling
- Marketing mix modeling
- Incrementality testing
- Cross-device tracking

### **Enterprise Features**
- Role-based access control
- Custom reporting builder
- API for external integrations
- White-label customer portals

---

*This CRM system will be the backbone for scaling Prometheus to 1M+ subscribers while maintaining deep insights into every customer interaction and revenue stream.*