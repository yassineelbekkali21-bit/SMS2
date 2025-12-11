'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserXPProfile } from '@/lib/xp-service';
import XPProgressBar from './XPProgressBar';
import BadgeGrid from './BadgeGrid';

interface XPWidgetProps {
  profile: UserXPProfile;
  className?: string;
  compact?: boolean;
}

export default function XPWidget({ profile, className = '', compact = false }: XPWidgetProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { currentLevel, totalXP, badges } = profile;
  const unlockedBadges = badges.filter(badge => badge.isUnlocked);
  const recentBadges = unlockedBadges
    .filter(badge => badge.unlockedAt && new Date().getTime() - badge.unlockedAt.getTime() < 7 * 24 * 60 * 60 * 1000)
    .slice(0, 3);

  // Gestion du raccourci clavier Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDetails) {
        setShowDetails(false);
      }
    };

    if (showDetails) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showDetails]);

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md bg-gray-800 hover:bg-gray-700 border-gray-600`}
          title={showDetails ? 'Cliquer pour fermer les détails XP' : 'Cliquer pour voir les détails XP'}
          style={{ color: 'white' }}
        >
          {/* Affichage simple des XP - Style demandé */}
          <div className="text-left">
            <p className="text-sm font-bold" style={{ color: 'white' }}>
              +{totalXP.toLocaleString()} XP
            </p>
          </div>

          {/* Indicateur chevron avec état */}
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`transition-colors duration-200`}
            style={{ color: showDetails ? '#60a5fa' : '#9ca3af' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.button>

        {/* Dropdown détails - Style SimpleDashboard */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                       className="absolute top-full right-0 mt-3 w-[420px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
            >
              {/* Header simplifié - Style SimpleDashboard */}
              <div className="bg-gray-50 p-4 border-b border-gray-200 relative">
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
                  title="Fermer"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Badge niveau centré - Style SimpleDashboard */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center"
                >
                  <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">
                    {currentLevel.title} • Niveau {currentLevel.level}
                  </div>
                </motion.div>
              </div>

              <div className="p-6 space-y-6">
                       {/* Progression détaillée */}
                       <div className="space-y-4">
                         <XPProgressBar profile={profile} showDetails={true} />
                         
                         {/* Prochain niveau à droite (simplifié) */}
                         {profile.nextLevel && (
                           <div className="flex justify-end">
                             <span className="text-sm font-medium text-gray-700">{profile.nextLevel.title}</span>
                           </div>
                         )}
                       </div>
                
                       {/* Badges - Simplifié */}
                       <div className="space-y-3">
                         <BadgeGrid 
                           badges={badges} 
                           maxDisplay={6}
                           showUnlocked={true}
                         />
                       </div>
                
                {/* Actions récentes - Style SimpleDashboard */}
                {profile.recentActions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="mr-2">📈</span>
                      Actions récentes
                    </h4>
                    <div className="space-y-2">
                      {profile.recentActions.slice(0, 3).map((action, index) => (
                        <motion.div 
                          key={action.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">{action.emoji}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-900 font-medium">
                                {action.title}
                              </span>
                              <p className="text-xs text-gray-500">
                                {action.description}
                              </p>
                            </div>
                          </div>
                                 <motion.div
                                   initial={{ scale: 0 }}
                                   animate={{ scale: 1 }}
                                   transition={{ delay: index * 0.1 + 0.2 }}
                                   className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
                                 >
                                   +{action.points} XP
                                 </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay pour fermer */}
        {showDetails && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />
        )}
      </div>
    );
  }

  // Version complète (non-compact)
  return (
    <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">🎯</span>
          Progression XP
        </h2>
        
        {profile.dailyStreak > 0 && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full"
          >
            <span className="text-xs">🔥</span>
            <span className="text-xs font-medium">{profile.dailyStreak} jours</span>
          </motion.div>
        )}
      </div>
      
      <XPProgressBar profile={profile} showDetails={true} className="mb-6" />
      
      <BadgeGrid badges={badges} showUnlocked={true} />
      
      {/* Récompenses disponibles */}
      {currentLevel.rewards && currentLevel.rewards.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
            <span className="mr-1">🎁</span>
            Récompenses de ton niveau
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            {currentLevel.rewards.map((reward, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-2">•</span>
                {reward}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
