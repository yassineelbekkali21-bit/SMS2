'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, CreditCard } from 'lucide-react';
import { WalletService } from '@/lib/wallet-service';

interface SimpleTopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: 'lesson' | 'course' | 'pack' | 'general';
  onComplete: (amount: number, bonusApplied?: number) => void;
}

const SUGGESTED_AMOUNTS = [100, 500, 1000, 1500];

export function SimpleTopUpModal({ isOpen, onClose, source, onComplete }: SimpleTopUpModalProps) {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSelectedAmount(numValue);
    } else {
      setSelectedAmount(null);
    }
  };

  const handleTopUp = async () => {
    if (!selectedAmount || selectedAmount <= 0) {
      alert('Veuillez sélectionner un montant valide');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = WalletService.topUpWallet(selectedAmount, source);
      
      if (result.success) {
        onComplete(selectedAmount, result.bonusApplied);
        onClose();
      } else {
        alert(`Erreur lors de la recharge: ${result.error}`);
      }
    } catch (error) {
      alert('Erreur lors du traitement de la recharge');
      console.error('TopUp error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const bonusCampaign = source === 'pack' ? WalletService.getPackBonusCampaign() : null;
  const willGetBonus = bonusCampaign && selectedAmount && selectedAmount >= bonusCampaign.minTopUpAmount;
  
  // Debug log pour vérifier la source
  console.log(`🔍 SimpleTopUpModal: source=${source}, bonusCampaign=${!!bonusCampaign}, willGetBonus=${willGetBonus}`);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001] p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl max-w-md w-full shadow-xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recharger le portefeuille</h2>
                  <p className="text-sm text-gray-600">
                    Ajoutez des fonds à votre portefeuille
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Montants suggérés */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Montants suggérés</h3>
              <div className="grid grid-cols-2 gap-3">
                {SUGGESTED_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`
                      p-3 rounded-lg border-2 transition-all text-center
                      ${selectedAmount === amount
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    <div className="font-bold">{amount}€</div>
                    {amount >= 1000 && source === 'pack' && bonusCampaign && (
                      <div className="text-xs text-green-600 mt-1">
                        +{bonusCampaign.bonusAmount}€ bonus
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Montant personnalisé */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ou saisissez un montant personnalisé
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-8"
                />
                <span className="absolute right-3 top-3 text-gray-500">€</span>
              </div>
            </div>

            {/* Bonus info */}
            {willGetBonus && bonusCampaign && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-green-600">🎁</span>
                  <div>
                    <div className="font-semibold text-green-900">Bonus inclus !</div>
                    <div className="text-sm text-green-700">
                      Vous recevrez un bonus de <strong>{bonusCampaign.bonusAmount}€</strong> avec cette recharge.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Résumé */}
            {selectedAmount && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Montant de la recharge</span>
                  <span className="font-semibold">{selectedAmount.toFixed(2)}€</span>
                </div>
                {willGetBonus && bonusCampaign && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-600">Bonus</span>
                    <span className="font-semibold text-green-600">+{bonusCampaign.bonusAmount}€</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total crédité</span>
                    <span className="font-bold text-lg text-gray-900">
                      {(selectedAmount + (willGetBonus && bonusCampaign ? bonusCampaign.bonusAmount : 0)).toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bouton de recharge */}
            <button
              onClick={handleTopUp}
              disabled={!selectedAmount || selectedAmount <= 0 || isProcessing}
              className={`
                w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
                ${selectedAmount && selectedAmount > 0 && !isProcessing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Recharger {selectedAmount ? selectedAmount.toFixed(2) : '0.00'}€</span>
                </>
              )}
            </button>

            {/* Note sur la sécurité */}
            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Paiement sécurisé • Aucune donnée bancaire stockée
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
