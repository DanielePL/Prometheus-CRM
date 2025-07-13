# Prometheus CRM - Backend Server

## 🎯 Overview
Express.js backend server for the Prometheus CRM system with RESTful API endpoints, security middleware, and CORS configuration.

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
Server will run on http://localhost:8080

### Production
```bash
npm start
```

## 📁 Project Structure
```
server/
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (development)
├── .env.example          # Environment template
└── src/
    └── index.js          # Main Express server
```

## 🛠️ Tech Stack
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Dotenv** - Environment variable loader
- **Nodemon** - Development auto-restart

## 🔗 API Endpoints

### Health Check
```
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "message": "Prometheus CRM API is running",
  "timestamp": "2025-07-12T15:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

### Root Endpoint
```
GET /
```
**Response:**
```json
{
  "message": "Welcome to Prometheus CRM API",
  "status": "running",
  "endpoints": {
    "health": "/api/health"
  }
}
```

## ⚙️ Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

- **PORT** - Server port (default: 8080)
- **NODE_ENV** - Environment (development/production)
- **FRONTEND_URL** - Frontend URL for CORS
- **LOG_LEVEL** - Logging level

### CORS Configuration
- Enabled for `http://localhost:3000` (Frontend)
- Allows credentials and common HTTP methods
- Configured for development and production

### Security Features
- **Helmet** - Sets various HTTP headers
- **CORS** - Controlled cross-origin access
- **JSON parsing** - Limited to 10MB
- **Error handling** - Global error middleware

## 🔄 Development Workflow

1. **Start Backend:**
   ```bash
   cd server
   npm run dev
   ```

2. **Test Health Endpoint:**
   ```bash
   curl http://localhost:8080/api/health
   ```

3. **Check Logs:**
   Server logs all HTTP requests via Morgan

## 🌐 Frontend Integration

The server is configured to work with the React frontend:
- **Frontend URL:** http://localhost:3000
- **Backend URL:** http://localhost:8080
- **API Base:** /api

Frontend can call backend endpoints:
```javascript
fetch('http://localhost:8080/api/health')
  .then(response => response.json())
  .then(data => console.log(data))
```

## 🔮 Future Enhancements

Ready for expansion with:
- **Database integration** (PostgreSQL/Supabase)
- **Authentication** (JWT tokens)
- **Stripe payments** (webhooks and subscriptions)
- **Email notifications** (SMTP)
- **Caching** (Redis)
- **Rate limiting**
- **API documentation** (Swagger)

## 🚨 Error Handling

- **404 errors** for undefined routes
- **Global error middleware** for server errors
- **Detailed error responses** in development
- **Secure error responses** in production

## 📝 Logging

Uses Morgan for HTTP request logging:
- **Development:** Detailed console logs
- **Production:** Combined format logs
- **Error tracking:** Full stack traces in development
