'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "Est-ce que c'est pour le secondaire ou l'université ?",
    answer: "Les deux. On accompagne des étudiants du secondaire (rhéto) jusqu'aux études supérieures (Bac 1, 2, 3 et même master). La méthode s'adapte à ton niveau."
  },
  {
    id: 2,
    question: "Est-ce que je dois déjà être bon en maths / physique pour commencer ?",
    answer: "Absolument pas. On part de ton niveau actuel, même si tu es complètement perdu. Notre méthode est conçue pour les étudiants qui galèrent, pas pour ceux qui sont déjà au top."
  },
  {
    id: 3,
    question: "Comment ça se passe concrètement après mon message WhatsApp ?",
    answer: "On te répond en moins de 2h. On fait un diagnostic personnalisé de 10 minutes pour comprendre ta situation. Ensuite, on te propose un plan sur mesure avec accès à des leçons gratuites pour tester sans engagement."
  },
  {
    id: 4,
    question: "Est-ce que je peux tester avant de payer quoi que ce soit ?",
    answer: "Oui, complètement. Après le diagnostic, on te donne accès à des leçons gratuites pour que tu puisses tester la méthode. Tu décides ensuite si tu veux continuer ou non."
  },
  {
    id: 5,
    question: "Comment sont choisis les cours que vous me proposez ?",
    answer: "On ne te laisse pas choisir au hasard dans un catalogue. On diagnostique tes blocages précis, ton niveau actuel, tes examens à venir, et on construit un parcours 100% personnalisé pour toi."
  },
  {
    id: 6,
    question: "Est-ce que vous préparez aussi aux concours (médecine, ingénieur, etc.) ?",
    answer: "Oui. On accompagne des étudiants qui préparent des concours d'entrée en médecine, ingénieur, et autres grandes écoles. Le même principe s'applique : diagnostic, plan sur mesure, accompagnement jusqu'à la réussite."
  }
];

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="faq" className="py-20 md:py-32 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
          Questions fréquentes
        </h2>
        
        <p className="text-xl text-gray-600 mb-12 text-center">
          Tout ce que tu dois savoir avant de commencer.
        </p>

        {/* Accordion */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-lg pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`text-gray-600 flex-shrink-0 transition-transform ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>
              
              {openId === faq.id && (
                <div className="px-6 pb-5">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-white rounded-2xl p-8 border border-gray-200">
          <p className="text-lg text-gray-700 mb-6">
            Tu as encore une question particulière ?
          </p>
          <button
            onClick={scrollToContact}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
          >
            Poser ma question sur WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}




