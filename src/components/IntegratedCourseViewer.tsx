'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Play,
  Target,
  BookOpen,
  Zap,
  Trophy,
  X,
  Star,
  Award,
  Sparkles,
  HelpCircle,
  Eye,
  Settings,
  Image as ImageIcon,
  Palette,
  Menu,
  Search,
  Bell,
  Brain,
  Home,
  Calendar,
  Users,
  BarChart3,
  Globe,
  ChevronDown,
  ChevronRight,
  Gift,
  Crown,
  CheckCircle,
  Clock,
  FileText,
  ExternalLink,
  Calculator,
  TrendingUp,
  MessageCircle,
  Gem,
  Download,
  Library,
  Heart,
  MessageSquare,
  Info,
  Check,
  ThumbsUp,
  Lightbulb,
  ArrowRight,
  List,
  Video,
  Flame
} from 'lucide-react';
import { Course, Lesson, User, PurchaseOption } from '@/types';
import Image from 'next/image';
import { IdentityVerificationModal } from './IdentityVerificationModal';
import { IdentityVerificationTrigger } from './IdentityVerificationTrigger';
import { IdentityVerificationService } from '@/lib/identity-verification-service';
import { useFavorites } from '@/hooks/useFavorites';
import { WalletService } from '@/lib/wallet-service';
import { WalletBalance } from './WalletBalance';
import { XPService, UserXPProfile } from '@/lib/xp-service';
import XPWidget from './XPWidget';
import { XPHeaderWidget } from './XPHeaderWidget';
import SocialFeedIcon from './SocialFeedIcon';
import SocialFeedPanel from './SocialFeedPanel';
import { StudyRoomHeaderWidget } from './StudyRoomHeaderWidget';
import { UnifiedSocialWidget } from './UnifiedSocialWidget';
import { NotificationWidget } from './NotificationWidget';
import { VideoWithQuiz } from './VideoWithQuiz';
// import { VideoQuizPlayer } from './VideoQuizPlayer'; // Temporairement désactivé
import { WhatsAppIntegration } from './WhatsAppIntegration';
import { LessonNavigator } from './LessonNavigator';
import { LessonDetailsCards } from './LessonDetailsCards';
import { WhatsAppCTA } from './WhatsAppCTA';
import { LessonQuiz } from './LessonQuiz';
import { LessonVideoPreview } from './LessonVideoPreview';
import { MiniQuiz } from './MiniQuiz';
import { getQuizByLessonId, generateUpsellOptions, mockUser } from '@/lib/mock-data';
import { PurchaseUpsellModal } from './PurchaseUpsellModal';
import { WalletTopUp } from './WalletTopUp';
import { AdvancedStudyRoomService } from '@/lib/advanced-studyroom-service';
import { AdvancedStudyRoom } from '@/types';
import { WebRTCStudyRoom } from './WebRTCStudyRoom';
import { DocumentUploadWidget } from './DocumentUploadWidget';
import { BoostersWidget } from './BoostersWidget';
import { GlobalHeader } from './GlobalHeader';

interface IntegratedCourseViewerProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection?: (section: string) => void;
  showSettings?: boolean;
  onToggleSettings?: () => void;
  purchasedItems?: Set<string>;
  onPurchase?: (option: PurchaseOption) => void;
  user?: any;
  lessons?: Lesson[];
  onLessonsUpdate?: (lessons: Lesson[]) => void;
  userXPProfile?: UserXPProfile | null;
  initialLessonId?: string; // ID de la leçon à afficher au démarrage
}

// Fond d'écran unique - Blanc épuré MasterClass style
const backgroundOptions = [
  {
    id: 'minimal-white',
    name: 'Blanc Épuré',
    style: 'bg-white',
    preview: '#ffffff'
  }
];

// Générateur de chemin sinueux optimisé
const generateCoursePath = (lessons: Lesson[]) => {
  const path: { x: number; y: number }[] = [];
  const mapWidth = 1000;
  const mapHeight = 400;
  const startX = 80;
  const startY = mapHeight / 2;
  
  lessons.forEach((_, index) => {
    const progress = index / (lessons.length - 1);
    
    // Chemin en S fluide
    const baseX = startX + progress * (mapWidth - 160);
    const waveAmplitude = 60;
    const waveFrequency = 2;
    
    const x = baseX;
    const y = startY + Math.sin(progress * Math.PI * waveFrequency) * waveAmplitude;
    
    path.push({ x, y });
  });
  
  return path;
};

// Composant Node optimisé
const CourseNode: React.FC<{
  lesson: Lesson;
  position: { x: number; y: number };
  isSelected: boolean;
  onClick: () => void;
  index: number;
  course: Course;
  purchasedItems: Set<string>;
}> = ({ lesson, position, isSelected, onClick, index, course, purchasedItems }) => {
  // Mode essai: seule la première leçon est accessible, les autres sont en preview
  const isTrialMode = course?.isTrial === true;
  const isTrialPreview = isTrialMode && index > 0;

  const getNodeState = () => {
    // Mode essai: les leçons après la première sont TOUJOURS en preview
    // Même si elles sont marquées comme complétées dans les données
    if (isTrialPreview) {
      return 'trialPreview';
    }
    
    if (lesson.isCompleted) return 'completed';
    if (lesson.isInProgress) return 'inProgress';
    
    // 🔑 LOGIQUE STRICTE DE DÉBLOCAGE
    // 1. Vérifier si la leçon est explicitement possédée
    if (lesson.isOwned) {
      console.log('🔑 ICÔNE: Leçon', lesson.id, 'débloquée via isOwned=true');
      return 'available';
    }
    
    // 2. Vérifier les achats via le système d'achat
    const isLessonPurchased = purchasedItems.has(`lesson-${lesson.id}`);
    const isCoursePurchased = purchasedItems.has(`course-${course.id}`);
    const isPackPurchased = purchasedItems.has(`pack-${course.packId || 'any'}`);
    
    if (isLessonPurchased || isCoursePurchased || isPackPurchased) {
      console.log('🔑 ICÔNE: Leçon', lesson.id, 'débloquée via achat externe');
      return 'available';
    }
    
    // 3. IGNORER lesson.isAccessible pour forcer l'achat
    // (lesson.isAccessible est trop permissif dans les données mock)
    
    // Plus d'état verrouillé - toutes les leçons sont disponibles
    return 'available';
  };
  
  const state = getNodeState();
  
  const getDifficultyColor = () => {
    switch (lesson.difficulty) {
      case 'beginner': return 'bg-gray-300';
      case 'intermediate': return 'bg-gray-500';
      case 'advanced': return 'bg-gray-700';
      default: return 'bg-gray-400';
    }
  };
  
  const getNodeStyle = () => {
    switch (state) {
      case 'completed':
        return 'bg-white border-2 border-gray-900 shadow-lg text-gray-900';
      case 'inProgress':
        return 'bg-[#00c2ff] border-2 border-[#00c2ff] shadow-lg text-white';
      case 'trialPreview':
        return 'bg-gray-800 border-2 border-gray-600 shadow-md text-gray-300 hover:border-gray-500';
      case 'available':
        return 'bg-white border-2 border-gray-300 shadow-md text-gray-700 hover:border-[#00c2ff]';
    }
  };
  
  const getIcon = () => {
    switch (state) {
      case 'completed': 
        return <CheckCircle size={20} className="text-gray-900" />;
      case 'inProgress': 
        return <Play size={20} className="text-white animate-pulse" />;
      case 'trialPreview':
        return <Eye size={20} className="text-gray-300" />;
      case 'available': 
        return (
          <div className="relative">
            <div className="w-4 h-4 border-2 border-gray-700 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-700 rounded-full" />
            </div>
          </div>
        );
    }
  };

  const getShortTitle = (title: string): string => {
    // Retourner le titre complet pour une meilleure lisibilité
    return title;
  };

  return (
    <motion.div
      className="absolute"
      style={{ 
        left: position.x - 30, 
        top: position.y - 30,
        zIndex: isSelected ? 30 : 20
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Lueur pour leçon en cours */}
      {state === 'inProgress' && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-blue-200/40 blur-lg"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4]
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
        className={`
          relative w-16 h-16 rounded-2xl flex items-center justify-center group
          transition-all duration-300 cursor-pointer
          ${getNodeStyle()}
          ${isSelected ? 'ring-4 ring-blue-200' : ''}
        `}
        animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
      >
        {getIcon()}
        
        
        {/* Numéro */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-700">
          {lesson.order}
        </div>
        
        {/* Label titre complet */}
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 text-sm text-gray-700 text-center w-28 leading-tight font-medium">
          {lesson.title}
        </div>
        
        
        
        {/* Étincelles pour complétées */}
        {state === 'completed' && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="text-[#00c2ff]" size={12} />
          </motion.div>
        )}
        
        {/* Badge Preview pour mode essai - noir premium */}
        {state === 'trialPreview' && (
          <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-gray-900 text-white text-[8px] font-bold rounded uppercase tracking-wider shadow-lg">
            Preview
          </div>
        )}
      </motion.button>
    </motion.div>
  );
};

// Composant chemin
const CoursePath: React.FC<{ 
  path: { x: number; y: number }[];
  lessons: Lesson[];
}> = ({ path, lessons }) => {
  const pathString = path.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prevPoint = path[index - 1];
    const controlX = (prevPoint.x + point.x) / 2;
    const controlY = prevPoint.y;
    return `${acc} Q ${controlX} ${controlY} ${point.x} ${point.y}`;
  }, '');

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {/* Chemin de base */}
      <path
        d={pathString}
        stroke="#e5e7eb"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Chemin progressif */}
      {lessons.map((lesson, index) => {
        if (index === 0 || !lesson.isCompleted) return null;
        
        const segmentPath = path.slice(0, index + 1).reduce((acc, point, segmentIndex) => {
          if (segmentIndex === 0) return `M ${point.x} ${point.y}`;
          const prevPoint = path[segmentIndex - 1];
          const controlX = (prevPoint.x + point.x) / 2;
          const controlY = prevPoint.y;
          return `${acc} Q ${controlX} ${controlY} ${point.x} ${point.y}`;
        }, '');
        
        return (
          <motion.path
            key={`progress-${index}`}
            d={segmentPath}
            stroke="url(#courseGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          />
        );
      })}
      
      {/* Gradient de progression */}
      <defs>
        <linearGradient id="courseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Sélecteur de fond d'écran
const BackgroundSelector: React.FC<{
  selectedBackground: string;
  onSelect: (bgId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ selectedBackground, onSelect, isOpen, onToggle }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Personnaliser le fond"
      >
        <Palette size={20} className="text-gray-600" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="background-selector"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-80 z-50"
          >
            <h3 className="font-bold text-gray-900 mb-4">Personnaliser le fond</h3>
            <div className="grid grid-cols-3 gap-3">
              {backgroundOptions.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => onSelect(bg.id)}
                  className={`relative h-16 rounded-xl border-2 overflow-hidden transition-all ${
                    selectedBackground === bg.id 
                      ? 'border-[#00c2ff] ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ background: bg.preview }}
                >
                  {selectedBackground === bg.id && (
                    <div className="absolute inset-0 bg-[#00c2ff]/20 flex items-center justify-center">
                      <CheckCircle className="text-[#00c2ff]" size={20} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-600">
                {backgroundOptions.find(bg => bg.id === selectedBackground)?.name}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Bloc de détail de leçon enrichi
const LessonDetailBlock: React.FC<{
  lesson: Lesson | null;
  lessons: Lesson[];
  course?: Course;
  purchasedItems?: Set<string>;
  onStartLesson: () => void;
  onClose: () => void;
  onLessonPurchaseCheck: (lesson: Lesson) => void;
  onShowQuiz: () => void;
  onShowPreview: () => void;
  onOpenUpsell: () => void;
}> = ({ lesson, lessons, course, purchasedItems, onStartLesson, onClose, onLessonPurchaseCheck, onShowQuiz, onShowPreview, onOpenUpsell }) => {
  if (!lesson) return null;
  
  const getStatusInfo = () => {
    if (lesson.isCompleted) return { 
      text: 'Terminée', 
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: CheckCircle,
      description: 'Vous avez terminé cette leçon avec succès'
    };
    if (lesson.isInProgress) return { 
      text: lesson.quizCompleted ? `En cours (Quiz: ${lesson.quizScore}%)` : 'En cours', 
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Play,
      description: lesson.quizCompleted ? 
        'Quiz terminé - continuez avec la vidéo complète' : 
        'Continuez là où vous vous êtes arrêté'
    };
    if (lesson.quizCompleted) return {
      text: `Quiz fait (${lesson.quizScore}%)`,
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: Brain,
      description: 'Quiz terminé - débloquez la leçon pour continuer'
    };
    return { 
      text: 'À découvrir', 
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: Star,
      description: 'Nouvelle leçon à explorer'
    };
  };
  
  const getDifficultyInfo = () => {
    switch (lesson.difficulty) {
      case 'beginner': return { 
        text: 'Facile', 
        color: 'bg-gray-100 text-gray-800',
        description: 'Parfait pour débuter',
        estimatedTime: '10-15 min'
      };
      case 'intermediate': return { 
        text: 'Intermédiaire', 
        color: 'bg-gray-100 text-gray-700',
        description: 'Demande un peu de concentration',
        estimatedTime: '20-25 min'
      };
      case 'advanced': return { 
        text: 'Avancé', 
        color: 'bg-gray-100 text-gray-700',
        description: 'Niveau expert requis',
        estimatedTime: '30-45 min'
      };
    }
  };

  const status = getStatusInfo();
  const difficulty = getDifficultyInfo();
  const StatusIcon = status.icon;

  // Calcul du pourcentage de progression si en cours
  const progressPercentage = lesson.isInProgress ? Math.floor(Math.random() * 60) + 20 : 0;
  // S'assurer que progressPercentage est un nombre valide
  const safeProgressPercentage = isNaN(progressPercentage) ? 0 : Math.max(0, Math.min(100, progressPercentage));

  // Fonction pour générer les objectifs d'apprentissage basés sur la leçon
  const getLearningObjectives = (lesson: Lesson): string[] => {
    if (lesson.objectives && lesson.objectives.length > 0) {
      return lesson.objectives;
    }
    
    // Objectifs générés automatiquement selon le type et le titre de la leçon
    const defaultObjectives: string[] = [];
    
    if (lesson.title.toLowerCase().includes('gauss')) {
      defaultObjectives.push(
        'Maîtriser les concepts fondamentaux de la loi de Gauss',
        'Appliquer la loi dans des situations concrètes',
        'Résoudre des exercices pratiques étape par étape',
        'Comprendre les applications en électrostatique'
      );
    } else if (lesson.title.toLowerCase().includes('intégrale')) {
      defaultObjectives.push(
        'Comprendre les techniques d\'intégration avancées',
        'Résoudre des intégrales complexes',
        'Appliquer les intégrales en physique',
        'Maîtriser les méthodes de calcul'
      );
    } else {
      defaultObjectives.push(
        'Assimiler les concepts clés de la leçon',
        'Développer une compréhension approfondie',
        'Appliquer les connaissances acquises',
        'Réussir les exercices pratiques'
      );
    }
    
    return defaultObjectives;
  };

  // Vérifier si l'utilisateur a le pack complet (basé sur les achats réels)
  const hasFullPack = course?.isOwned || 
                     (course?.packId && purchasedItems?.has(`pack-${course.packId}`)) ||
                     (course && purchasedItems?.has(`course-${course.id}`)) ||
                     false;
  
  // Vérifier si c'est une des 2 premières leçons (aperçu gratuit)
  const isPreviewLesson = lesson.order <= 2;
  
  // Les slides sont accessibles pour toutes les leçons
  const canAccessSlides = true;

  const handleSlidesDownload = () => {
    // Téléchargement des slides via lien direct
    const url = lesson.slidesUrl || `/slides/${lesson.id}-slides.pdf`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${lesson.title.replace(/[^a-zA-Z0-9]/g, '_')}_slides.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">{lesson.title}</h3>
              {/* Lien Slides - Style texte */}
              {canAccessSlides && (
                <button
                  onClick={handleSlidesDownload}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Download size={16} />
                  <span className="text-sm">Télécharger les slides</span>
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

      </div>

      {/* Contenu principal - Layout avec boutons à droite */}
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Contenu principal à gauche */}
          <div className="flex-1">
            {/* Description */}
            {lesson.description && (
              <div className="mb-5">
                <p className="text-gray-700 leading-relaxed text-base">{lesson.description}</p>
              </div>
            )}


            {/* Progression si en cours */}
            {lesson.isInProgress && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-medium text-gray-900">{safeProgressPercentage}% terminé</span>
                  <span className="text-sm text-gray-500">{lessons.filter(l => l.isCompleted).length}/{lessons.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div 
                    className="bg-gray-900 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${safeProgressPercentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            )}

            {/* Objectifs */}
            {lesson.objectives && lesson.objectives.length > 0 && (
              <div className="mb-5">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <Target size={20} className="text-gray-700" />
                  Ce que vous allez apprendre
                </h4>
                <ul className="space-y-3">
                  {lesson.objectives.map((objective, index) => (
                    <li key={`lesson-objective-${index}`} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 text-base">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Métriques */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <Clock size={18} />
                    <span className="text-sm font-medium">Durée</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{lesson.duration} min</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <Zap size={18} />
                    <span className="text-sm font-medium">Récompense</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">+{lesson.xpReward} XP</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <Star size={18} />
                    <span className="text-sm font-medium">Niveau</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{difficulty?.text || 'Non défini'}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <BookOpen size={18} />
                    <span className="text-sm font-medium">Type</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {lesson.type === 'video' ? 'Vidéo' : lesson.type === 'exercise' ? 'Exercice' : 'Quiz'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action à droite */}
          <div className="flex flex-col lg:flex-col gap-4 min-w-full lg:min-w-[200px] lg:max-w-[220px]">
            
            {/* Sur mobile : disposition horizontale des boutons secondaires */}
            <div className="flex lg:hidden gap-3 mb-3">
              {/* Bouton Je me teste - Mobile */}
              <button
                onClick={onShowQuiz}
                className="flex-1 bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-400 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                title={lesson.isOwned ? "Test complet accessible" : "Test gratuit disponible"}
              >
                <HelpCircle size={18} />
                <span className="text-base">Je me teste</span>
              </button>
              
            </div>
            
            {/* Bouton principal - Commencer */}
            <button
              onClick={() => {
                console.log('🚀 Button clicked! Calling onLessonPurchaseCheck with lesson:', lesson);
                onLessonPurchaseCheck(lesson);
              }}
              className="w-full px-5 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl bg-gray-900 text-white hover:bg-gray-800"
            >
              <Play size={20} />
              <span className="text-base">
                {lesson.isCompleted ? 'Revoir' : 
                  lesson.isInProgress ? 'Continuer' : 
                 'Commencer'}
              </span>
            </button>
            
            {/* Sur desktop : disposition verticale des boutons secondaires */}
            <div className="hidden lg:flex lg:flex-col gap-4">
              {/* Bouton Je me teste - Desktop */}
              <button
                onClick={onShowQuiz}
                className="w-full bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-400 text-gray-700 px-5 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                title={lesson.isOwned ? "Test complet accessible" : "Test gratuit disponible"}
              >
                <HelpCircle size={18} />
                <span className="text-base">Je me teste</span>
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MINI-BENTO BUTTONS - Sélecteurs de contenu contextuel
// ============================================================================
type ContextPanelTypeBtn = 'essentials' | 'quiz' | 'qa' | 'resources' | 'notes' | null;

interface MiniBentoButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: string;
}

const MiniBentoButton: React.FC<MiniBentoButtonProps> = ({ icon, label, isActive, onClick, badge }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
      isActive 
        ? 'bg-gray-900 text-white shadow-lg' 
        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${
      isActive ? 'bg-white/20' : 'bg-gray-100'
    }`}>
      {icon}
    </div>
    <span className="text-[12px] font-medium">{label}</span>
    {badge && (
      <span className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-[8px] font-bold rounded-full ${
        isActive ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
      }`}>
        {badge}
      </span>
    )}
  </motion.button>
);

interface MiniBentoGridProps {
  activePanel: ContextPanelTypeBtn;
  onTogglePanel: (panel: ContextPanelTypeBtn) => void;
}

const MiniBentoGrid: React.FC<MiniBentoGridProps> = ({ activePanel, onTogglePanel }) => (
  <div className="grid grid-cols-5 gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200">
    <MiniBentoButton
      icon={<BookOpen size={16} className={activePanel === 'essentials' ? 'text-white' : 'text-gray-600'} />}
      label="Essentiels"
      isActive={activePanel === 'essentials'}
      onClick={() => onTogglePanel('essentials')}
    />
    <MiniBentoButton
      icon={<Brain size={16} className={activePanel === 'quiz' ? 'text-white' : 'text-gray-600'} />}
      label="Quiz"
      isActive={activePanel === 'quiz'}
      onClick={() => onTogglePanel('quiz')}
      badge="3"
    />
    <MiniBentoButton
      icon={<MessageSquare size={16} className={activePanel === 'qa' ? 'text-white' : 'text-gray-600'} />}
      label="Q&A"
      isActive={activePanel === 'qa'}
      onClick={() => onTogglePanel('qa')}
      badge="8"
    />
    <MiniBentoButton
      icon={<FileText size={16} className={activePanel === 'resources' ? 'text-white' : 'text-gray-600'} />}
      label="Ressources"
      isActive={activePanel === 'resources'}
      onClick={() => onTogglePanel('resources')}
    />
    <MiniBentoButton
      icon={<Lightbulb size={16} className={activePanel === 'notes' ? 'text-white' : 'text-gray-600'} />}
      label="Notes"
      isActive={activePanel === 'notes'}
      onClick={() => onTogglePanel('notes')}
    />
  </div>
);

export function IntegratedCourseViewer({ 
  course, 
  isOpen, 
  onClose, 
  onNavigateToSection, 
  showSettings = false, 
  onToggleSettings,
  purchasedItems = new Set(),
  onPurchase,
  user: propUser,
  lessons: propLessons,
  onLessonsUpdate,
  userXPProfile: propUserXPProfile,
  initialLessonId
}: IntegratedCourseViewerProps) {
  const [currentView, setCurrentView] = useState<'map' | 'lesson'>(initialLessonId ? 'lesson' : 'map');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [pendingLessonsUpdate, setPendingLessonsUpdate] = useState<Lesson[] | null>(null);
  const [selectedLessonForDetail, setSelectedLessonForDetail] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [coursePath, setCoursePath] = useState<{ x: number; y: number }[]>([]);
  const [selectedBackground, setSelectedBackground] = useState('pastel-gradient');
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showIdentityVerification, setShowIdentityVerification] = useState(false);
  
  // Hook pour gérer les favoris
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // États pour le système d'upsell
  const [showPurchaseUpsell, setShowPurchaseUpsell] = useState(false);
  const [selectedLessonForPurchase, setSelectedLessonForPurchase] = useState<Lesson | null>(null);
  const [upsellOptions, setUpsellOptions] = useState<PurchaseOption[]>([]);
  const [showWalletTopUp, setShowWalletTopUp] = useState(false);
  const [user, setUser] = useState<User>(propUser || mockUser);
  const [selectedStudyRoom, setSelectedStudyRoom] = useState<AdvancedStudyRoom | null>(null);
  
  // États pour le header (répliqués du SimpleDashboard)
  const [showSocialFeed, setShowSocialFeed] = useState(false);
  const [userXPProfile, setUserXPProfile] = useState<UserXPProfile | null>(null);
  const [walletUpdateTrigger, setWalletUpdateTrigger] = useState(0);

  // Calculer les infos de Study Room pour le cours actuel
  const courseStudyRoomInfo = React.useMemo(() => {
    if (!course?.id) return null;
    
    const allRooms = AdvancedStudyRoomService.getActiveStudyRooms();
    const room = allRooms.find(r => 
      r.courseId === course.id && (r.status === 'live' || r.status === 'scheduled')
    );
    
    if (!room) return null;
    
    return {
      room,
      isActive: room.status === 'live',
      participantCount: room.currentParticipants.filter(p => !p.leftAt).length
    };
  }, [course?.id]);
  
  // Mettre à jour le user local quand propUser change
  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    }
  }, [propUser]);
  
  // Initialiser le profil XP depuis les props ou le service
  useEffect(() => {
    if (propUserXPProfile) {
      setUserXPProfile(propUserXPProfile);
    } else {
    const profile = XPService.getInstance().getUserXPProfile();
    setUserXPProfile(profile);
    }
  }, [propUserXPProfile, user?.id]);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showGuestPassModal, setShowGuestPassModal] = useState(false);
  const [showMobileLessonNav, setShowMobileLessonNav] = useState(false);
  const [guestPassEmails, setGuestPassEmails] = useState('');
  const [expandedBentoCard, setExpandedBentoCard] = useState<string | null>(null);
  
  // 🎯 NOUVEAU: Système de zones contextuelles pilotées par l'utilisateur
  // Zone 2 sous la vidéo - vide par défaut, affiche le contenu selon le bouton sélectionné
  type ContextPanelType = 'essentials' | 'quiz' | 'qa' | 'resources' | 'notes' | null;
  const [activeContextPanel, setActiveContextPanel] = useState<ContextPanelType>(null);
  
  // Toggle du panneau contextuel (clic sur même bouton = ferme)
  const toggleContextPanel = (panel: ContextPanelType) => {
    setActiveContextPanel(prev => prev === panel ? null : panel);
  };

  // Navigation items - identiques au dashboard principal
  const navigationItems = [
    { id: 'courses', label: 'Mon parcours', icon: BookOpen, isActive: true, hasAccess: true },
    { id: 'planning', label: 'Planification', icon: Calendar, isActive: false, hasAccess: true },
    { id: 'study-rooms', label: 'Study Rooms', icon: Video, isActive: false, hasAccess: true },
    { id: 'community', label: 'Social Club', icon: Users, isActive: false, hasAccess: true },
    { id: 'training', label: 'Training Club', icon: Target, isActive: false, hasAccess: true },
  ];
  
  // État pour le mode fullscreen du lecteur vidéo
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Effet pour gérer les mises à jour différées vers le parent
  useEffect(() => {
    if (pendingLessonsUpdate && onLessonsUpdate) {
      console.log('🔧 Notification différée du parent avec les leçons mises à jour');
      onLessonsUpdate(pendingLessonsUpdate);
      setPendingLessonsUpdate(null);
    }
  }, [pendingLessonsUpdate, onLessonsUpdate]);

  // Mock data
  useEffect(() => {
    // Si des leçons sont fournies via props, les utiliser
    if (propLessons && propLessons.length > 0) {
      setLessons(propLessons);
      setCoursePath(generateCoursePath(propLessons));
      
      // Si un initialLessonId est fourni, ouvrir directement cette leçon
      if (initialLessonId) {
        const initialLesson = propLessons.find(l => l.id === initialLessonId);
        if (initialLesson) {
          setSelectedLesson(initialLesson);
          setCurrentView('lesson');
        } else if (propLessons.length > 0) {
          setSelectedLessonForDetail(propLessons[0]);
        }
      } else if (propLessons.length > 0) {
        setSelectedLessonForDetail(propLessons[0]);
      }
    } else if (course) {
      const mockLessons: Lesson[] = [
        {
          id: '1',
          courseId: course.id,
          title: 'Les fondamentaux essentiels',
          description: '',
          duration: 15,
          type: 'video',
          order: 1,
          isCompleted: false,
          isAccessible: true,
          progress: 0,
          hasPreview: true,
          videoUrl: 'https://example.com/video1.mp4',
          slidesUrl: '/slides/lesson-1-fondamentaux.pdf',
          documents: [],
          xpReward: 25,
          difficulty: 'beginner',
          objectives: [
            'Comprendre les concepts fondamentaux du sujet',
            'Identifier les éléments clés à retenir',
            'Établir une base solide pour la suite du cours',
            'Acquérir le vocabulaire technique essentiel'
          ],
          prerequisites: [],
          isInProgress: true,
          isOwned: false,
          price: 70,
          previewAvailable: true,
          tags: ['fondamentaux', 'débutant']
        },
        {
          id: '2',
          courseId: course.id,
          title: 'Techniques avancées',
          description: 'Approfondissez vos connaissances avec des techniques pratiques et des méthodes éprouvées. Cette leçon vous donnera les outils nécessaires pour exceller dans votre domaine d\'étude.',
          duration: 22,
          type: 'video',
          order: 2,
          isCompleted: false,
          isAccessible: false,
          progress: 0,
          hasPreview: true,
          videoUrl: 'https://example.com/video2.mp4',
          slidesUrl: '/slides/lesson-2-techniques-avancees.pdf',
          documents: [],
          xpReward: 35,
          difficulty: 'intermediate',
          objectives: [
            'Maîtriser les techniques avancées du domaine',
            'Appliquer des méthodes professionnelles',
            'Résoudre des problèmes complexes',
            'Développer votre esprit critique et analytique'
          ],
          prerequisites: [
            'Avoir terminé "Les fondamentaux essentiels"',
            'Comprendre les bases théoriques du sujet'
          ],
          isInProgress: false,
          isOwned: false,
          price: 85,
          previewAvailable: true,
          tags: ['avancé', 'technique']
        },
        {
          id: '3',
          courseId: course.id,
          title: 'Mise en pratique avancée',
          description: 'Mettez en application tout ce que vous avez appris à travers des exercices concrets et des cas d\'usage réels. Cette leçon pratique consolidera vos acquis théoriques.',
          duration: 28,
          type: 'exercise',
          order: 3,
          isCompleted: false,
          isAccessible: false,
          progress: 0,
          hasPreview: false,
          slidesUrl: '/slides/lesson-3-mise-en-pratique.pdf',
          documents: [],
          xpReward: 40,
          difficulty: 'intermediate',
          objectives: [
            'Appliquer les connaissances dans des situations réelles',
            'Développer votre autonomie et votre créativité',
            'Résoudre des exercices pratiques variés',
            'Consolider vos acquis par la pratique'
          ],
          prerequisites: [
            'Avoir terminé les 2 premières leçons',
            'Maîtriser les techniques de base'
          ],
          isInProgress: false,
          isOwned: false,
          price: 95,
          previewAvailable: false,
          tags: ['pratique', 'exercices']
        },
        {
          id: '4',
          courseId: course.id,
          title: 'Projet de synthèse',
          description: 'Réalisez un projet complet qui intègre toutes les compétences acquises. Cette leçon projet vous permettra de démontrer votre maîtrise globale du sujet.',
          duration: 35,
          type: 'exercise',
          order: 4,
          isCompleted: false,
          isAccessible: false,
          progress: 0,
          hasPreview: false,
          slidesUrl: '/slides/lesson-4-projet-synthese.pdf',
          documents: [],
          xpReward: 50,
          difficulty: 'advanced',
          objectives: [
            'Concevoir et réaliser un projet complet',
            'Intégrer toutes les compétences acquises',
            'Démontrer votre autonomie et créativité',
            'Présenter et défendre votre travail'
          ],
          prerequisites: [
            'Avoir terminé toutes les leçons précédentes',
            'Maîtriser l\'ensemble des concepts du cours'
          ],
          isInProgress: false,
          isOwned: false,
          price: 110,
          previewAvailable: false,
          tags: ['projet', 'synthèse']
        },
        {
          id: '5',
          courseId: course.id,
          title: 'Évaluation finale',
          description: 'Démontrez votre maîtrise complète du cours avec une évaluation finale comprehensive. Cette évaluation validera officiellement vos compétences nouvellement acquises.',
          duration: 25,
          type: 'quiz',
          order: 5,
          isCompleted: false,
          isAccessible: false,
          progress: 0,
          hasPreview: false,
          slidesUrl: '/slides/lesson-5-evaluation-finale.pdf',
          documents: [],
          xpReward: 60,
          difficulty: 'advanced',
          objectives: [
            'Valider l\'ensemble de vos connaissances',
            'Obtenir votre certification de cours',
            'Démontrer votre niveau de maîtrise',
            'Identifier vos points forts et axes d\'amélioration'
          ],
          prerequisites: [
            'Avoir terminé l\'intégralité du parcours',
            'Avoir validé le projet de synthèse'
          ],
          isInProgress: false,
          isOwned: false,
          price: 75,
          previewAvailable: false,
          tags: ['évaluation', 'certification']
        }
      ];
      
      setLessons(mockLessons);
      setCoursePath(generateCoursePath(mockLessons));
      
      // Sélectionner automatiquement la première leçon par défaut
      if (mockLessons.length > 0) {
        setSelectedLessonForDetail(mockLessons[0]);
      }
    }
  }, [course, propLessons, initialLessonId]);

  if (!course) return null;

  const handleNodeClick = (lesson: Lesson) => {
    // Toujours permettre d'ouvrir le bloc descriptif, même pour les leçons verrouillées
    setSelectedLessonForDetail(lesson);
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
    setShowCommunity(false);
  };

  // Handlers pour la vérification d'identité
  const handleIdentityUpload = (file: File) => {
    console.log('📄 Document d\'identité uploadé:', file.name);
    IdentityVerificationService.uploadDocument(file);
    setShowIdentityVerification(false);
  };

  // Vérifier si la vérification doit être affichée
  useEffect(() => {
    if (IdentityVerificationService.shouldShowVerification()) {
      setShowIdentityVerification(true);
    }
  }, []);

  // Simuler la complétion d'une leçon (pour déclencher la vérification)
  const handleLessonCompleted = () => {
    const shouldTrigger = IdentityVerificationService.incrementLessonsCompleted();
    if (shouldTrigger) {
      setTimeout(() => {
        setShowIdentityVerification(true);
      }, 1000); // Délai pour une meilleure UX
    }
  };

  // Gestion des favoris
  const handleToggleFavorite = () => {
    toggleFavorite(course.id, course.title);
  };

  // Déclenchement manuel de la vérification d'identité
  const handleTriggerIdentityVerification = () => {
    console.log('🔐 Vérification d\'identité déclenchée manuellement');
    IdentityVerificationService.triggerVerification();
    setShowIdentityVerification(true);
  };

  // Handlers pour le système d'upsell
  const handleLessonPurchaseCheck = (lesson: Lesson) => {
    // Démarrer directement la leçon sans vérifier la propriété ni ouvrir la modal d'upsell
    console.log('🚀 Starting lesson directly:', lesson.title);
      handleStartLesson();
  };

  const handlePurchase = (option: PurchaseOption) => {
    console.log('🔥 LOCAL handlePurchase called with:', { type: option.type, itemId: option.itemId, price: option.price });
    console.log('🔥 Current user balance:', user.wallet.balance);
    
    // Note: La gestion du portefeuille et des transactions est faite par SimpleDashboard
    // Cette fonction se contente de mettre à jour les leçons localement
    console.log('🔥 Updating lessons locally (wallet handled by parent)...');

    // Mettre à jour les leçons
    if (option.type === 'lesson') {
      console.log('🔥 Updating single lesson:', option.itemId);
      setLessons(prev => {
        const updated = prev.map(l => 
          l.id === option.itemId ? { ...l, isOwned: true } : l
        );
        // Programmer la notification différée du parent
        setPendingLessonsUpdate(updated);
        return updated;
      });
    } else if (option.type === 'course') {
      console.log('🔥 Updating ALL lessons for course purchase');
      setLessons(prev => {
        const updated = prev.map(l => ({ ...l, isOwned: true }));
        console.log('🔥 Updated lessons:', updated.map(l => ({ id: l.id, isOwned: l.isOwned })));
        // Programmer la notification différée du parent
        setPendingLessonsUpdate(updated);
        return updated;
      });
    }

    console.log('🔥 LOCAL handlePurchase completed successfully');
  };

  const handleWalletTopUp = (amount: number, bonus: number) => {
    const totalAdded = amount + bonus;
    console.log(`💰 Wallet rechargé: +${amount}€ + ${bonus}€ bonus = ${totalAdded}€`);
    
    const updatedUser = { ...user };
    updatedUser.wallet.balance += totalAdded;
    updatedUser.wallet.totalDeposited += amount; // Seul le montant original compte
    
    // Ajouter la transaction principale
    updatedUser.wallet.transactions.unshift({
      id: `tx-${Date.now()}`,
      walletId: user.wallet.id,
      type: 'deposit',
      amount: amount,
      description: `Rechargement du portefeuille`,
      createdAt: new Date()
    });

    // Ajouter la transaction bonus si applicable
    if (bonus > 0) {
      updatedUser.wallet.transactions.unshift({
        id: `tx-bonus-${Date.now()}`,
        walletId: user.wallet.id,
        type: 'bonus',
        amount: bonus,
        description: `Bonus de recharge`,
        createdAt: new Date()
      });
    }

    setUser(updatedUser);
    setShowWalletTopUp(false);
  };

  const completedLessons = lessons.filter(l => l.isCompleted).length;
  const totalXP = lessons.filter(l => l.isCompleted).reduce((acc, l) => acc + (l.xpReward || 0), 0);
  const totalPossibleXP = lessons.reduce((acc, l) => acc + (l.xpReward || 0), 0);
  const safeXPPercentage = totalPossibleXP > 0 ? (totalXP / totalPossibleXP) * 100 : 0;
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
  const selectedBg = backgroundOptions.find(bg => bg.id === selectedBackground);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
        <motion.div
          key="integrated-course-viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-gray-50 flex flex-col overflow-y-auto"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
          }}
        >
          {currentView === 'map' ? (
            /* Vue Map Intégrée */
            <>
              {/* GlobalHeader - Navigation unifiée */}
              <GlobalHeader
                activeSection="courses"
                onNavigate={(sectionId) => {
                          onClose();
                  onNavigateToSection?.(sectionId);
                        }}
                userName={user?.name || 'Utilisateur'}
                userAvatar={user?.avatar}
                userLevel={userXPProfile?.level || 1}
                userXP={userXPProfile?.currentXP || 0}
                isSubscribed={purchasedItems && purchasedItems.size > 0}
                onOpenGuestPass={() => setShowGuestPassModal(true)}
                onFinishSignup={onClose}
                onOpenProfile={() => {
                          onClose();
                  onNavigateToSection?.('profile');
                }}
                onOpenSettings={() => {}}
                onLogout={onClose}
                themeColor="#00c2ff"
              />

              {/* Contenu principal - Map (sans sidebar) */}
              <div className="flex flex-1 overflow-hidden pt-[70px] md:pt-[100px]">
                {/* Contenu principal - Map */}
                <main className="flex-1 overflow-y-auto">
                  {/* KPIs de progression */}
                  <div className="px-4 md:px-6 py-4 md:py-6 bg-white border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg md:text-2xl font-bold text-gray-900 truncate">{course.title}</h2>
                          <p className="text-sm md:text-base text-gray-600">Votre parcours d'apprentissage</p>
                        </div>
                      </div>
                    </div>
                    
                  </div>

                  {/* Vue mobile - Liste de leçons */}
                  <div className="lg:hidden p-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">Navigation du cours</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>{lessons.length} leçons</span>
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progression globale</span>
                          <span className="font-semibold text-gray-900">{Math.round((lessons.filter(l => l.isCompleted).length / lessons.length) * 100)}% terminé</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gray-900 rounded-full transition-all"
                            style={{ width: `${(lessons.filter(l => l.isCompleted).length / lessons.length) * 100}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{lessons.filter(l => l.isCompleted).length} sur {lessons.length} leçons terminées</p>
                      </div>
                    </div>
                    
                    {/* Liste des leçons mobile */}
                    <div className="space-y-2">
                      {lessons.map((lesson, index) => {
                        const isCurrentLesson = lesson.isInProgress || (!lesson.isCompleted && index === lessons.findIndex(l => !l.isCompleted));
                        // Mode essai: seule la première leçon est accessible, les autres sont en preview
                        const isTrialMode = course?.isTrial === true;
                        const isFirstLessonInTrial = isTrialMode && index === 0;
                        const isTrialPreview = isTrialMode && index > 0;
                        const isLocked = (!lesson.isCompleted && !isCurrentLesson && index > 0) || isTrialPreview;
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              if (!isLocked || isFirstLessonInTrial) {
                                handleNodeClick(lesson);
                              }
                            }}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                              selectedLessonForDetail?.id === lesson.id
                                ? 'border-[#00c2ff] bg-[#00c2ff]/5'
                                : isCurrentLesson && !isTrialPreview
                                ? 'border-[#00c2ff]/50 bg-white'
                                : lesson.isCompleted
                                ? 'border-gray-300 bg-gray-50'
                                : isTrialPreview
                                ? 'border-orange-200 bg-orange-50/30'
                                : 'border-gray-200 bg-white'
                            } ${isLocked && !isTrialPreview ? 'opacity-60' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                lesson.isCompleted
                                  ? 'bg-gray-900 text-white'
                                  : isCurrentLesson && !isTrialPreview
                                  ? 'bg-[#00c2ff] text-white'
                                  : isTrialPreview
                                  ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                                  : 'bg-gray-200 text-gray-500'
                              }`}>
                                {lesson.isCompleted ? (
                                  <Check size={18} />
                                ) : isTrialPreview ? (
                                  <Eye size={16} />
                                ) : isLocked ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                                  </svg>
                                ) : (
                                  index + 1
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  {!isLocked && !lesson.isCompleted && !isTrialPreview && (
                                    <Play size={14} className="text-[#00c2ff] flex-shrink-0" />
                                  )}
                                  {isTrialPreview && (
                                    <Eye size={14} className="text-orange-500 flex-shrink-0" />
                                  )}
                                  <h4 className="font-semibold text-gray-900 truncate">{lesson.title}</h4>
                                </div>
                                <p className="text-sm text-gray-500">{lesson.duration} min</p>
                              </div>
                              
                              <div className="flex-shrink-0">
                                {lesson.isCompleted ? (
                                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Terminé</span>
                                ) : isTrialPreview ? (
                                  <span className="text-sm font-medium text-orange-600 bg-gradient-to-r from-orange-100 to-orange-200 px-2 py-1 rounded-full">
                                    Preview
                                  </span>
                                ) : isCurrentLesson ? (
                                  <span className="text-sm font-medium text-[#00c2ff] bg-[#00c2ff]/10 px-2 py-1 rounded-full">En cours</span>
                                ) : isLocked ? (
                                  <span className="text-sm font-medium text-gray-400">Verrouillée</span>
                                ) : null}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Message mode essai */}
                    {course?.isTrial && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Eye size={18} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Mode Essai</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              La première leçon est entièrement accessible. Les autres leçons sont disponibles en preview.
                              Utilise tes 10h offertes pour débloquer plus de contenu !
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bloc map avec fond personnalisable et scroll - Desktop only */}
                  <div className={`hidden lg:block relative min-h-[400px] overflow-auto ${selectedBg?.style}`}>
                    <div className="relative p-8 min-w-[1100px] min-h-[450px]">
                      {/* Chemin et nodes */}
                      <CoursePath path={coursePath} lessons={lessons} />
                      
                      {lessons.map((lesson, index) => (
                        <CourseNode
                          key={lesson.id}
                          lesson={lesson}
                          position={coursePath[index]}
                          isSelected={selectedLessonForDetail?.id === lesson.id}
                          onClick={() => handleNodeClick(lesson)}
                          index={index}
                          course={course!}
                          purchasedItems={purchasedItems}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bloc de détail sous la map */}
                  <div className="p-4 lg:p-6">
                    <AnimatePresence>
                      {selectedLessonForDetail && (() => {
                        // Trouver la version à jour de la leçon dans le state lessons
                        const currentLesson = lessons.find(l => l.id === selectedLessonForDetail.id) || selectedLessonForDetail;
                        return (
                          <LessonDetailBlock
                            key={selectedLessonForDetail.id}
                            lesson={currentLesson}
                            lessons={lessons}
                            course={course}
                            purchasedItems={purchasedItems}
                          onStartLesson={handleStartLesson}
                          onLessonPurchaseCheck={handleLessonPurchaseCheck}
                          onShowQuiz={() => {
                            console.log('🎯 QUIZ CLICKED:', {
                              currentLesson: currentLesson?.title,
                              hasQuestions: getQuizByLessonId(currentLesson?.id || ''),
                              showQuiz: showQuiz,
                              showPreview: showPreview
                            });
                            setSelectedLessonForDetail(currentLesson);
                            setShowPreview(false);
                            setShowQuiz(true);
                            console.log('🎯 QUIZ STATE AFTER CLICK:', { showQuiz: true, showPreview: false });
                          }}
                          onShowPreview={() => {
                            setSelectedLessonForDetail(currentLesson);
                            setShowQuiz(false);
                            setShowPreview(true);
                          }}
                          onOpenUpsell={() => {
                            const options = generateUpsellOptions(currentLesson?.id || '');
                            setUpsellOptions(options);
                            setShowPurchaseUpsell(true);
                          }}
                          onClose={() => {
                            // Fermer le panneau de détail
                            setSelectedLessonForDetail(null);
                          }}
                          />
                        );
                      })()}
                    </AnimatePresence>
                  </div>
                </main>
              </div>
            </>
          ) : selectedLesson ? (
            /* Vue Leçon avec GlobalHeader */
            <>
              {/* GlobalHeader - Navigation unifiée */}
              <GlobalHeader
                activeSection="courses"
                onNavigate={(sectionId) => {
                          onClose();
                  onNavigateToSection?.(sectionId);
                        }}
                userName={user?.name || 'Utilisateur'}
                userAvatar={user?.avatar}
                userLevel={userXPProfile?.level || 1}
                userXP={userXPProfile?.currentXP || 0}
                isSubscribed={purchasedItems && purchasedItems.size > 0}
                onOpenGuestPass={() => setShowGuestPassModal(true)}
                onFinishSignup={onClose}
                onOpenProfile={() => {
                          onClose();
                  onNavigateToSection?.('profile');
                }}
                onOpenSettings={() => {}}
                onLogout={onClose}
                themeColor="#00c2ff"
              />

              {/* Contenu principal leçon - Layout Web 3.0 (sans sidebar) */}
              <div className="flex flex-1 overflow-hidden pt-[80px] md:pt-[130px]">
                {/* Contenu principal leçon - Layout Web 3.0 */}
                <main className="flex-1 overflow-y-auto">
                  {/* Header avec breadcrumb et titre leçon - Fixe au scroll */}
                  <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 md:py-6 sticky top-0 z-20">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Retour + Titre */}
                      <div className="flex items-center gap-4 min-w-0">
                        <button
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <ArrowLeft size={16} />
                          <span className="hidden sm:block">Retour au parcours</span>
                        </button>
                        <div className="hidden sm:block h-6 w-px bg-gray-200 flex-shrink-0"></div>
                        <div className="min-w-0">
                          <h1 className="font-title font-bold text-gray-900 truncate" style={{ fontSize: '48px' }}>{selectedLesson.title}</h1>
                    </div>
                      </div>

                      {/* Right: Navigation rapide - Icônes avec badges */}
                      <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                        {/* Study Rooms - Badge LIVE */}
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToSection?.('study-rooms');
                          }}
                          className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                          title="Study Rooms"
                        >
                          <Video size={20} />
                          {/* Badge LIVE pulsant */}
                          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center">
                            <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                          </span>
                        </button>
                        
                        {/* Planning - Badge nombre de sessions aujourd'hui */}
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToSection?.('planning');
                        }}
                          className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                          title="Planning"
                      >
                          <Calendar size={20} />
                          {/* Badge nombre */}
                          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#00c2ff] text-white text-[10px] font-bold rounded-full px-1">
                            3
                          </span>
                      </button>

                        {/* Training */}
                        <button
                            onClick={() => {
                                onClose();
                            onNavigateToSection?.('training');
                            }}
                          className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                          title="Training Club"
                        >
                          <Target size={20} />
                        </button>

                        {/* Social Club - Badge messages non lus */}
                          <button
                          onClick={() => {
                                    onClose();
                            onNavigateToSection?.('community');
                          }}
                          className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                          title="Social Club"
                              >
                          <Users size={20} />
                          {/* Badge messages */}
                          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#00c2ff] text-white text-[10px] font-bold rounded-full px-1">
                            12
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Layout principal - Cinéma + Sidebar */}
                  <div className="flex bg-white relative" style={{ height: 'calc(100vh - 130px)' }}>
                    {/* Bouton mobile pour afficher les leçons */}
                    <button
                      onClick={() => setShowMobileLessonNav(true)}
                      className="lg:hidden fixed bottom-20 right-4 z-40 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                      aria-label="Voir les leçons"
                    >
                      <List size={24} />
                    </button>

                    {/* Panel mobile des leçons */}
                    <AnimatePresence>
                      {showMobileLessonNav && (
                        <>
                          {/* Overlay */}
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                            onClick={() => setShowMobileLessonNav(false)}
                          />
                          {/* Panel */}
                              <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed inset-y-0 right-0 w-[85%] max-w-[380px] bg-white z-50 overflow-y-auto shadow-2xl"
                          >
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                              <h3 className="font-bold text-gray-900">Navigation des leçons</h3>
                              <button
                                onClick={() => setShowMobileLessonNav(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                              >
                                <X size={20} className="text-gray-500" />
                              </button>
                                  </div>
                            <div className="p-4 space-y-4">
                              <LessonNavigator
                                course={course}
                                lessons={lessons}
                                currentLessonId={selectedLesson.id}
                                onLessonSelect={(lessonId) => {
                                  const lesson = lessons.find(l => l.id === lessonId);
                                  if (lesson && (lesson.isOwned || purchasedItems.has(lessonId))) {
                                    setSelectedLesson(lesson);
                                    setSelectedLessonForDetail(lesson);
                                    setShowMobileLessonNav(false);
                                  }
                                }}
                                purchasedItems={purchasedItems}
                              />
                              <WhatsAppCTA
                                courseId={course?.id || ''}
                                courseName={course?.title || ''}
                                activeStudents={124}
                                weeklyQuestions={37}
                                isVeryActive={true}
                              />
                                </div>
                              </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                    {/* ============================================================ */}
                    {/* ZONE CENTRALE - Vidéo + Tabs contextuels */}
                    {/* ============================================================ */}
                    <div className="flex-1 p-4 md:p-6 bg-white overflow-y-auto">
                      <div className="flex flex-col w-full">
                        
                        {/* ZONE 1: Lecteur vidéo avec widgets flottants */}
                        <div className="relative w-full bg-black rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '16/8', maxHeight: 'calc(100vh - 320px)' }}>
                          <VideoWithQuiz 
                            videoUrl={selectedLesson.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                            questions={[]}
                            onQuizComplete={(score) => {
                              console.log(`Quiz terminé avec un score de ${score}`);
                              if (score >= 0.7) {
                                console.log('Leçon terminée avec succès !');
                              }
                            }}
                          />
                          
                          {/* Widgets flottants - Bord droit */}
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                            {[
                              { id: 'essentials', icon: BookOpen, label: 'Essentiels' },
                              { id: 'quiz', icon: Brain, label: 'Quiz' },
                              { id: 'qa', icon: HelpCircle, label: 'Q&A' },
                              { id: 'resources', icon: FileText, label: 'Ressources' },
                              { id: 'notes', icon: MessageSquare, label: 'Notes' }
                            ].map((widget) => (
                              <button
                                key={widget.id}
                                onClick={() => {
                                  const newPanel = activeContextPanel === widget.id ? null : widget.id;
                                  setActiveContextPanel(newPanel);
                                  // Scroll vers le contenu si on ouvre un panneau
                                  if (newPanel) {
                                    setTimeout(() => {
                                      const element = document.getElementById('context-panel-content');
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      }
                                    }, 100);
                                  }
                                }}
                                className="group relative flex items-center justify-end"
                              >
                                {/* Label - UNIQUEMENT visible au hover, couleur thème */}
                                <span className={`pointer-events-none absolute right-full mr-3 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-opacity duration-200 ${
                                  activeContextPanel === widget.id 
                                    ? 'bg-[#00c2ff] text-white opacity-100' 
                                    : 'bg-[#00c2ff] text-white opacity-0 group-hover:opacity-100 shadow-lg'
                                }`}>
                                  {widget.label}
                                </span>
                                
                                {/* Icône */}
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                  activeContextPanel === widget.id 
                                    ? 'bg-[#00c2ff] text-white' 
                                    : 'bg-white/10 border border-white/20 text-white/70 group-hover:bg-[#00c2ff] group-hover:text-white group-hover:border-[#00c2ff]'
                                }`}>
                                  <widget.icon size={18} />
                                </div>
                              </button>
                            ))}
                          </div>
                                  </div>
                                    
                        {/* ZONE 2: Contenu contextuel - EN DESSOUS de la vidéo */}
                        <div id="context-panel-content" className="mt-6">
                          
                          {/* Contenu du tab actif */}
                        <AnimatePresence mode="wait">
                          {activeContextPanel && (
                                  <motion.div
                              key={activeContextPanel}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                            >
                              {/* Panneau Essentiels */}
                              {activeContextPanel === 'essentials' && (
                                  <div>
                                  <p className="text-sm text-gray-500 mb-6">Les concepts clés de cette leçon</p>
                            
                                  {/* Concept central */}
                                  <div className="bg-gray-900 rounded-2xl p-5 mb-4">
                                    <div className="flex items-start gap-4">
                                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                        <Zap size={20} className="text-white" />
                                </div>
                                      <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Loi de Gauss - Concept fondamental</h4>
                                        <p className="text-white/80 leading-relaxed">
                                          Le flux électrique à travers une surface fermée est proportionnel à la charge totale contenue à l'intérieur.
                                      </p>
                                    </div>
                              </div>
                                </div>

                                  {/* Points clés */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <Calculator size={16} className="text-gray-600" />
                                        Formules clés
                                      </h5>
                                      <p className="text-sm text-gray-600">Φ = ∮ E · dA = Q/ε₀</p>
                                </div>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <Target size={16} className="text-gray-600" />
                                        Applications
                                      </h5>
                                      <p className="text-sm text-gray-600">Symétries sphériques, cylindriques, planes</p>
                                  </div>
                                </div>
                              </div>
                                )}

                              {/* Panneau Quiz */}
                              {activeContextPanel === 'quiz' && (
                                  <div>
                                  <div className="flex items-center justify-between mb-6">
                                        <p className="text-sm text-gray-500">Teste tes connaissances</p>
                                    <div className="flex items-center gap-2 bg-[#00c2ff]/10 px-3 py-1.5 rounded-lg">
                                      <Trophy size={16} className="text-[#00c2ff]" />
                                      <span className="text-sm font-medium text-[#00c2ff]">+50 XP</span>
                                </div>
                            </div>
                            
                                  <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                      <p className="text-2xl font-bold text-gray-900">5</p>
                                      <p className="text-sm text-gray-600">Questions</p>
                                </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                      <p className="text-2xl font-bold text-gray-900">10</p>
                                      <p className="text-sm text-gray-600">Minutes</p>
                                  </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                      <p className="text-2xl font-bold text-gray-900">70%</p>
                                      <p className="text-sm text-gray-600">Pour réussir</p>
                                </div>
                              </div>

                                  <button
                                    onClick={() => setShowQuiz(true)}
                                    className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3 px-6 font-semibold transition-all flex items-center justify-center gap-2"
                                  >
                                    <Play size={18} />
                                    Commencer le quiz
                                    </button>
                            </div>
                                )}

                              {/* Panneau Q&A */}
                              {activeContextPanel === 'qa' && (
                                          <div>
                                  <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm text-gray-500">Par slide vidéo</p>
                                    <span className="text-sm font-medium text-gray-500">8 questions</span>
                            </div>
                            
                                    <div className="space-y-4">
                                    {/* Question exemple */}
                                    <div className="border-b border-gray-100 pb-4">
                                          <div className="flex items-start gap-3">
                                        <span className="text-xs font-mono text-gray-500 mt-0.5">03:24</span>
                                        <div className="flex-1">
                                          <h4 className="font-medium text-gray-900 text-sm mb-1">Comment appliquer cette formule dans un cas pratique ?</h4>
                                          <p className="text-xs text-gray-500 mb-2">Zak L. • Répondu par Sophie M.</p>
                                          <button className="text-xs text-gray-600 hover:text-gray-900">Voir la réponse →</button>
                                </div>
                                              </div>
                                            </div>
                                    <div className="border-b border-gray-100 pb-4">
                                          <div className="flex items-start gap-3">
                                        <span className="text-xs font-mono text-gray-500 mt-0.5">07:15</span>
                                        <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-gray-900 text-sm">Quelle est la différence entre ces deux approches ?</h4>
                                            <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                                  </div>
                                          <p className="text-xs text-gray-500 mb-2">Alex R. • Sans réponse</p>
                                          <button className="text-xs text-gray-900 font-medium hover:text-gray-700">Répondre →</button>
                                            </div>
                                            </div>
                                          </div>
                                        </div>

                                  <button className="w-full mt-4 border border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900 rounded-xl py-3 px-4 text-sm font-medium transition-all">
                                    Poser une question
                                            </button>
                                                </div>
                                )}

                              {/* Panneau Ressources */}
                              {activeContextPanel === 'resources' && (
                                  <div>
                                  <p className="text-sm text-gray-500 mb-4">Documents et supports de cours</p>
                            
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                          <FileText size={18} className="text-gray-600" />
                                </div>
                                        <div>
                                          <p className="font-medium text-gray-900 text-sm">Slides du cours</p>
                                          <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                                  </div>
                                </div>
                                      <Download size={18} className="text-gray-400" />
                              </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#00c2ff]/10 rounded-lg flex items-center justify-center">
                                          <FileText size={18} className="text-[#00c2ff]" />
                                </div>
                                        <div>
                                          <p className="font-medium text-gray-900 text-sm">Exercices corrigés</p>
                                          <p className="text-xs text-gray-500">PDF • 1.8 MB</p>
                                  </div>
                                  </div>
                                      <Download size={18} className="text-gray-400" />
                              </div>
                            </div>
                                  </div>
                                )}

                              {/* Panneau Notes */}
                              {activeContextPanel === 'notes' && (
                                          <div>
                                  <p className="text-sm text-gray-500 mb-4">Notes personnelles sur cette leçon</p>

                                  <textarea
                                    placeholder="Ajoute tes notes ici..."
                                    className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 text-gray-700 placeholder:text-gray-400"
                                  />
                                  
                                  <div className="flex items-center justify-between mt-4">
                                    <p className="text-xs text-gray-500">Sauvegarde automatique</p>
                                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                      Sauvegarder
                                  </button>
                                </div>
                              </div>
                                )}
                              </motion.div>
                          )}
                        </AnimatePresence>
                            </div>
                      </div>
                    </div>

                    {/* ZONE 3 + 4 COMBINÉES: Sidebar avec navigation - Scroll indépendant */}
                    <div className="hidden lg:flex w-[320px] xl:w-[380px] bg-white border-l border-gray-200 flex-col h-full overflow-hidden">
                      <div className="p-4 space-y-4 overflow-y-auto flex-1">
                        {/* Navigation des leçons */}
                        <LessonNavigator
                          course={course}
                          lessons={lessons}
                          currentLessonId={selectedLesson.id}
                          onLessonSelect={(lessonId) => {
                            const lesson = lessons.find(l => l.id === lessonId);
                            if (lesson && (lesson.isOwned || purchasedItems.has(lessonId))) {
                              setSelectedLesson(lesson);
                              setSelectedLessonForDetail(lesson);
                            }
                          }}
                          purchasedItems={purchasedItems}
                        />

                        
                        {/* CTA WhatsApp */}
                        <WhatsAppCTA
                          courseId={course?.id || ''}
                          courseName={course?.title || ''}
                          activeStudents={124}
                          weeklyQuestions={37}
                          isVeryActive={true}
                        />
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </>
          ) : null}
        </motion.div>
      )}
      
      {/* Modales Je me teste et Aperçu */}
      
      {/* Modal Je me teste */}
      {showQuiz && !showPreview && selectedLessonForDetail && (() => {
        console.log('🎯 QUIZ MODAL RENDER:', {
          showQuiz,
          showPreview,
          selectedLessonForDetail: selectedLessonForDetail?.title,
          selectedLessonId: selectedLessonForDetail?.id
        });
        const questions = getQuizByLessonId(selectedLessonForDetail.id);
        console.log('🎯 QUIZ QUESTIONS:', { questionsLength: questions?.length, questions });
        
        if (!questions || questions.length === 0) {
          // Pas de questions disponibles - afficher un message avec le nouveau design
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="no-quiz-modal"
              className="fixed inset-0 bg-gradient-to-br from-slate-50/80 via-white/90 to-blue-50/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-md w-full p-8 shadow-2xl border border-white/20 ring-1 ring-black/5"
              >
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <HelpCircle className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Test non disponible</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Aucun test n'est encore disponible pour cette leçon. Continuez votre apprentissage !
                  </p>
                  <motion.button
                    onClick={() => setShowQuiz(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg"
                  >
                    Fermer
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          );
        }

        // Quiz disponible - utiliser le nouveau design avec MiniQuiz dans un wrapper modal
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="lesson-quiz-modal"
            className="fixed inset-0 bg-gradient-to-br from-slate-50/80 via-white/90 to-blue-50/80 backdrop-blur-sm z-[9999]"
          >
            <div className="bg-white w-full h-full overflow-hidden">
              {/* Header moderne avec navigation claire */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-24 py-16 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-5xl font-bold text-gray-900 tracking-tight">Je me teste</h2>
                      <p className="text-2xl text-gray-600 font-medium">Évaluez vos connaissances • {selectedLessonForDetail.title}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setShowQuiz(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-200 shadow-md border border-gray-200/50"
                  >
                    <X size={32} className="text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Contenu avec scroll fluide */}
              <div className="overflow-y-auto h-[calc(100vh-240px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="p-24 max-w-6xl mx-auto">
                  <div style={{ zoom: '2' }}>
                    <MiniQuiz
                    questions={questions}
                    courseTitle={selectedLessonForDetail.title}
                    onComplete={(score, total) => {
                      console.log('🎯 Quiz completed:', score, total);
                      
                      // Marquer la leçon comme complétée avec le score
                      if (selectedLessonForDetail) {
                        const updatedLesson = {
                          ...selectedLessonForDetail,
                          isInProgress: true,
                          quizCompleted: true,
                          quizScore: score
                        };
                        
                        const updatedLessons = lessons.map(lesson => 
                          lesson.id === selectedLessonForDetail.id ? updatedLesson : lesson
                        );
                        setLessons(updatedLessons);
                        onLessonsUpdate?.(updatedLessons);
                      }
                      
                      // Note: Ne pas fermer automatiquement pour laisser voir le diagnostic
                      // setShowQuiz(false); sera appelé via onClose après diagnostic
                    }}
                    onClose={() => setShowQuiz(false)}
                  />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {showPreview && !showQuiz && selectedLessonForDetail && (() => {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="lesson-preview-modal"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl w-[98vw] max-w-none max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header élégant */}
              <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
                {/* Pattern de fond */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-gray-50/20" />
                
                {/* Particules animées */}
                <motion.div 
                  className="absolute top-4 left-16 w-1.5 h-1.5 bg-[#00c2ff]/40 rounded-full"
                  animate={{ y: [0, -6, 0], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute top-6 right-24 w-1 h-1 bg-gray-400/30 rounded-full"
                  animate={{ y: [0, -4, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                />

                {/* Timer flottant */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 left-6 flex items-center gap-2 bg-[#00c2ff]/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full shadow-lg border border-[#00c2ff]/50"
                >
                  <Clock size={16} />
                  <span className="text-sm font-bold">7:23 / 10:00</span>
                </motion.div>

                {/* Bouton fermer modernisé */}
                <motion.button
                  onClick={() => setShowPreview(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 border border-gray-200/50 group"
                >
                  <X size={18} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
                </motion.button>

                <div className="relative p-6">
                  <div className="flex items-center gap-6">
                    {/* Icône avec badge aperçu */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative w-20 h-20 rounded-2xl bg-gray-900 shadow-lg flex items-center justify-center"
                    >
                      <Eye size={32} className="text-white drop-shadow-lg" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#00c2ff] rounded-full flex items-center justify-center shadow-lg">
                        <Gift size={16} className="text-white" />
                      </div>
                    </motion.div>
                    
                    <div className="flex-1 space-y-3">
                      {/* Badge aperçu gratuit */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex items-center gap-2 bg-[#00c2ff] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                          <Sparkles size={16} />
                          Aperçu Gratuit
                        </div>
                        <span className="text-gray-600 text-sm font-medium">• 10 min gratuit</span>
                      </motion.div>
                      
                      {/* Titre */}
                      <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold text-gray-900 leading-tight"
                      >
                        {selectedLessonForDetail.title}
                      </motion.h1>
                      
                      {/* Message bienveillant */}
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-50/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50"
                      >
                        <p className="text-gray-700 font-medium text-sm flex items-center gap-2">
                          🎓 Découvrez cette leçon en toute tranquillité • Aucun engagement
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corps du modal */}
              <div className="flex flex-col lg:flex-row h-[50vh]">
                {/* Zone vidéo principale */}
                <div className="flex-1 bg-gray-100 relative overflow-hidden">
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-24 h-24 bg-[#00c2ff] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                      >
                        <Play size={32} className="text-white ml-1" />
                      </motion.div>
                      <p className="text-gray-600 font-medium">Aperçu vidéo (10 min max)</p>
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm p-4">
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <motion.div 
                        className="bg-[#00c2ff] h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "33%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <div className="text-white text-sm font-medium">7:23 / 10:00</div>
                  </div>
                </div>

                {/* Sidebar avec informations */}
                <div className="lg:w-96 bg-white p-6 border-l border-gray-200/50">
                  <div className="space-y-6">
                    {/* Accès Complet */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Crown size={24} className="text-gray-600" />
                        <h3 className="text-lg font-bold text-gray-900">Accès Complet</h3>
                      </div>
                      
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <CheckCircle size={16} className="text-gray-900" />
                          Accès illimité à vie
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <CheckCircle size={16} className="text-gray-900" />
                          Support communautaire 24/7
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <CheckCircle size={16} className="text-gray-900" />
                          Certificat de completion
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <CheckCircle size={16} className="text-gray-900" />
                          Mises à jour gratuites
                        </li>
                      </ul>

                      {/* Bouton commencer principal */}
                      <motion.button
                        onClick={() => {
                          setShowPreview(false);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        ▶️ Commencer le cours
                      </motion.button>
                    </motion.div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-4">
                        Accès complet à tout le contenu
                      </p>
                      
                      {/* Statistiques */}
                      <div className="flex justify-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-[#00c2ff]" />
                          <span>4.9/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen size={12} />
                          <span>124 étudiants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {/* Modales d'upsell */}
      {showPurchaseUpsell && selectedLessonForPurchase && (
          <PurchaseUpsellModal
            key="purchase-upsell-modal"
            isOpen={showPurchaseUpsell}
            onClose={() => {
              setShowPurchaseUpsell(false);
              setSelectedLessonForPurchase(null);
            }}
            purchaseOptions={upsellOptions}
            onPurchase={(option) => {
              console.log('🎯 PURCHASE FLOW: Starting purchase process for:', option.type, option.itemId);
              
              // TOUJOURS appeler handlePurchase local AVANT tout le reste
              console.log('🎯 PURCHASE FLOW: Calling local handlePurchase...');
              handlePurchase(option);
              
              // Puis appeler la fonction parent pour mettre à jour purchasedItems
              if (onPurchase) {
                console.log('🎯 PURCHASE FLOW: Calling parent onPurchase...');
                onPurchase(option);
              }
              
              // Fermer le modal après l'achat
              console.log('🎯 PURCHASE FLOW: Closing modal...');
              setShowPurchaseUpsell(false);
              setSelectedLessonForPurchase(null);
              
              // Redirection automatique vers l'accès complet
              setTimeout(() => {
                if (option.type === 'lesson' && selectedLessonForPurchase) {
                  // Pour une leçon, on reste dans le course viewer mais on met à jour la leçon sélectionnée
                  const updatedLesson = lessons.find(l => l.id === option.itemId);
                  if (updatedLesson) {
                    setSelectedLessonForDetail({ ...updatedLesson, isOwned: true });
                    alert('🎉 Leçon débloquée ! Tu as maintenant accès à tout le contenu.');
                  }
                } else if (option.type === 'course') {
                  // Pour un cours complet, toutes les leçons sont débloquées
                  alert('🎉 Cours complet débloqué ! Toutes les leçons sont maintenant accessibles.');
                } else if (option.type === 'pack') {
                  // Pour un pack, redirection vers le catalogue ou autre page appropriée
                  alert('🎉 Pack débloqué ! Tous les cours du pack sont maintenant accessibles.');
                }
              }, 500); // Petit délai pour permettre à la modal de se fermer d'abord
            }}
          />
        )}

        {showWalletTopUp && (
          <WalletTopUp
            key="wallet-top-up-modal"
            currentBalance={user.wallet.balance}
            onCancel={() => setShowWalletTopUp(false)}
            onTopUp={(amount, bonus) => {
              handleWalletTopUp(amount, bonus);
              setShowWalletTopUp(false);
            }}
          />
        )}

        {showIdentityVerification && (
          <IdentityVerificationModal
            isOpen={showIdentityVerification}
            onClose={() => setShowIdentityVerification(false)}
            onUploadComplete={handleIdentityUpload}
          />
        )}
        
        {/* Panneau Social Feed */}
        <SocialFeedPanel
          isOpen={showSocialFeed}
          onClose={() => setShowSocialFeed(false)}
        />

        {/* Modal Study Room WebRTC */}
        {selectedStudyRoom && (
          <WebRTCStudyRoom
            room={selectedStudyRoom}
            userId={user?.id || 'user-default'}
            userName={user?.name || 'Étudiant'}
            userAvatar={user?.avatar || '/avatars/default.jpg'}
            isModerator={false}
            onLeaveRoom={() => {
              AdvancedStudyRoomService.leaveStudyRoom(selectedStudyRoom.id, user?.id || 'user-default');
              setSelectedStudyRoom(null);
            }}
            onKickParticipant={(participantId) => {
              console.log('Kick participant:', participantId);
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal Guest Pass / Parrainage */}
      <AnimatePresence>
        {showGuestPassModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowGuestPassModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-3xl p-10 max-w-lg w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Badge Pass */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-900 rounded-2xl px-8 py-5 text-center">
                  <div className="flex justify-center mb-3">
                    <Image src="/brand/onboarding-logo.svg" alt="SMS" width={48} height={48} />
                  </div>
                  <span className="text-white font-bold tracking-wider uppercase" style={{ fontSize: '14px' }}>Pass Invité 14 jours</span>
                </div>
              </div>

              {/* Titre */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Apprendre, c'est mieux à plusieurs
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-center mb-6 leading-relaxed" style={{ fontSize: '15px' }}>
                Partage ton pass exclusif avec tes amis. S'ils s'inscrivent dans les 14 jours, 
                tu gagnes <span className="font-bold text-gray-900">+2h de contenu gratuit</span> ajoutées à ton compteur !
              </p>

              {/* Input emails */}
              <div className="mb-5">
                <input
                  type="text"
                  value={guestPassEmails}
                  onChange={(e) => setGuestPassEmails(e.target.value)}
                  placeholder="Emails séparés par des virgules"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                  style={{ fontSize: '15px' }}
                />
              </div>

              {/* Bouton Envoyer */}
              <button
                onClick={() => {
                  if (guestPassEmails.trim()) {
                    alert(`✉️ Invitations envoyées à : ${guestPassEmails}\n\nTu recevras +2h pour chaque ami qui s'inscrit dans les 14 jours !`);
                    setGuestPassEmails('');
                    setShowGuestPassModal(false);
                  }
                }}
                className="w-full py-4 bg-[#00c2ff] hover:bg-[#3bb5dc] text-white font-bold rounded-xl transition-colors mb-4"
                style={{ fontSize: '16px' }}
              >
                Envoyer les invitations
              </button>

              {/* Lien Passer */}
              <button
                onClick={() => setShowGuestPassModal(false)}
                className="w-full text-center text-gray-900 font-semibold hover:text-gray-600 transition-colors"
                style={{ fontSize: '15px' }}
              >
                Passer pour l'instant
              </button>

              {/* Terms */}
              <p className="text-center text-gray-400 mt-4 underline cursor-pointer hover:text-gray-600" style={{ fontSize: '14px' }}>
                Conditions du Pass Invité
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger de vérification d'identité pour production */}
      <IdentityVerificationTrigger onTriggerVerification={handleTriggerIdentityVerification} />
    </>
  );
}



