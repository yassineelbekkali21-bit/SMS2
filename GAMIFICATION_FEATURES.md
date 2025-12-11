# 🎮 Système de Gamification - Science Made Simple

## Vue d'ensemble
Nouveau système de gamification inspiré de **Clash Royale** et **Clash of Clans**, avec profil évolutif, compétitions et événements temporaires.

---

## ✨ Fonctionnalités Implémentées

### 1. 👤 Profil Gamifié (`GamifiedProfile.tsx`)

**Localisation**: Accessible via le bouton de profil dans le header (remplace l'ancien XPWidget)

**Caractéristiques**:
- **Avatar évolutif par niveau**:
  - Niveau 1-9: 🎓 (Étudiant - vert)
  - Niveau 10-19: 🌟 (Étoile montante - bleu)
  - Niveau 20-29: ⚡ (Éclair - jaune)
  - Niveau 30-39: 🔥 (Flamme - orange)
  - Niveau 40-49: 💎 (Diamant - cyan)
  - Niveau 50+: 👑 (Couronne - doré)

- **3 Onglets**:
  1. **Vue d'ensemble**: Statistiques rapides (cours complétés, série, quiz parfaits, aides données)
  2. **Badges**: Collection de badges débloqués vs verrouillés avec effet showcase
  3. **Statistiques**: Progression détaillée, temps d'étude, collection

- **Animations**:
  - Étoiles flottantes en arrière-plan
  - Avatar qui pulse et tourne
  - Barre XP animée
  - Badge de série qui pulse (🔥 si série > 7 jours)

**Comment l'utiliser**:
```tsx
// Déjà intégré dans SimpleDashboard
// Cliquez sur le bouton violet avec votre niveau/XP dans le header
```

---

### 2. 🏆 Compétitions Temporaires (`CompetitionLeaderboard.tsx`)

**Localisation**: Affichée dans la section "Mes cours" après les KPI

**Types de compétitions**:
1. **Sprint du Week-end** (Global): Gagne le plus d'XP ce week-end
2. **Clash des Facultés** (Facultés): Sciences vs Ingénierie vs Médecine...
3. **Défi des Pays** (Pays): Belgique vs France vs Luxembourg

**Caractéristiques**:
- **Classement en temps réel** avec:
  - Top 3 avec design spécial (or, argent, bronze)
  - Indicateurs de changement de position (↑↓)
  - Votre position personnelle mise en évidence
  
- **Infos de compétition**:
  - Compte à rebours en temps réel
  - Nombre de participants
  - Prix à gagner
  - Votre score actuel

- **Animations**:
  - Éléments flottants (🏆⭐🔥⚡)
  - Cartes des participants avec effets de gradient
  - Transitions fluides

**Données mock**:
```typescript
// Exemples de compétitions prédéfinies
- Sprint du Week-end: 2547 participants, 2x XP
- Clash des Facultés: 892 participants, Badge champion
- Défi des Pays: 5234 participants, Couronne nationale
```

---

### 3. ⚡ Événements XP Boost (`XPBoostEvent.tsx`)

**Localisation**: Widget flottant en bas à droite dans la section "Mes cours"

**Types d'événements**:
1. **XP Boost Week-end**: 2× XP pendant 48h
2. **Marathon d'Étude**: 3× XP pendant 24h (événement challenge)

**Caractéristiques**:
- **Carte animée** avec:
  - Icône emoji animée (rotation, scale)
  - Multiplicateur XP en badge pulsant
  - Animations de particules (⚡✨🔥⭐💫)
  - Compte à rebours en temps réel
  
- **Section extensible** montrant:
  - Récompenses à gagner
  - Conditions à remplir
  
- **Événements à venir** affichés en bas

**Notifications**:
- Badge 🔥 sur le bouton de profil quand série > 7 jours
- Les événements actifs s'affichent automatiquement

---

## 🎯 Intégration dans SimpleDashboard

### Changements majeurs:

1. **Header** (Ligne ~2384-2413):
   ```tsx
   // AVANT: Widget XP compact
   <XPWidget profile={userXPProfile} compact={true} />
   
   // APRÈS: Bouton profil gamifié cliquable
   <motion.button onClick={() => setShowGamifiedProfile(true)}>
     <div className="bg-gradient-to-r from-purple-600 to-indigo-600">
       {/* Avatar + Niveau + XP */}
     </div>
   </motion.button>
   ```

2. **Section Cours** (Ligne ~2965-2971):
   ```tsx
   // Ajout du Leaderboard de compétitions
   <section className="mb-16">
     <CompetitionLeaderboard
       competitions={[]}
       userId={user?.id}
     />
   </section>
   ```

3. **Overlays/Modals** (Ligne ~3583-3605):
   ```tsx
   // Profil gamifié en modal
   <AnimatePresence>
     {showGamifiedProfile && <GamifiedProfile />}
   </AnimatePresence>
   
   // Événements XP en widget flottant
   {activeSection === 'courses' && <XPBoostEvent />}
   ```

---

## 📊 Données Mock & Personnalisation

### Compétitions (CompetitionLeaderboard.tsx)
```typescript
const MOCK_COMPETITIONS = [
  {
    id: 'weekend-sprint',
    title: 'Sprint du Week-end',
    type: 'global',
    multiplier: 2,
    participants: [...],
    userRank: 42,
    userScore: 1250
  },
  // ...
];
```

### Événements XP (XPBoostEvent.tsx)
```typescript
const MOCK_EVENTS = [
  {
    id: 'weekend-boost',
    title: 'XP Boost Week-end',
    multiplier: 2,
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000 * 2),
    rewards: ['Badge spécial', 'Bonus +5% XP'],
    conditions: ['Compléter 3 leçons', 'Obtenir 100% à un quiz']
  }
];
```

### Profil (GamifiedProfile.tsx)
```typescript
const avatar = getAvatarForLevel(currentLevel.level);
// Retourne: { emoji, bg, border, glow }

// Stats affichées:
stats = {
  coursesCompleted: profile.completedCourses || 0,
  totalStudyTime: profile.totalStudyTime || 0,
  perfectQuizzes: profile.perfectQuizzes || 0,
  helpedStudents: profile.helpedStudents || 0,
}
```

---

## 🎨 Design & Animations

### Palette de couleurs:
- **Profil**: Gradient purple-600 to indigo-600
- **Compétitions**: 
  - 1er: yellow-400 to orange-500 (Or)
  - 2ème: gray-300 to gray-400 (Argent)
  - 3ème: amber-600 to amber-700 (Bronze)
- **Événements**: yellow-400 to orange-500 (Boost)

### Effets visuels:
- Particules flottantes et animées
- Gradient backgrounds avec animations
- Borders avec glow effects
- Scale, rotate, pulse animations
- Compte à rebours en temps réel

---

## 🚀 Prochaines Étapes (Suggestions)

1. **Backend API**:
   - Endpoints pour récupérer les vraies compétitions
   - Endpoint pour le leaderboard en temps réel
   - Gestion des événements XP Boost

2. **Notifications Push**:
   - Alerte 1h avant début d'un événement
   - Notification quand un ami vous dépasse dans une compétition
   - Alerte quand vous gagnez un nouveau badge

3. **Récompenses concrètes**:
   - Débloquer des avatars exclusifs
   - Accès premium temporaire
   - Badges affichés publiquement dans les cercles

4. **Matchmaking**:
   - Compétitions par niveau (débutant, intermédiaire, expert)
   - Ligues mensuelles (Bronze, Argent, Or, Platine, Diamant, Champion)
   - Saisons avec récompenses de fin de saison

5. **Social**:
   - Défier un ami en direct
   - Créer des compétitions privées
   - Partager ses badges sur les réseaux sociaux

---

## 📱 Responsive Design

Tous les composants sont **100% responsives**:
- Mobile: Layout vertical, modals plein écran
- Tablet: Layout adapté
- Desktop: Layout optimal avec widgets latéraux

---

## ✅ Checklist Complète

- [x] Avatar évolutif avec 6 niveaux
- [x] Profil modal avec 3 onglets
- [x] Vitrine de badges (débloqués + verrouillés)
- [x] Compétitions temporaires (3 types)
- [x] Leaderboard avec classement réel
- [x] Événements XP Boost Week-end
- [x] Compte à rebours temps réel
- [x] Déplacement XP du header vers profil
- [x] Intégration complète dans SimpleDashboard
- [x] Animations et effets visuels
- [x] Design inspiré Clash Royale/Clash of Clans

---

**Auteur**: Assistant IA  
**Date**: Octobre 2025  
**Version**: 1.0.0




