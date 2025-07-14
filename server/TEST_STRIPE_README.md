# Stripe API Test Suite - Anleitung

## Übersicht
Diese Test Suite überprüft alle wichtigen Stripe API Funktionen des Prometheus CRM Systems.

## Setup

### 1. Environment Variables konfigurieren
Kopiere `.env.test` zu `.env` und trage deine echten Stripe Test Keys ein:

```bash
cp .env.test .env
```

Bearbeite `.env` und trage ein:
- `STRIPE_SECRET_KEY`: Dein Stripe Test Secret Key (sk_test_...)
- `STRIPE_PUBLIC_KEY`: Dein Stripe Test Public Key (pk_test_...)
- `STRIPE_WEBHOOK_SECRET`: Dein Webhook Secret (whsec_...)

### 2. Dependencies installieren
```bash
npm install
```

### 3. Server starten
```bash
npm run dev
```

## Tests ausführen

### Vollständige Test Suite
```bash
npm run test:stripe
```

### Einzelne Tests (erweiterte Nutzung)
```javascript
import { tests } from './test-stripe-api.js'

// Nur Stripe Verbindung testen
await tests.testStripeConnection()

// Nur Subscription Pläne testen  
await tests.testSubscriptionPlans()
```

## Test Kategorien

### 1. Environment Variables Test
- Überprüft ob alle erforderlichen Umgebungsvariablen gesetzt sind
- ✅ STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY

### 2. Stripe Connection Test
- Testet die direkte Verbindung zur Stripe API
- Ruft Account-Informationen ab

### 3. Server Health Test
- Überprüft ob der Express Server läuft
- Testet `/api/health` Endpoint

### 4. Customer Creation Test
- Erstellt einen Test-Kunden in Stripe
- Testet Customer Management Funktionen

### 5. Payment Method Test
- Erstellt Test-Zahlungsmethoden
- Nutzt Stripe Test Card: 4242424242424242

### 6. Subscription Plans Test
- Testet alle 5 Subscription Pläne:
  - rev1_tier1 ($9/Monat)
  - rev1_tier2 ($19/Monat) 
  - rev1_tier3 ($29/Monat)
  - rev2_coaching ($199/Monat)
  - rev3_enterprise ($499/Monat)

### 7. Full Subscription Flow Test
- Kompletter End-to-End Test:
  1. Customer erstellen
  2. Payment Method hinzufügen
  3. Subscription erstellen
  4. Aufräumen (Test-Daten löschen)

### 8. Error Handling Test
- Testet fehlerhafte Eingaben:
  - Ungültige Plan IDs
  - Fehlende Parameter
  - Ungültige Payment Methods

## Stripe Test Cards

Die Tests nutzen folgende Stripe Test Cards:

```javascript
// Erfolgreiche Zahlung
4242424242424242

// Abgelehnte Zahlung
4000000000000002

// Insufficient Funds
4000000000009995
```

## Erwartete Ausgabe

Bei erfolgreichen Tests siehst du:
```
🚀 Prometheus CRM - Stripe API Test Suite

🧪 Teste Environment Variables...
✅ STRIPE_SECRET_KEY: ✓ (sk_test_...)
✅ STRIPE_PUBLIC_KEY: ✓ (pk_test_...)

🧪 Teste Stripe API Verbindung...
✅ Stripe Account verbunden: acct_xxx
ℹ Business Type: individual
ℹ Country: US

🧪 Teste Server Health Check...
✅ Server läuft: Prometheus CRM API is running

[... weitere Tests ...]

📊 Test Zusammenfassung
✅ testEnvironmentVariables: BESTANDEN
✅ testStripeConnection: BESTANDEN
✅ testServerHealth: BESTANDEN
✅ testCustomerCreation: BESTANDEN
✅ testPaymentMethod: BESTANDEN
✅ testSubscriptionPlans: BESTANDEN
✅ testSubscriptionFlow: BESTANDEN
✅ testErrorHandling: BESTANDEN

Ergebnis: 8/8 Tests bestanden
🎉 Alle Tests erfolgreich! Stripe API ist vollständig funktionsfähig.
```

## Troubleshooting

### Server nicht erreichbar
```
❌ Server Health Check fehlgeschlagen: fetch failed
```
**Lösung:** Stelle sicher, dass der Server läuft (`npm run dev`)

### Stripe API Fehler
```
❌ Stripe Verbindung fehlgeschlagen: Invalid API Key
```
**Lösung:** Überprüfe deine Stripe Keys in der `.env` Datei

### Fehlende Dependencies
```
Error: Cannot find module 'node-fetch'
```
**Lösung:** Installiere Dependencies: `npm install`

## Produktionshinweise

⚠️ **Wichtig:** Diese Tests nutzen Stripe Test Keys und erstellen echte Test-Objekte in deinem Stripe Dashboard. Alle Test-Objekte werden automatisch nach den Tests gelöscht.

🔒 **Sicherheit:** Nutze niemals echte Stripe Live Keys für Tests!

## Erweiterungen

Du kannst weitere Tests hinzufügen, indem du neue Funktionen zum `tests` Objekt in `test-stripe-api.js` hinzufügst:

```javascript
const tests = {
  // ...existing tests...
  
  async testCustomFeature() {
    log.test('Teste Custom Feature...')
    // Dein Test Code hier
    return true // oder false
  }
}
```
