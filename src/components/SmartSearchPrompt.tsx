'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, ArrowUp, Mic, MicOff } from 'lucide-react';

interface SmartSearchPromptProps {
  onSearch: (query: string) => void;
  onUpload?: (files: File[]) => void;
  onProgramSelect?: (programId: string) => void;
  placeholder?: string;
  className?: string;
  userName?: string;
  compact?: boolean;
  darkMode?: boolean;
}

// Mastery Programs avec 3 niveaux: Programmes → Cours → Leçons
const MASTERY_PROGRAMS = {
  math: {
    id: 'math',
    label: 'Mathématiques',
    chapters: {
      'Analyse': ['Limites', 'Dérivées', 'Intégrales', 'Fonctions', 'Séries'],
      'Algèbre linéaire': ['Matrices', 'Déterminants', 'Espaces vectoriels', 'Applications linéaires'],
      'Probabilités': ['Événements', 'Lois discrètes', 'Lois continues', 'Variables aléatoires'],
      'Suites et séries': ['Suites numériques', 'Convergence', 'Séries entières'],
      'Équations différentielles': ['EDO 1er ordre', 'EDO 2nd ordre', 'Systèmes différentiels'],
      'Géométrie': ['Vecteurs', 'Droites et plans', 'Coniques', 'Transformations']
    }
  },
  physics: {
    id: 'physics',
    label: 'Physique',
    chapters: {
      'Mécanique': ['Cinématique', 'Dynamique', 'Énergie', 'Oscillations'],
      'Thermodynamique': ['1er principe', '2nd principe', 'Machines thermiques', 'Gaz parfaits'],
      'Électromagnétisme': ['Électrostatique', 'Magnétostatique', 'Induction', 'Ondes EM'],
      'Optique': ['Optique géométrique', 'Interférences', 'Diffraction', 'Polarisation'],
      'Ondes': ['Ondes mécaniques', 'Acoustique', 'Effet Doppler'],
      'Physique moderne': ['Relativité', 'Mécanique quantique', 'Physique nucléaire']
    }
  },
  chemistry: {
    id: 'chemistry',
    label: 'Chimie',
    chapters: {
      'Chimie générale': ['Structure atomique', 'Tableau périodique', 'Liaisons chimiques'],
      'Chimie organique': ['Alcanes', 'Alcènes', 'Fonctions organiques', 'Réactions'],
      'Thermochimie': ['Enthalpie', 'Entropie', 'Énergie libre', 'Équilibres'],
      'Cinétique': ['Vitesse de réaction', 'Ordre de réaction', 'Catalyse'],
      'Électrochimie': ['Oxydoréduction', 'Piles', 'Électrolyse', 'Corrosion'],
      'Chimie des solutions': ['Dissolution', 'pH', 'Titrages', 'Solubilité']
    }
  },
  statistics: {
    id: 'statistics',
    label: 'Statistiques',
    chapters: {
      'Statistiques descriptives': ['Moyenne', 'Médiane', 'Écart-type', 'Graphiques'],
      'Probabilités': ['Combinatoire', 'Probabilités conditionnelles', 'Bayes'],
      'Lois de distribution': ['Loi normale', 'Loi binomiale', 'Loi de Poisson'],
      'Tests d\'hypothèse': ['Test t', 'Test chi-carré', 'ANOVA'],
      'Régression': ['Régression linéaire', 'Corrélation', 'Régression multiple'],
      'Analyse de variance': ['ANOVA à un facteur', 'ANOVA à deux facteurs']
    }
  },
  informatics: {
    id: 'informatics',
    label: 'Informatique',
    chapters: {
      'Algorithmique': ['Complexité', 'Tri', 'Recherche', 'Récursivité'],
      'Python': ['Syntaxe', 'Fonctions', 'POO', 'Librairies'],
      'Structures de données': ['Listes', 'Arbres', 'Graphes', 'Tables de hachage'],
      'Bases de données': ['SQL', 'Modélisation', 'Normalisation', 'NoSQL'],
      'Réseaux': ['TCP/IP', 'HTTP', 'Sécurité', 'Cloud'],
      'Programmation web': ['HTML/CSS', 'JavaScript', 'React', 'APIs']
    }
  },
  economics: {
    id: 'economics',
    label: 'Économie',
    chapters: {
      'Microéconomie': ['Offre et demande', 'Élasticité', 'Consommateur', 'Producteur'],
      'Macroéconomie': ['PIB', 'Inflation', 'Chômage', 'Croissance'],
      'Économie internationale': ['Commerce', 'Balance des paiements', 'Taux de change'],
      'Politique monétaire': ['Banques centrales', 'Taux d\'intérêt', 'Masse monétaire'],
      'Marchés financiers': ['Actions', 'Obligations', 'Produits dérivés', 'Risque']
    }
  },
  accounting: {
    id: 'accounting',
    label: 'Comptabilité',
    chapters: {
      'Comptabilité générale': ['Bilan', 'Compte de résultat', 'Écritures', 'Clôture'],
      'Comptabilité analytique': ['Coûts', 'Marges', 'Seuil de rentabilité'],
      'Fiscalité': ['TVA', 'IS', 'IR', 'Déclarations'],
      'Audit': ['Contrôle interne', 'Procédures', 'Rapport d\'audit'],
      'Contrôle de gestion': ['Budget', 'Tableaux de bord', 'KPIs', 'Prévisions']
    }
  },
};

export function SmartSearchPrompt({
  onSearch,
  onUpload,
  onProgramSelect,
  placeholder = "Qu'est-ce que tu veux apprendre aujourd'hui ?",
  className = '',
  userName = 'Yassine',
  compact = false,
  darkMode = false,
}: SmartSearchPromptProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onUpload) {
      onUpload(Array.from(e.target.files));
    }
  };

  const handleProgramClick = (programId: string) => {
    // Toggle: si déjà sélectionné, désélectionner
    if (selectedProgram === programId) {
      setSelectedProgram(null);
      setSelectedChapter(null);
    } else {
      setSelectedProgram(programId);
      setSelectedChapter(null);
      if (onProgramSelect) {
        onProgramSelect(programId);
      }
    }
  };

  const handleChapterClick = (chapter: string) => {
    // Toggle: si déjà sélectionné, désélectionner
    if (selectedChapter === chapter) {
      setSelectedChapter(null);
    } else {
      setSelectedChapter(chapter);
    }
  };

  const handleLessonClick = (lesson: string) => {
    const program = selectedProgram ? MASTERY_PROGRAMS[selectedProgram as keyof typeof MASTERY_PROGRAMS] : null;
    const query = program && selectedChapter ? `${program.label} - ${selectedChapter} - ${lesson}` : lesson;
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition; SpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition || (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.lang = 'fr-FR';
          recognition.continuous = false;
          recognition.interimResults = false;
          
          recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            setIsRecording(false);
          };
          
          recognition.onerror = () => {
            setIsRecording(false);
          };
          
          recognition.onend = () => {
            setIsRecording(false);
          };
          
          recognition.start();
          setIsRecording(true);
        }
      } else {
        alert('La reconnaissance vocale n\'est pas supportée par votre navigateur.');
      }
    } else {
      setIsRecording(false);
    }
  };

  const currentProgram = selectedProgram ? MASTERY_PROGRAMS[selectedProgram as keyof typeof MASTERY_PROGRAMS] : null;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl text-center"
        >
          {/* Welcome */}
          <h2 
            className="font-title tracking-wide mb-2" 
            style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: darkMode ? '#ffffff' : '#111827'
            }}
          >
            Bienvenue, {userName}
          </h2>
          
          {/* Title */}
          <h1 
            className="font-title mb-3 tracking-wide"
            style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: darkMode ? '#ffffff' : '#111827',
              lineHeight: 1.1
            }}
          >
            Qu&apos;est-ce qu&apos;on apprend aujourd&apos;hui ?
          </h1>
          <p className={`text-base md:text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Décris ton objectif. On te génère un learning track sur mesure.
          </p>

          {/* Search Bar */}
          <div 
            className={`relative bg-white rounded-2xl border-2 transition-all duration-300 max-w-3xl mx-auto ${
              isFocused 
                ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]' 
                : 'border-gray-200 shadow-md hover:shadow-lg'
            }`}
          >
            <div className="px-8 pt-6 pb-5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="w-full text-xl text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>

            <div className="flex items-center justify-between px-7 pb-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="Importer un document"
              >
                <Paperclip size={22} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleVoiceRecording}
                  className={`w-11 h-11 flex items-center justify-center rounded-full transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                  title={isRecording ? 'Arrêter l\'enregistrement' : 'Dictée vocale'}
                >
                  {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                  className={`w-11 h-11 flex items-center justify-center rounded-full transition-all ${
                    searchQuery.trim()
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp size={22} />
                </button>
              </div>
            </div>
          </div>

          {/* Pills en cascade - 3 niveaux */}
          <div className="mt-10 flex flex-col items-center gap-4">
            {/* Niveau 1: Programmes (Mastery Programs) - Toujours visible */}
            <div className="flex flex-col items-center gap-2 w-full">
              <p className={`text-xs uppercase tracking-wider font-medium ${darkMode ? 'text-cyan-400' : 'text-gray-400'}`}>
                Programme
              </p>
              <div className="flex items-center justify-center gap-2 overflow-x-auto w-full pb-2">
                {Object.values(MASTERY_PROGRAMS).map((program) => {
                  const isSelected = selectedProgram === program.id;
                  return (
                    <motion.button
                      key={program.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleProgramClick(program.id)}
                      className={`px-5 py-2.5 text-sm whitespace-nowrap flex-shrink-0 ${
                        isSelected
                          ? (darkMode ? 'bg-white text-gray-900 border border-white' : 'bg-gray-900 text-white border border-gray-900')
                          : (darkMode 
                              ? 'bg-gray-800 border border-gray-700 hover:border-gray-500 text-white' 
                              : 'bg-white border border-gray-200 hover:border-gray-400 text-gray-800')
                      } rounded-full font-semibold transition-all shadow-sm`}
                    >
                      {program.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Niveau 2: Cours (Chapitres) - Apparaît quand un programme est sélectionné */}
            <AnimatePresence>
              {selectedProgram && currentProgram && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-2 w-full overflow-hidden"
                >
                  <p className={`text-xs uppercase tracking-wider font-medium ${darkMode ? 'text-cyan-400' : 'text-gray-400'}`}>
                    Cours
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {Object.keys(currentProgram.chapters).map((chapter, index) => {
                      const isChapterSelected = selectedChapter === chapter;
                      return (
                        <motion.button
                          key={chapter}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChapterClick(chapter)}
                          className={`px-4 py-2 text-sm ${
                            isChapterSelected
                              ? (darkMode ? 'bg-cyan-500 text-white border border-cyan-500' : 'bg-cyan-500 text-white border border-cyan-500')
                              : (darkMode 
                                  ? 'bg-gray-800 border border-gray-700 hover:border-gray-500 text-white' 
                                  : 'bg-white border border-gray-200 hover:border-gray-400 text-gray-800')
                          } rounded-full font-medium transition-all shadow-sm`}
                        >
                          {chapter}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Niveau 3: Leçons - Apparaît quand un cours est sélectionné */}
            <AnimatePresence>
              {selectedProgram && currentProgram && selectedChapter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-2 w-full overflow-hidden"
                >
                  <p className={`text-xs uppercase tracking-wider font-medium ${darkMode ? 'text-cyan-400' : 'text-gray-400'}`}>
                    Leçons
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {(currentProgram.chapters[selectedChapter as keyof typeof currentProgram.chapters] || []).map((lesson: string, index: number) => (
                      <motion.button
                        key={lesson}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.05, backgroundColor: darkMode ? '#22d3ee' : '#22d3ee' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLessonClick(lesson)}
                        className={`px-4 py-2 text-sm ${
                          darkMode 
                            ? 'bg-gray-700 border border-gray-600 hover:text-white text-gray-300' 
                            : 'bg-gray-100 border border-gray-200 hover:text-white text-gray-700'
                        } rounded-full font-medium transition-all shadow-sm cursor-pointer`}
                      >
                        {lesson}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
