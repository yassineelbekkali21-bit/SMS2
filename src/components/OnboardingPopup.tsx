'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Play, Clock, ArrowRight, ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { LeadCaptureModal } from './LeadCaptureModal';

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

interface OnboardingPopupProps {
  isOpen: boolean;
  onComplete: () => void;
  recommendedCourses?: RecommendedCourse[];
  interests?: string[];
  initialPhase?: 'loading' | 'results' | 'membership-intro' | 'membership-plans';
}

// Mock data for recommended courses
const defaultCourses: RecommendedCourse[] = [
  // Physics Mastery
  { id: '1', title: 'NEWTON', subtitle: 'Les 3 Lois du Mouvement', category: 'Physics Mastery', gradient: 'from-blue-900 via-blue-800 to-blue-950' },
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
  const [phase, setPhase] = useState<'loading' | 'results' | 'membership-intro' | 'membership-plans'>(initialPhase);
  const [loadingStep, setLoadingStep] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(['physics', 'mathematics', 'chemistry']);
  const [boostersEnabled, setBoostersEnabled] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);

  // Calculate totals
  const programsTotal = selectedPrograms.reduce((sum, id) => {
    const program = programs.find(p => p.id === id);
    return sum + (program?.price || 0);
  }, 0);
  
  const boostersMonthly = 45; // $45/month for all boosters

  const toggleProgram = (id: string) => {
    setSelectedPrograms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const loadingMessages = [
    'Understanding your goals...',
    'Selecting your top content...',
    'Building your custom results...'
  ];

  // Reset phase when popup opens with a specific initialPhase
  useEffect(() => {
    if (isOpen) {
      setPhase(initialPhase);
      if (initialPhase === 'loading') {
        setLoadingStep(0);
      }
    }
  }, [isOpen, initialPhase]);

  // Loading animation sequence
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (phase === 'loading') {
      const timers: NodeJS.Timeout[] = [];
      
      loadingMessages.forEach((_, index) => {
        const timer = setTimeout(() => {
          setLoadingStep(index);
        }, index * 1200);
        timers.push(timer);
      });

      const finalTimer = setTimeout(() => {
        setPhase('results');
      }, loadingMessages.length * 1200 + 800);
      timers.push(finalTimer);

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [isOpen, phase]);

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
        {/* Loading Phase */}
        {phase === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center text-center px-6"
          >
            {/* Animated Logo */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-16"
            >
              <Image 
                src="/brand/onboarding-logo.svg" 
                alt="Science Made Simple" 
                width={140} 
                height={140}
                className="object-contain"
              />
            </motion.div>

            {/* Loading Messages */}
            <div className="space-y-5">
              {loadingMessages.map((message, index) => (
                <motion.p
                  key={message}
                  initial={{ opacity: 0.2 }}
                  animate={{ 
                    opacity: loadingStep >= index ? 1 : 0.3
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl md:text-3xl font-bold !text-white"
                >
                  {message}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Phase */}
        {phase === 'results' && (
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
                
                {/* Progress Steps */}
                <div className="hidden md:flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-blue-600 rounded-full" />
                    <span className="text-blue-600 text-sm font-medium">Diagnostic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-blue-600 rounded-full" />
                    <span className="text-blue-600 text-sm font-medium">Objectifs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-white rounded-full" />
                    <span className="text-white text-sm font-medium">Cours pour toi</span>
                  </div>
                </div>

                <button
                  onClick={onComplete}
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Passer
                </button>
              </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-16">
              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-12 gap-12 mb-16">
                
                {/* Left Column - Info */}
                <div className="lg:col-span-7">
                  {/* Course Count + Title */}
                  <div className="flex items-start gap-6 mb-10">
                    <div className="w-24 h-24 rounded-full border-4 border-cyan-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-5xl font-bold text-white">{recommendedCourses.length}</span>
                    </div>
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold !text-white leading-tight mb-2">
                        Cours pour toi
                      </h1>
                      <p className="text-lg !text-white">
                        basés sur {interests.length} Mastery Programs
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="!text-white text-lg leading-relaxed mb-10 max-w-2xl">
                    Voici tes cours recommandés. Parcours la sélection ou filtre par Mastery Program. Chaque accès inclut :
                  </p>

                  {/* Benefits List */}
                  <ul className="space-y-4">
                    <li className="flex items-center gap-4">
                      <Check className="w-5 h-5 text-gray-300" strokeWidth={2} />
                      <span className="text-white text-lg">Accès à tous les Mastery Programs</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <Check className="w-5 h-5 text-gray-300" strokeWidth={2} />
                      <span className="text-white text-lg">Nouveaux cours ajoutés chaque mois</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <Check className="w-5 h-5 text-gray-300" strokeWidth={2} />
                      <span className="text-white text-lg">Accès direct à Zak via WhatsApp</span>
                    </li>
                  </ul>
                </div>

                {/* Right Column - CTA Card */}
                <div className="lg:col-span-5">
                  <div className="bg-[#141414] rounded-xl p-6 border border-gray-800">
                    {/* Success Message */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-white text-base">
                        Tes cours personnalisés sont prêts
                      </span>
                    </div>

                    {/* CTA Buttons */}
                    <button
                      onClick={() => setShowLeadCapture(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all mb-3"
                    >
                      Débloquer 10h gratuites
                    </button>
                    <button
                      onClick={() => setPhase('membership-intro')}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg text-sm transition-all shadow-lg shadow-orange-500/25"
                    >
                      Finalise ton inscription → <span className="underline">6 semaines de Boosters GRATUITES</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Course Rows - One per Mastery Program */}
              {interests.map((interest, rowIndex) => {
                const coursesForProgram = recommendedCourses.filter(c => c.category === interest);
                
                return (
                  <div key={interest} className="mb-16">
                    {/* Row Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold !text-white">
                          {interest}
                          <span className="!text-white font-normal text-lg ml-3">
                            {coursesForProgram.length} cours
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
                
                {/* Progress Steps */}
                <div className="hidden md:flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-blue-600 rounded-full" />
                    <span className="text-blue-600 text-sm font-medium">Membership</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-gray-600 rounded-full" />
                    <span className="text-gray-500 text-sm font-medium">Account</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-gray-600 rounded-full" />
                    <span className="text-gray-500 text-sm font-medium">Payment</span>
                  </div>
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
            <div className="bg-blue-600/10 border-b border-blue-600/30 py-3 px-6">
              <p className="text-center">
                <span className="text-blue-400 font-bold">LIFETIME ACCESS</span>
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
                  <Check className="w-6 h-6 text-blue-500" strokeWidth={2} />
                  <span className="!text-white text-lg font-medium">Accès à vie à tes Mastery Programs</span>
                </li>
                <li className="flex items-center gap-4">
                  <Check className="w-6 h-6 text-blue-500" strokeWidth={2} />
                  <span className="!text-white text-lg">{recommendedCourses.length}+ cours vidéo, enseignés par des experts</span>
                </li>
                <li className="flex items-center gap-4">
                  <Check className="w-6 h-6 text-blue-500" strokeWidth={2} />
                  <span className="!text-white text-lg">Mises à jour gratuites incluses à vie</span>
                </li>
                <li className="flex items-center gap-4">
                  <Check className="w-6 h-6 text-blue-500" strokeWidth={2} />
                  <span className="!text-white text-lg">14 jours satisfait ou remboursé</span>
                </li>
                <li className="flex items-center gap-4">
                  <Check className="w-6 h-6 text-blue-500" strokeWidth={2} />
                  <span className="!text-white text-lg">Accessible partout : ordinateur, tablette, mobile</span>
                </li>
              </ul>

              <button
                onClick={() => setPhase('membership-plans')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all"
              >
                Choisir mes programmes
              </button>
            </div>
          </motion.div>
        )}

        {/* Membership Plans Phase - Screen 2 */}
        {phase === 'membership-plans' && (
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
                
                {/* Progress Steps */}
                <div className="hidden md:flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-blue-600 rounded-full" />
                    <span className="text-blue-600 text-sm font-medium">Sélection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-gray-600 rounded-full" />
                    <span className="text-gray-500 text-sm font-medium">Paiement</span>
                  </div>
                </div>

                <button
                  onClick={() => setPhase('membership-intro')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
              <h1 className="text-3xl md:text-4xl font-bold !text-white text-center mb-3">
                Finalise ton accès
              </h1>
              <p className="text-center !text-white mb-12 text-lg">
                Paiement unique · Accès à vie · Aucun abonnement
              </p>

              {/* Programs Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="!text-white text-xl font-bold">
                    Mastery Programs
                  </h2>
                  <span className="!text-white text-sm font-medium px-3 py-1 bg-white/10 rounded-full">
                    Accès à vie
                  </span>
                </div>
                
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div
                      key={program.id}
                      onClick={() => toggleProgram(program.id)}
                      className={`rounded-xl p-6 cursor-pointer transition-all ${
                        selectedPrograms.includes(program.id)
                          ? 'bg-blue-600/15 border-2 border-blue-500'
                          : 'bg-gray-900/80 border border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedPrograms.includes(program.id) 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-600'
                          }`}>
                            {selectedPrograms.includes(program.id) && (
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            )}
                          </div>
                          <h3 className="!text-white font-bold text-lg">
                            {program.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="!text-white font-bold text-2xl">${program.price}</p>
                          <p className="!text-white text-xs mt-1">Paiement unique</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boosters Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="!text-white text-xl font-bold">
                    Boosters
                  </h2>
                  <span className="!text-white text-sm">Optionnel</span>
                </div>
                
                <p className="!text-white text-sm mb-4">
                  Les Boosters ne sont pas requis pour accéder aux cours. Ils t'aident à structurer et accélérer ta progression. Résiliable à tout moment.
                </p>

                {/* Boosters Toggle Card */}
                <div
                  onClick={() => setBoostersEnabled(!boostersEnabled)}
                  className={`rounded-xl p-6 cursor-pointer transition-all ${
                    boostersEnabled
                      ? 'bg-blue-600/15 border-2 border-blue-500'
                      : 'bg-gray-900/80 border border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        boostersEnabled 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-600'
                      }`}>
                        {boostersEnabled && (
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        )}
                      </div>
                      <div>
                        <h3 className="!text-white font-bold text-lg flex items-center gap-3">
                          Pack Complet (4 Boosters)
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">-25%</span>
                        </h3>
                        <p className="!text-white text-sm mt-2">
                          Planification · Study Rooms · Générateur d'exercices · Support WhatsApp
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="flex items-center gap-2">
                        <span className="!text-white/50 line-through text-sm">$60</span>
                        <span className="!text-white font-bold text-2xl">$45</span>
                      </div>
                      <p className="!text-white text-xs mt-1">par mois · sans engagement</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
                <h3 className="!text-white font-bold text-lg mb-4">Récapitulatif</h3>
                
                <div className="space-y-3 mb-4">
                  {selectedPrograms.map((id) => {
                    const program = programs.find(p => p.id === id);
                    return program ? (
                      <div key={id} className="flex justify-between">
                        <div>
                          <span className="!text-white">{program.name}</span>
                          <span className="!text-white text-xs ml-2">Accès à vie</span>
                        </div>
                        <span className="!text-white font-semibold">${program.price}</span>
                      </div>
                    ) : null;
                  })}
                  {boostersEnabled && (
                    <div className="flex justify-between">
                      <div>
                        <span className="!text-white">Pack Boosters</span>
                        <span className="!text-white text-xs ml-2">Mensuel</span>
                      </div>
                      <span className="!text-white font-semibold">$45/mois</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="!text-white font-bold text-lg">Total aujourd'hui</span>
                    <span className="!text-white font-bold text-2xl">${programsTotal}{boostersEnabled ? ' + $45/mois' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => {
                  const items = selectedPrograms.join(',');
                  const boostersParam = boostersEnabled ? '&boosters=true' : '';
                  window.open(`https://buy.stripe.com/checkout?programs=${items}&total=${programsTotal}${boostersParam}`, '_blank');
                }}
                disabled={selectedPrograms.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-all mb-4"
              >
                {selectedPrograms.length === 0 
                  ? 'Sélectionne au moins un programme' 
                  : 'Débloquer mon accès à vie'}
              </button>

              <p className="text-center !text-white text-sm mb-12">
                Paiement sécurisé · Accès immédiat · Garantie 14 jours satisfait ou remboursé
              </p>

              {/* FAQ Section */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold !text-white text-center mb-8">
                  Questions fréquentes
                </h2>

                {faqs.map((category) => (
                  <div key={category.category} className="mb-8">
                    <h3 className="text-gray-400 text-sm font-semibold mb-4">{category.category}</h3>
                    <div className="space-y-2">
                      {category.questions.map((faq, index) => (
                        <div
                          key={index}
                          className="bg-gray-900 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === `${category.category}-${index}` ? null : `${category.category}-${index}`)}
                            className="w-full flex items-center justify-between p-4 text-left"
                          >
                            <span className="!text-white font-medium">{faq.q}</span>
                            <ChevronDown 
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                expandedFaq === `${category.category}-${index}` ? 'rotate-180' : ''
                              }`} 
                            />
                          </button>
                          {expandedFaq === `${category.category}-${index}` && (
                            <div className="px-4 pb-4">
                              <p className="text-gray-400">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

