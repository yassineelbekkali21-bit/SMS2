'use client';

import React from 'react';
import { IntegratedCourseViewer } from './IntegratedCourseViewer';
import { Course, Lesson } from '@/types';

// Mock data pour démonstration du nouvel écran de visionnage Web 3.0
const mockCourse: Course = {
  id: 'course-enhanced-demo',
  title: 'Loi de Gauss et Applications',
  description: 'Maîtrisez la loi de Gauss et ses applications pratiques en électrostatique.',
  faculty: 'Sciences Physiques',
  year: 'L2',
  totalLessons: 8,
  completedLessons: 3,
  duration: '6h 45m',
  isOwned: true,
  isPrimary: true,
  progress: 38,
  previewAvailable: true,
  tags: ['physique', 'électrostatique', 'gauss'],
  difficulty: 'intermediate',
  price: 700
};

const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    courseId: 'course-enhanced-demo',
    title: 'Introduction à la loi de Gauss',
    description: 'Découvrez les fondements théoriques de la loi de Gauss et son importance en électrostatique.',
    duration: 45,
    price: 70,
    isOwned: true,
    progress: 100,
    order: 1,
    difficulty: 'beginner',
    hasPreview: true,
    previewAvailable: true,
    isCompleted: true,
    tags: ['introduction', 'théorie'],
    objectives: [
      'Comprendre le concept de flux électrique',
      'Découvrir l\'énoncé de la loi de Gauss',
      'Identifier les situations d\'application'
    ],
    prerequisites: [
      'Notions de base en électrostatique',
      'Calcul vectoriel élémentaire'
    ],
    videoUrl: '/videos/gauss-intro.mp4',
    isAccessible: true
  },
  {
    id: 'lesson-2',
    courseId: 'course-enhanced-demo',
    title: 'Calcul de champ par symétrie sphérique',
    description: 'Apprenez à utiliser la loi de Gauss pour calculer le champ électrique autour d\'une charge ponctuelle et d\'une sphère chargée.',
    duration: 55,
    price: 70,
    isOwned: true,
    progress: 100,
    order: 2,
    difficulty: 'intermediate',
    hasPreview: true,
    previewAvailable: true,
    isCompleted: true,
    tags: ['symétrie', 'sphère'],
    objectives: [
      'Maîtriser la symétrie sphérique',
      'Calculer le champ d\'une charge ponctuelle',
      'Traiter le cas d\'une sphère uniformément chargée'
    ],
    prerequisites: [
      'Loi de Gauss (leçon précédente)',
      'Géométrie dans l\'espace'
    ],
    videoUrl: '/videos/gauss-sphere.mp4',
    isAccessible: true
  },
  {
    id: 'lesson-3',
    courseId: 'course-enhanced-demo',
    title: 'Symétrie cylindrique et fil infini',
    description: 'Découvrez comment appliquer la loi de Gauss aux configurations à symétrie cylindrique.',
    duration: 50,
    price: 70,
    isOwned: true,
    progress: 100,
    order: 3,
    difficulty: 'intermediate',
    hasPreview: true,
    previewAvailable: true,
    isCompleted: true,
    tags: ['cylindre', 'fil-infini'],
    objectives: [
      'Comprendre la symétrie cylindrique',
      'Calculer le champ d\'un fil rectiligne infini',
      'Traiter le cas d\'un cylindre chargé'
    ],
    prerequisites: [
      'Symétrie sphérique (leçon précédente)',
      'Coordonnées cylindriques'
    ],
    videoUrl: '/videos/gauss-cylinder.mp4',
    isAccessible: true
  },
  {
    id: 'lesson-4',
    courseId: 'course-enhanced-demo',
    title: 'Plan infini et condensateur plan',
    description: 'Explorez les applications de la loi de Gauss aux configurations planes et aux condensateurs.',
    duration: 60,
    price: 70,
    isOwned: true,
    progress: 65,
    order: 4,
    difficulty: 'intermediate',
    hasPreview: true,
    previewAvailable: true,
    isInProgress: true,
    tags: ['plan', 'condensateur'],
    objectives: [
      'Maîtriser la symétrie plane',
      'Calculer le champ d\'un plan infini chargé',
      'Analyser un condensateur plan'
    ],
    prerequisites: [
      'Symétrie cylindrique (leçon précédente)',
      'Notions de condensateur'
    ],
    videoUrl: '/videos/gauss-plane.mp4',
    isAccessible: true
  },
  {
    id: 'lesson-5',
    courseId: 'course-enhanced-demo',
    title: 'Conducteurs en équilibre électrostatique',
    description: 'Comprenez le comportement des conducteurs et l\'application de la loi de Gauss.',
    duration: 55,
    price: 70,
    isOwned: true,
    progress: 0,
    order: 5,
    difficulty: 'advanced',
    hasPreview: true,
    previewAvailable: true,
    tags: ['conducteur', 'équilibre'],
    objectives: [
      'Comprendre l\'équilibre électrostatique',
      'Analyser la répartition des charges',
      'Appliquer la loi de Gauss aux conducteurs'
    ],
    prerequisites: [
      'Plan infini (leçon précédente)',
      'Propriétés des conducteurs'
    ],
    videoUrl: '/videos/gauss-conductors.mp4',
    isAccessible: true
  },
  {
    id: 'lesson-6',
    courseId: 'course-enhanced-demo',
    title: 'Cavités et blindage électrostatique',
    description: 'Découvrez les phénomènes de blindage et l\'effet des cavités dans les conducteurs.',
    duration: 45,
    price: 70,
    isOwned: false,
    progress: 0,
    order: 6,
    difficulty: 'advanced',
    hasPreview: true,
    previewAvailable: true,
    tags: ['cavité', 'blindage'],
    objectives: [
      'Comprendre le blindage électrostatique',
      'Analyser les cavités dans les conducteurs',
      'Applications pratiques du blindage'
    ],
    prerequisites: [
      'Conducteurs en équilibre (leçon précédente)',
      'Théorème de Gauss avancé'
    ],
    videoUrl: '/videos/gauss-shielding.mp4',
    isAccessible: false
  },
  {
    id: 'lesson-7',
    courseId: 'course-enhanced-demo',
    title: 'Applications industrielles',
    description: 'Explorez les applications concrètes de la loi de Gauss dans l\'industrie.',
    duration: 40,
    price: 70,
    isOwned: false,
    progress: 0,
    order: 7,
    difficulty: 'advanced',
    hasPreview: true,
    previewAvailable: true,
    tags: ['industrie', 'applications'],
    objectives: [
      'Découvrir les applications industrielles',
      'Analyser des cas concrets',
      'Résoudre des problèmes pratiques'
    ],
    prerequisites: [
      'Blindage électrostatique (leçon précédente)',
      'Bases de l\'ingénierie électrique'
    ],
    videoUrl: '/videos/gauss-industrial.mp4',
    isAccessible: false
  },
  {
    id: 'lesson-8',
    courseId: 'course-enhanced-demo',
    title: 'Synthèse et exercices avancés',
    description: 'Consolidez vos connaissances avec des exercices complexes et une synthèse complète.',
    duration: 50,
    price: 70,
    isOwned: false,
    progress: 0,
    order: 8,
    difficulty: 'advanced',
    hasPreview: true,
    previewAvailable: true,
    tags: ['synthèse', 'exercices'],
    objectives: [
      'Synthétiser toutes les applications',
      'Résoudre des problèmes complexes',
      'Maîtriser la loi de Gauss complètement'
    ],
    prerequisites: [
      'Applications industrielles (leçon précédente)',
      'Toutes les leçons précédentes'
    ],
    videoUrl: '/videos/gauss-synthesis.mp4',
    isAccessible: false
  }
];

interface EnhancedLessonViewerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function EnhancedLessonViewer({ 
  isOpen = true, 
  onClose = () => console.log('Viewer fermé') 
}: EnhancedLessonViewerProps) {
  
  const mockUser = {
    id: 'user-enhanced-demo',
    name: 'Étudiant Demo',
    email: 'demo@sciencemadesimple.com',
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
      id: 'wallet-enhanced-demo',
      userId: 'user-enhanced-demo',
      balance: 200.00,
      totalDeposited: 300.00,
      totalSpent: 100.00,
      createdAt: new Date(),
      transactions: []
    }
  };

  const handlePurchase = (option: any) => {
    console.log('Achat démo:', option);
  };

  const handleNavigation = (section: string) => {
    console.log('Navigation vers:', section);
  };

  const handleLessonsUpdate = (updatedLessons: Lesson[]) => {
    console.log('Leçons mises à jour:', updatedLessons);
  };

  return (
    <IntegratedCourseViewer
      course={mockCourse}
      isOpen={isOpen}
      onClose={onClose}
      onNavigateToSection={handleNavigation}
      showSettings={false}
      purchasedItems={new Set(['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5'])}
      onPurchase={handlePurchase}
      user={mockUser}
      lessons={mockLessons}
      onLessonsUpdate={handleLessonsUpdate}
    />
  );
}






