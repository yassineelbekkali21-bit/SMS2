# ✅ Checklist Avant Mise en Production

## 🔴 CRITIQUE - À faire ABSOLUMENT

- [ ] **Remplacer le numéro WhatsApp**
  - Fichier : `src/lib/landing-config.ts`
  - Ligne : `number: '33123456789'`
  - Format : Code pays + numéro sans 0 (ex: `33612345678`)
  - ⚠️ TESTER le numéro en ouvrant : `https://wa.me/VOTRE_NUMERO`

- [ ] **Ajouter la vraie vidéo VSL**
  - Fichier : `src/lib/landing-config.ts`
  - Ligne : `url: 'https://www.youtube.com/embed/...'`
  - Format : URL d'embed YouTube ou Vimeo
  - ⚠️ TESTER que la vidéo s'ouvre dans le modal

- [ ] **Vérifier TOUS les liens WhatsApp**
  - Cliquer sur tous les CTA de la page
  - Vérifier que WhatsApp s'ouvre avec le bon message
  - Tester sur mobile ET desktop

## 🟠 IMPORTANT - Données à personnaliser

- [ ] **Remplacer les cours mockés**
  - Fichier : `src/lib/landing-data.ts`
  - Modifier le tableau `coursesData`
  - Minimum 6 cours recommandés

- [ ] **Remplacer les témoignages**
  - Fichier : `src/lib/landing-data.ts`
  - Modifier le tableau `testimonialsData`
  - Utiliser de VRAIS témoignages d'étudiants
  - Vérifier avec les étudiants avant publication

- [ ] **Remplacer les posts réseaux sociaux**
  - Fichier : `src/lib/landing-data.ts`
  - Modifier le tableau `socialPostsData`
  - Utiliser de VRAIS posts si possible

- [ ] **Ajouter les vrais logos partenaires**
  - Fichier : `src/lib/landing-config.ts`
  - Ajouter les images dans `/public/logos/`
  - Modifier le tableau `partnerLogos`

## 🟡 RECOMMANDÉ - Configuration

- [ ] **Configurer Google Analytics**
  - Fichier : `src/lib/landing-config.ts`
  - Remplacer `googleAnalyticsId`
  - Ajouter le script GA dans `layout.tsx`

- [ ] **Configurer Facebook Pixel**
  - Fichier : `src/lib/landing-config.ts`
  - Remplacer `facebookPixelId`
  - Ajouter le script FB Pixel dans `layout.tsx`

- [ ] **Ajouter les meta tags SEO**
  - Créer `src/app/marketing/layout.tsx`
  - Ajouter title, description, og:image
  - Vérifier avec l'outil de test Facebook/LinkedIn

- [ ] **Mettre à jour les liens réseaux sociaux**
  - Fichier : `src/lib/landing-config.ts`
  - Modifier `social.instagram`, `social.tiktok`, etc.
  - Vérifier que tous les liens fonctionnent

- [ ] **Mettre à jour l'email de contact**
  - Fichier : `src/lib/landing-config.ts`
  - Modifier `contact.email`

## 🟢 OPTIONNEL - Optimisations

- [ ] **Ajouter une vraie thumbnail pour la vidéo**
  - Créer une image attrayante
  - Ajouter dans `/public/`
  - Mettre à jour dans `landing-config.ts`

- [ ] **Optimiser les images**
  - Convertir en WebP
  - Compresser (TinyPNG, Squoosh)
  - Ajouter des attributs `loading="lazy"`

- [ ] **Ajouter un favicon personnalisé**
  - Remplacer `/public/favicon.ico`
  - Ajouter aussi favicon-16x16.png et favicon-32x32.png

- [ ] **Configurer le sitemap**
  - Créer `public/sitemap.xml`
  - Ajouter l'URL marketing

- [ ] **Ajouter robots.txt**
  - Créer `public/robots.txt`
  - Autoriser l'indexation de /marketing

## 🧪 TESTS - À faire avant le lancement

### Tests fonctionnels

- [ ] **Tester tous les CTA WhatsApp**
  - Hero : CTA principal
  - How It Works : CTA bas de section
  - Content Carousel : CTA sur cartes
  - FAQ : CTA après questions
  - Footer : CTA multiple emplacements
  - Vérifier que le message pré-rempli est correct

- [ ] **Tester le formulaire WhatsApp**
  - Sélectionner chaque objectif
  - Remplir le champ texte
  - Vérifier que le message contient tout
  - Vérifier l'ouverture de WhatsApp

- [ ] **Tester le modal vidéo**
  - Clic sur la vidéo
  - Vérifier que le modal s'ouvre
  - Vérifier que la vidéo se charge
  - Tester la fermeture (X, Escape, clic outside)

- [ ] **Tester le carrousel de cours**
  - Tester tous les filtres
  - Vérifier le scroll horizontal
  - Tester les boutons prev/next (desktop)
  - Tester le swipe (mobile)

- [ ] **Tester l'accordéon FAQ**
  - Ouvrir chaque question
  - Vérifier les animations
  - Vérifier que les autres se ferment

- [ ] **Tester la navigation**
  - Cliquer sur "Programme" → scroll vers carrousel
  - Cliquer sur "Résultats" → scroll vers témoignages
  - Cliquer sur "FAQ" → scroll vers FAQ
  - Vérifier le smooth scroll

### Tests responsive

- [ ] **Mobile (< 768px)**
  - Tester le menu hamburger
  - Vérifier que tout est lisible
  - Tester tous les CTA (taille tactile suffisante)
  - Vérifier le scroll du carrousel (swipe)
  - Tester le formulaire WhatsApp

- [ ] **Tablet (768px - 1024px)**
  - Vérifier la grille 2 colonnes
  - Tester tous les éléments interactifs

- [ ] **Desktop (> 1024px)**
  - Vérifier la grille 3 colonnes
  - Tester les boutons prev/next du carrousel
  - Vérifier les hover states

### Tests navigateurs

- [ ] **Chrome** (dernier)
- [ ] **Safari** (dernier)
- [ ] **Firefox** (dernier)
- [ ] **Edge** (dernier)
- [ ] **Safari iOS** (mobile)
- [ ] **Chrome Android** (mobile)

### Tests performance

- [ ] **Lighthouse**
  - Performance > 90
  - Accessibility > 90
  - Best Practices > 90
  - SEO > 90

- [ ] **Page Speed Insights**
  - Mobile score > 80
  - Desktop score > 90

- [ ] **Temps de chargement**
  - First Contentful Paint < 1.5s
  - Largest Contentful Paint < 2.5s
  - Time to Interactive < 3.5s

### Tests accessibilité

- [ ] **Navigation au clavier**
  - Tester Tab pour naviguer
  - Vérifier les focus states visibles
  - Tester Enter/Space sur les boutons

- [ ] **Lecteur d'écran**
  - Tester avec VoiceOver (Mac)
  - Ou NVDA (Windows)
  - Vérifier que tout est lisible

- [ ] **Contraste**
  - Vérifier ratio WCAG AA (4.5:1)
  - Utiliser l'outil de Chrome DevTools

## 📊 TRACKING - Configuration analytics

- [ ] **Événements Google Analytics à tracker**
  ```javascript
  // Exemple d'événements à configurer :
  - whatsapp_click (par section)
  - video_play
  - carousel_filter_click
  - form_submit
  - faq_question_open
  ```

- [ ] **Conversions à tracker**
  - Clic WhatsApp = Lead
  - Soumission formulaire = Lead qualifié
  - Lecture vidéo > 50% = Intérêt élevé

## 🚀 DÉPLOIEMENT

### Avant le déploiement

- [ ] Faire un commit de tous les changements
- [ ] Créer une branche `feature/marketing-landing`
- [ ] Tester en local une dernière fois
- [ ] Demander une revue de code si possible

### Déploiement

- [ ] **Option 1 : Route séparée** `/marketing`
  - Aucun risque pour la page actuelle
  - Permet de tester en prod
  - Facile de faire un A/B test

- [ ] **Option 2 : Remplacer la page actuelle**
  - Plus risqué
  - Faire un backup de l'ancienne version
  - Prévoir un rollback rapide

### Après le déploiement

- [ ] Vérifier que la page est accessible
- [ ] Tester tous les liens WhatsApp en prod
- [ ] Vérifier Google Analytics (events tracking)
- [ ] Monitorer les erreurs (Sentry, LogRocket, etc.)
- [ ] Demander des retours à quelques utilisateurs

## 📈 SUIVI - Métriques à surveiller

### Premières 24h

- [ ] Nombre de visiteurs uniques
- [ ] Taux de rebond
- [ ] Temps moyen sur la page
- [ ] Nombre de clics WhatsApp
- [ ] Taux de conversion (visite → WhatsApp)

### Première semaine

- [ ] Analyser les heatmaps (Hotjar)
- [ ] Identifier les sections les plus scrollées
- [ ] Identifier les CTA les plus cliqués
- [ ] Lire les messages WhatsApp reçus
- [ ] Collecter les feedbacks

### Premier mois

- [ ] Calculer le taux de conversion réel
- [ ] Identifier les points de friction
- [ ] Lancer des A/B tests si nécessaire
- [ ] Optimiser les éléments peu performants

## 🔧 MAINTENANCE

### Hebdomadaire

- [ ] Vérifier que tous les liens fonctionnent
- [ ] Lire les nouveaux témoignages potentiels
- [ ] Ajouter de nouveaux posts réseaux sociaux

### Mensuel

- [ ] Mettre à jour les statistiques (nombre d'étudiants, etc.)
- [ ] Ajouter de nouveaux cours si disponibles
- [ ] Renouveler les témoignages si datés
- [ ] Analyser les performances et optimiser

## ✅ VALIDATION FINALE

Une fois TOUTES les cases cochées :

- [ ] **J'ai testé personnellement la page complète**
- [ ] **J'ai fait tester par au moins 2 autres personnes**
- [ ] **Tous les liens WhatsApp fonctionnent**
- [ ] **La vidéo fonctionne**
- [ ] **Les données sont réelles (pas mockées)**
- [ ] **Le site est responsive**
- [ ] **Les analytics sont configurés**
- [ ] **Je suis prêt(e) à lancer ! 🚀**

---

**Date de lancement prévu** : ___/___/______

**Responsable** : _________________

**Checklist complétée à** : _____ %

---

💡 **Astuce** : Imprimez cette checklist et cochez au fur et à mesure !




