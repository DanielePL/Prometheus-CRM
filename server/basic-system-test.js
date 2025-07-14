#!/usr/bin/env node

/**
 * Stripe Test ohne echte Keys
 * Testet die Grundfunktionalität ohne echte Stripe Verbindung
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

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

console.log(`\n${colors.cyan}🔧 Prometheus CRM - System Test (ohne echte Stripe Keys)${colors.reset}\n`)

// Test 1: Environment Variables
log.test('Teste Environment Variables...')
const envVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLIC_KEY', 
  'SERVER_URL',
  'NODE_ENV'
]

for (const varName of envVars) {
  const value = process.env[varName]
  if (value) {
    if (value.includes('your_actual_test_secret_key_here') || value.includes('your_actual_test_public_key_here')) {
      log.warning(`${varName}: ⚠️ Platzhalter-Wert (muss ersetzt werden)`)
    } else {
      log.success(`${varName}: ✅ Gesetzt`)
    }
  } else {
    log.error(`${varName}: ❌ Nicht gesetzt`)
  }
}

// Test 2: Dependencies 
log.test('Teste Node.js Dependencies...')
try {
  const stripe = await import('stripe')
  log.success('Stripe SDK: ✅ Verfügbar')
} catch (error) {
  log.error(`Stripe SDK: ❌ ${error.message}`)
}

try {
  const express = await import('express')
  log.success('Express: ✅ Verfügbar')
} catch (error) {
  log.error(`Express: ❌ ${error.message}`)
}

// Test 3: Server Structure
log.test('Teste Server-Datei-Struktur...')
const fs = await import('fs')

const requiredFiles = [
  'src/index.js',
  'src/routes/stripe.js',
  'src/controllers/stripeController.js',
  'package.json'
]

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    log.success(`${file}: ✅ Vorhanden`)
  } else {
    log.error(`${file}: ❌ Fehlt`)
  }
}

// Test 4: Test Server Health (ohne Server zu starten)
log.test('Teste Server Health Endpoint...')
try {
  const response = await fetch('http://localhost:8080/api/health')
  if (response.ok) {
    const data = await response.json()
    log.success(`Server läuft: ${data.message}`)
  } else {
    log.warning('Server läuft nicht (das ist normal wenn nicht gestartet)')
  }
} catch (error) {
  log.warning('Server nicht erreichbar (das ist normal wenn nicht gestartet)')
}

console.log(`\n${colors.cyan}📋 Nächste Schritte:${colors.reset}`)
console.log('1. Trage deine echten Stripe Test Keys in die .env Datei ein')
console.log('2. Starte den Server mit: npm run dev')
console.log('3. Führe die vollständigen Tests aus: npm run test:stripe')
console.log('\n💡 Stripe Test Keys bekommst du hier: https://dashboard.stripe.com/test/apikeys')
