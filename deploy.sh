#!/bin/bash

echo "🚀 Déploiement sur Firebase Hosting..."

# Vérifier que Firebase CLI est installé
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI n'est pas installé. Installez-le avec: npm install -g firebase-tools"
    exit 1
fi

# Build de l'application Next.js
echo "📦 Building Next.js application..."
npm run build

# Vérifier que le build a réussi
if [ $? -ne 0 ]; then
    echo "❌ Le build a échoué"
    exit 1
fi

# Déploiement sur Firebase
echo "🌐 Déploiement sur Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi !"
    echo "🌍 Votre application est maintenant live sur Firebase Hosting"
else
    echo "❌ Le déploiement a échoué"
    exit 1
fi




