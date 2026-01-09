'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, TrendingUp } from 'lucide-react';

const WHATSAPP_NUMBER = '33123456789';
const WHATSAPP_DEFAULT_MESSAGE = 'Salut Science Made Simple 👋, j\'aimerais qu\'on regarde ensemble ma situation pour voir comment vous pouvez m\'aider.';

const steps = [
  {
    icon: MessageCircle,
    title: 'On commence par toi.',
    description: 'On identifie tes difficultés, ton niveau et ce que tu veux vraiment maîtriser.\nPas de jugement, pas de prérequis — juste un diagnostic clair pour comprendre d\'où tu pars.',
    details: [
      { text: 'Diagnostic académique', highlight: false, isPremium: false },
      { text: 'Identification de tes lacunes', highlight: false, isPremium: false },
      { text: 'Aucun jugement, aucun prérequis', highlight: true, isPremium: false }
    ]
  },
  {
    icon: Calendar,
    title: 'On t\'oriente dans ton programme Mastery',
    description: 'Tu accèdes au programme complet (Beginner → Advanced).\nOn t\'oriente vers le bon niveau du programme Mastery, selon ton niveau actuel et tes objectifs.',
    details: [
      { text: 'Concepts manuscrits, clairs et engageants', highlight: false, isPremium: false },
      { text: 'Méthode éprouvée : compréhension profonde', highlight: false, isPremium: false },
      { text: 'Planning adapté à ta réalité', highlight: true, isPremium: false },
      { text: '(option Premium : parcours personnalisé)', highlight: false, isPremium: true }
    ]
  },
  {
    icon: TrendingUp,
    title: 'On t\'accompagne jusqu\'à la maîtrise',
    description: 'Tu n\'avances jamais seul. Notre équipe et la communauté t\'accompagnent jusqu\'à ce que tu comprennes, progresses et maîtrises vraiment.',
    details: [
      { text: 'Support WhatsApp 24/7', highlight: false, isPremium: false },
      { text: 'Ajustements continus', highlight: false, isPremium: false },
      { text: 'Communauté d\'étudiants motivés', highlight: true, isPremium: false },
      { text: '(option : mentor Premium)', highlight: false, isPremium: true }
    ]
  }
];

export function HowItWorksSection() {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="how-it-works" className="py-20 md:py-28 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Comment on t'aide à passer de la
            <br />
            <span>confusion à la maîtrise</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            On t'accompagne de A à Z avec exigence et bienveillance.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-6 mt-2">
                <step.icon className="text-gray-900" size={32} />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
                {step.description}
              </p>

              {/* Details */}
              <ul className="space-y-2">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {!detail.isPremium && (
                      <span className={detail.highlight ? "text-blue-600 mt-1" : "text-gray-900 mt-1"}>✓</span>
                    )}
                    <span className={detail.highlight ? "text-blue-600 font-semibold" : detail.isPremium ? "text-gray-500 italic ml-6" : "text-gray-700"}>{detail.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={handleWhatsAppClick}
            className="px-10 py-5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all inline-flex items-center gap-3 shadow-lg shadow-blue-600/30"
          >
            <MessageCircle size={22} />
            Parler de ma situation sur WhatsApp
          </button>
        </motion.div>
      </div>
    </section>
  );
}

