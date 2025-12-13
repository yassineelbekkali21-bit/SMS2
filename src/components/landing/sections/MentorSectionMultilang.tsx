'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export function MentorSectionMultilang() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-32 bg-black relative overflow-hidden">
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Image (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] w-full max-w-sm mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <Image 
                src="/mentors/zak.jpg" 
                alt="Zak - Founder" 
                fill
                className="object-cover"
              />
              {/* Simple gradient for depth, no text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            </div>
          </motion.div>

          {/* Right Column: Content (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 text-left pl-0 lg:pl-10"
          >
            <h2 
              className="font-bold text-white mb-8 leading-tight tracking-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#FFFFFF' }}
            >
              {t('mentor.label')}
            </h2>
            
            <div className="relative mb-10">
              <p 
                className="text-2xl md:text-3xl font-bold text-white leading-relaxed italic"
                style={{ color: '#FFFFFF' }}
              >
                "{t('mentor.quote')}"
              </p>
            </div>

            <div className="space-y-6 text-lg text-white leading-relaxed">
              <p style={{ color: '#FFFFFF' }}>{t('mentor.bio1')}</p>
              <p style={{ color: '#FFFFFF' }}>{t('mentor.bio2')}</p>
              <p style={{ color: '#FFFFFF' }}>{t('mentor.bio3')}</p>
            </div>

            <div className="mt-12 flex items-center gap-4 pt-8 border-t border-gray-800">
              <div className="flex flex-col">
                <span className="font-bold text-white text-xl" style={{ color: '#FFFFFF' }}>Zak</span>
                <span className="text-white font-medium text-sm tracking-widest uppercase" style={{ color: '#FFFFFF' }}>{t('mentor.role')}</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
