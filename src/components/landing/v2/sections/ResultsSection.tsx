'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "J'étais perdu en physique. Grâce à SMS, j'ai eu 14/20 à mon partiel alors que je visais juste la moyenne.",
    name: "Alexandre M.",
    level: "Bac 1 Ingénieur",
    subject: "Physique"
  },
  {
    id: 2,
    quote: "Les slides manuscrits changent tout. On voit le raisonnement se construire, c'est tellement plus clair qu'un PowerPoint.",
    name: "Sarah L.",
    level: "Bac 2 Médecine",
    subject: "Chimie"
  },
  {
    id: 3,
    quote: "J'avais raté deux fois mon examen de maths. Avec leur méthode, je l'ai réussi avec 12/20. Je suis tellement soulagée.",
    name: "Emma D.",
    level: "Bac 1 Économie",
    subject: "Mathématiques"
  },
  {
    id: 4,
    quote: "Le support WhatsApp 24/7, c'est ce qui fait toute la différence. Je ne me sens plus jamais seule.",
    name: "Thomas B.",
    level: "Bac 1 Sciences",
    subject: "Plusieurs matières"
  },
  {
    id: 5,
    quote: "Ils m'ont redonné confiance en moi. Je ne pensais pas être capable de réussir en physique quantique.",
    name: "Léa R.",
    level: "Bac 2 Physique",
    subject: "Physique quantique"
  }
];

export function ResultsSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section id="results" className="py-20 md:py-32 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
          Ils ont transformé leurs résultats<br />grâce à Science Made Simple
        </h2>
        
        <p className="text-xl text-gray-600 mb-12 text-center max-w-4xl mx-auto">
          Des centaines d'étudiants sont passés de « je vais rater » à « je maîtrise mes examens ».
        </p>

        {/* Top Video Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <div
            className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group border border-gray-700"
            onClick={() => setIsVideoPlaying(true)}
          >
            {!isVideoPlaying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-900/50 group-hover:from-gray-700/70 group-hover:to-gray-900/70 transition-all"></div>
                <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform mb-4">
                  <Play className="text-gray-900 ml-1" size={32} />
                </div>
                <p className="relative z-10 text-white font-semibold text-lg">
                  Témoignages d'étudiants
                </p>
              </div>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.level}</p>
                <p className="text-sm text-blue-600">{testimonial.subject}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <p className="text-center text-gray-600 mb-8">
          Plus de 2 400 étudiants ont déjà été accompagnés, du secondaire aux études supérieures.
        </p>

        {/* Optional: Social proof screenshots placeholder */}
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 h-40 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200 flex items-center justify-center"
            >
              <p className="text-gray-400 text-sm">Message étudiant #{i}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Messages reçus après les résultats d'examen
        </p>
      </div>
    </section>
  );
}




