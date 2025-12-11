'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, TrendingUp, CreditCard } from 'lucide-react';
import { ProgressionBonusService } from '@/lib/progression-bonus-service';

interface PackCompletionCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  packTitle: string;
  packId: string;
  userId: string;
  onExploreOtherPacks?: () => void;
  onRechargeNow?: () => void;
}

export function PackCompletionCelebrationModal({
  isOpen,
  onClose,
  packTitle,
  packId,
  userId,
  onExploreOtherPacks,
  onRechargeNow
}: PackCompletionCelebrationModalProps) {

  // Ajouter le bonus de progression lors de l'ouverture
  React.useEffect(() => {
    if (isOpen && packId && userId) {
      ProgressionBonusService.addProgressionBonus(userId, packId, packTitle);
    }
  }, [isOpen, packId, userId, packTitle]);

  const handleExploreOtherPacks = () => {
    onExploreOtherPacks?.();
    onClose();
  };

  const handleRechargeNow = () => {
    onRechargeNow?.();
    onClose();
  };

  const cleanPackTitle = packTitle.replace('Pack ', '');
  const bonusAmount = 100; // Montant fixe du bonus

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 md:p-8">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200"
      >
        {/* Header avec fond clair et accents colorés */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-8 text-center relative border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", damping: 20 }}
            className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"
          >
            <Sparkles className="text-emerald-600" size={40} />
          </motion.div>
          
          <motion.h2
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold text-gray-900 mb-3"
          >
            Félicitations !
          </motion.h2>
          
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 font-medium text-lg"
          >
            Tu viens de compléter le pack <strong className="text-blue-600">{cleanPackTitle}</strong>.
          </motion.p>
        </div>

        {/* Contenu avec fond blanc */}
        <div className="p-8 bg-white">
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6"
          >
            <p className="text-gray-700 leading-relaxed">
              Et avec ça, tu as maintenant accès à ton planificateur personnel !
            </p>
          </motion.div>

          {/* Section bonus */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6 border border-purple-200"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Gift size={20} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-purple-900">Bonus de progression débloqué !</h3>
                <p className="text-sm text-purple-700">Récompense pour ta réussite</p>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-700 mb-1">
                +{bonusAmount}€
              </div>
              <p className="text-sm text-purple-600">
                offerts sur ta prochaine recharge
              </p>
            </div>
          </motion.div>

          {/* Message d'encouragement */}
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-8 text-center"
          >
            Continue sur ta lancée 💪
          </motion.p>

          {/* Bouton d'action */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <button
              onClick={handleExploreOtherPacks}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <TrendingUp size={18} />
              Explorer d'autres packs
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
