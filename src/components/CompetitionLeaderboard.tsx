'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Medal, Crown, Star, TrendingUp, Users, Clock,
  MapPin, Flag, Flame, Zap, Target, Award, ChevronDown, ChevronUp
} from 'lucide-react';

interface CompetitionParticipant {
  id: string;
  name: string;
  avatar: string;
  score: number;
  community: string;
  rank: number;
  change: number; // Position change since last update
}

interface Competition {
  id: string;
  title: string;
  description: string;
  type: 'faculty' | 'country' | 'university' | 'global';
  startDate: Date;
  endDate: Date;
  prize: string;
  participants: CompetitionParticipant[];
  totalParticipants: number;
  userRank?: number;
  userScore?: number;
}

interface CompetitionLeaderboardProps {
  competitions?: Competition[];
  userId: string;
  hideHeader?: boolean;
}

// Données mock pour démonstration
const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'weekend-sprint',
    title: 'Sprint du Week-end',
    description: 'Gagne le plus d\'XP ce week-end !',
    type: 'global',
    startDate: new Date(Date.now() - 86400000),
    endDate: new Date(Date.now() + 86400000),
    prize: '🏆 Badge exclusif + 1000 XP bonus',
    totalParticipants: 2547,
    userRank: 42,
    userScore: 1250,
    participants: [
      { id: '1', name: 'Sarah M.', avatar: '👩‍🎓', score: 2850, community: 'ULB Brussels', rank: 1, change: 0 },
      { id: '2', name: 'Alex K.', avatar: '👨‍💼', score: 2720, community: 'UCL Louvain', rank: 2, change: 2 },
      { id: '3', name: 'Marie L.', avatar: '👩‍🔬', score: 2680, community: 'ULB Brussels', rank: 3, change: -1 },
      { id: '4', name: 'Thomas D.', avatar: '👨‍🎓', score: 2450, community: 'UGent', rank: 4, change: 1 },
      { id: '5', name: 'Emma B.', avatar: '👩', score: 2380, community: 'KU Leuven', rank: 5, change: -2 },
    ],
  },
  {
    id: 'faculty-clash',
    title: 'Clash des Facultés',
    description: 'Quelle faculté dominera cette semaine ?',
    type: 'faculty',
    startDate: new Date(Date.now() - 3 * 86400000),
    endDate: new Date(Date.now() + 4 * 86400000),
    prize: '🎖️ Badge de champion + Accès premium 1 mois',
    totalParticipants: 892,
    userRank: 15,
    userScore: 1840,
    participants: [
      { id: '1', name: 'Sciences', avatar: '🔬', score: 45680, community: 'Sciences', rank: 1, change: 0 },
      { id: '2', name: 'Ingénierie', avatar: '⚙️', score: 42150, community: 'Ingénierie', rank: 2, change: 0 },
      { id: '3', name: 'Médecine', avatar: '⚕️', score: 38920, community: 'Médecine', rank: 3, change: 1 },
      { id: '4', name: 'Économie', avatar: '💼', score: 35740, community: 'Économie', rank: 4, change: -1 },
      { id: '5', name: 'Droit', avatar: '⚖️', score: 32860, community: 'Droit', rank: 5, change: 0 },
    ],
  },
  {
    id: 'country-challenge',
    title: 'Défi des Pays',
    description: 'Belgique vs France vs Luxembourg !',
    type: 'country',
    startDate: new Date(Date.now() - 7 * 86400000),
    endDate: new Date(Date.now() + 7 * 86400000),
    prize: '👑 Couronne nationale + Titre spécial',
    totalParticipants: 5234,
    userRank: 128,
    userScore: 890,
    participants: [
      { id: '1', name: '🇧🇪 Belgique', avatar: '🇧🇪', score: 128450, community: 'Belgique', rank: 1, change: 0 },
      { id: '2', name: '🇫🇷 France', avatar: '🇫🇷', score: 125320, community: 'France', rank: 2, change: 0 },
      { id: '3', name: '🇱🇺 Luxembourg', avatar: '🇱🇺', score: 98760, community: 'Luxembourg', rank: 3, change: 0 },
    ],
  },
];

export function CompetitionLeaderboard({ competitions = MOCK_COMPETITIONS, userId, hideHeader = false }: CompetitionLeaderboardProps) {
  const [selectedCompetition, setSelectedCompetition] = useState(competitions.length > 0 ? competitions[0] : null);
  const [expandedRanks, setExpandedRanks] = useState(false);

  // Si pas de compétitions, ne rien afficher
  if (!selectedCompetition || competitions.length === 0) {
    return null;
  }

  const getInitials = (name: string) => {
    // Enlever les emojis de drapeaux et autres caractères spéciaux
    const cleanName = name.replace(/[^\w\s]/gi, '').trim();
    const parts = cleanName.split(' ').filter(p => p.length > 0);
    
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800';
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-500 text-white';
    return 'bg-gray-200 text-gray-700';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="text-yellow-500" size={24} />;
    if (rank === 2) return <Medal className="text-gray-400" size={24} />;
    if (rank === 3) return <Medal className="text-amber-600" size={24} />;
    return <Star className="text-blue-500" size={16} />;
  };

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 24) {
      return `${hours}h ${minutes}m restantes`;
    }
    const days = Math.floor(hours / 24);
    return `${days} jours restants`;
  };

  return (
    <div className="space-y-6">
      {/* Header propre et sobre */}
      {!hideHeader && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center gap-2" style={{ color: 'white' }}>
            <Trophy size={24} style={{ color: 'white' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'white' }}>Compétitions en cours</h2>
          </div>
        </div>
      )}

      {/* Sélecteur de compétition - Style horizontal avec icônes */}
      <div>
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type de compétition</span>
          <div className="flex gap-3 flex-wrap">
            {competitions.map((comp) => {
              const icons = {
                'weekend-sprint': '⚡',
                'faculty-clash': '🏛️',
                'country-challenge': '🌍'
              };
              const icon = icons[comp.id as keyof typeof icons] || '🏆';
              
              return (
                <motion.button
                  key={comp.id}
                  onClick={() => setSelectedCompetition(comp)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`cursor-target relative flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all min-w-[140px] ${
                    selectedCompetition.id === comp.id
                      ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-bold whitespace-nowrap tracking-wide">{comp.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Infos de la compétition sélectionnée */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedCompetition.title}</h3>
            <p className="text-gray-600">{selectedCompetition.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
              <Clock size={16} />
              {getTimeRemaining(selectedCompetition.endDate)}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Users size={14} />
              {selectedCompetition.totalParticipants.toLocaleString()} participants
            </div>
          </div>
        </div>

        {/* Prix */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold mb-1">
            <Award size={18} />
            Prix pour les vainqueurs
          </div>
          <p className="text-gray-700">{selectedCompetition.prize}</p>
        </div>

        {/* Position de l'utilisateur */}
        {selectedCompetition.userRank && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ta position actuelle</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">#{selectedCompetition.userRank}</span>
                  <div className="text-sm">
                    <p className="text-gray-700 font-medium">{selectedCompetition.userScore?.toLocaleString()} points</p>
                  </div>
                </div>
              </div>
              <div className="text-4xl">{selectedCompetition.userRank <= 3 ? '🏆' : '📈'}</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Classement */}
      <div className="space-y-3">
        {selectedCompetition.participants.slice(0, expandedRanks ? undefined : 5).map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 transition-all hover:bg-gray-100"
          >
              {/* Rang */}
              <div className="flex items-center justify-center w-12">
                {participant.rank <= 3 ? (
                  getRankIcon(participant.rank)
                ) : (
                  <span className="text-lg font-bold text-gray-600">#{participant.rank}</span>
                )}
              </div>

              {/* Avatar et nom */}
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  participant.rank <= 3 
                    ? `${getAvatarColor(participant.rank)} border-white shadow-md` 
                    : 'bg-gray-200 text-gray-700 border-gray-300'
                }`}>
                  {getInitials(participant.name)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{participant.name}</p>
                  <p className="text-sm text-gray-500">{participant.community}</p>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">{participant.score.toLocaleString()}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>

              {/* Changement de position */}
              {participant.change !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  participant.change > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {participant.change > 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {Math.abs(participant.change)}
                </div>
              )}
            </motion.div>
          ))}

        {/* Bouton voir plus/moins */}
        {selectedCompetition.participants.length > 5 && (
          <button
            onClick={() => setExpandedRanks(!expandedRanks)}
            className="cursor-target w-full mt-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-200"
          >
            {expandedRanks ? (
              <>
                <ChevronUp size={18} />
                Voir moins
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                Voir tout le classement
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
