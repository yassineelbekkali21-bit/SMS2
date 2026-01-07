'use client';

import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  ChevronRight,
  Trophy,
  Heart,
  Sparkles,
  Target,
  Users,
  Calendar,
  Swords,
  Video,
  Eye
} from 'lucide-react';
import { Course, Lesson } from '@/types';

// ============================================================================
// TYPES
// ============================================================================
interface LearningTrackOverviewProps {
  course: Course;
  lessons: Lesson[];
  onClose: () => void;
  onStartLesson: (lesson: Lesson) => void;
  purchasedItems?: Set<string>;
  embedded?: boolean;
  onNavigateToSection?: (section: string) => void;
  onNavigateToSectionWithContext?: (section: string, context: { trackId: string; trackTitle: string }) => void;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const groupLessonsByChapter = (lessons: Lesson[]): Chapter[] => {
  const chaptersMap: { [key: string]: Lesson[] } = {};
  
  lessons.forEach((lesson, index) => {
    const chapterIndex = Math.floor(index / 4);
    const chapterNames = [
      'Fondations',
      'Concepts clés',
      'Applications',
      'Approfondissement',
      'Maîtrise'
    ];
    const chapterName = chapterNames[chapterIndex] || `Chapitre ${chapterIndex + 1}`;
    
    if (!chaptersMap[chapterName]) {
      chaptersMap[chapterName] = [];
    }
    chaptersMap[chapterName].push(lesson);
  });
  
  return Object.entries(chaptersMap).map(([title, lessons], index) => ({
    id: `chapter-${index}`,
    title,
    lessons
  }));
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Progression Node
function ProgressionNode({ 
  lesson, 
  index, 
  onClick, 
  isLocked,
  isTrialPreview = false
}: {
  lesson: Lesson;
  index: number;
  onClick: () => void;
  isLocked: boolean;
  isTrialPreview?: boolean;
}) {
  const getStatus = (): string => {
    // En mode essai, les leçons après la première sont toujours en preview
    if (isTrialPreview) return 'trialPreview';
    if (lesson.isCompleted) return 'completed';
    if (lesson.isInProgress) return 'current';
    if (lesson.isOwned || lesson.isAccessible) return 'available';
    return 'locked';
  };
  
  const status = getStatus();
  
  const nodeStyles: Record<string, string> = {
    completed: 'bg-gray-900 text-white border-gray-900',
    current: 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-600/20',
    available: 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
    trialPreview: 'bg-gray-800 border-gray-700 text-gray-300',
    locked: 'bg-gray-100 border-gray-200 text-gray-400'
  };
  
  const isDisabled = status === 'locked' || (isLocked && !isTrialPreview);
  
  return (
    <button
      onClick={!isDisabled ? onClick : undefined}
      className={`relative w-14 h-14 rounded-full border-2 flex items-center justify-center text-base font-bold transition-all shadow-md hover:scale-105 ${nodeStyles[status]} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={isDisabled}
      title={isTrialPreview ? `${lesson.title} (Preview)` : lesson.title}
    >
      {status === 'completed' ? (
        <CheckCircle size={24} strokeWidth={2.5} />
      ) : status === 'trialPreview' ? (
        <Eye size={20} />
      ) : isDisabled ? (
        <Lock size={18} />
      ) : (
        <span>{String(index + 1).padStart(2, '0')}</span>
      )}
    </button>
  );
}

// Connection Line
function ConnectionLine({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div className={`flex-1 h-0.5 mx-2 min-w-[24px] transition-colors ${isCompleted ? 'bg-gray-900' : 'bg-gray-200'}`} />
  );
}

// Helper to format scheduled date
const formatScheduledDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (targetDate.getTime() === today.getTime()) {
    return "Aujourd'hui";
  } else if (targetDate.getTime() === tomorrow.getTime()) {
    return "Demain";
  } else {
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const monthNames = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    const dayName = dayNames[date.getDay()];
    const dayNum = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${dayName} ${dayNum} ${month}`;
  }
};

// Check if date is in the past
const isDatePast = (date: Date): boolean => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return targetDate.getTime() < today.getTime();
};

// Check if date is today
const isDateToday = (date: Date): boolean => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return targetDate.getTime() === today.getTime();
};

// Lesson Row
function LessonRow({ 
  lesson, 
  globalIndex, 
  onStart, 
  isOwned,
  scheduledDate
}: {
  lesson: Lesson;
  globalIndex: number;
  onStart: () => void;
  isOwned: boolean;
  scheduledDate?: Date;
}) {
  const getStatus = (): string => {
    if (lesson.isCompleted) return 'completed';
    if (lesson.isInProgress) return 'current';
    if (isOwned || lesson.isAccessible) return 'available';
    return 'locked';
  };
  
  const status = getStatus();
  
  const getConfig = () => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle size={20} className="text-white" strokeWidth={2.5} />,
          badge: null,
          action: 'Revoir',
          rowBg: 'hover:bg-gray-50',
          iconBg: 'bg-gray-900'
        };
      case 'current':
        return {
          icon: <Play size={18} className="text-white ml-0.5" fill="white" />,
          badge: <span className="px-2.5 py-1 bg-blue-600 text-white text-sm font-bold rounded-full uppercase tracking-wider">En cours</span>,
          action: 'Reprendre',
          rowBg: 'bg-blue-50 border border-blue-200',
          iconBg: 'bg-blue-600'
        };
      case 'available':
        return {
          icon: <Play size={18} className="text-gray-400 ml-0.5" />,
          badge: null,
          action: 'Commencer',
          rowBg: 'hover:bg-gray-50',
          iconBg: 'bg-gray-100 border border-gray-200'
        };
      default:
        return {
          icon: <Lock size={16} className="text-gray-300" />,
          badge: <span className="px-2.5 py-1 bg-gray-100 text-gray-400 text-sm font-medium rounded-full">Verrouillé</span>,
          action: null,
          rowBg: 'opacity-60',
          iconBg: 'bg-gray-100'
        };
    }
  };
  
  const config = getConfig();
  
  // Determine date styling based on lesson status and date
  const getDateStyle = () => {
    if (!scheduledDate) return null;
    
    if (lesson.isCompleted) {
      // Completed - show checkmark style
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-400',
        icon: <CheckCircle size={11} className="text-gray-400" />
      };
    }
    
    if (isDateToday(scheduledDate)) {
      // Today - highlight with theme color
      return {
        bg: 'bg-[#48c6ed]/10',
        text: 'text-[#48c6ed]',
        icon: <Calendar size={11} className="text-[#48c6ed]" />
      };
    }
    
    if (isDatePast(scheduledDate) && !lesson.isCompleted) {
      // Past and not completed - show as overdue
      return {
        bg: 'bg-red-50',
        text: 'text-red-500',
        icon: <Calendar size={11} className="text-red-500" />
      };
    }
    
    // Future date
    return {
      bg: 'bg-gray-50',
      text: 'text-gray-500',
      icon: <Calendar size={11} className="text-gray-400" />
    };
  };
  
  const dateStyle = getDateStyle();
  
  return (
    <div
      className={`group flex items-center gap-4 py-4 px-5 rounded-xl transition-all cursor-pointer ${config.rowBg}`}
      onClick={status !== 'locked' ? onStart : undefined}
    >
      <span className="w-8 text-sm font-mono text-gray-400 font-medium">
        {String(globalIndex + 1).padStart(2, '0')}
      </span>
      
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
        {config.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h4 className={`font-semibold truncate ${status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>
            {lesson.title}
          </h4>
          {scheduledDate && dateStyle && (
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-sm font-medium ${dateStyle.bg} ${dateStyle.text}`}>
              {dateStyle.icon}
              <span>{formatScheduledDate(scheduledDate)}</span>
            </div>
          )}
          {config.badge}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Clock size={12} />
            {formatDuration(lesson.duration)}
          </p>
        </div>
      </div>
      
      {config.action && (
        <button 
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
        >
          {config.action}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

// Chapter Section
function ChapterSection({ 
  chapter, 
  chapterIndex, 
  globalStartIndex, 
  onStartLesson, 
  purchasedItems,
  lessonSchedules
}: {
  chapter: Chapter;
  chapterIndex: number;
  globalStartIndex: number;
  onStartLesson: (lesson: Lesson) => void;
  purchasedItems: Set<string>;
  lessonSchedules: Map<string, Date>;
}) {
  const completedCount = chapter.lessons.filter(l => l.isCompleted).length;
  const isChapterComplete = completedCount === chapter.lessons.length;
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4 px-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
          isChapterComplete 
            ? 'bg-gray-900 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {isChapterComplete ? <CheckCircle size={18} /> : chapterIndex + 1}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{chapter.title}</h3>
          <p className="text-sm text-gray-500">
            {completedCount}/{chapter.lessons.length} leçons complétées
          </p>
        </div>
        {isChapterComplete && (
          <div className="px-3 py-1 bg-gray-900 text-white text-sm font-bold rounded-full">
            Terminé
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {chapter.lessons.map((lesson, index) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            globalIndex={globalStartIndex + index}
            onStart={() => onStartLesson(lesson)}
            isOwned={lesson.isOwned || purchasedItems.has(lesson.id)}
            scheduledDate={lessonSchedules.get(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// QUICK ACCESS CARD COMPONENT
// ============================================================================
function QuickAccessCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  gradient 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  onClick: () => void; 
  gradient: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${gradient}`}
    >
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
          <Icon size={20} className="text-white" />
        </div>
        <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <ChevronRight size={16} className="absolute bottom-5 right-5 text-white/50 group-hover:text-white transition-colors" />
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function LearningTrackOverview({
  course,
  lessons,
  onClose,
  onStartLesson,
  purchasedItems = new Set(),
  embedded = false,
  onNavigateToSection,
  onNavigateToSectionWithContext
}: LearningTrackOverviewProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Mode essai: seule la première leçon peut être complétée
  const isTrialMode = course?.isTrial === true;
  const completedLessons = isTrialMode 
    ? (lessons[0]?.isCompleted ? 1 : 0) // En mode essai, max 1 leçon complétée
    : lessons.filter(l => l.isCompleted).length;
  const totalDuration = lessons.reduce((acc, l) => acc + (l.duration || 0), 0);
  const progressPercent = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
  
  const currentLesson = isTrialMode 
    ? lessons[0] // En mode essai, la leçon courante est toujours la première
    : (lessons.find(l => l.isInProgress) || 
                        lessons.find(l => !l.isCompleted && (l.isOwned || l.isAccessible)) ||
       lessons[0]);

  // Generate mock scheduled dates for lessons
  // In a real app, this would come from the planning system
  const lessonSchedules = useMemo(() => {
    const schedules = new Map<string, Date>();
    const today = new Date();
    let dayOffset = -2; // Start 2 days ago to show some past dates
    
    lessons.forEach((lesson, index) => {
      // Completed lessons get dates in the past
      if (lesson.isCompleted) {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - (lessons.length - index));
        schedules.set(lesson.id, pastDate);
      } else if (lesson.isInProgress) {
        // Current lesson is today
        schedules.set(lesson.id, new Date(today));
      } else {
        // Future lessons spread out over coming days
        // Skip weekends for more realistic scheduling
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + dayOffset);
        
        // Skip to next weekday if weekend
        while (futureDate.getDay() === 0 || futureDate.getDay() === 6) {
          futureDate.setDate(futureDate.getDate() + 1);
        }
        
        schedules.set(lesson.id, new Date(futureDate));
        dayOffset += Math.floor(Math.random() * 2) + 1; // 1-2 days between lessons
      }
    });
    
    return schedules;
  }, [lessons]);

  const wrapperClass = embedded 
    ? "min-h-full bg-gradient-to-br from-gray-50 via-white to-gray-50"
    : "fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50";

  return (
    <div className={wrapperClass}>
      {/* Header - Full Width */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="px-6 lg:px-10 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Retour aux parcours</span>
          </button>
        </div>
      </header>
      
      {/* Main Content - Full Width */}
      <div className="px-6 lg:px-10 py-8">
        
        {/* HERO SECTION - Full Width Grid */}
        <div className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Course Info + CTA fusionnés - Takes 8 columns */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full flex flex-col">
                {/* Header: Tags inline */}
                <div className="flex items-center gap-2 mb-3">
                  {course.difficulty && (
                    <span className="px-2.5 py-1 rounded-full text-sm font-semibold bg-gray-900 text-white">
                      {course.difficulty === 'beginner' ? 'Débutant' :
                       course.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </span>
                  )}
                  {course.tags?.slice(0, 2).map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                  <span className="text-sm text-gray-400 ml-auto">
                    {isTrialMode ? (
                      <span className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gray-900 text-white text-[13px] font-bold rounded">Essai</span>
                        1/{lessons.length} leçon accessible
                      </span>
                    ) : (
                      `${completedLessons}/${lessons.length} leçons`
                    )}
                  </span>
                </div>
                
                {/* Title */}
                <h1 
                  className="text-gray-900 tracking-wide leading-none uppercase mb-4"
                  style={{ fontSize: '48px', fontFamily: 'var(--font-parafina)' }}
                >
                  {course.title}
                </h1>
                
                {/* Description */}
                <p className="text-base text-gray-500 leading-relaxed flex-1">
                  Maîtrisez les concepts fondamentaux et avancés de ce parcours à travers {lessons.length} leçons progressives. Chaque module est conçu pour renforcer votre compréhension avec des exercices pratiques, des quiz interactifs et des applications concrètes. Progressez à votre rythme et obtenez votre certificat de complétion.
                </p>
                
                {/* CTA Row - at bottom */}
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                  {/* Progress bar */}
                  <div className="flex-1">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%`, backgroundColor: '#111827' }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-gray-900">{progressPercent}%</span>
                      {currentLesson && completedLessons > 0 && completedLessons < lessons.length && (
                        <span className="text-sm text-gray-400 truncate max-w-[200px]">
                          Reprendre : {currentLesson.title}
                        </span>
                      )}
                  </div>
                  </div>
                
                  {/* CTA Button */}
                  <button
                    onClick={() => currentLesson && onStartLesson(currentLesson)}
                    className="px-8 py-3.5 rounded-full font-semibold text-base flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: '#48c6ed', color: '#ffffff' }}
                  >
                    <Play size={16} fill="white" />
                    {completedLessons === 0 ? 'Commencer' : 
                     completedLessons === lessons.length ? 'Revoir' :
                     'Continuer'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right: Quick Access - Dark Theme */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl p-4 sm:p-6 h-full flex flex-col" style={{ backgroundColor: '#0d1317', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <p className="uppercase tracking-wider font-medium mb-3 sm:mb-4" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Accès rapide</p>
                
                {/* Grid: 2 colonnes sur mobile, 2 colonnes sur desktop */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1">
                  {[
                    { icon: Target, label: 'Training Club', section: 'training', key: 'training', disabledInTrial: true },
                    { icon: Users, label: 'Social Club', section: 'community', key: 'social-club', disabledInTrial: true },
                    { icon: Calendar, label: 'Planning', section: 'planning', key: 'planning', disabledInTrial: false },
                    { icon: Video, label: 'Study Room', section: 'community', key: 'study-room', disabledInTrial: true }
                  ].map((item) => {
                    const isDisabled = isTrialMode && item.disabledInTrial;
                    return (
                <button
                      key={item.key}
                      onClick={() => {
                        if (isDisabled) return;
                        if (onNavigateToSectionWithContext) {
                          onNavigateToSectionWithContext(item.section, { trackId: course.id, trackTitle: course.title });
                        } else {
                          onNavigateToSection?.(item.section);
                        }
                      }}
                      disabled={isDisabled}
                      className={`group flex flex-col items-center justify-center py-3 sm:py-5 rounded-xl sm:rounded-2xl transition-all duration-200 min-h-[100px] sm:min-h-[120px] ${
                        isDisabled 
                          ? 'opacity-40 cursor-not-allowed' 
                          : 'hover:scale-[1.03]'
                      }`}
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                      onMouseEnter={(e) => {
                        if (!isDisabled) e.currentTarget.style.backgroundColor = '#48c6ed';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                      }}
                    >
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 transition-all duration-200" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                        <item.icon className={`w-5 h-5 sm:w-[26px] sm:h-[26px] transition-colors ${!isDisabled ? 'group-hover:text-white' : ''}`} style={{ color: 'rgba(255,255,255,0.8)' }} />
                      </div>
                      <span className={`text-xs sm:text-sm font-semibold transition-colors text-center leading-tight px-1 ${!isDisabled ? 'group-hover:text-white' : ''}`} style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                      {isDisabled && (
                        <span className="text-[9px] text-gray-500 mt-1">Débloquer le cours</span>
                      )}
                </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
        {/* CONTENU DU PARCOURS - One Screen View */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          {/* Titre de section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-400 tracking-wide">
              Ma progression
          </h2>
            {/* Légende compacte */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-900" />
                <span className="text-xs text-gray-500">Complété</span>
                </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-xs text-gray-500">En cours</span>
          </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full border border-gray-300 bg-white" />
                <span className="text-xs text-gray-500">À faire</span>
            </div>
              {course?.isTrial && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-800" />
                  <span className="text-xs text-gray-500">Preview</span>
            </div>
              )}
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-200" />
                <span className="text-xs text-gray-500">Verrouillé</span>
            </div>
            </div>
          </div>
          
          {/* Mini lecteurs vidéo avec nodes centrés et connectés - Grid 5 colonnes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {lessons.slice(0, 5).map((lesson, index) => {
              const scheduledDate = lessonSchedules.get(lesson.id);
              // Mode essai: seule la première leçon est accessible, les autres sont en preview
              const isTrialMode = course?.isTrial === true;
              const isTrialPreview = isTrialMode && index > 0;
              const isLocked = (!lesson.isOwned && !lesson.isAccessible && !purchasedItems.has(lesson.id)) && !isTrialMode;
              const getStatus = (): string => {
                // En mode essai, seule la première leçon peut être complétée
                // Les autres sont toujours en preview, même si marquées comme complétées
                if (isTrialPreview) return 'trialPreview';
                if (lesson.isCompleted && !isTrialPreview) return 'completed';
                if (lesson.isInProgress && !isTrialPreview) return 'current';
                if (lesson.isOwned || lesson.isAccessible || (isTrialMode && index === 0)) return 'available';
                return 'locked';
              };
              const status = getStatus();
            
            return (
                <div 
                  key={lesson.id} 
                  className={`flex flex-col ${isLocked ? 'opacity-50' : ''}`}
                >
                  {/* Node centré avec lignes de connexion */}
                  <div className="flex items-center justify-center mb-3 relative">
                    {/* Ligne gauche (sauf pour le premier) */}
                    {index > 0 && (
                      <div className={`absolute right-1/2 top-1/2 -translate-y-1/2 h-0.5 w-[calc(50%+12px)] -translate-x-[11px] ${
                        // En mode essai, seule la première leçon peut être complétée
                        (lessons[index - 1]?.isCompleted && !(isTrialMode && index - 1 > 0)) ? 'bg-gray-900' : 'bg-gray-200'
                      }`} />
                    )}
                    {/* Node */}
                    <div className="relative z-10">
                      <ProgressionNode
                        lesson={lesson}
                        index={index}
                        onClick={() => onStartLesson(lesson)}
                        isLocked={isLocked}
                        isTrialPreview={isTrialPreview}
                      />
                    </div>
                    {/* Ligne droite (sauf pour le dernier) */}
                    {index < Math.min(lessons.length - 1, 4) && (
                      <div className={`absolute left-1/2 top-1/2 -translate-y-1/2 h-0.5 w-[calc(50%+12px)] translate-x-[11px] ${
                        // En mode essai, seule la première leçon peut être complétée
                        (lesson.isCompleted && !isTrialPreview) ? 'bg-gray-900' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  
                  {/* Nom de la leçon (en haut) */}
                  <p className={`mb-2 text-sm font-semibold text-center line-clamp-2 leading-tight min-h-[40px] ${
                    isLocked ? 'text-gray-400' : isTrialPreview ? 'text-gray-500' : 'text-gray-900'
                  }`}>
                    {lesson.title}
                  </p>
                  
                  {/* Mini lecteur vidéo */}
                  <button
                    onClick={() => !isLocked && onStartLesson(lesson)}
                    disabled={isLocked}
                    className={`relative aspect-video rounded-xl overflow-hidden group transition-all ${
                      isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'
                    } ${
                      status === 'current' ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: '#1a1a2e' }}
                  >
                    {/* Fond dégradé */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
                    
                    {/* Badge Preview pour mode essai - noir premium */}
                    {status === 'trialPreview' && (
                      <div className="absolute top-2 right-2 z-20 px-2 py-0.5 bg-gray-900 text-white text-[9px] font-bold rounded uppercase tracking-wider shadow-lg">
                        Preview
                      </div>
                    )}
                    
                    {/* Overlay de statut */}
                    {status === 'completed' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                          <CheckCircle size={18} className="text-white" />
                        </div>
                      </div>
                    )}
                    
                    {status === 'locked' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                    )}
                    
                    {/* Overlay gris pour mode essai */}
                    {status === 'trialPreview' && (
                      <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg">
                          <Eye size={18} className="text-gray-300" />
                        </div>
                      </div>
                    )}
                    
                    {(status === 'available' || status === 'current') && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110 ${
                          status === 'current' ? 'bg-blue-600' : 'bg-white/20 group-hover:bg-white/30'
                        }`}>
                          <Play size={18} className="text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Badge "En cours" */}
                    {status === 'current' && (
                      <div className="absolute top-2 left-2">
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded uppercase">
                          En cours
                        </span>
                      </div>
                    )}
                    
                    {/* Numéro de leçon */}
                    <div className="absolute bottom-2 right-2">
                      <span className="text-white/50 text-xs font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </button>
                  
                  {/* Étiquettes: Date + Durée (maintenant en bas) */}
                  {/* Pas de date pour les leçons en preview (mode essai) */}
                  <div className="flex items-center gap-1.5 mt-2 justify-center flex-wrap">
                    {scheduledDate && !isTrialPreview && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                        lesson.isCompleted 
                          ? 'bg-gray-100 text-gray-400' 
                          : isDateToday(scheduledDate) 
                            ? 'bg-[#48c6ed]/10 text-[#48c6ed]' 
                            : isDatePast(scheduledDate) && !lesson.isCompleted
                              ? 'bg-red-50 text-red-500'
                              : 'bg-gray-50 text-gray-500'
                      }`}>
                        <Calendar size={9} />
                        {formatScheduledDate(scheduledDate)}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px] font-medium text-gray-500 flex items-center gap-1">
                      <Clock size={9} />
                      {formatDuration(lesson.duration)}
                    </span>
                  </div>
                </div>
            );
          })}
          </div>
        </div>
        
        <div className="h-16" />
      </div>
    </div>
  );
}

export default LearningTrackOverview;
