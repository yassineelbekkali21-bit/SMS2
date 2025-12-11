'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Star, Award, Crown, Shield, Flame, Zap, Target,
  TrendingUp, Users, Calendar, Gift, Sparkles, Medal, X
} from 'lucide-react';
import { UserXPProfile } from '@/lib/xp-service';

interface GamifiedProfileProps {
  profile: UserXPProfile;
  userName: string;
  userAvatar?: string;
  onClose?: () => void;
}

// Avatars évolutifs par niveau
const getAvatarForLevel = (level: number) => {
  if (level >= 50) return { emoji: '👑', label: 'Légende' };
  if (level >= 40) return { emoji: '💎', label: 'Diamant' };
  if (level >= 30) return { emoji: '🔥', label: 'Maître' };
  if (level >= 20) return { emoji: '⚡', label: 'Expert' };
  if (level >= 10) return { emoji: '🌟', label: 'Avancé' };
  return { emoji: '🎓', label: 'Débutant' };
};

export function GamifiedProfile({ profile, userName, userAvatar, onClose }: GamifiedProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'stats'>('overview');
  
  const { currentLevel, nextLevel, progressToNext, totalXP, dailyStreak } = profile;
  const avatar = getAvatarForLevel(currentLevel.level);
  
  // Badges triés par rareté
  const allBadges = profile.badges || [];
  const unlockedBadges = allBadges.filter(b => b.unlockedAt);
  const lockedBadges = allBadges.filter(b => !b.unlockedAt);

  // Stats de progression
  const stats = {
    coursesCompleted: profile.completedCourses || 0,
    totalStudyTime: profile.totalStudyTime || 0,
    perfectQuizzes: profile.perfectQuizzes || 0,
    helpedStudents: profile.helpedStudents || 0,
  };

  const tabs = [
    { id: 'overview' as const, label: 'Vue d\'ensemble', icon: Target },
    { id: 'badges' as const, label: 'Badges', icon: Award },
    { id: 'stats' as const, label: 'Statistiques', icon: TrendingUp },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header propre et sobre */}
          <div className="bg-gray-900 border-b border-gray-800 p-6 relative">
            {/* Bouton fermer */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                style={{ color: 'white' }}
              >
                <X size={20} style={{ color: 'white' }} />
              </button>
            )}

            {/* Profil utilisateur */}
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center">
                <span className="text-5xl">{avatar.emoji}</span>
              </div>

              {/* Infos utilisateur */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1" style={{ color: 'white' }}>{userName}</h2>
                <p className="text-sm mb-3" style={{ color: 'white', opacity: 0.75 }}>{avatar.label}</p>
                
                {/* Niveau et XP */}
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg">
                    <p className="text-xs" style={{ color: 'white', opacity: 0.75 }}>Niveau</p>
                    <p className="text-lg font-bold" style={{ color: 'white' }}>{currentLevel.level}</p>
                  </div>
                  <div className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg">
                    <p className="text-xs" style={{ color: 'white', opacity: 0.75 }}>XP Total</p>
                    <p className="text-lg font-bold" style={{ color: 'white' }}>{totalXP.toLocaleString()}</p>
                  </div>
                  {dailyStreak > 0 && (
                    <div className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg flex items-center gap-2">
                      <Flame size={16} className="text-orange-400" />
                      <p className="text-lg font-bold" style={{ color: 'white' }}>{dailyStreak}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Barre de progression vers le prochain niveau */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2" style={{ color: 'white', opacity: 0.9 }}>
                <span>Progression vers le niveau {nextLevel?.level || currentLevel.level + 1}</span>
                <span>{Math.round(progressToNext * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {/* Vue d'ensemble */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Statistiques rapides */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Trophy className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{unlockedBadges.length}</p>
                        <p className="text-sm text-gray-600">Badges</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</p>
                        <p className="text-sm text-gray-600">Cours terminés</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges récents */}
                {unlockedBadges.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award size={18} className="text-blue-600" />
                      Derniers badges débloqués
                    </h3>
                    <div className="space-y-3">
                      {unlockedBadges.slice(0, 3).map((badge) => (
                        <div key={badge.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <div className="text-2xl">{badge.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{badge.name}</p>
                            <p className="text-xs text-gray-500">{badge.description}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {badge.unlockedAt && new Date(badge.unlockedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Collection de badges */}
            {activeTab === 'badges' && (
              <div className="space-y-6">
                {/* Badges débloqués */}
                {unlockedBadges.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Trophy size={18} className="text-blue-600" />
                      Badges débloqués ({unlockedBadges.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {unlockedBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className="bg-white border-2 border-blue-200 rounded-xl p-4 text-center"
                        >
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <p className="font-semibold text-gray-900 text-sm mb-1">{badge.name}</p>
                          <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                          {badge.rarity && (
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                              badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                              badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {badge.rarity === 'legendary' ? 'Légendaire' :
                               badge.rarity === 'epic' ? 'Épique' :
                               badge.rarity === 'rare' ? 'Rare' : 'Commun'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Badges verrouillés */}
                {lockedBadges.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-gray-400" />
                      Badges à débloquer ({lockedBadges.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {lockedBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 text-center opacity-60"
                        >
                          <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                          <p className="font-semibold text-gray-700 text-sm mb-1">{badge.name}</p>
                          <p className="text-xs text-gray-500">{badge.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Statistiques détaillées */}
            {activeTab === 'stats' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="text-blue-600" size={20} />
                      <span className="font-semibold text-gray-900">Cours complétés</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${Math.min((stats.coursesCompleted / 10) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-purple-600" size={20} />
                      <span className="font-semibold text-gray-900">Temps d'étude</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{Math.round(stats.totalStudyTime / 60)}h</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-600" size={20} />
                      <span className="font-semibold text-gray-900">Quiz parfaits</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{stats.perfectQuizzes}</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="text-green-600" size={20} />
                      <span className="font-semibold text-gray-900">Étudiants aidés</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{stats.helpedStudents}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
