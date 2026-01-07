'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  textFr: string;
  textEn: string;
  resultFr: string;
  resultEn: string;
}

// Generate 200 testimonials
const generateTestimonials = (): Testimonial[] => {
  const names = [
    'Sophie', 'Thomas', 'Amina', 'Lucas', 'Léa', 'Maxime', 'Emma', 'Nathan', 'Chloé', 'Antoine',
    'Julie', 'Hugo', 'Camille', 'Théo', 'Sarah', 'Alexandre', 'Manon', 'Raphaël', 'Inès', 'Victor',
    'Clara', 'Louis', 'Zoé', 'Arthur', 'Marie', 'Paul', 'Laura', 'Julien', 'Eva', 'Mathis',
    'Alice', 'Romain', 'Charlotte', 'Enzo', 'Margot', 'Quentin', 'Jade', 'Nicolas', 'Océane', 'Adrien',
    'Lisa', 'Valentin', 'Pauline', 'Clément', 'Anaïs', 'Florian', 'Justine', 'Guillaume', 'Célia', 'Benjamin',
    'Mélanie', 'Axel', 'Lucie', 'Damien', 'Elisa', 'Kevin', 'Aurélie', 'Dylan', 'Morgane', 'Bastien',
    'Émilie', 'Corentin', 'Marine', 'Yann', 'Nadia', 'Fabien', 'Audrey', 'Thibault', 'Amélie', 'Sébastien',
    'Caroline', 'Alexis', 'Laurie', 'Matthieu', 'Élodie', 'Jérémy', 'Fanny', 'Arnaud', 'Myriam', 'Olivier',
    'Sandrine', 'Sylvain', 'Laetitia', 'Michaël', 'Stéphanie', 'Franck', 'Vanessa', 'Cédric', 'Nathalie', 'Ludovic',
    'Patricia', 'Éric', 'Isabelle', 'Thierry', 'Hélène', 'Philippe', 'Sophie M.', 'Laurent', 'Anne', 'Christophe'
  ];
  
  const textsFr = [
    'J\'ai eu {note}/20 en physique ! Merci 😊',
    'De 8 à {note}/20 en {matiere}. Incroyable ! 🎉',
    'Enfin je comprends {matiere} ! {note}/20 💪',
    'Les cours sont super clairs. {note}/20 🔥',
    'Merci Zak pour tout ! {note}/20 en {matiere} 🙏',
    'Première de ma promo grâce à vous ! {note}/20 🏆',
    'Je recommande à 100%. {note}/20 ✨',
    'Les quiz m\'ont beaucoup aidé. {note}/20 🎯',
    'J\'ai validé mon semestre ! {note}/20 🚀',
    'Support au top. {note}/20 en {matiere} 👍',
    'Progression énorme en 1 mois ! {note}/20 📈',
    'Meilleur investissement. {note}/20 💯',
    'Explications parfaites. {note}/20 en {matiere} ⭐',
    'J\'ai plus peur des exams. {note}/20 🎓',
    'Méthodologie top niveau. {note}/20 🧠',
    'Mes parents sont fiers ! {note}/20 ❤️',
    'Tout est devenu simple. {note}/20 en {matiere} 💡',
    'Les vidéos sont géniales. {note}/20 📺',
    'Je kiffe apprendre maintenant ! {note}/20 😍',
    'Résultats au-delà des attentes. {note}/20 🌟'
  ];
  
  const textsEn = [
    'I got {note}/20 in physics! Thanks 😊',
    'From 8 to {note}/20 in {matiere}. Incredible! 🎉',
    'Finally I understand {matiere}! {note}/20 💪',
    'The courses are super clear. {note}/20 🔥',
    'Thanks Zak for everything! {note}/20 in {matiere} 🙏',
    'Top of my class thanks to you! {note}/20 🏆',
    'I recommend 100%. {note}/20 ✨',
    'The quizzes helped me a lot. {note}/20 🎯',
    'I passed my semester! {note}/20 🚀',
    'Amazing support. {note}/20 in {matiere} 👍',
    'Huge progress in 1 month! {note}/20 📈',
    'Best investment. {note}/20 💯',
    'Perfect explanations. {note}/20 in {matiere} ⭐',
    'No more exam fear. {note}/20 🎓',
    'Top level methodology. {note}/20 🧠',
    'My parents are proud! {note}/20 ❤️',
    'Everything became simple. {note}/20 in {matiere} 💡',
    'The videos are great. {note}/20 📺',
    'I love learning now! {note}/20 😍',
    'Results beyond expectations. {note}/20 🌟'
  ];
  
  const matieres = ['physique', 'maths', 'chimie', 'stats', 'algèbre', 'analyse', 'thermodynamique', 'optique'];
  const matieresEn = ['physics', 'math', 'chemistry', 'stats', 'algebra', 'calculus', 'thermodynamics', 'optics'];
  const notes = ['14', '15', '16', '17', '18', '19', '20'];
  
  const testimonials: Testimonial[] = [];
  
  for (let i = 0; i < 200; i++) {
    const name = names[i % names.length];
    const textIndex = i % textsFr.length;
    const matiereIndex = i % matieres.length;
    const note = notes[i % notes.length];
    
    const textFr = textsFr[textIndex]
      .replace('{note}', note)
      .replace('{matiere}', matieres[matiereIndex]);
    const textEn = textsEn[textIndex]
      .replace('{note}', note)
      .replace('{matiere}', matieresEn[matiereIndex]);
    
    testimonials.push({
      id: String(i + 1),
      name: i % 15 === 0 ? `${name} (parent)` : name,
      textFr,
      textEn,
      resultFr: i % 15 === 0 ? 'Parent' : `${note}/20`,
      resultEn: i % 15 === 0 ? 'Parent' : `${note}/20`,
    });
  }
  
  return testimonials;
};

const allTestimonials = generateTestimonials();

const TESTIMONIALS_VIDEO_URL = 'https://www.youtube.com/embed/MY_aGubAcdk';

// Initial display: 2 rows x 5 columns = 10 cards
const INITIAL_DISPLAY = 10;
// Each "Voir plus" click adds 2 more rows = 10 more cards
const LOAD_MORE_COUNT = 10;

export function TestimonialsSectionMultilang() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY);
  const [changingIndex, setChangingIndex] = useState<number | null>(null);
  const { language, t } = useLanguage();
  const { openDiagnostic } = useDiagnostic();

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

        {/* Grid 5x2 de témoignages avec expansion verticale */}
        <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: changingIndex === index ? 0.5 : 1,
                    y: 0
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index >= visibleCount - LOAD_MORE_COUNT ? (index % LOAD_MORE_COUNT) * 0.05 : 0 }}
                  onClick={() => handleTestimonialClick(index)}
                  className="rounded-xl p-3 md:p-4 shadow-md bg-white border border-gray-100 text-gray-900 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                  <p className="leading-snug mb-2 line-clamp-2 font-medium" style={{ fontSize: '14px' }}>
                  {language === 'fr' ? testimonial.textFr : testimonial.textEn}
                </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-800 truncate max-w-[60%]" style={{ fontSize: '14px' }}>{testimonial.name}</span>
                    <span className="text-green-600 font-bold" style={{ fontSize: '14px' }}>
                      {language === 'fr' ? testimonial.resultFr : testimonial.resultEn}
                  </span>
                </div>
                </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>

          {/* Bouton Voir plus / Voir moins */}
          <div className="flex justify-center mt-8">
            {hasMore ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoirPlus}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
              >
                {language === 'fr' ? 'Voir plus de témoignages' : 'See more testimonials'}
                <ChevronDown size={20} />
              </motion.button>
            ) : isExpanded ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoirMoins}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
              >
                {language === 'fr' ? 'Voir moins' : 'See less'}
                <ChevronUp size={20} />
              </motion.button>
            ) : null}
          </div>
        </div>

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
