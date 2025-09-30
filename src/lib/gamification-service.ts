'use client';

import { StudyBadge, XPActivity, SocialNotification } from '@/types';

export class GamificationService {
  private static readonly XP_STORAGE_KEY = 'user_xp_v1';
  private static readonly BADGES_STORAGE_KEY = 'user_badges_v1';
  private static readonly ACTIVITIES_STORAGE_KEY = 'xp_activities_v1';
  private static readonly ACTIVITIES_KEY = 'xp_activities_v1';

  // ========================================================================
  // CONFIGURATION XP & NIVEAUX
  // ========================================================================

  static readonly XP_REWARDS = {
    'study-room-join': 10,
    'study-room-create': 25,
    'study-room-complete': 50, // Terminer une session complète
    'lesson-complete': 30,
    'quiz-perfect': 40,
    'buddy-help': 15,
    'course-complete': 200,
    'daily-streak': 20,
  };

  static readonly LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000,
    13000, 16500, 20500, 25000, 30000, 36000, 42500, 50000, 58000, 67000
  ];

  // ========================================================================
  // BADGES DISPONIBLES
  // ========================================================================

  static readonly AVAILABLE_BADGES: Omit<StudyBadge, 'unlockedAt' | 'progress'>[] = [
    // Study Rooms
    {
      id: 'first-room',
      name: 'Première Session',
      description: 'Rejoins ta première Study Room',
      icon: '🎥',
      color: 'bg-blue-500',
      rarity: 'common',
      category: 'study-rooms',
      maxProgress: 1
    },
    {
      id: 'room-creator',
      name: 'Créateur de Communauté',
      description: 'Crée 5 Study Rooms',
      icon: '🏗️',
      color: 'bg-purple-500',
      rarity: 'uncommon',
      category: 'study-rooms',
      maxProgress: 5
    },
    {
      id: 'active-participant',
      name: 'Participant Actif',
      description: 'Participe à 10 Study Rooms',
      icon: '⚡',
      color: 'bg-yellow-500',
      rarity: 'rare',
      category: 'study-rooms',
      maxProgress: 10
    },
    {
      id: 'marathon-student',
      name: 'Étudiant Marathon',
      description: 'Passe 5 heures en Study Rooms en une semaine',
      icon: '🏃‍♂️',
      color: 'bg-orange-500',
      rarity: 'epic',
      category: 'study-rooms',
      maxProgress: 300 // minutes
    },
    // Social
    {
      id: 'social-butterfly',
      name: 'Papillon Social',
      description: 'Ajoute 5 buddies',
      icon: '🦋',
      color: 'bg-pink-500',
      rarity: 'common',
      category: 'social',
      maxProgress: 5
    },
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Aide 10 buddies avec leurs questions',
      icon: '👨‍🏫',
      color: 'bg-green-500',
      rarity: 'rare',
      category: 'social',
      maxProgress: 10
    },
    // Progression
    {
      id: 'perfectionist',
      name: 'Perfectionniste',
      description: 'Obtiens 100% à 5 quiz consécutifs',
      icon: '💯',
      color: 'bg-indigo-500',
      rarity: 'epic',
      category: 'progression',
      maxProgress: 5
    },
    {
      id: 'streak-master',
      name: 'Maître de la Régularité',
      description: 'Maintiens une série de 7 jours consécutifs',
      icon: '🔥',
      color: 'bg-red-500',
      rarity: 'legendary',
      category: 'progression',
      maxProgress: 7
    }
  ];

  // ========================================================================
  // GESTION XP & NIVEAUX
  // ========================================================================

  static getUserXP(userId: string): number {
    const stored = localStorage.getItem(`${this.XP_STORAGE_KEY}_${userId}`);
    return stored ? parseInt(stored, 10) : 0;
  }

  static getUserLevel(userId: string): number {
    const xp = this.getUserXP(userId);
    return this.calculateLevel(xp);
  }

  static getCurrentLevel(userId: string): { level: number; currentXP: number; nextLevelXP: number; progress: number } {
    const currentXP = this.getUserXP(userId);
    const level = this.calculateLevel(currentXP);
    const nextLevelXP = this.LEVEL_THRESHOLDS[level + 1] || this.LEVEL_THRESHOLDS[this.LEVEL_THRESHOLDS.length - 1];
    const currentLevelXP = this.LEVEL_THRESHOLDS[level];
    const progress = nextLevelXP > currentLevelXP ? ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 100;
    
    return {
      level,
      currentXP,
      nextLevelXP,
      progress: Math.min(100, Math.max(0, progress))
    };
  }

  static calculateLevel(xp: number): number {
    for (let i = this.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= this.LEVEL_THRESHOLDS[i]) {
        return i;
      }
    }
    return 0;
  }

  static getXPToNextLevel(userId: string): number {
    const currentXP = this.getUserXP(userId);
    const currentLevel = this.calculateLevel(currentXP);
    const nextLevelThreshold = this.LEVEL_THRESHOLDS[currentLevel + 1];
    return nextLevelThreshold ? nextLevelThreshold - currentXP : 0;
  }

  static awardXP(userId: string, activityType: keyof typeof GamificationService.XP_REWARDS, relatedId?: string, description?: string): { newXP: number; levelUp: boolean; newLevel?: number } {
    const currentXP = this.getUserXP(userId);
    const currentLevel = this.getUserLevel(userId);
    const xpReward = this.XP_REWARDS[activityType];
    const newXP = currentXP + xpReward;
    
    // Sauvegarder le nouveau XP
    localStorage.setItem(`${this.XP_STORAGE_KEY}_${userId}`, newXP.toString());
    
    // Enregistrer l'activité
    const activity: XPActivity = {
      id: `xp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: activityType,
      xpEarned: xpReward,
      description: description || `Activité: ${activityType}`,
      timestamp: new Date(),
      relatedId
    };
    this.saveActivity(activity);
    
    const newLevel = this.calculateLevel(newXP);
    const levelUp = newLevel > currentLevel;
    
    // Vérifier les badges débloqués
    this.checkAndUnlockBadges(userId, activityType, relatedId);
    
    return { newXP, levelUp, newLevel: levelUp ? newLevel : undefined };
  }

  // ========================================================================
  // GESTION DES BADGES
  // ========================================================================

  static getUserBadges(userId: string): StudyBadge[] {
    const stored = localStorage.getItem(`${this.BADGES_STORAGE_KEY}_${userId}`);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored).map((badge: any) => ({
        ...badge,
        unlockedAt: new Date(badge.unlockedAt)
      }));
    } catch (error) {
      console.error('Erreur chargement badges:', error);
      return [];
    }
  }

  static unlockBadge(userId: string, badgeId: string): StudyBadge | null {
    const template = this.AVAILABLE_BADGES.find(b => b.id === badgeId);
    if (!template) return null;
    
    const userBadges = this.getUserBadges(userId);
    const existingBadge = userBadges.find(b => b.id === badgeId);
    
    if (existingBadge) return null; // Déjà débloqué
    
    const newBadge: StudyBadge = {
      ...template,
      unlockedAt: new Date(),
      progress: template.maxProgress || 1
    };
    
    const updatedBadges = [...userBadges, newBadge];
    localStorage.setItem(`${this.BADGES_STORAGE_KEY}_${userId}`, JSON.stringify(updatedBadges));
    
    return newBadge;
  }

  static updateBadgeProgress(userId: string, badgeId: string, newProgress: number): StudyBadge | null {
    const userBadges = this.getUserBadges(userId);
    const badge = userBadges.find(b => b.id === badgeId);
    
    if (!badge || !badge.maxProgress) return null;
    
    badge.progress = Math.min(newProgress, badge.maxProgress);
    
    localStorage.setItem(`${this.BADGES_STORAGE_KEY}_${userId}`, JSON.stringify(userBadges));
    
    return badge;
  }

  static checkAndUnlockBadges(userId: string, activityType: string, relatedId?: string): StudyBadge[] {
    const newBadges: StudyBadge[] = [];
    const activities = this.getUserActivities(userId);
    
    // Vérifier badge première Study Room
    if (activityType === 'study-room-join') {
      const firstRoomJoins = activities.filter(a => a.type === 'study-room-join').length;
      if (firstRoomJoins === 1) {
        const badge = this.unlockBadge(userId, 'first-room');
        if (badge) newBadges.push(badge);
      }
      
      // Badge participant actif (10 rooms)
      if (firstRoomJoins >= 10) {
        const badge = this.unlockBadge(userId, 'active-participant');
        if (badge) newBadges.push(badge);
      }
    }
    
    // Vérifier badge créateur de communauté
    if (activityType === 'study-room-create') {
      const roomsCreated = activities.filter(a => a.type === 'study-room-create').length;
      if (roomsCreated >= 5) {
        const badge = this.unlockBadge(userId, 'room-creator');
        if (badge) newBadges.push(badge);
      }
    }
    
    // Vérifier badge perfectionniste
    if (activityType === 'quiz-perfect') {
      const perfectQuizzes = activities.filter(a => a.type === 'quiz-perfect').length;
      if (perfectQuizzes >= 5) {
        const badge = this.unlockBadge(userId, 'perfectionist');
        if (badge) newBadges.push(badge);
      }
    }
    
    return newBadges;
  }

  // ========================================================================
  // GESTION DES ACTIVITÉS
  // ========================================================================

  static saveActivity(activity: XPActivity): void {
    const stored = localStorage.getItem(this.ACTIVITIES_KEY);
    const activities = stored ? JSON.parse(stored) : [];
    activities.push(activity);
    
    // Garder seulement les 1000 dernières activités pour la performance
    if (activities.length > 1000) {
      activities.splice(0, activities.length - 1000);
    }
    
    localStorage.setItem(this.ACTIVITIES_KEY, JSON.stringify(activities));
  }

  static getUserActivities(userId: string, limit = 50): XPActivity[] {
    const stored = localStorage.getItem(this.ACTIVITIES_KEY);
    if (!stored) return [];
    
    try {
      const allActivities = JSON.parse(stored);
      return allActivities
        .filter((activity: XPActivity) => activity.userId === userId)
        .map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        }))
        .sort((a: XPActivity, b: XPActivity) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Erreur chargement activités:', error);
      return [];
    }
  }

  // Alias pour la méthode getUserActivities
  static getXPActivities(userId: string, limit = 50): XPActivity[] {
    return this.getUserActivities(userId, limit);
  }

  // ========================================================================
  // UTILITAIRES
  // ========================================================================

  static getRarityColor(rarity: StudyBadge['rarity']): string {
    const colors = {
      common: 'text-gray-600 bg-gray-100',
      uncommon: 'text-green-600 bg-green-100',
      rare: 'text-blue-600 bg-blue-100',
      epic: 'text-purple-600 bg-purple-100',
      legendary: 'text-yellow-600 bg-yellow-100'
    };
    return colors[rarity];
  }

  static getLevelProgress(userId: string): { current: number; next: number; percentage: number } {
    const currentXP = this.getUserXP(userId);
    const currentLevel = this.calculateLevel(currentXP);
    const currentLevelXP = this.LEVEL_THRESHOLDS[currentLevel];
    const nextLevelXP = this.LEVEL_THRESHOLDS[currentLevel + 1] || currentLevelXP;
    
    const progressInLevel = currentXP - currentLevelXP;
    const totalLevelXP = nextLevelXP - currentLevelXP;
    const percentage = totalLevelXP > 0 ? (progressInLevel / totalLevelXP) * 100 : 100;
    
    return {
      current: currentLevel,
      next: currentLevel + 1,
      percentage: Math.min(percentage, 100)
    };
  }
}
