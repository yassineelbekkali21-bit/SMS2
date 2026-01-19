'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';
import { ChevronDown, CheckCircle2, FileText, Video, ArrowRight, Volume2, VolumeX } from 'lucide-react';

export function CurriculumSectionMultilang() {
  const { t, language } = useLanguage();
  const { openDiagnostic } = useDiagnostic();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showAllSubjects, setShowAllSubjects] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Déclencher la lecture vidéo quand une section est étendue
  useEffect(() => {
    if (expandedIndex !== null) {
      // Petit délai pour laisser l'animation se terminer
      const timer = setTimeout(() => {
        videoRef.current?.play().catch(() => {});
        mobileVideoRef.current?.play().catch(() => {});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [expandedIndex]);

  const subjects = [
    {
      id: 'physics',
      key: 'curriculum.physics',
      stats: { subjects: 60, hours: 350 },
      price: 599,
      originalPrice: 998,
      topics: [
        'Mécanique du point', 'Cinématique', 'Dynamique newtonienne', 'Travail & Énergie',
        'Oscillations', 'Ondes mécaniques', 'Optique géométrique', 'Optique ondulatoire',
        'Électrostatique', 'Électrocinétique', 'Magnétostatique', 'Induction électromagnétique',
        'Thermodynamique', 'Transferts thermiques', 'Mécanique des fluides', 'Hydrostatique',
        'Physique quantique', 'Dualité onde-corpuscule', 'Atome de Bohr', 'Radioactivité',
        'Relativité restreinte', 'Astrophysique', 'Gravitation', 'Lois de Kepler',
        'Moment cinétique', 'Solide en rotation', 'Pendules', 'Ressorts',
        'Interférences', 'Diffraction', 'Polarisation', 'Effet Doppler',
        'Circuits RLC', 'Régime transitoire', 'Régime sinusoïdal', 'Filtres',
        'Champ électrique', 'Potentiel électrique', 'Condensateurs', 'Diélectriques',
        'Champ magnétique', 'Force de Laplace', 'Force de Lorentz', 'Solénoïdes',
        'Premier principe', 'Second principe', 'Machines thermiques', 'Entropie',
        'Équation de Bernoulli', 'Viscosité', 'Écoulements', 'Tension superficielle',
        'Fonction d\'onde', 'Équation de Schrödinger', 'Effet tunnel', 'Spin',
        'Fission nucléaire', 'Fusion nucléaire', 'Décroissance radioactive', 'Dosimétrie'
      ]
    },
    {
      id: 'math',
      key: 'curriculum.math',
      stats: { subjects: 60, hours: 350 },
      price: 659,
      originalPrice: 1098,
      topics: [
        'Suites numériques', 'Limites de suites', 'Suites récurrentes', 'Séries numériques',
        'Fonctions continues', 'Dérivabilité', 'Théorème des accroissements finis', 'Fonctions usuelles',
        'Intégration', 'Primitives', 'Intégrales généralisées', 'Calcul d\'aires',
        'Équations différentielles', 'EDO linéaires', 'EDO non linéaires', 'Systèmes différentiels',
        'Algèbre linéaire', 'Espaces vectoriels', 'Applications linéaires', 'Matrices',
        'Réduction des endomorphismes', 'Diagonalisation', 'Trigonalisation', 'Valeurs propres',
        'Géométrie analytique', 'Droites et plans', 'Coniques', 'Quadriques',
        'Nombres complexes', 'Forme trigonométrique', 'Racines n-ièmes', 'Exponentielle complexe',
        'Polynômes', 'Fractions rationnelles', 'Décomposition en éléments simples', 'Racines',
        'Développements limités', 'Taylor', 'Asymptotes', 'Équivalents',
        'Probabilités', 'Variables aléatoires', 'Lois usuelles', 'Espérance et variance',
        'Statistiques', 'Estimation', 'Tests d\'hypothèses', 'Intervalles de confiance',
        'Calcul matriciel', 'Déterminants', 'Systèmes linéaires', 'Méthode de Gauss',
        'Produit scalaire', 'Produit vectoriel', 'Orthogonalité', 'Projections',
        'Topologie', 'Compacité', 'Connexité', 'Complétude'
      ]
    },
    {
      id: 'chem',
      key: 'curriculum.chem',
      stats: { subjects: 60, hours: 350 },
      price: 479,
      originalPrice: 798,
      topics: [
        'Structure atomique', 'Configuration électronique', 'Tableau périodique', 'Propriétés périodiques',
        'Liaisons chimiques', 'Liaison covalente', 'Liaison ionique', 'Liaison métallique',
        'Géométrie moléculaire', 'VSEPR', 'Hybridation', 'Orbitales moléculaires',
        'Thermochimie', 'Enthalpie', 'Entropie', 'Énergie libre de Gibbs',
        'Cinétique chimique', 'Vitesse de réaction', 'Ordre de réaction', 'Catalyse',
        'Équilibres chimiques', 'Constante d\'équilibre', 'Principe de Le Chatelier', 'Quotient réactionnel',
        'Acides et bases', 'pH', 'Tampons', 'Titrages acido-basiques',
        'Oxydo-réduction', 'Potentiels standard', 'Piles électrochimiques', 'Électrolyse',
        'Chimie organique', 'Nomenclature', 'Groupes fonctionnels', 'Isomérie',
        'Réactions organiques', 'Substitution', 'Addition', 'Élimination',
        'Stéréochimie', 'Chiralité', 'Énantiomérie', 'Diastéréoisomérie',
        'Spectroscopie', 'RMN', 'IR', 'Spectrométrie de masse',
        'Chimie des solutions', 'Solubilité', 'Précipitation', 'Complexation',
        'Chimie nucléaire', 'Radioactivité', 'Fission', 'Fusion',
        'Chimie verte', 'Développement durable', 'Catalyse verte', 'Biomasse'
      ]
    },
    {
      id: 'stats',
      key: 'curriculum.stats',
      stats: { subjects: 60, hours: 350 },
      price: 449,
      originalPrice: 748,
      topics: [
        'Statistiques descriptives', 'Moyenne', 'Médiane', 'Écart-type',
        'Représentations graphiques', 'Histogrammes', 'Boîtes à moustaches', 'Diagrammes',
        'Probabilités', 'Événements', 'Probabilités conditionnelles', 'Indépendance',
        'Variables aléatoires discrètes', 'Loi binomiale', 'Loi de Poisson', 'Loi géométrique',
        'Variables aléatoires continues', 'Loi normale', 'Loi exponentielle', 'Loi uniforme',
        'Estimation', 'Estimateurs', 'Biais', 'Convergence',
        'Intervalles de confiance', 'Pour la moyenne', 'Pour la proportion', 'Pour la variance',
        'Tests d\'hypothèses', 'Test de Student', 'Test du Chi-deux', 'Test de Fisher',
        'Régression linéaire', 'Moindres carrés', 'Corrélation', 'Coefficient R²',
        'ANOVA', 'Analyse de variance', 'Comparaisons multiples', 'Tests post-hoc',
        'Séries temporelles', 'Tendance', 'Saisonnalité', 'Prévision',
        'Statistiques non paramétriques', 'Test de Wilcoxon', 'Test de Mann-Whitney', 'Test de Kruskal-Wallis',
        'Échantillonnage', 'Méthodes d\'échantillonnage', 'Taille d\'échantillon', 'Erreur d\'échantillonnage',
        'Analyse multivariée', 'ACP', 'AFC', 'Classification',
        'Statistiques bayésiennes', 'Théorème de Bayes', 'Prior et posterior', 'Inférence bayésienne'
      ]
    }
  ];

  return (
    <section id="curriculum" className="py-20 md:py-28 px-6 bg-white border-b border-gray-100 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <h2 
              className="font-title text-4xl mb-4 tracking-wide"
              style={{ fontSize: 'clamp(2rem, 8vw, 64px)' }}
            >
              {t('curriculum.title')}<br /><span>{t('curriculum.title.highlight')}</span>
            </h2>
          </div>

          <div className="flex gap-8 md:gap-12 border-t lg:border-t-0 border-gray-200 pt-6 lg:pt-0 mt-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">200+</p>
              <p className="font-bold tracking-widest text-gray-500 uppercase" style={{ fontSize: '14px' }}>{t('curriculum.stats.classes')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">2400+</p>
              <p className="font-bold tracking-widest text-gray-500 uppercase" style={{ fontSize: '14px' }}>{t('curriculum.stats.students')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="font-bold tracking-widest text-gray-500 uppercase" style={{ fontSize: '14px' }}>{t('curriculum.stats.resources')}</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="border-t border-gray-200">
          {subjects.map((subject, index) => {
            const isExpanded = expandedIndex === index;
            const number = (index + 1).toString().padStart(2, '0');

            return (
              <div key={subject.id} className="border-b border-gray-200">
                {/* Collapsed State */}
                {!isExpanded && (
                <button
                    onClick={() => setExpandedIndex(index)}
                  className="w-full py-8 flex items-start md:items-center justify-between group text-left"
                >
                  <div className="flex items-start gap-6 md:gap-10">
                      <span className="text-2xl md:text-3xl font-mono text-gray-300 transition-colors">
                      {number}
                    </span>
                      <h3 className="text-2xl md:text-4xl font-bold transition-colors text-gray-500 group-hover:text-gray-900">
                      {t(`${subject.key}.title`)}
                    </h3>
                  </div>
                    <div className="w-10 h-10 rounded-full border flex items-center justify-center transition-all border-gray-300 text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900">
                    <ChevronDown size={20} />
                  </div>
                </button>
                )}

                {/* Expanded State - Full Layout with Video */}
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
                          {/* Header with number, title, price and close button */}
                          <div className="flex items-start justify-between px-6 pt-6 pb-4">
                            <div className="flex items-start gap-4">
                              <span className="text-xl font-mono text-gray-400">
                                {number}
                              </span>
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                  {t(`${subject.key}.title`)}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-base text-gray-400 line-through">{subject.originalPrice}€</span>
                                  <span className="text-2xl font-bold text-gray-900">{subject.price}€</span>
                                  <span className="text-gray-500" style={{ fontSize: '12px' }}>{language === 'fr' ? 'accès à vie' : 'lifetime access'}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setExpandedIndex(null)}
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0"
                            >
                              <ChevronDown size={20} className="rotate-180" />
                            </button>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed px-6 mb-6" style={{ fontSize: '16px' }}>
                            {t(`${subject.key}.desc`)}
                          </p>

                          {/* Video/Image with Instructor Overlay */}
                          <div className="relative mx-4 rounded-2xl overflow-hidden aspect-[4/3] mb-6">
                            <video
                              ref={mobileVideoRef}
                              className="absolute inset-0 w-full h-full object-cover"
                              poster="/mentors/zak.jpg"
                              muted={isMuted}
                              loop
                              playsInline
                              autoPlay
                            >
                              <source src="/mentors/Zak-intro.mp4" type="video/mp4" />
                            </video>
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            {/* Instructor name */}
                            <div className="absolute bottom-4 left-4">
                              <p className="text-white text-xl font-bold">Zak</p>
                              <p className="text-white/70 text-sm">{language === 'fr' ? 'Fondateur de SMS' : 'Founder of SMS'}</p>
                            </div>
                            {/* Mute button */}
                            <button
                              onClick={() => setIsMuted(!isMuted)}
                              className="absolute bottom-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 px-6 mb-6">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full font-medium text-gray-700" style={{ fontSize: '14px' }}>
                                <FileText size={14} /> {subject.stats.subjects} Sujets
                              </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 rounded-full font-medium text-white" style={{ fontSize: '14px' }}>
                                <Video size={14} /> {subject.stats.hours}h Video
                              </span>
                          </div>

                          {/* Topics - 2 columns on mobile */}
                          <div className="px-6 pb-6">
                            <h4 className="font-bold text-gray-500 uppercase tracking-widest mb-4" style={{ fontSize: '14px' }}>
                              {language === 'fr' ? 'Sujets couverts' : 'Topics Covered'}
                            </h4>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                              {(showAllSubjects[subject.id] ? subject.topics : subject.topics.slice(0, 8)).map((topic, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3 h-3 text-[#00c2ff] flex-shrink-0 mt-1" />
                                  <span className="text-gray-700" style={{ fontSize: '13px' }}>
                                    {topic}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            {/* Voir plus button */}
                            {subject.topics.length > 8 && (
                              <button
                                onClick={() => setShowAllSubjects(prev => ({ ...prev, [subject.id]: !prev[subject.id] }))}
                                className="mt-4 flex items-center gap-2 text-[#00c2ff] font-semibold"
                                style={{ fontSize: '14px' }}
                              >
                                {showAllSubjects[subject.id] 
                                  ? (language === 'fr' ? 'Voir moins' : 'See less')
                                  : (language === 'fr' ? `Voir les ${subject.topics.length} sujets` : `See all ${subject.topics.length} topics`)
                                }
                                <ChevronDown size={16} className={`transition-transform ${showAllSubjects[subject.id] ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                        </div>
                            </div>
                            
                      {/* Desktop Layout */}
                      <div className="hidden md:flex min-h-[500px]">
                        {/* Left Column: Header + Content */}
                        <div className="flex-1 py-8 pr-8">
                          {/* Header with Price */}
                          <div className="flex items-center justify-between mb-8">
                            <button
                              onClick={() => setExpandedIndex(null)}
                              className="flex items-start gap-6 md:gap-10 group text-left"
                            >
                              <span className="text-2xl md:text-3xl font-mono text-gray-900">
                                {number}
                              </span>
                              <h3 className="text-2xl md:text-4xl font-bold text-gray-900">
                                {t(`${subject.key}.title`)}
                              </h3>
                            </button>
                            {/* Price on the right */}
                            <div className="flex items-baseline gap-3">
                              <span className="text-xl text-gray-400 line-through">{subject.originalPrice}€</span>
                              <span className="text-3xl font-bold text-gray-900">{subject.price}€</span>
                              <span className="text-gray-500" style={{ fontSize: '14px' }}>{language === 'fr' ? 'accès à vie' : 'lifetime access'}</span>
                            </div>
                          </div>

                          {/* Badges + Test Button */}
                          <div className="flex flex-wrap items-center gap-4 mb-6 pl-16 md:pl-20">
                            <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full font-medium text-gray-600" style={{ fontSize: '14px' }}>
                              <FileText size={16} /> {subject.stats.subjects} Sujets
                            </span>
                            <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full font-medium text-white" style={{ fontSize: '14px' }}>
                              <Video size={16} /> {subject.stats.hours}h Video
                            </span>
                            <Link
                              href={`/assessment/${subject.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                              style={{ fontSize: '14px' }}
                            >
                              {language === 'fr' ? 'Tester mes connaissances' : 'Test my knowledge'}
                              <ArrowRight size={14} />
                            </Link>
                          </div>

                          {/* Description */}
                          <p className="text-gray-700 leading-relaxed mb-8 pl-16 md:pl-20" style={{ fontSize: '18px' }}>
                            {t(`${subject.key}.desc`)}
                          </p>

                          {/* Trending Topics - 3 columns */}
                          <div className="pl-16 md:pl-20">
                            <h4 className="font-bold text-gray-500 uppercase tracking-widest mb-5" style={{ fontSize: '16px' }}>
                              {language === 'fr' ? 'Sujets couverts' : 'Topics Covered'}
                            </h4>
                            <ul className="grid grid-cols-3 gap-x-6 gap-y-3">
                              {(showAllSubjects[subject.id] ? subject.topics : subject.topics.slice(0, 12)).map((topic, i) => (
                                <li key={i} className="flex items-center group/item">
                                  <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 group-hover/item:text-[#00c2ff] transition-colors" />
                                    <span className="text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors" style={{ fontSize: '14px' }}>
                                      {topic}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            {/* Voir plus button */}
                            {subject.topics.length > 12 && (
                              <button
                                onClick={() => setShowAllSubjects(prev => ({ ...prev, [subject.id]: !prev[subject.id] }))}
                                className="mt-6 flex items-center gap-2 text-[#00c2ff] font-semibold hover:text-[#00a8e0] transition-colors"
                                style={{ fontSize: '16px' }}
                              >
                                {showAllSubjects[subject.id] 
                                  ? (language === 'fr' ? 'Voir moins' : 'See less')
                                  : (language === 'fr' ? `Voir les ${subject.topics.length} sujets` : `See all ${subject.topics.length} topics`)
                                }
                                <ChevronDown size={18} className={`transition-transform ${showAllSubjects[subject.id] ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                          </div>

                        {/* Right Column: Video - Full Height from Top to Bottom */}
                        <div className="relative overflow-hidden bg-gray-900 w-[320px] flex-shrink-0">
                          <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            poster="/mentors/zak.jpg"
                            muted={isMuted}
                            loop
                            playsInline
                            autoPlay
                          >
                            <source src="/mentors/Zak-intro.mp4" type="video/mp4" />
                          </video>
                          {/* Mute/Unmute button */}
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
                          >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16">
          <button
            onClick={openDiagnostic}
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
            style={{ fontSize: '18px' }}
          >
            {language === 'fr' ? 'Commencer par le diagnostic' : 'Start with the diagnostic'}
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}

