# Design Document

## Overview

Le système de diagnostic et d'onboarding personnalisé améliore l'architecture existante de Science Made Simple en intégrant une métaphore médicale : diagnostic humain via WhatsApp, puis prescription personnalisée dans l'application. Le design s'appuie sur les composants existants (SimpleLanding, SimpleDashboard, Community, SmartPlanning, etc.) pour créer une expérience cohérente et personnalisée.

## Architecture Existante à Améliorer

### Flux Principal Actuel
```
SimpleLanding → SimpleDashboard → Cours (IntegratedCourseViewer/CourseStaircaseView)
```

### Flux Principal Amélioré
```
SimpleLanding → WhatsApp (Diagnostic) → SimpleDashboard (Prescription) → Apprentissage Gamifié
```

### Composants Existants à Étendre
1. **SimpleLanding** - Ajouter redirection WhatsApp avec message pré-rempli
2. **SimpleDashboard** - Enrichir avec section diagnostic personnalisé
3. **Community** - Déjà excellent, ajouter social proof par faculté
4. **SmartPlanning** - Déjà implémenté avec IA conversationnelle
5. **IntegratedCourseViewer** - Ajouter slides interactifs avec professeur
6. **CourseStaircaseView** - Étendre les thèmes Mario Map existants
7. **CreditSystem** - Déjà implémenté, parfait pour l'économie non-mercantile
8. **PersonalProfileSection** - Base existante pour "Tes blocages/ambitions/chemin"

## Components and Interfaces

### 1. SimpleLanding Enhancement
**Existant:** Composant landing page avec navigation et CTA "Connexion"
**Amélioration:** Ajouter redirection WhatsApp pour diagnostic

```typescript
// Extension de l'interface existante
interface SimpleLandingProps {
  onEnterApp: () => void;
  // Nouvelles props pour WhatsApp
  whatsappNumber?: string;
  diagnosticMessage?: string;
}

// Nouveau composant pour le CTA WhatsApp
interface WhatsAppDiagnosticCTA {
  message: string;
  phoneNumber: string;
  studentInfo?: {
    source: 'landing' | 'dashboard';
    timestamp: Date;
  };
}
```

**Améliorations spécifiques basées sur le site existant:**
- **Conserver l'identité visuelle** : Fond gris clair, cartes noires arrondies, typographie épurée
- **Remplacer "Essayer gratuitement"** par "Commencer mon diagnostic" avec même style de bouton
- **Intégrer le workflow WhatsApp** visible dans la carte "Accès immédiat à la communauté WhatsApp"
- **Message pré-rempli WhatsApp** : "Bonjour ! Je viens du site Science Made Simple et j'aimerais faire mon diagnostic personnalisé (ambitions, blocages). Pouvez-vous m'aider ?"
- **Conserver les statistiques** : 83% taux de réussite, 4032 étudiants, 15 ans d'expertise
- **Maintenir les 3 piliers** visibles : Accès WhatsApp, Diagnostic personnalisé, Learning Path sur-mesure
- **Garder le formulaire de contact** comme alternative au WhatsApp

### 2. WhatsApp Integration avec Types Existants
**Existant:** Types PersonalProfile, Blocage, Ambition dans src/types/index.ts
**Amélioration:** Étendre pour intégration WhatsApp

```typescript
// Extension des types existants
interface DiagnosticData extends PersonalProfile {
  studentId: string;
  university: string;
  faculty: string;
  section: string;
  year: string;
  currentSituation: string;
  urgentDeadlines: Date[];
  stressLevel: 1 | 2 | 3 | 4 | 5;
  // Réutilise les types existants
  blocages: Blocage[];
  ambitions: Ambition[];
  cheminRecommande: CheminRecommande;
}

interface WhatsAppSession {
  sessionId: string;
  studentId: string;
  mentorId: string;
  messages: ConversationWhatsApp[]; // Type existant
  diagnosticResult: DiagnosticData;
  prescriptionGenerated: boolean;
}
```

### 3. SimpleDashboard Enhancement
**Existant:** SimpleDashboard avec header, navigation, métriques
**Amélioration:** Ajouter section diagnostic personnalisé

```typescript
// Extension du DashboardData existant
interface EnhancedDashboardData extends DashboardData {
  // Nouveau : données de diagnostic
  personalProfile: PersonalProfile; // Type existant
  diagnosticCompleted: boolean;
  prescriptionDate: Date;
  
  // Amélioration du header existant
  headerConfig: {
    title: "Ton plan de réussite sur mesure";
    baseline: "Issu de ton diagnostic et de nos échanges";
    showWhatsAppButton: boolean;
    showAIButton: boolean;
  };
}

// Nouveau composant pour la section diagnostic
interface DiagnosticSection {
  blocages: Blocage[]; // Type existant
  ambitions: Ambition[]; // Type existant  
  cheminRecommande: CheminRecommande; // Type existant
  socialProof: FacultyStats; // Type existant
}
```

**Améliorations spécifiques basées sur l'identité visuelle:**
- **Header personnalisé** : "Ton plan de réussite sur mesure" avec même typographie que le site
- **Baseline cohérente** : "Issu de ton diagnostic et de nos échanges" (même ton que "Accompagnement sur mesure")
- **Cartes noires arrondies** : Utiliser le même style pour "Tes blocages", "Tes ambitions", "Ton chemin"
- **Bouton WhatsApp** : Même style que "Concept" du site, avec icône WhatsApp
- **Métriques personnalisées** : Adapter le style des statistiques (83%, 4032, 15 ans) pour la progression individuelle
- **Navigation cohérente** : Intégrer "Mon Diagnostic" avec le même style que la navigation existante
- **Fond et espacement** : Conserver le fond gris clair et les espacements généreux du site

### 4. CourseStaircaseView Enhancement
**Existant:** CourseStaircaseView avec thèmes dans /public/course-backgrounds/
**Amélioration:** Étendre les thèmes et personnalisation avec bloc de progression par défaut

```typescript
// Extension des thèmes existants
const EXISTING_THEMES = [
  'default',
  'course-path-1', // Montagne
  'course-path-3', // Forêt
  'course-path-4', // Cosmic
  'course-path-5'  // Ocean
];

const NEW_THEMES = [
  'escalier-diagonal',
  'galaxie-constellation', 
  'ville-campus',
  'aventure-medievale'
];

// Extension du composant existant
interface EnhancedCourseStaircaseProps extends CourseStaircaseViewProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  personalizedPath: boolean; // Basé sur le diagnostic
  diagnosticHighlights: string[]; // Leçons recommandées par le diagnostic
  
  // Nouveau : bloc de progression par défaut
  defaultProgressBlock: {
    currentLessonId: string; // Dernière leçon où l'étudiant s'est arrêté
    showByDefault: boolean; // Afficher le bloc au chargement
    continueButtonAction: () => void; // Action du bouton "Continuer"
  };
}

// Réutilisation des types Lesson existants
interface EnhancedLesson extends Lesson {
  isRecommendedByDiagnostic: boolean;
  blocagesCovered: string[]; // IDs des blocages que cette leçon résout
  diagnosticPriority: 'high' | 'medium' | 'low';
  isCurrentProgress: boolean; // Marque la leçon où l'étudiant s'est arrêté
}

// Nouveau composant pour le bloc de progression par défaut
interface ProgressBlock {
  lesson: EnhancedLesson;
  progressPercentage: number;
  timeEstimate: string;
  difficulty: 'Facile' | 'Intermédiaire' | 'Avancé';
  learningObjectives: string[];
  onContinue: () => void;
  onSelectDifferentLesson: () => void;
}
```

**Améliorations spécifiques:**
- **Bloc de progression par défaut** : Afficher automatiquement les détails de la dernière leçon en cours
- **Bouton "Continuer"** : Action claire pour reprendre là où l'étudiant s'est arrêté
- **Indicateur visuel** : Mettre en évidence la leçon actuelle sur la Mario Map
- **Informations contextuelles** : Temps estimé, difficulté, objectifs d'apprentissage
- Étendre les thèmes existants avec nouveaux SVG
- Ajouter sélecteur de thème dans les paramètres existants
- Mettre en évidence les leçons recommandées par le diagnostic
- Conserver la logique de progression existante

### 5. IntegratedCourseViewer Enhancement
**Existant:** IntegratedCourseViewer avec slides et quiz
**Amélioration:** Ajouter professeur et manuscrits

```typescript
// Extension du viewer existant
interface EnhancedIntegratedCourseViewer extends IntegratedCourseViewerProps {
  professorMode: boolean;
  manuscriptMode: boolean;
  adaptivePath: boolean; // Basé sur le diagnostic
}

// Extension des slides existants
interface InteractiveSlide extends Lesson {
  professorVideo: {
    position: 'overlay' | 'side' | 'corner';
    videoUrl: string;
    transcript: string;
    isManuscript: boolean; // Slides écrits à la main
  };
  
  // Réutilise VideoQuizQuestion existant
  videoQuizzes: VideoQuizQuestion[];
  
  // Nouveau : adaptation basée sur le diagnostic
  diagnosticAdaptation: {
    blocagesCovered: string[];
    difficultyAdjustment: 'easier' | 'normal' | 'harder';
    additionalExplanations: boolean;
  };
}

// Extension des quiz existants pour l'adaptation
interface AdaptiveQuizResponse extends VideoQuizQuestion {
  onIncorrectAnswer: {
    showAdditionalSlides: boolean;
    suggestMentorContact: boolean;
    updateDiagnostic: boolean;
  };
}
```

**Améliorations spécifiques:**
- Ajouter overlay vidéo du professeur sur les slides existants
- Intégrer mode manuscrit avec slides écrits à la main
- Étendre les VideoQuizQuestion existants avec adaptation
- Utiliser le système de quiz existant pour façonner le parcours

### 6. Community Enhancement
**Existant:** Community avec cercles, study rooms, Q&A, badges
**Amélioration:** Ajouter social proof par faculté

```typescript
// Extension du Community existant
interface EnhancedCommunity extends CommunityProps {
  // Nouveau : social proof personnalisé
  facultySocialProof: {
    coursesPopularity: CoursePopularityByFaculty[];
    diagnosticInsights: FacultyDiagnosticStats;
    successStories: FacultySuccessStories[];
  };
}

// Nouveaux types pour le social proof
interface CoursePopularityByFaculty {
  courseId: string;
  facultyName: string;
  enrolledStudents: number;
  averageProgress: number;
  diagnosticRecommendationRate: number; // % d'étudiants à qui ce cours a été recommandé
}

interface FacultyDiagnosticStats {
  faculty: string;
  commonBlocages: Blocage[];
  popularAmbitions: Ambition[];
  averageSuccessRate: number;
}
```

**Améliorations spécifiques:**
- Ajouter section "Étudiants de ta faculté" dans les cercles existants
- Enrichir les CourseCard existants avec "X étudiants de ta faculté ont pris ce cours"
- Intégrer les données de diagnostic dans les CommunityActivity existantes
- Étendre les AlumniProfile existants avec parcours diagnostic

### 7. SmartPlanning Enhancement
**Existant:** SmartPlanning avec IA conversationnelle et préférences
**Amélioration:** Intégrer données de diagnostic

```typescript
// Extension du SmartPlanning existant
interface EnhancedSmartPlanning extends SmartPlanningProps {
  diagnosticData: PersonalProfile; // Type existant
  prioritizeByDiagnostic: boolean;
}

// Extension des StudyPreferences existantes
interface DiagnosticAwarePreferences extends StudyPreferences {
  // Nouveau : basé sur le diagnostic
  blocagesPriority: string[]; // IDs des blocages à prioriser
  ambitionsDeadlines: Date[]; // Échéances des ambitions
  diagnosticRecommendations: {
    intensiveSubjects: string[];
    reviewSubjects: string[];
    newSubjects: string[];
  };
}

// Extension des CalendarEvent existants
interface DiagnosticCalendarEvent extends CalendarEvent {
  diagnosticContext: {
    blocagesCovered: string[];
    ambitionProgress: string;
    recommendationReason: string;
  };
}
```

**Améliorations spécifiques:**
- Intégrer les blocages dans la génération de planning existante
- Prioriser automatiquement les cours recommandés par le diagnostic
- Enrichir les ChatMessage existants avec contexte diagnostic
- Utiliser les échéances d'ambitions pour ajuster le planning

## Data Models

### Core Entities

#### Student Profile
```typescript
interface StudentProfile {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    university: string;
    faculty: string;
    section: string;
    year: string;
  };
  diagnostic: {
    blocages: Blocage[];
    ambitions: Ambition[];
    cheminRecommande: CheminRecommande;
    lastUpdated: Date;
  };
  progression: {
    coursesUnlocked: string[];
    lessonsCompleted: string[];
    creditsBalance: number;
    achievements: Achievement[];
  };
  preferences: {
    mapTheme: string;
    notifications: boolean;
    studyReminders: boolean;
  };
}
```

#### Blocage (Identified Weakness)
```typescript
interface Blocage {
  id: string;
  titre: string;
  description: string;
  matiere: string;
  niveau: 'facile' | 'moyen' | 'difficile';
  identifieLe: Date;
  source: 'whatsapp' | 'quiz' | 'auto-evaluation';
  recommandations: CourseRecommendation[];
  priorite: number;
  resolved: boolean;
}
```

#### Course avec Mario Map
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  mapConfiguration: {
    theme: string;
    nodes: CourseMapNode[];
    totalLessons: number;
  };
  lessons: InteractiveLesson[];
  creditCost: number;
  socialProof: {
    enrolledFromFaculty: number;
    averageProgress: number;
    testimonials: string[];
  };
}
```

## Error Handling

### WhatsApp Integration Errors
- **Connection Timeout**: Fallback vers formulaire web avec notification mentor
- **Message Delivery Failure**: Retry automatique + notification utilisateur
- **Diagnostic Incomplete**: Relance bienveillante avec questions ciblées

### Learning Path Errors
- **Content Loading Failure**: Cache local + mode offline partiel
- **Progress Sync Issues**: Queue locale + synchronisation différée
- **Quiz Submission Errors**: Sauvegarde locale + retry automatique

### Community Features Errors
- **Moderation Failures**: Escalade automatique vers mentors humains
- **Spam Detection**: Filtrage IA + validation humaine
- **Inappropriate Content**: Suppression immédiate + notification modérateurs

## Testing Strategy

### Unit Testing
- Composants React avec Jest et React Testing Library
- Logique métier avec tests de régression
- Intégrations WhatsApp avec mocks et stubs

### Integration Testing
- Flux complet diagnostic → prescription → apprentissage
- Synchronisation données WhatsApp ↔ Application
- Système de crédits et déblocage de contenu

### User Experience Testing
- Tests d'accessibilité WCAG 2.1 AA
- Performance sur appareils mobiles
- Navigation intuitive sans formation

### A/B Testing Framework
- Différents thèmes de Mario Map
- Variations de messages WhatsApp
- Optimisation des conversions gratuité → crédits

## Performance Considerations

### Frontend Optimization
- Lazy loading des thèmes Mario Map
- Compression des vidéos professeur
- Cache intelligent des slides manuscrits
- Progressive Web App pour usage offline

### Backend Scalability
- Microservices pour WhatsApp, Learning, Community
- CDN pour assets statiques (slides, vidéos)
- Database sharding par faculté/université
- Real-time sync avec WebSockets optimisés

### Mobile Performance
- Bundle splitting par fonctionnalité
- Image optimization automatique
- Touch gestures optimisés pour Mario Map
- Battery-efficient animations

## Security & Privacy

### Data Protection
- Chiffrement end-to-end pour conversations WhatsApp
- RGPD compliance avec consentements granulaires
- Anonymisation des données communautaires
- Audit trails pour modifications de prescription

### Authentication & Authorization
- OAuth2 avec providers universitaires
- Role-based access (Student, Mentor, Admin)
- Session management sécurisé
- API rate limiting par utilisateur

## Accessibility Design

### WCAG 2.1 AA Compliance
- Contraste couleurs optimisé (noir/blanc + touches couleur)
- Navigation clavier complète
- Screen reader compatibility
- Sous-titres automatiques pour vidéos professeur

### Inclusive Design
- Support multi-langues (FR/EN priorité)
- Adaptation aux troubles d'apprentissage
- Interface simplifiée pour utilisateurs novices
- Alternatives textuelles pour contenu visuel

## Web 3.0 Preparation

### Blockchain Integration Ready
- Wallet connection infrastructure
- Smart contracts pour certifications
- Decentralized identity management
- Token-based incentive system

### Interoperability
- Open APIs pour intégrations tierces
- Standard protocols pour data portability
- Cross-platform compatibility
- Future-proof architecture patterns#
# Visual Identity Alignment

### Site Web Existant - Éléments Clés Identifiés
1. **Palette de couleurs** : Fond gris clair (#F5F5F5), cartes noires (#000000), texte blanc sur noir
2. **Typographie** : Police sans-serif épurée, hiérarchie claire (titres gras, sous-titres moyens)
3. **Layout** : Cartes arrondies avec coins généreux, espacement important entre éléments
4. **Navigation** : Barre noire flottante avec logo "X" et bouton "Concept" arrondi blanc
5. **Iconographie** : Icônes simples et épurées, émojis pour humaniser
6. **Statistiques** : Cartes noires avec chiffres blancs en gras, descriptions en dessous

### Workflow Existant Identifié
```
Site Web → Formulaire Contact → WhatsApp → Diagnostic → Learning Path
```

### Éléments à Réutiliser dans l'App
1. **Cartes de diagnostic** : Même style que les 3 cartes du site (WhatsApp, Diagnostic, Learning Path)
2. **Statistiques personnelles** : Adapter le style "83% de taux de réussite" pour "Ta progression : 67%"
3. **Témoignages** : Réutiliser le style des témoignages étudiants avec photos
4. **Boutons d'action** : Même style que "Essayer gratuitement" et "Concept"
5. **Formulaires** : Même style que le formulaire de contact (champs avec bordures fines)

### Cohérence Visuelle App ↔ Site
- **Transition fluide** : L'utilisateur doit reconnaître immédiatement l'identité Science Made Simple
- **Même codes couleurs** : Noir/blanc/gris avec touches de couleur pour les actions importantes
- **Même typographie** : Police et hiérarchie identiques
- **Même esprit** : Minimaliste, épuré, focalisé sur l'essentiel
- **Même ton** : "Accompagnement sur mesure", "Redécouvrez la science, gagnez en confiance"

### Adaptations Spécifiques pour l'App
1. **Header mobile** : Adapter la navigation flottante pour mobile avec menu hamburger
2. **Cartes interactives** : Ajouter hover effects et animations subtiles
3. **Progression visuelle** : Barres de progression dans le même style que les graphiques du site
4. **Notifications** : Style cohérent avec les cartes noires arrondies
5. **Modales** : Même style que les overlays du site avec fond semi-transparent