'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
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
  Users
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

  return (
    <div className="space-y-8">
      {/* Barre de recherche locale */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="text-gray-400" size={20} />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mes Cours Favoris</h2>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher dans mes favoris..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cursor-target pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-80"
          />
        </div>
      </div>

      {/* Packs avec cours */}
      {filteredPacks.map((pack, packIndex) => (
        <motion.div
          key={pack.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: packIndex * 0.1 }}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* En-tête du pack */}
          <div 
            className="cursor-target p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => togglePackCollapse(pack.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">{pack.title}</h3>
                  </div>
                  <div className="mt-2">
                    {/* Informations de progression */}
                    <div className="flex items-center gap-6">
                      {/* Ratio des cours débloqués */}
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-gray-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-600">
                          {pack.purchasedCoursesCount}/{pack.unlockedCourses.length + pack.favoritesNotUnlocked.length + pack.nonFavoriteNonUnlocked.length + pack.nonFavoriteButUnlocked.length} cours débloqués
                        </span>
                      </div>
                      
                      {/* Avatars des buddies */}
                      <div className="flex items-center -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border border-white shadow-sm flex items-center justify-center">
                          <span className="text-xs font-medium text-white">M</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-600 border border-white shadow-sm flex items-center justify-center">
                          <span className="text-xs font-medium text-white">A</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border border-white shadow-sm flex items-center justify-center">
                          <span className="text-xs font-medium text-white">L</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 border border-white shadow-sm flex items-center justify-center">
                          <span className="text-xs font-medium">+2</span>
                        </div>
                      </div>
                      
                      {/* Progression des leçons lues avec barre */}
                      {pack.ownedCourses.length > 0 && (
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-400 to-green-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${pack.lessonProgress}%` }}
                              transition={{ duration: 1, delay: 0.7 }}
                            />
                          </div>
                          <span className="text-xs font-medium text-green-600">
                            {pack.lessonProgress > 0 
                              ? `${pack.lessonProgress}% des leçons terminées`
                              : ""
                            }
                          </span>
                        </div>
                      )}
                    </div>


                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {pack.isCompleted && (
                    <div className="flex items-center gap-1.5 text-amber-600">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="text-sm font-semibold">Pack complété</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Bouton CTA pour compléter le pack - N'apparaît QUE si le pack est replié */}
                  {!pack.isCompleted && collapsedPacks.has(pack.id) && (
                    <div className="flex flex-col items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompletePack?.(pack.id);
                        }}
                        className="cursor-target px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-blue-500"
                      >
                        Compléter pack
                      </motion.button>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs text-gray-500 flex items-center justify-center gap-1"
                      >
                        <span>💡</span>
                        <span>Bonus offert</span>
                      </motion.p>
                    </div>
                  )}
                  
                  {collapsedPacks.has(pack.id) ? (
                    <ChevronDown className="text-gray-400" size={20} />
                  ) : (
                    <ChevronUp className="text-gray-400" size={20} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contenu du pack (cours) */}
          <AnimatePresence>
            {!collapsedPacks.has(pack.id) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                  {/* 1. Les 2 premiers cours débloqués */}
                  {pack.unlockedCourses.slice(0, 2).map((course, index) => (
                    <motion.div
                      key={`${pack.id}-unlocked-${course.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CourseCard 
                        course={course}
                        progress={progressData.find(p => p.courseId === course.id)}
                        isDraggable={false}
                        onToggleFavorite={onToggleFavorite}
                        onPreview={onPreview}
                        onEnroll={onEnroll}
                        onOpenCourse={onOpenCourse}
                        onOpenStaircaseView={onOpenStaircaseView}
                        canAfford={true}
                        isUnlocked={true}
                        purchasedItems={purchasedItems}
                        {...getStudyRoomProps(course)}
                      />
                    </motion.div>
                  ))}

                  {/* 1.5. Card CTA "Compléter pack" - TOUJOURS VISIBLE - Position 3-4 de la première ligne */}
                  {!pack.isCompleted && (() => {
                    // 🎯 Logique de titre dynamique contextuel
                    const unlockedCount = pack.unlockedCourses.length;
                    const totalCount = pack.courses.length;
                    const remainingCount = totalCount - unlockedCount;
                    const completionPercentage = Math.round((unlockedCount / totalCount) * 100);
                    
                    let dynamicTitle = '';
                    let dynamicSubtitle = '';
                    
                    const packName = pack.title; // Nom dynamique du pack
                    
                    if (unlockedCount === 0) {
                      // Aucun cours débloqué
                      dynamicTitle = `Débloquez ${totalCount} cours pour valider le pack.`;
                      dynamicSubtitle = `Commencez votre pack <strong class="font-semibold text-gray-900">${packName}</strong> dès maintenant.`;
                    } else if (completionPercentage >= 75) {
                      // Presque terminé (75%+)
                      dynamicTitle = remainingCount === 1 
                        ? "Plus qu'un cours avant la validation complète !"
                        : `Plus que ${remainingCount} cours avant la validation complète !`;
                      dynamicSubtitle = `Vous touchez au but ! Terminez votre pack <strong class="font-semibold text-gray-900">${packName}</strong>.`;
                    } else if (completionPercentage >= 50) {
                      // À mi-chemin (50-74%)
                      dynamicTitle = `Plus que ${remainingCount} cours pour valider le pack.`;
                      dynamicSubtitle = `Vous êtes à mi-parcours ! Continuez votre pack <strong class="font-semibold text-gray-900">${packName}</strong>.`;
                    } else {
                      // Début de parcours (<50%)
                      dynamicTitle = `${remainingCount} cours restants pour valider le pack.`;
                      dynamicSubtitle = `Poursuivez votre pack <strong class="font-semibold text-gray-900">${packName}</strong> et débloquez vos avantages.`;
                    }
                    
                    return (
                      <motion.div
                        key={`${pack.id}-cta-card`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="col-span-1 md:col-span-2"
                      >
                        <motion.div
                          whileHover={{ y: -2, transition: { duration: 0.3, ease: "easeInOut" } }}
                          className="relative h-full flex flex-col overflow-hidden group"
                          style={{
                            background: 'linear-gradient(135deg, #F8F9FB 0%, #EEF1F7 100%)',
                            borderRadius: '20px',
                            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.04)'
                          }}
                        >
                          {/* Glassmorphism overlay */}
                          <div className="absolute inset-0" style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderRadius: '20px'
                          }} />
                          
                          {/* Subtle border */}
                          <div className="absolute inset-0 rounded-[20px]" style={{
                            border: '1px solid rgba(255,255,255,0.5)',
                            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8)'
                          }} />
                          
                          {/* Trophy icon - ultra subtil en arrière-plan (opacity 0.08) */}
                          <div className="absolute bottom-6 right-6 pointer-events-none" style={{ opacity: 0.08 }}>
                            <Trophy className="w-32 h-32 text-gray-900" strokeWidth={1} />
                          </div>
                          
                          <div className="relative p-8 flex flex-col h-full">
                            {/* Header dynamique et contextuel */}
                            <div className="mb-5">
                              <h3 className="text-xl font-semibold text-gray-900 tracking-tight leading-tight mb-3" style={{ 
                                fontFamily: 'Inter, -apple-system, SF Pro Display, system-ui, sans-serif', 
                                fontWeight: 600,
                                letterSpacing: '-0.02em'
                              }}>
                                {dynamicTitle}
                              </h3>
                              <p 
                                className="text-sm text-gray-600 leading-relaxed" 
                                style={{ 
                                  fontFamily: 'Inter, -apple-system, system-ui, sans-serif', 
                                  fontWeight: 400
                                }}
                                dangerouslySetInnerHTML={{ __html: dynamicSubtitle }}
                              />
                          </div>
                          
                          {/* Progress section compacte */}
                          <div className="mb-6 space-y-4">
                            {/* Barre de progression avec pourcentage à droite */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-500 font-medium">{pack.unlockedCourses.length} complétés</span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500 font-medium">{pack.courses.length - pack.unlockedCourses.length} restant{pack.courses.length - pack.unlockedCourses.length > 1 ? 's' : ''}</span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500 font-medium">≈ {Math.ceil((pack.courses.length - pack.unlockedCourses.length) * 0.75)} h</span>
                                </div>
                                <motion.span 
                                  className="text-sm font-semibold text-gray-900 tabular-nums"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  {Math.round((pack.unlockedCourses.length / pack.courses.length) * 100)}%
                                </motion.span>
                              </div>
                              
                              {/* Barre de progression noire */}
                              <div className="relative w-full h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(pack.unlockedCourses.length / pack.courses.length) * 100}%` }}
                                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                  className="absolute top-0 left-0 h-full rounded-full bg-gray-900"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Récompenses - entre progress bar et CTA */}
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="text-center text-sm text-gray-800 leading-relaxed font-medium px-2 mb-6"
                            style={{ 
                              fontFamily: 'Inter, system-ui, sans-serif'
                            }}
                          >
                            Débloquez les <strong className="font-semibold text-gray-900">slides PDF</strong> de toutes les leçons du pack, votre <strong className="font-semibold text-gray-900">badge</strong>, vos <strong className="font-semibold text-gray-900">100 XP</strong> et <strong className="font-semibold text-gray-900">100 €</strong> sur votre prochaine recharge.
                          </motion.p>

                          {/* CTA Principal - Focus maximum */}
                          <div className="mt-auto">
                            <motion.button
                              whileHover={{ 
                                y: -2,
                                boxShadow: '0 16px 40px rgba(37, 99, 235, 0.4), 0 6px 20px rgba(37, 99, 235, 0.25)',
                                transition: { duration: 0.3, ease: "easeOut" }
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onCompletePack?.(pack.id);
                              }}
                              className="cursor-target w-full relative overflow-hidden group/btn"
                              style={{
                                padding: '16px 28px',
                                background: 'linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)',
                                borderRadius: '14px',
                                color: '#FFFFFF',
                                fontSize: '15px',
                                fontWeight: 600,
                                fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
                                boxShadow: '0 6px 24px rgba(37, 99, 235, 0.3)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                              }}
                            >
                              {/* Glow bleu au survol */}
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                              
                              <span className="relative z-10">Compléter mon pack maintenant</span>
                              <motion.span
                                className="relative z-10"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                style={{ fontSize: '18px', lineHeight: 1 }}
                              >
                                →
                              </motion.span>
                            </motion.button>
                          </div>

                          {/* Zone inférieure compacte */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 pt-5 border-t border-gray-200/60"
                          >
                            {/* Social proof discret */}
                            <p className="text-[10px] text-gray-400 leading-relaxed" style={{ 
                              fontFamily: 'Inter, system-ui, sans-serif'
                            }}>
                              142 étudiants ont déjà validé ce pack.
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                    );
                  }
                  )()}

                  {/* 1. Reste des cours débloqués (à partir du 3ème) */}
                  {pack.unlockedCourses.slice(2).map((course, index) => (
                    <motion.div
                      key={`${pack.id}-unlocked-${course.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index + 2) * 0.1 }}
                    >
                      <CourseCard 
                        course={course}
                        progress={progressData.find(p => p.courseId === course.id)}
                        isDraggable={false}
                        onToggleFavorite={onToggleFavorite}
                        onPreview={onPreview}
                        onEnroll={onEnroll}
                        onOpenCourse={onOpenCourse}
                        onOpenStaircaseView={onOpenStaircaseView}
                        canAfford={true}
                        isUnlocked={true}
                        purchasedItems={purchasedItems}
                        {...getStudyRoomProps(course)}
                      />
                    </motion.div>
                  ))}
                  
                  {/* 2. Favoris non débloqués - PRIORITÉ 2 */}
                  {pack.favoritesNotUnlocked.map((course, index) => (
                    <motion.div
                      key={`${pack.id}-favorite-${course.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (pack.unlockedCourses.length + index) * 0.1 }}
                    >
                      <CourseCard 
                        course={course}
                        progress={progressData.find(p => p.courseId === course.id)}
                        isDraggable={false}
                        onToggleFavorite={onToggleFavorite}
                        onPreview={onPreview}
                        onEnroll={onEnroll}
                        onOpenCourse={onOpenCourse}
                        onOpenStaircaseView={onOpenStaircaseView}
                        canAfford={true}
                        isUnlocked={false}
                        purchasedItems={purchasedItems}
                        {...getStudyRoomProps(course)}
                      />
                    </motion.div>
                  ))}

                  {/* 2.5. Non favoris mais débloqués - PRIORITÉ 2.5 */}
                  {pack.nonFavoriteButUnlocked.map((course, index) => (
                    <motion.div
                      key={`${pack.id}-non-favorite-unlocked-${course.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (pack.unlockedCourses.length + pack.favoritesNotUnlocked.length + index) * 0.1 }}
                    >
                      <CourseCard 
                        course={course}
                        progress={progressData.find(p => p.courseId === course.id)}
                        isDraggable={false}
                        onToggleFavorite={onToggleFavorite}
                        onPreview={onPreview}
                        onEnroll={onEnroll}
                        onOpenCourse={onOpenCourse}
                        onOpenStaircaseView={onOpenStaircaseView}
                        canAfford={true}
                        isUnlocked={true}
                        purchasedItems={purchasedItems}
                        {...getStudyRoomProps(course)}
                      />
                    </motion.div>
                  ))}
                  
                  {/* 3. Cours non favoris/non débloqués (état Panini gris) - PRIORITÉ 3 */}
                  {pack.nonFavoriteNonUnlocked.map((courseId, index) => {
                    return (
                    <motion.div
                      key={`${pack.id}-panini-empty-${courseId}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (pack.unlockedCourses.length + pack.favoritesNotUnlocked.length + index) * 0.1 }}
                    >
                      <CourseCardPaniniEmpty 
                        courseId={courseId}
                        animationDelay={(pack.unlockedCourses.length + pack.favoritesNotUnlocked.length + index) * 0.1}
                        onToggleFavorite={onToggleFavorite}
                        onPreview={onPreview}
                        onTest={(courseId) => {
                          // Pour l'instant, on peut rediriger vers le preview ou implémenter une modale de test
                          console.log('Test course:', courseId);
                          onPreview(courseId); // Temporaire
                        }}
                        onOpenCourse={onOpenCourse}
                      />
                    </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Cours individuels (hors pack) */}
      {filteredUnpackagedCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: filteredPacks.length * 0.1 }}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* En-tête du bloc Cours Individuels */}
          <div 
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsIndividualCoursesCollapsed(!isIndividualCoursesCollapsed)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center text-white">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Cours Individuels</h3>
                  <p className="text-gray-600 text-sm">
                    {filteredUnpackagedCourses.length} cours favoris hors collection
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {isIndividualCoursesCollapsed ? (
                  <ChevronDown className="text-gray-400" size={20} />
                ) : (
                  <ChevronUp className="text-gray-400" size={20} />
                )}
              </div>
            </div>
          </div>

          {/* Contenu des cours individuels */}
          <AnimatePresence>
            {!isIndividualCoursesCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                  {filteredUnpackagedCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SuggestedCourseCard 
                        course={course}
                        enrolledStudents={Math.floor(Math.random() * 200) + 50}
                        reason="Cours favori"
                        onUnlock={onEnroll}
                        onPreview={onPreview}
                        onToggleFavorite={onToggleFavorite}
                        onClick={onOpenCourse}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* État vide */}
      {/* Résultats de recherche vides */}
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
