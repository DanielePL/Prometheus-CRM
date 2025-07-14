#!/usr/bin/env node

/**
 * Stripe API Connection Test Script
 * 
 * Dieses Script testet die Stripe API Verbindung und alle wichtigen Funktionen
 * des Prometheus CRM Subscription Systems.
 */

import dotenv from 'dotenv'
import Stripe from 'stripe'
import fetch from 'node-fetch'

// Load environment variables
dotenv.config()

// Configuration
const CONFIG = {
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:8080',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  TEST_CUSTOMER_EMAIL: process.env.TEST_CUSTOMER_EMAIL || 'test@example.com'
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  test: (msg) => console.log(`${colors.cyan}🧪${colors.reset} ${msg}`)
}

// Initialize Stripe
let stripe = null
try {
  if (!CONFIG.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY nicht gefunden!')
  }
  stripe = new Stripe(CONFIG.STRIPE_SECRET_KEY)
  log.success('Stripe SDK initialisiert')
} catch (error) {
  log.error(`Stripe Initialisierung fehlgeschlagen: ${error.message}`)
  process.exit(1)
}

// Test functions
const tests = {
  // 1. Test Stripe API Verbindung
  async testStripeConnection() {
    log.test('Teste Stripe API Verbindung...')
    try {
      const account = await stripe.accounts.retrieve()
      log.success(`Stripe Account verbunden: ${account.id}`)
      log.info(`Business Type: ${account.business_type}`)
      log.info(`Country: ${account.country}`)
      return true
    } catch (error) {
      log.error(`Stripe Verbindung fehlgeschlagen: ${error.message}`)
      return false
    }
  },

  // 2. Test Server Health Check
  async testServerHealth() {
    log.test('Teste Server Health Check...')
    try {
      const response = await fetch(`${CONFIG.SERVER_URL}/api/health`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      log.success(`Server läuft: ${data.message}`)
      log.info(`Version: ${data.version}`)
      return true
    } catch (error) {
      log.error(`Server Health Check fehlgeschlagen: ${error.message}`)
      return false
    }
  },

  // 3. Test Subscription Pläne
  async testSubscriptionPlans() {
    log.test('Teste Subscription Pläne...')
    
    const testPlans = [
      'rev1_tier1',
      'rev1_tier2', 
      'rev1_tier3',
      'rev2_coaching',
      'rev3_enterprise'
    ]

    let allPassed = true

    for (const planId of testPlans) {
      try {
        const response = await fetch(`${CONFIG.SERVER_URL}/api/stripe/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId,
            customerId: 'test_customer_123'
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        if (data.success && data.clientSecret) {
          log.success(`Plan ${planId}: Payment Intent erstellt`)
        } else {
          throw new Error(`Ungültige Antwort für Plan ${planId}`)
        }
      } catch (error) {
        log.error(`Plan ${planId} fehlgeschlagen: ${error.message}`)
        allPassed = false
      }
    }

    return allPassed
  },

  // 4. Test Stripe Customer Creation
  async testCustomerCreation() {
    log.test('Teste Stripe Customer Erstellung...')
    try {
      const customer = await stripe.customers.create({
        email: CONFIG.TEST_CUSTOMER_EMAIL,
        name: 'Test Customer',
        metadata: {
          source: 'prometheus-crm-test'
        }
      })

      log.success(`Test Customer erstellt: ${customer.id}`)
      log.info(`Email: ${customer.email}`)
      
      // Clean up - delete test customer
      await stripe.customers.del(customer.id)
      log.info('Test Customer gelöscht')
      
      return customer.id
    } catch (error) {
      log.error(`Customer Erstellung fehlgeschlagen: ${error.message}`)
      return null
    }
  },

  // 5. Test Payment Method Creation
  async testPaymentMethod() {
    log.test('Teste Payment Method Erstellung...')
    try {
      // Use Stripe test token instead of raw card data
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: 'tok_visa' // Stripe test token
        }
      })

      log.success(`Test Payment Method erstellt: ${paymentMethod.id}`)
      log.info(`Typ: ${paymentMethod.type}`)
      log.info(`Karte: **** **** **** ${paymentMethod.card.last4}`)
      
      return paymentMethod.id
    } catch (error) {
      // Try alternative method with test card token
      try {
        const customer = await stripe.customers.create({
          email: 'test-pm@prometheus-crm.com',
          source: 'tok_visa' // Use test token
        })
        
        const paymentMethods = await stripe.paymentMethods.list({
          customer: customer.id,
          type: 'card'
        })
        
        if (paymentMethods.data.length > 0) {
          log.success(`Test Payment Method (via Customer): ${paymentMethods.data[0].id}`)
          await stripe.customers.del(customer.id)
          return paymentMethods.data[0].id
        }
        
        await stripe.customers.del(customer.id)
        throw new Error('Keine Payment Methods gefunden')
        
      } catch (error2) {
        log.error(`Payment Method Erstellung fehlgeschlagen: ${error.message}`)
        log.info('💡 Hinweis: Für echte Tests aktiviere Raw Card Data in Stripe Dashboard')
        return null
      }
    }
  },

  // 6. Test Full Subscription Flow
  async testSubscriptionFlow() {
    log.test('Teste kompletten Subscription Flow...')
    
    try {
      // 1. Create customer first
      const customer = await stripe.customers.create({
        email: 'test-subscription@example.com',
        name: 'Test Subscription User'
      })
      log.info(`Customer erstellt: ${customer.id}`)
      
      // 2. Create a new payment method specifically for this customer
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: 'tok_visa'
        }
      })
      log.info(`Payment Method erstellt: ${paymentMethod.id}`)
      
      // 3. Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer.id
      })
      log.info('Payment Method an Customer angehängt')

      // 4. Test subscription creation via API
      const response = await fetch(`${CONFIG.SERVER_URL}/api/stripe/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          planId: 'rev1_tier1',
          customerId: customer.id
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const subscriptionData = await response.json()
      log.success(`Subscription erstellt: ${subscriptionData.subscription?.id || 'ID nicht verfügbar'}`)

      // Clean up
      if (subscriptionData.subscription?.id) {
        await stripe.subscriptions.cancel(subscriptionData.subscription.id)
        log.info('Test Subscription storniert')
      }
      await stripe.customers.del(customer.id)
      log.info('Test Customer gelöscht')

      return true
    } catch (error) {
      log.error(`Subscription Flow fehlgeschlagen: ${error.message}`)
      return false
    }
  },

  // 7. Test Error Handling
  async testErrorHandling() {
    log.test('Teste Error Handling...')
    
    const errorTests = [
      {
        name: 'Ungültiger Plan ID',
        body: { planId: 'invalid_plan', customerId: 'test' },
        endpoint: '/api/stripe/create-payment-intent'
      },
      {
        name: 'Fehlende Parameter',
        body: { planId: 'rev1_tier1' },
        endpoint: '/api/stripe/create-payment-intent'
      },
      {
        name: 'Ungültige Payment Method',
        body: { paymentMethodId: 'pm_invalid', planId: 'rev1_tier1', customerId: 'test' },
        endpoint: '/api/stripe/create-subscription'
      }
    ]

    let allPassed = true

    for (const test of errorTests) {
      try {
        const response = await fetch(`${CONFIG.SERVER_URL}${test.endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(test.body)
        })

        const data = await response.json()
        
        if (data.success === false && data.error) {
          log.success(`${test.name}: Fehler korrekt behandelt`)
        } else {
          log.warning(`${test.name}: Unerwartete Antwort`)
          allPassed = false
        }
      } catch (error) {
        log.error(`${test.name}: ${error.message}`)
        allPassed = false
      }
    }

    return allPassed
  },

  // 8. Test Environment Variables
  async testEnvironmentVariables() {
    log.test('Überprüfe Environment Variables...')
    
    const requiredVars = [
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLIC_KEY'
    ]
    
    const optionalVars = [
      'STRIPE_WEBHOOK_SECRET',
      'SERVER_URL'
    ]

    let allRequired = true

    log.info('Erforderliche Variablen:')
    for (const varName of requiredVars) {
      if (process.env[varName]) {
        log.success(`${varName}: ✓ (${process.env[varName].substring(0, 10)}...)`)
      } else {
        log.error(`${varName}: ✗ Nicht gesetzt`)
        allRequired = false
      }
    }

    log.info('Optionale Variablen:')
    for (const varName of optionalVars) {
      if (process.env[varName]) {
        log.info(`${varName}: ✓ (${process.env[varName]})`)
      } else {
        log.warning(`${varName}: ✗ Nicht gesetzt`)
      }
    }

    return allRequired
  }
}

// Main test runner
async function runAllTests() {
  console.log(`\n${colors.cyan}🚀 Prometheus CRM - Stripe API Test Suite${colors.reset}\n`)
  console.log('═'.repeat(60))
  
  const results = {}
  const testOrder = [
    'testEnvironmentVariables',
    'testStripeConnection', 
    'testServerHealth',
    'testCustomerCreation',
    'testPaymentMethod',
    'testSubscriptionPlans',
    'testSubscriptionFlow',
    'testErrorHandling'
  ]

  for (const testName of testOrder) {
    console.log('')
    results[testName] = await tests[testName]()
  }

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log(`${colors.cyan}📊 Test Zusammenfassung${colors.reset}\n`)
  
  let passed = 0
  let total = 0
  
  for (const [testName, result] of Object.entries(results)) {
    total++
    if (result) {
      passed++
      log.success(`${testName}: BESTANDEN`)
    } else {
      log.error(`${testName}: FEHLGESCHLAGEN`)
    }
  }

  console.log(`\n${colors.cyan}Ergebnis: ${passed}/${total} Tests bestanden${colors.reset}`)
  
  if (passed === total) {
    log.success('🎉 Alle Tests erfolgreich! Stripe API ist vollständig funktionsfähig.')
  } else {
    log.warning(`⚠️ ${total - passed} Test(s) fehlgeschlagen. Bitte Konfiguration überprüfen.`)
  }
  
  return passed === total
}

// Run tests if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      log.error(`Unerwarteter Fehler: ${error.message}`)
      process.exit(1)
    })
}

export { tests, runAllTests }
