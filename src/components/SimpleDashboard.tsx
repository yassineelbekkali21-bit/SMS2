'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import TargetCursor from './TargetCursor';
import BlurText from './BlurText';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Target, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  Menu, 
  X,
  Search,
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
  Lock,
  Sparkles,
  HelpCircle,
  MoreHorizontal,
  FileText,
  Shield,
  Flame,
  UserCheck,
  Zap,
  Video,
  Calculator,
  CheckCircle,
  Gift,
  Check
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
import { WalletService } from '@/lib/wallet-service';
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
import { DirectMessaging } from './DirectMessaging';
import { AdvancedStudyRoomsTab } from './AdvancedStudyRoomsTab';
import { getCourseRecommendations } from '@/lib/smart-recommendations';
import { PremiumCheckout } from './PremiumCheckout';
import { CourseStaircaseView } from './CourseStaircaseView';
import { IntegratedCourseViewer } from './IntegratedCourseViewer';
import { Course, Lesson, StudentProgress, CourseSuggestion, DashboardData, PurchaseOption, CourseStudyRoom, BuddySystem } from '@/types';
import { PersonalProfileSection } from './PersonalProfileSection';
import { getPersonalProfile, generateUpsellOptions, getMockCourseStudyRooms, getMockStudyRoomNotifications, getCoursePacks, getLessonsByCourseId, generateMockLessons, mockDashboardData } from '@/lib/mock-data';
import { ProgressionBonusService } from '@/lib/progression-bonus-service';
import { StudyRoomButton } from './StudyRoomButton';
import { TrendBadgeComponent } from './TrendBadge';
import { NetflixCatalogSection } from './NetflixCatalogSection';
import { smartSortFacultyCourses, CourseWithTrend } from '@/lib/faculty-sorting';
import { FilterBar } from './FilterBar';
import { OnboardingPopup } from './OnboardingPopup';
import { 
  FilterState, 
  SubjectFilter,
  filterAndSortCourses, 
  getFilterCounts 
} from '@/lib/course-filtering';
import { StudyRoomModal } from './StudyRoomModal';
import { StrategicPlannerCompact } from './StrategicPlannerCompact';
import { PlannerOnboardingModal } from './PlannerOnboardingModal';
import { useStudyRoomState } from '@/lib/studyroom-service';
import { usePlannerState } from '@/lib/planner-service';
import { UnifiedSocialWidget } from './UnifiedSocialWidget';
import SocialFeedIcon from './SocialFeedIcon';
import SocialFeedPanel from './SocialFeedPanel';
import { XPHeaderWidget } from './XPHeaderWidget';
import { XPService, UserXPProfile, XPAction, Badge, XPLevel } from '@/lib/xp-service';
import XPWidget from './XPWidget';
import XPFeedback from './XPFeedback';
import { AdvancedStudyRoomService } from '@/lib/advanced-studyroom-service';
import XPTestPanel from './XPTestPanel';
import { GamifiedProfile } from './GamifiedProfile';
import { XPBoostEvent } from './XPBoostEvent';
import { SocialFeedService } from '@/lib/social-feed-service';
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

// Composant de métrique style MasterClass - Light Mode
const SimpleMetric = ({ 
  icon: Icon, 
  value, 
  label, 
  accent = false,
}: { 
  icon: any;
  value: string | number;
  label: string;
  accent?: boolean;
  animated?: boolean;
  animationType?: 'glow' | 'flame' | 'pulse' | 'none';
  subtitle?: string;
}) => (
  <div 
    className={`py-5 px-6 rounded-2xl border ${
      accent 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}
  >
    <div className="flex items-center gap-4">
      <div 
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          accent ? 'bg-white/10' : 'bg-gray-100'
        }`}
      >
        <Icon size={18} className={accent ? 'text-white' : 'text-gray-500'} />
      </div>
      <div>
        <div className={`text-xl font-bold ${accent ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </div>
        <div className={`text-sm ${accent ? 'text-gray-400' : 'text-gray-500'}`}>
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
                href="https://wa.me/32477025622" 
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
    },
    'course-math-analyse-1': {
      id: 'course-math-analyse-1',
      title: 'Analyse Mathématique I',
      description: 'Bases de l\'analyse : dérivées, limites et continuité',
      faculty: 'Solvay Brussels School',
      year: '2024-2025',
      difficulty: 'intermediate',
      duration: '180 min',
      totalLessons: 6,
      completedLessons: 0,
      progress: 0,
      isOwned: false,
      isPrimary: false
    },
    'course-chimie-generale': {
      id: 'course-chimie-generale',
      title: 'Chimie Générale',
      description: 'Concepts fondamentaux de la chimie moderne et applications',
      faculty: 'Solvay Brussels School',
      year: '2024-2025',
      difficulty: 'intermediate',
      duration: '140 min',
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
    lessons: generateMockLessons(courseData.id!, courseData.title!), // Générer les leçons
    previewAvailable: true,
    tags: [courseData.difficulty === 'intermediate' ? 'Physique' : 
           courseData.difficulty === 'advanced' ? 'Mathématiques' : 'Chimie'],
    packId: courseId === 'course-equilibres' ? 'pack-electromagnetisme' : 
            courseId === 'course-gauss' ? 'pack-electromagnetisme' :
            courseId === 'course-forces' ? 'pack-electromagnetisme' :
            courseId === 'course-integrales' ? 'pack-mathematiques' :
            courseId === 'course-math-analyse-1' ? 'pack-mathematiques' :
            courseId === 'course-physique-mecanique' ? 'pack-sciences' :
            courseId === 'course-chimie-generale' ? 'pack-sciences' :
            courseId === 'course-franklin-dna' ? 'pack-biologie' : undefined
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
  
  // Vérification et valeurs par défaut pour data - utiliser mockDashboardData si non fourni
  const safeData = data || mockDashboardData;
  
  const [primaryCourses, setPrimaryCourses] = useState(safeData.primaryCourses || []);
  const [suggestedExpanded, setSuggestedExpanded] = useState(true);

  // 🎨 État pour la densité adaptative (Option 1 + 4)
  const [isScrolledCompact, setIsScrolledCompact] = useState(false);

  // 🔽 Détection du scroll pour mode compact
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolledCompact(scrollY > 300); // Compacter après 300px de scroll
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // État des filtres pour la section faculté
  const [facultyFilters, setFacultyFilters] = useState<FilterState>({
    subjects: ['all'],
    trends: [],
    social: [],
    sortBy: 'students',
    sortOrder: 'desc'
  });
  
  // État pour le topic sélectionné (deuxième ligne de filtres)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // États du composant
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseViewerOpen, setCourseViewerOpen] = useState(false);
  const [useGamifiedViewer, setUseGamifiedViewer] = useState(true); // Nouveau viewer par défaut
  const [showStaircaseView, setShowStaircaseView] = useState(false);
  const [showIntegratedViewer, setShowIntegratedViewer] = useState(false);
  
  // État du fil social
  const [showSocialFeed, setShowSocialFeed] = useState(false);
  const [socialFeedInitialTab, setSocialFeedInitialTab] = useState<'now' | 'buddies' | 'for-you' | 'competitions' | 'progression'>('now');
  const [communityInitialTab, setCommunityInitialTab] = useState<'overview' | 'buddies' | 'circles' | 'qa' | 'competitions' | 'badges'>('overview');

  // État pour la messagerie
  const [messagingContactId, setMessagingContactId] = useState<string | undefined>(undefined);

  // 🎯 État pour l'onboarding popup (première visite)
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingInitialPhase, setOnboardingInitialPhase] = useState<'loading' | 'results' | 'membership-intro' | 'membership-plans'>('loading');

  // 🎯 États pour le système XP et gamification
  const [userXPProfile, setUserXPProfile] = useState<UserXPProfile | null>(null);
  const [showGamifiedProfile, setShowGamifiedProfile] = useState(false);
  const [showCompetitions, setShowCompetitions] = useState(false);
  const [showXPBoost, setShowXPBoost] = useState(true);
  const [xpFeedback, setXpFeedback] = useState<{
    show: boolean;
    xpGained: number;
    action: XPAction;
    newLevel?: XPLevel;
    newBadges?: Badge[];
  } | null>(null);
  const xpService = XPService.getInstance();
  
  // Démarrer la simulation des activités sociales (démo uniquement)
  useEffect(() => {
    const socialFeedService = SocialFeedService.getInstance();
    socialFeedService.startBuddySimulation();
    socialFeedService.startFounderSessionSimulation(); // Nouvelle simulation
  }, []); // Une seule fois au montage

  // 🎯 Vérifier si c'est la première visite pour afficher l'onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('sms_onboarding_completed');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // 🎯 Handler pour fermer l'onboarding
  const handleOnboardingComplete = () => {
    localStorage.setItem('sms_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  // 🎯 Initialiser le profil XP
  useEffect(() => {
    const profile = xpService.getUserXPProfile();
    setUserXPProfile(profile);
    
    // Mettre à jour la série quotidienne
    const { streakUpdated, xpGained } = xpService.updateDailyStreak();
    if (streakUpdated && xpGained > 0) {
      setUserXPProfile(xpService.getUserXPProfile());
    }
  }, []);

  // 🏢 Régénérer les Study Rooms pour tous les packs (une seule fois)
  useEffect(() => {
    const STUDYROOMS_VERSION = 'v5_no_duplicates'; // Changer cette version pour forcer une régénération
    const lastVersion = localStorage.getItem('studyrooms_version');
    
    if (lastVersion !== STUDYROOMS_VERSION) {
      console.log('🔄 Régénération des Study Rooms avec sessions Compléments de Zak...');
      const rooms = AdvancedStudyRoomService.refreshStudyRooms();
      localStorage.setItem('studyrooms_version', STUDYROOMS_VERSION);
      console.log(`✅ ${rooms.length} Study Rooms créées automatiquement (dont ${rooms.filter(r => r.isComplement).length} sessions Compléments)`);
      
      // Debug: afficher les détails
      AdvancedStudyRoomService.debugLog();
    }
  }, []);

  // 🎯 Fonction pour ajouter de l'XP avec feedback visuel
  const handleXPGain = (actionType: string, multiplier: number = 1, context?: string) => {
    const result = xpService.addXP(actionType, multiplier, context);
    
    if (result.xpGained > 0) {
      setUserXPProfile(result.profile);
      
      // Afficher le feedback XP
      setXpFeedback({
        show: true,
        xpGained: result.xpGained,
        action: {
          id: `${actionType}-${Date.now()}`,
          type: actionType as any,
          points: result.xpGained,
          title: result.profile.recentActions[0]?.title || 'Action complétée',
          description: result.profile.recentActions[0]?.description || '',
          emoji: result.profile.recentActions[0]?.emoji || '🎯'
        },
        newLevel: result.newLevel,
        newBadges: result.newBadges
      });
    }
    
    return result;
  };
  
  // État des leçons synchronisé avec les achats
  const [courseLessons, setCourseLessons] = useState<{[courseId: string]: Lesson[]}>({});

  // Initialiser primaryCourses seulement au premier rendu
  useEffect(() => {
    if (primaryCourses.length === 0) {
      setPrimaryCourses(safeData.primaryCourses || []);
    }
  }, [safeData.primaryCourses]);

  // Synchroniser les favoris avec primaryCourses
  useEffect(() => {
    console.log('🔄 SYNC: Synchronisation favoris déclenchée', { 
      favorites, 
      primaryCoursesCount: primaryCourses.length 
    });
    
    // Nettoyer les favoris incohérents (cours qui ne devraient pas être favoris par défaut)
    const invalidFavorites = favorites.filter(favoriteId => {
      const course = safeData.primaryCourses.find(c => c.id === favoriteId);
      
      // Supprimer seulement si : cours trouvé mais pas primaire ET cours était marqué comme favori par défaut
      // (Ne pas supprimer les favoris ajoutés manuellement par l'utilisateur)
      return course && !course.isPrimary && course.isOwned === true;
    });
    
    if (invalidFavorites.length > 0) {
      console.log('🧹 SYNC: Nettoyage favoris incohérents:', invalidFavorites);
      invalidFavorites.forEach(courseId => {
        const course = safeData.primaryCourses.find(c => c.id === courseId);
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
      ...safeData.primaryCourses,
      ...safeData.suggestedCourses.map(s => s.course)
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
  const [showPackCompletionModal, setShowPackCompletionModal] = useState(false);
  const [completedPackInfo, setCompletedPackInfo] = useState<{packId: string, packTitle: string} | null>(null);
  const [pendingPackCelebration, setPendingPackCelebration] = useState<{packId: string, packTitle: string} | null>(null);
  const [showPurchaseUpsell, setShowPurchaseUpsell] = useState(false);
  const [showIdentityVerification, setShowIdentityVerification] = useState(false);
  
  // États Study Rooms
  const [activeStudyRooms, setActiveStudyRooms] = useState<CourseStudyRoom[]>([]);
  const [studyRoomNotifications, setStudyRoomNotifications] = useState<any[]>([]);
  const [showStudyRoomModal, setShowStudyRoomModal] = useState(false);
  const [selectedStudyRoom, setSelectedStudyRoom] = useState<CourseStudyRoom | null>(null);
  const [selectedLessonForPurchase, setSelectedLessonForPurchase] = useState<any>(null);
  // Utiliser les purchasedItems du localStorage ou un Set vide par défaut
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('purchasedItems');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    }
    return new Set();
  });
  
  // 🔍 DEBUG: Vérifier purchasedItems après achat
  console.log('🔍 PURCHASED ITEMS:', Array.from(purchasedItems));
  console.log('🔍 PURCHASED ITEMS DETAILS:', purchasedItems);

  // Écouter les changements du localStorage pour purchasedItems
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('purchasedItems');
      if (stored) {
        const parsedItems = JSON.parse(stored) as string[];
        const newPurchasedItems = new Set(parsedItems);
        setPurchasedItems(newPurchasedItems);
        console.log('🔄 PURCHASED ITEMS: Mise à jour depuis localStorage:', Array.from(newPurchasedItems));
      }
    };

    // Écouter les événements de storage
    window.addEventListener('storage', handleStorageChange);
    
    // Écouter les événements personnalisés pour les changements locaux
    window.addEventListener('purchasedItemsChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('purchasedItemsChanged', handleStorageChange);
    };
  }, []);

  // Synchroniser unlockedCourses avec purchasedItems
  useEffect(() => {
    const unlocked: string[] = [];
    
    Array.from(purchasedItems).forEach(item => {
      if (typeof item === 'string') {
        // Pack acheté : débloquer tous les cours du pack
        if (item.startsWith('pack-')) {
          const pack = getCoursePacks().find(p => p.id === item);
          if (pack) {
            unlocked.push(...pack.courses);
          }
        }
        // Cours acheté directement
        else if (item.startsWith('course-')) {
          unlocked.push(item);
        }
      }
    });
    
    // Supprimer les doublons
    const uniqueUnlocked = [...new Set(unlocked)];
    console.log('🔓 UNLOCKED COURSES: Synchronisation avec purchasedItems:', uniqueUnlocked);
    setUnlockedCourses(uniqueUnlocked);
  }, [purchasedItems]);

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
    [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)],
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
    [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)],
    Array.from(purchasedItems),
    user?.id || '1',
    plannerConfigured,
    plannerPostponed
  );

  // État du Buddy System
  const [buddy, setBuddy] = useState<BuddySystem | null>(null);
  
  // État pour forcer la mise à jour du header après un achat
  const [walletUpdateTrigger, setWalletUpdateTrigger] = useState(0);
  
  // État de l'onboarding du planificateur
  const [showPlannerOnboarding, setShowPlannerOnboarding] = useState(false);
  const [onboardingCourseName, setOnboardingCourseName] = useState<string>();
  const [focusedCourseForPlanning, setFocusedCourseForPlanning] = useState<Course | null>(null);
  const [forceShowPlanner, setForceShowPlanner] = useState(false);

  // Fonction pour déclencher l'onboarding du planificateur (OBLIGATOIRE à chaque déblocage)
  const triggerPlannerOnboarding = (courseName: string, courseId?: string) => {
    console.log('🎯 ONBOARDING: Déclenchement planification pour', courseName);
    console.log('🎯 ONBOARDING: pendingPackCelebration:', pendingPackCelebration);
    
    // Trouver le cours concerné pour la planification cumulative
    if (courseId) {
      const course = [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)]
        .find(c => c.id === courseId);
      if (course) {
        setFocusedCourseForPlanning(course);
        console.log('🎯 ONBOARDING: Cours ciblé pour planification:', course.title);
      }
    }
    
    // Vérifier s'il y a une célébration de pack en attente
    if (pendingPackCelebration) {
      console.log('🎉 PACK COMPLETION: Célébration en attente détectée, déclenchement avant planification');
      console.log('🎉 PACK COMPLETION: Célébration pour:', pendingPackCelebration.packTitle, 'ID:', pendingPackCelebration.packId);
      console.log('🎉 PACK COMPLETION: courseName actuel:', courseName);
      // Déclencher d'abord la célébration
      setCompletedPackInfo(pendingPackCelebration);
      setShowPackCompletionModal(true);
      console.log('🎉 PACK COMPLETION: Modal de célébration ouverte, showPackCompletionModal:', true);
      // Nettoyer la célébration en attente
      setPendingPackCelebration(null);
      
      // Programmer la planification pour après la célébration
      setTimeout(() => {
        console.log('🎯 ONBOARDING: Exécution du déclenchement OBLIGATOIRE pour', courseName, '(après célébration)');
        setOnboardingCourseName(courseName);
        setShowPlannerOnboarding(true);
        console.log('🎯 ONBOARDING: États mis à jour - courseName:', courseName, 'show:', true);
      }, 1000); // Délai plus long pour laisser le temps à l'utilisateur de voir la célébration
    } else {
      // ⚠️ TOUJOURS déclencher l'onboarding lors d'un déblocage de cours complet
      // C'est une étape systématique et incontournable du déblocage
      setTimeout(() => {
        console.log('🎯 ONBOARDING: Exécution du déclenchement OBLIGATOIRE pour', courseName);
        setOnboardingCourseName(courseName);
        setShowPlannerOnboarding(true);
        console.log('🎯 ONBOARDING: États mis à jour - courseName:', courseName, 'show:', true);
      }, 300);
    }
  };

  // Handler pour démarrer la planification depuis l'onboarding
  const handleStartPlannerFromOnboarding = () => {
    console.log('🎯 ONBOARDING: Utilisateur a choisi de planifier maintenant');
    console.log('🎯 ONBOARDING: activeSection actuel:', activeSection);
    console.log('🎯 ONBOARDING: onboardingCourseName:', onboardingCourseName);
    
    // Trouver le cours concerné pour pré-remplir ses informations
    const targetCourse = [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)]
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
  const onboardingTour = useOnboardingTour(user?.id || safeData.user?.id);
  
  // État pour le BuddyOnboarding
  const [showBuddyOnboarding, setShowBuddyOnboarding] = useState(false);
  
  // État pour les Rapports Parents
  const [showParentReportsSettings, setShowParentReportsSettings] = useState(false);
  const [showGuestPassModal, setShowGuestPassModal] = useState(false);
  const [guestPassEmails, setGuestPassEmails] = useState('');
  
  // Vérifier si l'utilisateur a terminé le buddy onboarding
  useEffect(() => {
    const userId = user?.id || safeData.user?.id;
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
  }, [onboardingTour.hasCompletedTour, user?.id, safeData.user?.id, showBuddyOnboarding]);

  // Tri intelligent des cours de la faculté - tous les cours du catalogue
  const smartSortedCourses = useMemo(() => {
    const coursesToSort = safeData.suggestedCourses
      .filter(suggestion => suggestion && suggestion.course && suggestion.course.id) // Filtrer les cours invalides
      .map(suggestion => suggestion.course); // Extraire les cours des suggestions
    
    console.log('🎯 SMART SORT: coursesToSort:', coursesToSort.map(c => ({ id: c.id, title: c.title })));
    
    return smartSortFacultyCourses(coursesToSort);
  }, [safeData.suggestedCourses]);

  // Filtrage et tri final des cours de la faculté
  const filteredFacultyCourses = useMemo(() => {
    return filterAndSortCourses(smartSortedCourses, facultyFilters);
  }, [smartSortedCourses, facultyFilters]);

  // Comptes pour les filtres
  const filterCounts = useMemo(() => {
    return getFilterCounts(smartSortedCourses);
  }, [smartSortedCourses]);


  // Handlers pour le portefeuille
  const handleWalletTopUp = (amount: number, bonus: number) => {
    const totalAdded = amount + bonus;
    
    const currentWallet = user?.wallet || safeData.user?.wallet;
    if (currentWallet && props.onUpdateUser) {
      const oldBalance = currentWallet.balance;
      const newBalance = oldBalance + totalAdded;
      
      const updatedUser = {
        ...(user || safeData.user),
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

  const checkPackCompletion = (option: PurchaseOption) => {
    console.log('🎯 PACK COMPLETION: Vérification de la complétion après achat', option.type, option.itemId);
    
    try {
      const packs = getCoursePacks();
      
      // Corriger la logique de création de l'ID d'achat
      let purchaseKey: string;
      if (option.type === 'lesson') {
        purchaseKey = option.itemId.startsWith('lesson-') ? option.itemId : `lesson-${option.itemId}`;
      } else {
        // Pour les packs et cours, utiliser directement l'itemId s'il contient déjà le préfixe
        purchaseKey = option.itemId.startsWith(option.type) ? option.itemId : `${option.type}-${option.itemId}`;
      }
      
      const updatedPurchasedItems = new Set([...Array.from(purchasedItems), purchaseKey]);
      console.log('🔍 PACK COMPLETION: purchaseKey créé:', purchaseKey);
      console.log('🔍 PACK COMPLETION: updatedPurchasedItems:', Array.from(updatedPurchasedItems));
      
      // Vérifier si c'est un achat de pack complet
      if (option.type === 'pack') {
        // Ne vérifier que le pack qui vient d'être acheté
        const purchasedPack = packs.find(pack => pack.id === option.itemId);
        
        if (purchasedPack) {
          console.log(`🎯 PACK COMPLETION: Vérification du pack acheté ${purchasedPack.id} (${purchasedPack.title})`);
          
          // Créer les cours avec leurs leçons pour ce pack
          const packCourses = purchasedPack.courses.map(courseId => {
            const courseData = createMockCourseFromId(courseId);
            return {
              ...courseData,
              lessons: generateMockLessons(courseId, courseData?.title || '')
            };
          });
          
          // Vérifier si le pack est maintenant complété
          const isCompleted = ProgressionBonusService.isPackCompleted(packCourses, updatedPurchasedItems, purchasedPack.id);
          
          if (isCompleted) {
            console.log(`🎉 PACK COMPLETION: Pack ${purchasedPack.id} complété !`);
            
            // Vérifier si un bonus n'a pas déjà été donné pour ce pack
            const bonusHistory = ProgressionBonusService.getUserProgressionBonusHistory(safeData.user?.id || 'user-default');
            const existingBonus = bonusHistory.bonuses.find(bonus => bonus.packId === purchasedPack.id);
            
            if (!existingBonus) {
              console.log(`🎁 PACK COMPLETION: Nouveau bonus de progression pour ${purchasedPack.title}`);
              
              // Créer le bonus de progression
              ProgressionBonusService.createProgressionBonus(
                safeData.user?.id || 'user-default',
                purchasedPack.id,
                purchasedPack.title,
                100 // 100€ de bonus
              );
              
              console.log(`💎 PACK COMPLETION: Bonus de progression de 100€ créé pour "${purchasedPack.title}" (sera utilisé lors de la prochaine recharge)`);
              
              // Programmer la célébration pour juste avant la planification - SEULEMENT pour le pack acheté
              setPendingPackCelebration({
                packId: purchasedPack.id,
                packTitle: purchasedPack.title
              });
              console.log(`🎉 PACK COMPLETION: Célébration programmée pour ${purchasedPack.title}`);
            } else {
              console.log(`🎁 PACK COMPLETION: Bonus déjà existant pour ${purchasedPack.title}`);
            }
          } else {
            console.log(`⏳ PACK COMPLETION: Pack ${purchasedPack.id} pas encore complété`);
          }
        }
      } else {
        // Pour les achats de cours/leçons individuels, vérifier tous les packs
        packs.forEach(pack => {
          console.log(`🎯 PACK COMPLETION: Vérification du pack ${pack.id} (${pack.title})`);
          
          // Créer les cours avec leurs leçons pour ce pack
          const packCourses = pack.courses.map(courseId => {
            const courseData = createMockCourseFromId(courseId);
            return {
              ...courseData,
              lessons: generateMockLessons(courseId, courseData?.title || '')
            };
          });
          
          // Vérifier si le pack est maintenant complété
          const isCompleted = ProgressionBonusService.isPackCompleted(packCourses, updatedPurchasedItems, pack.id);
          
          if (isCompleted) {
            console.log(`🎉 PACK COMPLETION: Pack ${pack.id} complété !`);
            
            // Vérifier si un bonus n'a pas déjà été donné pour ce pack
            const bonusHistory = ProgressionBonusService.getUserProgressionBonusHistory(safeData.user?.id || 'user-default');
            const existingBonus = bonusHistory.bonuses.find(bonus => bonus.packId === pack.id);
            
            if (!existingBonus) {
              console.log(`🎁 PACK COMPLETION: Nouveau bonus de progression pour ${pack.title}`);
              // Programmer la célébration pour juste avant la planification
              setPendingPackCelebration({
                packId: pack.id,
                packTitle: pack.title
              });
              console.log(`🎉 PACK COMPLETION: Célébration programmée pour ${pack.title}`);
            } else {
              console.log(`🎁 PACK COMPLETION: Bonus déjà existant pour ${pack.title}`);
            }
          } else {
            console.log(`⏳ PACK COMPLETION: Pack ${pack.id} pas encore complété`);
          }
        });
      }
    } catch (error) {
      console.error('❌ PACK COMPLETION: Erreur lors de la vérification:', error);
    }
  };

  const handleLessonPurchase = (option: PurchaseOption) => {
    console.log('🛒 ACHAT: Post-processing après achat', option.type, option.itemId);
    
    // Note: L'achat a déjà été traité par WalletService dans PurchaseUpsellModal
    // Cette fonction se contente de mettre à jour l'état local et déclencher la planification
    
    // 🎯 XP selon le type d'achat
    if (option.type === 'lesson') {
      handleXPGain('lesson_unlock', 1, option.itemId);
    } else if (option.type === 'course') {
      handleXPGain('course_complete', 1, option.itemId);
    } else if (option.type === 'pack') {
      handleXPGain('pack_complete', 1, option.itemId);
    }
    
    // 🔑 CRUCIAL: Informer le parent pour mettre à jour purchasedItems
    if (onPurchase) {
      onPurchase(option.type, option.itemId, option.price);
      console.log('🔑 PURCHASE: Informé le parent de l\'achat:', option.type, option.itemId);
    }

    // 💰 CRUCIAL: Forcer la mise à jour du header après l'achat
    setWalletUpdateTrigger(prev => prev + 1);
    console.log('💰 WALLET: Header forcé à se mettre à jour après achat');

    // Vérifier la complétion de pack AVANT de déclencher la planification
    checkPackCompletion(option);

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

    // 🪩 Ajouter une activité sociale personnelle
    const socialFeedService = SocialFeedService.getInstance();
    if (option.type === 'lesson' && selectedCourse) {
      socialFeedService.addPersonalAchievement(`as débloqué une nouvelle leçon en ${selectedCourse.title}`);
    } else if (option.type === 'course' && selectedCourse) {
      socialFeedService.addPersonalAchievement(`as complété le cours ${selectedCourse.title} !`);
    } else if (option.type === 'pack') {
      socialFeedService.addPersonalAchievement(`as complété un pack complet !`);
    }

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
        
        // 🔑 IMPORTANT: Sauvegarder aussi dans localStorage pour la cohérence
        const existingFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (!existingFavorites.includes(selectedCourse.id)) {
          const updatedFavorites = [...existingFavorites, selectedCourse.id];
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          console.log('💾 SYNC: Cours ajouté dans localStorage.favorites:', selectedCourse.id);
        }
        
        console.log('✅ SYNC: Cours parent ajouté aux favoris:', selectedCourse.title);
      }
      
    } else if (option.type === 'course') {
      // CAS 2: Déblocage cours complet → Toutes les leçons débloquées + cours en favori
      console.log('🔄 SYNC: Achat d\'un cours complet, mise à jour favoris');
      
      // Toujours chercher le cours par option.itemId pour éviter les confusions
      const purchasedCourse = [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)]
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
      const purchasedPack = packs.find((p: any) => p.id === option.itemId);
      
      if (purchasedPack && purchasedPack.courses) {
        console.log('🔄 SYNC: Pack trouvé:', purchasedPack.title, 'avec cours:', purchasedPack.courses);
        
        // Récupérer tous les cours du pack depuis les données
        const allCourses = [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)];
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
          
          const updatedCourses = [...newCourses, ...updatedExisting];
          
          // 🔄 SYNC: Mettre à jour localStorage pour useFavorites
          const favoriteIds = updatedCourses.filter(c => c.isPrimary).map(c => c.id);
          localStorage.setItem('favoriteCourses', JSON.stringify(favoriteIds));
          console.log('🔄 SYNC: localStorage mis à jour avec favoris pack:', favoriteIds);
          
          // 🔄 SYNC: Dispatcher l'événement après le rendu pour éviter les cycles
          setTimeout(() => {
            console.log('🔄 SYNC: Déclenchement événement favoritesChanged pour pack');
            window.dispatchEvent(new CustomEvent('favoritesChanged'));
          }, 0);
          
          return updatedCourses;
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
        const purchasedCourse = [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)]
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
        const purchasedPack = packs.find((p: any) => p.id === option.itemId);
        
        if (purchasedPack) {
          courseName = purchasedPack.title;
          console.log('🎯 ONBOARDING: Pack trouvé pour planification:', courseName, 'avec', purchasedPack.courses.length, 'cours');
        } else {
          courseName = 'Pack Electrostatique';
        }
      } else {
        // Pour un cours individuel - toujours chercher par option.itemId pour éviter les confusions
        const purchasedCourse = [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)]
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
      // Ajouter un délai pour laisser le temps à la célébration d'être programmée
      setTimeout(() => {
        triggerPlannerOnboarding(courseName, planningItemId);
      }, 200);
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

  // Fonction pour ouvrir la messagerie depuis Community
  const handleOpenMessagingFromCommunity = (contactId?: string) => {
    setMessagingContactId(contactId);
    setActiveSection('messaging');
  };

  // 🎯 Handler universel pour les redirections depuis le Social Feed Hub
  const handleSocialFeedNavigation = (linkType: string, linkId?: string) => {
    console.log(`🎯 Navigation Social Feed: ${linkType} → ${linkId || 'no-id'}`);
    
    // Fermer le Social Feed Panel
    setShowSocialFeed(false);
    
    switch (linkType) {
      case 'course':
        // Rediriger vers le cours
        const course = [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)].find(c => c.id === linkId);
        if (course) {
          handleOpenIntegratedViewer(course);
        }
        break;
        
      case 'competition':
        // Ouvrir le module Communauté sur l'onglet Compétitions
        setCommunityInitialTab('competitions');
        setActiveSection('community');
        break;
        
      case 'circle':
        // Ouvrir le module Communauté sur l'onglet Cercles
        setCommunityInitialTab('circles');
        setActiveSection('community');
        break;
        
      case 'message':
        // Ouvrir la messagerie avec le contact pré-sélectionné
        setActiveSection('messaging');
        setMessagingContactId(linkId || '');
        break;
        
      case 'xp-event':
        // Afficher l'événement XP Boost
        setShowXPBoost(true);
        break;
        
      case 'study-room':
        // Ouvrir le module Study Rooms
        setActiveSection('study-rooms');
        break;
        
      case 'buddy':
        // Ouvrir le module Communauté sur l'onglet Buddies
        setCommunityInitialTab('buddies');
        setActiveSection('community');
        break;
        
      case 'community':
        // Ouvrir le module Communauté sur l'onglet Badges
        setCommunityInitialTab('badges');
        setActiveSection('community');
        break;
        
      default:
        console.warn(`Type de lien non géré: ${linkType}`);
    }
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
          'Vidéos FullHD',
          'Quiz d\'auto-évaluation',
          'Toutes les leçons du cours',
          'Accès aux Study Rooms',
          'Garantie de réussite',
          'Support prioritaire',
          'Accès au groupe WhatsApp du cours',
          'Accès à la communauté',
          'Planificateur inclus',
          'Tous les cours d\'électrostatique',
          'Slides PDF disponibles pour tous les cours du pack'
        ],
        badge: 'Pack Premium'
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
        'Vidéos FullHD',
        'Quiz d\'auto-évaluation',
        'Toutes les leçons du cours',
        'Accès aux Study Rooms',
        'Garantie de réussite',
        'Support prioritaire',
        'Accès au groupe WhatsApp du cours',
        'Accès à la communauté',
        'Planificateur inclus',
        `Tous les cours de ${pack.title.toLowerCase()}`,
        'Slides PDF disponibles pour tous les cours du pack'
      ],
      badge: 'Pack Premium'
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
    const course = [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)]
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
    const course = safeData.suggestedCourses.find(s => s.course.id === courseId)?.course;
    if (!course) return;

    // Au lieu de débloquer directement, on déclenche la comparaison intelligente
    setSelectedCourseForComparison(course);
    setShowCourseComparison(true);
  };

  // Fonction pour débloquer directement un cours (utilisée après confirmation)
  const handleDirectCourseUnlock = (courseId: string) => {
    const course = safeData.suggestedCourses.find(s => s.course.id === courseId)?.course;
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
      safeData.suggestedCourses.find(s => s.course.id === courseId)?.course
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
  const totalHours = safeData.progress.reduce((acc, p) => acc + p.timeSpent, 0) / 60;
  const averageProgress = primaryCourses.length > 0 
    ? Math.round(primaryCourses.reduce((acc, course) => acc + course.progress, 0) / primaryCourses.length)
    : 0;
  const bestRanking = safeData.progress.length > 0 
    ? Math.min(...safeData.progress.map(p => p.facultyRanking))
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
    { 
      id: 'planning', 
      label: 'Planification', 
      icon: Calendar, 
      hasAccess: plannerState.plannerAccess.hasAccess,
      isPremium: true,
      hasNotification: plannerState.plannerAccess.hasAccess && !plannerConfigured
    },
    { id: 'study-rooms', label: 'Study Rooms', icon: Video, hasAccess: true },
    { id: 'community', label: 'Communauté', icon: Users, hasAccess: true },
    { id: 'messaging', label: 'Messages', icon: MessageCircle, hasAccess: true, hasNotification: true },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, hasAccess: true, isExternal: true },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
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
          user={user || safeData.user}
          lessons={courseLessons[selectedCourse.id]}
          onLessonsUpdate={(updatedLessons) => {
            setCourseLessons(prev => ({
              ...prev,
              [selectedCourse.id]: updatedLessons
            }));
          }}
          userXPProfile={userXPProfile}
        />
      ) : (
        <div 
          id="dashboard-container"
          className="min-h-screen pt-[72px] md:pt-[85px] relative overflow-x-clip overflow-y-visible"
        >
          {/* Curseur animé personnalisé pour le dashboard - DÉSACTIVÉ TEMPORAIREMENT */}
          {/* <TargetCursor 
            spinDuration={2}
            hideDefaultCursor={true}
          /> */}
          
          {/* Style pour cacher le curseur uniquement dans le dashboard - DÉSACTIVÉ */}
          {/* <style dangerouslySetInnerHTML={{ __html: `
            #dashboard-container,
            #dashboard-container * {
              cursor: none !important;
            }
          `}} /> */}
          
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
          
          
          {/* Contenu principal adaptatif */}
          <div 
            className={`relative z-10 transition-all duration-300 ease-in-out ${
              showSocialFeed 
                ? 'mr-[480px] md:mr-[480px] lg:mr-[450px] xl:mr-[520px] 2xl:mr-[580px]' // Décalage adaptatif selon la largeur du panneau
                : 'mr-0'
            }`}
          >
        {/* Header épuré bord à bord - pleine largeur */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-between relative h-[72px] md:h-[85px]">
            {/* Left - Logo */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="cursor-target w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu size={20} />
              </button>

              
              <div className="relative h-[55px] w-[120px] md:h-[85px] md:w-[340px]">
                <Image 
                  src="/brand/sms-logo2.svg" 
                  alt="Science Made Simple"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            
            {/* Widgets centrés au milieu de la page */}
            <div className="hidden md:flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
              
                  {/* Widget XP */}
                  {userXPProfile && (
                <XPHeaderWidget
                        profile={userXPProfile}
                  onClick={() => {
                    setSocialFeedInitialTab('progression');
                    setShowSocialFeed(true);
                  }}
                />
                  )}

                  {/* Fil Social */}
                  <div data-tour="social-feed">
                    <SocialFeedIcon 
                      onClick={() => {
                        setSocialFeedInitialTab('now');
                        setShowSocialFeed(true);
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    />
                  </div>

              {/* Widget Social Unifié (Buddy) */}
              <UnifiedSocialWidget
                userId={user?.id || 'current_user'}
                onNavigateToCommunity={() => setActiveSection('community')}
                onNavigateToSection={setActiveSection}
               />
            </div>

            {/* Right - Timer + Inviter + Finish Sign Up + Avatar */}
            <div className="flex items-center gap-4">
              {/* Timer - Style urgence */}
              <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-full border-2 border-gray-300 animate-pulse">
                <Clock size={22} className="text-gray-700" />
                <span className="text-xl font-bold text-gray-900 tabular-nums tracking-tight">00:00:00</span>
              </div>

              {/* Bouton Inviter - Ouvre le popup Pass amis */}
              <button
                onClick={() => setShowGuestPassModal(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
              >
                <Users size={16} />
                <span>Inviter</span>
              </button>

              {/* Finish Sign Up CTA */}
              <button
                onClick={() => {
                  setOnboardingInitialPhase('membership-intro');
                  setShowOnboarding(true);
                }}
                className="hidden md:block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors text-sm"
              >
                Finish Sign Up
              </button>
              {/* Profil utilisateur avec paramètres */}
              <div className="relative" ref={settingsRef}>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold hover:bg-gray-800 transition-colors"
                >
                  {safeData.user.name.charAt(0)}
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
                            {safeData.user.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{safeData.user.name}</h3>
                            <p className="text-xs text-gray-500">{safeData.user.year}</p>
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
                      if (item.id === 'whatsapp') {
                        window.open('https://wa.me/33123456789', '_blank');
                      } else if (item.hasAccess) {
                        setActiveSection(item.id);
                      } else if (item.isPremium) {
                        // Afficher le message d'accès premium
                        alert(plannerState.plannerAccess.accessMessage);
                      }
                    }}
                    className={`cursor-target w-full flex items-center gap-3 p-3 rounded-lg transition-all relative group ${
                      item.id === 'whatsapp'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : isActive
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

          {/* Section du bas - Boosters uniquement */}
          <div className="mt-auto mb-[220px] border-t border-gray-100">
            {/* Mastery Boosters */}
            <button 
              className="w-full flex items-center gap-3 px-4 py-6 hover:bg-gray-50 transition-colors text-left"
              onClick={() => setActiveSection('boosters')}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Plus size={18} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Mastery Boosters</p>
                <p className="text-xs text-gray-500 truncate">Booste ton apprent...</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </nav>

        {/* Contenu principal bord à bord avec marge pour sidebar fixe */}
        <main className="flex-1 md:ml-64 pt-0 pb-16 md:pb-0 min-w-0">
          {(activeSection === 'planning' || forceShowPlanner) ? (
            <StrategicPlannerCompact
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
          ) : activeSection === 'study-rooms' ? (
            <div className="h-[calc(100vh-85px)] overflow-y-auto">
              <AdvancedStudyRoomsTab 
                userId={user?.id || safeData.user?.id || 'user-1'}
                userName={user?.name || safeData.user?.name || 'Étudiant'}
                purchasedItems={purchasedItems}
                onNavigateToUpgrade={(courseId) => {
                  console.log('Navigation vers upgrade pour:', courseId);
                  setActiveSection('unlock');
                }}
                onNavigateToCourseReplay={(courseId, replayId) => {
                  console.log('📺 Navigation vers le replay:', replayId, 'du cours:', courseId);
                  // Trouver le cours
                  const course = primaryCourses.find(c => c.id === courseId);
                  if (course) {
                    setSelectedCourse(course);
                    setActiveSection('courses');
                    // TODO: Mettre un état pour afficher directement le replay dans IntegratedCourseViewer
                  }
                }}
                userCourses={primaryCourses}
                isAdmin={false}
              />
            </div>
          ) : activeSection === 'community' ? (
            <div className="h-[calc(100vh-85px)] overflow-hidden">
              <Community 
                onOpenMessaging={handleOpenMessagingFromCommunity} 
                userId={user?.id || safeData.user?.id || 'user-1'} 
                initialTab={communityInitialTab}
              />
            </div>
          ) : activeSection === 'messaging' ? (
            <div className="h-[calc(100vh-85px)]">
              <DirectMessaging defaultContactId={messagingContactId} />
            </div>
          ) : activeSection === 'unlock' ? (
            <div className="p-8">
              <PurchaseSystem
                data={data}
                userBalance={(user?.wallet || safeData.user?.wallet)?.balance || 150}
                onBalanceChange={(newBalance) => {
                  // Mettre à jour le solde du portefeuille
                  if (props.onUpdateUser) {
                    const currentWallet = user?.wallet || safeData.user?.wallet;
                    if (currentWallet) {
                      const updatedUser = {
                        ...safeData.user,
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
            <div className="px-4 md:px-6 lg:px-8 py-6 overflow-visible">
              {/* Message d'accueil + Métriques - MASQUÉ */}
            {false && (
              <>
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    Bienvenue, {safeData.user.name.split(' ')[0]}
                  </h2>
                  <p className="text-gray-500 text-lg">
                    Continue ta progression et atteins tes objectifs.
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                  <SimpleMetric
                    icon={BookOpen}
                    value={`${primaryCourses.length}/${safeData.suggestedCourses.length + primaryCourses.length}`}
                    label="Cours actifs"
                    accent={true}
                  />
                  <SimpleMetric
                    icon={Flame}
                    value={`${7} jours`}
                    label="Day Streak"
                  />
                  <SimpleMetric
                    icon={UserCheck}
                    value={`${3}/${8}`}
                    label="Buddies connectés"
                  />
                  <SimpleMetric
                    icon={Zap}
                    value="200 XP"
                    label="Objectif du jour"
                  />
                </div>
              </>
            )}

            {/* Section Profil Personnalisé - MASQUÉ TEMPORAIREMENT */}
            {false && (
              <section className="mb-16">
                <PersonalProfileSection 
                  personalProfile={personalProfile}
                  onCourseClick={(courseId) => {
                    const course = [...primaryCourses, ...safeData.suggestedCourses.map(s => s.course)].find(c => c.id === courseId);
                    if (course) {
                      handleOpenIntegratedViewer(course);
                    }
                  }}
                />
              </section>
            )}

            {/* ================================================================ */}
            {/* NOUVEAU CATALOGUE NETFLIX */}
            {/* ================================================================ */}
            <NetflixCatalogSection
              onCourseClick={handleOpenIntegratedViewer}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* ================================================================ */}
            {/* ANCIENNES SECTIONS - MASQUÉES */}
            {/* ================================================================ */}
            {false && (
            <>
            {/* Section Mes Cours Favoris - Nouvelle organisation par pack */}
            <section className="mb-16" data-tour="mes-cours">
              <FavoritesPackCollection
                favoriteCourses={primaryCourses}
                onToggleFavorite={handleToggleFavorite}
                onPreview={handlePreviewCourse}
                onEnroll={handleUnlockCourse}
                onOpenCourse={handleOpenCourse}
                onOpenStaircaseView={handleOpenStaircaseView}
                progressData={safeData.progress}
                getStudyRoomProps={getStudyRoomProps}
                onCompletePack={handleCompletePack}
                purchasedItems={purchasedItems}
              />
            </section>

            {/* Section Cours Suggérés */}
            <section>
              <div className="mb-6">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSuggestedExpanded(!suggestedExpanded)}
                >
                  <div data-tour="faculty-courses">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Explore le catalogue
                      <span className="text-gray-500 font-normal text-lg ml-3">
                        {smartSortedCourses.length} cours
                      </span>
                    </h2>
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
                    {/* Anciens filtres - MASQUÉS */}
                    <div className="hidden mb-6 pb-4 border-b border-gray-200">
                      {/* Structure avec labels alignés et filtres en dessous */}
                      <div className="flex items-start gap-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {/* Groupe MATIÈRES */}
                        <div className="flex flex-col gap-3">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Matières</span>
                          <div className="flex gap-2">
                            <motion.button 
                              onClick={() => {
                                const isActive = facultyFilters.subjects.includes('all');
                                setFacultyFilters({ 
                                  ...facultyFilters, 
                                  subjects: isActive ? [] : ['all'] 
                                });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                                facultyFilters.subjects.includes('all') 
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Home size={20} />
                              <span className="text-xs font-semibold whitespace-nowrap">Tout</span>
                            </motion.button>
                            
                            <motion.button 
                              onClick={() => {
                                const isActive = facultyFilters.subjects.includes('physics');
                                setFacultyFilters({ 
                                  ...facultyFilters, 
                                  subjects: isActive ? [] : ['physics'] 
                                });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                                facultyFilters.subjects.includes('physics') 
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Zap size={20} />
                              <span className="text-xs font-semibold whitespace-nowrap">Physique</span>
                            </motion.button>
                            
                            <motion.button 
                              onClick={() => {
                                const isActive = facultyFilters.subjects.includes('chemistry');
                                setFacultyFilters({ 
                                  ...facultyFilters, 
                                  subjects: isActive ? [] : ['chemistry'] 
                                });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                                facultyFilters.subjects.includes('chemistry') 
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <FileText size={20} />
                              <span className="text-xs font-semibold whitespace-nowrap">Chimie</span>
                            </motion.button>
                            
                            <motion.button 
                              onClick={() => {
                                const isActive = facultyFilters.subjects.includes('mathematics');
                                setFacultyFilters({ 
                                  ...facultyFilters, 
                                  subjects: isActive ? [] : ['mathematics'] 
                                });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                                facultyFilters.subjects.includes('mathematics') 
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Calculator size={20} />
                              <span className="text-xs font-semibold whitespace-nowrap">Maths</span>
                            </motion.button>
                            
                            <motion.button 
                              onClick={() => {
                                const isActive = facultyFilters.subjects.includes('biology');
                                setFacultyFilters({ 
                                  ...facultyFilters, 
                                  subjects: isActive ? [] : ['biology'] 
                                });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                                facultyFilters.subjects.includes('biology') 
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Brain size={20} />
                              <span className="text-xs font-semibold whitespace-nowrap">Biologie</span>
                            </motion.button>
                          </div>
                        </div>
                        
                        
                        {/* Groupe TENDANCES */}
                        <div className="flex flex-col gap-3 border-l border-gray-200 pl-8">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Tendances</span>
                          <div className="flex gap-2">
                            <motion.button 
                              onClick={() => {
                                const isActive = facultyFilters.trends.includes('popular');
                                setFacultyFilters({ 
                                  ...facultyFilters, 
                                  trends: isActive ? [] : ['popular'] 
                                });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                                facultyFilters.trends.includes('popular') 
                                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Flame size={20} />
                              <span className="text-xs font-semibold whitespace-nowrap">Populaires</span>
                            </motion.button>
                            
                            <motion.button 
                              onClick={() => {
                                const isActive = facultyFilters.trends.includes('new');
                                setFacultyFilters({ 
                                  ...facultyFilters, 
                                  trends: isActive ? [] : ['new'] 
                                });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                                facultyFilters.trends.includes('new') 
                                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Sparkles size={20} />
                              <span className="text-xs font-semibold whitespace-nowrap">Nouveaux</span>
                            </motion.button>
                            
                            <motion.button 
                              onClick={() => {
                                const isActive = facultyFilters.trends.includes('recommended');
                                setFacultyFilters({ 
                                  ...facultyFilters, 
                                  trends: isActive ? [] : ['recommended'] 
                                });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                                facultyFilters.trends.includes('recommended') 
                                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Target size={20} />
                              <span className="text-xs font-semibold whitespace-nowrap">Recommandés</span>
                            </motion.button>
                          </div>
                        </div>
                        
                        
                        {/* Groupe ACTIVITÉ SOCIALE */}
                        <div className="flex flex-col gap-3 border-l border-gray-200 pl-8">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Activité sociale</span>
                          <div className="flex gap-2">
                            <motion.button 
                              onClick={() => {
                                const isActive = facultyFilters.social.includes('buddies');
                                setFacultyFilters({ 
                                  ...facultyFilters, 
                                  social: isActive ? [] : ['buddies'] 
                                });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                                facultyFilters.social.includes('buddies') 
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <UserCheck size={20} />
                              <span className="text-xs font-semibold whitespace-nowrap">Mes buddies</span>
                            </motion.button>
                            
                            <motion.button 
                              onClick={() => {
                                const isActive = facultyFilters.social.includes('most-followed');
                                setFacultyFilters({ 
                                  ...facultyFilters, 
                                  social: isActive ? [] : ['most-followed'] 
                                });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                                facultyFilters.social.includes('most-followed') 
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <TrendingUp size={20} />
                              <span className="text-xs font-semibold whitespace-nowrap">Plus suivis</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 1: Mastery Programs (statique) */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <button 
                        onClick={() => { setFacultyFilters({ ...facultyFilters, subjects: ['all'], trends: [], social: [] }); setSelectedTopic(null); }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border ${
                          facultyFilters.subjects.includes('all') 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <BookOpen size={16} />
                        Tout voir
                      </button>
                      
                      <button 
                        onClick={() => { setFacultyFilters({ ...facultyFilters, subjects: ['physics'], trends: [], social: [] }); setSelectedTopic(null); }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border ${
                          facultyFilters.subjects.includes('physics') 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <Zap size={16} />
                        Physique
                      </button>
                      
                      <button 
                        onClick={() => { setFacultyFilters({ ...facultyFilters, subjects: ['mathematics'], trends: [], social: [] }); setSelectedTopic(null); }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border ${
                          facultyFilters.subjects.includes('mathematics') 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <Calculator size={16} />
                        Mathématiques
                      </button>
                      
                      <button 
                        onClick={() => { setFacultyFilters({ ...facultyFilters, subjects: ['chemistry'], trends: [], social: [] }); setSelectedTopic(null); }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border ${
                          facultyFilters.subjects.includes('chemistry') 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <FileText size={16} />
                        Chimie
                      </button>
                      
                      {/* Mastery Programs verrouillés */}
                      <button 
                        onClick={() => { setFacultyFilters({ ...facultyFilters, subjects: ['economics'], trends: [], social: [] }); setSelectedTopic(null); }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border relative ${
                          facultyFilters.subjects.includes('economics') 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <TrendingUp size={16} />
                        Économie
                        <Lock size={12} className="text-gray-400" />
                      </button>
                      
                      <button 
                        onClick={() => { setFacultyFilters({ ...facultyFilters, subjects: ['biology'], trends: [], social: [] }); setSelectedTopic(null); }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border relative ${
                          facultyFilters.subjects.includes('biology') 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <Brain size={16} />
                        Biologie
                        <Lock size={12} className="text-gray-400" />
                      </button>
                      
                      <button 
                        onClick={() => { setFacultyFilters({ ...facultyFilters, subjects: ['informatics'], trends: [], social: [] }); setSelectedTopic(null); }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border relative ${
                          facultyFilters.subjects.includes('informatics') 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <Settings size={16} />
                        Informatique
                        <Lock size={12} className="text-gray-400" />
                      </button>
                    </div>

                    {/* Row 2: Sujets/Topics (dynamique - apparaît quand un Mastery Program est sélectionné) */}
                    {(facultyFilters.subjects.includes('physics') || 
                      facultyFilters.subjects.includes('mathematics') || 
                      facultyFilters.subjects.includes('chemistry')) && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap gap-3 mb-8"
                      >
                        {/* Topics pour Physique */}
                        {facultyFilters.subjects.includes('physics') && (
                          <>
                            {['Électrostatique', 'Mécanique', 'Thermodynamique', 'Optique', 'Électromagnétisme'].map(topic => (
                              <button 
                                key={topic}
                                onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                                className={`px-5 py-3 rounded-full text-sm font-medium transition-all border ${
                                  selectedTopic === topic 
                                    ? 'bg-gray-900 text-white border-gray-900' 
                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                {topic}
                              </button>
                            ))}
                          </>
                        )}
                        
                        {/* Topics pour Mathématiques */}
                        {facultyFilters.subjects.includes('mathematics') && (
                          <>
                            {['Analyse', 'Algèbre linéaire', 'Probabilités', 'Statistiques', 'Géométrie'].map(topic => (
                              <button 
                                key={topic}
                                onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                                className={`px-5 py-3 rounded-full text-sm font-medium transition-all border ${
                                  selectedTopic === topic 
                                    ? 'bg-gray-900 text-white border-gray-900' 
                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                {topic}
                              </button>
                            ))}
                          </>
                        )}
                        
                        {/* Topics pour Chimie */}
                        {facultyFilters.subjects.includes('chemistry') && (
                          <>
                            {['Chimie organique', 'Chimie inorganique', 'Biochimie', 'Thermochimie', 'Cinétique'].map(topic => (
                              <button 
                                key={topic}
                                onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                                className={`px-5 py-3 rounded-full text-sm font-medium transition-all border ${
                                  selectedTopic === topic 
                                    ? 'bg-gray-900 text-white border-gray-900' 
                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                {topic}
                              </button>
                            ))}
                          </>
                        )}
                      </motion.div>
                    )}

                    {/* Espacement si pas de row 2 */}
                    {!(facultyFilters.subjects.includes('physics') || 
                      facultyFilters.subjects.includes('mathematics') || 
                      facultyFilters.subjects.includes('chemistry')) && (
                      <div className="mb-4" />
                    )}

                    {/* Grille de cours - 8 max par ligne */}
                    {/* Détection des programmes verrouillés */}
                    {(() => {
                      const lockedPrograms: Array<'economics' | 'biology' | 'informatics'> = ['economics', 'biology', 'informatics'];
                      const isLockedProgram = lockedPrograms.some(p => facultyFilters.subjects.includes(p as SubjectFilter));
                      
                      // Cours mockés pour les programmes verrouillés
                      const lockedCourses: Record<string, Array<{id: string, title: string, description: string}>> = {
                        economics: [
                          { id: 'eco-1', title: 'Microéconomie', description: 'Théorie du consommateur et du producteur' },
                          { id: 'eco-2', title: 'Macroéconomie', description: 'Modèles économiques et politiques' },
                          { id: 'eco-3', title: 'Économétrie', description: 'Méthodes statistiques appliquées' },
                          { id: 'eco-4', title: 'Finance d\'entreprise', description: 'Gestion financière et investissements' },
                        ],
                        biology: [
                          { id: 'bio-1', title: 'Biologie Cellulaire', description: 'Structure et fonction des cellules' },
                          { id: 'bio-2', title: 'Génétique', description: 'Hérédité et expression des gènes' },
                          { id: 'bio-3', title: 'Biochimie', description: 'Réactions chimiques du vivant' },
                          { id: 'bio-4', title: 'Physiologie', description: 'Fonctionnement des organismes' },
                        ],
                        informatics: [
                          { id: 'info-1', title: 'Algorithmique', description: 'Conception et analyse d\'algorithmes' },
                          { id: 'info-2', title: 'Programmation', description: 'Langages et paradigmes' },
                          { id: 'info-3', title: 'Bases de données', description: 'SQL et modélisation' },
                          { id: 'info-4', title: 'Réseaux', description: 'Architecture et protocoles' },
                        ],
                      };
                      
                      const currentLockedCourses = lockedPrograms
                        .filter(p => facultyFilters.subjects.includes(p as SubjectFilter))
                        .flatMap(p => lockedCourses[p] || []);
                      
                      if (isLockedProgram && currentLockedCourses.length > 0) {
                        return (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5">
                            {currentLockedCourses.map((course) => (
                              <div
                                key={course.id}
                                className="group cursor-pointer relative"
                              >
                                {/* Tooltip flottant premium - Style MasterClass */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-500 z-50 pointer-events-none group-hover:pointer-events-auto">
                                  <div className="bg-[#0a0a0a] rounded-2xl shadow-2xl shadow-black/50 border border-amber-500/20 p-5 w-72 transform scale-95 group-hover:scale-100 transition-transform duration-500">
                                    {/* Flèche vers le bas */}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0a0a0a] border-r border-b border-amber-500/20 transform rotate-45" />
                                    
                                    {/* Header avec badge premium */}
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                          <Sparkles size={14} className="text-black" />
                                        </div>
                                        <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Essai Gratuit</span>
                                      </div>
                                    </div>
                                    
                                    {/* Titre élégant */}
                                    <h4 className="text-white font-bold text-lg mb-1 leading-snug">{course.title}</h4>
                                    <p className="text-gray-500 text-xs mb-4">Mastery Program</p>
                                    
                                    {/* Avantages avec icônes */}
                                    <div className="space-y-2 mb-5">
                                      <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                          <Clock size={10} className="text-amber-400" />
                                        </div>
                                        <span className="text-gray-300 text-sm">10 heures d'accès</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                          <CheckCircle size={10} className="text-amber-400" />
                                        </div>
                                        <span className="text-gray-300 text-sm">Sans engagement</span>
                                      </div>
                                    </div>
                                    
                                    {/* Bouton principal premium */}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOnboardingInitialPhase('membership-intro');
                                        setShowOnboarding(true);
                                      }}
                                      className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-xl text-sm font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25"
                                    >
                                      Commencer maintenant
                                    </button>
                                  </div>
                                </div>

                                {/* Carte principale - Style MasterClass */}
                                <div className="relative aspect-[3/4] bg-[#0d0d0d] rounded-2xl overflow-hidden mb-3 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-500/10 border border-white/5 group-hover:border-amber-500/30">
                                  {/* Pattern subtil en arrière-plan */}
                                  <div className="absolute inset-0 opacity-30">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-transparent to-gray-900/50" />
                                  </div>
                                  
                                  {/* Icône centrale élégante */}
                                  <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="relative">
                                      {/* Cercle externe avec glow */}
                                      <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber-500/50 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-500">
                                        {/* Icône Play au hover, Lock par défaut */}
                                        <div className="relative">
                                          <Lock className="w-8 h-8 text-white/40 group-hover:opacity-0 transition-opacity duration-300" />
                                          <Play className="w-8 h-8 text-amber-400 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1" fill="currentColor" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Gradient overlay cinématique */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                                  
                                  {/* Contenu texte premium */}
                                  <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
                                    {/* Ligne décorative amber */}
                                    <div className="w-8 h-0.5 bg-amber-500 mb-3 group-hover:w-12 transition-all duration-500" />
                                    
                                    <h3 className="!text-white font-bold text-lg leading-tight tracking-tight mb-1 drop-shadow-lg">
                                      {course.title}
                                    </h3>
                                    <p className="!text-white/70 text-xs">
                                      {course.description?.slice(0, 35)}...
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      
                      return filteredFacultyCourses.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {filteredFacultyCourses.map((course: CourseWithTrend) => (
                          <div
                            key={course.id}
                            className="group cursor-pointer"
                            onClick={() => handleOpenIntegratedViewer(course)}
                          >
                            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl overflow-hidden mb-3 transition-transform group-hover:scale-[1.02]">
                              {/* Image de fond si disponible */}
                              {course.thumbnail && (
                                <img 
                                  src={course.thumbnail} 
                                  alt={course.title}
                                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                                />
                              )}
                              {/* Gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                              {/* Contenu texte */}
                              <div className="absolute inset-0 flex flex-col justify-end p-4">
                                <h3 className="!text-white font-bold text-lg leading-tight tracking-tight mb-1">
                                  {course.title}
                                </h3>
                                <div className="w-8 h-0.5 bg-white/40 mb-2" />
                                <p className="!text-white/80 text-xs font-medium">
                                  {course.description?.slice(0, 40)}...
                                </p>
                              </div>
                              {/* Play button on hover */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                  <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null;
                    })()}
                    
                    {/* Message si aucun cours */}
                    {filteredFacultyCourses.length === 0 && !(['economics', 'biology', 'informatics'] as const).some(p => facultyFilters.subjects.includes(p)) && (
                      /* Message de feedback pour zéro résultat */
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-16 px-8"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl">🔍</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucun cours ne correspond à vos filtres
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Essayez d'élargir vos critères de recherche ou revenez plus tard pour découvrir de nouveaux cours !
                        </p>
                        <button
                          onClick={() => setFacultyFilters({
                            subjects: ['all'],
                            trends: [],
                            social: [],
                            sortBy: 'students',
                            sortOrder: 'desc'
                          })}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Réinitialiser les filtres
                        </button>
                      </motion.div>
                    )}

                  </motion.div>
                )}
              </AnimatePresence>
            </section>
            </>
            )}
            
              {/* Footer supprimé */}
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
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative h-8 w-40">
                    <Image 
                      src="/brand/sms-text-logo.svg" 
                      alt="Science Made Simple"
                      fill
                      className="object-contain object-left"
                    />
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
                          if (item.id === 'whatsapp') {
                            window.open('https://wa.me/33123456789', '_blank');
                            setSidebarOpen(false);
                          } else if (item.hasAccess) {
                            setActiveSection(item.id);
                            setSidebarOpen(false); // Fermer la sidebar mobile
                          } else if (item.isPremium) {
                            alert(plannerState.plannerAccess.accessMessage);
                          }
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all relative ${
                          item.id === 'whatsapp'
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : isActive
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
          const course = safeData.suggestedCourses.find(c => c.course.id === courseId)?.course;
          if (course) {
            setSelectedLessonForPurchase({ id: courseId, title: course.title });
            setShowPurchaseUpsell(true);
          }
        }}
        onNavigateToCourse={(courseId) => {
          handleClosePreviewModal();
          const course = safeData.suggestedCourses.find(c => c.course.id === courseId)?.course;
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
      {showWalletTopUp && (user?.wallet || safeData.user?.wallet) && (
        <WalletTopUp
          currentBalance={WalletService.getTotalBalance(safeData.user?.id || 'user-default').total}
          onTopUp={handleWalletTopUp}
          onCancel={() => setShowWalletTopUp(false)}
          userId={safeData.user?.id || 'user-default'}
          source="header"
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
        showCelebration={!!pendingPackCelebration}
        packTitle={pendingPackCelebration?.packTitle}
      />


      {/* Tour guidé d'onboarding - DÉSACTIVÉ TEMPORAIREMENT */}
      {/* <OnboardingSpotlight
        isActive={onboardingTour.isTourActive}
        onComplete={onboardingTour.completeTour}
        onSkip={onboardingTour.skipTour}
        userName={user?.name || safeData.user?.name}
      /> */}

      {/* Onboarding Buddy System */}
      <BuddyOnboarding
        userId={user?.id || safeData.user?.id || 'current-user'}
        userName={user?.name || safeData.user?.name || 'Étudiant'}
        isOpen={showBuddyOnboarding}
        onClose={() => setShowBuddyOnboarding(false)}
        onComplete={() => {
          setShowBuddyOnboarding(false);
          console.log('🎉 Buddy Onboarding terminé ! Réseau d\'étude activé.');
        }}
      />

      {/* Configuration Rapports Parents */}
      <ParentReportsSettings
        userId={user?.id || safeData.user?.id || 'current-user'}
        userName={user?.name || safeData.user?.name || 'Étudiant'}
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
                  if (item.id === 'whatsapp') {
                    window.open('https://wa.me/33123456789', '_blank');
                  } else if (item.hasAccess) {
                    setActiveSection(item.id);
                  } else if (item.isPremium) {
                    alert(plannerState.plannerAccess.accessMessage);
                  }
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all relative min-w-0 flex-1 ${
                  item.id === 'whatsapp'
                    ? 'bg-green-500 text-white'
                    : isActive
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

      {/* Panneau latéral du fil social */}
      <SocialFeedPanel 
        isOpen={showSocialFeed}
        onClose={() => setShowSocialFeed(false)}
        onNavigate={handleSocialFeedNavigation}
        initialTab={socialFeedInitialTab}
      />

      {/* 🎯 Feedback XP */}
      {xpFeedback?.show && (
        <XPFeedback
          xpGained={xpFeedback.xpGained}
          action={xpFeedback.action}
          newLevel={xpFeedback.newLevel}
          newBadges={xpFeedback.newBadges}
          onComplete={() => setXpFeedback(null)}
        />
      )}

      {/* 🧪 Panel de test XP (développement uniquement) - MASQUÉ */}
      {false && process.env.NODE_ENV === 'development' && (
        <XPTestPanel />
      )}

      {/* 🎮 Profil Gamifié */}
      <AnimatePresence>
        {showGamifiedProfile && userXPProfile && (
          <GamifiedProfile
            profile={userXPProfile}
            userName={user?.name || safeData.user?.name || 'Étudiant'}
            onClose={() => setShowGamifiedProfile(false)}
          />
        )}
      </AnimatePresence>

      {/* 🏆 Événements XP Boost (affiché dans la section courses) */}
      {activeSection === 'courses' && showXPBoost && (
        <div className="fixed bottom-24 right-6 z-40 max-w-md">
          <XPBoostEvent
            events={[]} // Les événements sont définis dans le composant par défaut
            onDismiss={(eventId) => {
              console.log('Événement fermé:', eventId);
              setShowXPBoost(false);
            }}
          />
        </div>
      )}

      {/* 🎓 Onboarding Popup (première visite - style MasterClass) */}
      <OnboardingPopup
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        initialPhase={onboardingInitialPhase}
      />

      {/* 🎁 Modal Guest Pass / Pass amis */}
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
              className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Badge Pass */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-900 rounded-2xl px-6 py-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Gift size={32} className="text-[#48c6ed]" />
                  </div>
                  <span className="text-white text-sm font-bold tracking-wider uppercase">Pass Invité 14 jours</span>
                </div>
              </div>

              {/* Titre */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Apprendre, c'est mieux à plusieurs
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                Partage ton pass exclusif avec tes amis. S'ils s'inscrivent dans les 14 jours, 
                tu gagnes <span className="font-bold text-gray-900">+2h de contenu gratuit</span> ajoutées à ton compteur !
              </p>

              {/* Input emails */}
              <div className="mb-4">
                <input
                  type="text"
                  value={guestPassEmails}
                  onChange={(e) => setGuestPassEmails(e.target.value)}
                  placeholder="Emails séparés par des virgules"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
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
                className="w-full py-4 bg-[#48c6ed] hover:bg-[#3bb5dc] text-white font-bold rounded-xl transition-colors mb-4"
              >
                Envoyer les invitations
              </button>

              {/* Lien Passer */}
              <button
                onClick={() => setShowGuestPassModal(false)}
                className="w-full text-center text-gray-900 font-semibold hover:text-gray-600 transition-colors"
              >
                Passer pour l'instant
              </button>

              {/* Terms */}
              <p className="text-center text-gray-400 text-sm mt-4 underline cursor-pointer hover:text-gray-600">
                Conditions du Pass Invité
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
