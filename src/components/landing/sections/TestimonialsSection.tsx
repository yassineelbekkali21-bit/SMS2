'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, MessageCircle } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  result: string;
  color: 'light' | 'dark';
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sophie',
    text: 'Hello, on a reçu les points du labo de physique et avec les bonus j\'ai eu 20,5/20 !! 😊',
    result: '20,5/20 en physique',
    color: 'light'
  },
  {
    id: '2',
    name: 'Thomas',
    text: 'ZAK J\'AI EU 17/20 EN PHYSIQUE !!!! MERCI BCP POUR TT CETTE ANNÉE J\'AURAIS JAMAIS PU LE FAIRE SANS TOI DONC VRLT MERCIIIIIII',
    result: '17/20 en physique',
    color: 'dark'
  },
  {
    id: '3',
    name: 'Amina',
    text: 'Ce petit message pour vous remercier pour tout ce que vous avez apporté à mon fils Hugo. Merci du fond du cœur pour tout ce que vous apportez à ces jeunes!!! Belles fêtes à vous',
    result: 'Témoignage parent',
    color: 'dark'
  },
  {
    id: '4',
    name: 'Lucas',
    text: 'J\'ai eu 16/20 en maths grâce à vos vidéos ! Je comprenais rien aux intégrales avant. Maintenant c\'est devenu facile 🙏',
    result: '16/20 en maths',
    color: 'light'
  },
  {
    id: '5',
    name: 'Léa',
    text: 'Merci Science Made Simple ! J\'ai réussi mon exam de chimie avec 15/20. Vos explications sont tellement claires 💪',
    result: '15/20 en chimie',
    color: 'dark'
  },
  {
    id: '6',
    name: 'Maxime',
    text: 'De 8/20 à 14/20 en stats en 1 mois ! Vous m\'avez sauvé la vie, je peux continuer mes études maintenant 😭🎉',
    result: '14/20 en stats',
    color: 'light'
  }
];

const WHATSAPP_NUMBER = '33123456789';
const TESTIMONIALS_VIDEO_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // À remplacer

export function TestimonialsSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWhatsAppClick = () => {
    const message = 'Salut Science Made Simple 👋, j\'aimerais avoir les mêmes résultats que vos étudiants !';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  // Auto-scroll horizontal
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Pixels par frame

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset quand on atteint la fin
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 20);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section id="testimonials" className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Ils ont transformé leurs résultats grâce à Science Made Simple.<br />
            <span className="text-blue-600">Demain, c'est peut-être toi.</span>
          </motion.h2>
        </div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden shadow-2xl">
            {!isVideoPlaying ? (
              // Thumbnail avec bouton play
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                onClick={() => setIsVideoPlaying(true)}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="text-blue-600 ml-1" size={32} />
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                  <h3 className="text-2xl font-bold">SMS vous remercie pour votre confiance</h3>
                </div>
              </div>
            ) : (
              // Vidéo active
              <iframe
                src={TESTIMONIALS_VIDEO_URL}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </motion.div>

        {/* Horizontal Scrolling Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden"
        >
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden py-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Dupliquer les témoignages pour un scroll infini */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className={`flex-shrink-0 w-80 rounded-3xl p-6 shadow-lg ${
                  testimonial.color === 'light' 
                    ? 'bg-gray-200 text-gray-900' 
                    : 'bg-gray-900 text-white'
                }`}
              >
                <p className="text-base leading-relaxed mb-4">
                  {testimonial.text}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{testimonial.name}</span>
                  <span className={`text-sm ${
                    testimonial.color === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    ✓ {testimonial.result}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Gradients pour effet de fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
}

