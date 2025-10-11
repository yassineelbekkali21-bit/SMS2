'use client';

import React from 'react';
import { 
  Eye, 
  Brain, 
  Play, 
  TestTube, 
  Lock, 
  CheckCircle,
  MessageCircle
} from 'lucide-react';

interface StandardCardButtonsProps {
  // États
  isOwned?: boolean;
  canAfford?: boolean;
  hasPreview?: boolean;
  hasQuiz?: boolean;
  isExternal?: boolean;
  
  // Actions
  onPreview?: () => void;
  onQuiz?: () => void;
  onUnlock?: () => void;
  onAccess?: () => void;
  onWhatsApp?: () => void;
  
  // Configuration
  unlockPrice?: number;
  unlockLabel?: string;
  className?: string;
}

export function StandardCardButtons({
  isOwned = false,
  canAfford = true,
  hasPreview = true,
  hasQuiz = true,
  isExternal = false,
  onPreview,
  onQuiz,
  onUnlock,
  onAccess,
  onWhatsApp,
  unlockPrice,
  unlockLabel = "Débloquer",
  className = ""
}: StandardCardButtonsProps) {
  
  // Cours externes (hors programme) - uniquement WhatsApp
  if (isExternal) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <button
          onClick={onWhatsApp}
          className="flex-1 bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <MessageCircle size={16} />
          Contacter sur WhatsApp
        </button>
      </div>
    );
  }

  // Contenu déjà possédé
  if (isOwned) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <button
          onClick={onAccess}
          className="flex-1 bg-green-50 text-green-700 py-3 px-4 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
        >
          <Play size={16} />
          Accéder
        </button>
        {hasQuiz && (
          <button
            onClick={onQuiz}
            className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <TestTube size={16} />
          </button>
        )}
      </div>
    );
  }

  // Contenu non possédé - hiérarchie des boutons
  return (
    <div className={`flex gap-2 ${className}`}>
      {/* CTAs principaux - gros et visibles */}
      <div className="flex gap-2 flex-1">
        {hasPreview && (
          <button
            onClick={onPreview}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            Aperçu
          </button>
        )}
        {hasQuiz && (
          <button
            onClick={onQuiz}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <TestTube size={16} />
            Se tester
          </button>
        )}
      </div>
      
      {/* CTA secondaire - Débloquer plus discret */}
      <button
        onClick={onUnlock}
        disabled={!canAfford}
        className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-1 ${
          canAfford
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
        }`}
        title={unlockPrice ? `${unlockLabel} - ${unlockPrice}€` : unlockLabel}
      >
        {canAfford ? (
          <Brain size={16} />
        ) : (
          <Lock size={16} />
        )}
        <span className="hidden sm:inline text-sm">{unlockLabel}</span>
      </button>
    </div>
  );
}

// Variante compacte pour les petites cartes (leçons)
export function CompactCardButtons({
  isOwned = false,
  canAfford = true,
  hasPreview = true,
  hasQuiz = true,
  onPreview,
  onQuiz,
  onUnlock,
  onAccess,
  unlockPrice,
  className = ""
}: Omit<StandardCardButtonsProps, 'isExternal' | 'onWhatsApp' | 'unlockLabel'>) {
  
  if (isOwned) {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">Débloquée</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onAccess}
            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-1"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Accéder</span>
          </button>
          {hasQuiz && (
            <button
              onClick={onQuiz}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              <TestTube className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Prix */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-gray-900">{unlockPrice}€</span>
        <span className="text-xs text-gray-500">leçon</span>
      </div>
      
      {/* Actions */}
      <div className="flex gap-1">
        {hasPreview && (
          <button
            onClick={onPreview}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
        {hasQuiz && (
          <button
            onClick={onQuiz}
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            <TestTube className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onUnlock}
          disabled={!canAfford}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
            canAfford
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canAfford ? <Brain className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}


