'use client';

// 🎯 Service XP et Gamification - Science Made Simple
// Système de progression bienveillant et motivant

export interface XPAction {
  id: string;
  type: 'lesson_unlock' | 'lesson_complete' | 'course_complete' | 'pack_complete' | 
        'study_room' | 'buddy_support' | 'buddy_thanks' | 'wallet_recharge' | 
        'daily_streak' | 'goal_achieved';
  points: number;
  title: string;
  description: string;
  emoji: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface XPLevel {
  level: number;
  title: string;
  emoji: string;
  minXP: number;
  maxXP: number;
  description: string;
  rewards?: string[];
}

export interface UserXPProfile {
  totalXP: number;
  currentLevel: XPLevel;
  nextLevel: XPLevel | null;
  progressToNext: number; // Pourcentage vers le niveau suivant
  badges: Badge[];
  recentActions: XPAction[];
  dailyStreak: number;
  lastActiveDate: Date;
}

export class XPService {
  private static instance: XPService;
  
  // 🏅 Définition des niveaux de progression
  private readonly levels: XPLevel[] = [
    {
      level: 1,
      title: 'Apprenant',
      emoji: '🪴',
      minXP: 0,
      maxXP: 199,
      description: 'Tu débutes ton parcours sur SMS',
      rewards: ['Accès aux cours de base']
    },
    {
      level: 2,
      title: 'Engagé',
      emoji: '🌱',
      minXP: 200,
      maxXP: 499,
      description: 'Tu progresses vite et restes régulier',
      rewards: ['Accès aux Study Rooms', 'Bonus recharge +5%']
    },
    {
      level: 3,
      title: 'Avancé',
      emoji: '🔥',
      minXP: 500,
      maxXP: 999,
      description: 'Tu maîtrises ton rythme et inspires les autres',
      rewards: ['Early access nouvelles fonctionnalités', 'Bonus recharge +10%']
    },
    {
      level: 4,
      title: 'Expert',
      emoji: '⚡',
      minXP: 1000,
      maxXP: 1999,
      description: 'Tu incarnes l\'excellence et la rigueur',
      rewards: ['Accès masterclass exclusives', 'Bonus recharge +15%']
    },
    {
      level: 5,
      title: 'Mentor',
      emoji: '🧭',
      minXP: 2000,
      maxXP: Infinity,
      description: 'Tu deviens une référence pour la communauté',
      rewards: ['Statut ambassadeur', 'Accès outils premium', 'Bonus recharge +20%']
    }
  ];

  // 🏆 Définition des badges
  private readonly badgeDefinitions: Omit<Badge, 'isUnlocked' | 'unlockedAt'>[] = [
    {
      id: 'first-step',
      name: 'Premier pas',
      emoji: '🏁',
      description: 'Première leçon terminée',
      condition: 'complete_first_lesson'
    },
    {
      id: 'pack-master',
      name: 'Pack Master',
      emoji: '🧩',
      description: 'Premier pack complété',
      condition: 'complete_first_pack'
    },
    {
      id: 'loyal-recharger',
      name: 'Rechargeur fidèle',
      emoji: '💎',
      description: 'A effectué 3 recharges',
      condition: 'recharge_3_times'
    },
    {
      id: 'team-spirit',
      name: 'Esprit d\'équipe',
      emoji: '🧠',
      description: 'A interagi 5 fois avec ses buddies',
      condition: 'buddy_interactions_5'
    },
    {
      id: 'consistent',
      name: 'Régulier',
      emoji: '🔥',
      description: '7 jours de connexion d\'affilée',
      condition: 'daily_streak_7'
    },
    {
      id: 'curious',
      name: 'Curieux',
      emoji: '🪶',
      description: '5 cours consultés sans achat',
      condition: 'preview_5_courses'
    },
    {
      id: 'pioneer',
      name: 'Pionnier',
      emoji: '🧬',
      description: 'Premier à compléter un nouveau pack dans sa faculté',
      condition: 'first_pack_completion_faculty'
    },
    {
      id: 'knowledge-seeker',
      name: 'Chercheur de savoir',
      emoji: '🔍',
      description: 'A terminé 10 leçons',
      condition: 'complete_10_lessons'
    },
    {
      id: 'course-champion',
      name: 'Champion des cours',
      emoji: '🏆',
      description: 'A complété 5 cours',
      condition: 'complete_5_courses'
    },
    {
      id: 'study-buddy',
      name: 'Study Buddy',
      emoji: '🤝',
      description: 'A participé à 10 sessions Study Room',
      condition: 'study_room_10_sessions'
    }
  ];

  // 🎯 Actions XP avec leurs valeurs
  private readonly xpActions: { [key: string]: Omit<XPAction, 'id'> } = {
    lesson_unlock: {
      type: 'lesson_unlock',
      points: 10,
      title: 'Leçon débloquée',
      description: 'Tu as débloqué une nouvelle leçon',
      emoji: '🎓'
    },
    lesson_complete: {
      type: 'lesson_complete',
      points: 20,
      title: 'Leçon terminée',
      description: 'Tu as terminé une leçon avec succès',
      emoji: '📘'
    },
    course_complete: {
      type: 'course_complete',
      points: 50,
      title: 'Cours complété',
      description: 'Tu as terminé toutes les leçons d\'un cours',
      emoji: '📦'
    },
    pack_complete: {
      type: 'pack_complete',
      points: 150,
      title: 'Pack complété',
      description: 'Tu as terminé tous les cours d\'un pack',
      emoji: '🧠'
    },
    study_room: {
      type: 'study_room',
      points: 15,
      title: 'Session d\'étude',
      description: 'Tu as participé à une Study Room',
      emoji: '💬'
    },
    buddy_support: {
      type: 'buddy_support',
      points: 5,
      title: 'Soutien buddy',
      description: 'Tu as aidé un buddy',
      emoji: '🫶'
    },
    buddy_thanks: {
      type: 'buddy_thanks',
      points: 10,
      title: 'Buddy reconnaissant',
      description: 'Un buddy t\'a remercié',
      emoji: '💡'
    },
    wallet_recharge: {
      type: 'wallet_recharge',
      points: 5, // Par tranche de 100€
      title: 'Recharge portefeuille',
      description: 'Tu as rechargé ton portefeuille',
      emoji: '💰'
    },
    daily_streak: {
      type: 'daily_streak',
      points: 10,
      title: 'Connexion quotidienne',
      description: 'Tu maintiens ta série de connexions',
      emoji: '🔥'
    },
    goal_achieved: {
      type: 'goal_achieved',
      points: 50,
      title: 'Objectif atteint',
      description: 'Tu as respecté ta planification',
      emoji: '🏆'
    }
  };

  public static getInstance(): XPService {
    if (!XPService.instance) {
      XPService.instance = new XPService();
    }
    return XPService.instance;
  }

  // 🎯 Obtenir le profil XP actuel de l'utilisateur
  public getUserXPProfile(): UserXPProfile {
    const savedProfile = localStorage.getItem('userXPProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      // Reconstituer les dates
      profile.lastActiveDate = new Date(profile.lastActiveDate);
      profile.recentActions = profile.recentActions.map((action: any) => ({
        ...action,
        timestamp: new Date(action.timestamp)
      }));
      profile.badges = profile.badges.map((badge: any) => ({
        ...badge,
        unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined
      }));
      
      return this.updateProfileWithCurrentLevel(profile);
    }

    // Profil par défaut pour un nouvel utilisateur
    return this.createDefaultProfile();
  }

  // 🆕 Créer un profil par défaut
  private createDefaultProfile(): UserXPProfile {
    const currentLevel = this.levels[0];
    const nextLevel = this.levels[1];
    
    return {
      totalXP: 0,
      currentLevel,
      nextLevel,
      progressToNext: 0,
      badges: this.badgeDefinitions.map(badge => ({
        ...badge,
        isUnlocked: false
      })),
      recentActions: [],
      dailyStreak: 0,
      lastActiveDate: new Date()
    };
  }

  // 🔄 Mettre à jour le niveau actuel selon l'XP
  private updateProfileWithCurrentLevel(profile: UserXPProfile): UserXPProfile {
    const currentLevel = this.getLevelByXP(profile.totalXP);
    const nextLevel = this.getNextLevel(currentLevel.level);
    
    let progressToNext = 0;
    if (nextLevel) {
      const xpInCurrentLevel = profile.totalXP - currentLevel.minXP;
      const xpNeededForNext = nextLevel.minXP - currentLevel.minXP;
      progressToNext = Math.min(100, (xpInCurrentLevel / xpNeededForNext) * 100);
    } else {
      progressToNext = 100; // Niveau max atteint
    }

    return {
      ...profile,
      currentLevel,
      nextLevel,
      progressToNext
    };
  }

  // 📊 Obtenir le niveau selon l'XP
  private getLevelByXP(totalXP: number): XPLevel {
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (totalXP >= this.levels[i].minXP) {
        return this.levels[i];
      }
    }
    return this.levels[0];
  }

  // ➡️ Obtenir le niveau suivant
  private getNextLevel(currentLevel: number): XPLevel | null {
    return this.levels.find(level => level.level === currentLevel + 1) || null;
  }

  // ⭐ Ajouter de l'XP pour une action
  public addXP(actionType: string, multiplier: number = 1, context?: string): {
    xpGained: number;
    newLevel?: XPLevel;
    newBadges: Badge[];
    profile: UserXPProfile;
  } {
    const profile = this.getUserXPProfile();
    const action = this.xpActions[actionType];
    
    if (!action) {
      console.warn(`Action XP inconnue: ${actionType}`);
      return { xpGained: 0, newBadges: [], profile };
    }

    const xpGained = action.points * multiplier;
    const oldLevel = profile.currentLevel;
    
    // Mettre à jour l'XP total
    profile.totalXP += xpGained;
    
    // Ajouter l'action récente
    const newAction: XPAction = {
      id: `${actionType}-${Date.now()}`,
      ...action,
      points: xpGained
    };
    
    profile.recentActions.unshift(newAction);
    // Garder seulement les 10 dernières actions
    profile.recentActions = profile.recentActions.slice(0, 10);
    
    // Mettre à jour le niveau
    const updatedProfile = this.updateProfileWithCurrentLevel(profile);
    const newLevel = updatedProfile.currentLevel.level > oldLevel.level ? updatedProfile.currentLevel : undefined;
    
    // Vérifier les nouveaux badges
    const newBadges = this.checkAndUnlockBadges(updatedProfile, actionType, context);
    
    // Sauvegarder
    this.saveProfile(updatedProfile);
    
    console.log(`🎯 XP SYSTEM: +${xpGained} XP pour ${actionType}`, {
      totalXP: updatedProfile.totalXP,
      level: updatedProfile.currentLevel.title,
      newBadges: newBadges.map(b => b.name)
    });

    return {
      xpGained,
      newLevel,
      newBadges,
      profile: updatedProfile
    };
  }

  // 🏆 Vérifier et débloquer les badges
  private checkAndUnlockBadges(profile: UserXPProfile, actionType: string, context?: string): Badge[] {
    const newBadges: Badge[] = [];
    
    // Logique de débloquage des badges
    profile.badges.forEach(badge => {
      if (badge.isUnlocked) return;
      
      let shouldUnlock = false;
      
      switch (badge.condition) {
        case 'complete_first_lesson':
          shouldUnlock = actionType === 'lesson_complete';
          break;
        case 'complete_first_pack':
          shouldUnlock = actionType === 'pack_complete';
          break;
        case 'recharge_3_times':
          const rechargeCount = profile.recentActions.filter(a => a.type === 'wallet_recharge').length;
          shouldUnlock = rechargeCount >= 3;
          break;
        case 'buddy_interactions_5':
          const buddyCount = profile.recentActions.filter(a => 
            a.type === 'buddy_support' || a.type === 'buddy_thanks'
          ).length;
          shouldUnlock = buddyCount >= 5;
          break;
        case 'daily_streak_7':
          shouldUnlock = profile.dailyStreak >= 7;
          break;
        case 'complete_10_lessons':
          const lessonCount = profile.recentActions.filter(a => a.type === 'lesson_complete').length;
          shouldUnlock = lessonCount >= 10;
          break;
        case 'complete_5_courses':
          const courseCount = profile.recentActions.filter(a => a.type === 'course_complete').length;
          shouldUnlock = courseCount >= 5;
          break;
        case 'study_room_10_sessions':
          const studyRoomCount = profile.recentActions.filter(a => a.type === 'study_room').length;
          shouldUnlock = studyRoomCount >= 10;
          break;
      }
      
      if (shouldUnlock) {
        badge.isUnlocked = true;
        badge.unlockedAt = new Date();
        newBadges.push(badge);
      }
    });
    
    return newBadges;
  }

  // 💾 Sauvegarder le profil
  private saveProfile(profile: UserXPProfile): void {
    localStorage.setItem('userXPProfile', JSON.stringify(profile));
  }

  // 🔥 Mettre à jour la série quotidienne
  public updateDailyStreak(): { streakUpdated: boolean; xpGained: number; profile: UserXPProfile } {
    const profile = this.getUserXPProfile();
    const today = new Date();
    const lastActive = new Date(profile.lastActiveDate);
    
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    let xpGained = 0;
    let streakUpdated = false;
    
    if (daysDiff === 1) {
      // Série continue
      profile.dailyStreak += 1;
      streakUpdated = true;
      
      // XP bonus à partir du 3ème jour
      if (profile.dailyStreak >= 3) {
        const result = this.addXP('daily_streak');
        xpGained = result.xpGained;
      }
    } else if (daysDiff > 1) {
      // Série cassée
      profile.dailyStreak = 1;
      streakUpdated = true;
    }
    // daysDiff === 0 : même jour, pas de changement
    
    profile.lastActiveDate = today;
    this.saveProfile(profile);
    
    return { streakUpdated, xpGained, profile };
  }

  // 📈 Obtenir les statistiques XP
  public getXPStats(): {
    totalUsers: number;
    averageXP: number;
    levelDistribution: { [level: string]: number };
    topBadges: { badge: string; count: number }[];
  } {
    // Simulation de stats (dans une vraie app, ça viendrait de la DB)
    return {
      totalUsers: 1247,
      averageXP: 342,
      levelDistribution: {
        'Apprenant': 45,
        'Engagé': 32,
        'Avancé': 18,
        'Expert': 4,
        'Mentor': 1
      },
      topBadges: [
        { badge: 'Premier pas', count: 89 },
        { badge: 'Régulier', count: 67 },
        { badge: 'Curieux', count: 54 }
      ]
    };
  }

  // 🎁 Obtenir les récompenses disponibles selon le niveau
  public getAvailableRewards(level: number): string[] {
    const userLevel = this.levels.find(l => l.level === level);
    return userLevel?.rewards || [];
  }

  // 🧮 Calculer l'XP pour une recharge (par tranche de 100€)
  public calculateRechargeXP(amount: number): number {
    return Math.floor(amount / 100) * this.xpActions.wallet_recharge.points;
  }
}


