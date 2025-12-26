'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

const WHATSAPP_NUMBER = '32477025622';

function AboutZakContent() {
  const { language } = useLanguage();

  const content = language === 'fr' ? {
    back: 'Retour',
    
    // Hero headline
    headline: 'J\'ai passé 10 ans à transformer la science "complexe" en quelque chose de simple.',
    subheadline: 'Et cette compétence a changé ma vie — et celle de milliers d\'étudiants.',
    
    // Intro
    intro1: 'J\'ai toujours été fasciné par la science. Pas le genre "je récite des formules", mais le genre "je veux vraiment comprendre comment ça marche".',
    intro2: 'Le problème ? Le système éducatif n\'était pas conçu pour ça.',
    
    // Timeline intro
    timelineIntro: 'J\'ai eu mes hauts et mes bas. Voici mon histoire en 2 minutes :',
    
    // Timeline
    timeline: [
      {
        year: '2008-2012',
        title: 'École Polytechnique, ULB',
        description: 'Master en Ingénierie Physique Appliquée. Focus : ingénierie nucléaire, mathématiques appliquées, photonique.',
        highlight: 'Thèse de Master : "Optimization of the Quantum Teleportation Protocol" (Prof. Nicolas Cerf, ULB & MIT).',
        note: 'Pendant mes études, j\'ai commencé à coacher d\'autres étudiants en physique, maths et programmation. Ce side project est devenu ma première entreprise.'
      },
      {
        year: '2008-2009',
        title: 'Tractebel Engineering',
        description: 'Analyse et optimisation des circuits de sécurité pour les réacteurs nucléaires de Tihange 3 et Doel 4.',
        note: 'Première expérience concrète en ingénierie nucléaire appliquée.'
      },
      {
        year: '2009-2010',
        title: 'Institut Belge d\'Aéronomie Spatiale',
        description: 'Mission Venus Express — étude de l\'atmosphère de Vénus. Mise à jour des bases de données spectroscopiques globales (HITRAN – Harvard, GEISA – LMD France).',
        note: 'J\'ai appris comment les données et la précision mènent aux vraies découvertes.'
      },
      {
        year: '2010',
        title: 'Commission Européenne, Joint Research Centre',
        description: 'Mesure des sections efficaces nucléaires pour divers radio-isotopes via des techniques de temps de vol.',
        note: 'Environnement de recherche multinational de haute précision.'
      },
      {
        year: '2011',
        title: 'CERN – Organisation Européenne pour la Recherche Nucléaire',
        description: 'Optimisation de l\'extraction de faisceau pour le synchrotron à protons.',
        highlight: 'J\'ai vu la science à son niveau le plus avancé — et comment la collaboration transforme les idées en percées.',
        note: null
      },
      {
        year: '2011-2013',
        title: 'IBA – Ion Beam Applications',
        description: 'Installation et maintenance de systèmes de protonthérapie pour le traitement du cancer dans le monde entier (85% USA, 15% EMEA).',
        highlight: 'Travail aux côtés de physiciens et oncologues dans les plus grands hôpitaux. La science appliquée pour sauver des vies.',
        note: null
      },
      {
        year: '2013-2025',
        title: 'Fondateur – Les Classes Scientifiques',
        description: 'J\'ai construit une structure de coaching scientifique qui a aidé des milliers d\'étudiants en Belgique.',
        highlight: 'Focus : clarté, méthode et confiance — transformer les sciences "difficiles" en quelque chose d\'humain et accessible.',
        note: '"L\'apprentissage ne devrait pas être aussi ennuyeux."'
      },
      {
        year: 'Aujourd\'hui',
        title: 'Science Made Simple',
        description: 'Une plateforme EdTech qui fait le pont entre l\'enseignement scientifique de haut niveau et l\'accessibilité réelle.',
        highlight: 'Notre objectif : rendre la science simple, humaine et vraiment émancipatrice pour les étudiants du monde entier.',
        note: null
      }
    ],
    
    // Closing
    closing1: 'De la physique nucléaire à l\'EdTech.',
    closing2: 'J\'ai passé ma vie à apprendre comment rendre les choses complexes simples — et maintenant je construis des outils pour aider les autres à faire pareil.',
    
    // CTA
    cta: 'Discuter avec Zak',
    ctaSub: 'Gratuit • Sans engagement'
  } : {
    back: 'Back',
    headline: 'I spent 10 years turning "complex" science into something simple.',
    subheadline: 'And that skill changed my life — and thousands of students\' lives.',
    
    intro1: 'I\'ve always been fascinated by science. Not the "recite formulas" kind, but the "I really want to understand how it works" kind.',
    intro2: 'The problem? The education system wasn\'t designed for that.',
    
    timelineIntro: 'I\'ve had my ups and downs. Here\'s my story in 2 minutes:',
    
    timeline: [
      {
        year: '2008-2012',
        title: 'Polytechnic School, ULB',
        description: 'Master in Applied Physics Engineering. Focus: Nuclear Engineering, Applied Mathematics, Photonics.',
        highlight: 'Master Thesis: "Optimization of the Quantum Teleportation Protocol" (Prof. Nicolas Cerf, ULB & MIT).',
        note: 'During my studies, I started coaching other students in physics, math, and programming. That side project grew into my first company.'
      },
      {
        year: '2008-2009',
        title: 'Tractebel Engineering',
        description: 'Analyzed and optimized safety circuits for Tihange 3 and Doel 4 nuclear reactors.',
        note: 'First real-world experience in applied nuclear engineering.'
      },
      {
        year: '2009-2010',
        title: 'Belgian Institute for Space Aeronomy',
        description: 'Venus Express mission — studying the atmosphere of Venus. Updated global spectroscopic databases (HITRAN – Harvard, GEISA – LMD France).',
        note: 'Learned how data and precision drive real discovery.'
      },
      {
        year: '2010',
        title: 'European Commission, Joint Research Centre',
        description: 'Measured nuclear cross sections for various radioisotopes using time-of-flight techniques.',
        note: 'High-precision, multinational research environment.'
      },
      {
        year: '2011',
        title: 'CERN – European Organization for Nuclear Research',
        description: 'Worked on beam extraction optimization for the proton synchrotron.',
        highlight: 'Saw science at its most advanced — and how collaboration turns ideas into breakthroughs.',
        note: null
      },
      {
        year: '2011-2013',
        title: 'IBA – Ion Beam Applications',
        description: 'Installed and maintained proton therapy systems for cancer treatment worldwide (85% USA, 15% EMEA).',
        highlight: 'Worked closely with physicists and oncologists in major hospitals. Science applied to save lives.',
        note: null
      },
      {
        year: '2013-2025',
        title: 'Founder – Les Classes Scientifiques',
        description: 'Built a science coaching structure that helped thousands of students in Belgium.',
        highlight: 'Focused on clarity, method, and confidence — turning "hard sciences" into something human and learnable.',
        note: '"Learning shouldn\'t be that boring."'
      },
      {
        year: 'Today',
        title: 'Science Made Simple',
        description: 'A mission-driven EdTech platform that bridges the gap between high-level STEM education and real-world accessibility.',
        highlight: 'Our goal: to make science feel simple, human, and truly empowering for students worldwide.',
        note: null
      }
    ],
    
    closing1: 'From nuclear physics to education tech.',
    closing2: 'I\'ve spent my life learning how to make complex things simple — and now I build tools to help others do the same.',
    
    cta: 'Chat with Zak',
    ctaSub: 'Free • No commitment'
  };

  const handleWhatsAppClick = () => {
    const message = language === 'fr' 
      ? 'Salut Zak 👋 Je viens de lire ton histoire et je veux en savoir plus sur Science Made Simple !'
      : 'Hey Zak 👋 I just read your story and want to learn more about Science Made Simple!';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[800px] mx-auto px-6 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            {content.back}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-20 px-6">
        <div className="max-w-[800px] mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Photo */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                <Image 
                  src="/mentors/zak.jpg" 
                  alt="Zak" 
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Zak</h2>
                <p className="text-gray-500 text-sm">Founder, Science Made Simple</p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {content.headline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              {content.subheadline}
            </p>
          </motion.div>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {content.intro1}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.intro2}
            </p>
          </motion.div>

          {/* Timeline Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <p className="text-xl font-semibold text-gray-900">
              {content.timelineIntro}
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8 mb-16"
          >
            {content.timeline.map((item, index) => (
              <div key={index} className="relative">
                <p className="text-blue-600 font-bold text-lg mb-2">{item.year}:</p>
                <p className="text-gray-900 text-lg leading-relaxed">
                  <span className="font-semibold">{item.title}</span>
                  {item.description && ` — ${item.description}`}
                </p>
                {item.highlight && (
                  <p className="text-gray-700 italic mt-2 leading-relaxed">
                    {item.highlight}
                  </p>
                )}
                {item.note && (
                  <p className="text-gray-500 text-base mt-2">
                    {item.note}
                  </p>
                )}
              </div>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-12" />

          {/* Closing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <p className="text-xl font-semibold text-gray-900 mb-4">
              {content.closing1}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.closing2}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center pt-8"
          >
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold text-lg transition-all hover:scale-105"
            >
              {content.cta}
              <MessageCircle size={22} />
            </button>
            <p className="text-gray-500 text-sm mt-4">{content.ctaSub}</p>
          </motion.div>

        </div>
      </main>
    </div>
  );
}

export default function AboutZakPage() {
  return (
    <LanguageProvider>
      <AboutZakContent />
    </LanguageProvider>
  );
}
