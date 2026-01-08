'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Play, 
  Clock, 
  Users, 
  Zap, 
  BookOpen,
  Target,
  TrendingUp,
  Sparkles,
  Lock,
  ArrowRight,
  RotateCcw,
  Search,
  CheckCircle,
  Circle,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

// Types
interface MasteryProgram {
  id: string;
  name: string;
  totalChapters: number;
  extractedTracks: number;
  price: number;
  originalPrice: number;
  color: string;
  chapters: string[];
}

interface LearningTrack {
  id: string;
  title: string;
  subtitle: string;
  lessons: number;
  duration: string;
  programId: string;
  gradient: string;
}

// Mock Data - Style OnboardingPopup
const MASTERY_PROGRAMS: MasteryProgram[] = [
  {
    id: 'physics',
    name: 'Physics Mastery',
    totalChapters: 47,
    extractedTracks: 5,
    price: 599,
    originalPrice: 999,
    color: '#ffffff',
    chapters: [
      'Mécanique newtonienne',
      'Cinématique',
      'Dynamique',
      'Travail et énergie',
      'Quantité de mouvement',
      'Rotation',
      'Gravitation',
      'Oscillations',
      'Ondes mécaniques',
      'Thermodynamique',
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics Mastery',
    totalChapters: 63,
    extractedTracks: 5,
    price: 659,
    originalPrice: 1099,
    color: '#10b981',
    chapters: [
      'Algèbre linéaire',
      'Calcul différentiel',
      'Calcul intégral',
      'Équations différentielles',
      'Probabilités',
      'Statistiques',
      'Géométrie analytique',
      'Trigonométrie',
      'Nombres complexes',
      'Suites et séries',
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry Mastery',
    totalChapters: 52,
    extractedTracks: 5,
    price: 479,
    originalPrice: 799,
    color: '#f43f5e',
    chapters: [
      'Structure atomique',
      'Tableau périodique',
      'Liaisons chimiques',
      'Géométrie moléculaire',
      'États de la matière',
      'Solutions',
      'Réactions chimiques',
      'Stœchiométrie',
      'Thermochimie',
      'Cinétique chimique',
    ]
  }
];

// Courses styled like OnboardingPopup
const RECOMMENDED_TRACKS: LearningTrack[] = [
  // Physics
  { id: '1', title: 'NEWTON', subtitle: 'Les 3 Lois du Mouvement', lessons: 8, duration: '2h30', programId: 'physics', gradient: 'from-gray-800 via-gray-700 to-gray-900' },
  { id: '2', title: 'GAUSS', subtitle: 'Électrostatique et Champs', lessons: 6, duration: '2h00', programId: 'physics', gradient: 'from-indigo-900 via-indigo-800 to-indigo-950' },
  { id: '3', title: 'THERMO', subtitle: 'Entropie & 2ème Principe', lessons: 10, duration: '3h15', programId: 'physics', gradient: 'from-gray-800 via-gray-700 to-gray-900' },
  { id: '4', title: 'ONDES', subtitle: 'Propagation & Interférences', lessons: 5, duration: '1h45', programId: 'physics', gradient: 'from-sky-900 via-sky-800 to-sky-950' },
  { id: '5', title: 'OPTIQUE', subtitle: 'Lentilles & Miroirs', lessons: 7, duration: '2h15', programId: 'physics', gradient: 'from-violet-900 via-violet-800 to-violet-950' },
  // Mathematics
  { id: '6', title: 'INTÉGRALES', subtitle: 'Calcul et Applications', lessons: 6, duration: '2h00', programId: 'mathematics', gradient: 'from-emerald-900 via-emerald-800 to-emerald-950' },
  { id: '7', title: 'MATRICES', subtitle: 'Algèbre Linéaire', lessons: 8, duration: '2h30', programId: 'mathematics', gradient: 'from-green-900 via-green-800 to-green-950' },
  { id: '8', title: 'LIMITES', subtitle: 'Continuité & Dérivées', lessons: 9, duration: '3h00', programId: 'mathematics', gradient: 'from-teal-900 via-teal-800 to-teal-950' },
  { id: '9', title: 'PROBABILITÉS', subtitle: 'Variables Aléatoires', lessons: 7, duration: '2h30', programId: 'mathematics', gradient: 'from-lime-900 via-lime-800 to-lime-950' },
  { id: '10', title: 'SUITES', subtitle: 'Convergence & Récurrence', lessons: 5, duration: '1h45', programId: 'mathematics', gradient: 'from-emerald-800 via-emerald-700 to-emerald-900' },
  // Chemistry
  { id: '11', title: 'CHIMIE ORG', subtitle: 'Réactions SN1 vs SN2', lessons: 7, duration: '2h15', programId: 'chemistry', gradient: 'from-pink-900 via-pink-800 to-pink-950' },
  { id: '12', title: 'ACIDES-BASES', subtitle: 'pH et Équilibres', lessons: 6, duration: '2h00', programId: 'chemistry', gradient: 'from-rose-900 via-rose-800 to-rose-950' },
  { id: '13', title: 'REDOX', subtitle: 'Oxydoréduction', lessons: 8, duration: '2h30', programId: 'chemistry', gradient: 'from-red-900 via-red-800 to-red-950' },
  { id: '14', title: 'CINÉTIQUE', subtitle: 'Vitesse de Réaction', lessons: 5, duration: '1h45', programId: 'chemistry', gradient: 'from-orange-900 via-orange-800 to-orange-950' },
  { id: '15', title: 'ATOMES', subtitle: 'Structure Électronique', lessons: 6, duration: '2h00', programId: 'chemistry', gradient: 'from-amber-900 via-amber-800 to-amber-950' },
];

// Phases
type Phase = 'scanning' | 'results';

export default function EndOfDiagnosticPage() {
  const [phase, setPhase] = useState<Phase>('scanning');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanningProgram, setCurrentScanningProgram] = useState(0);
  const [scannedChapters, setScannedChapters] = useState<string[]>([]);
  const selectedPrograms = ['physics', 'mathematics', 'chemistry'];
  
  // Programs being scanned (based on user's diagnostic) - memoized
  const userPrograms = React.useMemo(() => 
    MASTERY_PROGRAMS.filter(p => selectedPrograms.includes(p.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const userTracks = React.useMemo(() => 
    RECOMMENDED_TRACKS.filter(t => selectedPrograms.includes(t.programId)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  
  // Calculate totals
  const totalChapters = userPrograms.reduce((acc, p) => acc + p.totalChapters, 0);
  const totalTracks = userTracks.length;
  const totalPrice = userPrograms.reduce((acc, p) => acc + p.price, 0);
  const totalOriginalPrice = userPrograms.reduce((acc, p) => acc + p.originalPrice, 0);
  const discount = Math.round((1 - totalPrice / totalOriginalPrice) * 100);

  // Scanning animation
  useEffect(() => {
    if (phase !== 'scanning') return;
    
    const totalDuration = 8000; // 8 seconds
    const interval = 50;
    const steps = totalDuration / interval;
    let currentStep = 0;
    let isActive = true;
    
    const allChapters = userPrograms.flatMap(p => p.chapters.slice(0, 10));
    
    const timer = setInterval(() => {
      if (!isActive) return;
      
      currentStep++;
      const progress = (currentStep / steps) * 100;
      setScanProgress(progress);
      
      // Update current program being scanned
      const programIndex = Math.floor((progress / 100) * userPrograms.length);
      setCurrentScanningProgram(Math.min(programIndex, userPrograms.length - 1));
      
      // Add scanned chapters
      const chaptersToShow = Math.floor((progress / 100) * allChapters.length);
      setScannedChapters(allChapters.slice(0, chaptersToShow));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          if (isActive) setPhase('results');
        }, 500);
      }
    }, interval);
    
    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, [phase, userPrograms]);

  // Breadcrumb steps
  const steps = [
    { id: 'courses', label: 'Tes cours', active: true, completed: false },
    { id: 'offer', label: 'Offre', active: false, completed: false },
    { id: 'finalize', label: 'Finaliser', active: false, completed: false },
  ];

  return (
    <div className="min-h-screen bg-[#0d1317] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d1317]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image 
              src="/brand/onboarding-logo.svg" 
              alt="SMS" 
              width={48} 
              height={48}
              className="w-12 h-12"
            />
          </div>
          
          {/* Breadcrumb - Centered */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full transition-colors ${
                    step.active ? 'bg-white' : 
                    step.completed ? 'bg-white' : 'bg-gray-600'
                  }`} />
                  <span className={`text-sm font-medium transition-colors ${
                    step.active ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-px bg-gray-700" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Right side - Replay video */}
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <RotateCcw size={16} />
            <span>Revoir la vidéo</span>
          </button>
        </div>
      </header>

      {/* Urgency Banner */}
      <div className="bg-[#00c2ff]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-center gap-4 text-sm">
          <span className="text-white font-semibold tracking-wider">OFFRE NOUVELLE ANNÉE</span>
          <span className="text-white/90">SUR CHAQUE MASTERY PROGRAM</span>
          <span className="bg-white text-[#00c2ff] font-bold px-3 py-1 rounded-full text-xs">
            -{discount}%
          </span>
          <span className="text-white/90">EXPIRE DANS</span>
          <div className="flex items-center gap-1 font-mono font-bold">
            <span className="text-white">02</span>
            <span className="text-white/40">j</span>
            <span className="text-white">23</span>
            <span className="text-white/40">h</span>
            <span className="text-white">59</span>
            <span className="text-white/40">m</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {phase === 'scanning' ? (
            <ScanningPhase 
              key="scanning"
              programs={userPrograms}
              currentProgram={currentScanningProgram}
              progress={scanProgress}
              scannedChapters={scannedChapters}
              totalChapters={totalChapters}
            />
          ) : (
            <ResultsPhase 
              key="results"
              programs={userPrograms}
              tracks={userTracks}
              totalChapters={totalChapters}
              totalTracks={totalTracks}
              totalPrice={totalPrice}
              totalOriginalPrice={totalOriginalPrice}
              discount={discount}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ============================================================================
// SCANNING PHASE
// ============================================================================
interface ScanningPhaseProps {
  programs: MasteryProgram[];
  currentProgram: number;
  progress: number;
  scannedChapters: string[];
  totalChapters: number;
}

function ScanningPhase({ programs, currentProgram, progress, scannedChapters, totalChapters }: ScanningPhaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      {/* Main scanning card */}
      <div className="w-full max-w-2xl bg-[#1a1f24] rounded-3xl border border-gray-700/50 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center">
            <Search className="w-5 h-5 text-white/70 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold !text-white">Connexion de tes besoins<br />à nos programmes</h2>
            <p className="text-sm text-white/60">Extraction des parcours prioritaires...</p>
          </div>
        </div>

        {/* Programs being scanned */}
        <div className="space-y-4 mb-8">
          {programs.map((program, index) => {
            const isScanning = index === currentProgram;
            const isComplete = index < currentProgram;
            const programProgress = isComplete ? 100 : (isScanning ? (progress % (100 / programs.length)) * programs.length : 0);
            
            return (
              <div key={program.id} className="relative">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-700/30">
                  {/* Program info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold !text-white">{program.name}</span>
                      {isComplete && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-white/70"
                        >
                          <CheckCircle size={16} />
                        </motion.span>
                      )}
                      {isScanning && (
                        <Loader2 size={16} className="text-white/70 animate-spin" />
                      )}
                    </div>
                    <div className="text-sm text-white/50">
                      {program.totalChapters} chapitres → {program.extractedTracks} parcours extraits
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="text-right">
                    <span className="text-2xl font-bold !text-white">
                      {isComplete ? program.extractedTracks : isScanning ? Math.floor(programProgress / 25) : 0}
                    </span>
                    <span className="text-white/40 text-sm ml-1">parcours</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                {(isScanning || isComplete) && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 rounded-full bg-white/40"
                    initial={{ width: 0 }}
                    animate={{ width: `${isComplete ? 100 : programProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Scanned chapters preview */}
        <div className="mb-6">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Chapitres analysés</div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-hidden">
            {scannedChapters.slice(-12).map((chapter, index) => {
              // Chapitres qui correspondent aux besoins de l'étudiant (highlight)
              const relevantChapters = [
                'Mécanique newtonienne', 'Dynamique', 'Travail et énergie', 'Ondes mécaniques',
                'Algèbre linéaire', 'Calcul intégral', 'Probabilités',
                'Réactions chimiques', 'Cinétique chimique'
              ];
              const isRelevant = relevantChapters.includes(chapter);
              
              return (
                <motion.span
                  key={index}
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
        </div>

        {/* Overall progress */}
        <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-white/50 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/40">
          <span>{Math.floor((progress / 100) * totalChapters)} / {totalChapters} chapitres</span>
          <span>{Math.floor(progress)}%</span>
        </div>
      </div>
      
      {/* Loading message */}
      <motion.p
        className="mt-8 text-white/50 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Création de tes parcours personnalisés...
      </motion.p>
    </motion.div>
  );
}

// ============================================================================
// RESULTS PHASE
// ============================================================================
interface ResultsPhaseProps {
  programs: MasteryProgram[];
  tracks: LearningTrack[];
  totalChapters: number;
  totalTracks: number;
  totalPrice: number;
  totalOriginalPrice: number;
  discount: number;
}

function ResultsPhase({ programs, tracks, totalChapters, totalTracks, totalPrice, totalOriginalPrice, discount }: ResultsPhaseProps) {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-10"
    >
      {/* ========== LIGNE 1: 2 colonnes (Left: 15 + Programmes | Right: CTA) ========== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Colonne gauche (2/3) */}
        <div className="lg:col-span-2">
          {/* Header avec 15 + Titre */}
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-2xl border-[3px] border-[#00c2ff] flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-black text-white leading-none" style={{ fontFamily: 'var(--font-parafina)' }}>
                {totalTracks}
              </span>
            </div>
            <div>
              <h2 className="text-[28px] font-black !text-white uppercase leading-tight" style={{ fontFamily: 'var(--font-parafina)' }}>
                Parcours pour toi
              </h2>
              <p className="text-[16px]" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                générés depuis nos {programs.length} Mastery Programs
              </p>
            </div>
          </div>
          
          {/* Programmes empilés verticalement */}
          <div className="space-y-3 max-w-lg">
            {programs.map(program => {
              const programTracks = tracks.filter(t => t.programId === program.id);
              return (
                <div 
                  key={program.id} 
                  className="p-4 bg-[#1a1f24] rounded-xl border border-gray-700/50 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => {
                    const element = document.getElementById(`program-${program.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-semibold !text-white">{program.name}</span>
                    <span className="text-lg font-bold text-white">{program.price}€</span>
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    {program.totalChapters} chapitres • {programTracks.length} parcours créés pour toi
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonne droite (1/3) - CTA Block */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1f24] rounded-2xl border border-gray-700/50 p-5">
            {/* Garanties en haut */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Check size={14} className="text-[#00c2ff]" />
                <span>Paiement unique. Accès à vie.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Check size={14} className="text-[#00c2ff]" />
                <span>Mises à jour gratuites incluses à vie</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Check size={14} className="text-[#00c2ff]" />
                <span>14 jours satisfait ou remboursé</span>
              </div>
            </div>
            
            {/* Primary CTA */}
            <button 
              onClick={() => setShowLeadCapture(true)}
              className="w-full py-4 bg-[#00c2ff] hover:bg-[#3ab5dc] text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2 mb-3"
            >
              Teste ton parcours – 10h offertes
              <ArrowRight size={18} />
            </button>
            
            {/* Secondary CTA */}
            <button className="w-full py-3 bg-transparent border border-gray-600 hover:border-gray-500 text-white/80 font-medium rounded-full transition-all flex items-center justify-center gap-2 mb-4">
              Finaliser mon inscription
              <ArrowRight size={16} />
            </button>
            
            {/* Social proof */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-white/60"><strong className="text-white">127</strong> étudiants ont rejoint cette semaine</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========== LIGNE 3: Netflix Carousels (FULL WIDTH) ========== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-12"
      >
        {programs.map((program, programIndex) => {
          const programTracks = tracks.filter(t => t.programId === program.id);
          if (programTracks.length === 0) return null;
          
          return (
            <div key={program.id} id={`program-${program.id}`} className="scroll-mt-24">
              {/* Program Header - Style OnboardingPopup */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold !text-white">
                    {program.name}
                    <span className="!text-white font-normal text-lg ml-3">
                      {programTracks.length} cours
                    </span>
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-full transition-colors">
                    Tester mes connaissances
                  </button>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-white transition-all">
                      <ChevronLeft size={20} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Netflix-style Carousel - Style OnboardingPopup */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {programTracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + programIndex * 0.1 + index * 0.03 }}
                    className="flex-shrink-0 w-52 group cursor-pointer"
                  >
                    {/* Card - Style OnboardingPopup */}
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl overflow-hidden mb-3 transition-transform group-hover:scale-[1.02]">
                      {/* Course Title Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <h3 className="!text-white font-bold text-xl leading-tight tracking-tight mb-1">
                          {track.title}
                        </h3>
                        <div className="w-8 h-0.5 bg-white/40 mb-2" />
                        <p className="!text-white/80 text-xs font-medium">
                          {track.subtitle}
                        </p>
                      </div>

                      {/* Play Button on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl">
                          <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ========== LIGNE 4: 3 blocs (Comment ça fonctionne + Parler à un conseiller + Importer documents) ========== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Comment ça fonctionne */}
        <div className="bg-[#1a1f24] rounded-2xl border border-gray-700/50 p-5">
          <h4 className="text-base font-semibold !text-white mb-4">Comment ça fonctionne</h4>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Tu nous transmets ton cours' },
              { step: '2', text: 'On crée des parcours adaptés' },
              { step: '3', text: 'Tu apprends à ton rythme' },
              { step: '4', text: 'Tu génères d\'autres parcours si besoin' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs text-white/60">
                  {item.step}
                </div>
                <span className="text-white/70 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Parler à un conseiller */}
        <div className="bg-[#1a1f24] rounded-2xl border border-gray-700/50 p-5 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <Users size={24} className="text-white/60" />
          </div>
          <h4 className="text-base font-semibold !text-white mb-2">Une question ?</h4>
          <p className="text-sm text-white/50 mb-4">Notre équipe est disponible pour t&apos;aider</p>
          <button className="text-sm text-[#00c2ff] hover:underline font-medium">
            Parler à un conseiller →
          </button>
        </div>

        {/* Importer d'autres documents */}
        <div className="bg-[#1a1f24] rounded-2xl border border-gray-700/50 p-5 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-white/60" />
          </div>
          <h4 className="text-base font-semibold !text-white mb-2">Importer d&apos;autres documents</h4>
          <p className="text-sm text-white/50 mb-4">Ajoute tes cours, annales ou exercices</p>
          <button className="text-sm text-[#00c2ff] hover:underline font-medium">
            Importer des fichiers →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
