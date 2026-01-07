'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Target, Check, Lock, ArrowRight, Sparkles, Users, Clock, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';

interface LevelData {
  icon: React.ElementType;
  title: string;
  badge: string;
  badgeStyle: 'primary' | 'secondary' | 'accent';
  pitch: string;
  benefits: string[];
  requiresLevel?: number;
}

function LevelBlock({ 
  data,
  isLast
}: { 
  data: LevelData;
  isLast: boolean;
}) {
  const { language } = useLanguage();
  const Icon = data.icon;
  
  const badgeStyles = {
    primary: 'bg-white text-gray-900',
    secondary: 'bg-[#00c2ff] text-white',
    accent: 'bg-orange-500 text-white'
  };
  
  return (
    <div className="relative">
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-3 top-10 bottom-[-40px] w-0.5 bg-gradient-to-b from-white/30 to-white/5" />
      )}
      
      <div className="flex items-start gap-5">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <Icon size={15} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          {/* Title + Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h4 className="font-bold text-xl md:text-2xl" style={{ color: '#FFFFFF' }}>
              {data.title}
            </h4>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${badgeStyles[data.badgeStyle]}`}>
              {data.badge}
            </span>
            {data.requiresLevel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-800 text-gray-400 text-xs font-medium rounded-full border border-gray-700">
                <Lock size={10} />
                {language === 'fr' ? `Niveau ${data.requiresLevel} requis` : `Level ${data.requiresLevel} required`}
              </span>
            )}
          </div>
          
          {/* Pitch - Single strong phrase */}
          <p className="mb-4" style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.85)' }}>
            {data.pitch}
          </p>
          
          {/* Benefits - Max 3, short */}
          <ul className="space-y-2">
            {data.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-white/70" style={{ fontSize: '14px' }}>
                <Check size={14} className="flex-shrink-0 text-[#00c2ff]" strokeWidth={3} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function OfferModelSectionMultilang() {
  const { language } = useLanguage();
  const { openDiagnostic } = useDiagnostic();

  const levels: LevelData[] = language === 'fr' ? [
    {
      icon: GraduationCap,
      title: "Mastery Programs",
      badge: "Accès à vie",
      badgeStyle: 'primary',
      pitch: "Comprends vraiment. Progresse à ton rythme. Jamais seul.",
      benefits: [
        "Diagnostic personnalisé + parcours adapté",
        "250+ leçons avec exercices corrigés",
        "Communauté et mentors disponibles 7j/7"
      ]
    },
    {
      icon: Sparkles,
      title: "Mastery Boosters",
      badge: "4 semaines offertes",
      badgeStyle: 'secondary',
      pitch: "Organise-toi mieux. Révise plus vite. Gagne du temps.",
      benefits: [
        "Planificateur intelligent adapté à ton emploi du temps",
        "Study Rooms pour réviser en groupe",
        "Examens blancs illimités",
        "Parcours IA qui s'ajuste à ta progression"
      ]
    },
    {
      icon: Target,
      title: "Exam Prep",
      badge: "Intensif",
      badgeStyle: 'accent',
      pitch: "L'examen approche. Zéro perte de temps. 100% focalisé.",
      benefits: [
        "Programme taillé pour ton examen précis",
        "Entraînement intensif sur annales",
        "Mentor dédié jusqu'au jour J"
      ],
      requiresLevel: 1
    }
  ] : [
    {
      icon: GraduationCap,
      title: "Mastery Programs",
      badge: "Lifetime access",
      badgeStyle: 'primary',
      pitch: "Truly understand. Progress at your pace. Never alone.",
      benefits: [
        "Personalized diagnosis + adapted path",
        "250+ lessons with corrected exercises",
        "Community and mentors available 24/7"
      ]
    },
    {
      icon: Sparkles,
      title: "Mastery Boosters",
      badge: "4 weeks free",
      badgeStyle: 'secondary',
      pitch: "Get organized. Study smarter. Save time.",
      benefits: [
        "Smart planner adapted to your schedule",
        "Study Rooms to revise in groups",
        "Unlimited mock exams",
        "AI path that adjusts to your progress"
      ]
    },
    {
      icon: Target,
      title: "Exam Prep",
      badge: "Intensive",
      badgeStyle: 'accent',
      pitch: "Exam is coming. Zero wasted time. 100% focused.",
      benefits: [
        "Program tailored to your specific exam",
        "Intensive training on past papers",
        "Dedicated mentor until D-day"
      ],
      requiresLevel: 1
    }
  ];

  return (
    <section id="offre" className="py-16 md:py-24 px-6 md:px-8 lg:px-10 bg-gray-50 scroll-mt-40">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title tracking-wide text-gray-900"
            style={{ fontSize: '64px' }}
          >
            {language === 'fr' ? 'Accès à vie inclus.' : 'Lifetime access included.'}
            <br />
            {language === 'fr' ? 'Boosters en essai gratuit.' : 'Free Boosters trial.'}
          </motion.h2>
        </div>

        {/* Main Card - Dark Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
        >
          {/* Card Body */}
          <div className="p-6 md:p-10">
            {/* Levels */}
            <div className="space-y-10">
              {levels.map((level, index) => (
                <LevelBlock 
                  key={level.title} 
                  data={level} 
                  isLast={index === levels.length - 1}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section - Outside Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center mt-10"
        >
          <button
            onClick={openDiagnostic}
            className="inline-flex px-8 py-4 text-white rounded-full font-semibold items-center justify-center gap-3 transition-all bg-[#48c6ed] hover:bg-[#3ab5dc] hover:scale-105 shadow-lg shadow-[#48c6ed]/25 cursor-pointer"
            style={{ fontSize: '17px' }}
          >
            {language === 'fr' ? "Commencer mon diagnostic gratuit" : "Start my free diagnostic"}
            <ArrowRight size={18} />
          </button>
          <p className="text-gray-500 mt-4" style={{ fontSize: '13px' }}>
            {language === 'fr' ? "Gratuit • 2 minutes • Sans engagement" : "Free • 2 minutes • No commitment"}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
