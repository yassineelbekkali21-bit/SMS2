'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock,
  BookOpen,
  Play,
  Eye,
  Brain,
  User
} from 'lucide-react';
import { Course, MiniQuizQuestion } from '@/types';
import { MiniQuiz } from './MiniQuiz';
import { getMiniQuizForCourse } from '@/lib/mock-data';

interface IndividualCourseCardProps {
  course: Course;
  userBalance: number;
  onPurchase: (course: Course) => void;
  onPreview: (course: Course) => void;
  canAfford: boolean;
}

export function IndividualCourseCard({
  course,
  userBalance,
  onPurchase,
  onPreview,
  canAfford
}: IndividualCourseCardProps) {
  const [showMiniQuiz, setShowMiniQuiz] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  const miniQuizQuestions = getMiniQuizForCourse(course.id);

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    setTimeout(() => {
      setShowMiniQuiz(false);
    }, 3000);
  };

  // Afficher le quiz si demandé
  if (showMiniQuiz) {
    return (
      <MiniQuiz
        questions={miniQuizQuestions}
        onComplete={handleQuizComplete}
        onClose={() => setShowMiniQuiz(false)}
        courseName={course.title}
      />
    );
  }

  // Affichage de l'aperçu vidéo (modale simple)
  if (showVideoPreview) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => setShowVideoPreview(false)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
              <p className="text-gray-600">Aperçu du cours</p>
            </div>
            <button
              onClick={() => setShowVideoPreview(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <Play size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Aperçu vidéo du cours</p>
              <p className="text-sm opacity-75 mt-2">Extrait de 5 minutes disponible</p>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700">{course.description}</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return 'Intermédiaire';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      {/* En-tête épuré */}
      <div className="p-6">
        {/* Titre et niveau */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1 mr-4">
            {course.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty || 'intermediate')}`}>
            {getDifficultyLabel(course.difficulty || 'intermediate')}
          </span>
        </div>
        
        {/* Description du cours */}
        <div className="mb-5 px-4 py-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-base text-gray-800 leading-relaxed font-normal">
            {course.description}
          </p>
        </div>

        {/* Informations essentielles */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{course.totalLessons} leçons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{course.duration}</span>
          </div>
        </div>

        {/* Prix */}
        <div className="mb-6">
          <div className="text-2xl font-bold text-gray-900">700€</div>
        </div>

        {/* Actions - 3 boutons distincts */}
        <div className="space-y-3">
          {/* 1. Aperçu vidéo - discret */}
          <button
            onClick={() => setShowVideoPreview(true)}
            className="w-full py-2.5 px-4 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Play size={16} />
            Aperçu vidéo
          </button>

          {/* 2. Je me teste - CTA principal violet */}
          <button
            onClick={() => setShowMiniQuiz(true)}
            className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Brain size={16} />
            Je me teste
          </button>

          {/* 3. Débloquer le cours - CTA secondaire */}
          <button
            onClick={() => onPurchase(course)}
            className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <BookOpen size={16} />
            Débloquer le cours
          </button>
        </div>
      </div>
    </motion.div>
  );
}



