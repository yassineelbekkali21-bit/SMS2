'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  roleFr: string;
  roleEn: string;
  textFr: string;
  textEn: string;
  subjects: string[];
  stars: number;
}

// Generate 200 testimonials
const generateTestimonials = (): Testimonial[] => {
  const names = [
    'Sophie Martin', 'Thomas Dubois', 'Amina Diallo', 'Lucas Bernard', 'Léa Petit', 
    'Maxime Laurent', 'Emma Moreau', 'Nathan Garcia', 'Chloé Robert', 'Antoine Leroy',
    'Julie Simon', 'Hugo Michel', 'Camille Lefebvre', 'Théo Roux', 'Sarah Mensah',
    'Alexandre David', 'Manon Bertrand', 'Raphaël Morel', 'Inès Fournier', 'Victor Girard'
  ];
  
  const avatars = ['👩‍🎓', '👨‍🎓', '👩🏽‍🎓', '👨🏻‍🎓', '👩🏼‍🎓', '👨🏽‍🎓', '👩🏾‍🎓', '👨🏼‍🎓', '👩‍💼', '👨‍💼'];
  
  const rolesFr = [
    'Étudiant en Médecine', 'Étudiante en Pharmacie', 'Prépa MPSI', 'L1 Physique-Chimie',
    'Terminale S', 'L2 Sciences', 'Étudiant en Ingénierie', 'Prépa BCPST', 'L3 Maths',
    'Étudiante en Biologie', 'Master Physique', 'Prépa PC', 'L1 PASS', 'Terminale STI2D'
  ];
  
  const rolesEn = [
    'Medical Student', 'Pharmacy Student', 'MPSI Prep', 'L1 Physics-Chemistry',
    'Senior Year', 'L2 Sciences', 'Engineering Student', 'BCPST Prep', 'L3 Math',
    'Biology Student', 'Physics Master', 'PC Prep', 'L1 PASS', 'Senior STI2D'
  ];
  
  const textsFr = [
    '"J\'ai validé ma PASS du premier coup grâce à SMS."',
    '"De 8 à 16/20 en physique en seulement 2 mois !"',
    '"Enfin des explications claires et accessibles."',
    '"Les cours sont incroyables, tout devient simple."',
    '"Merci Zak ! J\'ai enfin compris la thermodynamique."',
    '"Première de ma promo grâce à cette méthode."',
    '"Je recommande à 100%, c\'est un game changer."',
    '"Les quiz m\'ont permis de valider mon semestre."',
    '"Meilleur investissement de mes études."',
    '"J\'ai plus peur des examens maintenant."'
  ];
  
  const textsEn = [
    '"I passed my PASS on the first try thanks to SMS."',
    '"From 8 to 16/20 in physics in just 2 months!"',
    '"Finally clear and accessible explanations."',
    '"The courses are incredible, everything becomes simple."',
    '"Thanks Zak! I finally understood thermodynamics."',
    '"Top of my class thanks to this method."',
    '"I recommend 100%, it\'s a game changer."',
    '"The quizzes helped me pass my semester."',
    '"Best investment of my studies."',
    '"I\'m not afraid of exams anymore."'
  ];
  
  const subjectsList = [
    ['Physics', 'Chemistry'],
    ['Math', 'Physics'],
    ['Chemistry', 'Biology'],
    ['Physics'],
    ['Math', 'Statistics'],
    ['Thermodynamics', 'Optics'],
    ['Chemistry'],
    ['Physics', 'Math', 'Chemistry'],
    ['Biology', 'Chemistry'],
    ['Math']
  ];
  
  const testimonials: Testimonial[] = [];
  
  for (let i = 0; i < 200; i++) {
    const nameIndex = i % names.length;
    const textIndex = i % textsFr.length;
    const roleIndex = i % rolesFr.length;
    const avatarIndex = i % avatars.length;
    const subjectsIndex = i % subjectsList.length;
    
    testimonials.push({
      id: String(i + 1),
      name: names[nameIndex],
      avatar: avatars[avatarIndex],
      roleFr: rolesFr[roleIndex],
      roleEn: rolesEn[roleIndex],
      textFr: textsFr[textIndex],
      textEn: textsEn[textIndex],
      subjects: subjectsList[subjectsIndex],
      stars: 5,
    });
  }
  
  return testimonials;
};

const allTestimonials = generateTestimonials();

const TESTIMONIALS_VIDEO_URL = 'https://www.youtube.com/embed/MY_aGubAcdk';

// Video testimonials for carousel
const videoTestimonials = [
  {
    id: 'v1',
    videoUrl: 'https://www.youtube.com/embed/MY_aGubAcdk',
    subtitleFr: 'Mes notes ont explosé en physique',
    subtitleEn: 'My physics grades skyrocketed',
    ctaFr: 'Voir le parcours Physique',
    ctaEn: 'See Physics track',
  },
  {
    id: 'v2',
    videoUrl: 'https://www.youtube.com/embed/MY_aGubAcdk',
    subtitleFr: 'Je comprends enfin les maths',
    subtitleEn: 'I finally understand math',
    ctaFr: 'Voir le parcours Maths',
    ctaEn: 'See Math track',
  },
  {
    id: 'v3',
    videoUrl: 'https://www.youtube.com/embed/MY_aGubAcdk',
    subtitleFr: 'La chimie est devenue facile',
    subtitleEn: 'Chemistry became easy',
    ctaFr: 'Voir le parcours Chimie',
    ctaEn: 'See Chemistry track',
  },
  {
    id: 'v4',
    videoUrl: 'https://www.youtube.com/embed/MY_aGubAcdk',
    subtitleFr: 'J\'ai validé mon semestre !',
    subtitleEn: 'I passed my semester!',
    ctaFr: 'Voir tous les parcours',
    ctaEn: 'See all tracks',
  },
  {
    id: 'v5',
    videoUrl: 'https://www.youtube.com/embed/MY_aGubAcdk',
    subtitleFr: 'Meilleur investissement',
    subtitleEn: 'Best investment ever',
    ctaFr: 'Commencer maintenant',
    ctaEn: 'Start now',
  },
  {
    id: 'v6',
    videoUrl: 'https://www.youtube.com/embed/MY_aGubAcdk',
    subtitleFr: 'Les explications sont claires',
    subtitleEn: 'The explanations are clear',
    ctaFr: 'Voir la méthode',
    ctaEn: 'See the method',
  },
];

// Initial display: 2 rows x 5 columns = 10 cards
const INITIAL_DISPLAY = 10;
// Each "Voir plus" click adds 2 more rows = 10 more cards
const LOAD_MORE_COUNT = 10;

// WhatsApp screenshots data
const whatsappScreenshots = [
  {
    id: 'wa1',
    name: 'Sophie M.',
    role: 'Médecine',
    subject: 'Physique + Chimie',
    messages: [
      { from: 'student', text: 'Zak j\'ai eu 16/20 en physique !! 🎉', time: '14:32' },
      { from: 'zak', text: 'Bravo Sophie ! Tu vois quand on reprend les bases ça paie 💪', time: '14:35' },
      { from: 'student', text: 'Merci pour tout vraiment', time: '14:36' },
    ]
  },
  {
    id: 'wa2',
    name: 'Thomas D.',
    role: 'Prépa MPSI',
    subject: 'Maths',
    messages: [
      { from: 'student', text: 'Je comprends enfin les intégrales !', time: '18:20' },
      { from: 'zak', text: 'Normal, on a pris le temps de tout revoir depuis le début', time: '18:22' },
      { from: 'student', text: 'Meilleur investissement de ma vie', time: '18:23' },
    ]
  },
  {
    id: 'wa3',
    name: 'Amina K.',
    role: 'L1 Sciences',
    subject: 'Chimie',
    messages: [
      { from: 'student', text: 'J\'ai validé mon semestre !! 🚀', time: '10:15' },
      { from: 'zak', text: 'YES ! Tu mérites amplement, tu as bossé dur', time: '10:18' },
      { from: 'student', text: 'Sans toi j\'aurais redoublé c\'est sûr', time: '10:19' },
    ]
  },
  {
    id: 'wa4',
    name: 'Lucas B.',
    role: 'Terminale',
    subject: 'Physique',
    messages: [
      { from: 'student', text: 'Mention TB au bac !! 18 en physique', time: '16:42' },
      { from: 'zak', text: 'ÉNORME ! Félicitations Lucas 🏆', time: '16:45' },
      { from: 'student', text: 'Je vais pouvoir faire médecine', time: '16:46' },
    ]
  },
  {
    id: 'wa5',
    name: 'Emma R.',
    role: 'L2 Chimie',
    subject: 'Chimie orga',
    messages: [
      { from: 'student', text: 'La chimie orga c\'est devenu simple 😍', time: '20:30' },
      { from: 'zak', text: 'Quand on comprend le POURQUOI, tout devient logique', time: '20:33' },
      { from: 'student', text: 'J\'aurais dû te trouver plus tôt', time: '20:34' },
    ]
  },
  {
    id: 'wa6',
    name: 'Nathan G.',
    role: 'Ingénieur',
    subject: 'Stats',
    messages: [
      { from: 'student', text: 'Major de promo en stats 🎯', time: '09:10' },
      { from: 'zak', text: 'Pas surpris du tout, tu as fait le taf !', time: '09:15' },
      { from: 'student', text: 'Les 90% de pratique ça change tout', time: '09:16' },
    ]
  },
];

export function TestimonialsSectionMultilang() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY);
  const [changingIndex, setChangingIndex] = useState<number | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [whatsappIndex, setWhatsappIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const whatsappCarouselRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const { openDiagnostic } = useDiagnostic();
  
  // Carousel navigation
  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 280; // Width of each card + gap
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
    setCurrentVideoIndex(index);
  };
  
  const handlePrev = () => {
    const newIndex = Math.max(0, currentVideoIndex - 1);
    scrollToIndex(newIndex);
  };
  
  const handleNext = () => {
    const newIndex = Math.min(videoTestimonials.length - 1, currentVideoIndex + 1);
    scrollToIndex(newIndex);
  };
  
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = 280;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentVideoIndex(newIndex);
    }
  };

  const visibleTestimonials = allTestimonials.slice(0, visibleCount);
  const hasMore = visibleCount < allTestimonials.length;
  const isExpanded = visibleCount > INITIAL_DISPLAY;

  // Change testimonial on click
  const handleTestimonialClick = (index: number) => {
    setChangingIndex(index);
    setTimeout(() => {
      setChangingIndex(null);
    }, 300);
  };

  const handleVoirPlus = () => {
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, allTestimonials.length));
    };

  const handleVoirMoins = () => {
    setVisibleCount(INITIAL_DISPLAY);
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 px-6 md:px-8 lg:px-10 bg-gray-50 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-4xl mb-4 tracking-wide"
            style={{ fontSize: 'clamp(2rem, 8vw, 64px)' }}
          >
            {t('testimonials.title')}<br />
            <span>{t('testimonials.title.highlight')}</span>
          </motion.h2>
        </div>

        {/* Video Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          {/* Navigation Arrows - Right aligned */}
          <div className="flex justify-end gap-3 mb-6 pr-4">
            <button
              onClick={handlePrev}
              disabled={currentVideoIndex === 0}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                currentVideoIndex === 0 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-400 text-gray-600 hover:border-gray-600 hover:text-gray-900'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentVideoIndex === videoTestimonials.length - 1}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                currentVideoIndex === videoTestimonials.length - 1 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-400 text-gray-600 hover:border-gray-600 hover:text-gray-900'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videoTestimonials.map((video, index) => (
              <div 
                key={video.id}
                className="flex-shrink-0 snap-start"
                style={{ width: '260px' }}
              >
                {/* Video Card - Vertical Format */}
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg bg-gray-900 group cursor-pointer">
                  {playingVideoId === video.id ? (
                    <iframe
                      src={`${video.videoUrl}?autoplay=1`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div 
                      className="absolute inset-0"
                      onClick={() => setPlayingVideoId(video.id)}
              >
                {/* Thumbnail image */}
                <Image
                  src="/thumbnails/testimonials-thumb.jpg"
                        alt="Témoignage étudiant"
                  fill
                  className="object-cover"
                      />
                      
                      {/* Subtitle overlay */}
                      <div className="absolute bottom-20 left-4 right-4">
                        <p className="text-white text-lg font-medium leading-tight drop-shadow-lg">
                          {language === 'fr' ? video.subtitleFr : video.subtitleEn}
                        </p>
                      </div>
                      
                  {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="text-[#00c2ff] ml-1" size={28} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Progress bar at bottom (decorative) */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-[#00c2ff] w-1/3" />
                  </div>
                </div>
                
                {/* CTA below video */}
                <button className="mt-3 flex items-center gap-1 text-gray-800 font-medium hover:text-[#00c2ff] transition-colors group/cta">
                  <span style={{ fontSize: '15px' }}>{language === 'fr' ? video.ctaFr : video.ctaEn}</span>
                  <ArrowRight size={16} className="group-hover/cta:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {videoTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentVideoIndex 
                    ? 'bg-gray-800 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* WhatsApp Screenshots Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Navigation Arrows - Right aligned */}
          <div className="flex justify-end gap-3 mb-6 pr-4">
            <button
              onClick={() => {
                if (whatsappCarouselRef.current) {
                  const newIndex = Math.max(0, whatsappIndex - 1);
                  whatsappCarouselRef.current.scrollTo({ left: newIndex * 280, behavior: 'smooth' });
                  setWhatsappIndex(newIndex);
                }
              }}
              disabled={whatsappIndex === 0}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                whatsappIndex === 0 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-400 text-gray-600 hover:border-gray-600 hover:text-gray-900'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => {
                if (whatsappCarouselRef.current) {
                  const newIndex = Math.min(whatsappScreenshots.length - 1, whatsappIndex + 1);
                  whatsappCarouselRef.current.scrollTo({ left: newIndex * 280, behavior: 'smooth' });
                  setWhatsappIndex(newIndex);
                }
              }}
              disabled={whatsappIndex === whatsappScreenshots.length - 1}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                whatsappIndex === whatsappScreenshots.length - 1 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-400 text-gray-600 hover:border-gray-600 hover:text-gray-900'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Carousel Container */}
          <div 
            ref={whatsappCarouselRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {whatsappScreenshots.map((screenshot) => (
              <div 
                key={screenshot.id}
                className="flex-shrink-0 snap-start"
                style={{ width: '260px' }}
              >
                {/* WhatsApp Screenshot Card - Vertical Format */}
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg bg-[#0b141a] group">
                  {/* WhatsApp-style header */}
                  <div className="absolute top-0 left-0 right-0 bg-[#1f2c34] px-4 py-3 z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00c2ff] flex items-center justify-center text-white font-bold text-sm">
                        {screenshot.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{screenshot.name}</p>
                        <p className="text-gray-400 text-xs">{screenshot.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat messages */}
                  <div className="absolute inset-0 pt-16 pb-4 px-3 flex flex-col justify-end gap-2">
                    {screenshot.messages.map((msg, i) => (
                      <div 
                        key={i}
                        className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                          msg.from === 'student' 
                            ? 'bg-[#005c4b] text-white self-end rounded-br-none' 
                            : 'bg-[#1f2c34] text-white self-start rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className="text-[10px] text-gray-400 text-right mt-1">{msg.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* CTA below */}
                <button className="mt-3 flex items-center gap-1 text-gray-800 font-medium hover:text-[#00c2ff] transition-colors group/cta">
                  <span style={{ fontSize: '15px' }}>{screenshot.subject}</span>
                  <ArrowRight size={16} className="group-hover/cta:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {whatsappScreenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (whatsappCarouselRef.current) {
                    whatsappCarouselRef.current.scrollTo({ left: index * 280, behavior: 'smooth' });
                    setWhatsappIndex(index);
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === whatsappIndex 
                    ? 'bg-gray-800 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </motion.div>

        <div className="flex justify-center mt-12">
          <button
            onClick={openDiagnostic}
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
            style={{ fontSize: '18px' }}
          >
            {language === 'fr' ? 'Construire mon parcours' : 'Build my learning path'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
