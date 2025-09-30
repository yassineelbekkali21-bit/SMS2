'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  BookOpen,
  Brain,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Star,
  ArrowRight,
  Package
} from 'lucide-react';
import { Course, CoursePack } from '@/types';

interface CourseUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course;
  recommendedPacks: CoursePack[];
  userCredits: number;
  onPurchaseCourse: (course: Course) => void;
  onPurchasePack: (pack: CoursePack) => void;
  canAffordCourse: boolean;
  canAffordPacks: boolean[];
}

export function CourseUpsellModal({
  isOpen,
  onClose,
  selectedCourse,
  recommendedPacks,
  userCredits,
  onPurchaseCourse,
  onPurchasePack,
  canAffordCourse,
  canAffordPacks
}: CourseUpsellModalProps) {

  const getPackSavings = (pack: CoursePack) => {
    const originalCost = pack.originalCreditCost || pack.creditCost;
    return originalCost - pack.creditCost;
  };

  const getPackValue = (pack: CoursePack) => {
    return `${pack.courses.length} cours inclus`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gray-900 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Optimise ton investissement</h2>
                    <p className="text-gray-300">Économise en choisissant un pack</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-300 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-white" size={20} />
                  <div>
                    <h3 className="font-semibold text-white">{selectedCourse.title}</h3>
                    <p className="text-gray-300 text-sm">Prix individuel: {selectedCourse.creditCost} crédits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Options de comparaison */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Option 1: Cours seul */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-gray-900">{selectedCourse.creditCost}</span>
                      <Brain className="text-gray-600" size={20} />
                    </div>
                    <div className="text-xs text-gray-500">Prix standard</div>
                  </div>

                  <motion.button
                    onClick={() => onPurchaseCourse(selectedCourse)}
                    disabled={!canAffordCourse}
                    whileHover={canAffordCourse ? { scale: 1.02 } : {}}
                    whileTap={canAffordCourse ? { scale: 0.98 } : {}}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                      canAffordCourse
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAffordCourse ? 'Choisir ce cours' : 'Solde insuffisant'}
                  </motion.button>
                </motion.div>

                {/* Options packs recommandés */}
                {recommendedPacks.slice(0, 2).map((pack, index) => {
                  const canAfford = canAffordPacks[index];
                  const savings = getPackSavings(pack);
                  
                  return (
                    <motion.div
                      key={pack.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={`border-2 rounded-xl p-6 relative ${
                        index === 0 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      {/* Badge */}
                      {index === 0 && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Star size={12} />
                            Recommandé
                          </div>
                        </div>
                      )}

                      {pack.badge && index !== 0 && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gray-700 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Sparkles size={12} />
                            {pack.badge}
                          </div>
                        </div>
                      )}

                      <div className="text-center mb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          index === 0 ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <div className="text-2xl">{pack.icon}</div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{pack.title}</h3>
                        <p className="text-sm text-gray-600">{getPackValue(pack)}</p>
                      </div>

                      <div className="space-y-3 mb-6">
                        {pack.features.slice(0, 4).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-2">
                            <CheckCircle className="text-green-600 mt-0.5" size={16} />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                        
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-green-600 italic font-medium">
                            💰 Économie de {savings} crédits vs achat séparé
                          </p>
                        </div>
                      </div>

                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-gray-900">{pack.creditCost}</span>
                          <Brain className="text-gray-600" size={20} />
                        </div>
                        {pack.originalCreditCost && pack.originalCreditCost > pack.creditCost && (
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <span className="line-through">{pack.originalCreditCost} crédits</span>
                            <span className="text-green-600 font-semibold">-{savings} crédits</span>
                          </div>
                        )}
                      </div>

                      <motion.button
                        onClick={() => onPurchasePack(pack)}
                        disabled={!canAfford}
                        whileHover={canAfford ? { scale: 1.02 } : {}}
                        whileTap={canAfford ? { scale: 0.98 } : {}}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                          canAfford
                            ? index === 0
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Package size={16} />
                            Choisir ce pack
                            {index === 0 && <ArrowRight size={16} />}
                          </>
                        ) : (
                          'Solde insuffisant'
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="text-gray-600" size={20} />
                    <div>
                      <div className="font-semibold text-gray-900">Tes crédits actuels</div>
                      <div className="text-sm text-gray-600">{userCredits} crédits disponibles</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Besoin de plus de crédits ?</div>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                      Voir les offres de crédits →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




