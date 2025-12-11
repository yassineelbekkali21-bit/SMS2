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

export function OfferModelSectionEN() {
  const masteryProgramsBlocks: OfferBlock[] = [
    {
      title: "Mastery Programs",
      intro: "One-time payment for lifetime access. Unlimited access to all subjects, no subscription.",
      bullets: [
        "Handwritten slides & Q&A",
        "Exercises + corrections",
        "Community & study circles access",
        "WhatsApp Support (basic)"
      ]
    },
    {
      title: "Mastery Levels",
      intro: "Pricing varies by level, not by subject. Students are automatically placed in the level that matches their ambition, based on the diagnostic.",
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
      intro: "Full access to the preparation program, covering all subjects and exam formats.",
      bullets: [
        "Handwritten slides",
        "Corrected exercises & progressive training",
        "Progress tracking",
        "Community & Q&A access",
        "WhatsApp Support (basic)"
      ]
    }
  ];

  const addOns = [
    "Personalized planning tool",
    "Study Rooms access",
    "AI-powered Learning Path",
    "Premium WhatsApp Mentor"
  ];

  return (
    <section id="offer" className="py-16 md:py-24 px-6 bg-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-5"
          >
            Two ambitions, <span className="text-blue-600">one platform</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            The diagnostic automatically guides you to the right offer for your needs.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Mastery Programs */}
          <OfferCard
            icon={GraduationCap}
            title="Mastery Programs"
            subtitle="3 programs, 1 goal: mastery."
            context="A simple, scalable ecosystem focused on each student's real progress, thanks to an initial diagnostic that automatically guides them to the right level."
            blocks={masteryProgramsBlocks}
            ctaText="View available subjects"
            ctaAction={() => document.getElementById('content-carousel')?.scrollIntoView({ behavior: 'smooth' })}
            delay={0}
          />

          {/* Card 2: Exam Prep Program */}
          <OfferCard
            icon={Target}
            title="Exam Prep Program"
            subtitle="Success in standardized tests."
            context="A structured path, calibrated to the real requirements of official exams. The initial diagnostic automatically guides you to the right program and training level."
            blocks={examPrepBlocks}
            ctaText="Discover a lesson"
            ctaAction={() => document.getElementById('content-carousel')?.scrollIntoView({ behavior: 'smooth' })}
            delay={0.2}
          />
        </div>

        {/* Add-ons Premium Section - Cross-offer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left: Title and description */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  Premium Add-ons
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Available for <span className="text-blue-600 font-semibold">both programs</span> — High-value modules to boost your progress.
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




