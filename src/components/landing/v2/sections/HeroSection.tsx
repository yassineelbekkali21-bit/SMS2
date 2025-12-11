'use client';

import React, { useState } from 'react';
import { Play, CheckCircle } from 'lucide-react';

export function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text & CTAs */}
          <div>
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Tu galères en sciences.<br />
              Nous faisons en sorte que tu réussisses.
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              On répare ton niveau, ta méthode et ta confiance pour que tu passes de « Je vais échouer » à « Je vise l'excellence ».
            </p>

            {/* Bullet Points */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <span className="text-gray-200">Diagnostic personnalisé gratuit</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <span className="text-gray-200">Accompagnement humain, pas une plateforme froide</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <span className="text-gray-200">Méthode 90 % pratique, sans prérequis</span>
              </li>
            </ul>

            {/* Primary CTA */}
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 mb-3"
            >
              Parler de ma situation sur WhatsApp
            </button>

            {/* Small text under button */}
            <p className="text-sm text-gray-400 mb-6">
              Réponse en moins de 2 heures, sans engagement.
            </p>

            {/* Secondary text link */}
            <button
              onClick={() => setIsVideoPlaying(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors underline text-sm font-medium"
            >
              Voir comment ça marche en 2 minutes
            </button>
          </div>

          {/* Right Column - VSL Video */}
          <div>
            <div
              className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group border border-gray-700"
              onClick={() => setIsVideoPlaying(true)}
            >
              {!isVideoPlaying ? (
                // Thumbnail with play button
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-900/50 group-hover:from-gray-700/70 group-hover:to-gray-900/70 transition-all"></div>
                  <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="text-gray-900 ml-1" size={32} />
                  </div>
                </div>
              ) : (
                // Video iframe (TODO: Replace with actual video URL)
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            
            {/* Caption under video */}
            <p className="text-sm text-gray-400 mt-4 text-center">
              Regarde comment on aide les étudiants à reprendre le contrôle de leurs études.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}




