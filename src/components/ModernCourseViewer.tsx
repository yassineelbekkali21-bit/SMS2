'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Play,
  Lock,
  Target,
  BookOpen,
  MessageCircle,
  Clock,
  CheckCircle,
  X,
  Award,
  Users,
  TrendingUp,
  ArrowUpRight,
  Pause,
  Volume2,
  Maximize,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { Course, Lesson, User } from '@/types';
import { WhatsAppIntegration } from './WhatsAppIntegration';

interface ModernCourseViewerProps {
  course: Course | null;
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  onBackToMap: () => void;
  user?: User;
  progress?: number;
}

export function ModernCourseViewer({
  course,
  lesson,
  isOpen,
  onClose,
  onBackToMap,
  user,
  progress = 0
}: ModernCourseViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(156); // 2:36
  const [duration, setDuration] = useState(1847); // 30:47
  const [volume, setVolume] = useState(0.8);
  const [showControls, setShowControls] = useState(true);

  // Animation pour masquer les contrôles après inactivité
  useEffect(() => {
    if (isPlaying && showControls) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, showControls]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  if (!isOpen || !lesson) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white"
      >
        {/* Header Navigation */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between p-6">
            <button
              onClick={onBackToMap}
              className="flex items-center gap-3 text-white hover:text-gray-200 transition-colors group"
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ArrowLeft size={20} />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">Retour au parcours</div>
                <div className="text-xs text-gray-300">{course?.title}</div>
              </div>
            </button>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">En direct</span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="h-full flex">
          {/* Video Section - Cinematic */}
          <div className="flex-1 relative bg-black">
            {/* Video Player */}
            <div 
              className="h-full relative overflow-hidden cursor-pointer"
              onClick={() => setShowControls(!showControls)}
              onMouseMove={() => setShowControls(true)}
            >
              {/* Placeholder Video */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                    {isPlaying ? (
                      <Pause size={32} className="text-white" />
                    ) : (
                      <Play size={32} className="text-white ml-1" />
                    )}
                  </div>
                  <h3 className="text-white text-xl font-medium mb-2">{lesson.title}</h3>
                  <p className="text-gray-300 text-sm">Cliquez pour {isPlaying ? 'mettre en pause' : 'démarrer'}</p>
                </motion.div>
              </div>

              {/* Video Controls Overlay */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    {/* Bottom Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full bg-white/20 rounded-full h-1 mb-2">
                          <motion.div 
                            className="bg-white h-1 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-white text-sm">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsPlaying(!isPlaying);
                            }}
                            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          >
                            {isPlaying ? (
                              <Pause size={20} className="text-white" />
                            ) : (
                              <Play size={20} className="text-white ml-0.5" />
                            )}
                          </button>
                          
                          <div className="flex items-center gap-2">
                            <Volume2 size={16} className="text-white" />
                            <div className="w-20 bg-white/20 rounded-full h-1">
                              <div 
                                className="bg-white h-1 rounded-full"
                                style={{ width: `${volume * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Settings size={16} className="text-white" />
                          </button>
                          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Maximize size={16} className="text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar - Clean & Modern */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            className="w-96 bg-white border-l border-gray-100 flex flex-col"
          >
            {/* Lesson Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{lesson.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target size={14} />
                      <span>Leçon {lesson.order}</span>
                    </div>
                  </div>
                </div>
                <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <MoreHorizontal size={14} className="text-gray-600" />
                </button>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-medium text-gray-900">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-100">
                <button className="flex-1 py-4 px-4 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
                  Contenu
                </button>
                <button className="flex-1 py-4 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Communauté
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-8">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen size={16} className="text-blue-500" />
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Learning Objectives */}
                  {lesson.objectives && lesson.objectives.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Target size={16} className="text-green-500" />
                        Objectifs d'apprentissage
                      </h3>
                      <div className="space-y-3">
                        {lesson.objectives.map((objective, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">{objective}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Award size={16} className="text-orange-500" />
                        Prérequis
                      </h3>
                      <div className="space-y-2">
                        {lesson.prerequisites.map((prerequisite, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{prerequisite}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Community */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageCircle size={16} className="text-green-500" />
                      Rejoindre la communauté
                    </h3>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <MessageCircle className="text-white" size={14} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              Une question ?
                            </div>
                            <div className="text-green-700 text-xs">
                              +124 étudiants actifs
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                        Rejoindre WhatsApp
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm font-medium">Terminer</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Play size={16} />
                  <span className="text-sm font-medium">Suivant</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}






