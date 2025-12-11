'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserXPProfile } from '@/lib/xp-service';

interface XPProgressBarProps {
  profile: UserXPProfile;
  className?: string;
  showDetails?: boolean;
}

export default function XPProgressBar({ profile, className = '', showDetails = true }: XPProgressBarProps) {
  const { currentLevel, nextLevel, progressToNext, totalXP } = profile;
  
  return (
    <div className={`${className}`}>
      {/* Barre de progression - Style onboarding */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-800">
            {totalXP.toLocaleString()} XP
          </span>
          {nextLevel && (
            <span className="text-sm text-gray-500 font-medium">
              Objectif: {nextLevel.minXP.toLocaleString()} XP
            </span>
          )}
        </div>
        
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gray-900 rounded-full relative shadow-sm"
          >
            {/* Effet de brillance animé */}
            <motion.div
              animate={{ x: [-100, 300] }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "linear",
                repeatDelay: 1
              }}
              className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 rounded-full"
            />
          </motion.div>
        </div>
        
        {/* Indicateur de progression */}
        {nextLevel && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            className="absolute -top-8 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-gray-700"
            style={{ left: `${Math.min(85, progressToNext)}%` }}
          >
            {Math.round(progressToNext)}%
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </div>

      {/* Informations sur le prochain niveau supprimées */}
    </div>
  );
}
