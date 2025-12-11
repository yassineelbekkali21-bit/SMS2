# 🎨 Bento Grid - Plan d'implémentation

## 📋 Contexte
Transformation de la section "Ressources & Outils" du lecteur de leçon en un **Bento Grid moderne et innovant** (Web 3.0).

## 🎯 Objectif
Créer un layout de type "bento" (grille asymétrique) avec des cartes de tailles variables qui montrent un aperçu en mode compact et s'expandent au clic pour afficher le contenu complet.

---

## 🏗️ Structure du Bento Grid

### Layout Grid (6 colonnes × hauteur variable)

```
┌─────────────────────────────┬───────────┐
│                             │           │
│  1. Essentiels à retenir    │  2. Exos  │
│  (Purple - 4×2)             │  (Blue)   │
│                             │  (2×2)    │
├─────────────────────────────┤           │
│  3. Q&A Intégré (Cyan 3×1)  ├───────────┤
├─────────────────────────────┤  4. Quiz  │
│  5. Ressources (Gray 3×1)   │  (Pink)   │
└─────────────────────────────┴─  (3×1) ─┘
```

---

## 🎨 Design de chaque carte

### 1️⃣ Essentiels à retenir (4×2 - Grande)
**Couleur**: Purple → Pink gradient  
**Preview**:
- Icône BookOpen
- Titre + sous-titre
- Mini mindmap (aperçu 2×2)
- Badge "Voir plus →"

**Expanded** (6×3):
- Mindmap complète
- Concept central + 4 branches
- Design glassmorphism

---

### 2️⃣ Exercices Collaboratifs (2×2 - Moyenne)
**Couleur**: Blue → Indigo gradient  
**Preview**:
- Icône Users
- Stats: 16 résolus / 8 en attente
- Badge "+10 XP"
- Badge "Contribuer →"

**Expanded** (6×3):
- 3 KPIs (Exercices / Non-résolus / Contributions)
- Liste d'exercices avec états (résolu/non-résolu/validation)
- CTA "Proposer une solution"
- Call to action global avec récompenses

---

### 3️⃣ Q&A Intégré (3×1 - Horizontale)
**Couleur**: Cyan → Blue gradient  
**Preview**:
- Icône HelpCircle
- Nombre de Q&A: "12 questions"
- Dernière question récente
- Badge "Poser une question"

**Expanded** (6×2):
- Liste de Q&A avec slides liés
- Format Q (bleu) / R (vert)
- Timestamps vidéo
- Upvotes et contributeurs
- Bouton "Poser une question"

---

### 4️⃣ Quiz de la leçon (3×1 - Horizontale)
**Couleur**: Pink → Red gradient  
**Preview**:
- Icône Target
- "15 questions • 10 min"
- Score: — / Moyenne: 88%
- Badge "Commencer →"

**Expanded** (6×2):
- Stats détaillées (Questions / Ton score / Moyenne)
- Bouton CTA "Commencer le quiz"
- Historique des tentatives
- Leaderboard (top 3)

---

### 5️⃣ Autres Ressources (3×1 - Petite)
**Couleur**: Gray gradient  
**Preview uniquement** (pas d'expansion):
- PDF Résumé
- Vidéos complémentaires
- Liens externes

---

## 🎭 Animations & Interactions

### Preview → Expanded
```javascript
whileHover={{ scale: 1.02 }}
transition: spring damping 30
```

### Badge "Voir plus →"
```javascript
animate={{ x: [0, 4, 0] }}
transition: duration 1.5, repeat Infinity
```

### Expansion
```javascript
className={`lg:col-span-${collapsed} → lg:col-span-6`}
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
```

---

## 🔄 État React

```typescript
const [expandedBentoCard, setExpandedBentoCard] = useState<string | null>(null);

// Valeurs possibles:
// - null (tout collapsed)
// - 'essentials'
// - 'exercises'
// - 'qna'
// - 'quiz'
```

---

## 💡 Avantages du Bento Grid

✅ **UX améliorée**: Aperçu rapide sans scroll  
✅ **Moderne**: Design Web 3.0 avec glassmorphism  
✅ **Interactif**: Expansion au clic, animations fluides  
✅ **Hiérarchie**: Tailles variables = importance visuelle  
✅ **Responsive**: S'adapte mobile/desktop  
✅ **Performance**: Contenu chargé à la demande  

---

## 🚀 Prochaines étapes

1. ✅ Structure de base créée
2. ✅ Card 1 (Essentiels) en preview
3. ✅ Card 2 (Exercices) en preview
4. ⏳ Finir Card 3 (Q&A)
5. ⏳ Finir Card 4 (Quiz)
6. ⏳ Ajouter Card 5 (Ressources)
7. ⏳ Tester toutes les transitions
8. ⏳ Optimiser responsive mobile

---

## 📝 Notes techniques

- **Glassmorphism**: `backdropFilter: 'blur(10px)'`
- **Gradients**: `linear-gradient(135deg, rgba(...), rgba(...))`
- **Borders**: 2px solid avec opacity 0.2
- **Shadows**: Utiliser `shadow-lg` de Tailwind
- **Z-index**: Card expanded = z-50
- **Overflow**: `overflow-y-auto` pour le contenu expanded

---

Status: **En cours d'implémentation** 🚧









