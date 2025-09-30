'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  Star, 
  Brain, 
  BookOpen, 
  Users, 
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Course, CoursePack } from '@/types';

// Fonctions utilitaires pour calculer la valeur totale
const calculateLessonsTotalValue = (courseId: string): number => {
  // Simulation : 5 leçons à 70€ chacune = 350€
  return 5 * 70;
};

const calculateCoursesTotalValue = (packId: string): number => {
  // Simulation : 3 cours à 700€ chacun = 2100€
  return 3 * 700;
};

interface SmartPackOfferProps {
  selectedCourse: Course;
  suggestedPack: CoursePack & {
    includedCourses: Course[];
    bonusCourses: Course[];
  };
  isVisible: boolean;
  onClose: () => void;
  onSelectCourse: () => void;
  onSelectPack: () => void;
  canAffordCourse: boolean;
  canAffordPack: boolean;
}

export function SmartPackOffer({
  selectedCourse,
  suggestedPack,
  isVisible,
  onClose,
  onSelectCourse,
  onSelectPack,
  canAffordCourse,
  canAffordPack
}: SmartPackOfferProps) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Sparkles className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Offre Spéciale Intelligente</h2>
                  <p className="text-gray-600">Maximisez votre apprentissage</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-8 max-h-[70vh] overflow-y-auto">
            {/* Introduction */}
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vous avez sélectionné <span className="text-blue-600">{selectedCourse.title}</span>
              </h3>
              <p className="text-gray-600">
                Nous avons une proposition qui pourrait vous intéresser
              </p>
            </div>

            {/* Comparaison */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Option 1: Cours seul */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-gray-600" size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Cours Seul</h4>
                  {/* Étiquette offre limitée pour cours */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium z-10 shadow-sm">
                    Offre valable 14 jours
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">700€</span>
                  </div>
                  
                  {/* Valeur séparée factuelle */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Pris séparément, les leçons de ce cours valent {calculateLessonsTotalValue(selectedCourse.id)}€.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="text-gray-700 text-sm">Accès à {selectedCourse.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="text-gray-700 text-sm">{selectedCourse.totalLessons} leçons incluses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="text-gray-700 text-sm">Support standard</span>
                  </div>
                </div>

                <button
                  onClick={onSelectCourse}
                  disabled={!canAffordCourse}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                    canAffordCourse
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAffordCourse ? 'Débloquer ce cours' : 'Solde insuffisant'}
                </button>
              </motion.div>

              {/* Option 2: Pack recommandé */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 relative"
              >
                {/* Badge recommandé */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <Star size={14} />
                    Recommandé
                  </div>
                </div>

                <div className="text-center mb-6 mt-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="text-white" size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{suggestedPack.title}</h4>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">1200€</span>
                  </div>
                  <p className="text-sm text-gray-600">{suggestedPack.description}</p>
                  
                  {/* Valeur séparée factuelle */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Pris séparément, les cours de ce pack valent {calculateCoursesTotalValue(suggestedPack.id)}€.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <BookOpen size={14} className="text-blue-600" />
                      Cours inclus ({suggestedPack.includedCourses.length})
                    </h5>
                    {suggestedPack.includedCourses.map((course, index) => (
                      <div key={course.id} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                        <CheckCircle className="text-green-500" size={12} />
                        <span>{course.title}</span>
                        {course.id === selectedCourse.id && (
                          <span className="text-blue-600 font-medium">(Votre sélection)</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {suggestedPack.bonusCourses.length > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200">
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Sparkles size={14} className="text-yellow-600" />
                        Bonus exclusifs ({suggestedPack.bonusCourses.length})
                      </h5>
                      {suggestedPack.bonusCourses.map((course) => (
                        <div key={course.id} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                          <Star className="text-yellow-500" size={12} />
                          <span>{course.title}</span>
                          <span className="text-yellow-600 font-medium text-xs">GRATUIT</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users size={14} className="text-green-600" />
                      Avantages Premium
                    </h5>
                    {suggestedPack.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                        <CheckCircle className="text-green-500" size={12} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onSelectPack}
                  disabled={!canAffordPack}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    canAffordPack
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAffordPack ? (
                    <>
                      <span>Choisir ce pack</span>
                      <ArrowRight size={16} />
                    </>
                  ) : (
                    'Solde insuffisant'
                  )}
                </button>
              </motion.div>
            </div>

            {/* Value proposition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200"
            >
              <div className="text-center">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="text-green-600" size={20} />
                  Pourquoi choisir le pack ?
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  En choisissant le pack, vous ne payez que <strong>{suggestedPack.creditCost - (selectedCourse.creditCost || 0)} crédits de plus</strong> 
                  {' '}mais vous débloquez <strong>{suggestedPack.includedCourses.length + suggestedPack.bonusCourses.length - 1} cours supplémentaires</strong>
                  {' '}et bénéficiez d'un accompagnement premium. C'est plus de contenu, plus de valeur, pour un investissement maîtrisé.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
