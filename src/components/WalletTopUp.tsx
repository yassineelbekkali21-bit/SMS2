'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Brain, Gift, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { WalletTopUpBonus } from '@/types';

interface WalletTopUpProps {
  currentBalance: number;
  onTopUp: (amount: number, withBonus: number) => void;
  onCancel: () => void;
  isPackOffer?: boolean; // Nouveau prop pour déterminer si c'est l'offre Pack
}

// Configuration des bonus de rechargement (Modèle PlayStation)
const TOP_UP_BONUSES: WalletTopUpBonus[] = [
  {
    minAmount: 100,
    bonusAmount: 0,
    bonusPercentage: 0,
    description: 'Aucun bonus'
  },
  {
    minAmount: 250,
    bonusAmount: 25,
    bonusPercentage: 10,
    description: '+25€ offerts'
  },
  {
    minAmount: 500,
    bonusAmount: 75,
    bonusPercentage: 15,
    description: '+75€ offerts'
  },
  {
    minAmount: 1000,
    bonusAmount: 200,
    bonusPercentage: 20,
    description: '+200€ offerts'
  },
  {
    minAmount: 2000,
    bonusAmount: 500,
    bonusPercentage: 25,
    description: '+500€ offerts'
  }
];

const SUGGESTED_AMOUNTS = [100, 250, 500, 1000, 2000];

export function WalletTopUp({ currentBalance, onTopUp, onCancel, isPackOffer = false }: WalletTopUpProps) {
  const [amount, setAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getApplicableBonus = (amount: number): WalletTopUpBonus => {
    // Si ce n'est pas l'offre Pack, retourner toujours un bonus de 0
    if (!isPackOffer) {
      return {
        minAmount: 0,
        bonusAmount: 0,
        bonusPercentage: 0,
        description: 'Aucun bonus'
      };
    }
    
    // Trouve le bonus le plus élevé applicable pour ce montant
    const applicableBonuses = TOP_UP_BONUSES.filter(bonus => amount >= bonus.minAmount);
    return applicableBonuses[applicableBonuses.length - 1] || TOP_UP_BONUSES[0];
  };

  const currentBonus = getApplicableBonus(amount);
  const finalAmount = amount + currentBonus.bonusAmount;

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    }
  };

  const handleProceed = async () => {
    if (!acceptTerms || amount < 10) return;
    
    setIsProcessing(true);
    try {
      // Simulation du paiement - ici on intégrerait Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      onTopUp(amount, currentBonus.bonusAmount);
    } catch (error) {
      console.error('Erreur de paiement:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xl bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-cyan-50/30 flex items-center justify-center z-[10001] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)'
        }}
      >
        {/* Header avec design Web 3.0 */}
        <div className="relative p-8 rounded-t-3xl overflow-hidden">
          {/* Background animé subtil */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent"></div>
          
          {/* Éléments décoratifs */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Recharger mon portefeuille
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-gray-600 font-medium">
                    Solde actuel : <span className="text-gray-900 font-bold">{currentBalance.toFixed(2)}€</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="relative group p-3 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <X className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors relative z-10" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Montants suggérés avec design Web 3.0 */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Montants suggérés
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SUGGESTED_AMOUNTS.map((suggestedAmount, index) => {
                const bonus = getApplicableBonus(suggestedAmount);
                const isSelected = amount === suggestedAmount && !customAmount;
                
                return (
                  <motion.button
                    key={suggestedAmount}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAmountChange(suggestedAmount)}
                    className={`
                      relative p-6 rounded-2xl border transition-all duration-300 group overflow-hidden
                      ${isSelected 
                        ? 'border-blue-200 shadow-xl ring-2 ring-blue-100' 
                        : 'border-gray-100 bg-white/60 hover:border-blue-100 hover:shadow-lg'
                      }
                    `}
                    style={{
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)'
                    }}
                  >
                    {/* Effet de brillance animé */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Icône décorative */}
                    <div className="absolute top-3 right-3 opacity-20">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"></div>
                    </div>
                    
                    <div className="relative">
                      <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                        {suggestedAmount}€
                      </div>
                      {bonus.bonusAmount > 0 && (
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center space-x-1 bg-gradient-to-r from-green-100 to-emerald-100 px-2 py-1 rounded-full">
                            <Gift className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-700 font-bold">
                              +{bonus.bonusAmount}€
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2"
                        >
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-1.5 shadow-lg">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Montant personnalisé avec design moderne */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <label className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Ou entrez un montant personnalisé
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <input
                type="number"
                min="10"
                step="0.01"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="Ex: 150"
                className="relative w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:border-transparent pr-12 text-lg font-medium transition-all duration-200 placeholder-gray-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <span className="text-gray-500 font-medium">€</span>
              </div>
            </div>
          </div>

          {/* Aperçu du bonus avec design Web 3.0 */}
          <motion.div
            key={amount}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative mb-8 overflow-hidden rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(147, 51, 234, 0.05) 100%)'
            }}
          >
            {/* Background décoratif */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-purple-400/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
            
            <div className="relative border border-white/50 backdrop-blur-sm rounded-3xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Montant à payer */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="text-sm font-medium text-gray-600">Montant à payer</div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {amount.toFixed(2)}€
                  </div>
                </div>
                
                {/* Bonus */}
                {currentBonus.bonusAmount > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="text-sm font-medium text-green-600">Bonus offert</div>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      +{currentBonus.bonusAmount}€
                    </div>
                  </div>
                )}
                
                {/* Solde final */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="text-sm font-medium text-blue-600">Votre nouveau solde</div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {(currentBalance + finalAmount).toFixed(2)}€
                  </div>
                </div>
              </div>
              
              {currentBonus.bonusAmount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-center"
                >
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Gift className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-bold text-green-700">
                      {currentBonus.description} - Bonus de {currentBonus.bonusPercentage}%
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Conditions d'utilisation avec design moderne */}
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-2xl border border-amber-200/50 backdrop-blur-sm"
                 style={{
                   background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)'
                 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10"></div>
              <div className="relative p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-amber-900 mb-3">Important à retenir</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-amber-800">Les fonds ajoutés ne sont <strong>pas remboursables</strong></span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-amber-800">Votre solde peut être utilisé pour acheter du contenu sur la plateforme</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-amber-800">Les bonus sont crédités immédiatement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case à cocher obligatoire avec design moderne */}
          <div className="mb-8">
            <label className="flex items-start space-x-4 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="sr-only"
                />
                <div className={`
                  w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center
                  ${acceptTerms 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 shadow-lg' 
                    : 'border-gray-300 bg-white group-hover:border-blue-300'
                  }
                `}>
                  {acceptTerms && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                Je comprends et j'accepte que les fonds ajoutés à mon portefeuille ne sont{' '}
                <strong className="text-gray-900">pas remboursables</strong>, conformément aux{' '}
                <a href="/conditions" className="text-blue-600 hover:text-blue-700 underline font-medium">
                  conditions générales de vente
                </a>.
              </span>
            </label>
          </div>

          {/* Boutons d'action avec design Web 3.0 */}
          <div className="flex space-x-4">
            <motion.button
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50/80 transition-all duration-200 font-medium"
            >
              Annuler
            </motion.button>
            
            <motion.button
              onClick={handleProceed}
              disabled={!acceptTerms || amount < 10 || isProcessing}
              whileHover={acceptTerms && amount >= 10 && !isProcessing ? { scale: 1.02 } : {}}
              whileTap={acceptTerms && amount >= 10 && !isProcessing ? { scale: 0.98 } : {}}
              className={`
                relative flex-1 px-6 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden
                ${acceptTerms && amount >= 10 && !isProcessing
                  ? 'text-white shadow-xl hover:shadow-2xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              style={acceptTerms && amount >= 10 && !isProcessing ? {
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)'
              } : {}}
            >
              {/* Effet de brillance animé */}
              {acceptTerms && amount >= 10 && !isProcessing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
              )}
              
              <div className="relative flex items-center space-x-2">
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Procéder au paiement</span>
                  </>
                )}
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

