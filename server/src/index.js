import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

// Security middleware
app.use(helmet())

// CORS configuration - allow requests from frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3002', 'http://127.0.0.1:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Logging middleware
app.use(morgan('combined'))

// Webhook endpoint with raw body parsing (MUST be before express.json())
import webhookRoutes from './routes/webhooks.js'
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Import routes
import stripeRoutes from './routes/stripe.js'
import subscriptionRoutes from './routes/subscriptions.js'

// API Routes
app.use('/api/stripe', stripeRoutes)
app.use('/api/subscriptions', subscriptionRoutes)

// ==================== ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Prometheus CRM API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    webhook_url: `${req.protocol}://${req.get('host')}/api/webhooks/stripe`
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Prometheus CRM API',
    status: 'running',
    endpoints: {
      health: '/api/health'
    }
  })
})

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Prometheus CRM Server running on port ${PORT}`)
  console.log(`📊 Health check available at: http://localhost:${PORT}/api/health`)
  console.log(`🌍 CORS enabled for: http://localhost:3000`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
