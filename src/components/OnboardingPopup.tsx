'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Play, Clock, ArrowRight, ChevronLeft, ChevronRight, X, ChevronDown, Volume2, VolumeX, Gift, Star, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { LeadCaptureModal } from './LeadCaptureModal';

// Scanning data for the animation
interface ScanningProgram {
  id: string;
  name: string;
  totalChapters: number;
  extractedTracks: number;
  chapters: string[];
  relevantChapters: string[];
}

const SCANNING_PROGRAMS: ScanningProgram[] = [
  {
    id: 'physics',
    name: 'Physics Mastery',
    totalChapters: 47,
    extractedTracks: 5,
    chapters: [
      'Mécanique newtonienne', 'Cinématique', 'Dynamique', 'Travail et énergie',
      'Quantité de mouvement', 'Rotation', 'Gravitation', 'Oscillations',
      'Ondes mécaniques', 'Thermodynamique',
    ],
    relevantChapters: ['Mécanique newtonienne', 'Dynamique', 'Travail et énergie', 'Ondes mécaniques'],
  },
  {
    id: 'mathematics',
    name: 'Mathematics Mastery',
    totalChapters: 63,
    extractedTracks: 5,
    chapters: [
      'Algèbre linéaire', 'Calcul différentiel', 'Calcul intégral', 'Équations différentielles',
      'Probabilités', 'Statistiques', 'Géométrie analytique', 'Trigonométrie',
      'Nombres complexes', 'Suites et séries',
    ],
    relevantChapters: ['Algèbre linéaire', 'Calcul intégral', 'Probabilités'],
  },
  {
    id: 'chemistry',
    name: 'Chemistry Mastery',
    totalChapters: 52,
    extractedTracks: 5,
    chapters: [
      'Structure atomique', 'Tableau périodique', 'Liaisons chimiques', 'Géométrie moléculaire',
      'États de la matière', 'Solutions', 'Réactions chimiques', 'Stœchiométrie',
      'Thermochimie', 'Cinétique chimique',
    ],
    relevantChapters: ['Réactions chimiques', 'Cinétique chimique'],
  }
];

// Program types (one-time purchase, lifetime access)
interface Program {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

const programs: Program[] = [
  {
    id: 'physics',
    name: 'Physics Mastery',
    description: 'Mécanique, Électromagnétisme, Thermodynamique, Ondes',
    price: 999,
    icon: '',
  },
  {
    id: 'mathematics',
    name: 'Mathematics Mastery',
    description: 'Analyse, Algèbre linéaire, Probabilités, Suites',
    price: 1099,
    icon: '',
  },
  {
    id: 'chemistry',
    name: 'Chemistry Mastery',
    description: 'Chimie organique, Acides-bases, Redox, Cinétique',
    price: 799,
    icon: '',
  },
];

// Boosters (optional add-ons)
interface Booster {
  id: string;
  name: string;
  description: string;
  price: number;
}

const boosters: Booster[] = [
  { id: 'planner', name: 'Outil de planification', description: 'Planifie tes sessions d\'étude', price: 15 },
  { id: 'studyrooms', name: 'Study Rooms', description: 'Étudie en groupe virtuel', price: 15 },
  { id: 'generator', name: 'Générateur d\'exercices', description: 'Exercices personnalisés illimités', price: 15 },
  { id: 'whatsapp', name: 'Support WhatsApp', description: 'Accès direct à Zak', price: 15 },
];

const faqs = [
  {
    category: 'Général',
    questions: [
      { q: "Qu'est-ce que Science Made Simple ?", a: "SMS est une plateforme d'apprentissage scientifique avec des cours structurés en Mastery Programs, conçus pour te faire maîtriser les fondamentaux." },
      { q: "C'est vraiment un accès à vie ?", a: "Oui ! Tu paies une seule fois et tu accèdes à ton programme pour toujours, y compris les futures mises à jour." },
      { q: "Où puis-je regarder ?", a: "Sur ordinateur, tablette ou mobile — à tout moment, partout. Ton accès est illimité." },
    ],
  },
  {
    category: 'Paiement',
    questions: [
      { q: "Est-ce un abonnement ?", a: "Non, c'est un paiement unique. Pas de reconduction automatique, pas de frais cachés." },
      { q: "Quels moyens de paiement acceptez-vous ?", a: "Carte bancaire (Visa, Mastercard, Amex) via Stripe, le leader mondial du paiement sécurisé." },
      { q: "Y a-t-il une garantie satisfait ou remboursé ?", a: "Oui, 14 jours de garantie. Si tu n'es pas satisfait, on te rembourse intégralement." },
    ],
  },
];

interface RecommendedCourse {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  gradient: string;
}

type OnboardingPhase = 'loading' | 'transition' | 'scanning' | 'reveal' | 'video' | 'results' | 'membership-intro' | 'membership-plans';

interface OnboardingPopupProps {
  isOpen: boolean;
  onComplete: () => void;
  recommendedCourses?: RecommendedCourse[];
  interests?: string[];
  initialPhase?: OnboardingPhase;
}

// Mock data for recommended courses
const defaultCourses: RecommendedCourse[] = [
  // Physics Mastery
  { id: '1', title: 'NEWTON', subtitle: 'Les 3 Lois du Mouvement', category: 'Physics Mastery', gradient: 'from-[#00c2ff]/20 via-[#00a8e0]/20 to-[#008bc2]/20' },
  { id: '2', title: 'GAUSS', subtitle: 'Électrostatique et Champs', category: 'Physics Mastery', gradient: 'from-indigo-900 via-indigo-800 to-indigo-950' },
  { id: '3', title: 'THERMO', subtitle: 'Entropie & 2ème Principe', category: 'Physics Mastery', gradient: 'from-cyan-900 via-cyan-800 to-cyan-950' },
  { id: '4', title: 'ONDES', subtitle: 'Propagation & Interférences', category: 'Physics Mastery', gradient: 'from-sky-900 via-sky-800 to-sky-950' },
  { id: '5', title: 'OPTIQUE', subtitle: 'Lentilles & Miroirs', category: 'Physics Mastery', gradient: 'from-violet-900 via-violet-800 to-violet-950' },
  // Mathematics Mastery
  { id: '6', title: 'INTÉGRALES', subtitle: 'Calcul et Applications', category: 'Mathematics Mastery', gradient: 'from-emerald-900 via-emerald-800 to-emerald-950' },
  { id: '7', title: 'MATRICES', subtitle: 'Algèbre Linéaire', category: 'Mathematics Mastery', gradient: 'from-green-900 via-green-800 to-green-950' },
  { id: '8', title: 'LIMITES', subtitle: 'Continuité & Dérivées', category: 'Mathematics Mastery', gradient: 'from-teal-900 via-teal-800 to-teal-950' },
  { id: '9', title: 'PROBABILITÉS', subtitle: 'Variables Aléatoires', category: 'Mathematics Mastery', gradient: 'from-lime-900 via-lime-800 to-lime-950' },
  { id: '10', title: 'SUITES', subtitle: 'Convergence & Récurrence', category: 'Mathematics Mastery', gradient: 'from-emerald-800 via-emerald-700 to-emerald-900' },
  // Chemistry Mastery
  { id: '11', title: 'CHIMIE ORG', subtitle: 'Réactions SN1 vs SN2', category: 'Chemistry Mastery', gradient: 'from-pink-900 via-pink-800 to-pink-950' },
  { id: '12', title: 'ACIDES-BASES', subtitle: 'pH et Équilibres', category: 'Chemistry Mastery', gradient: 'from-rose-900 via-rose-800 to-rose-950' },
  { id: '13', title: 'REDOX', subtitle: 'Oxydoréduction', category: 'Chemistry Mastery', gradient: 'from-red-900 via-red-800 to-red-950' },
  { id: '14', title: 'CINÉTIQUE', subtitle: 'Vitesse de Réaction', category: 'Chemistry Mastery', gradient: 'from-orange-900 via-orange-800 to-orange-950' },
  { id: '15', title: 'ATOMES', subtitle: 'Structure Électronique', category: 'Chemistry Mastery', gradient: 'from-amber-900 via-amber-800 to-amber-950' },
];

const defaultInterests = ['Physics Mastery', 'Mathematics Mastery', 'Chemistry Mastery'];

export function OnboardingPopup({ 
  isOpen, 
  onComplete, 
  recommendedCourses = defaultCourses,
  interests = defaultInterests,
  initialPhase = 'loading'
}: OnboardingPopupProps) {
  const [phase, setPhase] = useState<OnboardingPhase>(initialPhase);
  const [loadingStep, setLoadingStep] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(['physics', 'mathematics', 'chemistry']);
  const [boostersEnabled, setBoostersEnabled] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [showPersonalizedContent, setShowPersonalizedContent] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  
  // Scanning state
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanningProgram, setCurrentScanningProgram] = useState(0);
  const [scannedPrograms, setScannedPrograms] = useState<number[]>([]);
  const [currentChapters, setCurrentChapters] = useState<string[]>([]);
  const founderVideoRef = useRef<HTMLVideoElement>(null);
  const [founderVideoMuted, setFounderVideoMuted] = useState(true);
  
  // Computed values for scanning
  const scanningPrograms = SCANNING_PROGRAMS;
  const totalChaptersScanned = scanningPrograms.reduce((acc, p) => acc + p.totalChapters, 0);
  const totalTracksExtracted = scanningPrograms.reduce((acc, p) => acc + p.extractedTracks, 0);
  
  // Testimonials carousel
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const allTestimonials = [
    { name: 'Sarah Mensah', role: 'Étudiante en Médecine', avatar: '👩‍⚕️', text: 'J\'ai validé ma PASS du premier coup grâce à SMS.', program: 'Physics + Chemistry' },
    { name: 'Thomas Lefebvre', role: 'Prépa MPSI', avatar: '👨‍🎓', text: 'Le Training Club m\'a fait gagner un temps fou.', program: 'Mathematics' },
    { name: 'Emma Dubois', role: 'Licence Physique', avatar: '👩‍🔬', text: 'Les explications sont incroyablement claires. J\'ai enfin compris la mécanique quantique !', program: 'Physics' },
    { name: 'Lucas Martin', role: 'Prépa PC', avatar: '👨‍💻', text: 'La chimie organique n\'a plus de secrets pour moi.', program: 'Chemistry' },
    { name: 'Chloé Bernard', role: 'L2 Math-Info', avatar: '👩‍🎓', text: 'Les exercices corrigés m\'ont permis de passer de 8 à 16 de moyenne.', program: 'Mathematics' },
    { name: 'Antoine Roux', role: 'Prépa PCSI', avatar: '🧑‍🔬', text: 'SMS m\'a sauvé mon année. Merci Zak !', program: 'Physics + Mathematics' },
  ];
  
  // Account creation form state
  const [accountForm, setAccountForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [accountErrors, setAccountErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Calculate totals (with 40% discount)
  const programsTotal = selectedPrograms.reduce((sum, id) => {
    const program = programs.find(p => p.id === id);
    return sum + Math.round((program?.price || 0) * 0.6); // 40% off
  }, 0);
  
  const boostersMonthly = 45; // $45/month for all boosters

  // Simulated social proof notifications
  const [currentNotification, setCurrentNotification] = useState(0);
  const socialNotifications = [
    { name: 'Sarah', action: 'vient de terminer', item: 'Chapitre 3 - Newton' },
    { name: 'Marc', action: 'a débloqué', item: 'Physics Mastery' },
    { name: 'Léa', action: 'vient de rejoindre', item: 'la communauté' },
    { name: 'Thomas', action: 'a réussi', item: 'le quiz Thermodynamique' },
    { name: 'Emma', action: 'étudie', item: 'Optique' },
  ];

  // Rotate notifications every 4 seconds
  useEffect(() => {
    if (phase === 'results') {
      const interval = setInterval(() => {
        setCurrentNotification(prev => (prev + 1) % socialNotifications.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [phase, socialNotifications.length]);

  const toggleProgram = (id: string) => {
    setSelectedPrograms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const loadingMessages = [
    'On analyse ton profil',
    'On cible ce qui te fera vraiment progresser',
    'On connecte tes besoins à nos programmes'
  ];

  // Reset phase when popup opens with a specific initialPhase
  useEffect(() => {
    if (isOpen) {
      setPhase(initialPhase);
      if (initialPhase === 'loading') {
        setLoadingStep(0);
        setScanProgress(0);
        setCurrentScanningProgram(0);
        setScannedPrograms([]);
        setCurrentChapters([]);
      }
    }
  }, [isOpen, initialPhase]);

  // Loading animation sequence
  useEffect(() => {
    if (!isOpen) return;

    if (phase === 'loading') {
      const timers: NodeJS.Timeout[] = [];
      
      loadingMessages.forEach((_, index) => {
        const timer = setTimeout(() => {
          setLoadingStep(index);
        }, index * 1200);
        timers.push(timer);
      });

      // After loading messages, go to transition
      const finalTimer = setTimeout(() => {
        setPhase('transition');
      }, loadingMessages.length * 1200 + 500);
      timers.push(finalTimer);

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [isOpen, phase]);

  // Transition phase - brief pause before scanning
  useEffect(() => {
    if (phase !== 'transition') return;
    
    const timer = setTimeout(() => {
      setPhase('scanning');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [phase]);

  // Scanning animation
  useEffect(() => {
    if (phase !== 'scanning') return;
    
    const scanDurationPerProgram = 2500;
    let isActive = true;
    
    const scanProgram = (programIndex: number) => {
      if (!isActive || programIndex >= scanningPrograms.length) {
        if (isActive) {
          // Smooth transition to reveal
          setTimeout(() => {
            setPhase('reveal');
          }, 800);
        }
        return;
      }
      
      setCurrentScanningProgram(programIndex);
      setCurrentChapters([]);
      
      const program = scanningPrograms[programIndex];
      const chapterInterval = scanDurationPerProgram / (program.chapters.length + 2);
      
      program.chapters.forEach((chapter, chapterIndex) => {
        setTimeout(() => {
          if (isActive) {
            setCurrentChapters(prev => [...prev, chapter]);
          }
        }, chapterIndex * chapterInterval);
      });
      
      const progressPerProgram = 100 / scanningPrograms.length;
      const startProgress = programIndex * progressPerProgram;
      const progressInterval = 50;
      const progressSteps = scanDurationPerProgram / progressInterval;
      let step = 0;
      
      const progressTimer = setInterval(() => {
        if (!isActive) {
          clearInterval(progressTimer);
          return;
        }
        step++;
        const progress = startProgress + (step / progressSteps) * progressPerProgram;
        setScanProgress(Math.min(progress, (programIndex + 1) * progressPerProgram));
        
        if (step >= progressSteps) {
          clearInterval(progressTimer);
          setCurrentChapters([]);
          setTimeout(() => {
            setScannedPrograms(prev => [...prev, programIndex]);
            setTimeout(() => scanProgram(programIndex + 1), 200);
          }, 400);
        }
      }, progressInterval);
    };
    
    setTimeout(() => scanProgram(0), 500);
    
    return () => {
      isActive = false;
    };
  }, [phase, scanningPrograms]);

  // Video phase - auto play when entering
  useEffect(() => {
    if (phase === 'video' && founderVideoRef.current) {
      founderVideoRef.current.play();
    }
  }, [phase]);

  const handleCarouselPrev = () => {
    setCarouselIndex(prev => Math.max(0, prev - 1));
  };

  const handleCarouselNext = () => {
    setCarouselIndex(prev => Math.min(recommendedCourses.length - 4, prev + 1));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#0d1317] overflow-y-auto overflow-x-hidden"
      >
        {/* Loading + Transition + Scanning + Reveal Phases */}
        {(phase === 'loading' || phase === 'transition' || phase === 'scanning' || phase === 'reveal') && (
          <div className="min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            
            {/* Logo - Always visible */}
          <motion.div
              layout
              className="flex flex-col items-center"
              animate={{ 
                marginBottom: phase === 'reveal' ? '1rem' : '2rem',
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.4, 0, 0.2, 1] 
              }}
            >
            <motion.div
                animate={(phase === 'loading' || phase === 'transition' || phase === 'scanning') ? {
                scale: [1, 1.08, 1],
                opacity: [0.7, 1, 0.7]
                } : {
                  scale: 1,
                  opacity: 1
              }}
                transition={(phase === 'loading' || phase === 'transition' || phase === 'scanning') ? {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
                } : {
                  duration: 0.5
              }}
            >
              <Image 
                src="/brand/onboarding-logo.svg" 
                alt="Science Made Simple" 
                width={140} 
                height={140}
                className="object-contain"
              />
              </motion.div>
            </motion.div>

            {/* Content Area */}
            <div className="relative w-full max-w-2xl min-h-[400px] flex flex-col items-center">
              
              {/* Loading & Scanning Content */}
              <AnimatePresence mode="wait">
                {phase !== 'reveal' && (
                  <motion.div
                    key="pre-reveal"
                    className="flex flex-col items-center w-full"
                    initial={{ opacity: 1 }}
                    exit={{ 
                      opacity: 0,
                      scale: 0.95,
                      filter: "blur(10px)"
                    }}
                    transition={{ 
                      duration: 0.6, 
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
            {/* Loading Messages */}
                    <div className="space-y-5 text-center mb-8">
                      {loadingMessages.map((message, index) => {
                        const isLastMessage = index === loadingMessages.length - 1;
                        const showHeader = phase === 'transition' || phase === 'scanning';
                        
                        return (
                <motion.p
                  key={message}
                  initial={{ opacity: 0.2 }}
                  animate={{ 
                              opacity: showHeader 
                                ? (isLastMessage ? 1 : 0) 
                                : (loadingStep >= index ? 1 : 0.3),
                              height: showHeader && !isLastMessage ? 0 : 'auto',
                              marginBottom: showHeader && !isLastMessage ? 0 : undefined,
                  }}
                  transition={{ duration: 0.5 }}
                            className="text-2xl md:text-3xl font-bold overflow-hidden"
                            style={{ color: '#ffffff' }}
                >
                  {message}
                </motion.p>
                        );
                      })}
                    </div>

                    {/* Scanning Content */}
                    <AnimatePresence>
                      {phase === 'scanning' && (
                        <motion.div
                          key="scanning-content"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="flex flex-col items-center w-full"
                        >
                          {/* Programs being scanned */}
                          <div className="w-full space-y-6 mb-8">
                            {scanningPrograms.map((program, index) => {
                              const isProgramScanning = index === currentScanningProgram && phase === 'scanning';
                              const isComplete = scannedPrograms.includes(index);
                              const isVisible = index <= currentScanningProgram || scannedPrograms.includes(index);
                              
                              if (!isVisible) return null;
                              
                              return (
                                <motion.div
                                  key={program.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4 }}
                                  className="w-full"
                                >
                                  <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-lg text-white">{program.name}</span>
                                        {isComplete && (
                                          <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-[#00c2ff]"
                                          >
                                            <CheckCircle size={18} />
                                          </motion.span>
                                        )}
                                        {isProgramScanning && (
                                          <Loader2 size={18} className="text-white/70 animate-spin" />
                                        )}
                                      </div>
                                      <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                                        {program.totalChapters} chapitres
                                      </div>
                                    </div>
                                    
                                    <div className="text-right">
                                      <span className="text-2xl font-bold text-white">
                                        {isComplete ? program.extractedTracks : isProgramScanning ? Math.min(Math.floor(currentChapters.length / 2), program.extractedTracks) : 0}
                                      </span>
                                      <span className="text-sm ml-1" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>parcours</span>
                                    </div>
                                  </div>
                                  
                                  {(isProgramScanning || isComplete) && (
                                    <motion.div 
                                      className="h-1 rounded-full bg-gray-800/50 mb-4 overflow-hidden"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                    >
                                      <motion.div 
                                        className="h-full rounded-full bg-[#00c2ff]/60"
                                        initial={{ width: 0 }}
                                        animate={{ width: isComplete ? '100%' : `${(currentChapters.length / program.chapters.length) * 100}%` }}
                                        transition={{ duration: 0.1 }}
                                      />
                                    </motion.div>
                                  )}

                                  <AnimatePresence>
                                    {isProgramScanning && currentChapters.length > 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mb-2"
                                      >
                                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">
                                          Chapitres analysés
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {currentChapters.map((chapter, chapterIndex) => {
                                            const isRelevant = program.relevantChapters.includes(chapter);
                                            
                                            return (
                                              <motion.span
                                                key={`${program.id}-${chapterIndex}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`px-3 py-1 rounded-full text-xs border ${
                                                  isRelevant 
                                                    ? 'bg-[#00c2ff]/20 text-[#00c2ff] border-[#00c2ff]/50 font-medium' 
                                                    : 'bg-gray-800/50 text-white/60 border-gray-700/50'
                                                }`}
                                              >
                                                {chapter}
                                              </motion.span>
                                            );
                                          })}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                  
                                  {isComplete && index < scanningPrograms.length - 1 && (
                                    <div className="border-b border-gray-700/30 mt-4" />
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Overall progress bar */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full"
                          >
                            <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                              <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00c2ff]/50 to-[#00c2ff] rounded-full"
                                style={{ width: `${scanProgress}%` }}
                              />
                            </div>
                            <div className="flex justify-between mt-2 text-xs" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                              <span>{Math.floor((scanProgress / 100) * totalChaptersScanned)} / {totalChaptersScanned} chapitres</span>
                              <span>{Math.floor(scanProgress)}%</span>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reveal Content */}
              <AnimatePresence>
                {phase === 'reveal' && (
                  <motion.div
                    key="reveal"
                    className="flex flex-col items-center w-full max-w-3xl"
                    initial={{ 
                      opacity: 0,
                      scale: 1.05,
                      filter: "blur(10px)"
                    }}
                    animate={{ 
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)"
                    }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.4, 0, 0.2, 1],
                      delay: 0.2
                    }}
                  >
                    {/* Big Number */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0.4,
                        type: "spring",
                        stiffness: 120,
                        damping: 15
                      }}
                      className="mb-2"
                    >
                      <span 
                        className="text-9xl md:text-[12rem] font-black text-white leading-none"
                        style={{ fontFamily: "'Parafina', sans-serif" }}
                      >
                        {totalTracksExtracted}
                      </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                      className="text-2xl md:text-4xl font-bold text-center mb-3 uppercase tracking-wider"
                      style={{ fontFamily: "'Parafina', sans-serif", color: '#ffffff' }}
                    >
                      Parcours créés pour toi
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
                      className="text-center mb-8"
                      style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      basés sur les Mastery Programs suivants
                    </motion.p>

                    {/* Program List */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                      className="flex flex-col items-center gap-3 mb-8"
                    >
                      {scanningPrograms.map((program, index) => (
                        <motion.div
                          key={program.id}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 1.1 + index * 0.1, ease: "easeOut" }}
                          className="flex items-center gap-3 text-lg"
                        >
                          <span className="font-semibold text-white">{program.name}</span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>•</span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{program.totalChapters} chapitres</span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>•</span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.75)' }}>{program.extractedTracks} parcours</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Punchy one-liner */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.5 }}
                      className="text-2xl md:text-3xl font-bold text-center mb-8"
                      style={{ color: '#ffffff' }}
                    >
                      Parcours illimités<span className="text-[#00c2ff]">.</span> À vie<span className="text-[#00c2ff]">.</span>
                    </motion.p>

                    {/* CTA Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.7, ease: "easeOut" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPhase('results')}
                      className="px-10 py-4 bg-[#00c2ff] hover:bg-[#00b0e8] text-white font-semibold rounded-full transition-all flex items-center gap-3 shadow-lg shadow-[#00c2ff]/25"
                    >
                      Continuer
                      <ArrowRight size={20} />
                    </motion.button>

                    {/* Trust badge */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.9 }}
                      className="mt-6 text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      Paiement unique · Accès à vie
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}


        {/* Results Phase */}
        {phase === 'results' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-full flex flex-col"
          >
            {/* Header - Always visible */}
            <header className="sticky top-0 bg-[#0d1317]/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 z-20">
              <div className="max-w-7xl mx-auto flex items-center justify-between relative">
                {/* Left - Logo */}
                <div className="w-[85px]">
                <Image 
                  src="/brand/onboarding-logo.svg" 
                  alt="Science Made Simple" 
                  width={85} 
                  height={85}
                />
                </div>
                
                {/* Center - Progress Steps */}
                <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
                  {['Tes cours', 'Offre', 'Finaliser'].map((step, idx) => {
                    const isCompleted = idx < 0; // Phase results = step 0
                    const isCurrent = idx === 0;
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-[#00c2ff]' 
                              : isCurrent 
                                ? 'bg-[#00c2ff] ring-[5px] ring-[#00c2ff]/30' 
                                : 'bg-gray-600'
                          }`} />
                          <span className={`text-[11px] md:text-sm mt-2 font-semibold hidden md:block !text-white ${
                            isCompleted || isCurrent ? 'opacity-100' : 'opacity-50'
                          }`}>
                            {step}
                          </span>
                        </div>
                        {idx < 2 && (
                          <div className={`w-14 md:w-24 h-1.5 rounded-full ${
                            isCompleted ? 'bg-[#00c2ff]' : 'bg-gray-700'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                
                {/* Right - Button placeholder */}
                <div className="w-[85px] flex justify-end">
                  {showPersonalizedContent && (
                <button
                      onClick={() => setShowPersonalizedContent(false)}
                      className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                      <Play size={14} className="rotate-180" />
                      Revoir la vidéo
                </button>
                  )}
                </div>
              </div>
            </header>

            {/* ============================================ */}
            {/* BLOC 1: Vidéo Founder (affiché par défaut) */}
            {/* ============================================ */}
            {!showPersonalizedContent && (
              <div className="flex-1 flex flex-col bg-[#0d1317]">
                {/* Video Container - Full Screen Local Video */}
                <div className="flex-1 relative min-h-[50vh]">
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/mentors/Zak-onboarding.mp4"
                    autoPlay
                    loop
                    muted={videoMuted}
                    playsInline
                  />
                  
                  {/* Overlay gradient en bas */}
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d1317] to-transparent pointer-events-none" />
                  
                  {/* Volume Control - Bottom Left */}
                  <button
                    onClick={() => setVideoMuted(!videoMuted)}
                    className="absolute bottom-6 left-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  >
                    {videoMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                  </button>
                </div>
                
                {/* Bouton pour voir le contenu personnalisé */}
                <div className="p-6 flex flex-col items-center gap-4">
                  <span className="text-gray-400 text-lg font-medium italic">
                    Voir mon contenu personnalisé
                  </span>
                  <button
                    onClick={() => setShowPersonalizedContent(true)}
                    className="w-14 h-14 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-300 transition-all"
                  >
                    <ChevronDown size={24} />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* BLOC 2: Contenu Personnalisé (masqué par défaut) */}
            {/* ============================================ */}
            {showPersonalizedContent && (
              <>
            {/* Deal Banner - Full width below header */}
            <div className="bg-[#0d1317] w-full border-b border-gray-800">
              <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 py-2.5 md:py-4 px-3 md:px-4" style={{ fontSize: '16px' }}>
                <span className="text-[#48c6ed] font-bold tracking-wide uppercase whitespace-nowrap text-[10px] sm:text-xs md:text-base">
                  OFFRE DE LANCEMENT
                </span>
                <span className="px-2 md:px-3 py-1 md:py-1.5 border border-[#48c6ed] rounded-full text-[#48c6ed] font-bold text-xs md:text-base">
                      -40%
                </span>
                <div className="flex items-center gap-0.5 md:gap-1 text-white font-bold tabular-nums text-xs md:text-base">
                  <span>02</span>
                  <span className="text-white text-[8px] md:text-xs font-normal">j</span>
                  <span>23</span>
                  <span className="text-white text-[8px] md:text-xs font-normal">h</span>
                  <span>59</span>
                  <span className="text-white text-[8px] md:text-xs font-normal">m</span>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-16">
              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-12 gap-6 md:gap-12 mb-8 md:mb-16">
                
                {/* Left Column - Info */}
                <div className="lg:col-span-7">
                  {/* Course Count + Title */}
                  <div className="flex items-start gap-4 md:gap-6 mb-6 md:mb-10">
                    {/* Badge nombre de cours prescrits - format carré arrondi, accent thème */}
                    <div className="flex items-center gap-5 flex-shrink-0">
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl border-2 md:border-[3px] border-[#00c2ff] flex items-center justify-center">
                        <span className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-none" style={{ fontFamily: "'Parafina', sans-serif" }}>
                          {recommendedCourses.length}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-4xl lg:text-5xl font-black !text-white leading-tight mb-1 md:mb-2 uppercase" style={{ fontFamily: 'var(--font-parafina)' }}>
                        Parcours conçus pour toi
                      </h1>
                      <p className="text-sm md:text-lg !text-white">
                        basés sur {interests.length} Mastery Programs
                      </p>
                    </div>
                  </div>

                  {/* Programme Cards */}
                  <div className="space-y-2 md:space-y-3">
                    {programs.map(program => {
                      const programCourses = recommendedCourses.filter(c => 
                        c.category.toLowerCase().includes(program.id)
                      );
                      return (
                        <div 
                          key={program.id}
                          className="p-3 md:p-4 bg-[#1a1f24] rounded-lg md:rounded-xl border border-gray-700/50 hover:border-[#00c2ff]/50 hover:bg-[#00c2ff]/5 transition-all cursor-pointer"
                          onClick={() => {
                            const element = document.getElementById(`carousel-${program.id}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-0.5 md:mb-1">
                            <span className="text-base md:text-lg font-semibold !text-white">{program.name}</span>
                            <span className="text-base md:text-lg font-bold text-white">{program.price}€</span>
                          </div>
                          <p className="text-xs md:text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                            {program.id === 'physics' ? '47' : program.id === 'mathematics' ? '63' : '52'} chapitres • {programCourses.length} parcours créés pour toi
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column - CTA Card */}
                <div className="lg:col-span-5 mt-4 lg:mt-0">
                  <div className="bg-[#141414] rounded-xl p-4 md:p-6 border border-gray-800">
                    {/* Success Message */}
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-white text-sm md:text-base">
                        Paiement unique. Accès à vie.
                      </span>
                    </div>

                    {/* CTA Buttons */}
                    <button
                      onClick={() => setShowLeadCapture(true)}
                      className="w-full bg-[#48c6ed] hover:bg-[#3ab5dc] text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-base md:text-lg transition-all mb-2 md:mb-3 flex items-center justify-center gap-2"
                    >
                      Débloquer 10h gratuites
                      <ArrowRight size={18} className="md:w-5 md:h-5" />
                    </button>
                    <button
                      onClick={() => setPhase('membership-plans')}
                      className="w-full bg-transparent hover:bg-white/5 text-white font-medium py-2.5 md:py-3 px-4 md:px-6 rounded-full text-sm md:text-lg transition-all border border-gray-600 flex items-center justify-center gap-2"
                    >
                      Débloquer mes programmes
                      <span className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/50 flex items-center justify-center">
                        <ArrowRight size={10} className="md:w-3 md:h-3" />
                      </span>
                    </button>
                  </div>
                  
                  {/* Social proof - Students counter */}
                  <div className="flex items-center justify-center gap-2 mt-3 md:mt-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-xs md:text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      <span className="font-bold text-white">127</span> étudiants ont rejoint cette semaine
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Rows - One per Mastery Program */}
              {interests.map((interest, rowIndex) => {
                const coursesForProgram = recommendedCourses.filter(c => c.category === interest);
                const programId = interest.toLowerCase().includes('physics') ? 'physics' 
                  : interest.toLowerCase().includes('math') ? 'mathematics' 
                  : 'chemistry';
                
                return (
                  <div key={interest} id={`carousel-${programId}`} className="mb-16 scroll-mt-48">
                    {/* Row Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl md:text-3xl font-bold !text-white">
                          {interest}
                          <span className="!text-white font-normal text-lg ml-3">
                            {coursesForProgram.length} parcours
                          </span>
                        </h2>
                      </div>

                      {/* Carousel Controls */}
                      <div className="flex items-center gap-4">
                        {/* Bouton Tester mes connaissances */}
                        <button
                          onClick={() => {
                            const subject = interest.toLowerCase().includes('physics') ? 'physics' 
                              : interest.toLowerCase().includes('math') ? 'math' 
                              : 'chemistry';
                            window.open(`/assessment/${subject}`, '_blank');
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-full transition-colors"
                        >
                          Tester mes connaissances
                        </button>
                        
                        <div className="flex gap-2">
                          <button
                            className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-white transition-all"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-white transition-all"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Course Cards Row */}
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                      {coursesForProgram.map((course) => (
                        <div
                          key={course.id}
                          className="flex-shrink-0 w-52 group cursor-pointer"
                          onClick={() => setShowLeadCapture(true)}
                        >
                          {/* Course Card */}
                          <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl overflow-hidden mb-3 transition-transform group-hover:scale-[1.02]">
                            {/* Course Title Overlay */}
                            <div className="absolute inset-0 flex flex-col justify-end p-4">
<h3 className="!text-white font-bold text-xl leading-tight tracking-tight mb-1">
                              {course.title}
                            </h3>
                              <div className="w-8 h-0.5 bg-white/40 mb-2" />
<p className="!text-white/80 text-xs font-medium">
                              {course.subtitle}
                            </p>
                            </div>

                            {/* Play Button on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

            </div>
              </>
            )}
          </motion.div>
        )}

        {/* Membership Intro Phase - Screen 1 */}
        {phase === 'membership-intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-full"
          >
            {/* Header */}
            <header className="sticky top-0 bg-[#0d1317]/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 z-20">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Image 
                  src="/brand/onboarding-logo.svg" 
                  alt="Science Made Simple" 
                  width={85} 
                  height={85}
                />
                
                {/* Progress Steps - 4 steps */}
                <div className="flex items-center gap-3">
                  {['Tes cours', 'Compte', 'Offre', 'Finaliser'].map((step, idx) => {
                    const isCompleted = idx < 0; // No step completed yet at membership-intro
                    const isCurrent = idx === 0; // Currently showing "Tes cours" info
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-[#00c2ff]' 
                              : isCurrent 
                                ? 'bg-[#00c2ff] ring-[5px] ring-[#00c2ff]/30' 
                                : 'bg-gray-600'
                          }`} />
                          <span className={`text-[11px] md:text-sm mt-2 font-semibold hidden md:block !text-white ${
                            isCompleted || isCurrent ? 'opacity-100' : 'opacity-50'
                          }`}>
                            {step}
                          </span>
                        </div>
                        {idx < 3 && (
                          <div className={`w-10 md:w-16 h-1.5 rounded-full ${
                            isCompleted ? 'bg-[#00c2ff]' : 'bg-gray-700'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPhase('results')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </header>

            {/* Promo Banner */}
            <div className="bg-[#00c2ff]/10 border-b border-[#00c2ff]/30 py-3 px-6">
              <p className="text-center">
                <span className="text-[#00c2ff] font-bold">LIFETIME ACCESS</span>
                <span className="text-white ml-2">Paiement unique</span>
              </p>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-6 py-16">
              <h1 className="text-3xl md:text-4xl font-bold !text-white text-center mb-4">
                Paiement unique. Accès à vie.
              </h1>
              <p className="text-center text-gray-400 mb-12">
                Pas d'abonnement. Pas de reconduction. Tu paies une fois, tu accèdes pour toujours.
              </p>

              <ul className="space-y-6 mb-12">
                <li className="flex items-center gap-4">
                  <Check className="w-6 h-6 text-[#00c2ff]" strokeWidth={2} />
                  <span className="!text-white text-lg font-medium">Accès à vie à tes Mastery Programs</span>
                </li>
                <li className="flex items-center gap-4">
                  <Check className="w-6 h-6 text-[#00c2ff]" strokeWidth={2} />
                  <span className="!text-white text-lg">{recommendedCourses.length}+ cours vidéo, enseignés par des experts</span>
                </li>
                <li className="flex items-center gap-4">
                  <Check className="w-6 h-6 text-[#00c2ff]" strokeWidth={2} />
                  <span className="!text-white text-lg">Mises à jour gratuites incluses à vie</span>
                </li>
              </ul>

              <button
                onClick={() => setPhase('account-creation')}
                className="w-full bg-[#00c2ff] hover:bg-[#00d4ff] text-white font-bold py-4 px-8 rounded-lg text-lg transition-all"
              >
                Choisir mes programmes
              </button>
            </div>
          </motion.div>
        )}

        {/* Account Creation Phase - NOW SECOND STEP after choosing programs */}
        {phase === 'account-creation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-full"
          >
            {/* Header */}
            <header className="sticky top-0 bg-[#0d1317]/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 z-20">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Image 
                  src="/brand/onboarding-logo.svg" 
                  alt="Science Made Simple" 
                  width={85} 
                  height={85}
                />
                
                {/* Progress Steps - 3 steps: Offre → Compte → Finaliser */}
                <div className="flex items-center gap-3">
                  {['Offre', 'Compte', 'Finaliser'].map((step, idx) => {
                    const isCompleted = idx < 1; // Step 0 (Offre) is completed
                    const isCurrent = idx === 1; // Currently on step 1 (Compte)
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-[#00c2ff]' 
                              : isCurrent 
                                ? 'bg-[#00c2ff] ring-[5px] ring-[#00c2ff]/30' 
                                : 'bg-gray-600'
                          }`} />
                          <span className={`text-[11px] md:text-sm mt-2 font-semibold hidden md:block !text-white ${
                            isCompleted || isCurrent ? 'opacity-100' : 'opacity-50'
                          }`}>
                            {step}
                          </span>
                        </div>
                        {idx < 2 && (
                          <div className={`w-10 md:w-16 h-1.5 rounded-full ${
                            isCompleted ? 'bg-[#00c2ff]' : 'bg-gray-700'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPhase('membership-plans')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="max-w-xl mx-auto px-6 py-12">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold !text-white mb-3">
                  Crée ton compte pour sécuriser ton accès
                </h1>
                <p className="!text-white/70 text-lg">
                  Ton compte te permettra d'accéder à tes programmes sélectionnés en toute sécurité
                </p>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium !text-white/80 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={accountForm.firstName}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Jean"
                      className={`w-full px-4 py-3.5 bg-gray-800/50 border ${accountErrors.firstName ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00c2ff] focus:ring-1 focus:ring-[#00c2ff] transition-all`}
                    />
                    {accountErrors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{accountErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium !text-white/80 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={accountForm.lastName}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Dupont"
                      className={`w-full px-4 py-3.5 bg-gray-800/50 border ${accountErrors.lastName ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00c2ff] focus:ring-1 focus:ring-[#00c2ff] transition-all`}
                    />
                    {accountErrors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{accountErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium !text-white/80 mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={accountForm.email}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="jean.dupont@email.com"
                    className={`w-full px-4 py-3.5 bg-gray-800/50 border ${accountErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00c2ff] focus:ring-1 focus:ring-[#00c2ff] transition-all`}
                  />
                  {accountErrors.email && (
                    <p className="text-red-400 text-sm mt-1">{accountErrors.email}</p>
                  )}
                </div>

                {/* Phone with OTP */}
                <div>
                  <label className="block text-sm font-medium !text-white/80 mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="tel"
                      value={accountForm.phone}
                      onChange={(e) => {
                        setAccountForm(prev => ({ ...prev, phone: e.target.value }));
                        setOtpSent(false);
                        setOtpVerified(false);
                        setOtpCode('');
                      }}
                      placeholder="+32 470 12 34 56"
                      disabled={otpVerified}
                      className={`flex-1 px-4 py-3.5 bg-gray-800/50 border ${accountErrors.phone ? 'border-red-500' : otpVerified ? 'border-green-500' : 'border-gray-700'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00c2ff] focus:ring-1 focus:ring-[#00c2ff] transition-all ${otpVerified ? 'opacity-70' : ''}`}
                    />
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={() => {
                          if (accountForm.phone.trim()) {
                            // TODO: Send OTP via SMS
                            console.log('Sending OTP to:', accountForm.phone);
                            setOtpSent(true);
                            setOtpError('');
                          }
                        }}
                        disabled={!accountForm.phone.trim() || otpSent}
                        className={`px-4 py-3.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                          accountForm.phone.trim() && !otpSent
                            ? 'bg-[#00c2ff] hover:bg-[#00d4ff] text-white'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {otpSent ? 'Code envoyé' : 'Envoyer code'}
                      </button>
                    )}
                    {otpVerified && (
                      <div className="flex items-center px-4 text-green-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {accountErrors.phone && (
                    <p className="text-red-400 text-sm mt-1">{accountErrors.phone}</p>
                  )}
                </div>

                {/* OTP Input - Shows after sending code */}
                {otpSent && !otpVerified && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-medium !text-white/80 mb-2">
                      Code de vérification
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        className={`flex-1 px-4 py-3.5 bg-gray-800/50 border ${otpError ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00c2ff] focus:ring-1 focus:ring-[#00c2ff] transition-all text-center text-xl tracking-[0.5em] font-mono`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          // TODO: Verify OTP with backend
                          if (otpCode === '123456' || otpCode.length === 6) {
                            setOtpVerified(true);
                            setOtpError('');
                          } else {
                            setOtpError('Code invalide');
                          }
                        }}
                        disabled={otpCode.length !== 6}
                        className={`px-6 py-3.5 rounded-xl font-medium transition-all ${
                          otpCode.length === 6
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Vérifier
                      </button>
                    </div>
                    {otpError && (
                      <p className="text-red-400 text-sm mt-1">{otpError}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        // Resend OTP
                        console.log('Resending OTP to:', accountForm.phone);
                      }}
                      className="text-[#00c2ff] hover:text-[#00d4ff] text-sm mt-2 transition-colors"
                    >
                      Renvoyer le code
                    </button>
                  </motion.div>
                )}

                {/* Terms and Conditions Checkbox */}
                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                        acceptedTerms 
                          ? 'bg-[#00c2ff] border-[#00c2ff]' 
                          : 'border-gray-500 group-hover:border-gray-400'
                      }`}>
                        {acceptedTerms && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-300 leading-relaxed">
                      J'accepte les{' '}
                      <a href="/terms" target="_blank" className="text-[#00c2ff] hover:text-[#00d4ff] underline">
                        Conditions Générales d'Utilisation
                      </a>{' '}
                      et la{' '}
                      <a href="/privacy" target="_blank" className="text-[#00c2ff] hover:text-[#00d4ff] underline">
                        Politique de Confidentialité
                      </a>
                    </span>
                  </label>
                  {accountErrors.terms && (
                    <p className="text-red-400 text-sm mt-1 ml-8">{accountErrors.terms}</p>
                  )}
                </div>

                {/* Trust indicators */}
                <div className="flex items-center gap-2 text-gray-400 text-sm pt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Tes données sont sécurisées et ne seront jamais partagées</span>
                </div>

                {/* Submit Button - Goes to Stripe (final step) */}
                <button
                  onClick={() => {
                    // Validate form
                    const errors: Record<string, string> = {};
                    if (!accountForm.firstName.trim()) errors.firstName = 'Prénom requis';
                    if (!accountForm.lastName.trim()) errors.lastName = 'Nom requis';
                    if (!accountForm.email.trim()) errors.email = 'Email requis';
                    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountForm.email)) errors.email = 'Email invalide';
                    if (!accountForm.phone.trim()) errors.phone = 'Téléphone requis';
                    if (!otpVerified) errors.phone = 'Vérifie ton numéro avec le code SMS';
                    if (!acceptedTerms) errors.terms = 'Tu dois accepter les conditions';
                    
                    setAccountErrors(errors);
                    
                    if (Object.keys(errors).length === 0) {
                      // TODO: Create account in backend
                      console.log('Creating account:', accountForm);
                      // Redirect to Stripe payment
                      const items = selectedPrograms.join(',');
                      const boostersParam = boostersEnabled ? '&boosters=true' : '';
                      window.open(`https://buy.stripe.com/checkout?programs=${items}&total=${programsTotal}${boostersParam}&email=${encodeURIComponent(accountForm.email)}&name=${encodeURIComponent(accountForm.firstName + ' ' + accountForm.lastName)}`, '_blank');
                    }
                  }}
                  disabled={!accountForm.firstName || !accountForm.lastName || !accountForm.email || !otpVerified || !acceptedTerms}
                  className={`w-full py-4 px-8 rounded-xl text-lg font-bold transition-all mt-4 ${
                    accountForm.firstName && accountForm.lastName && accountForm.email && otpVerified && acceptedTerms
                      ? 'bg-[#00c2ff] hover:bg-[#00d4ff] text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Finaliser mon accès
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Membership Plans Phase - NOW FIRST STEP after "Finaliser l'inscription" */}
        {phase === 'membership-plans' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-full bg-[#0a0c10]"
          >
            {/* Header with Breadcrumb */}
            <header className="sticky top-0 bg-[#0a0c10]/95 backdrop-blur-sm border-b border-white/5 px-6 py-4 z-20">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Image 
                  src="/brand/onboarding-logo.svg" 
                  alt="Science Made Simple" 
                  width={85} 
                  height={85}
                />
                
                {/* Progress Steps - 3 steps: Offre → Compte → Finaliser */}
                <div className="flex items-center gap-3">
                  {['Offre', 'Compte', 'Finaliser'].map((step, idx) => {
                    const isCompleted = idx < 0;
                    const isCurrent = idx === 0;
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-[#00c2ff]' 
                              : isCurrent 
                                ? 'bg-[#00c2ff] ring-[5px] ring-[#00c2ff]/30' 
                                : 'bg-gray-600'
                          }`} />
                          <span className={`text-[11px] md:text-sm mt-2 font-semibold hidden md:block !text-white ${
                            isCompleted || isCurrent ? 'opacity-100' : 'opacity-50'
                          }`}>
                            {step}
                          </span>
                        </div>
                        {idx < 2 && (
                          <div className={`w-10 md:w-16 h-1.5 rounded-full ${
                            isCompleted ? 'bg-[#00c2ff]' : 'bg-gray-700'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPhase('results')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </header>

            {/* Urgency Banner */}
            <div className="bg-[#00c2ff] py-3 px-4">
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Gift size={18} />
                  <span className="font-medium">Offre Spéciale -40%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} />
                  <span className="text-sm">Expire dans</span>
                  <div className="flex items-center gap-2 font-mono font-bold">
                    <span className="bg-white/20 px-2 py-1 rounded">02</span>
                    <span>:</span>
                    <span className="bg-white/20 px-2 py-1 rounded">47</span>
                    <span>:</span>
                    <span className="bg-white/20 px-2 py-1 rounded">33</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-10">
              <div className="grid lg:grid-cols-3 gap-10">
                {/* Left Column: Programs & Boosters */}
                <div className="lg:col-span-2 space-y-10">
              {/* Programs Section */}
                  <section>
                    <h2 className="text-3xl font-bold !text-white mb-6">Choisis tes programmes</h2>
                    
                    <div className="space-y-3">
                      {programs.map((program) => {
                        const discountedPrice = Math.round(program.price * 0.6);
                        const discount = 40;
                        return (
                    <div
                      key={program.id}
                      onClick={() => toggleProgram(program.id)}
                            className={`relative px-5 py-4 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedPrograms.includes(program.id)
                                ? 'bg-[#00c2ff]/10 border-[#00c2ff]'
                                : 'bg-transparent border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedPrograms.includes(program.id) 
                                    ? 'bg-[#00c2ff] border-[#00c2ff]' 
                                    : 'border-white/30 bg-transparent'
                          }`}>
                                  {selectedPrograms.includes(program.id) && <Check size={16} className="text-white" strokeWidth={3} />}
                          </div>
                                <span className="font-semibold text-white" style={{ fontSize: '19px' }}>{program.name}</span>
                        </div>
                              
                              <div className="flex items-center gap-3">
                                <span className="text-white/40 line-through text-sm">${program.price}</span>
                                <span className="text-xl font-bold text-white">${discountedPrice}</span>
                                <span className="px-2.5 py-1 bg-[#00c2ff] text-white text-xs font-bold rounded-md">
                                  -{discount}%
                                </span>
                        </div>
                      </div>
                    </div>
                        );
                      })}
                </div>
                  </section>

              {/* Boosters Section */}
                  <section>
                <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold !text-white">Boosters</h2>
                      <span className="text-sm text-white/50">Optionnel</span>
                </div>
                
                <div
                  onClick={() => setBoostersEnabled(!boostersEnabled)}
                      className={`relative px-5 py-4 rounded-xl cursor-pointer transition-all border-2 ${
                    boostersEnabled
                          ? 'bg-[#00c2ff]/10 border-[#00c2ff]'
                          : 'bg-transparent border-white/10 hover:border-white/20'
                  }`}
                >
                      <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        boostersEnabled 
                              ? 'bg-[#00c2ff] border-[#00c2ff]' 
                              : 'border-white/30 bg-transparent'
                      }`}>
                            {boostersEnabled && <Check size={16} className="text-white" strokeWidth={3} />}
                      </div>
                      <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white" style={{ fontSize: '19px' }}>Pack Complet (4 Boosters)</span>
                              <span className="px-2 py-0.5 bg-[#00c2ff] text-white text-xs font-bold rounded-md">-25%</span>
                      </div>
                            <p className="text-sm !text-white/90 mt-0.5">Planification · Study Rooms · Suivi Apprentissage · Examen blanc</p>
                    </div>
                        </div>
                        
                      <div className="flex items-center gap-2">
                          <span className="text-white/40 line-through text-sm">$60</span>
                          <span className="text-xl font-bold text-white">$45</span>
                          <span className="text-white/50 text-sm">/mois</span>
                      </div>
                    </div>
                  </div>
                  </section>

                  {/* Benefits */}
                  <section>
                    <h3 className="font-bold !text-white mb-6" style={{ fontSize: '26px' }}>Paiement unique. Accès à vie.</h3>
                    <div className="space-y-4">
                      {[
                        'Tu paies une fois, tu accèdes pour toujours.',
                        'Mises à jour gratuites incluses à vie',
                        '...',
                        '...',
                      ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Check size={20} className="text-[#00c2ff] flex-shrink-0" />
                          <span className="text-white/90">{benefit}</span>
                </div>
                      ))}
              </div>
                  </section>

                  {/* FAQ */}
                  <section>
                    <h3 className="font-semibold !text-white mb-4" style={{ fontSize: '26px' }}>Questions fréquentes</h3>
                    <div className="bg-[#12161a] rounded-2xl border border-white/10 p-4">
                      {[
                        { q: 'L\'accès est-il vraiment à vie ?', a: 'Oui, une fois que vous achetez un programme, vous y avez accès pour toujours. Cela inclut toutes les mises à jour futures du contenu.' },
                        { q: 'Puis-je annuler les boosters à tout moment ?', a: 'Absolument. Le pack boosters est un abonnement mensuel sans engagement. Vous pouvez l\'annuler en un clic.' },
                        { q: 'Comment fonctionne la garantie ?', a: 'Vous avez 14 jours pour tester nos cours. Si vous n\'êtes pas satisfait, nous vous remboursons intégralement.' },
                      ].map((faq, i) => (
                        <div key={i} className="border-b border-white/10 last:border-0">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === `faq-${i}` ? null : `faq-${i}`)}
                            className="w-full py-4 flex items-center justify-between text-left"
                          >
                            <span className="font-medium text-white pr-4">{faq.q}</span>
                            <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${expandedFaq === `faq-${i}` ? 'rotate-180' : ''}`} />
                          </button>
                          {expandedFaq === `faq-${i}` && (
                            <p className="pb-4 text-white/60 text-sm">{faq.a}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column: Order Summary (Sticky) */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <div className="bg-[#12161a] rounded-2xl border border-white/10 overflow-hidden">
                      {/* Header */}
                      <div className="p-5 border-b border-white/10">
                        <h3 className="text-xl font-bold !text-white">Récapitulatif</h3>
                        </div>

                      {/* Selected Items */}
                      <div className="p-5 space-y-3 border-b border-white/10">
                        {selectedPrograms.length === 0 ? (
                          <p className="text-white/40 text-sm text-center py-4">
                            Sélectionne au moins un programme
                          </p>
                        ) : (
                          <>
                            {programs.filter(p => selectedPrograms.includes(p.id)).map((program) => (
                              <div key={program.id} className="flex items-center justify-between">
                                <span className="text-white" style={{ fontSize: '13px' }}>{program.name}</span>
                                <span className="text-white font-medium" style={{ fontSize: '16px' }}>${Math.round(program.price * 0.6)}</span>
                      </div>
                            ))}
                            
                  {boostersEnabled && (
                              <div className="pt-3 mt-3 border-t border-white/10">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-white/70">Pack Boosters</span>
                                  <span className="text-white/70">$45/mois</span>
                      </div>
                    </div>
                            )}
                          </>
                  )}
                </div>

                      {/* Totals */}
                      <div className="p-5 space-y-3 border-b border-white/10">
                        {selectedPrograms.length > 0 && (
                          <div className="flex items-center justify-between text-sm text-green-400">
                            <span>Économies</span>
                            <span>-${selectedPrograms.reduce((sum, id) => {
                              const program = programs.find(p => p.id === id);
                              return sum + (program ? Math.round(program.price * 0.4) : 0);
                            }, 0)}</span>
                          </div>
                        )}
                        
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold">Total aujourd'hui</span>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-white">
                                ${selectedPrograms.reduce((sum, id) => {
                                  const program = programs.find(p => p.id === id);
                                  return sum + (program ? Math.round(program.price * 0.6) : 0);
                                }, 0)}
                              </span>
                              {boostersEnabled && (
                                <p className="text-xs text-white/50">+ $45/mois</p>
                              )}
                            </div>
                  </div>
                </div>
              </div>

                      {/* CTA */}
                      <div className="p-5">
              <button
                onClick={() => setPhase('account-creation')}
                disabled={selectedPrograms.length === 0}
                          className={`w-full py-4 font-bold text-lg rounded-full flex items-center justify-center gap-2 transition-all ${
                            selectedPrograms.length === 0
                              ? 'bg-white/10 text-white/40 cursor-not-allowed'
                              : 'bg-[#00c2ff] text-white hover:bg-[#00d4ff]'
                          }`}
                        >
                          Continuer
                          <ArrowRight size={18} />
              </button>

                        {/* Trust signals */}
                        <div className="mt-4">
                          <div className="flex items-center justify-center gap-4 text-xs text-white/40">
                            <span>Stripe</span>
                            <span>•</span>
                            <span>PayPal</span>
                            <span>•</span>
                            <span>Apple Pay</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Testimonials Carousel */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold !text-white">Ils ont réussi avec SMS</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setTestimonialIndex(prev => Math.max(0, prev - 1))}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
                            disabled={testimonialIndex === 0}
                          >
                            <ChevronLeft size={16} className="text-white" />
                          </button>
                          <button 
                            onClick={() => setTestimonialIndex(prev => Math.min(Math.ceil(allTestimonials.length / 2) - 1, prev + 1))}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
                            disabled={testimonialIndex >= Math.ceil(allTestimonials.length / 2) - 1}
                          >
                            <ChevronRight size={16} className="text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <motion.div 
                          className="flex gap-3"
                          animate={{ x: -testimonialIndex * 100 + '%' }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                          {Array.from({ length: Math.ceil(allTestimonials.length / 2) }).map((_, pageIndex) => (
                            <div key={pageIndex} className="min-w-full space-y-3">
                              {allTestimonials.slice(pageIndex * 2, pageIndex * 2 + 2).map((testimonial, i) => (
                                <div key={i} className="p-4 bg-[#12161a] rounded-xl border border-white/10">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                                      {testimonial.avatar}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                                      <div className="text-xs text-white/50">{testimonial.role}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-0.5 mb-2">
                                    {[...Array(5)].map((_, j) => (
                                      <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                  </div>
                                  <p className="!text-white/90 text-sm mb-2">"{testimonial.text}"</p>
                                  <div className="text-xs text-[#00c2ff]">{testimonial.program}</div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </motion.div>
                      </div>
                      {/* Pagination dots */}
                      <div className="flex justify-center gap-1.5 mt-3">
                        {Array.from({ length: Math.ceil(allTestimonials.length / 2) }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setTestimonialIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              testimonialIndex === i ? 'bg-[#00c2ff]' : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating WhatsApp Button */}
            <a
              href="https://wa.me/33612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed right-6 top-[60%] -translate-y-1/2 z-50 px-6 py-4 bg-[#25D366] rounded-full text-white font-semibold flex items-center gap-3 hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/30 hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              On t'écoute
            </a>
          </motion.div>
        )}

        {/* Lead Capture Modal */}
        <LeadCaptureModal
          isOpen={showLeadCapture}
          onClose={() => setShowLeadCapture(false)}
          onSuccess={() => {
            setShowLeadCapture(false);
            onComplete();
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

