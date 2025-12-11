'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Users,
  Coffee,
  Book,
  Zap,
  ArrowRight,
  Edit3,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Award,
  ExternalLink
} from 'lucide-react';
import { StudyPlan, StudySession, PlannerViewSettings, PlannerBadge, AdaptationSuggestion, MissedSessionAlert as MissedSessionAlertType, CoachingMessage, BadgeNotification, Course } from '@/types';
import { PlannerViewToggle } from './PlannerViewToggle';
import { PlannerBadges } from './PlannerBadges';
import { AdaptationSuggestions } from './AdaptationSuggestions';
import { MissedSessionAlert } from './MissedSessionAlert';
import { CoachingBanner } from './CoachingBanner';
import { BadgeNotificationPopup } from './BadgeNotificationPopup';
import { QuickRescheduleButton } from './QuickRescheduleButton';
import { AdvancedPlannerService } from '@/lib/advanced-planner-service';
import { PlannerCoachingService } from '@/lib/planner-coaching-service';
import { VideoProgressService } from '@/lib/video-progress-service';
import { VideoProgressSimulator } from './VideoProgressSimulator';
import { SessionDetailsPanel } from './SessionDetailsPanel';
import { SessionDisplayService } from '@/lib/session-display-service';
import { DragDropService } from '@/lib/drag-drop-service';

interface AdvancedPlanDisplayProps {
  plan: StudyPlan;
  badges: PlannerBadge[];
  adaptationSuggestions: AdaptationSuggestion[];
  missedSessionAlert?: MissedSessionAlertType;
  onEditPlan?: () => void;
  onRegeneratePlan?: () => void;
  onSessionComplete?: (sessionId: string) => void;
  onApplyAdaptation?: (suggestion: AdaptationSuggestion, action: any) => void;
  onDismissSuggestion?: (suggestionId: string) => void;
  onRescheduleSession?: (sessionId: string, newDate: Date, isAutomatic: boolean) => void;
  onCloseMissedAlert?: () => void;
  onManualReschedule?: () => void;
  focusedCourse?: Course | null;
  onNavigateToCourse?: (courseId: string) => void;
}

export function AdvancedPlanDisplay({ 
  plan, 
  badges,
  adaptationSuggestions,
  missedSessionAlert,
  onEditPlan, 
  onRegeneratePlan,
  onSessionComplete,
  onApplyAdaptation,
  onDismissSuggestion,
  onRescheduleSession,
  onCloseMissedAlert,
  onManualReschedule,
  focusedCourse,
  onNavigateToCourse
}: AdvancedPlanDisplayProps) {
  const [viewSettings, setViewSettings] = useState<PlannerViewSettings>({
    currentView: 'week',
    showCompleted: true,
    showMissed: true,
    showOptional: true
  });
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());
  const [coachingMessage, setCoachingMessage] = useState<CoachingMessage | null>(null);
  const [badgeNotification, setBadgeNotification] = useState<BadgeNotification | null>(null);
  const [updatedSessions, setUpdatedSessions] = useState<Record<string, StudySession>>({});
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [rescheduleMessage, setRescheduleMessage] = useState<string | null>(null);

  // Appliquer les couleurs par matière aux sessions et intégrer les mises à jour
  const sessionsWithColors = plan.sessions.map(session => {
    const coloredSession = PlannerCoachingService.applyColorCoding(session);
    // Appliquer les mises à jour de progression si elles existent
    return updatedSessions[session.id] || coloredSession;
  });

  // Fonction pour mettre à jour la progression d'une session
  const handleSessionProgressUpdate = (updatedSession: StudySession) => {
    setUpdatedSessions(prev => ({
      ...prev,
      [updatedSession.id]: updatedSession
    }));
  };

  // Générer les messages de coaching et vérifier les badges
  useEffect(() => {
    const completedCount = sessionsWithColors.filter(s => s.status === 'completed').length;
    const missedCount = sessionsWithColors.filter(s => s.status === 'missed').length;
    const totalCount = sessionsWithColors.length;

    // Générer message de coaching
    const message = PlannerCoachingService.generateCoachingMessage(
      completedCount,
      missedCount,
      totalCount,
      plan.examDate
    );
    setCoachingMessage(message);

    // Vérifier les nouveaux badges
    const newBadgeNotifications = PlannerCoachingService.checkBadgeUnlock(
      sessionsWithColors,
      badges
    );
    
    if (newBadgeNotifications.length > 0) {
      setBadgeNotification(newBadgeNotifications[0]);
    }

    // Vérifier si le buddy doit être notifié
    const shouldNotifyBuddy = PlannerCoachingService.shouldNotifyBuddy(sessionsWithColors);
    if (shouldNotifyBuddy) {
      console.log('🤝 BUDDY NOTIFICATION: Notifier le buddy de plusieurs sessions manquées');
      // Ici on pourrait déclencher une notification au buddy
      // Par exemple via une API ou un service de notification
    }
  }, [sessionsWithColors, badges, plan.examDate]);

  // Déterminer l'état d'avancement basé sur la progression vidéo
  const getSessionStatus = (session: StudySession): 'upcoming' | 'today' | 'completed' | 'missed' | 'rescheduled' => {
    // Utiliser le service de progression vidéo pour déterminer le statut automatiquement
    return VideoProgressService.getSessionStatusFromVideoProgress(session);
  };

  // Ouvrir le panel de détails d'une session
  const openSessionDetails = (session: StudySession) => {
    const sessionToShow = updatedSessions[session.id] || session;
    setSelectedSession(sessionToShow);
    setIsDetailsOpen(true);
  };

  // Fermer le panel de détails
  const closeSessionDetails = () => {
    setIsDetailsOpen(false);
    setSelectedSession(null);
  };

  // Gérer le lancement de vidéo depuis le panel
  const handleLaunchVideo = (session: StudySession) => {
    if (!VideoProgressService.canLaunchSession(session)) {
      console.log('⚠️ Cette session n\'a pas de vidéo associée');
      return;
    }

    const videoUrl = VideoProgressService.getVideoUrl(session);
    if (videoUrl) {
      console.log('🎥 Lancement de la vidéo:', videoUrl);
      
      // Simuler le lancement de la vidéo et une progression
      const simulatedProgress = Math.min(100, session.videoProgressPercentage + Math.floor(Math.random() * 30) + 10);
      const updatedSession = VideoProgressService.simulateVideoProgress(session, simulatedProgress);
      
      handleSessionProgressUpdate(updatedSession);
      setSelectedSession(updatedSession);
      
      console.log(`📊 Progression simulée: ${simulatedProgress}%`);
    }
  };

  // Gérer le lancement de quiz depuis le panel
  const handleLaunchQuiz = (session: StudySession) => {
    if (session.videoProgressPercentage < 100) {
      console.log('⚠️ Terminez d\'abord la vidéo pour accéder au quiz');
      return;
    }
    
    console.log('📝 Lancement du quiz pour:', session.lessonName || session.courseName);
    // Ici on redirigerait vers le quiz/exercices
  };

  // Gérer la reprogrammation depuis le panel
  const handleReschedule = (session: StudySession) => {
    console.log('🔄 Reprogrammation de la session:', session.lessonName || session.courseName);
    // Ici on ouvrirait un modal de reprogrammation ou redirigerait vers l'interface de planning
    closeSessionDetails();
  };

  // Handlers pour le drag & drop
  const handleDragStart = (session: StudySession, event: React.DragEvent) => {
    if (!DragDropService.canBeDragged(session)) {
      event.preventDefault();
      return;
    }
    
    DragDropService.startDrag(session, event);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    DragDropService.cleanup();
    setIsDragging(false);
    setDragOverDate(null);
  };

  const handleDragOver = (event: React.DragEvent, targetDate: Date) => {
    event.preventDefault();
    const dateStr = targetDate.toDateString();
    setDragOverDate(dateStr);
    DragDropService.handleDragOver(event, targetDate);
  };

  const handleDrop = (event: React.DragEvent, targetDate: Date) => {
    const success = DragDropService.handleDrop(event, targetDate, handleSessionReschedule);
    setDragOverDate(null);
    
    if (success) {
      const draggedSession = DragDropService.getDraggedSession();
      if (draggedSession) {
        const message = DragDropService.generateRescheduleMessage(draggedSession, targetDate);
        setRescheduleMessage(message);
        setTimeout(() => setRescheduleMessage(null), 5000);
      }
    }
  };

  const handleSessionReschedule = (sessionId: string, newDate: Date) => {
    // Ici on mettrait à jour la session dans l'état
    console.log('📅 Reprogrammation:', { sessionId, newDate });
    // Pour la démo, on pourrait simuler une mise à jour
    if (onRescheduleSession) {
      onRescheduleSession(sessionId, newDate, false);
    }
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  const formatDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return 'Date invalide';
    }
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewSettings.currentView) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  // Filtrer les sessions selon la vue et les paramètres
  let baseSessions = AdvancedPlannerService.getSessionsForView(
    sessionsWithColors, 
    viewSettings.currentView, 
    currentDate
  );

  // Pour la vue mensuelle, utiliser le filtre simplifié
  if (viewSettings.currentView === 'month') {
    baseSessions = PlannerCoachingService.filterForMonthlyView(baseSessions);
  }

  const filteredSessions = baseSessions.filter(session => {
    const status = getSessionStatus(session);
    
    if (!viewSettings.showCompleted && status === 'completed') return false;
    if (!viewSettings.showMissed && status === 'missed') return false;
    if (!viewSettings.showOptional && session.isOptional) return false;
    
    return true;
  });

  // Grouper les sessions par jour pour la vue
  const sessionsByDay = filteredSessions.reduce((acc, session) => {
    const dayKey = session.date.toDateString();
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(session);
    return acc;
  }, {} as Record<string, StudySession[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-400 bg-emerald-50';
      case 'today':
        return 'border-blue-400 bg-blue-50';
      case 'missed':
        return 'border-red-400 bg-red-50';
      case 'rescheduled':
        return 'border-orange-400 bg-orange-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'today':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'missed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'rescheduled':
        return <RotateCcw className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderWeekView = () => {
    const weekDays = [];
    const startOfWeek = new Date(currentDate);
    
    // Calculer le début de semaine (lundi)
    const dayOfWeek = startOfWeek.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Si dimanche (0), reculer de 6 jours, sinon reculer de (jour - 1)
    startOfWeek.setDate(currentDate.getDate() - daysToSubtract);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dayKey = day.toDateString();
      const daySessions = sessionsByDay[dayKey] || [];
      
      weekDays.push(
        <div 
          key={dayKey} 
          className={`bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-slate-200/60 min-h-[320px] p-4 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm ${DragDropService.getDropZoneClasses(dragOverDate === dayKey, true)}`}
          onDragOver={(e) => handleDragOver(e, day)}
          onDrop={(e) => handleDrop(e, day)}
        >
          <div className="space-y-2">
            {daySessions.map((session) => {
              const status = getSessionStatus(session);
              const timeRange = SessionDisplayService.formatTimeRange(session.startTime, session.endTime);
              
              // Couleurs selon le statut - Version Premium
              let bgColor = 'bg-gradient-to-br from-blue-50 to-indigo-100';
              let borderColor = 'border-blue-300';
              let textColor = 'text-blue-900';
              
              if (status === 'completed') {
                bgColor = 'bg-gradient-to-br from-emerald-50 to-green-100';
                borderColor = 'border-emerald-300';
                textColor = 'text-emerald-900';
              } else if (status === 'missed') {
                bgColor = 'bg-gradient-to-br from-red-50 to-rose-100';
                borderColor = 'border-red-300';
                textColor = 'text-red-900';
              }
              
              return (
                <motion.div
                  key={session.id}
                  whileHover={{ scale: 1.05, y: -3 }}
                  draggable={DragDropService.canBeDragged(session)}
                  onDragStart={(e) => handleDragStart(session, e as any)}
                  onDragEnd={handleDragEnd}
                  className={`${bgColor} ${borderColor} ${textColor} border-l-4 rounded-xl p-4 cursor-pointer cursor-target transition-all hover:shadow-lg backdrop-blur-sm ${DragDropService.getDragClasses(session, isDragging)}`}
                  onClick={() => openSessionDetails(session)}
                >
                  <div className="font-semibold text-sm mb-1 leading-tight">
                    {session.lessonName || session.courseName}
                  </div>
                  <div className="text-xs opacity-80">
                    {timeRange}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full">
        {/* Header avec les jours de la semaine */}
        <div className="grid grid-cols-7 gap-2 lg:gap-4 mb-4">
          {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((dayName, index) => {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + index);
            const isToday = dayDate.toDateString() === new Date().toDateString();
            
            return (
              <div key={dayName} className="text-center">
                <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                  {dayName}
                </div>
                <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {dayDate.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Grille des sessions */}
        <div className="grid grid-cols-7 gap-2 lg:gap-4 auto-rows-fr">
          {weekDays}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayKey = currentDate.toDateString();
    const daySessions = sessionsByDay[dayKey] || [];
    
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 px-6 py-5 border-b border-slate-200/60">
          <h3 className="text-xl font-bold text-center bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
            {formatDate(currentDate)}
          </h3>
        </div>
        
        <div className="p-6 lg:p-8">
          {daySessions.length === 0 ? (
            <div className="text-center py-12">
              <Coffee className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune session prévue aujourd'hui</p>
            </div>
          ) : (
            <div className="space-y-4 lg:space-y-6">
              {daySessions.map((session) => {
                const status = getSessionStatus(session);
                const statusColors = SessionDisplayService.getStatusColors(status);
                const compactName = SessionDisplayService.getCompactCourseName(session);
                const timeRange = SessionDisplayService.formatTimeRange(session.startTime, session.endTime);
                const progressInfo = SessionDisplayService.getProgressIndicator(session);
                const shouldShowProgress = SessionDisplayService.shouldShowProgress(session);
                
                return (
                  <motion.div
                    key={session.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    draggable={DragDropService.canBeDragged(session)}
                    onDragStart={(e) => handleDragStart(session, e as any)}
                    onDragEnd={handleDragEnd}
                    className={`${statusColors.bg} ${statusColors.border} border-2 rounded-2xl transition-all relative overflow-hidden min-h-[140px] shadow-lg hover:shadow-xl cursor-pointer cursor-target backdrop-blur-sm ${DragDropService.getDragClasses(session, isDragging)}`}
                    onClick={() => openSessionDetails(session)}
                  >
                    {/* Indicateur de statut moderne (barre latérale) */}
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${statusColors.progressBar} shadow-lg`}></div>
                    
                    {/* Gradient overlay pour plus de profondeur */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                    
                    <div className="p-4 pl-6">
                      {/* Header: Nom du cours + statut + heure */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          {SessionDisplayService.getStatusIcon(status) && (
                            <span className={`text-base ${statusColors.text} font-bold`}>
                              {SessionDisplayService.getStatusIcon(status)}
                            </span>
                          )}
                          <h4 className={`text-base font-semibold ${statusColors.text} leading-tight`}>
                            {session.lessonName || session.courseName}
                          </h4>
                        </div>
                        
                        <div className={`text-sm font-medium ${statusColors.text} opacity-75`}>
                          {timeRange}
                        </div>
                      </div>
                      
                      {/* Nom de leçon si disponible */}
                      {session.lessonName && session.lessonName !== session.courseName && (
                        <p className={`text-sm ${statusColors.text} opacity-75 mb-3`}>
                          {session.lessonName}
                        </p>
                      )}
                      
                      {/* Type de session et durée */}
                      <div className="flex items-center gap-4 lg:gap-6 mb-4 lg:mb-5">
                        <span className={`text-sm lg:text-base px-3 py-1.5 ${statusColors.progressBg} ${statusColors.text} rounded-full font-medium`}>
                          {session.type === 'lesson' ? 'Leçon' : 
                           session.type === 'review' ? 'Révision' :
                           session.type === 'practice' ? 'Pratique' : 'Bonus'}
                        </span>
                        <span className={`text-sm lg:text-base ${statusColors.text} opacity-75 font-medium`}>
                          {session.duration} min
                        </span>
                        <span className={`text-sm lg:text-base ${statusColors.text} opacity-75 capitalize font-medium`}>
                          {session.difficulty === 'easy' ? 'Facile' :
                           session.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                        </span>
                      </div>
                      
                      {/* Barre de progression plus visible */}
                      {shouldShowProgress && (
                        <div className="space-y-3 lg:space-y-4">
                          <div className="flex items-center justify-between">
                            <span className={`text-base lg:text-lg ${statusColors.text} opacity-75 font-medium`}>
                              Progression vidéo
                            </span>
                            <span className={`text-base lg:text-lg font-bold ${statusColors.text}`}>
                              {progressInfo.label || `${progressInfo.percentage}%`}
                            </span>
                          </div>
                          <div className={`w-full h-3 lg:h-4 ${statusColors.progressBg} rounded-full overflow-hidden shadow-inner`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressInfo.percentage}%` }}
                              transition={{ duration: 0.6 }}
                              className={`h-full ${statusColors.progressBar} rounded-full shadow-sm`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    // Vue mensuelle moderne avec vraies cases et mini-cartes de sessions
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarWeeks = [];
    const currentDay = new Date(startDate);
    const today = new Date();
    
    // Gérer le clic sur un jour
    const handleDayClick = (day: Date, sessions: StudySession[]) => {
      if (sessions.length === 0) return;
      
      // Si une seule session, ouvrir directement le panel
      if (sessions.length === 1) {
        openSessionDetails(sessions[0]);
      } else {
        // Sinon, basculer en vue jour pour ce jour
        setCurrentDate(new Date(day));
        setViewSettings(prev => ({ ...prev, currentView: 'day' }));
      }
    };
    
    // Créer le calendrier semaine par semaine
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      
      for (let day = 0; day < 7; day++) {
        const dayKey = currentDay.toDateString();
        const daySessions = sessionsByDay[dayKey] || [];
        const isCurrentMonth = currentDay.getMonth() === currentDate.getMonth();
        const isToday = currentDay.toDateString() === today.toDateString();
        const hasSessions = daySessions.length > 0;
        
        // Calculer les classes pour la case du jour
        const dayClasses = [
          'min-h-[120px] lg:min-h-[140px] xl:min-h-[160px]',
          'border border-gray-100',
          'p-2 lg:p-3',
          'transition-all duration-200',
          'relative',
          hasSessions ? 'cursor-pointer hover:shadow-md' : '',
          isCurrentMonth ? (
            hasSessions ? (
              isToday ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
            ) : 'bg-white hover:bg-gray-25'
          ) : 'bg-gray-25',
          isToday ? 'ring-2 ring-blue-300' : ''
        ].filter(Boolean).join(' ');
        
        weekDays.push(
          <div
            key={dayKey}
            className={dayClasses}
            onClick={() => handleDayClick(new Date(currentDay), daySessions)}
            onDragOver={(e) => handleDragOver(e, new Date(currentDay))}
            onDrop={(e) => handleDrop(e, new Date(currentDay))}
          >
            {/* Numéro du jour */}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm lg:text-base font-semibold ${
                isCurrentMonth ? (
                  isToday ? 'text-blue-600' : 'text-gray-900'
                ) : 'text-gray-400'
              }`}>
                {currentDay.getDate()}
              </span>
              
              {/* Indicateur du nombre de sessions */}
              {hasSessions && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-medium">
                  {daySessions.length}
                </span>
              )}
            </div>
            
            {/* Mini-cartes des sessions */}
            <div className="space-y-1 lg:space-y-1.5">
              {daySessions.slice(0, 2).map((session) => {
                const status = getSessionStatus(session);
                const statusColors = SessionDisplayService.getStatusColors(status);
                const progressInfo = SessionDisplayService.getProgressIndicator(session);
                const timeRange = SessionDisplayService.formatTimeRange(session.startTime, session.endTime);
                
                return (
                  <motion.div
                    key={session.id}
                    whileHover={{ scale: 1.02 }}
                    className={`${statusColors.bg} ${statusColors.border} border rounded-md p-2 cursor-pointer cursor-target transition-all relative overflow-hidden`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openSessionDetails(session);
                    }}
                  >
                    {/* Barre de statut */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusColors.progressBar}`}></div>
                    
                    <div className="pl-2">
                      {/* Nom abrégé du cours */}
                      <div className={`text-xs lg:text-sm font-semibold ${statusColors.text} leading-tight mb-1 truncate`}>
                        {SessionDisplayService.getCompactCourseName(session)}
                      </div>
                      
                      {/* Heure */}
                      <div className={`text-xs ${statusColors.text} opacity-75 mb-1`}>
                        {timeRange}
                      </div>
                      
                      {/* Indicateur de progression compact */}
                      {SessionDisplayService.shouldShowProgress(session) && (
                        <div className="flex items-center gap-1">
                          <div className={`flex-1 h-1 ${statusColors.progressBg} rounded-full overflow-hidden`}>
                            <div 
                              className={`h-full ${statusColors.progressBar} rounded-full transition-all`}
                              style={{ width: `${progressInfo.percentage}%` }}
                            />
                          </div>
                          {progressInfo.label && (
                            <span className={`text-xs ${statusColors.text} opacity-75 font-medium`}>
                              {progressInfo.label}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Indicateur "+x" si plus de 2 sessions */}
              {daySessions.length > 2 && (
                <div className="text-xs text-gray-500 text-center py-1 bg-gray-100 rounded border border-dashed border-gray-300 cursor-pointer cursor-target hover:bg-gray-200 transition-colors"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleDayClick(new Date(currentDay), daySessions);
                     }}>
                  +{daySessions.length - 2} session{daySessions.length - 2 > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        );
        
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      calendarWeeks.push(
        <div key={week} className="grid grid-cols-7 gap-0">
          {weekDays}
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Header du mois */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate)}
            </h3>
            
            {/* Navigation rapide entre vues */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewSettings(prev => ({ ...prev, currentView: 'week' }))}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                Vue semaine
              </button>
              <button
                onClick={() => setViewSettings(prev => ({ ...prev, currentView: 'day' }))}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                Vue jour
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 lg:p-6">
          {/* Headers des jours de la semaine */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day, index) => (
              <div key={day} className="text-center py-3 border-b border-gray-100">
                <div className="text-sm lg:text-base font-semibold text-gray-600">
                  {day.substring(0, 3)}
                </div>
                <div className="text-xs text-gray-400 mt-1 hidden lg:block">
                  {day}
                </div>
              </div>
            ))}
          </div>
          
          {/* Grille du calendrier */}
          <div className="space-y-0 border border-gray-100 rounded-lg overflow-hidden">
            {calendarWeeks}
          </div>
          
          {/* Légende */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span>Complétée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-violet-200 rounded"></div>
              <span>Aujourd'hui</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span>Manquée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span>À venir</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Premium */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 p-6 shadow-lg shadow-slate-900/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <PlannerViewToggle
              currentView={viewSettings.currentView}
              onViewChange={(view) => setViewSettings(prev => ({ ...prev, currentView: view }))}
            />
          </div>
        </div>

        {/* Navigation moderne */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateDate('prev')}
              className="group w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-blue-100 hover:to-indigo-100 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
            </button>
            
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl px-6 py-3 min-w-[240px]">
              <h3 className="text-lg font-bold text-center bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                {AdvancedPlannerService.formatViewTitle(viewSettings.currentView, currentDate)}
              </h3>
            </div>
            
            <button
              onClick={() => navigateDate('next')}
              className="group w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-blue-100 hover:to-indigo-100 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
            </button>
            
            <p className="text-sm text-slate-600 font-medium ml-3">
              {plan.sessions.length} sessions • {plan.totalEstimatedHours}h au total
            </p>
          </div>

          {/* Actions Premium */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Bouton Accéder au cours - Affiché seulement si un cours focalisé existe */}
            {focusedCourse && onNavigateToCourse && (
              <button
                onClick={() => onNavigateToCourse(focusedCourse.id)}
                className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border border-emerald-400 text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 flex items-center gap-2"
                title={`Retourner au cours "${focusedCourse.title}"`}
              >
                <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Revenir au cours</span>
                <span className="sm:hidden">Cours</span>
              </button>
            )}
            
            <button
              onClick={onEditPlan}
              className="group bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 border border-slate-300 text-slate-700 hover:text-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Modifier</span>
              <span className="sm:hidden">Éditer</span>
            </button>
            
            <button
              onClick={onRegeneratePlan}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline">Régénérer</span>
              <span className="sm:hidden">Refaire</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 xl:p-8 2xl:p-10">
        <div className="max-w-full mx-auto space-y-8 px-4">
          {/* Coaching Banner */}
          <CoachingBanner
            message={coachingMessage}
            onAction={() => {
              if (coachingMessage?.actionCallback) {
                coachingMessage.actionCallback();
              }
            }}
            onDismiss={() => setCoachingMessage(null)}
          />

          {/* Message de reprogrammation */}
          {rescheduleMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-medium">{rescheduleMessage}</span>
              </div>
            </motion.div>
          )}

          {/* Adaptation Suggestions */}
          {adaptationSuggestions.length > 0 && (
            <AdaptationSuggestions
              suggestions={adaptationSuggestions}
              onApplySuggestion={onApplyAdaptation || (() => {})}
              onDismissSuggestion={onDismissSuggestion || (() => {})}
            />
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8">
            {/* Planning View - Utilise toute la largeur disponible */}
            <div className="w-full">
              {viewSettings.currentView === 'day' && renderDayView()}
              {viewSettings.currentView === 'week' && renderWeekView()}
              {viewSettings.currentView === 'month' && renderMonthView()}
            </div>
          </div>
        </div>
      </div>

      {/* Missed Session Alert */}
      {missedSessionAlert && (
        <MissedSessionAlert
          alert={missedSessionAlert}
          onClose={onCloseMissedAlert || (() => {})}
          onAutoReschedule={(newDate) => onRescheduleSession?.(missedSessionAlert.sessionId, newDate, true)}
          onManualReschedule={onManualReschedule || (() => {})}
        />
      )}

      {/* Session Details Panel */}
      <div className="mt-6">
        <SessionDetailsPanel
          session={selectedSession}
          isOpen={isDetailsOpen}
          onClose={closeSessionDetails}
          onLaunchVideo={handleLaunchVideo}
          onLaunchQuiz={handleLaunchQuiz}
          onReschedule={handleReschedule}
          onProgressUpdate={handleSessionProgressUpdate}
        />
      </div>

      {/* Badge Notification Popup */}
      <BadgeNotificationPopup
        notification={badgeNotification}
        onDismiss={() => setBadgeNotification(null)}
      />
    </div>
  );
}
