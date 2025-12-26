'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, LifeBuoy, Rocket, Compass } from 'lucide-react';

export function TargetSectionMultilang() {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/32477025622', '_blank');
  };

  return (
    <section className="py-20 md:py-28 px-6 bg-gray-50">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center mb-16">
          <h2 
            className="font-title text-4xl mb-6 tracking-wide"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 52px)' }}
          >
            {t('target.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Struggling Students */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all border border-gray-100 group"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
              <LifeBuoy className="text-blue-600 w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('target.card1.title')}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t('target.card1.desc')}
            </p>
          </motion.div>

          {/* Card 2: Ambitious Students */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all border border-gray-100 group"
          >
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
              <Rocket className="text-purple-600 w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('target.card2.title')}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t('target.card2.desc')}
            </p>
          </motion.div>

          {/* Card 3: Lifelong Learners */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all border border-gray-100 group"
          >
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
              <Compass className="text-green-600 w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('target.card3.title')}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t('target.card3.desc')}
            </p>
          </motion.div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleWhatsAppClick}
            className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-600/30"
          >
            {t('target.cta')}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}

