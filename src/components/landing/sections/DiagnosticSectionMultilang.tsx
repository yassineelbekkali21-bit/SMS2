'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';
import { ArrowRight, Check } from 'lucide-react';

const options = {
  fr: [
    { id: 'remonter', label: 'Je veux remonter ma moyenne en sciences' },
    { id: 'examen', label: 'Je prépare un examen important' },
    { id: 'comprendre', label: 'Je veux vraiment comprendre, pas juste mémoriser' },
    { id: 'rattrapage', label: "J'ai décroché et je veux me remettre à niveau" },
    { id: 'excellence', label: "Je vise l'excellence (médecine, ingénieur, prépa...)" },
    { id: 'methode', label: 'Je cherche une méthode qui marche enfin' },
    { id: 'autre', label: 'Autre chose' },
  ],
  en: [
    { id: 'remonter', label: 'I want to improve my science grades' },
    { id: 'examen', label: "I'm preparing for an important exam" },
    { id: 'comprendre', label: 'I want to truly understand, not just memorize' },
    { id: 'rattrapage', label: "I've fallen behind and want to catch up" },
    { id: 'excellence', label: "I'm aiming for excellence (medicine, engineering...)" },
    { id: 'methode', label: "I'm looking for a method that actually works" },
    { id: 'autre', label: 'Something else' },
  ],
};

export function DiagnosticSectionMultilang() {
  const { language } = useLanguage();
  const { openDiagnostic } = useDiagnostic();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const content = language === 'fr' ? {
    title: 'On commence par toi',
    subtitle: 'On cerne ton niveau et tes objectifs, sans jugement ni prérequis.',
    cta: 'Créer mon parcours',
  } : {
    title: 'Let\'s start with you',
    subtitle: 'Tell us what brings you here',
    cta: 'Create my path',
  };

  const currentOptions = language === 'fr' ? options.fr : options.en;

  const toggleOption = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) 
        ? prev.filter(o => o !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-[800px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 
            className="font-title mb-4 leading-tight tracking-wide"
            style={{ fontSize: 'clamp(2rem, 8vw, 64px)', color: 'var(--sms-black, #1A1A1A)' }}
          >
            {content.title}
          </h2>
          <p className="text-gray-500" style={{ fontSize: '22px' }}>
            {content.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3"
        >
          {currentOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              onClick={() => toggleOption(option.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${
                selectedOptions.includes(option.id)
                  ? 'bg-gray-900 border-gray-900 text-white shadow-lg'
                  : 'bg-white border-gray-100 text-gray-700 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                selectedOptions.includes(option.id)
                  ? 'bg-white border-white'
                  : 'border-gray-300 group-hover:border-gray-400'
              }`}>
                {selectedOptions.includes(option.id) && (
                  <Check size={16} className="text-gray-900" strokeWidth={3} />
                )}
              </div>
              <span className="font-medium" style={{ fontSize: '14px' }}>{option.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <button
            onClick={() => {
              if (selectedOptions.length > 0) {
                openDiagnostic();
              }
            }}
            className={`inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold transition-all shadow-lg ${
              selectedOptions.length > 0
                ? 'text-white hover:scale-105 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
            style={{ 
              fontSize: '18px',
              ...(selectedOptions.length > 0 ? { backgroundColor: '#00c2ff' } : {})
            }}
            disabled={selectedOptions.length === 0}
          >
            {content.cta}
            <ArrowRight size={22} />
          </button>
          
          {selectedOptions.length === 0 && (
            <p className="text-gray-400 text-sm mt-3">
              {language === 'fr' ? 'Sélectionne au moins une option' : 'Select at least one option'}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

