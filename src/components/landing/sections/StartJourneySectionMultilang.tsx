'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';
import { ArrowRight, Compass } from 'lucide-react';

export function StartJourneySectionMultilang() {
  const { t, language } = useLanguage();
  const { openDiagnostic } = useDiagnostic();

  return (
    <section className="py-12 md:py-16 bg-[#0d1317] text-white noise-overlay-strong">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 
            className="font-title mb-4 tracking-wide text-center"
            style={{ fontSize: 'clamp(2rem, 8vw, 64px)', color: '#F7F7F7' }}
          >
            {language === 'fr' ? 'Commence ton aventure dès aujourd\'hui.' : 'Start your journey today.'}
          </h2>
          <p 
            className="mb-3 font-medium"
            style={{ color: '#e0e0e0', fontSize: '22px' }}
          >
            {t('start.subtitle')}
          </p>
          <p 
            style={{ color: '#b0b0b0', fontSize: '14px' }}
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
          <button
            onClick={openDiagnostic}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#00c2ff] text-white rounded-full font-semibold hover:bg-[#00c2ff]/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            style={{ fontSize: '18px' }}
          >
            {language === 'fr' ? 'Commencer maintenant' : 'Start now'}
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3.5 bg-transparent text-white border border-gray-600 rounded-full font-semibold hover:bg-white/10 hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
            style={{ fontSize: '18px' }}
          >
            {language === 'fr' ? 'Voir le programme' : 'See the program'}
            <Compass size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
