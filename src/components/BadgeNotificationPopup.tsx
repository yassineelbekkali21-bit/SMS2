'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, Sparkles } from 'lucide-react';
import { BadgeNotification } from '@/types';

interface BadgeNotificationPopupProps {
  notification: BadgeNotification | null;
  onDismiss?: () => void;
}

export function BadgeNotificationPopup({ notification, onDismiss }: BadgeNotificationPopupProps) {
  if (!notification || !notification.isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            delay: 0.1 
          }}
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti Animation Background */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: Math.random() * 300 - 150,
                  y: Math.random() * 400 - 200
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0.5],
                  y: [0, -100, -200],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className={`absolute w-2 h-2 ${
                  i % 4 === 0 ? 'bg-yellow-400' :
                  i % 4 === 1 ? 'bg-pink-400' :
                  i % 4 === 2 ? 'bg-blue-400' : 'bg-green-400'
                } rounded-full`}
              />
            ))}
          </div>

          {/* Close Button */}
          {onDismiss && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDismiss}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </motion.button>
          )}

          <div className="text-center relative z-10">
            {/* Badge Icon avec Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.3 
              }}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1,
                  repeat: 2 
                }}
                className="text-3xl"
              >
                {notification.badge.icon}
              </motion.div>
              
              {/* Sparkles autour du badge */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-40px)`
                    }}
                  >
                    <Sparkles size={12} className="text-yellow-300" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Titre et Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Félicitations ! 🎉
              </h3>
              
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                  {notification.badge.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {notification.badge.description}
                </p>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                Tu viens de débloquer un nouveau badge ! Continue comme ça, tu es sur la bonne voie.
              </p>

              {/* Bouton de Fermeture */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDismiss}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Continuer
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}




