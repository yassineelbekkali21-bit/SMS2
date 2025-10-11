'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Zap, Calendar, Clock, X } from 'lucide-react';
import { StudySession } from '@/types';

interface QuickRescheduleButtonProps {
  session: StudySession;
  onAutoReschedule?: (sessionId: string) => void;
  onManualReschedule?: (sessionId: string) => void;
  className?: string;
}

export function QuickRescheduleButton({ 
  session, 
  onAutoReschedule, 
  onManualReschedule,
  className = '' 
}: QuickRescheduleButtonProps) {
  const [showOptions, setShowOptions] = useState(false);

  // Afficher seulement pour les sessions manquées
  if (session.status !== 'missed') return null;

  const handleAutoReschedule = () => {
    if (onAutoReschedule) {
      onAutoReschedule(session.id);
    }
    setShowOptions(false);
  };

  const handleManualReschedule = () => {
    if (onManualReschedule) {
      onManualReschedule(session.id);
    }
    setShowOptions(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-xs font-medium transition-colors border border-orange-200"
      >
        <RotateCcw size={14} />
        Replanifier
      </motion.button>

      {/* Options de replanification */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50 min-w-64"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 text-sm">
                Replanifier cette session
              </h4>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOptions(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={14} className="text-gray-500" />
              </motion.button>
            </div>

            {/* Info de la session */}
            <div className="bg-gray-50 rounded-lg p-2 mb-3">
              <p className="text-xs font-medium text-gray-700 mb-1">
                {session.courseName}
              </p>
              <p className="text-xs text-gray-600">
                {session.lessonName || session.topic}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Durée: {session.duration} min
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {/* Replanification automatique */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAutoReschedule}
                className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Automatique
                  </p>
                  <p className="text-xs text-gray-600">
                    Le système trouve le meilleur créneau avant l'examen
                  </p>
                </div>
              </motion.button>

              {/* Replanification manuelle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleManualReschedule}
                className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Manuelle
                  </p>
                  <p className="text-xs text-gray-600">
                    Tu choisis le nouveau créneau disponible
                  </p>
                </div>
              </motion.button>
            </div>

            {/* Footer */}
            <div className="mt-3 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                💡 Plus tu reprogrammes vite, mieux c'est !
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay pour fermer */}
      {showOptions && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
}






