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
          <div className="px-3 md:px-6" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
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
                  className="text-gray-300 hover:text-white transition-colors font-semibold"
                  style={{ fontSize: '21px' }}
                >
                  {t('nav.programs')}
                </button>
                <button
                  onClick={() => scrollToSection('for-you')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold"
                  style={{ fontSize: '21px' }}
                >
                  {t('nav.method')}
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold"
                  style={{ fontSize: '21px' }}
                >
                  {t('nav.results')}
                </button>
                {/* Se tester masqué
                <button
                  onClick={() => scrollToSection('explore-section')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold"
                  style={{ fontSize: '21px' }}
                >
                  {language === 'fr' ? 'Se tester' : 'Test yourself'}
                </button>
                */}
                <button
                  onClick={() => scrollToSection('offre')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold"
                  style={{ fontSize: '21px' }}
                >
                  {t('nav.offer')}
                </button>
                <button
                  onClick={() => scrollToSection('whatsapp-contact')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold"
                  style={{ fontSize: '21px' }}
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
                  className="px-4 py-2.5 bg-[#00c2ff] hover:bg-[#3bb5dc] text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-[#00c2ff]/25"
                >
                  Diagnostic
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
                  {/* Se tester masqué
                  <button 
                    onClick={() => {
                      scrollToSection('explore-section');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {language === 'fr' ? 'Se tester' : 'Test yourself'}
                  </button>
                  */}
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
        <div className="bg-[#00c2ff] w-full mt-[30px]">
          {urgencyBannerBelow}
        </div>
      )}

      {/* Hero Content - Layout Centré */}
      <section className="pt-8 pb-6 md:pt-12 md:pb-10 px-6 md:px-8 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Social Proof - Au-dessus du titre */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-5 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#00a8e0] border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-white"></div>
            </div>
            <p className="text-gray-600 font-medium" style={{ fontSize: '16px' }}>
              <span className="font-bold text-gray-900">+2,400</span> {t('hero.social_proof')}
            </p>
          </motion.div>

          {/* Titre principal */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-title mb-4 leading-[0.6] tracking-wide"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 80px)' }}
          >
            {language === 'fr' ? (
              <>ET SI ON POUVAIT<br />APPRENDRE AUTREMENT ?</>
            ) : (
              <>WHAT IF WE COULD<br />LEARN DIFFERENTLY?</>
            )}
          </motion.h1>

          {/* Texte descriptif */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-600 mb-5 max-w-6xl mx-auto leading-relaxed" 
            style={{ fontSize: '20px' }}
          >
            {language === 'fr' 
              ? <>Une décennie de pédagogie scientifique, condensée en 4 Programmes (Physique, Mathématiques, Chimie, Statistiques) qui permettent de passer de la confusion à la maîtrise.<br />Essayez gratuitement et remarquez la différence.</>
              : <>A decade of scientific pedagogy, condensed into 4 Programs (Physics, Mathematics, Chemistry, Statistics) that take you from confusion to mastery.<br />Try it free and notice the difference.</>
            }
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center mb-5"
          >
            <button
              onClick={openDiagnostic}
              className="group relative py-5 px-8 bg-black text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden hover:scale-105 shadow-lg hover:shadow-2xl cursor-pointer"
              style={{ fontSize: '18px' }}
            >
              {/* Shine effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12" />
              <span className="relative z-10 flex items-center gap-3">
                {language === 'fr' ? 'Commence maintenant +10h offertes' : 'Start now +10h free'}
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-8"
          >
            <span className="text-gray-700 font-medium flex items-center gap-2" style={{ fontSize: '14px' }}>
              <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
              {language === 'fr' ? 'Accès à vie' : 'Lifetime access'}
            </span>
            <span className="text-gray-700 font-medium flex items-center gap-2" style={{ fontSize: '14px' }}>
              <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
              {language === 'fr' ? 'Basés sur programmes officiels' : 'Based on official programs'}
            </span>
            <span className="text-gray-700 font-medium flex items-center gap-2" style={{ fontSize: '14px' }}>
              <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
              {language === 'fr' ? 'Milliers d\'examens réels' : 'Thousands of real exams'}
            </span>
          </motion.div>

          {/* Video Preview - Centré */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <div 
              className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border-4 border-gray-800"
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
            
          </motion.div>


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

