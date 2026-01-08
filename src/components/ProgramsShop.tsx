'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown,
  CheckCircle2,
  FileText,
  Video,
  ArrowRight,
  Volume2,
  VolumeX,
  Search
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
interface MasteryProgram {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  stats: {
    chapters: number;
    hours: number;
    tracks: number;
  };
  trendingTopics: string[];
  videoUrl?: string;
  posterUrl?: string;
  owned?: boolean;
}

interface ProgramsShopProps {
  ownedProgramIds?: string[];
  onPurchase?: (programIds: string[]) => void;
  onOpenProgram?: (programId: string) => void;
  hideHeader?: boolean;
}

// ============================================================================
// DATA - Mastery Programs
// ============================================================================
const MASTERY_PROGRAMS: MasteryProgram[] = [
  {
    id: 'physics',
    name: 'Physics Mastery',
    tagline: 'Maîtrise les lois de l\'univers',
    description: 'De la mécanique newtonienne à l\'électromagnétisme. Comprends enfin comment le monde fonctionne avec des cours structurés, des exercices guidés et des cas pratiques.',
    price: 599,
    originalPrice: 999,
    stats: { chapters: 47, hours: 60, tracks: 12 },
    trendingTopics: [
      'Les 3 Lois de Newton',
      'Énergie & Travail',
      'Loi d\'Ohm & Circuits',
      'Lois de Kirchhoff',
      'Entropie & 2ème Principe',
      'Ondes & Interférences',
      'Optique géométrique',
      'Mécanique des fluides'
    ],
    videoUrl: '/mentors/Zak-intro.mp4',
    posterUrl: '/mentors/zak.jpg'
  },
  {
    id: 'mathematics',
    name: 'Mathematics Mastery',
    tagline: 'Le langage de la science',
    description: 'Algèbre, analyse, probabilités. Développe une intuition mathématique solide avec une approche progressive et des exercices corrigés en détail.',
    price: 659,
    originalPrice: 1099,
    stats: { chapters: 63, hours: 80, tracks: 15 },
    trendingTopics: [
      'Algèbre linéaire',
      'Calcul différentiel',
      'Intégrales & Primitives',
      'Équations différentielles',
      'Probabilités',
      'Variables aléatoires',
      'Suites & Séries',
      'Nombres complexes'
    ],
    videoUrl: '/mentors/Zak-intro.mp4',
    posterUrl: '/mentors/zak.jpg'
  },
  {
    id: 'chemistry',
    name: 'Chemistry Mastery',
    tagline: 'La science de la matière',
    description: 'Structure atomique, réactions, chimie organique. Comprends la chimie en profondeur avec des visualisations claires et des exercices pratiques.',
    price: 479,
    originalPrice: 799,
    stats: { chapters: 52, hours: 45, tracks: 10 },
    trendingTopics: [
      'Structure atomique',
      'Liaisons chimiques',
      'Réactions d\'oxydoréduction',
      'Acides & Bases',
      'Chimie organique',
      'Cinétique chimique',
      'Thermochimie',
      'Électrochimie'
    ],
    videoUrl: '/mentors/Zak-intro.mp4',
    posterUrl: '/mentors/zak.jpg'
  },
  {
    id: 'biology',
    name: 'Biology Mastery',
    tagline: 'Comprends le vivant',
    description: 'Cellules, génétique, évolution. Explore les mécanismes de la vie avec une approche visuelle et des schémas explicatifs.',
    price: 479,
    originalPrice: 799,
    stats: { chapters: 45, hours: 50, tracks: 9 },
    trendingTopics: [
      'Biologie cellulaire',
      'Génétique & ADN',
      'Évolution',
      'Physiologie',
      'Biochimie',
      'Écologie',
      'Immunologie',
      'Neurobiologie'
    ],
    videoUrl: '/mentors/Zak-intro.mp4',
    posterUrl: '/mentors/zak.jpg'
  },
  {
    id: 'economics',
    name: 'Economics Mastery',
    tagline: 'Décode l\'économie',
    description: 'Micro, macro, finance. Comprends les mécanismes économiques modernes avec des cas pratiques et des analyses actuelles.',
    price: 359,
    originalPrice: 599,
    stats: { chapters: 38, hours: 40, tracks: 8 },
    trendingTopics: [
      'Microéconomie',
      'Macroéconomie',
      'Marchés financiers',
      'Politique monétaire',
      'Commerce international',
      'Économétrie',
      'Finance d\'entreprise',
      'Économie comportementale'
    ],
    videoUrl: '/mentors/Zak-intro.mp4',
    posterUrl: '/mentors/zak.jpg'
  },
  {
    id: 'accounting',
    name: 'Accounting Mastery',
    tagline: 'Maîtrise la comptabilité',
    description: 'Comptabilité générale, analytique et financière. Apprends à lire et construire des états financiers avec des exercices pratiques.',
    price: 399,
    originalPrice: 699,
    stats: { chapters: 42, hours: 55, tracks: 10 },
    trendingTopics: [
      'Comptabilité générale',
      'Bilan & Compte de résultat',
      'Écritures comptables',
      'TVA & Fiscalité',
      'Comptabilité analytique',
      'Analyse financière',
      'Normes IFRS',
      'Consolidation'
    ],
    videoUrl: '/mentors/Zak-intro.mp4',
    posterUrl: '/mentors/zak.jpg'
  },
  {
    id: 'statistics',
    name: 'Statistics Mastery',
    tagline: 'Analyse les données',
    description: 'Statistiques descriptives, inférentielles et tests d\'hypothèses. Maîtrise l\'analyse de données avec des applications concrètes.',
    price: 449,
    originalPrice: 749,
    stats: { chapters: 35, hours: 45, tracks: 9 },
    trendingTopics: [
      'Statistiques descriptives',
      'Lois de probabilité',
      'Tests d\'hypothèses',
      'Régression linéaire',
      'ANOVA',
      'Séries temporelles',
      'Statistiques non-paramétriques',
      'Analyse multivariée'
    ],
    videoUrl: '/mentors/Zak-intro.mp4',
    posterUrl: '/mentors/zak.jpg'
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function ProgramsShop({ 
  ownedProgramIds = [],
  onPurchase,
  onOpenProgram,
  hideHeader = false
}: ProgramsShopProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Mark owned programs
  const programsWithOwnership = MASTERY_PROGRAMS.map(p => ({
    ...p,
    owned: ownedProgramIds.includes(p.id)
  }));

  // Calculate global stats
  const totalChapters = programsWithOwnership.reduce((acc, p) => acc + p.stats.chapters, 0);
  const totalHours = programsWithOwnership.reduce((acc, p) => acc + p.stats.hours, 0);
  const totalTracks = programsWithOwnership.reduce((acc, p) => acc + p.stats.tracks, 0);

  // Trigger video play when section expands
  useEffect(() => {
    if (expandedIndex !== null) {
      const timer = setTimeout(() => {
        videoRef.current?.play().catch(() => {});
        mobileVideoRef.current?.play().catch(() => {});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [expandedIndex]);

  const handlePurchase = (programId: string) => {
    if (onPurchase) {
      onPurchase([programId]);
    } else {
      window.location.href = `/payment?programs=${programId}`;
    }
  };

  const handleOpenProgram = (programId: string) => {
    if (onOpenProgram) {
      onOpenProgram(programId);
    }
  };

  // Filter programs based on search
  const filteredPrograms = programsWithOwnership.filter(program => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      program.name.toLowerCase().includes(query) ||
      program.tagline.toLowerCase().includes(query) ||
      program.description.toLowerCase().includes(query) ||
      program.trendingTopics.some(topic => topic.toLowerCase().includes(query))
    );
  });

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Search Bar */}
      <div className="px-4 md:px-6 lg:px-8 py-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un programme, bundle, cours, leçon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]/20 focus:border-[#00c2ff] transition-all"
          />
        </div>
      </div>

      {/* Content - fills available height */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex flex-col px-4 md:px-6 lg:px-8">

        {/* ========== PROGRAMS ACCORDION ========== */}
        <div className="flex flex-col">
          {filteredPrograms.map((program, index) => {
            const isExpanded = expandedIndex === index;
            const number = (index + 1).toString().padStart(2, '0');
            const discount = Math.round((1 - program.price / program.originalPrice) * 100);

            return (
              <div key={program.id} className="border-b border-gray-200">
                {/* Collapsed State - hauteur fixe constante */}
                {!isExpanded && (
                  <button
                    onClick={() => setExpandedIndex(index)}
                    className="w-full py-7 flex items-center justify-between group text-left px-2"
                  >
                    <div className="flex items-center gap-4 md:gap-8">
                      <span className="text-xl md:text-2xl font-mono text-gray-300 transition-colors">
                        {number}
                      </span>
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold transition-colors text-gray-500 group-hover:text-gray-900">
                            {program.name}
                          </h3>
                          <p className="text-gray-400 text-sm">{program.tagline}</p>
                        </div>
                        {!program.owned && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">{program.originalPrice}€</span>
                            <span className="text-lg font-bold text-gray-900">{program.price}€</span>
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">-{discount}%</span>
                          </div>
                        )}
                        {program.owned && (
                          <span className="px-2 py-0.5 bg-[#00c2ff]/10 text-[#00c2ff] text-xs font-semibold rounded-full">
                            Débloqué
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border flex items-center justify-center transition-all border-gray-300 text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </button>
                )}

                {/* Expanded State */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      {/* Mobile Layout */}
                      <div className="md:hidden py-6">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                          {/* Header */}
                          <div className="flex items-center justify-between px-6 pt-6 pb-4">
                            <span className="text-xl font-mono text-gray-400">{number}</span>
                            <button
                              onClick={() => setExpandedIndex(null)}
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
                            >
                              <ChevronDown size={20} className="rotate-180" />
                            </button>
                          </div>
                          
                          <h3 className="text-3xl font-bold text-gray-900 px-6 mb-2">
                            {program.name}
                          </h3>
                          <p className="text-gray-600 leading-relaxed px-6 mb-6 text-lg">
                            {program.description}
                          </p>

                          {/* Video */}
                          {program.videoUrl && (
                            <div className="relative mx-4 rounded-2xl overflow-hidden aspect-video mb-6">
                              <video
                                ref={mobileVideoRef}
                                className="absolute inset-0 w-full h-full object-cover"
                                poster={program.posterUrl}
                                muted={isMuted}
                                loop
                                playsInline
                                autoPlay
                              >
                                <source src={program.videoUrl} type="video/mp4" />
                              </video>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              <div className="absolute bottom-4 left-4">
                                <p className="text-white text-xl font-bold">Zak</p>
                                <p className="text-white/70 text-sm">Fondateur de SMS</p>
                              </div>
                              <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="absolute bottom-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                              >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                              </button>
                            </div>
                          )}

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 px-6 mb-6">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full font-medium text-gray-700 text-sm">
                              <FileText size={14} /> {program.stats.chapters} Chapitres
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00c2ff] rounded-full font-medium text-white text-sm">
                              <Video size={14} /> {program.stats.hours}h Vidéo
                            </span>
                          </div>

                          {/* CTA */}
                          <div className="px-6 pb-6">
                            {program.owned ? (
                              <button
                                onClick={() => handleOpenProgram(program.id)}
                                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                              >
                                Ouvrir le programme
                                <ArrowRight size={18} />
                              </button>
                            ) : (
                              <div>
                                <div className="flex items-baseline gap-2 mb-3">
                                  <span className="text-3xl font-bold text-gray-900">{program.price}€</span>
                                  <span className="text-lg text-gray-400 line-through">{program.originalPrice}€</span>
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">-{discount}%</span>
                                </div>
                                <button
                                  onClick={() => handlePurchase(program.id)}
                                  className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                  Commencer maintenant
                                  <ArrowRight size={18} />
                                </button>
                                <p className="text-center text-sm text-gray-400 mt-3">
                                  Accès à vie • Mises à jour gratuites
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:flex min-h-[500px]">
                        {/* Left Column */}
                        <div className="flex-1 py-8 pr-8">
                          {/* Header */}
                          <button
                            onClick={() => setExpandedIndex(null)}
                            className="w-full flex items-center justify-between gap-6 md:gap-10 mb-8 group text-left"
                          >
                            <div className="flex items-start gap-6 md:gap-10">
                              <span className="text-2xl md:text-3xl font-mono text-gray-900">
                                {number}
                              </span>
                              <h3 className="text-2xl md:text-4xl font-bold text-gray-900">
                                {program.name}
                              </h3>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-all flex-shrink-0">
                              <ChevronDown size={20} className="rotate-180" />
                            </div>
                          </button>

                          {/* Badges + CTA */}
                          <div className="flex flex-wrap items-center gap-4 mb-6 pl-16 md:pl-20">
                            <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full font-medium text-gray-600 text-sm">
                              <FileText size={16} /> {program.stats.chapters} Chapitres
                            </span>
                            <span className="flex items-center gap-2 px-4 py-2 bg-[#00c2ff] rounded-full font-medium text-white text-sm">
                              <Video size={16} /> {program.stats.hours}h Vidéo
                            </span>
                            {program.owned ? (
                              <button
                                onClick={() => handleOpenProgram(program.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors text-sm"
                              >
                                Ouvrir le programme
                                <ArrowRight size={14} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePurchase(program.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors text-sm"
                              >
                                Commencer — {program.price}€
                                <ArrowRight size={14} />
                              </button>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-gray-700 leading-relaxed mb-8 pl-16 md:pl-20 text-lg">
                            {program.description}
                          </p>

                          {/* Trending Topics */}
                          <div className="pl-16 md:pl-20">
                            <h4 className="font-bold text-gray-500 uppercase tracking-widest mb-5 text-sm">
                              Sujets tendances
                            </h4>
                            <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                              {program.trendingTopics.map((topic, i) => (
                                <li key={i} className="flex items-center group/item">
                                  <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 group-hover/item:text-[#00c2ff] transition-colors" />
                                    <span className="text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors text-sm">
                                      {topic}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Price & Guarantees (Desktop) */}
                          {!program.owned && (
                            <div className="mt-8 pl-16 md:pl-20 pt-6 border-t border-gray-100">
                              <div className="flex items-center gap-4">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-3xl font-bold text-gray-900">{program.price}€</span>
                                  <span className="text-lg text-gray-400 line-through">{program.originalPrice}€</span>
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">-{discount}%</span>
                                </div>
                                <span className="text-sm text-gray-500">Accès à vie • Mises à jour gratuites</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column: Video */}
                        <div className="relative overflow-hidden bg-gray-900 w-[320px] flex-shrink-0">
                          <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            poster={program.posterUrl}
                            muted={isMuted}
                            loop
                            playsInline
                            autoPlay
                          >
                            <source src={program.videoUrl} type="video/mp4" />
                          </video>
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
                          >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                          </button>
                          {/* Overlay info */}
                          <div className="absolute bottom-4 left-4 z-10">
                            <p className="text-white text-xl font-bold">Zak</p>
                            <p className="text-white/70 text-sm">Fondateur de SMS</p>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        </div>
      </div>
    </div>
  );
}

export default ProgramsShop;
