'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export function ZakChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  const content = {
    fr: {
      greeting: "Hey, c'est Zak",
      role: "Fondateur de Science Made Simple",
      quote: "J'ai créé SMS après plus de 10 ans à accompagner des étudiants. Ce que j'ai constaté ? La plupart des difficultés viennent de bases mal comprises. Pas d'un manque d'intelligence.",
      approach: "Ma méthode : on reprend tout depuis le début, sans jugement. On creuse le \"pourquoi\" jusqu'à ce que ça devienne limpide. 90% de pratique sur de vrais examens.",
      cta: "En savoir plus",
    },
    en: {
      greeting: "Hey, I'm Zak",
      role: "Founder of Science Made Simple",
      quote: "I created SMS after 10+ years helping students. What I've noticed? Most difficulties come from poorly understood basics. Not from a lack of intelligence.",
      approach: "My method: we start from scratch, without judgment. We dig into the \"why\" until it becomes crystal clear. 90% practice on real exams.",
      cta: "Learn more",
    },
  };

  const t = content[language];

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="relative">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-2xl">
            <Image
              src="/mentors/zak.jpg"
              alt="Zak"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
        </div>
        
        {/* Hover tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl whitespace-nowrap shadow-lg font-medium">
              {t.greeting} 👋
              <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-gray-900" />
            </div>
          </div>
        )}
      </motion.button>

      {/* Personal Card Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-32 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)]"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
              >
                <X size={16} className="text-gray-600" />
              </button>

              {/* Header with photo */}
              <div className="pt-8 pb-6 px-6 text-center bg-gradient-to-b from-gray-50 to-white">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto mb-4">
                  <Image
                    src="/mentors/zak.jpg"
                    alt="Zak"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{t.greeting} 👋</h3>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>

              {/* Quote/Message */}
              <div className="px-6 pb-6">
                <div className="relative">
                  <Quote size={24} className="text-[#00c2ff]/20 absolute -top-2 -left-1" />
                  <p className="text-gray-700 leading-relaxed pl-5 text-[15px]">
                    {t.quote}
                  </p>
                </div>
                
                <p className="text-gray-600 leading-relaxed mt-4 text-[15px]">
                  {t.approach}
                </p>

                {/* CTA */}
                <a
                  href="#mentor"
                  onClick={() => setIsOpen(false)}
                  className="mt-6 w-full py-3.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group"
                >
                  <span>{t.cta}</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
