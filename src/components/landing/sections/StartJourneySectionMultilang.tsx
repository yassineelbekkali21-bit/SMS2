'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Compass } from 'lucide-react';

export function StartJourneySectionMultilang() {
  const { t, language } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-[#0d1317] text-white noise-overlay-strong">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 
            className="font-title mb-4 tracking-wide whitespace-nowrap"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 52px)', color: '#FFFFFF' }}
          >
            <span className="block">{t('start.title')}</span>
            <span className="block">{t('start.title.line2')}</span>
          </h2>
          <p 
            className="text-lg md:text-xl mb-3 font-medium"
            style={{ color: '#e0e0e0' }}
          >
            {t('start.subtitle')}
          </p>
          <p 
            className="text-base"
            style={{ color: '#b0b0b0' }}
          >
            {t('start.guarantee')}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/diagnostic"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#00c2ff] text-white rounded-full font-semibold text-base hover:bg-[#00c2ff]/90 transition-colors flex items-center justify-center gap-2"
          >
            {language === 'fr' ? 'Commencer maintenant' : 'Start now'}
            <ArrowRight size={18} />
          </Link>

          <button
            onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3.5 bg-transparent text-white border border-gray-600 rounded-full font-semibold text-base hover:bg-white/10 hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
          >
            {language === 'fr' ? 'Voir le programme' : 'See the program'}
            <Compass size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
