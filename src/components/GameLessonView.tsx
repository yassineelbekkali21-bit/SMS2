'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Settings,
  Maximize,
  CheckCircle,
  Star,
  Trophy,
  Zap,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
  User,
  Crown,
  Target,
  BookOpen,
  Clock,
  Award,
  Sparkles,
  Brain,
  Heart,
  Flag
} from 'lucide-react';
import { Lesson, PlayerProgress, VideoQuizQuestion } from '@/types';
// import { VideoQuizPlayer } from './VideoQuizPlayer'; // Temporairement désactivé
import { LessonQA } from './LessonQA';

interface GameLessonViewProps {
  lesson: Lesson;
  playerProgress: PlayerProgress;
  onBack: () => void;
  onComplete: (xpGained: number) => void;
  onProgress: (progress: number) => void;
}

interface CompletionCelebration {
  show: boolean;
  xpGained: number;
  newBadges: string[];
  levelUp: boolean;
  newLevel?: number;
}

// Composant de célébration de fin de leçon
const CompletionCelebration: React.FC<{
  celebration: CompletionCelebration;
  onClose: () => void;
}> = ({ celebration, onClose }) => {
  if (!celebration.show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          {/* Animation de confettis */}
          <div className="relative mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Trophy className="text-white" size={40} />
            </motion.div>
            
            {/* Particules animées */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 60]
                }}
                transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              />
            ))}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Félicitations ! 🎉
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-6"
          >
            Tu viens de terminer cette leçon avec brio !
          </motion.p>

          {/* XP gagné */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Zap className="text-yellow-600" size={24} />
              <span className="text-2xl font-bold text-gray-900">+{celebration.xpGained} XP</span>
            </div>
            <p className="text-sm text-gray-600">Points d'expérience gagnés</p>
          </motion.div>

          {/* Level up */}
          {celebration.levelUp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="text-yellow-600" size={20} />
                <span className="font-bold text-yellow-800">Niveau supérieur !</span>
              </div>
              <p className="text-sm text-yellow-700">Tu es maintenant niveau {celebration.newLevel}</p>
            </motion.div>
          )}

          {/* Nouveaux badges */}
          {celebration.newBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-6"
            >
              <h4 className="font-medium text-gray-900 mb-3">Nouveaux badges débloqués :</h4>
              <div className="flex justify-center gap-2">
                {celebration.newBadges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.4 + index * 0.2, type: "spring" }}
                    className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center"
                  >
                    <Award className="text-white" size={20} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-2xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Continuer l'aventure
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Composant pour la barre de progression de la leçon
const LessonProgressBar: React.FC<{
  progress: number;
  lesson: Lesson;
}> = ({ progress, lesson }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Progression de la leçon</span>
        <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <motion.div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{lesson.duration}</span>
        <span>+{lesson.xpReward} XP à la fin</span>
      </div>
    </div>
  );
};

export function GameLessonView({ 
  lesson, 
  playerProgress, 
  onBack, 
  onComplete, 
  onProgress 
}: GameLessonViewProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'community'>('content');
  const [lessonProgress, setLessonProgress] = useState(0);
  const [celebration, setCelebration] = useState<CompletionCelebration>({
    show: false,
    xpGained: 0,
    newBadges: [],
    levelUp: false
  });
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuizQuestions, setTotalQuizQuestions] = useState(0);

  // Simulation de progression automatique (à remplacer par la vraie logique vidéo)
  useEffect(() => {
    const interval = setInterval(() => {
      setLessonProgress(prev => {
        const newProgress = Math.min(prev + 1, 100);
        onProgress(newProgress);
        
        // Complétion automatique à 100%
        if (newProgress === 100 && prev < 100) {
          handleLessonComplete();
        }
        
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLessonComplete = () => {
    const xpGained = lesson.xpReward;
    const currentLevel = Math.floor(playerProgress.totalXP / 100) + 1;
    const newTotalXP = playerProgress.totalXP + xpGained;
    const newLevel = Math.floor(newTotalXP / 100) + 1;
    const levelUp = newLevel > currentLevel;

    // Simulation de nouveaux badges (logique à implémenter)
    const newBadges: string[] = [];
    if (lesson.difficulty === 'hard') {
      newBadges.push('Expert');
    }

    setCelebration({
      show: true,
      xpGained,
      newBadges,
      levelUp,
      newLevel: levelUp ? newLevel : undefined
    });

    onComplete(xpGained);
  };

  const handleCelebrationClose = () => {
    setCelebration(prev => ({ ...prev, show: false }));
    onBack();
  };

  const getDifficultyColor = () => {
    switch (lesson.difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
    }
  };

  const getDifficultyLabel = () => {
    switch (lesson.difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{lesson.title}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Leçon {lesson.order}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
                    {getDifficultyLabel()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* XP et progression */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Récompense</div>
              <div className="font-bold text-yellow-600 flex items-center gap-1">
                <Zap size={16} />
                +{lesson.xpReward} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="absolute inset-0 pt-24 pb-6 overflow-hidden">
        <div className="h-full flex flex-col gap-6 p-6">
          {/* Barre de progression */}
          <LessonProgressBar progress={lessonProgress} lesson={lesson} />

          {/* Lecteur vidéo principal */}
          <div className="flex-1 bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="h-2/3 bg-black relative">
              {lesson.videoUrl ? (
                <VideoQuizPlayer
                  videoUrl={lesson.videoUrl}
                  questions={lesson.videoQuizzes || []}
                  onQuizComplete={(score, total) => {
                    setQuizScore(score);
                    setTotalQuizQuestions(total);
                  }}
                  onProgress={(currentTime, duration) => {
                    const progress = (currentTime / duration) * 100;
                    setLessonProgress(progress);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Play size={64} className="mx-auto mb-4 opacity-50" />
                    <p>Contenu de la leçon</p>
                  </div>
                </div>
              )}
            </div>

            {/* Onglets */}
            <div className="h-1/3 flex flex-col">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'content'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📚 Contenu & Objectifs
                </button>
                <button
                  onClick={() => setActiveTab('community')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'community'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  💬 Communauté & Q&A
                </button>
                {quizScore > 0 && (
                  <div className="py-4 px-6 bg-green-50 text-green-700 font-medium">
                    🏆 Quiz: {quizScore}/{totalQuizQuestions}
                  </div>
                )}
              </div>

              {/* Contenu des onglets */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'content' ? (
                  <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
                    </div>

                    {/* Objectifs */}
                    {lesson.objectives && lesson.objectives.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Target size={18} className="text-blue-600" />
                          Objectifs de la leçon
                        </h3>
                        <ul className="space-y-2">
                          {lesson.objectives.map((objective, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-gray-700">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prérequis */}
                    {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Flag size={18} className="text-orange-600" />
                          Prérequis
                        </h3>
                        <ul className="space-y-2">
                          {lesson.prerequisites.map((prereq, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle size={16} className="text-green-500 mt-1" />
                              <span className="text-gray-700">{prereq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full">
                    <LessonQA
                      lessonId={lesson.id}
                      currentVideoTime={0}
                      onSeekToQuestion={(timestamp) => {
                        console.log(`Aller à ${timestamp} secondes dans la vidéo`);
                      }}
                      isInstructor={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Célébration de fin */}
      <CompletionCelebration
        celebration={celebration}
        onClose={handleCelebrationClose}
      />
    </div>
  );
}
