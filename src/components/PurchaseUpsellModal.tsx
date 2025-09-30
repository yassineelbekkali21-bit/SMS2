'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, GraduationCap, Award, CheckCircle, CreditCard, Wallet } from 'lucide-react';
import { PurchaseOption } from '@/types';
import { WalletService } from '@/lib/wallet-service';
import { WalletTopUp } from './WalletTopUp';


interface PurchaseUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOptions: PurchaseOption[];
  onPurchase?: (option: PurchaseOption) => void;
  onAddFunds?: () => void;
}

const OPTION_ICONS = {
  lesson: BookOpen,
  course: GraduationCap, 
  pack: Award
};

const OPTION_COLORS = {
  lesson: 'from-gray-50 to-gray-100',
  course: 'from-blue-50 to-blue-100', 
  pack: 'from-purple-50 to-purple-100'
};

export function PurchaseUpsellModal({ 
  isOpen, 
  onClose, 
  purchaseOptions, 
  onPurchase,
  onAddFunds 
}: PurchaseUpsellModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [topUpSource, setTopUpSource] = useState<'lesson' | 'course' | 'pack' | 'general'>('general');

  // Charger le solde au montage et quand la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      const balance = WalletService.getBalance();
      setUserBalance(balance);
      console.log(`💰 UPSELL MODAL: Solde chargé - ${balance.toFixed(2)}€`);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handlePurchase = (option: PurchaseOption) => {
    console.log('🛒 UPSELL MODAL: handlePurchase called with option:', option);
    console.log('💰 UPSELL MODAL: userBalance:', userBalance, 'price:', option.price);
    
    const result = WalletService.makePurchase(option);
    
    if (result.success) {
      console.log('✅ Achat réussi via WalletService');
      setUserBalance(result.newBalance);
      
      // Appeler le callback parent si fourni
      if (onPurchase) {
        onPurchase(option);
      }
      
      // Fermer la modal après l'achat réussi
      setTimeout(() => {
        onClose();
      }, 100);
      
      // Afficher un toast de succès
      alert(`🎉 Achat réussi !\n\n${option.title} a été débloqué.\nNouveau solde: ${result.newBalance.toFixed(2)}€`);
    } else {
      console.log('❌ Achat échoué:', result.error);
      // Déclencher la recharge avec la source appropriée
      const source = option.type === 'lesson' ? 'lesson' : option.type === 'course' ? 'course' : 'pack';
      handleTopUpRequest(source);
    }
  };

  const handleTopUpRequest = (source: 'lesson' | 'course' | 'pack' | 'general') => {
    console.log(`💳 UPSELL MODAL: Demande de recharge depuis ${source}`);
    setTopUpSource(source);
    
    if (onAddFunds) {
      onAddFunds();
    } else {
      // Utiliser notre propre modal de recharge
      setShowTopUpModal(true);
    }
  };

  const handleTopUpComplete = (amount: number, bonus: number) => {
    console.log(`💰 UPSELL MODAL: Recharge terminée - +${amount}€${bonus ? ` + bonus ${bonus}€` : ''}`);
    
    // Mettre à jour le solde via WalletService
    const result = WalletService.topUpWallet(amount, topUpSource);
    if (result.success) {
      setUserBalance(result.newBalance);
      
      // Afficher un message de succès
      const message = bonus > 0
        ? `🎉 Recharge réussie !\n\n+${amount}€ + bonus ${bonus}€\nNouveau solde: ${result.newBalance.toFixed(2)}€`
        : `💰 Recharge réussie !\n\n+${amount}€\nNouveau solde: ${result.newBalance.toFixed(2)}€`;
      
      alert(message);
    }
    setShowTopUpModal(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 flex items-center justify-center z-[10000] p-2">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Choisissez votre parcours d'apprentissage</h2>
                <p className="text-gray-600 mt-0.5 text-sm">
                  Nous vous recommandons une approche complète pour maximiser votre réussite
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conseil pédagogique */}
          <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-1.5 rounded-full">
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-blue-900">Conseil pédagogique</h3>
                <p className="text-blue-800 text-sm leading-tight">
                  Une approche progressive et complète est la clé de la réussite ! Nos experts recommandent de maîtriser l'ensemble du sujet. 
                  <span className="font-medium">Tu peux toujours commencer petit et évoluer !</span>
                </p>
              </div>
            </div>
          </div>

          {/* Options d'achat */}
          <div className="p-4">
            <div className={`grid grid-cols-1 ${
              purchaseOptions.length === 1 
                ? 'md:grid-cols-1 max-w-md mx-auto' 
                : purchaseOptions.length === 2 
                  ? 'md:grid-cols-2' 
                  : 'md:grid-cols-3'
            } gap-4`}>
              {(purchaseOptions || [])
                .map((option, index) => {
                  const IconComponent = OPTION_ICONS[option.type];
                  const canAfford = userBalance >= option.price;
                  const isRecommended = option.badge === 'Recommandé';
                  const isValueAdded = option.badge === 'Valeur ajoutée';
                  
                  return (
                    <motion.div
                      key={option.itemId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        relative bg-white border rounded-2xl overflow-hidden h-full
                        ${isRecommended ? 'border-blue-200 shadow-lg ring-2 ring-blue-100' : ''}
                        ${isValueAdded ? 'border-purple-200 shadow-lg ring-2 ring-purple-100' : ''}
                        ${!isRecommended && !isValueAdded ? 'border-gray-200 hover:border-gray-300 hover:shadow-md' : ''}
                        ${!canAfford ? 'opacity-75' : ''}
                      `}
                    >

                      {/* Badge */}
                      {option.badge && (
                        <div className={`
                          absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium z-10
                          ${isRecommended ? 'bg-blue-500 text-white' : ''}
                          ${isValueAdded ? 'bg-purple-500 text-white' : ''}
                          ${option.badge === 'Accès basique' ? 'bg-gray-400 text-white' : ''}
                          ${option.badge === 'Meilleur investissement' ? 'bg-purple-500 text-white' : ''}
                        `}>
                          {option.badge}
                        </div>
                      )}

                      {/* Header avec icône */}
                      <div className="p-4 text-center">
                        <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${OPTION_COLORS[option.type]} flex items-center justify-center mb-3`}>
                          <IconComponent className={`w-6 h-6 ${
                            option.type === 'course' ? 'text-blue-600' : 
                            option.type === 'pack' ? 'text-purple-600' : 
                            'text-gray-600'
                          }`} />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                          {option.title}
                        </h3>
                        <p className="text-gray-600 text-xs leading-tight">
                          {option.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="px-4 pb-3">
                        <ul className="space-y-1.5 mb-4">
                          {(option.features || []).map((feature, idx) => {
                            const isSubItem = feature.startsWith('•') || feature.startsWith('–');
                            const displayText = isSubItem ? feature.substring(2) : feature;
                            
                            return (
                              <li key={idx} className={`flex items-start space-x-2 ${isSubItem ? 'ml-5' : ''}`}>
                                {!isSubItem && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />}
                                {isSubItem && <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0 mt-1.5"></div>}
                                <span className="text-gray-700 text-xs leading-snug">{displayText}</span>
                              </li>
                            );
                          })}
                        </ul>


                        {/* Prix */}
                        <div className="text-center mb-3">
                          <div className="flex items-end justify-center space-x-1">
                            <div className="text-2xl font-bold text-gray-900">
                              {option.price}
                            </div>
                            <div className="text-sm text-gray-600 pb-0.5">💳</div>
                          </div>
                          <div className="text-xs text-gray-500">euros</div>
                        </div>

                        {/* Status du solde */}
                        {!canAfford && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
                            <div className="text-orange-800 text-xs text-center">
                              Solde insuffisant
                            </div>
                            <div className="text-orange-600 text-xs text-center">
                              Il vous manque {(option.price - userBalance).toFixed(2)}€
                            </div>
                          </div>
                        )}

                        {/* Message de recommandation */}
                        {isRecommended && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                            <div className="text-blue-800 text-xs text-center font-medium">
                              Avantage pédagogique
                            </div>
                          </div>
                        )}


                        {/* Hint Wallet - uniquement pour le pack */}
                        {option.type === 'pack' && !canAfford && (
                          <div className="mb-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600 text-sm">💡</span>
                              <div className="text-xs text-blue-800 leading-tight">
                                {WalletService.getPackBonusHint() || option.walletHint}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bouton d'action */}
                        <button
                          onClick={() => canAfford ? handlePurchase(option) : handleTopUpRequest(option.type as 'lesson' | 'course' | 'pack')}
                          className={`
                            w-full py-2.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-1.5
                            ${canAfford
                              ? option.type === 'course' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                                option.type === 'pack' ? 'bg-purple-500 hover:bg-purple-600 text-white' :
                                'bg-gray-500 hover:bg-gray-600 text-white'
                              : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                            }
                          `}
                        >
                          {canAfford ? (
                            <>
                              <CreditCard className="w-3.5 h-3.5" />
                              <span className="text-sm">
                                {option.type === 'lesson' && `Débloquer pour ${option.price}€`}
                                {option.type === 'course' && `Débloquer pour ${option.price}€`}
                                {option.type === 'pack' && `Débloquer pour ${option.price}€`}
                              </span>
                            </>
                          ) : (
                            <>
                              <Wallet className="w-3.5 h-3.5" />
                              <span className="text-sm">Recharger mon portefeuille</span>
                            </>
                          )}
                        </button>

                      </div>
                    </motion.div>
                  );
                })}
            </div>

            {/* Informations sur le solde */}
            <div className="mt-4 bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 font-medium text-sm">Solde actuel du portefeuille</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {userBalance.toFixed(2)}€
                </div>
              </div>
              
              {userBalance < Math.max(...purchaseOptions.map(o => o.price)) && (
                <div className="mt-2 text-center">
                  <button
                    onClick={() => handleTopUpRequest('general')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs hover:underline"
                  >
                    Recharger mon portefeuille pour plus d'options
                  </button>
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Modal de recharge */}
      {showTopUpModal && (
        <WalletTopUp
          currentBalance={userBalance}
          onCancel={() => setShowTopUpModal(false)}
          onTopUp={handleTopUpComplete}
          isPackOffer={topUpSource === 'pack'}
        />
      )}
    </div>
  );
}

