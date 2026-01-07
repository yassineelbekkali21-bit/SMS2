'use client';

import React, { useState } from 'react';
import { LearningTrackOverview } from '@/components/LearningTrackOverview';
import { Course, Lesson } from '@/types';

// Données de démonstration pour un cours complet
const demoCourse: Course = {
  id: 'demo-electrostatique',
  title: 'Électrostatique - Maîtrise Complète',
  description: 'Un parcours complet pour maîtriser les fondamentaux de l\'électrostatique. De la loi de Coulomb aux applications pratiques, chaque leçon te rapproche de la maîtrise totale du sujet.',
  faculty: 'Physique',
  year: 'L1',
  totalLessons: 12,
  completedLessons: 3,
  duration: '4h 30min',
  isOwned: true,
  isPrimary: true,
  progress: 25,
  price: 149,
  creditCost: 150,
  thumbnail: '/courses/electrostatique.jpg',
  previewAvailable: true,
  previewDuration: '10 minutes',
  tags: ['Physique', 'Électricité', 'Fondamentaux'],
  difficulty: 'intermediate'
};

const demoLessons: Lesson[] = [
  {
    id: 'lesson-1',
    courseId: 'demo-electrostatique',
    title: 'Introduction à l\'électrostatique',
    description: 'Découverte des concepts fondamentaux et du vocabulaire essentiel.',
    duration: 18,
    price: 15,
    order: 1,
    isOwned: true,
    progress: 100,
    isCompleted: true,
    isAccessible: true,
    hasPreview: true,
    previewAvailable: true,
    videoUrl: '/videos/lesson-1.mp4'
  },
  {
    id: 'lesson-2',
    courseId: 'demo-electrostatique',
    title: 'La loi de Coulomb',
    description: 'Comprendre la force électrostatique entre deux charges ponctuelles.',
    duration: 25,
    price: 18,
    order: 2,
    isOwned: true,
    progress: 100,
    isCompleted: true,
    isAccessible: true,
    hasPreview: true,
    previewAvailable: true,
    videoUrl: '/videos/lesson-2.mp4'
  },
  {
    id: 'lesson-3',
    courseId: 'demo-electrostatique',
    title: 'Le champ électrique',
    description: 'Définition, propriétés et représentation du champ électrique.',
    duration: 30,
    price: 20,
    order: 3,
    isOwned: true,
    progress: 100,
    isCompleted: true,
    isAccessible: true,
    hasPreview: true,
    previewAvailable: true,
    videoUrl: '/videos/lesson-3.mp4'
  },
  {
    id: 'lesson-4',
    courseId: 'demo-electrostatique',
    title: 'Potentiel électrique',
    description: 'Énergie potentielle et différence de potentiel.',
    duration: 28,
    price: 20,
    order: 4,
    isOwned: true,
    progress: 45,
    isCompleted: false,
    isInProgress: true,
    isAccessible: true,
    hasPreview: true,
    previewAvailable: true,
    videoUrl: '/videos/lesson-4.mp4'
  },
  {
    id: 'lesson-5',
    courseId: 'demo-electrostatique',
    title: 'Théorème de Gauss',
    description: 'Application du théorème de Gauss aux distributions de charges.',
    duration: 35,
    price: 25,
    order: 5,
    isOwned: true,
    progress: 0,
    isCompleted: false,
    isAccessible: true,
    hasPreview: true,
    previewAvailable: true,
    videoUrl: '/videos/lesson-5.mp4'
  },
  {
    id: 'lesson-6',
    courseId: 'demo-electrostatique',
    title: 'Conducteurs en équilibre',
    description: 'Propriétés des conducteurs et phénomènes d\'influence.',
    duration: 22,
    price: 18,
    order: 6,
    isOwned: false,
    progress: 0,
    isCompleted: false,
    isAccessible: false,
    hasPreview: true,
    previewAvailable: true,
    videoUrl: '/videos/lesson-6.mp4'
  },
  {
    id: 'lesson-7',
    courseId: 'demo-electrostatique',
    title: 'Condensateurs',
    description: 'Capacité, énergie stockée et associations de condensateurs.',
    duration: 28,
    price: 22,
    order: 7,
    isOwned: false,
    progress: 0,
    isCompleted: false,
    isAccessible: false,
    hasPreview: true,
    previewAvailable: true,
    videoUrl: '/videos/lesson-7.mp4'
  },
  {
    id: 'lesson-8',
    courseId: 'demo-electrostatique',
    title: 'Diélectriques',
    description: 'Polarisation et comportement des matériaux isolants.',
    duration: 20,
    price: 18,
    order: 8,
    isOwned: false,
    progress: 0,
    isCompleted: false,
    isAccessible: false,
    hasPreview: false,
    previewAvailable: false,
    videoUrl: '/videos/lesson-8.mp4'
  },
  {
    id: 'lesson-9',
    courseId: 'demo-electrostatique',
    title: 'Énergie électrostatique',
    description: 'Calcul de l\'énergie d\'un système de charges.',
    duration: 25,
    price: 20,
    order: 9,
    isOwned: false,
    progress: 0,
    isCompleted: false,
    isAccessible: false,
    hasPreview: false,
    previewAvailable: false,
    videoUrl: '/videos/lesson-9.mp4'
  },
  {
    id: 'lesson-10',
    courseId: 'demo-electrostatique',
    title: 'Applications pratiques',
    description: 'Exercices et problèmes types pour les examens.',
    duration: 40,
    price: 25,
    order: 10,
    isOwned: false,
    progress: 0,
    isCompleted: false,
    isAccessible: false,
    hasPreview: false,
    previewAvailable: false,
    videoUrl: '/videos/lesson-10.mp4'
  },
  {
    id: 'lesson-11',
    courseId: 'demo-electrostatique',
    title: 'Révisions guidées',
    description: 'Synthèse et méthodes de résolution rapide.',
    duration: 30,
    price: 22,
    order: 11,
    isOwned: false,
    progress: 0,
    isCompleted: false,
    isAccessible: false,
    hasPreview: false,
    previewAvailable: false,
    videoUrl: '/videos/lesson-11.mp4'
  },
  {
    id: 'lesson-12',
    courseId: 'demo-electrostatique',
    title: 'Examen blanc',
    description: 'Test final avec correction détaillée.',
    duration: 45,
    price: 30,
    order: 12,
    isOwned: false,
    progress: 0,
    isCompleted: false,
    isAccessible: false,
    hasPreview: false,
    previewAvailable: false,
    videoUrl: '/videos/lesson-12.mp4'
  }
];

export default function LearningTrackPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleClose = () => {
    // Dans une vraie app, on redirigerait vers le dashboard
    window.history.back();
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    alert(`🎬 Lancement de la leçon : "${lesson.title}"\n\nDans l'app réelle, cela ouvrirait le lecteur vidéo.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simulé */}
      <header className="bg-white border-b border-gray-200 h-[85px] flex items-center px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-gray-900">SMS</span>
          <span className="text-sm text-gray-500">Science Made Simple</span>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar simulée */}
        <nav className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col fixed left-0 top-[85px] h-[calc(100vh-85px)]">
          <div className="p-6 space-y-2">
            <div className="flex items-center gap-3 p-3 bg-black text-white rounded-lg">
              <span>📚</span>
              <span className="font-medium">Mes cours</span>
            </div>
            <div className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <span>📅</span>
              <span className="font-medium">Planification</span>
            </div>
            <div className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <span>🎥</span>
              <span className="font-medium">Study Rooms</span>
            </div>
          </div>
        </nav>
        
        {/* Contenu principal */}
        <main className="flex-1 md:ml-64">
          <div className="h-[calc(100vh-85px)] overflow-y-auto">
            <LearningTrackOverview
              course={demoCourse}
              lessons={demoLessons}
              onClose={handleClose}
              onStartLesson={handleStartLesson}
              purchasedItems={new Set(['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5'])}
              embedded={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

