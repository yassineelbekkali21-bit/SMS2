'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Play, Target, Users, Calendar } from 'lucide-react';
import { Course } from '@/types';
import { TrackPracticeView } from './TrackPracticeView';
import { TrackPlanningView } from './TrackPlanningView';
import { DuelFullScreen } from './DuelFullScreen';
import { ExamBlancGenerator } from './ExamBlancGenerator';
import { CommunityFullScreen } from './CommunityFullScreen';

interface CourseRowProps {
  title?: string;
  courses: Course[];
  onCourseClick: (course: Course) => void;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  showProgress?: boolean;
  showLockStatus?: boolean;
  maxVisible?: number;
  className?: string;
  defaultFavorites?: boolean; // Si true, tous les cours de cette row sont favoris par défaut
  onToggleFavorite?: (courseId: string) => void;
  isSequential?: boolean; // Si true, affiche les numéros de séquence et verrouille les cours non complétés
  onNavigateToSectionWithContext?: (section: string, context: { trackId: string; trackTitle: string }) => void;
}

interface CourseCardMiniProps {
  course: Course;
  onClick: (course: Course) => void;
  showProgress?: boolean;
  showLockStatus?: boolean;
  isLocked?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (courseId: string) => void;
  sequenceNumber?: number; // Numéro dans la séquence (1, 2, 3...)
  onNavigateToSectionWithContext?: (section: string, context: { trackId: string; trackTitle: string }) => void;
}

// Carte identique au SimpleDashboard
function CourseCardWrapper({ 
  course, 
  onClick, 
  showProgress = true,
  isFavorite = false,
  onToggleFavorite,
  sequenceNumber,
  isLocked = false,
  onNavigateToSectionWithContext,
}: CourseCardMiniProps) {
  const router = useRouter();
  const progress = course.progress || 0;
  const [liked, setLiked] = useState(isFavorite);
  
  // États pour les modals des 3 intentions (Avancer ouvre directement le Learning Track Viewer)
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  
  // États pour les vues plein écran
  const [showDuelFullScreen, setShowDuelFullScreen] = useState(false);
  const [showExamBlancGenerator, setShowExamBlancGenerator] = useState(false);
  const [showCommunityFullScreen, setShowCommunityFullScreen] = useState(false);
  const [communityInitialTab, setCommunityInitialTab] = useState<'discussion' | 'rooms' | 'members' | 'competitions'>('discussion');

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    onToggleFavorite?.(course.id);
  };
  
  // Callbacks pour TrackPracticeView
  const handleOpenQuizRapide = () => {
    // Redirige vers le flow assessment existant (partie 1: quiz rapide)
    router.push('/assessment/physics?mode=quick');
  };
  
  const handleOpenQuizApprofondi = () => {
    // Redirige vers le flow assessment existant (partie 2: quiz approfondi)
    router.push('/assessment/physics?mode=deep');
  };
  
  const handleOpenExamBlanc = () => {
    setShowExamBlancGenerator(true);
  };
  
  const handleOpenDuel = () => {
    setShowDuelFullScreen(true);
  };

  return (
    <div 
      className="flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[200px] xl:w-[200px] 2xl:w-[220px] group/card relative"
      style={{ fontFamily: 'DM Sans, sans-serif' }}
    >
      {/* Sequence Number Badge - pour les cours séquentiels */}
      {sequenceNumber && (
        <div 
          className="absolute top-0 left-0 z-40 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white"
          style={{ 
            backgroundColor: isLocked ? '#6b7280' : progress >= 100 ? '#9ca3af' : '#00c2ff',
            color: '#ffffff',
            transform: 'translate(-35%, -35%)'
          }}
        >
          {sequenceNumber}
        </div>
      )}

      {/* Card - hauteur réduite avec aspect-[4/5] */}
      <div className={`relative aspect-[4/5] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl overflow-hidden mb-2 transition-transform ${isLocked ? 'opacity-60' : 'group-hover/card:scale-[1.02]'}`}>
        {/* Badge ESSAI - en haut à gauche si mode essai */}
        {course.isTrial && (
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center px-3 py-1.5 bg-gray-900 rounded-md text-[13px] font-bold text-white uppercase tracking-wider shadow-lg">
              Essai
            </span>
          </div>
        )}

        {/* Heart button - visible au hover OU si liké */}
        <motion.button
          onClick={handleHeartClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-3 right-3 z-20 p-2 bg-black/30 backdrop-blur-sm rounded-full transition-all duration-200 hover:bg-black/50 ${
            liked ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
          }`}
        >
          <Heart 
            size={18} 
            fill={liked ? '#ef4444' : 'none'} 
            className={liked ? 'text-red-500' : 'text-white/80'}
          />
        </motion.button>

        {/* Lock overlay for locked courses */}
        {isLocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <div className="w-14 h-14 bg-gray-600/80 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zM9 6a3 3 0 016 0v2H9V6z"/>
              </svg>
            </div>
          </div>
        )}

        {/* 4 Action buttons - Intentions utilisateur */}
        {!isLocked && (
          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover/card:opacity-100 transition-opacity">
            <div className="grid grid-cols-2 gap-3">
              {/* 1. Avancer - Ouvre le Learning Track Viewer directement */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(course); // Ouvre directement le cours dans le Learning Track Viewer
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-100 transition-colors"
                title="Avancer"
              >
                <Play size={16} className="text-gray-900 ml-0.5" />
              </motion.button>
              
              {/* 2. Training Club - Navigation contextuelle (désactivé en mode essai) */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  if (course.isTrial) return;
                  if (onNavigateToSectionWithContext) {
                    onNavigateToSectionWithContext('training', { trackId: course.id, trackTitle: course.title });
                  } else {
                    setShowPracticeModal(true);
                  }
                }}
                whileHover={course.isTrial ? {} : { scale: 1.1 }}
                whileTap={course.isTrial ? {} : { scale: 0.9 }}
                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition-colors ${
                  course.isTrial 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-white hover:bg-gray-100'
                }`}
                title={course.isTrial ? "Débloquer le cours pour accéder" : "Training Club"}
              >
                <Target size={16} className={course.isTrial ? 'text-gray-600' : 'text-gray-900'} />
              </motion.button>
              
              {/* 3. Social Club - Navigation contextuelle (désactivé en mode essai) */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  if (course.isTrial) return;
                  if (onNavigateToSectionWithContext) {
                    onNavigateToSectionWithContext('community', { trackId: course.id, trackTitle: course.title });
                  } else {
                    setCommunityInitialTab('discussion');
                    setShowCommunityFullScreen(true);
                  }
                }}
                whileHover={course.isTrial ? {} : { scale: 1.1 }}
                whileTap={course.isTrial ? {} : { scale: 0.9 }}
                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition-colors ${
                  course.isTrial 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-white hover:bg-gray-100'
                }`}
                title={course.isTrial ? "Débloquer le cours pour accéder" : "Social Club"}
              >
                <Users size={16} className={course.isTrial ? 'text-gray-600' : 'text-gray-900'} />
              </motion.button>
              
              {/* 4. Planning - Navigation contextuelle (toujours activé) */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onNavigateToSectionWithContext) {
                    onNavigateToSectionWithContext('planning', { trackId: course.id, trackTitle: course.title });
                  } else {
                    setShowPlanningModal(true);
                  }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-100 transition-colors"
                title="Planning"
              >
                <Calendar size={16} className="text-gray-900" />
              </motion.button>
            </div>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Separator line */}
          <div className="w-8 h-0.5 bg-white/40 mb-2" />
          {/* Title */}
          <h3 
            className="font-bold text-sm leading-tight line-clamp-2"
            style={{ color: '#ffffff' }}
          >
            {course.title}
          </h3>
          {/* Lessons & Duration - plus lisible que la description */}
          <div className="flex items-center gap-3 mt-2">
            <span 
              className="text-xs font-medium"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {course.totalLessons || 5} leçons
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
            <span 
              className="text-xs font-medium"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {course.duration || '2h30'}
            </span>
          </div>
        </div>
        
        {/* Progress Bar - Vert si terminé, Accent sinon */}
        {showProgress && progress > 0 && !isLocked && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? '#10b981' : '#00c2ff' 
              }}
            />
          </div>
        )}
      </div>
      
      {/* Progress text below card - taille augmentée */}
      {showProgress && progress > 0 && !isLocked && (
        <p className="text-sm font-medium" style={{ color: progress >= 100 ? '#10b981' : '#00c2ff' }}>
          {progress >= 100 ? 'Terminé' : `${Math.round(progress)}% complété`}
        </p>
      )}
      
      {/* Locked message */}
      {isLocked && sequenceNumber && (
        <p className="text-sm font-medium text-gray-500">
          Terminez le cours {sequenceNumber - 1} d'abord
        </p>
      )}

      {/* Modals pour les 3 intentions (Avancer ouvre directement le Learning Track Viewer) */}
      <TrackPracticeView
        isOpen={showPracticeModal}
        onClose={() => setShowPracticeModal(false)}
        trackId={course.id}
        trackTitle={course.title}
        onOpenQuizRapide={handleOpenQuizRapide}
        onOpenQuizApprofondi={handleOpenQuizApprofondi}
        onOpenExamBlanc={handleOpenExamBlanc}
        onOpenDuel={handleOpenDuel}
      />
      
      {/* Community Fullscreen */}
      <CommunityFullScreen
        isOpen={showCommunityFullScreen}
        onClose={() => setShowCommunityFullScreen(false)}
        trackId={course.id}
        trackTitle={course.title}
        initialTab={communityInitialTab}
      />
      
      <TrackPlanningView
        isOpen={showPlanningModal}
        onClose={() => setShowPlanningModal(false)}
        trackId={course.id}
        trackTitle={course.title}
        totalLessons={course.totalLessons || 12}
        completedLessons={Math.round(((course.progress || 0) / 100) * (course.totalLessons || 12))}
      />
      
      {/* Vues plein écran */}
      <DuelFullScreen
        isOpen={showDuelFullScreen}
        onClose={() => setShowDuelFullScreen(false)}
        trackTitle={course.title}
      />
      
      <ExamBlancGenerator
        isOpen={showExamBlancGenerator}
        onClose={() => setShowExamBlancGenerator(false)}
        trackTitle={course.title}
      />
    </div>
  );
}

export function CourseRow({
  title,
  courses,
  onCourseClick,
  emptyMessage = "Aucun cours disponible",
  emptyAction,
  showProgress = false,
  showLockStatus = false,
  maxVisible = 20,
  className = '',
  defaultFavorites = false,
  onToggleFavorite,
  isSequential = false,
  onNavigateToSectionWithContext,
}: CourseRowProps) {
  // Apply DM Sans font
  const fontStyle = { fontFamily: 'DM Sans, sans-serif' };
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [courses]);

  // Scroll handlers
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Scroll by roughly 2 cards
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Limit visible courses
  const visibleCourses = courses.slice(0, maxVisible);
  const hasMore = courses.length > maxVisible;

  // Empty state
  if (courses.length === 0) {
    return (
      <div className={`${className}`} style={fontStyle}>
        {title && (
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div className="bg-gray-100 rounded-2xl p-8 text-center">
          <p className="text-gray-500 mb-4 text-base">{emptyMessage}</p>
          {emptyAction && (
            <button
              onClick={emptyAction.onClick}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors text-sm"
            >
              {emptyAction.label}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ ...fontStyle, overflow: 'visible' }}>
      {/* Header - avec navigation style moderne */}
      {title && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span className="text-sm text-gray-500">({courses.length})</span>
          </div>
          
          {/* Navigation controls */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all">
              Voir tout
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                canScrollLeft 
                  ? 'text-gray-700 hover:bg-white hover:shadow-sm' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                canScrollRight 
                  ? 'text-gray-700 hover:bg-white hover:shadow-sm' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Scroll Container */}
      <div className="relative" style={{ overflow: 'visible' }}>
        {/* Courses Container - padding minimal pour badges et zoom */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="flex gap-5 scrollbar-hide pt-4 pb-3 pl-4 pr-8"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            overflowX: 'auto',
            overflowY: 'visible'
          }}
        >
          {visibleCourses.map((course, index) => {
            // Logique de verrouillage séquentiel :
            // Un cours est verrouillé si le cours précédent n'est pas terminé (progress < 100)
            const isLocked = isSequential && index > 0 && (courses[index - 1]?.progress || 0) < 100;
            
            return (
              <CourseCardWrapper
                key={course.id}
                course={course}
                onClick={onCourseClick}
                showProgress={showProgress}
                showLockStatus={showLockStatus}
                isLocked={isLocked}
                isFavorite={defaultFavorites}
                onToggleFavorite={onToggleFavorite}
                sequenceNumber={isSequential ? index + 1 : undefined}
                onNavigateToSectionWithContext={onNavigateToSectionWithContext}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}

// SubjectSection component for grouping courses by subject with sub-groups
interface SubjectSectionProps {
  subject: string;
  subGroups: Course[][];
  onCourseClick: (course: Course) => void;
  className?: string;
  onToggleFavorite?: (courseId: string) => void;
  displayMode?: 'tracks' | 'bundles'; // Mode d'affichage
}

import { Bundle } from '@/types';
import { BundleRow } from './BundleRow';

// Helper pour convertir un groupe de cours en Bundle
const coursesToBundle = (courses: Course[], subject: string, groupIndex: number): Bundle => {
  const completedTracks = courses.filter(c => c.progress === 100).length;
  const totalProgress = courses.length > 0 
    ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length) 
    : 0;
  const currentIndex = courses.findIndex(c => c.progress > 0 && c.progress < 100);
  const totalLessons = courses.reduce((acc, c) => acc + (c.totalLessons || 0), 0);
  const totalMinutes = courses.reduce((acc, c) => {
    const duration = parseInt(c.duration || '0');
    return acc + (isNaN(duration) ? 45 : duration * 60);
  }, 0);
  
  // Déterminer si le bundle est en mode essai (si au moins un cours est en mode essai)
  const isTrial = courses.some(c => c.isTrial === true);
  
  // Générer un titre pour le bundle basé sur le premier cours
  const firstCourse = courses[0];
  let bundleTitle = `Parcours ${subject} ${groupIndex + 1}`;
  
  // Extraire un meilleur titre si possible
  if (firstCourse?.title) {
    if (firstCourse.title.includes('mécanique') || firstCourse.title.toLowerCase().includes('meca')) {
      bundleTitle = 'Mécanique';
    } else if (firstCourse.title.includes('électro') || firstCourse.title.includes('elec')) {
      bundleTitle = 'Électrostatique';
    } else if (firstCourse.title.includes('thermo')) {
      bundleTitle = 'Thermodynamique';
    } else if (firstCourse.title.includes('analyse') || firstCourse.title.includes('Analyse')) {
      bundleTitle = 'Analyse';
    } else if (firstCourse.title.includes('algèbre') || firstCourse.title.includes('Algèbre')) {
      bundleTitle = 'Algèbre linéaire';
    } else if (firstCourse.title.includes('organique')) {
      bundleTitle = 'Chimie organique';
    } else if (firstCourse.title.includes('générale') || firstCourse.title.includes('gen')) {
      bundleTitle = 'Chimie générale';
    } else if (firstCourse.title.includes('Python')) {
      bundleTitle = 'Python';
    } else if (firstCourse.title.includes('BDD') || firstCourse.title.includes('SQL')) {
      bundleTitle = 'Bases de données';
    } else if (firstCourse.title.includes('micro')) {
      bundleTitle = 'Microéconomie';
    } else if (firstCourse.title.includes('macro')) {
      bundleTitle = 'Macroéconomie';
    }
  }
  
  return {
    id: `bundle-${subject.toLowerCase().replace(/\s/g, '-')}-${groupIndex}`,
    title: bundleTitle,
    description: `Maîtrise complète à travers ${courses.length} learning tracks progressifs`,
    subject,
    tracks: courses,
    totalDuration: totalMinutes >= 60 
      ? `${Math.floor(totalMinutes / 60)}h${totalMinutes % 60 > 0 ? `${totalMinutes % 60}min` : ''}`
      : `${totalMinutes}min`,
    totalLessons,
    difficulty: courses[0]?.difficulty || 'intermediate',
    progress: totalProgress,
    currentTrackIndex: currentIndex >= 0 ? currentIndex : 0,
    isStarted: totalProgress > 0,
    isCompleted: completedTracks === courses.length,
    objectives: [
      `Comprendre les fondamentaux de ${subject.toLowerCase()}`,
      'Appliquer les concepts à des exercices pratiques',
      'Réussir les évaluations de fin de parcours'
    ],
    isTrial, // Hériter du mode essai des cours
  };
};

export function SubjectSection({
  subject,
  subGroups,
  onCourseClick,
  className = '',
  onToggleFavorite,
  displayMode = 'bundles',
}: SubjectSectionProps) {
  // Convertir les groupes en bundles
  const bundles = subGroups.map((courses, index) => coursesToBundle(courses, subject, index));
  
  if (displayMode === 'bundles') {
    // Affichage avec BundleRow (cartes + accordéon inline)
    return (
      <div className={className}>
        <BundleRow
          subject={subject}
          bundles={bundles}
          onTrackClick={onCourseClick}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    );
  }
  
  // Affichage classique des tracks (ancien comportement)
  return (
    <div className={`space-y-3 ${className}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <h2 className="text-lg font-bold text-gray-900">{subject}</h2>
      {subGroups.map((courses, groupIndex) => (
        <CourseRow
          key={`${subject}-group-${groupIndex}`}
          courses={courses}
          onCourseClick={onCourseClick}
          showLockStatus={true}
          showProgress={true}
          onToggleFavorite={onToggleFavorite}
          isSequential={true}
        />
      ))}
    </div>
  );
}

export default CourseRow;


