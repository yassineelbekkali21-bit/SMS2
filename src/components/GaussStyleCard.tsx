'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';
import { getCourseThumbnail } from '@/lib/course-thumbnails';
import { 
  BookOpen,
  Users,
  Clock,
  Eye,
  TestTube,
  Brain,
  Heart,
  Play,
  CheckCircle
} from 'lucide-react';

interface GaussStyleCardProps {
  // Contenu
  title: string;
  description: string;
  faculty?: string;
  
  // Métadonnées
  studentsCount?: number;
  duration?: string;
  lessonCount?: number;
  price?: number;
  
  // États
  isOwned?: boolean;
  courseId?: string; // ID du cours pour les favoris
  
  // Actions
  onPreview?: () => void;
  onTest?: () => void;
  onAccess?: () => void;
  onClick?: () => void; // Clic sur la carte entière
  
  // Style
  className?: string;
  thumbnailImage?: string; // Image de fond personnalisée pour le thumbnail
}


export function GaussStyleCard({
  title,
  description,
  faculty,
  studentsCount,
  duration,
  lessonCount,
  price,
  isOwned = false,
  courseId,
  onPreview,
  onTest,
  onAccess,
  onClick,
  className = "",
  thumbnailImage
}: GaussStyleCardProps) {
  // Hook pour gérer les favoris
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Détection automatique de l'illustration selon la matière
  const autoThumbnail = getCourseThumbnail(title, faculty, courseId);
  const finalThumbnail = thumbnailImage || autoThumbnail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Header avec icône - Style selon l'image */}
      <div 
        className={`relative h-48 flex flex-col items-center justify-center ${
          finalThumbnail 
            ? 'bg-cover bg-center bg-no-repeat' 
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        }`}
        style={finalThumbnail ? { backgroundImage: `url(${finalThumbnail})` } : {}}
      >
        {/* Overlay pour améliorer la lisibilité si image de fond */}
        {finalThumbnail && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
        )}
        
        {/* Icône et nom de l'école - Seulement si pas d'image personnalisée */}
        {!finalThumbnail && (
          <>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 relative z-10">
              <BookOpen className="text-blue-600" size={20} />
            </div>
            
            <div className="text-sm font-medium text-center relative z-10 text-gray-600">
              Solvay Brussels School
            </div>
          </>
        )}
        
          {/* Cœur favori en bas à droite du thumbnail */}
          {courseId && (
            <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Empêche la propagation vers le clic de la carte
              toggleFavorite(courseId, title);
            }}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md hover:shadow-lg z-10 cursor-pointer"
              style={{ zIndex: 10 }}
              title={isFavorite(courseId) ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart 
                size={16} 
                className={isFavorite(courseId) ? 'text-purple-600 fill-current' : 'text-gray-400 hover:text-purple-400'} 
              />
            </button>
          )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Titre */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Métadonnées - Style selon l'image */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          {studentsCount && (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              <Users size={12} />
              <span>{studentsCount.toLocaleString()} étudiants</span>
            </div>
          )}
          
          {lessonCount && (
            <div className="flex items-center gap-1 text-gray-600">
              <BookOpen size={14} />
              <span>{lessonCount} leçons</span>
            </div>
          )}
          
          {/* Suppression du niveau de difficulté selon les instructions */}
        </div>


        {/* Actions - Style Loi de Gauss exact (boutons de même largeur) */}
        <div className="flex gap-3">
          {isOwned ? (
            // Contenu possédé
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccess?.();
              }}
              className="flex-1 bg-green-50 text-green-700 py-3 px-4 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
            >
              <Play size={16} />
              Accéder
            </button>
          ) : (
            // Contenu non possédé - Boutons de même largeur
            <>
              {onPreview && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Eye size={16} />
                  Aperçu
                </button>
              )}
              
              {onTest && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTest();
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-800 to-black text-white py-3 px-4 rounded-xl font-medium hover:from-gray-900 hover:to-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <TestTube size={16} />
                  Se tester
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </motion.div>
  );
}
