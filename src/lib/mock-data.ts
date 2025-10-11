import { 
  DashboardData, 
  Course, 
  StudentProgress, 
  CourseSuggestion, 
  User, 
  FacultyStats, 
  VideoQuizQuestion, 
  CoursePack,
  StudentProfile,
  MiniQuizQuestion,
  SocialBadge,
  Circle,
  StudyRoom,
  CommunityQuestion,
  CommunityAnswer,
  CommunityActivity,
  CommunityChallenge,
  Lesson,
  PersonalProfile,
  PurchaseOption
} from '@/types';

// ========================================================================
// DONNÉES DE DÉMONSTRATION SCIENCE MADE SIMPLE
// Nouvelle structure hiérarchique : Leçon → Cours → Pack
// Leçon = Unité d'apprentissage (ex: "Calcul du champ électrique d'un plan infini")
// Cours = Ensemble de leçons (ex: "Loi de Gauss")
// Pack = Bundle de cours (ex: "Physique Q1")
// ========================================================================

export const mockUser: User = {
  id: '1',
  name: 'Yassine Elbekali',
  email: 'yacine@student.solvay.be',
  faculty: 'Solvay Brussels School',
  year: 'Première année Ingénieur de gestion',
  avatar: undefined,
  isKYCCompleted: true,
  preferences: {
    notifications: true,
    studyReminders: true,
    theme: 'light',
    language: 'fr',
  },
  wallet: {
    id: 'wallet-1',
    userId: '1',
    balance: 150.00, // Solde initial selon les spécifications
    totalDeposited: 150.00, // Solde de bienvenue
    totalSpent: 0.00, // Aucune dépense initiale
    createdAt: new Date('2024-09-01'),
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hier
    transactions: [
      {
        id: 'tx-1',
        walletId: 'wallet-1',
        type: 'deposit',
        amount: 1000.00,
        description: 'Rechargement portefeuille',
        createdAt: new Date('2024-09-01'),
        metadata: {
          paymentMethod: 'card',
          stripePaymentId: 'pi_example_1'
        }
      },
      {
        id: 'tx-2',
        walletId: 'wallet-1',
        type: 'bonus',
        amount: 200.00,
        description: 'Bonus de rechargement (20%)',
        createdAt: new Date('2024-09-01'),
        metadata: {
          bonusPercentage: 20,
          originalAmount: 1000.00
        }
      },
      {
        id: 'tx-3',
        walletId: 'wallet-1',
        type: 'deposit',
        amount: 250.00,
        description: 'Rechargement portefeuille',
        createdAt: new Date('2024-09-15'),
        metadata: {
          paymentMethod: 'card',
          stripePaymentId: 'pi_example_2'
        }
      },
      {
        id: 'tx-4',
        walletId: 'wallet-1',
        type: 'bonus',
        amount: 50.00,
        description: 'Bonus de rechargement (20%)',
        createdAt: new Date('2024-09-15'),
        metadata: {
          bonusPercentage: 20,
          originalAmount: 250.00
        }
      },
      {
        id: 'tx-5',
        walletId: 'wallet-1',
        type: 'purchase',
        amount: -180.00,
        description: 'Achat du cours "Suites et Limites"',
        relatedItemType: 'course',
        relatedItemId: 'course-suites',
        createdAt: new Date('2024-09-20'),
      }
    ]
  }
};

  // ========================================================================
// LEÇONS INDIVIDUELLES (Nouvelles unités de base)
  // ========================================================================

export const mockLessons = [
  // Leçons du cours "Loi de Gauss" (Physique)
  {
    id: 'lesson-gauss-1',
    courseId: 'course-gauss',
    title: 'Calcul du champ électrique d\'un plan infini',
    description: 'Application de la loi de Gauss pour déterminer le champ électrique d\'un plan chargé uniformément',
    duration: 45,
    price: 70, // Prix individuel d'une leçon
    isOwned: false,
    progress: 0,
    order: 1,
    difficulty: 'intermediate' as const,
    hasPreview: true,
    previewAvailable: true,
    tags: ['électrostatique', 'gauss', 'champ électrique']
  },
  {
    id: 'lesson-gauss-2',
    courseId: 'course-gauss',
    title: 'Calcul du champ électrique d\'une sphère',
    description: 'Détermination du champ électrique d\'une sphère chargée par la méthode de Gauss',
    duration: 50,
    price: 70,
    isOwned: false,
    progress: 0,
    order: 2,
    difficulty: 'intermediate' as const,
    hasPreview: true,
    previewAvailable: true,
    tags: ['électrostatique', 'gauss', 'sphère']
  },
  {
    id: 'lesson-gauss-3',
    courseId: 'course-gauss',
    title: 'Flux électrique et surface de Gauss',
    description: 'Compréhension du concept de flux et choix optimal de la surface de Gauss',
    duration: 40,
    price: 70,
    isOwned: false,
    progress: 0,
    order: 3,
    difficulty: 'intermediate' as const,
    hasPreview: true,
    previewAvailable: true,
    tags: ['électrostatique', 'flux', 'surface']
  },
  {
    id: 'lesson-gauss-4',
    courseId: 'course-gauss',
    title: 'Applications de la loi de Gauss',
    description: 'Exercices complexes et cas pratiques d\'application de la loi de Gauss',
    duration: 60,
    price: 70,
    isOwned: false,
    progress: 0,
    order: 4,
    difficulty: 'advanced' as const,
    hasPreview: true,
    previewAvailable: true,
    tags: ['électrostatique', 'exercices', 'applications']
  },
  
  // Leçons du cours "Suites et Limites" (Mathématiques)
  {
    id: 'lesson-suites-1',
    courseId: 'course-suites',
    title: 'Introduction aux suites numériques',
    description: 'Définition, notation et premiers exemples de suites mathématiques',
    duration: 35,
    price: 70,
    isOwned: true,
    progress: 100,
    order: 1,
    difficulty: 'beginner' as const,
    hasPreview: false,
    previewAvailable: false,
    tags: ['mathématiques', 'suites', 'analyse']
  },
  {
    id: 'lesson-suites-2',
    courseId: 'course-suites',
    title: 'Convergence et divergence',
    description: 'Critères de convergence et étude du comportement asymptotique',
    duration: 50,
    price: 70,
    isOwned: true,
    progress: 75,
    order: 2,
    difficulty: 'intermediate' as const,
    hasPreview: false,
    previewAvailable: false,
    tags: ['mathématiques', 'convergence', 'limites']
  },
  {
    id: 'lesson-suites-3',
    courseId: 'course-suites',
    title: 'Calcul de limites',
    description: 'Techniques et méthodes pour calculer les limites de suites',
    duration: 45,
    price: 70,
    isOwned: false,
    progress: 0,
    order: 3,
    difficulty: 'intermediate' as const,
    hasPreview: true,
    previewAvailable: true,
    tags: ['mathématiques', 'calcul', 'limites']
  }
];

  // ========================================================================
// CONTENU HORS FACULTÉ (EXTERNE)
  // ========================================================================

export const externalCourses = [
  // Médecine - Université Libre de Bruxelles
  {
    id: 'external-anatomie-ulb',
    title: 'Anatomie Humaine Fondamentale',
    description: 'Cours complet d\'anatomie humaine adapté aux étudiants en médecine. Systèmes cardiovasculaire, respiratoire et nerveux.',
    faculty: 'Université Libre de Bruxelles',
    year: 'Première année',
    totalLessons: 12,
    completedLessons: 0,
    duration: '8h 30m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    previewAvailable: false, // Pas d'aperçu pour contenu externe
    tags: ['médecine', 'anatomie', 'système'],
    difficulty: 'intermediate' as const,
    price: 450,
    catalogInfo: {
      type: 'external' as const,
      source: 'ULB - Faculté de Médecine',
      category: 'Hors programme',
      whatsappNumber: '+32123456789',
      whatsappMessage: 'Bonjour ! Je suis intéressé(e) par le cours "Anatomie Humaine Fondamentale" de l\'ULB. Pouvez-vous me donner plus d\'informations ?'
    }
  },
  
  // Droit - UCLouvain
  {
    id: 'external-droit-civil-ucl',
    title: 'Droit Civil - Introduction',
    description: 'Bases du droit civil belge : personnes, biens, obligations et contrats. Formation juridique essentielle.',
    faculty: 'UCLouvain',
    year: 'Première année',
    totalLessons: 8,
    completedLessons: 0,
    duration: '6h 15m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    previewAvailable: false,
    tags: ['droit', 'civil', 'juridique'],
    difficulty: 'intermediate' as const,
    price: 380,
    catalogInfo: {
      type: 'external' as const,
      source: 'UCLouvain - Faculté de Droit',
      category: 'Hors programme',
      whatsappNumber: '+32123456789',
      whatsappMessage: 'Salut ! Le cours de "Droit Civil - Introduction" d\'UCLouvain m\'intéresse. Comment puis-je m\'inscrire ?'
    }
  },

  // Économie - HEC Liège
  {
    id: 'external-micro-economie-hec',
    title: 'Microéconomie Avancée',
    description: 'Théorie microéconomique : comportement du consommateur, théorie de la firme, marchés et équilibres.',
    faculty: 'HEC Liège',
    year: 'Deuxième année',
    totalLessons: 10,
    completedLessons: 0,
    duration: '7h 45m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    previewAvailable: false,
    tags: ['économie', 'microéconomie', 'théorie'],
    difficulty: 'advanced' as const,
    price: 520,
    catalogInfo: {
      type: 'external' as const,
      source: 'HEC Liège - École de Gestion',
      category: 'Hors programme',
      whatsappNumber: '+32123456789',
      whatsappMessage: 'Bonjour ! Je souhaiterais obtenir des informations sur le cours "Microéconomie Avancée" d\'HEC Liège.'
    }
  },

  // Informatique - Polytech Mons
  {
    id: 'external-algo-polytech',
    title: 'Algorithmes et Structures de Données',
    description: 'Conception d\'algorithmes efficaces, structures de données avancées, complexité algorithmique.',
    faculty: 'Polytech Mons',
    year: 'Deuxième année',
    totalLessons: 15,
    completedLessons: 0,
    duration: '12h 00m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    previewAvailable: false,
    tags: ['informatique', 'algorithmes', 'programmation'],
    difficulty: 'advanced' as const,
    price: 680,
    catalogInfo: {
      type: 'external' as const,
      source: 'Polytech Mons - Faculté d\'Ingénierie',
      category: 'Hors programme',
      whatsappNumber: '+32123456789',
      whatsappMessage: 'Hello ! Je m\'intéresse au cours "Algorithmes et Structures de Données" de Polytech Mons. Pouvez-vous m\'en dire plus ?'
    }
  }
];

export const externalLessons = [
  // Leçons pour Anatomie
  {
    id: 'external-lesson-anatomie-1',
    courseId: 'external-anatomie-ulb',
    title: 'Système Cardiovasculaire',
    description: 'Anatomie du cœur et des vaisseaux sanguins',
    duration: 90,
    price: 50,
    isOwned: false,
    progress: 0,
    order: 1,
    difficulty: 'intermediate' as const,
    hasPreview: false, // Pas d'aperçu pour contenu externe
    previewAvailable: false,
    tags: ['cardiovasculaire', 'cœur', 'circulation'],
    catalogInfo: {
      type: 'external' as const,
      source: 'ULB - Faculté de Médecine',
      category: 'Hors programme',
      whatsappNumber: '+32123456789',
      whatsappMessage: 'Bonjour ! Je voudrais plus d\'infos sur la leçon "Système Cardiovasculaire" du cours d\'anatomie ULB.'
    }
  },
  
  // Leçons pour Droit Civil
  {
    id: 'external-lesson-droit-1',
    courseId: 'external-droit-civil-ucl',
    title: 'Les Personnes Physiques',
    description: 'Statut juridique des personnes physiques en droit belge',
    duration: 75,
    price: 45,
    isOwned: false,
    progress: 0,
    order: 1,
    difficulty: 'intermediate' as const,
    hasPreview: false,
    previewAvailable: false,
    tags: ['personnes', 'statut', 'juridique'],
    catalogInfo: {
      type: 'external' as const,
      source: 'UCLouvain - Faculté de Droit',
      category: 'Hors programme',
      whatsappNumber: '+32123456789',
      whatsappMessage: 'Salut ! La leçon "Les Personnes Physiques" d\'UCLouvain m\'intéresse. Comment ça marche ?'
    }
  }
];

// ========================================================================
// COURS (Nouveaux groupes de leçons)
// ========================================================================

export const mockCourses: Course[] = [
  // ========================================================================
  // COURS FAVORIS (PRIMAIRES) - Ceux que l'étudiant possède
  // ========================================================================
  {
    id: 'course-suites',
    title: 'Suites et Limites',
    description: 'Maîtrise complète des suites numériques et du calcul de limites. Base essentielle pour l\'analyse mathématique.',
    faculty: 'Solvay Brussels School',
    year: 'Première année',
    totalLessons: 3,
    completedLessons: 2,
    duration: '2h 10m',
    isOwned: true,
    isPrimary: true, // ⭐ FAVORI
    progress: 67, // 2/3 ≈ 67%
    thumbnail: undefined,
    lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Il y a 1 jour
    examDate: new Date('2024-01-08'),
    previewAvailable: false, // Déjà acheté
    tags: ['mathématiques', 'suites', 'limites'],
    difficulty: 'intermediate',
    price: 180, // Prix du cours complet (vs 210 pour leçons individuelles)
    packId: 'pack-math-q1'
  },
  {
    id: 'course-gauss',
    title: 'Loi de Gauss',
    description: 'Maîtrise complète de la loi de Gauss et ses applications en électrostatique. Calculs de champs électriques pour différentes géométries.',
    faculty: 'Solvay Brussels School',
    year: 'Première année',
    totalLessons: 4,
    completedLessons: 0,
    duration: '3h 15m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    lastAccessed: undefined,
    examDate: new Date('2024-01-15'),
    previewAvailable: true,
    tags: ['physique', 'électrostatique', 'gauss'],
    difficulty: 'intermediate',
    price: 240, // Prix du cours complet (vs 280 pour leçons individuelles)
    packId: 'pack-physique-q1'
  },

  // ========================================================================
  // COURS SUGGÉRÉS - Disponibles dans le catalogue
  // ========================================================================
  {
    id: 'course-equilibres',
    title: 'Équilibres Chimiques',
    description: 'Étude complète des équilibres chimiques : calculs, déplacements d\'équilibre, applications industrielles.',
    faculty: 'Solvay Brussels School',
    year: 'Première année',
    totalLessons: 5,
    completedLessons: 0,
    duration: '4h 30m',
    isOwned: false,
    isPrimary: false, // Suggestion
    progress: 0,
    examDate: new Date('2024-01-22'),
    price: 320, // Prix du cours complet
    previewAvailable: true,
    previewDuration: '5-10 min',
    tags: ['chimie', 'équilibres', 'thermodynamique'],
    difficulty: 'intermediate',
    packId: 'pack-electromagnetisme'
  },
  {
    id: 'course-einstein-relativity',
    title: 'Théorie de la Relativité',
    description: 'Découvrez les concepts révolutionnaires d\'Einstein sur l\'espace-temps et la gravitation.',
    faculty: 'Physique',
    year: 'Deuxième année',
    totalLessons: 6,
    completedLessons: 0,
    duration: '4h 30m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    examDate: new Date('2024-02-15'),
    price: 350,
    previewAvailable: true,
    previewDuration: '8-12 min',
    tags: ['physique', 'relativité', 'einstein'],
    difficulty: 'advanced',
    packId: 'pack-physics-advanced'
  },
  {
    id: 'course-fisher-statistics',
    title: 'Tests Statistiques de Fisher',
    description: 'Maîtrisez les tests d\'hypothèses et l\'analyse de variance avec les méthodes de Fisher.',
    faculty: 'Statistiques',
    year: 'Première année',
    totalLessons: 5,
    completedLessons: 0,
    duration: '3h 45m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    examDate: new Date('2024-01-25'),
    price: 300,
    previewAvailable: true,
    previewDuration: '6-10 min',
    tags: ['statistiques', 'fisher', 'tests'],
    difficulty: 'intermediate',
    packId: 'pack-statistics'
  },
  {
    id: 'course-curie-radioactivity',
    title: 'Radioactivité et Éléments',
    description: 'Explorez les découvertes de Marie Curie sur la radioactivité et les éléments chimiques.',
    faculty: 'Chimie',
    year: 'Deuxième année',
    totalLessons: 4,
    completedLessons: 0,
    duration: '3h 10m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    examDate: new Date('2024-02-10'),
    price: 320,
    previewAvailable: true,
    previewDuration: '7-11 min',
    tags: ['chimie', 'radioactivité', 'curie'],
    difficulty: 'advanced',
    packId: 'pack-chemistry-advanced'
  },
  {
    id: 'course-franklin-dna',
    title: 'Structure de l\'ADN',
    description: 'Découvrez les travaux révolutionnaires de Rosalind Franklin sur la structure de l\'ADN et la cristallographie.',
    faculty: 'Biologie',
    year: 'Deuxième année',
    totalLessons: 5,
    completedLessons: 0,
    duration: '4h 15m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    examDate: new Date('2024-02-20'),
    price: 340,
    previewAvailable: true,
    previewDuration: '9-13 min',
    tags: ['biologie', 'adn', 'franklin', 'génétique'],
    difficulty: 'advanced',
    packId: 'pack-biology-advanced'
  },
  {
    id: 'course-integrales',
    title: 'Intégrales et Applications',
    description: 'Techniques d\'intégration, intégrales définies et applications géométriques et physiques.',
    faculty: 'Solvay Brussels School',
    year: 'Première année',
    totalLessons: 6,
    completedLessons: 0,
    duration: '5h 20m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    price: 380,
    previewAvailable: true,
    previewDuration: '7 min',
    tags: ['mathématiques', 'intégrales', 'calcul'],
    difficulty: 'intermediate',
    packId: 'pack-math-q1'
  },
  {
    id: 'course-forces',
    title: 'Forces et Mouvement',
    description: 'Étude complète de la mécanique : forces, accélération, travail et énergie.',
    faculty: 'Solvay Brussels School',
    year: 'Première année',
    totalLessons: 4,
    completedLessons: 0,
    duration: '3h 10m',
    isOwned: false,
    isPrimary: false,
    progress: 0,
    price: 280,
    previewAvailable: true,
    previewDuration: '6 min',
    tags: ['physique', 'mécanique', 'forces'],
    difficulty: 'intermediate',
    packId: 'pack-physique-q1'
  }
];

// ========================================================================
// PACKS (Nouveaux bundles de cours)
// ========================================================================

export const mockPacks = [
  {
    id: 'pack-physique-q1',
    title: 'Physique Q1',
    description: 'Maîtrise complète de la physique du premier quadrimestre : électrostatique et mécanique.',
    courses: ['course-gauss', 'course-forces'], // IDs des cours inclus
    totalPrice: 520, // Prix individuel total des cours
    packPrice: 420,
    totalLessons: 8, // 4 + 4 leçons
    difficulty: 'intermediate',
    duration: '6h 25m',
    icon: '',
    color: 'from-blue-500 to-purple-600',
    features: [
      'Loi de Gauss complète',
      'Forces et mouvement',
      'Accès Study Rooms',
      'Support WhatsApp illimité',
      'Garantie étudiante'
    ],
    isPopular: true
  },
  {
    id: 'pack-math-q1',
    title: 'Mathématiques Q1',
    description: 'Fondations solides en analyse mathématique : suites, limites et intégrales.',
    courses: ['course-suites', 'course-integrales'],
    totalPrice: 560, // 180 + 380
    packPrice: 450,
    totalLessons: 9, // 3 + 6 leçons
    difficulty: 'intermediate',
    duration: '7h 30m',
    icon: '',
    color: 'from-purple-500 to-pink-600',
    features: [
      'Suites et convergence',
      'Techniques d\'intégration',
      'Applications pratiques',
      'Exercices corrigés',
      'Planification intelligente'
    ],
    isPopular: true
  },
  {
    id: 'pack-chimie-q1',
    title: 'Chimie Q1',
    description: 'Bases essentielles de la chimie générale et des équilibres chimiques.',
    courses: ['course-equilibres'],
    totalPrice: 320,
    packPrice: 280,
    totalLessons: 5,
    difficulty: 'intermediate',
    duration: '4h 30m',
    icon: '',
    color: 'from-green-500 to-teal-600',
    features: [
      'Équilibres chimiques',
      'Calculs thermodynamiques',
      'Applications industrielles',
      'Quiz interactifs'
    ],
    isPopular: false
  },
  {
    id: 'pack-excellence',
    title: 'Excellence Sciences',
    description: 'Le pack complet pour exceller en sciences fondamentales au Q1.',
    courses: ['course-suites', 'course-integrales', 'course-gauss', 'course-forces', 'course-equilibres'],
    totalPrice: 1400, // Somme de tous les cours
    packPrice: 999,
    totalLessons: 22, // Total de toutes les leçons
    difficulty: 'advanced',
    duration: '21h 15m',
    icon: '',
    color: 'from-yellow-500 to-orange-600',
    features: [
      'Tous les cours Q1',
      'Coaching personnalisé',
      'Study Rooms premium',
      'Suivi de progression avancé',
      'Garantie de réussite',
      'Accès prioritaire nouveautés'
    ],
    isPopular: true,
    isPremium: true
  }
];

export const mockProgress: StudentProgress[] = [
  {
    userId: '1',
    courseId: 'course-suites', // Suites et Limites
    currentLesson: 2,
    totalLessons: 3,
    percentComplete: 67,
    facultyAverage: 45, // L'étudiant est au-dessus de la moyenne
    facultyRanking: 8,
    totalStudents: 124,
    timeSpent: 85, // minutes
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    streakDays: 3,
    totalPoints: 185,
  },
];

export const mockSuggestions: CourseSuggestion[] = [
  {
    course: mockCourses.find(c => c.id === 'course-gauss')!, // Loi de Gauss
    reason: 'faculty_popular',
    enrolledStudents: 87,
    averageProgress: 45,
    isPopular: true,
    hasFreeTrial: true,
    priority: 1,
  },
  {
    course: mockCourses.find(c => c.id === 'course-equilibres')!, // Équilibres Chimiques
    reason: 'similar_students',
    enrolledStudents: 72,
    averageProgress: 62,
    isPopular: true,
    hasFreeTrial: true,
    priority: 2,
  },
  {
    course: mockCourses.find(c => c.id === 'course-integrales')!, // Intégrales
    reason: 'prerequisite',
    enrolledStudents: 56,
    averageProgress: 38,
    isPopular: false,
    hasFreeTrial: true,
    priority: 3,
  },
  {
    course: mockCourses.find(c => c.id === 'course-forces')!, // Forces et Mouvement
    reason: 'continuation',
    enrolledStudents: 34,
    averageProgress: 29,
    isPopular: false,
    hasFreeTrial: true,
    priority: 4,
  },
  {
    course: mockCourses.find(c => c.id === 'course-einstein-relativity')!, // Théorie de la Relativité
    reason: 'faculty_popular',
    enrolledStudents: 65,
    averageProgress: 52,
    isPopular: true,
    hasFreeTrial: true,
    priority: 5,
  },
  {
    course: mockCourses.find(c => c.id === 'course-fisher-statistics')!, // Tests Statistiques de Fisher
    reason: 'similar_students',
    enrolledStudents: 38,
    averageProgress: 41,
    isPopular: false,
    hasFreeTrial: true,
    priority: 6,
  },
  {
    course: mockCourses.find(c => c.id === 'course-curie-radioactivity')!, // Radioactivité et Éléments
    reason: 'similar_students',
    enrolledStudents: 29,
    averageProgress: 35,
    isPopular: false,
    hasFreeTrial: true,
    priority: 7,
  },
  {
    course: mockCourses.find(c => c.id === 'course-franklin-dna')!, // Structure de l'ADN
    reason: 'faculty_popular',
    enrolledStudents: 42,
    averageProgress: 48,
    isPopular: true,
    hasFreeTrial: true,
    priority: 8,
  },
  // Ajoutons plus de cours pour enrichir le catalogue
  {
    course: {
      id: 'course-math-analyse-1',
      title: 'Analyse Mathématique I',
      description: 'Bases de l\'analyse : dérivées, limites et continuité',
      faculty: 'Solvay Brussels School',
      year: 'Première année',
      totalLessons: 18,
      completedLessons: 0,
      duration: '6h 30m',
      isOwned: false,
      isPrimary: false,
      progress: 0,
      price: 700,
      previewAvailable: true,
      tags: ['mathématiques', 'analyse', 'dérivées'],
      difficulty: 'intermediate' as const,
    },
    reason: 'faculty_popular',
    enrolledStudents: 124,
    averageProgress: 52,
    isPopular: true,
    hasFreeTrial: true,
    priority: 5,
  },
  {
    course: {
      id: 'course-physique-mecanique',
      title: 'Mécanique Classique',
      description: 'Principes de la mécanique newtonienne et applications',
      faculty: 'Solvay Brussels School',
      year: 'Première année',
      totalLessons: 22,
      completedLessons: 0,
      duration: '8h 15m',
      isOwned: false,
      isPrimary: false,
      progress: 0,
      price: 700,
      previewAvailable: true,
      tags: ['physique', 'mécanique', 'newton'],
      difficulty: 'intermediate' as const,
    },
    reason: 'similar_students',
    enrolledStudents: 98,
    averageProgress: 38,
    isPopular: true,
    hasFreeTrial: true,
    priority: 6,
  },
  {
    course: {
      id: 'course-chimie-generale',
      title: 'Chimie Générale',
      description: 'Concepts fondamentaux de la chimie moderne',
      faculty: 'Solvay Brussels School',
      year: 'Première année',
      totalLessons: 16,
      completedLessons: 0,
      duration: '5h 45m',
      isOwned: false,
      isPrimary: false,
      progress: 0,
      price: 700,
      previewAvailable: true,
      tags: ['chimie', 'atomes', 'liaisons'],
      difficulty: 'beginner' as const,
    },
    reason: 'prerequisite',
    enrolledStudents: 89,
    averageProgress: 44,
    isPopular: false,
    hasFreeTrial: true,
    priority: 7,
  },
  {
    course: {
      id: 'course-statistiques',
      title: 'Statistiques et Probabilités',
      description: 'Introduction aux méthodes statistiques et probabilistiques',
      faculty: 'Solvay Brussels School',
      year: 'Première année',
      totalLessons: 14,
      completedLessons: 0,
      duration: '4h 20m',
      isOwned: false,
      isPrimary: false,
      progress: 0,
      price: 700,
      previewAvailable: true,
      tags: ['statistiques', 'probabilités', 'données'],
      difficulty: 'intermediate' as const,
    },
    reason: 'continuation',
    enrolledStudents: 67,
    averageProgress: 31,
    isPopular: true,
    hasFreeTrial: true,
    priority: 8,
  },
];

export const mockFacultyStats: FacultyStats = {
  faculty: 'Solvay Brussels School',
  year: 'Première année Ingénieur de gestion',
  totalStudents: 124,
  averageProgress: 35,
  topPerformers: ['user_123', 'user_456', 'user_789'], // IDs anonymes
};

// ========================================================================
// DONNÉES DASHBOARD COMPLÈTES
// ========================================================================
export const mockDashboardData: DashboardData = {
  user: mockUser,
  primaryCourses: mockCourses.filter(course => course.isPrimary),
  suggestedCourses: mockSuggestions,
  progress: mockProgress,
  facultyStats: mockFacultyStats,
  recentActivity: [
    {
      id: '1',
      type: 'lesson_completed',
      title: 'Leçon 2 terminée',
      description: 'Convergence et divergence - Suites et Limites',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      courseId: 'course-suites',
      lessonId: 'lesson-suites-2',
    },
    {
      id: '2',
      type: 'course_started',
      title: 'Cours démarré',
      description: 'Suites et Limites',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      courseId: 'course-suites',
    },
  ],
  achievements: [
    {
      id: '1',
      title: 'Premier cours',
      description: 'Vous avez démarré votre premier cours !',
      icon: '🎯',
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      progress: 100,
      target: 1,
    },
    {
      id: '2',
      title: 'Étudiant assidu',
      description: 'Étudiez 3 jours consécutifs',
      icon: '🔥',
      progress: 75,
      target: 3,
    },
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'Session de rattrapage Intégrales',
      start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
      end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2h plus tard
      type: 'study_session',
      courseId: 'course-integrales',
      priority: 'high',
    },
  ],
};

// ========================================================================
// FONCTIONS UTILITAIRES POUR LA DÉMO
// ========================================================================

/**
 * Récupère une leçon par son ID
 */
export function getLessonById(lessonId: string) {
  return mockLessons.find(lesson => lesson.id === lessonId);
}

/**
 * Récupère toutes les leçons d'un cours
 */
export function getLessonsByCourseId(courseId: string) {
  return mockLessons.filter(lesson => lesson.courseId === courseId);
}

/**
 * Récupère un cours par son ID
 */
export function getCourseById(courseId: string) {
  return mockCourses.find(course => course.id === courseId);
}

/**
 * Récupère un pack par son ID
 */
export function getPackById(packId: string) {
  return mockPacks.find(pack => pack.id === packId);
}

/**
 * Récupère tous les cours d'un pack
 */
export function getCoursesByPackId(packId: string) {
  const pack = getPackById(packId);
  if (!pack) return [];
  
  return pack.courses.map(courseId => getCourseById(courseId)).filter(Boolean);
}

/**
 * Génère les options d'upsell pour une leçon donnée
 */
export function generateUpsellOptions(lessonId: string, courseId?: string): PurchaseOption[] {
  console.log('🔧 generateUpsellOptions called with lessonId:', lessonId, 'courseId:', courseId);
  
  // Déterminer le contenu spécifique selon le cours
  let lessonTitle = 'Les fondamentaux essentiels';
  let courseTitle = 'Cours Complet';
  let targetCourseId = courseId || 'course-gauss'; // Utiliser le courseId passé ou défaut
  let packTitle = 'Électrostatique';
  let packId = 'pack-electromagnetisme';
  let packDescription = 'Formation complète en électrostatique';
  let courseFeatures = ['Toutes les leçons du cours', 'Accès aux Study Rooms', 'Garantie de réussite', 'Support prioritaire'];
  let packFeatures = ['Tous les cours d\'électrostatique', 'Study Rooms premium', 'Coaching personnalisé', 'Planificateur inclus'];
  
  // 🎯 SPÉCIALISATION PAR COURS (utilise courseId au lieu de lessonId)
  if (targetCourseId === 'course-equilibres') {
    // Équilibres Chimiques
    lessonTitle = 'Équilibres Chimiques : fondamentaux essentiels';
    courseTitle = 'Cours "Équilibres Chimiques"';
    packTitle = 'Électrostatique';
    packId = 'pack-electromagnetisme';
    packDescription = 'Formation complète en électrostatique et chimie';
    courseFeatures = [
      'Toutes les leçons d\'Équilibres Chimiques',
      'Calculs d\'équilibres avancés',
      'Applications industrielles',
      'Accès aux Study Rooms'
    ];
    packFeatures = [
      'Équilibres Chimiques + Loi de Gauss + Forces',
      'Approche multidisciplinaire',
      'Study Rooms premium',
      'Planificateur automatique'
    ];
  } else if (targetCourseId.includes('math') || targetCourseId.includes('analyse')) {
    lessonTitle = 'Analyse Mathématique I : fondamentaux essentiels';
    courseTitle = 'Cours "Analyse Mathématique I"';
    targetCourseId = 'course-math-analyse-1';
    packTitle = 'Pack Mathématiques Avancées';
    packId = 'pack-mathematiques';
    packDescription = 'Pack complet pour exceller en mathématiques universitaires';
    courseFeatures = [
      'Toutes les leçons d\'Analyse Mathématique I',
      'Méthodes de calcul avancées',
      'Exercices d\'application',
      'Accès aux Study Rooms'
    ];
    packFeatures = [
      'Analyse I & Intégrales',
      'Méthodes avancées incluses',
      'Coaching personnalisé',
      'Planificateur stratégique',
      'Garantie satisfaction 100%'
    ];
  }
  // Spécialisation pour la Loi de Gauss (le cas principal demandé)
  else if (lessonId.includes('gauss') || lessonId.includes('electrostatique')) {
    lessonTitle = 'Loi de Gauss : calcul de champ pour points, fils, plaques et sphères';
    courseTitle = 'Cours "Loi de Gauss"';
    packTitle = 'Électrostatique';
    packDescription = 'Formation complète : de la loi de Coulomb aux applications avancées';
    courseFeatures = [
      'Toutes les leçons du cours Loi de Gauss',
      'Calculs pour toutes géométries',
      'Exercices d\'application',
      'Accès aux Study Rooms'
    ];
    packFeatures = [
      'Loi de Gauss + Potentiel + Dipôles',
      'Préparation examens complète',
      'Study Rooms premium',
      'Planificateur automatique'
    ];
  }
  
  const options: PurchaseOption[] = [
    // Option 3: Leçon seule
    {
      type: 'lesson',
      itemId: lessonId,
      title: 'Leçon seule : Les fondamentaux essentiels',
      description: 'Accès basique à cette leçon uniquement',
      price: 70,
      features: [
        'Vidéos FullHD',
        'Quiz d\'auto-évaluation'
      ],
      badge: 'Accès basique'
    },
    // Option 2: Cours complet
    {
      type: 'course',
      itemId: targetCourseId,
      title: courseTitle,
      description: 'Parcours pédagogique structuré et complet',
      price: 700,
      features: courseFeatures.concat([
        'Vidéos FullHD',
        'Quiz d\'auto-évaluation',
        'Accès au groupe WhatsApp du cours',
        'Garantie de réussite',
        'Support prioritaire',
        'Planificateur inclus'
      ]),
      badge: null
    },
    // Option 1: Pack complet (meilleur investissement)
    {
      type: 'pack',
      itemId: packId,
      title: packTitle,
      description: packDescription,
      price: 1200,
      features: packFeatures.concat([
        'Vidéos FullHD',
        'Quiz d\'auto-évaluation',
        'Slides PDF disponibles pour tous les cours du pack',
        'Accès aux Study Rooms premium',
        'Accès à tous les groupes WhatsApp',
        'Garantie de réussite (globale)',
        'Support prioritaire',
        'Planificateur inclus'
      ]),
      badge: 'Pack Premium',
      walletHint: 'Astuce : Recharge ton portefeuille et profite d\'un bonus offert (quantité limitée).'
    }
  ];

  console.log('🔧 Generated upsell options:', options);
  return options;
}

/**
 * Simule l'achat d'un item
 */
export function simulatePurchase(
  walletBalance: number,
  itemType: 'lesson' | 'course' | 'pack',
  itemId: string,
  price: number
): { success: boolean; newBalance: number; transaction?: any } {
  if (walletBalance < price) {
    return { success: false, newBalance: walletBalance };
  }

  const newBalance = walletBalance - price;
  const transaction = {
    id: `tx-${Date.now()}`,
    walletId: 'wallet-1',
    type: 'purchase' as const,
    amount: -price,
    description: `Achat ${itemType}: ${itemId}`,
    relatedItemType: itemType,
    relatedItemId: itemId,
    createdAt: new Date()
  };

  return { success: true, newBalance, transaction };
}

// ========================================================================
// QUIZ POUR LES LEÇONS
// ========================================================================

export const mockQuizzes = {
  // Quiz pour les leçons IntegratedCourseViewer (IDs numériques)
  '1': [
    {
      id: 'q1',
      question: 'Quel est le concept fondamental étudié dans cette leçon ?',
      options: [
        'Les bases théoriques du sujet',
        'Les applications pratiques uniquement', 
        'Les calculs avancés',
        'L\'histoire de la discipline'
      ],
      correctAnswer: 0,
      explanation: 'Cette leçon couvre les fondamentaux essentiels qui servent de base à tous les concepts plus avancés.'
    },
    {
      id: 'q2',
      question: 'Quelle est l\'importance de maîtriser ces concepts de base ?',
      options: [
        'Facultatif pour la suite',
        'Essentiel pour les chapitres suivants',
        'Utile mais pas obligatoire',
        'Seulement pour l\'examen'
      ],
      correctAnswer: 1,
      explanation: 'La maîtrise des fondamentaux est cruciale car tous les concepts avancés s\'appuient sur ces bases.'
    },
    {
      id: 'q3',
      question: 'Comment appliquer ces concepts dans la pratique ?',
      options: [
        'Par mémorisation pure',
        'En comprenant la logique et en s\'entraînant',
        'En lisant seulement',
        'En écoutant des cours'
      ],
      correctAnswer: 1,
      explanation: 'La compréhension profonde et la pratique régulière sont essentielles pour maîtriser ces concepts.'
    }
  ],
  '2': [
    {
      id: 'q1',
      question: 'Quels sont les concepts intermédiaires abordés dans cette leçon ?',
      options: [
        'Des notions de base uniquement',
        'Des concepts qui s\'appuient sur les fondamentaux',
        'Des théories avancées',
        'Des applications exclusivement'
      ],
      correctAnswer: 1,
      explanation: 'Cette leçon développe des concepts intermédiaires qui utilisent les fondamentaux comme base.'
    },
    {
      id: 'q2',
      question: 'Comment ces concepts se connectent-ils aux leçons précédentes ?',
      options: [
        'Aucune connexion',
        'Connexion directe et logique',
        'Connexion facultative',
        'Connexion complexe'
      ],
      correctAnswer: 1,
      explanation: 'Il y a une progression logique entre les leçons, chaque concept s\'appuyant sur les précédents.'
    }
  ],
  '3': [
    {
      id: 'q1',
      question: 'Cette leçon traite de quels aspects ?',
      options: [
        'Révision des bases',
        'Approfondissement et spécialisation',
        'Introduction générale',
        'Conclusion du cours'
      ],
      correctAnswer: 1,
      explanation: 'Cette leçon approfondit les concepts et introduit des spécialisations importantes.'
    }
  ],
  '4': [
    {
      id: 'q1',
      question: 'Quel est l\'objectif de cette leçon de projet ?',
      options: [
        'Appliquer tous les concepts appris',
        'Réviser les bases',
        'Apprendre de nouveaux concepts',
        'Préparer l\'examen'
      ],
      correctAnswer: 0,
      explanation: 'Cette leçon vise à mettre en pratique tous les concepts appris précédemment dans un projet concret.'
    }
  ],
  '5': [
    {
      id: 'q1',
      question: 'Que valide l\'évaluation finale ?',
      options: [
        'Une partie du cours seulement',
        'La maîtrise complète du cours',
        'Les connaissances de base',
        'La participation'
      ],
      correctAnswer: 1,
      explanation: 'L\'évaluation finale valide votre maîtrise complète de tous les concepts du cours.'
    }
  ],
  'lesson-gauss-plan': [
    {
      id: 'q1',
      question: 'Quelle est la formule du théorème de Gauss pour un plan infini chargé ?',
      options: [
        'E = σ / (2ε₀)',
        'E = σ / ε₀', 
        'E = σ × ε₀',
        'E = 2σ / ε₀'
      ],
      correctAnswer: 0,
      explanation: 'Pour un plan infini chargé uniformément, le champ électrique est E = σ/(2ε₀), où σ est la densité surfacique de charge.'
    },
    {
      id: 'q2',
      question: 'Dans quelle direction pointe le champ électrique d\'un plan chargé positivement ?',
      options: [
        'Parallèle au plan',
        'Perpendiculaire au plan, vers l\'extérieur',
        'Perpendiculaire au plan, vers l\'intérieur',
        'Selon un angle de 45° par rapport au plan'
      ],
      correctAnswer: 1,
      explanation: 'Le champ électrique d\'un plan chargé positivement pointe perpendiculairement au plan, vers l\'extérieur (s\'éloignant du plan).'
    },
    {
      id: 'q3',
      question: 'Quelle surface de Gauss choisit-on pour un plan infini ?',
      options: [
        'Une sphère',
        'Un cube',
        'Un cylindre perpendiculaire au plan',
        'Un cône'
      ],
      correctAnswer: 2,
      explanation: 'On choisit un cylindre perpendiculaire au plan car sa symétrie correspond à celle du problème.'
    }
  ],
  'lesson-gauss-sphere': [
    {
      id: 'q1',
      question: 'Pour une sphère uniformément chargée, quelle est la forme du champ électrique à l\'extérieur ?',
      options: [
        'E = kQ/r',
        'E = kQ/r²',
        'E = kQ/r³',
        'E = constant'
      ],
      correctAnswer: 1,
      explanation: 'À l\'extérieur d\'une sphère chargée, le champ suit la loi de Coulomb : E = kQ/r².'
    },
    {
      id: 'q2',
      question: 'À l\'intérieur d\'une sphère creuse chargée, le champ électrique est :',
      options: [
        'Maximum au centre',
        'Nul partout',
        'Proportionnel à r',
        'Inversement proportionnel à r²'
      ],
      correctAnswer: 1,
      explanation: 'À l\'intérieur d\'une sphère creuse chargée, le champ électrique est nul partout (théorème de Gauss).'
    }
  ]
};

/**
 * Récupère les questions de quiz pour une leçon
 */
export function getQuizByLessonId(lessonId: string) {
  return mockQuizzes[lessonId] || [];
}

/**
 * Simule l'ajout/retrait d'un cours des favoris
 */
export function toggleCourseFavorite(courseId: string): Course[] {
  return mockCourses.map(course => {
    if (course.id === courseId) {
      return { ...course, isPrimary: !course.isPrimary };
    }
    return course;
  });
}

/**
 * Simule la réorganisation des cours favoris
 */
export function reorderPrimaryCourses(courseId: string, newIndex: number): Course[] {
  const primaryCourses = mockCourses.filter(course => course.isPrimary);
  const courseToMove = primaryCourses.find(course => course.id === courseId);
  
  if (!courseToMove) return primaryCourses;
  
  const filteredCourses = primaryCourses.filter(course => course.id !== courseId);
  filteredCourses.splice(newIndex, 0, courseToMove);
  
  return filteredCourses;
}

/**
 * Simule l'inscription à un cours
 */
export function enrollInCourse(courseId: string): Course | null {
  const course = mockCourses.find(c => c.id === courseId);
  if (!course) return null;
  
  return {
    ...course,
    isOwned: true,
    isPrimary: true, // Automatiquement ajouté aux favoris
    previewAvailable: false,
  };
}

// ========================================================================
// DONNÉES QUIZ VIDÉO & Q&A
// ========================================================================

export const mockVideoQuizzes: VideoQuizQuestion[] = [
  {
    id: 'vq1',
    timestamp: 120, // 2 minutes
    question: 'Que représente graphiquement la limite d\'une fonction en un point ?',
    type: 'multiple-choice',
    options: [
      'La valeur de la fonction en ce point',
      'La valeur vers laquelle tend la fonction quand x se rapproche du point',
      'La dérivée de la fonction en ce point',
      'L\'aire sous la courbe jusqu\'à ce point'
    ],
    correctAnswer: 1,
    explanation: 'La limite représente la valeur vers laquelle tend la fonction quand x se rapproche du point, même si la fonction n\'est pas définie en ce point.',
    points: 10
  },
  {
    id: 'vq2',
    timestamp: 300, // 5 minutes
    question: 'La règle de L\'Hôpital s\'applique-t-elle à toutes les limites ?',
    type: 'true-false',
    options: ['Vrai', 'Faux'],
    correctAnswer: 1,
    explanation: 'Faux ! La règle de L\'Hôpital ne s\'applique qu\'aux formes indéterminées comme 0/0 ou ∞/∞.',
    points: 15
  },
  {
    id: 'vq3',
    timestamp: 480, // 8 minutes
    question: 'Quelle est la première étape pour calculer une limite qui donne 0/0 ?',
    type: 'multiple-choice',
    options: [
      'Appliquer directement la règle de L\'Hôpital',
      'Essayer de factoriser et simplifier',
      'Conclure que la limite n\'existe pas',
      'Utiliser un développement limité'
    ],
    correctAnswer: 1,
    explanation: 'Il faut d\'abord essayer de factoriser et simplifier l\'expression avant d\'appliquer des méthodes plus avancées comme la règle de L\'Hôpital.',
    points: 20
  }
];

export const getMockVideoQuizzes = (lessonId: string): VideoQuizQuestion[] => {
  // En réalité, cela viendrait d'une base de données
  if (lessonId === '1' || lessonId === '2') {
    return mockVideoQuizzes;
  }
  return [];
};

// ========================================================================
// PACKS DE COURS THÉMATIQUES
// ========================================================================

export const mockCoursePacks: CoursePack[] = [
  {
    id: 'pack-electromagnetisme',
    title: 'Électrostatique',
    description: 'Maîtrisez l\'électrostatique et l\'électromagnétisme avec ce pack expert',
    courses: ['course-gauss', 'course-forces', 'course-equilibres'], // Loi de Gauss + Forces + Équilibres Chimiques
    creditCost: 1200, // Prix en euros
    originalCreditCost: 1400, // Prix séparé
    badge: 'Populaire',
    icon: '',
    color: 'from-blue-400 to-purple-500',
    features: [
      'Loi de Gauss complète',
      'Forces et champs électriques',
      'Équilibres chimiques',
      'Exercices pratiques inclus',
      'Support WhatsApp prioritaire',
      'Planificateur stratégique inclus'
    ]
  },
  {
    id: 'pack-mathematiques',
    title: 'Mathématiques Avancées',
    description: 'Pack complet pour exceller en mathématiques universitaires',
    courses: ['course-integrales', 'course-math-analyse-1'], // Intégrales + Analyse
    creditCost: 1200,
    originalCreditCost: 1400,
    badge: 'Valeur ajoutée',
    icon: '',
    color: 'from-green-400 to-blue-500',
    features: [
      'Analyse I & Intégrales',
      'Méthodes avancées incluses',
      'Coaching personnalisé',
      'Planificateur stratégique',
      'Garantie satisfaction 100%'
    ]
  },
  {
    id: 'pack-sciences',
    title: 'Sciences Expérimentales',
    description: 'Physique et chimie réunies pour une approche complète des sciences',
    courses: ['course-physique-mecanique', 'course-chimie-generale'], // Mécanique + Chimie
    creditCost: 1200,
    originalCreditCost: 1400,
    badge: 'Nouveau',
    icon: '',
    color: 'from-purple-400 to-pink-500',
    features: [
      'Mécanique classique',
      'Chimie générale complète',
      'Exercices types d\'examen',
      'Session de rattrapage incluse',
      'Accès mobile optimisé'
    ]
  },
  {
    id: 'pack-premium-all',
    title: 'Premium Excellence',
    description: 'L\'excellence académique avec un accompagnement VIP complet',
    courses: [
      'course-gauss', 
      'course-equilibres', 
      'course-integrales', 
      'course-forces',
      'course-math-analyse-1',
      'course-physique-mecanique'
    ], // Tous les cours principaux
    creditCost: 2500,
    originalCreditCost: 4200, // 6 cours × 700€
    badge: 'Pack Premium',
    icon: '',
    color: 'from-yellow-400 to-orange-500',
    features: [
      'Tous les cours inclus (6 matières)',
      'Coaching personnalisé hebdomadaire',
      'Accès anticipé aux nouveautés',
      'Support prioritaire 24/7',
      'Planificateur stratégique premium',
      'Révisions intensives pré-examens',
      'Study Rooms VIP',
      'Garantie satisfaction 100%'
    ]
  }
];

export const getCoursePacks = (): CoursePack[] => {
  return mockCoursePacks;
};

// ========================================================================
// LEÇONS INDIVIDUELLES POUR LA RECHERCHE
// ========================================================================

export const mockIndividualLessons = [
  // Mathématiques
  {
    id: 'lesson-math-1',
    courseId: '1',
    title: 'Introduction aux Limites',
    description: 'Comprendre le concept fondamental de limite en analyse mathématique',
    duration: '45 min',
    order: 1,
    isCompleted: false,
    isAccessible: true,
    hasPreview: true,
    documents: [],
    type: 'video' as const,
    xpReward: 15,
    difficulty: 'easy' as const,
    objectives: [
      'Définir une limite mathématique',
      'Calculer des limites simples',
      'Appliquer les théorèmes fondamentaux'
    ]
  },
  {
    id: 'lesson-math-2',
    courseId: '1',
    title: 'Dérivées : Définition et Calculs',
    description: 'Maîtriser la dérivation et ses applications pratiques',
    duration: '60 min',
    order: 2,
    isCompleted: false,
    isAccessible: true,
    hasPreview: true,
    documents: [],
    type: 'video' as const,
    xpReward: 20,
    difficulty: 'medium' as const,
    objectives: [
      'Comprendre la définition de la dérivée',
      'Utiliser les règles de dérivation',
      'Résoudre des problèmes d\'optimisation'
    ]
  },
  // Physique
  {
    id: 'lesson-physics-1',
    courseId: '2',
    title: 'Forces et Mouvement',
    description: 'Les lois de Newton et leurs applications en mécanique',
    duration: '50 min',
    order: 1,
    isCompleted: false,
    isAccessible: true,
    hasPreview: true,
    documents: [],
    type: 'video' as const,
    xpReward: 18,
    difficulty: 'medium' as const,
    objectives: [
      'Comprendre les trois lois de Newton',
      'Analyser des systèmes de forces',
      'Résoudre des problèmes de dynamique'
    ]
  },
  {
    id: 'lesson-physics-2',
    courseId: '2',
    title: 'Énergie et Travail',
    description: 'Conservation de l\'énergie et applications pratiques',
    duration: '55 min',
    order: 2,
    isCompleted: false,
    isAccessible: true,
    hasPreview: true,
    documents: [],
    type: 'video' as const,
    xpReward: 22,
    difficulty: 'hard' as const,
    objectives: [
      'Définir travail et énergie',
      'Appliquer le principe de conservation',
      'Résoudre des problèmes complexes'
    ]
  },
  // Chimie
  {
    id: 'lesson-chemistry-1',
    courseId: '3',
    title: 'Structure Atomique',
    description: 'Comprendre la structure de l\'atome et ses propriétés',
    duration: '40 min',
    order: 1,
    isCompleted: false,
    isAccessible: true,
    hasPreview: true,
    documents: [],
    type: 'video' as const,
    xpReward: 12,
    difficulty: 'easy' as const,
    objectives: [
      'Décrire la structure de l\'atome',
      'Comprendre les orbitales',
      'Prédire les propriétés des éléments'
    ]
  },
  {
    id: 'lesson-chemistry-2',
    courseId: '3',
    title: 'Liaisons Chimiques',
    description: 'Types de liaisons et propriétés des molécules',
    duration: '65 min',
    order: 2,
    isCompleted: false,
    isAccessible: true,
    hasPreview: true,
    documents: [],
    type: 'video' as const,
    xpReward: 25,
    difficulty: 'hard' as const,
    objectives: [
      'Identifier les types de liaisons',
      'Prédire la géométrie moléculaire',
      'Comprendre les propriétés des composés'
    ]
  },
  // Statistiques
  {
    id: 'lesson-stats-1',
    courseId: '4',
    title: 'Mesures de Tendance Centrale',
    description: 'Moyenne, médiane, mode : calculer et interpréter',
    duration: '35 min',
    order: 1,
    isCompleted: false,
    isAccessible: true,
    hasPreview: true,
    documents: [],
    type: 'video' as const,
    xpReward: 10,
    difficulty: 'easy' as const,
    objectives: [
      'Calculer moyenne, médiane, mode',
      'Choisir la mesure appropriée',
      'Interpréter les résultats'
    ]
  },
  // Microéconomie
  {
    id: 'lesson-micro-1',
    courseId: '5',
    title: 'Offre et Demande',
    description: 'Les mécanismes fondamentaux du marché',
    duration: '45 min',
    order: 1,
    isCompleted: false,
    isAccessible: true,
    hasPreview: true,
    documents: [],
    type: 'video' as const,
    xpReward: 16,
    difficulty: 'medium' as const,
    objectives: [
      'Comprendre l\'offre et la demande',
      'Analyser l\'équilibre du marché',
      'Prédire les effets des variations'
    ]
  }
];

export const getIndividualLessons = () => {
  return mockIndividualLessons;
};

// ========================================================================
// DONNÉES COMMUNAUTAIRES
// ========================================================================

export const mockStudentProfiles: StudentProfile[] = [
  {
    id: 'current-user',
    firstName: 'Yassine',
    faculty: 'Solvay Brussels School',
    avatar: '👨‍🎓',
    totalXP: 1250,
    level: 8,
    coursesCompleted: 3,
    socialBadges: [],
    joinDate: new Date('2024-09-01'),
    lastActive: new Date(),
    bio: 'Étudiant en économie passionné par les mathématiques appliquées',
    motto: 'Viser 16, pas la moyenne !',
    isOnline: true,
    studyStreak: 12
  },
  {
    id: 'marie-l',
    firstName: 'Marie',
    faculty: 'Solvay Brussels School',
    avatar: '👩‍🎓',
    totalXP: 2100,
    level: 12,
    coursesCompleted: 5,
    socialBadges: [],
    joinDate: new Date('2024-08-15'),
    lastActive: new Date(Date.now() - 300000), // 5 min ago
    bio: 'Future consultante, mentor en mathématiques',
    motto: 'Ensemble, on va plus loin',
    isOnline: true,
    studyStreak: 25
  },
  {
    id: 'lucas-m',
    firstName: 'Lucas',
    faculty: 'UCLouvain',
    avatar: '👨‍💻',
    totalXP: 1800,
    level: 10,
    coursesCompleted: 4,
    socialBadges: [],
    joinDate: new Date('2024-08-20'),
    lastActive: new Date(Date.now() - 1800000), // 30 min ago
    bio: 'Ingénieur en devenir, expert en physique',
    isOnline: false,
    studyStreak: 8
  },
  {
    id: 'sara-k',
    firstName: 'Sara',
    faculty: 'Solvay Brussels School',
    avatar: '👩‍🔬',
    totalXP: 1950,
    level: 11,
    coursesCompleted: 6,
    socialBadges: [],
    joinDate: new Date('2024-07-10'),
    lastActive: new Date(Date.now() - 3600000), // 1h ago
    bio: 'Passionnée de chimie et sciences',
    motto: 'La science, c\'est magique ✨',
    isOnline: false,
    studyStreak: 15
  }
];

// Study Rooms liées aux cours (nouvelles)
export const mockCourseStudyRooms: any[] = [
  {
    id: 'course-room-suites-1',
    name: 'Study Room - Suites et Limites',
    courseId: 'course-suites',
    courseName: 'Suites et Limites',
    circleId: 'math-analysis',
    createdBy: 'marie-l',
    currentUsers: [mockStudentProfiles[1], mockStudentProfiles[2]], // Marie + Alex
    maxUsers: 8,
    subject: 'Révisions chapitre Suites et Limites',
    requiresFullAccess: true,
    isScheduled: false,
    pomodoroTimer: {
      isActive: true,
      currentSession: 1,
      totalSessions: 3,
      sessionDuration: 45,
      breakDuration: 10,
      timeRemaining: 2700 // 45 minutes
    },
    settings: {
      cameraEnabled: true,
      micEnabled: true,
      chatEnabled: true,
      isPrivate: false
    },
    createdAt: new Date(Date.now() - 1800000) // 30 minutes ago
  },
  {
    id: 'course-room-gauss-1',
    name: 'Study Room - Loi de Gauss',
    courseId: 'course-gauss',
    courseName: 'Loi de Gauss',
    circleId: 'physics-electromagnetism',
    createdBy: 'lucas-m',
    currentUsers: [mockStudentProfiles[0]], // Yassine
    maxUsers: 6,
    subject: 'Exercices pratiques - Champ électrique',
    requiresFullAccess: true,
    isScheduled: true,
    scheduledStart: new Date(Date.now() + 1800000), // Dans 30 minutes
    scheduledEnd: new Date(Date.now() + 5400000), // Dans 1h30
    pomodoroTimer: {
      isActive: false,
      currentSession: 0,
      totalSessions: 0,
      sessionDuration: 25,
      breakDuration: 5,
      timeRemaining: 0
    },
    settings: {
      cameraEnabled: true,
      micEnabled: false,
      chatEnabled: true,
      isPrivate: false
    },
    createdAt: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: 'course-room-mechanics-1',
    name: 'Study Room - Mécanique Q1',
    courseId: 'course-mechanics',
    courseName: 'Mécanique Classique',
    circleId: 'physics-mechanics',
    createdBy: 'sara-k',
    currentUsers: [mockStudentProfiles[3], mockStudentProfiles[4]], // Sara + Tom
    maxUsers: 10,
    subject: 'Préparation examen - Dynamique',
    requiresFullAccess: false, // Accès libre pour ce cours
    isScheduled: false,
    pomodoroTimer: {
      isActive: true,
      currentSession: 2,
      totalSessions: 4,
      sessionDuration: 25,
      breakDuration: 5,
      timeRemaining: 900 // 15 minutes
    },
    settings: {
      cameraEnabled: false,
      micEnabled: false,
      chatEnabled: true,
      isPrivate: false
    },
    createdAt: new Date(Date.now() - 900000) // 15 minutes ago
  }
];

// Notifications Study Room mock
export const mockStudyRoomNotifications: any[] = [
  {
    id: 'notif-1',
    studyRoomId: 'course-room-suites-1',
    courseId: 'course-suites',
    courseName: 'Suites et Limites',
    type: 'room-opened',
    message: 'Une Study Room "Suites et Limites" vient de s\'ouvrir',
    timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    isRead: false,
    targetUserId: '1',
    metadata: {
      friendsPresent: 1,
      totalParticipants: 2,
      roomName: 'Study Room - Suites et Limites'
    }
  },
  {
    id: 'notif-2',
    studyRoomId: 'course-room-gauss-1',
    courseId: 'course-gauss',
    courseName: 'Loi de Gauss',
    type: 'friend-joined',
    message: 'Alex Martin a rejoint la Study Room "Loi de Gauss"',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    isRead: false,
    targetUserId: '1',
    metadata: {
      friendsPresent: 1,
      totalParticipants: 1,
      roomName: 'Study Room - Loi de Gauss'
    }
  }
];

export const mockSocialBadges: SocialBadge[] = [
  {
    id: 'helper',
    name: 'Helper',
    description: 'A aidé 5 autres étudiants',
    icon: '🤝',
    color: 'blue',
    rarity: 'common',
    criteria: {
      type: 'questions_answered',
      target: 5,
      current: 3
    }
  },
  {
    id: 'study-captain',
    name: 'Capitaine de révision',
    description: 'A créé 3 Study Rooms',
    icon: '⚓',
    color: 'purple',
    rarity: 'rare',
    criteria: {
      type: 'rooms_created',
      target: 3,
      current: 1
    }
  },
  {
    id: 'streak-master',
    name: 'Toujours là',
    description: 'Connecté 7 jours d\'affilée',
    icon: '🔥',
    color: 'orange',
    rarity: 'epic',
    criteria: {
      type: 'study_streak',
      target: 7,
      current: 12
    },
    unlockedAt: new Date('2024-12-10')
  },
  {
    id: 'community-legend',
    name: 'Légende communautaire',
    description: 'Membre exemplaire de la communauté',
    icon: '👑',
    color: 'gold',
    rarity: 'legendary',
    criteria: {
      type: 'community_helper',
      target: 50,
      current: 28
    }
  }
];

export const mockAlumniProfiles: AlumniProfile[] = [
  {
    id: 'thomas-l',
    firstName: 'Thomas',
    lastName: 'L.',
    avatar: '👨‍💻',
    currentPosition: 'Software Engineer',
    company: 'Google',
    university: 'UCLouvain',
    degree: 'Master en Sciences Informatiques',
    graduationYear: 2023,
    smsCoursesCompleted: ['Mathématiques', 'Physique', 'Algorithmique'],
    linkedinUrl: 'https://linkedin.com/in/thomas-l',
    email: 'thomas.l@google.com',
    testimonial: 'SMS m\'a donné les bases solides pour réussir mes études d\'ingénieur et décrocher mon poste chez Google.',
    domain: 'engineering',
    joinedSmsYear: 2020
  },
  {
    id: 'marie-d',
    firstName: 'Marie',
    lastName: 'D.',
    avatar: '👩‍⚕️',
    currentPosition: 'Résidente en Médecine',
    company: 'CHU Saint-Luc',
    university: 'UCLouvain',
    degree: 'Docteur en Médecine',
    graduationYear: 2024,
    smsCoursesCompleted: ['Chimie', 'Biologie', 'Physique'],
    linkedinUrl: 'https://linkedin.com/in/marie-d',
    testimonial: 'Les cours de chimie de SMS ont été déterminants pour réussir ma première année de médecine.',
    domain: 'medicine',
    joinedSmsYear: 2019
  },
  {
    id: 'lucas-m',
    firstName: 'Lucas',
    lastName: 'M.',
    avatar: '👨‍💼',
    currentPosition: 'Consultant Strategy',
    company: 'McKinsey & Company',
    university: 'HEC Paris',
    degree: 'Master in Management',
    graduationYear: 2023,
    smsCoursesCompleted: ['Mathématiques', 'Statistiques', 'Économie'],
    linkedinUrl: 'https://linkedin.com/in/lucas-m',
    testimonial: 'SMS m\'a appris la rigueur mathématique qui fait la différence en conseil en stratégie.',
    domain: 'business',
    joinedSmsYear: 2021
  },
  {
    id: 'sophie-k',
    firstName: 'Sophie',
    lastName: 'K.',
    avatar: '👩‍🔬',
    currentPosition: 'Research Scientist',
    company: 'CERN',
    university: 'ETH Zurich',
    degree: 'PhD in Particle Physics',
    graduationYear: 2024,
    smsCoursesCompleted: ['Physique', 'Mathématiques Avancées'],
    linkedinUrl: 'https://linkedin.com/in/sophie-k',
    testimonial: 'La physique enseignée chez SMS m\'a préparée aux défis de la recherche au CERN.',
    domain: 'research',
    joinedSmsYear: 2018
  },
  {
    id: 'alexandre-r',
    firstName: 'Alexandre',
    lastName: 'R.',
    avatar: '👨‍🎓',
    currentPosition: 'Data Scientist',
    company: 'Meta',
    university: 'KULeuven',
    degree: 'Master in Data Science',
    graduationYear: 2023,
    smsCoursesCompleted: ['Statistiques', 'Mathématiques', 'Informatique'],
    linkedinUrl: 'https://linkedin.com/in/alexandre-r',
    testimonial: 'Les statistiques apprises chez SMS sont la base de tout mon travail en data science.',
    domain: 'tech',
    joinedSmsYear: 2020
  },
  {
    id: 'camille-b',
    firstName: 'Camille',
    lastName: 'B.',
    avatar: '👩‍⚖️',
    currentPosition: 'Avocate en Droit des Affaires',
    company: 'Linklaters',
    university: 'ULB',
    degree: 'Master en Droit',
    graduationYear: 2022,
    smsCoursesCompleted: ['Mathématiques', 'Économie', 'Statistiques'],
    linkedinUrl: 'https://linkedin.com/in/camille-b',
    testimonial: 'La logique mathématique de SMS m\'aide quotidiennement dans l\'analyse juridique complexe.',
    domain: 'law',
    joinedSmsYear: 2019
  }
];

export const mockCircles: Circle[] = [
  {
    id: 'alumni-network',
    name: 'Réseau Alumni SMS',
    type: 'alumni',
    description: 'Nos anciens étudiants qui excellent dans leurs domaines - Inspiration et mentorat',
    memberCount: 847,
    icon: '🎓',
    color: 'purple',
    isJoined: true,
    recentActivity: [],
    moderators: ['admin-team']
  },
  {
    id: 'solvay-brussels',
    name: 'Club Solvay Brussels',
    type: 'faculty',
    description: 'Étudiants de la Solvay Brussels School - Excellence et bienveillance',
    memberCount: 234,
    icon: '🏛️',
    color: 'blue',
    isJoined: true,
    recentActivity: [],
    moderators: ['marie-l']
  },
  {
    id: 'uclouvain',
    name: 'UCLouvain Sciences',
    type: 'faculty',
    description: 'Communauté des étudiants UCLouvain en sciences',
    memberCount: 189,
    icon: '🎓',
    color: 'green',
    isJoined: false,
    recentActivity: [],
    moderators: ['lucas-m']
  },
  {
    id: 'math-analysis',
    name: 'Analyse Mathématique',
    type: 'course',
    description: 'Entraide et révisions en analyse mathématique',
    memberCount: 87,
    icon: '📊',
    color: 'purple',
    isJoined: true,
    recentActivity: [],
    moderators: ['marie-l']
  },
  {
    id: 'chemistry-general',
    name: 'Chimie Générale',
    type: 'course',
    description: 'Groupe d\'étude pour la chimie générale',
    memberCount: 72,
    icon: '🧪',
    color: 'orange',
    isJoined: true,
    recentActivity: [],
    moderators: ['sara-k']
  },
  {
    id: 'physics-mechanics',
    name: 'Physique - Mécanique',
    type: 'course',
    description: 'Résolution de problèmes de mécanique ensemble',
    memberCount: 56,
    icon: '⚛️',
    color: 'red',
    isJoined: false,
    recentActivity: [],
    moderators: ['lucas-m']
  }
];

export const mockStudyRooms: StudyRoom[] = [
  {
    id: 'room-1',
    name: 'Session Analyse - Prépa partiels',
    circleId: 'math-analysis',
    createdBy: 'marie-l',
    currentUsers: [mockStudentProfiles[1], mockStudentProfiles[0]], // Marie + Yassine
    maxUsers: 6,
    subject: 'Révision limites et dérivées',
    pomodoroTimer: {
      isActive: true,
      currentSession: 2,
      totalSessions: 4,
      sessionDuration: 25,
      breakDuration: 5,
      timeRemaining: 1080 // 18 minutes
    },
    settings: {
      cameraEnabled: true,
      micEnabled: false,
      chatEnabled: true,
      isPrivate: false
    },
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: 'room-2',
    name: 'Chimie organique intense',
    circleId: 'chemistry-general',
    createdBy: 'sara-k',
    currentUsers: [mockStudentProfiles[3]],
    maxUsers: 4,
    subject: 'Mécanismes réactionnels',
    pomodoroTimer: {
      isActive: false,
      currentSession: 0,
      totalSessions: 0,
      sessionDuration: 25,
      breakDuration: 5,
      timeRemaining: 0
    },
    settings: {
      cameraEnabled: false,
      micEnabled: false,
      chatEnabled: true,
      isPrivate: false
    },
    createdAt: new Date(Date.now() - 1800000)
  }
];

export const mockCommunityQuestions: CommunityQuestion[] = [
  {
    id: 'q1',
    courseId: '1', // Maths
    studentId: 'current-user',
    title: 'Aide sur les limites indéterminées',
    content: 'Je bloque sur les formes indéterminées type ∞/∞. Comment déterminer la limite de (2x³-x)/(3x³+5x²) quand x→∞ ?',
    answers: [
      {
        id: 'a1',
        questionId: 'q1',
        studentId: 'marie-l',
        content: 'Pour ce type de limite, regarde le degré le plus élevé au numérateur et dénominateur. Ici c\'est x³ des deux côtés, donc la limite est le rapport des coefficients : 2/3.',
        likes: 8,
        likedBy: ['current-user', 'sara-k'],
        isAccepted: true,
        isMentorVerified: true,
        createdAt: new Date(Date.now() - 1800000)
      }
    ],
    likes: 5,
    likedBy: ['marie-l', 'sara-k'],
    tags: ['limites', 'analyse'],
    isResolved: true,
    createdAt: new Date(Date.now() - 7200000),
    lastActivity: new Date(Date.now() - 1800000)
  },
  {
    id: 'q2',
    courseId: '3', // Chimie
    studentId: 'lucas-m',
    title: 'Équilibrage équations redox',
    content: 'J\'ai du mal avec l\'équilibrage des réactions d\'oxydoréduction. Des conseils pour la méthode systématique ?',
    answers: [],
    likes: 2,
    likedBy: ['current-user'],
    tags: ['redox', 'équilibrage'],
    isResolved: false,
    createdAt: new Date(Date.now() - 3600000),
    lastActivity: new Date(Date.now() - 3600000)
  }
];

export const mockCommunityActivities: CommunityActivity[] = [
  // Annonces officielles
  {
    id: 'announce1',
    type: 'announcement',
    studentId: 'admin-team',
    content: '🚀 Nouvelle fonctionnalité : Réseau Alumni maintenant disponible ! Découvrez les parcours inspirants de nos anciens étudiants.',
    priority: 'high',
    createdAt: new Date(Date.now() - 1800000), // 30 min ago
    reactions: {
      likes: 23,
      hearts: 8,
      celebrates: 15,
      likedBy: ['current-user', 'marie-l', 'sara-k']
    }
  },
  {
    id: 'announce2',
    type: 'announcement',
    studentId: 'admin-team',
    content: '📅 Webinaire spécial "Méthodes de révision efficaces" ce vendredi à 18h avec Marie L. (ancienne étudiante, maintenant chez Google).',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    reactions: {
      likes: 18,
      hearts: 5,
      celebrates: 12,
      likedBy: ['current-user', 'paul-m']
    }
  },

  // Célébrations et succès
  {
    id: 'celebration1',
    type: 'celebration',
    studentId: 'current-user',
    content: '🎉 Bravo Yassine ! Tu viens de terminer le cours Analyse Mathématique I avec une note de 16/20 !',
    circleId: 'math-analysis',
    priority: 'high',
    createdAt: new Date(Date.now() - 3600000), // 1h ago
    reactions: {
      likes: 12,
      hearts: 8,
      celebrates: 20,
      likedBy: ['marie-l', 'sara-k', 'paul-m']
    }
  },
  {
    id: 'celebration2',
    type: 'milestone',
    studentId: 'marie-l',
    content: '🏆 Félicitations Marie ! Tu as atteint le niveau 15 et obtenu le badge "Mentor Expert" en aidant plus de 50 étudiants !',
    circleId: 'solvay-brussels',
    priority: 'high',
    createdAt: new Date(Date.now() - 7200000), // 2h ago
    reactions: {
      likes: 25,
      hearts: 15,
      celebrates: 30,
      likedBy: ['current-user', 'sara-k', 'paul-m', 'alex-r']
    }
  },
  {
    id: 'celebration3',
    type: 'level_up',
    studentId: 'sara-k',
    content: '⭐ Sara a progressé au niveau 8 ! Son streak d\'étude de 21 jours est impressionnant.',
    circleId: 'chemistry',
    priority: 'medium',
    createdAt: new Date(Date.now() - 10800000), // 3h ago
    reactions: {
      likes: 8,
      hearts: 4,
      celebrates: 10,
      likedBy: ['current-user', 'marie-l']
    }
  },

  // Activités communautaires
  {
    id: 'activity1',
    type: 'room_created',
    studentId: 'paul-m',
    content: '📚 Paul a ouvert une session d\'étude collective "Préparation Partiels Physique" - 4 places disponibles !',
    circleId: 'physics',
    priority: 'medium',
    createdAt: new Date(Date.now() - 14400000), // 4h ago
    reactions: {
      likes: 6,
      hearts: 2,
      celebrates: 3,
      likedBy: ['current-user']
    }
  },
  {
    id: 'activity2',
    type: 'achievement',
    studentId: 'alex-r',
    content: '🔥 Alex a complété le défi "Expert en Statistiques" en terminant 5 exercices difficiles cette semaine !',
    circleId: 'math-stats',
    priority: 'medium',
    createdAt: new Date(Date.now() - 18000000), // 5h ago
    reactions: {
      likes: 9,
      hearts: 3,
      celebrates: 7,
      likedBy: ['current-user', 'marie-l', 'sara-k']
    }
  },

  // Bienvenue et interactions
  {
    id: 'welcome1',
    type: 'welcome',
    studentId: 'admin-team',
    content: '👋 Bienvenue aux 12 nouveaux étudiants qui ont rejoint Science Made Simple cette semaine ! Votre parcours vers l\'excellence commence maintenant.',
    priority: 'medium',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    reactions: {
      likes: 15,
      hearts: 10,
      celebrates: 8,
      likedBy: ['current-user', 'marie-l', 'sara-k', 'paul-m']
    }
  },
  {
    id: 'qa1',
    type: 'question_asked',
    studentId: 'current-user',
    content: '❓ Yassine a posé une excellente question sur les intégrales par parties qui a aidé 8 autres étudiants.',
    circleId: 'math-analysis',
    priority: 'low',
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    reactions: {
      likes: 11,
      hearts: 2,
      celebrates: 5,
      likedBy: ['marie-l', 'paul-m', 'alex-r']
    }
  },
  {
    id: 'answer1',
    type: 'answer_given',
    studentId: 'marie-l',
    content: '💡 Marie a donné une réponse détaillée qui a résolu le problème de chimie organique de 3 étudiants.',
    circleId: 'chemistry',
    priority: 'low',
    createdAt: new Date(Date.now() - 345600000), // 4 days ago
    reactions: {
      likes: 7,
      hearts: 5,
      celebrates: 3,
      likedBy: ['current-user', 'sara-k']
    }
  }
];

export const mockCommunityChallenge: CommunityChallenge = {
  id: 'challenge-1',
  title: 'Défi Communauté Solvay',
  description: '1000h d\'étude collective ce mois-ci',
  type: 'collective',
  target: 1000,
  current: 342,
  participants: ['current-user', 'marie-l', 'sara-k'],
  reward: 'Badge exclusif "Champion Solvay" pour tous',
  icon: '🏆',
  color: 'gold',
  startDate: new Date('2024-12-01'),
  endDate: new Date('2024-12-31'),
  isActive: true
};

// Mini-quiz questions pour les cours recommandés
export const mockMiniQuizzes = {
  '1': [ // Mathématiques - Analyse I
    {
      id: 'math1-q1',
      question: 'Quelle est la définition d\'une limite d\'une fonction en un point ?',
      options: [
        'La valeur que prend la fonction en ce point',
        'La valeur vers laquelle tend la fonction quand x se rapproche du point',
        'La dérivée de la fonction en ce point',
        'L\'intégrale de la fonction jusqu\'à ce point'
      ],
      correctAnswer: 1,
      explanation: 'La limite d\'une fonction en un point est la valeur vers laquelle tend cette fonction quand la variable se rapproche de ce point, indépendamment de la valeur de la fonction en ce point.',
      difficulty: 'medium' as const
    },
    {
      id: 'math1-q2',
      question: 'Une fonction continue sur un intervalle fermé borné possède-t-elle toujours un maximum ?',
      options: [
        'Oui, c\'est le théorème de Weierstrass',
        'Non, seulement si elle est dérivable',
        'Seulement si elle est monotone',
        'Cela dépend de la fonction'
      ],
      correctAnswer: 0,
      explanation: 'Le théorème de Weierstrass stipule qu\'une fonction continue sur un intervalle fermé et borné atteint ses bornes, donc possède un maximum et un minimum.',
      difficulty: 'hard' as const
    }
  ],
  '2': [ // Physique - Mécanique Classique
    {
      id: 'phys2-q1',
      question: 'Quelle est l\'unité de la force dans le système international ?',
      options: [
        'Joule (J)',
        'Watt (W)',
        'Newton (N)',
        'Pascal (Pa)'
      ],
      correctAnswer: 2,
      explanation: 'Le Newton (N) est l\'unité de force dans le système international. 1 N = 1 kg⋅m⋅s⁻²',
      difficulty: 'easy' as const
    },
    {
      id: 'phys2-q2',
      question: 'Dans un mouvement circulaire uniforme, l\'accélération est :',
      options: [
        'Nulle',
        'Tangentielle et constante',
        'Centripète et constante en norme',
        'Variable en direction et en norme'
      ],
      correctAnswer: 2,
      explanation: 'Dans un mouvement circulaire uniforme, l\'accélération est centripète (dirigée vers le centre) et constante en norme, mais sa direction change constamment.',
      difficulty: 'medium' as const
    }
  ],
  '3': [ // Chimie Générale
    {
      id: 'chem3-q1',
      question: 'Combien d\'électrons peut contenir au maximum la couche électronique L ?',
      options: [
        '2 électrons',
        '8 électrons',
        '18 électrons',
        '32 électrons'
      ],
      correctAnswer: 1,
      explanation: 'La couche L (n=2) peut contenir au maximum 2n² = 2×2² = 8 électrons.',
      difficulty: 'easy' as const
    }
  ],
  '4': [ // Statistiques
    {
      id: 'stat4-q1',
      question: 'Quelle est la propriété principale d\'une distribution normale standard ?',
      options: [
        'Moyenne = 1, Écart-type = 0',
        'Moyenne = 0, Écart-type = 1',
        'Moyenne = 0, Écart-type = 0',
        'Moyenne = 1, Écart-type = 1'
      ],
      correctAnswer: 1,
      explanation: 'Une distribution normale standard a une moyenne μ = 0 et un écart-type σ = 1.',
      difficulty: 'medium' as const
    }
  ],
  '5': [ // Économie - Microéconomie
    {
      id: 'eco5-q1',
      question: 'Que représente l\'élasticité-prix de la demande ?',
      options: [
        'La variation absolue de la demande',
        'Le pourcentage de variation de la demande suite à une variation de 1% du prix',
        'Le prix maximum qu\'un consommateur est prêt à payer',
        'La quantité minimum demandée'
      ],
      correctAnswer: 1,
      explanation: 'L\'élasticité-prix de la demande mesure la sensibilité de la quantité demandée aux variations de prix, exprimée en pourcentage.',
      difficulty: 'medium' as const
    }
  ]
};

// ========================================================================
// MOCK LESSONS - 7 ÉTAPES POUR CHAQUE COURS
// ========================================================================

/**
 * Génère 7 leçons standardisées pour un cours donné
 * Suit une progression pédagogique logique : Intro → Fondements → Pratique → Avancé → Synthèse → Évaluation → Projet
 */
export const generateMockLessons = (courseId: string, courseTitle: string): Lesson[] => {
  const baseTypes: Array<{ type: Lesson['type'], icon: string, baseDuration: number }> = [
    { type: 'video', icon: '🎥', baseDuration: 25 },
    { type: 'reading', icon: '📖', baseDuration: 15 },
    { type: 'exercise', icon: '💪', baseDuration: 30 },
    { type: 'video', icon: '🎯', baseDuration: 35 },
    { type: 'exercise', icon: '🔬', baseDuration: 45 },
    { type: 'quiz', icon: '❓', baseDuration: 20 },
    { type: 'exercise', icon: '🏆', baseDuration: 60 }
  ];

  const lessonTemplates = [
    {
      title: 'Introduction et objectifs',
      description: 'Découverte du sujet et présentation des objectifs pédagogiques. Mise en contexte et motivation.',
    },
    {
      title: 'Concepts fondamentaux',
      description: 'Apprentissage des notions de base essentielles. Définitions et première approche théorique.',
    },
    {
      title: 'Applications pratiques',
      description: 'Exercices concrets et mise en pratique des concepts. Développement des compétences opérationnelles.',
    },
    {
      title: 'Techniques avancées',
      description: 'Approfondissement et méthodes avancées. Résolution de problèmes complexes.',
    },
    {
      title: 'Synthèse et intégration',
      description: 'Consolidation des acquis et vision d\'ensemble. Liens entre les différents concepts.',
    },
    {
      title: 'Évaluation des connaissances',
      description: 'Test formatif pour vérifier la maîtrise. Auto-évaluation et feedback constructif.',
    },
    {
      title: 'Projet de synthèse',
      description: 'Application globale dans un projet concret. Validation des compétences acquises.',
    }
  ];

  return lessonTemplates.map((template, index) => {
    const typeInfo = baseTypes[index];
    const isCompleted = index < 2; // Les 2 premières leçons sont complétées
    const isUnlocked = index < 3; // Les 3 premières sont débloquées
    
    return {
      id: `${courseId}-lesson-${index + 1}`,
      courseId,
      title: template.title,
      description: template.description,
      duration: typeInfo.baseDuration + Math.floor(Math.random() * 10) - 5, // Variation de ±5 min
      order: index + 1,
      completed: isCompleted,
      isCompleted: isCompleted,
      unlocked: isUnlocked,
      isAccessible: isUnlocked,
      hasPreview: index === 0 || !isUnlocked, // Preview pour la première ou les verrouillées
      type: typeInfo.type,
      xpReward: 10 + (index * 5), // XP croissant : 10, 15, 20, 25, 30, 35, 40
      difficulty: index < 2 ? 'easy' : index < 5 ? 'medium' : 'hard',
      objectives: [
        `Maîtriser ${template.title.toLowerCase()}`,
        `Appliquer les concepts dans ${courseTitle}`,
        `Préparer la suite du parcours académique`
      ],
      previewUrl: index === 0 ? '/preview-video.mp4' : undefined,
      videoUrl: typeInfo.type === 'video' ? '/course-video.mp4' : undefined,
    };
  });
};

// Mock lessons pour les cours principaux
export const getCourseLessons = (courseId: string): Lesson[] => {
  const course = mockCourses.find(c => c.id === courseId);
  if (!course) return [];
  
  return generateMockLessons(courseId, course.title);
};

// ========================================================================
// FONCTIONS DE RÉCUPÉRATION DU CONTENU EXTERNE
// ========================================================================

export const getExternalCourses = () => {
  return externalCourses;
};

export const getExternalLessons = () => {
  return externalLessons;
};

export const getAllCourses = () => {
  return [...mockCourses, ...externalCourses];
};

export const getAllLessons = () => {
  return [...mockLessons, ...externalLessons];
};

export const isExternalContent = (item: any): boolean => {
  return item.catalogInfo?.type === 'external';
};

export const getWhatsAppLink = (catalogInfo: any): string => {
  if (!catalogInfo.whatsappNumber || !catalogInfo.whatsappMessage) return '';
  const encodedMessage = encodeURIComponent(catalogInfo.whatsappMessage);
  return `https://wa.me/${catalogInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
};

// Leçons pré-générées pour les cours favoris
export const mockCourseLessons: Record<string, Lesson[]> = {
  '1': generateMockLessons('1', 'Mathématiques : Analyse I Q1'),
  '2': generateMockLessons('2', 'Chimie Générale I Q1'),
  '3': generateMockLessons('3', 'Physique Générale I Q1'),
  '4': generateMockLessons('4', 'Statistiques et Probabilités'),
  '5': generateMockLessons('5', 'Économie - Microéconomie'),
  '6': generateMockLessons('6', 'Comptabilité Générale Q1'),
  '7': generateMockLessons('7', 'Informatique Q1'),
  '8': generateMockLessons('8', 'Droit Civil - Introduction'),
  '9': generateMockLessons('9', 'Analyse II Q2'),
  '10': generateMockLessons('10', 'Chimie Générale I Q2'),
};

// Getters
export const getStudentProfile = (id: string) => mockStudentProfiles.find(p => p.id === id);
export const getCurrentUserProfile = () => mockStudentProfiles[0];
export const getMockCircles = () => mockCircles;
export const getMockStudyRooms = () => mockStudyRooms;
export const getMockCourseStudyRooms = () => mockCourseStudyRooms;
export const getMockStudyRoomNotifications = () => mockStudyRoomNotifications;
export const getMockCommunityQuestions = () => mockCommunityQuestions;
export const getMockCommunityActivities = () => mockCommunityActivities;
export const getMockSocialBadges = () => mockSocialBadges;
export const getMockCommunityChallenge = () => mockCommunityChallenge;
export const getMockAlumniProfiles = () => mockAlumniProfiles;
export const getMiniQuizForCourse = (courseId: string): MiniQuizQuestion[] => {
  // Vérifier d'abord si un quiz spécifique existe
  if (mockMiniQuizzes[courseId]) {
    return mockMiniQuizzes[courseId];
  }

  // Créer un quiz générique de 5 questions pour tous les cours
  const genericQuiz: MiniQuizQuestion[] = [
    {
      id: `${courseId}-q1`,
      question: 'Quel est l\'objectif principal de ce cours ?',
      options: [
        'Apprendre les concepts fondamentaux',
        'Réussir l\'examen final uniquement',
        'Mémoriser des formules',
        'Copier les notes du cours'
      ],
      correctAnswer: 0,
      explanation: 'L\'objectif principal est de comprendre et maîtriser les concepts fondamentaux pour une application pratique.',
      difficulty: 'easy' as const
    },
    {
      id: `${courseId}-q2`,
      question: 'Quelle est la meilleure méthode d\'apprentissage pour ce type de matière ?',
      options: [
        'Lire passivement',
        'Pratiquer et appliquer les concepts',
        'Apprendre par cœur uniquement',
        'Attendre la veille de l\'examen'
      ],
      correctAnswer: 1,
      explanation: 'La pratique et l\'application des concepts permettent une meilleure compréhension et rétention.',
      difficulty: 'medium' as const
    },
    {
      id: `${courseId}-q3`,
      question: 'Comment évaluer votre progression dans cette matière ?',
      options: [
        'Seulement par les notes d\'examen',
        'Par la compréhension des concepts et la capacité à les expliquer',
        'Par le nombre d\'heures étudiées',
        'Par la quantité de matière mémorisée'
      ],
      correctAnswer: 1,
      explanation: 'La vraie progression se mesure par votre capacité à comprendre, expliquer et appliquer les concepts.',
      difficulty: 'medium' as const
    },
    {
      id: `${courseId}-q4`,
      question: 'Que faire en cas de difficultés dans cette matière ?',
      options: [
        'Abandonner le cours',
        'Chercher de l\'aide et réviser les bases',
        'Ignorer les difficultés',
        'Changer de filière'
      ],
      correctAnswer: 1,
      explanation: 'Face aux difficultés, il est important de chercher de l\'aide et de consolider les bases avant d\'avancer.',
      difficulty: 'easy' as const
    },
    {
      id: `${courseId}-q5`,
      question: 'Quel est le rôle des exercices pratiques dans l\'apprentissage ?',
      options: [
        'Ils sont optionnels',
        'Ils permettent d\'appliquer et de valider la compréhension',
        'Ils servent uniquement pour les examens',
        'Ils remplacent la théorie'
      ],
      correctAnswer: 1,
      explanation: 'Les exercices pratiques sont essentiels pour appliquer les concepts théoriques et valider votre compréhension.',
      difficulty: 'medium' as const
    }
  ];

  return genericQuiz;
};
export const getLessonsForCourse = (courseId: string) => mockCourseLessons[courseId] || generateMockLessons(courseId, `Cours ${courseId}`);

// ========================================================================
// PROFIL PERSONNALISÉ - BLOCAGES & AMBITIONS
// ========================================================================

export const mockPersonalProfile: PersonalProfile = {
  blocages: [
    {
      id: 'b1',
      titre: 'Difficultés en intégrales',
      description: 'J\'ai du mal avec les techniques d\'intégration avancées, surtout les intégrales par parties',
      matiere: 'Mathématiques - Analyse I',
      niveau: 'difficile',
      identifieLe: new Date('2024-09-10'),
      source: 'conversation-ia',
      recommandations: [
        'Réviser les bases des dérivées',
        'Pratiquer les exercices d\'intégration simple',
        'Utiliser la méthode progressive des intégrales par parties'
      ]
    },
    {
      id: 'b2',
      titre: 'Équilibres chimiques complexes',
      description: 'Les calculs d\'équilibres avec plusieurs réactions simultanées me posent problème',
      matiere: 'Chimie Générale I',
      niveau: 'moyen',
      identifieLe: new Date('2024-09-15'),
      source: 'whatsapp',
      recommandations: [
        'Maîtriser d\'abord les équilibres simples',
        'Utiliser des schémas visuels',
        'Pratiquer avec des exemples concrets'
      ]
    },
    {
      id: 'b3',
      titre: 'Procrastination et gestion du temps',
      description: 'J\'ai tendance à reporter mes révisions, surtout pour les matières difficiles',
      matiere: 'Méthodes de travail',
      niveau: 'moyen',
      identifieLe: new Date('2024-09-20'),
      source: 'auto-evaluation',
      recommandations: [
        'Utiliser la technique Pomodoro',
        'Planifier des créneaux fixes',
        'Commencer par de petites tâches'
      ]
    }
  ],
  ambitions: [
    {
      id: 'a1',
      titre: 'Décrocher une mention en première année',
      description: 'Je veux terminer ma première année avec une moyenne de 14/20 minimum',
      echeance: new Date('2025-06-30'),
      priorite: 'haute',
      progres: 35,
      etapes: [
        { id: 'e1', titre: 'Maîtriser les mathématiques Q1', terminee: false, coursLie: '1' },
        { id: 'e2', titre: 'Réussir l\'examen de chimie', terminee: false, coursLie: '2' },
        { id: 'e3', titre: 'Développer une routine d\'étude', terminee: true }
      ]
    },
    {
      id: 'a2',
      titre: 'Intégrer un programme d\'échange',
      description: 'Je veux partir en Erasmus en 3ème année, idéalement en Allemagne ou aux Pays-Bas',
      echeance: new Date('2026-09-01'),
      priorite: 'moyenne',
      progres: 15,
      etapes: [
        { id: 'e4', titre: 'Maintenir une excellente moyenne', terminee: false },
        { id: 'e5', titre: 'Améliorer mon niveau d\'anglais', terminee: false },
        { id: 'e6', titre: 'Me renseigner sur les universités partenaires', terminee: true }
      ]
    }
  ],
  cheminRecommande: {
    id: 'cr1',
    titre: 'Parcours de remise à niveau en sciences',
    description: 'Plan personnalisé basé sur tes difficultés actuelles et tes objectifs académiques',
    progression: 42,
    tempEstime: '8-10 semaines',
    creeLe: new Date('2024-09-25'),
    baseSur: ['conversation-ia', 'blocages', 'ambitions'],
    etapes: [
      {
        id: 'ec1',
        titre: 'Consolider les bases mathématiques',
        description: 'Révision des dérivées et introduction progressive aux intégrales',
        coursRecommande: '1',
        terminee: true,
        ordre: 1
      },
      {
        id: 'ec2',
        titre: 'Renforcer la méthodologie',
        description: 'Développer des techniques d\'organisation et de gestion du temps',
        terminee: true,
        ordre: 2
      },
      {
        id: 'ec3',
        titre: 'Approfondir la chimie générale',
        description: 'Focus sur les équilibres et la thermodynamique',
        coursRecommande: '2',
        terminee: false,
        ordre: 3
      },
      {
        id: 'ec4',
        titre: 'Pratiquer avec des exercices avancés',
        description: 'Applications concrètes et problèmes complexes',
        terminee: false,
        ordre: 4
      }
    ]
  },
  conversationsIA: [
    {
      id: 'ci1',
      date: new Date('2024-09-25'),
      resume: 'Discussion sur les difficultés en mathématiques et définition d\'un plan d\'action',
      decouvertesClés: [
        'Lacunes dans les techniques d\'intégration',
        'Besoin de réviser les bases avant d\'avancer',
        'Motivation élevée malgré les difficultés'
      ],
      recommandations: [
        'Suivre le cours de rattrapage en analyse',
        'Utiliser des ressources visuelles pour mieux comprendre',
        'Planifier 30min de révision quotidienne'
      ]
    },
    {
      id: 'ci2',
      date: new Date('2024-09-20'),
      resume: 'Évaluation du niveau global et identification des priorités',
      decouvertesClés: [
        'Niveau satisfaisant en chimie de base',
        'Excellente motivation et objectifs clairs',
        'Problèmes de gestion du temps à résoudre'
      ],
      recommandations: [
        'Créer un planning hebdomadaire structuré',
        'Commencer par consolider les mathématiques',
        'Utiliser les outils de suivi de progression'
      ]
    }
  ],
  conversationsWhatsApp: [
    {
      id: 'cw1',
      date: new Date('2024-09-22'),
      resume: 'Questions sur l\'équilibre chimique et demande de ressources supplémentaires',
      pointsDiscutes: [
        'Calculs d\'équilibres multiples',
        'Recommandations de livres et exercices',
        'Planification des révisions pour l\'examen'
      ],
      suiviNecessaire: false
    },
    {
      id: 'cw2',
      date: new Date('2024-09-18'),
      resume: 'Discussion motivationnelle et conseil sur la gestion du stress',
      pointsDiscutes: [
        'Anxiété avant les examens',
        'Techniques de relaxation',
        'Importance de maintenir un équilibre vie/études'
      ],
      suiviNecessaire: true
    }
  ]
};

export const getPersonalProfile = () => mockPersonalProfile;

