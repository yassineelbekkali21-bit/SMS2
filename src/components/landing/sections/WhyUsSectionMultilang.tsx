'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const WHATSAPP_NUMBER = '32477025622';

export function WhyUsSectionMultilang() {
  const { language, t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const WHATSAPP_DEFAULT_MESSAGE = language === 'fr' 
    ? 'Salut 👋 Votre méthode m\'intéresse ! Je veux voir comment elle s\'applique à ma situation.'
    : 'Hi 👋 Your method interests me! I want to see how it applies to my situation.';

  const traditionalPoints = language === 'fr' ? [
    "30-60€/heure en moyenne",
    "Profs peu disponibles",
    "Méthodes rigides et génériques",
    "Tu révises seul",
    "Contenu statique et daté",
    "Pas d'entraînement aux vrais examens"
  ] : [
    "$30-60/hour on average",
    "Tutors rarely available",
    "Rigid, generic methods",
    "You study alone",
    "Static, outdated content",
    "No real exam training"
  ];

  const smsPoints = [
    {
      title: t('why.reason1.title'),
      description: t('why.reason1.desc')
    },
    {
      title: t('why.reason3.title'),
      description: t('why.reason3.desc')
    },
    {
      title: t('why.reason5.title'),
      description: t('why.reason5.desc')
    },
    {
      title: t('why.reason2.title'),
      description: t('why.reason2.desc')
    },
    {
      title: t('why.reason4.title'),
      description: t('why.reason4.desc')
    },
    {
      title: t('why.reason6.title'),
      description: t('why.reason6.desc')
    }
  ];

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-32 px-6 md:px-8 lg:px-10 bg-white overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 
            className="text-4xl font-bold text-gray-900 leading-tight"
            style={{ fontSize: 'clamp(1.2rem, 6vw, 3rem)' }}
          >
            {t('why.title')}<br />
            <span className="text-blue-600">{t('why.title.highlight')}</span>.
          </h2>
        </motion.div>

        {/* Versus Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          
          {/* Left Card - Traditional (order-2 on mobile, order-1 on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#1A1A1A] rounded-3xl p-8 md:p-10 order-2 md:order-1"
          >
            <h3 className="text-2xl md:text-3xl font-light !text-gray-400 mb-6">
              {language === 'fr' ? 'Soutien Scolaire Traditionnel' : 'Traditional Tutoring'}
            </h3>
            
            <div className="w-full h-px bg-gray-700 mb-6" />
            
            <ul className="divide-y divide-gray-800">
              {traditionalPoints.map((point, index) => (
                <li key={index} className="flex items-center gap-4 py-5 first:pt-0 last:pb-0">
                  <X className="w-5 h-5 text-gray-600 flex-shrink-0" strokeWidth={2} />
                  <span className="text-gray-400 text-lg">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Card - SMS (order-1 on mobile, order-2 on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F5F5F5] rounded-3xl p-5 md:p-5 ring-1 ring-gray-300 ring-offset-4 ring-offset-white relative md:-my-8 shadow-xl order-1 md:order-2"
          >
            {/* Floating Favicon */}
            <div className="absolute -top-6 -right-6 transform rotate-12 z-20">
              <Image 
                src="/favicon.svg" 
                alt="Icon" 
                width={70}
                height={70}
                className="object-contain"
              />
            </div>

            {/* Logo Text */}
            <div className="relative h-28 w-full max-w-sm mb-6">
              <Image 
                src="/brand/sms-text-logo.svg" 
                alt="Science Made Simple" 
                fill
                className="object-contain object-left"
              />
            </div>
            
            <div className="w-full h-px bg-gray-300 mb-6" />
            
            <ul className="divide-y divide-gray-200">
              {smsPoints.map((point, index) => (
                <li key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleExpand(index)}
                    className="w-full flex items-center gap-4 text-left group"
                  >
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      expandedIndex === index ? 'bg-blue-100' : 'bg-gray-200 group-hover:bg-blue-100'
                    }`}>
                      <Check className={`w-5 h-5 transition-colors ${
                        expandedIndex === index ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600'
                      }`} strokeWidth={3} />
                    </div>
                    <span 
                      className={`flex-1 transition-colors ${
                        expandedIndex === index ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600'
                      }`}
                      style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)' }}
                    >
                      {point.title}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 transition-all duration-300 ${
                        expandedIndex === index ? 'rotate-180 text-blue-600' : 'text-gray-400'
                      }`} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mt-3 ml-11 pr-4">
                          {point.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full mt-10 px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {language === 'fr' ? 'Commencer maintenant' : 'Get Started Now'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
