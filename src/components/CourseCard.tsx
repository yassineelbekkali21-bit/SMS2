'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Star, 
  Users, 
  TrendingUp, 
  Lock, 
  GripVertical, 
  BookOpen,
  CheckCircle,
  Target,
  Zap,
  Award,
  Eye,
  Heart,
  Brain,
  Layers3,
  FlaskConical,
  Video
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Course, StudentProgress, MiniQuizQuestion } from '@/types';
import { MiniQuiz } from './MiniQuiz';
import { getMiniQuizForCourse } from '@/lib/mock-data';
import { cn, formatDuration, getProgressColor, getMotivationMessage } from '@/lib/utils';
import { getCourseThumbnail } from '@/lib/course-thumbnails';
import { StudyRoomButton } from './StudyRoomButton';
import { BuddyAvatars } from './BuddyAvatars';
import { getBuddiesForCourse } from '@/lib/buddy-data';

interface CourseCardProps {
  course: Course;
  progress?: StudentProgress;
  isDraggable?: boolean;
  onToggleFavorite?: (courseId: string) => void;
  onPreview?: (courseId: string) => void;
  onEnroll?: (courseId: string) => void;
  onOpenCourse?: (course: Course) => void;
  onOpenStaircaseView?: (course: Course) => void;
  canAfford?: boolean;
  isUnlocked?: boolean;
  purchasedItems?: Set<string>;
  // Study Room props
  studyRoomAccess?: {
    hasFullAccess: boolean;
    accessMessage: string;
  };
  onJoinStudyRoom?: (courseId: string) => void;
  hasActiveStudyRoom?: boolean;
  studyRoomParticipants?: number;
}

export function CourseCard({
  course,
  progress,
  isDraggable = false,
  onToggleFavorite,
  onPreview,
  onEnroll,
  onOpenCourse,
  onOpenStaircaseView,
  canAfford = true,
  isUnlocked = false,
  purchasedItems = new Set(),
  studyRoomAccess,
  onJoinStudyRoom,
  hasActiveStudyRoom,
  studyRoomParticipants
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMiniQuiz, setShowMiniQuiz] = useState(false);

  // 🔍 Fonction pour calculer les leçons débloquées
  const calculateUnlockedLessons = (course: Course, purchasedItems: Set<string>) => {
    if (course.lessons && course.lessons.length > 0) {
      // Si le cours a des leçons détaillées, utiliser la logique normale
      const unlockedCount = course.lessons.filter(lesson => {
        // Leçon explicitement possédée
        if (lesson.isOwned) return true;
        
        // Vérifier les achats via le système d'achat
        // Format 1: lesson-1, lesson-2, etc. (ancien format)
        const lessonNumber = lesson.id.split('-lesson-')[1];
        const isLessonPurchasedOldFormat = lessonNumber && purchasedItems.has(`lesson-${lessonNumber}`);
        
        // Format 2: course-equilibres-lesson-1, etc. (nouveau format)
        const isLessonPurchasedNewFormat = purchasedItems.has(lesson.id);
        
        const isCoursePurchased = purchasedItems.has(`course-${course.id}`) || purchasedItems.has(course.id);
        const isPackPurchased = course.packId && purchasedItems.has(`pack-${course.packId}`);
        
        return isLessonPurchasedOldFormat || isLessonPurchasedNewFormat || isCoursePurchased || isPackPurchased;
      }).length;

      return { unlockedCount, totalCount: course.lessons.length };
    } else {
      // Si pas de leçons détaillées, utiliser une logique simplifiée
      const totalCount = course.totalLessons || 0;
      
      // Vérifier si le cours complet est acheté
      const isCoursePurchased = purchasedItems.has(`course-${course.id}`) || purchasedItems.has(course.id);
      const isPackPurchased = course.packId && purchasedItems.has(`pack-${course.packId}`);
      
      if (isCoursePurchased || isPackPurchased) {
        // Si le cours complet est acheté, toutes les leçons sont débloquées
        return { unlockedCount: totalCount, totalCount };
      }
      
      // Pour les leçons individuelles, nous avons un problème : 
      // lesson-1, lesson-2, etc. ne spécifient pas le cours
      // Pour l'instant, on considère qu'il n'y a pas de leçons partiellement débloquées
      // sauf si on peut déterminer le cours d'origine avec certitude
      
      // LOGIQUE CORRIGÉE : Ne pas faire d'assumption sur les leçons génériques
      // Les leçons génériques (lesson-1, etc.) ne peuvent pas être attribuées
      // automatiquement à un cours spécifique sans contexte explicite
      
      // Pour les cours favoris, vérifier si des leçons génériques leur appartiennent
      // NOUVELLE LOGIQUE : Associer les leçons génériques au dernier cours ajouté aux favoris
      if (course.isPrimary) {
        let potentialUnlockedCount = 0;
        
        // Vérifier les leçons génériques (lesson-1, lesson-2, etc.)
        for (let i = 1; i <= totalCount; i++) {
          if (purchasedItems.has(`lesson-${i}`)) {
            potentialUnlockedCount++;
          }
        }
        
        // Si on a des leçons génériques, les attribuer seulement au dernier cours ajouté aux favoris
        if (potentialUnlockedCount > 0) {
          // Récupérer l'ordre des favoris depuis localStorage
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          const lastFavoriteId = favorites[favorites.length - 1];
          
          console.log(`🔍 COURSE CARD DEBUG: Favoris dans localStorage:`, favorites);
          console.log(`🔍 COURSE CARD DEBUG: Dernier favori:`, lastFavoriteId);
          console.log(`🔍 COURSE CARD DEBUG: Cours actuel:`, course.id);
          
          // Attribuer les leçons génériques seulement au dernier cours favori
          if (course.id === lastFavoriteId) {
            console.log(`🔍 COURSE CARD: Cours ${course.id} (${course.title}) - ${potentialUnlockedCount} leçons génériques attribuées (dernier favori)`);
            return { unlockedCount: potentialUnlockedCount, totalCount };
          } else {
            console.log(`🔍 COURSE CARD: Cours ${course.id} (${course.title}) - leçons génériques ignorées (pas le dernier favori)`);
          }
        }
      }
      
      return { unlockedCount: 0, totalCount };
    }
  };

  // 🎯 Déterminer l'état de la carte
  const getCardState = (course: Course, isUnlocked: boolean, purchasedItems: Set<string>) => {
    // Si explicitement débloqué ou possédé
    if (isUnlocked || course.isOwned) {
      return 'unlocked';
    }

    // Si favori mais pas débloqué
    if (course.isPrimary && !course.isOwned) {
      // Vérifier s'il y a des leçons partiellement débloquées
      const { unlockedCount, totalCount } = calculateUnlockedLessons(course, purchasedItems);
      
      if (unlockedCount > 0 && unlockedCount < totalCount) {
        return 'partiallyUnlocked';
      }
      
      return 'favoriteNotUnlocked';
    }

    return 'normal';
  };

  // Récupérer purchasedItems depuis la prop
  const cardState = getCardState(course, isUnlocked, purchasedItems);
  const { unlockedCount, totalCount } = calculateUnlockedLessons(course, purchasedItems);

  // 🔍 DEBUG: Afficher les informations de debug pour les cours avec des leçons
  if (course.lessons && course.lessons.length > 0) {
    console.log('🎯 COURSE CARD DEBUG:', {
      courseId: course.id,
      courseTitle: course.title,
      cardState,
      unlockedCount,
      totalCount,
      purchasedItems: Array.from(purchasedItems),
      isUnlocked,
      isOwned: course.isOwned,
      isPrimary: course.isPrimary,
      lessonsInfo: course.lessons.map(l => ({ id: l.id, isOwned: l.isOwned }))
    });
  } else {
    // Debug pour les cours sans leçons détaillées
    console.log('⚠️ COURSE CARD: Cours sans leçons détaillées:', {
      courseId: course.id,
      courseTitle: course.title,
      totalLessons: course.totalLessons,
      purchasedItems: Array.from(purchasedItems),
      cardState,
      unlockedCount,
      totalCount,
      isUnlocked,
      isOwned: course.isOwned,
      isPrimary: course.isPrimary
    });
  }

  // Drag and drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: course.id,
    disabled: !isDraggable
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Détection automatique de l'illustration
  const finalThumbnail = getCourseThumbnail(course.title, course.faculty, course.id);

  // 🎨 Génération de couleurs dynamiques basées sur le contenu
  const generatePattern = (title: string) => {
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 60) % 360;
    const hue3 = (hue1 + 120) % 360;
    
    return `linear-gradient(135deg, 
      hsl(${hue1}, 70%, 85%) 0%, 
      hsl(${hue2}, 60%, 90%) 50%, 
      hsl(${hue3}, 65%, 88%) 100%)`;
  };

  const pattern = generatePattern(course.title);

  // 🎯 Couleurs thématiques intelligentes
  const getThemeColors = () => {
    const subject = course.faculty?.toLowerCase() || course.title.toLowerCase();
    
    if (subject.includes('math') || subject.includes('calcul') || subject.includes('algèbre')) {
      return {
        primary: 'from-blue-500 to-indigo-600',
        accent: 'bg-blue-100 text-blue-800',
        hover: 'group-hover:text-blue-600'
      };
    }
    if (subject.includes('physique') || subject.includes('mécanique')) {
      return {
        primary: 'from-purple-500 to-violet-600',
        accent: 'bg-purple-100 text-purple-800',
        hover: 'group-hover:text-purple-600'
      };
    }
    if (subject.includes('chimie') || subject.includes('biologie')) {
      return {
        primary: 'from-green-500 to-emerald-600',
        accent: 'bg-green-100 text-green-800',
        hover: 'group-hover:text-green-600'
      };
    }
    
    return {
      primary: 'from-gray-500 to-slate-600',
      accent: 'bg-gray-100 text-gray-800',
      hover: 'group-hover:text-gray-600'
    };
  };

  const colors = getThemeColors();

  // 🔧 Icône contextuelle
  const getContextualIcon = () => {
    const subject = course.title.toLowerCase();
    if (subject.includes('math') || subject.includes('calcul')) return BookOpen;
    if (subject.includes('physique')) return Zap;
    if (subject.includes('chimie')) return FlaskConical;
    if (subject.includes('biologie')) return Layers3;
    return BookOpen;
  };

  const IconComponent = getContextualIcon();

  // Calculer la progression réelle
  const courseProgress = progress?.percentComplete ?? 0;

  // 📊 Calcul du niveau de confiance
  const getTrustLevel = () => {
    const factors = [
      course.totalLessons >= 5 ? 1 : 0,
      // Utiliser des valeurs par défaut pour les propriétés manquantes
      1, // Assume good rating for now
      1  // Assume good enrollment for now
    ];
    return factors.reduce((a, b) => a + b, 0);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -12,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
        onOpenCourse?.(course);
      }}
      // 🔑 Accessibilité Web Standards
      role="article"
      aria-label={`Cours: ${course.title}`}
      aria-describedby={`course-${course.id}-description`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenCourse?.(course);
        }
      }}
      className={cn(
        "group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500",
        "focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/40",
        isDragging && "opacity-50 scale-95 rotate-1",
        isAnimating && "animate-pulse",
        // Bordure dynamique selon l'état
        cardState === 'favoriteNotUnlocked'
          ? "border border-gray-300 hover:border-gray-400" // Favori non débloqué - bordure fine et élégante
          : "border border-white/20 hover:border-white/40" // Normal, débloqué et partiellement débloqué
      )}
    >
      {/* 🎨 Header avec Pattern Génératif ou Image personnalisée */}
      <div className="relative h-52 overflow-hidden transition-all duration-300">
        {finalThumbnail ? (
          /* Image personnalisée */
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-300"
            style={{ backgroundImage: `url(${finalThumbnail})` }}
          >
            {/* Overlay subtil pour préserver la lisibilité */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ) : (
          /* Pattern génératif unique */
          <div 
            className="w-full h-full relative transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%), ${pattern}`,
            }}
          >
            {/* Mesh gradient overlay pour la profondeur */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5" />
            
            {/* Icône contextuelle centrale */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${colors.primary} shadow-lg backdrop-blur-sm`}
              >
                <IconComponent size={48} className="text-white drop-shadow-lg" />
              </motion.div>
            </div>
          </div>
        )}

        {/* Particules flottantes pour effet Web 3.0 - seulement si pas d'image personnalisée */}
        {!finalThumbnail && (
          <>
            <motion.div 
              className="absolute top-4 left-4 w-2 h-2 bg-white/60 rounded-full"
              animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="absolute top-8 right-6 w-1.5 h-1.5 bg-white/40 rounded-full"
              animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            />
            <motion.div 
              className="absolute bottom-6 left-8 w-1 h-1 bg-white/50 rounded-full"
              animate={{ y: [0, -6, 0], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* Étiquette pour cours partiellement débloqués */}
        {cardState === 'partiallyUnlocked' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute top-4 left-4 z-10"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-xl shadow-lg backdrop-blur-sm border border-blue-400/30 flex items-center gap-2">
              <Lock size={14} />
              <span className="text-xs font-bold">
                {totalCount - unlockedCount} leçon{totalCount - unlockedCount > 1 ? 's' : ''} restante{totalCount - unlockedCount > 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        )}

        {/* Drag Handle - Design amélioré */}
        {isDraggable && (
          <motion.div
            {...attributes}
            {...listeners}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 cursor-grab active:cursor-grabbing z-10 border border-white/10"
          >
            <GripVertical size={16} />
          </motion.div>
        )}


        {/* Bouton favori - Design bienveillant */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(course.id);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={course.isPrimary ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-500 hover:bg-white shadow-lg transition-all duration-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          <Heart 
            size={18} 
            fill={course.isPrimary ? '#ef4444' : 'none'} 
            className={course.isPrimary ? 'text-red-500' : ''} 
          />
        </motion.button>

        {/* Avatars des buddies - Engagement social */}
        <BuddyAvatars 
          courseId={course.id}
          buddies={getBuddiesForCourse(course.id)}
          cardState={cardState}
        />

      </div>

      {/* 📚 Contenu Principal - Approche Bienveillante */}
      <div className="p-4 md:p-6 space-y-4 course-card">
        {/* En-tête avec titre et message encourageant */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className={`text-lg font-bold text-gray-900 line-clamp-2 transition-colors ${colors.hover} flex-1`}>
              {course.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Bouton Study Room */}
              <StudyRoomButton
                course={course}
                studyRoomAccess={studyRoomAccess}
                onJoinStudyRoom={onJoinStudyRoom}
                hasActiveStudyRoom={hasActiveStudyRoom}
                studyRoomParticipants={studyRoomParticipants}
              />
              {/* Indicateur de cours terminé */}
              {course.isOwned && courseProgress === 100 && (
                <CheckCircle size={20} className="text-emerald-500" />
              )}
            </div>
          </div>
        </div>

        {/* Section progression - Design amélioré */}
        {(course.isOwned || cardState === 'partiallyUnlocked') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {cardState === 'partiallyUnlocked' ? 'Progression en cours' : 'Votre progression'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">
                  {cardState === 'partiallyUnlocked' 
                    ? Math.round((unlockedCount / totalCount) * 100) 
                    : courseProgress}%
                </span>
                {((cardState === 'partiallyUnlocked' && (unlockedCount / totalCount) >= 0.75) || 
                  (cardState !== 'partiallyUnlocked' && courseProgress >= 75)) && 
                  <Zap size={14} className="text-amber-500" />}
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: cardState === 'partiallyUnlocked' 
                      ? `${Math.round((unlockedCount / totalCount) * 100)}%`
                      : `${courseProgress}%`
                  }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                  className={`h-full bg-gradient-to-r ${colors.primary} rounded-full relative`}
                >
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </motion.div>
              </div>
              
              {/* Indicateur de milestone */}
              {((cardState === 'partiallyUnlocked' && (unlockedCount / totalCount) >= 0.5) ||
                (cardState !== 'partiallyUnlocked' && courseProgress >= 50)) && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, type: "spring" }}
                  className="absolute right-0 -top-8 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium"
                >
                  🎯 {cardState === 'partiallyUnlocked' ? 'Continue ton élan !' : 'À mi-parcours !'}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Métadonnées du cours - Design épuré */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              {cardState === 'partiallyUnlocked' ? (
                <motion.span 
                  className="text-gray-700 font-medium transition-colors duration-200 group-hover:text-purple-600"
                  whileHover={{ scale: 1.05 }}
                >
                  {unlockedCount}/{totalCount} leçons
                </motion.span>
              ) : (
                <span>{course.totalLessons} leçons</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Actions principales - Design cohérent */}
        <div className="flex gap-3 pt-4">
          {course.isOwned || cardState === 'partiallyUnlocked' ? (
            /* Si cours débloqué ou partiellement débloqué : bouton Continuer unique */
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCourse?.(course);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:shadow-xl focus:ring-gray-900/20 hover:from-gray-800 hover:to-gray-700"
            >
              <BookOpen size={16} />
              Continuer
            </motion.button>
          ) : (
            /* Boutons : Je me teste + Commencer */
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMiniQuiz(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Tester mes connaissances sur le cours ${course.title}`}
                className="py-3 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-1 focus:outline-none focus:ring-4 focus:ring-gray-500/20"
              >
                <Brain size={14} />
                <span className="text-xs">Je me teste</span>
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCourse?.(course);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1 focus:outline-none focus:ring-4 focus:ring-blue-600/20 hover:shadow-xl hover:from-blue-700 hover:to-blue-800"
              >
                <Play size={14} />
                <span className="text-xs">Commencer</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Mini Quiz Modal */}
      {showMiniQuiz && (
        <MiniQuiz
          courseTitle={course.title}
          questions={getMiniQuizForCourse(course.id)}
          onClose={() => setShowMiniQuiz(false)}
          onComplete={(score, total) => {
            console.log(`Quiz completed with score: ${score}/${total}`);
            setShowMiniQuiz(false);
          }}
        />
      )}
    </motion.div>
  );
}
