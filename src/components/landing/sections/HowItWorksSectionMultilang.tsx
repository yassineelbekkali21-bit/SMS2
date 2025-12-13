'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function HowItWorksSectionMultilang() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: MessageCircle,
      title: t('how.step1.title'),
      description: t('how.step1.desc')
    },
    {
      icon: Calendar,
      title: t('how.step2.title'),
      description: t('how.step2.desc')
    },
    {
      icon: TrendingUp,
      title: t('how.step3.title'),
      description: t('how.step3.desc')
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 px-6 md:px-8 lg:px-10 bg-gray-50 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-gray-900 mb-4 md:mb-8 leading-tight"
            style={{ fontSize: 'clamp(1.4rem, 7vw, 3.75rem)' }}
          >
            {t('how.title')}
            <br className="hidden md:block" />
            <span className="text-blue-600 block md:inline mt-2 md:mt-0">{t('how.title.highlight')}</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                {index + 1}
              </div>

              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-6 mt-2">
                <step.icon className="text-gray-900" size={32} />
              </div>

              <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>

              <p className="text-base md:text-xl text-gray-600 leading-relaxed whitespace-pre-line">
                {step.description.split(/(\[\[.*?\]\])/).map((part, i) => 
                  part.startsWith('[[') && part.endsWith(']]') ? (
                    <span key={i} className="text-blue-600 font-bold">
                      {part.slice(2, -2)}
                    </span>
                  ) : (
                    part
                  )
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}




