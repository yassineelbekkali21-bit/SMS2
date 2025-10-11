'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, TrendingUp } from 'lucide-react';
import { Buddy } from '@/lib/buddy-data';

interface BuddyProgressSnapshotProps {
  buddy: Buddy | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BuddyProgressSnapshot({ buddy, isOpen, onClose }: BuddyProgressSnapshotProps) {
  if (!buddy) return null;

  const getLastActivityText = () => {
    if (buddy.isActive) {
      return "A étudié hier soir";
    } else if (buddy.courseProgress > 80) {
      return "Presque terminé !";
    } else if (buddy.joinedRecently) {
      return "Vient de commencer";
    } else {
      return "En pause actuellement";
    }
  };

  const getProgressColor = () => {
    if (buddy.courseProgress >= 80) return "text-green-600";
    if (buddy.courseProgress >= 50) return "text-blue-600";
    if (buddy.courseProgress >= 25) return "text-amber-600";
    return "text-gray-600";
  };

  const getProgressBgColor = () => {
    if (buddy.courseProgress >= 80) return "bg-green-100";
    if (buddy.courseProgress >= 50) return "bg-blue-100";
    if (buddy.courseProgress >= 25) return "bg-amber-100";
    return "bg-gray-100";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec photo et nom */}
            <div className="relative p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
                    style={{
                      backgroundImage: `url(${buddy.avatar})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  {buddy.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{buddy.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock size={12} />
                    {getLastActivityText()}
                  </p>
                </div>
              </div>
            </div>

            {/* Progression */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <TrendingUp size={14} />
                    Progression du cours
                  </span>
                  <span className={`text-lg font-bold ${getProgressColor()}`}>
                    {buddy.courseProgress}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${buddy.courseProgress}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${getProgressBgColor().replace('bg-', 'bg-gradient-to-r from-').replace('-100', '-400 to-').replace('-100', '-500')}`}
                  />
                </div>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className={`p-3 rounded-xl ${getProgressBgColor()}`}>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getProgressColor()}`}>
                      {Math.round(buddy.courseProgress / 25)}
                    </div>
                    <div className="text-xs text-gray-600">Modules terminés</div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-xl ${buddy.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${buddy.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                      {buddy.isActive ? '🔥' : '⏸️'}
                    </div>
                    <div className="text-xs text-gray-600">
                      {buddy.isActive ? 'Actif' : 'En pause'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message d'encouragement */}
              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 text-center">
                  {buddy.courseProgress >= 80 
                    ? `${buddy.name} maîtrise presque ce cours ! 🎯`
                    : buddy.isActive 
                      ? `${buddy.name} progresse régulièrement 💪`
                      : `Peut-être motiver ${buddy.name} ? 😊`
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
