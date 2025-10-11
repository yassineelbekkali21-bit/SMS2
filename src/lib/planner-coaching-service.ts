'use client';

import { StudySession, CoachingMessage, BadgeNotification, PlannerBadge } from '@/types';

export class PlannerCoachingService {
  // Couleurs par matière (tons pastel et minimalistes)
  static readonly SUBJECT_COLORS = {
    mathematics: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      accent: 'bg-purple-100',
      hex: '#f3e8ff'
    },
    physics: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      accent: 'bg-blue-100',
      hex: '#eff6ff'
    },
    chemistry: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      accent: 'bg-green-100',
      hex: '#f0fdf4'
    },
    biology: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      accent: 'bg-orange-100',
      hex: '#fff7ed'
    },
    other: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      accent: 'bg-gray-100',
      hex: '#f9fafb'
    }
  };

  /**
   * Détermine la matière d'un cours basé sur son nom ou ID
   */
  static getSubjectFromCourse(courseName: string, courseId: string): 'mathematics' | 'physics' | 'chemistry' | 'biology' | 'other' {
    const lowerName = courseName.toLowerCase();
    const lowerId = courseId.toLowerCase();
    
    if (lowerName.includes('math') || lowerName.includes('calcul') || lowerName.includes('algèbre') || 
        lowerName.includes('limite') || lowerName.includes('suite') || lowerName.includes('probabilité') ||
        lowerId.includes('math') || lowerId.includes('gauss') || lowerId.includes('suite')) {
      return 'mathematics';
    }
    
    if (lowerName.includes('physique') || lowerName.includes('mécanique') || lowerName.includes('thermodynamique') ||
        lowerName.includes('électricité') || lowerName.includes('optique') || lowerId.includes('physique')) {
      return 'physics';
    }
    
    if (lowerName.includes('chimie') || lowerName.includes('organique') || lowerName.includes('réaction') ||
        lowerName.includes('molécule') || lowerId.includes('chimie')) {
      return 'chemistry';
    }
    
    if (lowerName.includes('biologie') || lowerName.includes('cellule') || lowerName.includes('génétique') ||
        lowerName.includes('anatomie') || lowerId.includes('bio')) {
      return 'biology';
    }
    
    return 'other';
  }

  /**
   * Applique les couleurs à une session d'étude
   */
  static applyColorCoding(session: StudySession): StudySession {
    const subject = session.subject || this.getSubjectFromCourse(session.courseName, session.courseId);
    const colors = this.SUBJECT_COLORS[subject];
    
    return {
      ...session,
      subject,
      colorCode: colors.hex
    };
  }

  /**
   * Génère un message de coaching dynamique basé sur la progression
   */
  static generateCoachingMessage(
    completedSessions: number,
    missedSessions: number,
    totalSessions: number,
    nextExamDate?: Date
  ): CoachingMessage | null {
    const completionRate = totalSessions > 0 ? completedSessions / totalSessions : 0;
    const missedRate = totalSessions > 0 ? missedSessions / totalSessions : 0;
    const now = new Date();
    
    // Si en avance (+ de 80% de completion avec peu de sessions manquées)
    if (completionRate > 0.8 && missedRate < 0.1) {
      return {
        id: `coaching-${Date.now()}`,
        type: 'congratulation',
        title: 'Bravo, tu es en avance !',
        message: '🚀 Excellent rythme ! Veux-tu ajouter une révision bonus pour renforcer tes acquis ?',
        icon: '🚀',
        actionLabel: 'Ajouter une révision',
        priority: 'medium',
        isVisible: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
      };
    }

    // Si en retard (plus de 20% de sessions manquées)
    if (missedRate > 0.2) {
      return {
        id: `coaching-${Date.now()}`,
        type: 'warning',
        title: 'Tu as pris du retard',
        message: '⚡ Tu as manqué plusieurs sessions. Veux-tu les reprogrammer automatiquement ?',
        icon: '⚡',
        actionLabel: 'Reprogrammer',
        priority: 'high',
        isVisible: true,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48h
      };
    }

    // Si récemment manqué une session
    if (missedSessions > 0 && missedSessions <= 2) {
      return {
        id: `coaching-${Date.now()}`,
        type: 'suggestion',
        title: 'Session manquée',
        message: '📅 Tu as manqué une session récemment. Veux-tu la reprogrammer ?',
        icon: '📅',
        actionLabel: 'Reprogrammer',
        priority: 'medium',
        isVisible: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
      };
    }

    // Si à jour (progression normale)
    if (completionRate >= 0.6 && missedRate < 0.15) {
      return {
        id: `coaching-${Date.now()}`,
        type: 'motivation',
        title: 'Parfait !',
        message: '👏 Tu es dans le rythme, continue comme ça ! Ton planning se déroule bien.',
        icon: '👏',
        priority: 'low',
        isVisible: true,
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12h
      };
    }

    return null;
  }

  /**
   * Vérifie si un badge doit être débloqué
   */
  static checkBadgeUnlock(
    sessions: StudySession[],
    currentBadges: PlannerBadge[]
  ): BadgeNotification[] {
    const notifications: BadgeNotification[] = [];
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const consecutiveDays = this.calculateConsecutiveDays(sessions);

    // Badge "Discipliné" - 7 jours consécutifs
    if (consecutiveDays >= 7 && !currentBadges.find(b => b.id === 'disciplined')) {
      const badge: PlannerBadge = {
        id: 'disciplined',
        name: 'Discipliné',
        description: '7 jours d\'étude consécutifs',
        icon: '🎯',
        type: 'discipline',
        earnedAt: new Date(),
        progress: 100
      };
      
      notifications.push({
        id: `badge-${Date.now()}-disciplined`,
        badge,
        isVisible: true,
        unlockedAt: new Date()
      });
    }

    // Badge "Résilient" - 20 sessions complétées
    if (completedSessions >= 20 && !currentBadges.find(b => b.id === 'resilient')) {
      const badge: PlannerBadge = {
        id: 'resilient',
        name: 'Résilient',
        description: '20 sessions d\'étude complétées',
        icon: '💪',
        type: 'resilience',
        earnedAt: new Date(),
        progress: 100
      };
      
      notifications.push({
        id: `badge-${Date.now()}-resilient`,
        badge,
        isVisible: true,
        unlockedAt: new Date()
      });
    }

    return notifications;
  }

  /**
   * Calcule le nombre de jours consécutifs d'étude
   */
  private static calculateConsecutiveDays(sessions: StudySession[]): number {
    const completedSessions = sessions
      .filter(s => s.status === 'completed')
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    if (completedSessions.length === 0) return 0;

    let consecutive = 1;
    let currentDate = new Date(completedSessions[0].date);
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < completedSessions.length; i++) {
      const sessionDate = new Date(completedSessions[i].date);
      sessionDate.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.abs(currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        consecutive++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return consecutive;
  }

  /**
   * Vérifie si le buddy doit être notifié
   */
  static shouldNotifyBuddy(sessions: StudySession[]): boolean {
    const recentSessions = sessions.filter(s => {
      const daysDiff = (Date.now() - s.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7; // Sessions des 7 derniers jours
    });

    const missedInWeek = recentSessions.filter(s => s.status === 'missed').length;
    return missedInWeek >= 3;
  }

  /**
   * Filtre les sessions pour la vue mensuelle (examens et jalons uniquement)
   */
  static filterForMonthlyView(sessions: StudySession[]): StudySession[] {
    return sessions.filter(session => {
      // Garder seulement les examens et révisions importantes
      return session.type === 'practice' || 
             session.type === 'review' || 
             session.lessonName?.toLowerCase().includes('examen') ||
             session.lessonName?.toLowerCase().includes('test') ||
             session.lessonName?.toLowerCase().includes('révision générale');
    });
  }
}






