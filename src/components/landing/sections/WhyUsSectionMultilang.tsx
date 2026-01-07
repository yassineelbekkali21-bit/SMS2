'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const WHATSAPP_NUMBER = '32477025622';

export function WhyUsSectionMultilang() {
  const { language, t } = useLanguage();
  const [expandedSmsIndex, setExpandedSmsIndex] = useState<number | null>(null);
  const [expandedTradIndex, setExpandedTradIndex] = useState<number | null>(null);

  const WHATSAPP_DEFAULT_MESSAGE = language === 'fr' 
    ? 'Salut 👋 Votre méthode m\'intéresse ! Je veux voir comment elle s\'applique à ma situation.'
    : 'Hi 👋 Your method interests me! I want to see how it applies to my situation.';

  // Points for Traditional Tutoring with accordion
  const traditionalPoints = language === 'fr' ? [
    {
      title: "Coût à l'heure répétitif",
      description: "30€ à 60€/h. Le compteur tourne en permanence. Si tu arrêtes de payer, tu n'as plus rien."
    },
    {
      title: "Contenu théorique \"froid\"",
      description: "Des slides PowerPoint ou des livres de texte intimidants, impossibles à reproduire tel quel sur ta copie d'examen."
    },
    {
      title: "Disponibilité limitée",
      description: "Si tu bloques le soir ou le week-end, tu dois attendre le prochain cours (et repayer) pour avoir la réponse."
    },
    {
      title: "Ressources éparpillées",
      description: "Quelques heures de cours ici et là, jamais assez pour couvrir tout le programme en profondeur."
    },
    {
      title: "Méthodes dispersées",
      description: "Entre tes différents profs et internet, les explications se contredisent et t'embrouillent."
    },
    {
      title: "Isolement",
      description: "Quand c'est dur, tu es seul(e) face à ta feuille. C'est là que la motivation décroche."
    }
  ] : [
    {
      title: "Repetitive hourly cost",
      description: "$30-60/hour. The meter is always running. If you stop paying, you have nothing left."
    },
    {
      title: "Cold theoretical content",
      description: "PowerPoint slides or intimidating textbooks, impossible to reproduce on your exam paper."
    },
    {
      title: "Limited availability",
      description: "If you're stuck in the evening or on weekends, you have to wait for the next lesson (and pay again) to get an answer."
    },
    {
      title: "Scattered resources",
      description: "A few hours of lessons here and there, never enough to cover the entire program in depth."
    },
    {
      title: "Dispersed methods",
      description: "Between your different teachers and the internet, explanations contradict each other and confuse you."
    },
    {
      title: "Isolation",
      description: "When it's hard, you're alone facing your paper. That's when motivation drops."
    }
  ];

  // Points for SMS with accordion
  const smsPoints = language === 'fr' ? [
    {
      title: "Accès Lifetime (À vie)",
      description: "Tu achètes ton \"Mastery\" une seule fois. Il est à toi pour toujours. Zéro stress de temps."
    },
    {
      title: "Supports Manuscrit & Authentiques",
      description: "Pas de slides. Le prof écrit à la main, comme toi. On te montre que c'est faisable humainement, on \"construit\" le savoir avec toi."
    },
    {
      title: "Des centaines d'heures de cours",
      description: "Un catalogue colossal et complet pour chaque matière (Mastery). Tout est couvert, en détail, sans limite de visionnage."
    },
    {
      title: "Réponses à tes questions 7j/7",
      description: "Compris dans l'accès. Un blocage ? On te répond, on t'explique, on te débloque à tout moment."
    },
    {
      title: "Learning Track personnalisé",
      description: "On ne te laisse pas seul face aux centaines d'heures. On te trace ta route exacte pour réussir (ton GPS)."
    },
    {
      title: "Focus 100% Examen",
      description: "Tout est construit sur des questions réelles d'examen pour t'entraîner sur ce qui compte vraiment."
    },
    {
      title: "Communauté d'entraide",
      description: "Tu rejoins les autres étudiants du Mastery. On s'entraide, on avance ensemble, sans jugement."
    }
  ] : [
    {
      title: "Lifetime Access",
      description: "You buy your \"Mastery\" once. It's yours forever. Zero time stress."
    },
    {
      title: "Handwritten & Authentic Content",
      description: "No slides. The teacher writes by hand, like you. We show you it's humanly doable, we \"build\" knowledge with you."
    },
    {
      title: "Hundreds of hours of lessons",
      description: "A colossal and complete catalog for each subject (Mastery). Everything is covered, in detail, with no viewing limit."
    },
    {
      title: "Answers to your questions 7/7",
      description: "Included in access. Stuck? We answer, explain, and unblock you at any time."
    },
    {
      title: "Personalized Learning Track",
      description: "We don't leave you alone with hundreds of hours. We map your exact path to success (your GPS)."
    },
    {
      title: "100% Exam Focus",
      description: "Everything is built on real exam questions to train you on what really matters."
    },
    {
      title: "Support Community",
      description: "You join other Mastery students. We help each other, move forward together, without judgment."
    }
  ];

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const toggleExpandSms = (index: number) => {
    setExpandedSmsIndex(expandedSmsIndex === index ? null : index);
  };

  const toggleExpandTrad = (index: number) => {
    setExpandedTradIndex(expandedTradIndex === index ? null : index);
  };

  return (
    <section id="why-us" className="py-24 md:py-32 px-6 md:px-8 lg:px-10 bg-white overflow-hidden scroll-mt-40">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 
            className="font-title text-4xl leading-tight tracking-wide"
            style={{ fontSize: 'clamp(2rem, 8vw, 64px)' }}
          >
            {t('why.title')} {t('why.title.highlight')}.
          </h2>
        </motion.div>

        {/* Versus Cards */}
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Left Card - Traditional (order-2 on mobile, order-1 on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0d1317] rounded-3xl p-5 md:p-8 order-2 md:order-1 md:col-span-5 noise-overlay-strong self-start"
          >
            <h3 className="text-2xl md:text-3xl font-medium !text-gray-400 mb-6">
              {language === 'fr' ? 'Soutien Scolaire Traditionnel' : 'Traditional Tutoring'}
            </h3>
            
            <div className="w-full h-px bg-gray-700 mb-6" />
            
            {/* Points with accordion style */}
            <ul className="divide-y divide-gray-800">
              {traditionalPoints.map((point, index) => (
                <li key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleExpandTrad(index)}
                    className="w-full flex items-center gap-4 text-left group min-h-[24px]"
                  >
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      expandedTradIndex === index ? 'bg-red-900/30' : 'bg-gray-800 group-hover:bg-red-900/30'
                    }`}>
                      <X className={`w-4 h-4 transition-colors ${
                        expandedTradIndex === index ? 'text-red-400' : 'text-gray-500 group-hover:text-red-400'
                      }`} strokeWidth={2.5} />
                    </div>
                    <span 
                      className={`flex-1 transition-colors ${
                        expandedTradIndex === index ? 'text-red-400' : 'text-gray-300 group-hover:text-red-400'
                      }`}
                      style={{ fontSize: '18px' }}
                    >
                      {point.title}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 transition-all duration-300 ${
                        expandedTradIndex === index ? 'rotate-180 text-red-400' : 'text-gray-600'
                      }`} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedTradIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-400 leading-relaxed mt-3 ml-11 pr-4" style={{ fontSize: '16px' }}>
                          {point.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Card - SMS (order-1 on mobile, order-2 on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F5F5F5] rounded-3xl p-5 md:p-8 ring-1 ring-gray-300 ring-offset-4 ring-offset-white relative shadow-xl order-1 md:order-2 md:col-span-7"
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
            <h3 className="font-title text-gray-900 mb-6" style={{ fontSize: '22px' }}>
              Science Made Simple
            </h3>

            <div className="w-full h-px bg-gray-300 mb-6" />
            
            {/* Points avec accordion - hauteur minimale pour alignement */}
            <ul className="divide-y divide-gray-200">
              {smsPoints.map((point, index) => (
                <li key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleExpandSms(index)}
                    className="w-full flex items-center gap-4 text-left group min-h-[24px]"
                  >
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      expandedSmsIndex === index ? 'bg-[#00c2ff]/20' : 'bg-gray-200 group-hover:bg-[#00c2ff]/20'
                    }`}>
                      <Check className={`w-5 h-5 transition-colors ${
                        expandedSmsIndex === index ? 'text-[#00c2ff]' : 'text-gray-800 group-hover:text-[#00c2ff]'
                      }`} strokeWidth={3} />
                    </div>
                    <span 
                      className={`flex-1 transition-colors ${
                        expandedSmsIndex === index ? 'text-[#00c2ff]' : 'text-gray-800 group-hover:text-[#00c2ff]'
                      }`}
                      style={{ fontSize: '18px' }}
                    >
                      {point.title}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 transition-all duration-300 ${
                        expandedSmsIndex === index ? 'rotate-180 text-[#00c2ff]' : 'text-gray-400'
                      }`} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedSmsIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-600 leading-relaxed mt-3 ml-11 pr-4" style={{ fontSize: '16px' }}>
                          {point.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>

            {/* CTA Button - Theme color */}
          <button
            onClick={handleWhatsAppClick}
              className="w-full mt-10 px-6 md:px-8 py-3 md:py-4 bg-[#00c2ff] hover:bg-[#00a8e0] text-white rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
              style={{ fontSize: '18px' }}
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
