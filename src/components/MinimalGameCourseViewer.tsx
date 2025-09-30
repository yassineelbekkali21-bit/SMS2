'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Pause,
  Volume2,
  Settings,
  Maximize,
  FileText
} from 'lucide-react';
import { Course, Lesson, PlayerProgress } from '@/types';
// import { VideoQuizPlayer } from './VideoQuizPlayer'; // Temporairement désactivé
import { LessonQA } from './LessonQA';
import { MinimalLessonCompletion } from './MinimalLessonCompletion';

interface MinimalGameCourseViewerProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

// Générateur de positions pour la map (style Mario épuré)
const generateMapPositions = (lessons: Lesson[]) => {
  const positions: { x: number; y: number }[] = [];
  const mapWidth = 1000;
  const startX = 100;
  const startY = 150;
  
  lessons.forEach((_, index) => {
    // Disposition en zigzag subtil
    const row = Math.floor(index / 3);
    const col = index % 3;
    const isEvenRow = row % 2 === 0;
    
    const x = isEvenRow 
      ? startX + col * 300
      : startX + (2 - col) * 300;
    
    const y = startY + row * 120;
    
    positions.push({ x, y });
  });
  
  return positions;
};

// Composant Node de leçon épuré
const LessonNode: React.FC<{
  lesson: Lesson;
  position: { x: number; y: number };
  isSelected: boolean;
  onClick: () => void;
}> = ({ lesson, position, isSelected, onClick }) => {
  const getNodeState = () => {
    if (lesson.isCompleted) return 'completed';
    if (lesson.isInProgress) return 'inProgress';
    if (lesson.isAccessible) return 'available';
    return 'locked';
  };
  
  const state = getNodeState();
  
  const getNodeStyle = () => {
    switch (state) {
      case 'completed':
        return 'bg-white border-2 border-green-200 text-green-600 shadow-sm';
      case 'inProgress':
        return 'bg-white border-2 border-blue-200 text-blue-600 shadow-sm';
      case 'available':
        return 'bg-white border-2 border-gray-200 text-gray-700 shadow-sm hover:border-gray-300';
      case 'locked':
        return 'bg-gray-50 border-2 border-gray-100 text-gray-400';
    }
  };
  
  const getDifficultyAccent = () => {
    if (state === 'locked') return '';
    switch (lesson.difficulty) {
      case 'easy': return 'after:bg-green-400';
      case 'medium': return 'after:bg-yellow-400';
      case 'hard': return 'after:bg-red-400';
    }
  };
  
  const getIcon = () => {
    switch (state) {
      case 'completed': return <CheckCircle size={20} />;
      case 'inProgress': return <Play size={20} />;
      case 'available': return <div className="w-3 h-3 bg-current rounded-full" />;
      case 'locked': return <Lock size={16} />;
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{ 
        left: position.x - 30, 
        top: position.y - 30,
        zIndex: isSelected ? 20 : 10
      }}
      whileHover={{ scale: state !== 'locked' ? 1.05 : 1 }}
      whileTap={{ scale: state !== 'locked' ? 0.95 : 1 }}
    >
      <motion.button
        onClick={onClick}
        disabled={state === 'locked'}
        className={`
          relative w-16 h-16 rounded-2xl flex items-center justify-center
          transition-all duration-200 cursor-pointer
          ${getNodeStyle()}
          ${isSelected ? 'ring-2 ring-gray-900 ring-opacity-20' : ''}
          ${getDifficultyAccent()}
          after:absolute after:top-0 after:right-0 after:w-2 after:h-2 after:rounded-full
        `}
        animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
      >
        {getIcon()}
        
        {/* Numéro de leçon */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
          {lesson.order}
        </div>
        
        {/* XP badge subtil */}
        {state !== 'locked' && (
          <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
            {lesson.xpReward}
          </div>
        )}
      </motion.button>
    </motion.div>
  );
};

// Composant pour les connexions entre nodes
const NodeConnections: React.FC<{ 
  lessons: Lesson[]; 
  positions: { x: number; y: number }[] 
}> = ({ lessons, positions }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {lessons.map((lesson, index) => {
        if (index === lessons.length - 1) return null;
        
        const currentPos = positions[index];
        const nextPos = positions[index + 1];
        const isCompleted = lesson.isCompleted;
        
        return (
          <motion.path
            key={`connection-${lesson.id}`}
            d={`M ${currentPos.x} ${currentPos.y} Q ${(currentPos.x + nextPos.x) / 2} ${currentPos.y - 30} ${nextPos.x} ${nextPos.y}`}
            stroke={isCompleted ? "#10b981" : "#e5e7eb"}
            strokeWidth="2"
            fill="none"
            strokeDasharray={isCompleted ? "0" : "5,5"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          />
        );
      })}
    </svg>
  );
};

// Bloc de détail de leçon (sous la map)
const LessonDetailBlock: React.FC<{
  lesson: Lesson | null;
  onStartLesson: () => void;
  onClose: () => void;
}> = ({ lesson, onStartLesson, onClose }) => {
  if (!lesson) return null;
  
  const getStatusText = () => {
    if (lesson.isCompleted) return 'Terminée';
    if (lesson.isInProgress) return 'En cours';
    return 'Non commencée';
  };
  
  const getStatusColor = () => {
    if (lesson.isCompleted) return 'text-green-600 bg-green-50';
    if (lesson.isInProgress) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Vérifier si l'utilisateur a le pack complet (mock - en production, vérifier les achats)
  const hasFullPack = false; // TODO: Remplacer par la vraie logique d'achat
  
  // Vérifier si c'est une des 2 premières leçons (aperçu gratuit)
  const isPreviewLesson = lesson.order <= 2;
  
  // Déterminer si les slides PDF sont accessibles
  const canAccessSlides = hasFullPack || isPreviewLesson;

  const handleSlidesPreview = () => {
    if (isPreviewLesson && !hasFullPack) {
      // Aperçu limité pour les 2 premières leçons
      alert(`📄 Aperçu des slides PDF - "${lesson.title}"\n\nVous visualisez un extrait des slides de cette leçon.\nPour accéder à tous les slides PDF de tous les cours, débloquez le Pack Électrostatique complet.`);
    } else if (hasFullPack) {
      // Accès complet aux slides
      alert(`📄 Slides PDF complets - "${lesson.title}"\n\nAccès à tous les slides PDF de cette leçon grâce à votre Pack Électrostatique.`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{lesson.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">{lesson.description}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Bouton Slides PDF - uniquement pour les 2 premières leçons si pas de pack complet */}
      {canAccessSlides && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {isPreviewLesson && !hasFullPack ? 'Slides PDF (extrait)' : 'Slides PDF complets'}
                </p>
                <p className="text-xs text-blue-700">
                  {isPreviewLesson && !hasFullPack 
                    ? 'Aperçu gratuit des slides de cette leçon' 
                    : 'Accès complet aux slides PDF'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleSlidesPreview}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isPreviewLesson && !hasFullPack ? 'Voir l\'extrait' : 'Ouvrir PDF'}
            </button>
          </div>
          {isPreviewLesson && !hasFullPack && (
            <div className="mt-2 text-xs text-blue-600">
              💡 Pour tous les slides PDF de tous les cours, débloquez le Pack Électrostatique complet
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>{lesson.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap size={16} className="text-purple-500" />
            <span className="font-medium text-gray-900">+{lesson.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target size={16} />
            <span className="capitalize">{lesson.difficulty === 'easy' ? 'Facile' : lesson.difficulty === 'medium' ? 'Moyen' : 'Difficile'}</span>
          </div>
        </div>
        
        {lesson.isAccessible && (
          <button
            onClick={onStartLesson}
            className="bg-gray-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Play size={16} />
            {lesson.isCompleted ? 'Revoir la leçon' : lesson.isInProgress ? 'Continuer' : 'Rejoindre la leçon'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export function MinimalGameCourseViewer({ course, isOpen, onClose }: MinimalGameCourseViewerProps) {
  const [currentView, setCurrentView] = useState<'map' | 'lesson'>('map');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedLessonForDetail, setSelectedLessonForDetail] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonPositions, setLessonPositions] = useState<{ x: number; y: number }[]>([]);
  const [showQA, setShowQA] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completedXP, setCompletedXP] = useState(0);

  // Mock data pour les leçons
  useEffect(() => {
    if (course) {
      const mockLessons: Lesson[] = [
        {
          id: '1',
          courseId: course.id,
          title: 'Introduction aux concepts fondamentaux',
          description: 'Découvrez les bases essentielles de ce cours. Cette leçon vous permettra de comprendre les concepts de base nécessaires pour la suite du parcours.',
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
          objectives: ['Comprendre les concepts de base', 'Identifier les éléments clés'],
          isInProgress: false
        },
        {
          id: '2',
          courseId: course.id,
          title: 'Méthodes et techniques avancées',
          description: 'Approfondissez vos connaissances avec des techniques pratiques. Nous explorerons des méthodes avancées avec des exemples concrets.',
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
          objectives: ['Maîtriser les techniques avancées', 'Appliquer les méthodes pratiques'],
          isInProgress: true
        },
        {
          id: '3',
          courseId: course.id,
          title: 'Exercices pratiques et applications',
          description: 'Mettez en pratique ce que vous avez appris. Cette leçon sera débloquée après avoir terminé les leçons précédentes.',
          duration: '18 min',
          type: 'exercise',
          order: 3,
          isCompleted: false,
          isAccessible: false,
          hasPreview: false,
          documents: [],
          xpReward: 40,
          difficulty: 'medium',
          objectives: ['Résoudre des exercices', 'Appliquer la théorie en pratique'],
          isInProgress: false
        },
        {
          id: '4',
          courseId: course.id,
          title: 'Évaluation finale',
          description: 'Testez vos connaissances avec une évaluation complète. Obtenez un score parfait pour maximiser votre XP !',
          duration: '12 min',
          type: 'quiz',
          order: 4,
          isCompleted: false,
          isAccessible: false,
          hasPreview: false,
          documents: [],
          xpReward: 50,
          difficulty: 'hard',
          objectives: ['Valider toutes les connaissances acquises', 'Obtenir un score minimum de 80%'],
          isInProgress: false
        }
      ];
      
      setLessons(mockLessons);
      setLessonPositions(generateMapPositions(mockLessons));
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

  const handleLessonComplete = (lesson: Lesson) => {
    // Marquer la leçon comme terminée
    setLessons(prev => prev.map(l => 
      l.id === lesson.id 
        ? { ...l, isCompleted: true, isInProgress: false }
        : l.order === lesson.order + 1
        ? { ...l, isAccessible: true } // Débloquer la suivante
        : l
    ));

    // Afficher la célébration
    setCompletedXP(lesson.xpReward);
    setShowCompletion(true);
  };

  const handleCompletionContinue = () => {
    setShowCompletion(false);
    handleBackToMap();
  };

  const completedLessons = lessons.filter(l => l.isCompleted).length;
  const totalXP = lessons.filter(l => l.isCompleted).reduce((acc, l) => acc + l.xpReward, 0);
  const progressPercentage = (completedLessons / lessons.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50"
        >
          {currentView === 'map' ? (
            /* Vue Map */
            <div className="h-full flex flex-col">
              {/* Header épuré */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                      <p className="text-gray-600">Parcours d'apprentissage</p>
                    </div>
                  </div>
                  
                  {/* Stats épurées */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{completedLessons}/{lessons.length}</div>
                      <div className="text-sm text-gray-600">Leçons</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{totalXP}</div>
                      <div className="text-sm text-gray-600">XP gagnés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</div>
                      <div className="text-sm text-gray-600">Progression</div>
                    </div>
                  </div>
                </div>
                
                {/* Barre de progression épurée */}
                <div className="mt-6">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div 
                      className="bg-gray-900 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Map interactive */}
              <div className="flex-1 relative overflow-auto bg-gray-50">
                <div className="relative w-full min-h-[600px] p-8">
                  {/* Connexions */}
                  <NodeConnections lessons={lessons} positions={lessonPositions} />
                  
                  {/* Nodes */}
                  {lessons.map((lesson, index) => (
                    <LessonNode
                      key={lesson.id}
                      lesson={lesson}
                      position={lessonPositions[index]}
                      isSelected={selectedLessonForDetail?.id === lesson.id}
                      onClick={() => handleNodeClick(lesson)}
                    />
                  ))}
                </div>
                
                {/* Bloc de détail sous la map */}
                <div className="p-6">
                  <AnimatePresence>
                    {selectedLessonForDetail && (
                      <LessonDetailBlock
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
            /* Vue Leçon */
            <div className="h-full flex flex-col">
              {/* Header leçon */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleBackToMap}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">{selectedLesson.title}</h1>
                      <p className="text-gray-600">Leçon {selectedLesson.order} • {selectedLesson.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap size={16} className="text-purple-500" />
                      <span className="font-medium text-gray-900">+{selectedLesson.xpReward} XP</span>
                    </div>
                    {!selectedLesson.isCompleted && (
                      <button
                        onClick={() => handleLessonComplete(selectedLesson)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                      >
                        Terminer la leçon
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Contenu leçon */}
              <div className="flex-1 flex flex-col p-6 gap-6">
                {/* Lecteur vidéo */}
                <div className="bg-black rounded-2xl overflow-hidden" style={{ height: '60vh' }}>
                  {selectedLesson.videoUrl ? (
                    /* VideoQuizPlayer temporairement désactivé */
                    <div className="bg-gray-900 rounded-xl p-8 text-center text-white h-full flex flex-col justify-center">
                      <div className="text-gray-300 mb-4 text-2xl">
                        🎥 Lecteur vidéo avec quiz intégré
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Fonctionnalité en cours de développement
                      </p>
                      <button
                        onClick={() => {
                          // Compléter la leçon
                          handleCompleteLesson(selectedLesson.id);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
                      >
                        Marquer comme terminé
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <Play size={64} className="mx-auto mb-4 opacity-50" />
                        <p>Contenu de la leçon</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Onglets épurés */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setShowQA(false)}
                      className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                        !showQA
                          ? 'text-gray-900 border-b-2 border-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Contenu
                    </button>
                    <button
                      onClick={() => setShowQA(true)}
                      className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                        showQA
                          ? 'text-gray-900 border-b-2 border-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Q&A Communauté
                    </button>
                  </div>

                  <div className="p-6" style={{ height: '300px', overflowY: 'auto' }}>
                    {!showQA ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                          <p className="text-gray-600 leading-relaxed">{selectedLesson.description}</p>
                        </div>
                        
                        {selectedLesson.objectives && (
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Target size={18} />
                              Objectifs
                            </h3>
                            <ul className="space-y-2">
                              {selectedLesson.objectives.map((objective, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-gray-700">{objective}</span>
                                </li>
                              ))}
                            </ul>
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

          {/* Célébration de fin de leçon */}
          <MinimalLessonCompletion
            isVisible={showCompletion}
            xpGained={completedXP}
            lessonTitle={selectedLesson?.title || ''}
            onContinue={handleCompletionContinue}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
