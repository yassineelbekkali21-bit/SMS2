'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Compass } from 'lucide-react';

export function StartJourneySectionMultilang() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-black text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-bold mb-6 text-white"
          style={{ fontSize: 'clamp(1.25rem, 6.5vw, 3.25rem)', color: '#FFFFFF' }}
        >
          {t('start.title')}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <p 
            className="text-xl md:text-2xl text-white mb-2 font-medium"
            style={{ color: '#FFFFFF' }}
          >
            {t('start.subtitle')}
          </p>
          <p 
            className="text-sm md:text-base text-white mb-10"
            style={{ color: '#FFFFFF' }}
          >
            {t('start.guarantee')}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary Button */}
          <button
            onClick={() => document.getElementById('whatsapp-contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            {t('start.cta_primary')}
            <ArrowRight size={20} />
          </button>

          {/* Secondary Button */}
          <button
            onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 border border-gray-700"
          >
            {t('start.cta_secondary')}
            <Compass size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
