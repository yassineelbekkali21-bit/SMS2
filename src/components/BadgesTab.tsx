'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Zap, Calendar, Lock } from 'lucide-react';
import { XPService } from '@/lib/xp-service';

interface BadgesTabProps {
  badges?: any[];
  currentUser?: any;
}

export default function FullBadgesTab({ badges, currentUser, initialFilter }: BadgesTabProps & { initialFilter?: string }) {
  const xpService = XPService.getInstance();
  const profile = xpService.getUserXPProfile();
  const [activeFilter, setActiveFilter] = useState<'all' | 'competitions' | 'social' | 'learning' | 'streaks' | 'achievements'>(initialFilter as any || 'all');

  // Organisation des badges par collections
  const badgeCollections = [
    {
      id: 'competitions',
      title: 'Champion Arena',
      emoji: '🏆',
      description: 'Badges de compétitions',
      badges: [
        { id: 'comp-1', name: 'Champion du Week-end', emoji: '👑', earnedAt: '23 Sept', description: '1ère place Sprint', rarity: 'legendary' },
        { id: 'comp-2', name: 'Top 10 Faculté', emoji: '🥇', earnedAt: '10 Oct', description: 'Top 10 Clash Facultés', rarity: 'epic' },
        { id: 'comp-3', name: 'Sprint Master', emoji: '⚡', earnedAt: '18 Oct', description: '3 Sprints consécutifs', rarity: 'rare' },
      ],
      total: 15,
      locked: [
        { id: 'comp-locked-1', name: 'Premier du Pays', emoji: '🌍', description: 'Gagne un Défi des Pays' },
        { id: 'comp-locked-2', name: 'Série Victorieuse', emoji: '🔥', description: 'Gagne 5 compétitions d\'affilée' },
        { id: 'comp-locked-3', name: 'Podium Parfait', emoji: '🥇🥈🥉', description: 'Termine sur le podium 10 fois' },
        { id: 'comp-locked-4', name: 'Marathon Champion', emoji: '🏃', description: 'Gagne le Marathon de la Connaissance' },
        { id: 'comp-locked-5', name: 'Légende Vivante', emoji: '👑', description: 'Gagne 50 compétitions' },
        { id: 'comp-locked-6', name: 'Compétiteur Acharné', emoji: '⚔️', description: 'Participe à 100 compétitions' },
      ]
    },
    {
      id: 'social',
      title: 'Social Butterfly',
      emoji: '🦋',
      description: 'Badges sociaux et communauté',
      badges: profile.badges.filter(b => 
        b.name.includes('Social') || 
        b.name.includes('Communauté') || 
        b.name.includes('Buddy') ||
        b.name.includes('Partage')
      ),
      total: 12,
      locked: [
        { id: 'social-locked-1', name: 'Super Partageur', emoji: '📢', description: 'Partage 50 ressources' },
        { id: 'social-locked-2', name: 'Mentor Gold', emoji: '👨‍🏫', description: 'Aide 20 étudiants' },
        { id: 'social-locked-3', name: 'Ambassadeur', emoji: '🌟', description: 'Invite 10 personnes' },
        { id: 'social-locked-4', name: 'Community Leader', emoji: '👑', description: 'Crée un cercle actif' },
        { id: 'social-locked-5', name: 'Influenceur', emoji: '💫', description: '100 interactions' },
      ]
    },
    {
      id: 'learning',
      title: 'Learner Legend',
      emoji: '🎓',
      description: 'Badges d\'apprentissage',
      badges: profile.badges.filter(b => 
        b.name.includes('Leçon') || 
        b.name.includes('Quiz') || 
        b.name.includes('Cours') ||
        b.name.includes('Maîtrise')
      ),
      total: 15,
      locked: [
        { id: 'learning-locked-1', name: 'Expert Physique', emoji: '⚛️', description: 'Complète tous les cours de physique' },
        { id: 'learning-locked-2', name: 'Mathématicien', emoji: '🔢', description: 'Maîtrise les maths avancées' },
        { id: 'learning-locked-3', name: 'Savant', emoji: '🧠', description: 'Obtiens 95% sur 10 quiz' },
        { id: 'learning-locked-4', name: 'Perfectionniste', emoji: '💯', description: 'Score parfait sur 5 cours' },
        { id: 'learning-locked-5', name: 'Polyvalent', emoji: '🎯', description: 'Complète 3 domaines différents' },
      ]
    },
    {
      id: 'streaks',
      title: 'Super Streaks',
      emoji: '🔥',
      description: 'Badges de régularité',
      badges: profile.badges.filter(b => 
        b.name.includes('Série') || 
        b.name.includes('Régularité') ||
        b.name.includes('Quotidien')
      ),
      total: 10,
      locked: [
        { id: 'streaks-locked-1', name: 'Série 7 jours', emoji: '🔥', description: 'Apprends 7 jours d\'affilée' },
        { id: 'streaks-locked-2', name: 'Série 30 jours', emoji: '🔥🔥', description: 'Un mois de régularité' },
        { id: 'streaks-locked-3', name: 'Série 60 jours', emoji: '🔥🔥', description: 'Deux mois sans pause' },
        { id: 'streaks-locked-4', name: 'Série 100 jours', emoji: '🔥🔥🔥', description: 'Centurion de l\'apprentissage' },
        { id: 'streaks-locked-5', name: 'Warrior', emoji: '⚔️', description: 'Série de 365 jours' },
      ]
    },
    {
      id: 'achievements',
      title: 'Platform Expert',
      emoji: '⚡',
      description: 'Badges d\'exploration',
      badges: profile.badges.filter(b => 
        b.name.includes('Explorateur') || 
        b.name.includes('Découverte') ||
        b.name.includes('Premier')
      ),
      total: 8,
      locked: [
        { id: 'achievements-locked-1', name: 'Master Planner', emoji: '📅', description: 'Utilise le planificateur 30 jours' },
        { id: 'achievements-locked-2', name: 'Study Room Pro', emoji: '📚', description: 'Rejoins 50 study rooms' },
        { id: 'achievements-locked-3', name: 'Early Adopter', emoji: '🚀', description: 'Teste toutes les fonctionnalités' },
      ]
    }
  ];

  const filteredCollections = activeFilter === 'all' 
    ? badgeCollections 
    : badgeCollections.filter(c => c.id === activeFilter);

  // Composant SimpleMetric identique au SimpleDashboard
  const SimpleMetric = ({ 
    icon: Icon, 
    value, 
    label, 
    accent = false,
    animated = false,
    animationType = 'none'
  }: { 
    icon: any;
    value: string | number;
    label: string;
    accent?: boolean;
    animated?: boolean;
    animationType?: 'glow' | 'flame' | 'pulse' | 'none';
  }) => (
    <motion.div 
      className={`p-4 ${accent ? 'bg-black text-white' : 'bg-white border border-gray-200'} rounded-lg relative overflow-hidden`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Animation de fond pour streak et badges */}
      {animated && animationType === 'flame' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {animated && animationType === 'glow' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent"
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {animated && animationType === 'pulse' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      <div className="flex items-center space-x-3 relative z-10">
        <div className={`${accent ? 'bg-white/10' : 'bg-gray-50'} p-2.5 rounded-lg`}>
          <Icon className={`w-5 h-5 ${accent ? 'text-white' : 'text-gray-700'}`} />
        </div>
        <div>
          <div className={`text-xl font-bold ${accent ? 'text-white' : 'text-gray-900'}`}>{value}</div>
          <div className={`text-xs ${accent ? 'text-white/80' : 'text-gray-600'}`}>{label}</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {/* Header avec stats - Style SimpleDashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SimpleMetric
          icon={TrendingUp}
          value={profile.currentLevel.level}
          label="Niveau"
          accent={true}
        />
        
        <SimpleMetric
          icon={Zap}
          value={profile.totalXP.toLocaleString()}
          label="XP Total"
          animated={true}
          animationType="pulse"
        />
        
        <SimpleMetric
          icon={Award}
          value={profile.badges.length}
          label="Badges"
          animated={true}
          animationType="glow"
        />
        
        <SimpleMetric
          icon={Calendar}
          value={`${profile.dailyStreak} jours`}
          label="Jours de série"
          animated={true}
          animationType="flame"
        />
      </div>

      {/* Progression vers le prochain niveau - Style sobre */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Prochain niveau: {profile.currentLevel.title}</h3>
            <p className="text-xs text-gray-600 mt-0.5">Niveau {profile.currentLevel.level} → {profile.currentLevel.level + 1}</p>
          </div>
          {profile.nextLevel && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              {profile.nextLevel.minXP - profile.totalXP} XP restants
            </span>
          )}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${profile.progressToNext}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"
          />
        </div>
      </div>

      {/* Badges récemment débloqués */}
      {profile.badges.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-base font-bold text-gray-900 mb-3">Badges récemment débloqués 🎉</h3>
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {profile.badges.slice(0, 8).map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.15, y: -5 }}
                className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-2xl border-2 border-blue-200 cursor-pointer relative group"
                title={badge.name}
              >
                {badge.emoji}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-gray-300 text-[10px] mt-0.5">+{badge.xpReward} XP</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Prochains badges à débloquer */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-base font-bold text-gray-900 mb-3">Prochains badges 🎯</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border border-gray-200 relative flex-shrink-0">
              <span className="grayscale opacity-40">🎓</span>
              <Lock className="w-2.5 h-2.5 text-gray-400 absolute bottom-0.5 right-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Expert Physique</p>
              <p className="text-xs text-gray-600">3/5 cours complétés</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border border-gray-200 relative flex-shrink-0">
              <span className="grayscale opacity-40">🔥</span>
              <Lock className="w-2.5 h-2.5 text-gray-400 absolute bottom-0.5 right-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Série 30 jours</p>
              <p className="text-xs text-gray-600">{profile.dailyStreak}/30 jours</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(profile.dailyStreak / 30) * 100}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border border-gray-200 relative flex-shrink-0">
              <span className="grayscale opacity-40">👥</span>
              <Lock className="w-2.5 h-2.5 text-gray-400 absolute bottom-0.5 right-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Community Leader</p>
              <p className="text-xs text-gray-600">1/3 buddies invités</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres - Style sobre */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Toutes les collections
        </button>
        <button
          onClick={() => setActiveFilter('competitions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
            activeFilter === 'competitions'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          🏆 Compétitions
        </button>
        <button
          onClick={() => setActiveFilter('social')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
            activeFilter === 'social'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          🦋 Social
        </button>
        <button
          onClick={() => setActiveFilter('learning')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
            activeFilter === 'learning'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          🎓 Apprentissage
        </button>
        <button
          onClick={() => setActiveFilter('streaks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
            activeFilter === 'streaks'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          🔥 Régularité
        </button>
        <button
          onClick={() => setActiveFilter('achievements')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
            activeFilter === 'achievements'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          ⚡ Exploration
        </button>
      </div>

      {/* Collections de badges - Cards blanches sobres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCollections.map((collection, idx) => {
          const earnedCount = collection.badges.length;
          const totalCount = collection.total;
          const progressPercentage = (earnedCount / totalCount) * 100;

          return (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
            >
              {/* En-tête de collection */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl border border-gray-200 group-hover:scale-110 transition-transform flex-shrink-0">
                  {collection.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{collection.title}</h3>
                  <p className="text-[10px] text-gray-600 mt-0.5 leading-tight">{collection.description}</p>
                </div>
              </div>

              {/* Progression compacte */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-medium text-gray-600">Progression</span>
                  <span className="text-[10px] font-bold text-gray-900">{earnedCount} / {totalCount}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"
                  />
                </div>
              </div>

              {/* Grille compacte des badges */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide">Collection</p>
                  {progressPercentage === 100 && (
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Complète ✓</span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {collection.badges.map((badge, i) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (idx * 0.05) + (i * 0.02) }}
                      whileHover={{ scale: 1.15, y: -3, rotate: 5 }}
                      className="w-full aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-lg border border-blue-200 cursor-pointer transition-all relative group/badge"
                      title={badge.name}
                    >
                      {badge.emoji}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover/badge:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                        <div className="font-semibold">{badge.name}</div>
                      </div>
                    </motion.div>
                  ))}
                  {collection.locked.slice(0, totalCount - collection.badges.length).map((locked, i) => (
                    <div
                      key={locked.id || `locked-${collection.id}-${i}`}
                      className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-lg border border-dashed border-gray-200 relative group/locked cursor-not-allowed"
                      title={`🔒 ${locked.name}`}
                    >
                      <span className="grayscale opacity-30">{locked.emoji}</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-gray-400 opacity-0 group-hover/locked:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover/locked:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                        <div className="font-semibold">{locked.name}</div>
                        <div className="text-gray-400 text-[9px]">{locked.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

