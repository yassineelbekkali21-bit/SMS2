'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Star, 
  Trophy,
  Sparkles,
  Plus,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { Course } from '@/types';
import { CourseCard } from './CourseCard';
import { getCoursePacks } from '@/lib/mock-data';

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
  missingCourses: string[];
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
      
      const missingCourses = pack.courses.filter(courseId => 
        !favoriteCourses.some(course => course.id === courseId)
      );

      if (ownedCourses.length > 0) {
        // Calculer combien de cours du pack sont réellement achetés
        const purchasedCoursesInPack = pack.courses.filter(courseId => 
          purchasedItems.has(courseId)
        );
        
        // Calculer la progression moyenne des leçons dans les cours débloqués
        const totalLessonProgress = ownedCourses.reduce((sum, course) => {
          return sum + calculateLessonProgress(course.id);
        }, 0);
        const averageLessonProgress = ownedCourses.length > 0 ? 
          Math.round(totalLessonProgress / ownedCourses.length) : 0;

        packs.push({
          id: pack.id,
          title: pack.title,
          description: pack.description,
          courses: pack.courses,
          ownedCourses,
          missingCourses,
          // Completion basée sur les ACHATS, pas les favoris
          completionRate: Math.round((purchasedCoursesInPack.length / pack.courses.length) * 100),
          isCompleted: purchasedCoursesInPack.length === pack.courses.length,
          color: pack.color || 'blue',
          icon: pack.icon || '📚',
          lessonProgress: averageLessonProgress,
          purchasedCoursesCount: purchasedCoursesInPack.length
        });
      }
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
            <p className="text-gray-500 text-sm">
              {favoriteCourses.length} cours • {packsWithCourses.length} packs
            </p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher dans mes favoris..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
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
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => togglePackCollapse(pack.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getPackColorClasses(pack.color)} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                  {pack.icon}
                </div>
                
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">{pack.title}</h3>
                    {pack.isCompleted && (
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <Trophy size={12} />
                        Pack complété
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{pack.description}</p>
                  <div className="mt-3">
                    {/* Informations de progression */}
                    <div className="flex items-center gap-6">
                      {/* Ratio des cours débloqués */}
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-gray-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">
                          {pack.purchasedCoursesCount}/{pack.courses.length} cours débloqués
                        </span>
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
                          <span className="text-sm font-medium text-green-700">
                            {pack.lessonProgress}% des leçons terminées
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
                    <Sparkles className="text-yellow-500" size={20} />
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Bouton CTA pour compléter le pack avec hint subtil */}
                  {!pack.isCompleted && (
                    <div className="flex flex-col items-end gap-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompletePack?.(pack.id);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-slate-600"
                      >
                        Compléter le pack
                      </motion.button>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs text-gray-500 flex items-center gap-1"
                      >
                        <span>💡</span>
                        <span>Bonus offert avec recharge</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Cours possédés */}
                  {pack.ownedCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
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
                        isUnlocked={course.isOwned}
                        {...getStudyRoomProps(course)}
                      />
                    </motion.div>
                  ))}
                  
                  {/* Emplacements vides (style Panini) */}
                  {pack.missingCourses.map((courseId, index) => 
                    renderPlaceholderCard(courseId, pack.ownedCourses.length + index)
                  )}
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
                  <Package size={20} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredUnpackagedCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
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
                        isUnlocked={course.isOwned}
                        {...getStudyRoomProps(course)}
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
      {favoriteCourses.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Star className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun cours favori
          </h3>
          <p className="text-gray-600 mb-4">
            Ajoutez des cours à vos favoris pour commencer votre collection
          </p>
        </div>
      )}

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
