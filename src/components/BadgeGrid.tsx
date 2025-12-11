'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/lib/xp-service';

interface BadgeGridProps {
  badges: Badge[];
  className?: string;
  maxDisplay?: number;
  showUnlocked?: boolean;
}

export default function BadgeGrid({ 
  badges, 
  className = '', 
  maxDisplay = 10,
  showUnlocked = true 
}: BadgeGridProps) {
  
  const filteredBadges = showUnlocked 
    ? badges.filter(badge => badge.isUnlocked).slice(0, maxDisplay)
    : badges.slice(0, maxDisplay);
  
  const unlockedCount = badges.filter(badge => badge.isUnlocked).length;
  const totalBadges = badges.length;

  if (filteredBadges.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <div className="text-gray-400 text-2xl mb-2">🏆</div>
        <p className="text-sm text-gray-500">
          {showUnlocked ? 'Aucun badge débloqué' : 'Aucun badge disponible'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Continue tes efforts pour débloquer tes premiers badges !
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header avec compteur */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          🏆 Badges débloqués
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {unlockedCount}/{totalBadges}
        </span>
      </div>

      {/* Grille de badges */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {filteredBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.15 }
            }}
            className={`
              relative p-3 rounded-xl text-center cursor-pointer transition-all
              ${badge.isUnlocked 
                ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-sm' 
                : 'bg-gray-50 border-2 border-gray-200 opacity-60'
              }
            `}
            title={badge.description}
          >
            {/* Emoji du badge */}
            <motion.div
              animate={badge.isUnlocked ? { 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ 
                duration: 2, 
                repeat: badge.isUnlocked ? Infinity : 0,
                ease: "easeInOut"
              }}
              className="text-2xl mb-1"
            >
              {badge.emoji}
            </motion.div>
            
            {/* Nom du badge */}
            <p className={`text-xs font-medium leading-tight ${
              badge.isUnlocked ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {badge.name}
            </p>
            
            {/* Indicateur nouveau badge */}
            {badge.isUnlocked && badge.unlockedAt && 
             new Date().getTime() - badge.unlockedAt.getTime() < 24 * 60 * 60 * 1000 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              />
            )}
          </motion.div>
        ))}
        
        {/* Placeholder pour badges non débloqués */}
        {!showUnlocked && badges.filter(b => !b.isUnlocked).slice(0, Math.max(0, maxDisplay - filteredBadges.length)).map((badge, index) => (
          <motion.div
            key={`locked-${badge.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (filteredBadges.length + index) * 0.1 }}
            className="relative p-3 rounded-xl text-center bg-gray-100 border-2 border-dashed border-gray-300"
            title={`🔒 ${badge.description}`}
          >
            <div className="text-2xl mb-1 grayscale opacity-50">
              {badge.emoji}
            </div>
            <p className="text-xs text-gray-400 leading-tight">
              {badge.name}
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400 text-lg">🔒</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Message d'encouragement */}
      {showUnlocked && unlockedCount < totalBadges && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800 text-center">
            🌟 <strong>{totalBadges - unlockedCount} badges</strong> t'attendent encore !
            Continue tes efforts pour tous les débloquer.
          </p>
        </div>
      )}
    </div>
  );
}


