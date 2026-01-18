'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Play, ArrowRight, CheckCircle, BookOpen, Target, Users, Clock, Zap, ChevronRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { DiagnosticProvider, useDiagnostic } from '@/contexts/DiagnosticContext';

const WHATSAPP_NUMBER = '32477025622';

// Programs data
const programs = [
  {
    id: 'physics',
    name: 'Physics Mastery',
    color: '#00c2ff',
    icon: '⚡',
    chapters: 24,
    hours: 120,
    exams: 800,
    topics: ['Mécanique', 'Électromagnétisme', 'Thermodynamique', 'Optique', 'Ondes'],
  },
  {
    id: 'math',
    name: 'Mathematics Mastery',
    color: '#8B5CF6',
    icon: '∑',
    chapters: 32,
    hours: 150,
    exams: 1200,
    topics: ['Algèbre', 'Analyse', 'Géométrie', 'Probabilités', 'Statistiques'],
  },
  {
    id: 'chemistry',
    name: 'Chemistry Mastery',
    color: '#10B981',
    icon: '⚗️',
    chapters: 20,
    hours: 100,
    exams: 600,
    topics: ['Chimie organique', 'Chimie inorganique', 'Thermochimie', 'Cinétique', 'Équilibres'],
  },
  {
    id: 'stats',
    name: 'Statistics Mastery',
    color: '#F59E0B',
    icon: '📊',
    chapters: 16,
    hours: 80,
    exams: 400,
    topics: ['Probabilités', 'Distributions', 'Tests', 'Régression', 'Analyse de données'],
  },
];

function LandingNewContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const { language, t } = useLanguage();
  const { openDiagnostic } = useDiagnostic();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppClick = () => {
    const message = 'Salut 👋 J\'aimerais en savoir plus sur Science Made Simple.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ============================================= */}
      {/* HEADER - Same as current landing page */}
      {/* ============================================= */}
      <nav className="sticky top-2 md:top-4 z-[50] px-3 md:px-6">
        <div className="shadow-2xl bg-[#0d1317] max-w-[1600px] mx-auto rounded-full">
          <div className="px-3 md:px-6" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
            <div className="flex items-center justify-between">
              {/* Logo */}
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="w-28 h-28 md:w-44 md:h-44 lg:w-52 lg:h-52 relative -my-5 md:-my-8">
                  <Image 
                    src="/brand/sms-logo.svg" 
                    alt="Science Made Simple"
                    fill
                    className="object-contain"
                  />
                </div>
              </button>
              
              {/* Menu desktop */}
              <div className="hidden md:flex items-center gap-16">
                <button
                  onClick={() => scrollToSection('programmes')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold"
                  style={{ fontSize: '21px' }}
                >
                  Programmes
                </button>
                <button
                  onClick={() => scrollToSection('pourquoi')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold"
                  style={{ fontSize: '21px' }}
                >
                  Pourquoi SMS
                </button>
                <button
                  onClick={() => scrollToSection('temoignages')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold"
                  style={{ fontSize: '21px' }}
                >
                  Résultats
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold"
                  style={{ fontSize: '21px' }}
                >
                  FAQ
                </button>
              </div>

              {/* CTA */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={openDiagnostic}
                  className="px-6 py-3 bg-[#00c2ff] hover:bg-[#00b0e8] text-white font-semibold rounded-full transition-all flex items-center gap-2"
                  style={{ fontSize: '16px' }}
                >
                  Commencer
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden px-6 pb-6 pt-2">
              <div className="flex flex-col gap-4">
                <button onClick={() => { scrollToSection('programmes'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white py-2 text-left">Programmes</button>
                <button onClick={() => { scrollToSection('pourquoi'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white py-2 text-left">Pourquoi SMS</button>
                <button onClick={() => { scrollToSection('temoignages'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white py-2 text-left">Résultats</button>
                <button onClick={() => { scrollToSection('faq'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white py-2 text-left">FAQ</button>
                <button onClick={openDiagnostic} className="mt-2 px-6 py-3 bg-[#00c2ff] text-white font-semibold rounded-full">Commencer</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ============================================= */}
      {/* SECTION 1: HERO - L'ACCROCHE */}
      {/* ============================================= */}
      <section className="pt-16 pb-20 px-6 md:px-8 lg:px-10 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          {/* Hook Question */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#00c2ff] font-semibold mb-6 text-lg"
          >
            Et si on pouvait apprendre autrement ?
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-title text-5xl md:text-6xl lg:text-7xl mb-6 leading-[0.9] tracking-wide"
          >
            DE LA CONFUSION<br />À LA MAÎTRISE.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
            Une décennie de pédagogie scientifique condensée en <strong>4 Mastery Programmes</strong> (Maths, Physique, Chimie, Stats) pour transformer chaque difficulté en opportunité.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <button
              onClick={openDiagnostic}
              className="px-8 py-4 bg-black hover:bg-gray-900 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              Commencer maintenant
              <span className="text-sm opacity-80">(+10h offertes)</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-gray-500"
          >
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              Accès à vie
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              Programmes officiels
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              90% pratique
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              Milliers d'examens réels
            </span>
          </motion.div>

          {/* VSL Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900 group cursor-pointer">
              <Image
                src="/thumbnails/testimonials-thumb.jpg"
                alt="Présentation SMS"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="text-[#00c2ff] ml-1" size={32} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white text-sm">
                Découvrir la méthode en 2 minutes
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION 2: POURQUOI SMS - Pain Points */}
      {/* ============================================= */}
      <section id="pourquoi" className="py-20 px-6 md:px-8 lg:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-4xl md:text-5xl text-center mb-4"
          >
            POURQUOI SMS EST SI DIFFÉRENT ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          >
            On a pris le problème à l'envers. On part des examens pour construire les cours.
          </motion.p>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Problems */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border border-gray-200"
            >
              <h3 className="text-xl font-bold mb-6 text-gray-400">Le soutien traditionnel</h3>
              <ul className="space-y-4">
                {[
                  'Disponibilité limitée du prof',
                  'Ressources éparpillées partout',
                  'Théorie sans pratique réelle',
                  'Méthodes génériques, pas adaptées',
                  'Coût qui s\'accumule chaque mois',
                  'Aucune garantie de résultat',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-500">
                    <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* SMS Solutions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0d1317] rounded-2xl p-8 text-white"
            >
              <h3 className="text-xl font-bold mb-6 text-[#00c2ff]">Science Made Simple</h3>
              <ul className="space-y-4">
                {[
                  'Disponible 24h/24, 7j/7',
                  'Tout au même endroit, structuré',
                  '90% de pratique sur vrais examens',
                  'Méthode bottom-up personnalisée',
                  'Un seul paiement, accès à vie',
                  'Milliers d\'étudiants ont réussi',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/90">
                    <CheckCircle size={20} className="text-[#00c2ff] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION 3: LES 4 PROGRAMMES */}
      {/* ============================================= */}
      <section id="programmes" className="py-20 px-6 md:px-8 lg:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-4xl md:text-5xl text-center mb-4"
          >
            4 MASTERY PROGRAMMES
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          >
            Tout ce dont tu as besoin pour passer de la confusion à la maîtrise.
          </motion.p>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border-2 hover:shadow-xl transition-all cursor-pointer group"
                style={{ borderColor: program.color + '40' }}
                onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-4xl mb-2 block">{program.icon}</span>
                    <h3 className="text-2xl font-bold" style={{ color: program.color }}>{program.name}</h3>
                  </div>
                  <ChevronRight 
                    size={24} 
                    className={`text-gray-400 transition-transform ${selectedProgram === program.id ? 'rotate-90' : ''}`}
                  />
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} />
                    {program.chapters} chapitres
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {program.hours}h+ vidéo
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={16} />
                    {program.exams} examens
                  </span>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-2">
                  {program.topics.map((topic, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: program.color + '20', color: program.color }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Expanded content */}
                {selectedProgram === program.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-100"
                  >
                    <p className="text-gray-600 mb-4">
                      {program.hours}h+ de contenu structuré, {program.exams}+ questions d'examens réels, 
                      des quiz interactifs et un accès à la communauté d'entraide.
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); openDiagnostic(); }}
                      className="px-6 py-2 rounded-full font-semibold text-white transition-all"
                      style={{ backgroundColor: program.color }}
                    >
                      Commencer ce programme
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Total Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center bg-gray-50 rounded-2xl p-8"
          >
            <p className="text-gray-600 mb-2">Tout ça pour un seul paiement</p>
            <p className="text-4xl font-bold mb-2">450h+ de contenu · 3000+ examens</p>
            <p className="text-[#00c2ff] font-semibold">Accès à vie · Mises à jour incluses</p>
          </motion.div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION 4: C'EST FAIT POUR TOI SI... */}
      {/* ============================================= */}
      <section className="py-20 px-6 md:px-8 lg:px-10 bg-[#0d1317] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-4xl md:text-5xl mb-12"
          >
            C'EST FAIT POUR TOI SI...
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '😰',
                title: 'Tu galères',
                desc: 'Tu veux juste t\'en sortir et valider tes examens',
              },
              {
                icon: '🎯',
                title: 'Tu veux performer',
                desc: 'Tu vises le top et tu veux aller plus vite',
              },
              {
                icon: '💎',
                title: 'Tu ignores ton potentiel',
                desc: 'Tu t\'auto-censures alors que tu pourrais viser plus haut',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 rounded-2xl p-6"
              >
                <span className="text-5xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold mb-2 text-[#00c2ff]">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-xl text-white/80"
          >
            Que tu cherches à <strong className="text-white">être le meilleur</strong> ou juste à <strong className="text-white">t'en sortir</strong>,<br />
            nos programmes sont conçus pour toi.
          </motion.p>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION 5: TÉMOIGNAGES */}
      {/* ============================================= */}
      <section id="temoignages" className="py-20 px-6 md:px-8 lg:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-4xl md:text-5xl text-center mb-4"
          >
            ILS ONT TRANSFORMÉ<br />LEURS RÉSULTATS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          >
            +2,400 étudiants ont déjà décollé avec nous
          </motion.p>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', role: 'Médecine', quote: 'J\'ai validé ma PASS du premier coup grâce à SMS.', rating: 5 },
              { name: 'Thomas D.', role: 'Prépa MPSI', quote: 'De 8 à 16/20 en physique en 2 mois.', rating: 5 },
              { name: 'Amina K.', role: 'L1 Sciences', quote: 'Enfin des explications claires !', rating: 5 },
              { name: 'Lucas B.', role: 'Terminale S', quote: 'Je comprends enfin les maths.', rating: 5 },
              { name: 'Emma R.', role: 'L2 Chimie', quote: 'La chimie est devenue facile.', rating: 5 },
              { name: 'Nathan G.', role: 'Ingénieur', quote: 'Meilleur investissement de mes études.', rating: 5 },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="mb-3">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION 6: MENTOR */}
      {/* ============================================= */}
      <section className="py-20 px-6 md:px-8 lg:px-10 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
              <Image
                src="/brand/sms-logo.svg"
                alt="Zak"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-medium text-gray-800 mb-6"
          >
            "Je redescends avec toi jusqu'aux bases pour te retrouver.<br />
            Puis je te prends par la main jusqu'au sommet."
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-600"
          >
            — Zak, fondateur de Science Made Simple
          </motion.p>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION 7: DIAGNOSTIC CTA */}
      {/* ============================================= */}
      <section className="py-20 px-6 md:px-8 lg:px-10 bg-[#00c2ff]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-4xl md:text-5xl text-white mb-6"
          >
            ON COMMENCE PAR TOI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/90 text-lg mb-8 max-w-2xl mx-auto"
          >
            Fais le diagnostic gratuit et découvre quel programme est fait pour toi.
            +10h de contenu offert pour commencer.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={openDiagnostic}
            className="px-10 py-5 bg-white text-[#00c2ff] font-bold text-lg rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3 mx-auto"
          >
            Faire mon diagnostic gratuit
            <ArrowRight size={24} />
          </motion.button>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION 8: FAQ */}
      {/* ============================================= */}
      <section id="faq" className="py-20 px-6 md:px-8 lg:px-10 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-4xl md:text-5xl text-center mb-12"
          >
            QUESTIONS FRÉQUENTES
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                q: 'Est-ce que ça correspond à mon programme officiel ?',
                a: 'Oui ! Nos cours sont basés sur les programmes officiels des plus grandes écoles et universités francophones.',
              },
              {
                q: 'Et si j\'ai un niveau très faible ?',
                a: 'C\'est justement pour ça qu\'on existe. On reprend tout depuis les bases et on reconstruit ensemble.',
              },
              {
                q: 'C\'est quoi la différence avec un prof particulier ?',
                a: 'Disponibilité 24/7, milliers d\'examens corrigés, communauté d\'entraide, et un seul paiement au lieu de factures mensuelles.',
              },
              {
                q: 'Accès à vie, vraiment ?',
                a: 'Oui. Tu payes une fois, tu gardes l\'accès pour toujours, avec toutes les mises à jour futures incluses.',
              },
              {
                q: 'Je n\'ai pas le temps...',
                a: 'Justement ! On est là pour te faire gagner du temps. 90% de pratique ciblée sur ce qui tombe vraiment aux examens.',
              },
            ].map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-50 rounded-xl p-6 group"
              >
                <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronRight size={20} className="text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FOOTER */}
      {/* ============================================= */}
      <footer className="py-12 px-6 md:px-8 lg:px-10 bg-[#0d1317] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image 
              src="/brand/sms-logo.svg" 
              alt="Science Made Simple"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-white/60 mb-4">
            © 2024 Science Made Simple. Tous droits réservés.
          </p>
          <div className="flex justify-center gap-6 text-white/60">
            <Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="/terms" className="hover:text-white transition-colors">CGU</Link>
            <button onClick={handleWhatsAppClick} className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
      >
        <MessageCircle size={20} />
        On t'écoute
      </button>
    </div>
  );
}

export default function LandingNewPage() {
  return (
    <LanguageProvider>
      <DiagnosticProvider>
        <LandingNewContent />
      </DiagnosticProvider>
    </LanguageProvider>
  );
}
