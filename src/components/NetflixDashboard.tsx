'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Clock, 
  X, 
  Play, 
  ChevronRight, 
  Menu,
  BookOpen,
  Calendar,
  Video,
  Users,
  MessageCircle,
  MessageSquare,
  Settings,
  User
} from 'lucide-react';
import { Course } from '@/types';
import { SmartSearchPrompt } from './SmartSearchPrompt';
import { CourseRow, SubjectSection } from './CourseRow';

// ============================================================================
// MOCK DATA - À remplacer par vos données réelles
// ============================================================================

const createMockCourse = (
  id: string,
  title: string,
  subject: string,
  progress: number = 0,
  totalLessons: number = 10
): Course => ({
  id,
  title,
  description: `Cours complet sur ${title}`,
  faculty: 'Sciences',
  year: '2024',
  totalLessons,
  completedLessons: Math.floor((progress / 100) * totalLessons),
  duration: `${totalLessons * 45}min`,
  isOwned: progress > 0,
  isPrimary: progress > 50,
  progress,
  price: 49,
  thumbnail: '',
  previewAvailable: true,
  tags: [subject],
  difficulty: 'intermediate',
});

// Cours en cours (progress > 10%)
const MOCK_IN_PROGRESS_COURSES: Course[] = [
  createMockCourse('physics-meca-1', 'Mécanique du point', 'Physique', 65, 12),
  createMockCourse('math-analyse-1', 'Analyse I', 'Mathématiques', 42, 15),
  createMockCourse('chemistry-organique-1', 'Chimie organique I', 'Chimie', 28, 10),
  createMockCourse('physics-thermo-1', 'Thermodynamique I', 'Physique', 15, 8),
  createMockCourse('info-python-1', 'Python - Les bases', 'Informatique', 72, 20),
  createMockCourse('eco-micro-1', 'Microéconomie I', 'Économie', 33, 12),
];

// Cours terminés (pour section "Revoir")
const MOCK_COMPLETED_COURSES: Course[] = [
  createMockCourse('physics-intro', 'Introduction à la physique', 'Physique', 100, 8),
  createMockCourse('math-bases', 'Bases mathématiques', 'Mathématiques', 100, 10),
  createMockCourse('chemistry-intro', 'Introduction à la chimie', 'Chimie', 100, 6),
  createMockCourse('info-algo-intro', 'Introduction à l\'algorithmique', 'Informatique', 100, 12),
  createMockCourse('stats-intro', 'Introduction aux statistiques', 'Statistiques', 100, 8),
];

// Nouveautés (cours récemment ajoutés)
const MOCK_NEW_COURSES: Course[] = [
  createMockCourse('physics-moderne', 'Physique moderne', 'Physique', 0, 14),
  createMockCourse('info-ia', 'Intelligence artificielle', 'Informatique', 0, 18),
  createMockCourse('math-crypto', 'Cryptographie', 'Mathématiques', 0, 10),
  createMockCourse('chemistry-env', 'Chimie environnementale', 'Chimie', 0, 8),
  createMockCourse('eco-finance', 'Finance d\'entreprise', 'Économie', 0, 12),
  createMockCourse('info-cloud', 'Cloud computing', 'Informatique', 0, 10),
  createMockCourse('physics-astro', 'Astrophysique', 'Physique', 0, 16),
  createMockCourse('stats-ml', 'Machine Learning', 'Statistiques', 0, 20),
];

// Cours recommandés (basés sur onboarding) - BEAUCOUP PLUS
const MOCK_RECOMMENDED_COURSES: Course[] = [
  createMockCourse('physics-ondes', 'Ondes mécaniques', 'Physique', 0, 10),
  createMockCourse('math-algebre', 'Algèbre linéaire I', 'Mathématiques', 0, 14),
  createMockCourse('chemistry-generale', 'Chimie générale I', 'Chimie', 0, 12),
  createMockCourse('physics-electro', 'Électrostatique', 'Physique', 0, 8),
  createMockCourse('info-python', 'Python - Les fondamentaux', 'Informatique', 0, 16),
  createMockCourse('stats-proba', 'Probabilités', 'Statistiques', 0, 12),
  createMockCourse('eco-micro', 'Microéconomie', 'Économie', 0, 10),
  createMockCourse('physics-circuits', 'Circuits électriques', 'Physique', 0, 10),
  createMockCourse('math-analyse', 'Analyse I', 'Mathématiques', 0, 15),
  createMockCourse('info-bdd', 'Bases de données', 'Informatique', 0, 12),
  createMockCourse('chemistry-orga', 'Chimie organique I', 'Chimie', 0, 14),
  createMockCourse('eco-macro', 'Macroéconomie', 'Économie', 0, 10),
];

// Cours trending / Populaires
const MOCK_TRENDING_COURSES: Course[] = [
  createMockCourse('math-proba', 'Probabilités', 'Mathématiques', 0, 12),
  createMockCourse('physics-quantique', 'Physique quantique', 'Physique', 0, 16),
  createMockCourse('chemistry-analytique', 'Chimie analytique', 'Chimie', 0, 10),
  createMockCourse('info-python-avance', 'Python avancé', 'Informatique', 0, 14),
  createMockCourse('stats-descriptives', 'Statistiques descriptives', 'Statistiques', 0, 8),
  createMockCourse('eco-compta', 'Comptabilité générale', 'Économie', 0, 12),
  createMockCourse('physics-thermo', 'Thermodynamique', 'Physique', 0, 10),
  createMockCourse('math-complexes', 'Nombres complexes', 'Mathématiques', 0, 6),
];

// ============================================================================
// PHYSIQUE - 11 sous-groupes basés sur le mind map
// ============================================================================
const MOCK_PHYSICS_SUBGROUPS: Course[][] = [
  // Mécanique
  [
    createMockCourse('phy-meca-intro', 'Introduction à la mécanique', 'Physique', 100, 8),
    createMockCourse('phy-meca-point', 'Mécanique du point', 'Physique', 65, 12),
    createMockCourse('phy-meca-solide', 'Mécanique du solide', 'Physique', 0, 10),
    createMockCourse('phy-meca-analytique', 'Mécanique analytique', 'Physique', 0, 14),
  ],
  // Électrostatique
  [
    createMockCourse('phy-elec-intro', 'Introduction à l\'électrostatique', 'Physique', 100, 6),
    createMockCourse('phy-elec-champs', 'Champs électriques', 'Physique', 35, 10),
    createMockCourse('phy-elec-potentiel', 'Potentiel électrique', 'Physique', 0, 8),
  ],
  // Circuits électriques
  [
    createMockCourse('phy-circuits-dc', 'Circuits en courant continu', 'Physique', 0, 10),
    createMockCourse('phy-circuits-ac', 'Circuits en courant alternatif', 'Physique', 0, 12),
    createMockCourse('phy-circuits-avance', 'Circuits avancés', 'Physique', 0, 14),
  ],
  // Magnétostatique
  [
    createMockCourse('phy-mag-intro', 'Introduction au magnétisme', 'Physique', 0, 8),
    createMockCourse('phy-mag-champs', 'Champs magnétiques', 'Physique', 0, 10),
    createMockCourse('phy-mag-induction', 'Induction magnétique', 'Physique', 0, 12),
  ],
  // Électromagnétisme
  [
    createMockCourse('phy-em-maxwell', 'Équations de Maxwell', 'Physique', 0, 14),
    createMockCourse('phy-em-ondes', 'Ondes électromagnétiques', 'Physique', 0, 12),
    createMockCourse('phy-em-rayonnement', 'Rayonnement', 'Physique', 0, 10),
  ],
  // Thermodynamique
  [
    createMockCourse('phy-thermo-1', 'Thermodynamique I', 'Physique', 15, 10),
    createMockCourse('phy-thermo-2', 'Thermodynamique II', 'Physique', 0, 12),
    createMockCourse('phy-thermo-stat', 'Thermodynamique statistique', 'Physique', 0, 14),
  ],
  // Mouvements oscillatoires
  [
    createMockCourse('phy-osc-simple', 'Oscillations simples', 'Physique', 0, 8),
    createMockCourse('phy-osc-amortis', 'Oscillations amorties', 'Physique', 0, 10),
    createMockCourse('phy-osc-forces', 'Oscillations forcées', 'Physique', 0, 10),
  ],
  // Ondes
  [
    createMockCourse('phy-ondes-meca', 'Ondes mécaniques', 'Physique', 0, 10),
    createMockCourse('phy-ondes-sono', 'Ondes sonores', 'Physique', 0, 8),
    createMockCourse('phy-ondes-lum', 'Optique ondulatoire', 'Physique', 0, 12),
  ],
  // Physique moderne
  [
    createMockCourse('phy-moderne-relat', 'Relativité restreinte', 'Physique', 0, 12),
    createMockCourse('phy-moderne-quant', 'Mécanique quantique', 'Physique', 0, 16),
    createMockCourse('phy-moderne-atom', 'Physique atomique', 'Physique', 0, 14),
  ],
  // Hydrostatique
  [
    createMockCourse('phy-hydro-pression', 'Pression et fluides', 'Physique', 0, 8),
    createMockCourse('phy-hydro-archimede', 'Principe d\'Archimède', 'Physique', 0, 6),
  ],
  // Hydrodynamique
  [
    createMockCourse('phy-hydrodyn-bernoulli', 'Équation de Bernoulli', 'Physique', 0, 10),
    createMockCourse('phy-hydrodyn-viscosite', 'Viscosité et écoulements', 'Physique', 0, 12),
  ],
];

// ============================================================================
// MATHÉMATIQUES
// ============================================================================
const MOCK_MATH_SUBGROUPS: Course[][] = [
  // Analyse
  [
    createMockCourse('math-analyse-1', 'Analyse I - Limites et continuité', 'Mathématiques', 42, 14),
    createMockCourse('math-analyse-2', 'Analyse II - Dérivées', 'Mathématiques', 0, 12),
    createMockCourse('math-analyse-3', 'Analyse III - Intégrales', 'Mathématiques', 0, 14),
    createMockCourse('math-analyse-4', 'Analyse IV - Séries', 'Mathématiques', 0, 12),
  ],
  // Algèbre linéaire
  [
    createMockCourse('math-algebre-1', 'Algèbre linéaire I', 'Mathématiques', 100, 12),
    createMockCourse('math-algebre-2', 'Algèbre linéaire II', 'Mathématiques', 0, 14),
    createMockCourse('math-algebre-3', 'Espaces vectoriels', 'Mathématiques', 0, 10),
  ],
  // Probabilités & Statistiques
  [
    createMockCourse('math-proba-1', 'Probabilités I', 'Mathématiques', 0, 10),
    createMockCourse('math-proba-2', 'Probabilités II', 'Mathématiques', 0, 12),
    createMockCourse('math-stats-1', 'Statistiques descriptives', 'Mathématiques', 0, 8),
    createMockCourse('math-stats-2', 'Statistiques inférentielles', 'Mathématiques', 0, 12),
  ],
  // Géométrie
  [
    createMockCourse('math-geo-analytique', 'Géométrie analytique', 'Mathématiques', 0, 10),
    createMockCourse('math-geo-diff', 'Géométrie différentielle', 'Mathématiques', 0, 14),
  ],
];

// ============================================================================
// CHIMIE
// ============================================================================
const MOCK_CHEMISTRY_SUBGROUPS: Course[][] = [
  // Chimie générale
  [
    createMockCourse('chem-gen-1', 'Chimie générale I', 'Chimie', 28, 10),
    createMockCourse('chem-gen-2', 'Chimie générale II', 'Chimie', 0, 12),
  ],
  // Chimie organique
  [
    createMockCourse('chem-orga-1', 'Chimie organique I', 'Chimie', 0, 14),
    createMockCourse('chem-orga-2', 'Chimie organique II', 'Chimie', 0, 16),
    createMockCourse('chem-orga-3', 'Synthèse organique', 'Chimie', 0, 12),
  ],
  // Chimie minérale
  [
    createMockCourse('chem-min-1', 'Chimie minérale I', 'Chimie', 0, 10),
    createMockCourse('chem-min-2', 'Chimie minérale II', 'Chimie', 0, 12),
    createMockCourse('chem-min-coord', 'Chimie de coordination', 'Chimie', 0, 10),
  ],
];

// ============================================================================
// INFORMATIQUE
// ============================================================================
const MOCK_INFORMATICS_SUBGROUPS: Course[][] = [
  // Programmation - Python
  [
    createMockCourse('info-python-intro', 'Python - Introduction', 'Informatique', 100, 12),
    createMockCourse('info-python-bases', 'Python - Les bases', 'Informatique', 72, 16),
    createMockCourse('info-python-poo', 'Python - POO', 'Informatique', 0, 14),
    createMockCourse('info-python-avance', 'Python - Avancé', 'Informatique', 0, 18),
  ],
  // Bases de données
  [
    createMockCourse('info-bdd-intro', 'Introduction aux BDD', 'Informatique', 0, 8),
    createMockCourse('info-bdd-sql', 'SQL - Fondamentaux', 'Informatique', 0, 12),
    createMockCourse('info-bdd-avance', 'SQL - Avancé', 'Informatique', 0, 14),
    createMockCourse('info-bdd-nosql', 'Bases NoSQL', 'Informatique', 0, 10),
  ],
  // Architecture informatique
  [
    createMockCourse('info-archi-intro', 'Architecture des ordinateurs', 'Informatique', 0, 10),
    createMockCourse('info-archi-processeurs', 'Processeurs et mémoire', 'Informatique', 0, 12),
    createMockCourse('info-archi-systemes', 'Systèmes d\'exploitation', 'Informatique', 0, 14),
  ],
];

// ============================================================================
// ÉCONOMIE
// ============================================================================
const MOCK_ECONOMICS_SUBGROUPS: Course[][] = [
  // Microéconomie
  [
    createMockCourse('eco-micro-1', 'Microéconomie I', 'Économie', 33, 10),
    createMockCourse('eco-micro-2', 'Microéconomie II', 'Économie', 0, 12),
    createMockCourse('eco-micro-marches', 'Théorie des marchés', 'Économie', 0, 10),
  ],
  // Macroéconomie
  [
    createMockCourse('eco-macro-1', 'Macroéconomie I', 'Économie', 0, 10),
    createMockCourse('eco-macro-2', 'Macroéconomie II', 'Économie', 0, 12),
    createMockCourse('eco-macro-monetaire', 'Économie monétaire', 'Économie', 0, 14),
  ],
  // Comptabilité
  [
    createMockCourse('eco-compta-gen', 'Comptabilité générale', 'Économie', 0, 12),
    createMockCourse('eco-compta-ana', 'Comptabilité analytique', 'Économie', 0, 10),
    createMockCourse('eco-compta-societes', 'Comptabilité des sociétés', 'Économie', 0, 14),
  ],
];

// ============================================================================
// STATISTIQUES
// ============================================================================
const MOCK_STATS_SUBGROUPS: Course[][] = [
  // Statistiques descriptives
  [
    createMockCourse('stats-desc-1', 'Statistiques descriptives I', 'Statistiques', 100, 8),
    createMockCourse('stats-desc-2', 'Statistiques descriptives II', 'Statistiques', 0, 10),
  ],
  // Statistiques inférentielles
  [
    createMockCourse('stats-inf-1', 'Tests d\'hypothèses', 'Statistiques', 0, 12),
    createMockCourse('stats-inf-2', 'Intervalles de confiance', 'Statistiques', 0, 10),
    createMockCourse('stats-inf-3', 'Régression linéaire', 'Statistiques', 0, 14),
  ],
];

// ============================================================================
// TRIAL TIMER COMPONENT
// ============================================================================

interface TrialTimerProps {
  consumedHours: number;
  totalHours: number;
  onUpgrade: () => void;
}

function TrialTimer({ consumedHours, totalHours, onUpgrade }: TrialTimerProps) {
  const percentage = (consumedHours / totalHours) * 100;
  const remainingHours = totalHours - consumedHours;
  const isLow = percentage > 70;
  const isCritical = percentage > 90;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium
        ${isCritical 
          ? 'bg-red-100 text-red-700 border border-red-200' 
          : isLow 
            ? 'bg-amber-100 text-amber-700 border border-amber-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200'
        }
      `}
    >
      <Clock size={16} />
      <span>
        {remainingHours.toFixed(1)}h restantes sur {totalHours}h
      </span>
      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all ${
            isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-gray-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isLow && (
        <button
          onClick={onUpgrade}
          className="ml-2 px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-colors"
        >
          Débloquer
        </button>
      )}
    </motion.div>
  );
}

// ============================================================================
// COURSE DETAIL MODAL
// ============================================================================

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onStartCourse: (course: Course) => void;
}

function CourseDetailModal({ course, onClose, onStartCourse }: CourseDetailModalProps) {
  if (!course) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{course.totalLessons} leçons • {course.duration}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Course Preview */}
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mb-4 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4">{course.description}</p>

          {/* Progress (if exists) */}
          {course.progress > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progression</span>
                <span className="font-medium text-gray-900">{Math.round(course.progress)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Free lessons info */}
          <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm text-gray-600">
            Les 3 premières leçons sont gratuites
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => onStartCourse(course)}
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              {course.progress > 0 ? 'Reprendre' : 'Commencer'}
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

const navigationItems = [
  { id: 'courses', label: 'Mes cours', icon: BookOpen },
  { id: 'planning', label: 'Planification', icon: Calendar },
  { id: 'study-rooms', label: 'Study Rooms', icon: Video },
  { id: 'community', label: 'Communaute', icon: Users },
  { id: 'messaging', label: 'Messages', icon: MessageCircle },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, isExternal: true },
];

// ============================================================================
// MAIN NETFLIX DASHBOARD COMPONENT
// ============================================================================

interface NetflixDashboardProps {
  onCourseSelect?: (course: Course) => void;
  className?: string;
}

export function NetflixDashboard({ onCourseSelect, className = '' }: NetflixDashboardProps) {
  // State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [trialConsumedHours] = useState(7.5); // Mock: 7.5h used
  const [trialTotalHours] = useState(20); // 20h trial
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('courses');

  // Filter courses in progress (>10% progress)
  const inProgressCourses = useMemo(() => {
    return MOCK_IN_PROGRESS_COURSES.filter(c => c.progress > 10).slice(0, 8);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    console.log('Search:', query);
    // TODO: Implement search filtering
  };

  // Handle file upload
  const handleUpload = (files: File[]) => {
    console.log('Uploaded files:', files);
  };

  // Handle program selection from suggestions
  const handleProgramSelect = (programId: string) => {
    console.log('Program selected:', programId);
  };

  // Handle course click
  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  // Handle start course
  const handleStartCourse = (course: Course) => {
    setSelectedCourse(null);
    if (onCourseSelect) {
      onCourseSelect(course);
    }
  };

  // Handle upgrade (paywall)
  const handleUpgrade = () => {
    console.log('Upgrade clicked');
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* ================================================================ */}
      {/* HEADER - Fixed top */}
      {/* ================================================================ */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 md:px-6 py-0">
          <div className="flex items-center justify-between h-[72px] md:h-[85px]">
            {/* Left - Menu + Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors md:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="relative h-[45px] w-[100px] md:h-[70px] md:w-[280px]">
                <Image 
                  src="/brand/sms-logo2.svg" 
                  alt="Science Made Simple"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            {/* Right - Timer + Settings + Avatar */}
            <div className="flex items-center gap-3">
              {/* Trial Timer */}
              <TrialTimer 
                consumedHours={trialConsumedHours}
                totalHours={trialTotalHours}
                onUpgrade={handleUpgrade}
              />
              
              {/* Settings */}
              <button className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <Settings size={20} className="text-gray-600" />
              </button>
              
              {/* Avatar */}
              <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <User size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/* SIDEBAR - Desktop */}
      {/* ================================================================ */}
      <nav className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col fixed left-0 top-[85px] h-[calc(100vh-85px)] z-30">
        <div className="p-6">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'whatsapp') {
                      window.open('https://wa.me/32477025622', '_blank');
                    } else {
                      setActiveSection(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    item.id === 'whatsapp'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : isActive
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logo en bas de la sidebar */}
        <div className="mt-auto p-6 border-t border-gray-100">
          <div className="relative h-[60px] w-full opacity-50">
            <Image 
              src="/brand/sms-logo2.svg" 
              alt="Science Made Simple"
              fill
              className="object-contain object-left"
            />
          </div>
        </div>
      </nav>

      {/* ================================================================ */}
      {/* SIDEBAR - Mobile */}
      {/* ================================================================ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-xl"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="relative h-[40px] w-[140px]">
                  <Image 
                    src="/brand/sms-logo2.svg" 
                    alt="Science Made Simple"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 space-y-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'whatsapp') {
                          window.open('https://wa.me/32477025622', '_blank');
                        } else {
                          setActiveSection(item.id);
                        }
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                        item.id === 'whatsapp'
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : isActive
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================================================================ */}
      {/* MAIN CONTENT */}
      {/* ================================================================ */}
      <main className="pt-[72px] md:pt-[85px] md:ml-64 pb-20 md:pb-8">
        <div className="px-4 md:px-8 lg:px-12 py-8">
          {/* Smart Search Prompt - Hero Section - Full Width */}
          <section className="mb-12">
            <SmartSearchPrompt
              onSearch={handleSearch}
              onUpload={handleUpload}
              onProgramSelect={handleProgramSelect}
            />
          </section>

          {/* 1. Reprendre ma progression → Continuité immédiate */}
          <section className="mb-6">
            <CourseRow
              title="Reprendre ma progression"
              courses={inProgressCourses}
              onCourseClick={handleCourseClick}
              showProgress={true}
              emptyMessage="Tu n'as pas encore commencé de cours"
              emptyAction={{
                label: "Commencer mon premier cours",
                onClick: () => handleProgramSelect('physics')
              }}
              maxVisible={8}
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>

          {/* 2. Conçus pour toi → Personnalisation (tous likés par défaut) */}
          <section className="mb-6">
            <CourseRow
              title="Learning tracks conçus pour toi"
              courses={MOCK_RECOMMENDED_COURSES}
              onCourseClick={handleCourseClick}
              showProgress={false}
              defaultFavorites={true}
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>

          {/* 3. Nouveautés chez SMS → Excitation, fraîcheur */}
          <section className="mb-6">
            <CourseRow
              title="Nouveautés chez SMS"
              courses={MOCK_NEW_COURSES}
              onCourseClick={handleCourseClick}
              showProgress={false}
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>

          {/* 4. Les Mastery Programs → Catalogue structuré */}
          <section className="mb-6">
            <SubjectSection
              subject="Physique"
              subGroups={MOCK_PHYSICS_SUBGROUPS}
              onCourseClick={handleCourseClick}
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>

          <section className="mb-6">
            <SubjectSection
              subject="Mathématiques"
              subGroups={MOCK_MATH_SUBGROUPS}
              onCourseClick={handleCourseClick}
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>

          <section className="mb-6">
            <SubjectSection
              subject="Chimie"
              subGroups={MOCK_CHEMISTRY_SUBGROUPS}
              onCourseClick={handleCourseClick}
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>

          <section className="mb-6">
            <SubjectSection
              subject="Informatique"
              subGroups={MOCK_INFORMATICS_SUBGROUPS}
              onCourseClick={handleCourseClick}
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>

          <section className="mb-6">
            <SubjectSection
              subject="Économie"
              subGroups={MOCK_ECONOMICS_SUBGROUPS}
              onCourseClick={handleCourseClick}
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>

          <section className="mb-6">
            <SubjectSection
              subject="Statistiques"
              subGroups={MOCK_STATS_SUBGROUPS}
              onCourseClick={handleCourseClick}
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>

          {/* 5. Populaires cette semaine → Social proof */}
          <section className="mb-6">
            <CourseRow
              title="Populaires cette semaine"
              courses={MOCK_TRENDING_COURSES}
              onCourseClick={handleCourseClick}
              showProgress={false}
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>

          {/* 6. Revoir → Révision (cours terminés) */}
          <section className="mb-6">
            <CourseRow
              title="Revoir"
              courses={MOCK_COMPLETED_COURSES}
              onCourseClick={handleCourseClick}
              showProgress={true}
              emptyMessage="Tu n'as pas encore terminé de cours"
              onToggleFavorite={(courseId) => console.log('Toggle favorite:', courseId)}
            />
          </section>
        </div>
      </main>

      {/* ================================================================ */}
      {/* MOBILE BOTTOM NAV */}
      {/* ================================================================ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2 px-2">
          {navigationItems.slice(0, 4).map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <IconComponent size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onStartCourse={handleStartCourse}
        />
      )}
    </div>
  );
}

export default NetflixDashboard;


