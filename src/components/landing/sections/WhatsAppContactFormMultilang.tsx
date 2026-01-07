'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';

const WHATSAPP_NUMBER = '32477025622';

export function WhatsAppContactFormMultilang() {
  const { language } = useLanguage();
  const { openDiagnostic } = useDiagnostic();

  const handleWhatsAppClick = () => {
    const message = language === 'fr' 
      ? 'Salut 👋 J\'ai une question avant de commencer avec Science Made Simple !'
      : 'Hi 👋 I have a question before starting with Science Made Simple!';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="whatsapp-contact" className="py-12 md:py-16 px-6 md:px-8 lg:px-10 bg-[#0d1317] noise-overlay-strong scroll-mt-32">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          className="font-title text-4xl mb-4 tracking-wide"
          style={{ color: '#F7F7F7', fontSize: 'clamp(2rem, 8vw, 64px)' }}
          >
          {language === 'fr' ? <>Prêt à transformer<br />tes résultats ?</> : <>Ready to transform<br />your results?</>}
          </motion.h2>

        <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          className="mb-8"
          style={{ color: 'rgba(255,255,255,0.7)', fontSize: '22px' }}
        >
          {language === 'fr' 
            ? 'Découvre ton parcours personnalisé.' 
            : 'Discover your personalized learning path.'}
        </motion.p>

        {/* Primary CTA - Diagnostic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <button
            onClick={openDiagnostic}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/25 hover:scale-105 cursor-pointer"
            style={{ fontSize: '18px' }}
          >
            {language === 'fr' ? 'Commencer le diagnostic gratuit' : 'Start the free diagnostic'}
            <ArrowRight size={22} />
          </button>
          <p className="mt-3" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            {language === 'fr' ? 'Gratuit • Sans engagement' : 'Free • No commitment'}
          </p>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/20" />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>{language === 'fr' ? 'ou' : 'or'}</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Secondary CTA - WhatsApp Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
            {language === 'fr' ? 'Tu as des questions avant de te lancer ?' : 'Have questions before getting started?'}
          </p>
          <button
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-gray-600 text-white rounded-full font-medium hover:bg-white/10 hover:border-gray-500 transition-colors"
        >
            <MessageCircle size={20} />
            {language === 'fr' ? 'Parler à Zak sur WhatsApp' : 'Talk to Zak on WhatsApp'}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
