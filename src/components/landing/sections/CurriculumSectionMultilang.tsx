'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, CheckCircle2, FileText, Video, ArrowRight, Volume2, VolumeX } from 'lucide-react';

export function CurriculumSectionMultilang() {
  const { t, language } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isMuted, setIsMuted] = useState(true);

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
              style={{ fontSize: 'clamp(1.5rem, 6vw, 52px)' }}
            >
              {t('curriculum.title')} <span>{t('curriculum.title.highlight')}</span>
            </h2>
          </div>

          <div className="flex gap-8 md:gap-12 border-t lg:border-t-0 border-gray-200 pt-6 lg:pt-0">
            <div>
              <p className="text-3xl font-bold text-gray-900">200+</p>
              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">{t('curriculum.stats.classes')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">2400+</p>
              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">{t('curriculum.stats.students')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">{t('curriculum.stats.resources')}</p>
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
                          <p className="text-gray-600 text-base leading-relaxed px-6 mb-6">
                            {t(`${subject.key}.desc`)}
                          </p>

                          {/* Video/Image with Instructor Overlay */}
                          <div className="relative mx-4 rounded-2xl overflow-hidden aspect-[4/3] mb-6">
                            <video
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
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                              <FileText size={14} /> {subject.stats.units} Units
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                              <FileText size={14} /> {subject.stats.cases} Cases
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 rounded-full text-sm font-medium text-white">
                              <Video size={14} /> {subject.stats.hours}h Video
                            </span>
                          </div>

                          {/* Bullet Points */}
                          <div className="px-6 pb-6">
                            <ul className="space-y-3">
                              {[1, 2, 3, 4].map((i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700 text-base font-medium">
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
                            <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-base font-medium text-gray-600">
                              <FileText size={18} /> {subject.stats.units} Units
                            </span>
                            <span className="flex items-center gap-2 px-4 py-2 bg-cyan-500 rounded-full text-base font-medium text-white">
                              <Video size={18} /> {subject.stats.hours}h Video
                            </span>
                            <Link
                              href={`/assessment/${subject.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
                            >
                              {language === 'fr' ? 'Tester mes connaissances' : 'Test my knowledge'}
                              <ArrowRight size={16} />
                            </Link>
                          </div>
                          
                          {/* Description */}
                          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 pl-16 md:pl-20">
                            {t(`${subject.key}.desc`)}
                          </p>

                          {/* Trending Topics - 2 columns */}
                          <div className="pl-16 md:pl-20">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">
                              {language === 'fr' ? 'Sujets tendances' : 'Trending Topics'}
                            </h4>
                            <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <li key={i} className="flex items-center group/item">
                                  <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5 group-hover/item:text-gray-900 transition-colors" />
                                    <span className="text-gray-700 text-lg font-medium group-hover/item:text-gray-900 transition-colors">
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
          <Link
            href="/diagnostic"
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {language === 'fr' ? 'Commencer par le diagnostic' : 'Start with the diagnostic'}
            <ArrowRight size={20} />
          </Link>
        </div>

      </div>
    </section>
  );
}

