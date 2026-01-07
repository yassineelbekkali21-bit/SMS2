'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, ArrowRight, Atom, Calculator, GraduationCap, TrendingUp, PieChart, Coins } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnostic } from '@/contexts/DiagnosticContext';
import Link from 'next/link';

// Data Structure: Program -> Topics -> Lessons
const exploreData = {
  fr: [
    {
      id: 'physics',
      label: 'Physics Mastery',
      icon: Atom,
      color: '#3B82F6',
      topics: [
        { 
          id: 'mech', 
          label: 'Mécanique Classique', 
          lessons: [
            { title: 'Les 3 Lois de Newton', desc: 'Comprendre le mouvement et les forces fondamentales.' },
            { title: 'Énergie & Travail', desc: 'Théorème de l\'énergie cinétique et conservation.' },
            { title: 'Cinématique', desc: 'Position, vitesse et accélération.' }
          ]
        },
        { 
          id: 'elec', 
          label: 'Électricité & Magnétisme', 
          lessons: [
            { title: 'Loi d\'Ohm & Circuits', desc: 'Maîtriser les bases du courant et de la tension.' },
            { title: 'Lois de Kirchhoff', desc: 'Analyser les circuits complexes.' },
            { title: 'Champs Électriques', desc: 'Forces de Coulomb et potentiel.' }
          ]
        },
        { 
          id: 'thermo', 
          label: 'Thermodynamique', 
          lessons: [
            { title: 'Entropie & 2ème Principe', desc: 'Le désordre et l\'énergie expliqués simplement.' },
            { title: 'Cycles Thermodynamiques', desc: 'Carnot, Otto et rendement des machines.' }
          ]
        },
        { 
          id: 'waves', 
          label: 'Ondes & Optique', 
          lessons: [
            { title: 'Effet Doppler', desc: 'Comprendre la propagation des ondes sonores.' },
            { title: 'Interférences', desc: 'Diffraction et fentes de Young.' }
          ]
        }
      ]
    },
    {
      id: 'math',
      label: 'Mathematics Mastery',
      icon: Calculator,
      color: '#10B981',
      topics: [
        { 
          id: 'calc', 
          label: 'Analyse (Calculus)', 
          lessons: [
            { title: 'Les Intégrales', desc: 'Calculer des aires et volumes complexes.' },
            { title: 'Dérivées', desc: 'Taux de variation et optimisation.' },
            { title: 'Limites', desc: 'Comportement asymptotique des fonctions.' }
          ]
        },
        { 
          id: 'alg', 
          label: 'Algèbre Linéaire', 
          lessons: [
            { title: 'Matrices & Déterminants', desc: 'Résoudre des systèmes d\'équations linéaires.' },
            { title: 'Espaces Vectoriels', desc: 'Bases, dimensions et sous-espaces.' },
            { title: 'Valeurs Propres', desc: 'Diagonalisation et applications.' }
          ]
        },
        { 
          id: 'prob', 
          label: 'Probabilités', 
          lessons: [
            { title: 'Loi Normale', desc: 'Comprendre la distribution en cloche.' },
            { title: 'Théorème de Bayes', desc: 'Probabilités conditionnelles.' }
          ]
        }
      ]
    },
    {
      id: 'chem',
      label: 'Chemistry Mastery',
      icon: GraduationCap,
      color: '#8B5CF6',
      topics: [
        { 
          id: 'org', 
          label: 'Chimie Organique', 
          lessons: [
            { title: 'Réactions S.N.1 vs S.N.2', desc: 'Mécanismes de substitution nucléophile.' },
            { title: 'Stéréochimie', desc: 'Chiralité, énantiomères et configuration R/S.' }
          ]
        },
        { 
          id: 'atom', 
          label: 'Atomistique', 
          lessons: [
            { title: 'Orbitales & Hybridation', desc: 'La structure électronique des atomes.' },
            { title: 'Lewis & VSEPR', desc: 'Géométrie des molécules.' }
          ]
        },
        { 
          id: 'acid', 
          label: 'Acides & Bases', 
          lessons: [
            { title: 'Calcul de pH', desc: 'Solutions fortes, faibles et mélanges.' },
            { title: 'Titrage', desc: 'Courbes de neutralisation et indicateurs.' }
          ]
        }
      ]
    },
    {
      id: 'eco',
      label: 'Economics Mastery',
      icon: TrendingUp,
      color: '#F59E0B',
      topics: [
        { 
          id: 'micro', 
          label: 'Microéconomie', 
          lessons: [
            { title: 'Offre & Demande', desc: 'L\'équilibre du marché expliqué.' },
            { title: 'Élasticité', desc: 'Sensibilité aux prix et revenus.' }
          ]
        },
        { 
          id: 'macro', 
          label: 'Macroéconomie', 
          lessons: [
            { title: 'PIB & Inflation', desc: 'Les indicateurs économiques clés.' },
            { title: 'Modèle IS-LM', desc: 'Équilibre simultané des marchés.' }
          ]
        }
      ]
    },
    {
      id: 'stats',
      label: 'Statistics Mastery',
      icon: PieChart,
      color: '#EC4899',
      topics: [
        { 
          id: 'inf', 
          label: 'Inférence Statistique', 
          lessons: [
            { title: 'Tests d\'Hypothèses', desc: 'Prendre des décisions basées sur les données.' },
            { title: 'T-test & Z-test', desc: 'Comparer des moyennes et proportions.' }
          ]
        },
        { 
          id: 'desc', 
          label: 'Statistiques Descriptives', 
          lessons: [
            { title: 'Moyenne, Médiane, Écart-type', desc: 'Résumer et visualiser les données.' },
            { title: 'Corrélation', desc: 'Lien entre deux variables quantitatives.' }
          ]
        }
      ]
    },
    {
      id: 'accounting',
      label: 'Accounting Mastery',
      icon: Coins,
      color: '#14B8A6',
      topics: [
        { 
          id: 'gen', 
          label: 'Comptabilité Générale', 
          lessons: [
            { title: 'Le Bilan Comptable', desc: 'Actif, Passif et Capitaux Propres.' },
            { title: 'Compte de Résultat', desc: 'Produits, charges et bénéfice.' }
          ]
        },
        { 
          id: 'fin', 
          label: 'Analyse Financière', 
          lessons: [
            { title: 'Ratios de Liquidité', desc: 'Évaluer la santé financière d\'une entreprise.' },
            { title: 'Rentabilité', desc: 'ROI, ROE et marges.' }
          ]
        }
      ]
    }
  ],
  en: [
    {
      id: 'physics',
      label: 'Physics Mastery',
      icon: Atom,
      color: '#3B82F6',
      topics: [
        { 
          id: 'mech', 
          label: 'Classical Mechanics', 
          lessons: [
            { title: 'Newton\'s 3 Laws', desc: 'Understand movement and fundamental forces.' },
            { title: 'Energy & Work', desc: 'Kinetic energy theorem and conservation.' }
          ]
        },
        { 
          id: 'elec', 
          label: 'Electricity & Magnetism', 
          lessons: [
            { title: 'Ohm\'s Law & Circuits', desc: 'Master the basics of current and voltage.' },
            { title: 'Kirchhoff\'s Laws', desc: 'Analyze complex circuits.' }
          ]
        }
      ]
    },
    {
      id: 'math',
      label: 'Mathematics Mastery',
      icon: Calculator,
      color: '#10B981',
      topics: [
        { 
          id: 'calc', 
          label: 'Calculus', 
          lessons: [
            { title: 'Integrals', desc: 'Calculating complex areas and volumes.' },
            { title: 'Derivatives', desc: 'Rate of change and optimization.' }
          ]
        }
      ]
    }
  ]
};

export function ExploreSectionMultilang() {
  const { language } = useLanguage();
  const { openDiagnostic } = useDiagnostic();
  const [activeProgram, setActiveProgram] = useState<string>('physics');
  const [activeTopic, setActiveTopic] = useState<string>('mech');
  const [searchTerm, setSearchTerm] = useState('');

  const data = exploreData[language] || exploreData['fr'];
  
  // Filter data based on search - also filter topics within programs
  const filteredData = searchTerm.trim() 
    ? data.map(p => {
        const matchingTopics = p.topics.filter(t => 
          t.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.lessons.some(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        // If program label matches or has matching topics, include it
        if (p.label.toLowerCase().includes(searchTerm.toLowerCase()) || matchingTopics.length > 0) {
          return {
            ...p,
            topics: matchingTopics.length > 0 ? matchingTopics : p.topics
          };
        }
        return null;
      }).filter(Boolean) as typeof data
    : data;

  // Auto-select first matching program and topic when searching
  const effectiveActiveProgram = searchTerm.trim() && filteredData.length > 0 
    ? filteredData[0].id 
    : activeProgram;
  
  const currentProgram = filteredData.find(p => p.id === effectiveActiveProgram) || filteredData[0];
  
  const effectiveActiveTopic = searchTerm.trim() && currentProgram?.topics.length > 0
    ? currentProgram.topics[0].id
    : activeTopic;
    
  const currentTopic = currentProgram?.topics.find(t => t.id === effectiveActiveTopic) || currentProgram?.topics[0];

  return (
    <section id="explore-section" className="py-20 bg-gray-50 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="font-bold text-gray-900 mb-4 uppercase"
            style={{ fontFamily: 'Parafina, sans-serif', fontSize: '64px' }}
          >
            {language === 'fr' ? 'Dévoile ton potentiel' : 'Reveal your true potential'}
          </h2>
          <p className="text-gray-500 max-w-6xl mx-auto" style={{ fontSize: '22px' }}>
            {language === 'fr' 
              ? 'Explore nos programmes, découvre les notions clés et teste-toi librement.' 
              : 'Explore our programs, discover key concepts and test yourself freely.'}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            <input 
              type="text" 
              placeholder={language === 'fr' ? "Rechercher un sujet, une matière..." : "Search for a topic, subject..."}
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 text-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[450px]">
            
            {/* Column 1: Programs List */}
            <div className="lg:col-span-3 bg-gray-50 border-r border-gray-100 py-6">
              <div className="px-6 pb-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                {language === 'fr' ? 'Programmes' : 'Programs'}
              </div>
              <div className="space-y-0">
                {filteredData.map((program) => {
                  const isActive = program.id === effectiveActiveProgram;
                  return (
                    <button
                      key={program.id}
                      onClick={() => {
                        setActiveProgram(program.id);
                        setActiveTopic(program.topics[0]?.id || '');
                      }}
                      className={`w-full text-left px-6 py-4 flex items-center justify-between transition-all ${
                        isActive 
                          ? 'bg-white shadow-sm border-l-4 border-[#48c6ed] font-bold text-[#48c6ed]' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-l-4 border-transparent font-medium'
                      }`}
                    >
                      <span className="text-base">{program.label}</span>
                      {isActive && <ChevronRight size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Topics List */}
            <div className="lg:col-span-4 border-r border-gray-100 py-6 px-4 flex flex-col">
              <div className="px-2 pb-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                {language === 'fr' ? 'Sujets Tendances' : 'Trending Topics'}
              </div>
              
              <div className="space-y-1 flex-grow">
                {currentProgram?.topics.map((topic) => {
                  const isActive = topic.id === effectiveActiveTopic;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopic(topic.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`font-semibold text-lg ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                        {topic.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="p-4 mt-6 border-t border-gray-100 bg-gray-50/50 rounded-xl">
                <Link
                  href={`/assessment/${effectiveActiveProgram}/`}
                  target="_blank"
                  className="block w-full py-3 bg-[#48c6ed] text-white text-center rounded-full font-bold text-base hover:bg-[#3ab5dc] transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>{language === 'fr' ? `Se tester en ${currentProgram?.label.split(' ')[0]}` : `Test ${currentProgram?.label.split(' ')[0]} Skills`}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Column 3: Lessons Preview */}
            <div className="lg:col-span-5 bg-white p-8 flex flex-col">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wider mb-8 w-fit">
                {language === 'fr' ? 'Notions Clés' : 'Key Concepts'}
              </span>
              
              <div className="space-y-8 flex-grow">
                {currentTopic?.lessons.map((lesson, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <h4 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                      {lesson.title}
                    </h4>
                    <p className="text-gray-500 leading-relaxed text-base">
                      {lesson.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

