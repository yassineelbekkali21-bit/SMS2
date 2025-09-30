'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';

interface MinimalLessonCompletionProps {
  isVisible: boolean;
  xpGained: number;
  lessonTitle: string;
  onContinue: () => void;
}

export function MinimalLessonCompletion({ 
  isVisible, 
  xpGained, 
  lessonTitle, 
  onContinue 
}: MinimalLessonCompletionProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
          >
            {/* Icône de succès épurée */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="text-green-600" size={32} />
            </motion.div>

            {/* Message de félicitations */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Leçon terminée ! 🎉
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 mb-6"
            >
              Excellente progression sur "{lessonTitle}"
            </motion.p>

            {/* XP gagné avec style épuré */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-50 rounded-2xl p-6 mb-6"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Zap className="text-purple-500" size={24} />
                <span className="text-3xl font-bold text-gray-900">+{xpGained}</span>
                <span className="text-lg text-gray-600">XP</span>
              </div>
              <p className="text-sm text-gray-600">Points d'expérience gagnés</p>
            </motion.div>

            {/* Bouton de continuation épuré */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={onContinue}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-2xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>Continuer le parcours</span>
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
