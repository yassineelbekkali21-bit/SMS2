'use client';

import React from 'react';
import { IntegratedCourseViewer } from './IntegratedCourseViewer';
import { Course, Lesson } from '@/types';

// Mock data pour démonstration du nouveau design
const mockCourse: Course = {
  id: 'course-demo-web3',
  title: 'Électrostatique Avancée',
  description: 'Maîtrisez les concepts fondamentaux de l\'électrostatique avec une approche moderne et interactive.',
  faculty: 'Sciences Physiques',
  year: 'L2',
  totalLessons: 12,
  completedLessons: 5,
  duration: '8h 30m',
  isOwned: true,
  isPrimary: true,
  progress: 42,
  previewAvailable: true,
  tags: ['physique', 'électrostatique', 'champs'],
  difficulty: 'intermediate',
  price: 700
};

const mockLesson: Lesson = {
  id: 'lesson-demo-web3',
  courseId: 'course-demo-web3',
  title: 'Loi de Gauss : Calcul de champ électrique',
  description: 'Apprenez à utiliser la loi de Gauss pour calculer les champs électriques dans des configurations symétriques. Cette leçon couvre les applications pratiques et les techniques de résolution avancées.',
  duration: 30,
  price: 70,
  isOwned: true,
  progress: 42,
  order: 3,
  difficulty: 'intermediate',
  hasPreview: true,
  previewAvailable: true,
  tags: ['gauss', 'champ-électrique', 'symétrie'],
  objectives: [
    'Comprendre le théorème de Gauss et ses applications',
    'Maîtriser le calcul de champs pour les géométries symétriques',
    'Appliquer la loi de Gauss aux conducteurs et isolants',
    'Résoudre des problèmes complexes d\'électrostatique'
  ],
  prerequisites: [
    'Notions de base en électrostatique',
    'Calcul vectoriel et intégral',
    'Théorème de Green-Ostrogradski'
  ],
  videoUrl: '/videos/gauss-law-demo.mp4',
  isAccessible: true,
  isInProgress: true,
  isCompleted: false
};

interface Web3CourseViewerDemoProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Web3CourseViewerDemo({ 
  isOpen = true, 
  onClose = () => console.log('Demo fermé') 
}: Web3CourseViewerDemoProps) {
  
  const mockUser = {
    id: 'user-demo',
    name: 'Étudiant Démo',
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
      id: 'wallet-demo',
      userId: 'user-demo',
      balance: 150.00,
      totalDeposited: 200.00,
      totalSpent: 50.00,
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

  return (
    <IntegratedCourseViewer
      course={mockCourse}
      isOpen={isOpen}
      onClose={onClose}
      onNavigateToSection={handleNavigation}
      showSettings={false}
      purchasedItems={new Set(['lesson-demo-web3', 'course-demo-web3'])}
      onPurchase={handlePurchase}
      user={mockUser}
      lessons={[mockLesson]}
      onLessonsUpdate={(lessons) => console.log('Leçons mises à jour:', lessons)}
    />
  );
}




