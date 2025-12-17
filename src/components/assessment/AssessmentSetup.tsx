'use client';

import React, { useState, useMemo } from 'react';
import { Search, Check, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Topic, TOPICS } from '@/lib/assessment-data';
import Link from 'next/link';

interface AssessmentSetupProps {
  subject: string;
  onStart: (selectedTopicIds: string[]) => void;
}

const SUBJECTS = [
  { id: 'physics', label: 'Physics' },
  { id: 'math', label: 'Math' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'economy', label: 'Economy' },
  { id: 'stats', label: 'Stats' },
];

export function AssessmentSetup({ subject, onStart }: AssessmentSetupProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);

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

  const currentSubjectLabel = SUBJECTS.find(s => s.id === subject)?.label || subject;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center relative font-sans">
      
      <div className="w-full max-w-4xl z-10 px-6 pt-16 md:pt-24 pb-40 flex flex-col items-center">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-2xl"
        >
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900">
            Reveal your <span className="text-blue-600">true potential.</span>
          </h1>
          
          {/* Description */}
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Identify your gaps in <span className="font-bold">{currentSubjectLabel}</span> in less than 2 minutes. No grades. Just clarity.
          </p>
        </motion.div>

        {/* INTERACTIVE SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-3xl"
        >
          {/* Subject Selector & Search Bar */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            {/* Subject Selector */}
            <div className="relative">
              <button
                onClick={() => setIsSubjectMenuOpen(!isSubjectMenuOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                <span>{currentSubjectLabel}</span>
                <ChevronDown size={16} className={`text-gray-600 transition-transform ${isSubjectMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSubjectMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden py-2 z-50"
                  >
                    {SUBJECTS.map((s) => (
                      <Link 
                        key={s.id} 
                        href={`/assessment/${s.id}`}
                        onClick={() => setIsSubjectMenuOpen(false)}
                        className={`block px-4 py-2 text-sm font-medium transition-colors ${
                          s.id === subject 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50'
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-900 text-sm"
                placeholder="What do you want to master?"
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
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
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
              <div className="text-gray-400 py-8 font-medium text-sm text-center w-full">
                No topics found matching "{searchQuery}" in {currentSubjectLabel}.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* FLOATING CTA */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-0 right-0 flex justify-center px-6 z-50 pointer-events-none"
          >
            <button
              onClick={() => onStart(selectedIds)}
              className="pointer-events-auto bg-gray-200 text-gray-900 font-medium py-3 px-8 rounded-full shadow-lg hover:bg-gray-300 transition-all text-base flex items-center gap-2"
            >
              <span>Let's get started</span>
              <span className="text-gray-600">({selectedIds.length} topic{selectedIds.length > 1 ? 's' : ''})</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
