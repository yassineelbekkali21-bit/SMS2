'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Crown, Zap, Target } from 'lucide-react';

interface ProgressionRewardsProps {
  currentXP: number;
  totalXP: number;
  level: number;
  completedLessons: number;
  totalLessons: number;
  onLevelUp?: (newLevel: number) => void;
}

// Badges disponibles
const availableBadges = [
  {
    id: 'first-lesson',
    name: 'Premier Pas',
    description: 'Première leçon terminée',
    icon: Star,
    requirement: 1,
    type: 'lessons'
  },
  {
    id: 'halfway',
    name: 'Mi-parcours',
    description: '50% du cours terminé',
    icon: Target,
    requirement: 50,
    type: 'percentage'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionniste',
    description: 'Cours terminé à 100%',
    icon: Crown,
    requirement: 100,
    type: 'percentage'
  },
  {
    id: 'xp-master',
    name: 'Maître XP',
    description: '500 XP accumulés',
    icon: Zap,
    requirement: 500,
    type: 'xp'
  }
];

export function ProgressionRewards({ 
  currentXP, 
  totalXP, 
  level, 
  completedLessons, 
  totalLessons,
  onLevelUp 
}: ProgressionRewardsProps) {
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const xpForNextLevel = (level * 100) - currentXP;
  const levelProgress = (currentXP % 100);

  // Calculer les badges débloqués
  const unlockedBadges = availableBadges.filter(badge => {
    switch (badge.type) {
      case 'lessons':
        return completedLessons >= badge.requirement;
      case 'percentage':
        return progressPercentage >= badge.requirement;
      case 'xp':
        return currentXP >= badge.requirement;
      default:
        return false;
    }
  });

  return (
    <div className="space-y-6">
      {/* Progression XP */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Trophy className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Niveau {level}</h3>
              <p className="text-sm text-gray-600">{currentXP} XP • {xpForNextLevel} pour le suivant</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-gray-600">Progression</div>
          </div>
        </div>
        
        {/* Barre de progression niveau */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Niveau {level}</span>
            <span>Niveau {level + 1}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        
        {/* Progression du cours */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progression du cours</span>
            <span>{completedLessons}/{totalLessons} leçons</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.2 }}
            />
          </div>
        </div>
      </div>

      {/* Badges débloqués */}
      {unlockedBadges.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="text-yellow-500" size={20} />
            Badges débloqués
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {unlockedBadges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <IconComponent className="text-white" size={16} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{badge.name}</div>
                    <div className="text-xs text-gray-600">{badge.description}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Prochains objectifs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Prochains objectifs</h3>
        <div className="space-y-3">
          {xpForNextLevel <= 100 && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
              <Trophy className="text-purple-600" size={16} />
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Niveau {level + 1}</div>
                <div className="text-xs text-gray-600">Plus que {xpForNextLevel} XP</div>
              </div>
            </div>
          )}
          
          {progressPercentage < 100 && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <Target className="text-green-600" size={16} />
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Terminer le cours</div>
                <div className="text-xs text-gray-600">
                  {totalLessons - completedLessons} leçons restantes
                </div>
              </div>
            </div>
          )}
          
          {availableBadges
            .filter(badge => !unlockedBadges.includes(badge))
            .slice(0, 2)
            .map(badge => {
              const IconComponent = badge.icon;
              return (
                <div key={badge.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <IconComponent className="text-gray-400" size={16} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{badge.name}</div>
                    <div className="text-xs text-gray-600">{badge.description}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
