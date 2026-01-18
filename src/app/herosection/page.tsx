'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle, Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function HeroSectionPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const navItems = [
    { label: 'Programmes', href: '#' },
    { label: 'Méthode', href: '#' },
    { label: 'Résultats', href: '#' },
    { label: 'Offre', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ========== NAVIGATION ========== */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div 
          className="max-w-7xl mx-auto rounded-full px-6 py-3"
          style={{
            background: 'rgba(13, 19, 23, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="relative w-20 h-10">
              <Image 
                src="/brand/sms-logo.svg" 
                alt="SMS" 
                fill 
                className="object-contain object-left" 
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a 
                  key={item.label}
                  href={item.href}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <button 
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
              style={{
                background: '#00c2ff',
                color: 'white',
              }}
            >
              Diagnostic gratuit
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* ========== HERO SECTION CENTRÉE ========== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00c2ff]/10 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#00c2ff]">+2,400 étudiants ont déjà décollé</span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-title mb-6 leading-[1.05] tracking-wide"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 80px)' }}
          >
            REDÉCOUVREZ LA SCIENCE,<br />
            GAGNEZ EN CONFIANCE.
          </motion.h1>

          {/* Sous-titre */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ fontSize: '20px' }}
          >
            Une décennie de pédagogie scientifique, condensée en cours qui transforment 
            chaque difficulté en opportunité. Essayez gratuitement et remarquez la différence.
          </motion.p>

          {/* CTA Button - Style prod */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center mb-10"
          >
            <button 
              className="group relative py-5 px-8 bg-black text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden hover:scale-105 shadow-lg hover:shadow-2xl cursor-pointer"
              style={{ fontSize: '18px' }}
            >
              {/* Shine effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12" />
              <span className="relative z-10 flex items-center gap-3">
                Construis ton parcours sur mesure
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Paiement unique</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Accès à vie</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Sans engagement</span>
            </div>
          </motion.div>
        </div>

        {/* Video Preview - Centré en dessous */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 w-full max-w-4xl mx-auto"
        >
          <div 
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
            onClick={() => setIsVideoPlaying(true)}
          >
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play size={32} className="text-gray-900 ml-1" fill="currentColor" />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              
              {/* SMS Logo watermark */}
              <div className="absolute bottom-4 right-4 opacity-30">
                <Image 
                  src="/brand/sms-logo.svg" 
                  alt="" 
                  width={60} 
                  height={30} 
                  className="brightness-0 invert"
                />
              </div>
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white/90 text-sm font-medium text-center">
                Voir comment ça marche en 2 minutes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Social Proof - Style prod */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 flex items-center justify-center gap-3"
        >
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#00a8e0] border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-white"></div>
          </div>
          <p className="text-gray-600 font-medium" style={{ fontSize: '14px' }}>
            <span className="font-bold text-gray-900">+2,400</span> étudiants ont déjà décollé avec nous
          </p>
        </motion.div>
      </section>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center pt-1"
          >
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
