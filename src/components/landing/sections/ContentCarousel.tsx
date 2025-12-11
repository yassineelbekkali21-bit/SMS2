'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoContent {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  level: string;
}

interface SubjectContent {
  id: string;
  subject: string;
  videos: VideoContent[];
}

// Données mockées - À remplacer par vos vraies vidéos
const subjectsContent: SubjectContent[] = [
  {
    id: 'maths',
    subject: 'Maths',
    videos: [
      {
        id: 'maths-1',
        title: 'Résolution d\'équations différentielles',
        description: 'Apprends à résoudre les équations différentielles du premier et second ordre étape par étape',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '',
        level: 'Intermediate'
      },
      {
        id: 'maths-2',
        title: 'Intégrales doubles et triples',
        description: 'Maîtrise le calcul d\'intégrales multiples avec des exemples concrets',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '',
        level: 'Advanced'
      },
      {
        id: 'maths-3',
        title: 'Algèbre linéaire : diagonalisation',
        description: 'Comprends la diagonalisation de matrices et ses applications',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '',
        level: 'Beginner'
      }
    ]
  },
  {
    id: 'physique',
    subject: 'Physique',
    videos: [
      {
        id: 'physique-1',
        title: 'Exercices de mécanique quantique',
        description: 'Résolution complète d\'exercices sur les ondes et particules',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '',
        level: 'Beginner'
      },
      {
        id: 'physique-2',
        title: 'Électromagnétisme : lois de Maxwell',
        description: 'Applications pratiques des équations de Maxwell',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '',
        level: 'Advanced'
      }
    ]
  },
  {
    id: 'chimie',
    subject: 'Chimie',
    videos: [
      {
        id: 'chimie-1',
        title: 'Mécanismes réactionnels en chimie organique',
        description: 'Exercices pratiques sur les mécanismes SN1, SN2, E1 et E2',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '',
        level: 'Advanced'
      },
      {
        id: 'chimie-2',
        title: 'Cinétique chimique et équilibres',
        description: 'Calculs de vitesses de réaction et constantes d\'équilibre',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '',
        level: 'Intermediate'
      }
    ]
  },
  {
    id: 'economie',
    subject: 'Économie',
    videos: [
      {
        id: 'economie-1',
        title: 'Exercices d\'équilibre du marché',
        description: 'Résolution de problèmes d\'offre et demande avec élasticité',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '',
        level: 'Beginner'
      }
    ]
  },
  {
    id: 'statistiques',
    subject: 'Statistiques',
    videos: [
      {
        id: 'stats-1',
        title: 'Tests d\'hypothèses et intervalles de confiance',
        description: 'Exercices complets sur les tests statistiques',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '',
        level: 'Intermediate'
      }
    ]
  }
];

const WHATSAPP_NUMBER = '33123456789';

export function ContentCarousel() {
  const [activeSubject, setActiveSubject] = useState<string>('maths');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const currentSubjectContent = subjectsContent.find(c => c.id === activeSubject) || subjectsContent[0];
  const currentVideo = currentSubjectContent.videos[currentVideoIndex];

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === 0 ? currentSubjectContent.videos.length - 1 : prev - 1
    );
    setIsVideoPlaying(false);
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === currentSubjectContent.videos.length - 1 ? 0 : prev + 1
    );
    setIsVideoPlaying(false);
  };

  const handleSubjectChange = (subjectId: string) => {
    setActiveSubject(subjectId);
    setCurrentVideoIndex(0);
    setIsVideoPlaying(false);
  };

  const handleTestClick = () => {
    const message = `Salut Science Made Simple 👋, je veux me tester en ${currentSubjectContent.subject}. Pouvez-vous me proposer un test adapté à mon niveau ?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="content-carousel" className="py-20 md:py-28 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Un programme complet pour maîtriser les sciences.<br />
            Organisé <span className="text-blue-600">par matière</span>, structuré <span className="text-blue-600">par niveaux</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Tu progresses du niveau Beginner → Intermediate → Advanced,<br />
            avec des contenus construits à partir des difficultés réelles de milliers d'étudiants.
          </motion.p>
        </div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Video Section - Full Width */}
          <div className="relative p-4 md:p-8">
            {/* Course Title Above Video */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {currentVideo.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {currentSubjectContent.subject}
                </span>
                <span className="text-gray-400">
                  {currentVideoIndex + 1} / {currentSubjectContent.videos.length}
                </span>
              </div>
            </div>

            {/* Video Player with Navigation + Floating CTA */}
            <div className="relative">
              <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden shadow-lg">
                {!isVideoPlaying ? (
                  // Thumbnail avec bouton play
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    {currentVideo.thumbnailUrl && (
                      <img 
                        src={currentVideo.thumbnailUrl} 
                        alt={currentVideo.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                    <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="text-blue-600 ml-1" size={28} />
                    </div>
                  </div>
                ) : (
                  // Vidéo active
                  <iframe
                    src={currentVideo.videoUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}

                {/* Level Badge - Top Left */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                  <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg backdrop-blur-sm bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                    {currentVideo.level}
                  </span>
                </div>

                {/* Floating CTA Badge - Bottom Right */}
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20">
                  <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-5 border border-gray-100 hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">Entraînement sur de vrais examens avec corrections détaillées.</p>
                      </div>
                    </div>
                    <button
                      onClick={handleTestClick}
                      className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                    >
                      Me tester
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              {currentSubjectContent.videos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevVideo}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                    aria-label="Vidéo précédente"
                  >
                    <ChevronLeft className="text-gray-900" size={24} />
                  </button>
                  <button
                    onClick={handleNextVideo}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                    aria-label="Vidéo suivante"
                  >
                    <ChevronRight className="text-gray-900" size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tabs Navigation - En bas */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {subjectsContent.map((content) => (
                <button
                  key={content.id}
                  onClick={() => handleSubjectChange(content.id)}
                  className={`flex-1 min-w-[120px] px-6 py-4 font-medium transition-all relative ${
                    activeSubject === content.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {content.subject}
                  {activeSubject === content.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

