'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const WHATSAPP_NUMBER = '32477025622';

export function FAQSectionMultilang() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const faqItems = [
    { id: '1', question: t('faq.q1'), answer: t('faq.a1') },
    { id: '2', question: t('faq.q2'), answer: t('faq.a2') },
    { id: '3', question: t('faq.q3'), answer: t('faq.a3') },
    { id: '4', question: t('faq.q4'), answer: t('faq.a4') },
    { id: '5', question: t('faq.q5'), answer: t('faq.a5') },
    { id: '6', question: t('faq.q6'), answer: t('faq.a6') },
    { id: '7', question: t('faq.q7'), answer: t('faq.a7') },
    { id: '8', question: t('faq.q8'), answer: t('faq.a8') }
  ];

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const handleWhatsAppClick = () => {
    const message = language === 'fr'
      ? 'Salut 👋 J\'ai une question qui n\'est pas dans la FAQ. Pouvez-vous m\'aider ?'
      : 'Hi 👋 I have a question that\'s not in the FAQ. Can you help me?';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="faq" className="py-20 md:py-28 px-6 md:px-8 lg:px-10 bg-gray-50 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-4xl md:text-5xl mb-3 tracking-wide"
            style={{ fontSize: 'clamp(2rem, 8vw, 64px)' }}
          >
            {t('faq.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500"
            style={{ fontSize: '22px' }}
          >
            {t('faq.subtitle')}
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              className="group"
            >
              <button
                onClick={() => toggleFAQ(item.id)}
                className={`w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left transition-all duration-300 ${
                  openId === item.id
                    ? 'bg-black text-white shadow-xl rounded-t-2xl rounded-b-none'
                    : 'bg-white text-black hover:bg-gray-100 border border-gray-200 rounded-2xl'
                }`}
              >
                <span className="font-semibold pr-4 md:pr-8" style={{ fontSize: '14px' }}>
                  {item.question}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 transition-all duration-300 ${
                    openId === item.id
                      ? 'rotate-180 text-white'
                      : 'text-gray-400 group-hover:text-black'
                  }`}
                  size={20}
                />
              </button>
              
              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pt-6 pb-8 bg-white border-x border-b border-gray-200 rounded-b-2xl">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line" style={{ fontSize: '14px' }}>
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}




