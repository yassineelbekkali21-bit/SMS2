'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  textFr: string;
  textEn: string;
  resultFr: string;
  resultEn: string;
  color: 'light' | 'dark';
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sophie',
    textFr: 'Hello, on a reçu les points du labo de physique et avec les bonus j\'ai eu 20,5/20 !! 😊',
    textEn: 'Hello, we got the physics lab results and with the bonuses I got 20.5/20!! 😊',
    resultFr: '20,5/20 en physique',
    resultEn: '20.5/20 in physics',
    color: 'light'
  },
  {
    id: '2',
    name: 'Thomas',
    textFr: 'ZAK J\'AI EU 17/20 EN PHYSIQUE !!!! MERCI BCP POUR TT CETTE ANNÉE J\'AURAIS JAMAIS PU LE FAIRE SANS TOI DONC VRLT MERCIIIIIII',
    textEn: 'ZAK I GOT 17/20 IN PHYSICS!!!! THANK YOU SO MUCH FOR THIS WHOLE YEAR I COULD NEVER HAVE DONE IT WITHOUT YOU SO REALLY THANK YOUUUUU',
    resultFr: '17/20 en physique',
    resultEn: '17/20 in physics',
    color: 'dark'
  },
  {
    id: '3',
    name: 'Amina',
    textFr: 'Ce petit message pour vous remercier pour tout ce que vous avez apporté à mon fils Hugo. Merci du fond du cœur pour tout ce que vous apportez à ces jeunes!!! Belles fêtes à vous',
    textEn: 'This little message to thank you for everything you brought to my son Hugo. Thank you from the bottom of my heart for everything you bring to these young people!!! Happy holidays to you',
    resultFr: 'Témoignage parent',
    resultEn: 'Parent testimonial',
    color: 'dark'
  },
  {
    id: '4',
    name: 'Lucas',
    textFr: 'J\'ai eu 16/20 en maths grâce à vos vidéos ! Je comprenais rien aux intégrales avant. Maintenant c\'est devenu facile 🙏',
    textEn: 'I got 16/20 in math thanks to your videos! I didn\'t understand anything about integrals before. Now it\'s become easy 🙏',
    resultFr: '16/20 en maths',
    resultEn: '16/20 in math',
    color: 'light'
  },
  {
    id: '5',
    name: 'Léa',
    textFr: 'Merci Science Made Simple ! J\'ai réussi mon exam de chimie avec 15/20. Vos explications sont tellement claires 💪',
    textEn: 'Thank you Science Made Simple! I passed my chemistry exam with 15/20. Your explanations are so clear 💪',
    resultFr: '15/20 en chimie',
    resultEn: '15/20 in chemistry',
    color: 'dark'
  },
  {
    id: '6',
    name: 'Maxime',
    textFr: 'De 8/20 à 14/20 en stats en 1 mois ! Vous m\'avez sauvé la vie, je peux continuer mes études maintenant 😭🎉',
    textEn: 'From 8/20 to 14/20 in stats in 1 month! You saved my life, I can continue my studies now 😭🎉',
    resultFr: '14/20 en stats',
    resultEn: '14/20 in stats',
    color: 'light'
  }
];

const TESTIMONIALS_VIDEO_URL = 'https://www.youtube.com/embed/MY_aGubAcdk';

export function TestimonialsSectionMultilang() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 20);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section id="testimonials" className="py-20 md:py-28 px-6 md:px-8 lg:px-10 bg-white scroll-mt-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {t('testimonials.title')}<br />
            <span className="text-blue-600">{t('testimonials.title.highlight')}</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            {!isVideoPlaying ? (
              <div 
                className="absolute inset-0 cursor-pointer group"
                onClick={() => setIsVideoPlaying(true)}
              >
                {/* Thumbnail image */}
                <Image
                  src="/thumbnails/testimonials-thumb.jpg"
                  alt="Témoignages étudiants"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  {/* Play button */}
                  <div className="relative z-10 w-24 h-24 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                    <Play className="text-blue-600 ml-1" size={40} fill="currentColor" />
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src={`${TESTIMONIALS_VIDEO_URL}?autoplay=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </motion.div>

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
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-80 rounded-3xl p-6 shadow-lg bg-gray-100 text-gray-900"
              >
                <p className="text-base leading-relaxed mb-4">
                  {language === 'fr' ? testimonial.textFr : testimonial.textEn}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{testimonial.name}</span>
                  <span className="text-sm text-gray-600">
                    ✓ {language === 'fr' ? testimonial.resultFr : testimonial.resultEn}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </motion.div>

        <div className="flex justify-center mt-12">
          <button
            onClick={() => document.getElementById('whatsapp-contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {t('testimonials.cta')}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
