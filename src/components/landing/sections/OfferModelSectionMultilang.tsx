'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Target, ArrowRight, Sparkles, Gift, Eye, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OfferBlock {
  title: string;
  intro?: string;
  bullets: string[];
  footer?: string;
  isAddons?: boolean;
}

interface OfferCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  blocks: OfferBlock[];
  ctaText: string;
  ctaAction: () => void;
  delay?: number;
  highlight?: boolean;
  badges?: Array<{ text: string; icon: React.ElementType }>;
}

function OfferCard({ icon: Icon, title, subtitle, blocks, ctaText, ctaAction, delay = 0, highlight = false, badges = [] }: OfferCardProps) {
  const { language } = useLanguage();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`group relative rounded-3xl overflow-hidden flex flex-col transition-all duration-300 border h-full ${
        highlight 
          ? 'bg-gray-900 border-gray-900 text-white shadow-2xl z-10 ring-1 ring-gray-900/50' 
          : 'bg-white border-gray-900 shadow-lg hover:shadow-xl hover:border-gray-900 text-gray-900'
      }`}
    >
      {/* Header */}
      <div className={`p-4 md:p-5 ${highlight ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 
              className={`text-xl font-bold whitespace-pre-line ${subtitle ? 'mb-1' : ''} ${highlight ? '!text-white' : 'text-gray-900'}`}
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className={`text-base md:text-lg font-medium ${highlight ? '!text-white' : 'text-gray-500'}`}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
            highlight ? 'bg-white/10 text-white' : 'bg-white text-gray-900'
          }`}>
            <Icon size={20} />
          </div>
        </div>
        
        {/* Badges / Bandeaux */}
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge, index) => {
            const BadgeIcon = badge.icon;
            return (
              <React.Fragment key={index}>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider ${
                  highlight 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'bg-gray-900 text-white border border-gray-900'
                }`}>
                  <BadgeIcon size={16} />
                  {badge.text}
                </div>
                {/* Force line break after 2nd badge if there are 3 badges */}
                {index === 1 && badges.length === 3 && <div className="basis-full h-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <p className={`text-xs font-bold tracking-wider uppercase mb-3 ${
          highlight ? '!text-gray-500' : 'text-gray-400'
        }`}>
          {language === 'fr' ? "CE QUI EST INCLUS" : "WHAT'S INCLUDED"}
        </p>

        <div className="space-y-4 flex-1">
          {blocks.map((block, index) => (
            <div key={index} className="relative">
              {/* Connector Line for multiple blocks */}
              {index < blocks.length - 1 && (
                <div className={`absolute left-3 top-7 bottom-[-20px] w-0.5 ${
                  highlight ? 'bg-gray-800' : 'bg-gray-100'
                }`} />
              )}
              
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  highlight ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                }`}>
                  {block.isAddons ? <Sparkles size={14} /> : <CheckCircle size={14} />}
                </div>
                
                <div className="flex-1">
                  <h4 
                    className={`font-bold text-lg mb-1 ${
                      highlight ? '!text-white' : 'text-gray-900'
                    }`}
                    style={{ fontSize: 'clamp(1.125rem, 3vw, 1.625rem)' }}
                  >
                    {block.title}
                  </h4>
                  
                  {block.intro && (
                    <p className={`text-sm md:text-xl mb-1.5 ${
                      highlight ? '!text-white' : 'text-gray-600'
                    }`}>
                      {block.intro}
                    </p>
                  )}
                  
                  <ul className="space-y-1">
                    {block.bullets.map((bullet, bulletIndex) => {
                      // Determine if the bullet is part of "Mastery Boosters"
                      const isBooster = block.isAddons;
                      
                      return (
                        <li key={bulletIndex} className={`text-sm md:text-xl flex items-start ${
                          highlight ? '!text-white' : 'text-gray-600'
                        } ${isBooster ? 'font-bold' : ''}`}>
                          <span className={`mr-2 mt-0.5 ${
                            highlight ? 'text-gray-400' : 'text-gray-400'
                          }`}>•</span>
                          {bullet}
                        </li>
                      );
                    })}
                  </ul>
                  
                  {block.footer && (
                    <p className={`text-xs md:text-lg mt-1.5 italic ${
                      highlight ? '!text-gray-400' : 'text-gray-400'
                    }`}>
                      {block.footer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={ctaAction}
          className={`w-full mt-5 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg md:text-2xl ${
            highlight 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {ctaText}
          <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export function OfferModelSectionMultilang() {
  const { language, t } = useLanguage();

  // ... (keeping the same data definitions)
  const addonsBlock: OfferBlock = {
    title: 'Mastery Boosters',
    intro: language === 'fr' 
      ? 'Modules pour accélérer ta progression :'
      : 'Modules to accelerate your progress:',
    bullets: [
      t('offer.addons.1'),
      t('offer.addons.2'),
      t('offer.addons.3'),
      t('offer.addons.4')
    ],
    isAddons: true
  };

  const addonsBlockExam: OfferBlock = {
    title: 'Mastery Boosters',
    intro: language === 'fr' 
      ? 'Modules pour accélérer ta progression :'
      : 'Modules to accelerate your progress:',
    bullets: [
      t('offer.addons.1'),
      t('offer.addons.2'),
      t('offer.addons.3')
    ],
    isAddons: true
  };

  const masteryProgramsBlocks: OfferBlock[] = [
    {
      title: t('offer.mastery.block1.title'),
      intro: t('offer.mastery.block1.intro'),
      bullets: language === 'fr' 
        ? ["Slides manuscrits & Q&A", "Exercices + corrections détaillées", "Accès à la communauté & aux cercles", "Support WhatsApp"]
        : ["Handwritten slides & Q&A", "Exercises + detailed corrections", "Community & study circles access", "WhatsApp Support"]
    },
    {
      title: t('offer.mastery.block2.title'),
      intro: t('offer.mastery.block2.intro'),
      bullets: language === 'fr'
        ? ["Beginner", "Intermediate", "Advanced"]
        : ["Beginner", "Intermediate", "Advanced"],
      footer: language === 'fr' 
        ? "(Le niveau est attribué automatiquement grâce au diagnostic.)"
        : "(Level is automatically assigned through the diagnosis.)"
    },
    addonsBlock
  ];

  const examPrepBlocks: OfferBlock[] = [
    {
      title: t('offer.exam.block1.title'),
      intro: t('offer.exam.block1.intro'),
      bullets: language === 'fr'
        ? ["Slides manuscrits", "Exercices corrigés & entraînement progressif", "Accès communauté & Q&A", "Support WhatsApp"]
        : ["Handwritten slides", "Corrected exercises & progressive training", "Community & Q&A access", "WhatsApp Support"]
    },
    addonsBlockExam
  ];

  return (
    <section id="offre" className="py-6 md:py-8 px-4 md:px-6 lg:px-8 bg-gray-50 flex items-center scroll-mt-40">
      <div className="max-w-[1280px] mx-auto w-full">
        <div className="text-center mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 leading-tight"
            style={{ fontSize: 'clamp(1.25rem, 6.5vw, 3.25rem)' }}
          >
            {t('offer.title')} <span className="text-blue-600">{t('offer.title.highlight')}</span>.
          </motion.h2>
        </div>

        {/* Offer Cards */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <OfferCard
            icon={GraduationCap}
            title={t('offer.mastery.title')}
            subtitle={''}
            blocks={masteryProgramsBlocks}
            ctaText={t('offer.mastery.cta')}
            ctaAction={() => document.getElementById('whatsapp-contact')?.scrollIntoView({ behavior: 'smooth' })}
            delay={0}
            badges={[
              { text: language === 'fr' ? 'Diagnostic offert' : 'Free diagnosis', icon: Gift },
              { text: language === 'fr' ? 'Boosters offerts 4 semaines' : '4 weeks free boosters', icon: Sparkles },
              { text: language === 'fr' ? 'Previews disponibles' : 'Previews available', icon: Eye }
            ]}
          />

          <OfferCard
            icon={Target}
            title={t('offer.exam.title')}
            subtitle={''}
            blocks={examPrepBlocks}
            ctaText={t('offer.exam.cta')}
            ctaAction={() => document.getElementById('whatsapp-contact')?.scrollIntoView({ behavior: 'smooth' })}
            delay={0.15}
            highlight={true}
            badges={[
              { text: language === 'fr' ? 'Previews disponibles' : 'Previews available', icon: Eye }
            ]}
          />
        </div>
      </div>
    </section>
  );
}

