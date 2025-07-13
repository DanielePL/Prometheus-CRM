# Supabase Setup Guide für Prometheus CRM

## 📋 Übersicht
Diese Anleitung führt Sie durch die Einrichtung von Supabase für das Prometheus CRM System.

## 🚀 Schritt 1: Supabase Projekt erstellen

1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Klicken Sie auf "Start your project"
3. Erstellen Sie einen Account oder melden Sie sich an
4. Klicken Sie auf "New Project"
5. Wählen Sie Ihre Organisation
6. Geben Sie einen Projektnamen ein: `prometheus-crm`
7. Erstellen Sie ein sicheres Datenbankpasswort
8. Wählen Sie eine Region (Europa empfohlen)
9. Klicken Sie auf "Create new project"

## 🔧 Schritt 2: API Keys abrufen

1. In Ihrem Supabase Dashboard, gehen Sie zu **Settings** → **API**
2. Kopieren Sie die folgenden Werte:
   - **Project URL** (beginnt mit `https://`)
   - **anon public** Key
   - **service_role** Key (nur für Backend)

## 📝 Schritt 3: Environment Variables konfigurieren

### Frontend (.env.local)
```bash
# Client Environment Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend (.env)
```bash
# Server Environment Variables  
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Schritt 4: Datenbank Schema erstellen

1. Gehen Sie zu **SQL Editor** in Ihrem Supabase Dashboard
2. Kopieren Sie den Inhalt von `database/schema.sql`
3. Fügen Sie ihn in den SQL Editor ein
4. Klicken Sie auf **Run** um das Schema zu erstellen

Das Schema enthält:
- ✅ `customers` Tabelle mit allen erforderlichen Feldern
- ✅ Beispieldaten (12 Test-Kunden)
- ✅ Row Level Security (RLS) Policies
- ✅ Indexes für Performance
- ✅ Trigger für `updated_at` Feld

## 🔐 Schritt 5: Authentication (Optional)

Für Produktionsumgebung:
1. Gehen Sie zu **Authentication** → **Settings**
2. Konfigurieren Sie Ihre bevorzugte Auth-Methode
3. Setzen Sie Site URL auf `http://localhost:3000` (Development)

## 🧪 Schritt 6: Testen der Verbindung

1. Starten Sie das Frontend:
```bash
cd client
npm run dev
```

2. Gehen Sie zu `http://localhost:3000/customers`
3. Sie sollten jetzt echte Daten aus Supabase sehen
4. Überprüfen Sie die Browser-Konsole auf eventuelle Fehler

## 📊 Funktionalitäten

### ✅ Implementiert:
- **Real-time Updates** - Änderungen werden sofort angezeigt
- **Suche & Filter** - Server-side und Client-side
- **Loading States** - Spinner während Datenabfrage
- **Error Handling** - Nutzerfreundliche Fehlermeldungen
- **Fallback zu Mock-Daten** - Falls Supabase nicht verfügbar

### 🔄 Real-time Subscriptions:
Die App abonniert automatisch Änderungen in der `customers` Tabelle:
- Neue Kunden werden sofort angezeigt
- Updates werden live übernommen
- Gelöschte Kunden verschwinden automatisch

## 🛠️ Troubleshooting

### Problem: "Missing Supabase environment variables"
**Lösung:** Überprüfen Sie Ihre `.env.local` Datei und stellen Sie sicher, dass alle Variablen korrekt gesetzt sind.

### Problem: "Row Level Security" Fehler
**Lösung:** Stellen Sie sicher, dass die RLS Policies korrekt erstellt wurden (siehe schema.sql).

### Problem: Keine Daten sichtbar
**Lösung:** 
1. Überprüfen Sie die Browser-Konsole auf Fehler
2. Verifizieren Sie Ihre API Keys
3. Stellen Sie sicher, dass die Tabelle `customers` existiert

### Problem: Real-time Updates funktionieren nicht
**Lösung:**
1. Überprüfen Sie ob Real-time in Supabase aktiviert ist
2. Gehen Sie zu **Database** → **Replication** 
3. Aktivieren Sie Real-time für die `customers` Tabelle

## 🔍 Datenbank-Struktur

```sql
customers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  tier TEXT ('REV1', 'REV2', 'REV3'),
  status TEXT ('active', 'trial', 'churned'),
  mrr DECIMAL(10,2),
  ltv DECIMAL(10,2),
  join_date TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 🎯 Nächste Schritte

1. **Authentifizierung hinzufügen**
2. **Weitere Tabellen erstellen** (subscriptions, transactions, etc.)
3. **API Endpoints** für CRUD-Operationen
4. **Dashboard Metriken** aus echten Daten
5. **Stripe Integration** für Zahlungen

## 📞 Support

Bei Problemen:
1. Überprüfen Sie die [Supabase Dokumentation](https://supabase.com/docs)
2. Schauen Sie in die Browser-Konsole für Fehlermeldungen
3. Testen Sie die Verbindung mit dem Supabase Dashboard

---

*Das Prometheus CRM ist jetzt bereit für echte Kundendaten! 🚀*
