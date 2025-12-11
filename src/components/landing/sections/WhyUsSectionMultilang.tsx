'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Users, Brain, MessageCircle, RefreshCw, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WHATSAPP_NUMBER = '32477025622';

export function WhyUsSectionMultilang() {
  const { language, t } = useLanguage();

  const WHATSAPP_DEFAULT_MESSAGE = language === 'fr' 
    ? 'Salut 👋 Votre méthode m\'intéresse ! Je veux voir comment elle s\'applique à ma situation.'
    : 'Hi 👋 Your method interests me! I want to see how it applies to my situation.';

  const reasons = [
    {
      icon: Heart,
      title: t('why.reason1.title'),
      description: t('why.reason1.desc')
    },
    {
      icon: BookOpen,
      title: t('why.reason2.title'),
      description: t('why.reason2.desc')
    },
    {
      icon: Users,
      title: t('why.reason3.title'),
      description: t('why.reason3.desc')
    },
    {
      icon: Brain,
      title: t('why.reason4.title'),
      description: t('why.reason4.desc')
    },
    {
      icon: RefreshCw,
      title: t('why.reason5.title'),
      description: t('why.reason5.desc')
    },
    {
      icon: Target,
      title: t('why.reason6.title'),
      description: t('why.reason6.desc')
    }
  ];

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section className="py-20 md:py-32 px-6 md:px-8 lg:px-10 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 
            className="text-4xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontSize: 'clamp(1.2rem, 6vw, 3rem)' }}
          >
            {t('why.title')}<br />
            {t('why.title.line2')} <span className="text-blue-600">{t('why.title.highlight')}</span>.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon className="text-gray-900" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {reason.title}
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={handleWhatsAppClick}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl inline-flex items-center gap-3"
          >
            <MessageCircle size={22} />
            {t('why.cta')}
          </button>
        </motion.div>
      </div>
    </section>
  );
}




