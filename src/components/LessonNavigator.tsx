'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Lock, Clock } from 'lucide-react';
import { Lesson, Course } from '@/types';

interface LessonNavigatorProps {
  course: Course;
  lessons: Lesson[];
  currentLessonId: string;
  onLessonSelect: (lessonId: string) => void;
  purchasedItems: Set<string>;
}

export function LessonNavigator({
  course,
  lessons,
  currentLessonId,
  onLessonSelect,
  purchasedItems
}: LessonNavigatorProps) {
  
  const getLessonStatus = (lesson: Lesson) => {
    if (lesson.id === currentLessonId) return 'current';
    if (lesson.isCompleted) return 'completed';
    if (lesson.isOwned || purchasedItems.has(lesson.id)) return 'available';
    return 'locked';
  };

  const getLessonIcon = (status: string) => {
    switch (status) {
      case 'current':
        return <Play size={16} className="text-blue-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'available':
        return <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />;
      case 'locked':
        return <Lock size={16} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'current': return 'En cours';
      case 'completed': return 'Terminée';
      case 'available': return 'Disponible';
      case 'locked': return 'Verrouillée';
      default: return '';
    }
  };

  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header avec progression */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Navigation du cours</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={14} />
            <span>{lessons.length} leçons</span>
          </div>
        </div>
        
        {/* Progression globale */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progression globale</span>
            <span className="font-semibold text-gray-900">{progressPercentage}% terminé</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="text-xs text-gray-500">
            {completedLessons} sur {lessons.length} leçons terminées
          </div>
        </div>
      </div>

      {/* Liste des leçons */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-1">
          {lessons.map((lesson, index) => {
            const status = getLessonStatus(lesson);
            const isClickable = status !== 'locked';
            
            return (
              <motion.button
                key={lesson.id}
                onClick={() => isClickable && onLessonSelect(lesson.id)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.01 } : {}}
                whileTap={isClickable ? { scale: 0.99 } : {}}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  status === 'current'
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                    : status === 'completed'
                    ? 'bg-green-50 border border-green-100 hover:bg-green-100'
                    : status === 'available'
                    ? 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                    : 'bg-gray-25 border border-gray-50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Numéro et icône */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      status === 'current'
                        ? 'bg-blue-600 text-white'
                        : status === 'completed'
                        ? 'bg-green-600 text-white'
                        : status === 'available'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    {getLessonIcon(status)}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium text-sm truncate ${
                        status === 'current'
                          ? 'text-blue-900'
                          : status === 'completed'
                          ? 'text-green-900'
                          : status === 'available'
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}>
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          status === 'current'
                            ? 'bg-blue-100 text-blue-700'
                            : status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : status === 'available'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-gray-50 text-gray-400'
                        }`}>
                          {getStatusText(status)}
                        </span>
                      </div>
                    </div>
                    
                    {lesson.duration && (
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {lesson.duration} min
                        </span>
                        {lesson.progress !== undefined && lesson.progress > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-400 rounded-full transition-all"
                                style={{ width: `${lesson.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{lesson.progress}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}






