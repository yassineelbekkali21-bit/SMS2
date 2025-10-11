# Déploiement Next.js sur Firebase

## 1. Installation des outils Firebase

```bash
# Installer Firebase CLI globalement
npm install -g firebase-tools

# Se connecter à votre compte Google
firebase login

# Initialiser Firebase dans votre projet
firebase init
```

## 2. Configuration Firebase (firebase.json)

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "function": "nextjsFunc"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  }
}
```

## 3. Configuration Next.js pour Firebase

### A. Option 1: Export statique (Simple mais limité)

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

```json
// package.json - Ajouter ces scripts
{
  "scripts": {
    "build": "next build",
    "export": "next export",
    "deploy": "npm run build && npm run export && firebase deploy"
  }
}
```

### B. Option 2: SSR avec Cloud Functions (Recommandé)

```bash
# Créer le dossier functions
mkdir functions
cd functions
npm init -y

# Installer les dépendances
npm install firebase-functions firebase-admin next react react-dom
```

```javascript
// functions/index.js
const { onRequest } = require('firebase-functions/v2/https');
const next = require('next');

const isDev = process.env.NODE_ENV !== 'production';
const app = next({ 
  dev: isDev, 
  dir: './app' // Chemin vers votre app Next.js
});

const handle = app.getRequestHandler();

exports.nextjsFunc = onRequest(async (req, res) => {
  await app.prepare();
  return handle(req, res);
});
```

```javascript
// next.config.js pour Functions
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '../functions/app/.next',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  }
}

module.exports = nextConfig
```

## 4. Scripts de déploiement

```json
// package.json
{
  "scripts": {
    "build": "next build",
    "deploy:static": "npm run build && firebase deploy --only hosting",
    "deploy:full": "npm run build && firebase deploy",
    "serve": "firebase emulators:start"
  }
}
```

## 5. Variables d'environnement

```bash
# Configurer les variables d'environnement Firebase
firebase functions:config:set app.env="production"
firebase functions:config:set app.api_key="your-api-key"

# Pour le développement local
firebase functions:config:get > functions/.runtimeconfig.json
```

## 6. Limites du Free Tier

### Firebase Hosting (Gratuit)
- 10 GB de stockage
- 360 MB/jour de transfert
- Certificat SSL gratuit
- CDN global

### Cloud Functions (Free Tier)
- 2M invocations/mois
- 400K GB-secondes/mois
- 200K CPU-secondes/mois
- 5 GB de trafic sortant/mois

### Firestore (si utilisé)
- 1 GB de stockage
- 50K lectures/jour
- 20K écritures/jour
- 20K suppressions/jour

## 7. Optimisations pour le Free Tier

```javascript
// next.config.js - Optimisations
const nextConfig = {
  // Réduire la taille du bundle
  compress: true,
  poweredByHeader: false,
  
  // Optimiser les images
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Cache agressif
  async headers() {
    return [
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  }
}
```

## 8. Commandes de déploiement

```bash
# Déploiement initial
firebase init
firebase deploy

# Déploiement hosting seul
firebase deploy --only hosting

# Déploiement avec functions
firebase deploy --only functions,hosting

# Test local
firebase emulators:start
```

## 9. Monitoring et debugging

```bash
# Voir les logs des functions
firebase functions:log

# Voir l'usage
firebase projects:list
```

## 10. Alternative recommandée : Vercel

Si vous rencontrez des limitations avec Firebase, Vercel est optimisé pour Next.js :

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement en une commande
vercel

# Configuration dans vercel.json
{
  "functions": {
    "app/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### Avantages Vercel vs Firebase :
- **Vercel** : Optimisé pour Next.js, déploiement instantané, preview branches
- **Firebase** : Écosystème Google complet, Firestore intégré, plus de contrôle




