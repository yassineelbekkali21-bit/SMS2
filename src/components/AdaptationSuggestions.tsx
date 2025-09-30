'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Settings, CheckCircle, X } from 'lucide-react';
interface AdaptationSuggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  action: any;
  actions: any[];
  isActive: boolean;
}

interface AdaptationSuggestionsProps {
  suggestions: AdaptationSuggestion[];
  onApplySuggestion: (suggestion: AdaptationSuggestion, action: any) => void;
  onDismissSuggestion: (suggestionId: string) => void;
}

export function AdaptationSuggestions({ 
  suggestions, 
  onApplySuggestion, 
  onDismissSuggestion 
}: AdaptationSuggestionsProps) {
  const activeSuggestions = suggestions.filter(s => s.isActive);

  if (activeSuggestions.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ahead-schedule':
        return <TrendingUp className="w-6 h-6" />;
      case 'behind-schedule':
        return <TrendingDown className="w-6 h-6" />;
      default:
        return <Settings className="w-6 h-6" />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'ahead-schedule':
        return 'from-emerald-50 to-green-50';
      case 'behind-schedule':
        return 'from-orange-50 to-red-50';
      default:
        return 'from-blue-50 to-indigo-50';
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'ahead-schedule':
        return 'bg-emerald-100';
      case 'behind-schedule':
        return 'bg-orange-100';
      default:
        return 'bg-blue-100';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'ahead-schedule':
        return 'text-emerald-600';
      case 'behind-schedule':
        return 'text-orange-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {activeSuggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`bg-gradient-to-br ${getGradient(suggestion.type)} border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${getIconBg(suggestion.type)} rounded-xl flex items-center justify-center shadow-sm`}>
                  <div className={getIconColor(suggestion.type)}>
                    {getIcon(suggestion.type)}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {suggestion.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => onDismissSuggestion(suggestion.id)}
                className="w-8 h-8 bg-white/50 hover:bg-white/80 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Actions */}
            <div className="grid gap-3">
              {suggestion.actions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onApplySuggestion(suggestion, action)}
                  className={`
                    w-full p-4 rounded-xl font-semibold transition-all text-left
                    ${index === 0 
                      ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-500/25 hover:from-gray-800 hover:to-gray-700' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {index === 0 && <CheckCircle className="w-5 h-5" />}
                    <span>{action.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


