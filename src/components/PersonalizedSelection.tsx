'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Star,
  TrendingUp,
  Brain
} from 'lucide-react';
import { Course } from '@/types';
import { SuggestedCourseCard } from './SuggestedCourseCard';

interface PersonalizedSelectionProps {
  suggestedCourses: Array<{
    course: Course;
    enrolledStudents: number;
    reason: string;
  }>;
  facultyName: string;
  totalStudents: number;
  onUnlockCourse: (course: Course) => void;
  onPreviewCourse: (course: Course) => void;
  onSelectCourse: (course: Course) => void; // Nouvelle prop pour déclencher les offres spéciales
  onToggleFavorite?: (courseId: string) => void;
  canAfford: (cost: number) => boolean;
  unlockedCourses: string[];
}

export function PersonalizedSelection({
  suggestedCourses,
  facultyName,
  totalStudents,
  onUnlockCourse,
  onPreviewCourse,
  onSelectCourse,
  onToggleFavorite,
  canAfford,
  unlockedCourses
}: PersonalizedSelectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Traduction des raisons de recommandation
  const translateReason = (reason: string) => {
    const translations = {
      'faculty_popular': 'Populaire dans votre faculté',
      'similar_students': 'Choisi par des étudiants similaires',
      'prerequisite': 'Prérequis recommandé',
      'continuation': 'Suite logique de vos cours'
    };
    return translations[reason as keyof typeof translations] || 'Recommandé';
  };

  // Styles pour les raisons de recommandation
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

  return (
    <section className="mb-8">
      {/* Header du bloc */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Continuez votre parcours d'excellence
              </h2>
              <p className="text-gray-600 text-sm">
                Cours recommandés pour approfondir vos acquis • Basé sur {totalStudents.toLocaleString()} étudiants de {facultyName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <TrendingUp size={14} />
                <span>{suggestedCourses.length} suggestions</span>
              </div>
              <div className="text-xs text-gray-500">
                Popularité faculté
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronDown size={20} className="text-gray-400" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contenu des suggestions */}
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pt-4">
          {suggestedCourses.map((suggestion, index) => (
            <motion.div
              key={suggestion.course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative group mt-3"
            >
              {/* Étiquettes supprimées */}

              <div 
                className="h-full cursor-pointer transform transition-all duration-200 hover:scale-105"
                onClick={() => onSelectCourse(suggestion.course)}
              >
                <SuggestedCourseCard
                  course={suggestion.course}
                  enrolledStudents={suggestion.enrolledStudents}
                  reason={suggestion.reason}
                  onUnlock={onUnlockCourse}
                  onPreview={onPreviewCourse}
                  onToggleFavorite={onToggleFavorite}
                  canAfford={canAfford(suggestion.course.creditCost || 1)}
                  isUnlocked={unlockedCourses.includes(suggestion.course.id)}
                />
              </div>

            </motion.div>
          ))}
        </div>

        {/* Message de continuité */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Brain className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-900">Approfondissez vos connaissances</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ces cours complètent parfaitement votre formation actuelle et renforcent vos bases. 
              Cliquez sur un cours pour découvrir nos offres spéciales et construire votre expertise.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>🎯 Personnalisé pour vous</span>
              <span>•</span>
              <span>📈 Progression optimisée</span>
              <span>•</span>
              <span>🏆 Vers l'excellence</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
