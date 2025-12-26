'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const WHATSAPP_NUMBER = '32477025622';

export function WhoIsSMSSectionMultilang() {
  const { language, t } = useLanguage();
  const [isFor, setIsFor] = useState(true);

  const WHATSAPP_DEFAULT_MESSAGE = language === 'fr' 
    ? 'Salut 👋 Je veux en savoir plus sur Science Made Simple !'
    : 'Hi 👋 I want to learn more about Science Made Simple!';

  const handleEnrollClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  // === SMS EST FAIT POUR TOI SI... ===
  const type1 = language === 'fr' ? {
    title: 'Tu veux gagner du temps dans tes études',
    bullets: [
      'Méthode unique pour toutes matières scientifiques',
      'Structure claire pour avancer sans te disperser',
      'Rythme flexible, compatible avec ton quotidien',
      'Résultats sans sacrifier ta vie personnelle'
    ]
  } : {
    title: 'You want to save time in your studies',
    bullets: [
      'Unique method for all science subjects',
      'Clear structure to move forward without getting scattered',
      'Flexible pace, compatible with your daily life',
      'Results without sacrificing your personal life'
    ]
  };

  const type2 = language === 'fr' ? {
    title: 'Tu veux t\'en sortir malgré des difficultés actuelles',
    bullets: [
      'Diagnostic qui t\'oriente',
      'Plan d\'action clair et priorisé',
      'Reprise solide des bases',
      'Remise à niveau durable',
      'Routine efficace pour éviter un nouveau décrochage'
    ]
  } : {
    title: 'You want to succeed despite current difficulties',
    bullets: [
      'Diagnostic that guides you',
      'Clear and prioritized action plan',
      'Solid review of the basics',
      'Lasting catch-up',
      'Effective routine to avoid falling behind again'
    ]
  };

  const type3 = language === 'fr' ? {
    title: 'Tu veux être ultra-performant et premier de ta promotion',
    bullets: [
      'Méthode de maîtrise avancée',
      'Niveaux de difficulté adaptés à ton ambition',
      'Performance mesurable et durable'
    ]
  } : {
    title: 'You want to be top performer and first in your class',
    bullets: [
      'Advanced mastery method',
      'Difficulty levels adapted to your ambition',
      'Measurable and lasting performance'
    ]
  };

  // === SMS N'EST PAS POUR TOI SI... ===
  const notType1 = language === 'fr' ? {
    title: 'Tu cherches une solution miracle',
    bullets: [
      { text: 'Pas de promesses irréalistes', isNegative: true },
      { text: 'Une méthode éprouvée et structurée', isNegative: false },
      { text: 'Une progression claire, étape par étape', isNegative: false },
      { text: 'Des résultats solides et durables', isNegative: false }
    ]
  } : {
    title: 'You\'re Looking for a Miracle Solution',
    bullets: [
      { text: 'No unrealistic promises', isNegative: true },
      { text: 'A proven and structured method', isNegative: false },
      { text: 'Clear progress, step by step', isNegative: false },
      { text: 'Solid and lasting results', isNegative: false }
    ]
  };

  const notType2 = language === 'fr' ? {
    title: 'Tu ne veux pas faire d\'efforts',
    bullets: [
      { text: 'Le succès exige un engagement réel', isNegative: false },
      { text: 'Ton implication personnelle est indispensable', isNegative: false },
      { text: 'Régularité et discipline font la différence', isNegative: false },
      { text: 'Aucun raccourci sans travail', isNegative: true }
    ]
  } : {
    title: 'You Don\'t Want to Put in Effort',
    bullets: [
      { text: 'Success requires real commitment', isNegative: false },
      { text: 'Your personal involvement is essential', isNegative: false },
      { text: 'Consistency and discipline make the difference', isNegative: false },
      { text: 'No shortcuts without work', isNegative: true }
    ]
  };

  const notType3 = language === 'fr' ? {
    title: 'Tu veux du contenu générique',
    bullets: [
      { text: 'Un accompagnement adapté à ton niveau', isNegative: false },
      { text: 'Un parcours sur mesure selon tes objectifs', isNegative: false },
      { text: 'Des actions concrètes, pas de blabla', isNegative: false }
    ]
  } : {
    title: 'You Want Generic Content',
    bullets: [
      { text: 'Support adapted to your level', isNegative: false },
      { text: 'A custom path based on your goals', isNegative: false },
      { text: 'Concrete actions, no blabla', isNegative: false }
    ]
  };

  const currentTypes = isFor ? [type1, type2, type3] : [notType1, notType2, notType3];

  return (
    <section className="py-8 md:py-12 px-6 md:px-8 lg:px-10 bg-[#0d1317] noise-overlay-strong">
      <div className="max-w-[1200px] mx-auto">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 
            className="font-title mb-4 tracking-wide"
            style={{ fontSize: 'clamp(1.5rem, 6vw, 52px)', color: '#FFFFFF' }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isFor ? 'for' : 'not-for'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {isFor 
                  ? (language === 'fr' ? 'SMS est fait pour toi si...' : 'SMS is for you if...')
                  : (language === 'fr' ? 'SMS n\'est pas pour toi si...' : 'SMS is not for you if...')
                }
              </motion.span>
            </AnimatePresence>
          </h2>

          {/* Modern Toggle Switch */}
          <div className="flex items-center justify-center mb-2">
            <button
              onClick={() => setIsFor(!isFor)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0d1317] ${
                isFor ? 'bg-blue-600' : 'bg-gray-700'
              }`}
              aria-label={language === 'fr' ? 'Basculer entre pour qui et pas pour qui' : 'Toggle between for and not for'}
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
                animate={{
                  x: isFor ? 0 : 28
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }}
              />
            </button>
          </div>
        </motion.div>

        {/* Content Blocks */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isFor ? 'for' : 'not-for'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-5 md:gap-6 mb-8"
          >
            {currentTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0d1317] rounded-2xl p-6 md:p-8 noise-overlay-strong"
              >
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold !text-white mb-3">
                  {type.title}
                </h3>

                {/* Bullet Points */}
                <ul className="space-y-3">
                  {type.bullets.map((bullet: string | { text: string; isNegative: boolean }, bulletIndex: number) => {
                    const isObject = typeof bullet === 'object';
                    const text = isObject ? bullet.text : bullet;
                    const isNegative = isObject ? bullet.isNegative : false;
                    
                    return (
                      <li key={bulletIndex} className="flex items-start gap-3">
                        {isNegative ? (
                          <X size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Check size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="!text-white text-base md:text-lg leading-relaxed">{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/diagnostic"
            className="group px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-xl hover:bg-blue-500 transition-all duration-300 inline-flex items-center gap-3 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            {language === 'fr' ? 'Découvrir mon parcours idéal' : 'Discover my ideal learning path'}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-white text-sm font-medium">
            {language === 'fr' ? 'Gratuit • Sans engagement • 2 minutes' : 'Free • No commitment • 2 minutes'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}


