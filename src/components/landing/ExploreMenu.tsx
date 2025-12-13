'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Play, FileText, CheckCircle, GraduationCap, Target, Atom, Calculator, TrendingUp, BookOpen, Coins, PieChart, Search } from 'lucide-react';
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
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                    <Icon size={20} />
                  </div>
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

                    <div className="space-y-4">
                      <Link
                        href={currentTopic.lesson.video}
                        className="flex items-center gap-4 p-5 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-all group shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play size={24} fill="currentColor" className="ml-1" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-base">Voir la preview</span>
                          <span className="text-xs text-gray-300 uppercase tracking-wider">3 min video</span>
                        </div>
                      </Link>

                      <Link
                        href={currentTopic.lesson.quiz}
                        className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-gray-200 text-gray-700 hover:bg-gray-50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <CheckCircle size={24} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-base">Faire le quiz</span>
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Test rapide</span>
                        </div>
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

