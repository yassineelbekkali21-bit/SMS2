'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  Users, 
  TrendingUp,
  Calendar,
  Award,
  X,
  Check,
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

      {/* Demandes en attente + Activité récente - Côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demandes de buddies en attente */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200"
             style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.03)' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Demandes en attente</h3>
                <span className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded-full font-bold">{mockPendingRequests.length}</span>
              </div>
              <p className="text-sm text-gray-500">Nouveaux buddies potentiels</p>
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {mockPendingRequests.length > 0 ? mockPendingRequests.map((request, idx) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <UserAvatar name={request.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{request.name}</h4>
                      <p className="text-sm text-gray-500">{request.sharedCourses} cours communs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all"
                    >
                      Accepter
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 bg-white text-gray-500 rounded-lg hover:bg-gray-200 transition-all border border-gray-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune demande en attente</p>
              </div>
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200"
             style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 8px rgba(0, 0, 0, 0.03)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Activité récente</h3>
                <p className="text-sm text-gray-500">Ce que font tes buddies</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {mockBuddyActivity.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="relative flex-shrink-0">
                  <UserAvatar name={activity.buddyName} size="sm" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 leading-snug">
                    <span className="font-medium">{activity.buddyName}</span>{' '}
                    <span className="text-gray-600 text-sm">{activity.message}</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">{activity.timeAgo}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

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
                  <p className="text-sm text-gray-500 font-medium mb-4">{suggestion.faculty}</p>
                  
                  <div className="w-full bg-gray-100 rounded-lg px-3 py-2 mb-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">{suggestion.reason}</p>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
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

      {/* Mes buddies - Grille style Web 3.0 moderne */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200"
           style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 8px rgba(0, 0, 0, 0.03)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Mes buddies</h3>
            <p className="text-sm text-gray-500">Tes connexions actives</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBuddies.map((buddy, idx) => (
          <motion.div
            key={buddy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ y: -2, borderColor: '#48c6ed' }}
            className="group relative bg-white rounded-2xl p-5 cursor-pointer overflow-hidden border border-gray-100 hover:shadow-md transition-all"
          >
            {/* Header: Avatar + Name */}
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
                  <UserAvatar 
                    name={buddy.name} 
                size="lg" 
                    status={buddy.status as 'online' | 'offline' | 'away'} 
                  />
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate mb-0.5">{buddy.name}</h3>
                <p className="text-sm text-gray-500">{buddy.faculty}</p>
              </div>
                </div>
                
            {/* Stats Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Shared courses */}
              <span className="text-xs font-medium text-gray-500 px-2.5 py-1.5 bg-gray-50 rounded-lg">
                {buddy.sharedCourses} cours en commun
              </span>
              
              {/* Streak */}
              {buddy.streak > 0 && (
                <span className="text-xs font-medium text-gray-500 px-2.5 py-1.5 bg-gray-50 rounded-lg">
                  Série de {buddy.streak} jours
                </span>
              )}

              {/* Level */}
              <span className="text-xs font-medium text-gray-500 px-2.5 py-1.5 bg-gray-50 rounded-lg">
                Niveau {buddy.level}
                  </span>
            </div>
          </motion.div>
        ))}
        </div>
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

