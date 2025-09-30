'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Clock, AlertCircle } from 'lucide-react';

interface LessonVideoPreviewProps {
  lesson: {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string;
  };
  onClose: () => void;
  onShowUpsell: (lessonId: string) => void;
}

const PREVIEW_DURATION = 600; // 10 minutes in seconds
const WARNING_TIME = 570; // 9:30 in seconds (30 seconds before end)

export function LessonVideoPreview({ lesson, onClose, onShowUpsell }: LessonVideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showUpsellOverlay, setShowUpsellOverlay] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Récupérer le temps de reprise depuis localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem(`preview_time_${lesson.id}`);
    if (savedTime) {
      const time = parseInt(savedTime, 10);
      if (time < PREVIEW_DURATION) {
        setCurrentTime(time);
      }
    }
  }, [lesson.id]);

  // Timer principal
  useEffect(() => {
    if (isPlaying && currentTime < PREVIEW_DURATION) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // Sauvegarder la progression
          localStorage.setItem(`preview_time_${lesson.id}`, newTime.toString());
          
          // Afficher le toast d'avertissement à 9:30
          if (newTime === WARNING_TIME) {
            setShowWarningToast(true);
          }
          
          // Fin de l'aperçu à 10:00
          if (newTime >= PREVIEW_DURATION) {
            setIsPlaying(false);
            setShowUpsellOverlay(true);
            return PREVIEW_DURATION;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentTime, lesson.id]);

  // Fermer le toast d'avertissement après 5 secondes
  useEffect(() => {
    if (showWarningToast) {
      const timer = setTimeout(() => {
        setShowWarningToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWarningToast]);

  const handlePlayPause = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setIsPlaying(!isPlaying);
  };

  const handleUnlock = () => {
    onShowUpsell(lesson.id);
  };

  const handleClose = () => {
    setIsPlaying(false);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = PREVIEW_DURATION - currentTime;
  const progressPercentage = (currentTime / PREVIEW_DURATION) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Aperçu - {lesson.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} />
              <span>Temps restant: {formatTime(remainingTime)}</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Area */}
        <div className="aspect-video bg-gray-900 relative">
          {!hasStarted ? (
            // État initial
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play size={32} className="ml-1" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Aperçu gratuit - 10 minutes</h4>
                <p className="text-gray-300 mb-6">
                  {lesson.description || "Découvrez un extrait de cette leçon"}
                </p>
                <button
                  onClick={handlePlayPause}
                  className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Commencer l'aperçu
                </button>
              </div>
            </div>
          ) : (
            // Lecteur vidéo (simulation)
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                {lesson.videoUrl ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={lesson.videoUrl}
                    autoPlay={isPlaying}
                    muted
                  />
                ) : (
                  <>
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Simulation Vidéo</h4>
                    <p className="text-gray-300 mb-4">
                      {lesson.title} - Temps: {formatTime(currentTime)}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Contrôles vidéo */}
          {hasStarted && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
              {/* Barre de progression */}
              <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              {/* Contrôles */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                  </button>
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(PREVIEW_DURATION)}
                  </span>
                </div>
                <div className="text-sm">
                  Aperçu gratuit - {formatTime(remainingTime)} restant
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toast d'avertissement à 9:30 */}
        <AnimatePresence>
          {showWarningToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-24 left-4 right-4 bg-orange-500 text-white p-4 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3">
                <AlertCircle size={20} />
                <div className="flex-1">
                  <p className="font-semibold">Il te reste 30 sec d'aperçu</p>
                  <p className="text-sm text-orange-100">Débloque le cours pour continuer</p>
                </div>
                <button
                  onClick={handleUnlock}
                  className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  Débloquer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay d'upsell à la fin */}
        <AnimatePresence>
          {showUpsellOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-md w-full mx-4 p-6 text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={24} className="text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Aperçu terminé</h4>
                <p className="text-gray-600 mb-6">
                  Tu as vu un aperçu de {formatTime(PREVIEW_DURATION)}. Débloque maintenant l'accès complet pour continuer ton apprentissage !
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleUnlock}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    🔓 Débloquer le cours complet
                  </button>
                  <button
                    onClick={() => {
                      setShowUpsellOverlay(false);
                      onShowUpsell(lesson.id);
                    }}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Voir l'offre Pack
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full text-gray-500 py-2 px-4 rounded-xl font-medium hover:text-gray-700 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}




