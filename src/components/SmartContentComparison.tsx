'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  Book, 
  BookOpen, 
  Package,
  Star,
  Award,
  Users,
  Clock,
  Zap,
  TrendingUp,
  Heart,
  Target,
  Sparkles
} from 'lucide-react';
import { Lesson, Course, CoursePack } from '@/types';

interface SmartContentComparisonProps {
  isVisible: boolean;
  onClose: () => void;
  selectedLesson: Lesson;
  relatedCourse: Course;
  recommendedPack: CoursePack;
  onSelectLesson: () => void;
  onSelectCourse: () => void;
  onSelectPack: () => void;
  canAffordLesson: boolean;
  canAffordCourse: boolean;
  canAffordPack: boolean;
}

export function SmartContentComparison({
  isVisible,
  onClose,
  selectedLesson,
  relatedCourse,
  recommendedPack,
  onSelectLesson,
  onSelectCourse,
  onSelectPack,
  canAffordLesson,
  canAffordCourse,
  canAffordPack
}: SmartContentComparisonProps) {
  
  const lessonContent = [
    "Accès à cette leçon uniquement",
    "Durée : " + selectedLesson.duration,
    "+" + selectedLesson.xpReward + " XP"
  ];

  const courseContent = [
    "Toutes les leçons du cours",
    relatedCourse.totalLessons + " leçons complètes",
    "Exercices pratiques inclus",
    "Suivi de progression détaillé",
    "Accès aux quiz d'évaluation"
  ];

  const packContent = [
    "Plusieurs cours complémentaires",
    "Coaching personnalisé inclus",
    "Exercices bonus exclusifs",
    "Support prioritaire",
    "Certificat de réussite",
    "Accès aux webinaires live",
    "Garantie de satisfaction"
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Choisissez votre parcours d'apprentissage
                  </h2>
                  <p className="text-gray-600">
                    Nous vous recommandons une approche complète pour maximiser votre réussite
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {/* Message bienveillant */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <div className="flex items-start gap-3">
                  <Heart className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      💡 Conseil pédagogique
                    </h3>
                    <p className="text-blue-800 text-sm">
                      Un seul chapitre ne suffit pas toujours à réussir ton examen. 
                      Avec une approche complète, tu maîtrises tout le sujet et maximises tes chances de succès.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Comparaison 3 colonnes */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Option 1: Leçon seule */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="text-gray-600" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Leçon seule</h3>
                    <p className="text-sm text-gray-600">Accès basique</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {lessonContent.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="text-gray-400 mt-0.5" size={16} />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">70€</div>
                    <div className="text-sm text-gray-500">euros</div>
                  </div>

                  <button
                    onClick={onSelectLesson}
                    disabled={!canAffordLesson}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      canAffordLesson
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAffordLesson ? 'Débloquer la leçon' : 'Solde insuffisant'}
                  </button>

                  <div className="mt-3 text-center">
                    <span className="text-xs text-gray-500">Option de repli</span>
                  </div>
                </motion.div>

                {/* Option 2: Cours complet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative bg-blue-50 rounded-xl p-6 border-2 border-blue-200"
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Recommandé
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Book className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Cours complet</h3>
                    <p className="text-sm text-blue-700">Maîtrise complète</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {courseContent.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="text-blue-600 mt-0.5" size={16} />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{relatedCourse.price || 700}€</div>
                    <div className="text-sm text-blue-600 font-medium">euros</div>
                  </div>

                  <button
                    onClick={onSelectCourse}
                    disabled={!canAffordCourse}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      canAffordCourse
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAffordCourse ? 'Débloquer le cours' : 'Solde insuffisant'}
                  </button>

                  <div className="mt-3 text-center">
                    <span className="text-xs text-blue-600 font-medium">Avantage pédagogique</span>
                  </div>
                </motion.div>

                {/* Option 3: Pack complet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200"
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={12} />
                      Valeur ajoutée
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Package className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{recommendedPack.title}</h3>
                    <p className="text-sm text-purple-700">Accompagnement complet</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {packContent.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="text-purple-600 mt-0.5" size={16} />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{recommendedPack.price || recommendedPack.creditCost}€</div>
                    <div className="text-sm text-purple-600 font-medium">euros</div>
                  </div>

                  <button
                    onClick={onSelectPack}
                    disabled={!canAffordPack}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      canAffordPack
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAffordPack ? 'Débloquer le pack' : 'Solde insuffisant'}
                  </button>

                </motion.div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
