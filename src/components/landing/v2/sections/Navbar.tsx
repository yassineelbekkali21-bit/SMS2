'use client';

import React from 'react';

export function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-white font-bold text-2xl">SMS</div>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('method')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Méthode
            </button>
            <button
              onClick={() => scrollToSection('results')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Résultats
            </button>
            <button
              onClick={() => scrollToSection('contents')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Contenus
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              FAQ
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 text-sm"
            >
              Parler à un mentor
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}




