'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Play, MessageCircle, Globe, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { VideoModal } from '@/components/VideoModal';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroSectionProps {
  onEnterApp?: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const WHATSAPP_NUMBER = '32477025622';

export function HeroSectionMultilang({ onEnterApp, isMenuOpen, setIsMenuOpen }: HeroSectionProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

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

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-2 md:top-4 z-50 px-3 md:px-6">
        <div className="max-w-[1600px] mx-auto bg-black rounded-2xl md:rounded-3xl shadow-2xl">
          <div className="px-3 md:px-6 py-2 md:py-1">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
                >
                  {t('nav.method')}
                </button>
                <button
                  onClick={() => scrollToSection('offre')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
                >
                  {t('nav.offer')}
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
                >
                  {t('nav.results')}
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
                >
                  {t('nav.faq')}
                </button>
              </div>

              {/* Right side: Language + CTA */}
              <div className="hidden md:flex items-center gap-4">
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white font-semibold transition-colors"
                >
                  <Globe size={22} />
                  <span className="uppercase text-base">{language === 'fr' ? 'EN' : 'FR'}</span>
                </button>

                {/* CTA Button */}
                <button
                  onClick={handleWhatsAppClick}
                  className="px-8 py-4 bg-white text-black rounded-full font-bold text-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  {t('nav.start')}
                  <MessageCircle size={22} />
                </button>
              </div>

              {/* Menu mobile */}
              <div className="md:hidden flex items-center gap-2">
                {/* Language Toggle Mobile - Same style as desktop */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white font-semibold transition-colors"
                >
                  <Globe size={16} />
                  <span className="uppercase text-xs">{language === 'fr' ? 'EN' : 'FR'}</span>
                </button>
                {/* CTA Button Mobile */}
                <button
                  onClick={handleWhatsAppClick}
                  className="px-4 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                >
                  {t('nav.start')}
                  <MessageCircle size={16} />
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
                      scrollToSection('how-it-works');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {t('nav.method')}
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
                      scrollToSection('testimonials');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {t('nav.results')}
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('faq');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {t('nav.faq')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="py-12 md:py-32 px-6 md:px-8 lg:px-10 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Social Proof au-dessus du titre */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-white"></div>
                </div>
                <p className="text-base md:text-[1.375rem] text-gray-600 font-medium">
                  <span className="font-bold text-gray-900">+2,400</span> {t('hero.social_proof')}
                </p>
              </div>

              <h1 
                className="text-6xl font-black text-gray-900 mb-6 md:mb-8 leading-[1.05] tracking-tight"
                style={{ fontSize: 'clamp(2.3rem, 8vw, 4.5rem)' }}
              >
                {t('hero.title.line1')}<br />
                {t('hero.title.line2.start')}<span className="text-blue-600">{t('hero.title.line2.highlight')}</span>
              </h1>

              {/* Liste à puces visuelle */}
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-gray-900 flex-shrink-0 mt-1" size={24} />
                  <span className="text-xl md:text-2xl text-gray-700">
                    <span className="font-bold text-gray-900">{t('hero.bullet1.bold')}</span> {t('hero.bullet1.text')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-gray-900 flex-shrink-0 mt-1" size={24} />
                  <span className="text-xl md:text-2xl text-gray-700">
                    <span className="font-bold text-gray-900">{t('hero.bullet2.bold')}</span> {t('hero.bullet2.text')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-gray-900 flex-shrink-0 mt-1" size={24} />
                  <span className="text-xl md:text-2xl text-gray-700">
                    <span className="font-bold text-gray-900">{t('hero.bullet3.bold')}</span> {t('hero.bullet3.text')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-gray-900 flex-shrink-0 mt-1" size={24} />
                  <span className="text-xl md:text-2xl text-gray-700">
                    <span className="font-bold text-gray-900">{t('hero.bullet4.bold')}</span> {t('hero.bullet4.text')}
                  </span>
                </li>
              </ul>

              <p className="text-2xl md:text-[1.75rem] font-black tracking-tight text-gray-900 mb-8 leading-tight">
                {t('hero.subtitle.line2')} <br className="hidden md:inline" />
                {t('hero.subtitle.line2.highlight')}
              </p>

              <button
                onClick={handleWhatsAppClick}
                className="w-full md:w-auto px-8 py-5 bg-blue-600 text-white rounded-xl font-bold text-xl md:text-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
              >
                <MessageCircle size={26} className="group-hover:scale-110 transition-transform" />
                {t('hero.cta')}
              </button>

              <p className="text-sm md:text-base text-gray-500 mt-4 font-medium flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                {t('hero.microcopy')}
              </p>
            </motion.div>

            {/* Right Column - VSL Video (Légèrement réduite) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start"
            >
              <div className="w-full max-w-[750px]">
                <div 
                  className="relative w-full aspect-[4/5] md:aspect-video lg:aspect-[4/5] max-h-[400px] lg:max-h-[500px] bg-gray-50 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border-4 border-gray-100"
                  onClick={() => setIsVideoOpen(true)}
                >
                  {/* Logo Thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center p-20 opacity-80">
                    <div className="relative w-full h-full">
                      <Image 
                        src="/brand/sms-logo2.svg" 
                        alt="Science Made Simple"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Voile gris */}
                  <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/30 transition-all duration-300 backdrop-blur-[2px]"></div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <Play className="text-blue-600 ml-1" size={40} />
                    </div>
                  </div>

                  {/* Overlay gradient en bas */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
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

      {/* Pitch Section */}
      <section className="bg-black py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-8 text-left">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <p key={i} className="text-2xl md:text-4xl leading-relaxed font-normal" style={{ color: '#FFFFFF' }}>
              {t(`pitch.${i}`)}
            </p>
          ))}

          <div className="pt-8">
            <button
              onClick={handleWhatsAppClick}
              className="px-8 py-4 bg-white text-black rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              <MessageCircle size={20} className="inline mr-2" />
              {t('pitch.cta')}
            </button>
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

