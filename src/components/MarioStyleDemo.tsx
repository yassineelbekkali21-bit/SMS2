'use client';

import React from 'react';
import { MarioStyleLessonViewer } from './MarioStyleLessonViewer';
import { Course, Lesson } from '@/types';

// Mock data aligné sur le style Mario Map
const mockCourse: Course = {
  id: 'course-mario-demo',
  title: 'Électrostatique et Loi de Gauss',
  description: 'Maîtrisez les concepts fondamentaux de l\'électrostatique avec la loi de Gauss.',
  faculty: 'Sciences Physiques',
  year: 'L2',
  totalLessons: 6,
  completedLessons: 2,
  duration: '5h 30m',
  isOwned: true,
  isPrimary: true,
  progress: 33,
  previewAvailable: true,
  tags: ['physique', 'électrostatique', 'gauss'],
  difficulty: 'intermediate',
  price: 700
};

const mockLessons: Lesson[] = [
  {
    id: 'lesson-mario-1',
    courseId: 'course-mario-demo',
    title: 'Introduction à l\'électrostatique',
    description: 'Découvrez les bases de l\'électrostatique : charges, forces et champs électriques. Cette leçon pose les fondements nécessaires pour comprendre la loi de Gauss.',
    duration: 45,
    price: 70,
    isOwned: true,
    progress: 100,
    order: 1,
    difficulty: 'beginner',
    hasPreview: true,
    previewAvailable: true,
    isCompleted: true,
    tags: ['introduction', 'charges'],
    objectives: [
      'Comprendre la notion de charge électrique',
      'Maîtriser la loi de Coulomb',
      'Calculer des forces électrostatiques simples'
    ],
    prerequisites: [
      'Mathématiques niveau terminale',
      'Notions de vecteurs'
    ],
    videoUrl: '/videos/mario-electrostatic-intro.mp4',
    isAccessible: true
  },
  {
    id: 'lesson-mario-2',
    courseId: 'course-mario-demo',
    title: 'Champ électrique et potentiel',
    description: 'Approfondissez votre compréhension avec les concepts de champ électrique et de potentiel électrostatique.',
    duration: 55,
    price: 70,
    isOwned: true,
    progress: 100,
    order: 2,
    difficulty: 'intermediate',
    hasPreview: true,
    previewAvailable: true,
    isCompleted: true,
    tags: ['champ', 'potentiel'],
    objectives: [
      'Définir le champ électrique',
      'Comprendre le potentiel électrostatique',
      'Relier champ et potentiel'
    ],
    prerequisites: [
      'Introduction à l\'électrostatique (leçon 1)'
    ],
    videoUrl: '/videos/mario-field-potential.mp4',
    isAccessible: true
  },
  {
    id: 'lesson-mario-3',
    courseId: 'course-mario-demo',
    title: 'Théorème de Gauss',
    description: 'Découvrez le théorème fondamental de Gauss et ses implications pour le calcul des champs électriques.',
    duration: 60,
    price: 70,
    isOwned: true,
    progress: 75,
    order: 3,
    difficulty: 'intermediate',
    hasPreview: true,
    previewAvailable: true,
    isInProgress: true,
    tags: ['gauss', 'théorème'],
    objectives: [
      'Énoncer le théorème de Gauss',
      'Comprendre la notion de flux électrique',
      'Identifier les symétries utiles'
    ],
    prerequisites: [
      'Champ électrique et potentiel (leçon 2)',
      'Calcul intégral'
    ],
    videoUrl: '/videos/mario-gauss-theorem.mp4',
    isAccessible: true
  },
  {
    id: 'lesson-mario-4',
    courseId: 'course-mario-demo',
    title: 'Applications : symétrie sphérique',
    description: 'Mettez en pratique la loi de Gauss pour résoudre des problèmes à symétrie sphérique.',
    duration: 50,
    price: 70,
    isOwned: true,
    progress: 0,
    order: 4,
    difficulty: 'intermediate',
    hasPreview: true,
    previewAvailable: true,
    tags: ['applications', 'sphère'],
    objectives: [
      'Appliquer Gauss aux sphères chargées',
      'Calculer le champ d\'une charge ponctuelle',
      'Traiter les distributions continues'
    ],
    prerequisites: [
      'Théorème de Gauss (leçon 3)'
    ],
    videoUrl: '/videos/mario-spherical-symmetry.mp4',
    isAccessible: true
  },
  {
    id: 'lesson-mario-5',
    courseId: 'course-mario-demo',
    title: 'Applications : symétrie cylindrique',
    description: 'Explorez les applications de la loi de Gauss aux configurations cylindriques.',
    duration: 55,
    price: 70,
    isOwned: false,
    progress: 0,
    order: 5,
    difficulty: 'advanced',
    hasPreview: true,
    previewAvailable: true,
    tags: ['applications', 'cylindre'],
    objectives: [
      'Maîtriser la symétrie cylindrique',
      'Calculer le champ d\'un fil infini',
      'Résoudre des problèmes complexes'
    ],
    prerequisites: [
      'Applications : symétrie sphérique (leçon 4)'
    ],
    videoUrl: '/videos/mario-cylindrical-symmetry.mp4',
    isAccessible: false
  },
  {
    id: 'lesson-mario-6',
    courseId: 'course-mario-demo',
    title: 'Conducteurs et applications',
    description: 'Découvrez le comportement des conducteurs en électrostatique et les applications pratiques.',
    duration: 65,
    price: 70,
    isOwned: false,
    progress: 0,
    order: 6,
    difficulty: 'advanced',
    hasPreview: true,
    previewAvailable: true,
    tags: ['conducteurs', 'applications'],
    objectives: [
      'Comprendre l\'équilibre électrostatique',
      'Analyser les conducteurs',
      'Applications industrielles'
    ],
    prerequisites: [
      'Applications : symétrie cylindrique (leçon 5)'
    ],
    videoUrl: '/videos/mario-conductors.mp4',
    isAccessible: false
  }
];

interface MarioStyleDemoProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function MarioStyleDemo({ 
  isOpen = true, 
  onClose = () => console.log('Demo fermé') 
}: MarioStyleDemoProps) {
  
  const [currentLessonId, setCurrentLessonId] = React.useState('lesson-mario-3');
  
  const currentLesson = mockLessons.find(l => l.id === currentLessonId) || mockLessons[2];
  
  const mockUser = {
    id: 'user-mario-demo',
    name: 'Étudiant Mario',
    email: 'mario@sciencemadesimple.com',
    faculty: 'Sciences Physiques',
    year: 'L2',
    isKYCCompleted: true,
    preferences: {
      notifications: true,
      studyReminders: true,
      theme: 'light' as const,
      language: 'fr' as const
    },
    wallet: {
      id: 'wallet-mario-demo',
      userId: 'user-mario-demo',
      balance: 250.00,
      totalDeposited: 350.00,
      totalSpent: 100.00,
      createdAt: new Date(),
      transactions: []
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    const lesson = mockLessons.find(l => l.id === lessonId);
    if (lesson && (lesson.isOwned || lesson.isAccessible)) {
      setCurrentLessonId(lessonId);
    }
  };

  const handleBackToMap = () => {
    console.log('Retour à la Mario Map');
    onClose();
  };

  return (
    <MarioStyleLessonViewer
      course={mockCourse}
      lessons={mockLessons}
      currentLesson={currentLesson}
      isOpen={isOpen}
      onClose={onClose}
      onBackToMap={handleBackToMap}
      onLessonSelect={handleLessonSelect}
      user={mockUser}
      purchasedItems={new Set(['lesson-mario-1', 'lesson-mario-2', 'lesson-mario-3', 'lesson-mario-4'])}
    />
  );
}




