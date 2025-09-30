'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Play,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Course } from '@/types';
import { GaussStyleCard } from './GaussStyleCard';

interface CoursePurchaseCardProps {
  course: Course;
  isOwned?: boolean;
  packBadge?: string; // "Inclus dans Pack Sciences"
  onPurchase: (courseId: string) => void;
  onPreview?: (courseId: string) => void;
  onToggleFavorite?: (courseId: string) => void;
  onClick?: (courseId: string) => void;
  className?: string;
}

// Générateur de patterns cohérents
const generateCardPattern = (courseId: string, title: string) => {
  const hash = title.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const patterns = [
    'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
    'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
    'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
    'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
  ];
  return patterns[Math.abs(hash) % patterns.length];
};

const getIconColor = (courseId: string, title: string) => {
  const hash = title.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const colors = [
    'from-gray-600 to-gray-700',
    'from-slate-600 to-slate-700',
    'from-zinc-600 to-zinc-700',
    'from-neutral-600 to-neutral-700',
  ];
  return colors[Math.abs(hash) % colors.length];
};

export function CoursePurchaseCard({ 
  course, 
  isOwned = false, 
  packBadge,
  onPurchase, 
  onPreview,
  onToggleFavorite,
  onClick,
  className = ""
}: CoursePurchaseCardProps) {
  const handlePurchase = () => {
    if (!isOwned) {
      onPurchase(course.id);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(course.id);
    }
  };

  return (
    <GaussStyleCard
      title={course.title}
      description={course.description}
      faculty={course.faculty}
      studentsCount={course.studentsCount || 87}
      duration={course.duration}
      lessonCount={course.totalLessons}
      isOwned={isOwned}
      courseId={course.id}
      onPreview={handlePreview}
      onTest={() => console.log('Quiz pour cours:', course.id)}
      onAccess={handlePreview}
      onClick={() => onClick?.(course.id)}
      className={className}
    />
  );
}
