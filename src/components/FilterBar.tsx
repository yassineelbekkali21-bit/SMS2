'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, RotateCcw, Settings } from 'lucide-react';
import { 
  FilterState, 
  FilterOption, 
  FILTER_CONFIG, 
  SubjectFilter, 
  TrendFilter, 
  SocialFilter, 
  SortOption 
} from '@/lib/course-filtering';

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  filterCounts: Record<string, number>;
}

export function FilterBar({ 
  filters, 
  onFiltersChange, 
  filterCounts
}: FilterBarProps) {
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Gestion des filtres par matière
  const handleSubjectFilter = (subjectId: SubjectFilter) => {
    let newSubjects: SubjectFilter[];
    
    if (subjectId === 'all') {
      newSubjects = ['all'];
    } else {
      newSubjects = filters.subjects.includes(subjectId)
        ? filters.subjects.filter(s => s !== subjectId && s !== 'all')
        : [...filters.subjects.filter(s => s !== 'all'), subjectId];
      
      if (newSubjects.length === 0) {
        newSubjects = ['all'];
      }
    }
    
    onFiltersChange({ ...filters, subjects: newSubjects });
  };

  // Gestion des filtres par tendance
  const handleTrendFilter = (trendId: TrendFilter) => {
    const newTrends = filters.trends.includes(trendId)
      ? filters.trends.filter(t => t !== trendId)
      : [...filters.trends, trendId];
    
    onFiltersChange({ ...filters, trends: newTrends });
  };

  // Gestion des filtres sociaux
  const handleSocialFilter = (socialId: SocialFilter) => {
    const newSocial = filters.social.includes(socialId)
      ? filters.social.filter(s => s !== socialId)
      : [...filters.social, socialId];
    
    onFiltersChange({ ...filters, social: newSocial });
  };

  // Gestion du tri
  const handleSort = (sortBy: SortOption) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    onFiltersChange({ ...filters, sortBy, sortOrder: newSortOrder });
    setShowSortMenu(false);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    onFiltersChange({
      subjects: ['all'],
      trends: [],
      social: [],
      sortBy: 'students',
      sortOrder: 'desc'
    });
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = 
    !filters.subjects.includes('all') || 
    filters.trends.length > 0 || 
    filters.social.length > 0;

  // Créer les chips des filtres actifs
  const getActiveFilterChips = () => {
    const chips: { id: string; label: string; type: string }[] = [];
    
    // Matières (sauf 'all')
    filters.subjects.forEach(subjectId => {
      if (subjectId !== 'all') {
        const subject = FILTER_CONFIG.subjects.find(s => s.id === subjectId);
        if (subject) {
          chips.push({ id: subjectId, label: subject.label, type: 'subject' });
        }
      }
    });
    
    // Tendances
    filters.trends.forEach(trendId => {
      const trend = FILTER_CONFIG.trends.find(t => t.id === trendId);
      if (trend) {
        chips.push({ id: trendId, label: trend.label, type: 'trend' });
      }
    });
    
    // Social
    filters.social.forEach(socialId => {
      const social = FILTER_CONFIG.social.find(s => s.id === socialId);
      if (social) {
        chips.push({ id: socialId, label: social.label, type: 'social' });
      }
    });
    
    return chips;
  };

  const removeFilter = (chipId: string, chipType: string) => {
    switch (chipType) {
      case 'subject':
        handleSubjectFilter(chipId as SubjectFilter);
        break;
      case 'trend':
        handleTrendFilter(chipId as TrendFilter);
        break;
      case 'social':
        handleSocialFilter(chipId as SocialFilter);
        break;
    }
  };

  const activeChips = getActiveFilterChips();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
      <div className="px-4 pt-1.5 pb-4">
        {/* Header avec actions */}
        <div className="flex items-center justify-end mb-2">
          <div className="flex items-center gap-3">
            {/* Menu de tri */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border border-gray-200"
              >
                <Settings size={16} />
                Trier
                <ChevronDown size={14} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-48"
                  >
                    {FILTER_CONFIG.sorting.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSort(option.id as SortOption)}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                          filters.sortBy === option.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                        {filters.sortBy === option.id && (
                          <span className="text-xs ml-2 opacity-75">
                            ({filters.sortOrder === 'desc' ? '↓' : '↑'})
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bouton de réinitialisation */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border border-red-200"
              >
                <RotateCcw size={16} />
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Filtres sur une seule ligne horizontale */}
        <div className="flex items-start gap-6">
          
          {/* Section Matières */}
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-gray-700 mb-0.5 uppercase tracking-wide">
              Matières
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {FILTER_CONFIG.subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectFilter(subject.id as SubjectFilter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    filters.subjects.includes(subject.id as SubjectFilter)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200 shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {subject.label}
                  <span className="text-[10px] bg-white rounded-full px-1.5 py-0.5 opacity-75 font-semibold">
                    {filterCounts[subject.id] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Tendances */}
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-gray-700 mb-0.5 uppercase tracking-wide">
              Tendances
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {FILTER_CONFIG.trends.map((trend) => (
                <button
                  key={trend.id}
                  onClick={() => handleTrendFilter(trend.id as TrendFilter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    filters.trends.includes(trend.id as TrendFilter)
                      ? 'bg-orange-100 text-orange-800 border border-orange-200 shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {trend.label}
                  <span className="text-[10px] bg-white rounded-full px-1.5 py-0.5 opacity-75 font-semibold">
                    {filterCounts[trend.id] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Social */}
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-gray-700 mb-0.5 uppercase tracking-wide">
              Activité sociale
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {FILTER_CONFIG.social.map((social) => (
                <button
                  key={social.id}
                  onClick={() => handleSocialFilter(social.id as SocialFilter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    filters.social.includes(social.id as SocialFilter)
                      ? 'bg-green-100 text-green-800 border border-green-200 shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {social.label}
                  <span className="text-[10px] bg-white rounded-full px-1.5 py-0.5 opacity-75 font-semibold">
                    {filterCounts[social.id] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chips des filtres actifs */}
        <AnimatePresence>
          {activeChips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-gray-700">Filtres actifs :</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {activeChips.length} filtre{activeChips.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {activeChips.map((chip) => (
                  <motion.button
                    key={`${chip.type}-${chip.id}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => removeFilter(chip.id, chip.type)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {chip.label}
                    <X size={14} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
