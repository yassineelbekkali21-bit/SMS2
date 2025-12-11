'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

interface VideoContent {
  id: string;
  titleKey: string;
  videoUrl: string;
  thumbnailUrl: string;
  level: string;
}

interface SubjectContent {
  id: string;
  subjectKey: string;
  videos: VideoContent[];
}

const WHATSAPP_NUMBER = '32477025622';

const subjectsContent: SubjectContent[] = [
  {
    id: 'maths',
    subjectKey: 'carousel.subjects.maths',
    videos: [
      { id: 'maths-1', titleKey: 'Differential Equations', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', level: 'Intermediate' },
      { id: 'maths-2', titleKey: 'Double & Triple Integrals', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', level: 'Advanced' },
      { id: 'maths-3', titleKey: 'Linear Algebra: Diagonalization', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', level: 'Beginner' }
    ]
  },
  {
    id: 'physique',
    subjectKey: 'carousel.subjects.physics',
    videos: [
      { id: 'physique-1', titleKey: 'Travail, Vecteurs et Cinématique', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', level: 'Beginner' },
      { id: 'physique-2', titleKey: 'Electromagnetism: Maxwell\'s Laws', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', level: 'Advanced' }
    ]
  },
  {
    id: 'chimie',
    subjectKey: 'carousel.subjects.chemistry',
    videos: [
      { id: 'chimie-1', titleKey: 'Organic Chemistry Mechanisms', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', level: 'Advanced' },
      { id: 'chimie-2', titleKey: 'Chemical Kinetics & Equilibria', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', level: 'Intermediate' }
    ]
  },
  {
    id: 'economie',
    subjectKey: 'carousel.subjects.economics',
    videos: [
      { id: 'economie-1', titleKey: 'Market Equilibrium Exercises', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', level: 'Beginner' }
    ]
  },
  {
    id: 'statistiques',
    subjectKey: 'carousel.subjects.statistics',
    videos: [
      { id: 'stats-1', titleKey: 'Hypothesis Testing & Confidence Intervals', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '', level: 'Intermediate' }
    ]
  }
];

export function ContentCarouselMultilang() {
  const [activeSubject, setActiveSubject] = useState<string>('physique');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { language, t } = useLanguage();

  const currentSubjectContent = subjectsContent.find(c => c.id === activeSubject) || subjectsContent[0];
  const currentVideo = currentSubjectContent.videos[currentVideoIndex];

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === 0 ? currentSubjectContent.videos.length - 1 : prev - 1
    );
    setIsVideoPlaying(false);
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === currentSubjectContent.videos.length - 1 ? 0 : prev + 1
    );
    setIsVideoPlaying(false);
  };

  const handleSubjectChange = (subjectId: string) => {
    setActiveSubject(subjectId);
    setCurrentVideoIndex(0);
    setIsVideoPlaying(false);
  };

  const handleTestClick = () => {
    const subjectName = t(currentSubjectContent.subjectKey);
    const message = language === 'fr'
      ? `Salut Science Made Simple 👋, je veux me tester en ${subjectName}. Pouvez-vous me proposer un test adapté à mon niveau ?`
      : `Hi Science Made Simple 👋, I want to test myself in ${subjectName}. Can you offer me a test adapted to my level?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="content-carousel" className="py-6 md:py-10 px-6 md:px-8 lg:px-10 bg-gray-50 flex items-center scroll-mt-24">
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="text-center mb-6 md:mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-3"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
          >
            {t('carousel.title')}<br />
            {t('carousel.title.line2.part1')} <span className="text-blue-600">{t('carousel.title.line2.highlight1')}</span>{t('carousel.title.line2.part2')} <span className="text-blue-600">{t('carousel.title.line2.highlight2')}</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-600 max-w-5xl mx-auto whitespace-pre-line"
            style={{ fontSize: 'clamp(1rem, 2.2vw, 1.625rem)' }}
          >
            {t('carousel.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Tabs Navigation (Mobile & Desktop) - Moved to top */}
          <div className="border-b border-gray-100 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-full">
              {subjectsContent.map((content) => (
                <button
                  key={content.id}
                  onClick={() => handleSubjectChange(content.id)}
                  className={`flex-1 min-w-[100px] md:min-w-[120px] px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium transition-all relative whitespace-nowrap ${
                    activeSubject === content.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {t(content.subjectKey)}
                  {activeSubject === content.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-blue-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="relative p-4 md:p-6">
            <div className="mb-3 md:mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                {currentVideo.titleKey}
              </h3>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {t(currentSubjectContent.subjectKey)}
                </span>
                <span className="text-gray-400">
                  {currentVideoIndex + 1} / {currentSubjectContent.videos.length}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                {!isVideoPlaying ? (
                  <div 
                    className="absolute inset-0 cursor-pointer group"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    {/* Thumbnail image - VSL.png */}
                    <Image
                      src="/thumbnails/VSL.png"
                      alt={currentVideo.titleKey}
                      fill
                      className="object-cover blur-[2px] group-hover:blur-[1px] transition-all duration-300"
                    />
                    {/* Blue-gray overlay to entice clicking */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-slate-600/40 group-hover:from-blue-600/30 group-hover:to-slate-600/30 transition-all duration-300"></div>
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                        <Play className="text-blue-600 ml-1" size={28} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={currentVideo.videoUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}

                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                  <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg backdrop-blur-sm bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                    {currentVideo.level}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 hidden md:block">
                  <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-5 border border-gray-100 hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">{t('carousel.cta_text')}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleTestClick}
                      className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                    >
                      {t('carousel.test_btn')}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {currentSubjectContent.videos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevVideo}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                  >
                    <ChevronLeft className="text-gray-900" size={24} />
                  </button>
                  <button
                    onClick={handleNextVideo}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                  >
                    <ChevronRight className="text-gray-900" size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Only CTA - Below Video */}
          <div className="p-4 md:hidden border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={handleTestClick}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {t('carousel.test_btn')}
              <ArrowRight size={18} />
            </button>
            <p className="text-xs text-gray-500 text-center mt-2 font-medium">
              {t('carousel.cta_text')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



