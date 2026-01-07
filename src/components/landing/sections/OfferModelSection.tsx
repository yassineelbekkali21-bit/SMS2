'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Rocket, Target, Check, Lock, ArrowRight } from 'lucide-react';

interface LevelProps {
  level: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  pricing: string;
  isRequired?: boolean;
  requiresLevel?: number;
  accentColor: string;
  delay?: number;
}

function LevelCard({ 
  level, 
  icon: Icon, 
  title, 
  subtitle, 
  description, 
  features, 
  pricing,
  isRequired,
  requiresLevel,
  accentColor,
  delay = 0 
}: LevelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="relative"
    >
      {/* Connector line to next level */}
      {level < 3 && (
        <div className="hidden md:block absolute left-1/2 -bottom-8 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent" />
      )}
      
      <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 transition-all hover:shadow-2xl ${
        level === 1 ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
      }`}>
        {/* Level Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: accentColor }}
            >
              {level}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Niveau {level}
              </span>
              {isRequired && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  Requis
                </span>
              )}
              {requiresLevel && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex items-center gap-1">
                  <Lock size={10} />
                  Nécessite Niveau {requiresLevel}
                </span>
              )}
            </div>
          </div>
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon size={24} style={{ color: accentColor }} />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            {title}
          </h3>
        <p className="text-sm font-medium mb-4" style={{ color: accentColor }}>
            {subtitle}
          </p>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-5">
          {description}
      </p>

        {/* Features */}
        <div className="space-y-2 mb-5">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
              <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

        {/* Pricing */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">{pricing}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function OfferModelSection() {
  const levels: LevelProps[] = [
    {
      level: 1,
      icon: GraduationCap,
      title: "Mastery Programs",
      subtitle: "La fondation — Maîtrise complète de la matière",
      description: "Accède à l'ensemble du catalogue d'une matière avec un diagnostic initial qui t'oriente vers le bon niveau. C'est la porte d'entrée obligatoire vers l'excellence.",
      features: [
        "Accès illimité à vie (paiement unique)",
        "Catalogue structuré par matière",
        "Diagnostic initial personnalisé",
        "Learning tracks progressifs",
        "Slides manuscrits & exercices corrigés",
        "Accès communauté & Q&A",
        "Support WhatsApp basic"
      ],
      pricing: "Paiement unique • Accès à vie",
      isRequired: true,
      accentColor: "#2563eb"
    },
    {
      level: 2,
      icon: Rocket,
      title: "Mastery Boosters",
      subtitle: "L'accélération — Va plus vite, plus loin",
      description: "Des services optionnels pour maximiser ta progression. Accompagnement personnalisé, outils avancés et support premium pour ceux qui veulent aller plus loin.",
      features: [
        "Mentorat & accompagnement personnalisé",
        "Planning intelligent adaptatif",
        "Accès aux Study Rooms",
        "Générateur d'examens IA",
        "Learning Path personnalisé",
        "Support WhatsApp Premium"
      ],
      pricing: "Abonnement mensuel • Annulable à tout moment",
      accentColor: "#7c3aed"
    },
    {
      level: 3,
      icon: Target,
      title: "Exam Prep Programs",
      subtitle: "La spécialisation — Réussis ton examen",
      description: "Préparation ciblée pour un concours, une épreuve standardisée ou un examen sélectif. Basé sur les contenus que tu maîtrises déjà.",
      features: [
        "Programme spécifique à ton examen",
        "Drill & entraînement intensif",
        "Méthodologie de l'épreuve",
        "Annales commentées",
        "Simulations chronométrées",
        "Suivi de performance ciblé"
      ],
      pricing: "Supplément au Mastery Program",
      requiresLevel: 1,
      accentColor: "#059669"
    }
  ];

  return (
    <section id="offre" className="py-16 md:py-24 px-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
          >
            <span>Une offre progressive</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-5"
          >
            Maîtrise d'abord,<br />
            <span className="text-blue-600">performance ensuite.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Une seule plateforme, trois niveaux d'engagement. Tu commences par la maîtrise, tu accélères si tu veux, tu spécialises quand tu es prêt.
          </motion.p>
        </div>

        {/* Visual Path Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
            <GraduationCap size={16} />
            <span>Maîtrise</span>
          </div>
          <ArrowRight size={20} className="text-gray-400" />
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <Rocket size={16} />
            <span>Accélération</span>
          </div>
          <ArrowRight size={20} className="text-gray-400" />
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <Target size={16} />
            <span>Spécialisation</span>
          </div>
        </motion.div>

        {/* Levels Stack */}
        <div className="space-y-6 md:space-y-8">
          {levels.map((level, index) => (
            <LevelCard key={level.level} {...level} delay={index * 0.15} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">
            Tu ne sais pas par où commencer ?
          </p>
          <button
            onClick={() => document.getElementById('diagnostic')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Faire le diagnostic gratuit
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
