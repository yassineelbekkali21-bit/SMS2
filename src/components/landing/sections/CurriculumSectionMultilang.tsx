'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';
import { ChevronDown, CheckCircle2, FileText, Video, ArrowRight, Volume2, VolumeX } from 'lucide-react';

export function CurriculumSectionMultilang() {
  const { t, language } = useLanguage();
  const { openDiagnostic } = useDiagnostic();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Déclencher la lecture vidéo quand une section est étendue
  useEffect(() => {
    if (expandedIndex !== null) {
      // Petit délai pour laisser l'animation se terminer
      const timer = setTimeout(() => {
        videoRef.current?.play().catch(() => {});
        mobileVideoRef.current?.play().catch(() => {});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [expandedIndex]);

  const subjects = [
    {
      id: 'physics',
      key: 'curriculum.physics',
      stats: { units: 45, hours: 60, cases: 12 }
    },
    {
      id: 'math',
      key: 'curriculum.math',
      stats: { units: 55, hours: 80, cases: 15 }
    },
    {
      id: 'chem',
      key: 'curriculum.chem',
      stats: { units: 35, hours: 45, cases: 10 }
    },
    {
      id: 'stats',
      key: 'curriculum.stats',
      stats: { units: 30, hours: 40, cases: 8 }
    },
    {
      id: 'eco',
      key: 'curriculum.eco',
      stats: { units: 40, hours: 50, cases: 10 }
    },
    {
      id: 'accounting',
      key: 'curriculum.accounting',
      stats: { units: 30, hours: 40, cases: 8 }
    }
  ];

  return (
    <section id="curriculum" className="py-20 md:py-28 px-6 bg-white border-b border-gray-100 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <h2 
              className="font-title text-4xl mb-4 tracking-wide"
              style={{ fontSize: 'clamp(2rem, 8vw, 64px)' }}
            >
              {t('curriculum.title')}<br /><span>{t('curriculum.title.highlight')}</span>
            </h2>
          </div>

          <div className="flex gap-8 md:gap-12 border-t lg:border-t-0 border-gray-200 pt-6 lg:pt-0 mt-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">200+</p>
              <p className="font-bold tracking-widest text-gray-500 uppercase" style={{ fontSize: '14px' }}>{t('curriculum.stats.classes')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">2400+</p>
              <p className="font-bold tracking-widest text-gray-500 uppercase" style={{ fontSize: '14px' }}>{t('curriculum.stats.students')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="font-bold tracking-widest text-gray-500 uppercase" style={{ fontSize: '14px' }}>{t('curriculum.stats.resources')}</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="border-t border-gray-200">
          {subjects.map((subject, index) => {
            const isExpanded = expandedIndex === index;
            const number = (index + 1).toString().padStart(2, '0');

            return (
              <div key={subject.id} className="border-b border-gray-200">
                {/* Collapsed State */}
                {!isExpanded && (
                <button
                    onClick={() => setExpandedIndex(index)}
                  className="w-full py-8 flex items-start md:items-center justify-between group text-left"
                >
                  <div className="flex items-start gap-6 md:gap-10">
                      <span className="text-2xl md:text-3xl font-mono text-gray-300 transition-colors">
                      {number}
                    </span>
                      <h3 className="text-2xl md:text-4xl font-bold transition-colors text-gray-500 group-hover:text-gray-900">
                      {t(`${subject.key}.title`)}
                    </h3>
                  </div>
                    <div className="w-10 h-10 rounded-full border flex items-center justify-center transition-all border-gray-300 text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900">
                    <ChevronDown size={20} />
                  </div>
                </button>
                )}

                {/* Expanded State - Full Layout with Video */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      {/* Mobile Layout */}
                      <div className="md:hidden py-6">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                          {/* Header with number and close button */}
                          <div className="flex items-center justify-between px-6 pt-6 pb-4">
                            <span className="text-xl font-mono text-gray-400">
                              {number}
                            </span>
                            <button
                              onClick={() => setExpandedIndex(null)}
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
                            >
                              <ChevronDown size={20} className="rotate-180" />
                            </button>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-3xl font-bold text-gray-900 px-6 mb-2">
                            {t(`${subject.key}.title`)}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed px-6 mb-6" style={{ fontSize: '18px' }}>
                            {t(`${subject.key}.desc`)}
                          </p>

                          {/* Video/Image with Instructor Overlay */}
                          <div className="relative mx-4 rounded-2xl overflow-hidden aspect-[4/3] mb-6">
                            <video
                              ref={mobileVideoRef}
                              className="absolute inset-0 w-full h-full object-cover"
                              poster="/mentors/zak.jpg"
                              muted={isMuted}
                              loop
                              playsInline
                              autoPlay
                            >
                              <source src="/mentors/Zak-intro.mp4" type="video/mp4" />
                            </video>
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            {/* Instructor name */}
                            <div className="absolute bottom-4 left-4">
                              <p className="text-white text-xl font-bold">Zak</p>
                              <p className="text-white/70 text-sm">{language === 'fr' ? 'Fondateur de SMS' : 'Founder of SMS'}</p>
                            </div>
                            {/* Mute button */}
                            <button
                              onClick={() => setIsMuted(!isMuted)}
                              className="absolute bottom-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 px-6 mb-6">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full font-medium text-gray-700" style={{ fontSize: '14px' }}>
                                <FileText size={14} /> {subject.stats.units} Units
                              </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full font-medium text-gray-700" style={{ fontSize: '14px' }}>
                              <FileText size={14} /> {subject.stats.cases} Cases
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 rounded-full font-medium text-white" style={{ fontSize: '14px' }}>
                                <Video size={14} /> {subject.stats.hours}h Video
                              </span>
                          </div>

                          {/* Bullet Points */}
                          <div className="px-6 pb-6">
                            <ul className="space-y-3">
                              {[1, 2, 3, 4].map((i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700 font-medium" style={{ fontSize: '14px' }}>
                                    {t(`${subject.key}.outcomes.${i}`)}
                              </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                            </div>
                            
                      {/* Desktop Layout */}
                      <div className="hidden md:flex min-h-[500px]">
                        {/* Left Column: Header + Content */}
                        <div className="flex-1 py-8 pr-8">
                          {/* Header */}
                          <button
                            onClick={() => setExpandedIndex(null)}
                            className="flex items-start gap-6 md:gap-10 mb-8 group text-left"
                          >
                            <span className="text-2xl md:text-3xl font-mono text-gray-900">
                              {number}
                            </span>
                            <h3 className="text-2xl md:text-4xl font-bold text-gray-900">
                              {t(`${subject.key}.title`)}
                            </h3>
                          </button>

                          {/* Badges + Test Button */}
                          <div className="flex flex-wrap items-center gap-4 mb-6 pl-16 md:pl-20">
                            <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full font-medium text-gray-600" style={{ fontSize: '14px' }}>
                              <FileText size={16} /> {subject.stats.units} Units
                            </span>
                            <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full font-medium text-white" style={{ fontSize: '14px' }}>
                              <Video size={16} /> {subject.stats.hours}h Video
                            </span>
                            <Link
                              href={`/assessment/${subject.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                              style={{ fontSize: '14px' }}
                            >
                              {language === 'fr' ? 'Tester mes connaissances' : 'Test my knowledge'}
                              <ArrowRight size={14} />
                            </Link>
                          </div>

                          {/* Description */}
                          <p className="text-gray-700 leading-relaxed mb-8 pl-16 md:pl-20" style={{ fontSize: '18px' }}>
                            {t(`${subject.key}.desc`)}
                          </p>

                          {/* Trending Topics - 2 columns */}
                          <div className="pl-16 md:pl-20">
                            <h4 className="font-bold text-gray-500 uppercase tracking-widest mb-5" style={{ fontSize: '16px' }}>
                              {language === 'fr' ? 'Sujets tendances' : 'Trending Topics'}
                            </h4>
                            <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <li key={i} className="flex items-center group/item">
                                  <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 group-hover/item:text-gray-900 transition-colors" />
                                    <span className="text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors" style={{ fontSize: '14px' }}>
                                      {t(`${subject.key}.outcomes.${i}`)}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          </div>

                        {/* Right Column: Video - Full Height from Top to Bottom */}
                        <div className="relative overflow-hidden bg-gray-900 w-[320px] flex-shrink-0">
                          <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            poster="/mentors/zak.jpg"
                            muted={isMuted}
                            loop
                            playsInline
                            autoPlay
                          >
                            <source src="/mentors/Zak-intro.mp4" type="video/mp4" />
                          </video>
                          {/* Mute/Unmute button */}
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
                          >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16">
          <button
            onClick={openDiagnostic}
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
            style={{ fontSize: '18px' }}
          >
            {language === 'fr' ? 'Commencer par le diagnostic' : 'Start with the diagnostic'}
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}

