'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Package,
  BookOpen,
  Crown,
  Zap,
  Gift,
  Star
} from 'lucide-react';
import { Course, CoursePack } from '@/types';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Course | CoursePack | null;
  itemType: 'course' | 'pack';
  userBalance: number; // Changé de userCredits à userBalance (en euros)
  onConfirmPurchase: (itemId: string, itemType: 'course' | 'pack') => void;
  includedCourses?: Course[]; // Pour les packs
}

export function PurchaseModal({
  isOpen,
  onClose,
  item,
  itemType,
  userBalance,
  onConfirmPurchase,
  includedCourses = []
}: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  if (!item) return null;

  const cost = itemType === 'course' 
    ? (item as Course).price || 700
    : (item as CoursePack).price || (item as CoursePack).creditCost;

  const canAfford = userBalance >= cost;
  const remainingBalance = userBalance - cost;

  const handleConfirmPurchase = async () => {
    if (!canAfford || isProcessing) return;

    setIsProcessing(true);
    
    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onConfirmPurchase(item.id, itemType);
    setPurchaseComplete(true);
    
    // Fermer le modal après l'animation de succès
    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseComplete(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {purchaseComplete ? 'Achat réussi !' : 'Confirmer l\'achat'}
                </h2>
                {!isProcessing && (
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              {purchaseComplete ? (
                /* Animation de succès */
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="text-green-600" size={40} />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 mb-2"
                  >
                    {itemType === 'pack' ? 'Pack débloqué !' : 'Cours débloqué !'}
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600 mb-6"
                  >
                    {itemType === 'pack' 
                      ? `Tous les cours du pack ont été ajoutés à tes favoris !`
                      : `Le cours a été ajouté à tes favoris !`
                    }
                  </motion.p>

                  {/* Animation des cours qui remontent */}
                  {itemType === 'pack' && includedCourses.length > 0 && (
                    <div className="space-y-2">
                      {includedCourses.slice(0, 3).map((course, index) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
                        >
                          <CheckCircle className="text-green-600" size={16} />
                          <span className="text-sm font-medium text-green-800">
                            {course.title}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : isProcessing ? (
                /* Animation de traitement */
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-6"
                  >
                    <Brain className="text-purple-600" size={64} />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Traitement en cours...
                  </h3>
                  <p className="text-gray-600">
                    Déverrouillage de ton contenu
                  </p>

                  {/* Barre de progression */}
                  <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              ) : (
                /* Confirmation d'achat */
                <>
                  {/* Aperçu de l'item */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        itemType === 'pack' 
                          ? `bg-gradient-to-br ${(item as CoursePack).color}`
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        {itemType === 'pack' ? (
                          <div className="text-2xl">{(item as CoursePack).icon}</div>
                        ) : (
                          <BookOpen className="text-white" size={24} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {itemType === 'course' ? (item as Course).title : (item as CoursePack).title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {itemType === 'course' ? (item as Course).description : (item as CoursePack).description}
                        </p>
                        
                        {itemType === 'pack' && (
                          <div className="flex items-center gap-2">
                            <Package size={14} className="text-purple-600" />
                            <span className="text-sm text-purple-600 font-medium">
                              {includedCourses.length} cours inclus
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Détails du pack */}
                  {itemType === 'pack' && includedCourses.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Gift className="text-purple-600" size={18} />
                        Cours inclus dans ce pack :
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {includedCourses.map((course) => (
                          <div key={course.id} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                            <BookOpen className="text-purple-600" size={14} />
                            <span className="text-sm text-gray-900">{course.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Résumé financier */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Brain className="text-purple-600" size={18} />
                      Résumé de l'achat
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Solde actuel</span>
                        <span className="font-bold text-gray-900">{userBalance.toFixed(2)}€</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Coût</span>
                        <span className="font-bold text-red-600">-{cost.toFixed(2)}€</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">Solde restant</span>
                          <span className={`font-bold text-xl ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                            {remainingBalance.toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message d'erreur si pas assez de crédits */}
                  {!canAfford && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 mt-0.5" size={18} />
                        <div>
                          <p className="font-medium text-red-800 mb-1">
                            Solde insuffisant
                          </p>
                          <p className="text-sm text-red-600">
                            Il te manque {(cost - userBalance).toFixed(2)}€ pour cet achat.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 py-3 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                    >
                      Annuler
                    </button>
                    
                    <button
                      onClick={handleConfirmPurchase}
                      disabled={!canAfford}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        canAfford
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Brain size={16} />
                      <span>Confirmer l'achat</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {/* Message de valeur */}
                  {canAfford && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                      <p className="text-xs text-blue-700 text-center">
                        {itemType === 'pack' 
                          ? '🚀 Accès étendu : Plusieurs cours + accompagnement complet'
                          : '💡 Accès limité : Ce cours uniquement'
                        }
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
