'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Star, 
  Trophy,
  Sparkles,
  Plus,
  BookOpen,
  CheckCircle,
  Target,
  Gift,
  Zap,
  Clock,
  Users,
  Play
} from 'lucide-react';
import { Course } from '@/types';
import { CourseCard } from './CourseCard';
import { SuggestedCourseCard } from './SuggestedCourseCard';
import { CourseCardPaniniEmpty } from './CourseCardPaniniEmpty';
import { getCoursePacks, getCourseById } from '@/lib/mock-data';

interface FavoritesPackCollectionProps {
  favoriteCourses: Course[];
  onToggleFavorite: (courseId: string, courseTitle?: string) => void;
  onPreview: (courseId: string) => void;
  onEnroll: (courseId: string) => void;
  onOpenCourse: (course: Course) => void;
  onOpenStaircaseView: (course: Course) => void;
  progressData: any[];
  getStudyRoomProps: (course: Course) => any;
  onCompletePack?: (packId: string) => void;
  purchasedItems?: Set<string>;
}

interface PackWithCourses {
  id: string;
  title: string;
  description: string;
  courses: string[];
  ownedCourses: Course[];
  unlockedCourses: Course[];      // Cours débloqués (achetés)
  favoritesNotUnlocked: Course[]; // Favoris non débloqués
  nonFavoriteNonUnlocked: string[]; // Cours non favoris/non débloqués (état Panini gris)
  nonFavoriteButUnlocked: Course[]; // 🎯 NOUVEAU : Cours non favoris mais débloqués
  missingCourses: string[];       // Emplacements vides (ancienne logique, maintenant vide)
  completionRate: number;
  isCompleted: boolean;
  color: string;
  icon: string;
  lessonProgress: number;
  purchasedCoursesCount: number;
}

export function FavoritesPackCollection({
  favoriteCourses,
  onToggleFavorite,
  onPreview,
  onEnroll,
  onOpenCourse,
  onOpenStaircaseView,
  progressData,
  getStudyRoomProps,
  onCompletePack,
  purchasedItems = new Set()
}: FavoritesPackCollectionProps) {
  
  // 🔍 DEBUG: Vérifier les cours favoris et leurs leçons
  console.log('🎯 FAVORITES COLLECTION DEBUG:', {
    favoriteCourses: favoriteCourses.map(course => ({
      id: course.id,
      title: course.title,
      hasLessons: !!(course.lessons && course.lessons.length > 0),
      lessonsCount: course.lessons?.length || 0,
      totalLessons: course.totalLessons,
      isOwned: course.isOwned,
      isPrimary: course.isPrimary
    })),
    purchasedItems: Array.from(purchasedItems)
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isIndividualCoursesCollapsed, setIsIndividualCoursesCollapsed] = useState(false);

  // Récupérer les packs disponibles
  const availablePacks = getCoursePacks();
  
  // Initialiser tous les packs comme pliés par défaut
  const [collapsedPacks, setCollapsedPacks] = useState<Set<string>>(() => {
    return new Set(availablePacks.map(pack => pack.id));
  });

  // Calculer la progression de lecture des leçons pour un cours
  const calculateLessonProgress = (courseId: string) => {
    const progress = progressData.find(p => p.courseId === courseId);
    if (!progress) return 0;
    
    // Si le cours a des leçons avec progression
    if (progress.lessons && progress.lessons.length > 0) {
      const completedLessons = progress.lessons.filter((lesson: any) => lesson.completed).length;
      return Math.round((completedLessons / progress.lessons.length) * 100);
    }
    
    // Sinon utiliser la progression générale du cours
    return progress.progress || 0;
  };

  // Organiser les cours favoris par pack
  const packsWithCourses = useMemo((): PackWithCourses[] => {
    const packs: PackWithCourses[] = [];

    availablePacks.forEach(pack => {
      const ownedCourses = favoriteCourses.filter(course => 
        pack.courses.includes(course.id)
      );
      
      // Vérifier si le pack complet a été acheté
      const isPackPurchased = purchasedItems.has(pack.id);
      
      // Fonction pour vérifier si un cours est débloqué globalement (via n'importe quel pack ou achat individuel)
      const isCourseUnlockedGlobally = (courseId: string) => {
        // 1. Achat individuel du cours
        if (purchasedItems.has(courseId) || purchasedItems.has(`course-${courseId}`)) {
          return true;
        }
        
        // 2. Vérifier si un pack contenant ce cours a été acheté
        return availablePacks.some(otherPack => 
          otherPack.courses.includes(courseId) && purchasedItems.has(otherPack.id)
        );
      };
      
      // 🔧 CORRECTION : Séparer les cours selon leur statut GLOBAL de manière mutuellement exclusive
      const unlockedCourses = ownedCourses.filter(course => 
        // Cours débloqué si : course.isOwned OU débloqué globalement
        course.isOwned || isCourseUnlockedGlobally(course.id)
      ).map(course => ({
        ...course,
        isOwned: true // Forcer isOwned à true pour les cours débloqués
      }));
      
      // Les favoris non débloqués sont EXCLUSIVEMENT ceux qui ne sont pas dans unlockedCourses
      const unlockedCourseIds = new Set(unlockedCourses.map(course => course.id));
      const favoritesNotUnlocked = ownedCourses.filter(course => 
        // Cours favori non débloqué SEULEMENT s'il n'est pas déjà dans les débloqués
        !unlockedCourseIds.has(course.id) && !course.isOwned && !isCourseUnlockedGlobally(course.id)
      );
      
      // 🎯 NOUVEAU : Cours non favoris ET non débloqués (état Panini gris) - EXCLUSIFS
      const allFavoriteCourseIds = new Set(favoriteCourses.map(course => course.id)); // ← GLOBAL, pas filtré par pack !
      const nonFavoriteNonUnlocked = pack.courses.filter(courseId => {
        // Pas dans les favoris ET pas débloqué globalement ET pas déjà dans une autre catégorie
        const isFavorite = allFavoriteCourseIds.has(courseId);
        const isUnlocked = isCourseUnlockedGlobally(courseId);
        return !isFavorite && !isUnlocked;
      });

      // 🎯 NOUVEAU : Cours non favoris MAIS débloqués (doivent être affichés aussi !)
      const nonFavoriteButUnlocked = pack.courses.filter(courseId => {
        const isFavorite = allFavoriteCourseIds.has(courseId);
        const isUnlocked = isCourseUnlockedGlobally(courseId);
        console.log(`🎯 DEBUG PACK ${pack.id}: Course ${courseId} - nonFavoriteButUnlocked check - isFavorite: ${isFavorite}, isUnlocked: ${isUnlocked}`);
        return !isFavorite && isUnlocked;
      }).map(courseId => {
        // Créer un objet cours pour ces cours non favoris mais débloqués
        const mockCourse = getCourseById(courseId);
        if (!mockCourse) return null;
        return {
          ...mockCourse,
          isOwned: true,
          isPrimary: false // Pas favori
        };
      }).filter(Boolean) as Course[];
      
      // Ancienne logique de missingCourses - maintenant vide car remplacée par nonFavoriteNonUnlocked
      const missingCourses: string[] = [];

      // 🎯 NOUVEAU : Afficher TOUS les packs pour montrer la collection complète (style album Panini)
      // Même les packs entièrement vides sont affichés pour donner une vue d'ensemble
      
      // Calculer combien de cours du pack sont réellement débloqués (globalement)
      const unlockedCoursesInPack = pack.courses.filter(courseId => 
        isCourseUnlockedGlobally(courseId)
      );
      
      // Si le pack est acheté directement, tous les cours sont considérés comme achetés
      // Sinon, compter les cours débloqués globalement
      const effectivePurchasedCount = isPackPurchased ? pack.courses.length : unlockedCoursesInPack.length;
      const isPackCompleted = isPackPurchased || unlockedCoursesInPack.length === pack.courses.length;
      
      // Calculer la progression moyenne des leçons dans les cours débloqués
      const totalLessonProgress = unlockedCourses.reduce((sum, course) => {
        return sum + calculateLessonProgress(course.id);
      }, 0);
      const averageLessonProgress = unlockedCourses.length > 0 ? 
        Math.round(totalLessonProgress / unlockedCourses.length) : 0;

      packs.push({
        id: pack.id,
        title: pack.title,
        description: pack.description,
        courses: pack.courses,
        ownedCourses,
        unlockedCourses,
        favoritesNotUnlocked,
        nonFavoriteNonUnlocked, // 🎯 NOUVEAU : Cours non favoris/non débloqués
        nonFavoriteButUnlocked, // 🎯 NOUVEAU : Cours non favoris mais débloqués
        missingCourses,
        // Completion basée sur les ACHATS (cours individuels + pack complet)
        completionRate: Math.round((effectivePurchasedCount / pack.courses.length) * 100),
        isCompleted: isPackCompleted,
        color: pack.color || 'blue',
        icon: pack.icon || '📚',
        lessonProgress: averageLessonProgress,
        purchasedCoursesCount: effectivePurchasedCount
      });
    });

    return packs;
  }, [favoriteCourses, availablePacks, progressData, purchasedItems]);

  // Cours favoris qui n'appartiennent à aucun pack
  const unpackagedCourses = useMemo(() => {
    const allPackCourseIds = new Set(
      availablePacks.flatMap(pack => pack.courses)
    );
    
    return favoriteCourses.filter(course => 
      !allPackCourseIds.has(course.id)
    );
  }, [favoriteCourses, availablePacks]);

  // Filtrer selon la recherche
  const filteredPacks = useMemo(() => {
    if (!searchQuery.trim()) return packsWithCourses;
    
    const query = searchQuery.toLowerCase();
    return packsWithCourses.filter(pack => 
      pack.title.toLowerCase().includes(query) ||
      pack.ownedCourses.some(course => 
        course.title.toLowerCase().includes(query)
      )
    );
  }, [packsWithCourses, searchQuery]);

  const filteredUnpackagedCourses = useMemo(() => {
    if (!searchQuery.trim()) return unpackagedCourses;
    
    const query = searchQuery.toLowerCase();
    return unpackagedCourses.filter(course => 
      course.title.toLowerCase().includes(query)
    );
  }, [unpackagedCourses, searchQuery]);

  const togglePackCollapse = (packId: string) => {
    const newCollapsed = new Set(collapsedPacks);
    if (newCollapsed.has(packId)) {
      newCollapsed.delete(packId);
    } else {
      newCollapsed.add(packId);
    }
    setCollapsedPacks(newCollapsed);
  };

  const getPackColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-500 to-indigo-600',
      purple: 'from-purple-500 to-pink-600',
      green: 'from-green-500 to-emerald-600',
      orange: 'from-orange-500 to-red-600',
      teal: 'from-teal-500 to-cyan-600'
    };
    return colorMap[color] || colorMap.blue;
  };

  const renderPlaceholderCard = (courseId: string, index: number) => (
    <motion.div
      key={`placeholder-${courseId}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-6 h-64 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 transition-colors"
    >
      <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-4">
        <Plus size={24} className="text-gray-400" />
      </div>
      <div className="text-center">
        <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
        <div className="w-16 h-3 bg-gray-200 rounded"></div>
      </div>
      <div className="absolute top-3 right-3 w-6 h-6 bg-gray-200 rounded-full"></div>
    </motion.div>
  );

  // Scroll handlers for each pack
  const scrollContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleScrollLeft = (packId: string) => {
    const container = scrollContainerRefs.current[packId];
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = (packId: string) => {
    const container = scrollContainerRefs.current[packId];
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Get all courses for a pack (combine all types)
  const getAllCoursesForPack = (pack: PackWithCourses) => {
    const allCourses: { course: Course | null; courseId: string; type: string }[] = [];
    
    // Add unlocked courses
    pack.unlockedCourses.forEach(course => {
      allCourses.push({ course, courseId: course.id, type: 'unlocked' });
    });
    
    // Add favorites not unlocked
    pack.favoritesNotUnlocked.forEach(course => {
      allCourses.push({ course, courseId: course.id, type: 'favorite' });
    });
    
    // Add non-favorite but unlocked
    pack.nonFavoriteButUnlocked.forEach(course => {
      allCourses.push({ course, courseId: course.id, type: 'nonFavoriteUnlocked' });
    });
    
    // Add non-favorite non-unlocked (panini style)
    pack.nonFavoriteNonUnlocked.forEach(courseId => {
      const mockCourse = getCourseById(courseId);
      allCourses.push({ course: mockCourse || null, courseId, type: 'panini' });
    });
    
    return allCourses;
  };

  return (
    <div className="space-y-12">
      {/* Mastery Programs - Style OnboardingPopup */}
      {filteredPacks.map((pack, packIndex) => {
        const allCourses = getAllCoursesForPack(pack);
        
        return (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: packIndex * 0.1 }}
            className="mb-12"
          >
            {/* Row Header - Style OnboardingPopup */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {pack.title}
                  <span className="text-gray-500 font-normal text-lg ml-3">
                    {pack.courses.length} cours
                  </span>
                </h2>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Bouton Tester mes connaissances */}
                <button
                  onClick={() => {
                    const subject = pack.title.toLowerCase().includes('physi') ? 'physics' 
                      : pack.title.toLowerCase().includes('math') ? 'math' 
                      : 'chemistry';
                    window.open(`/assessment/${subject}`, '_blank');
                  }}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors"
                >
                  Tester mes connaissances
                </button>
                
                {/* Navigation Arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleScrollLeft(pack.id)}
                    className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-200 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => handleScrollRight(pack.id)}
                    className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-200 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Course Cards Row - Horizontal Scroll */}
            <div 
              ref={(el) => { scrollContainerRefs.current[pack.id] = el; }}
              className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {allCourses.map(({ course, courseId, type }, index) => (
                <div
                  key={`${pack.id}-${courseId}-${index}`}
                  className="flex-shrink-0 w-52 group cursor-pointer"
                  onClick={() => {
                    if (course) {
                      onOpenCourse(course);
                    }
                  }}
                >
                  {/* Course Card - Style OnboardingPopup exact */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl overflow-hidden mb-3 transition-transform group-hover:scale-[1.02]">
                    {/* Course Title Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <h3 className="!text-white font-bold text-xl leading-tight tracking-tight mb-1">
                        {course?.title || courseId}
                      </h3>
                      <div className="w-8 h-0.5 bg-white/40 mb-2" />
                      <p className="!text-white/80 text-xs font-medium">
                        {course?.description?.slice(0, 40) || 'Cours disponible'}...
                      </p>
                    </div>

                    {/* Play Button on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl">
                        <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Cours individuels (hors pack) - même style */}
      {filteredUnpackagedCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: filteredPacks.length * 0.1 }}
          className="mb-12"
        >
          {/* Row Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Cours Individuels
                <span className="text-gray-500 font-normal text-lg ml-3">
                  {filteredUnpackagedCourses.length} cours
                </span>
              </h2>
            </div>
          </div>

          {/* Course Cards Row */}
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
            {filteredUnpackagedCourses.map((course, index) => (
              <div
                key={course.id}
                className="flex-shrink-0 w-52 group cursor-pointer"
                onClick={() => onOpenCourse(course)}
              >
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl overflow-hidden mb-3 transition-transform group-hover:scale-[1.02]">
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <h3 className="!text-white font-bold text-xl leading-tight tracking-tight mb-1">
                      {course.title}
                    </h3>
                    <div className="w-8 h-0.5 bg-white/40 mb-2" />
                    <p className="!text-white/80 text-xs font-medium">
                      {course.description?.slice(0, 40)}...
                    </p>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl">
                      <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* État vide - Recherche */}
      {searchQuery && filteredPacks.length === 0 && filteredUnpackagedCourses.length === 0 && favoriteCourses.length > 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Search className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-600">
            Essayez avec d'autres mots-clés
          </p>
        </div>
      )}
    </div>
  );
}
