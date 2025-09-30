'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, Minus, History, TrendingUp, Target } from 'lucide-react';

// Types pour le système de crédits
export interface CreditMovement {
  id: string;
  type: 'gain' | 'spend';
  amount: number;
  reason: string;
  timestamp: Date;
  courseId?: string;
}

export interface CreditSystemState {
  currentCredits: number;
  movements: CreditMovement[];
  showModal: boolean;
}

// Animation flottante pour les changements de crédits
const FloatingAnimation = ({ 
  type, 
  amount, 
  onComplete 
}: { 
  type: 'gain' | 'spend';
  amount: number;
  onComplete: () => void;
}) => (
  <motion.div
    initial={{ 
      opacity: 1, 
      y: 0, 
      x: 0,
      scale: 1 
    }}
    animate={{ 
      opacity: 0, 
      y: type === 'gain' ? -50 : -30,
      x: type === 'gain' ? 0 : 20,
      scale: type === 'gain' ? 1.2 : 0.8
    }}
    exit={{ opacity: 0 }}
    transition={{ 
      duration: 1.5,
      ease: "easeOut"
    }}
    onAnimationComplete={onComplete}
    className={`absolute pointer-events-none z-50 font-bold text-lg ${
      type === 'gain' 
        ? 'text-green-600' 
        : 'text-orange-600'
    }`}
    style={{
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
  >
    {type === 'gain' ? '+' : '-'}{amount}
  </motion.div>
);

// Compteur de crédits dans la navbar
export const CreditCounter = ({ 
  credits, 
  onRecharge,
  onOpenHistory, 
  showAnimation 
}: {
  credits: number;
  onRecharge: () => void;
  onOpenHistory: () => void;
  showAnimation?: { type: 'gain' | 'spend'; amount: number } | null;
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (showAnimation) {
      setAnimationKey(prev => prev + 1);
    }
  }, [showAnimation]);

  return (
    <div className="relative flex items-center gap-2">
      {/* Bouton principal de recharge */}
      <motion.button
        onClick={onRecharge}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg hover:from-purple-200 hover:to-blue-200 transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={showAnimation ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="text-2xl"
        >
          🧠
        </motion.div>
        <motion.span 
          key={credits}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
          className="font-bold text-gray-800 group-hover:text-purple-700"
        >
          {credits}
        </motion.span>
        <span className="text-sm text-gray-600 group-hover:text-purple-600">
          crédits
        </span>
        <Plus className="w-4 h-4 text-purple-600 group-hover:text-purple-700" />
      </motion.button>

      {/* Bouton historique */}
      <motion.button
        onClick={onOpenHistory}
        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Voir l'historique"
      >
        <History className="w-5 h-5" />
      </motion.button>

      {/* Animation flottante */}
      <AnimatePresence>
        {showAnimation && (
          <FloatingAnimation
            key={animationKey}
            type={showAnimation.type}
            amount={showAnimation.amount}
            onComplete={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Carte de cours recommandé avec bouton cerveau
export const CourseCard = ({
  course,
  onUnlock,
  onPreview,
  canAfford,
  isUnlocked = false
}: {
  course: {
    id: string;
    title: string;
    description: string;
    icon: string;
    difficulty?: string;
    estimatedTime?: string;
    creditCost?: number;
  };
  onUnlock: (courseId: string) => void;
  onPreview?: (courseId: string) => void;
  canAfford: boolean;
  isUnlocked?: boolean;
}) => {
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = () => {
    if (!canAfford || isUnlocked) return;
    
    setIsUnlocking(true);
    setTimeout(() => {
      onUnlock(course.id);
      setIsUnlocking(false);
    }, 1000);
  };

  return (
    <motion.div
      layout
      className={`relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 min-h-[280px] flex flex-col ${
        isUnlocked ? 'ring-2 ring-green-200 bg-green-50' : ''
      }`}
      whileHover={{ y: -4 }}
    >
      {/* Bouton cerveau en haut à droite */}
      {!isUnlocked && (
        <motion.button
          onClick={handleUnlock}
          disabled={!canAfford || isUnlocking}
          className={`absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
            canAfford 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          whileHover={canAfford ? { scale: 1.1 } : {}}
          whileTap={canAfford ? { scale: 0.9 } : {}}
        >
          {isUnlocking ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-white"
            >
              🧠
            </motion.div>
          ) : (
            <span className={canAfford ? 'text-white' : 'text-gray-500'}>
              🧠
            </span>
          )}
        </motion.button>
      )}

      {/* Badge "débloqué" */}
      {isUnlocked && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Débloqué
        </div>
      )}

      {/* Contenu de la carte */}
      <div className="flex items-start gap-4 flex-1">
        <div className="text-4xl flex-shrink-0">{course.icon}</div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2 pr-8">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              {course.difficulty && (
                <span className="flex items-center gap-1">
                  <Target size={12} />
                  {course.difficulty}
                </span>
              )}
              {course.estimatedTime && (
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  {course.estimatedTime}
                </span>
              )}
              {course.creditCost && !isUnlocked && (
                <span className="flex items-center gap-1 text-purple-600 font-medium">
                  <Brain size={12} />
                  {course.creditCost} crédits
                </span>
              )}
            </div>
          </div>

          {/* Actions en bas de carte */}
          <div className="mt-auto">
            {isUnlocked ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Continuer
              </motion.button>
            ) : onPreview ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onPreview(course.id)}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 font-medium flex items-center justify-center gap-2"
              >
                👁️ Aperçu gratuit
              </motion.button>
            ) : (
              <div className="w-full px-4 py-3 bg-gray-50 text-gray-400 rounded-lg text-center text-sm">
                Aperçu non disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Modale "Mon capital cognitif"
export const CreditModal = ({
  isOpen,
  onClose,
  credits,
  movements,
  suggestions
}: {
  isOpen: boolean;
  onClose: () => void;
  credits: number;
  movements: CreditMovement[];
  suggestions: string[];
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                <div>
                  <h2 className="text-2xl font-bold">Mon Capital Cognitif</h2>
                  <p className="text-purple-100">Gérez votre investissement d'apprentissage</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-purple-200 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto">
            {/* Solde actuel */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                Tu as {credits} crédits disponibles
              </h3>
              <p className="text-gray-600">
                Chaque crédit représente une opportunité d'apprentissage
              </p>
            </div>

            {/* Historique des mouvements */}
            <div className="mb-6">
              <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <History size={20} />
                Historique récent
              </h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {movements.slice(0, 5).map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl ${
                        movement.type === 'gain' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {movement.type === 'gain' ? '+' : '-'}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">
                          {movement.type === 'gain' ? '+' : '-'}{movement.amount} crédit{movement.amount > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-600">{movement.reason}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {movement.timestamp.toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions personnalisées */}
            {suggestions.length > 0 && (
              <div>
                <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Suggestions d'investissement
                </h4>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <p className="text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

