'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Plus, TrendingUp, Gift } from 'lucide-react';
import { ProgressionBonusService } from '@/lib/progression-bonus-service';

interface WalletBalanceProps {
  balance: number;
  onAddFunds: () => void;
  className?: string;
  userId?: string;
}

export function WalletBalance({ balance, onAddFunds, className = '', userId = 'user-default' }: WalletBalanceProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Obtenir les bonus de progression
  const progressionBonusSummary = ProgressionBonusService.getProgressionBonusSummary(userId);
  const hasProgressionBonus = progressionBonusSummary.hasAvailableBonus;
  const totalProgressionBonus = progressionBonusSummary.totalAvailableAmount;

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cursor-target flex items-center space-x-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-2 hover:shadow-md transition-shadow">
        {/* Icône cerveau */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2 rounded-lg">
          <Brain className="w-4 h-4" />
        </div>
        
        {/* Solde */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-medium">Portefeuille</span>
          <span className="text-lg font-bold text-gray-900">
            {(balance + totalProgressionBonus).toFixed(2)}€
          </span>
        </div>

        {/* Bouton d'ajout */}
        <button
          onClick={onAddFunds}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors group"
          title="Recharger mon portefeuille"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Tooltip au survol */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full mt-2 left-0 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-50"
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span>Solde: {balance.toFixed(2)}€</span>
          </div>
          {hasProgressionBonus && (
            <div className="flex items-center space-x-2 mt-1">
              <Gift className="w-3 h-3 text-purple-400" />
              <span>Bonus progression: +{totalProgressionBonus}€</span>
            </div>
          )}
          <div className="mt-1 text-gray-300 border-t border-gray-700 pt-1">
            Total disponible: {(balance + totalProgressionBonus).toFixed(2)}€
          </div>
          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default WalletBalance;







