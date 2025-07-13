# Prometheus CRM - Client Application

## 🎯 Overview
React-based frontend for the Prometheus CRM system with dark theme design. Built with Vite for fast development and optimized builds.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Application will run on http://localhost:3000

### Build for Production
```bash
npm run build
```

## 🎨 Design System

### Color Palette
- **Background:** `#1a1a1a` (bg-gray-900)
- **Sidebar:** `#111` (darker gray)
- **Cards/Panels:** `#222` (bg-gray-800)
- **Borders:** `#333` (border-gray-700)
- **Text:** White/Gray variants
- **Accent:** `#ff6600` (Orange for active states)

### Layout Structure
- **Sidebar:** 250px fixed width with navigation
- **Main Content:** Flexible width with header and content area
- **Header:** Dynamic titles and system status
- **Logo:** Prometheus branding with 🔥 icon

## 📁 Project Structure
```
src/
├── App.jsx                 # Main app component with routing
├── main.jsx               # React app entry point
├── index.css              # Custom CSS styles (dark theme)
└── components/
    ├── Layout.jsx         # Main layout wrapper
    ├── Sidebar.jsx        # Navigation sidebar
    ├── Header.jsx         # Dynamic page header
    └── pages/
        ├── Dashboard.jsx  # Main dashboard view
        ├── Customers.jsx  # Customer management
        ├── Subscriptions.jsx # Subscription tracking
        ├── Analytics.jsx  # Business intelligence
        ├── Campaigns.jsx  # Marketing campaigns
        └── Settings.jsx   # System configuration
```

## 🧭 Navigation Menu
- 📊 **Dashboard** - Overview and key metrics
- 👥 **Customers** - Customer relationship management
- 💳 **Subscriptions** - Revenue stream tracking
- 📈 **Analytics** - Business intelligence
- 🎯 **Campaigns** - Marketing and attribution
- ⚙️ **Settings** - System configuration

## 🛠️ Tech Stack
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router Dom** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Heroicons** - Icon system
- **Custom CSS** - Dark theme implementation

## 📱 Responsive Design
- Mobile-first approach
- Sidebar collapses on mobile
- Flexible grid layouts
- Touch-friendly interactions

## 🎯 Current Status
All pages currently show "Coming Soon" placeholders with feature descriptions. The design system and navigation are fully implemented and ready for feature development.

## 🔄 Next Steps
1. Implement Dashboard metrics and charts
2. Build Customer management interface
3. Add Subscription tracking features
4. Develop Analytics dashboards
5. Create Campaign management tools
6. Build Settings and configuration

## 🎨 Design Consistency
The design follows the exact styling from the previous team tool project with:
- Consistent orange accent color (#ff6600)
- Dark theme throughout
- Hover and active states
- Smooth transitions
- Professional typography
- Orange accent bars on cards
