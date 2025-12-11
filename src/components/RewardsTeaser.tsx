'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, ArrowRight } from 'lucide-react';

interface Reward {
  id: number;
  title: string;
  emoji: string;
  description: string;
  date: string;
  rarity: 'legendary' | 'epic' | 'rare';
}

interface RewardsTeaserProps {
  rewards: Reward[];
  onViewAll: () => void;
}

export function RewardsTeaser({ rewards, onViewAll }: RewardsTeaserProps) {
  // Prendre seulement les 3 derniers
  const recentRewards = rewards.slice(0, 3);

  const rarityLabels = {
    legendary: 'Légendaire',
    epic: 'Épique',
    rare: 'Rare',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-200"
    >
      {/* Header minimaliste */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Tes Récompenses</h3>
            <p className="text-xs text-gray-500">{rewards.length} badge{rewards.length > 1 ? 's' : ''} débloqué{rewards.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewAll}
          className="cursor-target flex items-center gap-1.5 px-4 py-2 text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-all"
        >
          <span>Voir tout</span>
          <ArrowRight size={14} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Grille de badges sobre */}
      {recentRewards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recentRewards.map((reward, idx) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className="cursor-target bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icône badge simple */}
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl border border-gray-200 mb-3 group-hover:scale-105 transition-transform">
                  {reward.emoji}
                </div>
                
                {/* Titre */}
                <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                  {reward.title}
                </h4>
                
                {/* Description */}
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {reward.description}
                </p>
                
                {/* Rareté + date */}
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-auto pt-2">
                  <span className="font-medium">{rarityLabels[reward.rarity]}</span>
                  <span>•</span>
                  <span>{reward.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Message si pas de récompenses
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-3 flex items-center justify-center">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 font-medium mb-1">Aucune récompense</p>
          <p className="text-xs text-gray-500">Participe aux compétitions pour gagner des badges</p>
        </div>
      )}
    </motion.div>
  );
}

