'use client';

import React, { useState, useMemo } from 'react';
import { Search, Check, ArrowRight, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Topic, TOPICS } from '@/lib/assessment-data';
import Link from 'next/link';
import Image from 'next/image';

interface AssessmentSetupProps {
  subject: string;
  onStart: (selectedTopicIds: string[]) => void;
}

const SUBJECTS = [
  { id: 'physics', label: 'Physique', labelEn: 'Physics' },
  { id: 'math', label: 'Mathématiques', labelEn: 'Math' },
  { id: 'chemistry', label: 'Chimie', labelEn: 'Chemistry' },
  { id: 'economy', label: 'Économie', labelEn: 'Economy' },
  { id: 'stats', label: 'Statistiques', labelEn: 'Stats' },
];

const STEPS = [
  { label: 'Sujets', step: 0 },
  { label: 'Quiz', step: 1 },
  { label: 'Résultats', step: 2 },
];

export function AssessmentSetup({ subject, onStart }: AssessmentSetupProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const currentStep = 0; // On est à l'étape "Sujets"

  // Filter topics based on search query and subject
  const filteredTopics = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const subjectTopics = TOPICS.filter(t => t.category === subject); 
    return subjectTopics.filter(t => 
      t.label.toLowerCase().includes(query)
    );
  }, [searchQuery, subject]);

  const toggleTopic = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(tid => tid !== id)
        : [...prev, id]
    );
  };

  const currentSubject = SUBJECTS.find(s => s.id === subject);
  const currentSubjectLabel = currentSubject?.label || subject;

  return (
    <div className="min-h-screen bg-[#0d1317] text-white flex flex-col">
      
      {/* Header - Style DiagnosticFlow */}
      <header className="sticky top-0 bg-[#0d1317]/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image 
              src="/brand/onboarding-logo.svg" 
              alt="Science Made Simple" 
              width={85} 
              height={85}
            />
          </Link>

          {/* Progress Steps - Fil d'Ariane */}
          <div className="flex items-center gap-2">
            {STEPS.map((item, idx) => {
              const isCompleted = currentStep > item.step;
              const isCurrent = currentStep === item.step;
              
              return (
                <React.Fragment key={item.label}>
                  {/* Dot */}
                  <div className="flex flex-col items-center">
                    <motion.div 
                      className={`w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-blue-600' 
                          : isCurrent 
                            ? 'bg-blue-600 ring-[4px] ring-blue-600/30' 
                            : 'bg-gray-600'
                      }`}
                      animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                    <span className={`text-[10px] md:text-xs mt-1.5 font-semibold hidden md:block ${
                      isCompleted || isCurrent ? 'text-white' : 'text-white/50'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {/* Line connector */}
                  {idx < STEPS.length - 1 && (
                    <div className={`w-8 md:w-16 h-1 rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-blue-600' : 'bg-gray-700'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Close */}
          <Link
            href="/"
            className="text-white/70 hover:text-white transition-opacity"
          >
            <X size={24} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
        <div className="w-full max-w-4xl">
          
          {/* HEADER SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight !text-white">
              Choisis les sujets à évaluer en {currentSubjectLabel}
            </h1>
            
            {/* Description */}
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Sélectionne un ou plusieurs sujets pour identifier tes lacunes en moins de 2 minutes.
            </p>
          </motion.div>

          {/* INTERACTIVE SECTION */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            {/* Subject Selector & Search Bar */}
            <div className="flex items-center gap-3 mb-8 justify-center flex-wrap">
              {/* Subject Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsSubjectMenuOpen(!isSubjectMenuOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-medium text-sm hover:bg-gray-700 transition-colors"
                >
                  <span>{currentSubjectLabel}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isSubjectMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSubjectMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-700 overflow-hidden py-2 z-50"
                    >
                      {SUBJECTS.map((s) => (
                        <Link 
                          key={s.id} 
                          href={`/assessment/${s.id}`}
                          onClick={() => setIsSubjectMenuOpen(false)}
                          className={`block px-4 py-2 text-sm font-medium transition-colors ${
                            s.id === subject 
                              ? 'bg-blue-600/20 text-blue-400' 
                              : 'text-white/80 hover:bg-gray-800'
                          }`}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Input */}
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-500 text-white text-sm"
                  placeholder="Rechercher un sujet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* TOPICS TAGS */}
            <div className="flex flex-wrap justify-center gap-3 px-4">
              <AnimatePresence>
                {filteredTopics.map((topic) => {
                  const isSelected = selectedIds.includes(topic.id);
                  const Icon = topic.icon;
                  
                  return (
                    <motion.button
                      key={topic.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => toggleTopic(topic.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200
                        ${isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-[#1a1a1a] border-gray-700 text-white/80 hover:border-gray-600'
                        }
                      `}
                    >
                      <Icon size={16} className={isSelected ? 'text-white' : 'text-gray-500'} />
                      <span className="font-medium text-sm">{topic.label}</span>
                      {isSelected && (
                        <Check size={14} className="ml-1" />
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              
              {filteredTopics.length === 0 && (
                <div className="text-white/50 py-8 font-medium text-sm text-center w-full">
                  Aucun sujet trouvé pour "{searchQuery}" en {currentSubjectLabel}.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar - Style DiagnosticFlow */}
      <div className="sticky bottom-0 left-0 right-0 p-4 md:p-6 bg-[#0d1317]/95 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-xl mx-auto space-y-4">
          {/* Progress Message */}
          <div className="flex items-center gap-4 bg-gray-800/80 backdrop-blur-sm rounded-2xl px-5 py-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Check size={18} className="text-blue-600" />
            </div>
            <span className="text-white text-sm md:text-base font-medium">
              {selectedIds.length > 0 
                ? <>{selectedIds.length} sujet{selectedIds.length > 1 ? 's' : ''} sélectionné{selectedIds.length > 1 ? 's' : ''}</>
                : 'Sélectionne au moins un sujet pour commencer'
              }
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => selectedIds.length > 0 && onStart(selectedIds)}
            disabled={selectedIds.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              selectedIds.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Commencer le test</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
