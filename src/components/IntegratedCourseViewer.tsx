'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Play,
  Lock,
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
  Heart
} from 'lucide-react';
import { Course, Lesson, User, PurchaseOption } from '@/types';
import { IdentityVerificationModal } from './IdentityVerificationModal';
import { IdentityVerificationTrigger } from './IdentityVerificationTrigger';
import { IdentityVerificationService } from '@/lib/identity-verification-service';
import { useFavorites } from '@/hooks/useFavorites';
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
import { NotificationWidget } from './NotificationWidget';

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
}

// Fonds d'écran prédéfinis
const backgroundOptions = [
  {
    id: 'pastel-gradient',
    name: 'Dégradé Pastel',
    style: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
    preview: 'linear-gradient(135deg, #dbeafe 0%, #f3e8ff 50%, #fdf2f8 100%)'
  },
  {
    id: 'science-lab',
    name: 'Ambiance Science',
    style: 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50',
    preview: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0f7fa 100%)'
  },
  {
    id: 'nature-green',
    name: 'Nature Zen',
    style: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50',
    preview: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 50%, #f0fdfa 100%)'
  },
  {
    id: 'warm-sunset',
    name: 'Coucher de Soleil',
    style: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
    preview: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 50%, #fefce8 100%)'
  },
  {
    id: 'minimal-gray',
    name: 'Minimaliste',
    style: 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50',
    preview: 'linear-gradient(135deg, #f9fafb 0%, #f8fafc 50%, #fafafa 100%)'
  },
  {
    id: 'deep-focus',
    name: 'Concentration',
    style: 'bg-gradient-to-br from-indigo-50 via-slate-50 to-gray-50',
    preview: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #f9fafb 100%)'
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
  const getNodeState = () => {
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
    
    console.log('🔑 ICÔNE: Leçon', lesson.id, 'VERROUILLÉE - isOwned:', lesson.isOwned, 'isAccessible:', lesson.isAccessible);
    return 'locked';
  };
  
  const state = getNodeState();
  
  const getDifficultyColor = () => {
    switch (lesson.difficulty) {
      case 'beginner': return 'bg-green-400';
      case 'intermediate': return 'bg-yellow-400';
      case 'advanced': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };
  
  const getNodeStyle = () => {
    switch (state) {
      case 'completed':
        return 'bg-white border-2 border-green-300 shadow-lg text-green-600';
      case 'inProgress':
        return 'bg-white border-2 border-blue-300 shadow-lg text-blue-600';
      case 'available':
        return 'bg-white border-2 border-gray-300 shadow-md text-gray-700 hover:border-gray-400';
      case 'locked':
        return 'bg-gray-100 border-2 border-gray-200 text-gray-400';
    }
  };
  
  const getIcon = () => {
    switch (state) {
      case 'completed': 
        return <CheckCircle size={20} className="text-green-500" />;
      case 'inProgress': 
        return <Play size={20} className="text-blue-500 animate-pulse" />;
      case 'available': 
        return (
          <div className="relative">
            <div className="w-4 h-4 border-2 border-current rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-current rounded-full opacity-60" />
            </div>
          </div>
        );
      case 'locked': 
        return <Lock size={16} className="text-gray-400" />;
    }
  };

  const getShortTitle = (title: string): string => {
    // Extraire un titre court basé sur le titre complet
    if (title.toLowerCase().includes('gauss')) return 'Gauss';
    if (title.toLowerCase().includes('intégrale')) return 'Intégrales';
    if (title.toLowerCase().includes('suite')) return 'Suites';
    if (title.toLowerCase().includes('limite')) return 'Limites';
    if (title.toLowerCase().includes('force')) return 'Forces';
    if (title.toLowerCase().includes('mouvement')) return 'Mouvement';
    if (title.toLowerCase().includes('champ')) return 'Champs';
    if (title.toLowerCase().includes('potentiel')) return 'Potentiels';
    if (title.toLowerCase().includes('énergie')) return 'Énergie';
    if (title.toLowerCase().includes('fondament')) return 'Bases';
    
    // Sinon, prendre les 2 premiers mots ou 10 premiers caractères
    const words = title.split(' ');
    if (words.length >= 2) {
      return words.slice(0, 2).join(' ');
    }
    return title.length > 10 ? title.substring(0, 10) + '...' : title;
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
        disabled={state === 'locked'}
        className={`
          relative w-16 h-16 rounded-2xl flex items-center justify-center group
          transition-all duration-300 cursor-pointer
          ${getNodeStyle()}
          ${isSelected ? 'ring-4 ring-blue-200' : ''}
          ${state === 'locked' ? 'cursor-not-allowed' : ''}
        `}
        animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
      >
        {getIcon()}
        
        {/* Tooltip au survol */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-40">
          {(() => {
            switch (state) {
              case 'completed': 
                return 'Leçon terminée ✅';
              case 'inProgress': 
                return 'Leçon en cours ▶️ - Cliquez pour continuer';
              case 'available': 
                return 'Leçon débloquée 🔓 - Cliquez pour commencer';
              case 'locked': 
                return 'Leçon verrouillée 🔒 - Débloquez le cours pour accéder';
            }
          })()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
        
        {/* Numéro */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
          {lesson.order}
        </div>
        
        {/* Label titre court */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 text-center max-w-20">
          {getShortTitle(lesson.title)}
        </div>
        
        {/* Badge XP */}
        {state !== 'locked' && (
          <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
            +{lesson.xpReward}
          </div>
        )}
        
        {/* Badge difficulté */}
        <div className={`absolute -bottom-2 -left-2 w-2.5 h-2.5 ${getDifficultyColor()} rounded-full`} />
        
        {/* Étincelles pour complétées */}
        {state === 'completed' && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="text-yellow-400" size={12} />
          </motion.div>
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
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ background: bg.preview }}
                >
                  {selectedBackground === bg.id && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <CheckCircle className="text-blue-600" size={20} />
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
      color: 'bg-green-50 text-green-700 border-green-200',
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
      color: 'bg-purple-50 text-purple-700 border-purple-200',
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
        color: 'bg-green-100 text-green-800',
        description: 'Parfait pour débuter',
        estimatedTime: '10-15 min'
      };
      case 'intermediate': return { 
        text: 'Intermédiaire', 
        color: 'bg-yellow-100 text-yellow-800',
        description: 'Demande un peu de concentration',
        estimatedTime: '20-25 min'
      };
      case 'advanced': return { 
        text: 'Avancé', 
        color: 'bg-red-100 text-red-800',
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
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <StatusIcon size={18} className={lesson.isCompleted ? 'text-green-600' : lesson.isInProgress ? 'text-blue-600' : 'text-gray-600'} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{lesson.title}</h3>
                <p className="text-sm text-gray-600">Étape {lesson.order} • {status.description}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Badges de statut */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
            {status.text}
          </span>
          {lesson.isInProgress && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {safeProgressPercentage}% terminé
            </span>
          )}
        </div>
      </div>

      {/* Contenu principal - Layout avec boutons à droite */}
      <div className="p-3 lg:p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          {/* Contenu principal à gauche */}
          <div className="flex-1">
            {/* Description */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed text-sm">{lesson.description}</p>
            </div>

            {/* Bloc Slides PDF - Design épuré avec lien cliquable */}
            {canAccessSlides && (
              <div className="mb-4 p-4 rounded-2xl" style={{ backgroundColor: '#F4F8FF' }}>
                {/* Ligne principale - Slides de la leçon */}
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-gray-900 mb-1">Slides de la leçon</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Téléchargez les slides complets de cette leçon pour réviser efficacement et ancrer vos apprentissages.
                    </p>
                  </div>
                  <button
                    onClick={handleSlidesPreview}
                    title="Télécharger cette leçon"
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <Download size={18} />
                  </button>
                </div>

                {/* Ligne secondaire - Upsell Pack Électrostatique */}
                <div className="flex items-start gap-3">
                  <Library size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Pour accéder à l'intégralité des slides de toutes vos leçons et cours, débloquez le{' '}
                    <button
                      onClick={onOpenUpsell}
                      className="font-medium text-purple-700 hover:text-purple-800 hover:underline transition-all duration-200 cursor-pointer"
                    >
                      Pack Électrostatique
                    </button>.
                  </p>
                </div>
              </div>
            )}

            {/* Progression si en cours */}
            {lesson.isInProgress && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{safeProgressPercentage}% terminé</span>
                  <span className="text-xs text-gray-500">{lessons.filter(l => l.isCompleted).length}/{lessons.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${safeProgressPercentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            )}

            {/* Objectifs */}
            {lesson.objectives && lesson.objectives.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target size={16} className="text-blue-600" />
                  Ce que vous allez apprendre
                </h4>
                <ul className="space-y-2">
                  {lesson.objectives.map((objective, index) => (
                    <li key={`lesson-objective-${index}`} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Métriques détaillées */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">Informations détaillées</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Clock size={14} />
                    <span className="text-xs font-medium">Durée</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900">{lesson.duration} min</div>
                  <div className="text-xs text-gray-500">{difficulty?.estimatedTime}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <Zap size={14} />
                    <span className="text-xs font-medium">Récompense</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900">+{lesson.xpReward} XP</div>
                  <div className="text-xs text-gray-500">Points d'expérience</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                    <Star size={14} />
                    <span className="text-xs font-medium">Niveau</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900">{difficulty?.text || 'Non défini'}</div>
                  <div className="text-xs text-gray-500">{difficulty?.description || ''}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <BookOpen size={14} />
                    <span className="text-xs font-medium">Type</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {lesson.type === 'video' ? 'Vidéo' : lesson.type === 'exercise' ? 'Exercice' : 'Quiz'}
                  </div>
                  <div className="text-xs text-gray-500">Format du contenu</div>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action à droite - Version précédente restaurée */}
          <div className="flex flex-col lg:flex-col gap-3 min-w-full lg:min-w-[180px] lg:max-w-[200px]">
            {/* Message de statut */}
            <div className="text-sm text-gray-600 text-center lg:text-center mb-2">
              {lesson.isOwned ? 
                "Leçon débloquée - Accès complet" : 
                lesson.quizCompleted ?
                  `Quiz fait (${lesson.quizScore}%) - Aperçu disponible` :
                  "Quiz et aperçu gratuits disponibles"
              }
            </div>
            
            {/* Sur mobile : disposition horizontale des boutons secondaires */}
            <div className="flex lg:hidden gap-2 mb-3">
              {/* Bouton Je me teste - Mobile */}
              <button
                onClick={onShowQuiz}
                className="flex-1 bg-purple-50 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 text-purple-700 px-3 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                title={lesson.isOwned ? "Test complet accessible" : "Test gratuit disponible"}
              >
                <HelpCircle size={16} />
                <span className="text-sm">Je me teste</span>
              </button>
              
              {/* Bouton Aperçu - Mobile */}
              <button
                onClick={onShowPreview}
                className="flex-1 bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 text-blue-700 px-3 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                title={lesson.isOwned ? "Aperçu + accès complet" : "Aperçu vidéo gratuit"}
              >
                <Eye size={16} />
                <span className="text-sm">Aperçu</span>
              </button>
            </div>
            
            {/* Bouton principal - Débloquer ou Commencer */}
            <button
              onClick={() => {
                console.log('🚀 Button clicked! Calling onLessonPurchaseCheck with lesson:', lesson);
                onLessonPurchaseCheck(lesson);
              }}
              className="w-full px-4 py-3 lg:py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700"
            >
              {lesson.isOwned ? <Play size={16} /> : <Lock size={16} />}
              <span className="text-sm lg:text-base">
                {lesson.isOwned ? (
                  lesson.isCompleted ? 'Revoir' : 
                  lesson.isInProgress ? 'Continuer' : 
                  'Commencer'
                ) : (
                  `Débloquer (${lesson.price}€)`
                )}
              </span>
            </button>
            
            {/* Sur desktop : disposition verticale des boutons secondaires */}
            <div className="hidden lg:flex lg:flex-col gap-3">
              {/* Bouton Je me teste - Desktop */}
              <button
                onClick={onShowQuiz}
                className="w-full bg-purple-50 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 text-purple-700 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                title={lesson.isOwned ? "Test complet accessible" : "Test gratuit disponible"}
              >
                <HelpCircle size={16} />
                <span className="text-sm">Je me teste</span>
              </button>
              
              {/* Bouton Aperçu - Desktop */}
              <button
                onClick={onShowPreview}
                className="w-full bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 text-blue-700 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                title={lesson.isOwned ? "Aperçu + accès complet" : "Aperçu vidéo gratuit"}
              >
                <Eye size={16} />
                <span className="text-sm">Aperçu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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
  onLessonsUpdate
}: IntegratedCourseViewerProps) {
  const [currentView, setCurrentView] = useState<'map' | 'lesson'>('map');
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
  
  // Mettre à jour le user local quand propUser change
  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    }
  }, [propUser]);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Navigation items - identiques au dashboard principal
  const navigationItems = [
    { id: 'courses', label: 'Mes cours', icon: BookOpen },
    { id: 'unlock', label: 'Débloquer', icon: Brain },
    { id: 'planning', label: 'Planification', icon: Calendar },
    { id: 'community', label: 'Communauté', icon: Users },
  ];

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
      if (propLessons.length > 0) {
        setSelectedLessonForDetail(propLessons[0]);
      }
    } else if (course) {
      const mockLessons: Lesson[] = [
        {
          id: '1',
          courseId: course.id,
          title: 'Les fondamentaux essentiels',
          description: 'Découvrez les concepts de base qui forment le socle solide de votre apprentissage. Cette leçon introductive vous permettra de maîtriser les notions clés avant d\'aborder des sujets plus complexes.',
          duration: 15,
          type: 'video',
          order: 1,
          isCompleted: false,
          isAccessible: true,
          progress: 0,
          hasPreview: true,
          videoUrl: 'https://example.com/video1.mp4',
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
  }, [course, propLessons]);

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
    console.log('🔥 handleLessonPurchaseCheck called with lesson:', lesson);
    console.log('🔥 lesson.isOwned:', lesson.isOwned);
    console.log('🔥 Current lessons state:', lessons.map(l => ({ id: l.id, isOwned: l.isOwned })));
    
    if (!lesson.isOwned) {
      console.log('🔥 Lesson not owned, opening upsell modal...');
      // La leçon n'est pas achetée, ouvrir l'upsell modal
      setSelectedLessonForPurchase(lesson);
      const options = generateUpsellOptions(lesson.id, lesson.courseId);
      console.log('🔥 Generated upsell options:', options);
      setUpsellOptions(options);
      setShowPurchaseUpsell(true);
      console.log('🔥 Should show purchase upsell modal now');
      
      // Log des états après mise à jour (avec un petit délai)
      setTimeout(() => {
        console.log('🔥 State check - showPurchaseUpsell:', showPurchaseUpsell);
        console.log('🔥 State check - selectedLessonForPurchase:', selectedLessonForPurchase);
        console.log('🔥 State check - upsellOptions:', upsellOptions);
      }, 100);
    } else {
      console.log('🔥 Lesson already owned, starting lesson...');
      // La leçon est achetée, procéder normalement
      handleStartLesson();
    }
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
              {/* Header identique à la landing */}
              <header className="bg-white border-b border-gray-200 flex-shrink-0 z-40">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSidebarOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                      >
                        <Menu size={20} />
                      </button>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                          <Brain className="text-white" size={16} />
                        </div>
                        <div>
                          <h1 className="text-lg font-bold text-gray-900">Science Made Simple</h1>
                          <p className="text-xs text-gray-500">{course.title}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex items-center gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text"
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-64"
                          />
                        </div>
                        
                        <BackgroundSelector
                          selectedBackground={selectedBackground}
                          onSelect={setSelectedBackground}
                          isOpen={showBackgroundSelector}
                          onToggle={() => setShowBackgroundSelector(!showBackgroundSelector)}
                        />
                        
                        <button
                          onClick={onClose}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium">
                          +{totalXP} XP
                        </div>
                        {/* Widget Notifications */}
                        <NotificationWidget />
                        
                        {/* Widget Paramètres */}
                        <button
                          onClick={onToggleSettings}
                          className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Paramètres"
                        >
                          <Settings size={20} />
                        </button>
                        
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Contenu avec sidebar */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar identique au dashboard */}
                <aside className={`w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } fixed lg:relative top-0 left-0 h-full z-30`}>
                  <div className="p-6">
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onClose(); // Fermer le viewer
                            onNavigateToSection?.(item.id); // Naviguer vers la section
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <item.icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Overlay mobile */}
                {sidebarOpen && (
                  <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-20"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}

                {/* Contenu principal */}
                <main className="flex-1 overflow-y-auto">
                  {/* KPIs de progression */}
                  <div className="p-6 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                          <p className="text-gray-600">Votre parcours d'apprentissage</p>
                        </div>
                        
                        {/* Bouton favori */}
                        <motion.button
                          onClick={handleToggleFavorite}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={isFavorite(course.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          <Heart 
                            size={24} 
                            className={`transition-colors ${
                              isFavorite(course.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          />
                        </motion.button>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">Niveau {currentLevel}</div>
                          <div className="text-sm text-gray-600">{totalXP} / {totalPossibleXP} XP</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{completedLessons}/{lessons.length}</div>
                          <div className="text-sm text-gray-600">Étapes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{Math.round(progressPercentage)}%</div>
                          <div className="text-sm text-gray-600">Progression</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barre de progression XP */}
                    <div className="mt-6">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${safeXPPercentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bloc map avec fond personnalisable */}
                  <div className={`relative min-h-[350px] ${selectedBg?.style}`}>
                    <div className="relative p-8">
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
                  <div className="p-6">
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
                            // Toujours garder une leçon sélectionnée - revenir à la première
                            if (lessons.length > 0) {
                              setSelectedLessonForDetail(lessons[0]);
                            }
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
            /* Vue Leçon avec structure cohérente */
            <>
              {/* Header identique à la landing */}
              <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSidebarOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                      >
                        <Menu size={20} />
                      </button>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                          <Brain className="text-white" size={16} />
                        </div>
                        <div>
                          <h1 className="text-lg font-bold text-gray-900">Science Made Simple</h1>
                          <p className="text-xs text-gray-500">{selectedLesson.title}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex items-center gap-4">
                        <button
                          onClick={handleBackToMap}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ArrowLeft size={16} />
                          Retour au parcours
                        </button>
                        
                        <div className="text-sm text-gray-600">
                          Étape {selectedLesson.order} • {selectedLesson.duration} min
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg font-medium text-sm">
                          +{selectedLesson.xpReward} XP
                        </div>
                        {/* Widget Notifications */}
                        <NotificationWidget />
                        
                        {/* Widget Paramètres */}
                        <button
                          onClick={onToggleSettings}
                          className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Paramètres"
                        >
                          <Settings size={20} />
                        </button>
                        
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Contenu avec sidebar */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar identique au dashboard */}
                <aside className={`w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } fixed lg:relative top-0 left-0 h-full z-30`}>
                  <div className="p-6">
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onClose(); // Fermer le viewer
                            onNavigateToSection?.(item.id); // Naviguer vers la section
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <item.icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Overlay mobile */}
                {sidebarOpen && (
                  <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-20"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}

                {/* Contenu principal leçon - Layout Web 3.0 */}
                <main className="flex-1 overflow-hidden">
                  {/* Header avec breadcrumb */}
                  <div className="bg-white border-b border-gray-100 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleBackToMap}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <ArrowLeft size={16} />
                          <span className="hidden sm:block">Retour au parcours</span>
                        </button>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <div>
                          <h1 className="text-xl font-bold text-gray-900">{selectedLesson.title}</h1>
                          <p className="text-sm text-gray-600">Leçon {selectedLesson.order} • {course?.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Bouton favori dans la vue leçon */}
                        <motion.button
                          onClick={handleToggleFavorite}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={isFavorite(course.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          <Heart 
                            size={20} 
                            className={`transition-colors ${
                              isFavorite(course.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          />
                        </motion.button>
                        
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>En cours</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Layout principal - Cinéma + Sidebar */}
                  <div className="flex bg-gray-50 overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
                    {/* Zone vidéo principale - Cinéma */}
                    <div className="flex-1 p-8 overflow-y-auto">
                      <div className="flex flex-col">
                        {/* Lecteur vidéo immersif */}
                        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-6">
                          <VideoWithQuiz 
                            videoUrl={selectedLesson.videoUrl}
                            questions={[]} // Utilise les questions par défaut du composant
                            onQuizComplete={(score) => {
                              console.log(`Quiz terminé avec un score de ${score}`);
                              // Marquer la leçon comme terminée si score suffisant
                              if (score >= 0.7) { // 70% minimum
                                console.log('Leçon terminée avec succès !');
                              }
                            }}
                          />
                        </div>


                        {/* Détails de la leçon sous la vidéo */}
                        <div className="space-y-8 pb-16">
                          {/* Description et Objectifs - même largeur que la vidéo */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Description */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                  <BookOpen size={16} className="text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                              </div>
                              <p className="text-gray-700 leading-relaxed text-sm">{selectedLesson.description}</p>
                            </motion.div>

                            {/* Objectifs d'apprentissage */}
                            {selectedLesson.objectives && selectedLesson.objectives.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Target size={16} className="text-green-600" />
                                  </div>
                                  <h3 className="text-lg font-semibold text-gray-900">Objectifs d'apprentissage</h3>
                                </div>
                                <div className="space-y-3">
                                  {selectedLesson.objectives.map((objective, index) => (
                                    <div key={`objective-${index}`} className="flex items-start gap-3">
                                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                        {index + 1}
                                      </div>
                                      <span className="text-gray-700 text-sm leading-relaxed">{objective}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {/* Prérequis - en dessous, centré */}
                          {selectedLesson.prerequisites && selectedLesson.prerequisites.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl mx-auto"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                  <Award size={16} className="text-orange-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Prérequis</h3>
                              </div>
                              <div className="space-y-2">
                                {selectedLesson.prerequisites.map((prerequisite, index) => (
                                  <div key={`prerequisite-${index}`} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-gray-700 text-sm">{prerequisite}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* Section Notes et Ressources */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Notes de cours */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                  <FileText size={16} className="text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Notes de cours</h3>
                              </div>
                              <div className="space-y-3">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  • Concepts clés à retenir pour cette leçon
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  • Formules importantes et leur application
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  • Exercices pratiques recommandés
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  • Points d'attention pour l'examen
                                </p>
                              </div>
                            </motion.div>

                            {/* Ressources complémentaires */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                  <ExternalLink size={16} className="text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Ressources</h3>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FileText size={14} className="text-red-600" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">PDF - Résumé de cours</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calculator size={14} className="text-blue-600" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">Exercices pratiques</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Play size={14} className="text-green-600" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">Vidéos complémentaires</span>
                                </div>
                              </div>
                            </motion.div>
                          </div>

                          {/* Section Progression et Évaluation */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <TrendingUp size={16} className="text-blue-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">Progression & Évaluation</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Temps passé */}
                              <div className="text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                  <Clock size={20} className="text-blue-600" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">15 min</p>
                                <p className="text-sm text-gray-600">Temps passé</p>
                              </div>

                              {/* Score quiz */}
                              <div className="text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                  <Award size={20} className="text-green-600" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">85%</p>
                                <p className="text-sm text-gray-600">Score quiz</p>
                              </div>

                              {/* Progression cours */}
                              <div className="text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                  <CheckCircle size={20} className="text-purple-600" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">2/5</p>
                                <p className="text-sm text-gray-600">Leçons terminées</p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Section Commentaires et Discussion */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                                  <MessageCircle size={16} className="text-yellow-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Discussion de la leçon</h3>
                              </div>
                              <button className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors text-sm font-medium">
                                Ajouter un commentaire
                              </button>
                            </div>
                            
                            <div className="space-y-4">
                              {/* Commentaire exemple 1 */}
                              <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  JD
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900">Jean Dupont</span>
                                    <span className="text-xs text-gray-500">il y a 2 heures</span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    Excellente explication des concepts fondamentaux ! J'ai enfin compris la différence entre...
                                  </p>
                                </div>
                              </div>

                              {/* Commentaire exemple 2 */}
                              <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  SM
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900">Sophie Martin</span>
                                    <span className="text-xs text-gray-500">il y a 5 heures</span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    Quelqu'un pourrait-il m'expliquer la partie sur les applications pratiques ? 🤔
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar Web 3.0 - Navigation et détails */}
                    <div className="w-[420px] bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
                      <div className="p-6 space-y-6 overflow-y-auto">
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

                        {/* CTA WhatsApp avec indicateurs - DEUXIÈME POSITION */}
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
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
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
                    Aucun test n'est encore disponible pour cette leçon. Essayez l'aperçu vidéo en attendant !
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
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-green-500/10" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-gray-50/20" />
                
                {/* Particules animées */}
                <motion.div 
                  className="absolute top-4 left-16 w-1.5 h-1.5 bg-amber-400/40 rounded-full"
                  animate={{ y: [0, -6, 0], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute top-6 right-24 w-1 h-1 bg-emerald-400/30 rounded-full"
                  animate={{ y: [0, -4, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                />

                {/* Timer flottant */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 left-6 flex items-center gap-2 bg-amber-500/90 backdrop-blur-sm text-amber-900 px-4 py-2 rounded-full shadow-lg border border-amber-400/50"
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
                      className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center"
                    >
                      <Eye size={32} className="text-white drop-shadow-lg" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
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
                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
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
                        className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
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
                        className="bg-blue-500 h-2 rounded-full"
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
                      className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200/50"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Crown size={24} className="text-amber-600" />
                        <h3 className="text-lg font-bold text-gray-900">Accès Complet</h3>
                      </div>
                      
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <CheckCircle size={16} className="text-green-500" />
                          Accès illimité à vie
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <CheckCircle size={16} className="text-green-500" />
                          Support communautaire 24/7
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <CheckCircle size={16} className="text-green-500" />
                          Certificat de completion
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <CheckCircle size={16} className="text-green-500" />
                          Mises à jour gratuites
                        </li>
                      </ul>

                      {/* Bouton débloquer principal */}
                      <motion.button
                        onClick={() => {
                          setShowPreview(false);
                          // Ici on pourrait ouvrir l'upsell modal
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        🔓 Débloquer le cours complet
                      </motion.button>
                    </motion.div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-4">
                        Aperçu gratuit - Débloque le cours pour voir l'intégralité
                      </p>
                      
                      {/* Statistiques */}
                      <div className="flex justify-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400" />
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
      </AnimatePresence>

      {/* Trigger de vérification d'identité pour production */}
      <IdentityVerificationTrigger onTriggerVerification={handleTriggerIdentityVerification} />
    </>
  );
}
