import { 
  StudySession, 
  StudyPlan, 
  PlannerBadge, 
  AdaptationSuggestion, 
  MissedSessionAlert,
  PlannerViewSettings,
  BuddySystem 
} from '@/types';
import { PlannerCoachingService } from './planner-coaching-service';

export class AdvancedPlannerService {
  
  // ========================================================================
  // COULEURS ET COACHING
  // ========================================================================
  
  static applyColorsToSessions(sessions: StudySession[]): StudySession[] {
    return sessions.map(session => PlannerCoachingService.applyColorCoding(session));
  }
  
  // ========================================================================
  // GESTION DES SESSIONS MANQUÉES
  // ========================================================================
  
  static checkMissedSessions(plan: StudyPlan): StudySession[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return plan.sessions.filter(session => {
      const sessionDate = new Date(session.date.getFullYear(), session.date.getMonth(), session.date.getDate());
      return sessionDate < today && !session.isCompleted && !session.isMissed;
    });
  }
  
  static createMissedSessionAlert(session: StudySession, plan: StudyPlan): MissedSessionAlert {
    const suggestedSlots = this.findAvailableRescheduleSlots(session, plan);
    
    return {
      sessionId: session.id,
      session: {
        ...session,
        isMissed: true,
        missedDate: new Date(),
        status: 'missed'
      },
      isOpen: true,
      suggestedRescheduleSlots: suggestedSlots
    };
  }
  
  static findAvailableRescheduleSlots(missedSession: StudySession, plan: StudyPlan): Date[] {
    const slots: Date[] = [];
    const now = new Date();
    const examDate = plan.examDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // Chercher les 7 prochains jours avec des créneaux libres
    for (let i = 1; i <= 14; i++) {
      const candidateDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      
      if (candidateDate >= examDate) break;
      
      // Vérifier si ce jour n'a pas déjà trop de sessions
      const daySessions = plan.sessions.filter(s => 
        s.date.toDateString() === candidateDate.toDateString() && 
        !s.isMissed
      );
      
      if (daySessions.length < 3) { // Max 3 sessions par jour
        slots.push(candidateDate);
      }
      
      if (slots.length >= 5) break; // Limiter à 5 suggestions
    }
    
    return slots;
  }
  
  static rescheduleSession(
    sessionId: string, 
    newDate: Date, 
    plan: StudyPlan,
    isAutomatic: boolean = false
  ): StudyPlan {
    const updatedSessions = plan.sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          originalDate: session.date,
          date: newDate,
          isRescheduled: true,
          status: 'rescheduled' as const,
          isMissed: false
        };
      }
      return session;
    });
    
    return {
      ...plan,
      sessions: updatedSessions,
      lastUpdated: new Date(),
      adaptationReason: isAutomatic 
        ? 'Replanification automatique d\'une session manquée'
        : 'Replanification manuelle d\'une session manquée'
    };
  }
  
  // ========================================================================
  // ADAPTABILITÉ TEMPS RÉEL
  // ========================================================================
  
  static analyzeProgress(plan: StudyPlan): AdaptationSuggestion[] {
    const suggestions: AdaptationSuggestion[] = [];
    const now = new Date();
    
    const completedSessions = plan.sessions.filter(s => s.isCompleted);
    const missedSessions = plan.sessions.filter(s => s.isMissed);
    const upcomingSessions = plan.sessions.filter(s => s.date > now && !s.isCompleted);
    
    const totalSessions = plan.sessions.length;
    const expectedProgress = this.calculateExpectedProgress(plan);
    const actualProgress = (completedSessions.length / totalSessions) * 100;
    
    // EN AVANCE
    if (actualProgress > expectedProgress + 15) {
      suggestions.push({
        id: `ahead-${Date.now()}`,
        type: 'ahead-schedule',
        title: 'Excellent ! Tu es en avance 🚀',
        description: `Tu as ${Math.round(actualProgress - expectedProgress)}% d'avance sur ton planning. Veux-tu optimiser ton temps ?`,
        actions: [
          {
            label: 'Ajouter des révisions bonus',
            type: 'add-bonus',
            data: { bonusType: 'review', sessions: 2 }
          },
          {
            label: 'Approfondir les sujets difficiles',
            type: 'add-bonus',
            data: { bonusType: 'practice', difficulty: 'hard' }
          },
          {
            label: 'Garder le planning actuel',
            type: 'optimize',
            data: { keepCurrent: true }
          }
        ],
        isActive: true
      });
    }
    
    // EN RETARD
    else if (actualProgress < expectedProgress - 10 || missedSessions.length > 2) {
      suggestions.push({
        id: `behind-${Date.now()}`,
        type: 'behind-schedule',
        title: 'Rattrapons le retard ! 💪',
        description: `Tu as ${Math.round(expectedProgress - actualProgress)}% de retard. Je peux t'aider à rattraper.`,
        actions: [
          {
            label: 'Replanification automatique',
            type: 'auto-reschedule',
            data: { intensifySchedule: true, missedSessions: missedSessions.length }
          },
          {
            label: 'Choisir manuellement',
            type: 'manual-reschedule',
            data: { availableSlots: this.findAvailableRescheduleSlots(missedSessions[0], plan) }
          }
        ],
        isActive: true
      });
    }
    
    // OPTIMISATION GÉNÉRALE
    if (suggestions.length === 0 && completedSessions.length > 5) {
      suggestions.push({
        id: `optimize-${Date.now()}`,
        type: 'optimization',
        title: 'Optimisons ton planning',
        description: 'Ton rythme est bon ! Veux-tu ajuster quelque chose ?',
        actions: [
          {
            label: 'Réduire l\'intensité',
            type: 'optimize',
            data: { adjustIntensity: 'reduce' }
          },
          {
            label: 'Augmenter l\'intensité',
            type: 'optimize',
            data: { adjustIntensity: 'increase' }
          }
        ],
        isActive: true
      });
    }
    
    return suggestions;
  }
  
  static calculateExpectedProgress(plan: StudyPlan): number {
    const now = new Date();
    const startDate = plan.startDate;
    const examDate = plan.examDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const totalDuration = examDate.getTime() - startDate.getTime();
    const elapsedDuration = now.getTime() - startDate.getTime();
    
    return Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
  }
  
  static applyAdaptationSuggestion(suggestion: AdaptationSuggestion, action: any, plan: StudyPlan): StudyPlan {
    const updatedSessions = [...plan.sessions];
    
    switch (action.type) {
      case 'add-bonus':
        // Ajouter des sessions bonus
        const bonusSessions = this.generateBonusSessions(action.data, plan);
        updatedSessions.push(...bonusSessions);
        break;
        
      case 'auto-reschedule':
        // Replanification automatique intensive
        return this.intensifySchedule(plan);
        
      case 'optimize':
        // Optimisations diverses
        return this.optimizeSchedule(plan, action.data);
    }
    
    return {
      ...plan,
      sessions: updatedSessions,
      lastUpdated: new Date(),
      adaptationReason: `Adaptation appliquée: ${suggestion.title}`
    };
  }
  
  static generateBonusSessions(bonusData: any, plan: StudyPlan): StudySession[] {
    const sessions: StudySession[] = [];
    const now = new Date();
    
    for (let i = 0; i < bonusData.sessions; i++) {
      const sessionDate = new Date(now.getTime() + (i + 1) * 2 * 24 * 60 * 60 * 1000);
      
      sessions.push({
        id: `bonus-${Date.now()}-${i}`,
        date: sessionDate,
        startTime: '18:00',
        endTime: '19:00',
        courseId: plan.sessions[0]?.courseId || 'general',
        courseName: plan.sessions[0]?.courseName || 'Révision générale',
        type: 'bonus-review',
        isCompleted: false,
        isOptional: true,
        difficulty: bonusData.difficulty || 'medium',
        estimatedMinutes: 60,
        duration: 60,
        status: 'upcoming'
      });
    }
    
    return sessions;
  }
  
  static intensifySchedule(plan: StudyPlan): StudyPlan {
    // Logique pour intensifier le planning (plus de sessions par jour, durées étendues)
    const updatedSessions = plan.sessions.map(session => {
      if (!session.isCompleted && !session.isMissed) {
        return {
          ...session,
          duration: Math.min(session.duration + 15, 120), // +15min max 2h
          estimatedMinutes: Math.min(session.estimatedMinutes + 15, 120)
        };
      }
      return session;
    });
    
    return {
      ...plan,
      sessions: updatedSessions,
      lastUpdated: new Date(),
      adaptationReason: 'Planning intensifié pour rattraper le retard'
    };
  }
  
  static optimizeSchedule(plan: StudyPlan, optimizationData: any): StudyPlan {
    // Logique d'optimisation basée sur les données
    return {
      ...plan,
      lastUpdated: new Date(),
      adaptationReason: 'Planning optimisé selon vos préférences'
    };
  }
  
  // ========================================================================
  // SYSTÈME DE BADGES
  // ========================================================================
  
  static initializeBadges(): PlannerBadge[] {
    return [
      {
        id: 'disciplined-week',
        name: 'Discipliné',
        description: 'Toutes les sessions respectées pendant 1 semaine',
        icon: '🎯',
        type: 'discipline',
        criteria: { consecutiveDays: 7 },
        isEarned: false
      },
      {
        id: 'resilient-comeback',
        name: 'Résilient',
        description: 'Sessions manquées mais reprogrammées et complétées',
        icon: '💪',
        type: 'resilience',
        criteria: { sessionsMissedAndRescheduled: 3 },
        isEarned: false
      },
      {
        id: 'coached-buddy',
        name: 'Coaché',
        description: 'Utilisation régulière du buddy system',
        icon: '🤝',
        type: 'coaching',
        criteria: { buddyInteractions: 5 },
        isEarned: false
      },
      {
        id: 'consistent-learner',
        name: 'Consistant',
        description: '20 sessions complétées avec succès',
        icon: '📚',
        type: 'progress',
        criteria: { sessionsCompleted: 20 },
        isEarned: false
      },
      {
        id: 'streak-master',
        name: 'Maître de la Régularité',
        description: '14 jours consécutifs d\'étude',
        icon: '🔥',
        type: 'consistency',
        criteria: { consecutiveDays: 14 },
        isEarned: false
      }
    ];
  }
  
  static checkBadgeProgress(badges: PlannerBadge[], plan: StudyPlan, buddy?: BuddySystem): PlannerBadge[] {
    return badges.map(badge => {
      if (badge.isEarned) return badge;
      
      const earned = this.checkBadgeCriteria(badge, plan, buddy);
      
      if (earned) {
        return {
          ...badge,
          isEarned: true,
          earnedAt: new Date()
        };
      }
      
      return badge;
    });
  }
  
  static checkBadgeCriteria(badge: PlannerBadge, plan: StudyPlan, buddy?: BuddySystem): boolean {
    const completedSessions = plan.sessions.filter(s => s.isCompleted);
    const rescheduledAndCompleted = plan.sessions.filter(s => s.isRescheduled && s.isCompleted);
    
    switch (badge.type) {
      case 'discipline':
        return this.checkConsecutiveDays(plan, badge.criteria.consecutiveDays || 7);
        
      case 'resilience':
        return rescheduledAndCompleted.length >= (badge.criteria.sessionsMissedAndRescheduled || 3);
        
      case 'coaching':
        return (buddy?.lastNotificationSent ? 1 : 0) >= (badge.criteria.buddyInteractions || 5);
        
      case 'progress':
        return completedSessions.length >= (badge.criteria.sessionsCompleted || 20);
        
      case 'consistency':
        return this.checkConsecutiveDays(plan, badge.criteria.consecutiveDays || 14);
        
      default:
        return false;
    }
  }
  
  static checkConsecutiveDays(plan: StudyPlan, targetDays: number): boolean {
    const completedSessions = plan.sessions
      .filter(s => s.isCompleted)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    if (completedSessions.length === 0) return false;
    
    let consecutiveDays = 1;
    let maxConsecutive = 1;
    
    for (let i = 1; i < completedSessions.length; i++) {
      const prevDate = new Date(completedSessions[i - 1].date);
      const currentDate = new Date(completedSessions[i].date);
      
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        consecutiveDays++;
      } else {
        maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
        consecutiveDays = 1;
      }
    }
    
    maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
    return maxConsecutive >= targetDays;
  }
  
  // ========================================================================
  // NOTIFICATIONS BUDDY
  // ========================================================================
  
  static shouldNotifyBuddy(plan: StudyPlan, buddy: BuddySystem): boolean {
    if (!buddy.isActive) return false;
    
    const missedSessions = plan.sessions.filter(s => s.isMissed);
    const recentMissed = missedSessions.filter(s => {
      const daysSinceMissed = (Date.now() - (s.missedDate?.getTime() || 0)) / (1000 * 60 * 60 * 24);
      return daysSinceMissed <= 3; // Sessions manquées dans les 3 derniers jours
    });
    
    // Notifier si 2+ sessions manquées récemment
    if (recentMissed.length >= 2) {
      // Vérifier la fréquence des notifications
      const lastNotification = buddy.lastNotificationSent;
      if (!lastNotification) return true;
      
      const hoursSinceLastNotification = (Date.now() - lastNotification.getTime()) / (1000 * 60 * 60);
      
      switch (buddy.alertFrequency) {
        case 'immediate':
          return hoursSinceLastNotification >= 1;
        case 'daily':
          return hoursSinceLastNotification >= 24;
        case 'weekly':
          return hoursSinceLastNotification >= 168;
        default:
          return false;
      }
    }
    
    return false;
  }
  
  static generateBuddyMessage(plan: StudyPlan, buddy: BuddySystem): string {
    const missedCount = plan.sessions.filter(s => s.isMissed).length;
    const userName = 'ton ami'; // À remplacer par le vrai nom
    
    const messages = [
      `Hey ! ${userName} a besoin d'un petit coup de boost 🚀. ${missedCount} sessions d'étude manquées récemment. Envoie-lui un message d'encouragement !`,
      `${userName} traverse une période difficile avec ses études 💪. ${missedCount} sessions non réalisées. Un petit mot de ta part pourrait faire la différence !`,
      `Moment coaching ! ${userName} a manqué ${missedCount} sessions d'étude 📚. Ton soutien peut l'aider à reprendre le rythme !`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  // ========================================================================
  // UTILITAIRES POUR LES VUES
  // ========================================================================
  
  static getSessionsForView(
    sessions: StudySession[], 
    viewType: 'day' | 'week' | 'month',
    referenceDate: Date = new Date()
  ): StudySession[] {
    switch (viewType) {
      case 'day':
        return sessions.filter(session => 
          session.date.toDateString() === referenceDate.toDateString()
        );
        
      case 'week':
        const weekStart = new Date(referenceDate);
        weekStart.setDate(referenceDate.getDate() - referenceDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return sessions.filter(session => 
          session.date >= weekStart && session.date <= weekEnd
        );
        
      case 'month':
        return sessions.filter(session => 
          session.date.getMonth() === referenceDate.getMonth() &&
          session.date.getFullYear() === referenceDate.getFullYear()
        );
        
      default:
        return sessions;
    }
  }
  
  static formatViewTitle(viewType: 'day' | 'week' | 'month', referenceDate: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    
    switch (viewType) {
      case 'day':
        return new Intl.DateTimeFormat('fr-FR', options).format(referenceDate);
        
      case 'week':
        const weekStart = new Date(referenceDate);
        weekStart.setDate(referenceDate.getDate() - referenceDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return `${weekStart.getDate()} - ${weekEnd.getDate()} ${new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(weekEnd)}`;
        
      case 'month':
        return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(referenceDate);
        
      default:
        return '';
    }
  }
}
