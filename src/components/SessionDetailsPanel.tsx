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
          className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
        >
          {/* Header SMS Style */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  {getStatusIcon()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {session.lessonName || session.courseName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {session.courseName}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content SMS Style - Plus compact et cohérent */}
          <div className="p-6">
            <div className="grid gap-6 lg:grid-cols-3">
              
              {/* Colonne 1: Informations essentielles */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-gray-700" />
                    Objectif d'apprentissage
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {getLearningObjective(session)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Durée prévue</span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium">
                    {getDurationDetails(session)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {session.startTime} - {session.endTime}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Target size={16} className="text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">Niveau:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    session.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {session.difficulty === 'easy' ? 'Facile' :
                     session.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                  </span>
                </div>
              </div>

              {/* Colonne 2: Progression */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-gray-900">Progression actuelle</h4>
                
                {/* Section Vidéo */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Play size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Vidéo</span>
                    </div>
                    <span className="text-xs text-gray-600">{progressMessage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${session.videoProgressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Section Quiz */}
                <div className={`rounded-lg p-4 ${
                  session.videoProgressPercentage >= 100 ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className={
                        session.videoProgressPercentage >= 100 ? 'text-green-600' : 'text-gray-400'
                      } />
                      <span className="text-sm font-medium text-gray-900">Quiz</span>
                    </div>
                    <span className={`text-xs ${
                      session.videoProgressPercentage >= 100 ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {session.videoProgressPercentage >= 100 ? 'Disponible' : 'Verrouillé'}
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${
                    session.videoProgressPercentage >= 100 ? 'bg-green-200' : 'bg-gray-200'
                  }`}>
                    <div className={`h-2 rounded-full w-0 ${
                      session.videoProgressPercentage >= 100 ? 'bg-green-600' : 'bg-gray-300'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* Colonne 3: Actions */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-gray-900">Actions rapides</h4>
                
                <div className="space-y-2">
                  {/* Bouton Lancer la vidéo */}
                  {canLaunch && (
                    <button
                      onClick={() => onLaunchVideo(session)}
                      className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <Play size={16} />
                      Lancer la vidéo
                      <span className="ml-auto text-xs opacity-80">{session.videoProgressPercentage}%</span>
                    </button>
                  )}

                  {/* Bouton Quiz */}
                  <button
                    onClick={() => onLaunchQuiz(session)}
                    disabled={session.videoProgressPercentage < 100}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      session.videoProgressPercentage >= 100
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FileText size={16} />
                    Quiz / Exercices
                    {session.videoProgressPercentage < 100 && (
                      <span className="ml-auto text-xs">Terminer d'abord la vidéo</span>
                    )}
                  </button>

                  {/* Bouton Reprogrammer */}
                  {(session.status === 'missed' || session.status === 'upcoming') && (
                    <button
                      onClick={() => onReschedule(session)}
                      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <RotateCcw size={16} />
                      Reprogrammer la session
                    </button>
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
