'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, ArrowUp, X, ChevronRight, Heart, Clock, BookOpen } from 'lucide-react';

interface CleanHomeHeroProps {
  userName?: string;
  onCourseSelect?: (courseId: string, lessonId?: string) => void;
  onDocumentUpload?: () => void;
  onAddToFavorites?: (track: { id: string; title: string; subtitle: string; lessons: number; duration: string }) => void;
  className?: string;
  compact?: boolean;
}

// EPILS Index - Notions/Concepts mapped to Courses
const EPILS_INDEX: Record<string, { courseId: string; bundleId: string; programId: string; lessonId?: string; notion: string }> = {
  // Mathématiques - Analyse
  'pythagore': { programId: 'math', bundleId: 'geometrie', courseId: 'trigonometrie', lessonId: 'theoreme-pythagore', notion: 'Théorème de Pythagore' },
  'thales': { programId: 'math', bundleId: 'geometrie', courseId: 'trigonometrie', lessonId: 'theoreme-thales', notion: 'Théorème de Thalès' },
  'derivee': { programId: 'math', bundleId: 'analyse', courseId: 'derivation', notion: 'Dérivation' },
  'derivation': { programId: 'math', bundleId: 'analyse', courseId: 'derivation', notion: 'Dérivation' },
  'integrale': { programId: 'math', bundleId: 'analyse', courseId: 'integration', notion: 'Intégration' },
  'integration': { programId: 'math', bundleId: 'analyse', courseId: 'integration', notion: 'Intégration' },
  'limite': { programId: 'math', bundleId: 'analyse', courseId: 'limites', notion: 'Limites et continuité' },
  'continuite': { programId: 'math', bundleId: 'analyse', courseId: 'limites', notion: 'Limites et continuité' },
  'suite': { programId: 'math', bundleId: 'analyse', courseId: 'suites', notion: 'Suites numériques' },
  'recurrence': { programId: 'math', bundleId: 'analyse', courseId: 'suites', lessonId: 'recurrence', notion: 'Raisonnement par récurrence' },
  // Mathématiques - Algèbre
  'matrice': { programId: 'math', bundleId: 'algebre', courseId: 'matrices', notion: 'Matrices' },
  'determinant': { programId: 'math', bundleId: 'algebre', courseId: 'matrices', lessonId: 'determinants', notion: 'Déterminants' },
  'vecteur': { programId: 'math', bundleId: 'algebre', courseId: 'espaces-vectoriels', notion: 'Espaces vectoriels' },
  'espace vectoriel': { programId: 'math', bundleId: 'algebre', courseId: 'espaces-vectoriels', notion: 'Espaces vectoriels' },
  'valeur propre': { programId: 'math', bundleId: 'algebre', courseId: 'reduction', notion: 'Réduction des endomorphismes' },
  'diagonalisation': { programId: 'math', bundleId: 'algebre', courseId: 'reduction', notion: 'Réduction des endomorphismes' },
  // Mathématiques - Probabilités
  'probabilite': { programId: 'math', bundleId: 'probas', courseId: 'probabilites', notion: 'Probabilités' },
  'variable aleatoire': { programId: 'math', bundleId: 'probas', courseId: 'variables-aleatoires', notion: 'Variables aléatoires' },
  'esperance': { programId: 'math', bundleId: 'probas', courseId: 'variables-aleatoires', lessonId: 'esperance', notion: 'Espérance' },
  'variance': { programId: 'math', bundleId: 'probas', courseId: 'variables-aleatoires', lessonId: 'variance', notion: 'Variance' },
  'loi normale': { programId: 'math', bundleId: 'probas', courseId: 'lois-continues', notion: 'Lois continues' },
  'loi binomiale': { programId: 'math', bundleId: 'probas', courseId: 'lois-discretes', notion: 'Lois discrètes' },
  // Physique - Mécanique
  'newton': { programId: 'physics', bundleId: 'mecanique', courseId: 'dynamique', notion: 'Lois de Newton' },
  'cinematique': { programId: 'physics', bundleId: 'mecanique', courseId: 'cinematique', notion: 'Cinématique' },
  'energie cinetique': { programId: 'physics', bundleId: 'mecanique', courseId: 'energie', notion: 'Énergie mécanique' },
  'energie potentielle': { programId: 'physics', bundleId: 'mecanique', courseId: 'energie', notion: 'Énergie mécanique' },
  'oscillateur': { programId: 'physics', bundleId: 'mecanique', courseId: 'oscillations', notion: 'Oscillations' },
  'pendule': { programId: 'physics', bundleId: 'mecanique', courseId: 'oscillations', lessonId: 'pendule', notion: 'Pendule simple' },
  // Physique - Électromagnétisme
  'gauss': { programId: 'physics', bundleId: 'electromag', courseId: 'electrostatique', lessonId: 'gauss', notion: 'Théorème de Gauss' },
  'coulomb': { programId: 'physics', bundleId: 'electromag', courseId: 'electrostatique', lessonId: 'coulomb', notion: 'Loi de Coulomb' },
  'champ electrique': { programId: 'physics', bundleId: 'electromag', courseId: 'electrostatique', notion: 'Électrostatique' },
  'champ magnetique': { programId: 'physics', bundleId: 'electromag', courseId: 'magnetostatique', notion: 'Magnétostatique' },
  'induction': { programId: 'physics', bundleId: 'electromag', courseId: 'induction', notion: 'Induction électromagnétique' },
  'faraday': { programId: 'physics', bundleId: 'electromag', courseId: 'induction', lessonId: 'faraday', notion: 'Loi de Faraday' },
  // Physique - Thermodynamique
  'thermodynamique': { programId: 'physics', bundleId: 'thermo', courseId: 'premier-principe', notion: 'Premier principe' },
  'enthalpie': { programId: 'physics', bundleId: 'thermo', courseId: 'premier-principe', lessonId: 'enthalpie', notion: 'Enthalpie' },
  'entropie': { programId: 'physics', bundleId: 'thermo', courseId: 'second-principe', notion: 'Second principe' },
  'carnot': { programId: 'physics', bundleId: 'thermo', courseId: 'machines-thermiques', lessonId: 'carnot', notion: 'Cycle de Carnot' },
  // Chimie
  'redox': { programId: 'chemistry', bundleId: 'generale', courseId: 'oxydoreduction', notion: 'Oxydoréduction' },
  'oxydoreduction': { programId: 'chemistry', bundleId: 'generale', courseId: 'oxydoreduction', notion: 'Oxydoréduction' },
  'acide': { programId: 'chemistry', bundleId: 'solutions', courseId: 'acides-bases', notion: 'Acides et bases' },
  'base': { programId: 'chemistry', bundleId: 'solutions', courseId: 'acides-bases', notion: 'Acides et bases' },
  'ph': { programId: 'chemistry', bundleId: 'solutions', courseId: 'acides-bases', lessonId: 'ph', notion: 'pH et pKa' },
  'cinetique': { programId: 'chemistry', bundleId: 'generale', courseId: 'cinetique', notion: 'Cinétique chimique' },
  'orbitale': { programId: 'chemistry', bundleId: 'generale', courseId: 'structure-atomique', notion: 'Structure atomique' },
  'liaison': { programId: 'chemistry', bundleId: 'generale', courseId: 'liaisons', notion: 'Liaisons chimiques' },
  'sn1': { programId: 'chemistry', bundleId: 'organique', courseId: 'reactions-substitution', notion: 'Réactions de substitution' },
  'sn2': { programId: 'chemistry', bundleId: 'organique', courseId: 'reactions-substitution', notion: 'Réactions de substitution' },
};

// Structure complète Programme → Bundle → Cours → Leçons
const PROGRAMS = {
  math: {
    id: 'math',
    label: 'Mathématiques',
    bundles: {
      analyse: {
        id: 'analyse',
        label: 'Analyse',
        courses: {
          limites: { id: 'limites', label: 'Limites et continuité', duration: '4h', lessons: ['Définition des limites', 'Limites usuelles', 'Continuité', 'Théorème des valeurs intermédiaires'] },
          derivation: { id: 'derivation', label: 'Dérivation', duration: '5h', lessons: ['Définition', 'Dérivées usuelles', 'Règles de dérivation', 'Applications'] },
          integration: { id: 'integration', label: 'Intégration', duration: '6h', lessons: ['Primitives', 'Intégrale de Riemann', 'Techniques d\'intégration', 'Intégrales impropres'] },
          suites: { id: 'suites', label: 'Suites numériques', duration: '4h', lessons: ['Définitions', 'Convergence', 'Suites récurrentes', 'Raisonnement par récurrence'] },
        }
      },
      algebre: {
        id: 'algebre',
        label: 'Algèbre linéaire',
        courses: {
          matrices: { id: 'matrices', label: 'Matrices', duration: '5h', lessons: ['Opérations', 'Inverse', 'Déterminants', 'Rang'] },
          'espaces-vectoriels': { id: 'espaces-vectoriels', label: 'Espaces vectoriels', duration: '6h', lessons: ['Définition', 'Bases', 'Dimension', 'Sous-espaces'] },
          reduction: { id: 'reduction', label: 'Réduction', duration: '5h', lessons: ['Valeurs propres', 'Vecteurs propres', 'Diagonalisation', 'Trigonalisation'] },
        }
      },
      geometrie: {
        id: 'geometrie',
        label: 'Géométrie',
        courses: {
          trigonometrie: { id: 'trigonometrie', label: 'Trigonométrie', duration: '4h', lessons: ['Cercle trigonométrique', 'Formules', 'Théorème de Pythagore', 'Théorème de Thalès'] },
          geometrie: { id: 'geometrie', label: 'Géométrie dans l\'espace', duration: '4h', lessons: ['Droites et plans', 'Produit scalaire', 'Produit vectoriel', 'Distances'] },
        }
      },
      probas: {
        id: 'probas',
        label: 'Probabilités',
        courses: {
          probabilites: { id: 'probabilites', label: 'Probabilités', duration: '4h', lessons: ['Événements', 'Probabilités conditionnelles', 'Indépendance', 'Formule de Bayes'] },
          'variables-aleatoires': { id: 'variables-aleatoires', label: 'Variables aléatoires', duration: '5h', lessons: ['Définition', 'Espérance', 'Variance', 'Covariance'] },
          'lois-discretes': { id: 'lois-discretes', label: 'Lois discrètes', duration: '3h', lessons: ['Loi binomiale', 'Loi de Poisson', 'Loi géométrique'] },
          'lois-continues': { id: 'lois-continues', label: 'Lois continues', duration: '4h', lessons: ['Loi uniforme', 'Loi normale', 'Loi exponentielle'] },
        }
      }
    }
  },
  physics: {
    id: 'physics',
    label: 'Physique',
    bundles: {
      mecanique: {
        id: 'mecanique',
        label: 'Mécanique',
        courses: {
          cinematique: { id: 'cinematique', label: 'Cinématique', duration: '3h', lessons: ['Position', 'Vitesse', 'Accélération', 'Mouvements'] },
          dynamique: { id: 'dynamique', label: 'Dynamique', duration: '5h', lessons: ['Lois de Newton', 'Forces', 'Frottements', 'Chute libre'] },
          energie: { id: 'energie', label: 'Énergie', duration: '4h', lessons: ['Travail', 'Énergie cinétique', 'Énergie potentielle', 'Conservation'] },
          oscillations: { id: 'oscillations', label: 'Oscillations', duration: '4h', lessons: ['Oscillateur harmonique', 'Pendule simple', 'Amortissement', 'Résonance'] },
        }
      },
      electromag: {
        id: 'electromag',
        label: 'Électromagnétisme',
        courses: {
          electrostatique: { id: 'electrostatique', label: 'Électrostatique', duration: '5h', lessons: ['Charge électrique', 'Loi de Coulomb', 'Champ électrique', 'Théorème de Gauss'] },
          magnetostatique: { id: 'magnetostatique', label: 'Magnétostatique', duration: '4h', lessons: ['Champ magnétique', 'Force de Lorentz', 'Théorème d\'Ampère', 'Bobines'] },
          induction: { id: 'induction', label: 'Induction', duration: '4h', lessons: ['Flux magnétique', 'Loi de Faraday', 'Inductance', 'Circuits RL'] },
        }
      },
      thermo: {
        id: 'thermo',
        label: 'Thermodynamique',
        courses: {
          'premier-principe': { id: 'premier-principe', label: 'Premier principe', duration: '4h', lessons: ['Énergie interne', 'Travail', 'Chaleur', 'Enthalpie'] },
          'second-principe': { id: 'second-principe', label: 'Second principe', duration: '4h', lessons: ['Entropie', 'Irréversibilité', 'Machines thermiques', 'Rendement'] },
          'machines-thermiques': { id: 'machines-thermiques', label: 'Machines thermiques', duration: '3h', lessons: ['Cycle de Carnot', 'Moteurs', 'Pompes à chaleur'] },
        }
      }
    }
  },
  chemistry: {
    id: 'chemistry',
    label: 'Chimie',
    bundles: {
      generale: {
        id: 'generale',
        label: 'Chimie générale',
        courses: {
          'structure-atomique': { id: 'structure-atomique', label: 'Structure atomique', duration: '4h', lessons: ['Modèle atomique', 'Orbitales', 'Configuration électronique', 'Tableau périodique'] },
          liaisons: { id: 'liaisons', label: 'Liaisons chimiques', duration: '4h', lessons: ['Liaison covalente', 'Liaison ionique', 'Liaison métallique', 'Forces intermoléculaires'] },
          cinetique: { id: 'cinetique', label: 'Cinétique', duration: '4h', lessons: ['Vitesse de réaction', 'Ordre de réaction', 'Mécanismes', 'Catalyse'] },
          oxydoreduction: { id: 'oxydoreduction', label: 'Oxydoréduction', duration: '4h', lessons: ['Nombres d\'oxydation', 'Équilibrage', 'Piles', 'Électrolyse'] },
        }
      },
      solutions: {
        id: 'solutions',
        label: 'Chimie des solutions',
        courses: {
          'acides-bases': { id: 'acides-bases', label: 'Acides et bases', duration: '5h', lessons: ['pH et pKa', 'Solutions tampons', 'Titrages', 'Indicateurs'] },
          precipitation: { id: 'precipitation', label: 'Précipitation', duration: '3h', lessons: ['Produit de solubilité', 'Effet d\'ion commun', 'Précipitation sélective'] },
        }
      },
      organique: {
        id: 'organique',
        label: 'Chimie organique',
        courses: {
          nomenclature: { id: 'nomenclature', label: 'Nomenclature', duration: '3h', lessons: ['Alcanes', 'Alcènes', 'Fonctions', 'IUPAC'] },
          stereochimie: { id: 'stereochimie', label: 'Stéréochimie', duration: '4h', lessons: ['Chiralité', 'Énantiomères', 'Diastéréoisomères', 'Configuration R/S'] },
          'reactions-substitution': { id: 'reactions-substitution', label: 'Substitution', duration: '4h', lessons: ['SN1', 'SN2', 'Nucléophiles', 'Groupes partants'] },
        }
      }
    }
  },
  statistics: {
    id: 'statistics',
    label: 'Statistiques',
    bundles: {
      descriptive: {
        id: 'descriptive',
        label: 'Statistiques descriptives',
        courses: {
          'series-stat': { id: 'series-stat', label: 'Séries statistiques', duration: '3h', lessons: ['Moyenne', 'Médiane', 'Mode', 'Écart-type'] },
          graphiques: { id: 'graphiques', label: 'Représentations', duration: '2h', lessons: ['Histogrammes', 'Diagrammes', 'Boîtes à moustaches'] },
        }
      },
      inference: {
        id: 'inference',
        label: 'Inférence',
        courses: {
          estimation: { id: 'estimation', label: 'Estimation', duration: '4h', lessons: ['Estimateurs', 'Biais', 'Intervalles de confiance'] },
          tests: { id: 'tests', label: 'Tests d\'hypothèse', duration: '5h', lessons: ['Test t', 'Test chi-carré', 'ANOVA', 'Puissance'] },
        }
      }
    }
  },
  informatics: {
    id: 'informatics',
    label: 'Informatique',
    bundles: {
      python: {
        id: 'python',
        label: 'Python',
        courses: {
          bases: { id: 'bases', label: 'Bases Python', duration: '5h', lessons: ['Variables', 'Types', 'Conditions', 'Boucles'] },
          fonctions: { id: 'fonctions', label: 'Fonctions', duration: '3h', lessons: ['Définition', 'Paramètres', 'Retour', 'Portée'] },
          poo: { id: 'poo', label: 'POO', duration: '5h', lessons: ['Classes', 'Objets', 'Héritage', 'Polymorphisme'] },
        }
      },
      algo: {
        id: 'algo',
        label: 'Algorithmique',
        courses: {
          complexite: { id: 'complexite', label: 'Complexité', duration: '3h', lessons: ['Notation O', 'Analyse', 'Comparaison'] },
          tri: { id: 'tri', label: 'Algorithmes de tri', duration: '4h', lessons: ['Tri bulle', 'Tri rapide', 'Tri fusion', 'Tri par tas'] },
        }
      }
    }
  },
  economics: {
    id: 'economics',
    label: 'Économie',
    bundles: {
      micro: {
        id: 'micro',
        label: 'Microéconomie',
        courses: {
          consommateur: { id: 'consommateur', label: 'Théorie du consommateur', duration: '4h', lessons: ['Utilité', 'Contrainte budgétaire', 'Optimum', 'Demande'] },
          producteur: { id: 'producteur', label: 'Théorie du producteur', duration: '4h', lessons: ['Production', 'Coûts', 'Offre', 'Profit'] },
        }
      },
      macro: {
        id: 'macro',
        label: 'Macroéconomie',
        courses: {
          pib: { id: 'pib', label: 'PIB et croissance', duration: '3h', lessons: ['Calcul du PIB', 'Croissance', 'Cycles'] },
          monetaire: { id: 'monetaire', label: 'Politique monétaire', duration: '4h', lessons: ['Banque centrale', 'Taux d\'intérêt', 'Inflation'] },
        }
      }
    }
  },
  accounting: {
    id: 'accounting',
    label: 'Comptabilité',
    bundles: {
      generale: {
        id: 'generale',
        label: 'Comptabilité générale',
        courses: {
          bilan: { id: 'bilan', label: 'Bilan', duration: '4h', lessons: ['Actif', 'Passif', 'Capitaux propres', 'Équilibre'] },
          resultat: { id: 'resultat', label: 'Compte de résultat', duration: '3h', lessons: ['Charges', 'Produits', 'Résultat net'] },
        }
      }
    }
  }
};

export function CleanHomeHero({
  userName = 'Yassine',
  onCourseSelect,
  onDocumentUpload,
  onAddToFavorites,
  className = '',
  compact = false
}: CleanHomeHeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle favorite and notify parent
  const toggleFavorite = (trackId: string, track?: { id: string; title: string; subtitle: string; lessons: number; duration: string }) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(trackId)) {
        newFavorites.delete(trackId);
      } else {
        newFavorites.add(trackId);
        // Notify parent to add to "Learning tracks conçus pour toi"
        if (track && onAddToFavorites) {
          onAddToFavorites(track);
        }
      }
      return newFavorites;
    });
  };

  // Generate mock learning tracks based on selection
  const getMatchingTracks = () => {
    if (!currentProgram || !currentBundle || !currentCourse) return [];
    
    const tracks = [
      {
        id: `${currentCourse.id}-main`,
        title: currentCourse.label,
        subtitle: `${currentProgram.label} • ${currentBundle.label}`,
        lessons: currentCourse.lessons.length,
        duration: currentCourse.duration,
        progress: Math.floor(Math.random() * 100),
        isNew: Math.random() > 0.7,
      },
      {
        id: `${currentCourse.id}-advanced`,
        title: `${currentCourse.label} - Avancé`,
        subtitle: `${currentProgram.label} • ${currentBundle.label}`,
        lessons: currentCourse.lessons.length + 2,
        duration: `${parseInt(currentCourse.duration) + 2}h`,
        progress: 0,
        isNew: true,
      },
      {
        id: `${currentCourse.id}-exercices`,
        title: `Exercices : ${currentCourse.label}`,
        subtitle: `${currentProgram.label} • Entraînement`,
        lessons: Math.floor(currentCourse.lessons.length * 1.5),
        duration: `${parseInt(currentCourse.duration) + 1}h`,
        progress: Math.floor(Math.random() * 50),
        isNew: false,
      },
    ];

    // If a specific lesson is selected, add it to context
    if (selectedLesson) {
      tracks.unshift({
        id: `${currentCourse.id}-${selectedLesson}`,
        title: selectedLesson,
        subtitle: `${currentCourse.label} • ${currentBundle.label}`,
        lessons: 1,
        duration: '45min',
        progress: 0,
        isNew: true,
      });
    }

    return tracks;
  };

  // Search EPILS index
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const results: Array<{ key: string; data: typeof EPILS_INDEX[string]; courseLabel: string }> = [];
    
    Object.entries(EPILS_INDEX).forEach(([key, data]) => {
      if (key.includes(query) || data.notion.toLowerCase().includes(query)) {
        const program = PROGRAMS[data.programId as keyof typeof PROGRAMS];
        const bundle = program?.bundles[data.bundleId as keyof typeof program.bundles];
        const course = bundle?.courses[data.courseId as keyof typeof bundle.courses];
        if (course) {
          results.push({ key, data, courseLabel: course.label });
        }
      }
    });
    
    return results.slice(0, 5);
  }, [searchQuery]);

  // Handle search result click - auto-fill cascade
  const handleSearchResultClick = (result: typeof searchResults[0]) => {
    setSelectedProgram(result.data.programId);
    setSelectedBundle(result.data.bundleId);
    setSelectedCourse(result.data.courseId);
    setSearchQuery('');
  };

  // Get current selections
  const currentProgram = selectedProgram ? PROGRAMS[selectedProgram as keyof typeof PROGRAMS] : null;
  const currentBundle = currentProgram && selectedBundle 
    ? currentProgram.bundles[selectedBundle as keyof typeof currentProgram.bundles] 
    : null;
  const currentCourse = currentBundle && selectedCourse 
    ? currentBundle.courses[selectedCourse as keyof typeof currentBundle.courses] 
    : null;

  // Determine which level of pills to show
  const getCurrentLevel = () => {
    if (!selectedProgram) return 'programs';
    if (!selectedBundle) return 'bundles';
    if (!selectedCourse) return 'courses';
    if (!selectedLesson && !showResults) return 'lessons';
    return 'results';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onDocumentUpload) {
      onDocumentUpload();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const currentLevel = getCurrentLevel();

  // Build path text for display
  const getPathText = () => {
    const parts: string[] = [];
    if (currentProgram) parts.push(currentProgram.label);
    if (currentBundle) parts.push(currentBundle.label);
    if (currentCourse) parts.push(currentCourse.label);
    if (selectedLesson) parts.push(selectedLesson);
    return parts.join('  ›  ');
  };

  const pathText = getPathText();
  const matchingTracks = getMatchingTracks();

  // Compact mode - only search bar
  if (compact) {
    return (
      <div className={`w-full ${className}`}>
        <div 
          className={`relative bg-white rounded-2xl border-2 transition-all duration-300 ${
            isFocused 
              ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
              : 'border-gray-200 shadow-md hover:shadow-lg'
          }`}
        >
          <div className="flex items-center gap-3 px-5 py-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              title="Importer un document (syllabus, énoncé, notes)"
              aria-label="Importer un document (syllabus, énoncé, notes)"
            >
              <Paperclip size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex-1 flex items-center">
              {pathText ? (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-gray-900 text-sm font-medium truncate">{pathText}</span>
              <button 
                onClick={() => {
                  setSelectedProgram(null);
                  setSelectedBundle(null);
                  setSelectedCourse(null);
                  setSelectedLesson(null);
                  setShowResults(false);
                }}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X size={14} />
              </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Un concept, une difficulté, un point précis (Gauss, intégrales, Pythagore…)"
                  className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                />
              )}
            </div>
            
            <button
              onClick={() => {
                if (pathText && selectedProgram) {
                  setShowResults(true);
                } else {
                  handleSearch();
                }
              }}
              disabled={!searchQuery.trim() && !pathText}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all flex-shrink-0 ${
                searchQuery.trim() || pathText
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
              title="Créer mon learning track"
              aria-label="Créer mon learning track"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      {/* Header - Parafina fonts */}
      <div className="text-center mb-5 w-full">
        <p 
          className="font-title tracking-wide mb-1"
          style={{ 
            fontSize: '24px',
            color: '#111827'
          }}
        >
          Bonjour {userName},
        </p>
        <h1 
          className="font-title tracking-tight mb-3"
          style={{ 
            fontSize: '48px',
            color: '#111827',
            lineHeight: 1.0
          }}
        >
          Des parcours d&apos;apprentissage,<br />
          portés par une communauté.
        </h1>
        <p className="max-w-4xl mx-auto" style={{ fontSize: '18px', lineHeight: 1.5, color: '#111827' }}>
          Recherche un concept précis et avance avec des étudiants sur le même sujet.
        </p>
      </div>

      {/* Search Bar with integrated import button - 10% smaller */}
      <div 
        className={`relative bg-white rounded-xl border-2 transition-all duration-300 max-w-2xl mx-auto ${
          isFocused 
            ? 'border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.35)]' 
            : 'border-gray-200 shadow-md hover:shadow-lg'
        }`}
      >
        <div className="px-5 pt-4 pb-3">
          {/* Path text or input */}
          {pathText ? (
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-900 font-medium truncate">{pathText}</span>
              <button 
                onClick={() => {
                  setSelectedProgram(null);
                  setSelectedBundle(null);
                  setSelectedCourse(null);
                  setSelectedLesson(null);
                  setShowResults(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Un concept, une difficulté, un point précis (Gauss, intégrales, Pythagore…)"
              className="w-full text-lg text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          )}
        </div>

        <div className="flex items-center justify-between px-5 pb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Importer un document (syllabus, énoncé, notes)"
            aria-label="Importer un document (syllabus, énoncé, notes)"
          >
            <Paperclip size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => {
              if (pathText && selectedProgram) {
                setShowResults(true);
              } else {
                handleSearch();
              }
            }}
            disabled={!searchQuery.trim() && !pathText}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
              searchQuery.trim() || pathText
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
            title="Créer mon learning track"
            aria-label="Créer mon learning track"
          >
            <ArrowUp size={18} />
          </button>
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {searchResults.length > 0 && !pathText && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
            >
              {searchResults.map((result, index) => (
                <button
                  key={result.key}
                  onClick={() => handleSearchResultClick(result)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    index > 0 ? 'border-t border-gray-100' : ''
                  }`}
                >
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{result.courseLabel}</p>
                    <p className="text-gray-500 text-xs">Notion : {result.data.notion}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Single Level of Pills - Full width */}
      <div className="mt-8 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Level 1: Programmes */}
          {currentLevel === 'programs' && (
            <motion.div
              key="programs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap justify-center gap-2.5"
            >
              {Object.values(PROGRAMS).map((program) => (
                <button
                  key={program.id}
                  onClick={() => setSelectedProgram(program.id)}
                  className="px-5 py-2.5 rounded-full text-base font-medium bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all duration-200"
                >
                  {program.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Level 2: Bundles */}
          {currentLevel === 'bundles' && currentProgram && (
            <motion.div
              key="bundles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap justify-center gap-2.5"
            >
              {Object.values(currentProgram.bundles).map((bundle) => (
                <button
                  key={bundle.id}
                  onClick={() => setSelectedBundle(bundle.id)}
                  className="px-5 py-2.5 rounded-full text-base font-medium bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  {bundle.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Level 3: Courses - Pills style */}
          {currentLevel === 'courses' && currentBundle && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap justify-center gap-2.5"
            >
              {Object.values(currentBundle.courses).map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className="px-5 py-2.5 rounded-full text-base font-medium bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all duration-200"
                >
                  {course.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Level 4: Lessons - Pills style */}
          {currentLevel === 'lessons' && currentCourse && (
            <motion.div
              key="lessons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap justify-center gap-2.5"
            >
              {currentCourse.lessons.map((lesson) => (
                <button
                  key={lesson}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setShowResults(true);
                  }}
                  className="px-5 py-2.5 rounded-full text-base font-medium bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all duration-200"
                >
                  {lesson}
                </button>
              ))}
            </motion.div>
          )}

          {/* Level 5: Results - Learning Tracks */}
          {currentLevel === 'results' && showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-7xl mx-auto"
            >
              <p className="text-center text-sm text-gray-500 mb-6">
                {matchingTracks.length} learning tracks trouvés · <span className="text-gray-400">Clique sur ❤️ pour ajouter à tes favoris</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {matchingTracks.map((track) => (
                  <div key={track.id} className="flex flex-col">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative bg-gradient-to-br from-[#1a1f25] to-[#0d1117] rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 h-[220px]"
                      onClick={() => onCourseSelect?.(track.id)}
                    >
                      {/* Top gradient area */}
                      <div className="h-24 bg-gradient-to-br from-gray-700/50 to-gray-800/50 relative">
                        {/* Favorite button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(track.id, track);
                          }}
                          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
                            favorites.has(track.id) 
                              ? 'bg-red-500/20 hover:bg-red-500/30' 
                              : 'bg-black/40 hover:bg-black/60'
                          }`}
                        >
                          <Heart 
                            size={18} 
                            className={favorites.has(track.id) ? 'fill-red-500 text-red-500' : 'text-white/80 hover:text-white'} 
                          />
                        </button>

                        {/* New badge */}
                        {track.isNew && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                            Nouveau
                          </span>
                        )}

                        {/* Liked badge */}
                        {favorites.has(track.id) && (
                          <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
                            ❤️ Ajouté aux favoris
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col justify-between h-[124px]">
                        <div>
                          <h3 className="font-semibold text-base mb-1 group-hover:text-cyan-300 transition-colors line-clamp-2 h-[48px]" style={{ color: '#FFFFFF' }}>
                            {track.title}
                          </h3>
                          <p className="text-sm line-clamp-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            {track.subtitle}
                          </p>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          <span className="flex items-center gap-1">
                            <BookOpen size={12} />
                            {track.lessons} leçons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {track.duration}
                          </span>
                        </div>
                      </div>

                      {/* Bottom progress bar as border */}
                      {track.progress > 0 ? (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/60">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
                            style={{ width: `${track.progress}%` }}
                          />
                        </div>
                      ) : (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                      )}
                    </motion.div>
                    
                    {/* Progress text below card */}
                    {track.progress > 0 ? (
                      <p className="text-center text-sm text-gray-500 mt-2 h-5">
                        <span className="font-medium text-cyan-500">{track.progress}%</span> complété
                      </p>
                    ) : (
                      <div className="h-5 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
