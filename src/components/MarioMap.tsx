'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Play, 
  Lock, 
  Star, 
  Trophy, 
  Target,
  Clock,
  ArrowRight,
  Crown,
  Zap,
  BookOpen,
  Award,
  Users
} from 'lucide-react';
import { Course, Lesson } from '@/types';
import BackgroundSelector from './BackgroundSelector';

interface MarioMapProps {
  course: Course;
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
  onClose: () => void;
}

// Configuration du parcours - positions des leçons sur la map (full-width)
const getLessonPosition = (index: number, total: number) => {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1400;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  // Plus de leçons par rangée pour utiliser toute la largeur
  const lessonsPerRow = Math.max(3, Math.min(5, Math.floor(viewportWidth / 250)));
  const rows = Math.ceil(total / lessonsPerRow);
  const row = Math.floor(index / lessonsPerRow);
  const col = index % lessonsPerRow;
  
  // Alternance en zigzag pour un parcours naturel
  const isEvenRow = row % 2 === 0;
  const actualCol = isEvenRow ? col : lessonsPerRow - 1 - col;
  
  // Espacement dynamique basé sur la largeur d'écran
  const horizontalSpacing = Math.max(200, (viewportWidth - 200) / lessonsPerRow);
  const verticalSpacing = Math.max(180, Math.min(250, (viewportHeight - 300) / Math.max(1, rows - 1)));
  
  return {
    x: actualCol * horizontalSpacing + horizontalSpacing / 2,
    y: row * verticalSpacing + 150,
    row,
    col: actualCol
  };
};

// Chemin SVG entre deux points
const createPath = (from: {x: number, y: number}, to: {x: number, y: number}) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  return `M ${from.x} ${from.y} Q ${midX} ${midY - 30} ${to.x} ${to.y}`;
};

export function MarioMap({ course, lessons, onSelectLesson, onClose }: MarioMapProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [hoveredLesson, setHoveredLesson] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>('default');

  // Debug
  console.log('MarioMap - Course:', course);
  console.log('MarioMap - Lessons:', lessons);

  // Calculer le nombre total de leçons terminées
  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const progressPercent = (completedLessons / lessons.length) * 100;

  // Trouver la leçon actuelle (première non terminée)
  const currentLesson = lessons.find(lesson => !lesson.isCompleted && lesson.isAccessible);

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isAccessible) {
      setSelectedLesson(lesson);
      onSelectLesson(lesson);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Arrière-plan dynamique */}
      {selectedBackground !== 'default' ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(/course-backgrounds/${selectedBackground}.svg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-white noise-texture" />
      )}
      
      {/* Overlay pour améliorer la lisibilité */}
      {selectedBackground !== 'default' && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />
      )}
      
      {/* Sélecteur d'arrière-plan */}
      <BackgroundSelector 
        selectedBackground={selectedBackground}
        onBackgroundChange={setSelectedBackground}
      />
      {/* Header Premium - Noir élégant */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-black to-gray-800 text-white p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ArrowRight size={18} className="rotate-180 text-white" />
            </button>
            
            <div>
              <h1 className="text-2xl font-light mb-1 text-white">{course.title}</h1>
              <p className="text-gray-300 font-light">Parcours d'apprentissage • {lessons.length} étapes</p>
            </div>
          </div>

          {/* Progression globale Premium */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={16} className="text-white" />
                <span className="text-sm font-medium text-gray-300">
                  {completedLessons}/{lessons.length} terminées
                </span>
              </div>
              <div className="w-40 bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-white h-full rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl font-semibold shadow-lg">
              <Trophy size={16} />
              <span className="text-sm">Niveau {Math.floor(progressPercent / 20) + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map principale */}
      <div className="pt-24 pb-8 h-full overflow-auto">
        <div className="relative w-full min-h-full">
          {/* SVG pour les chemins */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="pathGradientPremium" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#374151" />
              </linearGradient>
              <filter id="pathShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.1"/>
              </filter>
            </defs>
            
            {lessons.slice(0, -1).map((lesson, index) => {
              const from = getLessonPosition(index, lessons.length);
              const to = getLessonPosition(index + 1, lessons.length);
              const isCompleted = lesson.isCompleted;
              
              return (
                <motion.path
                  key={`path-${index}`}
                  d={createPath(from, to)}
                  stroke={isCompleted ? "url(#pathGradientPremium)" : "#e5e7eb"}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={isCompleted ? "0" : "16 16"}
                  strokeLinecap="round"
                  filter={isCompleted ? "url(#pathShadow)" : "none"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                />
              );
            })}
          </svg>

          {/* Leçons */}
          <div className="relative" style={{ zIndex: 1 }}>
            {lessons.map((lesson, index) => {
              const position = getLessonPosition(index, lessons.length);
              const isHovered = hoveredLesson === lesson.id;
              const isCurrent = currentLesson?.id === lesson.id;
              
              return (
                <motion.div
                  key={lesson.id}
                  className="absolute"
                  style={{
                    left: position.x - 90,
                    top: position.y - 90,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Leçon bubble Premium */}
                  <motion.div
                    className={`
                      relative w-28 h-28 rounded-full cursor-pointer border-4 transition-all duration-300 hover-lift
                      ${lesson.isCompleted 
                        ? 'bg-black border-gray-800 shadow-xl' 
                        : lesson.isOwned
                          ? isCurrent 
                            ? 'bg-gray-800 border-black shadow-xl animate-pulse'
                            : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-lg'
                          : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                      }
                      ${isHovered && lesson.isOwned ? 'scale-110 shadow-2xl' : ''}
                    `}
                    onClick={() => handleLessonClick(lesson)}
                    onMouseEnter={() => setHoveredLesson(lesson.id)}
                    onMouseLeave={() => setHoveredLesson(null)}
                    whileHover={lesson.isOwned ? { scale: 1.1 } : {}}
                    whileTap={lesson.isOwned ? { scale: 0.95 } : {}}
                  >
                    {/* Icône de la leçon Premium */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {lesson.isCompleted ? (
                        <CheckCircle className="text-white" size={36} />
                      ) : lesson.isOwned ? (
                        isCurrent ? (
                          <Play className="text-white" size={32} />
                        ) : (
                          <BookOpen className="text-gray-700" size={32} />
                        )
                      ) : (
                        <Lock className="text-gray-400" size={32} />
                      )}
                    </div>

                    {/* Numéro de la leçon Premium */}
                    <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full border-3 border-black flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-black">{lesson.order}</span>
                    </div>

                    {/* Badge spécial pour leçon actuelle Premium */}
                    {isCurrent && (
                      <motion.div
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="bg-black text-white text-sm px-4 py-2 rounded-xl font-semibold shadow-xl border border-gray-200">
                          En cours
                        </div>
                      </motion.div>
                    )}

                    {/* Animation pulse pour leçon terminée */}
                    {lesson.isCompleted && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white"
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </motion.div>

                  {/* Info card au hover Premium - Version enrichie */}
                  <AnimatePresence>
                    {isHovered && lesson.isAccessible && (
                      <motion.div
                        className="absolute top-36 left-1/2 transform -translate-x-1/2 w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden z-20"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                      >
                        {/* Header avec gradient */}
                        <div className="bg-gradient-to-r from-black to-gray-700 text-white p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <BookOpen className="text-white" size={24} />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold bg-white text-black px-3 py-1 rounded-full">
                                  Leçon {lesson.order}
                                </span>
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                  lesson.order <= 2 ? 'bg-green-500/20 text-green-200' :
                                  lesson.order <= 4 ? 'bg-yellow-500/20 text-yellow-200' :
                                  'bg-red-500/20 text-red-200'
                                }`}>
                                  {lesson.order <= 2 ? '★ Facile' : lesson.order <= 4 ? '★★ Moyen' : '★★★ Avancé'}
                                </span>
                                {lesson.isCompleted && (
                                  <span className="text-xs font-medium bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle size={12} />
                                    Terminée
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{lesson.title}</h3>
                              <p className="text-gray-300 text-sm line-clamp-2">{lesson.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Stats détaillées */}
                        <div className="p-6">
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Clock className="text-white" size={18} />
                              </div>
                              <div className="text-sm font-semibold text-black">{lesson.duration}</div>
                              <div className="text-xs text-gray-500">Durée</div>
                            </div>
                            <div className="text-center">
                              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Users className="text-white" size={18} />
                              </div>
                              <div className="text-sm font-semibold text-black">{85 + lesson.order * 3}%</div>
                              <div className="text-xs text-gray-500">Taux réussite</div>
                            </div>
                            <div className="text-center">
                              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Zap className="text-white" size={18} />
                              </div>
                              <div className="text-sm font-semibold text-black">+{lesson.order * 50}</div>
                              <div className="text-xs text-gray-500">Points XP</div>
                            </div>
                          </div>

                          {/* Progression vs autres étudiants */}
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Votre position</span>
                              <span className="text-sm text-gray-500">Top {15 + lesson.order * 5}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-black h-2 rounded-full" 
                                style={{ width: `${Math.max(20, 90 - lesson.order * 10)}%` }}
                              />
                            </div>
                          </div>

                          {/* Prérequis ou recommandations */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="text-black" size={16} />
                              <span className="text-sm font-semibold text-black">
                                {lesson.isCompleted ? 'Bravo !' : lesson.order === 1 ? 'Prérequis' : 'Recommandé'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {lesson.isCompleted 
                                ? `Excellent ! Vous maîtrisez cette leçon. Continuez avec la leçon ${lesson.order + 1} pour progresser.`
                                : lesson.order === 1 
                                  ? 'Aucun prérequis. Parfait pour débuter !'
                                  : `Complétez d'abord les leçons 1-${lesson.order - 1} pour une meilleure compréhension.`
                              }
                            </p>
                          </div>

                          {/* Actions rapides */}
                          <div className="flex gap-3 mt-6">
                            {lesson.isCompleted ? (
                              <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                                Réviser
                              </button>
                            ) : (
                              <button className="flex-1 bg-black text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                                Commencer
                              </button>
                            )}
                            <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                              <Award size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Récompenses et jalons Premium */}
          {[25, 50, 75, 100].map((milestone) => {
            const isReached = progressPercent >= milestone;
            const milestoneIndex = Math.floor((lessons.length * milestone) / 100) - 1;
            
            if (milestoneIndex < 0 || milestoneIndex >= lessons.length) return null;
            
            const position = getLessonPosition(milestoneIndex, lessons.length);
            
            return (
              <motion.div
                key={milestone}
                className="absolute"
                style={{
                  left: position.x + 60,
                  top: position.y - 30,
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: isReached ? 1 : 0.6, rotate: 0 }}
                transition={{ delay: milestoneIndex * 0.15 + 0.8, type: "spring" }}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-3 border-white shadow-xl
                  ${isReached 
                    ? 'bg-black' 
                    : 'bg-gray-200'
                  }
                `}>
                  <Star className={isReached ? 'text-white' : 'text-gray-400'} size={20} />
                </div>
                {isReached && (
                  <motion.div 
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-black bg-white px-2 py-1 rounded-full shadow-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: milestoneIndex * 0.15 + 1.2 }}
                  >
                    {milestone}%
                  </motion.div>
                )}
                
                {/* Animation particules pour jalons atteints */}
                {isReached && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-black"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
