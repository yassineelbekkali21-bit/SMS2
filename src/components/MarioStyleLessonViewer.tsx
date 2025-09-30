'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Play,
  CheckCircle,
  Lock,
  Clock,
  Target,
  BookOpen,
  Users,
  MessageCircle,
  TrendingUp,
  Award,
  Zap,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { Course, Lesson, User } from '@/types';
import { VideoWithQuiz } from './VideoWithQuiz';

interface MarioStyleLessonViewerProps {
  course: Course;
  lessons: Lesson[];
  currentLesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
  onBackToMap: () => void;
  onLessonSelect: (lessonId: string) => void;
  user?: User;
  purchasedItems: Set<string>;
}

export function MarioStyleLessonViewer({
  course,
  lessons,
  currentLesson,
  isOpen,
  onClose,
  onBackToMap,
  onLessonSelect,
  user,
  purchasedItems
}: MarioStyleLessonViewerProps) {
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);
  
  if (!isOpen) return null;

  const getLessonStatus = (lesson: Lesson) => {
    if (lesson.id === currentLesson.id) return 'current';
    if (lesson.isCompleted) return 'completed';
    if (lesson.isOwned || purchasedItems.has(lesson.id)) return 'available';
    return 'locked';
  };

  const getLessonIcon = (status: string) => {
    switch (status) {
      case 'current': return <Play className="text-white" size={16} />;
      case 'completed': return <CheckCircle className="text-white" size={16} />;
      case 'available': return <BookOpen className="text-gray-700" size={16} />;
      case 'locked': return <Lock className="text-gray-400" size={16} />;
      default: return null;
    }
  };

  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Salut ! J'ai une question sur le cours "${course.title}" - leçon "${currentLesson.title}". Pouvez-vous m'aider ? 🎓`
    );
    const whatsappUrl = `https://wa.me/+33123456789?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header identique à la Mario Map */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToMap}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Retour au parcours</span>
            </button>
            <div className="h-6 w-px bg-white/20"></div>
            <div>
              <h1 className="text-xl font-bold">{currentLesson.title}</h1>
              <p className="text-sm text-gray-300">Leçon {currentLesson.order} • {course.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-xs text-gray-300">Progression</div>
              <div className="text-sm font-semibold">{progressPercentage}% terminé</div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* Zone vidéo centrale */}
        <div className="flex-1 p-8">
          <div className="h-full flex flex-col">
            {/* Lecteur vidéo avec style Mario Map */}
            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="h-full bg-black rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative"
              >
                <VideoWithQuiz 
                  videoUrl={currentLesson.videoUrl}
                  questions={[]}
                  onQuizComplete={(score) => {
                    console.log(`Quiz terminé avec un score de ${score}`);
                  }}
                />
                
                {/* Overlay pour quiz intégrés */}
                <AnimatePresence>
                  {showQuizOverlay && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10"
                    >
                      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Target className="text-white" size={24} />
                          </div>
                          <h3 className="text-lg font-bold text-black mb-2">Quiz interactif</h3>
                          <p className="text-sm text-gray-600 mb-6">
                            Testez votre compréhension avant de continuer
                          </p>
                          <button
                            onClick={() => setShowQuizOverlay(false)}
                            className="w-full bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                          >
                            Commencer le quiz
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Sidebar droite élargie - Style Mario Map */}
        <div className="w-[480px] bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="p-6 space-y-6 overflow-y-auto">
            
            {/* Navigation du cours - Style Mario Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-black to-gray-700 text-white p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Navigation du cours</h3>
                    <p className="text-sm text-gray-300">{lessons.length} leçons • {progressPercentage}% terminé</p>
                  </div>
                </div>
                
                {/* Progression globale */}
                <div className="mt-4">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div 
                      className="bg-white h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {lessons.map((lesson) => {
                    const status = getLessonStatus(lesson);
                    const isClickable = status !== 'locked';
                    
                    return (
                      <motion.button
                        key={lesson.id}
                        onClick={() => isClickable && onLessonSelect(lesson.id)}
                        disabled={!isClickable}
                        whileHover={isClickable ? { scale: 1.02 } : {}}
                        className={`w-full p-4 rounded-2xl text-left transition-all ${
                          status === 'current'
                            ? 'bg-black text-white shadow-lg'
                            : status === 'completed'
                            ? 'bg-gray-100 hover:bg-gray-200'
                            : status === 'available'
                            ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            : 'bg-gray-25 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            status === 'current'
                              ? 'bg-white/20'
                              : status === 'completed'
                              ? 'bg-black'
                              : status === 'available'
                              ? 'bg-gray-200'
                              : 'bg-gray-100'
                          }`}>
                            {getLessonIcon(status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-semibold text-sm ${
                                status === 'current' ? 'text-white' : 'text-black'
                              }`}>
                                {lesson.order}. {lesson.title}
                              </h4>
                              {lesson.duration && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  status === 'current' 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {lesson.duration}min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* CTA WhatsApp Premium - Style Mario Map (DEUXIÈME POSITION) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-200 shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <MessageCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Une question ?</h3>
                    <p className="text-sm text-green-100">Rejoindre la discussion WhatsApp</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Indicateurs FOMO */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-2xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="text-green-500" size={16} />
                      <span className="text-xs font-semibold text-gray-700">Étudiants actifs</span>
                    </div>
                    <div className="text-xl font-bold text-black">124+</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="text-green-500" size={16} />
                      <span className="text-xs font-semibold text-gray-700">Cette semaine</span>
                    </div>
                    <div className="text-xl font-bold text-black">37</div>
                    <div className="text-xs text-gray-500">questions</div>
                  </div>
                </div>

                {/* Label très actif */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-2xl text-sm font-bold shadow-lg"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Très actif
                  </motion.div>
                </div>

                {/* CTA principal */}
                <motion.button
                  onClick={handleWhatsAppClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg flex items-center justify-center gap-3"
                >
                  <MessageCircle size={20} />
                  <span>Rejoindre WhatsApp</span>
                  <ArrowUpRight size={16} />
                </motion.button>

                <p className="text-center text-xs text-gray-600 mt-4 leading-relaxed">
                  Posez vos questions et échangez avec d'autres étudiants ! 🚀
                </p>
              </div>
            </motion.div>

            {/* Description de la leçon - Style Mario Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white" size={18} />
                </div>
                <h3 className="text-lg font-bold text-black">Description</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{currentLesson.description}</p>
            </motion.div>

            {/* Objectifs d'apprentissage - Style Mario Map */}
            {currentLesson.objectives && currentLesson.objectives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <Target className="text-white" size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-black">Objectifs d'apprentissage</h3>
                </div>
                <div className="space-y-3">
                  {currentLesson.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 leading-relaxed">{objective}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Bouton pour tester quiz overlay */}
            <motion.button
              onClick={() => setShowQuizOverlay(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-2xl font-medium transition-colors border border-gray-200"
            >
              <div className="flex items-center justify-center gap-2">
                <Eye size={16} />
                <span>Prévisualiser quiz intégré</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
