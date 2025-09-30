'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Crown, 
  CheckCircle, 
  Star, 
  Gift, 
  Award,
  BookOpen,
  Users,
  TrendingUp,
  Package
} from 'lucide-react';
import { Course, CoursePack } from '@/types';
import { getCourseContextualMessage } from '@/lib/smart-recommendations';

// Fonctions utilitaires pour calculer la valeur totale
const calculateLessonsTotalValue = (courseId: string): number => {
  // Simulation : 5 leçons à 70€ chacune = 350€
  return 5 * 70;
};

const calculateCoursesTotalValue = (packId: string): number => {
  // Simulation : 3 cours à 700€ chacun = 2100€
  return 3 * 700;
};

interface SmartCourseComparisonProps {
  isVisible: boolean;
  onClose: () => void;
  selectedCourse: Course;
  recommendedPack: CoursePack;
  alternativePack?: CoursePack;
  onSelectCourse: () => void;
  onSelectPack: (packId: string) => void;
  canAffordCourse: boolean;
  canAffordPack: boolean;
  canAffordAlternative?: boolean;
}

export function SmartCourseComparison({
  isVisible,
  onClose,
  selectedCourse,
  recommendedPack,
  alternativePack,
  onSelectCourse,
  onSelectPack,
  canAffordCourse,
  canAffordPack,
  canAffordAlternative = false
}: SmartCourseComparisonProps) {
  
  const messages = getCourseContextualMessage(selectedCourse, recommendedPack);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative overflow-hidden">
            {/* Animation de crédits flottants */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <motion.div
                initial={{ x: -50, opacity: 0.3 }}
                animate={{ x: 50, opacity: 0.6 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute top-3 left-10 text-2xl"
              >
                🧠
              </motion.div>
              <motion.div
                initial={{ x: 100, opacity: 0.2 }}
                animate={{ x: -20, opacity: 0.5 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
                className="absolute top-8 right-20 text-xl"
              >
                🧠
              </motion.div>
              <motion.div
                initial={{ x: 0, opacity: 0.1 }}
                animate={{ x: 80, opacity: 0.4 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute bottom-4 left-16 text-lg"
              >
                🧠
              </motion.div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="pr-12 relative z-10">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="text-3xl">🎯</span>
                <span>Optimise ton investissement</span>
                <motion.span 
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  🧠
                </motion.span>
              </h2>
              <p className="text-blue-100">{messages.courseEncouragement}</p>
            </div>
          </div>

          {/* Comparaison */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Option 1: Cours seul */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="border border-gray-200 rounded-xl p-6 relative"
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-gray-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Cours seul</h3>
                  <p className="text-sm text-gray-600">Accès limité</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 mt-0.5" size={16} />
                    <span className="text-sm text-gray-700">{selectedCourse.title}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 mt-0.5" size={16} />
                    <span className="text-sm text-gray-700">{selectedCourse.totalLessons} leçons incluses</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 mt-0.5" size={16} />
                    <span className="text-sm text-gray-700">Accès à vie</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 italic">
                      💡 Apprentissage ciblé mais isolé
                    </p>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
                    <span className="text-3xl">💳</span>
                    <span>{selectedCourse.price || 700}</span>
                  </div>
                  <div className="text-sm text-gray-600">euros</div>
                </div>

                <button
                  onClick={onSelectCourse}
                  disabled={!canAffordCourse}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    canAffordCourse
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canAffordCourse ? 'Débloquer le cours' : 'Solde insuffisant'}
                </button>

                <div className="mt-3 text-center">
                  <span className="text-xs text-gray-500">Option basique</span>
                </div>
              </motion.div>

              {/* Option 2: Pack recommandé */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-2 border-blue-500 rounded-xl p-6 relative bg-blue-50"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ⭐ RECOMMANDÉ
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{recommendedPack.title}</h3>
                  <p className="text-sm text-blue-700">Formation complète</p>
                </div>

                <div className="space-y-2 mb-6">
                  {recommendedPack.courses.slice(0, 4).map((courseId, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="text-blue-600 mt-0.5" size={16} />
                      <span className="text-sm text-gray-700">
                        Cours {index + 1} inclus
                      </span>
                    </div>
                  ))}
                  
                  {recommendedPack.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Gift className="text-purple-600 mt-0.5" size={16} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">
                      🚀 {messages.packValue}
                    </p>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-blue-900 mb-1">
                    {recommendedPack.price || recommendedPack.creditCost}€
                  </div>
                  <div className="text-sm text-blue-600 font-medium">euros</div>
                </div>

                <button
                  onClick={() => onSelectPack(recommendedPack.id)}
                  disabled={!canAffordPack}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    canAffordPack
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canAffordPack ? 'Débloquer le pack' : 'Solde insuffisant'}
                </button>

                <div className="mt-3 text-center">
                  <span className="text-xs text-blue-600 font-medium">Meilleur investissement</span>
                </div>
              </motion.div>

              {/* Option 3: Pack alternatif (si disponible) */}
              {alternativePack && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="border border-purple-300 rounded-xl p-6 relative bg-purple-50"
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      👑 PREMIUM
                    </span>
                  </div>

                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="text-purple-600" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{alternativePack.title}</h3>
                    <p className="text-sm text-purple-700">Formation d'élite</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {alternativePack.courses.slice(0, 3).map((courseId, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="text-purple-600 mt-0.5" size={16} />
                        <span className="text-sm text-gray-700">
                          Cours premium {index + 1}
                        </span>
                      </div>
                    ))}
                    
                    {alternativePack.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Award className="text-purple-600 mt-0.5" size={16} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-purple-200">
                      <p className="text-xs text-purple-700 font-medium">
                        💎 Formation d'excellence absolue
                      </p>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-purple-900 mb-1 flex items-center justify-center gap-2">
                      <span className="text-3xl">💳</span>
                      <span>{alternativePack.price || alternativePack.creditCost}</span>
                    </div>
                    <div className="text-sm text-purple-600 font-medium">euros</div>
                    <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                      <span className="text-sm">🎁</span>
                      <span>Économie : {alternativePack.savings}€ de contenu bonus</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectPack(alternativePack.id)}
                    disabled={!canAffordAlternative}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      canAffordAlternative
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAffordAlternative ? 'Débloquer le pack premium' : 'Solde insuffisant'}
                  </button>

                  <div className="mt-3 text-center">
                    <span className="text-xs text-purple-600 font-medium">Formation d'élite</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Message motivationnel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
            >
              <div className="flex items-center justify-center gap-3 text-green-800">
                <TrendingUp size={20} />
                <span className="font-medium text-center">
                  {messages.motivation}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}