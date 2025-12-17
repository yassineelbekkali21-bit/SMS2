'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Play, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface RecommendedCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  category: string;
}

interface OnboardingPopupProps {
  isOpen: boolean;
  onComplete: () => void;
  recommendedCourses?: RecommendedCourse[];
  interests?: string[];
}

// Mock data for recommended courses
const defaultCourses: RecommendedCourse[] = [
  { id: '1', title: 'Les 3 Lois de Newton', instructor: 'Zak', thumbnail: '/thumbnails/newton.jpg', category: 'Physics Mastery' },
  { id: '2', title: 'Intégrales et Primitives', instructor: 'Zak', thumbnail: '/thumbnails/integrales.jpg', category: 'Mathematics Mastery' },
  { id: '3', title: 'Réactions SN1 vs SN2', instructor: 'Zak', thumbnail: '/thumbnails/chimie.jpg', category: 'Chemistry Mastery' },
  { id: '4', title: 'Loi d\'Ohm & Circuits', instructor: 'Zak', thumbnail: '/thumbnails/circuits.jpg', category: 'Physics Mastery' },
  { id: '5', title: 'Matrices & Déterminants', instructor: 'Zak', thumbnail: '/thumbnails/matrices.jpg', category: 'Mathematics Mastery' },
  { id: '6', title: 'Thermodynamique', instructor: 'Zak', thumbnail: '/thumbnails/thermo.jpg', category: 'Physics Mastery' },
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
      
      // Step through loading messages
      loadingMessages.forEach((_, index) => {
        const timer = setTimeout(() => {
          setLoadingStep(index);
        }, index * 1200);
        timers.push(timer);
      });

      // Transition to results after loading
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
        className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
      >
        {/* Loading Phase */}
        {phase === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center px-6"
          >
            {/* Animated Logo */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-12"
            >
              <Image 
                src="/favicon.svg" 
                alt="Science Made Simple" 
                width={120} 
                height={120}
                className="object-contain"
              />
            </motion.div>

            {/* Loading Messages */}
            <div className="space-y-4">
              {loadingMessages.map((message, index) => (
                <motion.p
                  key={message}
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: loadingStep >= index ? 1 : 0.3,
                    color: loadingStep >= index ? '#111827' : '#9CA3AF'
                  }}
                  className="text-xl md:text-2xl font-bold"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Image 
                  src="/favicon.svg" 
                  alt="SMS" 
                  width={40} 
                  height={40}
                />
                <button
                  onClick={onComplete}
                  className="text-sm text-gray-500 hover:text-gray-900 font-medium"
                >
                  Skip
                </button>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
              {/* Main Title Section */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
                <div className="flex-1">
                  {/* Course Count Badge */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full border-4 border-blue-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">{recommendedCourses.length}</span>
                    </div>
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Courses for you
                      </h1>
                      <p className="text-lg text-gray-500 mt-1">
                        from {interests.length} interests
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-lg mb-6 max-w-xl">
                    Here are your custom results. Scroll down to view your recommended courses or click to filter by category. Every membership includes:
                  </p>

                  {/* Benefits List */}
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-gray-700" strokeWidth={2} />
                      <span className="text-gray-900 font-medium">All 200+ classes and categories</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-gray-700" strokeWidth={2} />
                      <span className="text-gray-900 font-medium">New classes added every month</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-gray-700" strokeWidth={2} />
                      <span className="text-gray-900 font-medium">Direct access to Zak via WhatsApp</span>
                    </li>
                  </ul>
                </div>

                {/* CTA Card */}
                <div className="lg:w-96 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  {/* 10 Hours Gift Banner */}
                  <div className="bg-blue-600 text-white rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-6 h-6" />
                      <span className="font-bold text-lg">10 heures offertes</span>
                    </div>
                    <p className="text-blue-100 text-sm">
                      Explore l'intégralité du catalogue. 10 heures de visionnage gratuit sur tous les contenus sélectionnés.
                    </p>
                  </div>

                  {/* Success Badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-900 font-medium">
                      Your free access is ready!
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={onComplete}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-full text-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Start Learning
                    <ArrowRight size={20} />
                  </button>

                  <p className="text-center text-gray-500 text-sm mt-4">
                    No credit card required
                  </p>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3 mb-8">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 font-medium hover:border-gray-400 transition-colors"
                  >
                    {interest}
                  </button>
                ))}
              </div>

              {/* Courses Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {interests[0]}
                    </h2>
                    <p className="text-gray-500">
                      {recommendedCourses.filter(c => c.category.includes(interests[0])).length} courses • Master the fundamentals
                    </p>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCarouselPrev}
                      disabled={carouselIndex === 0}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleCarouselNext}
                      disabled={carouselIndex >= recommendedCourses.length - 4}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Course Cards Carousel */}
                <div className="overflow-hidden">
                  <motion.div
                    className="flex gap-4"
                    animate={{ x: -carouselIndex * 280 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {recommendedCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex-shrink-0 w-64 group cursor-pointer"
                      >
                        {/* Course Thumbnail */}
                        <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden mb-3">
                          {/* Placeholder gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                          
                          {/* Course Title Overlay */}
                          <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                            <h3 className="text-white font-bold text-lg leading-tight mb-1">
                              {course.title}
                            </h3>
                            <div className="w-8 h-0.5 bg-white/50 mb-2" />
                            <p className="text-white/70 text-sm">
                              {course.category}
                            </p>
                          </div>

                          {/* Play Button on Hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
                            </div>
                          </div>
                        </div>

                        {/* Course Info */}
                        <p className="text-gray-900 font-medium text-sm">
                          {course.title}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Watch Trailer
                        </p>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="text-center py-12 border-t border-gray-200">
                <button
                  onClick={onComplete}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-colors inline-flex items-center gap-2"
                >
                  Access My Courses
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
