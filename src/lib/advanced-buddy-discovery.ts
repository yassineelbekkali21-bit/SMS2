'use client';

import { BuddyDiscovery, Course } from '@/types';
import { GamificationService } from './gamification-service';

export interface AdvancedBuddyProfile {
  userId: string;
  name: string;
  avatar?: string;
  faculty: string;
  
  // Données de progression
  courses: string[];
  completedLessons: { [courseId: string]: number };
  totalXP: number;
  level: number;
  badges: string[];
  
  // Données d'activité
  lastActivity: Date;
  studyRoomParticipations: number;
  studyRoomCreations: number;
  averageSessionDuration: number; // minutes
  preferredStudyTimes: string[]; // ['morning', 'afternoon', 'evening', 'night']
  
  // Données sociales
  existingBuddies: string[];
  responsiveness: number; // 0-100, based on response time to messages/invites
  helpfulness: number; // 0-100, based on helping others
}

export class AdvancedBuddyDiscovery {
  private static readonly DISCOVERY_WEIGHTS = {
    commonCourses: 0.25,
    progressionSimilarity: 0.20,
    activityLevel: 0.15,
    studyTimeCompatibility: 0.15,
    socialCompatibility: 0.10,
    gamificationAlignment: 0.10,
    responsiveness: 0.05
  };

  // ========================================================================
  // ALGORITHME DE DÉCOUVERTE AVANCÉ
  // ========================================================================

  static discoverBuddies(
    userId: string, 
    userProfile: AdvancedBuddyProfile,
    availableProfiles: AdvancedBuddyProfile[],
    limit = 10
  ): BuddyDiscovery[] {
    console.log('🔍 ADVANCED DISCOVERY: Recherche de buddies pour', userProfile.name);

    const candidates = availableProfiles
      .filter(profile => 
        profile.userId !== userId && 
        !userProfile.existingBuddies.includes(profile.userId)
      )
      .map(candidate => ({
        ...this.convertToDiscoveryFormat(candidate),
        compatibilityScore: this.calculateAdvancedCompatibility(userProfile, candidate),
        compatibilityReasons: this.getCompatibilityReasons(userProfile, candidate)
      }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);

    console.log('✅ Trouvé', candidates.length, 'candidats avec scores:', 
      candidates.map(c => ({ name: c.name, score: c.compatibilityScore.toFixed(2) })));

    return candidates;
  }

  private static calculateAdvancedCompatibility(
    user: AdvancedBuddyProfile, 
    candidate: AdvancedBuddyProfile
  ): number {
    const scores = {
      commonCourses: this.calculateCommonCoursesScore(user, candidate),
      progressionSimilarity: this.calculateProgressionSimilarity(user, candidate),
      activityLevel: this.calculateActivityCompatibility(user, candidate),
      studyTimeCompatibility: this.calculateStudyTimeCompatibility(user, candidate),
      socialCompatibility: this.calculateSocialCompatibility(user, candidate),
      gamificationAlignment: this.calculateGamificationAlignment(user, candidate),
      responsiveness: candidate.responsiveness / 100
    };

    const weightedScore = Object.entries(scores).reduce((total, [key, score]) => {
      const weight = this.DISCOVERY_WEIGHTS[key as keyof typeof this.DISCOVERY_WEIGHTS];
      return total + (score * weight);
    }, 0);

    console.log(`📊 Compatibilité ${user.name} ↔ ${candidate.name}:`, {
      scores,
      weightedScore: weightedScore.toFixed(3)
    });

    return weightedScore;
  }

  // ========================================================================
  // CALCULS DE COMPATIBILITÉ SPÉCIALISÉS
  // ========================================================================

  private static calculateCommonCoursesScore(user: AdvancedBuddyProfile, candidate: AdvancedBuddyProfile): number {
    const commonCourses = user.courses.filter(course => candidate.courses.includes(course));
    const totalCourses = Math.max(user.courses.length, candidate.courses.length);
    
    if (totalCourses === 0) return 0;
    
    // Bonus pour plus de 3 cours en commun
    const baseScore = commonCourses.length / totalCourses;
    const bonus = commonCourses.length >= 3 ? 0.2 : 0;
    
    return Math.min(baseScore + bonus, 1);
  }

  private static calculateProgressionSimilarity(user: AdvancedBuddyProfile, candidate: AdvancedBuddyProfile): number {
    // Similarité basée sur les niveaux et l'avancement dans les cours communs
    const levelDifference = Math.abs(user.level - candidate.level);
    const levelSimilarity = Math.max(0, 1 - levelDifference / 20); // Tolérance de 20 niveaux
    
    // Vérifier l'avancement dans les cours communs
    const commonCourses = user.courses.filter(course => candidate.courses.includes(course));
    let progressionSimilarity = 0;
    
    if (commonCourses.length > 0) {
      const progressionDifferences = commonCourses.map(courseId => {
        const userProgress = user.completedLessons[courseId] || 0;
        const candidateProgress = candidate.completedLessons[courseId] || 0;
        const maxProgress = Math.max(userProgress, candidateProgress, 10); // Min 10 pour éviter division par 0
        return 1 - Math.abs(userProgress - candidateProgress) / maxProgress;
      });
      
      progressionSimilarity = progressionDifferences.reduce((sum, diff) => sum + diff, 0) / progressionDifferences.length;
    }
    
    return (levelSimilarity * 0.4) + (progressionSimilarity * 0.6);
  }

  private static calculateActivityCompatibility(user: AdvancedBuddyProfile, candidate: AdvancedBuddyProfile): number {
    // Compatibilité basée sur l'activité récente et les habitudes d'étude
    const daysSinceUserActivity = Math.max(0, (Date.now() - user.lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceCandidateActivity = Math.max(0, (Date.now() - candidate.lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    // Préférence pour les utilisateurs actifs récemment (moins de 7 jours)
    const userActivityScore = Math.max(0, 1 - daysSinceUserActivity / 7);
    const candidateActivityScore = Math.max(0, 1 - daysSinceCandidateActivity / 7);
    
    // Compatibilité des durées de session
    const sessionDurationDiff = Math.abs(user.averageSessionDuration - candidate.averageSessionDuration);
    const sessionCompatibility = Math.max(0, 1 - sessionDurationDiff / 120); // Tolérance de 2h
    
    return (userActivityScore * 0.3) + (candidateActivityScore * 0.3) + (sessionCompatibility * 0.4);
  }

  private static calculateStudyTimeCompatibility(user: AdvancedBuddyProfile, candidate: AdvancedBuddyProfile): number {
    const commonTimeSlots = user.preferredStudyTimes.filter(time => 
      candidate.preferredStudyTimes.includes(time)
    );
    
    const totalTimeSlots = Math.max(user.preferredStudyTimes.length, candidate.preferredStudyTimes.length);
    if (totalTimeSlots === 0) return 0.5; // Score neutre si aucune préférence
    
    return commonTimeSlots.length / totalTimeSlots;
  }

  private static calculateSocialCompatibility(user: AdvancedBuddyProfile, candidate: AdvancedBuddyProfile): number {
    // Basé sur l'entraide et la participation sociale
    const helpfulnessAlignment = 1 - Math.abs(user.helpfulness - candidate.helpfulness) / 100;
    
    // Bonus si l'un des deux a beaucoup d'amis (peut introduire l'autre dans son réseau)
    const networkBonus = Math.max(user.existingBuddies.length, candidate.existingBuddies.length) >= 5 ? 0.2 : 0;
    
    return Math.min(helpfulnessAlignment + networkBonus, 1);
  }

  private static calculateGamificationAlignment(user: AdvancedBuddyProfile, candidate: AdvancedBuddyProfile): number {
    // Alignement des badges et objectifs de gamification
    const commonBadges = user.badges.filter(badge => candidate.badges.includes(badge));
    const totalBadges = Math.max(user.badges.length, candidate.badges.length);
    
    if (totalBadges === 0) return 0.5; // Score neutre
    
    const badgeAlignment = commonBadges.length / totalBadges;
    
    // XP similarity (prefer similar levels of engagement)
    const xpDifference = Math.abs(user.totalXP - candidate.totalXP);
    const maxXP = Math.max(user.totalXP, candidate.totalXP, 1000); // Min 1000 pour éviter division par 0
    const xpAlignment = 1 - Math.min(xpDifference / maxXP, 1);
    
    return (badgeAlignment * 0.6) + (xpAlignment * 0.4);
  }

  // ========================================================================
  // RAISONS DE COMPATIBILITÉ
  // ========================================================================

  private static getCompatibilityReasons(user: AdvancedBuddyProfile, candidate: AdvancedBuddyProfile): string[] {
    const reasons: string[] = [];
    
    const commonCourses = user.courses.filter(course => candidate.courses.includes(course));
    if (commonCourses.length >= 2) {
      reasons.push(`${commonCourses.length} cours en commun`);
    }
    
    const levelDiff = Math.abs(user.level - candidate.level);
    if (levelDiff <= 3) {
      reasons.push('Niveau similaire');
    }
    
    const commonTimeSlots = user.preferredStudyTimes.filter(time => 
      candidate.preferredStudyTimes.includes(time)
    );
    if (commonTimeSlots.length >= 2) {
      reasons.push('Horaires compatibles');
    }
    
    if (candidate.responsiveness >= 80) {
      reasons.push('Très réactif');
    }
    
    if (candidate.helpfulness >= 80) {
      reasons.push('Très serviable');
    }
    
    const daysSinceActivity = (Date.now() - candidate.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity <= 1) {
      reasons.push('Actif récemment');
    }
    
    return reasons;
  }

  // ========================================================================
  // CONVERSION ET UTILITAIRES
  // ========================================================================

  private static convertToDiscoveryFormat(profile: AdvancedBuddyProfile): BuddyDiscovery {
    return {
      userId: profile.userId,
      name: profile.name,
      avatar: profile.avatar,
      faculty: profile.faculty,
      commonCourses: [], // Sera calculé dynamiquement
      mutualBuddies: 0, // Sera calculé dynamiquement
      isOnPlatform: true,
      progressionSimilarity: 0, // Sera calculé dynamiquement
      recentActivity: (Date.now() - profile.lastActivity.getTime()) / (1000 * 60 * 60 * 24) <= 3,
      studyRoomCompatibility: Math.min(profile.studyRoomParticipations * 10, 100)
    };
  }

  // ========================================================================
  // GÉNÉRATION DE DONNÉES MOCK RÉALISTES
  // ========================================================================

  static generateMockProfiles(): AdvancedBuddyProfile[] {
    const profiles: AdvancedBuddyProfile[] = [
      {
        userId: 'user_emma_advanced',
        name: 'Emma Rousseau',
        avatar: '/avatars/emma.jpg',
        faculty: 'Sciences',
        courses: ['loi-gauss', 'integrales', 'analyse-math', 'mecanique'],
        completedLessons: { 'loi-gauss': 8, 'integrales': 12, 'analyse-math': 5, 'mecanique': 3 },
        totalXP: 2450,
        level: 12,
        badges: ['active-participant', 'perfectionist', 'social-butterfly'],
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        studyRoomParticipations: 15,
        studyRoomCreations: 3,
        averageSessionDuration: 90,
        preferredStudyTimes: ['morning', 'afternoon'],
        existingBuddies: ['user_1', 'user_2'],
        responsiveness: 95,
        helpfulness: 88
      },
      {
        userId: 'user_lucas_advanced',
        name: 'Lucas Dubois',
        avatar: '/avatars/lucas.jpg',
        faculty: 'Sciences',
        courses: ['mecanique', 'forces', 'equilibres', 'loi-gauss'],
        completedLessons: { 'mecanique': 15, 'forces': 10, 'equilibres': 7, 'loi-gauss': 6 },
        totalXP: 1890,
        level: 9,
        badges: ['first-room', 'room-creator', 'mentor'],
        lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h ago
        studyRoomParticipations: 22,
        studyRoomCreations: 8,
        averageSessionDuration: 75,
        preferredStudyTimes: ['evening', 'night'],
        existingBuddies: ['user_3'],
        responsiveness: 82,
        helpfulness: 94
      },
      {
        userId: 'user_chloe_advanced',
        name: 'Chloé Martin',
        avatar: '/avatars/chloe.jpg',
        faculty: 'Sciences',
        courses: ['integrales', 'analyse-math', 'suites-limites'],
        completedLessons: { 'integrales': 20, 'analyse-math': 18, 'suites-limites': 14 },
        totalXP: 3200,
        level: 16,
        badges: ['perfectionist', 'marathon-student', 'active-participant', 'social-butterfly'],
        lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30min ago
        studyRoomParticipations: 35,
        studyRoomCreations: 12,
        averageSessionDuration: 120,
        preferredStudyTimes: ['afternoon', 'evening'],
        existingBuddies: ['user_4', 'user_5', 'user_6'],
        responsiveness: 98,
        helpfulness: 92
      }
    ];

    return profiles;
  }

  static getMockUserProfile(userId: string): AdvancedBuddyProfile {
    return {
      userId,
      name: 'Vous',
      faculty: 'Sciences',
      courses: ['loi-gauss', 'integrales', 'mecanique', 'forces'],
      completedLessons: { 'loi-gauss': 10, 'integrales': 8, 'mecanique': 5, 'forces': 7 },
      totalXP: GamificationService.getUserXP(userId),
      level: GamificationService.calculateLevel(GamificationService.getUserXP(userId)),
      badges: GamificationService.getUserBadges(userId).map(b => b.id),
      lastActivity: new Date(),
      studyRoomParticipations: 12,
      studyRoomCreations: 2,
      averageSessionDuration: 85,
      preferredStudyTimes: ['afternoon', 'evening'],
      existingBuddies: [],
      responsiveness: 85,
      helpfulness: 78
    };
  }

  // ========================================================================
  // MÉTHODES DE DEBUG
  // ========================================================================

  static debugCompatibility(userId: string): void {
    console.log('🔍 DEBUG ADVANCED BUDDY DISCOVERY');
    
    const userProfile = this.getMockUserProfile(userId);
    const availableProfiles = this.generateMockProfiles();
    
    console.log('👤 Profil utilisateur:', userProfile);
    console.log('🎯 Profils disponibles:', availableProfiles.length);
    
    const discoveries = this.discoverBuddies(userId, userProfile, availableProfiles);
    
    console.log('✅ Résultats de découverte:', discoveries);
    
    discoveries.forEach(discovery => {
      console.log(`📊 ${discovery.name}: Score ${discovery.compatibilityScore?.toFixed(3)} - ${discovery.compatibilityReasons?.join(', ')}`);
    });
  }
}
