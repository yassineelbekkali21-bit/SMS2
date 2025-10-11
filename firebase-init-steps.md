# 🔥 Initialisation Firebase pour Science Made Simple

## Étapes à suivre dans votre terminal :

### 1. Connexion (si pas déjà fait)
```bash
firebase login
```

### 2. Initialisation du projet
```bash
firebase init
```

### 3. Sélections à faire dans l'assistant :

**Quels services voulez-vous configurer ?**
- ✅ **Hosting** : Configure files for Firebase Hosting
- ❌ Firestore, Functions, etc. (pas nécessaire pour le moment)

**Projet Firebase :**
- Si vous avez déjà un projet : **Use an existing project**
- Sinon : **Create a new project**

**Configuration Hosting :**
- **Public directory** : `out` (déjà configuré dans firebase.json)
- **Single-page app** : `Yes`
- **Set up automatic builds** : `No`
- **Overwrite out/index.html** : `No`

### 4. Mettre à jour .firebaserc
Remplacez "your-project-id" par votre vrai project ID dans `.firebaserc`

### 5. Premier déploiement
```bash
# Build + Deploy en une commande
npm run deploy

# Ou étape par étape
npm run build
firebase deploy --only hosting
```

## ✅ Résultat attendu

Votre application sera disponible sur :
`https://your-project-id.web.app`

## 🎯 Configuration actuelle optimisée

Votre projet est déjà configuré avec :
- Export statique Next.js
- Configuration Firebase optimisée
- Scripts de déploiement automatisés
- Headers de cache pour performance
- Free Tier compatible

## 📋 Quick Commands

```bash
# Déploiement complet
npm run deploy

# Test local Firebase
npm run firebase:serve

# Déploiement preview
npm run deploy:preview
```




