'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Zap, 
  Star, 
  Play, 
  Lock,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { Lesson } from '@/types';
import { GaussStyleCard } from './GaussStyleCard';

interface LessonPurchaseCardProps {
  lesson: Lesson;
  isOwned: boolean;
  canAfford: boolean;
  onUnlock: (lessonId: string) => void;
  onPreview?: (lessonId: string) => void;
}

export function LessonPurchaseCard({
  lesson,
  isOwned,
  canAfford,
  onUnlock,
  onPreview
}: LessonPurchaseCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Intermédiaire';
      case 'hard': return 'Avancé';
      default: return 'Normal';
    }
  };

  return (
    <GaussStyleCard
      title={lesson.title}
      description={lesson.description}
      duration={`${lesson.duration} min`}
      price={70}
      isOwned={isOwned}
      onPreview={() => onPreview?.(lesson.id)}
      onTest={() => console.log('Quiz pour leçon:', lesson.id)} // TODO: Implémenter
      onAccess={() => onPreview?.(lesson.id)}
    />
  );
}
