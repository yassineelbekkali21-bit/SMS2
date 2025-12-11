'use client';

import React from 'react';

export function FinalCTASection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main message */}
        <p className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed">
          Si tu veux arrêter de subir tes études et reprendre le contrôle de tes résultats, c'est ici que ça commence.
        </p>
        
        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
          Un message, un diagnostic, un plan. Ensuite, on s'occupe de toi.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToContact}
          className="px-10 py-5 bg-blue-600 text-white rounded-lg font-bold text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 mb-6"
        >
          Parler à un mentor maintenant
        </button>

        {/* Small text */}
        <p className="text-sm text-gray-400">
          Tu n'as rien à perdre. À part la peur de rater.
        </p>
      </div>
    </section>
  );
}




