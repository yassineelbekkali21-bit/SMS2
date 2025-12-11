'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  Users, 
  Zap, 
  TrendingUp,
  Calendar,
  Award,
  X,
  Check,
  BookOpen,
  Trophy,
  Clock,
  Sparkles
} from 'lucide-react';
import { BuddyInviteModal } from './BuddyInviteModal';
import { UserAvatar } from './UserAvatar';

interface ModernBuddiesTabProps {
  userId: string;
  userName: string;
}

// Mock data pour les demandes de buddies
const mockPendingRequests = [
  { 
    id: 'req-1', 
    name: 'Alexandre Durand', 
    faculty: 'Polytechnique',
    sharedCourses: 4,
    mutualBuddies: 2,
    timeAgo: 'Il y a 2h'
  },
  { 
    id: 'req-2', 
    name: 'Camille Rousseau', 
    faculty: 'HEC',
    sharedCourses: 2,
    mutualBuddies: 1,
    timeAgo: 'Il y a 5h'
  },
];

// Mock data pour les buddies
const mockBuddies = [
  { 
    id: 'user-sophie', 
    name: 'Sophie Martin', 
    faculty: 'Polytechnique',
    level: 12,
    xpTotal: 2450,
    streak: 15,
    courses: ['Mécanique', 'Thermodynamique'],
    status: 'online',
    lastActivity: 'Il y a 5 min',
    sharedCourses: 3,
    progressThisWeek: 85
  },
  { 
    id: 'user-marie', 
    name: 'Marie Dubois', 
    faculty: 'Sciences Po',
    level: 8,
    xpTotal: 1580,
    streak: 7,
    courses: ['Électrostatique', 'Maths'],
    status: 'away',
    lastActivity: 'Il y a 2h',
    sharedCourses: 2,
    progressThisWeek: 60
  },
  { 
    id: 'user-thomas', 
    name: 'Thomas Bernard', 
    faculty: 'ENS',
    level: 18,
    xpTotal: 4200,
    streak: 30,
    courses: ['Probabilités', 'Analyse'],
    status: 'online',
    lastActivity: 'Maintenant',
    sharedCourses: 4,
    progressThisWeek: 95
  },
  { 
    id: 'user-emma', 
    name: 'Emma Laurent', 
    faculty: 'Sorbonne',
    level: 10,
    xpTotal: 1980,
    streak: 12,
    courses: ['Chimie', 'Physique'],
    status: 'online',
    lastActivity: 'Il y a 10 min',
    sharedCourses: 2,
    progressThisWeek: 70
  },
  { 
    id: 'user-lucas', 
    name: 'Lucas Petit', 
    faculty: 'CentraleSupélec',
    level: 14,
    xpTotal: 3100,
    streak: 20,
    courses: ['Info', 'Algorithmique'],
    status: 'away',
    lastActivity: 'Il y a 1h',
    sharedCourses: 1,
    progressThisWeek: 50
  },
  { 
    id: 'user-lea', 
    name: 'Léa Moreau', 
    faculty: 'Paris-Dauphine',
    level: 9,
    xpTotal: 1750,
    streak: 8,
    courses: ['Stats', 'Éco'],
    status: 'offline',
    lastActivity: 'Il y a 5h',
    sharedCourses: 2,
    progressThisWeek: 40
  },
];

// Mock data pour l'activité des buddies
const mockBuddyActivity = [
  {
    id: 'act-1',
    buddyId: 'user-sophie',
    buddyName: 'Sophie Martin',
    type: 'lesson_completed',
    message: 'a complété la leçon "Loi de Gauss"',
    course: 'Électrostatique',
    timeAgo: 'Il y a 5 min',
    icon: '✅'
  },
  {
    id: 'act-2',
    buddyId: 'user-thomas',
    buddyName: 'Thomas Bernard',
    type: 'pack_unlocked',
    message: 'a débloqué le pack "Probabilités Avancées"',
    course: 'Mathématiques',
    timeAgo: 'Il y a 15 min',
    icon: '🔓'
  },
  {
    id: 'act-3',
    buddyId: 'user-emma',
    buddyName: 'Emma Laurent',
    type: 'level_up',
    message: 'est passée au niveau 11 !',
    course: null,
    timeAgo: 'Il y a 1h',
    icon: '🎉'
  },
  {
    id: 'act-4',
    buddyId: 'user-marie',
    buddyName: 'Marie Dubois',
    type: 'course_started',
    message: 'a commencé le cours "Thermodynamique"',
    course: 'Physique',
    timeAgo: 'Il y a 2h',
    icon: '📚'
  },
];

// Mock data pour les suggestions de buddies
const mockSuggestions = [
  { 
    id: 'sug-1', 
    name: 'Lucas Mercier', 
    faculty: 'Polytechnique',
    sharedCourses: 5,
    mutualBuddies: 3,
    reason: '5 cours en commun'
  },
  { 
    id: 'sug-2', 
    name: 'Léa Moreau', 
    faculty: 'ENS',
    sharedCourses: 4,
    mutualBuddies: 4,
    reason: '4 buddies mutuels'
  },
  { 
    id: 'sug-3', 
    name: 'Hugo Lambert', 
    faculty: 'HEC',
    sharedCourses: 3,
    mutualBuddies: 2,
    reason: 'Même faculté'
  },
  { 
    id: 'sug-4', 
    name: 'Chloé Petit', 
    faculty: 'Sorbonne',
    sharedCourses: 4,
    mutualBuddies: 1,
    reason: '4 cours en commun'
  },
];

export default function ModernBuddiesTab({ userId, userName }: ModernBuddiesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
  const [showBuddyInviteModal, setShowBuddyInviteModal] = useState(false);

  const filteredBuddies = mockBuddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         buddy.faculty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || buddy.status === filterStatus || 
                         (filterStatus === 'online' && buddy.status === 'away');
    return matchesSearch && matchesStatus;
  });

  return (
    <>
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tes Buddies</h2>
          <p className="text-sm text-gray-600 mt-1">{mockBuddies.length} connexions • {mockBuddies.filter(b => b.status === 'online').length} en ligne</p>
        </div>
        <button 
          onClick={() => setShowBuddyInviteModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Inviter un buddy
        </button>
      </div>

      {/* Demandes de buddies en attente - Design moderne */}
      {mockPendingRequests.length > 0 && (
        <div className="bg-white rounded-2xl p-8 border border-gray-200"
             style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.03)' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Demandes en attente</h3>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">{mockPendingRequests.length}</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Nouveaux buddies potentiels</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {mockPendingRequests.map((request, idx) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 4 }}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <UserAvatar name={request.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-0.5 tracking-tight">{request.name}</h4>
                      <p className="text-sm text-gray-500 font-medium mb-2">{request.faculty}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{request.sharedCourses} cours communs</span>
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{request.mutualBuddies} mutuels</span>
                        <span className="text-xs text-gray-400">{request.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-semibold hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Accepter
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions de buddies - Design moderne */}
      {filteredBuddies.length > 0 && (
        <div className="bg-white rounded-2xl p-8 border border-gray-200"
             style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 8px rgba(0, 0, 0, 0.03)' }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Suggestions pour toi</h3>
                <p className="text-sm text-gray-500 font-medium">Étudiants à découvrir</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {mockSuggestions.map((suggestion, idx) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-300 transition-all overflow-hidden"
                style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.04)' }}
              >
                {/* Gradient hover effect */}
                <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 relative">
                    <UserAvatar name={suggestion.name} size="xl" />
                    <div className="absolute inset-0 rounded-full bg-gray-200/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-1 tracking-tight">{suggestion.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mb-4">{suggestion.faculty}</p>
                  
                  <div className="w-full bg-gray-100 rounded-lg px-3 py-2 mb-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700">{suggestion.reason}</p>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Ajouter
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Activité récente des buddies - Design moderne */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200"
           style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 8px rgba(0, 0, 0, 0.03)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Activité récente</h3>
              <p className="text-sm text-gray-500 font-medium">Ce que font tes buddies</p>
            </div>
          </div>
          <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 px-3 py-1.5 hover:bg-purple-50 rounded-lg transition-all">
            Voir tout
            <span>→</span>
          </button>
        </div>

        <div className="space-y-2">
          {mockBuddyActivity.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 4, scale: 1.01 }}
              className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all cursor-pointer"
            >
              <div className="relative flex-shrink-0">
                <UserAvatar name={activity.buddyName} size="md" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <span className="text-xs">{activity.icon}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-relaxed">
                  <span className="font-semibold">{activity.buddyName}</span>{' '}
                  <span className="text-gray-600">{activity.message}</span>
                </p>
                {activity.course && (
                  <div className="inline-flex items-center gap-1.5 mt-1.5 bg-gray-100 px-2 py-1 rounded-md">
                    <BookOpen className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">{activity.course}</span>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">{activity.timeAgo}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Barre de recherche et filtres - Design moderne */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou faculté..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
        
        <div className="flex gap-2">
          <motion.button
            onClick={() => setFilterStatus('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              filterStatus === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            Tous
          </motion.button>
          <motion.button
            onClick={() => setFilterStatus('online')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${
              filterStatus === 'online'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {filterStatus === 'online' && <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>}
            {filterStatus !== 'online' && <span className="w-2 h-2 bg-gray-400 rounded-full"></span>}
            En ligne
          </motion.button>
        </div>
      </div>

      {/* Grille de buddies - style Web 3.0 moderne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuddies.map((buddy, idx) => (
          <motion.div
            key={buddy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl p-8 cursor-pointer overflow-hidden"
            style={{
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 8px rgba(0, 0, 0, 0.03), 0 12px 24px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Border effect on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                 style={{ boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)' }} />

            <div className="relative z-10">
              {/* Avatar et status - Layout moderne */}
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <UserAvatar 
                    name={buddy.name} 
                    size="xl" 
                    status={buddy.status as 'online' | 'offline' | 'away'} 
                  />
                  {/* Halo effect autour de l'avatar au hover */}
                  <div className="absolute inset-0 rounded-full bg-gray-200/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {buddy.status === 'online' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1.5 bg-gray-100 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full border border-gray-200"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse"></span>
                    <span className="text-[11px] font-semibold tracking-wide">EN LIGNE</span>
                  </motion.div>
                )}
                {buddy.status === 'away' && (
                  <div className="bg-orange-500/10 backdrop-blur-sm text-orange-700 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide border border-orange-500/20">
                    ABSENT
                  </div>
                )}
              </div>

              {/* Info du buddy - Typographie améliorée */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1.5 tracking-tight">{buddy.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{buddy.faculty}</p>
              </div>

              {/* Stats - Design minimaliste et élégant */}
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-base font-bold text-gray-900">{buddy.xpTotal.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">XP</span>
                </div>
                
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Award className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-base font-bold text-gray-900">{buddy.level}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Niveau</span>
                </div>
                
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">🔥</span>
                    <span className="text-base font-bold text-gray-900">{buddy.streak}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Jours</span>
                </div>
              </div>

              {/* Cours en commun - Badge moderne */}
              <div className="flex items-center gap-2 mb-6 px-1">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                  <BookOpen className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{buddy.sharedCourses} cours en commun</span>
                </div>
              </div>

              {/* Progress bar - Design épuré */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cette semaine</span>
                  <span className="text-sm font-bold text-gray-900">
                    {buddy.progressThisWeek}%
                  </span>
                </div>
                <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${buddy.progressThisWeek}%` }}
                    transition={{ duration: 1.2, delay: idx * 0.05 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 left-0 bg-gray-900 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredBuddies.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun buddy trouvé</h3>
          <p className="text-sm text-gray-600">Essaie de modifier ta recherche</p>
        </div>
      )}
    </div>

    {/* BuddyInviteModal */}
    <BuddyInviteModal
      userId={userId}
      isOpen={showBuddyInviteModal}
      onClose={() => setShowBuddyInviteModal(false)}
    />
    </>
  );
}

