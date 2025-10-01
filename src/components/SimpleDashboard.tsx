'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Target, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  X,
  Search,
  Bell,
  Settings,
  User,
  Star,
  Heart,
  Award,
  Brain,
  Play,
  MessageCircle,
  MessageSquare,
  Plus,
  Calendar,
  Home,
  Wallet,
  Sparkles,
  HelpCircle,
  MoreHorizontal,
  FileText,
  Shield
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CourseCard } from './CourseCard';
import { GamifiedCourseViewer } from './GamifiedCourseViewer';
import { MinimalGameCourseViewer } from './MinimalGameCourseViewer';
import { ImmersiveGameCourseViewer } from './ImmersiveGameCourseViewer';
import { PreviewModal } from './PreviewModal';
import { ClientOnly } from './ClientOnly';
import { WalletTopUp } from './WalletTopUp';
import { PurchaseUpsellModal } from './PurchaseUpsellModal';
import { WalletBalance } from './WalletBalance';
import { IdentityStatusBadge } from './IdentityStatusBadge';
import { IdentityVerificationModal } from './IdentityVerificationModal';
import { useFavorites } from '@/hooks/useFavorites';
import { IdentityVerificationService } from '@/lib/identity-verification-service';
import { CreditCounter, CreditModal, CourseCard as CreditCourseCard } from './CreditSystem';
import { SuggestedCourseCard } from './SuggestedCourseCard';
import { FavoritesPackCollection } from './FavoritesPackCollection';
import { useCreditSystem } from '@/hooks/useCreditSystem';
import { CreditPacks } from './CreditPacks';

// SYSTÈME EUROS
import { useEuroWallet } from '@/hooks/useEuroWallet';
import { PurchaseSystem } from './PurchaseSystem';
import { SmartPackOffer } from './SmartPackOffer';
import { SmartCourseComparison } from './SmartCourseComparison';
import { Community } from './Community';
import { getCourseRecommendations } from '@/lib/smart-recommendations';
import { PremiumCheckout } from './PremiumCheckout';
import { CourseStaircaseView } from './CourseStaircaseView';
import { IntegratedCourseViewer } from './IntegratedCourseViewer';
import { Course, Lesson, StudentProgress, CourseSuggestion, DashboardData, PurchaseOption, CourseStudyRoom, BuddySystem } from '@/types';
import { PersonalProfileSection } from './PersonalProfileSection';
import { getPersonalProfile, generateUpsellOptions, getMockCourseStudyRooms, getMockStudyRoomNotifications, getCoursePacks, getLessonsByCourseId, generateMockLessons } from '@/lib/mock-data';
import { StudyRoomButton } from './StudyRoomButton';
import { StudyRoomModal } from './StudyRoomModal';
import { StrategicPlanner } from './StrategicPlanner';
import { PlannerOnboardingModal } from './PlannerOnboardingModal';
import { useStudyRoomState } from '@/lib/studyroom-service';
import { usePlannerState } from '@/lib/planner-service';
import { NotificationWidget } from './NotificationWidget';
import { StudyRoomHeaderWidget } from './StudyRoomHeaderWidget';
import { UnifiedSocialWidget } from './UnifiedSocialWidget';
import { OnboardingSpotlight } from './OnboardingSpotlight';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { BuddyOnboarding } from './BuddyOnboarding';
import { ParentReportsSettings } from './ParentReportsSettings';

interface SimpleDashboardProps {
  data: DashboardData;
  user?: any;
  onUpdateCourseOrder: (courseId: string, newIndex: number) => void;
  onToggleCourseFavorite: (courseId: string) => void;
  onPreviewCourse: (courseId: string) => void;
  onEnrollCourse: (courseId: string) => void;
  onStartCourse?: (course: any) => void;
  onUpdateUser?: (user: any) => void;
  purchasedItems?: Set<string>;
  onPurchase?: (itemType: string, itemId: string, price: number) => void;
  onLogout?: () => void;
}

// Composant de métrique simple
const SimpleMetric = ({ 
  icon: Icon, 
  value, 
  label, 
  accent = false 
}: { 
  icon: any;
  value: string | number;
  label: string;
  accent?: boolean;
}) => (
  <div className={`p-6 ${accent ? 'bg-black text-white' : 'bg-white border border-gray-200'} rounded-lg`}>
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        accent ? 'bg-white/20' : 'bg-gray-100'
      }`}>
        <Icon size={20} className={accent ? 'text-white' : 'text-gray-600'} />
      </div>
      <div>
        <div className={`text-2xl font-bold ${accent ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </div>
        <div className={`text-sm ${accent ? 'text-gray-300' : 'text-gray-500'}`}>
          {label}
        </div>
      </div>
    </div>
  </div>
);

// Footer moderne et simple
const ModernFooter = () => (
  <footer className="bg-white border-t border-gray-200 mt-16">
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* À propos */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Brain size={20} className="text-gray-900" />
            <span className="font-bold text-gray-900">Science Made Simple</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            L'apprentissage scientifique réinventé pour votre réussite
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <MessageSquare size={16} />
            Support WhatsApp
          </button>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/courses" className="text-gray-600 hover:text-gray-900">Mes cours</a></li>
            <li><a href="/community" className="text-gray-600 hover:text-gray-900">Communauté</a></li>
            <li><a href="/planning" className="text-gray-600 hover:text-gray-900">Planification</a></li>
          </ul>
        </div>


        {/* Support */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Support étudiant</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/help" className="text-gray-600 hover:text-gray-900">Centre d'aide</a></li>
            <li><a href="/contact" className="text-gray-600 hover:text-gray-900">Nous contacter</a></li>
            <li>
              <a 
                href="https://wa.me/33123456789" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                WhatsApp 24/7
              </a>
            </li>
            <li><a href="/accessibility" className="text-gray-600 hover:text-gray-900">Accessibilité</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-gray-500 text-sm">
          © 2024 Science Made Simple. Révolutionnons l'apprentissage ensemble.
        </p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <a href="/privacy" className="text-gray-500 text-sm hover:text-gray-700">Confidentialité</a>
          <a href="/terms" className="text-gray-500 text-sm hover:text-gray-700">Conditions</a>
        </div>
      </div>
    </div>
  </footer>
);

// Fonction utilitaire pour créer un cours mock à partir d'un ID
function createMockCourseFromId(courseId: string): Course | null {
  console.log('🔧 createMockCourseFromId called with:', courseId);
  
  // Mapping des cours connus
  const courseMapping: Record<string, Partial<Course>> = {
    'course-gauss': {
      id: 'course-gauss',
      title: 'Loi de Gauss',
      description: 'Maîtrisez la loi de Gauss et ses applications en électrostatique',
      faculty: 'Solvay Brussels School',
      year: '2024-2025',
      difficulty: 'intermediate',
      duration: '120 min',
      totalLessons: 5,
      completedLessons: 0,
      progress: 0,
      isOwned: false,
      isPrimary: false
    },
    'course-equilibres': {
      id: 'course-equilibres',
      title: 'Équilibres Chimiques',
      description: 'Étude complète des équilibres chimiques : calculs, déplacements d\'équilibre, applications industrielles',
      faculty: 'Solvay Brussels School',
      year: '2024-2025',
      difficulty: 'intermediate',
      duration: '90 min',
      totalLessons: 4,
      completedLessons: 0,
      progress: 0,
      isOwned: true,
      isPrimary: true
    },
    'course-integrales': {
      id: 'course-integrales',
      title: 'Intégrales et Applications',
      description: 'Techniques d\'intégration et applications pratiques',
      faculty: 'Solvay Brussels School',
      year: '2024-2025',
      difficulty: 'advanced',
      duration: '150 min',
      totalLessons: 6,
      completedLessons: 0,
      progress: 0,
      isOwned: true,
      isPrimary: true
    },
    'course-forces': {
      id: 'course-forces',
      title: 'Forces et Mouvement',
      description: 'Étude des forces et du mouvement en mécanique classique',
      faculty: 'Solvay Brussels School',
      year: '2024-2025',
      difficulty: 'intermediate',
      duration: '100 min',
      totalLessons: 5,
      completedLessons: 0,
      progress: 0,
      isOwned: true,
      isPrimary: true
    },
    'course-franklin-dna': {
      id: 'course-franklin-dna',
      title: 'Structure de l\'ADN',
      description: 'Découverte de la structure de l\'ADN et ses implications biologiques',
      faculty: 'Solvay Brussels School',
      year: '2024-2025',
      difficulty: 'intermediate',
      duration: '80 min',
      totalLessons: 4,
      completedLessons: 0,
      progress: 0,
      isOwned: true,
      isPrimary: true
    },
    'course-physique-mecanique': {
      id: 'course-physique-mecanique',
      title: 'Mécanique Classique',
      description: 'Principes fondamentaux de la mécanique classique',
      faculty: 'Solvay Brussels School',
      year: '2024-2025',
      difficulty: 'intermediate',
      duration: '110 min',
      totalLessons: 5,
      completedLessons: 0,
      progress: 0,
      isOwned: false,
      isPrimary: false
    }
  };
  
  const courseData = courseMapping[courseId];
  if (!courseData) {
    console.warn('❌ createMockCourseFromId: Cours inconnu:', courseId);
    return null;
  }
  
  // Créer le cours complet avec des valeurs par défaut
  const mockCourse: Course = {
    id: courseData.id!,
    title: courseData.title!,
    description: courseData.description!,
    faculty: courseData.faculty!,
    year: courseData.year!,
    difficulty: courseData.difficulty!,
    duration: courseData.duration!,
    totalLessons: courseData.totalLessons!,
    completedLessons: courseData.completedLessons!,
    progress: courseData.progress!,
    isOwned: courseData.isOwned!,
    isPrimary: courseData.isPrimary!,
    lessons: [], // Sera rempli si nécessaire
    previewAvailable: true,
    tags: [courseData.difficulty === 'intermediate' ? 'Physique' : 
           courseData.difficulty === 'advanced' ? 'Mathématiques' : 'Chimie'],
    packId: courseId === 'course-equilibres' ? 'pack-electromagnetisme' : 
            courseId === 'course-gauss' ? 'pack-electromagnetisme' :
            courseId === 'course-forces' ? 'pack-electromagnetisme' :
            courseId === 'course-integrales' ? 'pack-mathematiques' :
            courseId === 'course-franklin-dna' ? 'pack-biologie' :
            courseId === 'course-physique-mecanique' ? 'pack-physique' : undefined
  };
  
  console.log('✅ createMockCourseFromId: Cours mock créé:', mockCourse.title);
  return mockCourse;
}

export function SimpleDashboard(props: SimpleDashboardProps) {
  const { favorites, toggleFavorite, addFavorite, removeFavorite } = useFavorites();
  const {
    data,
    user,
    onUpdateCourseOrder,
    onToggleCourseFavorite,
    onPreviewCourse,
    onEnrollCourse,
    onStartCourse,
    onUpdateUser,
    purchasedItems: propsPurchasedItems,
    onPurchase,
    onLogout
  } = props;
  const [primaryCourses, setPrimaryCourses] = useState(data.primaryCourses);
  const [suggestedExpanded, setSuggestedExpanded] = useState(true);

  // États du composant
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseViewerOpen, setCourseViewerOpen] = useState(false);
  const [useGamifiedViewer, setUseGamifiedViewer] = useState(true); // Nouveau viewer par défaut
  const [showStaircaseView, setShowStaircaseView] = useState(false);
  const [showIntegratedViewer, setShowIntegratedViewer] = useState(false);
  // État des leçons synchronisé avec les achats
  const [courseLessons, setCourseLessons] = useState<{[courseId: string]: Lesson[]}>({});

  // Initialiser primaryCourses seulement au premier rendu
  useEffect(() => {
    if (primaryCourses.length === 0) {
      setPrimaryCourses(data.primaryCourses);
    }
  }, [data.primaryCourses]);

  // Synchroniser les favoris avec primaryCourses
  useEffect(() => {
    console.log('🔄 SYNC: Synchronisation favoris déclenchée', { 
      favorites, 
      primaryCoursesCount: primaryCourses.length 
    });
    
    // Nettoyer les favoris incohérents (cours qui ne devraient pas être favoris par défaut)
    const invalidFavorites = favorites.filter(favoriteId => {
      const course = data.primaryCourses.find(c => c.id === favoriteId);
      
      // Supprimer seulement si : cours trouvé mais pas primaire ET cours était marqué comme favori par défaut
      // (Ne pas supprimer les favoris ajoutés manuellement par l'utilisateur)
      return course && !course.isPrimary && course.isOwned === true;
    });
    
    if (invalidFavorites.length > 0) {
      console.log('🧹 SYNC: Nettoyage favoris incohérents:', invalidFavorites);
      invalidFavorites.forEach(courseId => {
        const course = data.primaryCourses.find(c => c.id === courseId);
        const isPurchased = purchasedItems.has(courseId);
        console.log(`🧹 CLEANUP: Suppression ${courseId} - isPrimary: ${course?.isPrimary}, isOwned: ${course?.isOwned}`);
        removeFavorite(courseId, course?.title);
      });
      return; // L'effet sera re-déclenché après la suppression
    }
    
    // Si pas de favoris, vider primaryCourses
    if (favorites.length === 0) {
      console.log('🔄 SYNC: Aucun favori, vidage primaryCourses');
      setPrimaryCourses([]);
      return;
    }
    
    // Créer un pool de tous les cours disponibles
    const allAvailableCourses = [
      ...data.primaryCourses,
      ...data.suggestedCourses.map(s => s.course)
    ];
    
    // Créer des cours mock pour les favoris qui ne sont pas dans les données principales
    const favoriteCourses: Course[] = [];
    
    favorites.forEach(favoriteId => {
      console.log('🔍 SYNC: Traitement favori:', favoriteId);
      
      // Chercher d'abord dans les cours existants
      let course = allAvailableCourses.find(c => c.id === favoriteId);
      
      // Si pas trouvé, créer un cours mock
      if (!course) {
        console.log('📝 SYNC: Cours non trouvé, création mock pour:', favoriteId);
        const mockCourse = createMockCourseFromId(favoriteId);
        if (mockCourse) {
          course = mockCourse;
          console.log('✅ SYNC: Cours mock créé:', mockCourse.title);
        } else {
          console.warn('❌ SYNC: Impossible de créer cours mock pour:', favoriteId);
        }
      } else {
        console.log('✅ SYNC: Cours trouvé dans données existantes:', course.title);
      }
      
      if (course) {
        // Définir isOwned selon le statut d'achat réel
        const isPurchased = purchasedItems.has(favoriteId);
        favoriteCourses.push({ 
          ...course, 
          isPrimary: true, 
          isOwned: isPurchased 
        });
      }
    });
    
    console.log('📚 SYNC: Cours favoris finaux:', favoriteCourses.map(c => c.title));
    
    // Toujours mettre à jour pour forcer la synchronisation
    console.log('🔄 SYNC: Mise à jour forcée primaryCourses');
    setPrimaryCourses(favoriteCourses);
  }, [favorites]);

  // Initialiser les leçons du cours sélectionné
  useEffect(() => {
    if (selectedCourse && selectedCourse.lessons && !courseLessons[selectedCourse.id]) {
      setCourseLessons(prev => ({
        ...prev,
        [selectedCourse.id]: selectedCourse.lessons || []
      }));
    }
  }, [selectedCourse, courseLessons]);
  const [showSettings, setShowSettings] = useState(false);
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);
  const [showWalletTopUp, setShowWalletTopUp] = useState(false);
  const [showPurchaseUpsell, setShowPurchaseUpsell] = useState(false);
  const [showIdentityVerification, setShowIdentityVerification] = useState(false);
  
  // États Study Rooms
  const [activeStudyRooms, setActiveStudyRooms] = useState<CourseStudyRoom[]>([]);
  const [studyRoomNotifications, setStudyRoomNotifications] = useState<any[]>([]);
  const [showStudyRoomModal, setShowStudyRoomModal] = useState(false);
  const [selectedStudyRoom, setSelectedStudyRoom] = useState<CourseStudyRoom | null>(null);
  const [selectedLessonForPurchase, setSelectedLessonForPurchase] = useState<any>(null);
  // Utiliser les purchasedItems des props ou un Set par défaut
  const purchasedItems = propsPurchasedItems || new Set(['course-suites']);
  
  // 🔍 DEBUG: Vérifier purchasedItems après achat
  console.log('🔍 PURCHASED ITEMS:', Array.from(purchasedItems));
  console.log('🔍 PURCHASED ITEMS DETAILS:', purchasedItems);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Options de fond d'écran
  const BACKGROUND_OPTIONS = [
    {
      id: 'default',
      name: 'Par défaut',
      description: 'Fond uni standard'
    },
    {
      id: 'course-path-1',
      name: 'Parcours Montagne',
      description: 'Chemin avec montagnes'
    },
    {
      id: 'course-path-3',
      name: 'Forêt Enchantée',
      description: 'Paysage forestier'
    },
    {
      id: 'course-path-4',
      name: 'Cosmic Journey',
      description: 'Voyage cosmique'
    },
    {
      id: 'course-path-5',
      name: 'Ocean Depths',
      description: 'Profondeurs océaniques'
    }
  ];

  // Fermer le dropdown des paramètres quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialiser les Study Rooms
  useEffect(() => {
    const mockStudyRooms = getMockCourseStudyRooms();
    const mockNotifications = getMockStudyRoomNotifications();
    setActiveStudyRooms(mockStudyRooms);
    setStudyRoomNotifications(mockNotifications);
  }, []);

  // Utiliser le hook Study Room
  const studyRoomState = useStudyRoomState(
    [...primaryCourses, ...data.suggestedCourses.map(s => s.course)],
    Array.from(purchasedItems),
    user?.id || '1',
    activeStudyRooms,
    studyRoomNotifications
  );

  // États pour le planificateur stratégique avec gestion de la configuration
  const [plannerConfigured, setPlannerConfigured] = useState(false);
  const [plannerPostponed, setPlannerPostponed] = useState(false);
  
  // Utiliser le hook Planificateur
  const plannerState = usePlannerState(
    [...primaryCourses, ...data.suggestedCourses.map(s => s.course)],
    Array.from(purchasedItems),
    user?.id || '1',
    plannerConfigured,
    plannerPostponed
  );

  // État du Buddy System
  const [buddy, setBuddy] = useState<BuddySystem | null>(null);
  
  // État de l'onboarding du planificateur
  const [showPlannerOnboarding, setShowPlannerOnboarding] = useState(false);
  const [onboardingCourseName, setOnboardingCourseName] = useState<string>();
  const [focusedCourseForPlanning, setFocusedCourseForPlanning] = useState<Course | null>(null);
  const [forceShowPlanner, setForceShowPlanner] = useState(false);

  // Fonction pour déclencher l'onboarding du planificateur (OBLIGATOIRE à chaque déblocage)
  const triggerPlannerOnboarding = (courseName: string, courseId?: string) => {
    console.log('🎯 ONBOARDING: Déclenchement planification pour', courseName);
    
    // Trouver le cours concerné pour la planification cumulative
    if (courseId) {
      const course = [...primaryCourses, ...data.suggestedCourses.map(s => s.course)]
        .find(c => c.id === courseId);
      if (course) {
        setFocusedCourseForPlanning(course);
        console.log('🎯 ONBOARDING: Cours ciblé pour planification:', course.title);
      }
    }
    
    // ⚠️ TOUJOURS déclencher l'onboarding lors d'un déblocage de cours complet
    // C'est une étape systématique et incontournable du déblocage
    setTimeout(() => {
      console.log('🎯 ONBOARDING: Exécution du déclenchement OBLIGATOIRE pour', courseName);
      setOnboardingCourseName(courseName);
      setShowPlannerOnboarding(true);
      console.log('🎯 ONBOARDING: États mis à jour - courseName:', courseName, 'show:', true);
    }, 300);
  };

  // Handler pour démarrer la planification depuis l'onboarding
  const handleStartPlannerFromOnboarding = () => {
    console.log('🎯 ONBOARDING: Utilisateur a choisi de planifier maintenant');
    console.log('🎯 ONBOARDING: activeSection actuel:', activeSection);
    console.log('🎯 ONBOARDING: onboardingCourseName:', onboardingCourseName);
    
    // Trouver le cours concerné pour pré-remplir ses informations
    const targetCourse = [...primaryCourses, ...data.suggestedCourses.map(s => s.course)]
      .find(course => course.title === onboardingCourseName);
    
    if (targetCourse) {
      console.log('🎯 ONBOARDING: Cours trouvé pour planification:', targetCourse.title, 'Exam date:', targetCourse.examDate);
      setFocusedCourseForPlanning(targetCourse); // Stocker le cours pour le pré-remplissage
    }
    
    setPlannerConfigured(true);
    setPlannerPostponed(false);
    setShowPlannerOnboarding(false);
    
    // Fermer le course viewer s'il est ouvert
    if (selectedCourse) {
      setSelectedCourse(null);
    }
    
    // Forcer la redirection avec un délai pour s'assurer que tout se ferme d'abord
    setTimeout(() => {
      console.log('🎯 ONBOARDING: Tentative setActiveSection(planning)');
      setIsNavigationLocked(true); // Verrouiller la navigation pendant la transition
      setActiveSection('planning');
      setForceShowPlanner(true); // Force l'affichage du planificateur
      console.log('🎯 ONBOARDING: setActiveSection(planning) exécuté');
      
      // Déverrouiller la navigation après un délai
      setTimeout(() => {
        setIsNavigationLocked(false);
        console.log('🎯 ONBOARDING: Navigation déverrouillée');
      }, 1000);
    }, 200);
    
    console.log('🎯 ONBOARDING: Redirection vers planning demandée');
  };

  // Handler pour reporter la planification
  const handlePostponePlanner = () => {
    console.log('🎯 ONBOARDING: Utilisateur a choisi de reporter');
    setPlannerPostponed(true);
    setPlannerConfigured(false);
    setShowPlannerOnboarding(false);
    // Rester sur la vue actuelle
  };

  // Handler pour relancer l'onboarding depuis le planificateur
  const handleRestartOnboarding = () => {
    console.log('🎯 ONBOARDING: Relance manuelle de l\'onboarding');
    setPlannerPostponed(false);
    setPlannerConfigured(false);
    setShowPlannerOnboarding(true);
    setOnboardingCourseName('Planification'); // Nom générique
  };
  const [useMinimalViewer, setUseMinimalViewer] = useState(false); // Viewer minimal épuré
  const [useImmersiveViewer, setUseImmersiveViewer] = useState(false); // Viewer immersif 
  const [useIntegratedViewer, setUseIntegratedViewer] = useState(true); // Viewer intégré par défaut
  const [selectedBackground, setSelectedBackground] = useState<string>('default');
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unlockedCourses, setUnlockedCourses] = useState<string[]>([]);
  const [personalProfile] = useState(getPersonalProfile());
  const [unlockedPacks, setUnlockedPacks] = useState<string[]>([]);
  const [showCreditPacks, setShowCreditPacks] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // États pour la comparaison intelligente de cours (recommandations)
  const [selectedCourseForComparison, setSelectedCourseForComparison] = useState<Course | null>(null);
  const [showCourseComparison, setShowCourseComparison] = useState(false);
  
  // Système de crédits (ancien - à supprimer progressivement)
  const {
    credits,
    movements,
    showAnimation,
    showModal,
    setShowModal,
    showLowCreditWarning,
    setShowLowCreditWarning,
    spendCredits,
    gainCredits,
    getSuggestions,
    canAfford
  } = useCreditSystem(12);

  // NOUVEAU SYSTÈME EUROS + CATALOGUE
  const euroWallet = useEuroWallet(150); // 150€ de solde initial selon les spécifications

  // Hook du tour guidé
  const onboardingTour = useOnboardingTour(user?.id || data.user?.id);
  
  // État pour le BuddyOnboarding
  const [showBuddyOnboarding, setShowBuddyOnboarding] = useState(false);
  
  // État pour les Rapports Parents
  const [showParentReportsSettings, setShowParentReportsSettings] = useState(false);
  
  // Vérifier si l'utilisateur a terminé le buddy onboarding
  useEffect(() => {
    const userId = user?.id || data.user?.id;
    if (userId && onboardingTour.hasCompletedTour) {
      const hasBuddyOnboarding = localStorage.getItem(`buddy_onboarding_completed_${userId}`) === 'true';
      
      // Déclencher le buddy onboarding après le tour principal ET s'il n'est pas déjà fait
      if (!hasBuddyOnboarding && !showBuddyOnboarding) {
        const timer = setTimeout(() => {
          setShowBuddyOnboarding(true);
        }, 2000); // Délai de 2s après le tour principal
        
        return () => clearTimeout(timer);
      }
    }
  }, [onboardingTour.hasCompletedTour, user?.id, data.user?.id, showBuddyOnboarding]);


  // Handlers pour le portefeuille
  const handleWalletTopUp = (amount: number, bonus: number) => {
    const totalAdded = amount + bonus;
    
    const currentWallet = user?.wallet || data.user?.wallet;
    if (currentWallet && props.onUpdateUser) {
      const oldBalance = currentWallet.balance;
      const newBalance = oldBalance + totalAdded;
      
      const updatedUser = {
        ...(user || data.user),
        wallet: {
          ...currentWallet,
          balance: newBalance,
          totalDeposited: currentWallet.totalDeposited + totalAdded,
          lastActivity: new Date(),
          transactions: [
            ...currentWallet.transactions,
            {
              id: `tx-${Date.now()}-deposit`,
              walletId: currentWallet.id,
              type: 'deposit' as const,
              amount: amount,
              description: 'Rechargement portefeuille',
              createdAt: new Date(),
              metadata: { paymentMethod: 'card' }
            },
            ...(bonus > 0 ? [{
              id: `tx-${Date.now()}-bonus`,
              walletId: currentWallet.id,
              type: 'bonus' as const,
              amount: bonus,
              description: `Bonus de rechargement`,
              createdAt: new Date(),
              metadata: {
                bonusPercentage: Math.round((bonus / amount) * 100),
                originalAmount: amount
              }
            }] : [])
          ]
        }
      };
      
      props.onUpdateUser(updatedUser);
      
      // Ajouter notification de rechargement
      import('@/lib/notification-service').then(({ NotificationService }) => {
        NotificationService.notifyWalletTopUp(totalAdded);
      });
    }
    
    setShowWalletTopUp(false);
  };

  // Gestion de la vérification d'identité
  const handleTriggerIdentityVerification = () => {
    console.log('🔐 Vérification d\'identité déclenchée depuis le profil');
    IdentityVerificationService.triggerVerification();
    setShowIdentityVerification(true);
    setShowSettings(false); // Fermer le dropdown
  };

  const handleIdentityUpload = (file: File) => {
    console.log('📄 Document d\'identité uploadé:', file.name);
    IdentityVerificationService.uploadDocument(file);
    setShowIdentityVerification(false);
  };

  const handleLessonPurchase = (option: PurchaseOption) => {
    console.log('🛒 ACHAT: Post-processing après achat', option.type, option.itemId);
    
    // Note: L'achat a déjà été traité par WalletService dans PurchaseUpsellModal
    // Cette fonction se contente de mettre à jour l'état local et déclencher la planification
    
    // 🔑 CRUCIAL: Informer le parent pour mettre à jour purchasedItems
    if (onPurchase) {
      onPurchase(option.type, option.itemId, option.price);
      console.log('🔑 PURCHASE: Informé le parent de l\'achat:', option.type, option.itemId);
    }

    // Ajouter notifications de paiement et déblocage
    import('@/lib/notification-service').then(({ NotificationService }) => {
      NotificationService.notifyPaymentSuccess(option.price, option.title);
      
      // Notification de déblocage selon le type
      if (selectedCourse) {
        if (option.type === 'lesson') {
          NotificationService.notifyCourseUnlocked(selectedCourse, 'lesson');
        } else if (option.type === 'course') {
          NotificationService.notifyCourseUnlocked(selectedCourse, 'course');
        } else if (option.type === 'pack') {
          NotificationService.notifyCourseUnlocked(selectedCourse, 'pack');
        }
      }
    });

    // 🔑 MISE À JOUR CENTRALISÉE DES LEÇONS (POINT CRITIQUE)
    
    if (option.type === 'pack') {
      // Pour un pack, débloquer les leçons de TOUS les cours du pack
      const pack = getCoursePacks().find(p => p.id === option.itemId);
      if (pack) {
        console.log('🔑 DÉBLOCAGE PACK: Déblocage des cours du pack:', pack.courses);
        setCourseLessons(prev => {
          const updated = { ...prev };
          
          // Débloquer les leçons pour chaque cours du pack
          pack.courses.forEach(courseId => {
            // Si les leçons ne sont pas encore chargées, les charger d'abord
            if (!updated[courseId]) {
              // Charger les leçons du cours depuis les données mock
              let mockLessons = getLessonsByCourseId(courseId);
              
              // Si pas de leçons trouvées, générer des leçons automatiquement
              if (mockLessons.length === 0) {
                const course = getCoursePacks().find(p => p.courses.includes(courseId));
                const courseName = course ? `Cours ${courseId.replace('course-', '')}` : `Cours ${courseId}`;
                mockLessons = generateMockLessons(courseId, courseName);
                console.log('🔑 DÉBLOCAGE PACK: Leçons générées automatiquement pour', courseId, mockLessons.length);
              }
              
              updated[courseId] = mockLessons;
              console.log('🔑 DÉBLOCAGE PACK: Leçons chargées pour', courseId, mockLessons.length);
            }
            
            // Débloquer toutes les leçons du cours
            updated[courseId] = updated[courseId].map(lesson => ({
              ...lesson,
              isOwned: true
            }));
            console.log('🔑 DÉBLOCAGE PACK: Leçons débloquées pour', courseId, updated[courseId].length);
          });
          
          return updated;
        });
      }
    } else {
      // Mettre à jour courseLessons (pour IntegratedCourseViewer)
      if (selectedCourse && courseLessons[selectedCourse.id]) {
        console.log('🔑 DÉBLOCAGE: Mise à jour courseLessons pour', selectedCourse.id);
        setCourseLessons(prev => {
          const currentLessons = prev[selectedCourse.id] || [];
          let updatedLessons;
          
          if (option.type === 'lesson') {
            // Débloquer uniquement la leçon spécifiée
            updatedLessons = currentLessons.map(lesson => 
              lesson.id === option.itemId 
                ? { ...lesson, isOwned: true }
                : lesson
            );
            console.log('🔑 DÉBLOCAGE: Leçon débloquée:', option.itemId);
          } else if (option.type === 'course') {
            // Débloquer toutes les leçons du cours
            updatedLessons = currentLessons.map(lesson => ({ 
              ...lesson, 
              isOwned: true 
            }));
            console.log('🔑 DÉBLOCAGE: TOUTES les leçons du cours débloquées:', updatedLessons.length);
          } else {
            updatedLessons = currentLessons;
          }
          
          return {
            ...prev,
            [selectedCourse.id]: updatedLessons
          };
        });
      }
    }
    
    // Mettre à jour les cours primaires avec leurs leçons (pour la cohérence globale)
    if (option.type === 'course' || option.type === 'pack') {
      console.log('🔑 DÉBLOCAGE: Mise à jour des cours primaires avec isOwned=true');
      setPrimaryCourses(prev => prev.map(course => {
        let shouldUpdate = false;
        
        if (option.type === 'course') {
          // Pour un cours : vérifier l'ID exact
          shouldUpdate = course.id === option.itemId;
        } else if (option.type === 'pack') {
          // Pour un pack : vérifier si le cours appartient au pack
          const pack = getCoursePacks().find(p => p.id === option.itemId);
          shouldUpdate = pack ? pack.courses.includes(course.id) : false;
        }
        
        if (shouldUpdate) {
          // Marquer le cours comme possédé et toutes ses leçons
          const updatedCourse = { 
            ...course, 
            isOwned: true,
            lessons: course.lessons?.map(lesson => ({ ...lesson, isOwned: true })) || []
          };
          console.log('🔑 DÉBLOCAGE: Cours primaire mis à jour:', updatedCourse.id, 'isOwned:', updatedCourse.isOwned);
          return updatedCourse;
        }
        console.log('🔑 DÉBLOCAGE: Cours non concerné:', course.id, 'isOwned reste:', course.isOwned);
        return course;
      }));
      
      // Note: Les cours suggérés sont gérés par les props et seront mis à jour par le parent
    }

    // 📚 SYNCHRONISATION AVEC MES COURS FAVORIS (POINT CRITIQUE)
    console.log('🔄 SYNC: Début synchronisation avec Mes Cours favoris');
    
    if (option.type === 'lesson') {
      // CAS 1: Déblocage leçon seule → Ajouter le cours parent aux favoris s'il n'y est pas
      console.log('🔄 SYNC: Achat d\'une leçon seule, ajout du cours parent aux favoris');
      
      if (selectedCourse && !primaryCourses.find(c => c.id === selectedCourse.id)) {
        const courseToAdd = { 
          ...selectedCourse, 
          isPrimary: true,
          isOwned: false // Pas encore le cours complet
        };
        setPrimaryCourses(prev => [courseToAdd, ...prev]);
        console.log('✅ SYNC: Cours parent ajouté aux favoris:', selectedCourse.title);
      }
      
    } else if (option.type === 'course') {
      // CAS 2: Déblocage cours complet → Toutes les leçons débloquées + cours en favori
      console.log('🔄 SYNC: Achat d\'un cours complet, mise à jour favoris');
      
      // Toujours chercher le cours par option.itemId pour éviter les confusions
      const purchasedCourse = [...primaryCourses, ...data.suggestedCourses.map(s => s.course)]
        .find(course => course.id === option.itemId);
      
      if (purchasedCourse) {
        const courseToUpdate = { 
          ...purchasedCourse, 
          isPrimary: true,
          isOwned: true // Cours complet possédé
        };
        
        // Remplacer s'il existe déjà, sinon ajouter
        setPrimaryCourses(prev => {
          const existingIndex = prev.findIndex(c => c.id === option.itemId);
          let updatedCourses;
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = courseToUpdate;
            console.log('✅ SYNC: Cours existant mis à jour dans favoris:', purchasedCourse.title);
            updatedCourses = updated;
          } else {
            console.log('✅ SYNC: Nouveau cours ajouté aux favoris:', purchasedCourse.title);
            updatedCourses = [courseToUpdate, ...prev];
          }
          
          // 🔄 SYNC: Mettre à jour localStorage pour useFavorites
          const favoriteIds = updatedCourses.filter(c => c.isPrimary).map(c => c.id);
          localStorage.setItem('favoriteCourses', JSON.stringify(favoriteIds));
          console.log('🔄 SYNC: localStorage mis à jour avec favoris:', favoriteIds);
          
          // 🔄 SYNC: Dispatcher l'événement après le rendu pour éviter les cycles
          setTimeout(() => {
            console.log('🔄 SYNC: Déclenchement événement favoritesChanged');
            window.dispatchEvent(new CustomEvent('favoritesChanged'));
          }, 0);
          
          return updatedCourses;
        });
      } else {
        console.log('❌ SYNC: Cours non trouvé pour itemId:', option.itemId);
      }
      
    } else if (option.type === 'pack') {
      // CAS 3: Déblocage pack → Tous les cours et leçons du pack aux favoris
      console.log('🔄 SYNC: Achat d\'un pack complet, ajout de tous les cours');
      
      // Récupérer les informations du pack acheté
      const packs = getCoursePacks();
      const purchasedPack = packs.find((p: any) => p.id === option.itemId || p.id === 'pack-electromagnetisme');
      
      if (purchasedPack && purchasedPack.courses) {
        console.log('🔄 SYNC: Pack trouvé:', purchasedPack.title, 'avec cours:', purchasedPack.courses);
        
        // Récupérer tous les cours du pack depuis les données
        const allCourses = [...primaryCourses, ...data.suggestedCourses.map(s => s.course)];
        const packCourses = purchasedPack.courses
          .map((courseId: string) => allCourses.find(c => c.id === courseId))
          .filter(Boolean)
          .map((course: any) => ({ 
            ...course, 
            isPrimary: true,
            isOwned: true 
          }));
        
        console.log('🔄 SYNC: Cours du pack à ajouter:', packCourses.map((c: any) => c.title));
        
        // Ajouter tous les cours du pack aux favoris
        setPrimaryCourses(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newCourses = packCourses.filter((course: any) => !existingIds.has(course.id));
          const updatedExisting = prev.map(course => {
            const packCourse = packCourses.find((pc: any) => pc.id === course.id);
            return packCourse ? { ...course, isOwned: true } : course;
          });
          
          return [...newCourses, ...updatedExisting];
        });
        
        console.log('✅ SYNC: Pack - Tous les cours ajoutés aux favoris:', packCourses.map((c: any) => c.title));
      } else {
        console.log('⚠️ SYNC: Pack non trouvé pour:', option.itemId);
        
        // Fallback: ajouter au moins le cours actuel
        if (selectedCourse) {
          const courseToUpdate = { 
            ...selectedCourse, 
            isPrimary: true,
            isOwned: true 
          };
          
          setPrimaryCourses(prev => {
            const existingIndex = prev.findIndex(c => c.id === selectedCourse.id);
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = courseToUpdate;
              return updated;
            } else {
              return [courseToUpdate, ...prev];
            }
          });
          console.log('✅ SYNC: Pack - Cours actuel ajouté aux favoris (fallback):', selectedCourse.title);
        }
      }
    }

    // Marquer comme acheté (callback vers le parent)
    if (props.onPurchase) {
      props.onPurchase(option.type, option.itemId, option.price);
    }
    
    // 🎯 DÉCLENCHEMENT OBLIGATOIRE DE L'ONBOARDING PLANIFICATEUR
    if (option.type === 'course' || option.type === 'pack') {
      console.log('🎯 ONBOARDING: Déclenchement planification pour', option.type);
      
      // 🔄 SYNC: Mettre à jour selectedCourse pour correspondre au cours acheté
      if (option.type === 'course') {
        const purchasedCourse = [...primaryCourses, ...data.suggestedCourses.map(s => s.course)]
          .find(course => course.id === option.itemId);
        if (purchasedCourse && purchasedCourse.id !== selectedCourse?.id) {
          console.log('🔄 SYNC: Redirection vers le cours acheté:', purchasedCourse.title, '(était:', selectedCourse?.title, ')');
          setSelectedCourse(purchasedCourse);
        }
      }
      
      let courseName = 'Cours complet';
      let planningItemId = option.itemId;
      
      if (option.type === 'pack') {
        // Pour un pack, utiliser le nom du pack et proposer tous les cours
        const packs = getCoursePacks();
        const purchasedPack = packs.find((p: any) => p.id === option.itemId || p.id === 'pack-electromagnetisme');
        
        if (purchasedPack) {
          courseName = purchasedPack.title;
          console.log('🎯 ONBOARDING: Pack trouvé pour planification:', courseName, 'avec', purchasedPack.courses.length, 'cours');
        } else {
          courseName = 'Pack Electrostatique';
        }
      } else {
        // Pour un cours individuel - toujours chercher par option.itemId pour éviter les confusions
        const purchasedCourse = [...primaryCourses, ...data.suggestedCourses.map(s => s.course)]
          .find(course => course.id === option.itemId);
        
        if (purchasedCourse) {
          courseName = purchasedCourse.title;
          console.log('🎯 ONBOARDING: Cours trouvé par itemId:', courseName, '(', option.itemId, ')');
        } else if (selectedCourse) {
          courseName = selectedCourse.title;
          console.log('🎯 ONBOARDING: Fallback selectedCourse:', courseName);
          console.log('🎯 ONBOARDING: selectedCourse.id:', selectedCourse.id, 'vs option.itemId:', option.itemId);
        } else {
          console.log('🎯 ONBOARDING: Aucun cours trouvé, utilisation nom générique');
          courseName = 'Cours acheté';
        }
      }
      
      console.log('🎯 ONBOARDING: DÉCLENCHEMENT FINAL pour:', courseName, 'ID:', planningItemId);
      triggerPlannerOnboarding(courseName, planningItemId);
    } else {
      console.log('🎯 ONBOARDING: Pas un achat de cours complet, pas d\'onboarding');
    }
    
    setShowPurchaseUpsell(false);
    setShowWalletTopUp(false); // Fermer aussi la modal de top-up si elle est ouverte
    
    // Message de succès avec synchronisation confirmée
    const successMessages = {
      lesson: '🎉 Leçon débloquée et ajoutée à vos cours favoris !',
      course: '🎉 Cours complet débloqué et ajouté à vos favoris !',
      pack: '🎉 Pack complet débloqué ! Tous les cours sont dans vos favoris !'
    };
    
    setSuccessMessage(successMessages[option.type] || '🎉 Contenu débloqué avec succès !');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = primaryCourses.findIndex(course => course.id === active.id);
      const newIndex = primaryCourses.findIndex(course => course.id === over.id);
      const newOrder = arrayMove(primaryCourses, oldIndex, newIndex);
      setPrimaryCourses(newOrder);
      onUpdateCourseOrder(active.id as string, newIndex);
    }
  };

  const handleToggleFavorite = (courseId: string, courseTitle?: string) => {
    // Utiliser le hook useFavorites pour la synchronisation
    toggleFavorite(courseId, courseTitle);
    
    // Appeler aussi la fonction props pour maintenir la compatibilité
    if (onToggleCourseFavorite) {
      onToggleCourseFavorite(courseId);
    }
  };

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowIntegratedViewer(true); // Utiliser le nouveau viewer par défaut
  };

  // Fonction pour naviguer vers le Course Viewer depuis le planificateur
  const handleNavigateToCourse = (courseId: string) => {
    // Trouver le cours dans les cours primaires
    const course = primaryCourses.find(c => c.id === courseId);
    if (course) {
      // Fermer le planificateur
      setActiveSection('courses');
      setForceShowPlanner(false);
      // Ouvrir le Course Viewer
      setSelectedCourse(course);
      setShowIntegratedViewer(true);
    } else {
      console.error('Cours non trouvé:', courseId);
    }
  };

  const handleOpenStaircaseView = (course: Course) => {
    setSelectedCourse(course);
    setShowStaircaseView(true);
  };

  const handleCompletePack = (packId: string) => {
    // Générer uniquement l'option pack pour l'upsell
    const packOptions = generatePackOnlyUpsellOptions(packId);
    
    // Créer un objet lesson fictif pour la modale
    const packPurchaseItem = {
      id: packId,
      title: packOptions[0]?.title || 'Pack Électrostatique'
    };
    
    setSelectedLessonForPurchase(packPurchaseItem);
    setShowPurchaseUpsell(true);
    
    console.log('Ouverture modale upsell pour pack:', packId);
  };

  // Fonction pour générer uniquement l'option pack
  const generatePackOnlyUpsellOptions = (packId: string): PurchaseOption[] => {
    // Récupérer les informations du pack depuis les données mock
    const packs = getCoursePacks();
    const pack = packs.find((p: any) => p.id === packId);
    
    if (!pack) {
      // Pack par défaut si non trouvé
      return [{
        type: 'pack',
        itemId: 'pack-electromagnetisme',
        title: 'Pack Électrostatique',
        description: 'Formation complète en électrostatique',
        price: 1200,
        features: [
          'Accès à l\'ensemble des cours d\'électrostatique :',
          '– Loi de Gauss',
          '– Intégrales et Applications', 
          '– Forces et Mouvement',
          '– Suites et Limites',
          '– Champs Électriques, Potentiels et Énergie',
          'Vidéos FullHD',
          'Quiz d\'auto-évaluation',
          'Slides PDF disponibles pour tous les cours du pack',
          'Accès aux Study Rooms premium',
          'Accès à tous les groupes WhatsApp',
          'Garantie de réussite globale',
          'Support prioritaire',
          'Planificateur inclus'
        ],
        badge: 'Pack Premium',
        walletHint: 'Astuce : Recharge ton portefeuille et profite d\'un bonus offert (quantité limitée).'
      }];
    }

    // Générer l'option basée sur le pack trouvé
    return [{
      type: 'pack',
      itemId: pack.id,
      title: pack.title,
      description: pack.description,
      price: 1200, // Prix fixe pour tous les packs
      features: [
        `Accès à l'ensemble des cours de ${pack.title.toLowerCase()} :`,
        ...pack.courses.map((courseId: string) => `– ${getCourseNameFromId(courseId)}`),
        'Vidéos FullHD',
        'Quiz d\'auto-évaluation',
        'Slides PDF disponibles pour tous les cours du pack',
        'Accès aux Study Rooms premium',
        'Accès à tous les groupes WhatsApp',
        'Garantie de réussite globale',
        'Support prioritaire',
        'Planificateur inclus'
      ],
      badge: 'Pack Premium',
      walletHint: 'Astuce : Recharge ton portefeuille et profite d\'un bonus offert (quantité limitée).'
    }];
  };

  // Fonction utilitaire pour obtenir le nom d'un cours depuis son ID
  const getCourseNameFromId = (courseId: string): string => {
    const courseNames: Record<string, string> = {
      'course-gauss': 'Loi de Gauss',
      'course-forces': 'Forces et Mouvement',
      'course-equilibres': 'Équilibres Chimiques',
      'course-integrales': 'Intégrales et Applications',
      'course-suites': 'Suites et Limites',
      'course-einstein-relativity': 'Théorie de la Relativité',
      'course-fisher-statistics': 'Tests Statistiques de Fisher',
      'course-curie-radioactivity': 'Radioactivité et Éléments',
      'course-franklin-dna': 'Structure de l\'ADN'
    };
    return courseNames[courseId] || courseId;
  };

  const handleCloseStaircaseView = () => {
    setShowStaircaseView(false);
    setSelectedCourse(null);
  };

  const handleSelectLessonFromStaircase = (lesson: any) => {
    // Fermer la vue escalier et ouvrir la leçon
    setShowStaircaseView(false);
    // Ici vous pourriez ouvrir le viewer de leçon spécifique
    console.log('Leçon sélectionnée:', lesson);
  };

  // Fonctions Study Room
  const handleJoinStudyRoom = (roomId: string) => {
    console.log('Rejoindre Study Room:', roomId);
    
    // Trouver la Study Room correspondante
    const room = activeStudyRooms.find(r => r.id === roomId);
    if (room) {
      setSelectedStudyRoom(room);
      setShowStudyRoomModal(true);
    } else {
      alert('Study Room introuvable');
    }
  };

  const handleJoinStudyRoomByCourse = (courseId: string) => {
    console.log('Rejoindre Study Room pour le cours:', courseId);
    
    // Trouver une Study Room active pour ce cours
    const courseRooms = activeStudyRooms.filter(room => room.courseId === courseId);
    if (courseRooms.length > 0) {
      setSelectedStudyRoom(courseRooms[0]); // Prendre la première room active
      setShowStudyRoomModal(true);
    } else {
      alert('Aucune Study Room active pour ce cours en ce moment');
    }
  };

  const handleCreateStudyRoom = () => {
    console.log('Créer une nouvelle Study Room');
    // TODO: Ouvrir un modal de création de Study Room
    alert('Créer une Study Room - Fonctionnalité en développement');
  };

  const handleCloseStudyRoom = () => {
    setShowStudyRoomModal(false);
    setSelectedStudyRoom(null);
  };

  // ========================================================================
  // HANDLERS PLANIFICATEUR
  // ========================================================================

  const handleGeneratePlan = (preferences: any) => {
    console.log('🎯 Génération/mise à jour du planning avec les préférences:', preferences);
    if (plannerState.canCreatePlan) {
      // Utiliser la méthode intelligente qui gère la cumulation
      const plan = plannerState.createOrUpdatePlan(preferences, focusedCourseForPlanning || undefined);
      console.log('📅 Planning traité:', plan);
      
      // Message adapté selon le contexte
      if (plannerState.hasExistingPlan && focusedCourseForPlanning) {
        const courseName = focusedCourseForPlanning.title;
        const newSessionsCount = plan.sessions.filter(s => s.courseId === focusedCourseForPlanning.id).length;
        alert(`✅ Ton planning a été actualisé avec ${newSessionsCount} nouvelles sessions du cours "${courseName}". Tes sessions existantes sont conservées ! 🚀`);
      } else {
        alert('✨ Planning généré avec succès ! 🚀');
      }
      return plan;
    }
    throw new Error('Accès au planificateur refusé');
  };

  const handlePlannerWhatsApp = () => {
    const message = plannerState.generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/33123456789?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePlannerUpgrade = () => {
    console.log('🚀 Demande d\'upgrade pour accéder au planificateur');
    // Afficher les options d'achat de packs complets
    alert('Redirection vers les packs complets - Fonctionnalité en développement');
  };

  // ========================================================================
  // HANDLERS BUDDY SYSTEM
  // ========================================================================

  const handleAddBuddy = (buddyData: Omit<BuddySystem, 'id' | 'userId'>) => {
    const newBuddy: BuddySystem = {
      ...buddyData,
      id: `buddy-${Date.now()}`,
      userId: user?.id || '1'
    };
    setBuddy(newBuddy);
    console.log('👥 Buddy ajouté:', newBuddy);
    alert(`Buddy "${buddyData.buddyName}" ajouté avec succès ! 👥`);
  };

  const handleUpdateBuddy = (updatedBuddy: BuddySystem) => {
    setBuddy(updatedBuddy);
    console.log('👥 Buddy mis à jour:', updatedBuddy);
  };

  const handleRemoveBuddy = () => {
    if (buddy) {
      console.log('👥 Buddy supprimé:', buddy.buddyName);
      setBuddy(null);
      alert(`Buddy "${buddy.buddyName}" supprimé !`);
    }
  };

  const handleSendBuddyNotification = (type: 'missed-session' | 'progress-update', sessionName?: string) => {
    if (!buddy || !buddy.isActive) {
      alert('Aucun buddy actif configuré !');
      return;
    }

    const messages = {
      'missed-session': `📚 Ton buddy a manqué sa session "${sessionName}". Un petit encouragement ? 💪`,
      'progress-update': `🎉 Ton buddy fait des progrès fantastiques ! Continue à l'encourager !`
    };

    const message = messages[type];
    
    // Simuler l'envoi selon la méthode de contact
    if (buddy.contactMethod === 'whatsapp') {
      const encodedMessage = encodeURIComponent(`Salut ${buddy.buddyName} ! ${message}`);
      const whatsappUrl = `https://wa.me/${buddy.buddyContact.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    } else if (buddy.contactMethod === 'email') {
      const subject = type === 'missed-session' ? 'Session manquée' : 'Progrès excellent';
      const emailUrl = `mailto:${buddy.buddyContact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.open(emailUrl);
    } else {
      // SMS
      const smsUrl = `sms:${buddy.buddyContact}?body=${encodeURIComponent(message)}`;
      window.open(smsUrl);
    }

    // Mettre à jour la date de dernière notification
    setBuddy({
      ...buddy,
      lastNotificationSent: new Date()
    });

    console.log(`📱 Notification buddy envoyée (${buddy.contactMethod}):`, message);
    alert(`Notification envoyée à ${buddy.buddyName} via ${buddy.contactMethod.toUpperCase()} ! 📱`);
  };

  // Fonction pour obtenir les props Study Room d'un cours
  const getStudyRoomProps = (course: Course) => {
    const courseAccess = studyRoomState.userAccess[course.id];
    const courseRooms = studyRoomState.accessibleRooms.filter(room => room.courseId === course.id);
    const hasActiveRoom = courseRooms.length > 0;
    const totalParticipants = courseRooms.reduce((sum, room) => sum + room.currentUsers.length, 0);
    
    // 🔍 DEBUG: Vérifier l'accès Study Room
    console.log('🔍 STUDY ROOM ACCESS pour', course.id, ':', {
      courseAccess,
      hasFullAccess: courseAccess?.hasFullAccess,
      purchasedItems: Array.from(purchasedItems),
      courseIsOwned: course.isOwned
    });
    
    return {
      studyRoomAccess: courseAccess ? {
        hasFullAccess: courseAccess.hasFullAccess,
        accessMessage: studyRoomState.getAccessMessage(course.id)
      } : undefined,
      onJoinStudyRoom: handleJoinStudyRoomByCourse,
      hasActiveStudyRoom: hasActiveRoom,
      studyRoomParticipants: totalParticipants
    };
  };

  const handleOpenIntegratedViewer = (course: Course) => {
    setSelectedCourse(course);
    setShowIntegratedViewer(true);
    setCourseViewerOpen(false); // Fermer l'ancien système
  };

  const handleCloseIntegratedViewer = () => {
    setShowIntegratedViewer(false);
    setSelectedCourse(null);
  };

  const handleCloseCourseViewer = () => {
    setCourseViewerOpen(false);
    setSelectedCourse(null);
  };

  const handlePreviewCourse = (courseId: string) => {
    const course = [...primaryCourses, ...data.suggestedCourses.map(s => s.course)]
      .find(c => c.id === courseId);
    if (course) {
      setPreviewCourse(course);
      setPreviewModalOpen(true);
      // S'assurer que l'IntegratedCourseViewer ne s'ouvre pas en même temps
      setShowIntegratedViewer(false);
      setSelectedCourse(null);
    }
  };

  const handleClosePreviewModal = () => {
    setPreviewModalOpen(false);
    setPreviewCourse(null);
  };

  // Fonction pour débloquer un cours avec des crédits (interceptée pour déclencher la comparaison)
  const handleUnlockCourse = (courseId: string) => {
    const course = data.suggestedCourses.find(s => s.course.id === courseId)?.course;
    if (!course) return;

    // Au lieu de débloquer directement, on déclenche la comparaison intelligente
    setSelectedCourseForComparison(course);
    setShowCourseComparison(true);
  };

  // Fonction pour débloquer directement un cours (utilisée après confirmation)
  const handleDirectCourseUnlock = (courseId: string) => {
    const course = data.suggestedCourses.find(s => s.course.id === courseId)?.course;
    if (!course) return;

    const creditCost = course.creditCost || 1;
    const success = spendCredits(creditCost, `Cours "${course.title}" débloqué`, courseId);
    if (success) {
      setUnlockedCourses(prev => [...prev, courseId]);
      
      // Déplacer le cours en haut des favoris (nouveau cours en premier)
      const newCourse = { ...course, isPrimary: true };
      setPrimaryCourses(prev => [newCourse, ...prev]);
      
      // Message de succès
      setSuccessMessage(`🎉 Bravo ! Tu viens de débloquer "${course.title}". Ce parcours est conçu pour t'accompagner jusqu'à ton examen final.`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Bonus: gagner un crédit après avoir terminé 3 cours
      if (unlockedCourses.length + 1 === 3) {
        setTimeout(() => {
          gainCredits(1, 'Bonus progression - 3 cours débloqués !');
        }, 2000);
      }
    }
  };

  // Fonctions pour gérer la comparaison de cours
  const handleCloseCourseComparison = () => {
    setShowCourseComparison(false);
    setSelectedCourseForComparison(null);
  };

  const handleSelectCourseFromComparison = () => {
    if (selectedCourseForComparison) {
      handleDirectCourseUnlock(selectedCourseForComparison.id);
      handleCloseCourseComparison();
    }
  };

  const handleSelectPackFromComparison = (packId: string) => {
    handleUnlockPack(packId, []);
    handleCloseCourseComparison();
  };

  // Fonction pour créer un cours mock basé sur l'ID (pour les cours de l'année prochaine)
  const createMockCourseFromId_UNUSED = (courseId: string): Course | null => {
    // Interface temporaire pour le mapping
    interface MockCourseData {
      id: string;
      title: string;
      description: string;
      category: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      duration: string;
      creditCost: number;
    }
    
    // Mapping des IDs vers des cours mock
    const courseMapping: Record<string, MockCourseData> = {
      'advanced-calculus': {
        id: 'advanced-calculus',
        title: 'Calcul Avancé',
        description: 'Intégrales multiples, séries de Fourier et équations différentielles pour maîtriser les mathématiques avancées.',
        category: 'Mathématiques',
        difficulty: 'advanced',
        duration: '45h',
        creditCost: 3
      },
      'course-gauss': {
        id: 'course-gauss',
        title: 'Loi de Gauss',
        description: 'Maîtrise complète de la loi de Gauss et ses applications en électrostatique. Calculs de champs électriques pour différentes géométries.',
        category: 'Physique',
        difficulty: 'intermediate',
        duration: '35h',
        creditCost: 2
      },
      'loi-gauss': {
        id: 'loi-gauss',
        title: 'Loi de Gauss',
        description: 'Maîtrise complète de la loi de Gauss et ses applications en électrostatique. Calculs de champs électriques pour différentes géométries.',
        category: 'Physique',
        difficulty: 'intermediate',
        duration: '35h',
        creditCost: 2
      },
      'quantum-physics': {
        id: 'quantum-physics',
        title: 'Physique Quantique',
        description: 'Mécanique quantique et applications modernes pour comprendre le monde subatomique.',
        category: 'Physique',
        difficulty: 'advanced',
        duration: '52h',
        creditCost: 3
      },
      'organic-chemistry': {
        id: 'organic-chemistry',
        title: 'Chimie Organique',
        description: 'Réactions et mécanismes en chimie organique pour maîtriser les transformations moléculaires.',
        category: 'Chimie',
        difficulty: 'intermediate',
        duration: '38h',
        creditCost: 2
      },
      'advanced-anatomy': {
        id: 'advanced-anatomy',
        title: 'Anatomie Avancée',
        description: 'Anatomie systémique et clinique pour une compréhension approfondie du corps humain.',
        category: 'Anatomie',
        difficulty: 'advanced',
        duration: '60h',
        creditCost: 4
      },
      'pathophysiology': {
        id: 'pathophysiology',
        title: 'Physiopathologie',
        description: 'Mécanismes des maladies pour comprendre les processus pathologiques.',
        category: 'Pathologie',
        difficulty: 'advanced',
        duration: '55h',
        creditCost: 4
      }
    };

    const courseData = courseMapping[courseId];
    if (!courseData) {
      console.warn(`Cours non trouvé pour l'ID: ${courseId}`);
      return null;
    }

    // Créer un cours complet avec des leçons mock
    const mockCourse: Course = {
      id: courseData.id!,
      title: courseData.title!,
      description: courseData.description!,
      faculty: courseData.category,
      year: '2025',
      totalLessons: 3,
      completedLessons: 0,
      difficulty: courseData.difficulty,
      duration: courseData.duration,
      isOwned: false,
      progress: 0,
      previewAvailable: true,
      creditCost: courseData.creditCost!,
      lessons: [
        {
          id: '1',
          courseId: courseData.id!,
          title: 'Introduction aux concepts fondamentaux',
          description: 'Découvrez les bases essentielles de ce domaine d\'étude.',
          duration: 15,
          videoUrl: '/videos/sample-lesson.mp4',
          isCompleted: false,
          isAccessible: true,
          isOwned: false,
          xpReward: 50,
          difficulty: 'beginner',
          order: 1,
          price: 70,
          progress: 0,
          hasPreview: true,
          previewAvailable: true,
          tags: ['introduction', 'fondamentaux']
        },
        {
          id: '2',
          courseId: courseData.id!,
          title: 'Approfondissement théorique',
          description: 'Explorez les concepts avancés et leurs applications.',
          duration: 25,
          videoUrl: '/videos/sample-lesson-2.mp4',
          isCompleted: false,
          isAccessible: false,
          isOwned: false,
          xpReward: 75,
          difficulty: 'intermediate',
          order: 2,
          price: 70,
          progress: 0,
          hasPreview: true,
          previewAvailable: true,
          tags: ['théorie', 'avancé']
        },
        {
          id: '3',
          courseId: courseData.id!,
          title: 'Applications pratiques',
          description: 'Mettez en pratique vos connaissances avec des exercices concrets.',
          duration: 30,
          videoUrl: '/videos/sample-lesson-3.mp4',
          isCompleted: false,
          isAccessible: false,
          isOwned: false,
          xpReward: 100,
          difficulty: 'advanced',
          order: 3,
          price: 70,
          progress: 0,
          hasPreview: true,
          previewAvailable: true,
          tags: ['pratique', 'exercices']
        }
      ],
      isPrimary: false,
      tags: [courseData.category.toLowerCase()]
    };

    return mockCourse;
  };

  // Fonction pour débloquer un pack avec des crédits
  const handleUnlockPack = (packId: string, courseIds: string[]) => {
    // Récupérer les cours du pack
    const packCourses = courseIds.map(courseId => 
      data.suggestedCourses.find(s => s.course.id === courseId)?.course
    ).filter(Boolean) as Course[];

    if (packCourses.length === 0) return;

    // Marquer le pack comme débloqué
    setUnlockedPacks(prev => [...prev, packId]);
    
    // Débloquer tous les cours du pack
    setUnlockedCourses(prev => [...prev, ...courseIds]);
    
    // Ajouter tous les cours en haut des favoris avec badge pack
    const newCourses = packCourses.map(course => ({ 
      ...course, 
      isPrimary: true,
      packBadge: `Inclus dans Pack`
    }));
    setPrimaryCourses(prev => [...newCourses, ...prev]);
    
    // Message de succès
    setSuccessMessage(`🚀 Fantastique ! Tu viens de débloquer un pack complet avec ${packCourses.length} cours. Ton parcours d'apprentissage s'enrichit considérablement !`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Gestion des packs de crédits
  const handlePurchasePack = (type: 'pack' | 'bundle', item: any) => {
    setCheckoutItem({ 
      type, 
      name: item.name, 
      price: type === 'pack' ? item.price : item.bundlePrice,
      credits: item.credits,
      bonusCredits: item.bonusCredits || 0,
      features: type === 'pack' ? item.features : item.items.map((i: any) => i.name)
    });
    setShowCreditPacks(false);
    setShowCheckout(true);
  };

  const handleConfirmPurchase = (finalItems: any[]) => {
    const totalCredits = finalItems.reduce((sum, item) => {
      return sum + (item.credits || 0) + (item.bonusCredits || 0);
    }, 0);
    
    if (totalCredits > 0) {
      gainCredits(totalCredits, 'Achat de pack de crédits');
    }
    
    setShowCheckout(false);
    setCheckoutItem(null);
  };

  // Calculs de statistiques
  const totalHours = data.progress.reduce((acc, p) => acc + p.timeSpent, 0) / 60;
  const averageProgress = primaryCourses.length > 0 
    ? Math.round(primaryCourses.reduce((acc, course) => acc + course.progress, 0) / primaryCourses.length)
    : 0;
  const bestRanking = data.progress.length > 0 
    ? Math.min(...data.progress.map(p => p.facultyRanking))
    : null;

  // Navigation items simplifiés avec persistance
  const [activeSection, setActiveSection] = useState(() => {
    // Récupérer la section depuis localStorage si disponible
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeSection') || 'courses';
    }
    return 'courses';
  });
  
  // État pour éviter les changements de section non désirés
  const [isNavigationLocked, setIsNavigationLocked] = useState(false);
  
  // Debug: surveiller les changements d'activeSection
  useEffect(() => {
    console.log('🎯 EFFECT: activeSection changé vers:', activeSection);
    // Sauvegarder dans localStorage seulement si la navigation n'est pas verrouillée
    if (typeof window !== 'undefined' && !isNavigationLocked) {
      localStorage.setItem('activeSection', activeSection);
    }
  }, [activeSection, isNavigationLocked]);
  
  const navigationItems = [
    { id: 'courses', label: 'Mes cours', icon: BookOpen, hasAccess: true },
    { id: 'unlock', label: 'Débloquer', icon: Brain, hasAccess: true },
    { 
      id: 'planning', 
      label: 'Planification', 
      icon: Calendar, 
      hasAccess: plannerState.plannerAccess.hasAccess,
      isPremium: true,
      hasNotification: plannerState.plannerAccess.hasAccess && !plannerConfigured
    },
    { id: 'community', label: 'Communauté', icon: Users, hasAccess: true },
  ];

  return (
    <>
      {/* Vue escalier - Remplace complètement l'interface */}
      {selectedCourse && showStaircaseView ? (
        <CourseStaircaseView
          course={selectedCourse}
          lessons={courseLessons[selectedCourse.id] || selectedCourse.lessons || []}
          onSelectLesson={handleSelectLessonFromStaircase}
          onClose={handleCloseStaircaseView}
          purchasedItems={purchasedItems}
        />
      ) : selectedCourse && showIntegratedViewer ? (
        /* Vue cours intégrée - Remplace complètement l'interface */
        <IntegratedCourseViewer
          course={selectedCourse}
          isOpen={true}
          onClose={handleCloseIntegratedViewer}
          onNavigateToSection={setActiveSection}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
          purchasedItems={purchasedItems}
          onPurchase={handleLessonPurchase}
          user={user || data.user}
          lessons={courseLessons[selectedCourse.id]}
          onLessonsUpdate={(updatedLessons) => {
            setCourseLessons(prev => ({
              ...prev,
              [selectedCourse.id]: updatedLessons
            }));
          }}
        />
      ) : (
        <div className="min-h-screen pt-[73px] relative overflow-hidden">
          {/* Arrière-plan dynamique */}
          {selectedBackground !== 'default' ? (
            <div 
              className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
              style={{ 
                backgroundImage: `url(/course-backgrounds/${selectedBackground}.svg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ) : (
            <div className="fixed inset-0 bg-gray-50 z-0" />
          )}
          
          {/* Overlay pour améliorer la lisibilité */}
          {selectedBackground !== 'default' && (
            <div className="fixed inset-0 bg-white/60 backdrop-blur-[1px] z-0" />
          )}
          
          
          {/* Contenu principal */}
          <div className="relative z-10">
        {/* Header épuré bord à bord - pleine largeur */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
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
                </div>
              </div>
            </div>
            
            {/* Recherche, crédits et notifications */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-64"
                />
              </div>
              
              {/* Portefeuille */}
              {(user?.wallet || data.user?.wallet) && (
                <div data-tour="wallet">
                  <WalletBalance 
                    balance={(user?.wallet || data.user?.wallet)?.balance || 0}
                    onAddFunds={() => setShowWalletTopUp(true)}
                  />
                </div>
              )}

              
              
              {/* Bouton WhatsApp - VERT */}
              <a
                data-tour="whatsapp"
                href="https://wa.me/33123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition-colors group"
                title="Contactez-nous sur WhatsApp"
              >
                <MessageSquare size={18} className="text-white" />
                <span className="text-white text-sm font-medium">Discute avec nous</span>
              </a>
              
              
              

              {/* Widget Social Unifié */}
              <UnifiedSocialWidget
                userId={user?.id || 'current_user'}
                onNavigateToCommunity={() => setActiveSection('community')}
                onNavigateToSection={setActiveSection}
              />

              {/* Widget Study Rooms */}
              <div data-tour="study-rooms">
                <StudyRoomHeaderWidget
                  userId={user?.id || 'current_user'}
                  userName={user?.name || 'Étudiant SMS'}
                  purchasedItems={purchasedItems}
                  onNavigateToStudyRooms={() => setActiveSection('community')}
                  onNavigateToUpgrade={(courseId) => {
                    setActiveSection('unlock');
                    console.log('Navigation vers upgrade pour:', courseId);
                  }}
                />
              </div>

              {/* Widget Notifications */}
               <NotificationWidget
                 onNotificationClick={(notification) => {
                   // Gérer la navigation selon le type de notification
                   if (notification.actionData?.action === 'configure' && notification.category === 'planning') {
                     setActiveSection('planning');
                   } else if (notification.category === 'courses' && notification.actionData?.courseId) {
                     // Ouvrir le course viewer
                     console.log('Navigate to course:', notification.actionData.courseId);
                   } else if (notification.category === 'community') {
                     setActiveSection('community');
                   }
                 }}
               />

              {/* Widget des paramètres */}
            </div>

            <div className="flex items-center gap-4">
              {/* WhatsApp mobile */}
              <a
                href="https://wa.me/33123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-green-500 hover:bg-green-600 transition-colors"
                title="Contactez-nous sur WhatsApp"
              >
                <MessageSquare size={18} className="text-white" />
              </a>

              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">Bonjour, {data.user.name}</p>
                <p className="text-xs text-gray-500">{data.user.year}</p>
              </div>
              
              {/* Profil utilisateur avec paramètres */}
              <div className="relative" ref={settingsRef}>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold hover:bg-gray-800 transition-colors"
                >
                  {data.user.name.charAt(0)}
                </button>

                {/* Dropdown profil + paramètres */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6 w-80 md:w-80 z-50 max-w-[calc(100vw-1rem)] md:max-w-none"
                    >
                      {/* Header profil */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                            {data.user.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{data.user.name}</h3>
                            <p className="text-xs text-gray-500">{data.user.year}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowSettings(false)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <X size={14} className="text-gray-400" />
                        </button>
                      </div>

                      <hr className="border-gray-100 mb-4" />

                      <div className="space-y-4">
                        {/* Statut de vérification d'identité */}
                        <IdentityStatusBadge className="w-full" />


                        {/* Actions rapides profil */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Mon profil</div>
                            <div className="text-xs text-gray-500">Modifier mes informations</div>
                          </div>
                          <button 
                            onClick={() => {
                              setShowSettings(false);
                              window.location.href = '/profil';
                            }}
                            className="text-sm text-blue-600 font-medium hover:text-blue-700"
                          >
                            Voir profil
                          </button>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Paramètres */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Settings size={14} />
                            Paramètres
                          </h4>

                          <div className="space-y-3">
                            {/* Mode Sombre */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">Mode sombre</div>
                                <div className="text-xs text-gray-500">Interface en thème sombre</div>
                              </div>
                              <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform"></div>
                              </div>
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">Notifications</div>
                                <div className="text-xs text-gray-500">Alertes et rappels</div>
                              </div>
                              <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                              </div>
                            </div>

                            {/* Sons */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">Sons</div>
                                <div className="text-xs text-gray-500">Effets sonores</div>
                              </div>
                              <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                              </div>
                            </div>

                            {/* Fond d'écran */}
                            <div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">Fond d'écran</div>
                                  <div className="text-xs text-gray-500">
                                    {BACKGROUND_OPTIONS.find(bg => bg.id === selectedBackground)?.name || 'Par défaut'}
                                  </div>
                                </div>
                                <button 
                                  onClick={() => setShowBackgroundOptions(!showBackgroundOptions)}
                                  className="text-sm text-blue-600 font-medium hover:text-blue-700"
                                >
                                  {showBackgroundOptions ? 'Fermer' : 'Choisir'}
                                </button>
                              </div>

                              {/* Options de fond d'écran */}
                              <AnimatePresence>
                                {showBackgroundOptions && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-3 space-y-2 overflow-hidden"
                                  >
                                    {BACKGROUND_OPTIONS.map((bg) => (
                                      <motion.button
                                        key={bg.id}
                                        onClick={() => {
                                          setSelectedBackground(bg.id);
                                          setShowBackgroundOptions(false);
                                        }}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                          selectedBackground === bg.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <div className="text-sm font-medium text-gray-900">{bg.name}</div>
                                            <div className="text-xs text-gray-500">{bg.description}</div>
                                          </div>
                                          {selectedBackground === bg.id && (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                              <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                          )}
                                        </div>
                                      </motion.button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Langue */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">Langue</div>
                                <div className="text-xs text-gray-500">Français</div>
                              </div>
                              <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                                Modifier
                              </button>
                            </div>

                            {/* Visite guidée */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                  <HelpCircle size={14} />
                                  Visite guidée
                                </div>
                                <div className="text-xs text-gray-500">Découvrir la plateforme</div>
                              </div>
                              <button 
                                onClick={() => {
                                  setShowSettings(false);
                                  onboardingTour.startTour();
                                }}
                                className="text-sm text-blue-600 font-medium hover:text-blue-700"
                              >
                                Démarrer
                              </button>
                            </div>

                            {/* Vérification d'identité */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                  <Shield size={14} />
                                  Sécurité du compte
                                </div>
                                <div className="text-xs text-gray-500">Vérifiez votre identité en 2 minutes</div>
                              </div>
                              <button 
                                onClick={handleTriggerIdentityVerification}
                                className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
                              >
                                Sécuriser
                              </button>
                            </div>

                            {/* Rapports Parents */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                  <FileText size={14} />
                                  Rapports Parents
                                </div>
                                <div className="text-xs text-gray-500">Résumés hebdomadaires optionnels</div>
                              </div>
                              <button 
                                onClick={() => {
                                  setShowSettings(false);
                                  setShowParentReportsSettings(true);
                                }}
                                className="text-sm text-blue-600 font-medium hover:text-blue-700"
                              >
                                Configurer
                              </button>
                            </div>

                            {/* Aide */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">Centre d'aide</div>
                                <div className="text-xs text-gray-500">FAQ et support</div>
                              </div>
                              <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                                Ouvrir
                              </button>
                            </div>
                          </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => {
                              if (onLogout) {
                                setShowSettings(false);
                                onLogout();
                              }
                            }}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Se déconnecter
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>


      <div className="flex">
        {/* Sidebar simplifiée pour desktop - fixée sous le header */}
        <nav className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col fixed left-0 top-[85px] h-[calc(100vh-85px)] z-30">
          <div className="p-6">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isDisabled = !item.hasAccess;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    data-tour={item.id}
                    onClick={() => {
                      if (item.hasAccess) {
                        setActiveSection(item.id);
                      } else if (item.isPremium) {
                        // Afficher le message d'accès premium
                        alert(plannerState.plannerAccess.accessMessage);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all relative group ${
                      isActive
                        ? 'bg-black text-white' 
                        : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${isDisabled ? 'opacity-60' : ''}`}
                    disabled={isDisabled && !item.isPremium}
                  >
                    <div className="relative">
                      <IconComponent size={20} />
                      {/* Badge de notification */}
                      {item.hasNotification && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Icône premium pour planification */}
                    {item.isPremium && (
                      <div className="ml-auto flex items-center gap-1">
                        {!item.hasAccess && (
                          <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z"/>
                            </svg>
                          </div>
                        )}
                        {item.hasAccess && (
                          <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Tooltip d'information */}
                    {item.isPremium && !item.hasAccess && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                        Fonctionnalité premium
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-900 border-y-4 border-y-transparent"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </nav>

        {/* Contenu principal bord à bord avec marge pour sidebar fixe */}
        <main className="flex-1 md:ml-64 pt-0 pb-16 md:pb-0">
          {(activeSection === 'planning' || forceShowPlanner) ? (
            <StrategicPlanner
              plannerAccess={plannerState.plannerAccess}
              onGeneratePlan={handleGeneratePlan}
              onWhatsAppContact={handlePlannerWhatsApp}
              onUpgrade={handlePlannerUpgrade}
              onRestartOnboarding={handleRestartOnboarding}
              buddy={buddy}
              onAddBuddy={handleAddBuddy}
              onUpdateBuddy={handleUpdateBuddy}
              onRemoveBuddy={handleRemoveBuddy}
              onSendBuddyNotification={handleSendBuddyNotification}
              favoriteCourses={primaryCourses.filter(course => course.isPrimary).map(course => ({
                id: course.id,
                title: course.title,
                examDate: course.examDate,
                progress: course.progress
              }))}
              focusedCourse={focusedCourseForPlanning}
              onNavigateToCourse={handleNavigateToCourse}
            />
          ) : activeSection === 'community' ? (
            <Community />
          ) : activeSection === 'unlock' ? (
            <div className="p-8">
              <PurchaseSystem
                data={data}
                userBalance={(user?.wallet || data.user?.wallet)?.balance || 150}
                onBalanceChange={(newBalance) => {
                  // Mettre à jour le solde du portefeuille
                  if (props.onUpdateUser) {
                    const currentWallet = user?.wallet || data.user?.wallet;
                    if (currentWallet) {
                      const updatedUser = {
                        ...data.user,
                        wallet: {
                          ...currentWallet,
                          balance: newBalance,
                          lastActivity: new Date()
                        }
                      };
                      props.onUpdateUser(updatedUser);
                    }
                  }
                }}
                onCourseUnlock={handleUnlockCourse}
                onPackUnlock={handleUnlockPack}
                ownedCourses={unlockedCourses}
                ownedPacks={unlockedPacks}
                onOpenCourseViewer={(courseId) => {
                  // Créer un cours mock basé sur l'ID pour l'IntegratedCourseViewer
                  const mockCourse = createMockCourseFromId(courseId);
                  if (mockCourse) {
                    setSelectedCourse(mockCourse);
                    setShowIntegratedViewer(true);
                  }
                }}
              />
            </div>
          ) : activeSection === 'courses' ? (
            <div className="p-8">
              {/* Message d'accueil motivant */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Salut {data.user.name.split(' ')[0]} ! {
                    averageProgress >= 75 ? '🌟 Tu es sur une lancée incroyable !' : 
                    averageProgress >= 50 ? '🔥 Ta détermination paye vraiment !' : 
                    averageProgress > 0 ? '💪 Chaque effort compte, tu progresses !' : 
                    '🚀 Prêt à conquérir de nouveaux savoirs ?'
                  }
                </h2>
                <p className="text-gray-600">
                  {averageProgress >= 75 ? 'Tu es en train de devenir un expert ! Continue sur cette voie exceptionnelle.' : 
                   averageProgress >= 50 ? 'Tes efforts se transforment en compétences solides. Tu peux être fier de toi !' : 
                   averageProgress > 0 ? 'Chaque session d\'étude te rapproche de tes objectifs. Garde cette motivation !' : 
                   'L\'aventure commence maintenant. Chaque grand parcours débute par un premier pas !'}
                </p>
              </div>

            {/* Métriques simplifiées */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
              <SimpleMetric
                icon={BookOpen}
                value={primaryCourses.length}
                label="Cours actifs"
                accent={true}
              />
              <SimpleMetric
                icon={TrendingUp}
                value={bestRanking ? `#${bestRanking}` : 'N/A'}
                label="Classement"
              />
              <SimpleMetric
                icon={Clock}
                value={`${Math.round(totalHours)}h`}
                label="Temps d'étude"
              />
              <SimpleMetric
                icon={Target}
                value={`${averageProgress}%`}
                label="Progression"
              />
            </div>

            {/* Section Profil Personnalisé - MASQUÉ TEMPORAIREMENT */}
            {false && (
              <section className="mb-16">
                <PersonalProfileSection 
                  personalProfile={personalProfile}
                  onCourseClick={(courseId) => {
                    const course = [...primaryCourses, ...data.suggestedCourses.map(s => s.course)].find(c => c.id === courseId);
                    if (course) {
                      handleOpenIntegratedViewer(course);
                    }
                  }}
                />
              </section>
            )}

            {/* Section Mes Cours Favoris - Nouvelle organisation par pack */}
            <section className="mb-16" data-tour="mes-cours">
              <FavoritesPackCollection
                favoriteCourses={primaryCourses}
                onToggleFavorite={handleToggleFavorite}
                onPreview={handlePreviewCourse}
                onEnroll={handleUnlockCourse}
                onOpenCourse={handleOpenCourse}
                onOpenStaircaseView={handleOpenStaircaseView}
                progressData={data.progress}
                getStudyRoomProps={getStudyRoomProps}
                onCompletePack={handleCompletePack}
                purchasedItems={purchasedItems}
              />
            </section>

            {/* Section Cours Suggérés */}
            <section>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSuggestedExpanded(!suggestedExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-gray-600" />
                    </div>
                    <div data-tour="faculty-courses">
                      <h2 className="text-lg font-bold text-gray-900">
                        Les étudiants de votre faculté suivent également les cours suivants
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Basé sur {data.facultyStats.totalStudents} étudiants de {data.user.faculty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {data.suggestedCourses.length} suggestions
                    </span>
                    {suggestedExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {suggestedExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 pt-6">
                      {data.suggestedCourses
                        .filter(suggestion => !favorites.includes(suggestion.course.id)) // Filtrer les cours déjà favoris
                        .map((suggestion, index) => (
                        <motion.div
                          key={suggestion.course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="mt-3"
                        >
                          <SuggestedCourseCard
                            course={suggestion.course}
                            enrolledStudents={suggestion.enrolledStudents}
                            reason={suggestion.reason}
                            onUnlock={handleDirectCourseUnlock}
                            onPreview={handlePreviewCourse}
                            onToggleFavorite={handleToggleFavorite}
                            onClick={(courseId) => {
                              const course = data.suggestedCourses.find(s => s.course.id === courseId)?.course;
                              if (course) {
                                handleOpenIntegratedViewer(course);
                              }
                            }}
                            canAfford={true}
                            isUnlocked={unlockedCourses.includes(suggestion.course.id)}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Explorer tout le catalogue */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 text-center border border-gray-200"
                    >
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-2xl">👉</span>
                        <h3 className="text-xl font-bold text-gray-900">
                          Explorer tout le catalogue
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Découvrez tous nos cours, packs et offres spéciales. Plus de choix, plus d'opportunités d'apprentissage.
                      </p>
                      <button
                        onClick={() => setActiveSection('unlock')}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-xl font-medium hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl group"
                      >
                        <Brain size={20} />
                        <span>Accéder au catalogue complet</span>
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="group-hover:animate-pulse"
                        >
                          →
                        </motion.div>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
            
              {/* Footer moderne */}
              <ModernFooter />
            </div>
          ) : (
            <div className="p-6">
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Section en développement</h2>
                <p className="text-gray-600">Cette section sera bientôt disponible !</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Sidebar mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Brain size={20} />
                    <span className="font-bold">Science Made Simple</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isDisabled = !item.hasAccess;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.hasAccess) {
                            setActiveSection(item.id);
                            setSidebarOpen(false); // Fermer la sidebar mobile
                          } else if (item.isPremium) {
                            alert(plannerState.plannerAccess.accessMessage);
                          }
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all relative ${
                          isActive
                            ? 'bg-black text-white' 
                            : isDisabled
                            ? 'text-gray-400 cursor-not-allowed opacity-60'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        disabled={isDisabled && !item.isPremium}
                      >
                        <div className="relative">
                          <IconComponent size={20} />
                          {/* Badge de notification mobile */}
                          {item.hasNotification && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <span className="font-medium">{item.label}</span>
                        
                        {/* Icône premium pour mobile */}
                        {item.isPremium && (
                          <div className="ml-auto">
                            {!item.hasAccess && (
                              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z"/>
                                </svg>
                              </div>
                            )}
                            {item.hasAccess && (
                              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}

      <PreviewModal
        course={previewCourse}
        isOpen={previewModalOpen}
        onClose={handleClosePreviewModal}
        onEnroll={onEnrollCourse}
        onNavigateToUnlock={() => {
          handleClosePreviewModal();
          setActiveSection('unlock');
        }}
        onShowUpsell={(courseId) => {
          handleClosePreviewModal();
          const course = data.suggestedCourses.find(c => c.course.id === courseId)?.course;
          if (course) {
            setSelectedLessonForPurchase({ id: courseId, title: course.title });
            setShowPurchaseUpsell(true);
          }
        }}
        onNavigateToCourse={(courseId) => {
          handleClosePreviewModal();
          const course = data.suggestedCourses.find(c => c.course.id === courseId)?.course;
          if (course) {
            setSelectedCourse(course);
            setShowIntegratedViewer(true);
          }
        }}
      />

      {/* Modale du système de crédits */}
      <CreditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        credits={credits}
        movements={movements}
        suggestions={getSuggestions()}
      />

      {/* Modale de l'historique des crédits */}
      {showCreditModal && (
        <CreditModal
          isOpen={showCreditModal}
          credits={credits}
          movements={movements}
          suggestions={getSuggestions()}
          onClose={() => setShowCreditModal(false)}
        />
      )}

      {/* Modale des packs de crédits */}
      {showCreditPacks && (
        <CreditPacks
          onClose={() => setShowCreditPacks(false)}
          onPurchase={handlePurchasePack}
        />
      )}

      {/* Checkout premium */}
      {showCheckout && checkoutItem && (
        <PremiumCheckout
          item={checkoutItem}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleConfirmPurchase}
        />
      )}

      {/* Notification crédits faibles */}
      {showLowCreditWarning && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-2xl max-w-sm z-50"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">🧠</div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-2">Capital cognitif faible !</h4>
              <p className="text-sm text-white/90 mb-4">
                Ton capital cognitif diminue 🧠. Recharge-le pour continuer ton parcours en toute sérénité.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowLowCreditWarning(false);
                    setShowCreditPacks(true);
                  }}
                  className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Recharger
                </button>
                <button
                  onClick={() => setShowLowCreditWarning(false)}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                >
                  Plus tard
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowLowCreditWarning(false)}
              className="text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Notification de succès */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl max-w-md z-50"
        >
          <div className="flex items-start gap-4">
            <div className="text-2xl">🎉</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Anciens viewers supprimés - maintenant gérés au niveau principal */}

      {/* SmartCourseComparison pour les recommandations */}
      {selectedCourseForComparison && (
        <SmartCourseComparison
          isVisible={showCourseComparison}
          onClose={handleCloseCourseComparison}
          selectedCourse={selectedCourseForComparison}
          recommendedPack={getCourseRecommendations(selectedCourseForComparison).recommendedPack}
          alternativePack={getCourseRecommendations(selectedCourseForComparison).alternativePack}
          onSelectCourse={handleSelectCourseFromComparison}
          onSelectPack={handleSelectPackFromComparison}
          canAffordCourse={canAfford(selectedCourseForComparison.creditCost || 1)}
          canAffordPack={canAfford(getCourseRecommendations(selectedCourseForComparison).recommendedPack.creditCost)}
          canAffordAlternative={getCourseRecommendations(selectedCourseForComparison).alternativePack ? canAfford(getCourseRecommendations(selectedCourseForComparison).alternativePack!.creditCost) : false}
        />
      )}

          </div>
        </div>
      )}

      {/* Modales du portefeuille */}
      {showWalletTopUp && (user?.wallet || data.user?.wallet) && (
        <WalletTopUp
          currentBalance={(user?.wallet || data.user?.wallet)?.balance || 0}
          onTopUp={handleWalletTopUp}
          onCancel={() => setShowWalletTopUp(false)}
        />
      )}

      {/* Modal de vérification d'identité */}
      {showIdentityVerification && (
        <IdentityVerificationModal
          isOpen={showIdentityVerification}
          onClose={() => setShowIdentityVerification(false)}
          onUploadComplete={handleIdentityUpload}
        />
      )}

      {showPurchaseUpsell && selectedLessonForPurchase && (
        <PurchaseUpsellModal
          isOpen={showPurchaseUpsell}
          onClose={() => setShowPurchaseUpsell(false)}
          purchaseOptions={
            selectedLessonForPurchase.id.startsWith('pack-') 
              ? generatePackOnlyUpsellOptions(selectedLessonForPurchase.id)
              : generateUpsellOptions(selectedLessonForPurchase.id)
          }
          onPurchase={handleLessonPurchase}
        />
      )}

      {/* Modal Study Room */}
      <StudyRoomModal
        isOpen={showStudyRoomModal}
        onClose={handleCloseStudyRoom}
        room={selectedStudyRoom}
        currentUserId={user?.id || '1'}
      />

      {/* Modal Onboarding Planificateur */}
      <PlannerOnboardingModal
        isOpen={showPlannerOnboarding}
        onClose={() => setShowPlannerOnboarding(false)}
        onStartPlanning={handleStartPlannerFromOnboarding}
        onPostpone={handlePostponePlanner}
        courseName={onboardingCourseName}
      />


      {/* Tour guidé d'onboarding */}
      <OnboardingSpotlight
        isActive={onboardingTour.isTourActive}
        onComplete={onboardingTour.completeTour}
        onSkip={onboardingTour.skipTour}
        userName={user?.name || data.user?.name}
      />

      {/* Onboarding Buddy System */}
      <BuddyOnboarding
        userId={user?.id || data.user?.id || 'current-user'}
        userName={user?.name || data.user?.name || 'Étudiant'}
        isOpen={showBuddyOnboarding}
        onClose={() => setShowBuddyOnboarding(false)}
        onComplete={() => {
          setShowBuddyOnboarding(false);
          console.log('🎉 Buddy Onboarding terminé ! Réseau d\'étude activé.');
        }}
      />

      {/* Configuration Rapports Parents */}
      <ParentReportsSettings
        userId={user?.id || data.user?.id || 'current-user'}
        userName={user?.name || data.user?.name || 'Étudiant'}
        isOpen={showParentReportsSettings}
        onClose={() => setShowParentReportsSettings(false)}
      />

      {/* Navigation mobile en bas */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2 px-2 safe-bottom">
          {navigationItems.slice(0, 3).map((item) => {
            const IconComponent = item.icon;
            const isDisabled = !item.hasAccess;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                data-tour={`mobile-${item.id}`}
                onClick={() => {
                  if (item.hasAccess) {
                    setActiveSection(item.id);
                  } else if (item.isPremium) {
                    alert(plannerState.plannerAccess.accessMessage);
                  }
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all relative min-w-0 flex-1 ${
                  isActive
                    ? 'text-blue-600' 
                    : isDisabled
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
                disabled={isDisabled && !item.isPremium}
              >
                <div className="relative mb-1">
                  <IconComponent size={20} />
                  {item.hasNotification && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                  {item.isPremium && !item.hasAccess && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
          
          {/* Bouton Plus pour accéder aux autres fonctionnalités */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex flex-col items-center justify-center p-2 rounded-lg transition-all relative min-w-0 flex-1 text-gray-600"
          >
            <div className="relative mb-1">
              <MoreHorizontal size={20} />
            </div>
            <span className="text-xs font-medium truncate max-w-full">
              Plus
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
