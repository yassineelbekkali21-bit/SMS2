'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Menu, X, Play, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { VideoModal } from '@/components/VideoModal';

interface HeroSectionProps {
  onEnterApp?: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const WHATSAPP_NUMBER = '33123456789'; // À remplacer par votre vrai numéro
const WHATSAPP_DEFAULT_MESSAGE = 'Salut Science Made Simple 👋, j\'aimerais qu\'on regarde ensemble ma situation en [matière / faculté] pour voir comment vous pouvez m\'aider.';

export function HeroSection({ onEnterApp, isMenuOpen, setIsMenuOpen }: HeroSectionProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const handleDiscoverCourses = () => {
    // Appeler onEnterApp si fourni, sinon rediriger vers le dashboard
    if (onEnterApp) {
      onEnterApp();
    } else {
      // Redirection vers le SimpleDashboard (simuler l'authentification)
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
      <nav className="sticky top-2 md:top-4 z-50 px-3 md:px-6">
        <div className="max-w-7xl mx-auto bg-black rounded-2xl md:rounded-3xl shadow-2xl">
          <div className="px-3 md:px-6 py-1 md:py-2">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 relative -my-3 md:-my-6">
                  <Image 
                    src="/brand/sms-logo.svg" 
                    alt="Science Made Simple"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Menu desktop - Centré */}
              <div className="hidden md:flex items-center gap-12">
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Méthode
                </button>
                <button
                  onClick={() => scrollToSection('offre')}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Offre
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Résultats
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  FAQ
                </button>
              </div>

              {/* CTA Button */}
              <div className="hidden md:block">
                <button
                  onClick={handleWhatsAppClick}
                  className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  Commencer gratuitement
                  <MessageCircle size={18} />
                </button>
              </div>

              {/* Menu mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
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
                    Méthode
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('offre');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    Offre
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('testimonials');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    Résultats
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('faq');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    FAQ
                  </button>
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors mt-4 flex items-center justify-center gap-2"
                  >
                    Commencer gratuitement
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="py-20 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Layout: All Text Content | Video */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Title + Pain/Desire + CTA + Social Proof */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Ce n'est pas de ta faute.<br />
                Mais ce sera ta victoire.
              </h1>

              {/* Pain/Desire Statement */}
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                On reconstruit ta méthode, ta confiance et tes résultats — avec un accompagnement humain 24/7 et un parcours qui s'adapte à toi.<br />
                Tu vas comprendre, progresser et viser plus haut que tu ne l'imaginais.
              </p>

              {/* CTA Button */}
              <button
                onClick={handleDiscoverCourses}
                className="w-full px-8 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl group"
              >
                <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                Commencer ma progression
              </button>

              {/* Microcopy sous le CTA */}
              <p className="text-base text-gray-600 text-center mb-8 mt-3 font-medium">
                Diagnostic gratuit. Leçons offertes. Sans engagement.
              </p>

              {/* Social Proof */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-white"></div>
                </div>
                <p className="text-base text-gray-700 font-medium">
                  <span className="font-bold">+2,400 étudiants</span> ont déjà décollé avec nous
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-600 hover:text-gray-900 underline decoration-gray-400 underline-offset-4 transition-colors text-sm font-medium"
                >
                  Voir comment ça marche en 2 minutes
                </button>
              </div>
            </motion.div>

            {/* Right Column - VSL Video */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="w-full">
                <div 
                  className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border-4 border-gray-200"
                  onClick={() => setIsVideoOpen(true)}
                >
                  {/* Placeholder thumbnail - remplacer par votre vraie thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform mx-auto">
                        <Play className="text-black ml-1" size={40} />
                      </div>
                    </div>
                  </div>
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pitch Section - Full Width */}
      <section className="bg-black py-16 md:py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8 text-left">
          <p className="text-2xl md:text-3xl leading-relaxed font-normal" style={{ color: '#FFFFFF' }}>
            Tout le monde peut réussir. Je te le garantis. Quelles que soient tes ambitions, quelles que soient tes difficultés, on y arrivera ensemble.
          </p>

          <p className="text-2xl md:text-3xl leading-relaxed font-normal" style={{ color: '#FFFFFF' }}>
            Si tu es motivé, je vais te faire bosser dur. Mais tu verras vite qu'on peut dépasser ce que tu croyais possible.
          </p>

          <p className="text-2xl md:text-3xl leading-relaxed font-normal" style={{ color: '#FFFFFF' }}>
            On t'expliquera les maths, la physique, la chimie et l'économie comme personne ne te les a jamais expliquées. Pas de jargon. Pas de flou. Pas d'ennui. Juste une méthode claire, directe, et des résultats concrets.
          </p>

          <p className="text-2xl md:text-3xl leading-relaxed font-normal" style={{ color: '#FFFFFF' }}>
            Nos étudiants ne se contentent pas de réussir : ils visent les meilleures écoles. Et ils y arrivent.
          </p>

          <p className="text-2xl md:text-3xl leading-relaxed font-normal" style={{ color: '#FFFFFF' }}>
            Notre mission est simple : dévoiler ton véritable potentiel. Te faire comprendre. Te faire progresser. Et peut-être même... te faire aimer ces matières.
          </p>

          <p className="text-2xl md:text-3xl leading-relaxed font-normal" style={{ color: '#FFFFFF' }}>
            Alors oui, tu vas bosser. Oui, ce sera exigeant. Mais tu ne seras jamais seul. Et tu ne reconnaîtras plus ton niveau d'ici quelques semaines.
          </p>

          <p className="text-2xl md:text-3xl leading-relaxed font-normal" style={{ color: '#FFFFFF' }}>
            Tout commence par un simple message WhatsApp.
          </p>

          <p className="text-2xl md:text-3xl leading-relaxed font-normal" style={{ color: '#FFFFFF' }}>
            Les autres ont déjà commencé. Pourquoi pas toi ?
          </p>

          <div className="pt-8">
            <button
              onClick={handleWhatsAppClick}
              className="px-8 py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              <MessageCircle size={20} className="inline mr-2" />
              Commencer maintenant
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" // Remplacer par votre vraie vidéo
      />
    </>
  );
}

