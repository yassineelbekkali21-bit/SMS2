'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XPAction, Badge, XPLevel } from '@/lib/xp-service';

interface XPFeedbackProps {
  xpGained: number;
  action: XPAction;
  newLevel?: XPLevel;
  newBadges?: Badge[];
  onComplete?: () => void;
}

export default function XPFeedback({ 
  xpGained, 
  action, 
  newLevel, 
  newBadges = [], 
  onComplete 
}: XPFeedbackProps) {
  const [showFeedback, setShowFeedback] = useState(true);
  const [currentStep, setCurrentStep] = useState<'xp' | 'level' | 'badges'>('xp');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (newLevel) {
        setCurrentStep('level');
      } else if (newBadges.length > 0) {
        setCurrentStep('badges');
      } else {
        setShowFeedback(false);
        onComplete?.();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [newLevel, newBadges, onComplete]);

  useEffect(() => {
    if (currentStep === 'level') {
      const timer = setTimeout(() => {
        if (newBadges.length > 0) {
          setCurrentStep('badges');
        } else {
          setShowFeedback(false);
          onComplete?.();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (currentStep === 'badges') {
      const timer = setTimeout(() => {
        setShowFeedback(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, newBadges, onComplete]);

  return (
    <AnimatePresence>
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowFeedback(false);
            onComplete?.();
          }}
        >
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
            
            {/* Feedback XP */}
            {currentStep === 'xp' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-4xl mb-3"
                >
                  {action.emoji}
                </motion.div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold"
                >
                  <span>+{xpGained} XP</span>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    💪
                  </motion.span>
                </motion.div>
                
                <p className="text-sm text-gray-600 mt-3">
                  {action.description}
                </p>
              </motion.div>
            )}

            {/* Feedback nouveau niveau */}
            {currentStep === 'level' && newLevel && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-5xl mb-4"
                >
                  {newLevel.emoji}
                </motion.div>
                
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-gray-900 mb-2"
                >
                  🌟 Niveau supérieur !
                </motion.h3>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-bold text-lg mb-3"
                >
                  {newLevel.title}
                </motion.div>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-sm text-gray-600"
                >
                  {newLevel.description}
                </motion.p>
                
                {newLevel.rewards && newLevel.rewards.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-4 p-3 bg-blue-50 rounded-lg"
                  >
                    <p className="text-xs text-blue-800 font-medium mb-1">
                      🎁 Nouvelles récompenses :
                    </p>
                    <ul className="text-xs text-blue-700">
                      {newLevel.rewards.map((reward, index) => (
                        <li key={index}>• {reward}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Feedback nouveaux badges */}
            {currentStep === 'badges' && newBadges.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <motion.h3
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-xl font-bold text-gray-900 mb-4"
                >
                  🏆 Nouveau{newBadges.length > 1 ? 'x' : ''} badge{newBadges.length > 1 ? 's' : ''} !
                </motion.h3>
                
                <div className="space-y-3">
                  {newBadges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 1, 
                          delay: index * 0.2 + 0.5,
                          ease: "easeOut"
                        }}
                        className="text-3xl"
                      >
                        {badge.emoji}
                      </motion.div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {badge.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {badge.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: newBadges.length * 0.2 + 0.5 }}
                  className="text-sm text-gray-600 mt-4"
                >
                  Continue, tu inspires déjà d'autres étudiants ! 🌟
                </motion.p>
              </motion.div>
            )}

            {/* Bouton fermer */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => {
                setShowFeedback(false);
                onComplete?.();
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


