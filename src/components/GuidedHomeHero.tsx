'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  GraduationCap,
  Beaker,
  Calculator,
  BarChart3,
  Code,
  TrendingUp,
  Landmark,
  Check,
  X
} from 'lucide-react';

interface GuidedHomeHeroProps {
  userName?: string;
  onProgramSelect?: (programId: string) => void;
  onBundleSelect?: (bundleId: string, programId: string) => void;
  onCourseSelect?: (courseId: string, bundleId: string, programId: string) => void;
  onDocumentUpload?: (files: File[]) => void;
  className?: string;
}

// Structure: Programme → Bundle → Cours
const PROGRAMS = {
  math: {
    id: 'math',
    label: 'Mathématiques',
    icon: Calculator,
    color: 'from-blue-500 to-indigo-600',
    bundles: {
      'analyse': {
        id: 'analyse',
        label: 'Analyse',
        description: 'Maîtrise les fondamentaux du calcul',
        courses: ['Limites et continuité', 'Dérivation', 'Intégration', 'Séries numériques', 'Fonctions de plusieurs variables']
      },
      'algebre': {
        id: 'algebre', 
        label: 'Algèbre linéaire',
        description: 'Espaces vectoriels et applications',
        courses: ['Matrices et déterminants', 'Espaces vectoriels', 'Applications linéaires', 'Réduction des endomorphismes']
      },
      'probas': {
        id: 'probas',
        label: 'Probabilités',
        description: 'Modélisation et calcul probabiliste',
        courses: ['Événements et probabilités', 'Variables aléatoires', 'Lois discrètes', 'Lois continues']
      }
    }
  },
  physics: {
    id: 'physics',
    label: 'Physique',
    icon: Beaker,
    color: 'from-emerald-500 to-teal-600',
    bundles: {
      'mecanique': {
        id: 'mecanique',
        label: 'Mécanique',
        description: 'Du point matériel aux systèmes',
        courses: ['Cinématique', 'Dynamique du point', 'Énergie mécanique', 'Oscillations', 'Mécanique des fluides']
      },
      'thermo': {
        id: 'thermo',
        label: 'Thermodynamique',
        description: 'Énergie, chaleur et transformations',
        courses: ['Premier principe', 'Second principe', 'Machines thermiques', 'Changements d\'état']
      },
      'electromag': {
        id: 'electromag',
        label: 'Électromagnétisme',
        description: 'Charges, champs et ondes',
        courses: ['Électrostatique', 'Magnétostatique', 'Induction', 'Ondes électromagnétiques']
      }
    }
  },
  chemistry: {
    id: 'chemistry',
    label: 'Chimie',
    icon: Beaker,
    color: 'from-purple-500 to-pink-600',
    bundles: {
      'generale': {
        id: 'generale',
        label: 'Chimie générale',
        description: 'Structure et propriétés de la matière',
        courses: ['Structure atomique', 'Liaisons chimiques', 'Thermochimie', 'Cinétique chimique']
      },
      'organique': {
        id: 'organique',
        label: 'Chimie organique',
        description: 'Molécules du vivant et synthèse',
        courses: ['Nomenclature', 'Stéréochimie', 'Réactivité', 'Grandes fonctions']
      },
      'solutions': {
        id: 'solutions',
        label: 'Chimie des solutions',
        description: 'Équilibres et réactions en solution',
        courses: ['Acides et bases', 'Oxydoréduction', 'Précipitation', 'Complexation']
      }
    }
  },
  statistics: {
    id: 'statistics',
    label: 'Statistiques',
    icon: BarChart3,
    color: 'from-orange-500 to-red-600',
    bundles: {
      'descriptive': {
        id: 'descriptive',
        label: 'Statistiques descriptives',
        description: 'Résumer et visualiser les données',
        courses: ['Séries statistiques', 'Indicateurs de position', 'Indicateurs de dispersion', 'Représentations graphiques']
      },
      'inference': {
        id: 'inference',
        label: 'Inférence statistique',
        description: 'Estimer et tester des hypothèses',
        courses: ['Estimation', 'Tests d\'hypothèse', 'Intervalles de confiance', 'Régression']
      }
    }
  },
  informatics: {
    id: 'informatics',
    label: 'Informatique',
    icon: Code,
    color: 'from-cyan-500 to-blue-600',
    bundles: {
      'python': {
        id: 'python',
        label: 'Python',
        description: 'Programmation et algorithmique',
        courses: ['Syntaxe de base', 'Structures de données', 'Fonctions', 'POO', 'Librairies scientifiques']
      },
      'algo': {
        id: 'algo',
        label: 'Algorithmique',
        description: 'Résoudre des problèmes efficacement',
        courses: ['Complexité', 'Tri et recherche', 'Récursivité', 'Graphes']
      },
      'bdd': {
        id: 'bdd',
        label: 'Bases de données',
        description: 'Modélisation et requêtes SQL',
        courses: ['Modèle relationnel', 'SQL', 'Normalisation', 'Optimisation']
      }
    }
  },
  economics: {
    id: 'economics',
    label: 'Économie',
    icon: TrendingUp,
    color: 'from-amber-500 to-yellow-600',
    bundles: {
      'micro': {
        id: 'micro',
        label: 'Microéconomie',
        description: 'Comportement des agents économiques',
        courses: ['Consommateur', 'Producteur', 'Marchés', 'Concurrence']
      },
      'macro': {
        id: 'macro',
        label: 'Macroéconomie',
        description: 'Économie à l\'échelle nationale',
        courses: ['PIB et croissance', 'Inflation', 'Chômage', 'Politique économique']
      }
    }
  },
  accounting: {
    id: 'accounting',
    label: 'Comptabilité',
    icon: Landmark,
    color: 'from-slate-500 to-gray-600',
    bundles: {
      'generale': {
        id: 'generale',
        label: 'Comptabilité générale',
        description: 'Les fondamentaux de la comptabilité',
        courses: ['Bilan et compte de résultat', 'Écritures comptables', 'TVA', 'Clôture des comptes']
      },
      'analytique': {
        id: 'analytique',
        label: 'Comptabilité analytique',
        description: 'Analyse des coûts et performance',
        courses: ['Calcul des coûts', 'Méthodes de valorisation', 'Seuil de rentabilité', 'Budget']
      }
    }
  }
};

export function GuidedHomeHero({
  userName = 'Yassine',
  onProgramSelect,
  onBundleSelect,
  onCourseSelect,
  onDocumentUpload,
  className = ''
}: GuidedHomeHeroProps) {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentProgram = selectedProgram ? PROGRAMS[selectedProgram as keyof typeof PROGRAMS] : null;
  const currentBundle = selectedProgram && selectedBundle && currentProgram 
    ? currentProgram.bundles[selectedBundle as keyof typeof currentProgram.bundles] 
    : null;

  const handleProgramClick = (programId: string) => {
    if (selectedProgram === programId) {
      setSelectedProgram(null);
      setSelectedBundle(null);
    } else {
      setSelectedProgram(programId);
      setSelectedBundle(null);
      onProgramSelect?.(programId);
    }
  };

  const handleBundleClick = (bundleId: string) => {
    if (selectedBundle === bundleId) {
      setSelectedBundle(null);
    } else {
      setSelectedBundle(bundleId);
      if (selectedProgram) {
        onBundleSelect?.(bundleId, selectedProgram);
      }
    }
  };

  const handleCourseClick = (courseTitle: string) => {
    if (selectedProgram && selectedBundle) {
      onCourseSelect?.(courseTitle, selectedBundle, selectedProgram);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(newFiles);
      onDocumentUpload?.(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl text-center"
        >
          {/* ZONE 1: Headline */}
          <h2 
            className="font-title tracking-wide mb-2" 
            style={{ 
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              color: '#6b7280'
            }}
          >
            Bienvenue, {userName}
          </h2>
          
          <h1 
            className="font-title mb-4 tracking-wide"
            style={{ 
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              color: '#111827',
              lineHeight: 1.1
            }}
          >
            Qu&apos;est-ce qu&apos;on apprend aujourd&apos;hui ?
          </h1>
          
          <p className="text-base md:text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            Choisis un objectif. On te guide étape par étape.
          </p>

          {/* ZONE 2: CTA Principal - Upload Document */}
          <div className="mb-12">
            <motion.button
              onClick={() => setShowUploadModal(true)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-4 px-8 py-5 bg-gray-900 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Upload size={24} />
              </div>
              <div className="text-left">
                <span className="block">Importer mon cours</span>
                <span className="block text-sm text-gray-400 font-normal">PDF, syllabus, notes de cours...</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </motion.button>
            
            <p className="mt-4 text-sm text-gray-400">
              On analyse ton document et on te propose le bon parcours.
            </p>
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-4 mb-10 max-w-md mx-auto">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">ou choisis un parcours</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ZONE 3: Navigation guidée par pills */}
          <div className="flex flex-col items-center gap-6">
            
            {/* Niveau 1: Programmes */}
            <div className="flex flex-col items-center gap-3 w-full">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                Programme
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {Object.values(PROGRAMS).map((program) => {
                  const isSelected = selectedProgram === program.id;
                  const Icon = program.icon;
                  return (
                    <motion.button
                      key={program.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleProgramClick(program.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm ${
                        isSelected
                          ? 'bg-gray-900 text-white border-2 border-gray-900'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Icon size={16} className={isSelected ? 'text-white' : 'text-gray-500'} />
                      {program.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Niveau 2: Bundles */}
            <AnimatePresence>
              {selectedProgram && currentProgram && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-3 w-full overflow-hidden"
                >
                  <p className="text-xs uppercase tracking-wider font-semibold text-cyan-600">
                    Bundle
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {Object.values(currentProgram.bundles).map((bundle, index) => {
                      const isSelected = selectedBundle === bundle.id;
                      return (
                        <motion.button
                          key={bundle.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleBundleClick(bundle.id)}
                          className={`group flex flex-col items-start px-5 py-3 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-cyan-500 text-white border-2 border-cyan-500 shadow-lg'
                              : 'bg-white border-2 border-gray-200 text-gray-800 hover:border-cyan-300 hover:shadow-md'
                          }`}
                        >
                          <span className="font-semibold text-sm">{bundle.label}</span>
                          <span className={`text-xs ${isSelected ? 'text-cyan-100' : 'text-gray-500'}`}>
                            {bundle.description}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Niveau 3: Cours */}
            <AnimatePresence>
              {selectedProgram && selectedBundle && currentBundle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-3 w-full overflow-hidden"
                >
                  <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600">
                    Cours
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {currentBundle.courses.map((course: string, index: number) => (
                      <motion.button
                        key={course}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.05, backgroundColor: '#10b981', color: '#ffffff' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCourseClick(course)}
                        className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-full font-medium text-sm transition-all shadow-sm cursor-pointer hover:border-emerald-400"
                      >
                        {course}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* CTA pour commencer le bundle */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <GraduationCap size={18} />
                    Commencer {currentBundle.label}
                    <ChevronRight size={18} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Modal d'upload */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden w-full max-w-lg shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Importer un document</h3>
                    <p className="text-sm text-gray-500">PDF, Word, images...</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Drop Zone */}
              <div className="p-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-cyan-500 bg-cyan-50' 
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                  
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload size={28} className="text-gray-400" />
                  </div>
                  
                  <p className="text-gray-900 font-semibold mb-1">
                    Glisse ton fichier ici
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    ou clique pour parcourir
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <span className="px-2 py-1 bg-gray-100 rounded">PDF</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Word</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Images</span>
                  </div>
                </div>

                {/* Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <FileText size={18} className="text-gray-500" />
                        <span className="flex-1 text-sm text-gray-700 truncate">{file.name}</span>
                        <Check size={16} className="text-emerald-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <Sparkles size={14} className="inline mr-1" />
                  On analyse et on te propose le parcours adapté
                </p>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    if (uploadedFiles.length > 0) {
                      onDocumentUpload?.(uploadedFiles);
                    }
                  }}
                  disabled={uploadedFiles.length === 0}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    uploadedFiles.length > 0
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Analyser
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

