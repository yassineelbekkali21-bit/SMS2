'use client';

import { StudySession } from '@/types';

export class SessionDisplayService {
  // Couleurs d'état pour les cartes de session
  static readonly STATUS_COLORS = {
    upcoming: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      progressBg: 'bg-gray-100',
      progressBar: 'bg-gray-400'
    },
    today: {
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-800',
      progressBg: 'bg-violet-100',
      progressBar: 'bg-violet-500'
    },
    completed: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      progressBg: 'bg-green-100',
      progressBar: 'bg-green-500'
    },
    missed: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      progressBg: 'bg-red-100',
      progressBar: 'bg-red-500'
    },
    rescheduled: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      progressBg: 'bg-orange-100',
      progressBar: 'bg-orange-500'
    }
  };

  /**
   * Obtient les couleurs pour une session selon son statut
   */
  static getStatusColors(status: 'upcoming' | 'today' | 'completed' | 'missed' | 'rescheduled') {
    return this.STATUS_COLORS[status] || this.STATUS_COLORS.upcoming;
  }

  /**
   * Formate l'heure d'une session de manière compacte
   */
  static formatTimeRange(startTime: string, endTime: string): string {
    // Supprimer les :00 pour une présentation plus compacte
    const formatTime = (time: string) => {
      return time.replace(':00', 'h');
    };
    
    return `${formatTime(startTime)} – ${formatTime(endTime)}`;
  }

  /**
   * Obtient le nom court du cours pour l'affichage compact
   */
  static getCompactCourseName(session: StudySession): string {
    // Utiliser le nom de la leçon s'il existe, sinon le nom du cours
    if (session.lessonName) {
      return session.lessonName;
    }
    
    // Raccourcir le nom du cours s'il est trop long
    const courseName = session.courseName;
    if (courseName.length > 25) {
      return courseName.substring(0, 22) + '...';
    }
    
    return courseName;
  }

  /**
   * Obtient l'indicateur de progression pour l'affichage compact
   */
  static getProgressIndicator(session: StudySession): { percentage: number; label: string } {
    const percentage = session.videoProgressPercentage || 0;
    
    if (percentage === 0) {
      return { percentage: 0, label: '' };
    } else if (percentage === 100) {
      return { percentage: 100, label: '✓' };
    } else {
      return { percentage, label: `${percentage}%` };
    }
  }

  /**
   * Détermine si une session doit afficher l'indicateur de progression
   */
  static shouldShowProgress(session: StudySession): boolean {
    // Afficher la progression seulement pour les sessions avec vidéo
    return session.type !== 'break' && Boolean(session.videoId || session.lessonId);
  }

  /**
   * Obtient l'icône de statut pour l'affichage compact
   */
  static getStatusIcon(status: 'upcoming' | 'today' | 'completed' | 'missed' | 'rescheduled'): string {
    switch (status) {
      case 'completed':
        return '✓';
      case 'missed':
        return '!';
      case 'today':
        return '●';
      case 'rescheduled':
        return '↻';
      default:
        return '';
    }
  }

  /**
   * Calcule la hauteur optimale d'une carte selon le contenu
   */
  static getCardHeight(session: StudySession): string {
    // Hauteur de base plus compacte
    const baseHeight = 'min-h-[80px]';
    
    // Ajuster selon le type de session
    if (session.type === 'break') {
      return 'min-h-[60px]'; // Plus petit pour les pauses
    }
    
    return baseHeight;
  }

  /**
   * Génère une classe CSS pour l'animation de drag
   */
  static getDragClasses(isDragging: boolean): string {
    if (isDragging) {
      return 'scale-105 shadow-lg opacity-80 z-50';
    }
    return 'scale-100 shadow-sm opacity-100';
  }

  /**
   * Vérifie si une session peut être déplacée (drag & drop)
   */
  static canBeDragged(session: StudySession): boolean {
    // Empêcher le drag des sessions passées complétées
    return session.status !== 'completed' || session.videoProgressPercentage < 100;
  }
}




