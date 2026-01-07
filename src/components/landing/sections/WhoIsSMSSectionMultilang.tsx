'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';

const WHATSAPP_NUMBER = '32477025622';

export function WhoIsSMSSectionMultilang() {
  const { language, t } = useLanguage();
  const { openDiagnostic } = useDiagnostic();
  const [isFor, setIsFor] = useState(true);
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const toggleExpand = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const WHATSAPP_DEFAULT_MESSAGE = language === 'fr' 
    ? 'Salut 👋 Je veux en savoir plus sur Science Made Simple !'
    : 'Hi 👋 I want to learn more about Science Made Simple!';

  const handleEnrollClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  // === SMS EST FAIT POUR TOI SI... ===
  const type1 = language === 'fr' ? {
    title: 'Tu veux gagner du temps',
    bullets: [
      'Tu veux aller droit à l\'essentiel',
      'Tu préfères des explications simples, sans jargon',
      'Tu veux comprendre rapidement à quoi sert la théorie',
      'Tu veux avancer à ton rythme, sans te disperser',
      'Tu apprends une méthode claire, que tu retrouves et réutilises dans tous les cours'
    ]
  } : {
    title: 'You want to save time',
    bullets: [
      'You want to get straight to the point',
      'You prefer simple explanations, without jargon',
      'You want to quickly understand what theory is for',
      'You want to progress at your own pace, without getting scattered',
      'You learn a clear method that you can find and reuse in all courses'
    ]
  };

  const type2 = language === 'fr' ? {
    title: 'Tu es en difficulté et tu veux être accompagné',
    bullets: [
      'Tu as l\'impression d\'avoir des lacunes',
      'Tu veux repartir des bases, sans être jugé',
      'Tu as besoin qu\'on t\'aide à comprendre ce qui bloque',
      'Tu veux pouvoir poser tes questions quand tu en as besoin',
      'Tu ne veux plus avancer seul'
    ]
  } : {
    title: 'You\'re struggling and want support',
    bullets: [
      'You feel like you have gaps',
      'You want to start from basics without being judged',
      'You need help understanding what\'s blocking you',
      'You want to ask questions when you need to',
      'You don\'t want to move forward alone anymore'
    ]
  };

  const type3 = language === 'fr' ? {
    title: 'Tu veux être ultra-performant',
    bullets: [
      'Tu as de bonnes bases, mais tu sais que travailler seul te limite',
      'Tu veux vraiment comprendre, pas apprendre par cœur',
      'Tu veux t\'entraîner sur des situations proches des examens',
      'Tu veux savoir où tu en es et comment progresser',
      'Tu cherches un cadre exigeant, mais humain'
    ]
  } : {
    title: 'You want to be ultra-performant',
    bullets: [
      'You have good foundations, but you know working alone limits you',
      'You want to truly understand, not just memorize',
      'You want to practice on exam-like situations',
      'You want to know where you stand and how to improve',
      'You\'re looking for a demanding but human framework'
    ]
  };

  // === SMS N'EST PAS POUR TOI SI... ===
  const notType1 = language === 'fr' ? {
    title: 'Tu cherches une solution facile ou rapide',
    bullets: [
      { text: 'Tu espères des résultats sans vraiment travailler', isNegative: true },
      { text: 'Tu cherches des raccourcis ou une "méthode miracle"', isNegative: true },
      { text: 'Tu veux réussir sans revoir les cours après les séances', isNegative: true },
      { text: 'Tu penses qu\'une seule explication suffit', isNegative: true },
      { text: 'Tu n\'es pas prêt à t\'investir sur la durée', isNegative: true }
    ]
  } : {
    title: 'You\'re looking for an easy or quick solution',
    bullets: [
      { text: 'You expect results without really working', isNegative: true },
      { text: 'You\'re looking for shortcuts or a "miracle method"', isNegative: true },
      { text: 'You want to succeed without reviewing courses after sessions', isNegative: true },
      { text: 'You think one explanation is enough', isNegative: true },
      { text: 'You\'re not ready to invest in the long term', isNegative: true }
    ]
  };

  const notType2 = language === 'fr' ? {
    title: 'Tu veux être aidé, mais sans t\'impliquer',
    bullets: [
      { text: 'Tu veux qu\'on fasse le travail à ta place', isNegative: true },
      { text: 'Tu ne comptes pas revoir les séances de ton côté', isNegative: true },
      { text: 'Tu ne refais pas les exercices après les cours', isNegative: true },
      { text: 'Tu poses rarement des questions, même quand tu bloques', isNegative: true },
      { text: 'Tu attends des résultats sans changer tes habitudes', isNegative: true }
    ]
  } : {
    title: 'You want help, but without getting involved',
    bullets: [
      { text: 'You want someone to do the work for you', isNegative: true },
      { text: 'You don\'t plan to review sessions on your own', isNegative: true },
      { text: 'You don\'t redo exercises after class', isNegative: true },
      { text: 'You rarely ask questions, even when stuck', isNegative: true },
      { text: 'You expect results without changing your habits', isNegative: true }
    ]
  };

  const notType3 = language === 'fr' ? {
    title: 'Tu manques de temps ou de régularité',
    bullets: [
      { text: 'Tu n\'es pas prêt à réserver du temps chaque semaine', isNegative: true },
      { text: 'Tu sais que tu ne suivras pas un rythme régulier', isNegative: true },
      { text: 'Tu n\'es pas prêt à suivre un planning de travail', isNegative: true },
      { text: 'Tu repousses souvent les révisions importantes', isNegative: true },
      { text: 'Tu sais que tu ne tiendras pas dans la durée', isNegative: true }
    ]
  } : {
    title: 'You lack time or consistency',
    bullets: [
      { text: 'You\'re not ready to set aside time each week', isNegative: true },
      { text: 'You know you won\'t follow a regular rhythm', isNegative: true },
      { text: 'You\'re not ready to follow a work schedule', isNegative: true },
      { text: 'You often postpone important revisions', isNegative: true },
      { text: 'You know you won\'t stick with it long-term', isNegative: true }
    ]
  };

  const currentTypes = isFor ? [type1, type2, type3] : [notType1, notType2, notType3];

  return (
    <section id="for-you" className="py-8 md:py-12 px-6 md:px-8 lg:px-10 bg-[#0d1317] noise-overlay-strong scroll-mt-40">
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
            style={{ fontSize: 'clamp(2rem, 8vw, 64px)', color: '#F7F7F7' }}
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
                  {type.bullets
                    .slice(0, expandedCards.includes(index) ? undefined : 3)
                    .map((bullet: string | { text: string; isNegative: boolean }, bulletIndex: number) => {
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
                          <span className="!text-white leading-relaxed" style={{ fontSize: '14px' }}>{text}</span>
                        </li>
                      );
                    })}
                </ul>
                
                {/* Voir plus / Voir moins button */}
                {type.bullets.length > 3 && (
                  <button
                    onClick={() => toggleExpand(index)}
                    className="mt-4 flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    <span>{expandedCards.includes(index) 
                      ? (language === 'fr' ? 'Voir moins' : 'See less') 
                      : (language === 'fr' ? 'Voir plus' : 'See more')
                    }</span>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform ${expandedCards.includes(index) ? 'rotate-180' : ''}`} 
                    />
                  </button>
                )}
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
          <button
            onClick={openDiagnostic}
            className="group px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-500 transition-all duration-300 inline-flex items-center gap-3 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-105 cursor-pointer"
            style={{ fontSize: '18px' }}
          >
            {language === 'fr' ? 'Découvrir mon parcours idéal' : 'Discover my ideal learning path'}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-4 text-white text-sm font-medium">
            {language === 'fr' ? 'Gratuit • Sans engagement • 2 minutes' : 'Free • No commitment • 2 minutes'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}


