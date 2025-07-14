#!/bin/bash

echo "🚀 Prometheus CRM Server Startup"
echo "Aktuelles Verzeichnis: $(pwd)"

# Wechsle ins Server-Verzeichnis
cd /workspaces/Prometheus-CRM/server

echo "📁 Wechsle ins Server-Verzeichnis: $(pwd)"
echo "📦 Package.json vorhanden: $(ls package.json 2>/dev/null || echo 'NEIN')"

echo "🔧 Starte Server..."
exec node src/index.js
