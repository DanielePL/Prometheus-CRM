#!/usr/bin/env node

/**
 * Quick Stripe Connection Test
 * Schneller Test um die grundlegende Stripe Verbindung zu überprüfen
 */

import dotenv from 'dotenv'
import Stripe from 'stripe'

dotenv.config()

console.log('🔧 Schneller Stripe Verbindungstest...\n')

// Check environment variables
console.log('📋 Environment Variables:')
console.log(`STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ Gesetzt' : '❌ Fehlt'}`)
console.log(`STRIPE_PUBLIC_KEY: ${process.env.STRIPE_PUBLIC_KEY ? '✅ Gesetzt' : '❌ Fehlt'}`)

if (!process.env.STRIPE_SECRET_KEY) {
  console.log('\n❌ STRIPE_SECRET_KEY fehlt! Bitte .env Datei konfigurieren.')
  console.log('Beispiel:')
  console.log('STRIPE_SECRET_KEY=sk_test_your_key_here')
  process.exit(1)
}

// Test Stripe connection
try {
  console.log('\n🔌 Teste Stripe API Verbindung...')
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  
  const account = await stripe.accounts.retrieve()
  console.log('✅ Stripe Verbindung erfolgreich!')
  console.log(`📊 Account ID: ${account.id}`)
  console.log(`🏢 Business Type: ${account.business_type || 'N/A'}`)
  console.log(`🌍 Country: ${account.country || 'N/A'}`)
  
  // Test creating a simple customer
  console.log('\n👤 Teste Customer Erstellung...')
  const customer = await stripe.customers.create({
    email: 'test@prometheus-crm.com',
    name: 'Test Customer'
  })
  console.log(`✅ Test Customer erstellt: ${customer.id}`)
  
  // Clean up
  await stripe.customers.del(customer.id)
  console.log('🧹 Test Customer gelöscht')
  
  console.log('\n🎉 Grundlegende Stripe Funktionalität arbeitet korrekt!')
  console.log('💡 Führe `npm run test:stripe` für vollständige Tests aus.')
  
} catch (error) {
  console.log('\n❌ Stripe Test fehlgeschlagen:')
  console.error(error.message)
  
  if (error.message.includes('Invalid API Key')) {
    console.log('\n💡 Lösungsvorschlag:')
    console.log('1. Überprüfe deinen STRIPE_SECRET_KEY in der .env Datei')
    console.log('2. Stelle sicher, dass du Test Keys (sk_test_...) verwendest')
    console.log('3. Logge dich in dein Stripe Dashboard ein und kopiere den korrekten Key')
  }
  
  process.exit(1)
}
