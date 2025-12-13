'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Play, PlayCircle, HelpCircle, FileText, CheckCircle, GraduationCap, Target, Atom, Calculator, TrendingUp, BookOpen, Coins, PieChart, Search, ChevronLeft, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

// Data Structure: Program -> Topics -> Featured Lesson
const exploreData = {
  fr: [
    {
      id: 'physics',
      label: 'Physics Mastery',
      icon: Atom,
      topics: [
        { 
          id: 'mech', 
          label: 'Mécanique Classique', 
          lesson: { title: 'Les 3 Lois de Newton', desc: 'Comprendre le mouvement et les forces fondamentales.', video: '#', quiz: '#' } 
        },
        { 
          id: 'elec', 
          label: 'Électricité & Magnétisme', 
          lesson: { title: 'Loi d\'Ohm & Circuits', desc: 'Maîtriser les bases du courant et de la tension.', video: '#', quiz: '#' } 
        },
        { 
          id: 'thermo', 
          label: 'Thermodynamique', 
          lesson: { title: 'Entropie & 2ème Principe', desc: 'Le désordre et l\'énergie expliqués simplement.', video: '#', quiz: '#' } 
        },
        { 
          id: 'waves', 
          label: 'Ondes & Optique', 
          lesson: { title: 'Effet Doppler', desc: 'Comprendre la propagation des ondes sonores.', video: '#', quiz: '#' } 
        }
      ]
    },
    {
      id: 'math',
      label: 'Mathematics Mastery',
      icon: Calculator,
      topics: [
        { 
          id: 'calc', 
          label: 'Analyse (Calculus)', 
          lesson: { title: 'Les Intégrales', desc: 'Calculer des aires et volumes complexes.', video: '#', quiz: '#' } 
        },
        { 
          id: 'alg', 
          label: 'Algèbre Linéaire', 
          lesson: { title: 'Matrices & Déterminants', desc: 'Résoudre des systèmes d\'équations linéaires.', video: '#', quiz: '#' } 
        },
        { 
          id: 'prob', 
          label: 'Probabilités', 
          lesson: { title: 'Loi Normale', desc: 'Comprendre la distribution en cloche.', video: '#', quiz: '#' } 
        }
      ]
    },
    {
      id: 'chem',
      label: 'Chemistry Mastery',
      icon: GraduationCap,
      topics: [
        { 
          id: 'org', 
          label: 'Chimie Organique', 
          lesson: { title: 'Réactions S.N.1 vs S.N.2', desc: 'Mécanismes de substitution nucléophile.', video: '#', quiz: '#' } 
        },
        { 
          id: 'atom', 
          label: 'Atomistique', 
          lesson: { title: 'Orbitales & Hybridation', desc: 'La structure électronique des atomes.', video: '#', quiz: '#' } 
        },
        { 
          id: 'acid', 
          label: 'Acides & Bases', 
          lesson: { title: 'Calcul de pH & Tampons', desc: 'Équilibres en solution aqueuse.', video: '#', quiz: '#' } 
        }
      ]
    },
    {
      id: 'eco',
      label: 'Economics Mastery',
      icon: TrendingUp,
      topics: [
        { 
          id: 'micro', 
          label: 'Microéconomie', 
          lesson: { title: 'Offre & Demande', desc: 'L\'équilibre du marché expliqué.', video: '#', quiz: '#' } 
        },
        { 
          id: 'macro', 
          label: 'Macroéconomie', 
          lesson: { title: 'PIB & Inflation', desc: 'Les indicateurs économiques clés.', video: '#', quiz: '#' } 
        }
      ]
    },
    {
      id: 'stats',
      label: 'Statistics Mastery',
      icon: PieChart,
      topics: [
        { 
          id: 'inf', 
          label: 'Inférence Statistique', 
          lesson: { title: 'Tests d\'Hypothèses (P-value)', desc: 'Prendre des décisions basées sur les données.', video: '#', quiz: '#' } 
        },
        { 
          id: 'desc', 
          label: 'Statistiques Descriptives', 
          lesson: { title: 'Moyenne, Médiane, Écart-type', desc: 'Résumer et visualiser les données.', video: '#', quiz: '#' } 
        }
      ]
    },
    {
      id: 'accounting',
      label: 'Accounting Mastery',
      icon: Coins,
      topics: [
        { 
          id: 'gen', 
          label: 'Comptabilité Générale', 
          lesson: { title: 'Le Bilan Comptable', desc: 'Actif, Passif et Capitaux Propres.', video: '#', quiz: '#' } 
        },
        { 
          id: 'fin', 
          label: 'Analyse Financière', 
          lesson: { title: 'Ratios de Liquidité', desc: 'Évaluer la santé financière d\'une entreprise.', video: '#', quiz: '#' } 
        }
      ]
    }
  ],
  en: [
    {
      id: 'physics',
      label: 'Physics Mastery',
      icon: Atom,
      topics: [
        { 
          id: 'mech', 
          label: 'Classical Mechanics', 
          lesson: { title: 'Newton\'s 3 Laws', desc: 'Understand movement and fundamental forces.', video: '#', quiz: '#' } 
        },
        { 
          id: 'elec', 
          label: 'Electricity & Magnetism', 
          lesson: { title: 'Ohm\'s Law & Circuits', desc: 'Master the basics of current and voltage.', video: '#', quiz: '#' } 
        },
        { 
          id: 'thermo', 
          label: 'Thermodynamics', 
          lesson: { title: 'Entropy & 2nd Law', desc: 'Disorder and energy explained simply.', video: '#', quiz: '#' } 
        }
      ]
    },
    // ... (Simplified EN for brevity, structure matches FR)
    {
      id: 'math',
      label: 'Mathematics Mastery',
      icon: Calculator,
      topics: [
        { 
          id: 'calc', 
          label: 'Calculus', 
          lesson: { title: 'Integrals', desc: 'Calculating complex areas and volumes.', video: '#', quiz: '#' } 
        }
      ]
    },
    {
      id: 'accounting',
      label: 'Accounting Mastery',
      icon: Coins,
      topics: [
        { 
          id: 'gen', 
          label: 'General Accounting', 
          lesson: { title: 'The Balance Sheet', desc: 'Assets, Liabilities and Equity.', video: '#', quiz: '#' } 
        }
      ]
    }
  ]
};

// New Component: Mobile Overlay Navigation (MasterClass Style)
export function MobileExploreOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { language } = useLanguage();
  const [view, setView] = useState<'categories' | 'topics' | 'lesson'>('categories');
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Fallback to FR if EN data is incomplete in this mock
  const data = exploreData[language] || exploreData['fr'];
  const selectedProgram = data.find(p => p.id === selectedProgramId);
  const selectedTopic = selectedProgram?.topics.find(t => t.id === selectedTopicId);

  // Reset view when closing
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView('categories');
        setSelectedProgramId(null);
        setSelectedTopicId(null);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-[68px] left-0 right-0 bottom-0 z-[90] bg-black px-6 py-6 overflow-y-auto"
    >
      <AnimatePresence mode="wait">
        {/* Level 1: Categories (Programs) */}
        {view === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder={language === 'fr' ? "Rechercher..." : "Search..."}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors"
              />
            </div>

            {/* Categories List */}
            <div className="space-y-0 divide-y divide-gray-800 pb-20">
              {data.map((program) => {
                return (
                  <button
                    key={program.id}
                    onClick={() => {
                      setSelectedProgramId(program.id);
                      setView('topics');
                    }}
                    className="w-full flex items-center justify-between py-6 active:bg-gray-900/50 transition-colors group"
                  >
                    <span className="text-xl font-bold text-white pl-2 text-left">{program.label}</span>
                    <ChevronRight size={24} className="text-gray-500 group-hover:text-white transition-colors" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Level 2: Topics List */}
        {view === 'topics' && selectedProgram && (
          <motion.div
            key="topics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pb-20"
          >
            {/* Back Header - Sticky */}
            <div className="flex items-center gap-3 sticky top-0 bg-black z-20 py-4 -mx-6 px-6 border-b border-gray-800">
              <button 
                onClick={() => setView('categories')}
                className="w-8 h-8 flex items-center justify-center text-white hover:text-gray-300"
              >
                <ArrowLeft size={24} />
              </button>
              <h3 className="text-xl font-bold truncate" style={{ color: '#FFFFFF' }}>{selectedProgram.label}</h3>
            </div>

            {/* Topics List */}
            <div className="mt-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">
                {language === 'fr' ? 'Sujets Tendances' : 'Trending Topics'}
              </h4>

              <div className="space-y-0 divide-y divide-gray-800">
                {selectedProgram.topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                      setView('lesson');
                    }}
                    className="w-full flex items-center justify-between py-5 active:bg-gray-900/50 transition-colors group text-left"
                  >
                    <span className="text-lg font-medium text-white pl-2">{topic.label}</span>
                    <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <Link 
              href={`/program/${selectedProgram.id}`}
              className="block w-full py-4 bg-blue-600 text-white text-center rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 active:scale-95 transition-transform mt-8"
            >
               {language === 'fr' ? 'Voir tout le programme' : 'View Full Program'}
            </Link>
          </motion.div>
        )}

        {/* Level 3: Lesson Details */}
        {view === 'lesson' && selectedProgram && selectedTopic && (
           <motion.div
           key="lesson"
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 20 }}
           className="space-y-8 pb-20"
         >
           {/* Back Header - Sticky */}
           <div className="flex items-center gap-3 sticky top-0 bg-black z-20 py-4 -mx-6 px-6 border-b border-gray-800">
             <button 
               onClick={() => setView('topics')}
               className="w-8 h-8 flex items-center justify-center text-white hover:text-gray-300 flex-shrink-0"
             >
               <ArrowLeft size={24} />
             </button>
             <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider truncate font-bold mb-0.5" style={{ color: '#9CA3AF' }}>
                  <span>{selectedProgram.label}</span>
                  <ChevronRight size={10} />
                </div>
                <h3 className="text-lg font-bold truncate" style={{ color: '#FFFFFF' }}>{selectedTopic.label}</h3>
             </div>
           </div>

           {/* Lesson Content */}
           <div className="space-y-6">
             {/* Lesson Card */}
             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
               
                   {/* Lesson Title (White) */}
                   <div className="flex items-start gap-4">
                     <div className="mt-1 min-w-[24px] w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                       <Play size={20} fill="currentColor" />
                     </div>
                     <div>
                       <span className="font-bold text-xl leading-tight block mb-2" style={{ color: '#FFFFFF' }}>
                         {selectedTopic.lesson.title}
                       </span>
                       <p className="text-base leading-relaxed" style={{ color: '#D1D5DB' }}>
                         {selectedTopic.lesson.desc}
                       </p>
                     </div>
                   </div>

                           {/* Actions Buttons - Ultra Minimalist Mobile */}
                           <div className="space-y-3 mt-4">
                             {/* Preview - Clean White Button */}
                             <Link 
                               href={selectedTopic.lesson.video}
                               className="flex items-center justify-between w-full p-4 bg-white rounded-xl active:scale-95 transition-transform group"
                             >
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                                    <Play size={14} fill="currentColor" className="ml-0.5" />
                                 </div>
                                 <span className="text-black font-bold text-base">Preview Lesson</span>
                               </div>
                               <ArrowRight size={18} className="text-gray-400 group-hover:text-black" />
                             </Link>

                             {/* Quiz - Clean Outline Button */}
                             <Link 
                               href={selectedTopic.lesson.quiz}
                               className="flex items-center justify-between w-full p-4 border border-gray-800 rounded-xl active:scale-95 transition-transform hover:bg-gray-900 group"
                             >
                                <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full border border-gray-600 text-gray-400 flex items-center justify-center group-hover:border-white group-hover:text-white transition-colors">
                                    <HelpCircle size={14} />
                                 </div>
                                 <span className="text-white font-bold text-base">Take Quiz</span>
                               </div>
                               <ArrowRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                             </Link>
                           </div>
             </div>
           </div>
         </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ExploreMenu({ isMobile = false, onClose }: { isMobile?: boolean; onClose?: () => void }) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeProgram, setActiveProgram] = useState<string>('physics');
  const [activeTopic, setActiveTopic] = useState<string>('mech');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);

  // Fallback to FR if EN data is incomplete in this mock
  const data = exploreData[language] || exploreData['fr'];
  
  // Safe access to current program
  const currentProgram = data.find(p => p.id === activeProgram) || data[0];
  
  // Safe access to current topic - Reset to first topic if activeTopic doesn't belong to currentProgram
  const topicExists = currentProgram.topics.find(t => t.id === activeTopic);
  const currentTopic = topicExists ? topicExists : currentProgram.topics[0];

  const toggleProgram = (programId: string) => {
    setExpandedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  // Mobile version - Accordion style
  if (isMobile) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Search size={16} className="text-gray-400"/>
          <span className="text-gray-400 text-sm uppercase tracking-wider font-bold">
            {language === 'fr' ? 'Programmes' : 'Programs'}
          </span>
        </div>
        
        {data.map((program) => {
          const Icon = program.icon;
          const isExpanded = expandedPrograms.includes(program.id);
          
          return (
            <div key={program.id} className="rounded-xl overflow-hidden bg-white/5 mb-2">
              <button
                onClick={() => toggleProgram(program.id)}
                className="w-full flex items-center justify-between p-4 active:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-white font-bold text-base">{program.label}</span>
                </div>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-black/20"
                  >
                    <div className="p-4 pt-0 space-y-4">
                      {/* Topics List with Lesson Links */}
                      {program.topics.map((topic) => (
                        <div key={topic.id} className="flex items-start gap-3 pl-2 border-l-2 border-gray-700 ml-5 py-1">
                          <div className="flex-1">
                            <p className="text-gray-300 font-medium text-sm">{topic.label}</p>
                            <Link 
                              href={topic.lesson.video} 
                              className="flex items-center gap-2 mt-1.5 text-blue-400 text-xs font-bold hover:text-blue-300"
                            >
                              <Play size={12} fill="currentColor" />
                              {topic.lesson.title}
                            </Link>
                          </div>
                        </div>
                      ))}

                      {/* Global Program CTA */}
                      <Link 
                        href={`/program/${program.id}`}
                        className="w-full mt-2 py-3 bg-blue-600 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                        {language === 'fr' ? 'Voir tout le programme' : 'View Full Program'}
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop version - Original mega menu
  return (
    <div className="relative group" onMouseLeave={() => setIsOpen(false)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors font-semibold text-2xl"
      >
        <span>{language === 'fr' ? 'Explorer' : 'Explore'}</span>
        <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu - SMS Identity (White) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 pt-4 w-[900px] z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 ring-1 ring-black/5 flex flex-col">
              
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder={language === 'fr' ? "Rechercher un sujet, une matière..." : "Search for a topic, subject..."}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 h-[500px]">
                {/* Column 1: Programs List */}
                <div className="col-span-3 bg-gray-50 border-r border-gray-100 py-4 overflow-y-auto">
                  <div className="px-5 pb-3 text-sm font-bold text-gray-400 uppercase tracking-wider">
                    {language === 'fr' ? 'Programmes' : 'Programs'}
                  </div>
                  {data.map((program) => {
                    const Icon = program.icon;
                    return (
                      <button
                        key={program.id}
                        onMouseEnter={() => {
                          setActiveProgram(program.id);
                        }}
                        className={`w-full text-left px-5 py-4 flex items-center justify-between transition-all ${
                          activeProgram === program.id 
                            ? 'text-blue-600 bg-white shadow-sm border-l-4 border-blue-600 font-bold' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-l-4 border-transparent font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="truncate text-lg">{program.label}</span>
                        </div>
                        {activeProgram === program.id && <ChevronRight size={16} />}
                      </button>
                    );
                  })}
                </div>

                {/* Column 2: Topics List */}
                <div className="col-span-4 border-r border-gray-100 py-6 px-2 overflow-y-auto">
                  <div className="px-4 pb-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                    {language === 'fr' ? 'Sujets Tendances' : 'Trending Topics'}
                  </div>
                  <div className="space-y-1">
                    {currentProgram.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onMouseEnter={() => setActiveTopic(topic.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          currentTopic.id === topic.id
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`font-semibold text-lg ${currentTopic.id === topic.id ? 'text-blue-700' : 'text-gray-800'}`}>
                          {topic.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 3: Featured Lesson (Preview/Quiz) */}
                <div className="col-span-5 bg-white p-8 flex flex-col justify-center relative overflow-hidden">
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    {(() => {
                      const Icon = currentProgram.icon;
                      return <Icon size={200} />;
                    })()}
                  </div>

                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                      {language === 'fr' ? 'Leçon Gratuite' : 'Free Lesson'}
                    </span>
                    
                    <h4 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                      {currentTopic.lesson.title}
                    </h4>
                    <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                      {currentTopic.lesson.desc}
                    </p>

                    <div className="space-y-0 divide-y divide-gray-100 border-t border-b border-gray-100 my-8">
                      {/* Preview Link - Ultra Minimalist */}
                      <Link
                        href={currentTopic.lesson.video}
                        className="flex items-center justify-between py-5 group hover:pl-2 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                           <span className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white group-hover:scale-110 transition-transform duration-300 shadow-sm">
                             <Play size={14} fill="currentColor" className="ml-0.5" />
                           </span>
                           <div>
                             <span className="block font-bold text-gray-900 text-base group-hover:text-black">Voir la preview</span>
                             <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">3 min video</span>
                           </div>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all duration-300" />
                      </Link>

                      {/* Quiz Link - Ultra Minimalist */}
                      <Link
                        href={currentTopic.lesson.quiz}
                        className="flex items-center justify-between py-5 group hover:pl-2 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                           <span className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 group-hover:border-black group-hover:text-black transition-colors duration-300 bg-white">
                             <HelpCircle size={16} />
                           </span>
                           <div>
                             <span className="block font-bold text-gray-900 text-base group-hover:text-black">Faire le quiz</span>
                             <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">Test rapide</span>
                           </div>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

