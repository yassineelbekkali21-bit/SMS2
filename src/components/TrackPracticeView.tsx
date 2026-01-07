'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Brain,
  Swords,
  ChevronRight,
  Zap,
  Target,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

interface TrackPracticeViewProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
  // Callbacks for navigation
  onOpenQuizRapide?: () => void;
  onOpenQuizApprofondi?: () => void;
  onOpenExamBlanc?: () => void;
  onOpenDuel?: () => void;
}

export function TrackPracticeView({ 
  isOpen, 
  onClose, 
  trackTitle,
  onOpenQuizRapide,
  onOpenQuizApprofondi,
  onOpenExamBlanc,
  onOpenDuel
}: TrackPracticeViewProps) {
  const [activeMode, setActiveMode] = useState<'solo' | null>(null);

  // Stats (mock data)
  const stats = {
    quizDone: 24,
    successRate: 78,
    victories: 5
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl overflow-hidden w-full max-w-md max-h-[90vh] flex flex-col shadow-xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Target size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">S'entraîner</h2>
                  <p className="text-xs text-gray-500">{trackTitle}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!activeMode ? (
              // === ÉCRAN 1: POINT D'ENTRÉE ===
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-6">
                  Choisis comment tu veux progresser aujourd'hui.
                </p>

                <div className="space-y-3">
                  {/* Quiz Solo */}
                  <button
                    onClick={() => setActiveMode('solo')}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <Brain size={22} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Quiz solo</h3>
                      <p className="text-sm text-gray-500">Tester et renforcer tes connaissances à ton rythme</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Duel */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDuel?.();
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <Swords size={22} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Duel</h3>
                      <p className="text-sm text-gray-500">Affronte un autre étudiant en temps réel sur des quiz</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
                    Tes statistiques
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-gray-900">{stats.quizDone}</p>
                      <p className="text-xs text-gray-500">Quiz faits</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                      <p className="text-xs text-gray-500">Réussite</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-gray-900">{stats.victories}</p>
                      <p className="text-xs text-gray-500">Victoires</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // === QUIZ SOLO: 3 CHOIX ===
              <div className="p-6">
                <button
                  onClick={() => setActiveMode(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Retour
                </button>

                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz solo</h3>
                  <p className="text-sm text-gray-500">
                    Choisis ton type d'entraînement
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Quiz rapide */}
                  <button 
                    onClick={() => {
                      onClose();
                      onOpenQuizRapide?.();
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Zap size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Quiz rapide</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Réviser rapidement un concept · Feedback immédiat
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Quiz approfondi */}
                  <button 
                    onClick={() => {
                      onClose();
                      onOpenQuizApprofondi?.();
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Quiz approfondi</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Conditions proches d'un examen · Notation exigeante
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Examen blanc */}
                  <button 
                    onClick={() => {
                      onClose();
                      onOpenExamBlanc?.();
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Target size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Examen blanc</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Génère un examen complet personnalisé
                      </p>
                    </div>
                    <div className="px-2 py-1 bg-green-50 rounded-full">
                      <span className="text-[10px] font-medium text-green-600">Nouveau</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
