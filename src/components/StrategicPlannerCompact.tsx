import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Settings,
  Heart,
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  Users,
  Target,
  BookOpen,
  Play,
  Pause,
  AlertTriangle,
  RefreshCw,
  CalendarDays,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { PlannerAccess, StudyPreferences, StudyPlan, BuddySystem, Course } from '@/types/index';
import { SocialPlannerIntegration } from './SocialPlannerIntegration';
import { ParticipativeExamDates } from './ParticipativeExamDates';
import { AdvancedPlanDisplay } from './AdvancedPlanDisplay';
import { useAdvancedPlanner } from '@/lib/use-advanced-planner';

interface StrategicPlannerCompactProps {
  plannerAccess: PlannerAccess;
  onGeneratePlan?: (preferences: StudyPreferences) => StudyPlan;
  onWhatsAppContact?: () => void;
  onUpgrade?: () => void;
  onRestartOnboarding?: () => void;
  buddy?: BuddySystem | null;
  onAddBuddy?: (buddy: Omit<BuddySystem, 'id' | 'userId'>) => void;
  onUpdateBuddy?: (buddy: BuddySystem) => void;
  onRemoveBuddy?: () => void;
  onSendBuddyNotification?: (type: 'missed-session' | 'progress-update', sessionName?: string) => void;
  favoriteCourses?: Array<{
    id: string;
    title: string;
    examDate?: Date;
    progress?: number;
  }>;
  focusedCourse?: Course | null;
  onNavigateToCourse?: (courseId: string) => void;
  existingPlan?: StudyPlan | null;
  hideHeader?: boolean;
}

// Mock lessons per track for the track-specific planning view
const mockTrackLessons: Record<string, Array<{
  id: string;
  title: string;
  lessonNumber: string;
  scheduledDate: Date | null;
  status: 'completed' | 'current' | 'upcoming' | 'not-scheduled';
  duration: string;
}>> = {
  'ondes-mecaniques': [
    { id: 'om-1', title: 'Introduction aux ondes', lessonNumber: '1.1', scheduledDate: new Date('2024-12-23'), status: 'completed', duration: '25 min' },
    { id: 'om-2', title: 'Types d\'ondes mécaniques', lessonNumber: '1.2', scheduledDate: new Date('2024-12-26'), status: 'completed', duration: '30 min' },
    { id: 'om-3', title: 'Caractéristiques des ondes', lessonNumber: '2.1', scheduledDate: new Date('2024-12-28'), status: 'completed', duration: '35 min' },
    { id: 'om-4', title: 'Propagation des ondes', lessonNumber: '3.2', scheduledDate: new Date('2024-12-31'), status: 'current', duration: '40 min' },
    { id: 'om-5', title: 'Réflexion et réfraction', lessonNumber: '3.3', scheduledDate: new Date('2025-01-03'), status: 'upcoming', duration: '35 min' },
    { id: 'om-6', title: 'Interférences', lessonNumber: '4.1', scheduledDate: new Date('2025-01-07'), status: 'upcoming', duration: '45 min' },
    { id: 'om-7', title: 'Diffraction', lessonNumber: '4.2', scheduledDate: new Date('2025-01-10'), status: 'upcoming', duration: '40 min' },
    { id: 'om-8', title: 'Ondes stationnaires', lessonNumber: '5.1', scheduledDate: new Date('2025-01-14'), status: 'upcoming', duration: '35 min' },
    { id: 'om-9', title: 'Applications pratiques', lessonNumber: '5.2', scheduledDate: new Date('2025-01-17'), status: 'not-scheduled', duration: '30 min' },
    { id: 'om-10', title: 'Révision finale', lessonNumber: '6.1', scheduledDate: new Date('2025-02-12'), status: 'not-scheduled', duration: '50 min' },
  ],
  'suites-limites': [
    { id: 'sl-1', title: 'Définition des suites', lessonNumber: '1.1', scheduledDate: new Date('2024-12-20'), status: 'completed', duration: '30 min' },
    { id: 'sl-2', title: 'Suites arithmétiques', lessonNumber: '1.2', scheduledDate: new Date('2024-12-22'), status: 'completed', duration: '35 min' },
    { id: 'sl-3', title: 'Suites géométriques', lessonNumber: '2.1', scheduledDate: new Date('2024-12-25'), status: 'completed', duration: '35 min' },
    { id: 'sl-4', title: 'Convergence des suites', lessonNumber: '3.1', scheduledDate: new Date('2024-12-29'), status: 'completed', duration: '40 min' },
    { id: 'sl-5', title: 'Convergence et divergence', lessonNumber: '4.1', scheduledDate: new Date('2025-01-01'), status: 'current', duration: '45 min' },
    { id: 'sl-6', title: 'Limites de fonctions', lessonNumber: '4.2', scheduledDate: new Date('2025-01-04'), status: 'upcoming', duration: '40 min' },
    { id: 'sl-7', title: 'Théorèmes de comparaison', lessonNumber: '5.1', scheduledDate: new Date('2025-01-08'), status: 'upcoming', duration: '35 min' },
    { id: 'sl-8', title: 'Révision finale', lessonNumber: '6.1', scheduledDate: new Date('2025-02-18'), status: 'not-scheduled', duration: '50 min' },
  ],
  'equilibres-chimiques': [
    { id: 'ec-1', title: 'Introduction aux équilibres', lessonNumber: '1.1', scheduledDate: new Date('2024-12-27'), status: 'completed', duration: '30 min' },
    { id: 'ec-2', title: 'Constantes d\'équilibre', lessonNumber: '2.3', scheduledDate: new Date('2025-01-02'), status: 'current', duration: '40 min' },
    { id: 'ec-3', title: 'Les acides et bases', lessonNumber: '3.1', scheduledDate: null, status: 'not-scheduled', duration: '45 min' },
    { id: 'ec-4', title: 'Réactions acido-basiques', lessonNumber: '3.2', scheduledDate: new Date('2025-01-06'), status: 'upcoming', duration: '40 min' },
    { id: 'ec-5', title: 'Réactions d\'oxydoréduction', lessonNumber: '4.1', scheduledDate: null, status: 'not-scheduled', duration: '45 min' },
    { id: 'ec-6', title: 'Équilibres de précipitation', lessonNumber: '5.1', scheduledDate: new Date('2025-01-15'), status: 'upcoming', duration: '35 min' },
    { id: 'ec-7', title: 'Applications industrielles', lessonNumber: '6.1', scheduledDate: new Date('2025-02-20'), status: 'not-scheduled', duration: '40 min' },
    { id: 'ec-8', title: 'Révision finale', lessonNumber: '7.1', scheduledDate: new Date('2025-02-27'), status: 'not-scheduled', duration: '50 min' },
  ],
  'forces-mouvement': [
    { id: 'fm-1', title: 'Les forces fondamentales', lessonNumber: '1.1', scheduledDate: null, status: 'not-scheduled', duration: '30 min' },
    { id: 'fm-2', title: 'Lois de Newton', lessonNumber: '1.2', scheduledDate: null, status: 'not-scheduled', duration: '40 min' },
    { id: 'fm-3', title: 'Travail et énergie', lessonNumber: '2.1', scheduledDate: null, status: 'not-scheduled', duration: '35 min' },
    { id: 'fm-4', title: 'Conservation de l\'énergie', lessonNumber: '2.2', scheduledDate: null, status: 'not-scheduled', duration: '40 min' },
    { id: 'fm-5', title: 'Quantité de mouvement', lessonNumber: '3.1', scheduledDate: null, status: 'not-scheduled', duration: '35 min' },
  ],
};

// Mock learning tracks data for the global view
const mockLearningTracks = [
  { 
    id: 'ondes-mecaniques', 
    title: 'Ondes mécaniques', 
    programme: 'Physique', 
    progress: 45, 
    examDate: new Date('2025-02-15'), 
    status: 'active', 
    sessionsThisWeek: 3, 
    nextSession: 'Aujourd\'hui à 14h',
    currentChapter: 'Propagation des ondes',
    isOnTrack: true
  },
  { 
    id: 'suites-limites', 
    title: 'Suites et Limites', 
    programme: 'Mathématiques', 
    progress: 67, 
    examDate: new Date('2025-02-20'), 
    status: 'active', 
    sessionsThisWeek: 2, 
    nextSession: 'Demain à 9h',
    currentChapter: 'Convergence des suites',
    isOnTrack: true
  },
  { 
    id: 'equilibres-chimiques', 
    title: 'Équilibres Chimiques', 
    programme: 'Chimie', 
    progress: 23, 
    examDate: new Date('2025-03-01'), 
    status: 'behind', 
    sessionsThisWeek: 1, 
    nextSession: 'Mercredi à 17h',
    currentChapter: 'Constantes d\'équilibre',
    isOnTrack: false,
    missedSessions: 2
  },
  { 
    id: 'forces-mouvement', 
    title: 'Forces et Mouvement', 
    programme: 'Physique', 
    progress: 0, 
    examDate: null, 
    status: 'not-started', 
    sessionsThisWeek: 0, 
    nextSession: null,
    currentChapter: null,
    isOnTrack: true
  },
];

// Mock today's sessions - Just tasks, no hours
const mockTodaySessions = [
  { 
    id: 'session-1',
    trackId: 'course-forces',
    trackTitle: 'Ondes mécaniques',
    lessonTitle: 'Propagation des ondes',
    lessonNumber: 'Leçon 3.2',
    lessonId: 'lesson-3-2',
    status: 'completed',
    type: 'lesson'
  },
  { 
    id: 'session-2',
    trackId: 'course-integrales',
    trackTitle: 'Suites et Limites',
    lessonTitle: 'Convergence et divergence',
    lessonNumber: 'Leçon 4.1',
    lessonId: 'lesson-4-1',
    status: 'current',
    type: 'lesson'
  },
  { 
    id: 'session-3',
    trackId: 'course-equilibres',
    trackTitle: 'Équilibres Chimiques',
    lessonTitle: 'Les constantes d\'équilibre',
    lessonNumber: 'Leçon 2.3',
    lessonId: 'lesson-2-3',
    status: 'upcoming',
    type: 'lesson'
  },
];

// Mock week sessions
const mockWeekSessions = [
  { day: 'Lundi', date: '30 déc', sessions: [
    { id: 'w1', trackTitle: 'Ondes mécaniques', lessonTitle: 'Propagation des ondes', status: 'completed' },
    { id: 'w2', trackTitle: 'Suites et Limites', lessonTitle: 'Convergence et divergence', status: 'completed' },
  ]},
  { day: 'Mardi', date: '31 déc', sessions: [
    { id: 'w3', trackTitle: 'Équilibres Chimiques', lessonTitle: 'Les constantes d\'équilibre', status: 'upcoming' },
  ]},
  { day: 'Mercredi', date: '1 jan', sessions: [
    { id: 'w4', trackTitle: 'Ondes mécaniques', lessonTitle: 'Réflexion et réfraction', status: 'upcoming' },
    { id: 'w5', trackTitle: 'Suites et Limites', lessonTitle: 'Limites de fonctions', status: 'upcoming' },
  ]},
  { day: 'Jeudi', date: '2 jan', sessions: [] },
  { day: 'Vendredi', date: '3 jan', sessions: [
    { id: 'w6', trackTitle: 'Équilibres Chimiques', lessonTitle: 'Réactions acido-basiques', status: 'upcoming' },
  ]},
  { day: 'Samedi', date: '4 jan', sessions: [] },
  { day: 'Dimanche', date: '5 jan', sessions: [] },
];

// Mock month sessions (with detailed session data for drag & drop)
interface MonthSession {
  id: string;
  title: string;
  track: string;
  status: 'completed' | 'upcoming';
}

interface MonthDay {
  date: number;
  sessions: MonthSession[];
  isToday: boolean;
  hasExam?: boolean;
  examTitle?: string;
}

const mockMonthDataInitial: { week: number; days: MonthDay[] }[] = [
  { week: 1, days: [
    { date: 30, sessions: [
      { id: 'm1', title: 'Propagation des ondes', track: 'Ondes mécaniques', status: 'completed' },
      { id: 'm2', title: 'Convergence', track: 'Suites et Limites', status: 'completed' }
    ], isToday: true },
    { date: 31, sessions: [
      { id: 'm3', title: 'Constantes d\'équilibre', track: 'Équilibres Chimiques', status: 'upcoming' }
    ], isToday: false },
    { date: 1, sessions: [
      { id: 'm4', title: 'Réflexion et réfraction', track: 'Ondes mécaniques', status: 'upcoming' },
      { id: 'm5', title: 'Limites de fonctions', track: 'Suites et Limites', status: 'upcoming' }
    ], isToday: false },
    { date: 2, sessions: [], isToday: false },
    { date: 3, sessions: [
      { id: 'm6', title: 'Réactions acido-basiques', track: 'Équilibres Chimiques', status: 'upcoming' }
    ], isToday: false },
    { date: 4, sessions: [], isToday: false },
    { date: 5, sessions: [], isToday: false },
  ]},
  { week: 2, days: [
    { date: 6, sessions: [
      { id: 'm7', title: 'Interférences', track: 'Ondes mécaniques', status: 'upcoming' },
      { id: 'm8', title: 'Théorèmes de comparaison', track: 'Suites et Limites', status: 'upcoming' }
    ], isToday: false },
    { date: 7, sessions: [
      { id: 'm9', title: 'Diffraction', track: 'Ondes mécaniques', status: 'upcoming' }
    ], isToday: false },
    { date: 8, sessions: [
      { id: 'm10', title: 'Ondes stationnaires', track: 'Ondes mécaniques', status: 'upcoming' },
      { id: 'm11', title: 'Équilibres de précipitation', track: 'Équilibres Chimiques', status: 'upcoming' }
    ], isToday: false },
    { date: 9, sessions: [
      { id: 'm12', title: 'Révision suites', track: 'Suites et Limites', status: 'upcoming' }
    ], isToday: false },
    { date: 10, sessions: [
      { id: 'm13', title: 'Applications pratiques', track: 'Ondes mécaniques', status: 'upcoming' },
      { id: 'm14', title: 'Applications industrielles', track: 'Équilibres Chimiques', status: 'upcoming' }
    ], isToday: false },
    { date: 11, sessions: [], isToday: false },
    { date: 12, sessions: [], isToday: false },
  ]},
  { week: 3, days: [
    { date: 13, sessions: [
      { id: 'm15', title: 'Révision générale', track: 'Ondes mécaniques', status: 'upcoming' }
    ], isToday: false },
    { date: 14, sessions: [
      { id: 'm16', title: 'Exercices de synthèse', track: 'Ondes mécaniques', status: 'upcoming' },
      { id: 'm17', title: 'QCM d\'entraînement', track: 'Suites et Limites', status: 'upcoming' }
    ], isToday: false },
    { date: 15, sessions: [
      { id: 'm18', title: 'Dernier révision', track: 'Ondes mécaniques', status: 'upcoming' }
    ], isToday: false, hasExam: true, examTitle: 'Ondes mécaniques' },
    { date: 16, sessions: [
      { id: 'm19', title: 'Révision finale', track: 'Équilibres Chimiques', status: 'upcoming' }
    ], isToday: false },
    { date: 17, sessions: [
      { id: 'm20', title: 'Exercices avancés', track: 'Suites et Limites', status: 'upcoming' },
      { id: 'm21', title: 'Préparation examen', track: 'Équilibres Chimiques', status: 'upcoming' }
    ], isToday: false },
    { date: 18, sessions: [], isToday: false },
    { date: 19, sessions: [], isToday: false },
  ]},
];

// Mock missed sessions
const mockMissedSessions = [
  {
    id: 'missed-1',
    date: 'Hier',
    trackTitle: 'Équilibres Chimiques',
    chapter: 'Les acides et bases',
    suggestedReschedule: 'Demain à 10h'
  },
  {
    id: 'missed-2',
    date: 'Lundi',
    trackTitle: 'Équilibres Chimiques',
    chapter: 'Réactions d\'oxydoréduction',
    suggestedReschedule: 'Jeudi à 14h'
  },
];

// Helper functions for contextual micro-copy
const getProgressHint = (progress: number, isOnTrack: boolean) => {
  if (progress === 0) return 'Prêt à démarrer';
  if (!isOnTrack) return 'Un peu de retard à rattraper';
  if (progress < 30) return 'Les bases sont en place';
  if (progress < 60) return 'Tu avances bien';
  return 'Objectif en vue';
};

const formatDate = (date: Date | null) => {
  if (!date) return 'Non définie';
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short'
  }).format(new Date(date));
};

const getDaysUntil = (date: Date | null) => {
  if (!date) return null;
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Passé';
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Demain';
  return `${days}j`;
};

export function StrategicPlannerCompact({ 
  plannerAccess, 
  onGeneratePlan,
  onWhatsAppContact,
  onUpgrade,
  onRestartOnboarding,
  buddy,
  onAddBuddy,
  onUpdateBuddy,
  onRemoveBuddy,
  onSendBuddyNotification,
  favoriteCourses = [],
  focusedCourse,
  onNavigateToCourse,
  existingPlan = null,
  hideHeader = false
}: StrategicPlannerCompactProps) {
  
  const [preferences, setPreferences] = useState<StudyPreferences>({
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    preferredStartTime: '09:00',
    preferredEndTime: '17:00',
    dailyStudyHours: 3,
    preferredStudySlots: ['morning', 'afternoon'],
    breakDuration: 15,
    studyIntensity: 'moderate'
  });

  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(existingPlan);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'setup' | 'overview'>('overview');
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');
  const [showTrackDetails, setShowTrackDetails] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  
  // State pour le drag & drop des sessions
  const [weekSessions, setWeekSessions] = useState(mockWeekSessions);
  const [monthData, setMonthData] = useState(mockMonthDataInitial);
  const [draggedSession, setDraggedSession] = useState<{ sessionId: string; fromDay: string | number } | null>(null);
  const [dragOverDay, setDragOverDay] = useState<string | number | null>(null);
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  // Helper function to map course to track ID
  const mapCourseToTrackId = (course: Course | null | undefined): string | null => {
    if (!course) return null;
    
    const courseToTrackMap: Record<string, string> = {
      'course-suites': 'suites-limites',
      'course-equilibres': 'equilibres-chimiques',
      'course-forces': 'forces-mouvement',
      'course-integrales': 'suites-limites',
      'course-gauss': 'ondes-mecaniques',
      'course-physique-mecanique': 'forces-mouvement',
      'ondes-mecaniques': 'ondes-mecaniques',
      'suites-limites': 'suites-limites',
      'equilibres-chimiques': 'equilibres-chimiques',
      'forces-mouvement': 'forces-mouvement',
    };
    
    let mappedId = courseToTrackMap[course.id];
    
    if (!mappedId) {
      const title = course.title.toLowerCase();
      if (title.includes('onde') || title.includes('physique') || title.includes('gauss')) {
        mappedId = 'ondes-mecaniques';
      } else if (title.includes('suite') || title.includes('limite') || title.includes('math') || title.includes('intégrale')) {
        mappedId = 'suites-limites';
      } else if (title.includes('chimi') || title.includes('équilibre')) {
        mappedId = 'equilibres-chimiques';
      } else if (title.includes('force') || title.includes('mouvement') || title.includes('mécanique')) {
        mappedId = 'forces-mouvement';
      } else {
        mappedId = 'ondes-mecaniques';
      }
    }
    
    return mappedId;
  };

  // Initialize with the correct track if hideHeader is true (contextual mode)
  const initialTrackPlanning = hideHeader && focusedCourse ? mapCourseToTrackId(focusedCourse) : null;
  const [selectedTrackPlanning, setSelectedTrackPlanning] = useState<string | null>(initialTrackPlanning);
  const [rescheduleModal, setRescheduleModal] = useState<{ isOpen: boolean; session: typeof mockMissedSessions[0] | null }>({ isOpen: false, session: null });

  // Drag & Drop handlers pour les sessions
  const handleDragStart = (e: React.DragEvent, sessionId: string, fromDay: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sessionId);
    setDraggedSession({ sessionId, fromDay });
  };

  const handleDragOver = (e: React.DragEvent, dayName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDay(dayName);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = (e: React.DragEvent, toDay: string) => {
    e.preventDefault();
    setDragOverDay(null);
    
    if (!draggedSession || draggedSession.fromDay === toDay) {
      setDraggedSession(null);
      return;
    }

    setWeekSessions(prev => {
      const newSessions = prev.map(day => ({ ...day, sessions: [...day.sessions] }));
      
      // Trouver et retirer la session du jour source
      const fromDayIndex = newSessions.findIndex(d => d.day === draggedSession.fromDay);
      const toDayIndex = newSessions.findIndex(d => d.day === toDay);
      
      if (fromDayIndex === -1 || toDayIndex === -1) return prev;
      
      const sessionIndex = newSessions[fromDayIndex].sessions.findIndex(s => s.id === draggedSession.sessionId);
      if (sessionIndex === -1) return prev;
      
      const [session] = newSessions[fromDayIndex].sessions.splice(sessionIndex, 1);
      newSessions[toDayIndex].sessions.push(session);
      
      return newSessions;
    });
    
    setDraggedSession(null);
  };

  const handleDragEnd = () => {
    setDraggedSession(null);
    setDragOverDay(null);
  };

  // Drag & Drop handlers pour la vue mois
  const handleMonthDragStart = (e: React.DragEvent, sessionId: string, fromDate: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sessionId);
    setDraggedSession({ sessionId, fromDay: fromDate });
  };

  const handleMonthDragOver = (e: React.DragEvent, date: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDay(date);
  };

  const handleMonthDrop = (e: React.DragEvent, toDate: number) => {
    e.preventDefault();
    setDragOverDay(null);
    
    if (!draggedSession || draggedSession.fromDay === toDate) {
      setDraggedSession(null);
      return;
    }

    setMonthData(prev => {
      const newData = prev.map(week => ({
        ...week,
        days: week.days.map(day => ({ ...day, sessions: [...day.sessions] }))
      }));
      
      // Trouver le jour source et destination
      let sessionToMove: MonthSession | null = null;
      
      for (const week of newData) {
        for (const day of week.days) {
          if (day.date === draggedSession.fromDay) {
            const sessionIndex = day.sessions.findIndex(s => s.id === draggedSession.sessionId);
            if (sessionIndex !== -1) {
              [sessionToMove] = day.sessions.splice(sessionIndex, 1);
            }
          }
        }
      }
      
      if (sessionToMove) {
        for (const week of newData) {
          for (const day of week.days) {
            if (day.date === toDate) {
              day.sessions.push(sessionToMove);
            }
          }
        }
      }
      
      return newData;
    });
    
    setDraggedSession(null);
  };

  // Update when focusedCourse or hideHeader changes
  useEffect(() => {
    if (focusedCourse && hideHeader) {
      const mappedId = mapCourseToTrackId(focusedCourse);
      console.log('📅 Planning contextuel: hideHeader=', hideHeader, 'course.id=', focusedCourse.id, 'course.title=', focusedCourse.title, '→ trackId=', mappedId);
      setSelectedTrackPlanning(mappedId);
    } else if (!hideHeader) {
      setSelectedTrackPlanning(null);
    }
  }, [focusedCourse, hideHeader]);
  const [selectedRescheduleTime, setSelectedRescheduleTime] = useState<string>('');
  const [rescheduleToast, setRescheduleToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // Hook pour le planificateur avancé
  const advancedPlanner = useAdvancedPlanner({
    hasAccess: plannerAccess.canCreatePlan,
    plannerAccess
  });

  const handleGeneratePlan = () => {
    if (!onGeneratePlan) return;
    
    setIsGeneratingPlan(true);
    
    setTimeout(() => {
      const plan = onGeneratePlan(preferences);
      setGeneratedPlan(plan);
      setIsGeneratingPlan(false);
      setViewMode('overview');
    }, 2000);
  };

  const handleCompleteStep = (step: 1 | 2 | 3) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    if (step < 3) {
      setActiveStep((step + 1) as 1 | 2 | 3);
    }
  };

  const handleSessionClick = (lessonId: string, trackId: string) => {
    // Navigate to the lesson player
    if (onNavigateToCourse) {
      onNavigateToCourse(trackId);
    }
    console.log('Navigate to lesson:', lessonId, 'in track:', trackId);
  };

  const steps = [
    { id: 1, title: 'Préférences', icon: Settings, description: 'Jours, heures, intensité' },
    { id: 2, title: 'Buddies', icon: Heart, description: 'Soutien et motivation' },
    { id: 3, title: 'Échéances', icon: Calendar, description: 'Dates d\'examen' },
  ];

  const missedCount = mockMissedSessions.length;
  const tracksWithDelay = mockLearningTracks.filter(t => !t.isOnTrack).length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Fixed Header with responsive Parafina title - Hidden when hideHeader is true */}
      {!hideHeader && (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 md:px-8 py-4 md:py-6 shadow-sm z-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h1 
              className="text-gray-900 uppercase tracking-tight"
              style={{ fontFamily: 'var(--font-parafina)', fontSize: 'clamp(32px, 8vw, 64px)', lineHeight: '1' }}
            >
              PLANIFICATION
            </h1>
            
            {/* View toggle - responsive grid */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all text-center min-h-[44px] ${
                  viewMode === 'overview'
                    ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              >
                Vue d&apos;ensemble
              </button>
              <button
                onClick={() => setViewMode('setup')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all text-center min-h-[44px] ${
                  viewMode === 'setup'
                    ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              >
                Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content - No scroll */}
      <div className="flex-1 overflow-hidden p-4 md:p-8">
        <AnimatePresence mode="wait">
          {viewMode === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* TRACK-SPECIFIC PLANNING VIEW - LIGHT MODE */}
              {console.log('📅 RENDER: selectedTrackPlanning=', selectedTrackPlanning, 'hideHeader=', hideHeader, 'focusedCourse=', focusedCourse?.id)}
              {selectedTrackPlanning && (() => {
                const track = mockLearningTracks.find(t => t.id === selectedTrackPlanning);
                const lessons = mockTrackLessons[selectedTrackPlanning] || [];
                const completedCount = lessons.filter(l => l.status === 'completed').length;
                const totalCount = lessons.length;
                
                // Group lessons by week
                const groupedByWeek: Record<string, typeof lessons> = {};
                lessons.forEach(lesson => {
                  if (lesson.scheduledDate) {
                    const weekStart = new Date(lesson.scheduledDate);
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
                    const weekKey = weekStart.toISOString().split('T')[0];
                    if (!groupedByWeek[weekKey]) groupedByWeek[weekKey] = [];
                    groupedByWeek[weekKey].push(lesson);
                  }
                });
                
                const unscheduledLessons = lessons.filter(l => !l.scheduledDate);
                
                const formatWeekLabel = (dateStr: string) => {
                  const date = new Date(dateStr);
                  const endDate = new Date(date);
                  endDate.setDate(endDate.getDate() + 6);
                  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
                  return `${date.toLocaleDateString('fr-FR', options)} - ${endDate.toLocaleDateString('fr-FR', options)}`;
                };

                const formatDate = (date: Date) => {
                  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
                };

                const daysUntilExam = track?.examDate 
                  ? Math.ceil((track.examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : null;

                return (
                  <div 
                    id="track-planning-view"
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                  >
                    {/* Header - Hidden when hideHeader (contextual mode) */}
                    {!hideHeader && (
                    <div className="px-6 py-5 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <button 
                            onClick={() => setSelectedTrackPlanning(null)}
                            className="flex items-center gap-2 mb-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <ChevronRight size={16} className="rotate-180" />
                            Retour aux parcours
                          </button>
                          <h2 className="text-2xl font-bold text-gray-900">
                            Planning : {track?.title}
                          </h2>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Progress box */}
                          <div className="px-5 py-3 rounded-xl text-center bg-gray-100 border border-gray-200">
                            <p className="text-xs uppercase tracking-wider mb-1 text-gray-500">Progression</p>
                            <p className="text-lg font-bold text-gray-900">
                              {completedCount}/{totalCount}
                            </p>
                          </div>
                          {/* Exam box */}
                          {track?.examDate && (
                            <div className="px-5 py-3 rounded-xl text-center bg-gray-900">
                              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#ffffff' }}>Examen</p>
                              <p className="text-lg font-bold" style={{ color: '#ffffff' }}>
                                {track.examDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="w-full h-2 rounded-full bg-gray-100">
                          <div 
                            className="h-full rounded-full transition-all bg-gray-900"
                            style={{ width: `${(completedCount / totalCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Lessons timeline */}
                    <div className="p-6">
                      <div className="space-y-6">
                        {/* Unscheduled lessons - À PLANIFIER - Always at top */}
                        {unscheduledLessons.length > 0 && (
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-100 text-orange-600">
                                À planifier
                              </div>
                              <div className="flex-1 h-px bg-orange-200" />
                            </div>
                            
                            <div className="space-y-2 ml-2">
                              {unscheduledLessons.map((lesson) => (
                                <div 
                                  key={lesson.id}
                                  className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 border border-orange-200"
                                >
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-100">
                                    <AlertTriangle size={18} className="text-orange-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-base font-semibold text-gray-800">
                                      {lesson.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Leçon {lesson.lessonNumber} • {lesson.duration}
                                    </p>
                                  </div>
                                  <button className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                                    Planifier
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Scheduled weeks */}
                        {Object.entries(groupedByWeek).sort(([a], [b]) => a.localeCompare(b)).map(([weekKey, weekLessons]) => (
                          <div key={weekKey}>
                            {/* Week header */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gray-100 text-gray-600">
                                {formatWeekLabel(weekKey)}
                              </div>
                              <div className="flex-1 h-px bg-gray-100" />
                            </div>
                            
                            {/* Lessons in this week */}
                            <div className="space-y-2 ml-2">
                              {weekLessons.sort((a, b) => (a.scheduledDate?.getTime() || 0) - (b.scheduledDate?.getTime() || 0)).map((lesson) => (
                                <div 
                                  key={lesson.id}
                                  onClick={() => {
                                    if (onNavigateToCourse && selectedTrackPlanning) {
                                      onNavigateToCourse(selectedTrackPlanning);
                                    }
                                  }}
                                  className={`flex items-center justify-between gap-4 p-4 rounded-xl transition-all cursor-pointer hover:shadow-md ${
                                    lesson.status === 'current' 
                                      ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100' 
                                      : lesson.status === 'completed'
                                      ? 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  {/* Left side: Icon + Lesson info + Date */}
                                  <div className="flex items-center gap-4">
                                    {/* Status icon */}
                                    <div 
                                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                      style={{
                                        backgroundColor: lesson.status === 'completed' 
                                          ? 'rgba(72,198,237,0.15)' 
                                          : lesson.status === 'current'
                                          ? '#48c6ed'
                                          : '#f3f4f6'
                                      }}
                                    >
                                      {lesson.status === 'completed' ? (
                                        <Check size={18} style={{ color: '#48c6ed' }} />
                                      ) : lesson.status === 'current' ? (
                                        <Play size={18} className="text-white" />
                                      ) : (
                                        <Clock size={18} className="text-gray-400" />
                                      )}
                                    </div>

                                    {/* Lesson info with date inline */}
                                    <div className="min-w-0">
                                      <p 
                                        className={`text-base font-semibold ${
                                          lesson.status === 'completed' 
                                            ? 'text-gray-400' 
                                            : lesson.status === 'current'
                                            ? 'text-gray-900'
                                            : 'text-gray-800'
                                        }`}
                                      >
                                        {lesson.title}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Leçon {lesson.lessonNumber} • {lesson.duration}
                                        {lesson.scheduledDate && (
                                          <span className={`ml-2 ${lesson.status === 'current' ? 'text-blue-600 font-medium' : ''}`}>
                                            • {formatDate(lesson.scheduledDate)}
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Right side: CTA only */}
                                  <div className="flex items-center flex-shrink-0">
                                    {lesson.status === 'current' && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (onNavigateToCourse && selectedTrackPlanning) {
                                            onNavigateToCourse(selectedTrackPlanning);
                                          }
                                        }}
                                        className="px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:brightness-110"
                                        style={{ backgroundColor: '#48c6ed', color: '#ffffff' }}
                                      >
                                        <Play size={14} fill="#ffffff" />
                                        Continuer
                                      </button>
                                    )}
                                    {lesson.status === 'completed' && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (onNavigateToCourse && selectedTrackPlanning) {
                                            onNavigateToCourse(selectedTrackPlanning);
                                          }
                                        }}
                                        className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
                                      >
                                        Revoir
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* SECTION 1: Two-column layout for Day view */}
              {!selectedTrackPlanning && calendarView === 'day' && !showTrackDetails && (
                <div 
                  className={`grid gap-6 ${missedCount > 0 ? 'grid-cols-1 lg:[grid-template-columns:3fr_2fr]' : 'grid-cols-1'}`}
                >
                  {/* Left: Today's lessons - DARK THEME */}
                  <div 
                    className="rounded-3xl overflow-hidden" 
                    style={{ 
                      backgroundColor: '#0d1317',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}
                  >
                    {/* Header */}
                    <div 
                      className="px-8 py-6" 
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>Aujourd'hui, ton plan de jeu</h2>
                          <p className="text-base mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            {mockTodaySessions.length} leçons • {mockTodaySessions.filter(s => s.status === 'completed').length} terminées
                          </p>
                        </div>
                        <div className="flex items-center gap-1 p-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                          {(['day', 'week', 'month'] as const).map((view) => (
                  <button
                              key={view}
                              onClick={() => setCalendarView(view)}
                              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                              style={{
                                backgroundColor: calendarView === view ? '#ffffff' : 'transparent',
                                color: calendarView === view ? '#0d1317' : 'rgba(255,255,255,0.6)'
                              }}
                            >
                              {view === 'day' ? 'Jour' : view === 'week' ? 'Sem' : 'Mois'}
                  </button>
                          ))}
                        </div>
                      </div>
                </div>

                    {/* Cards */}
                    <div className="p-5">
                      <div className="space-y-2">
                      {mockTodaySessions.map((session, idx) => (
                      <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          onClick={() => handleSessionClick(session.lessonId, session.trackId)}
                          className="p-5 rounded-2xl cursor-pointer transition-all"
                          style={{ 
                            backgroundColor: session.status === 'current' 
                              ? 'rgba(255,255,255,0.05)' 
                              : session.status === 'completed'
                              ? 'rgba(255,255,255,0.02)'
                              : 'rgba(255,255,255,0.025)',
                            border: session.status === 'current' 
                              ? '1px solid rgba(72,198,237,0.15)'
                              : '1px solid rgba(255,255,255,0.04)',
                            boxShadow: session.status === 'current' 
                              ? '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)'
                              : 'inset 0 1px 0 rgba(255,255,255,0.02)'
                          }}
                        >
                          <div className="flex items-center gap-5">
                            {/* Status icon */}
                            <div 
                              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                              style={{ 
                                backgroundColor: session.status === 'completed' 
                                  ? 'rgba(255,255,255,0.15)' 
                                  : session.status === 'current'
                                  ? '#48c6ed'
                                  : 'rgba(255,255,255,0.12)',
                                border: session.status === 'current' 
                                  ? 'none' 
                                  : session.status === 'completed'
                                  ? '1px solid rgba(255,255,255,0.1)'
                                  : '1px solid rgba(255,255,255,0.08)'
                              }}
                            >
                              {session.status === 'completed' ? (
                                <Check size={24} style={{ color: '#0d1317' }} />
                              ) : session.status === 'current' ? (
                                <Pause size={24} style={{ color: '#0d1317' }} />
                              ) : (
                                <Clock size={24} style={{ color: 'rgba(255,255,255,0.7)' }} />
                              )}
                          </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Track name */}
                              <p 
                                className="text-xs font-semibold uppercase tracking-wider mb-1.5" 
                                style={{ 
                                  color: session.status === 'completed' 
                                    ? 'rgba(255,255,255,0.3)' 
                                    : session.status === 'current'
                                    ? 'rgba(255,255,255,0.55)'
                                    : 'rgba(255,255,255,0.5)',
                                  letterSpacing: '0.1em' 
                                }}
                              >
                                {session.trackTitle}
                              </p>
                              
                              {/* Lesson title */}
                              <h4 
                                className="text-xl font-bold mb-1" 
                                style={{ 
                                  color: session.status === 'completed' 
                                    ? 'rgba(255,255,255,0.5)' 
                                    : session.status === 'current'
                                    ? '#f0f0f0'
                                    : 'rgba(255,255,255,0.95)'
                                }}
                              >
                                {session.lessonTitle}
                            </h4>

                              {/* Lesson number */}
                              <p 
                                className="text-sm" 
                                style={{ 
                                  color: session.status === 'completed' 
                                    ? 'rgba(255,255,255,0.25)' 
                                    : session.status === 'current'
                                    ? 'rgba(255,255,255,0.5)'
                                    : 'rgba(255,255,255,0.5)'
                                }}
                              >
                                {session.lessonNumber}
                              </p>
                            </div>

                            {/* CTA */}
                            <div className="flex-shrink-0">
                              {session.status === 'current' && (
                            <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onNavigateToCourse) onNavigateToCourse(session.trackId);
                                  }}
                                  className="px-6 py-3 rounded-full text-base font-bold flex items-center gap-2 transition-all hover:brightness-110"
                                  style={{ 
                                    backgroundColor: '#48c6ed', 
                                    color: '#0d1317',
                                    boxShadow: '0 4px 14px rgba(72,198,237,0.3), 0 2px 4px rgba(0,0,0,0.2)'
                                  }}
                                >
                                  <Play size={18} fill="#0d1317" />
                                  Continuer
                            </button>
                              )}
                              {session.status === 'upcoming' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onNavigateToCourse) onNavigateToCourse(session.trackId);
                                  }}
                                  className="px-6 py-3 rounded-full text-base font-bold flex items-center gap-2 transition-all hover:brightness-95"
                                  style={{ 
                                    backgroundColor: 'rgba(255,255,255,0.95)', 
                                    color: '#0d1317',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                                  }}
                                >
                                  <Play size={18} fill="#0d1317" />
                                  Commencer
                                </button>
                              )}
                              {session.status === 'completed' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onNavigateToCourse) onNavigateToCourse(session.trackId);
                                  }}
                                  className="px-6 py-3 rounded-full text-base font-semibold transition-all hover:bg-white/10"
                                  style={{ 
                                    border: '1px solid rgba(255,255,255,0.15)', 
                                    color: 'rgba(255,255,255,0.7)',
                                    backgroundColor: 'rgba(255,255,255,0.03)'
                                  }}
                                >
                                  Revoir
                                </button>
                              )}
                          </div>
                        </div>
                      </motion.div>
                      ))}
                    </div>

                      {/* Empty state for no sessions */}
                      {mockTodaySessions.length === 0 && (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Calendar size={20} className="text-gray-400" />
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">Journée plus légère</h3>
                          <p className="text-sm text-gray-500">Le repos fait aussi partie du progrès</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Missed sessions (if any) - Masterclass Style */}
                  {missedCount > 0 && (
                    <div 
                      className="rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor: '#0d1317',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }}
                    >
                      <div className="px-6 py-5">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: 'rgba(251,146,60,0.15)' }}
                            >
                              <AlertTriangle size={18} style={{ color: '#fb923c' }} />
                          </div>
                            <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>À rattraper</h2>
                        </div>
                          <span 
                            className="px-3 py-1.5 rounded-full text-sm font-bold"
                            style={{ backgroundColor: 'rgba(251,146,60,0.15)', color: '#fb923c' }}
                          >
                            {missedCount} leçon{missedCount > 1 ? 's' : ''}
                          </span>
                      </div>
                        
                        <div className="space-y-2">
                        {mockMissedSessions.map((session) => (
                            <div 
                              key={session.id} 
                              className="rounded-xl px-5 py-4 flex items-center justify-between gap-4"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.14)'
                              }}
                            >
                            <div className="flex-1 min-w-0">
                                <p 
                                  className="text-xs font-semibold uppercase tracking-wider mb-1" 
                                  style={{ letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)' }}
                                >
                                  {session.trackTitle}
                                </p>
                                <p className="text-lg font-bold truncate" style={{ color: '#ffffff' }}>{session.chapter}</p>
                            </div>
                            <button 
                              onClick={() => setRescheduleModal({ isOpen: true, session })}
                                className="px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-shrink-0"
                                style={{ 
                                  backgroundColor: '#fb923c', 
                                  color: '#0d1317'
                                }}
                            >
                              Replanifier
                            </button>
                          </div>
                        ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}


              {/* WEEK VIEW - Full width card with content - DARK THEME */}
              {!selectedTrackPlanning && calendarView === 'week' && !showTrackDetails && (
                <div 
                  className="rounded-3xl overflow-hidden"
                  style={{ 
                    backgroundColor: '#0d1317',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)'
                  }}
                >
                  <div 
                    className="px-8 py-6" 
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Navigation semaine par semaine */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <ChevronLeft size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
                          </button>
                          <button
                            onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
                          </button>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>
                            {currentWeekOffset === 0 ? 'Cette semaine' : currentWeekOffset === 1 ? 'Semaine prochaine' : currentWeekOffset === -1 ? 'Semaine dernière' : `Semaine ${currentWeekOffset > 0 ? '+' : ''}${currentWeekOffset}`}
                          </h2>
                          {/* Week summary macro view */}
                          <p className="text-base mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{weekSessions.reduce((acc, d) => acc + d.sessions.length, 0)} leçons prévues</span>
                            <span className="mx-2" style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                            <span style={{ color: 'rgba(72,198,237,0.9)', fontWeight: 500 }}>{weekSessions.reduce((acc, d) => acc + d.sessions.filter(s => s.status === 'completed').length, 0)} déjà terminées</span>
                            <span className="mx-2" style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{missedCount} en retard</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {currentWeekOffset !== 0 && (
                          <button
                            onClick={() => setCurrentWeekOffset(0)}
                            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                            style={{ backgroundColor: 'rgba(72,198,237,0.15)', color: '#48c6ed' }}
                          >
                            Aujourd'hui
                          </button>
                        )}
                        <div className="flex items-center gap-1 p-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                          {(['day', 'week', 'month'] as const).map((view) => (
                            <button
                              key={view}
                              onClick={() => setCalendarView(view)}
                              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                              style={{
                                backgroundColor: calendarView === view ? '#ffffff' : 'transparent',
                                color: calendarView === view ? '#0d1317' : 'rgba(255,255,255,0.6)'
                              }}
                            >
                              {view === 'day' ? 'Jour' : view === 'week' ? 'Sem' : 'Mois'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Calendar grid header */}
                    <div className="grid grid-cols-7 gap-4 mb-4">
                      {weekSessions.map((day, idx) => (
                        <div key={day.day} className="text-center">
                          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{day.day}</p>
                          <p className="text-2xl font-bold" style={{ color: idx === 0 ? '#f5f5f5' : 'rgba(255,255,255,0.7)' }}>{day.date}</p>
                          {idx === 0 && (
                            <span 
                              className="inline-block px-3 py-1 text-sm font-semibold rounded-full mt-2"
                              style={{ backgroundColor: '#48c6ed', color: '#0d1317' }}
                            >
                              Aujourd'hui
                            </span>
                          )}
                        </div>
                      ))}
        </div>

                    {/* Calendar grid content */}
                    <div className="grid grid-cols-7 gap-4">
                      {weekSessions.map((day, idx) => (
                        <div 
                          key={day.day} 
                          className={`min-h-[200px] rounded-xl p-4 transition-all duration-200 ${dragOverDay === day.day ? 'ring-2 ring-[#48c6ed] ring-opacity-50' : ''}`}
                          style={{
                            backgroundColor: dragOverDay === day.day 
                              ? 'rgba(72,198,237,0.1)' 
                              : idx === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                            border: dragOverDay === day.day 
                              ? '1px solid rgba(72,198,237,0.3)'
                              : idx === 0 ? '1px solid rgba(72,198,237,0.2)' : '1px solid rgba(255,255,255,0.04)'
                          }}
                          onDragOver={(e) => handleDragOver(e, day.day)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, day.day)}
                        >
                          {day.sessions.length > 0 ? (
                            <div className="space-y-3">
                              {day.sessions.map((session) => (
                                <div 
                                  key={session.id} 
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, session.id, day.day)}
                                  onDragEnd={handleDragEnd}
                                  className={`p-3 rounded-xl text-left cursor-grab active:cursor-grabbing transition-all duration-200 group/session relative ${draggedSession?.sessionId === session.id ? 'opacity-50 scale-95' : ''}`}
                                  style={{
                                    backgroundColor: session.status === 'completed' 
                                      ? 'rgba(255,255,255,0.04)' 
                                      : 'rgba(255,255,255,0.06)',
                                    border: session.status === 'completed'
                                      ? '1px solid rgba(255,255,255,0.06)'
                                      : '1px solid rgba(255,255,255,0.08)'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (session.status !== 'completed' && !draggedSession) {
                                      e.currentTarget.style.backgroundColor = 'rgba(72,198,237,0.15)';
                                      e.currentTarget.style.borderColor = 'rgba(72,198,237,0.3)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = session.status === 'completed' 
                                      ? 'rgba(255,255,255,0.04)' 
                                      : 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.borderColor = session.status === 'completed'
                                      ? 'rgba(255,255,255,0.06)'
                                      : '1px solid rgba(255,255,255,0.08)';
                                  }}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    {session.status === 'completed' ? (
                                      <Check size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                                    ) : (
                                      <Clock size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                                    )}
                                    <span 
                                      className="text-sm font-semibold uppercase"
                                      style={{ color: session.status === 'completed' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.5)' }}
                                    >
                                      {session.status === 'completed' ? 'Fait' : 'À faire'}
                                    </span>
                                  </div>
                                  <p 
                                    className="text-base font-semibold line-clamp-2"
                                    style={{ color: session.status === 'completed' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.95)' }}
                                  >
                                    {session.lessonTitle}
                                  </p>
                                  <p className="text-sm mt-1 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{session.trackTitle}</p>
                                  
                                  {/* Play button for incomplete sessions */}
                                  {session.status !== 'completed' && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover/session:opacity-100 transition-opacity">
                                      <div 
                                        className="w-7 h-7 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: '#48c6ed' }}
                                      >
                                        <Play size={12} className="text-white ml-0.5" fill="white" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <p className="text-base" style={{ color: 'rgba(255,255,255,0.2)' }}>—</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
                        <span>Terminé</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <span>À faire</span>
                      </div>
                    </div>

                    {/* Sessions à replanifier - Draggable */}
                    {missedCount > 0 && (
                      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}>
                              <AlertTriangle size={16} style={{ color: '#f97316' }} />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold" style={{ color: '#f5f5f5' }}>Sessions à replanifier</h3>
                              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Drag&drop pour rattraper ton retard</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                            {missedCount} session{missedCount > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {/* Mock missed sessions - would come from real data */}
                          {[
                            { id: 'missed-1', lessonTitle: 'Diffraction des ondes', trackTitle: 'Ondes mécaniques' },
                            { id: 'missed-2', lessonTitle: 'Théorème de comparaison', trackTitle: 'Suites et Limites' },
                          ].slice(0, missedCount).map((session) => (
                            <div
                              key={session.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, session.id, 'missed')}
                              onDragEnd={handleDragEnd}
                              className="flex-1 min-w-[200px] max-w-[280px] p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]"
                              style={{ 
                                backgroundColor: 'rgba(249,115,22,0.1)', 
                                border: '1px dashed rgba(249,115,22,0.3)' 
                              }}
                            >
                              <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{session.lessonTitle}</p>
                              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{session.trackTitle}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MONTH VIEW - Full width card with content - DARK THEME */}
              {!selectedTrackPlanning && calendarView === 'month' && !showTrackDetails && (
                <div 
                  className="rounded-3xl overflow-hidden"
                  style={{ 
                    backgroundColor: '#0d1317',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)'
                  }}
                >
                  <div 
                    className="px-8 py-6" 
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>Ce mois-ci</h2>
                        {/* Month micro-text */}
                        <p className="text-base mt-2 italic" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          💡 Janvier est un mois chargé — pense à garder un rythme régulier
                        </p>
                      </div>
                      <div className="flex items-center gap-1 p-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                        {(['day', 'week', 'month'] as const).map((view) => (
                  <button
                            key={view}
                            onClick={() => setCalendarView(view)}
                            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                            style={{
                              backgroundColor: calendarView === view ? '#ffffff' : 'transparent',
                              color: calendarView === view ? '#0d1317' : 'rgba(255,255,255,0.6)'
                            }}
                          >
                            {view === 'day' ? 'Jour' : view === 'week' ? 'Sem' : 'Mois'}
                  </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Janvier 2025</h3>
                </div>

                    {/* Calendar header */}
                    <div className="grid grid-cols-7 gap-3 mb-3">
                      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                        <div key={day} className="text-center text-base font-semibold py-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid with lesson details - DRAG & DROP ENABLED */}
                    <div className="space-y-3">
                      {monthData.map((week) => (
                        <div key={week.week} className="grid grid-cols-7 gap-3">
                          {week.days.map((day) => (
                              <div 
                                key={day.date}
                                className={`min-h-[120px] p-3 rounded-xl transition-all ${dragOverDay === day.date ? 'ring-2 ring-[#48c6ed] ring-opacity-50' : ''}`}
                                style={{
                                  backgroundColor: dragOverDay === day.date
                                    ? 'rgba(72,198,237,0.15)'
                                    : day.isToday 
                                    ? '#48c6ed' 
                                    : day.hasExam
                                    ? 'rgba(251,146,60,0.15)'
                                    : 'rgba(255,255,255,0.025)',
                                  border: dragOverDay === day.date
                                    ? '1px solid rgba(72,198,237,0.4)'
                                    : day.isToday 
                                    ? 'none' 
                                    : day.hasExam
                                    ? '1px solid rgba(251,146,60,0.3)'
                                    : '1px solid rgba(255,255,255,0.04)'
                                }}
                                onDragOver={(e) => handleMonthDragOver(e, day.date)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleMonthDrop(e, day.date)}
                              >
                                {/* Date header */}
                                <div className="flex items-center justify-between mb-2">
                                  <span 
                                    className="text-lg font-bold"
                                    style={{ color: day.isToday ? '#0d1317' : 'rgba(255,255,255,0.9)' }}
                                  >
                                    {day.date}
                                  </span>
                                  {day.hasExam && (
                                    <span 
                                      className="px-2 py-0.5 text-sm font-semibold rounded-full"
                                      style={{ backgroundColor: '#fb923c', color: '#0d1317' }}
                                    >
                                      Examen
                                    </span>
                                  )}
                                </div>
                                
                                {/* Lessons - Now draggable */}
                                {day.sessions.length > 0 ? (
                                  <div className="space-y-1.5">
                                    {day.sessions.slice(0, 2).map((session) => (
                                      <div 
                                        key={session.id}
                                        draggable
                                        onDragStart={(e) => handleMonthDragStart(e, session.id, day.date)}
                                        onDragEnd={handleDragEnd}
                                        className={`p-2 rounded-lg cursor-grab active:cursor-grabbing transition-all ${draggedSession?.sessionId === session.id ? 'opacity-50 scale-95' : ''}`}
                                        style={{
                                          backgroundColor: day.isToday 
                                            ? 'rgba(13,19,23,0.15)' 
                                            : 'rgba(255,255,255,0.05)'
                                        }}
                                      >
                                        <p 
                                          className="text-sm font-medium truncate"
                                          style={{ color: day.isToday ? '#0d1317' : 'rgba(255,255,255,0.85)' }}
                                        >
                                          {session.title}
                                        </p>
                                      </div>
                                    ))}
                                    {day.sessions.length > 2 && (
                                      <p 
                                        className="text-sm"
                                        style={{ color: day.isToday ? 'rgba(13,19,23,0.7)' : 'rgba(255,255,255,0.4)' }}
                                      >
                                        +{day.sessions.length - 2} autre{day.sessions.length - 2 > 1 ? 's' : ''}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p 
                                    className="text-sm"
                                    style={{ color: day.isToday ? 'rgba(13,19,23,0.5)' : 'rgba(255,255,255,0.2)' }}
                                  >
                                    —
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#48c6ed' }} />
                        <span>Aujourd'hui</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.04)' }} />
                        <span>Leçons planifiées</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.3)' }} />
                        <span>Jour d'examen</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton pour voir le détail par learning track */}
              {!selectedTrackPlanning && !showTrackDetails && (
                <motion.button
                  onClick={() => setShowTrackDetails(true)}
                  className="w-full py-2 -mt-1 flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                  whileHover={{ y: 2 }}
                >
                  <span className="text-sm font-medium">Voir le détail par learning track</span>
                  <ChevronDown size={18} className="animate-bounce" />
                </motion.button>
              )}

              {/* SECTION 3: Learning Tracks - 2 columns */}
              {!selectedTrackPlanning && showTrackDetails && (
              <>
                {/* Bouton pour remonter vers la vue calendrier */}
                <motion.button
                  onClick={() => setShowTrackDetails(false)}
                  className="w-full py-4 mb-4 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <ChevronDown size={20} className="rotate-180" />
                  <span className="text-sm font-medium">
                    Retour à la vue {calendarView === 'day' ? 'journée' : calendarView === 'week' ? 'semaine' : 'mois'}
                  </span>
                </motion.button>
                
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ boxShadow: '0 4px 25px rgba(0,0,0,0.08)' }}>
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900">Parcours en cours</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {mockLearningTracks.map((track) => (
                      <motion.div
                        key={track.id}
                        onClick={() => setExpandedTrack(expandedTrack === track.id ? null : track.id)}
                        className={`rounded-xl border cursor-pointer transition-all ${
                          !track.isOnTrack 
                            ? 'border-orange-200 bg-orange-50/50' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                track.status === 'active' ? 'bg-gray-900' :
                                track.status === 'behind' ? 'bg-orange-500' :
                                'bg-gray-200'
                              }`}>
                                <BookOpen size={22} className={track.status === 'not-started' ? 'text-gray-500' : 'text-white'} />
                          </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{track.title}</h3>
                                <p className="text-sm text-gray-500">{track.programme}</p>
                              </div>
                </div>

                            {/* Status indicator */}
                            {!track.isOnTrack && (
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full flex items-center gap-1">
                                <Clock size={11} />
                                {track.missedSessions} à rattraper
                              </span>
                            )}
                            {track.isOnTrack && track.progress > 0 && (
                              <span className="px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1" style={{ backgroundColor: '#0d1317', color: '#ffffff' }}>
                                <Check size={11} style={{ color: '#ffffff' }} />
                                Dans le rythme
                              </span>
                            )}
                          </div>

                          {/* Progress */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">{getProgressHint(track.progress, track.isOnTrack)}</span>
                              <span className="text-base font-bold text-gray-900">{track.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  !track.isOnTrack ? 'bg-orange-500' : 'bg-gray-900'
                                }`}
                                style={{ width: `${track.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Quick info */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              {track.examDate && (
                                <span className="text-gray-600">
                                  Examen : <span className="font-medium text-gray-900">{formatDate(track.examDate)}</span>
                                </span>
                              )}
                              {track.sessionsThisWeek > 0 && (
                                <span className="text-gray-600">
                                  <span className="font-medium text-gray-900">{track.sessionsThisWeek}</span> sessions/sem
                                </span>
                              )}
                            </div>
                            <ChevronDown 
                              size={18} 
                              className={`text-gray-400 transition-transform ${expandedTrack === track.id ? 'rotate-180' : ''}`} 
                            />
                          </div>
                        </div>

                        {/* Expanded content */}
                        <AnimatePresence>
                          {expandedTrack === track.id && (
                      <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-gray-100"
                            >
                              <div className="p-5 bg-gray-50">
                                {/* Current chapter & next step - side by side */}
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                  {track.currentChapter && (
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                                        <BookOpen size={14} className="text-white" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Chapitre en cours</p>
                                        <p className="text-sm font-semibold text-gray-900">{track.currentChapter}</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {track.nextSession && (
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(72,198,237,0.15)' }}>
                                        <Target size={14} style={{ color: '#48c6ed' }} />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Prochaine session</p>
                                        <p className="text-sm font-semibold text-gray-900">{track.nextSession}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* CTAs */}
                                <div className="flex gap-3">
                            <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onNavigateToCourse) onNavigateToCourse(track.id);
                                    }}
                                    className="flex-1 px-5 py-3 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                  >
                                    <Play size={16} />
                                    {track.progress > 0 ? 'Continuer' : 'Commencer'}
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTrackPlanning(track.id);
                                      setTimeout(() => {
                                        const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
                                        if (scrollContainer) {
                                          scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }, 50);
                                    }}
                                    className="px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors"
                                  >
                                    Planning
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              </>
              )}
            </motion.div>
          ) : (
                      <motion.div
              key="setup"
              initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Step navigation */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                            <button
                        onClick={() => setActiveStep(step.id as 1 | 2 | 3)}
                        className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeStep === step.id
                            ? 'bg-gray-900 text-white'
                            : completedSteps.includes(step.id)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activeStep === step.id
                            ? 'bg-white/20'
                            : completedSteps.includes(step.id)
                            ? 'bg-green-200'
                            : 'bg-gray-200'
                        }`}>
                          {completedSteps.includes(step.id) ? (
                            <Check size={16} />
                          ) : (
                            <step.icon size={16} />
                          )}
                          </div>
                        <p className="font-semibold" style={{ fontSize: '16px', color: activeStep === step.id ? '#ffffff' : '#111827' }}>{step.title}</p>
                      </button>
                      
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 ${
                          completedSteps.includes(step.id) ? 'bg-green-300' : 'bg-gray-200'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Step content */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <AnimatePresence mode="wait">
                  {activeStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tes préférences d'étude</h2>
                        <p className="text-base text-gray-600">Ces réglages s'appliquent à tous tes parcours. Tu pourras les ajuster à tout moment.</p>
                      </div>

                      {/* Two-column layout for full width */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left column */}
                        <div className="space-y-8">
                          {/* Days */}
                          <div>
                            <label className="block text-base font-semibold text-gray-900 mb-4">Jours disponibles</label>
                            <div className="flex gap-2 flex-wrap">
                              {[
                                { id: 'monday', label: 'Lun' },
                                { id: 'tuesday', label: 'Mar' },
                                { id: 'wednesday', label: 'Mer' },
                                { id: 'thursday', label: 'Jeu' },
                                { id: 'friday', label: 'Ven' },
                                { id: 'saturday', label: 'Sam' },
                                { id: 'sunday', label: 'Dim' }
                        ].map((day) => (
                          <button
                            key={day.id}
                            onClick={() => {
                              const newDays = preferences.availableDays.includes(day.id as any)
                                ? preferences.availableDays.filter(d => d !== day.id)
                                : [...preferences.availableDays, day.id as any];
                              setPreferences({ ...preferences, availableDays: newDays });
                            }}
                                  className={`w-14 h-14 rounded-full text-base font-semibold transition-all ${
                              preferences.availableDays.includes(day.id as any)
                                      ? 'bg-gray-900 text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>

                          {/* Study slots */}
                    <div>
                            <label className="block text-base font-semibold text-gray-900 mb-4">Créneaux préférés</label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { id: 'morning', label: 'Matin', time: '6h-12h' },
                                { id: 'afternoon', label: 'Après-midi', time: '12h-18h' },
                                { id: 'evening', label: 'Soir', time: '18h-22h' }
                              ].map((slot) => (
                                <button
                                  key={slot.id}
                                  onClick={() => {
                                    const newSlots = preferences.preferredStudySlots.includes(slot.id as any)
                                      ? preferences.preferredStudySlots.filter(s => s !== slot.id)
                                      : [...preferences.preferredStudySlots, slot.id as any];
                                    setPreferences({ ...preferences, preferredStudySlots: newSlots });
                                  }}
                                  className={`py-4 px-4 rounded-xl text-center transition-all ${
                                    preferences.preferredStudySlots.includes(slot.id as any)
                                      ? 'bg-gray-900'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  <p 
                                    className="text-base font-semibold" 
                                    style={{ color: preferences.preferredStudySlots.includes(slot.id as any) ? '#ffffff' : undefined }}
                                  >
                                    {slot.label}
                                  </p>
                                  <p 
                                    className="text-sm"
                                    style={{ color: preferences.preferredStudySlots.includes(slot.id as any) ? 'rgba(255,255,255,0.85)' : '#6b7280' }}
                                  >
                                    {slot.time}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Intensity */}
                          <div>
                            <label className="block text-base font-semibold text-gray-900 mb-4">Intensité d'étude</label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { id: 'light', label: 'Légère', desc: 'Rythme détendu' },
                                { id: 'moderate', label: 'Modérée', desc: 'Équilibre parfait' },
                                { id: 'intensive', label: 'Intensive', desc: 'Préparation accélérée' }
                              ].map((intensity) => (
                                <button
                                  key={intensity.id}
                                  onClick={() => setPreferences({ ...preferences, studyIntensity: intensity.id as any })}
                                  className={`py-4 px-4 rounded-xl text-center transition-all ${
                                    preferences.studyIntensity === intensity.id
                                      ? 'bg-gray-900'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  <p 
                                    className="text-base font-semibold"
                                    style={{ color: preferences.studyIntensity === intensity.id ? '#ffffff' : undefined }}
                                  >
                                    {intensity.label}
                                  </p>
                                  <p 
                                    className="text-sm"
                                    style={{ color: preferences.studyIntensity === intensity.id ? 'rgba(255,255,255,0.85)' : '#6b7280' }}
                                  >
                                    {intensity.desc}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-8">
                          {/* Hours per day */}
                          <div>
                            <label className="block text-base font-semibold text-gray-900 mb-4">
                              Heures d'étude par jour: <span className="text-gray-600">{preferences.dailyStudyHours}h</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={preferences.dailyStudyHours}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          dailyStudyHours: parseInt(e.target.value)
                        })}
                              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900"
                      />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>1h</span>
                        <span>4h</span>
                        <span>8h</span>
                      </div>
                    </div>

                          {/* Break duration */}
                    <div>
                            <label className="block text-base font-semibold text-gray-900 mb-4">
                              Durée des pauses: <span className="text-gray-600">{preferences.breakDuration} min</span>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="5"
                        value={preferences.breakDuration}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          breakDuration: parseInt(e.target.value)
                        })}
                              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                              <span>5 min</span>
                              <span>15 min</span>
                              <span>30 min</span>
                      </div>
                    </div>

                          {/* Working hours */}
                    <div>
                            <label className="block text-base font-semibold text-gray-900 mb-4">Horaires de travail</label>
                            <div className="grid grid-cols-2 gap-4">
                        <div>
                                <label className="block text-sm text-gray-500 mb-2">Début</label>
                          <input
                            type="time"
                            value={preferences.preferredStartTime}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              preferredStartTime: e.target.value
                            })}
                                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-base"
                          />
                        </div>
                        <div>
                                <label className="block text-sm text-gray-500 mb-2">Fin</label>
                          <input
                            type="time"
                            value={preferences.preferredEndTime}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              preferredEndTime: e.target.value
                            })}
                                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-base"
                          />
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>

                      <button
                        onClick={() => handleCompleteStep(1)}
                        className="w-full py-4 bg-gray-900 text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors"
                      >
                        Continuer
                      </button>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      {/* Header minimaliste */}
                      <div className="text-center">
                        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Users size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Buddy de motivation</h2>
                        <p className="text-gray-500">Invite quelqu'un pour te soutenir dans ta progression</p>
                      </div>

                      {/* Composant simplifié */}
                    <SocialPlannerIntegration
                      userId="current_user"
                      userName="Étudiant SMS"
                      onNavigateToBuddies={() => {
                        console.log('Navigation vers Buddies');
                      }}
                    />

                      {/* Actions */}
                      <div className="space-y-3 pt-4">
                        <button
                          onClick={() => handleCompleteStep(2)}
                          className="w-full py-4 bg-gray-900 text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors"
                        >
                          Continuer
                        </button>
                        <button
                          onClick={() => handleCompleteStep(2)}
                          className="w-full py-3 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
                        >
                          Passer cette étape
                        </button>
                  </div>
                    </motion.div>
                  )}

                  {activeStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tes échéances</h2>
                        <p className="text-base text-gray-600">Indique les dates d'examen. Si tu ne les connais pas encore, tu peux en proposer une ou valider celles proposées par d'autres étudiants.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                    <ParticipativeExamDates
                      favoriteCourses={favoriteCourses.length > 0 ? favoriteCourses : [
                              { id: 'ondes-mecaniques', title: 'Ondes mécaniques', progress: 45 },
                        { id: 'suites-limites', title: 'Suites et Limites', progress: 67 },
                              { id: 'equilibres-chimiques', title: 'Équilibres Chimiques', progress: 23 },
                              { id: 'forces-mouvement', title: 'Forces et Mouvement', progress: 0 }
                      ]}
                      focusedCourse={focusedCourse}
                      userId="current_user"
                      userName="Étudiant SMS"
                      faculty="Faculté Sciences"
                    />
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Comment ça fonctionne ?</h3>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Check size={18} className="text-green-600" />
                              </div>
                              <div>
                                <p className="text-base font-medium text-gray-900">Date officielle</p>
                                <p className="text-sm text-gray-500">Si la date est connue, elle apparaît directement</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Clock size={18} className="text-orange-600" />
                              </div>
                              <div>
                                <p className="text-base font-medium text-gray-900">Date proposée</p>
                                <p className="text-sm text-gray-500">Un autre étudiant a proposé une date — tu peux la valider</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <Calendar size={18} className="text-gray-600" />
                              </div>
                              <div>
                                <p className="text-base font-medium text-gray-900">Proposer une date</p>
                                <p className="text-sm text-gray-500">Si aucune date n'existe, tu peux en suggérer une</p>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 mt-6">Le planning s'adapte automatiquement quand les dates changent</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setActiveStep(2)}
                          className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                          Retour
                        </button>
                        <button
                      onClick={handleGeneratePlan}
                      disabled={isGeneratingPlan}
                          className={`flex-1 py-4 rounded-full text-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                        isGeneratingPlan 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {isGeneratingPlan ? (
                            <>
                              <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                              <span>Génération en cours...</span>
                            </>
                      ) : (
                        <>
                              <span>Générer mon planning</span>
                              <ChevronRight size={20} />
                        </>
                      )}
                        </button>
                  </div>
                    </motion.div>
                )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
                  </div>
                  
      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleModal.isOpen && rescheduleModal.session && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setRescheduleModal({ isOpen: false, session: null })}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900">Replanifier la leçon</h3>
                <p className="text-sm text-gray-500 mt-1">Choisis un nouveau créneau</p>
                    </div>
                  
              {/* Content */}
              <div className="p-6">
                {/* Lesson info */}
                <div className="bg-orange-50 rounded-xl p-4 mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5 text-orange-600" style={{ letterSpacing: '0.1em' }}>{rescheduleModal.session.trackTitle}</p>
                  <p className="text-xl font-extrabold text-gray-900">{rescheduleModal.session.chapter}</p>
                  </div>
                  
                {/* Suggested time */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Créneau suggéré</p>
                  <button
                    onClick={() => setSelectedRescheduleTime(rescheduleModal.session?.suggestedReschedule || '')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedRescheduleTime === rescheduleModal.session.suggestedReschedule
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedRescheduleTime === rescheduleModal.session.suggestedReschedule
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Calendar size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">{rescheduleModal.session.suggestedReschedule}</p>
                        <p className="text-sm text-gray-500 italic">Créneau aligné avec ton rythme habituel</p>
                      </div>
                    </div>
                    {/* Micro-impact indicator */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                      <Check size={14} className="text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Aucun impact sur les autres sessions</span>
                    </div>
                  </button>
                  </div>
                  
                {/* Other options */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Autres créneaux disponibles</p>
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check size={12} />
                      Sans impact sur ton planning
                    </span>
                  </div>
                  <div className="space-y-2">
                    {['Aujourd\'hui', 'Demain matin', 'Ce week-end', 'Choisir un jour'].map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedRescheduleTime(time)}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          selectedRescheduleTime === time
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-base font-medium text-gray-900">{time}</p>
                      </button>
                    ))}
                </div>
              </div>
            </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setRescheduleModal({ isOpen: false, session: null })}
                  className="flex-1 py-3 rounded-full text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    // Handle reschedule and show success toast
                    const isSuggestedTime = selectedRescheduleTime === rescheduleModal.session?.suggestedReschedule;
                    setRescheduleModal({ isOpen: false, session: null });
                    setSelectedRescheduleTime('');
                    setRescheduleToast({ 
                      show: true, 
                      message: isSuggestedTime 
                        ? '✓ Replanifié — tu restes dans le rythme' 
                        : '✓ Planning ajusté — session déplacée'
                    });
                    // Auto-hide toast after 3 seconds
                    setTimeout(() => setRescheduleToast({ show: false, message: '' }), 3000);
                  }}
                  disabled={!selectedRescheduleTime}
                  className={`flex-1 py-3 rounded-full text-base font-semibold transition-colors ${
                    selectedRescheduleTime
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {rescheduleToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <span className="text-base font-medium">{rescheduleToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
