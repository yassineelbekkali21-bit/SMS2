'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  Lock, 
  Zap,
  Crown,
  Target,
  BookOpen,
  Wallet,
  AlertTriangle
} from 'lucide-react';

import {
  PurchaseOption,
  UserWallet,
  CatalogLesson,
  CatalogCourse,
  CatalogPack
} from '@/types';

import { 
  cardClasses, 
  buttonPrimaryClasses, 
  buttonSecondaryClasses, 
  badgeClasses 
} from '@/lib/design-system';

// ========================================================================
// INTERFACES
// ========================================================================

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: PurchaseOption[];
  userWallet: UserWallet;
  onPurchase: (option: PurchaseOption) => Promise<boolean>;
  targetItem?: {
    lesson?: CatalogLesson;
    course?: CatalogCourse;
    pack?: CatalogPack;
  } | null;
}

interface OptionCardProps {
  option: PurchaseOption;
  isRecommended: boolean;
  canAfford: boolean;
  missingAmount: number;
  onSelect: () => void;
  isSelected: boolean;
}

// ========================================================================
// COMPOSANT OPTION CARD
// ========================================================================

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isRecommended,
  canAfford,
  missingAmount,
  onSelect,
  isSelected
}) => {
  
  const getTypeIcon = () => {
    switch (option.type) {
      case 'pack': return <Crown className="w-5 h-5" />;
      case 'course': return <BookOpen className="w-5 h-5" />;
      case 'lesson': return <Target className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    if (isRecommended) return 'from-purple-500 to-purple-600';
    switch (option.type) {
      case 'pack': return 'from-yellow-500 to-orange-500';
      case 'course': return 'from-blue-500 to-blue-600';
      case 'lesson': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getBorderColor = () => {
    if (isSelected) return 'border-purple-500 ring-2 ring-purple-200';
    if (isRecommended) return 'border-purple-300';
    if (!canAfford) return 'border-red-200';
    return 'border-gray-200 hover:border-gray-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, ease: 'easeOut' }}
      className={`relative ${cardClasses} border-2 cursor-pointer ${getBorderColor()}`}
      onClick={canAfford ? onSelect : undefined}
    >
      {/* Badge recommandé */}
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3" />
            RECOMMANDÉ
          </span>
        </div>
      )}

      {/* Header avec icône */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor()} rounded-xl flex items-center justify-center text-white`}>
            {getTypeIcon()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {option.title}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {option.type === 'pack' ? 'Pack complet' : 
               option.type === 'course' ? 'Cours' : 'Leçon individuelle'}
            </p>
          </div>
        </div>
        
        {/* Prix */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {option.price}€
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">
        {option.description}
      </p>

      {/* Message d'urgence */}
      {option.urgencyMessage && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-800">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">{option.urgencyMessage}</span>
          </div>
        </div>
      )}

      {/* Avantages */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Avantages inclus :</h4>
        <ul className="space-y-1">
          {option.advantages.map((advantage, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{advantage}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenu inclus */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-3 text-center">
          {option.items.packs.length > 0 && (
            <div>
              <div className="font-bold text-lg text-gray-900">{option.items.packs.length}</div>
              <div className="text-xs text-gray-500">Pack{option.items.packs.length > 1 ? 's' : ''}</div>
            </div>
          )}
          {option.items.courses.length > 0 && (
            <div>
              <div className="font-bold text-lg text-gray-900">{option.items.courses.length}</div>
              <div className="text-xs text-gray-500">Cours</div>
            </div>
          )}
          {option.items.lessons.length > 0 && (
            <div>
              <div className="font-bold text-lg text-gray-900">{option.items.lessons.length}</div>
              <div className="text-xs text-gray-500">Leçon{option.items.lessons.length > 1 ? 's' : ''}</div>
            </div>
          )}
        </div>
      </div>

      {/* Statut d'accessibilité */}
      {!canAfford && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">
              Solde insuffisant. Il vous manque <strong>{missingAmount}€</strong>
            </span>
          </div>
        </div>
      )}

      {/* Bouton de sélection */}
      <button
        disabled={!canAfford}
        className={`w-full ${
          canAfford
            ? isSelected
              ? buttonPrimaryClasses
              : isRecommended
                ? buttonPrimaryClasses
                : buttonSecondaryClasses
            : 'px-5 py-3 bg-gray-100 text-gray-400 cursor-not-allowed rounded-xl font-medium inline-flex items-center justify-center gap-2'
        }`}
        aria-label={`Sélectionner l'option ${option.title} pour ${option.price}€`}
      >
        {!canAfford ? (
          <>
            <Lock className="w-4 h-4" />
            Solde insuffisant
          </>
        ) : isSelected ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Sélectionné
          </>
        ) : (
          <>
            {isRecommended && <Star className="w-4 h-4" />}
            Choisir cette option
          </>
        )}
      </button>
    </motion.div>
  );
};

// ========================================================================
// COMPOSANT PRINCIPAL
// ========================================================================

export function UpsellModal({
  isOpen,
  onClose,
  options,
  userWallet,
  onPurchase,
  targetItem
}: UpsellModalProps) {
  
  const [selectedOption, setSelectedOption] = useState<PurchaseOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Déterminer l'option recommandée par défaut
  React.useEffect(() => {
    if (options.length > 0) {
      const recommended = options.find(opt => opt.isRecommended) || options[0];
      if (userWallet.balance >= recommended.price) {
        setSelectedOption(recommended);
      } else {
        // Sélectionner la première option abordable
        const affordable = options.find(opt => userWallet.balance >= opt.price);
        setSelectedOption(affordable || null);
      }
    }
  }, [options, userWallet.balance]);

  const handlePurchase = async () => {
    if (!selectedOption) return;
    
    setIsProcessing(true);
    try {
      await onPurchase(selectedOption);
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getTargetItemName = () => {
    if (targetItem?.lesson) return targetItem.lesson.title;
    if (targetItem?.course) return targetItem.course.title;
    if (targetItem?.pack) return targetItem.pack.title;
    return 'ce contenu';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Comment souhaitez-vous débloquer "{getTargetItemName()}" ?
                </h2>
                <p className="text-gray-600 mt-1">
                  Choisissez l'option qui correspond le mieux à vos objectifs d'apprentissage
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Informations portefeuille */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
              <Wallet className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm text-blue-800">
                  Solde disponible : <strong>{userWallet.balance}€</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {options.map((option) => {
                const canAfford = userWallet.balance >= option.price;
                const missingAmount = canAfford ? 0 : option.price - userWallet.balance;
                
                return (
                  <OptionCard
                    key={option.id}
                    option={option}
                    isRecommended={option.isRecommended}
                    canAfford={canAfford}
                    missingAmount={missingAmount}
                    onSelect={() => setSelectedOption(option)}
                    isSelected={selectedOption?.id === option.id}
                  />
                );
              })}
            </div>

            {/* Message d'aide */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Conseil pédagogique</h4>
                  <p className="text-sm text-blue-800">
                    Les packs offrent une progression structurée et des économies significatives. 
                    Les cours complets incluent des révisions automatiques et un suivi détaillé.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Annuler
              </button>
              
              <div className="flex items-center gap-3">
                {selectedOption && (
                  <div className="text-sm text-gray-600">
                    Total : <strong>{selectedOption.price}€</strong>
                    {selectedOption.savings && selectedOption.savings > 0 && (
                      <span className="text-green-600 ml-2">
                        (Économie: {selectedOption.savings}€)
                      </span>
                    )}
                  </div>
                )}
                
                <button
                  onClick={handlePurchase}
                  disabled={!selectedOption || userWallet.balance < (selectedOption?.price || 0) || isProcessing}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Confirmer l'achat
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
