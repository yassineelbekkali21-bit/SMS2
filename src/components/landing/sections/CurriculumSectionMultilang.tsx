'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, CheckCircle2, FileText, Video, Users, ArrowRight } from 'lucide-react';

export function CurriculumSectionMultilang() {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

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
              className="text-4xl font-bold text-gray-900 mb-4"
              style={{ fontSize: 'clamp(1.25rem, 6.5vw, 3.25rem)' }}
            >
              {t('curriculum.title')} <span className="text-blue-600">{t('curriculum.title.highlight')}</span>
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
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full py-8 flex items-start md:items-center justify-between group text-left"
                >
                  <div className="flex items-start gap-6 md:gap-10">
                    <span className={`text-2xl md:text-3xl font-mono ${isExpanded ? 'text-blue-600' : 'text-gray-300'} transition-colors`}>
                      {number}
                    </span>
                    <h3 className={`text-2xl md:text-4xl font-bold transition-colors ${isExpanded ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
                      {t(`${subject.key}.title`)}
                    </h3>
                  </div>
                  
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isExpanded ? 'bg-blue-600 border-blue-600 text-white rotate-180' : 'border-gray-300 text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pl-0 md:pl-20 pb-10 pr-4">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                          
                          {/* Left: Description & Tags */}
                          <div>
                            <div className="flex gap-4 mb-6 text-sm font-medium text-gray-500">
                              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
                                <FileText size={14} /> {subject.stats.units} Units
                              </span>
                              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
                                <Video size={14} /> {subject.stats.hours}h Video
                              </span>
                              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
                                <Users size={14} /> Mentor
                              </span>
                            </div>
                            
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                              {t(`${subject.key}.desc`)}
                            </p>
                          </div>

                          {/* Right: Outcomes Checklist */}
                          <div className="bg-gray-50 rounded-2xl p-6">
                            <ul className="space-y-3">
                              {[1, 2, 3, 4].map((i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700 font-medium">
                                    {t(`${subject.key}.outcomes.${i}`)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

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
            onClick={() => document.getElementById('whatsapp-contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all flex items-center gap-3 shadow-lg shadow-blue-600/30 hover:scale-105"
          >
            {t('nav.start')}
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
}

