'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Course, Lesson, PlayerProgress, Badge } from '@/types';
import { GameCourseMap } from './GameCourseMap';
import { GameLessonView } from './GameLessonView';

interface GamifiedCourseViewerProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

// Données mock pour les leçons avec gamification
const createMockLessons = (courseId: string): Lesson[] => [
  {
    id: '1',
    courseId,
    title: 'Introduction aux concepts fondamentaux',
    description: 'Découvrez les bases essentielles de ce cours. Cette leçon vous permettra de comprendre les concepts de base nécessaires pour la suite du parcours.',
    duration: '15 min',
    type: 'video',
    order: 1,
    isCompleted: true,
    isAccessible: true,
    hasPreview: true,
    videoUrl: 'https://example.com/video1.mp4',
    documents: [],
    xpReward: 25,
    difficulty: 'easy',
    objectives: [
      'Comprendre les concepts de base',
      'Identifier les éléments clés',
      'Préparer les fondations pour la suite'
    ],
    prerequisites: ['Aucun prérequis']
  },
  {
    id: '2',
    courseId,
    title: 'Méthodes et techniques avancées',
    description: 'Approfondissez vos connaissances avec des techniques pratiques. Nous explorerons des méthodes avancées avec des exemples concrets.',
    duration: '22 min',
    type: 'video',
    order: 2,
    isCompleted: false,
    isAccessible: true,
    hasPreview: true,
    isInProgress: true,
    videoUrl: 'https://example.com/video2.mp4',
    documents: [],
    xpReward: 35,
    difficulty: 'medium',
    objectives: [
      'Maîtriser les techniques avancées',
      'Appliquer les méthodes dans des cas pratiques',
      'Développer une approche méthodique'
    ],
    prerequisites: ['Avoir terminé la leçon 1']
  },
  {
    id: '3',
    courseId,
    title: 'Exercices pratiques et applications',
    description: 'Mettez en pratique ce que vous avez appris. Cette leçon sera débloquée après avoir terminé les leçons précédentes.',
    duration: '18 min',
    type: 'exercise',
    order: 3,
    isCompleted: false,
    isAccessible: false,
    hasPreview: false,
    documents: [],
    xpReward: 40,
    difficulty: 'medium',
    objectives: [
      'Résoudre des exercices complexes',
      'Appliquer la théorie en pratique',
      'Valider ses acquis'
    ],
    prerequisites: ['Avoir terminé les leçons 1 et 2']
  },
  {
    id: '4',
    courseId,
    title: 'Quiz de validation des connaissances',
    description: 'Testez vos connaissances avec un quiz complet. Obtenez un score parfait pour débloquer le badge Expert !',
    duration: '12 min',
    type: 'quiz',
    order: 4,
    isCompleted: false,
    isAccessible: false,
    hasPreview: false,
    documents: [],
    xpReward: 50,
    difficulty: 'hard',
    objectives: [
      'Valider toutes les connaissances acquises',
      'Obtenir un score minimum de 80%',
      'Débloquer le certificat de réussite'
    ],
    prerequisites: ['Avoir terminé toutes les leçons précédentes']
  },
  {
    id: '5',
    courseId,
    title: 'Projet final et certification',
    description: 'Réalisez un projet complet qui synthétise tous les apprentissages du cours. Ce projet vous permettra d\'obtenir votre certification.',
    duration: '30 min',
    type: 'exercise',
    order: 5,
    isCompleted: false,
    isAccessible: false,
    hasPreview: false,
    documents: [],
    xpReward: 100,
    difficulty: 'hard',
    objectives: [
      'Synthétiser tous les apprentissages',
      'Créer un projet personnel',
      'Obtenir la certification du cours'
    ],
    prerequisites: ['Avoir réussi le quiz avec 80% minimum']
  }
];

// Données mock pour la progression du joueur
const createMockPlayerProgress = (): PlayerProgress => ({
  totalXP: 150,
  currentLevel: 2,
  xpToNextLevel: 50,
  badges: [
    {
      id: 'first-lesson',
      name: 'Premier pas',
      description: 'Première leçon terminée',
      icon: '🎯',
      rarity: 'common',
      unlockedAt: new Date(),
      criteria: { type: 'lessons_completed', target: 1 }
    }
  ],
  completedCourses: [],
  streak: 3
});

export function GamifiedCourseViewer({ course, isOpen, onClose }: GamifiedCourseViewerProps) {
  const [currentView, setCurrentView] = useState<'map' | 'lesson'>('map');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(createMockPlayerProgress());

  useEffect(() => {
    if (course) {
      const mockLessons = createMockLessons(course.id);
      setLessons(mockLessons);
    }
  }, [course]);

  if (!course) return null;

  const handleLessonStart = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('lesson');
    
    // Marquer la leçon comme en cours si pas encore commencée
    if (!lesson.isInProgress && !lesson.isCompleted) {
      setLessons(prev => prev.map(l => 
        l.id === lesson.id 
          ? { ...l, isInProgress: true }
          : l
      ));
    }
  };

  const handleLessonComplete = (xpGained: number) => {
    if (!selectedLesson) return;

    // Mettre à jour la progression du joueur
    setPlayerProgress(prev => ({
      ...prev,
      totalXP: prev.totalXP + xpGained
    }));

    // Marquer la leçon comme terminée et débloquer la suivante
    setLessons(prev => prev.map((lesson, index) => {
      if (lesson.id === selectedLesson.id) {
        return { ...lesson, isCompleted: true, isInProgress: false };
      }
      // Débloquer la leçon suivante
      if (lesson.order === selectedLesson.order + 1) {
        return { ...lesson, isAccessible: true };
      }
      return lesson;
    }));

    // Vérifier les nouveaux badges (logique simplifiée)
    const completedLessons = lessons.filter(l => l.isCompleted).length + 1;
    if (completedLessons === 3) {
      const newBadge: Badge = {
        id: 'three-lessons',
        name: 'Persévérant',
        description: 'Trois leçons terminées',
        icon: '🏃',
        rarity: 'rare',
        unlockedAt: new Date(),
        criteria: { type: 'lessons_completed', target: 3 }
      };
      
      setPlayerProgress(prev => ({
        ...prev,
        badges: [...prev.badges, newBadge]
      }));
    }
  };

  const handleBackToMap = () => {
    setCurrentView('map');
    setSelectedLesson(null);
  };

  const handleLessonProgress = (progress: number) => {
    // Mettre à jour la progression de la leçon
    console.log(`Progression de la leçon: ${progress}%`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-50 z-50"
        >
          <AnimatePresence mode="wait">
            {currentView === 'map' ? (
              <motion.div
                key="map"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full h-full"
              >
                <GameCourseMap
                  course={course}
                  lessons={lessons}
                  playerProgress={playerProgress}
                  onLessonStart={handleLessonStart}
                  onLessonComplete={handleLessonComplete}
                />
                
                {/* Bouton de fermeture */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-40 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    ✕
                  </motion.div>
                </button>
              </motion.div>
            ) : selectedLesson ? (
              <motion.div
                key="lesson"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full h-full"
              >
                <GameLessonView
                  lesson={selectedLesson}
                  playerProgress={playerProgress}
                  onBack={handleBackToMap}
                  onComplete={handleLessonComplete}
                  onProgress={handleLessonProgress}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
