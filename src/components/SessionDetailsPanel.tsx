'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, FileText, RotateCcw, Clock, Target, BookOpen } from 'lucide-react';
import { StudySession } from '@/types';
import { VideoProgressService } from '@/lib/video-progress-service';

interface SessionDetailsPanelProps {
  session: StudySession | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchVideo: (session: StudySession) => void;
  onLaunchQuiz: (session: StudySession) => void;
  onReschedule: (session: StudySession) => void;
  onProgressUpdate?: (updatedSession: StudySession) => void;
}

export function SessionDetailsPanel({
  session,
  isOpen,
  onClose,
  onLaunchVideo,
  onLaunchQuiz,
  onReschedule,
  onProgressUpdate
}: SessionDetailsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Gestion du clic à l'extérieur pour fermer le panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Gestion de l'ESC pour fermer
      const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscapeKey);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  if (!session) return null;

  const progressMessage = VideoProgressService.getProgressMessage(session);
  const progressColor = VideoProgressService.getProgressColor(session);
  const progressBarColor = VideoProgressService.getProgressBarColor(session);
  const canLaunch = VideoProgressService.canLaunchSession(session);

  // Déterminer l'objectif d'apprentissage basé sur le type de session
  const getLearningObjective = (session: StudySession): string => {
    switch (session.type) {
      case 'lesson':
        return `Maîtriser les concepts fondamentaux de ${session.lessonName || session.courseName}`;
      case 'review':
        return `Consolider et réviser les acquis de ${session.courseName}`;
      case 'practice':
        return `Appliquer les connaissances par la pratique et les exercices`;
      case 'bonus-review':
        return `Approfondir et perfectionner sa compréhension`;
      case 'break':
        return `Pause récupératrice pour optimiser l'apprentissage`;
      default:
        return `Progresser dans l'apprentissage de ${session.courseName}`;
    }
  };

  // Calculer la durée détaillée
  const getDurationDetails = (session: StudySession): string => {
    const totalMinutes = session.duration;
    if (session.type === 'break') {
      return `${totalMinutes} min de pause`;
    }
    
    const videoMinutes = Math.floor(totalMinutes * 0.7); // 70% vidéo
    const quizMinutes = totalMinutes - videoMinutes; // 30% quiz/exercices
    
    return `${videoMinutes} min de vidéo + ${quizMinutes} min de quiz`;
  };

  // Obtenir l'icône de statut
  const getStatusIcon = () => {
    switch (session.status) {
      case 'completed':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'missed':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      case 'today':
        return <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>;
      case 'rescheduled':
        return <div className="w-3 h-3 bg-orange-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-300 rounded-full"></div>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 20, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-50 px-4 py-4 sm:px-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {session.lessonName || session.courseName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {session.courseName}
                    {session.lessonName && ` • ${session.type === 'lesson' ? 'Leçon' : 
                      session.type === 'review' ? 'Révision' : 
                      session.type === 'practice' ? 'Pratique' : 'Bonus'}`}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Informations principales */}
              <div className="space-y-4">
                {/* Objectif d'apprentissage */}
                <div className="flex items-start gap-3">
                  <BookOpen size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Objectif d'apprentissage</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {getLearningObjective(session)}
                    </p>
                  </div>
                </div>

                {/* Durée prévue */}
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Durée prévue</h4>
                    <p className="text-sm text-gray-600">
                      {getDurationDetails(session)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Programmé de {session.startTime} à {session.endTime}
                    </p>
                  </div>
                </div>

                {/* Difficulté */}
                <div className="flex items-start gap-3">
                  <Target size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Niveau de difficulté</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        session.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        session.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {session.difficulty === 'easy' ? 'Facile' :
                         session.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progression et actions */}
              <div className="space-y-4">
                {/* Progression actuelle */}
                {canLaunch && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Progression actuelle</h4>
                    
                    {/* Barre de progression vidéo */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className={progressColor}>📺 Vidéo</span>
                        <span className={progressColor}>{progressMessage}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${session.videoProgressPercentage}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${progressBarColor.replace('bg-', 'bg-')}`}
                        />
                      </div>
                    </div>

                    {/* Quiz progression (simulation) */}
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">📝 Quiz</span>
                        <span className="text-gray-600">
                          {session.videoProgressPercentage >= 100 ? 'Disponible' : 'Verrouillé'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          session.videoProgressPercentage >= 100 ? 'bg-blue-500' : 'bg-gray-300'
                        }`} 
                        style={{ width: session.videoProgressPercentage >= 100 ? '0%' : '0%' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions rapides */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Actions rapides</h4>
                  
                  {/* Bouton Lancer la vidéo */}
                  {canLaunch && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onLaunchVideo(session)}
                      className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Play size={20} />
                      <span className="font-medium">Lancer la vidéo</span>
                      <span className="ml-auto text-blue-200 text-sm">
                        {session.videoProgressPercentage}%
                      </span>
                    </motion.button>
                  )}

                  {/* Bouton Quiz */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onLaunchQuiz(session)}
                    disabled={session.videoProgressPercentage < 100}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      session.videoProgressPercentage >= 100
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FileText size={20} />
                    <span className="font-medium">Quiz / Exercices</span>
                    {session.videoProgressPercentage < 100 && (
                      <span className="ml-auto text-xs">Terminez d'abord la vidéo</span>
                    )}
                  </motion.button>

                  {/* Bouton Reprogrammer */}
                  {(session.status === 'missed' || session.status === 'upcoming') && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onReschedule(session)}
                      className="w-full flex items-center gap-3 p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                    >
                      <RotateCcw size={20} />
                      <span className="font-medium">Reprogrammer la session</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
