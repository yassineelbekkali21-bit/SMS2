'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function MentorSectionMultilang() {
  const { language } = useLanguage();

  const content = language === 'fr' ? {
    label: 'Hey, c\'est Zak.',
    bio1: 'Pendant longtemps, on m\'a dit que je visais trop haut. Et j\'ai vu trop d\'étudiants douter d\'eux pour les mêmes raisons.',
    bio2: 'J\'ai alors construit une autre façon d\'apprendre : exigeante, claire, et profondément bienveillante, pour vraiment comprendre au lieu de subir.',
    bio3: 'Si tu es prêt à t\'investir, je t\'accompagne pas à pas pour aller plus loin que tu ne l\'imagines, sans jamais avancer seul.',
    moreLink: 'En savoir plus sur Zak'
  } : {
    label: 'Hey, I\'m Zak.',
    bio1: 'For a long time, I was told I was aiming too high. And I\'ve seen too many students doubt themselves for the same reasons.',
    bio2: 'So I built a different way to learn: demanding, clear, and deeply caring, to truly understand instead of just getting by.',
    bio3: 'If you\'re ready to commit, I\'ll guide you step by step to go further than you imagine, never moving forward alone.',
    moreLink: 'More about Zak'
  };

  return (
    <section className="py-10 md:py-16 bg-[#0d1317] relative overflow-hidden noise-overlay-strong">
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Image (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-xs mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <Image 
                src="/mentors/zak.jpg" 
                alt="Zak - Founder" 
                fill
                className="object-cover"
              />
              {/* Simple gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            </div>
          </motion.div>

          {/* Right Column: Content (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 text-left"
          >
            <h2 
              className="font-title mb-5 leading-tight tracking-wide"
              style={{ fontSize: 'clamp(2rem, 8vw, 64px)', color: '#F7F7F7' }}
            >
              {content.label}
            </h2>
            
            {/* Short bio - 3 phrases */}
            <div className="space-y-4 leading-relaxed mb-6" style={{ fontSize: '18px' }}>
              <p style={{ color: 'rgba(255,255,255,0.85)' }}>{content.bio1}</p>
              <p style={{ color: 'rgba(255,255,255,0.85)' }}>{content.bio2}</p>
              <p style={{ color: 'rgba(255,255,255,0.85)' }}>{content.bio3}</p>
            </div>

            {/* More about Zak link */}
            <Link 
              href="/about-zak"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium group"
              style={{ fontSize: '14px' }}
            >
              {content.moreLink}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
