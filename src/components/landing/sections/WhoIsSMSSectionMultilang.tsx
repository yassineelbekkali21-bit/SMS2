'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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

  // Avatar colors like in hero section
  const avatarColors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-green-500 to-green-600'
  ];

  const type1 = language === 'fr' ? {
    title: 'Tu as des lacunes à combler',
    description: 'Tu bloques sur certains concepts ou tu as besoin de reprendre les bases ? Pas de problème. SMS t\'aide à combler tes faiblesses avec une méthode claire et un accompagnement qui s\'adapte à ton rythme. On repart de là où tu en es, sans jugement.'
  } : {
    title: 'You Have Gaps to Fill',
    description: 'Stuck on certain concepts or need to review the basics? No problem. SMS helps you fill your weaknesses with a clear method and support that adapts to your pace. We start from where you are, no judgment.'
  };

  const type2 = language === 'fr' ? {
    title: 'Tu veux viser l\'excellence',
    description: 'Tu as déjà de bonnes bases mais tu veux aller plus loin ? Préparer des examens exigeants ou viser les meilleures notes ? SMS te donne la méthode et les outils pour dépasser tes limites et atteindre tes objectifs les plus ambitieux.'
  } : {
    title: 'You Want to Aim for Excellence',
    description: 'You already have good foundations but want to go further? Preparing for demanding exams or aiming for top grades? SMS gives you the method and tools to push your limits and achieve your most ambitious goals.'
  };

  const type3 = language === 'fr' ? {
    title: 'Tu cherches une vraie méthode',
    description: 'Tu en as marre des cours impersonnels qui ne fonctionnent pas ? Tu veux une approche humaine, claire et qui te fait vraiment progresser ? SMS, c\'est une méthode éprouvée, un mentor disponible et une communauté qui avance ensemble. Pas de blabla, que du concret.'
  } : {
    title: 'You\'re Looking for a Real Method',
    description: 'Tired of impersonal courses that don\'t work? Want a human, clear approach that actually makes you progress? SMS is a proven method, an available mentor, and a community that moves forward together. No fluff, just results.'
  };

  // Content for "Who is SMS NOT for"
  const notType1 = language === 'fr' ? {
    title: 'Tu cherches une solution miracle',
    description: 'Tu penses qu\'il existe une méthode magique qui te fera réussir sans effort ? SMS n\'est pas pour toi. On croit en la progression par le travail, la méthode et l\'accompagnement. Pas de raccourcis, juste des résultats durables.'
  } : {
    title: 'You\'re Looking for a Miracle Solution',
    description: 'Think there\'s a magic method that will make you succeed without effort? SMS is not for you. We believe in progress through work, method, and support. No shortcuts, just lasting results.'
  };

  const notType2 = language === 'fr' ? {
    title: 'Tu préfères travailler seul',
    description: 'Tu n\'aimes pas l\'idée d\'une communauté, d\'un mentor disponible, ou d\'un accompagnement personnalisé ? SMS n\'est probablement pas adapté. On fonctionne en équipe, pas en mode solo. La force du groupe fait la différence.'
  } : {
    title: 'You Prefer to Work Alone',
    description: 'Don\'t like the idea of a community, an available mentor, or personalized support? SMS is probably not for you. We work as a team, not solo mode. The strength of the group makes the difference.'
  };

  const notType3 = language === 'fr' ? {
    title: 'Tu veux du contenu générique',
    description: 'Tu cherches des cours impersonnels, des vidéos pré-enregistrées sans suivi, ou une approche "one-size-fits-all" ? SMS n\'est pas ta solution. On privilégie le personnalisé et l\'humain. Chaque étudiant est unique, chaque parcours aussi.'
  } : {
    title: 'You Want Generic Content',
    description: 'Looking for impersonal courses, pre-recorded videos without follow-up, or a "one-size-fits-all" approach? SMS is not your solution. We prioritize personalized and human. Every student is unique, every journey too.'
  };

  const currentTypes = isFor ? [type1, type2, type3] : [notType1, notType2, notType3];

  return (
    <section className="py-20 md:py-32 px-6 md:px-8 lg:px-10 bg-black">
      <div className="max-w-[1200px] mx-auto">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="font-bold mb-6 text-white"
            style={{ fontSize: 'clamp(1.25rem, 6.5vw, 3.25rem)', color: '#FFFFFF' }}
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
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => setIsFor(!isFor)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black ${
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
            className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12"
          >
            {currentTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1A1A1A] rounded-3xl p-8 md:p-10"
              >
                {/* Profile Pictures */}
                <div className="flex -space-x-3 mb-6">
                  {avatarColors.map((color, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`w-12 h-12 rounded-full ${color} border-2 border-gray-800`}
                    />
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold !text-white mb-4">
                  {type.title}
                </h3>

                {/* Description */}
                <p className="!text-white text-lg leading-relaxed opacity-90">
                  {type.description}
                </p>
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
            onClick={handleEnrollClick}
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-xl hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            {language === 'fr' ? 'Commencer maintenant' : 'Enroll Now'}
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}


