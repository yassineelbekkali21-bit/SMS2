'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, Target, ArrowRight, Sparkles, Gift, Eye, CheckCircle, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Badge {
  text: string;
  icon?: React.ElementType;
  color?: 'blue' | 'green' | 'purple' | 'gray';
}

interface OfferBlock {
  title: string;
  titleBadge?: Badge;
  intro?: string;
  bullets: (string | { text: string; badge?: Badge })[];
  footer?: string;
  isAddons?: boolean;
}

interface OfferCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  blocks: OfferBlock[];
  ctaText: string;
  ctaHref?: string;
  ctaAction?: () => void;
  delay?: number;
  highlight?: boolean;
}

function OfferCard({ icon: Icon, title, subtitle, blocks, ctaText, ctaHref, ctaAction, delay = 0, highlight = false }: OfferCardProps) {
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
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <p className={`text-xs font-bold tracking-wider uppercase mb-3 ${
          highlight ? '!text-gray-500' : 'text-gray-400'
        }`}>
          {language === 'fr' ? "CE QUI EST INCLUS" : "WHAT'S INCLUDED"}
        </p>

        <div className="space-y-5 flex-1">
          {blocks.map((block, index) => (
            <div key={index} className="relative">
              {/* Connector Line for multiple blocks */}
              {index < blocks.length - 1 && (
                <div className={`absolute left-3 top-7 bottom-[-24px] w-0.5 ${
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
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 
                      className={`font-bold text-lg ${
                      highlight ? '!text-white' : 'text-gray-900'
                    }`}
                    style={{ fontSize: 'clamp(1.125rem, 3vw, 1.625rem)' }}
                  >
                    {block.title}
                  </h4>
                    {/* Title Badge */}
                    {block.titleBadge && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wide ${
                        highlight 
                          ? 'bg-blue-600 bg-opacity-20 text-white border border-blue-600 border-opacity-30' 
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {block.titleBadge.icon && <block.titleBadge.icon size={14} />}
                        {block.titleBadge.text}
                      </span>
                    )}
                  </div>
                  
                  {block.intro && (
                    <p className={`text-sm md:text-xl mb-2 ${
                      highlight ? '!text-white' : 'text-gray-600'
                    }`}>
                      {block.intro}
                    </p>
                  )}
                  
                  <ul className="space-y-2">
                    {block.bullets.map((bullet, bulletIndex) => {
                      const isBooster = block.isAddons;
                      const text = typeof bullet === 'string' ? bullet : bullet.text;
                      const badge = typeof bullet === 'string' ? undefined : bullet.badge;
                      
                      return (
                        <li key={bulletIndex} className={`text-sm md:text-xl flex flex-wrap items-center gap-2 ${
                          highlight ? '!text-white' : 'text-gray-600'
                        } ${isBooster ? 'font-bold' : ''}`}>
                          <div className="flex items-start">
                            <Check size={18} className={`mr-2 mt-0.5 flex-shrink-0 ${
                              highlight ? 'text-blue-400' : 'text-blue-600'
                            }`} strokeWidth={3} />
                            <span>{text}</span>
                          </div>
                          
                          {/* Bullet Badge */}
                          {badge && (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider ${
                              badge.color === 'purple'
                                ? 'text-gray-500 bg-gray-100 border border-gray-200'
                                : highlight 
                                  ? 'bg-blue-600 bg-opacity-20 text-white border border-blue-600 border-opacity-30' 
                                  : 'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                              {badge.icon && <badge.icon size={14} />}
                              {badge.text}
                            </span>
                          )}
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

        {ctaHref ? (
          <Link
            href={ctaHref}
            className={`w-full mt-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg md:text-2xl ${
              highlight 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {ctaText}
            <ArrowRight size={20} />
          </Link>
        ) : (
          <button
            onClick={ctaAction}
            className={`w-full mt-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg md:text-2xl ${
              highlight 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {ctaText}
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function OfferModelSectionMultilang() {
  const { language, t } = useLanguage();

  const comingSoonBadge = { text: 'Coming soon', color: 'purple' as const };
  
  const addonsBlock: OfferBlock = {
    title: 'Mastery Boosters',
    titleBadge: {
      text: language === 'fr' ? '4 semaines offertes' : '4 weeks free',
      icon: Sparkles
    },
    intro: language === 'fr' 
      ? 'Modules pour accélérer ta progression :'
      : 'Modules to accelerate your progress:',
    bullets: [
      t('offer.addons.1'),
      { text: t('offer.addons.2'), badge: comingSoonBadge },
      { text: t('offer.addons.3'), badge: comingSoonBadge },
      { text: t('offer.addons.4'), badge: comingSoonBadge }
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
      { text: t('offer.addons.2'), badge: comingSoonBadge },
      { text: t('offer.addons.3'), badge: comingSoonBadge }
    ],
    isAddons: true
  };

  const masteryProgramsBlocks: OfferBlock[] = [
    {
      title: t('offer.mastery.block1.title'),
      titleBadge: {
        text: language === 'fr' ? 'Previews disponibles' : 'Previews available',
        icon: Eye
      },
      intro: t('offer.mastery.block1.intro'),
      bullets: language === 'fr' 
        ? [
            { text: "Diagnostic d'orientation personnalisé", badge: { text: "Offert", icon: Gift } },
            "250+ slides manuscrits & sessions Q&A en direct", 
            "500+ exercices types examens corrigés pas-à-pas", 
            "Accès à la communauté et aux cercles", 
            "Ton mentor dans ta poche"
          ]
        : [
            { text: "Personalized Orientation Diagnosis", badge: { text: "Free", icon: Gift } },
            "250+ handwritten slides & live Q&A sessions", 
            "500+ exam-style exercises with step-by-step solutions", 
            "Access to the community & study circles", 
            "Your mentor in your pocket"
          ]
    },
    addonsBlock
  ];

  const examPrepBlocks: OfferBlock[] = [
    {
      title: t('offer.exam.block1.title'),
      titleBadge: {
        text: language === 'fr' ? 'Previews disponibles' : 'Previews available',
        icon: Eye
      },
      intro: t('offer.exam.block1.intro'),
      bullets: language === 'fr'
        ? ["Slides manuscrits ciblés sur ton exam", "Banque d'exercices calibrés sur tes épreuves", "Accès aux Cercles d'Étude intensifs", "Mentor dédié"]
        : ["Handwritten slides focused on your exam", "Exercise bank calibrated to your exams", "Access to intensive Study Circles", "Dedicated mentor"]
    },
    addonsBlockExam
  ];

  return (
    <section id="offre" className="py-6 md:py-8 px-4 md:px-6 lg:px-8 bg-white flex items-center scroll-mt-40">
      <div className="max-w-[1280px] mx-auto w-full">
        <div className="text-center mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-3xl leading-tight tracking-wide"
            style={{ fontSize: 'clamp(1.5rem, 6vw, 52px)' }}
          >
            {t('offer.title')} <span>{t('offer.title.highlight')}</span>.
          </motion.h2>
        </div>

        {/* Offer Cards */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <OfferCard
            icon={GraduationCap}
            title={t('offer.mastery.title')}
            subtitle={''}
            blocks={masteryProgramsBlocks}
            ctaText={language === 'fr' ? 'Voir si c\'est fait pour moi' : 'See if it\'s right for me'}
            ctaHref="/diagnostic"
            delay={0}
          />

          <OfferCard
            icon={Target}
            title={t('offer.exam.title')}
            subtitle={''}
            blocks={examPrepBlocks}
            ctaText={language === 'fr' ? 'Voir si c\'est fait pour moi' : 'See if it\'s right for me'}
            ctaHref="/diagnostic"
            delay={0.15}
            highlight={true}
          />
        </div>
      </div>
    </section>
  );
}
