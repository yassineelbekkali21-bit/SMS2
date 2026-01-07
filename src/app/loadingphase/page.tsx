'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

// Types
interface MasteryProgram {
  id: string;
  name: string;
  shortName: string;
  totalChapters: number;
  extractedTracks: number;
  chapters: string[];
  relevantChapters: string[];
  gradient: string;
}

// Mock Data
const MASTERY_PROGRAMS: MasteryProgram[] = [
  {
    id: 'physics',
    name: 'Physics Mastery',
    shortName: 'Physics',
    totalChapters: 47,
    extractedTracks: 5,
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
    ],
    relevantChapters: ['Mécanique newtonienne', 'Dynamique', 'Travail et énergie', 'Ondes mécaniques'],
    gradient: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'mathematics',
    name: 'Mathematics Mastery',
    shortName: 'Math',
    totalChapters: 63,
    extractedTracks: 5,
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
    ],
    relevantChapters: ['Algèbre linéaire', 'Calcul intégral', 'Probabilités'],
    gradient: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'chemistry',
    name: 'Chemistry Mastery',
    shortName: 'Chemistry',
    totalChapters: 52,
    extractedTracks: 5,
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
    ],
    relevantChapters: ['Réactions chimiques', 'Cinétique chimique'],
    gradient: 'from-rose-600 to-pink-700'
  }
];

// Loading messages
const loadingMessages = [
  "On analyse ton profil",
  "On cible ce qui te fera vraiment progresser",
  "On connecte tes besoins à nos programmes"
];

// Phases
type Phase = 'loading' | 'transition' | 'scanning' | 'reveal';

export default function LoadingPhasePage() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [loadingStep, setLoadingStep] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanningProgram, setCurrentScanningProgram] = useState(0);
  const [scannedPrograms, setScannedPrograms] = useState<number[]>([]);
  const [currentChapters, setCurrentChapters] = useState<string[]>([]);
  
  const programs = MASTERY_PROGRAMS;
  const totalChapters = programs.reduce((acc, p) => acc + p.totalChapters, 0);
  const totalTracks = programs.reduce((acc, p) => acc + p.extractedTracks, 0);

  // Phase 1: Loading messages animation
  useEffect(() => {
    if (phase !== 'loading') return;
    
    const messageTimers = loadingMessages.map((_, index) => {
      return setTimeout(() => {
        setLoadingStep(index);
        
        if (index === loadingMessages.length - 1) {
          setTimeout(() => {
            setPhase('transition');
          }, 1500);
        }
      }, index * 1200);
    });
    
    return () => messageTimers.forEach(t => clearTimeout(t));
  }, [phase]);

  // Phase 2: Transition
  useEffect(() => {
    if (phase !== 'transition') return;
    
    const timer = setTimeout(() => {
      setPhase('scanning');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 3: Scanning animation
  useEffect(() => {
    if (phase !== 'scanning') return;
    
    const scanDurationPerProgram = 2500;
    let isActive = true;
    
    const scanProgram = (programIndex: number) => {
      if (!isActive || programIndex >= programs.length) {
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
      
      const program = programs[programIndex];
      const chapterInterval = scanDurationPerProgram / (program.chapters.length + 2);
      
      program.chapters.forEach((chapter, chapterIndex) => {
        setTimeout(() => {
          if (isActive) {
            setCurrentChapters(prev => [...prev, chapter]);
          }
        }, chapterIndex * chapterInterval);
      });
      
      const progressPerProgram = 100 / programs.length;
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
  }, [phase, programs]);

  const isScanning = phase === 'scanning';
  const showHeader = phase === 'transition' || isScanning;
  const isReveal = phase === 'reveal';
  const shouldPulseLogo = phase === 'loading' || phase === 'transition' || phase === 'scanning';

  return (
    <div className="min-h-screen bg-[#0d1317] flex flex-col items-center justify-center px-6 overflow-hidden">
      
      {/* ========== LOGO - Always visible ========== */}
      <motion.div
        layout
        className="flex flex-col items-center"
        animate={{ 
          marginBottom: isReveal ? '1rem' : '2rem',
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.4, 0, 0.2, 1] 
        }}
      >
        <motion.div
          animate={shouldPulseLogo ? {
            scale: [1, 1.08, 1],
            opacity: [0.7, 1, 0.7]
          } : {
            scale: 1,
            opacity: 1
          }}
          transition={shouldPulseLogo ? {
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

      {/* ========== CONTENT AREA ========== */}
      <div className="relative w-full max-w-2xl min-h-[400px] flex flex-col items-center">
        
        {/* Loading & Scanning Content */}
        <AnimatePresence mode="wait">
          {!isReveal && (
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
                {isScanning && (
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
                      {programs.map((program, index) => {
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
                            
                            {isComplete && index < programs.length - 1 && (
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
                        <span>{Math.floor((scanProgress / 100) * totalChapters)} / {totalChapters} chapitres</span>
                        <span>{Math.floor(scanProgress)}%</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== REVEAL CONTENT ========== */}
        <AnimatePresence>
          {isReveal && (
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
                  style={{ fontFamily: 'var(--font-parafina)' }}
                >
                  {totalTracks}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                className="text-2xl md:text-4xl font-bold text-center mb-3 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-parafina)', color: '#ffffff' }}
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
                {programs.map((program, index) => (
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
  );
}
