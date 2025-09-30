'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  ArrowLeft,
  Play,
  CheckCircle,
  Lock,
  Clock,
  Target,
  BookOpen,
  User,
  MessageCircle,
  Zap,
  Trophy,
  X,
  Star,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Course, Lesson } from '@/types';
// import { VideoQuizPlayer } from './VideoQuizPlayer'; // Temporairement désactivé
import { LessonQA } from './LessonQA';

interface ImmersiveGameCourseViewerProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

// Générateur de chemin sinueux pour la map
const generateAdventurePath = (lessons: Lesson[]) => {
  const path: { x: number; y: number; angle: number }[] = [];
  const mapWidth = 1200;
  const mapHeight = 600;
  const startX = 100;
  const startY = mapHeight / 2;
  
  lessons.forEach((_, index) => {
    const progress = index / (lessons.length - 1);
    
    // Chemin sinueux avec courbes naturelles
    const baseX = startX + progress * (mapWidth - 200);
    const waveAmplitude = 80;
    const waveFrequency = 3;
    
    const x = baseX;
    const y = startY + Math.sin(progress * Math.PI * waveFrequency) * waveAmplitude;
    const angle = Math.atan2(
      Math.cos(progress * Math.PI * waveFrequency) * waveAmplitude * Math.PI * waveFrequency,
      mapWidth - 200
    ) * (180 / Math.PI);
    
    path.push({ x, y, angle });
  });
  
  return path;
};

// Composant Node de leçon avec animations avancées
const AdventureNode: React.FC<{
  lesson: Lesson;
  position: { x: number; y: number; angle: number };
  isSelected: boolean;
  onClick: () => void;
  index: number;
}> = ({ lesson, position, isSelected, onClick, index }) => {
  const controls = useAnimation();
  
  const getNodeState = () => {
    if (lesson.isCompleted) return 'completed';
    if (lesson.isInProgress) return 'inProgress';
    if (lesson.isOwned) return 'available';
    return 'locked';
  };
  
  const state = getNodeState();
  
  const getDifficultyColor = () => {
    switch (lesson.difficulty) {
      case 'easy': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', accent: 'bg-green-400' };
      case 'medium': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', accent: 'bg-yellow-400' };
      case 'hard': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', accent: 'bg-red-400' };
    }
  };
  
  const getStateStyle = () => {
    const diffColors = getDifficultyColor();
    switch (state) {
      case 'completed':
        return {
          container: `bg-white border-2 border-green-300 shadow-lg shadow-green-100`,
          glow: 'shadow-green-200',
          icon: 'text-green-600'
        };
      case 'inProgress':
        return {
          container: `${diffColors.bg} border-2 ${diffColors.border} shadow-lg ${diffColors.text}`,
          glow: 'shadow-blue-200 animate-pulse',
          icon: diffColors.text
        };
      case 'available':
        return {
          container: `bg-white border-2 border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300`,
          glow: 'hover:shadow-gray-200',
          icon: 'text-gray-700'
        };
      case 'locked':
        return {
          container: 'bg-gray-50 border-2 border-gray-100 shadow-sm',
          glow: '',
          icon: 'text-gray-400'
        };
    }
  };
  
  const getIcon = () => {
    switch (state) {
      case 'completed': return <CheckCircle size={24} />;
      case 'inProgress': return <Play size={24} />;
      case 'available': return <div className="w-4 h-4 bg-current rounded-full" />;
      case 'locked': return <Lock size={20} />;
    }
  };

  const nodeStyle = getStateStyle();
  const diffColors = getDifficultyColor();

  useEffect(() => {
    if (state === 'completed') {
      // Animation de célébration pour les leçons complétées
      controls.start({
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.6, delay: index * 0.1 }
      });
    }
  }, [state, controls, index]);

  return (
    <motion.div
      className="absolute"
      style={{ 
        left: position.x - 40, 
        top: position.y - 40,
        zIndex: isSelected ? 30 : 20
      }}
      whileHover={{ scale: state !== 'locked' ? 1.05 : 1 }}
      whileTap={{ scale: state !== 'locked' ? 0.95 : 1 }}
      animate={controls}
    >
      {/* Lueur pour les leçons en cours */}
      {state === 'inProgress' && (
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Node principal */}
      <motion.button
        onClick={onClick}
        disabled={state === 'locked'}
        className={`
          relative w-20 h-20 rounded-3xl flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${nodeStyle.container} ${nodeStyle.glow}
          ${isSelected ? 'ring-4 ring-blue-200 ring-opacity-50' : ''}
        `}
        animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
      >
        <div className={nodeStyle.icon}>
          {getIcon()}
        </div>
        
        {/* Numéro de leçon */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-700">
          {lesson.order}
        </div>
        
        {/* Badge XP */}
        {state !== 'locked' && (
          <motion.div 
            className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            +{lesson.xpReward}
          </motion.div>
        )}
        
        {/* Badge difficulté */}
        <div className={`absolute -bottom-3 -left-3 w-3 h-3 ${diffColors.accent} rounded-full shadow-sm`} />
        
        {/* Étincelles pour les leçons complétées */}
        {state === 'completed' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
          >
            <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={16} />
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
};

// Composant pour le chemin animé
const AdventurePath: React.FC<{ 
  path: { x: number; y: number; angle: number }[];
  lessons: Lesson[];
}> = ({ path, lessons }) => {
  // Génération du chemin SVG
  const pathString = path.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prevPoint = path[index - 1];
    const controlPoint1X = prevPoint.x + 50;
    const controlPoint1Y = prevPoint.y;
    const controlPoint2X = point.x - 50;
    const controlPoint2Y = point.y;
    return `${acc} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${point.x} ${point.y}`;
  }, '');

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {/* Chemin de base */}
      <motion.path
        d={pathString}
        stroke="#e5e7eb"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Chemin progressif coloré */}
      {lessons.map((lesson, index) => {
        if (index === 0 || !lesson.isCompleted) return null;
        
        const segmentPath = path.slice(0, index + 1).reduce((acc, point, segmentIndex) => {
          if (segmentIndex === 0) return `M ${point.x} ${point.y}`;
          const prevPoint = path[segmentIndex - 1];
          const controlPoint1X = prevPoint.x + 50;
          const controlPoint1Y = prevPoint.y;
          const controlPoint2X = point.x - 50;
          const controlPoint2Y = point.y;
          return `${acc} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${point.x} ${point.y}`;
        }, '');
        
        return (
          <motion.path
            key={`progress-${index}`}
            d={segmentPath}
            stroke="url(#progressGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: index * 0.2 }}
          />
        );
      })}
      
      {/* Définition du gradient */}
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Barre de progression XP
const XPProgressBar: React.FC<{
  currentXP: number;
  totalPossibleXP: number;
  level: number;
}> = ({ currentXP, totalPossibleXP, level }) => {
  const progressPercentage = totalPossibleXP > 0 ? (currentXP / totalPossibleXP) * 100 : 0;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Trophy className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Niveau {level}</h3>
            <p className="text-sm text-gray-600">{currentXP} / {totalPossibleXP} XP</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</div>
          <div className="text-sm text-gray-600">Progression</div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Bloc de détail de leçon (sous la map)
const LessonDetailPanel: React.FC<{
  lesson: Lesson | null;
  onStartLesson: () => void;
  onClose: () => void;
}> = ({ lesson, onStartLesson, onClose }) => {
  if (!lesson) return null;
  
  const getStatusInfo = () => {
    if (lesson.isCompleted) return { text: 'Terminée', color: 'bg-green-50 text-green-700 border-green-200' };
    if (lesson.isInProgress) return { text: 'En cours', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    return { text: 'À faire', color: 'bg-gray-50 text-gray-700 border-gray-200' };
  };
  
  const getDifficultyInfo = () => {
    switch (lesson.difficulty) {
      case 'easy': return { text: 'Facile', color: 'bg-green-100 text-green-800' };
      case 'medium': return { text: 'Moyen', color: 'bg-yellow-100 text-yellow-800' };
      case 'hard': return { text: 'Difficile', color: 'bg-red-100 text-red-800' };
    }
  };

  const status = getStatusInfo();
  const difficulty = getDifficultyInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h3 className="text-2xl font-bold text-gray-900">{lesson.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
              {status.text}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficulty.color}`}>
              {difficulty.text}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">{lesson.description}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 bg-gray-50 rounded-2xl">
          <Clock className="mx-auto mb-2 text-gray-600" size={24} />
          <div className="font-bold text-gray-900">{lesson.duration}</div>
          <div className="text-sm text-gray-600">Durée</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-2xl">
          <Zap className="mx-auto mb-2 text-purple-600" size={24} />
          <div className="font-bold text-purple-900">+{lesson.xpReward} XP</div>
          <div className="text-sm text-purple-600">Récompense</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-2xl">
          <Target className="mx-auto mb-2 text-blue-600" size={24} />
          <div className="font-bold text-blue-900">{lesson.objectives?.length || 0}</div>
          <div className="text-sm text-blue-600">Objectifs</div>
        </div>
      </div>
      
      {lesson.isAccessible && (
        <div className="flex justify-center">
          <motion.button
            onClick={onStartLesson}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play size={20} />
            {lesson.isCompleted ? 'Revoir la leçon' : lesson.isInProgress ? 'Continuer' : 'Rejoindre la leçon'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export function ImmersiveGameCourseViewer({ course, isOpen, onClose }: ImmersiveGameCourseViewerProps) {
  const [currentView, setCurrentView] = useState<'map' | 'lesson'>('map');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedLessonForDetail, setSelectedLessonForDetail] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [adventurePath, setAdventurePath] = useState<{ x: number; y: number; angle: number }[]>([]);
  const [showQA, setShowQA] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Mock data pour les leçons
  useEffect(() => {
    if (course) {
      const mockLessons: Lesson[] = [
        {
          id: '1',
          courseId: course.id,
          title: 'Les fondamentaux essentiels',
          description: 'Découvrez les concepts de base qui forment le socle de votre apprentissage. Cette première étape est cruciale pour bien comprendre la suite.',
          duration: '15 min',
          type: 'video',
          order: 1,
          isCompleted: true,
          isAccessible: true,
          hasPreview: true,
          videoUrl: 'https://example.com/video1.mp4',
          documents: [],
          xpReward: 25,
          difficulty: 'easy',
          objectives: ['Comprendre les concepts de base', 'Identifier les éléments clés', 'Préparer les fondations'],
          isInProgress: false
        },
        {
          id: '2',
          courseId: course.id,
          title: 'Techniques avancées et méthodes',
          description: 'Approfondissez vos connaissances avec des techniques pratiques et des méthodes éprouvées. Vous allez découvrir des approches innovantes.',
          duration: '22 min',
          type: 'video',
          order: 2,
          isCompleted: false,
          isAccessible: true,
          hasPreview: true,
          videoUrl: 'https://example.com/video2.mp4',
          documents: [],
          xpReward: 35,
          difficulty: 'medium',
          objectives: ['Maîtriser les techniques avancées', 'Appliquer les méthodes pratiques', 'Développer une approche méthodique'],
          isInProgress: true
        },
        {
          id: '3',
          courseId: course.id,
          title: 'Mise en pratique intensive',
          description: 'Mettez en application tout ce que vous avez appris avec des exercices concrets et des cas d\'usage réels.',
          duration: '18 min',
          type: 'exercise',
          order: 3,
          isCompleted: false,
          isAccessible: false,
          hasPreview: false,
          documents: [],
          xpReward: 40,
          difficulty: 'medium',
          objectives: ['Résoudre des exercices complexes', 'Appliquer la théorie', 'Valider ses acquis'],
          isInProgress: false
        },
        {
          id: '4',
          courseId: course.id,
          title: 'Évaluation et certification',
          description: 'Démontrez votre maîtrise avec une évaluation complète. Réussissez ce défi pour obtenir votre certification !',
          duration: '25 min',
          type: 'quiz',
          order: 4,
          isCompleted: false,
          isAccessible: false,
          hasPreview: false,
          documents: [],
          xpReward: 60,
          difficulty: 'hard',
          objectives: ['Valider toutes les connaissances', 'Obtenir un score excellent', 'Décrocher la certification'],
          isInProgress: false
        },
        {
          id: '5',
          courseId: course.id,
          title: 'Projet final et expertise',
          description: 'Créez votre projet final qui synthétise tous vos apprentissages. C\'est l\'étape ultime vers l\'expertise !',
          duration: '35 min',
          type: 'exercise',
          order: 5,
          isCompleted: false,
          isAccessible: false,
          hasPreview: false,
          documents: [],
          xpReward: 100,
          difficulty: 'hard',
          objectives: ['Synthétiser tous les apprentissages', 'Créer un projet personnel', 'Atteindre l\'expertise'],
          isInProgress: false
        }
      ];
      
      setLessons(mockLessons);
      setAdventurePath(generateAdventurePath(mockLessons));
    }
  }, [course]);

  if (!course) return null;

  const handleNodeClick = (lesson: Lesson) => {
    if (lesson.isAccessible || lesson.isCompleted) {
      setSelectedLessonForDetail(selectedLessonForDetail?.id === lesson.id ? null : lesson);
    }
  };

  const handleStartLesson = () => {
    if (selectedLessonForDetail) {
      setSelectedLesson(selectedLessonForDetail);
      setCurrentView('lesson');
      setSelectedLessonForDetail(null);
    }
  };

  const handleBackToMap = () => {
    setCurrentView('map');
    setSelectedLesson(null);
    setShowQA(false);
  };

  const handleLessonComplete = () => {
    if (!selectedLesson) return;
    
    // Marquer comme terminée et débloquer la suivante
    setLessons(prev => prev.map(l => 
      l.id === selectedLesson.id 
        ? { ...l, isCompleted: true, isInProgress: false }
        : l.order === selectedLesson.order + 1
        ? { ...l, isAccessible: true }
        : l
    ));

    setShowCompletion(true);
    setTimeout(() => {
      setShowCompletion(false);
      handleBackToMap();
    }, 3000);
  };

  const completedLessons = lessons.filter(l => l.isCompleted).length;
  const totalXP = lessons.filter(l => l.isCompleted).reduce((acc, l) => acc + l.xpReward, 0);
  const totalPossibleXP = lessons.reduce((acc, l) => acc + l.xpReward, 0);
  const currentLevel = Math.floor(totalXP / 100) + 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 z-50"
        >
          {currentView === 'map' ? (
            /* Vue Map d'Aventure */
            <div className="h-full flex flex-col">
              {/* Header immersif */}
              <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={onClose}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowLeft size={24} className="text-gray-600" />
                    </motion.button>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                      <p className="text-gray-600 text-lg">Votre parcours d'apprentissage interactif</p>
                    </div>
                  </div>
                  
                  {/* Stats rapides */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{completedLessons}/{lessons.length}</div>
                      <div className="text-sm text-gray-600">Étapes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{totalXP}</div>
                      <div className="text-sm text-gray-600">XP Total</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barre de progression XP */}
              <div className="p-6">
                <XPProgressBar 
                  currentXP={totalXP}
                  totalPossibleXP={totalPossibleXP}
                  level={currentLevel}
                />
              </div>

              {/* Map d'aventure */}
              <div className="flex-1 relative overflow-hidden">
                <div className="relative w-full h-full p-8">
                  {/* Chemin d'aventure */}
                  <AdventurePath path={adventurePath} lessons={lessons} />
                  
                  {/* Nodes des leçons */}
                  {lessons.map((lesson, index) => (
                    <AdventureNode
                      key={lesson.id}
                      lesson={lesson}
                      position={adventurePath[index]}
                      isSelected={selectedLessonForDetail?.id === lesson.id}
                      onClick={() => handleNodeClick(lesson)}
                      index={index}
                    />
                  ))}
                </div>
                
                {/* Panneau de détail sous la map */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <AnimatePresence>
                    {selectedLessonForDetail && (
                      <LessonDetailPanel
                        lesson={selectedLessonForDetail}
                        onStartLesson={handleStartLesson}
                        onClose={() => setSelectedLessonForDetail(null)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : selectedLesson ? (
            /* Vue Leçon Immersive */
            <div className="h-full flex flex-col">
              {/* Header leçon */}
              <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={handleBackToMap}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <ArrowLeft size={24} className="text-gray-600" />
                    </motion.button>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{selectedLesson.title}</h1>
                      <p className="text-gray-600">Étape {selectedLesson.order} • {selectedLesson.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-lg">
                      <Zap className="text-purple-500" size={24} />
                      <span className="font-bold text-gray-900">+{selectedLesson.xpReward} XP</span>
                    </div>
                    {!selectedLesson.isCompleted && (
                      <motion.button
                        onClick={handleLessonComplete}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Terminer l'étape
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Contenu leçon */}
              <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
                {/* Lecteur vidéo */}
                <div className="bg-black rounded-3xl overflow-hidden shadow-2xl" style={{ height: '55vh' }}>
                  {selectedLesson.videoUrl ? (
                    /* VideoQuizPlayer temporairement désactivé */
                    <div className="bg-gray-900 rounded-xl p-8 text-center text-white">
                      <div className="text-gray-300 mb-4">
                        🎥 Lecteur vidéo avec quiz intégré
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Fonctionnalité en cours de développement
                      </p>
                      <button
                        onClick={() => {
                          // Logique de completion temporaire
                          const updatedProgress = { ...playerProgress };
                          if (!updatedProgress.completedLessons.includes(selectedLesson.id)) {
                            updatedProgress.completedLessons.push(selectedLesson.id);
                          }
                          onProgressUpdate(updatedProgress);
                          setShowCelebration(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Marquer comme terminé
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <Play size={80} className="mx-auto mb-6 opacity-50" />
                        <p className="text-xl">Contenu de la leçon</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Onglets de contenu */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex-1">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setShowQA(false)}
                      className={`flex-1 py-4 px-6 text-center font-bold transition-colors ${
                        !showQA
                          ? 'text-gray-900 border-b-4 border-gray-900 bg-gray-50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      📚 Contenu & Objectifs
                    </button>
                    <button
                      onClick={() => setShowQA(true)}
                      className={`flex-1 py-4 px-6 text-center font-bold transition-colors ${
                        showQA
                          ? 'text-gray-900 border-b-4 border-gray-900 bg-gray-50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      💬 Communauté & Q&A
                    </button>
                  </div>

                  <div className="p-8 overflow-y-auto" style={{ height: '300px' }}>
                    {!showQA ? (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                          <p className="text-gray-700 leading-relaxed text-lg">{selectedLesson.description}</p>
                        </div>
                        
                        {selectedLesson.objectives && (
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                              <Target size={24} className="text-blue-600" />
                              Objectifs de cette étape
                            </h3>
                            <div className="grid gap-4">
                              {selectedLesson.objectives.map((objective, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl"
                                >
                                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <span className="text-gray-800 font-medium">{objective}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <LessonQA
                        lessonId={selectedLesson.id}
                        currentVideoTime={0}
                        onSeekToQuestion={(timestamp) => {
                          console.log(`Aller à ${timestamp} secondes`);
                        }}
                        isInstructor={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Célébration de fin d'étape */}
          <AnimatePresence>
            {showCompletion && selectedLesson && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <Trophy className="text-white" size={48} />
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-bold text-gray-900 mb-4"
                  >
                    Bravo ! 🎉
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl text-gray-600 mb-8"
                  >
                    +{selectedLesson.xpReward} XP gagnés !<br/>
                    Tu débloques la prochaine étape 🚀
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
