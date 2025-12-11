'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Eye, 
  Brain, 
  Clock, 
  Users, 
  CheckCircle,
  Star,
  Zap,
  BookOpen,
  ArrowRight,
  Heart,
  Lock
} from 'lucide-react';
import { Course, MiniQuizQuestion } from '@/types';
import { getCourseThumbnail } from '@/lib/course-thumbnails';
import { MiniQuiz } from './MiniQuiz';
import { getMiniQuizForCourse } from '@/lib/mock-data';
import { BuddyAvatars } from './BuddyAvatars';
import { getBuddiesForCourse } from '@/lib/buddy-data';

interface SuggestedCourseCardProps {
  course: Course;
  enrolledStudents: number;
  reason: string;
  onUnlock: (courseId: string) => void;
  onPreview: (courseId: string) => void;
  onToggleFavorite?: (courseId: string) => void;
  onClick?: (courseId: string) => void;
  canAfford: boolean;
  isUnlocked: boolean;
  thumbnailImage?: string; // Image de fond personnalisée pour le thumbnail
  isCompactMode?: boolean; // Mode compact après scroll
}

export function SuggestedCourseCard({ 
  course, 
  enrolledStudents, 
  reason, 
  onUnlock, 
  onPreview, 
  onToggleFavorite,
  onClick,
  canAfford, 
  isUnlocked,
  thumbnailImage,
  isCompactMode = false
}: SuggestedCourseCardProps) {
  const [showMiniQuiz, setShowMiniQuiz] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Détection automatique de l'illustration selon la matière
  const autoThumbnail = getCourseThumbnail(course.title, course.faculty, course.id);
  const finalThumbnail = thumbnailImage || autoThumbnail;
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);

  const miniQuizQuestions = getMiniQuizForCourse(course.id);
  const hasMiniQuiz = miniQuizQuestions.length > 0;


  const handleQuizComplete = (score: number, totalQuestions: number) => {
    setQuizScore({ score, total: totalQuestions });
    setQuizCompleted(true);
    setTimeout(() => {
      setShowMiniQuiz(false);
    }, 3000);
  };

  const getReasonDisplay = (reason: string) => {
    const translations: Record<string, string> = {
      'faculty_popular': 'Populaire dans votre faculté',
      'similar_students': 'Choisi par des étudiants similaires',
      'prerequisite': 'Prérequis recommandé',
      'continuation': 'Suite logique de vos cours'
    };
    return translations[reason] || reason;
  };

  const getReasonStyle = (reason: string) => {
    const styles: Record<string, { bg: string; text: string; icon: string }> = {
      'faculty_popular': { 
        bg: 'bg-gradient-to-r from-orange-500 to-red-500', 
        text: 'text-white', 
        icon: '🔥'
      },
      'similar_students': { 
        bg: 'bg-gradient-to-r from-blue-500 to-indigo-500', 
        text: 'text-white', 
        icon: '👥'
      },
      'prerequisite': { 
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500', 
        text: 'text-white', 
        icon: '📚'
      },
      'continuation': { 
        bg: 'bg-gradient-to-r from-purple-500 to-pink-500', 
        text: 'text-white', 
        icon: '➡️'
      }
    };
    return styles[reason] || { 
      bg: 'bg-gradient-to-r from-gray-500 to-slate-500', 
      text: 'text-white', 
      icon: '⭐'
    };
  };

  const reasonDisplay = getReasonDisplay(reason);
  const reasonStyle = getReasonStyle(reason);

  const colors = {
    primary: 'from-blue-500 to-purple-600',
    secondary: 'from-gray-400 to-gray-600'
  };

  if (showMiniQuiz) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 bg-gradient-to-br from-slate-50/80 via-white/90 to-blue-50/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-white/20 ring-1 ring-black/5">
            {/* Header moderne avec navigation claire */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b border-gray-100/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Test de Niveau</h2>
                    <p className="text-sm text-gray-600 font-medium">Évaluez vos connaissances • {course.title}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowMiniQuiz(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200 shadow-sm border border-gray-200/50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </div>
            
            {/* Contenu avec scroll fluide */}
            <div className="overflow-y-auto max-h-[calc(95vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="p-8">
                <MiniQuiz
                  questions={miniQuizQuestions}
                  onComplete={handleQuizComplete}
                  onClose={() => {
                    setShowMiniQuiz(false);
                    if (quizCompleted) {
                      onUnlock(course.id);
                    }
                  }}
                  courseTitle={course.title}
                  existingScore={quizCompleted && quizScore ? quizScore : undefined}
                  showDiagnosticImmediately={quizCompleted}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Déterminer si on doit afficher en mode compact (uniquement si scrolled ET pas en hover)
  const showCompact = isCompactMode && !isHovered;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick?.(course.id)}
      className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Badge de recommandation amélioré */}
      <div className="relative">
        {/* Étiquettes supprimées */}
        
        {/* Image du cours */}
        <div 
          className={`relative h-48 flex items-center justify-center ${
            finalThumbnail 
              ? 'bg-cover bg-center bg-no-repeat' 
              : 'bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100'
          }`}
          style={finalThumbnail ? { backgroundImage: `url(${finalThumbnail})` } : {}}
        >
          {/* Overlay pour améliorer la lisibilité si image de fond */}
          {finalThumbnail && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
          )}
          
          {!finalThumbnail && (
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <BookOpen className="text-blue-600" size={32} />
              </div>
              <div className="text-sm font-medium text-gray-600">
                {course.faculty || 'Cours général'}
              </div>
            </div>
          )}
        </div>
        
        {/* Bouton cœur pour ajouter aux favoris */}
        {onToggleFavorite && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(course.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={course.isPrimary ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-500 hover:bg-white shadow-lg transition-all duration-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          >
            <Heart 
              size={16} 
              fill={course.isPrimary ? 'currentColor' : 'none'} 
              className={course.isPrimary ? 'text-red-500' : ''}
            />
          </motion.button>
        )}

        {/* Avatars des buddies - Engagement social */}
        <BuddyAvatars 
          courseId={course.id}
          buddies={getBuddiesForCourse(course.id)}
          cardState="normal"
        />
      </div>

      <div className="p-6">
        {/* Titre et description */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          {/* Description : 2 lignes max (Option 1), cachée en mode compact sauf hover (Option 4) */}
          <AnimatePresence>
            {!showCompact && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-600 text-sm line-clamp-2 mb-3"
              >
                {course.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Métadonnées */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <motion.div 
            className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Users size={12} />
            <span>{enrolledStudents.toLocaleString()} étudiants</span>
            {enrolledStudents > 75 && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1" title="Cours populaire"></div>
            )}
          </motion.div>
          <div className="flex items-center gap-1 text-gray-600">
            <BookOpen size={14} />
            <span>{course.totalLessons || 3} leçons</span>
          </div>
        </div>


        {/* Badge débloqué */}
        {isUnlocked && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-green-50 rounded-xl border border-green-200 mb-4">
            <CheckCircle className="text-green-600" size={16} />
            <span className="text-sm font-medium text-green-700">Cours débloqué</span>
          </div>
        )}

        {/* Quiz terminé */}
        {quizCompleted && quizScore && (
          <motion.button
            onClick={() => setShowMiniQuiz(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl border border-yellow-200 hover:border-yellow-300 mb-4 transition-all duration-200 cursor-pointer group"
          >
            <Zap className="text-yellow-600 group-hover:text-yellow-700" size={16} />
            <span className="text-sm font-medium text-yellow-700 group-hover:text-yellow-800">
              📊 Quiz terminé: {quizScore.score}/{quizScore.total}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-yellow-600 group-hover:text-yellow-700 ml-1">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}


        {/* Actions - Adaptation selon mode compact */}
        <div className="space-y-2">
          <AnimatePresence mode="wait">
            {showCompact ? (
              /* Mode Compact : 2 boutons seulement */
              <motion.div
                key="compact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-2"
              >
                {/* Se tester */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🧠 Test cliqué pour:', course.title);
                    setShowMiniQuiz(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-1 py-3 px-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:from-gray-900 hover:to-gray-800"
                >
                  <Brain size={14} />
                  <span className="text-xs">Tester</span>
                </motion.button>

                {/* Débloquer */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnlock(course.id);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-1 py-3 px-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                >
                  <Lock size={14} />
                  <span className="text-xs">Débloquer</span>
                </motion.button>
              </motion.div>
            ) : (
              /* Mode Normal : 3 boutons */
              <motion.div
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-3 gap-2"
              >
                {/* Aperçu */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🔍 Aperçu cliqué pour:', course.title);
                    onPreview(course.id);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-1 py-3 px-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Eye size={14} />
                  <span className="text-xs">Aperçu</span>
                </motion.button>

                {/* Se tester */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🧠 Test cliqué pour:', course.title);
                    setShowMiniQuiz(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-1 py-3 px-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:from-gray-900 hover:to-gray-800"
                >
                  <Brain size={14} />
                  <span className="text-xs">Tester</span>
                </motion.button>

                {/* Débloquer */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnlock(course.id);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-1 py-3 px-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                >
                  <Lock size={14} />
                  <span className="text-xs">Débloquer</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
