'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Heart, Eye, Brain, Users, BookOpen, Play } from 'lucide-react';
import { getCourseById } from '@/lib/mock-data';
import { getCourseThumbnail } from '@/lib/course-thumbnails';
import { Course } from '@/types';
import { BuddyAvatars } from './BuddyAvatars';
import { getBuddiesForCourse } from '@/lib/buddy-data';

interface CourseCardPaniniEmptyProps {
  courseId: string;
  animationDelay?: number;
  onToggleFavorite?: (courseId: string, courseTitle?: string) => void;
  onPreview?: (courseId: string) => void;
  onTest?: (courseId: string) => void;
  onOpenCourse?: (course: Course) => void;
  onEnroll?: (courseId: string) => void;
}

export function CourseCardPaniniEmpty({ 
  courseId, 
  animationDelay = 0,
  onToggleFavorite,
  onPreview,
  onTest,
  onOpenCourse,
  onEnroll
}: CourseCardPaniniEmptyProps) {
  
  const [isHovered, setIsHovered] = useState(false);
  
  // Récupérer les données du cours pour afficher le nom
  const courseData = getCourseById(courseId);
  
  if (!courseData) {
    return null;
  }

  // Récupérer l'image du cours
  const courseThumbnail = getCourseThumbnail(courseData.title, courseData.faculty, courseData.id);

  // Générer un nombre d'étudiants cohérent basé sur l'ID du cours
  const generateStudentCount = (courseId: string) => {
    const hash = courseId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Générer un nombre entre 45 et 180 étudiants
    return Math.abs(hash) % 136 + 45;
  };

  const studentCount = generateStudentCount(courseId);

  // Génération du pattern de fallback grisé si pas d'image
  const generateGrayPattern = (title: string) => {
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const hue = Math.abs(hash) % 360;
    
    return `linear-gradient(135deg, 
      hsl(${hue}, 5%, 92%) 0%, 
      hsl(${hue}, 3%, 95%) 50%, 
      hsl(${hue}, 7%, 90%) 100%)`;
  };

  const fallbackPattern = generateGrayPattern(courseData.title);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(courseId, courseData.title);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(courseId);
  };

  const handleTestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTest?.(courseId);
  };

  const handleCourseClick = () => {
    if (courseData && onOpenCourse) {
      onOpenCourse(courseData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCourseClick}
      className="group relative overflow-hidden bg-gray-50/80 backdrop-blur-sm rounded-3xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300/80 hover:shadow-sm cursor-pointer"
      role="article"
      aria-label={`Cours: ${courseData.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCourseClick();
        }
      }}
    >
      {/* Header avec image réelle du cours */}
      <div className="relative h-52 overflow-hidden transition-all duration-300">
        {courseThumbnail ? (
          /* Image réelle du cours */
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-300"
            style={{
              backgroundImage: `url(${courseThumbnail})`
            }}
          >
            {/* Overlay subtil */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        ) : (
          /* Pattern de fallback si pas d'image */
          <div 
            className="w-full h-full transition-all duration-300"
            style={{
              background: fallbackPattern
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        )}

        {/* Cœur vide interactif - positionné en bas à droite du thumbnail */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={handleHeartClick}
            className="w-10 h-10 bg-white/90 hover:bg-white/95 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group/heart shadow-sm hover:shadow-purple-100"
            title="Ajouter aux favoris pour le suivre" // Tooltip plus descriptif
          >
            <Heart 
              size={18} 
              className="text-gray-500 group-hover/heart:text-red-500 transition-colors duration-200" 
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Avatars des buddies - Engagement social */}
        <BuddyAvatars 
          courseId={courseId}
          buddies={getBuddiesForCourse(courseId)}
          cardState="normal"
        />

      </div>

      {/* Contenu de la carte - identique aux cartes favoris non débloqués */}
      <div className="p-6 space-y-4">
        {/* Titre du cours */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 leading-tight hover:text-gray-800 transition-colors duration-200">
            {courseData.title}
          </h3>
        </div>

        {/* Informations du cours */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <BookOpen size={14} className="text-gray-400" />
            <span>{courseData.totalLessons || 0} leçons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} className="text-gray-400" />
            <span>{studentCount} étudiants</span>
          </div>
        </div>

            {/* Boutons - Je me teste + Commencer */}
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={handleTestClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-1 focus:outline-none focus:ring-4 focus:ring-gray-500/20"
              >
                <Brain size={14} />
                <span className="text-xs">Je me teste</span>
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCourse?.(courseData as any);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1 focus:outline-none focus:ring-4 focus:ring-blue-600/20 hover:shadow-xl hover:from-blue-700 hover:to-blue-800"
              >
                <Play size={14} />
                <span className="text-xs">Commencer</span>
              </motion.button>
            </div>
      </div>

    </motion.div>
  );
}
