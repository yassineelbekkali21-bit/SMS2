'use client';

import { StudySession } from '@/types';

export class VideoProgressService {
  // Seuil de completion par défaut (peut être ajusté selon le contexte)
  static readonly DEFAULT_COMPLETION_THRESHOLD = 100;
  
  // Seuils spéciaux pour certains types de sessions
  static readonly COMPLETION_THRESHOLDS = {
    'lesson': 100,           // Leçons principales : 100% requis
    'review': 90,           // Révisions : 90% peut suffire
    'practice': 85,         // Exercices : 85% acceptable
    'break': 0,             // Pauses : pas de vidéo
    'bonus-review': 80      // Révisions bonus : 80% suffisant
  };

  /**
   * Détermine le statut d'une session basé sur la progression vidéo
   */
  static getSessionStatusFromVideoProgress(session: StudySession): 'upcoming' | 'today' | 'completed' | 'missed' | 'rescheduled' {
    const now = new Date();
    const sessionDate = new Date(session.date);
    const sessionEndTime = this.getSessionEndDateTime(session);

    // Si la session est reprogrammée
    if (session.isRescheduled) {
      return 'rescheduled';
    }

    // Vérifier si la session est aujourd'hui
    const isToday = sessionDate.toDateString() === now.toDateString();
    
    // Vérifier si la session est passée
    const isPast = sessionEndTime < now;

    // Déterminer le seuil de completion requis
    const threshold = session.requiredCompletionThreshold || 
                     this.COMPLETION_THRESHOLDS[session.type] || 
                     this.DEFAULT_COMPLETION_THRESHOLD;

    // Si la progression vidéo atteint le seuil requis
    if (session.videoProgressPercentage >= threshold) {
      return 'completed';
    }

    // Si la session est passée et pas complétée
    if (isPast) {
      return 'missed';
    }

    // Si c'est aujourd'hui
    if (isToday) {
      return 'today';
    }

    // Sinon, c'est à venir
    return 'upcoming';
  }

  /**
   * Met à jour la progression vidéo d'une session
   */
  static updateVideoProgress(
    session: StudySession, 
    progressPercentage: number,
    videoId?: string
  ): StudySession {
    const updatedSession = {
      ...session,
      videoProgressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      videoWatchedAt: new Date(),
      videoId: videoId || session.videoId
    };

    // Mettre à jour automatiquement le statut et isCompleted
    const newStatus = this.getSessionStatusFromVideoProgress(updatedSession);
    updatedSession.status = newStatus;
    updatedSession.isCompleted = newStatus === 'completed';

    return updatedSession;
  }

  /**
   * Simule une progression vidéo (pour les tests et démos)
   */
  static simulateVideoProgress(session: StudySession, targetProgress: number): StudySession {
    return this.updateVideoProgress(session, targetProgress, `video-${session.lessonId || session.id}`);
  }

  /**
   * Vérifie si une session peut être lancée (si elle a une vidéo associée)
   */
  static canLaunchSession(session: StudySession): boolean {
    // Les pauses n'ont pas de vidéo
    if (session.type === 'break') return false;
    
    // Les autres types de sessions doivent avoir une leçon associée
    return Boolean(session.lessonId || session.videoId);
  }

  /**
   * Obtient l'URL de la vidéo pour une session
   */
  static getVideoUrl(session: StudySession): string | null {
    if (!this.canLaunchSession(session)) return null;
    
    // Construction de l'URL basée sur l'ID de la leçon
    const videoId = session.videoId || session.lessonId;
    return `/video/${session.courseId}/${videoId}`;
  }

  /**
   * Obtient la date/heure de fin d'une session
   */
  private static getSessionEndDateTime(session: StudySession): Date {
    const sessionDate = new Date(session.date);
    const endTimeParts = session.endTime.split(':');
    sessionDate.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0, 0);
    return sessionDate;
  }

  /**
   * Calcule le message de progression pour l'affichage
   */
  static getProgressMessage(session: StudySession): string {
    const progress = session.videoProgressPercentage;
    const threshold = session.requiredCompletionThreshold || 
                     this.COMPLETION_THRESHOLDS[session.type] || 
                     this.DEFAULT_COMPLETION_THRESHOLD;

    if (progress === 0) {
      return "Non démarrée";
    } else if (progress < threshold) {
      return `${progress}% (${threshold}% requis)`;
    } else {
      return `${progress}% ✓ Complétée`;
    }
  }

  /**
   * Obtient la couleur de progression pour l'affichage
   */
  static getProgressColor(session: StudySession): string {
    const progress = session.videoProgressPercentage;
    const threshold = session.requiredCompletionThreshold || 
                     this.COMPLETION_THRESHOLDS[session.type] || 
                     this.DEFAULT_COMPLETION_THRESHOLD;

    if (progress === 0) {
      return 'text-gray-400';
    } else if (progress < threshold) {
      return progress < 50 ? 'text-red-600' : 'text-orange-600';
    } else {
      return 'text-green-600';
    }
  }

  /**
   * Obtient la couleur de fond de la barre de progression
   */
  static getProgressBarColor(session: StudySession): string {
    const progress = session.videoProgressPercentage;
    const threshold = session.requiredCompletionThreshold || 
                     this.COMPLETION_THRESHOLDS[session.type] || 
                     this.DEFAULT_COMPLETION_THRESHOLD;

    if (progress >= threshold) {
      return 'bg-green-500';
    } else if (progress >= 50) {
      return 'bg-orange-500';
    } else {
      return 'bg-red-500';
    }
  }

  /**
   * Filtre les sessions qui nécessitent une attention (progression insuffisante)
   */
  static getSessionsNeedingAttention(sessions: StudySession[]): StudySession[] {
    const now = new Date();
    
    return sessions.filter(session => {
      const sessionEndTime = this.getSessionEndDateTime(session);
      const isPast = sessionEndTime < now;
      const threshold = session.requiredCompletionThreshold || 
                       this.COMPLETION_THRESHOLDS[session.type] || 
                       this.DEFAULT_COMPLETION_THRESHOLD;
      
      // Sessions passées avec progression insuffisante
      return isPast && session.videoProgressPercentage < threshold;
    });
  }
}




