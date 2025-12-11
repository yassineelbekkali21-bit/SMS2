'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Target, ArrowRight, Sparkles } from 'lucide-react';

interface OfferBlock {
  title: string;
  intro?: string;
  bullets: string[];
}

interface OfferCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  context: string;
  blocks: OfferBlock[];
  ctaText: string;
  ctaAction: () => void;
  delay?: number;
}

function OfferCard({ icon: Icon, title, subtitle, context, blocks, ctaText, ctaAction, delay = 0 }: OfferCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow flex flex-col"
    >
      {/* Card Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Icon className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            {title}
          </h3>
          <p className="text-blue-600 font-semibold text-sm md:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Context Paragraph */}
      <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
        {context}
      </p>

      {/* Blocks */}
      <div className="space-y-4 flex-1">
        {blocks.map((block, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 text-base md:text-lg mb-2">
              {block.title}
            </h4>
            {block.intro && (
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                {block.intro}
              </p>
            )}
            <ul className="space-y-1.5">
              {block.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mini CTA */}
      <button
        onClick={ctaAction}
        className="mt-6 text-blue-600 font-medium text-sm flex items-center gap-2 hover:text-blue-700 transition-colors group"
      >
        {ctaText}
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}

export function OfferModelSection() {
  const masteryProgramsBlocks: OfferBlock[] = [
    {
      title: "Mastery Programs",
      intro: "Paiement unique pour l'accès définitif. Accès illimité à toutes les matières, sans abonnement.",
      bullets: [
        "Slides manuscrits & Q&A",
        "Exercices + corrections",
        "Accès communauté et aux cercles",
        "Support WhatsApp (basic)"
      ]
    },
    {
      title: "Mastery Levels",
      intro: "Les prix varient selon le niveau exigé, pas selon la matière. L'étudiant est automatiquement placé dans le niveau adapté à son ambition, sur base du diagnostic.",
      bullets: [
        "Mastery Beginner",
        "Mastery Intermediate",
        "Mastery Advanced"
      ]
    }
  ];

  const examPrepBlocks: OfferBlock[] = [
    {
      title: "Exam Prep Program",
      intro: "Accès complet au programme de préparation, couvrant l'ensemble des matières et formats d'épreuves du concours.",
      bullets: [
        "Slides manuscrits",
        "Exercices corrigés & entraînement progressif",
        "Suivi de progression",
        "Accès communauté & Q&A",
        "Support WhatsApp (basic)"
      ]
    }
  ];

  const addOns = [
    "Outil de planification personnalisé",
    "Accès aux Study Rooms",
    "Learning Path IA adapté",
    "Aide Mentor WhatsApp Premium"
  ];

  return (
    <section id="offre" className="py-16 md:py-24 px-6 bg-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-5"
          >
            Deux ambitions, <span className="text-blue-600">une seule plateforme</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Le diagnostic t'oriente automatiquement vers l'offre adaptée à ton besoin.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Mastery Programs */}
          <OfferCard
            icon={GraduationCap}
            title="Programmes Mastery"
            subtitle="3 programmes, 1 objectif : la maîtrise."
            context="Un écosystème simple, scalable et centré sur la progression réelle de chaque étudiant, grâce à un diagnostic initial qui oriente automatiquement vers le bon niveau."
            blocks={masteryProgramsBlocks}
            ctaText="Voir les matières disponibles"
            ctaAction={() => document.getElementById('content-carousel')?.scrollIntoView({ behavior: 'smooth' })}
            delay={0}
          />

          {/* Card 2: Exam Prep Program */}
          <OfferCard
            icon={Target}
            title="Exam Prep Program"
            subtitle="Réussite aux épreuves standardisées."
            context="Un parcours structuré, calibré sur les exigences réelles des épreuves officielles. Le diagnostic initial oriente automatiquement vers le bon programme et le bon niveau d'entraînement."
            blocks={examPrepBlocks}
            ctaText="Découvrir une leçon"
            ctaAction={() => document.getElementById('content-carousel')?.scrollIntoView({ behavior: 'smooth' })}
            delay={0.2}
          />
        </div>

        {/* Add-ons Premium Section - Cross-offre */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left: Title and description */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  Add-ons Premium
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Accessibles pour les <span className="text-blue-600 font-semibold">2 programmes</span> — Des modules à forte valeur ajoutée.
                </p>
              </div>
            </div>

            {/* Right: Add-ons list */}
            <div className="grid grid-cols-2 gap-3">
              {addOns.map((addon, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700"
                >
                  <span className="text-blue-600">•</span>
                  <span>{addon}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

