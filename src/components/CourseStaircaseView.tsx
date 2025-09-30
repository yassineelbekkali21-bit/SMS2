'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft, Play, CheckCircle, Lock, BookOpen } from 'lucide-react';
import { StaircaseProgress, ProgressStep } from './StaircaseProgress';
import { Course, Lesson } from '@/types';
import { getLessonsForCourse } from '@/lib/mock-data';
import BackgroundSelector from './BackgroundSelector';

interface CourseStaircaseViewProps {
  course: Course;
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
  onClose: () => void;
  purchasedItems?: Set<string>;
}

/**
 * Composant qui transforme les leçons d'un cours en escalier académique 3D
 * Alternative moderne au MarioMap traditionnel
 */
export const CourseStaircaseView: React.FC<CourseStaircaseViewProps> = ({
  course,
  lessons: providedLessons,
  onSelectLesson,
  onClose,
  purchasedItems = new Set()
}) => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>('default');

  // Utiliser les leçons fournies ou générer des mock data
  const lessons = providedLessons.length > 0 ? providedLessons : getLessonsForCourse(course.id);

  // Transformation des leçons en étapes pour le composant StaircaseProgress
  const steps: ProgressStep[] = lessons.map((lesson, index) => {
    // Détermination de l'icône basée sur le type de leçon
    let icon: string;
    if (lesson.type === 'video') {
      icon = '🎥';
    } else if (lesson.type === 'quiz') {
      icon = '❓';
    } else if (lesson.type === 'exercise') {
      icon = '💪';
    } else if (lesson.type === 'reading') {
      icon = '📖';
    } else {
      icon = '📚';
    }

    // Détermination du statut basé sur la progression et les achats
    let status: 'completed' | 'current' | 'locked';
    const isLessonPurchased = purchasedItems.has(`lesson-${lesson.id}`);
        const isCoursePurchased = purchasedItems.has(`course-${course.id}`); // course.id contient déjà le préfixe course-
    const isPackPurchased = purchasedItems.has(`pack-${course.packId || 'any'}`);
    
    if (lesson.completed) {
      status = 'completed';
    } else if (lesson.unlocked || lesson.isOwned || isLessonPurchased || isCoursePurchased || isPackPurchased) {
      status = 'current';
    } else {
      status = 'locked';
    }

    return {
      icon,
      title: lesson.title,
      description: `${lesson.type === 'video' ? 'Vidéo' : 
                   lesson.type === 'quiz' ? 'Quiz' : 
                   lesson.type === 'exercise' ? 'Exercice' : 'Lecture'} - 
                   ${lesson.duration} min ${lesson.completed ? '✓' : (lesson.unlocked || lesson.isOwned || isLessonPurchased || isCoursePurchased || isPackPurchased) ? '▶' : '🔒'}`,
      status
    };
  });

  const handleStepClick = (stepIndex: number, step: ProgressStep) => {
    const lesson = lessons[stepIndex];
    
    // Vérifier si la leçon est débloquée (via unlock original ou achat)
    const isLessonPurchased = purchasedItems.has(`lesson-${lesson.id}`);
        const isCoursePurchased = purchasedItems.has(`course-${course.id}`); // course.id contient déjà le préfixe course-
    const isPackPurchased = purchasedItems.has(`pack-${course.packId || 'any'}`);
    
    if (lesson.unlocked || lesson.completed || lesson.isOwned || isLessonPurchased || isCoursePurchased || isPackPurchased) {
      setSelectedLessonIndex(stepIndex);
      onSelectLesson(lesson);
    } else {
      // Optionnel : afficher un message ou une modal pour débloquer
      console.log('Leçon verrouillée:', lesson.title);
    }
  };

  // Calcul des statistiques du cours
  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const totalDuration = lessons.reduce((acc, lesson) => acc + lesson.duration, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col"
    >
        {/* En-tête du cours */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-blue-100 text-sm">{course.category}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Statistiques du cours */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm opacity-90">Progression</div>
              <div className="text-xl font-bold">{progressPercent}%</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm opacity-90">Leçons complétées</div>
              <div className="text-xl font-bold">{completedLessons}/{totalLessons}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm opacity-90">Durée totale</div>
              <div className="text-xl font-bold">{Math.floor(totalDuration / 60)}h {totalDuration % 60}min</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm opacity-90">Difficulté</div>
              <div className="text-xl font-bold capitalize">{course.difficulty}</div>
            </div>
          </div>
        </div>

        {/* Contenu principal avec l'escalier */}
        <div className="flex-1 overflow-hidden relative">
          {/* Arrière-plan dynamique */}
          {selectedBackground !== 'default' ? (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(/course-backgrounds/${selectedBackground}.svg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
          )}
          
          {/* Overlay pour améliorer la lisibilité */}
          {selectedBackground !== 'default' && (
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[0.5px]" />
          )}
          
          {/* Sélecteur d'arrière-plan */}
          <BackgroundSelector 
            selectedBackground={selectedBackground}
            onBackgroundChange={setSelectedBackground}
          />
          
          {/* Contenu de l'escalier */}
          <div className="relative z-10 h-full">
            {totalLessons > 0 ? (
              <StaircaseProgress
                steps={steps}
                onStepClick={handleStepClick}
                className="w-full h-full"
                height="h-full"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Aucune leçon disponible</p>
                  <p className="text-sm">Ce cours sera bientôt disponible</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Barre d'actions en bas */}
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Cliquez sur une étape pour commencer la leçon
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Indicateurs de statut */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>Terminé</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play size={14} className="text-blue-500" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock size={14} className="text-gray-400" />
                  <span>Verrouillé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </motion.div>
  );
};

export default CourseStaircaseView;
