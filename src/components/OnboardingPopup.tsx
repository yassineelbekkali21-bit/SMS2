'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Play, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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
}

// Mock data for recommended courses
const defaultCourses: RecommendedCourse[] = [
  { id: '1', title: 'NEWTON', subtitle: 'Les 3 Lois du Mouvement', category: 'Physics Mastery', gradient: 'from-blue-900 via-blue-800 to-blue-950' },
  { id: '2', title: 'GAUSS', subtitle: 'Électrostatique et Champs', category: 'Physics Mastery', gradient: 'from-purple-900 via-purple-800 to-purple-950' },
  { id: '3', title: 'INTÉGRALES', subtitle: 'Calcul et Applications', category: 'Mathematics Mastery', gradient: 'from-emerald-900 via-emerald-800 to-emerald-950' },
  { id: '4', title: 'MATRICES', subtitle: 'Algèbre Linéaire', category: 'Mathematics Mastery', gradient: 'from-orange-900 via-orange-800 to-orange-950' },
  { id: '5', title: 'CHIMIE ORG', subtitle: 'Réactions SN1 vs SN2', category: 'Chemistry Mastery', gradient: 'from-pink-900 via-pink-800 to-pink-950' },
  { id: '6', title: 'THERMO', subtitle: 'Entropie & 2ème Principe', category: 'Physics Mastery', gradient: 'from-cyan-900 via-cyan-800 to-cyan-950' },
];

const defaultInterests = ['Physics', 'Mathematics', 'Chemistry'];

export function OnboardingPopup({ 
  isOpen, 
  onComplete, 
  recommendedCourses = defaultCourses,
  interests = defaultInterests 
}: OnboardingPopupProps) {
  const [phase, setPhase] = useState<'loading' | 'results'>('loading');
  const [loadingStep, setLoadingStep] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const loadingMessages = [
    'Understanding your goals...',
    'Selecting your top content...',
    'Building your custom results...'
  ];

  // Loading animation sequence
  useEffect(() => {
    if (!isOpen) {
      setPhase('loading');
      setLoadingStep(0);
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
        className="fixed inset-0 z-[100] bg-black"
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
                src="/favicon.svg" 
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
                    opacity: loadingStep >= index ? 1 : 0.2
                  }}
                  transition={{ duration: 0.5 }}
                  className={`text-2xl md:text-3xl font-bold transition-colors duration-500 ${
                    loadingStep >= index ? 'text-white' : 'text-gray-600'
                  }`}
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
            className="h-full overflow-y-auto"
          >
            {/* Header */}
            <header className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 z-20">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image 
                    src="/favicon.svg" 
                    alt="SMS" 
                    width={36} 
                    height={36}
                  />
                  <span className="text-white font-bold text-lg hidden md:block">Science Made Simple</span>
                </div>
                
                {/* Progress Steps */}
                <div className="hidden md:flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-green-500 rounded-full" />
                    <span className="text-green-500 text-sm font-medium">Interests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-green-500 rounded-full" />
                    <span className="text-green-500 text-sm font-medium">Goals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-white rounded-full" />
                    <span className="text-white text-sm font-medium">Courses For You</span>
                  </div>
                </div>

                <button
                  onClick={onComplete}
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Skip
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
                    <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-5xl font-bold text-white">{recommendedCourses.length}</span>
                    </div>
                    <div>
                      <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-2">
                        Courses for you
                      </h1>
                      <p className="text-xl text-gray-400">
                        from {interests.length} interests
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl">
                    Here are your custom results. Scroll down to view your recommended courses or click to filter by category. Every membership includes:
                  </p>

                  {/* Benefits List */}
                  <ul className="space-y-4">
                    <li className="flex items-center gap-4">
                      <Check className="w-5 h-5 text-gray-400" strokeWidth={2} />
                      <span className="text-white text-lg">All 200+ classes and categories</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <Check className="w-5 h-5 text-gray-400" strokeWidth={2} />
                      <span className="text-white text-lg">New classes added every month</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <Check className="w-5 h-5 text-gray-400" strokeWidth={2} />
                      <span className="text-white text-lg">Direct access to Zak via WhatsApp</span>
                    </li>
                  </ul>
                </div>

                {/* Right Column - CTA Card */}
                <div className="lg:col-span-5">
                  <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
                    {/* 10 Hours Gift Banner */}
                    <div className="bg-blue-600 rounded-xl p-5 mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-6 h-6 text-white" />
                        <span className="font-bold text-xl text-white">10 heures offertes</span>
                      </div>
                      <p className="text-blue-100 text-base leading-relaxed">
                        Explore l'intégralité du catalogue. 10 heures de visionnage gratuit sur tous les contenus sélectionnés.
                      </p>
                    </div>

                    {/* Success Badge */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-6 h-6 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-white text-lg font-medium">
                        You're on your way to unlock free access!
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={onComplete}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-xl text-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Start Learning
                    </button>

                    <p className="text-center text-gray-500 text-sm mt-5">
                      No credit card required
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3 mb-10">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    className="px-5 py-2.5 bg-transparent border border-gray-700 rounded-full text-white font-medium hover:border-gray-500 transition-colors text-base"
                  >
                    {interest}
                  </button>
                ))}
              </div>

              {/* Courses Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {interests[0]}
                    </h2>
                    <p className="text-gray-400 text-lg">
                      {recommendedCourses.filter(c => c.category.includes(interests[0])).length} courses · Master the fundamentals
                    </p>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCarouselPrev}
                      disabled={carouselIndex === 0}
                      className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleCarouselNext}
                      disabled={carouselIndex >= recommendedCourses.length - 4}
                      className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>

                {/* Course Cards Carousel */}
                <div className="overflow-hidden -mx-2">
                  <motion.div
                    className="flex"
                    animate={{ x: -carouselIndex * 240 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {recommendedCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex-shrink-0 w-56 px-2 group cursor-pointer"
                      >
                        {/* Course Card */}
                        <div className={`relative aspect-[3/4] bg-gradient-to-br ${course.gradient} rounded-xl overflow-hidden mb-4 transition-transform group-hover:scale-[1.02]`}>
                          {/* Course Title Overlay */}
                          <div className="absolute inset-0 flex flex-col justify-end p-5">
                            <h3 className="text-white font-black text-2xl leading-none tracking-tight mb-2">
                              {course.title}
                            </h3>
                            <div className="w-10 h-0.5 bg-white/40 mb-3" />
                            <p className="text-white/80 text-sm font-medium">
                              {course.subtitle}
                            </p>
                          </div>

                          {/* Play Button on Hover */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                              <Play className="w-7 h-7 text-gray-900 ml-1" fill="currentColor" />
                            </div>
                          </div>
                        </div>

                        {/* Course Info Below Card */}
                        <p className="text-white font-medium text-sm mb-1 truncate">
                          {course.subtitle}
                        </p>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Play className="w-4 h-4" />
                          <span>Watch Trailer</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="text-center py-12 border-t border-gray-800">
                <button
                  onClick={onComplete}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-16 rounded-xl text-xl transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-3"
                >
                  Access My Courses
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
