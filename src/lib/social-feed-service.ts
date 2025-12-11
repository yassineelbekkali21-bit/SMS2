export interface SocialEvent {
  id: string;
  type: 'buddy' | 'faculty' | 'personal' | 'founder-session' | 'study-room' | 'battle' | 'challenge' | 'discovery' | 'achievement';
  userId: string;
  userName: string;
  userAvatar: string;
  emoji: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  clickableLink?: {
    type: 'course' | 'pack' | 'buddy' | 'achievement' | 'study-room' | 'competition' | 'circle' | 'message' | 'xp-event' | 'community' | 'battle' | 'challenge';
    id: string;
    title: string;
    action?: string; // Description de l'action (ex: "Voir le classement", "Rejoindre le cercle")
  };
  // Nouveau : pour le regroupement intelligent
  groupKey?: string; // Clé pour regrouper les événements similaires
  participants?: string[]; // Liste des participants pour les événements groupés
  courseId?: string; // ID du cours pour faciliter le regroupement
  // Nouveau : pour les séances spéciales
  isLive?: boolean; // Si la séance est en cours
  startTime?: Date; // Heure de début de la séance
  endTime?: Date; // Heure de fin de la séance
  studyRoomId?: string; // ID de la Study Room
  maxParticipants?: number; // Nombre max de participants
  currentParticipants?: number; // Nombre actuel de participants
  // Nouveau : pour les battles
  battleOpponent?: string; // Nom de l'adversaire
  battleStatus?: 'pending' | 'active' | 'won' | 'lost'; // Statut de la battle
  battleScore?: { player: number; opponent: number }; // Scores
  // Nouveau : pour les challenges
  challengeProgress?: number; // Progression du challenge (0-100)
  challengeReward?: string; // Récompense du challenge
  challengeDeadline?: Date; // Date limite du challenge
  // Nouveau : pour les discoveries
  suggestionType?: 'buddy' | 'circle' | 'course'; // Type de suggestion
  relevanceScore?: number; // Score de pertinence (0-100)
}

export interface SocialFeedContext {
  currentCourse?: string; // ID du cours actuellement consulté
  currentPack?: string; // ID du pack actuellement consulté
  userProgress?: {
    recentlyCompleted?: string[]; // Cours/leçons récemment complétées
    currentStreak?: number; // Série actuelle d'étude
  };
}

export interface SocialFeedData {
  buddyActivities: SocialEvent[];
  facultyActivities: SocialEvent[];
  personalAchievements: SocialEvent[];
  founderSessions: SocialEvent[]; // Nouvelles séances du fondateur
  unreadCount: number;
  networkEnergy: NetworkEnergyMetrics; // Nouvelle métrique d'énergie
  contextualMessage?: string; // Message contextuel intelligent (optionnel)
}

export interface NetworkEnergyMetrics {
  level: 'low' | 'medium' | 'high' | 'explosive'; // Niveau d'activité
  score: number; // Score de 0 à 100
  todayActivities: number; // Nombre d'activités aujourd'hui
  activeStudents: number; // Nombre d'étudiants actifs
  trendingCourse: string; // Cours en tendance
  message: string; // Message narratif
  emoji: string; // Emoji représentatif
}

// Mock data pour les activités sociales - Version "Science in Motion"
const mockBuddyActivities: SocialEvent[] = [
  {
    id: 'buddy-study-room-invite',
    type: 'buddy',
    userId: 'user-emma',
    userName: 'Emma',
    userAvatar: '/avatars/emma.jpg',
    emoji: '📚',
    message: 't\'invite à rejoindre sa Study Room "Probabilités"',
    timestamp: new Date(Date.now() - 1000 * 60 * 1), // 1 min ago
    isRead: false,
    clickableLink: {
      type: 'study-room',
      id: 'room-proba-001',
      title: 'Study Room Probabilités',
      action: 'Rejoindre'
    }
  },
  {
    id: 'buddy-progress-milestone',
    type: 'buddy',
    userId: 'user-thomas',
    userName: 'Thomas',
    userAvatar: '/avatars/thomas.jpg',
    emoji: '🎯',
    message: 'a complété 75% du pack "Électrostatique"',
    timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 min ago
    isRead: false,
    clickableLink: {
      type: 'buddy',
      id: 'user-thomas',
      title: 'Progression de Thomas',
      action: 'Voir'
    }
  },
  {
    id: 'buddy-message',
    type: 'buddy',
    userId: 'user-sophie',
    userName: 'Sophie',
    userAvatar: '/avatars/sophie.jpg',
    emoji: '💬',
    message: 't\'a envoyé un message : "On se retrouve pour le cours de maths ?"',
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 min ago
    isRead: false,
    clickableLink: {
      type: 'message',
      id: 'user-sophie',
      title: 'Message de Sophie',
      action: 'Répondre'
    }
  },
  {
    id: 'buddy-circle',
    type: 'buddy',
    userId: 'circle-physics',
    userName: '🔬 Cercle Physique',
    userAvatar: '/icons/circle.svg',
    emoji: '🎯',
    message: '12 nouveaux messages dans le cercle Physique Quantique',
    timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 min ago
    isRead: false,
    clickableLink: {
      type: 'circle',
      id: 'physics-quantum',
      title: 'Cercle Physique Quantique',
      action: 'Voir les discussions'
    }
  },
  {
    id: 'buddy-1',
    type: 'buddy',
    userId: 'user-sarah',
    userName: 'Sarah',
    userAvatar: '/avatars/sarah.jpg',
    emoji: '🧠',
    message: 'plonge dans les mystères de la Loi de Gauss. Tu la rejoins ?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    isRead: false,
    courseId: 'course-gauss',
    clickableLink: {
      type: 'course',
      id: 'course-gauss',
      title: 'Loi de Gauss'
    }
  },
  {
    id: 'buddy-2',
    type: 'buddy',
    userId: 'user-thomas',
    userName: 'Thomas',
    userAvatar: '/avatars/thomas.jpg',
    emoji: '🎓',
    message: 'a franchi un nouveau cap — il vient d\'ouvrir le pack Mathématiques Avancées',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
    isRead: false,
    clickableLink: {
      type: 'pack',
      id: 'pack-mathematiques',
      title: 'Mathématiques Avancées'
    }
  },
  {
    id: 'buddy-3',
    type: 'buddy',
    userId: 'user-marie',
    userName: 'Marie',
    userAvatar: '/avatars/marie.jpg',
    emoji: '💡',
    message: 'vient de décoder une nouvelle notion en Mécanique Classique',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1h30 ago
    isRead: true,
    courseId: 'course-physique-mecanique',
    clickableLink: {
      type: 'course',
      id: 'course-physique-mecanique',
      title: 'Mécanique Classique'
    }
  },
  {
    id: 'buddy-4',
    type: 'buddy',
    userId: 'user-alex',
    userName: 'Alex',
    userAvatar: '/avatars/alex.jpg',
    emoji: '🏆',
    message: 'atteint le rang Expert. Une belle ascension scientifique !',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2h ago
    isRead: true,
    clickableLink: {
      type: 'buddy',
      id: 'user-alex',
      title: 'Profil d\'Alex'
    }
  },
  // Ajouter des événements similaires pour tester le regroupement
  {
    id: 'buddy-5',
    type: 'buddy',
    userId: 'user-lucas',
    userName: 'Lucas',
    userAvatar: '/avatars/lucas.jpg',
    emoji: '🧠',
    message: 'explore aussi les mystères de la Loi de Gauss',
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 min ago
    isRead: false,
    courseId: 'course-gauss',
    clickableLink: {
      type: 'course',
      id: 'course-gauss',
      title: 'Loi de Gauss'
    }
  }
];

const mockFacultyActivities: SocialEvent[] = [
  {
    id: 'faculty-1',
    type: 'faculty',
    userId: 'faculty-stats',
    userName: '12 étudiants de Solvay',
    userAvatar: '/icons/faculty.svg',
    emoji: '🌟',
    message: 'explorent activement la Loi de Gauss. L\'électrostatique fascine !',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    isRead: false,
    clickableLink: {
      type: 'pack',
      id: 'pack-electromagnetisme',
      title: 'Électrostatique'
    }
  },
  {
    id: 'faculty-2',
    type: 'faculty',
    userId: 'faculty-trending',
    userName: 'Analyse Mathématique I',
    userAvatar: '/icons/trending.svg',
    emoji: '📈',
    message: 'cartonne cette semaine — le cours le plus ouvert !',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1h ago
    isRead: false,
    clickableLink: {
      type: 'course',
      id: 'course-math-analyse-1',
      title: 'Analyse Mathématique I'
    }
  },
  {
    id: 'faculty-3',
    type: 'faculty',
    userId: 'faculty-popular',
    userName: '8 nouveaux étudiants',
    userAvatar: '/icons/students.svg',
    emoji: '🚀',
    message: 'ont embarqué dans l\'aventure Chimie Générale aujourd\'hui',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3h ago
    isRead: true,
    clickableLink: {
      type: 'course',
      id: 'course-chimie-generale',
      title: 'Chimie Générale'
    }
  }
];

// Mock data pour battles, challenges et discoveries
const mockBattles: SocialEvent[] = [
  {
    id: 'battle-1',
    type: 'battle',
    userId: 'user-sarah',
    userName: 'Sarah',
    userAvatar: '/avatars/sarah.jpg',
    emoji: '⚔️',
    message: 'te défie sur le quiz de Chimie Organique',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 min ago
    isRead: false,
    battleOpponent: 'Sarah',
    battleStatus: 'pending',
    clickableLink: {
      type: 'battle',
      id: 'battle-chimie-org',
      title: 'Battle Chimie Organique',
      action: 'Accepter le défi'
    }
  },
  {
    id: 'battle-2',
    type: 'battle',
    userId: 'user-thomas',
    userName: 'Thomas',
    userAvatar: '/avatars/thomas.jpg',
    emoji: '🎯',
    message: 'Battle terminée ! Tu as gagné 8-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    isRead: false,
    battleOpponent: 'Thomas',
    battleStatus: 'won',
    battleScore: { player: 8, opponent: 5 },
    clickableLink: {
      type: 'battle',
      id: 'battle-physics',
      title: 'Battle Physique',
      action: 'Voir les résultats'
    }
  }
];

const mockChallenges: SocialEvent[] = [
  {
    id: 'challenge-1',
    type: 'challenge',
    userId: 'system',
    userName: '🎯 Défi',
    userAvatar: '/icons/target.svg',
    emoji: '🔥',
    message: 'Défi de la semaine : Atteins 500 XP',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1h ago
    isRead: false,
    challengeProgress: 65,
    challengeReward: '+100 XP bonus',
    challengeDeadline: new Date(Date.now() + 1000 * 60 * 60 * 48), // Dans 48h
    clickableLink: {
      type: 'challenge',
      id: 'challenge-week-xp',
      title: 'Défi 500 XP',
      action: 'Continuer le défi'
    }
  },
  {
    id: 'challenge-2',
    type: 'challenge',
    userId: 'system',
    userName: '🎯 Défi',
    userAvatar: '/icons/target.svg',
    emoji: '📚',
    message: 'Complète 5 leçons aujourd\'hui',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2h ago
    isRead: false,
    challengeProgress: 40,
    challengeReward: 'Badge "Marathon"',
    challengeDeadline: new Date(Date.now() + 1000 * 60 * 60 * 6), // Dans 6h
    clickableLink: {
      type: 'challenge',
      id: 'challenge-daily-lessons',
      title: 'Défi 5 leçons',
      action: 'Voir la progression'
    }
  }
];

const mockDiscoveries: SocialEvent[] = [
  {
    id: 'discovery-1',
    type: 'discovery',
    userId: 'user-alex',
    userName: 'Alex',
    userAvatar: '/avatars/alex.jpg',
    emoji: '👤',
    message: '(Médecine, Bruxelles) étudie les mêmes cours que toi',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1h30 ago
    isRead: false,
    suggestionType: 'buddy',
    relevanceScore: 95,
    clickableLink: {
      type: 'buddy',
      id: 'user-alex',
      title: 'Profil d\'Alex',
      action: 'Ajouter en buddy'
    }
  },
  {
    id: 'discovery-2',
    type: 'discovery',
    userId: 'circle-medecine-paris',
    userName: 'Cercle Médecine Paris',
    userAvatar: '/icons/circle.svg',
    emoji: '🌟',
    message: 'pourrait t\'intéresser - 42 membres actifs',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3h ago
    isRead: true,
    suggestionType: 'circle',
    relevanceScore: 88,
    clickableLink: {
      type: 'circle',
      id: 'medecine-paris',
      title: 'Cercle Médecine Paris',
      action: 'Rejoindre'
    }
  },
  {
    id: 'discovery-3',
    type: 'discovery',
    userId: 'course-thermodynamique',
    userName: 'Cours Thermodynamique',
    userAvatar: '/icons/course.svg',
    emoji: '💡',
    message: 'Basé sur ton parcours, ce cours pourrait te plaire',
    timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4h ago
    isRead: true,
    suggestionType: 'course',
    relevanceScore: 92,
    courseId: 'course-thermodynamique',
    clickableLink: {
      type: 'course',
      id: 'course-thermodynamique',
      title: 'Thermodynamique',
      action: 'Découvrir'
    }
  }
];

const mockPersonalAchievements: SocialEvent[] = [
  {
    id: 'personal-competition',
    type: 'personal',
    userId: 'system',
    userName: '🏆 Compétition',
    userAvatar: '/icons/trophy.svg',
    emoji: '🔥',
    message: 'Tu es 3ème au Sprint du Week-end ! 2 places te séparent du podium',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    isRead: false,
    clickableLink: {
      type: 'competition',
      id: 'weekend-sprint',
      title: 'Sprint du Week-end',
      action: 'Voir le classement'
    }
  },
  {
    id: 'personal-xp-event',
    type: 'personal',
    userId: 'system',
    userName: '⚡ Événement',
    userAvatar: '/icons/lightning.svg',
    emoji: '⚡',
    message: 'XP Boost Week-end activé ! Gagne 2× plus d\'XP pendant 48h',
    timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 min ago
    isRead: false,
    clickableLink: {
      type: 'xp-event',
      id: 'xp-boost-weekend',
      title: 'XP Boost Week-end',
      action: 'Profiter du boost'
    }
  },
  {
    id: 'personal-buddy-request',
    type: 'personal',
    userId: 'user-marie',
    userName: '👤 Marie',
    userAvatar: '/avatars/marie.jpg',
    emoji: '🤝',
    message: 't\'a envoyé une demande de connexion',
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 min ago
    isRead: false,
    clickableLink: {
      type: 'buddy',
      id: 'user-marie',
      title: 'Demande de connexion',
      action: 'Accepter'
    }
  },
  {
    id: 'personal-quiz-reminder',
    type: 'personal',
    userId: 'system',
    userName: '📝 Rappel',
    userAvatar: '/icons/reminder.svg',
    emoji: '⏰',
    message: 'Quiz de Mécanique à compléter avant demain',
    timestamp: new Date(Date.now() - 1000 * 60 * 7), // 7 min ago
    isRead: false,
    clickableLink: {
      type: 'course',
      id: 'course-mechanics',
      title: 'Quiz Mécanique',
      action: 'Faire le quiz'
    }
  },
  {
    id: 'personal-recommendation',
    type: 'personal',
    userId: 'system',
    userName: '💡 Recommandation',
    userAvatar: '/icons/lightbulb.svg',
    emoji: '📚',
    message: 'Le cours "Thermodynamique" pourrait t\'intéresser',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    isRead: false,
    clickableLink: {
      type: 'course',
      id: 'course-thermo',
      title: 'Thermodynamique',
      action: 'Découvrir'
    }
  },
  {
    id: 'personal-1',
    type: 'personal',
    userId: 'user-default',
    userName: 'Tu',
    userAvatar: '/avatars/user-default.jpg',
    emoji: '🎉',
    message: 'viens d\'ajouter une pierre à ton parcours scientifique — 80 XP gagnés !',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 min ago
    isRead: false
  },
  {
    id: 'personal-2',
    type: 'personal',
    userId: 'user-default',
    userName: 'Tu',
    userAvatar: '/avatars/user-default.jpg',
    emoji: '💎',
    message: 'as débloqué le badge "Esprit Curieux" — ta soif de savoir porte ses fruits !',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
    isRead: true
  },
  {
    id: 'personal-3',
    type: 'personal',
    userId: 'user-default',
    userName: 'Tu',
    userAvatar: '/avatars/user-default.jpg',
    emoji: '🚀',
    message: 'as lancé ta première semaine d\'étude — l\'aventure scientifique commence !',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true
  }
];

// Nouvelles données pour les séances du fondateur
const mockFounderSessions: SocialEvent[] = [
  // 1 LIVE
  {
    id: 'founder-live-1',
    type: 'founder-session',
    userId: 'founder-zak',
    userName: 'Zak',
    userAvatar: '/avatars/founder-zak.jpg',
    emoji: '🔴',
    message: 'est en LIVE pour répondre aux questions sur Intégrales',
    timestamp: new Date(),
    isRead: false,
    isLive: true,
    startTime: new Date(Date.now() - 1000 * 60 * 15), // Commencé il y a 15 min
    endTime: new Date(Date.now() + 1000 * 60 * 45), // Se termine dans 45 min
    studyRoomId: 'study-room-integrales-live',
    courseId: 'course-integrales',
    maxParticipants: 20,
    currentParticipants: 12,
    clickableLink: {
      type: 'study-room',
      id: 'study-room-integrales-live',
      title: 'Study Room LIVE : Intégrales'
    }
  },
  // 2 REPLAY
  {
    id: 'founder-replay-1',
    type: 'founder-session',
    userId: 'founder-zak',
    userName: 'Zak',
    userAvatar: '/avatars/founder-zak.jpg',
    emoji: '📺',
    message: 'vient de terminer une session sur la Loi de Gauss',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // Il y a 45 minutes
    isRead: false,
    isLive: false,
    startTime: new Date(Date.now() - 1000 * 60 * 105), // Commencé il y a 1h45
    endTime: new Date(Date.now() - 1000 * 60 * 45), // Terminé il y a 45 min
    studyRoomId: 'study-room-gauss',
    courseId: 'course-gauss',
    maxParticipants: 15,
    currentParticipants: 15,
    clickableLink: {
      type: 'study-room',
      id: 'study-room-gauss',
      title: 'Study Room : Loi de Gauss'
    }
  },
  {
    id: 'founder-replay-2',
    type: 'founder-session',
    userId: 'founder-zak',
    userName: 'Zak',
    userAvatar: '/avatars/founder-zak.jpg',
    emoji: '📺',
    message: 'a fait une session sur les Équilibres Chimiques',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // Il y a 2 heures
    isRead: false,
    isLive: false,
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // Commencé il y a 3h
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // Terminé il y a 2h
    studyRoomId: 'study-room-equilibres',
    courseId: 'course-equilibres',
    maxParticipants: 12,
    currentParticipants: 10,
    clickableLink: {
      type: 'study-room',
      id: 'study-room-equilibres',
      title: 'Study Room : Équilibres Chimiques'
    }
  },
  // 3 REGISTER (futures)
  {
    id: 'founder-register-1',
    type: 'founder-session',
    userId: 'founder-zak',
    userName: 'Zak',
    userAvatar: '/avatars/founder-zak.jpg',
    emoji: '📝',
    message: 'anime une séance Q&A sur les Suites et Limites',
    timestamp: new Date(Date.now() + 1000 * 60 * 60), // Dans 1 heure
    isRead: false,
    isLive: false,
    startTime: new Date(Date.now() + 1000 * 60 * 60), // Dans 1 heure
    endTime: new Date(Date.now() + 1000 * 60 * 120), // Dans 2 heures
    studyRoomId: 'study-room-suites-limites',
    courseId: 'course-suites-limites',
    maxParticipants: 18,
    currentParticipants: 7,
    clickableLink: {
      type: 'study-room',
      id: 'study-room-suites-limites',
      title: 'Study Room : Suites et Limites'
    }
  },
  {
    id: 'founder-register-2',
    type: 'founder-session',
    userId: 'founder-zak',
    userName: 'Zak',
    userAvatar: '/avatars/founder-zak.jpg',
    emoji: '📝',
    message: 'organise une session sur la Mécanique Classique',
    timestamp: new Date(Date.now() + 1000 * 60 * 60 * 3), // Dans 3 heures
    isRead: false,
    isLive: false,
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 3), // Dans 3 heures
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 4), // Dans 4 heures
    studyRoomId: 'study-room-mecanique',
    courseId: 'course-mecanique',
    maxParticipants: 15,
    currentParticipants: 4,
    clickableLink: {
      type: 'study-room',
      id: 'study-room-mecanique',
      title: 'Study Room : Mécanique Classique'
    }
  }
];

export class SocialFeedService {
  private static instance: SocialFeedService;
  
  public static getInstance(): SocialFeedService {
    if (!SocialFeedService.instance) {
      SocialFeedService.instance = new SocialFeedService();
    }
    return SocialFeedService.instance;
  }

  public getSocialFeed(context?: SocialFeedContext): SocialFeedData {
    const allEvents = [
      ...mockBuddyActivities,
      ...mockFacultyActivities,
      ...mockPersonalAchievements,
      ...mockFounderSessions,
      ...mockBattles,
      ...mockChallenges,
      ...mockDiscoveries
    ];

    // Filter events from last 48h and sort by timestamp
    const recentEvents = allEvents
      .filter(event => {
        const hoursDiff = (Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60);
        // Pour les séances du fondateur, inclure aussi les événements futurs (séances programmées)
        if (event.type === 'founder-session') {
          return Math.abs(hoursDiff) <= 48; // Inclut passé ET futur dans les 48h
        }
        return hoursDiff <= 48;
      })
      .sort((a, b) => {
        // Prioriser les séances LIVE en cours
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        // Puis trier par timestamp
        return b.timestamp.getTime() - a.timestamp.getTime();
      });

    const unreadCount = recentEvents.filter(event => !event.isRead).length;

    // Calculer l'énergie du réseau
    const networkEnergy = this.calculateNetworkEnergy(allEvents);

    // Générer un message contextuel intelligent
    const contextualMessage = this.generateContextualMessage(context, allEvents);

    // Filtrer et prioriser les événements selon le contexte
    const contextualBuddyActivities = this.filterByContext(
      this.groupSimilarEvents(
        mockBuddyActivities.filter(event => {
          const hoursDiff = (Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60);
          return hoursDiff <= 48;
        })
      ),
      context
    );

    return {
      buddyActivities: contextualBuddyActivities,
      facultyActivities: mockFacultyActivities.filter(event => {
        const hoursDiff = (Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60);
        return hoursDiff <= 48;
      }),
      personalAchievements: mockPersonalAchievements.filter(event => {
        const hoursDiff = (Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60);
        return hoursDiff <= 48;
      }),
      founderSessions: mockFounderSessions.filter(event => {
        const hoursDiff = (Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60);
        return Math.abs(hoursDiff) <= 48; // Inclut passé ET futur
      }).sort((a, b) => {
        // Prioriser les séances LIVE en cours
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        // Puis les séances à venir
        if (a.timestamp.getTime() > Date.now() && b.timestamp.getTime() <= Date.now()) return -1;
        if (a.timestamp.getTime() <= Date.now() && b.timestamp.getTime() > Date.now()) return 1;
        // Puis par timestamp
        return b.timestamp.getTime() - a.timestamp.getTime();
      }),
      unreadCount,
      networkEnergy,
      contextualMessage
    };
  }

  // Nouvelle méthode pour calculer l'énergie du réseau
  private calculateNetworkEnergy(allEvents: SocialEvent[]): NetworkEnergyMetrics {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    // Événements des dernières 24h
    const todayEvents = allEvents.filter(event => 
      event.timestamp.getTime() > oneDayAgo
    );
    
    // Calculer les métriques
    const todayActivities = todayEvents.length;
    const activeStudents = new Set(todayEvents.map(e => e.userId)).size;
    
    // Cours en tendance (le plus mentionné)
    const courseMentions: { [key: string]: number } = {};
    todayEvents.forEach(event => {
      if (event.courseId) {
        courseMentions[event.courseId] = (courseMentions[event.courseId] || 0) + 1;
      }
    });
    
    const trendingCourseId = Object.keys(courseMentions).reduce((a, b) => 
      courseMentions[a] > courseMentions[b] ? a : b, 'course-gauss'
    );
    
    const trendingCourse = trendingCourseId === 'course-gauss' ? 'Loi de Gauss' : 
                          trendingCourseId === 'course-integrales' ? 'Intégrales' :
                          trendingCourseId === 'course-math-analyse-1' ? 'Analyse Mathématique' :
                          'Physique';
    
    // Calculer le score d'énergie (0-100)
    const baseScore = Math.min(100, (todayActivities * 5) + (activeStudents * 3));
    const liveBonus = allEvents.some(e => e.isLive) ? 20 : 0;
    const score = Math.min(100, baseScore + liveBonus);
    
    // Déterminer le niveau et le message
    let level: NetworkEnergyMetrics['level'];
    let message: string;
    let emoji: string;
    
    if (score >= 85) {
      level = 'explosive';
      message = `Ton réseau explose de créativité ! ${todayActivities} activités aujourd'hui`;
      emoji = '🚀';
    } else if (score >= 65) {
      level = 'high';
      message = `Ton réseau est en pleine ébullition — ${todayActivities} activités aujourd'hui`;
      emoji = '🔥';
    } else if (score >= 35) {
      level = 'medium';
      message = `Ton réseau s'active doucement — ${activeStudents} étudiants connectés`;
      emoji = '⚡';
    } else {
      level = 'low';
      message = `Ton réseau se réveille — ${activeStudents} étudiants en ligne`;
      emoji = '🌱';
    }
    
    return {
      level,
      score,
      todayActivities,
      activeStudents,
      trendingCourse,
      message,
      emoji
    };
  }

  // Nouvelle méthode pour générer des messages contextuels intelligents
  private generateContextualMessage(context?: SocialFeedContext, allEvents?: SocialEvent[]): string | undefined {
    if (!context) {
      return undefined; // Pas de message par défaut
    }

    const courseNames: { [key: string]: string } = {
      'course-gauss': 'Loi de Gauss',
      'course-equilibres': 'Équilibres Chimiques',
      'course-integrales': 'Intégrales',
      'course-physique-mecanique': 'Mécanique Classique'
    };

    // Message contextuel selon le cours/pack actuel
    if (context.currentCourse) {
      const courseName = courseNames[context.currentCourse] || 'ce cours';
      const relatedEvents = allEvents?.filter(e => e.courseId === context.currentCourse) || [];
      
      if (relatedEvents.length > 0) {
        return `D'autres étudiants explorent aussi ${courseName} 🧲 — tu n'es pas seul dans cette aventure !`;
      } else {
        return `Tu es pionnier sur ${courseName} ! 🚀 Montre la voie à ta communauté.`;
      }
    }

    // Message selon les progrès récents
    if (context.userProgress?.recentlyCompleted?.length) {
      return `🎉 Bravo pour tes récents accomplissements ! Ton réseau te suit avec admiration.`;
    }

    // Message selon la série d'étude
    if (context.userProgress?.currentStreak && context.userProgress.currentStreak > 3) {
      return `🔥 ${context.userProgress.currentStreak} jours consécutifs ! Ton énergie inspire toute la communauté.`;
    }

    return undefined; // Pas de message si pas de contexte spécifique
  }

  // Nouvelle méthode pour filtrer par contexte
  private filterByContext(events: SocialEvent[], context?: SocialFeedContext): SocialEvent[] {
    if (!context) return events;

    // Prioriser les événements liés au cours/pack actuel
    const prioritizedEvents = events.sort((a, b) => {
      const aIsRelevant = (context.currentCourse && a.courseId === context.currentCourse) ||
                         (context.currentPack && a.courseId?.includes(context.currentPack));
      const bIsRelevant = (context.currentCourse && b.courseId === context.currentCourse) ||
                         (context.currentPack && b.courseId?.includes(context.currentPack));
      
      if (aIsRelevant && !bIsRelevant) return -1;
      if (!aIsRelevant && bIsRelevant) return 1;
      
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    return prioritizedEvents;
  }

  // Regroupement intelligent des événements similaires
  private groupSimilarEvents(events: SocialEvent[]): SocialEvent[] {
    const grouped: { [key: string]: SocialEvent[] } = {};
    const standalone: SocialEvent[] = [];

    // Grouper par clé similaire (même cours + même action dans les 2h)
    events.forEach(event => {
      if (event.courseId) {
        const actionType = this.extractActionType(event.message);
        const timeWindow = Math.floor(event.timestamp.getTime() / (1000 * 60 * 60 * 2)); // Fenêtre de 2h
        const groupKey = `${event.courseId}-${actionType}-${timeWindow}`;
        
        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
        }
        grouped[groupKey].push(event);
      } else {
        standalone.push(event);
      }
    });

    const result: SocialEvent[] = [];

    // Traiter les groupes
    Object.values(grouped).forEach(group => {
      if (group.length > 1) {
        // Créer un événement groupé
        const firstEvent = group[0];
        const participants = group.map(e => e.userName);
        const courseTitle = firstEvent.clickableLink?.title || 'un cours';
        
        const groupedEvent: SocialEvent = {
          ...firstEvent,
          id: `grouped-${group.map(e => e.id).join('-')}`,
          userName: participants.length === 2 
            ? `${participants[0]} et ${participants[1]}`
            : `${participants[0]} et ${participants.length - 1} autres`,
          message: this.generateGroupedMessage(firstEvent.message, participants.length, courseTitle),
          participants,
          isRead: group.every(e => e.isRead)
        };
        
        result.push(groupedEvent);
      } else {
        // Événement unique
        result.push(group[0]);
      }
    });

    // Ajouter les événements standalone
    result.push(...standalone);

    // Trier par timestamp
    return result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private extractActionType(message: string): string {
    if (message.includes('terminé') || message.includes('complété')) return 'completed';
    if (message.includes('débloqué')) return 'unlocked';
    if (message.includes('rejoint') || message.includes('Study Room')) return 'joined';
    if (message.includes('réussi') || message.includes('quiz')) return 'quiz';
    return 'general';
  }

  private generateGroupedMessage(originalMessage: string, count: number, courseTitle: string): string {
    const actionType = this.extractActionType(originalMessage);
    
    switch (actionType) {
      case 'completed':
        return `décodent ensemble les secrets de ${courseTitle}`;
      case 'unlocked':
        return `explorent de nouveaux territoires dans ${courseTitle}`;
      case 'joined':
        return `collaborent activement sur ${courseTitle}`;
      case 'quiz':
        return `brillent dans leurs évaluations de ${courseTitle}`;
      default:
        return `progressent ensemble dans ${courseTitle} — l'émulation collective !`;
    }
  }

  public markAllAsRead(): void {
    // In a real app, this would update the backend
    mockBuddyActivities.forEach(event => event.isRead = true);
    mockFacultyActivities.forEach(event => event.isRead = true);
    mockPersonalAchievements.forEach(event => event.isRead = true);
    
    console.log('🪩 SOCIAL FEED: Toutes les activités marquées comme lues');
  }

  public markEventAsRead(eventId: string): void {
    const allEvents = [
      ...mockBuddyActivities,
      ...mockFacultyActivities,
      ...mockPersonalAchievements
    ];
    
    const event = allEvents.find(e => e.id === eventId);
    if (event) {
      event.isRead = true;
      console.log(`🪩 SOCIAL FEED: Événement ${eventId} marqué comme lu`);
    }
  }

  public getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'À l\'instant';
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) { // 24h
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Il y a ${days}j`;
    }
  }

  // Simulate adding new events (for demo purposes) - Version "Science in Motion"
  public addBuddyActivity(userName: string, action: string, courseId?: string, emoji: string = '🎓'): void {
    const newEvent: SocialEvent = {
      id: `buddy-${Date.now()}`,
      type: 'buddy',
      userId: `user-${userName.toLowerCase()}`,
      userName,
      userAvatar: `/avatars/${userName.toLowerCase()}.jpg`,
      emoji,
      message: action,
      timestamp: new Date(),
      isRead: false,
      courseId,
      clickableLink: courseId ? {
        type: 'course',
        id: courseId,
        title: 'Cours'
      } : undefined
    };

    mockBuddyActivities.unshift(newEvent);
    console.log(`🪩 SCIENCE IN MOTION: Nouvelle activité narrative pour ${userName}`);
  }

  public addPersonalAchievement(message: string): void {
    const newEvent: SocialEvent = {
      id: `personal-${Date.now()}`,
      type: 'personal',
      userId: 'user-default',
      userName: 'Tu',
      userAvatar: '/avatars/user-default.jpg',
      emoji: '🏆',
      message,
      timestamp: new Date(),
      isRead: false
    };

    mockPersonalAchievements.unshift(newEvent);
    console.log(`🪩 SOCIAL FEED: Nouvel accomplissement personnel ajouté: ${message}`);
  }

  // Nouvelle méthode pour ajouter des séances du fondateur
  public addFounderSession(
    message: string, 
    courseId: string, 
    studyRoomId: string, 
    isLive: boolean = false,
    startTime?: Date,
    endTime?: Date,
    maxParticipants: number = 15
  ): void {
    const newEvent: SocialEvent = {
      id: `founder-${Date.now()}`,
      type: 'founder-session',
      userId: 'founder-zak',
      userName: 'Zak',
      userAvatar: '/avatars/founder-zak.jpg',
      emoji: isLive ? '🔴' : '🎓',
      message,
      timestamp: new Date(),
      isRead: false,
      isLive,
      startTime,
      endTime,
      studyRoomId,
      courseId,
      maxParticipants,
      currentParticipants: Math.floor(Math.random() * maxParticipants),
      clickableLink: {
        type: 'study-room',
        id: studyRoomId,
        title: `Study Room${isLive ? ' LIVE' : ''} : ${courseId}`
      }
    };

    mockFounderSessions.unshift(newEvent);
    console.log(`🪩 SOCIAL FEED: Nouvelle séance du fondateur ajoutée: ${message}`);
  }

  // Simuler des activités de buddies aléatoirement (pour la démo) - Version "Science in Motion"
  public startBuddySimulation(): void {
    const buddyNames = ['Sarah', 'Thomas', 'Marie', 'Alex', 'Emma', 'Lucas', 'Léa', 'Hugo'];
    const courseIds = ['course-gauss', 'course-equilibres', 'course-integrales', 'course-physique-mecanique'];
    
    // Messages narratifs Science Made Simple
    const narrativeActions = [
      { action: 'décode une nouvelle notion', emoji: '💡' },
      { action: 'perce les mystères', emoji: '🧠' },
      { action: 'explore de nouveaux territoires', emoji: '🗺️' },
      { action: 'franchit un nouveau cap', emoji: '🎓' },
      { action: 'atteint un nouveau niveau', emoji: '🚀' },
      { action: 'brille dans ses évaluations', emoji: '⭐' },
      { action: 'collabore activement', emoji: '🤝' },
      { action: 'progresse à vitesse grand V', emoji: '⚡' }
    ];

    const courseNames: { [key: string]: string } = {
      'course-gauss': 'Loi de Gauss',
      'course-equilibres': 'Équilibres Chimiques',
      'course-integrales': 'Intégrales',
      'course-physique-mecanique': 'Mécanique Classique'
    };

    // Ajouter une nouvelle activité toutes les 30-60 secondes
    const addRandomActivity = () => {
      const randomBuddy = buddyNames[Math.floor(Math.random() * buddyNames.length)];
      const randomCourse = courseIds[Math.floor(Math.random() * courseIds.length)];
      const randomAction = narrativeActions[Math.floor(Math.random() * narrativeActions.length)];
      const courseName = courseNames[randomCourse];
      
      // Messages narratifs inspirants
      const narrativeMessage = `${randomAction.action} en ${courseName}. L'aventure continue !`;
      
      this.addBuddyActivity(randomBuddy, narrativeMessage, randomCourse, randomAction.emoji);
      
      // Programmer la prochaine activité
      const nextInterval = 30000 + Math.random() * 30000; // 30-60 secondes
      setTimeout(addRandomActivity, nextInterval);
    };

    // Démarrer la simulation après 10 secondes
    setTimeout(addRandomActivity, 10000);
    console.log('🪩 SCIENCE IN MOTION: Simulation des activités narratives démarrée');
  }

  // Nouvelle simulation pour les séances du fondateur (FIGÉES à 5 séances)
  public startFounderSessionSimulation(): void {
    // Les séances sont maintenant figées dans mockFounderSessions
    // Pas de nouvelles séances ajoutées dynamiquement
    console.log('🪩 SOCIAL FEED: Séances du fondateur figées à 5 séances (1 live, 2 replay, 3 register)');
  }
}
