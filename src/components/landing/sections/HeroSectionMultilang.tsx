'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Play, MessageCircle, CheckCircle, Target, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { VideoModal } from '@/components/VideoModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';
import { LogoIntro, LogoIntroVariant } from '../logo-intro';

interface HeroSectionProps {
  onEnterApp?: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  hasUrgencyBanner?: boolean;
  urgencyBannerBelow?: React.ReactNode;
}

const WHATSAPP_NUMBER = '32477025622';

export function HeroSectionMultilang({ onEnterApp, isMenuOpen, setIsMenuOpen, hasUrgencyBanner = false, urgencyBannerBelow }: HeroSectionProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [logoAnimation, setLogoAnimation] = useState<LogoIntroVariant>('star-shoot');
  const [logoKey, setLogoKey] = useState(0);
  const { language, t } = useLanguage();
  const { openDiagnostic } = useDiagnostic();

  const WHATSAPP_DEFAULT_MESSAGE = language === 'fr' 
    ? 'Salut 👋 J\'aimerais un diagnostic personnalisé pour voir comment Science Made Simple peut m\'aider.'
    : 'Hi 👋 I\'d like a personalized diagnosis to see how Science Made Simple can help me.';

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const handleDiscoverCourses = () => {
    if (onEnterApp) {
      onEnterApp();
    } else {
      window.location.href = '/#dashboard';
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className={`sticky z-[50] transition-all duration-300 px-3 md:px-6 ${hasUrgencyBanner ? 'top-[52px] md:top-[56px]' : 'top-2 md:top-4'}`}>
        <div className={`transition-all duration-300 shadow-2xl noise-overlay-strong bg-[#0d1317] max-w-[1600px] mx-auto ${isMenuOpen ? 'rounded-3xl' : 'rounded-full'}`}>
          <div className="px-3 md:px-6 py-2 md:py-1">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-3 cursor-pointer"
                aria-label="Retour en haut"
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

              {/* Menu desktop - Centré */}
              <div className="hidden md:flex items-center gap-16">
                <button
                  onClick={() => scrollToSection('curriculum')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
                >
                  {t('nav.programs')}
                </button>
                <button
                  onClick={() => scrollToSection('for-you')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
                >
                  {t('nav.method')}
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
                >
                  {t('nav.results')}
                </button>
                <button
                  onClick={() => scrollToSection('explore-section')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
                >
                  {language === 'fr' ? 'Se tester' : 'Test yourself'}
                </button>
                <button
                  onClick={() => scrollToSection('offre')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
                >
                  {t('nav.offer')}
                </button>
                <button
                  onClick={() => scrollToSection('whatsapp-contact')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
                >
                  {t('nav.contact')}
                </button>
              </div>

              {/* Right side: CTA */}
              <div className="hidden md:flex items-center gap-4">
                {/* CTA Button - Diagnostic */}
                <button
                  onClick={openDiagnostic}
                  className="px-8 py-4 bg-[#00c2ff] hover:bg-[#3bb5dc] text-white rounded-full font-semibold text-xl transition-all flex items-center gap-2 shadow-lg shadow-[#00c2ff]/25"
                >
                  <Target size={22} />
                  {language === 'fr' ? 'Diagnostic gratuit' : 'Free Diagnostic'}
                </button>
              </div>

              {/* Menu mobile */}
              <div className="md:hidden flex items-center gap-3">
                {/* CTA Button Mobile - Diagnostic */}
                <button
                  onClick={openDiagnostic}
                  className="w-10 h-10 bg-[#00c2ff] hover:bg-[#3bb5dc] text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-[#00c2ff]/25"
                  aria-label="Diagnostic gratuit"
                >
                  <Target size={20} />
                </button>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-white"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Menu mobile dropdown */}
            {isMenuOpen && (
              <div className="md:hidden border-t border-gray-800 mt-4 pt-4 pb-4">
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      scrollToSection('curriculum');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {t('nav.programs')}
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('for-you');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {t('nav.method')}
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('testimonials');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {t('nav.results')}
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('explore-section');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {language === 'fr' ? 'Se tester' : 'Test yourself'}
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('offre');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {t('nav.offer')}
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('whatsapp-contact');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {t('nav.contact')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bandeau d'urgence - Position: EN-DESSOUS du header */}
      {urgencyBannerBelow && (
        <div className="bg-[#0d1317] w-full mt-[30px]">
          {urgencyBannerBelow}
        </div>
      )}

      {/* Hero Content */}
      <section className="pt-10 pb-6 md:pt-16 md:pb-12 px-6 md:px-8 lg:px-10 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Titre principal */}
              <h1 
                className="font-title text-6xl mb-4 md:mb-6 leading-[1.05] tracking-wide"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 72px)' }}
              >
                {language === 'fr' ? (
                  <>Redécouvrez la science, gagnez en confiance.</>
                ) : (
                  <>Rediscover science, gain confidence.</>
                )}
              </h1>

              {/* Texte descriptif */}
              <p className="text-gray-700 mb-5 leading-relaxed" style={{ fontSize: '20px' }}>
                {language === 'fr' 
                  ? "Passez de la confusion à la maîtrise, avec des cours qui transforment chaque difficulté en opportunité. Essayez gratuitement et remarquez la différence."
                  : "Go from confusion to mastery, with courses that transform every difficulty into opportunity. Try it free and notice the difference."
                }
              </p>

              {/* Social Proof - Après le texte */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#00a8e0] border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-white"></div>
                </div>
              <p className="text-gray-600 font-medium" style={{ fontSize: '14px' }}>
                  <span className="font-bold text-gray-900">+2,400</span> {t('hero.social_proof')}
                </p>
              </div>

              {/* CTA Button + Microcopy aligned */}
              <div className="inline-flex flex-col items-start">
                <button
                  onClick={openDiagnostic}
                  className="group relative w-full py-5 px-8 bg-black text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden hover:scale-105 shadow-lg hover:shadow-2xl cursor-pointer"
                  style={{ fontSize: '18px' }}
              >
                  {/* Shine effect */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12" />
                  <span className="relative z-10 flex items-center gap-3">
                    {language === 'fr' ? 'Construis ton parcours sur mesure' : 'Build your personalized learning path'}
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </button>

              <div className="mt-6 flex flex-wrap items-center gap-4 md:gap-6">
                  <span className="text-gray-700 font-medium flex items-center gap-2" style={{ fontSize: '14px' }}>
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                  {language === 'fr' ? 'Paiement unique' : 'One-time payment'}
                </span>
                  <span className="text-gray-700 font-medium flex items-center gap-2" style={{ fontSize: '14px' }}>
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    {language === 'fr' ? 'Accès à vie' : 'Lifetime access'}
                </span>
                  <span className="text-gray-700 font-medium flex items-center gap-2" style={{ fontSize: '14px' }}>
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                  {language === 'fr' ? 'Sans engagement' : 'No commitment'}
                </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - VSL Video (Légèrement réduite) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start"
            >
              <div className="w-full max-w-[750px]">
                {/* Animation Variant Switcher - Hidden for production, using star-shoot as default */}
                {/* Uncomment below to enable animation picker in dev mode */}
                {false && (
                <div className="space-y-2 mb-4">
                  {/* Classic Variants */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {([
                      { id: 'netflix-punch', label: 'A · Netflix' },
                      { id: 'community-assemble', label: 'C · Community' },
                      { id: 'scan-hud', label: 'D · Scan' },
                      { id: 'blur-focus', label: 'E · Focus' },
                      { id: 'tilt-3d', label: 'F · 3D' },
                    ] as const).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setLogoAnimation(v.id);
                          setLogoKey(prev => prev + 1);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                          logoAnimation === v.id
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                  {/* Sticker Variants */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {([
                      { id: 'sticker-slap', label: 'G · Slap 🎯' },
                      { id: 'sticker-stamp', label: 'I · Stamp' },
                      { id: 'sticker-drop', label: 'J · Drop' },
                      { id: 'sticker-wiggle', label: 'K · Wiggle' },
                      { id: 'sticker-zoom', label: 'L · Zoom' },
                    ] as const).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setLogoAnimation(v.id as LogoIntroVariant);
                          setLogoKey(prev => prev + 1);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                          logoAnimation === v.id
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                  {/* DrawSVG Variants */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {([
                      { id: 'hand-drawn', label: 'B · Manuscrit ✏️' },
                      { id: 'sticker-peel', label: 'H · Peel ✏️' },
                      { id: 'draw-reveal', label: 'M · Reveal ✏️' },
                      { id: 'draw-write', label: 'N · Write ✏️' },
                      { id: 'draw-neon', label: 'O · Neon ✏️' },
                    ] as const).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setLogoAnimation(v.id as LogoIntroVariant);
                          setLogoKey(prev => prev + 1);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                          logoAnimation === v.id
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                  {/* Star Variants - L'étoile comme quête */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {([
                      { id: 'draw-star', label: 'P · Quest ⭐' },
                      { id: 'star-orbit', label: 'Q · Orbit 🌙' },
                      { id: 'star-spiral', label: 'R · Spiral 🌀' },
                      { id: 'star-bounce', label: 'S · Bounce 🏀' },
                      { id: 'star-shoot', label: 'T · Shoot 💫' },
                      { id: 'star-pulse', label: 'U · Pulse 💓' },
                      { id: 'star-magnet', label: 'V · Magnet 🧲' },
                    ] as const).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setLogoAnimation(v.id as LogoIntroVariant);
                          setLogoKey(prev => prev + 1);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                          logoAnimation === v.id
                            ? 'bg-yellow-500 text-white border-yellow-500'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                )}

                <div 
                  className="relative w-full aspect-[4/5] md:aspect-video lg:aspect-[4/5] max-h-[320px] lg:max-h-[400px] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border-4 border-gray-800"
                  onClick={() => setIsVideoOpen(true)}
                >
                  {/* Animated Logo Intro - Professional GSAP Animation */}
                  <LogoIntro 
                    key={logoKey}
                    variant={logoAnimation}
                    autoPlay={true}
                    loop={true}
                    loopDelay={2500}
                    darkMode={true}
                    onCue={(cue, time) => {
                      // Hook for SFX - can connect to audio player here
                      console.log(`🔊 SFX: ${cue} at ${time.toFixed(2)}s`);
                    }}
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <Play className="text-[#00c2ff] ml-1" size={40} />
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-gray-500 hover:text-gray-900 underline decoration-gray-300 underline-offset-4 transition-colors text-sm font-medium"
                  >
                    {t('hero.see_how')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <VideoModal 
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://www.youtube.com/embed/MY_aGubAcdk"
      />

    </>
  );
}

