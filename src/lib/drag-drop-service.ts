'use client';

import { StudySession } from '@/types';

export class DragDropService {
  private static draggedSession: StudySession | null = null;
  private static dragStartPosition: { x: number; y: number } | null = null;

  /**
   * Démarre le drag d'une session
   */
  static startDrag(session: StudySession, event: React.DragEvent) {
    this.draggedSession = session;
    this.dragStartPosition = { x: event.clientX, y: event.clientY };
    
    // Configurer l'apparence du drag
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', session.id);
    }
    
    console.log('🎯 Début du drag:', session.lessonName || session.courseName);
  }

  /**
   * Gère le drag over d'une zone de drop
   */
  static handleDragOver(event: React.DragEvent, targetDate: Date) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  /**
   * Gère le drop d'une session
   */
  static handleDrop(
    event: React.DragEvent, 
    targetDate: Date,
    onSessionRescheduled: (sessionId: string, newDate: Date) => void
  ): boolean {
    event.preventDefault();
    
    if (!this.draggedSession) {
      return false;
    }

    const sessionId = event.dataTransfer?.getData('text/plain');
    if (sessionId !== this.draggedSession.id) {
      return false;
    }

    // Vérifier que la date est différente
    const originalDate = new Date(this.draggedSession.date);
    if (targetDate.toDateString() === originalDate.toDateString()) {
      this.cleanup();
      return false;
    }

    // Effectuer la reprogrammation
    onSessionRescheduled(this.draggedSession.id, targetDate);
    
    console.log('✅ Session reprogrammée:', {
      session: this.draggedSession.lessonName || this.draggedSession.courseName,
      from: originalDate.toDateString(),
      to: targetDate.toDateString()
    });

    this.cleanup();
    return true;
  }

  /**
   * Nettoie l'état du drag
   */
  static cleanup() {
    this.draggedSession = null;
    this.dragStartPosition = null;
  }

  /**
   * Obtient la session en cours de drag
   */
  static getDraggedSession(): StudySession | null {
    return this.draggedSession;
  }

  /**
   * Vérifie si une session peut être déplacée
   */
  static canBeDragged(session: StudySession): boolean {
    // Empêcher le drag des sessions complétées à 100%
    if (session.status === 'completed' && session.videoProgressPercentage >= 100) {
      return false;
    }
    
    // Empêcher le drag des pauses
    if (session.type === 'break') {
      return false;
    }
    
    return true;
  }

  /**
   * Obtient les classes CSS pour l'état de drag
   */
  static getDragClasses(session: StudySession, isDragging: boolean): string {
    if (!this.canBeDragged(session)) {
      return 'cursor-default';
    }
    
    if (isDragging) {
      return 'cursor-grabbing opacity-50 scale-105 rotate-2 z-50';
    }
    
    return 'cursor-grab';
  }

  /**
   * Obtient les classes CSS pour une zone de drop
   */
  static getDropZoneClasses(isDragOver: boolean, isValidDrop: boolean): string {
    if (!isDragOver) {
      return '';
    }
    
    if (isValidDrop) {
      return 'bg-blue-50 border-blue-300 border-2 border-dashed';
    }
    
    return 'bg-red-50 border-red-300 border-2 border-dashed';
  }

  /**
   * Génère un message de coaching après reprogrammation
   */
  static generateRescheduleMessage(session: StudySession, newDate: Date): string {
    const sessionName = session.lessonName || session.courseName;
    const dateStr = new Intl.DateTimeFormat('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }).format(newDate);
    
    return `✅ "${sessionName}" a été reprogrammée pour ${dateStr} à ${session.startTime}`;
  }

  /**
   * Vérifie si un drop est valide (pas de conflit d'horaire)
   */
  static isValidDrop(
    draggedSession: StudySession, 
    targetDate: Date, 
    existingSessions: StudySession[]
  ): boolean {
    // Vérifier les conflits d'horaire
    const targetDateStr = targetDate.toDateString();
    const conflictingSessions = existingSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === targetDateStr &&
             session.id !== draggedSession.id &&
             this.hasTimeConflict(draggedSession, session);
    });
    
    return conflictingSessions.length === 0;
  }

  /**
   * Vérifie s'il y a un conflit d'horaire entre deux sessions
   */
  private static hasTimeConflict(session1: StudySession, session2: StudySession): boolean {
    const start1 = this.timeToMinutes(session1.startTime);
    const end1 = this.timeToMinutes(session1.endTime);
    const start2 = this.timeToMinutes(session2.startTime);
    const end2 = this.timeToMinutes(session2.endTime);
    
    return (start1 < end2 && end1 > start2);
  }

  /**
   * Convertit une heure (HH:MM) en minutes
   */
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}






