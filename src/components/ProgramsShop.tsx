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
  Search,
  Check,
  Sparkles
} from 'lucide-react';
import { Course } from '@/types';
import { MasteryBoostersModal } from './MasteryBoostersModal';

// ============================================================================
// TYPES
// ============================================================================
interface LearningTrack {
  id: string;
  name: string;
  topics: string[];
}

interface Bundle {
  id: string;
  name: string;
  tracks: LearningTrack[];
}

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
  trendingTopics: string[]; // Keep for backward compatibility
  bundles?: Bundle[]; // New structure: bundles → tracks → topics
  videoUrl?: string;
  posterUrl?: string;
  owned?: boolean;
}

interface ProgramsShopProps {
  ownedProgramIds?: string[];
  onPurchase?: (programIds: string[]) => void;
  onOpenProgram?: (programId: string) => void;
  hideHeader?: boolean;
  onOpenCourse?: (course: Course) => void;
  allCourses?: Course[];
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
      'Les 3 Lois de Newton', 'Cinématique', 'Dynamique du point', 'Référentiels', 'Forces de frottement',
      'Énergie cinétique', 'Énergie potentielle', 'Travail d\'une force', 'Puissance mécanique', 'Conservation de l\'énergie',
      'Quantité de mouvement', 'Chocs élastiques', 'Chocs inélastiques', 'Centre de masse', 'Moment cinétique',
      'Rotation des solides', 'Moment d\'inertie', 'Théorème de Huygens', 'Roulement sans glissement', 'Précession',
      'Oscillations libres', 'Oscillations amorties', 'Oscillations forcées', 'Résonance', 'Pendule simple',
      'Ondes mécaniques', 'Ondes sonores', 'Effet Doppler', 'Interférences', 'Diffraction',
      'Loi de Coulomb', 'Champ électrique', 'Potentiel électrique', 'Théorème de Gauss', 'Condensateurs',
      'Loi d\'Ohm', 'Lois de Kirchhoff', 'Circuits RC', 'Circuits RL', 'Circuits RLC',
      'Champ magnétique', 'Force de Lorentz', 'Loi de Biot-Savart', 'Théorème d\'Ampère', 'Induction électromagnétique',
      'Loi de Faraday', 'Loi de Lenz', 'Auto-induction', 'Transformateurs', 'Ondes électromagnétiques',
      'Optique géométrique', 'Lentilles minces', 'Miroirs', 'Instruments d\'optique', 'Optique ondulatoire',
      'Thermodynamique', 'Premier principe', 'Deuxième principe', 'Entropie', 'Machines thermiques'
    ],
    bundles: [
      {
        id: 'mecanique',
        name: 'Mécanique',
        tracks: [
          { id: 'meca-cinematique', name: 'Cinématique', topics: [] },
          { id: 'meca-dynamique', name: 'Dynamique du point', topics: [] },
          { id: 'meca-newton', name: 'Lois de Newton', topics: [] },
          { id: 'meca-energie', name: 'Énergie et travail', topics: [] },
          { id: 'meca-momentum', name: 'Quantité de mouvement', topics: [] },
          { id: 'meca-rotation', name: 'Rotation des solides', topics: [] },
          { id: 'meca-oscillations', name: 'Oscillations', topics: [] },
          { id: 'meca-ondes', name: 'Ondes mécaniques', topics: [] },
          { id: 'meca-fluides', name: 'Mécanique des fluides', topics: [] },
          { id: 'meca-relativite', name: 'Relativité restreinte', topics: [] }
        ]
      },
      {
        id: 'electromagnetisme',
        name: 'Électromagnétisme',
        tracks: [
          { id: 'elec-electrostatique', name: 'Électrostatique', topics: [] },
          { id: 'elec-champ', name: 'Champs électriques', topics: [] },
          { id: 'elec-potentiel', name: 'Potentiel électrique', topics: [] },
          { id: 'elec-condensateurs', name: 'Condensateurs', topics: [] },
          { id: 'elec-courant', name: 'Courant électrique', topics: [] },
          { id: 'elec-circuits', name: 'Circuits électriques', topics: [] },
          { id: 'elec-magnetostatique', name: 'Magnétostatique', topics: [] },
          { id: 'elec-induction', name: 'Induction électromagnétique', topics: [] },
          { id: 'elec-ondes-em', name: 'Ondes électromagnétiques', topics: [] },
          { id: 'elec-optoelectronique', name: 'Optoélectronique', topics: [] }
        ]
      },
      {
        id: 'optique',
        name: 'Optique',
        tracks: [
          { id: 'opt-geometrique', name: 'Optique géométrique', topics: [] },
          { id: 'opt-lentilles', name: 'Lentilles et miroirs', topics: [] },
          { id: 'opt-ondulatoire', name: 'Optique ondulatoire', topics: [] },
          { id: 'opt-interferences', name: 'Interférences', topics: [] },
          { id: 'opt-diffraction', name: 'Diffraction', topics: [] },
          { id: 'opt-polarisation', name: 'Polarisation', topics: [] }
        ]
      },
      {
        id: 'thermodynamique',
        name: 'Thermodynamique',
        tracks: [
          { id: 'thermo-principes', name: 'Principes fondamentaux', topics: [] },
          { id: 'thermo-gaz', name: 'Gaz parfaits', topics: [] },
          { id: 'thermo-cycles', name: 'Cycles thermodynamiques', topics: [] },
          { id: 'thermo-entropie', name: 'Entropie', topics: [] },
          { id: 'thermo-machines', name: 'Machines thermiques', topics: [] },
          { id: 'thermo-phases', name: 'Changements de phase', topics: [] }
        ]
      },
      {
        id: 'quantique',
        name: 'Physique quantique',
        tracks: [
          { id: 'quant-fondamentaux', name: 'Fondamentaux', topics: [] },
          { id: 'quant-atome', name: 'Atome de Bohr', topics: [] },
          { id: 'quant-mecanique', name: 'Mécanique quantique', topics: [] },
          { id: 'quant-nucleaire', name: 'Physique nucléaire', topics: [] },
          { id: 'quant-particules', name: 'Physique des particules', topics: [] }
        ]
      },
      {
        id: 'physique-moderne',
        name: 'Physique moderne',
        tracks: [
          { id: 'mod-physique-solide', name: 'Physique du solide', topics: [] },
          { id: 'mod-semi', name: 'Semi-conducteurs', topics: [] },
          { id: 'mod-supra', name: 'Supraconductivité', topics: [] },
          { id: 'mod-laser', name: 'Lasers et optique', topics: [] },
          { id: 'mod-cosmologie', name: 'Cosmologie', topics: [] },
          { id: 'mod-astro', name: 'Astrophysique', topics: [] },
          { id: 'mod-ondes-gravitationnelles', name: 'Ondes gravitationnelles', topics: [] },
          { id: 'mod-matieres-condensees', name: 'Matières condensées', topics: [] },
          { id: 'mod-physique-nucleaire', name: 'Physique nucléaire avancée', topics: [] },
          { id: 'mod-physique-atomique', name: 'Physique atomique', topics: [] },
          { id: 'mod-physique-moléculaire', name: 'Physique moléculaire', topics: [] },
          { id: 'mod-nanotechnologie', name: 'Nanotechnologie', topics: [] },
          { id: 'mod-physique-médicale', name: 'Physique médicale', topics: [] },
          { id: 'mod-physique-environnementale', name: 'Physique environnementale', topics: [] },
          { id: 'mod-physique-calcul', name: 'Physique computationnelle', topics: [] },
          { id: 'mod-physique-experimentale', name: 'Physique expérimentale', topics: [] },
          { id: 'mod-theorie-champs', name: 'Théorie quantique des champs', topics: [] }
        ]
      }
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
      'Systèmes linéaires', 'Matrices', 'Déterminants', 'Espaces vectoriels', 'Applications linéaires',
      'Valeurs propres', 'Vecteurs propres', 'Diagonalisation', 'Réduction de Jordan', 'Formes quadratiques',
      'Limites de fonctions', 'Continuité', 'Dérivées', 'Théorème de Rolle', 'Théorème des accroissements finis',
      'Développements limités', 'Formule de Taylor', 'Études de fonctions', 'Courbes paramétriques', 'Courbes polaires',
      'Primitives', 'Intégration par parties', 'Changement de variable', 'Fractions rationnelles', 'Intégrales impropres',
      'Équations différentielles linéaires', 'Équations à variables séparables', 'Équations de Bernoulli', 'Systèmes différentiels', 'Laplace',
      'Suites numériques', 'Convergence', 'Suites récurrentes', 'Séries numériques', 'Séries entières',
      'Séries de Fourier', 'Transformée de Fourier', 'Convergence uniforme', 'Séries de fonctions', 'Intégrales à paramètres',
      'Nombres complexes', 'Forme exponentielle', 'Racines n-ièmes', 'Polynômes', 'Fractions rationnelles',
      'Probabilités discrètes', 'Probabilités continues', 'Variables aléatoires', 'Espérance', 'Variance',
      'Loi binomiale', 'Loi de Poisson', 'Loi normale', 'Théorème central limite', 'Loi des grands nombres',
      'Fonctions de plusieurs variables', 'Dérivées partielles', 'Gradient', 'Extrema', 'Intégrales multiples'
    ],
    bundles: [
      {
        id: 'algebre-lineaire',
        name: 'Algèbre linéaire',
        tracks: [
          { id: 'alg-systemes', name: 'Systèmes linéaires', topics: [] },
          { id: 'alg-matrices', name: 'Matrices et déterminants', topics: [] },
          { id: 'alg-espaces', name: 'Espaces vectoriels', topics: [] },
          { id: 'alg-applications', name: 'Applications linéaires', topics: [] },
          { id: 'alg-valeurs', name: 'Valeurs et vecteurs propres', topics: [] },
          { id: 'alg-diagonalisation', name: 'Diagonalisation', topics: [] },
          { id: 'alg-jordan', name: 'Réduction de Jordan', topics: [] },
          { id: 'alg-formes', name: 'Formes quadratiques', topics: [] },
          { id: 'alg-produit', name: 'Produits scalaires', topics: [] },
          { id: 'alg-normes', name: 'Normes et distances', topics: [] }
        ]
      },
      {
        id: 'analyse',
        name: 'Analyse',
        tracks: [
          { id: 'ana-limites', name: 'Limites et continuité', topics: [] },
          { id: 'ana-derivees', name: 'Dérivées', topics: [] },
          { id: 'ana-theoremes', name: 'Théorèmes fondamentaux', topics: [] },
          { id: 'ana-developpements', name: 'Développements limités', topics: [] },
          { id: 'ana-fonctions', name: 'Études de fonctions', topics: [] },
          { id: 'ana-courbes', name: 'Courbes paramétriques et polaires', topics: [] },
          { id: 'ana-primitives', name: 'Primitives', topics: [] },
          { id: 'ana-integration', name: 'Intégration', topics: [] },
          { id: 'ana-impropres', name: 'Intégrales impropres', topics: [] },
          { id: 'ana-suites', name: 'Suites numériques', topics: [] },
          { id: 'ana-series', name: 'Séries numériques', topics: [] },
          { id: 'ana-fourier', name: 'Séries et transformée de Fourier', topics: [] }
        ]
      },
      {
        id: 'equations-differentielles',
        name: 'Équations différentielles',
        tracks: [
          { id: 'diff-lineaires', name: 'Équations linéaires', topics: [] },
          { id: 'diff-variables', name: 'Variables séparables', topics: [] },
          { id: 'diff-bernoulli', name: 'Équations de Bernoulli', topics: [] },
          { id: 'diff-systemes', name: 'Systèmes différentiels', topics: [] },
          { id: 'diff-laplace', name: 'Transformée de Laplace', topics: [] },
          { id: 'diff-partielles', name: 'Équations aux dérivées partielles', topics: [] }
        ]
      },
      {
        id: 'nombres-complexes',
        name: 'Nombres complexes',
        tracks: [
          { id: 'comp-fondamentaux', name: 'Fondamentaux', topics: [] },
          { id: 'comp-forme', name: 'Forme exponentielle', topics: [] },
          { id: 'comp-racines', name: 'Racines n-ièmes', topics: [] },
          { id: 'comp-polynomes', name: 'Polynômes et fractions rationnelles', topics: [] }
        ]
      },
      {
        id: 'probabilites-statistiques',
        name: 'Probabilités et statistiques',
        tracks: [
          { id: 'prob-discretes', name: 'Probabilités discrètes', topics: [] },
          { id: 'prob-continues', name: 'Probabilités continues', topics: [] },
          { id: 'prob-variables', name: 'Variables aléatoires', topics: [] },
          { id: 'prob-moments', name: 'Espérance et variance', topics: [] },
          { id: 'prob-lois', name: 'Lois de probabilité', topics: [] },
          { id: 'prob-theoremes', name: 'Théorèmes limites', topics: [] },
          { id: 'prob-estimation', name: 'Estimation', topics: [] },
          { id: 'prob-tests', name: 'Tests d\'hypothèses', topics: [] }
        ]
      },
      {
        id: 'analyse-multivariee',
        name: 'Analyse multivariée',
        tracks: [
          { id: 'multi-fonctions', name: 'Fonctions de plusieurs variables', topics: [] },
          { id: 'multi-derivees', name: 'Dérivées partielles', topics: [] },
          { id: 'multi-gradient', name: 'Gradient et extrema', topics: [] },
          { id: 'multi-integrales', name: 'Intégrales multiples', topics: [] },
          { id: 'multi-changement', name: 'Changement de variables', topics: [] },
          { id: 'multi-coordonnees', name: 'Coordonnées curvilignes', topics: [] },
          { id: 'multi-integrales-surface', name: 'Intégrales de surface', topics: [] },
          { id: 'multi-theoremes', name: 'Théorèmes de Green et Stokes', topics: [] },
          { id: 'multi-formes-differentielles', name: 'Formes différentielles', topics: [] },
          { id: 'multi-optimisation', name: 'Optimisation multivariée', topics: [] },
          { id: 'multi-jacobien', name: 'Jacobien et transformations', topics: [] },
          { id: 'multi-taylor-multi', name: 'Formule de Taylor multivariée', topics: [] },
          { id: 'multi-extrema-contraintes', name: 'Extrema sous contraintes', topics: [] },
          { id: 'multi-multiplicateurs', name: 'Multiplicateurs de Lagrange', topics: [] },
          { id: 'multi-analyse-tensorielle', name: 'Analyse tensorielle', topics: [] }
        ]
      }
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
      'Structure de l\'atome', 'Modèle quantique', 'Configuration électronique', 'Tableau périodique', 'Propriétés périodiques',
      'Liaison covalente', 'Liaison ionique', 'Liaison métallique', 'Géométrie moléculaire', 'Théorie VSEPR',
      'Hybridation', 'Orbitales moléculaires', 'Résonance', 'Polarité', 'Forces intermoléculaires',
      'Nomenclature', 'Alcanes', 'Alcènes', 'Alcynes', 'Aromatiques',
      'Alcools', 'Éthers', 'Aldéhydes', 'Cétones', 'Acides carboxyliques',
      'Esters', 'Amines', 'Amides', 'Halogénoalcanes', 'Composés soufrés',
      'Réactions SN1', 'Réactions SN2', 'Éliminations E1', 'Éliminations E2', 'Additions électrophiles',
      'Oxydoréduction', 'Nombre d\'oxydation', 'Équilibrage redox', 'Piles électrochimiques', 'Électrolyse',
      'Acides et bases', 'pH', 'pKa', 'Tampons', 'Titrages acido-basiques',
      'Cinétique chimique', 'Ordre de réaction', 'Énergie d\'activation', 'Catalyse', 'Mécanismes réactionnels',
      'Thermochimie', 'Enthalpie', 'Entropie', 'Énergie libre de Gibbs', 'Équilibres chimiques',
      'Stéréochimie', 'Chiralité', 'Énantiomères', 'Diastéréoisomères', 'Configuration R/S'
    ],
    bundles: [
      {
        id: 'structure-atomique',
        name: 'Structure atomique',
        tracks: [
          { id: 'atom-structure', name: 'Structure de l\'atome', topics: [] },
          { id: 'atom-quantique', name: 'Modèle quantique', topics: [] },
          { id: 'atom-configuration', name: 'Configuration électronique', topics: [] },
          { id: 'atom-tableau', name: 'Tableau périodique', topics: [] },
          { id: 'atom-proprietes', name: 'Propriétés périodiques', topics: [] },
          { id: 'atom-ionisation', name: 'Énergie d\'ionisation', topics: [] },
          { id: 'atom-electron', name: 'Affinité électronique', topics: [] },
          { id: 'atom-rayon', name: 'Rayon atomique', topics: [] }
        ]
      },
      {
        id: 'liaisons',
        name: 'Liaisons chimiques',
        tracks: [
          { id: 'liaison-covalente', name: 'Liaison covalente', topics: [] },
          { id: 'liaison-ionique', name: 'Liaison ionique', topics: [] },
          { id: 'liaison-metallique', name: 'Liaison métallique', topics: [] },
          { id: 'liaison-geometrie', name: 'Géométrie moléculaire', topics: [] },
          { id: 'liaison-vsepr', name: 'Théorie VSEPR', topics: [] },
          { id: 'liaison-hybridation', name: 'Hybridation', topics: [] },
          { id: 'liaison-orbitales', name: 'Orbitales moléculaires', topics: [] },
          { id: 'liaison-resonance', name: 'Résonance', topics: [] },
          { id: 'liaison-polarite', name: 'Polarité', topics: [] },
          { id: 'liaison-forces', name: 'Forces intermoléculaires', topics: [] }
        ]
      },
      {
        id: 'chimie-organique',
        name: 'Chimie organique',
        tracks: [
          { id: 'org-nomenclature', name: 'Nomenclature', topics: [] },
          { id: 'org-alcanes', name: 'Alcanes', topics: [] },
          { id: 'org-alcenes', name: 'Alcènes', topics: [] },
          { id: 'org-alcynes', name: 'Alcynes', topics: [] },
          { id: 'org-aromatiques', name: 'Aromatiques', topics: [] },
          { id: 'org-alcools', name: 'Alcools et éthers', topics: [] },
          { id: 'org-carbonyle', name: 'Composés carbonyle', topics: [] },
          { id: 'org-acides', name: 'Acides carboxyliques', topics: [] },
          { id: 'org-esters', name: 'Esters et amides', topics: [] },
          { id: 'org-amines', name: 'Amines', topics: [] },
          { id: 'org-halogenes', name: 'Halogénoalcanes', topics: [] },
          { id: 'org-soufre', name: 'Composés soufrés', topics: [] }
        ]
      },
      {
        id: 'reactions-organiques',
        name: 'Réactions organiques',
        tracks: [
          { id: 'react-sn1', name: 'Réactions SN1', topics: [] },
          { id: 'react-sn2', name: 'Réactions SN2', topics: [] },
          { id: 'react-e1', name: 'Éliminations E1', topics: [] },
          { id: 'react-e2', name: 'Éliminations E2', topics: [] },
          { id: 'react-additions', name: 'Additions électrophiles', topics: [] },
          { id: 'react-substitutions', name: 'Substitutions aromatiques', topics: [] },
          { id: 'react-eliminations', name: 'Éliminations', topics: [] },
          { id: 'react-oxydations', name: 'Oxydations et réductions', topics: [] }
        ]
      },
      {
        id: 'thermodynamique-chimie',
        name: 'Thermodynamique chimique',
        tracks: [
          { id: 'thermo-thermochimie', name: 'Thermochimie', topics: [] },
          { id: 'thermo-enthalpie', name: 'Enthalpie', topics: [] },
          { id: 'thermo-entropie', name: 'Entropie', topics: [] },
          { id: 'thermo-gibbs', name: 'Énergie libre de Gibbs', topics: [] },
          { id: 'thermo-equilibres', name: 'Équilibres chimiques', topics: [] },
          { id: 'thermo-principe', name: 'Principe de Le Chatelier', topics: [] }
        ]
      },
      {
        id: 'acido-basique',
        name: 'Acides et bases',
        tracks: [
          { id: 'acide-definitions', name: 'Définitions', topics: [] },
          { id: 'acide-ph', name: 'pH et pKa', topics: [] },
          { id: 'acide-tampons', name: 'Tampons', topics: [] },
          { id: 'acide-titrages', name: 'Titrages acido-basiques', topics: [] },
          { id: 'acide-indicateurs', name: 'Indicateurs', topics: [] }
        ]
      },
      {
        id: 'electrochimie',
        name: 'Électrochimie',
        tracks: [
          { id: 'electro-oxydo', name: 'Oxydoréduction', topics: [] },
          { id: 'electro-nombre', name: 'Nombre d\'oxydation', topics: [] },
          { id: 'electro-equilibrage', name: 'Équilibrage redox', topics: [] },
          { id: 'electro-piles', name: 'Piles électrochimiques', topics: [] },
          { id: 'electro-electrolyse', name: 'Électrolyse', topics: [] }
        ]
      },
      {
        id: 'cinetique',
        name: 'Cinétique chimique',
        tracks: [
          { id: 'cinet-vitesse', name: 'Vitesse de réaction', topics: [] },
          { id: 'cinet-ordre', name: 'Ordre de réaction', topics: [] },
          { id: 'cinet-activation', name: 'Énergie d\'activation', topics: [] },
          { id: 'cinet-catalyse', name: 'Catalyse', topics: [] },
          { id: 'cinet-mecanismes', name: 'Mécanismes réactionnels', topics: [] }
        ]
      },
      {
        id: 'stereochimie',
        name: 'Stéréochimie',
        tracks: [
          { id: 'stereo-chiralite', name: 'Chiralité', topics: [] },
          { id: 'stereo-enantiomeres', name: 'Énantiomères', topics: [] },
          { id: 'stereo-diastereomeres', name: 'Diastéréoisomères', topics: [] },
          { id: 'stereo-configuration', name: 'Configuration R/S', topics: [] },
          { id: 'stereo-projection', name: 'Projections de Fischer', topics: [] }
        ]
      }
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
      'Structure cellulaire', 'Membrane plasmique', 'Noyau', 'Mitochondries', 'Réticulum endoplasmique',
      'Appareil de Golgi', 'Lysosomes', 'Cytosquelette', 'Ribosomes', 'Chloroplastes',
      'ADN', 'ARN', 'Réplication', 'Transcription', 'Traduction',
      'Code génétique', 'Mutations', 'Régulation génique', 'Épigénétique', 'CRISPR',
      'Mitose', 'Méiose', 'Cycle cellulaire', 'Apoptose', 'Cancer',
      'Mendel', 'Hérédité', 'Gènes liés', 'Crossing-over', 'Cartographie génétique',
      'Évolution', 'Sélection naturelle', 'Dérive génétique', 'Spéciation', 'Phylogénie',
      'Métabolisme', 'Glycolyse', 'Cycle de Krebs', 'Phosphorylation oxydative', 'Photosynthèse',
      'Système nerveux', 'Neurones', 'Synapses', 'Potentiel d\'action', 'Neurotransmetteurs',
      'Système immunitaire', 'Immunité innée', 'Immunité adaptative', 'Anticorps', 'Lymphocytes',
      'Système cardiovasculaire', 'Système respiratoire', 'Système digestif', 'Système endocrinien', 'Homéostasie',
      'Écologie', 'Écosystèmes', 'Chaînes alimentaires', 'Cycles biogéochimiques', 'Biodiversité'
    ],
    bundles: [
      {
        id: 'cellulaire',
        name: 'Biologie cellulaire',
        tracks: [
          { id: 'cell-structure', name: 'Structure cellulaire', topics: [] },
          { id: 'cell-membrane', name: 'Membrane plasmique', topics: [] },
          { id: 'cell-organites', name: 'Organites cellulaires', topics: [] },
          { id: 'cell-noyau', name: 'Noyau et génome', topics: [] },
          { id: 'cell-division', name: 'Division cellulaire', topics: [] },
          { id: 'cell-cycle', name: 'Cycle cellulaire', topics: [] },
          { id: 'cell-apoptose', name: 'Apoptose et mort cellulaire', topics: [] },
          { id: 'cell-signalisation', name: 'Signalisation cellulaire', topics: [] },
          { id: 'cell-mouvement', name: 'Mouvement cellulaire', topics: [] },
          { id: 'cell-differenciation', name: 'Différenciation cellulaire', topics: [] }
        ]
      },
      {
        id: 'genetique',
        name: 'Génétique',
        tracks: [
          { id: 'gen-adn', name: 'Structure de l\'ADN', topics: [] },
          { id: 'gen-replication', name: 'Réplication', topics: [] },
          { id: 'gen-transcription', name: 'Transcription', topics: [] },
          { id: 'gen-traduction', name: 'Traduction', topics: [] },
          { id: 'gen-code', name: 'Code génétique', topics: [] },
          { id: 'gen-mutations', name: 'Mutations', topics: [] },
          { id: 'gen-regulation', name: 'Régulation génique', topics: [] },
          { id: 'gen-epigenetique', name: 'Épigénétique', topics: [] },
          { id: 'gen-crispr', name: 'Édition génique (CRISPR)', topics: [] },
          { id: 'gen-heredite', name: 'Hérédité mendélienne', topics: [] },
          { id: 'gen-heritage', name: 'Héritage complexe', topics: [] },
          { id: 'gen-cartographie', name: 'Cartographie génétique', topics: [] }
        ]
      },
      {
        id: 'evolution',
        name: 'Évolution',
        tracks: [
          { id: 'evol-theories', name: 'Théories de l\'évolution', topics: [] },
          { id: 'evol-selection', name: 'Sélection naturelle', topics: [] },
          { id: 'evol-derive', name: 'Dérive génétique', topics: [] },
          { id: 'evol-speciation', name: 'Spéciation', topics: [] },
          { id: 'evol-phylogenie', name: 'Phylogénie', topics: [] },
          { id: 'evol-adaptation', name: 'Adaptation', topics: [] },
          { id: 'evol-extinction', name: 'Extinction', topics: [] }
        ]
      },
      {
        id: 'metabolisme',
        name: 'Métabolisme',
        tracks: [
          { id: 'met-glycolyse', name: 'Glycolyse', topics: [] },
          { id: 'met-krebs', name: 'Cycle de Krebs', topics: [] },
          { id: 'met-phosphorylation', name: 'Phosphorylation oxydative', topics: [] },
          { id: 'met-photosynthese', name: 'Photosynthèse', topics: [] },
          { id: 'met-lipides', name: 'Métabolisme des lipides', topics: [] },
          { id: 'met-proteines', name: 'Métabolisme des protéines', topics: [] },
          { id: 'met-regulation', name: 'Régulation métabolique', topics: [] }
        ]
      },
      {
        id: 'systemes-organes',
        name: 'Systèmes et organes',
        tracks: [
          { id: 'sys-nerveux', name: 'Système nerveux', topics: [] },
          { id: 'sys-cardiovasculaire', name: 'Système cardiovasculaire', topics: [] },
          { id: 'sys-respiratoire', name: 'Système respiratoire', topics: [] },
          { id: 'sys-digestif', name: 'Système digestif', topics: [] },
          { id: 'sys-endocrinien', name: 'Système endocrinien', topics: [] },
          { id: 'sys-immunitaire', name: 'Système immunitaire', topics: [] },
          { id: 'sys-reproducteur', name: 'Système reproducteur', topics: [] },
          { id: 'sys-excretieur', name: 'Système excréteur', topics: [] }
        ]
      },
      {
        id: 'immunologie',
        name: 'Immunologie',
        tracks: [
          { id: 'immun-innée', name: 'Immunité innée', topics: [] },
          { id: 'immun-adaptative', name: 'Immunité adaptative', topics: [] },
          { id: 'immun-anticorps', name: 'Anticorps', topics: [] },
          { id: 'immun-lymphocytes', name: 'Lymphocytes', topics: [] },
          { id: 'immun-vaccination', name: 'Vaccination', topics: [] },
          { id: 'immun-auto', name: 'Maladies auto-immunes', topics: [] }
        ]
      },
      {
        id: 'pathologie',
        name: 'Pathologie',
        tracks: [
          { id: 'path-cancer', name: 'Cancer', topics: [] },
          { id: 'path-maladies', name: 'Maladies génétiques', topics: [] },
          { id: 'path-infections', name: 'Infections', topics: [] },
          { id: 'path-metaboliques', name: 'Maladies métaboliques', topics: [] },
          { id: 'path-neurodegeneratives', name: 'Maladies neurodégénératives', topics: [] }
        ]
      },
      {
        id: 'ecologie',
        name: 'Écologie',
        tracks: [
          { id: 'eco-ecosystemes', name: 'Écosystèmes', topics: [] },
          { id: 'eco-chaines', name: 'Chaînes alimentaires', topics: [] },
          { id: 'eco-cycles', name: 'Cycles biogéochimiques', topics: [] },
          { id: 'eco-biodiversite', name: 'Biodiversité', topics: [] },
          { id: 'eco-populations', name: 'Dynamique des populations', topics: [] },
          { id: 'eco-communautes', name: 'Communautés écologiques', topics: [] }
        ]
      }
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
      'Offre et demande', 'Élasticité', 'Surplus', 'Équilibre de marché', 'Externalités',
      'Utilité marginale', 'Courbes d\'indifférence', 'Contrainte budgétaire', 'Choix du consommateur', 'Demande individuelle',
      'Fonction de production', 'Coûts de production', 'Rendements d\'échelle', 'Maximisation du profit', 'Concurrence parfaite',
      'Monopole', 'Oligopole', 'Concurrence monopolistique', 'Théorie des jeux', 'Équilibre de Nash',
      'PIB', 'Croissance économique', 'Inflation', 'Chômage', 'Cycles économiques',
      'Politique budgétaire', 'Politique monétaire', 'Banque centrale', 'Taux d\'intérêt', 'Masse monétaire',
      'Commerce international', 'Avantage comparatif', 'Balance des paiements', 'Taux de change', 'Protectionnisme',
      'Marchés financiers', 'Actions', 'Obligations', 'Produits dérivés', 'Gestion de portefeuille',
      'Économétrie', 'Régression', 'Séries temporelles', 'Modèles économétriques', 'Tests statistiques',
      'Finance d\'entreprise', 'Évaluation d\'entreprise', 'Structure du capital', 'Dividendes', 'Fusions-acquisitions',
      'Économie comportementale', 'Biais cognitifs', 'Nudge', 'Aversion au risque', 'Prospect theory'
    ],
    bundles: [
      {
        id: 'microeconomie',
        name: 'Microéconomie',
        tracks: [
          { id: 'micro-fondamentaux', name: 'Fondamentaux', topics: [] },
          { id: 'micro-consommateur', name: 'Théorie du consommateur', topics: [] },
          { id: 'micro-producteur', name: 'Théorie du producteur', topics: [] },
          { id: 'micro-structures', name: 'Structures de marché', topics: [] },
          { id: 'micro-elasticite', name: 'Élasticité et prix', topics: [] },
          { id: 'micro-surplus', name: 'Surplus et bien-être', topics: [] },
          { id: 'micro-production', name: 'Théorie de la production', topics: [] },
          { id: 'micro-couts', name: 'Coûts et optimisation', topics: [] },
          { id: 'micro-equilibre', name: 'Équilibre général', topics: [] },
          { id: 'micro-externalites', name: 'Externalités et biens publics', topics: [] },
          { id: 'micro-information', name: 'Asymétrie d\'information', topics: [] },
          { id: 'micro-jeux', name: 'Théorie des jeux avancée', topics: [] }
        ]
      },
      {
        id: 'macroeconomie',
        name: 'Macroéconomie',
        tracks: [
          { id: 'macro-indicateurs', name: 'Indicateurs macroéconomiques', topics: [] },
          { id: 'macro-politiques', name: 'Politiques économiques', topics: [] },
          { id: 'macro-international', name: 'Économie internationale', topics: [] },
          { id: 'macro-croissance', name: 'Théories de la croissance', topics: [] },
          { id: 'macro-inflation', name: 'Inflation et déflation', topics: [] },
          { id: 'macro-chomage', name: 'Marché du travail', topics: [] },
          { id: 'macro-consommation', name: 'Consommation et épargne', topics: [] },
          { id: 'macro-investissement', name: 'Investissement et capital', topics: [] },
          { id: 'macro-budget', name: 'Politique budgétaire', topics: [] },
          { id: 'macro-monetaire', name: 'Politique monétaire', topics: [] },
          { id: 'macro-banque', name: 'Système bancaire', topics: [] },
          { id: 'macro-monnaie', name: 'Théorie monétaire', topics: [] }
        ]
      },
      {
        id: 'finance',
        name: 'Finance',
        tracks: [
          { id: 'finance-marches', name: 'Marchés financiers', topics: [] },
          { id: 'finance-entreprise', name: 'Finance d\'entreprise', topics: [] },
          { id: 'finance-personnelle', name: 'Finance personnelle', topics: [] },
          { id: 'finance-investissement', name: 'Gestion d\'investissement', topics: [] },
          { id: 'finance-risque', name: 'Gestion des risques', topics: [] },
          { id: 'finance-derives', name: 'Produits dérivés', topics: [] },
          { id: 'finance-obligations', name: 'Marché obligataire', topics: [] },
          { id: 'finance-actions', name: 'Analyse d\'actions', topics: [] },
          { id: 'finance-evaluation', name: 'Évaluation d\'actifs', topics: [] },
          { id: 'finance-portefeuille', name: 'Théorie du portefeuille', topics: [] }
        ]
      },
      {
        id: 'econometrie',
        name: 'Économétrie',
        tracks: [
          { id: 'econometrie-fondamentaux', name: 'Méthodes économétriques', topics: [] },
          { id: 'econometrie-regression', name: 'Régression linéaire', topics: [] },
          { id: 'econometrie-series', name: 'Séries temporelles', topics: [] },
          { id: 'econometrie-modeles', name: 'Modèles économétriques', topics: [] },
          { id: 'econometrie-tests', name: 'Tests statistiques', topics: [] },
          { id: 'econometrie-panel', name: 'Données de panel', topics: [] },
          { id: 'econometrie-instrumentale', name: 'Variables instrumentales', topics: [] },
          { id: 'econometrie-ml', name: 'Machine learning en économie', topics: [] }
        ]
      },
      {
        id: 'economie-comportementale',
        name: 'Économie comportementale',
        tracks: [
          { id: 'comportementale-fondamentaux', name: 'Psychologie économique', topics: [] },
          { id: 'comportementale-biais', name: 'Biais cognitifs', topics: [] },
          { id: 'comportementale-nudge', name: 'Nudge et incitations', topics: [] },
          { id: 'comportementale-risque', name: 'Prise de décision', topics: [] },
          { id: 'comportementale-prospect', name: 'Prospect theory', topics: [] },
          { id: 'comportementale-choix', name: 'Choix et préférences', topics: [] }
        ]
      },
      {
        id: 'economie-publique',
        name: 'Économie publique',
        tracks: [
          { id: 'publique-fiscalite', name: 'Fiscalité', topics: [] },
          { id: 'publique-redistribution', name: 'Redistribution', topics: [] },
          { id: 'publique-bien-etre', name: 'Théorie du bien-être', topics: [] },
          { id: 'publique-regulation', name: 'Régulation', topics: [] }
        ]
      },
      {
        id: 'economie-environnementale',
        name: 'Économie environnementale',
        tracks: [
          { id: 'env-externalites', name: 'Externalités environnementales', topics: [] },
          { id: 'env-politiques', name: 'Politiques environnementales', topics: [] },
          { id: 'env-ressources', name: 'Gestion des ressources', topics: [] },
          { id: 'env-climat', name: 'Économie du climat', topics: [] }
        ]
      },
      {
        id: 'economie-durable',
        name: 'Économie du développement',
        tracks: [
          { id: 'dev-croissance', name: 'Croissance économique', topics: [] },
          { id: 'dev-pauvrete', name: 'Pauvreté et inégalités', topics: [] },
          { id: 'dev-education', name: 'Économie de l\'éducation', topics: [] },
          { id: 'dev-sante', name: 'Économie de la santé', topics: [] }
        ]
      }
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
      'Plan comptable', 'Partie double', 'Journal', 'Grand livre', 'Balance',
      'Bilan', 'Compte de résultat', 'Annexe', 'Tableau de flux', 'Variation des capitaux propres',
      'Immobilisations', 'Amortissements', 'Dépréciations', 'Provisions', 'Stocks',
      'Créances', 'Dettes', 'Trésorerie', 'Rapprochement bancaire', 'Lettrages',
      'TVA collectée', 'TVA déductible', 'Déclaration de TVA', 'TVA intracommunautaire', 'Autoliquidation',
      'Charges de personnel', 'Cotisations sociales', 'Impôt sur les sociétés', 'Acomptes', 'Carry-back',
      'Comptabilité analytique', 'Coûts complets', 'Coûts partiels', 'Seuil de rentabilité', 'Imputation rationnelle',
      'Méthode ABC', 'Centres d\'analyse', 'Unités d\'œuvre', 'Coût marginal', 'Prix de cession interne',
      'Analyse financière', 'Ratios de liquidité', 'Ratios de solvabilité', 'Ratios de rentabilité', 'BFR',
      'Normes IFRS', 'IAS', 'Juste valeur', 'Dépréciation d\'actifs', 'Avantages au personnel',
      'Consolidation', 'Intégration globale', 'Mise en équivalence', 'Goodwill', 'Écarts de conversion'
    ],
    bundles: [
      {
        id: 'comptabilite-generale',
        name: 'Comptabilité générale',
        tracks: [
          { id: 'comp-fondamentaux', name: 'Fondamentaux', topics: [] },
          { id: 'comp-plan', name: 'Plan comptable', topics: [] },
          { id: 'comp-partie-double', name: 'Partie double', topics: [] },
          { id: 'comp-journal', name: 'Journal', topics: [] },
          { id: 'comp-grand-livre', name: 'Grand livre', topics: [] },
          { id: 'comp-balance', name: 'Balance', topics: [] },
          { id: 'comp-bilan', name: 'Bilan', topics: [] },
          { id: 'comp-resultat', name: 'Compte de résultat', topics: [] },
          { id: 'comp-annexe', name: 'Annexe', topics: [] },
          { id: 'comp-flux', name: 'Tableau de flux', topics: [] },
          { id: 'comp-capitaux', name: 'Variation des capitaux propres', topics: [] },
          { id: 'comp-cloture', name: 'Clôture des comptes', topics: [] }
        ]
      },
      {
        id: 'immobilisations',
        name: 'Immobilisations',
        tracks: [
          { id: 'immob-definition', name: 'Définition et classification', topics: [] },
          { id: 'immob-acquisition', name: 'Acquisition', topics: [] },
          { id: 'immob-amortissements', name: 'Amortissements', topics: [] },
          { id: 'immob-depreciations', name: 'Dépréciations', topics: [] },
          { id: 'immob-cessions', name: 'Cessions', topics: [] },
          { id: 'immob-revaluations', name: 'Réévaluations', topics: [] }
        ]
      },
      {
        id: 'stocks-creances',
        name: 'Stocks et créances',
        tracks: [
          { id: 'stock-evaluation', name: 'Évaluation des stocks', topics: [] },
          { id: 'stock-variations', name: 'Variations de stocks', topics: [] },
          { id: 'stock-inventaire', name: 'Inventaire', topics: [] },
          { id: 'creances-clients', name: 'Créances clients', topics: [] },
          { id: 'creances-provisions', name: 'Provisions pour créances', topics: [] },
          { id: 'creances-lettrage', name: 'Lettrage', topics: [] }
        ]
      },
      {
        id: 'dettes-tresorerie',
        name: 'Dettes et trésorerie',
        tracks: [
          { id: 'dettes-fournisseurs', name: 'Dettes fournisseurs', topics: [] },
          { id: 'dettes-emprunts', name: 'Emprunts', topics: [] },
          { id: 'dettes-provisions', name: 'Provisions pour risques', topics: [] },
          { id: 'treso-comptes', name: 'Comptes bancaires', topics: [] },
          { id: 'treso-rapprochement', name: 'Rapprochement bancaire', topics: [] },
          { id: 'treso-caisse', name: 'Caisse', topics: [] }
        ]
      },
      {
        id: 'tva-fiscalite',
        name: 'TVA et fiscalité',
        tracks: [
          { id: 'tva-collectee', name: 'TVA collectée', topics: [] },
          { id: 'tva-deductible', name: 'TVA déductible', topics: [] },
          { id: 'tva-declaration', name: 'Déclaration de TVA', topics: [] },
          { id: 'tva-intra', name: 'TVA intracommunautaire', topics: [] },
          { id: 'fiscal-is', name: 'Impôt sur les sociétés', topics: [] },
          { id: 'fiscal-acomptes', name: 'Acomptes d\'impôt', topics: [] }
        ]
      },
      {
        id: 'personnel-social',
        name: 'Personnel et social',
        tracks: [
          { id: 'pers-salaires', name: 'Salaires', topics: [] },
          { id: 'pers-charges', name: 'Charges de personnel', topics: [] },
          { id: 'pers-cotisations', name: 'Cotisations sociales', topics: [] },
          { id: 'pers-avantages', name: 'Avantages au personnel', topics: [] },
          { id: 'pers-provisions', name: 'Provisions pour congés', topics: [] }
        ]
      },
      {
        id: 'analytique',
        name: 'Comptabilité analytique',
        tracks: [
          { id: 'ana-couts-complets', name: 'Coûts complets', topics: [] },
          { id: 'ana-couts-partiels', name: 'Coûts partiels', topics: [] },
          { id: 'ana-seuil', name: 'Seuil de rentabilité', topics: [] },
          { id: 'ana-imputation', name: 'Imputation rationnelle', topics: [] },
          { id: 'ana-abc', name: 'Méthode ABC', topics: [] },
          { id: 'ana-centres', name: 'Centres d\'analyse', topics: [] },
          { id: 'ana-unites', name: 'Unités d\'œuvre', topics: [] },
          { id: 'ana-marginal', name: 'Coût marginal', topics: [] },
          { id: 'ana-cession', name: 'Prix de cession interne', topics: [] }
        ]
      },
      {
        id: 'analyse-financiere',
        name: 'Analyse financière',
        tracks: [
          { id: 'fin-ratios-liquidity', name: 'Ratios de liquidité', topics: [] },
          { id: 'fin-ratios-solvability', name: 'Ratios de solvabilité', topics: [] },
          { id: 'fin-ratios-profitability', name: 'Ratios de rentabilité', topics: [] },
          { id: 'fin-bfr', name: 'BFR', topics: [] },
          { id: 'fin-cash-flow', name: 'Cash-flow', topics: [] },
          { id: 'fin-analyse-horizontale', name: 'Analyse horizontale', topics: [] },
          { id: 'fin-analyse-verticale', name: 'Analyse verticale', topics: [] }
        ]
      },
      {
        id: 'ifrs-consolidation',
        name: 'IFRS et consolidation',
        tracks: [
          { id: 'ifrs-normes', name: 'Normes IFRS', topics: [] },
          { id: 'ifrs-ias', name: 'IAS', topics: [] },
          { id: 'ifrs-juste-valeur', name: 'Juste valeur', topics: [] },
          { id: 'consol-integration', name: 'Intégration globale', topics: [] },
          { id: 'consol-equivalence', name: 'Mise en équivalence', topics: [] },
          { id: 'consol-goodwill', name: 'Goodwill', topics: [] },
          { id: 'consol-ecarts', name: 'Écarts de conversion', topics: [] }
        ]
      }
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
      'Moyenne', 'Médiane', 'Mode', 'Écart-type', 'Variance',
      'Quartiles', 'Percentiles', 'Boîte à moustaches', 'Histogrammes', 'Diagrammes en barres',
      'Coefficient de corrélation', 'Covariance', 'Nuage de points', 'Droite de régression', 'R²',
      'Probabilités conditionnelles', 'Théorème de Bayes', 'Indépendance', 'Événements mutuellement exclusifs', 'Arbres de probabilité',
      'Loi binomiale', 'Loi de Poisson', 'Loi géométrique', 'Loi hypergéométrique', 'Loi uniforme discrète',
      'Loi normale', 'Loi exponentielle', 'Loi uniforme continue', 'Loi de Student', 'Loi du Chi-deux',
      'Échantillonnage', 'Estimation ponctuelle', 'Intervalles de confiance', 'Taille d\'échantillon', 'Marge d\'erreur',
      'Tests d\'hypothèses', 'Erreur de type I', 'Erreur de type II', 'P-value', 'Puissance du test',
      'Test Z', 'Test t', 'Test du Chi-deux', 'Test de Fisher', 'Test de Wilcoxon',
      'ANOVA à un facteur', 'ANOVA à deux facteurs', 'Tests post-hoc', 'Tukey', 'Bonferroni',
      'Régression linéaire simple', 'Régression multiple', 'Régression logistique', 'Analyse de résidus', 'Multicolinéarité',
      'Séries temporelles', 'Tendance', 'Saisonnalité', 'Lissage exponentiel', 'ARIMA'
    ],
    bundles: [
      {
        id: 'statistiques-descriptives',
        name: 'Statistiques descriptives',
        tracks: [
          { id: 'desc-tendances', name: 'Tendances centrales', topics: [] },
          { id: 'desc-dispersion', name: 'Mesures de dispersion', topics: [] },
          { id: 'desc-quartiles', name: 'Quartiles et percentiles', topics: [] },
          { id: 'desc-graphiques', name: 'Représentations graphiques', topics: [] },
          { id: 'desc-histo', name: 'Histogrammes', topics: [] },
          { id: 'desc-boite', name: 'Boîtes à moustaches', topics: [] },
          { id: 'desc-diagrammes', name: 'Diagrammes', topics: [] }
        ]
      },
      {
        id: 'correlation-regression',
        name: 'Corrélation et régression',
        tracks: [
          { id: 'corr-correlation', name: 'Corrélation', topics: [] },
          { id: 'corr-covariance', name: 'Covariance', topics: [] },
          { id: 'corr-nuage', name: 'Nuage de points', topics: [] },
          { id: 'corr-regression-simple', name: 'Régression linéaire simple', topics: [] },
          { id: 'corr-r2', name: 'Coefficient de détermination', topics: [] },
          { id: 'corr-regression-multiple', name: 'Régression multiple', topics: [] },
          { id: 'corr-residus', name: 'Analyse de résidus', topics: [] },
          { id: 'corr-multicolinearite', name: 'Multicolinéarité', topics: [] },
          { id: 'corr-regression-log', name: 'Régression logistique', topics: [] }
        ]
      },
      {
        id: 'probabilites',
        name: 'Probabilités',
        tracks: [
          { id: 'prob-fondamentaux', name: 'Fondamentaux', topics: [] },
          { id: 'prob-conditionnelles', name: 'Probabilités conditionnelles', topics: [] },
          { id: 'prob-bayes', name: 'Théorème de Bayes', topics: [] },
          { id: 'prob-independance', name: 'Indépendance', topics: [] },
          { id: 'prob-evenements', name: 'Événements mutuellement exclusifs', topics: [] },
          { id: 'prob-arbres', name: 'Arbres de probabilité', topics: [] }
        ]
      },
      {
        id: 'lois-probabilite',
        name: 'Lois de probabilité',
        tracks: [
          { id: 'loi-discretes', name: 'Lois discrètes', topics: [] },
          { id: 'loi-binomiale', name: 'Loi binomiale', topics: [] },
          { id: 'loi-poisson', name: 'Loi de Poisson', topics: [] },
          { id: 'loi-geometrique', name: 'Loi géométrique', topics: [] },
          { id: 'loi-hypergeometrique', name: 'Loi hypergéométrique', topics: [] },
          { id: 'loi-uniforme-discrete', name: 'Loi uniforme discrète', topics: [] },
          { id: 'loi-continues', name: 'Lois continues', topics: [] },
          { id: 'loi-normale', name: 'Loi normale', topics: [] },
          { id: 'loi-exponentielle', name: 'Loi exponentielle', topics: [] },
          { id: 'loi-uniforme-continue', name: 'Loi uniforme continue', topics: [] },
          { id: 'loi-student', name: 'Loi de Student', topics: [] },
          { id: 'loi-chi2', name: 'Loi du Chi-deux', topics: [] }
        ]
      },
      {
        id: 'echantillonnage-estimation',
        name: 'Échantillonnage et estimation',
        tracks: [
          { id: 'echant-echantillonnage', name: 'Échantillonnage', topics: [] },
          { id: 'echant-estimation-ponctuelle', name: 'Estimation ponctuelle', topics: [] },
          { id: 'echant-intervalles', name: 'Intervalles de confiance', topics: [] },
          { id: 'echant-taille', name: 'Taille d\'échantillon', topics: [] },
          { id: 'echant-marge', name: 'Marge d\'erreur', topics: [] },
          { id: 'echant-biais', name: 'Biais et précision', topics: [] }
        ]
      },
      {
        id: 'tests-hypotheses',
        name: 'Tests d\'hypothèses',
        tracks: [
          { id: 'test-fondamentaux', name: 'Fondamentaux', topics: [] },
          { id: 'test-erreurs', name: 'Erreurs de type I et II', topics: [] },
          { id: 'test-pvalue', name: 'P-value', topics: [] },
          { id: 'test-puissance', name: 'Puissance du test', topics: [] },
          { id: 'test-z', name: 'Test Z', topics: [] },
          { id: 'test-t', name: 'Test t', topics: [] },
          { id: 'test-chi2', name: 'Test du Chi-deux', topics: [] },
          { id: 'test-fisher', name: 'Test de Fisher', topics: [] },
          { id: 'test-wilcoxon', name: 'Test de Wilcoxon', topics: [] },
          { id: 'test-anova', name: 'ANOVA à un facteur', topics: [] },
          { id: 'test-anova2', name: 'ANOVA à deux facteurs', topics: [] },
          { id: 'test-post-hoc', name: 'Tests post-hoc', topics: [] },
          { id: 'test-tukey', name: 'Tukey et Bonferroni', topics: [] }
        ]
      },
      {
        id: 'series-temporelles',
        name: 'Séries temporelles',
        tracks: [
          { id: 'series-fondamentaux', name: 'Fondamentaux', topics: [] },
          { id: 'series-tendance', name: 'Tendance', topics: [] },
          { id: 'series-saisonnalite', name: 'Saisonnalité', topics: [] },
          { id: 'series-lissage', name: 'Lissage exponentiel', topics: [] },
          { id: 'series-arima', name: 'ARIMA', topics: [] },
          { id: 'series-prevision', name: 'Prévision', topics: [] }
        ]
      }
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
  hideHeader = false,
  onOpenCourse,
  allCourses = []
}: ProgramsShopProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBoostersModal, setShowBoostersModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Fonction pour trouver un cours correspondant à un learning track name
  const findCourseByTrackName = (trackName: string, programId: string): Course | null => {
    if (!allCourses || allCourses.length === 0) return null;
    
    const trackNameLower = trackName.toLowerCase().trim();
    
    // Recherche exacte d'abord
    let course = allCourses.find(c => 
      c.title.toLowerCase() === trackNameLower ||
      c.title.toLowerCase().includes(trackNameLower) ||
      trackNameLower.includes(c.title.toLowerCase())
    );
    
    // Si pas trouvé, recherche par mots-clés
    if (!course) {
      const keywords = trackNameLower.split(' ').filter(w => w.length > 3);
      course = allCourses.find(c => {
        const courseTitleLower = c.title.toLowerCase();
        return keywords.some(keyword => courseTitleLower.includes(keyword));
      });
    }
    
    // Si toujours pas trouvé, créer un cours mock basé sur le nom du track
    if (!course && onOpenCourse) {
      // Créer un cours minimal pour permettre l'ouverture
      return {
        id: `track-${programId}-${trackNameLower.replace(/\s+/g, '-')}`,
        title: trackName,
        description: `Learning track: ${trackName}`,
        faculty: 'Science Made Simple',
        year: '2024-2025',
        totalLessons: 0,
        completedLessons: 0,
        duration: '0h',
        isOwned: true,
        isPrimary: false,
        progress: 0,
        previewAvailable: false,
        tags: [],
        difficulty: 'intermediate' as const
      } as Course;
    }
    
    return course || null;
  };

  // Default unlocked programs: physics, mathematics, economics
  const defaultUnlockedPrograms = ['physics', 'mathematics', 'economics'];
  
  // Mark owned programs (combine default + passed ownedProgramIds)
  const allOwnedProgramIds = [...new Set([...defaultUnlockedPrograms, ...ownedProgramIds])];
  
  const programsWithOwnership = MASTERY_PROGRAMS.map(p => {
    const isOwned = allOwnedProgramIds.includes(p.id);
    return {
      ...p,
      owned: isOwned
    };
  });
  
  // Debug: log owned programs
  if (typeof window !== 'undefined') {
    console.log('🔓 ProgramsShop - Owned programs:', allOwnedProgramIds);
    console.log('🔓 ProgramsShop - Programs status:', programsWithOwnership.map(p => ({ id: p.id, name: p.name, owned: p.owned })));
  }

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

  // Selected program
  const selectedProgram = expandedIndex !== null ? filteredPrograms[expandedIndex] : null;
  const selectedDiscount = selectedProgram ? Math.round((1 - selectedProgram.price / selectedProgram.originalPrice) * 100) : 0;

  // Program images/posters mapping
  const programImages: Record<string, string> = {
    physics: '/images/programs/physics-hero.jpg',
    mathematics: '/images/programs/math-hero.jpg', 
    chemistry: '/images/programs/chemistry-hero.jpg',
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      
      {/* ========== STATE 1: No Program Selected - Grid View ========== */}
      {expandedIndex === null && (
        <div className="flex-1 px-10 py-8 flex flex-col items-start justify-start pt-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mb-8">
            {filteredPrograms.map((program, index) => {
              const isOwned = program.owned;
              return (
                <button
                  key={program.id}
                  onClick={() => setExpandedIndex(index)}
                  className="group text-left bg-gray-100 hover:bg-gray-900 rounded-3xl p-10 min-h-[220px] flex flex-col justify-end transition-all duration-200 relative"
                >
                  {isOwned && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-8 h-8 rounded-full bg-[#00c2ff] flex items-center justify-center shadow-lg">
                        <Check size={16} className="text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                  <div className="flex items-end justify-between">
                    <span 
                      className="text-3xl lg:text-4xl text-gray-900 group-hover:text-[#00c2ff] transition-colors"
                      style={{ fontFamily: 'var(--font-parafina), system-ui', fontWeight: 900 }}
                    >
                      {program.name.split(' ')[0].toUpperCase()}
                    </span>
                    <ArrowRight size={28} className="text-gray-300 group-hover:text-[#00c2ff] transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mastery Boosters Section */}
          <div className="w-full mt-8 flex justify-center">
            <div className="bg-gray-900 rounded-3xl p-4 md:p-5 overflow-hidden relative max-w-7xl w-full">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00c2ff]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00c2ff]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 px-2 md:px-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 
                      className="!text-white mb-2"
                      style={{ fontFamily: 'var(--font-parafina), system-ui', fontWeight: 900, color: '#ffffff', fontSize: '29px' }}
                    >
                      BOOST TON PROGRAMME
                    </h3>
                    <p 
                      className="mb-2.5 max-w-3xl"
                      style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
                    >
                      Ces outils viennent compléter ton programme pour t'aider à mieux t'organiser, t'entraîner et avancer avec d'autres étudiants.
                      Tu peux les activer quand tu veux, selon tes besoins.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
                        <Check size={14} className="text-[#00c2ff]" />
                        <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.95)' }}>Smart Planner</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
                        <Check size={14} className="text-[#00c2ff]" />
                        <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.95)' }}>Créateur de Parcours</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
                        <Check size={14} className="text-[#00c2ff]" />
                        <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.95)' }}>Examens Blancs</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
                        <Check size={14} className="text-[#00c2ff]" />
                        <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.95)' }}>Communauté d'Étude</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBoostersModal(true)}
                    className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-full transition-colors flex items-center gap-2 text-base whitespace-nowrap"
                  >
                    <span>Découvrir les Boosters</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== STATE 2: Program Selected - Detail View ========== */}
      {selectedProgram && (
        <>
          {/* Top: Program Tabs */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {/* Back button */}
              <button
                onClick={() => setExpandedIndex(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              >
                <ChevronDown size={20} className="rotate-90" />
              </button>
              
              {/* Program tabs */}
              {filteredPrograms.map((program, index) => {
                const isSelected = expandedIndex === index;
                const isOwned = program.owned;
                
                return (
                  <button
                    key={program.id}
                    onClick={() => setExpandedIndex(index)}
                    className={`px-8 py-5 rounded-2xl text-lg transition-all relative ${
                      isSelected 
                        ? 'bg-gray-900 text-[#00c2ff]' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                    }`}
                    style={{ fontFamily: 'var(--font-parafina), system-ui', fontWeight: 900 }}
                  >
                    <span className="flex items-center gap-2">
                      {program.name.split(' ')[0].toUpperCase()}
                      {isOwned && (
                        <div className="w-4 h-4 rounded-full bg-[#00c2ff] flex items-center justify-center flex-shrink-0">
                          <Check size={10} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom: Selected Program Content */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {/* Left: Program Info */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 
                    className="text-4xl lg:text-5xl text-gray-900"
                    style={{ fontFamily: 'var(--font-parafina), system-ui', fontWeight: 900 }}
                  >
                    {selectedProgram.name.split(' ')[0].toUpperCase()}
                  </h2>
                </div>
                {!selectedProgram.owned && (
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 line-through text-base">{selectedProgram.originalPrice}€</span>
                      <span className="text-3xl font-bold text-gray-900">{selectedProgram.price}€</span>
                      <span className="px-3 py-1 bg-gray-900 text-white text-sm font-bold rounded">-{selectedDiscount}%</span>
                    </div>
                    <span className="text-sm text-gray-400">Accès à vie • Mises à jour incluses</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-5 flex-wrap">
                <span className="flex items-center gap-2 px-5 py-3 bg-gray-100 rounded-full font-medium text-gray-700 text-base">
                  <FileText size={18} /> {selectedProgram.stats.chapters} chapitres
                </span>
                <span className="flex items-center gap-2 px-5 py-3 bg-gray-900 rounded-full font-medium text-white text-base">
                  <Video size={18} /> {selectedProgram.stats.hours}h vidéo
                </span>
                <button
                  onClick={() => setShowBoostersModal(true)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-full font-medium text-gray-700 text-sm transition-colors flex items-center gap-2"
                >
                  <Sparkles size={16} className="text-[#00c2ff]" />
                  Boosters
                </button>
                {!selectedProgram.owned && (
                  <button
                    onClick={() => handlePurchase(selectedProgram.id)}
                    className="ml-auto px-8 py-3 bg-[#00c2ff] hover:bg-[#00b0e8] text-white font-semibold rounded-full text-base transition-colors flex items-center gap-2"
                  >
                    Débloquer
                    <ArrowRight size={18} />
                  </button>
                )}
                {selectedProgram.owned && (
                  <button
                    onClick={() => handleOpenProgram(selectedProgram.id)}
                    className="ml-auto px-8 py-3 bg-[#00c2ff] hover:bg-[#00b0e8] text-white font-semibold rounded-full text-base transition-colors flex items-center gap-2"
                  >
                    Accéder
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>

              {/* Sujets inclus - Organisés en Bundles et Learning Tracks */}
              <div>
                {(() => {
                  // Si bundles disponibles, créer un flux continu : Bundle → Tracks → Bundle → Tracks...
                  let allItems: Array<{ type: 'bundle' | 'track'; id: string; name: string; bundleId?: string }> = [];
                  
                  if (selectedProgram.bundles && selectedProgram.bundles.length > 0) {
                    selectedProgram.bundles.forEach((bundle) => {
                      // Ajouter le bundle
                      allItems.push({ type: 'bundle', id: bundle.id, name: bundle.name });
                      // Ajouter tous les tracks de ce bundle
                      bundle.tracks.forEach((track) => {
                        allItems.push({ type: 'track', id: track.id, name: track.name, bundleId: bundle.id });
                      });
                    });
                  } else {
                    // Fallback: créer des items simples depuis trendingTopics
                    selectedProgram.trendingTopics.forEach((topic, i) => {
                      allItems.push({ type: 'track', id: `topic-${i}`, name: topic });
                    });
                  }
                  
                  const totalTracks = selectedProgram.bundles 
                    ? selectedProgram.bundles.reduce((sum, bundle) => sum + bundle.tracks.length, 0)
                    : selectedProgram.trendingTopics.length;
                  
                  // Diviser en 4 colonnes
                  const columns: Array<typeof allItems> = [[], [], [], []];
                  allItems.forEach((item, index) => {
                    columns[index % 4].push(item);
                  });
                  
                  return (
                    <>
                      <h4 className="font-bold text-gray-400 uppercase tracking-widest mb-5 text-sm">
                        Sujets inclus ({totalTracks})
                      </h4>
                      
                      {/* Grille 4 colonnes avec bundles et tracks mélangés */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2.5">
                        {columns.map((column, colIdx) => (
                          <ul key={colIdx} className="space-y-2.5">
                            {column.map((item) => (
                              <li key={item.id}>
                                {item.type === 'bundle' ? (
                                  <h5 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                                    {item.name}
                                  </h5>
                                ) : (
                                  <div 
                                    className={`flex items-center gap-2.5 ${
                                      selectedProgram.owned && onOpenCourse 
                                        ? 'cursor-pointer hover:opacity-70 transition-opacity group/track' 
                                        : ''
                                    }`}
                                    onClick={() => {
                                      if (selectedProgram.owned && onOpenCourse) {
                                        const course = findCourseByTrackName(item.name, selectedProgram.id);
                                        if (course) {
                                          onOpenCourse(course);
                                        }
                                      }
                                    }}
                                  >
                                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                                      selectedProgram.owned 
                                        ? 'text-[#00c2ff] group-hover/track:text-[#00b0e8]' 
                                        : 'text-[#00c2ff]'
                                    }`} />
                                    <span className={`text-base truncate ${
                                      selectedProgram.owned && onOpenCourse
                                        ? 'text-gray-900 group-hover/track:text-[#00c2ff]'
                                        : 'text-gray-600'
                                    }`}>{item.name}</span>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Right: Video */}
            <div className="w-full lg:w-[350px] flex-shrink-0 bg-gray-900 relative min-h-[250px] lg:min-h-0">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                poster={selectedProgram.posterUrl}
                muted={isMuted}
                loop
                playsInline
                autoPlay
              >
                <source src={selectedProgram.videoUrl} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <div className="absolute bottom-4 left-4 z-10">
                <p className="text-white text-lg font-bold">Zak</p>
                <p className="text-white/60 text-sm">Fondateur de SMS</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mastery Boosters Modal */}
      <MasteryBoostersModal
        isOpen={showBoostersModal}
        onClose={() => setShowBoostersModal(false)}
        onUnlock={(boosterId, price) => {
          console.log('Unlock booster:', boosterId, price);
          // TODO: Handle booster unlock/purchase
        }}
      />
    </div>
  );
}

export default ProgramsShop;
