'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Star, 
  Trophy, 
  Zap,
  Clock,
  Target,
  BookOpen,
  Award,
  Sparkles,
  Crown,
  Flag,
  ArrowRight,
  X,
  Brain
} from 'lucide-react';
import { Course, Lesson, LessonNode, PlayerProgress, Badge } from '@/types';

interface GameCourseMapProps {
  course: Course;
  lessons: Lesson[];
  playerProgress: PlayerProgress;
  onLessonStart: (lesson: Lesson) => void;
  onLessonComplete: (lessonId: string, xpGained: number) => void;
}

// Générateur de positions pour la map (style Mario World)
const generateMapLayout = (lessons: Lesson[]): LessonNode[] => {
  const nodes: LessonNode[] = [];
  const mapWidth = 1200;
  const mapHeight = 800;
  
  lessons.forEach((lesson, index) => {
    // Disposition en zigzag avec variations
    const row = Math.floor(index / 4);
    const col = index % 4;
    const isEvenRow = row % 2 === 0;
    
    // Position de base
    let x = isEvenRow 
      ? 100 + col * (mapWidth - 200) / 3
      : 100 + (3 - col) * (mapWidth - 200) / 3;
    
    let y = 100 + row * 150;
    
    // Ajout de variations organiques
    x += Math.sin(index * 0.5) * 30;
    y += Math.cos(index * 0.3) * 20;
    
    // Connections vers la leçon suivante
    const connections = index < lessons.length - 1 ? [lessons[index + 1].id] : [];
    
    // Points de contrôle tous les 5 niveaux
    const isCheckpoint = (index + 1) % 5 === 0;
    
    nodes.push({
      lesson,
      position: { x, y },
      connections,
      isCheckpoint
    });
  });
  
  return nodes;
};

// Calcul du niveau basé sur l'XP
const calculateLevel = (totalXP: number): { level: number; xpToNext: number; progress: number } => {
  const xpPerLevel = 100;
  const level = Math.floor(totalXP / xpPerLevel) + 1;
  const currentLevelXP = totalXP % xpPerLevel;
  const xpToNext = xpPerLevel - currentLevelXP;
  const progress = (currentLevelXP / xpPerLevel) * 100;
  
  return { level, xpToNext, progress };
};

// Composant pour un node de leçon
const LessonNode: React.FC<{
  node: LessonNode;
  isSelected: boolean;
  onClick: () => void;
  playerProgress: PlayerProgress;
}> = ({ node, isSelected, onClick, playerProgress }) => {
  const { lesson } = node;
  
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
        return 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-200';
      case 'inProgress':
        return 'bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg shadow-blue-200 animate-pulse';
      case 'available':
        return 'bg-gradient-to-br from-indigo-400 to-blue-500 text-white shadow-lg shadow-indigo-200 hover:shadow-xl';
      case 'locked':
        return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 shadow-md';
    }
  };
  
  const getIcon = () => {
    switch (state) {
      case 'completed':
        return node.isCheckpoint ? <Flag size={24} /> : <CheckCircle size={20} />;
      case 'inProgress':
        return <Play size={20} />;
      case 'available':
        return lesson.type === 'quiz' ? <Brain size={20} /> : <Play size={20} />;
      case 'locked':
        return <Lock size={20} />;
    }
  };
  
  const getDifficultyColor = () => {
    switch (lesson.difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{ 
        left: node.position.x - 40, 
        top: node.position.y - 40,
        zIndex: isSelected ? 20 : 10
      }}
      whileHover={{ scale: state !== 'locked' ? 1.1 : 1 }}
      whileTap={{ scale: state !== 'locked' ? 0.95 : 1 }}
      animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
    >
      {/* Node principal */}
      <motion.button
        onClick={onClick}
        disabled={state === 'locked'}
        className={`
          relative w-20 h-20 rounded-2xl flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${getNodeStyle()}
          ${isSelected ? 'ring-4 ring-white ring-opacity-50' : ''}
          ${node.isCheckpoint ? 'w-24 h-24' : ''}
        `}
      >
        {getIcon()}
        
        {/* Badge XP */}
        {state !== 'locked' && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            +{lesson.xpReward}
          </div>
        )}
        
        {/* Badge difficulté */}
        <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
          {lesson.difficulty === 'easy' ? 'Facile' : lesson.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
        </div>
        
        {/* Checkpoint indicator */}
        {node.isCheckpoint && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Crown className="text-yellow-400" size={16} />
          </div>
        )}
      </motion.button>
      
      {/* Numéro de la leçon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
        {lesson.order}
      </div>
    </motion.div>
  );
};

// Composant pour les connexions entre nodes
const NodeConnections: React.FC<{ nodes: LessonNode[] }> = ({ nodes }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {nodes.map((node, index) => {
        if (index === nodes.length - 1) return null;
        
        const currentPos = node.position;
        const nextNode = nodes[index + 1];
        const nextPos = nextNode.position;
        
        const isCompleted = node.lesson.isCompleted;
        
        return (
          <motion.path
            key={`connection-${node.lesson.id}`}
            d={`M ${currentPos.x} ${currentPos.y} Q ${(currentPos.x + nextPos.x) / 2} ${currentPos.y - 50} ${nextPos.x} ${nextPos.y}`}
            stroke={isCompleted ? "#10b981" : "#d1d5db"}
            strokeWidth="4"
            fill="none"
            strokeDasharray={isCompleted ? "0" : "10,5"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="drop-shadow-sm"
          />
        );
      })}
    </svg>
  );
};

export function GameCourseMap({ 
  course, 
  lessons, 
  playerProgress, 
  onLessonStart,
  onLessonComplete 
}: GameCourseMapProps) {
  const [selectedNode, setSelectedNode] = useState<LessonNode | null>(null);
  const [mapNodes, setMapNodes] = useState<LessonNode[]>([]);
  const [showLessonDetail, setShowLessonDetail] = useState(false);

  useEffect(() => {
    const nodes = generateMapLayout(lessons);
    setMapNodes(nodes);
  }, [lessons]);

  const { level, xpToNext, progress } = calculateLevel(playerProgress.totalXP);
  
  const completedLessons = lessons.filter(l => l.isCompleted).length;
  const totalDuration = lessons.reduce((acc, lesson) => {
    const minutes = parseInt(lesson.duration.replace(/[^\d]/g, '')) || 0;
    return acc + minutes;
  }, 0);

  const handleNodeClick = (node: LessonNode) => {
    if (node.lesson.isAccessible || node.lesson.isCompleted) {
      setSelectedNode(node);
      setShowLessonDetail(true);
    }
  };

  const handleStartLesson = () => {
    if (selectedNode) {
      onLessonStart(selectedNode.lesson);
      setShowLessonDetail(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Header avec KPIs */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600">Parcours d'apprentissage interactif</p>
          </div>
          
          {/* Niveau et XP */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <Crown size={24} />
              <div>
                <div className="text-sm opacity-90">Niveau {level}</div>
                <div className="text-xs opacity-75">{xpToNext} XP pour le niveau suivant</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <BookOpen className="text-blue-600" size={20} />
              <div>
                <div className="text-2xl font-bold text-gray-900">{lessons.length}</div>
                <div className="text-sm text-gray-600">Leçons totales</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedLessons}</div>
                <div className="text-sm text-gray-600">Complétées</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock className="text-purple-600" size={20} />
              <div>
                <div className="text-2xl font-bold text-gray-900">{Math.floor(totalDuration / 60)}h{totalDuration % 60}m</div>
                <div className="text-sm text-gray-600">Durée totale</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-600" size={20} />
              <div>
                <div className="text-2xl font-bold text-gray-900">{Math.round(course.progress)}%</div>
                <div className="text-sm text-gray-600">Progression</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barre de progression XP */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression XP</span>
            <span className="text-sm text-gray-600">{playerProgress.totalXP} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Map interactive */}
      <div className="absolute inset-0 pt-48 pb-6 overflow-auto">
        <div className="relative w-full min-h-[800px]" style={{ height: Math.max(800, mapNodes.length * 100) }}>
          {/* Connexions entre les nodes */}
          <NodeConnections nodes={mapNodes} />
          
          {/* Nodes des leçons */}
          {mapNodes.map((node) => (
            <LessonNode
              key={node.lesson.id}
              node={node}
              isSelected={selectedNode?.lesson.id === node.lesson.id}
              onClick={() => handleNodeClick(node)}
              playerProgress={playerProgress}
            />
          ))}
          
          {/* Éléments décoratifs */}
          <div className="absolute top-20 right-20 opacity-20">
            <Sparkles size={40} className="text-purple-400" />
          </div>
          <div className="absolute bottom-40 left-40 opacity-20">
            <Star size={35} className="text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Modal détail de leçon */}
      <AnimatePresence>
        {showLessonDetail && selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setShowLessonDetail(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedNode.lesson.isCompleted 
                      ? 'bg-green-100 text-green-600'
                      : selectedNode.lesson.isInProgress
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {selectedNode.lesson.isCompleted ? <CheckCircle size={24} /> : <Play size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Leçon {selectedNode.lesson.order}</h3>
                    <p className="text-sm text-gray-600">{selectedNode.lesson.duration}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLessonDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Contenu */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">{selectedNode.lesson.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedNode.lesson.description}</p>
                </div>

                {/* Objectifs */}
                {selectedNode.lesson.objectives && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Target size={16} className="text-blue-600" />
                      Objectifs
                    </h5>
                    <ul className="space-y-1">
                      {selectedNode.lesson.objectives.map((objective, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Récompense XP */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="text-yellow-600" size={20} />
                    <div>
                      <div className="font-medium text-gray-900">+{selectedNode.lesson.xpReward} XP</div>
                      <div className="text-sm text-gray-600">Points d'expérience à gagner</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowLessonDetail(false)}
                    className="flex-1 py-3 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={handleStartLesson}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {selectedNode.lesson.isCompleted ? 'Revoir' : selectedNode.lesson.isInProgress ? 'Continuer' : 'Démarrer'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
