'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play,
  CheckCircle2,
  Circle,
  ChevronRight,
  Clock,
  BookOpen,
  Trophy
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface TrackProgressViewProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
  onStartLesson?: (lessonId: string) => void;
}

export function TrackProgressView({ 
  isOpen, 
  onClose, 
  trackTitle,
  onStartLesson
}: TrackProgressViewProps) {
  const [lessons] = useState<Lesson[]>([
    { id: 'l1', title: 'Introduction aux concepts', duration: '12 min', isCompleted: true, isCurrent: false },
    { id: 'l2', title: 'Les fondamentaux', duration: '18 min', isCompleted: true, isCurrent: false },
    { id: 'l3', title: 'Applications pratiques', duration: '25 min', isCompleted: true, isCurrent: false },
    { id: 'l4', title: 'Exercices guidés', duration: '20 min', isCompleted: true, isCurrent: false },
    { id: 'l5', title: 'Théorème principal', duration: '22 min', isCompleted: false, isCurrent: true },
    { id: 'l6', title: 'Cas particuliers', duration: '15 min', isCompleted: false, isCurrent: false },
    { id: 'l7', title: 'Révisions & synthèse', duration: '18 min', isCompleted: false, isCurrent: false },
  ]);

  const completedCount = lessons.filter(l => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);
  const currentLesson = lessons.find(l => l.isCurrent);
  const totalDuration = lessons.reduce((acc, l) => acc + parseInt(l.duration), 0);

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
          className="bg-white rounded-2xl overflow-hidden w-full max-w-md max-h-[85vh] flex flex-col shadow-xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Play size={16} className="text-white ml-0.5" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Avancer</h2>
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

            {/* Progress Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Progression</span>
                <span className="text-xs font-bold text-gray-900">{progressPercent}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gray-900 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>{completedCount}/{lessons.length} leçons</span>
                <span>{totalDuration} min au total</span>
              </div>
            </div>
          </div>

          {/* Current Lesson CTA */}
          {currentLesson && (
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                Étape suivante
              </p>
              <button
                onClick={() => onStartLesson?.(currentLesson.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Play size={16} className="ml-0.5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{currentLesson.title}</p>
                    <p className="text-xs text-gray-400">{currentLesson.duration}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Lessons List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-3">
              Parcours complet
            </p>
            <div className="space-y-1">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => lesson.isCompleted || lesson.isCurrent ? onStartLesson?.(lesson.id) : null}
                  disabled={!lesson.isCompleted && !lesson.isCurrent}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    lesson.isCurrent 
                      ? 'bg-blue-50 border border-blue-100' 
                      : lesson.isCompleted
                        ? 'hover:bg-gray-50'
                        : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    lesson.isCompleted 
                      ? 'bg-gray-900 text-white'
                      : lesson.isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {lesson.isCompleted ? (
                      <CheckCircle2 size={12} />
                    ) : lesson.isCurrent ? (
                      <Play size={10} className="ml-0.5" />
                    ) : (
                      <span className="text-[10px] font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      lesson.isCompleted ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Clock size={10} />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                  {lesson.isCurrent && (
                    <span className="text-[10px] font-medium text-blue-600">En cours</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          {progressPercent === 100 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Trophy size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Cours terminé !</p>
                  <p className="text-xs text-gray-500">Félicitations pour ton parcours</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

