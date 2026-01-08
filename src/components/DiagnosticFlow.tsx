'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Search,
  Clock, 
  Target,
  Sparkles,
  GraduationCap,
  AlertCircle,
  Zap,
  Trophy,
  Upload,
  FileText,
  MessageCircle,
  SkipForward,
  Loader2,
  ArrowLeft,
  Layers,
  Compass,
  Heart,
  Lock,
  PenTool,
  MoreHorizontal
} from 'lucide-react';

// Icon mapping for struggle options
const STRUGGLE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Layers,
  Clock,
  Compass,
  Heart,
  Lock,
  PenTool,
  MoreHorizontal
};

interface DiagnosticFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: DiagnosticData) => void;
}

interface DiagnosticData {
  educationLevel: 'school' | 'higher-education';
  school: string;
  goal: string;
  struggles: string[];
  blockingPoints: string[];
  recommendedLevel: 'beginner' | 'intermediate' | 'advanced';
  prescribedPrograms: string[];
}

// Options pour le niveau d'étude
const EDUCATION_LEVEL_OPTIONS = [
  { 
    id: 'school', 
    label: 'École secondaire', 
    description: 'Collège, Lycée, Athénée...',
    icon: '🏫'
  },
  { 
    id: 'higher-education', 
    label: 'Enseignement supérieur', 
    description: 'Université, Haute École, Bachelor...',
    icon: '🎓'
  }
];
  
// Mock database of schools
const SCHOOLS_DATABASE = [
  'Université Libre de Bruxelles (ULB)',
  'UCLouvain',
  'Université de Liège (ULiège)',
  'Université de Namur',
  'Université de Mons (UMONS)',
  'VUB - Vrije Universiteit Brussel',
  'KU Leuven',
  'Université Saint-Louis',
  'ICHEC Brussels Management School',
  'Solvay Brussels School',
  'EPHEC',
  'Haute École Léonard de Vinci',
  'Haute École de Bruxelles (HEB)',
  'HELB Ilya Prigogine',
  'Haute École Condorcet',
  'HELHa',
  'Autre établissement'
];

// Nouveaux objectifs
const GOAL_OPTIONS = [
  { 
    id: 'save-time', 
    label: 'Tu veux gagner du temps dans tes études', 
    description: 'Optimiser ton apprentissage et être plus efficace',
    icon: Clock,
    color: 'blue'
  },
  { 
    id: 'overcome', 
    label: 'Tu veux t\'en sortir malgré des difficultés actuelles', 
    description: 'Surmonter les obstacles et reprendre confiance',
    icon: Target,
    color: 'amber'
  },
  { 
    id: 'excel', 
    label: 'Tu veux être ultra-performant et premier de ta promotion', 
    description: 'Viser l\'excellence et te démarquer',
    icon: Trophy,
    color: 'rose'
  }
];

const STRUGGLE_OPTIONS = [
  { id: 'too-much', label: 'Trop de matière', description: 'Je ne sais pas par où commencer ni comment prioriser', icon: 'Layers' },
  { id: 'no-time', label: 'Manque de temps', description: 'Pas assez de temps pour tout réviser avant l\'examen', icon: 'Clock' },
  { id: 'no-method', label: 'Pas la bonne méthode', description: 'Je révise mais je ne retiens pas ou je ne progresse pas', icon: 'Compass' },
  { id: 'no-confidence', label: 'Manque de confiance', description: 'Je doute de mes capacités et je stresse facilement', icon: 'Heart' },
  { id: 'specific-topic', label: 'Blocages précis', description: 'Je bloque sur des chapitres ou notions spécifiques', icon: 'Lock' },
  { id: 'exercises', label: 'Exercices difficiles', description: 'Je comprends le cours mais je rate les exercices', icon: 'PenTool' },
  { id: 'other', label: 'Autre', description: '', icon: 'MoreHorizontal' }
];

// Programmes avec leurs topics et notions
const DIAGNOSTIC_PROGRAMS = [
  { id: 'physics', label: 'Physique' },
  { id: 'math', label: 'Mathématiques' },
  { id: 'chemistry', label: 'Chimie' },
  { id: 'biology', label: 'Biologie' },
  { id: 'economics', label: 'Économie' },
  { id: 'informatics', label: 'Informatique' },
];

const DIAGNOSTIC_TOPICS: Record<string, string[]> = {
  physics: ['Électrostatique', 'Mécanique', 'Thermodynamique', 'Optique', 'Électromagnétisme', 'Ondes'],
  math: ['Analyse', 'Algèbre linéaire', 'Probabilités', 'Statistiques', 'Géométrie', 'Équations différentielles'],
  chemistry: ['Chimie organique', 'Chimie générale', 'Chimie analytique', 'Biochimie', 'Chimie physique'],
  biology: ['Biologie cellulaire', 'Génétique', 'Physiologie', 'Écologie', 'Microbiologie'],
  economics: ['Microéconomie', 'Macroéconomie', 'Comptabilité', 'Finance', 'Statistiques économiques'],
  informatics: ['Programmation', 'Algorithmes', 'Bases de données', 'Réseaux', 'Systèmes d\'exploitation'],
};

const DIAGNOSTIC_NOTIONS: Record<string, { id: string; label: string; topic: string; program: string }[]> = {
  physics: [
    { id: 'coulomb', label: 'Loi de Coulomb', topic: 'Électrostatique', program: 'physics' },
    { id: 'champ-elec', label: 'Champ électrique', topic: 'Électrostatique', program: 'physics' },
    { id: 'potentiel', label: 'Potentiel électrique', topic: 'Électrostatique', program: 'physics' },
    { id: 'newton', label: 'Lois de Newton', topic: 'Mécanique', program: 'physics' },
    { id: 'cinematique', label: 'Cinématique', topic: 'Mécanique', program: 'physics' },
    { id: 'energie-meca', label: 'Énergie mécanique', topic: 'Mécanique', program: 'physics' },
    { id: 'thermo1', label: 'Premier principe', topic: 'Thermodynamique', program: 'physics' },
    { id: 'thermo2', label: 'Second principe', topic: 'Thermodynamique', program: 'physics' },
    { id: 'gaz-parfaits', label: 'Gaz parfaits', topic: 'Thermodynamique', program: 'physics' },
  ],
  math: [
    { id: 'derivees', label: 'Dérivées', topic: 'Analyse', program: 'math' },
    { id: 'integrales', label: 'Intégrales', topic: 'Analyse', program: 'math' },
    { id: 'limites', label: 'Limites', topic: 'Analyse', program: 'math' },
    { id: 'matrices', label: 'Matrices', topic: 'Algèbre linéaire', program: 'math' },
    { id: 'espaces-vec', label: 'Espaces vectoriels', topic: 'Algèbre linéaire', program: 'math' },
    { id: 'determinants', label: 'Déterminants', topic: 'Algèbre linéaire', program: 'math' },
    { id: 'probas', label: 'Probabilités', topic: 'Probabilités', program: 'math' },
    { id: 'stats-desc', label: 'Statistiques descriptives', topic: 'Statistiques', program: 'math' },
  ],
  chemistry: [
    { id: 'reactions-orga', label: 'Réactions organiques', topic: 'Chimie organique', program: 'chemistry' },
    { id: 'stereochimie', label: 'Stéréochimie', topic: 'Chimie organique', program: 'chemistry' },
    { id: 'liaisons', label: 'Liaisons chimiques', topic: 'Chimie générale', program: 'chemistry' },
    { id: 'equilibres', label: 'Équilibres chimiques', topic: 'Chimie générale', program: 'chemistry' },
    { id: 'acides-bases', label: 'Acides et bases', topic: 'Chimie analytique', program: 'chemistry' },
  ],
  biology: [
    { id: 'cellule', label: 'Structure cellulaire', topic: 'Biologie cellulaire', program: 'biology' },
    { id: 'mitose', label: 'Mitose et méiose', topic: 'Biologie cellulaire', program: 'biology' },
    { id: 'adn', label: 'ADN et réplication', topic: 'Génétique', program: 'biology' },
    { id: 'genetique-pop', label: 'Génétique des populations', topic: 'Génétique', program: 'biology' },
  ],
  economics: [
    { id: 'offre-demande', label: 'Offre et demande', topic: 'Microéconomie', program: 'economics' },
    { id: 'elasticite', label: 'Élasticité', topic: 'Microéconomie', program: 'economics' },
    { id: 'pib', label: 'PIB et croissance', topic: 'Macroéconomie', program: 'economics' },
    { id: 'inflation', label: 'Inflation', topic: 'Macroéconomie', program: 'economics' },
  ],
  informatics: [
    { id: 'variables', label: 'Variables et types', topic: 'Programmation', program: 'informatics' },
    { id: 'boucles', label: 'Boucles et conditions', topic: 'Programmation', program: 'informatics' },
    { id: 'tri', label: 'Algorithmes de tri', topic: 'Algorithmes', program: 'informatics' },
    { id: 'complexite', label: 'Complexité algorithmique', topic: 'Algorithmes', program: 'informatics' },
  ],
};

// Mapping pour l'analyse IA des documents
const NOTION_KEYWORDS: Record<string, string[]> = {
  'coulomb': ['coulomb', 'charge électrique', 'force électrostatique'],
  'champ-elec': ['champ électrique', 'lignes de champ', 'vecteur champ'],
  'potentiel': ['potentiel électrique', 'différence de potentiel', 'voltage', 'volt'],
  'newton': ['newton', 'force', 'accélération', 'masse', 'f=ma'],
  'cinematique': ['cinématique', 'vitesse', 'position', 'mouvement'],
  'energie-meca': ['énergie mécanique', 'énergie cinétique', 'énergie potentielle'],
  'thermo1': ['premier principe', 'conservation énergie', 'thermodynamique'],
  'thermo2': ['second principe', 'entropie', 'carnot'],
  'gaz-parfaits': ['gaz parfait', 'pv=nrt', 'équation état'],
  'derivees': ['dérivée', 'dérivation', 'taux de variation'],
  'integrales': ['intégrale', 'primitive', 'intégration'],
  'limites': ['limite', 'convergence', 'tend vers'],
  'matrices': ['matrice', 'matrices', 'déterminant'],
  'espaces-vec': ['espace vectoriel', 'vecteur', 'base'],
  'determinants': ['déterminant', 'det', 'cofacteur'],
  'probas': ['probabilité', 'événement', 'aléatoire'],
  'stats-desc': ['statistique', 'moyenne', 'écart-type', 'variance'],
  'reactions-orga': ['réaction organique', 'substitution', 'élimination', 'addition'],
  'stereochimie': ['stéréochimie', 'chiralité', 'énantiomère', 'diastéréoisomère'],
  'liaisons': ['liaison chimique', 'covalente', 'ionique'],
  'equilibres': ['équilibre chimique', 'constante équilibre', 'le chatelier'],
  'acides-bases': ['acide', 'base', 'ph', 'pka'],
  'cellule': ['cellule', 'membrane', 'cytoplasme', 'organite'],
  'mitose': ['mitose', 'méiose', 'division cellulaire'],
  'adn': ['adn', 'réplication', 'double hélice', 'nucléotide'],
  'genetique-pop': ['génétique population', 'hardy-weinberg', 'allèle'],
  'offre-demande': ['offre', 'demande', 'prix équilibre', 'marché'],
  'elasticite': ['élasticité', 'élasticité prix', 'élasticité demande'],
  'pib': ['pib', 'produit intérieur brut', 'croissance'],
  'inflation': ['inflation', 'déflation', 'indice prix'],
  'variables': ['variable', 'type', 'déclaration', 'int', 'string'],
  'boucles': ['boucle', 'for', 'while', 'if', 'condition'],
  'tri': ['tri', 'quicksort', 'mergesort', 'bubblesort'],
  'complexite': ['complexité', 'big o', 'o(n)', 'algorithme'],
};

export default function DiagnosticFlow({ isOpen, onClose, onComplete }: DiagnosticFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [showSchoolResults, setShowSchoolResults] = useState(false);
  
  // Upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filtres pour l'étape matières
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | null>(null);
  const [notionSearch, setNotionSearch] = useState('');
  
  const [formData, setFormData] = useState<Partial<DiagnosticData>>({
    educationLevel: undefined,
    school: '',
    goal: '',
    struggles: [],
    blockingPoints: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter schools based on search
  const filteredSchools = SCHOOLS_DATABASE.filter(school =>
    school.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  // Total steps (5 étapes: profil, objectif, difficultés, documents, sujets)
  const TOTAL_STEPS = 5;
  
  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setFormData({
        educationLevel: undefined,
        school: '',
        goal: '',
        struggles: [],
        blockingPoints: [],
      });
      setSchoolSearch('');
      setErrors({});
      setUploadedFiles([]);
      setSelectedProgram(null);
      setSelectedTopicFilter(null);
      setNotionSearch('');
    }
  }, [isOpen]);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Profil = niveau d'études (obligatoire) + établissement (optionnel)
        if (!formData.educationLevel) newErrors.educationLevel = 'Sélectionne ton niveau d\'études';
        // School is now optional, no validation needed
        break;
      // Steps 1, 2, 3 are all optional (can be skipped)
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < TOTAL_STEPS - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Complete the diagnostic
        const recommendedLevel = formData.goal === 'excel' ? 'advanced' : 'intermediate';
        
        // Récupérer tous les programmes des notions sélectionnées
        const allNotions = Object.values(DIAGNOSTIC_NOTIONS).flat();
        const selectedPrograms = formData.blockingPoints?.map(notionId => {
          const notion = allNotions.find(n => n.id === notionId);
          return notion?.program;
        }).filter(Boolean) as string[] || ['physics'];
        
        // Dédupliquer les programmes
        const uniquePrograms = [...new Set(selectedPrograms)];
        
        onComplete({
          ...formData as DiagnosticData,
          recommendedLevel,
          prescribedPrograms: uniquePrograms.length > 0 ? uniquePrograms : ['physics']
        });
      }
    }
  };

  const handleSkip = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete without this step's data
      handleNext();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleStruggle = (id: string) => {
    const current = formData.struggles || [];
    if (current.includes(id)) {
      setFormData({ ...formData, struggles: current.filter(s => s !== id) });
    } else {
      setFormData({ ...formData, struggles: [...current, id] });
    }
  };

  const toggleBlockingPoint = (id: string) => {
    const current = formData.blockingPoints || [];
    if (current.includes(id)) {
      setFormData({ ...formData, blockingPoints: current.filter(p => p !== id) });
    } else {
      setFormData({ ...formData, blockingPoints: [...current, id] });
    }
  };

  // Analyse IA simulée des documents
  const analyzeDocument = async (file: File): Promise<string[]> => {
    // Simuler un délai d'analyse
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Pour la démo, on simule une analyse basée sur le nom du fichier
    const fileName = file.name.toLowerCase();
    const detectedNotions: string[] = [];
    
    // Chercher des mots-clés dans le nom du fichier
    Object.entries(NOTION_KEYWORDS).forEach(([notionId, keywords]) => {
      if (keywords.some(keyword => fileName.includes(keyword.toLowerCase()))) {
        detectedNotions.push(notionId);
      }
    });
    
    // Si aucune notion détectée, en ajouter quelques-unes aléatoirement pour la démo
    if (detectedNotions.length === 0) {
      const allNotionIds = Object.values(DIAGNOSTIC_NOTIONS).flat().map(n => n.id);
      const randomCount = Math.floor(Math.random() * 3) + 2; // 2-4 notions
      for (let i = 0; i < randomCount && i < allNotionIds.length; i++) {
        const randomIndex = Math.floor(Math.random() * allNotionIds.length);
        if (!detectedNotions.includes(allNotionIds[randomIndex])) {
          detectedNotions.push(allNotionIds[randomIndex]);
        }
      }
    }
    
    return detectedNotions;
  };

  // File upload handlers avec analyse IA
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 10));
      
      // Lancer l'analyse IA
      setIsAnalyzing(true);
      
      try {
        // Analyser chaque fichier et collecter les notions détectées
        const allDetectedNotions: string[] = [];
        for (const file of newFiles) {
          const detected = await analyzeDocument(file);
          allDetectedNotions.push(...detected);
        }
        
        // Ajouter les notions détectées aux blockingPoints (sans doublons)
        const currentPoints = formData.blockingPoints || [];
        const newPoints = [...new Set([...currentPoints, ...allDetectedNotions])];
        setFormData({ ...formData, blockingPoints: newPoints });
        
        // Auto-sélectionner le programme correspondant à la première notion détectée
        if (allDetectedNotions.length > 0) {
          const allNotions = Object.values(DIAGNOSTIC_NOTIONS).flat();
          const firstNotion = allNotions.find(n => n.id === allDetectedNotions[0]);
          if (firstNotion) {
            setSelectedProgram(firstNotion.program);
          }
        }
      } catch (error) {
        console.error('Error analyzing documents:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const selectSchool = (school: string) => {
    setFormData({ ...formData, school });
    setSchoolSearch(school);
    setShowSchoolResults(false);
  };

  // Step content renderer
  const renderStep = () => {
    switch (currentStep) {
      // Step 0: Profil (niveau d'études obligatoire + établissement optionnel)
      case 0:
        return (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-10"
          >
            {/* Bloc 1 - Niveau d'études */}
            <div>
              <div className="text-center mb-8">
                <p 
                  className="font-title mb-3 leading-tight tracking-wide"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 44px)', color: '#FFFFFF' }}
                >
                  Bienvenue
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold !text-white mb-4 leading-tight">
                  Et si tu devenais quelqu&apos;un qui comprend vraiment ?
                </h2>
                <p className="!text-white text-base opacity-60">
                  2 min · Pas de test, pas de jugement — juste quelques questions.
                </p>
              </div>

              <div className="flex flex-col gap-4 max-w-xl mx-auto">
                {EDUCATION_LEVEL_OPTIONS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setFormData({ ...formData, educationLevel: level.id as 'school' | 'higher-education' })}
                    className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                      formData.educationLevel === level.id
                        ? 'border-[#00c2ff] bg-[#00c2ff]/10'
                        : 'border-gray-700 bg-[#1a1a1a] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-5xl">{level.icon}</span>
                      <div>
                        <h3 className="font-bold text-xl !text-white opacity-95">
                          {level.label}
                        </h3>
                        <p className="!text-white text-base opacity-80">{level.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {errors.educationLevel && (
                <p className="text-red-400 text-sm text-center flex items-center justify-center gap-1 mt-3">
                  <AlertCircle size={14} />
                  {errors.educationLevel}
                </p>
              )}
            </div>

            {/* Bloc 2 - Établissement (OPTIONNEL - affiché seulement après sélection du niveau) */}
            <AnimatePresence>
              {formData.educationLevel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold !text-white mb-2">
                      {formData.educationLevel === 'school'
                        ? 'Dans quelle école étudies-tu ?'
                        : 'Dans quel établissement étudies-tu ?'}
                    </h3>
                    <p className="!text-white text-sm opacity-80">
                      Optionnel - On personnalise tes recommandations à ton programme
                    </p>
                  </div>

                  <div className="relative max-w-md mx-auto">
                    {formData.educationLevel === 'school' ? (
                      // Saisie manuelle pour école secondaire
                      <input
                        type="text"
                        value={formData.school || ''}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        placeholder="Tape le nom de ton école (optionnel)..."
                        className="w-full px-4 py-4 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#00c2ff] transition-colors"
                      />
                    ) : (
                      // Recherche pour enseignement supérieur
                      <>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white opacity-60" size={20} />
                          <input
                            type="text"
                            value={schoolSearch}
                            onChange={(e) => {
                              setSchoolSearch(e.target.value);
                              setShowSchoolResults(true);
                            }}
                            onFocus={() => setShowSchoolResults(true)}
                            placeholder="Recherche ton université (optionnel)..."
                            className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#00c2ff] transition-colors"
                          />
                        </div>

                        {/* Search Results */}
                        <AnimatePresence>
                          {showSchoolResults && schoolSearch && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto"
                            >
                              {filteredSchools.length > 0 ? (
                                filteredSchools.map((school) => (
                                  <button
                                    key={school}
                                    onClick={() => selectSchool(school)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors !text-white ${
                                      formData.school === school ? 'bg-[#00c2ff]/20 opacity-100' : 'opacity-90'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <GraduationCap size={18} className="text-white opacity-60" />
                                      {school}
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-white opacity-70">
                                  Aucun résultat. Tape "Autre" pour continuer.
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}

                    {formData.school && (
                      <div className="mt-4 p-3 bg-[#00c2ff]/10 border border-[#00c2ff]/30 rounded-xl">
                        <div className="flex items-center gap-2 !text-white opacity-90">
                          <CheckCircle size={18} />
                          <span className="font-medium">{formData.school}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      // Step 1: Objectif (avec option skip)
      case 1:
        return (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold !text-white mb-3">
                Quel est ton objectif cette année ?
              </h2>
              <p className="!text-white/60 text-base max-w-lg mx-auto">
                On adapte l'intensité à ton objectif
              </p>
            </div>

            {/* Single column - stacked vertically */}
            <div className="flex flex-col gap-4 max-w-xl mx-auto">
              {GOAL_OPTIONS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = formData.goal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setFormData({ ...formData, goal: goal.id })}
                    className={`p-5 rounded-2xl border-2 transition-all text-left group ${
                      isSelected
                        ? 'border-[#00c2ff]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    style={{
                      backgroundColor: isSelected ? 'rgba(13, 19, 23, 0.95)' : 'rgba(255,255,255,0.02)',
                      boxShadow: isSelected ? 'inset 0 0 0 1px rgba(72,198,237,0.3)' : 'none'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon in rounded square */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{
                          backgroundColor: isSelected ? '#00c2ff' : 'rgba(255,255,255,0.05)'
                        }}
                      >
                        <Icon 
                          size={22} 
                          className={isSelected ? 'text-[#0d1317]' : 'text-white/60'} 
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 style={{ color: 'rgba(255,255,255,0.95)' }} className="font-semibold text-base mb-1">
                          {goal.label}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.65)' }} className="text-sm leading-relaxed">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Skip button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSkip}
                className="flex items-center gap-2 text-white/50 hover:text-white/80 text-sm font-medium transition-colors"
              >
                <SkipForward size={16} />
                Passer cette étape
              </button>
            </div>
          </motion.div>
        );

      // Step 2: Difficultés (avec option skip) - Loop-inspired design
      case 2:
        return (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold !text-white mb-3">
                Quels défis rencontres-tu actuellement ?
              </h2>
              <p className="!text-white/60 text-base max-w-lg mx-auto">
                Sélectionne tout ce qui te parle (plusieurs choix possibles)
              </p>
            </div>

            {/* Grid 2 columns - Loop style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {STRUGGLE_OPTIONS.map((struggle) => {
                const isSelected = formData.struggles?.includes(struggle.id);
                const IconComponent = STRUGGLE_ICONS[struggle.icon];
                const isOther = struggle.id === 'other';
                
                return (
                  <button
                    key={struggle.id}
                    onClick={() => toggleStruggle(struggle.id)}
                    className={`p-5 rounded-2xl border-2 transition-all text-left group ${
                      isSelected
                        ? 'border-[#00c2ff]'
                        : 'border-white/10 hover:border-white/20'
                    } ${isOther ? 'md:col-span-2 md:max-w-md md:mx-auto md:w-full' : ''}`}
                    style={{
                      backgroundColor: isSelected ? 'rgba(13, 19, 23, 0.95)' : 'rgba(255,255,255,0.02)',
                      boxShadow: isSelected ? 'inset 0 0 0 1px rgba(72,198,237,0.3)' : 'none'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon in rounded square */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{
                          backgroundColor: isSelected ? '#00c2ff' : 'rgba(255,255,255,0.05)'
                        }}
                      >
                        {IconComponent && (
                          <IconComponent 
                            size={22} 
                            className={isSelected ? 'text-[#0d1317]' : 'text-white/60'} 
                          />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 style={{ color: 'rgba(255,255,255,0.95)' }} className="font-semibold text-base">
                            {struggle.label}
                          </h3>
                          {isSelected && (
                            <CheckCircle size={18} className="text-[#00c2ff] flex-shrink-0" />
                          )}
                        </div>
                        {struggle.description && (
                          <p style={{ color: 'rgba(255,255,255,0.65)' }} className="text-sm leading-relaxed mt-1">
                            {struggle.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Skip button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSkip}
                className="flex items-center gap-2 text-white/50 hover:text-white/80 text-sm font-medium transition-colors"
              >
                <SkipForward size={16} />
                Passer cette étape
              </button>
            </div>
          </motion.div>
        );

      // Step 3: Import Documents - Clean and focused
      case 3:
        return (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8 max-w-xl mx-auto"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold !text-white mb-3">
                Importe tes cours ou exercices
              </h2>
              <p className="!text-white/60 text-base max-w-lg mx-auto">
                On analyse tes documents et on identifie tes points de blocage
              </p>
            </div>

            {/* Zone d'upload principale - grande et centrale */}
            <div 
              onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
                isAnalyzing 
                  ? 'border-[#00c2ff] bg-[#00c2ff]/10' 
                  : uploadedFiles.length > 0
                  ? 'border-[#00c2ff] bg-[#00c2ff]/5'
                  : 'border-white/20 hover:border-[#00c2ff] hover:bg-white/[0.02]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="flex flex-col items-center text-center">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors"
                  style={{
                    backgroundColor: isAnalyzing || uploadedFiles.length > 0 ? '#00c2ff' : 'rgba(255,255,255,0.05)'
                  }}
                >
                  {isAnalyzing ? (
                    <Loader2 className="text-[#0d1317] animate-spin" size={28} />
                  ) : (
                    <Upload 
                      size={28} 
                      className={isAnalyzing || uploadedFiles.length > 0 ? 'text-[#0d1317]' : 'text-white/60'} 
                    />
                  )}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.95)' }} className="font-semibold text-lg mb-2">
                  {isAnalyzing ? 'Analyse en cours...' : uploadedFiles.length > 0 ? `${uploadedFiles.length} fichier(s) sélectionné(s)` : 'Glisse tes fichiers ici'}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-sm">
                  {isAnalyzing 
                    ? 'Identification de tes points de blocage...' 
                    : 'PDF, Word, Images • Max 10 fichiers'}
                </p>
              </div>
            </div>

            {/* Liste des fichiers uploadés */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  >
                    <FileText size={14} className="text-[#00c2ff]" />
                    <span style={{ color: 'rgba(255,255,255,0.8)' }} className="text-sm truncate max-w-[150px]">
                      {file.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-white/40 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Skip button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSkip}
                className="flex items-center gap-2 text-white/50 hover:text-white/80 text-sm font-medium transition-colors"
              >
                <SkipForward size={16} />
                Je n'ai pas de documents
              </button>
            </div>
          </motion.div>
        );

      // Step 4: Manual Selection - Search and pick topics
      case 4:
        // Filtrer les notions selon le programme et topic sélectionnés
        const allNotions = Object.values(DIAGNOSTIC_NOTIONS).flat();
        const filteredNotions = allNotions.filter(notion => {
          // Filtre par programme
          if (selectedProgram && notion.program !== selectedProgram) return false;
          // Filtre par topic
          if (selectedTopicFilter && notion.topic !== selectedTopicFilter) return false;
          // Filtre par recherche
          if (notionSearch) {
            const searchLower = notionSearch.toLowerCase();
            return notion.label.toLowerCase().includes(searchLower) || 
                   notion.topic.toLowerCase().includes(searchLower);
          }
          return true;
        });

        // Topics disponibles pour le programme sélectionné
        const availableTopics = selectedProgram ? DIAGNOSTIC_TOPICS[selectedProgram] || [] : [];

        return (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold !text-white mb-3">
                Sur quels sujets veux-tu progresser ?
              </h2>
              <p className="!text-white/60 text-base max-w-lg mx-auto">
                Sélectionne les notions sur lesquelles tu souhaites t'améliorer
              </p>
            </div>

            {/* Barre de recherche */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une notion, un cours..."
                value={notionSearch}
                onChange={(e) => setNotionSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-[#00c2ff] focus:outline-none transition-colors text-base"
              />
            </div>

            {/* Ligne 1: Filtres Programmes */}
            <div className="flex flex-wrap gap-3 justify-center">
              {DIAGNOSTIC_PROGRAMS.map((program) => (
                <button
                  key={program.id}
                  onClick={() => {
                    setSelectedProgram(selectedProgram === program.id ? null : program.id);
                    setSelectedTopicFilter(null);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border ${
                    selectedProgram === program.id
                      ? 'bg-[#00c2ff] text-white border-[#00c2ff]'
                      : 'bg-[#1a1a1a] !text-white/90 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {program.label}
                </button>
              ))}
            </div>

            {/* Ligne 2: Filtres Topics (dynamique) */}
            <AnimatePresence>
              {selectedProgram && availableTopics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-wrap gap-2 justify-center"
                >
                  {availableTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopicFilter(selectedTopicFilter === topic ? null : topic)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        selectedTopicFilter === topic
                          ? 'bg-gray-100 text-gray-900 border-gray-100'
                          : 'bg-transparent !text-white/80 border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grille de notions filtrées */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[280px] overflow-y-auto px-1">
              {filteredNotions.length > 0 ? (
                filteredNotions.map((notion) => {
                  const isSelected = formData.blockingPoints?.includes(notion.id);
                  return (
                    <button
                      key={notion.id}
                      onClick={() => toggleBlockingPoint(notion.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'border-[#00c2ff]'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'rgba(13, 19, 23, 0.95)' : 'rgba(255,255,255,0.02)',
                        boxShadow: isSelected ? 'inset 0 0 0 1px rgba(72,198,237,0.3)' : 'none'
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <span style={{ color: 'rgba(255,255,255,0.95)' }} className="font-medium text-sm block truncate">
                          {notion.label}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs block truncate mt-0.5">
                          {notion.topic}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle size={18} className="text-[#00c2ff] flex-shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="!text-white/60">Aucune notion trouvée</p>
                  <p className="!text-white/40 text-sm mt-1">Essaie un autre filtre ou terme de recherche</p>
                </div>
              )}
            </div>

            {/* Compteur de sélection */}
            {formData.blockingPoints && formData.blockingPoints.length > 0 && (
              <div className="text-center">
                <span className="!text-white text-sm font-medium opacity-90 bg-[#00c2ff]/20 px-4 py-2 rounded-full">
                  {formData.blockingPoints.length} notion{formData.blockingPoints.length > 1 ? 's' : ''} sélectionnée{formData.blockingPoints.length > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Skip button */}
            <div className="text-center pt-2">
              <button
                onClick={handleSkip}
                className="text-white/60 hover:text-white/90 text-sm flex items-center gap-2 mx-auto transition-colors"
              >
                <SkipForward size={16} />
                Passer cette étape
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#0d1317] overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <header className="sticky top-0 bg-[#0d1317]/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Image 
              src="/brand/onboarding-logo.svg" 
              alt="Science Made Simple" 
              width={85} 
              height={85}
            />

            {/* Progress Steps - Simplifié */}
            <div className="flex items-center gap-2">
              {[
                { label: 'Profil', step: 0 },
                { label: 'Objectif', step: 1 },
                { label: 'Défis', step: 2 },
                { label: 'Documents', step: 3 },
                { label: 'Sujets', step: 4 }
              ].map((item, idx) => {
                const isCompleted = currentStep > item.step;
                const isCurrent = currentStep === item.step;
                
                return (
                  <React.Fragment key={item.label}>
                    {/* Dot */}
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className={`w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-[#00c2ff]' 
                            : isCurrent 
                              ? 'bg-[#00c2ff] ring-[4px] ring-[#00c2ff]/30' 
                              : 'bg-gray-600'
                        }`}
                        animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                      <span className={`text-[10px] md:text-xs mt-1.5 font-semibold hidden md:block !text-white ${
                        isCompleted || isCurrent ? 'opacity-100' : 'opacity-50'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    {/* Line connector */}
                    {idx < 4 && (
                      <div className={`w-6 md:w-12 h-1 rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-[#00c2ff]' : 'bg-gray-700'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="!text-white opacity-70 hover:opacity-100 transition-opacity"
            >
              <X size={24} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-4">
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="sticky bottom-0 left-0 right-0 p-4 md:p-6 bg-[#0d1317]/95 backdrop-blur-sm border-t border-gray-800">
          <div className="max-w-xl mx-auto space-y-5">
            {/* Progress Message */}
            <div className="flex items-center gap-4 bg-gray-800/80 backdrop-blur-sm rounded-2xl px-5 py-4">
              <div className="w-10 h-10 rounded-full bg-[#00c2ff]/20 flex items-center justify-center">
                <CheckCircle size={22} className="text-[#00c2ff]" />
              </div>
              <span className="text-white text-base md:text-lg font-medium">
                Tu es sur le point d'obtenir <span className="text-[#00c2ff]">10h de ton parcours offertes</span> !
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="w-14 h-14 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="flex-1 h-14 bg-gradient-to-r from-[#00c2ff] to-[#00a8e0] hover:from-[#00d4ff] hover:to-[#00c2ff] text-white font-bold text-lg rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#00c2ff]/25"
              >
                {currentStep === TOTAL_STEPS - 1 ? (
                  <>
                    <Sparkles size={22} />
                    Terminer
                  </>
                ) : (
                  <>
                    Continuer
                    <ChevronRight size={22} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bouton WhatsApp Fixe */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.open('https://wa.me/32477025622', '_blank')}
          className="fixed bottom-32 md:bottom-40 right-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-4 rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-105 font-medium text-base"
        >
          <MessageCircle size={22} className="flex-shrink-0" />
          <span>On t'écoute</span>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
