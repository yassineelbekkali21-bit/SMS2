'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  RefreshCw, 
  TrendingUp,
  Users,
  Sparkles,
  Trophy,
  Zap,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  Play,
  AlertCircle,
  ChevronRight,
  Target,
  Swords,
  Medal,
  Volume2,
  VolumeX,
  Lock,
  Globe,
  Calendar,
  Award,
  Bell,
  BookOpen,
  LockOpen,
  CheckCircle
} from 'lucide-react';
import { SocialEvent, SocialFeedData, SocialFeedService } from '@/lib/social-feed-service';
import StudyRoomCarousel from './StudyRoomCarousel';
import AnimatedList from './AnimatedList';
import { XPService } from '@/lib/xp-service';

interface SocialFeedPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (linkType: string, linkId?: string) => void;
  initialTab?: FeedTab;
}

type FeedTab = 'for-you' | 'buddies' | 'competitions' | 'progression';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  activity: string;
  isLive: boolean;
  timestamp: Date;
  participants?: {
    name: string;
    avatar: string;
    isBuddy: boolean;
  }[];
  hasBuddies?: boolean;
  isSilent?: boolean;
  isPublic?: boolean;
  courseName?: string;
  scheduledTime?: Date;
  status?: 'live' | 'upcoming' | 'ended';
}

// Composant Buddy Activity - Version engageante inspirée de Strava, Apple Activity, Houseparty
function BuddyActivityTab({ buddyActivities, onNavigate, reactions }: { 
  buddyActivities: SocialEvent[]; 
  onNavigate?: (linkType: string, linkId?: string) => void;
  reactions?: Record<string, string[]>;
}) {
  const [selectedBuddy, setSelectedBuddy] = useState<string | null>(null);

  // Mock data pour les buddies (triés par XP pour le podium)
  const mockBuddies = [
    { id: 'user-thomas', name: 'Thomas', avatar: '/avatars/thomas.jpg', initials: 'TB', isOnline: true, currentActivity: 'Study Room: Probabilités', xpToday: 200, lessonsToday: 4, streak: 20 },
    { id: 'user-sophie', name: 'Sophie', avatar: '/avatars/sophie.jpg', initials: 'SM', isOnline: true, currentActivity: 'En cours: Mécanique', xpToday: 150, lessonsToday: 3, streak: 12 },
    { id: 'user-emma', name: 'Emma', avatar: '/avatars/emma.jpg', initials: 'EL', isOnline: true, currentActivity: 'Quiz en cours', xpToday: 120, lessonsToday: 2, streak: 8 },
    { id: 'user-marie', name: 'Marie', avatar: '/avatars/marie.jpg', initials: 'MD', isOnline: false, lastSeen: '2h', xpToday: 80, lessonsToday: 1, streak: 5 },
  ];

  // Mock invitations
  const mockInvitations = [
    { id: 'inv-1', from: 'Emma', initials: 'EL', type: 'study-room', title: 'Study Room: Probabilités', time: 'Dans 5 min', action: 'Rejoindre' },
    { id: 'inv-2', from: 'Thomas', initials: 'TB', type: 'challenge', title: 'Défi XP du week-end', time: 'Ce samedi', action: 'Accepter' },
  ];

  return (
    <div className="space-y-5">
      {/* 🔔 Invitations en attente */}
      {mockInvitations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <div className="relative">
                <Bell className="w-4 h-4 text-gray-900" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              </div>
              Invitations en attente
            </h3>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {mockInvitations.length}
            </span>
          </div>
          <div className="space-y-2">
            {mockInvitations.map((inv) => (
              <motion.div
                key={inv.id}
                whileHover={{ scale: 1.01, x: 3 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0">
                      {inv.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{inv.title}</p>
                      <p className="text-xs text-gray-600">{inv.from} • {inv.time}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-bold hover:shadow-md transition-all flex-shrink-0">
                    {inv.action}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 🏃 Actifs maintenant */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Actifs maintenant
          </h3>
          <span className="text-xs text-gray-600 font-medium">
            {mockBuddies.filter(b => b.isOnline).length} en ligne
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {mockBuddies.filter(b => b.isOnline).map((buddy) => (
            <motion.div
              key={buddy.id}
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all cursor-pointer w-52"
              onClick={() => onNavigate && onNavigate('buddy', buddy.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                    {buddy.initials}
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{buddy.name}</p>
                  <p className="text-xs text-gray-600 truncate">{buddy.currentActivity}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 rounded-lg py-2 text-center border border-gray-200">
                  <p className="text-sm font-bold text-gray-900">{buddy.xpToday}</p>
                  <p className="text-[10px] text-gray-600 font-medium">XP</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg py-2 text-center border border-gray-200">
                  <p className="text-sm font-bold text-gray-900">{buddy.streak}🔥</p>
                  <p className="text-[10px] text-gray-600 font-medium">Série</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 📊 Progression hebdomadaire - Podium */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 rounded-xl p-5 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              Classement de la semaine
            </h3>
            <p className="text-xs text-gray-600">Top performers</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('community')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Tout voir →
          </button>
        </div>

        {/* Podium - Top 3 */}
        <div className="flex items-end justify-center gap-2 mb-6">
          {/* 2ème place */}
          {mockBuddies[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => onNavigate && onNavigate('buddy', mockBuddies[1].id)}
            >
              <div className="relative mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                  {mockBuddies[1].initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow">
                  2
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl px-4 py-3 w-24 text-center shadow-lg">
                <p className="text-xs font-bold text-gray-800 truncate mb-1">{mockBuddies[1].name}</p>
                <p className="text-lg font-bold text-gray-700">{mockBuddies[1].xpToday}</p>
                <p className="text-[10px] text-gray-600 font-medium">XP</p>
              </div>
            </motion.div>
          )}

          {/* 1ère place */}
          {mockBuddies[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center cursor-pointer group relative z-10"
              onClick={() => onNavigate && onNavigate('buddy', mockBuddies[0].id)}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-8 text-2xl"
              >
                👑
              </motion.div>
              <div className="relative mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-base font-bold text-white shadow-xl group-hover:scale-110 transition-transform">
                  {mockBuddies[0].initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-lg">
                  1
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-t-xl px-5 py-4 w-28 text-center shadow-xl">
                <p className="text-xs font-bold text-yellow-900 truncate mb-1">{mockBuddies[0].name}</p>
                <p className="text-xl font-bold text-yellow-800">{mockBuddies[0].xpToday}</p>
                <p className="text-[10px] text-yellow-700 font-medium">XP</p>
              </div>
            </motion.div>
          )}

          {/* 3ème place */}
          {mockBuddies[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => onNavigate && onNavigate('buddy', mockBuddies[2].id)}
            >
              <div className="relative mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md group-hover:scale-110 transition-transform">
                  {mockBuddies[2].initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow">
                  3
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-t-xl px-3 py-2 w-20 text-center shadow-md">
                <p className="text-[10px] font-bold text-orange-800 truncate mb-1">{mockBuddies[2].name}</p>
                <p className="text-base font-bold text-orange-700">{mockBuddies[2].xpToday}</p>
                <p className="text-[9px] text-orange-600 font-medium">XP</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Autres buddies */}
        {mockBuddies.length > 3 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-3 text-center">Autres buddies</p>
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {mockBuddies.slice(3).map((buddy, idx) => (
                <motion.div
                  key={buddy.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="flex-shrink-0 bg-white rounded-lg p-2 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer w-24"
                  onClick={() => onNavigate && onNavigate('buddy', buddy.id)}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 mx-auto mb-1">
                    {buddy.initials}
                  </div>
                  <p className="text-[10px] font-bold text-gray-900 truncate text-center mb-1">{buddy.name}</p>
                  <p className="text-xs font-bold text-gray-700 text-center">{buddy.xpToday} XP</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* 📰 Activités récentes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900">Activités récentes</h3>
          <button
            onClick={() => onNavigate && onNavigate('community')}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Plus →
          </button>
        </div>

        {/* Activity Cards */}
        <div className="space-y-2">
          {buddyActivities.slice(0, 6).map((activity, idx) => {
            // Déterminer le type et l'icône
            let activityIcon: React.ReactNode = <BookOpen className="w-4 h-4" />;
            let activityLabel = 'Cours';
            let activityBg = 'bg-blue-50/50';
            let activityBorder = 'border-blue-200';
            
            if (activity.message.includes('débloqué')) {
              activityIcon = <LockOpen className="w-4 h-4" />;
              activityLabel = 'Débloqué';
              activityBg = 'bg-green-50/50';
              activityBorder = 'border-green-200';
            } else if (activity.message.includes('complété')) {
              activityIcon = <CheckCircle className="w-4 h-4" />;
              activityLabel = 'Complété';
              activityBg = 'bg-gray-50';
              activityBorder = 'border-gray-300';
            } else if (activity.type === 'achievement') {
              activityIcon = <Award className="w-4 h-4" />;
              activityLabel = 'Succès';
              activityBg = 'bg-yellow-50/50';
              activityBorder = 'border-yellow-200';
            }

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.03 }}
                whileHover={{ scale: 1.01, x: 3 }}
                className={`${activityBg} rounded-xl p-3 border ${activityBorder} hover:shadow-md transition-all cursor-pointer`}
                onClick={() => activity.clickableLink && onNavigate && onNavigate(activity.clickableLink.type, activity.clickableLink.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 flex-shrink-0 border border-gray-200">
                    {activityIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-gray-900">{activity.userName}</span>
                      <span className="px-1.5 py-0.5 bg-white/70 rounded text-[10px] font-bold text-gray-600 border border-gray-200">
                        {activityLabel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{activity.message}</p>
                    <span className="text-[10px] text-gray-500 font-medium mt-1 block">
                      {new Date(activity.timestamp).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {reactions && reactions[activity.id] && reactions[activity.id].length > 0 && (
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-200 flex-shrink-0">
                      <span className="text-xs">{reactions[activity.id][0]}</span>
                      <span className="text-xs font-bold text-gray-700">{reactions[activity.id].length}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA vers le module Communauté */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 text-center"
      >
        <div className="w-12 h-12 bg-gray-900 rounded-xl mx-auto mb-3 flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Module Buddies complet</h3>
        <p className="text-sm text-gray-600 mb-4">
          Recherche, invitations, progression détaillée et statistiques
        </p>
        <button
          onClick={() => onNavigate && onNavigate('buddy')}
          className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
        >
          Ouvrir le module →
        </button>
      </motion.div>
    </div>
  );
}

// Composant Progression - Version récap (style Compétitions)
function ProgressionTab({ onNavigate }: { onNavigate?: (linkType: string, linkId?: string) => void }) {
  const xpService = XPService.getInstance();
  const profile = xpService.getUserXPProfile();

  // Collections résumées
  const badgeCollections = [
    {
      id: 'social',
      title: 'Social Butterfly',
      emoji: '🦋',
      color: 'from-cyan-500 to-blue-500',
      earned: profile.badges.filter(b => 
        b.name.includes('Social') || b.name.includes('Communauté') || b.name.includes('Buddy')
      ).length,
      total: 12
    },
    {
      id: 'learning',
      title: 'Learner Legend',
      emoji: '🎓',
      color: 'from-indigo-500 to-purple-500',
      earned: profile.badges.filter(b => 
        b.name.includes('Leçon') || b.name.includes('Quiz') || b.name.includes('Cours')
      ).length,
      total: 15
    },
    {
      id: 'streaks',
      title: 'Super Streaks',
      emoji: '🔥',
      color: 'from-orange-500 to-red-500',
      earned: profile.badges.filter(b => 
        b.name.includes('Série') || b.name.includes('Régularité')
      ).length,
      total: 10
    },
    {
      id: 'achievements',
      title: 'Platform Expert',
      emoji: '⚡',
      color: 'from-emerald-500 to-teal-500',
      earned: profile.badges.filter(b => 
        b.name.includes('Explorateur') || b.name.includes('Découverte')
      ).length,
      total: 8
    }
  ];

  // Stats essentielles de l'étudiant
  const studentStats = {
    lessonsCompleted: 23, // Nombre de leçons finies
    quizzesCompleted: 18, // Nombre de quizz répondus
    exerciseContributions: 7, // Nombre de contributions de résolutions d'exercices
    coursesCompleted: 3, // Nombre de cours finis
    courseNames: ['Loi de Gauss', 'Intégrales et Applications', 'Forces et Mouvement'] // Noms des cours finis
  };

  return (
    <div className="space-y-4">
      {/* Header avec stats - Style Compétitions */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-5 border-2 border-gray-300">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Ma progression</h3>
        </div>
        
        {/* Stats en ligne - Ligne 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Niveau</p>
            <p className="text-2xl font-bold text-gray-900">{profile.currentLevel.level}</p>
            <p className="text-xs text-gray-500">{profile.currentLevel.title}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">XP Total</p>
            <p className="text-2xl font-bold text-gray-900">{profile.totalXP.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Points d'XP</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Badges</p>
            <p className="text-2xl font-bold text-gray-900">{profile.badges.length}</p>
            <p className="text-xs text-gray-500">Débloqués</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Série</p>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-bold text-gray-900">{profile.dailyStreak}</p>
              <span className="text-xl">🔥</span>
            </div>
            <p className="text-xs text-gray-500">Jours consécutifs</p>
          </div>
        </div>

        {/* Stats essentielles - Ligne 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Leçons</p>
            <p className="text-2xl font-bold text-gray-900">{studentStats.lessonsCompleted}</p>
            <p className="text-xs text-gray-500">Terminées</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Quiz</p>
            <p className="text-2xl font-bold text-gray-900">{studentStats.quizzesCompleted}</p>
            <p className="text-xs text-gray-500">Répondus</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Contributions</p>
            <p className="text-2xl font-bold text-gray-900">{studentStats.exerciseContributions}</p>
            <p className="text-xs text-gray-500">Exercices résolus</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Cours</p>
            <p className="text-2xl font-bold text-gray-900">{studentStats.coursesCompleted}</p>
            <p className="text-xs text-gray-500">Complétés</p>
          </div>
        </div>

        {/* Cours complétés - Liste */}
        {studentStats.coursesCompleted > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-xs font-semibold text-gray-600 mb-2">Cours complétés</p>
            <div className="flex flex-wrap gap-2">
              {studentStats.courseNames.map((courseName, idx) => (
                <div key={idx} className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-600" />
                  {courseName}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prochain niveau - Style bordure jaune */}
      <div className="bg-white rounded-xl p-4 border-2 border-yellow-300 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-base">Prochain niveau</h4>
            <p className="text-xs text-gray-600">{profile.currentLevel.title} → Niveau {profile.currentLevel.level + 1}</p>
          </div>
          {profile.nextLevel && (
            <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
              {profile.nextLevel.minXP - profile.totalXP} XP
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${profile.progressToNext}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gray-900 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">{Math.round(profile.progressToNext)}% complété</p>
      </div>

      {/* Collections de badges */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900 text-base">Mes collections de badges</h4>
          <button
            onClick={() => onNavigate && onNavigate('community')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Voir tout →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {badgeCollections.map((collection, idx) => {
            const progress = (collection.earned / collection.total) * 100;
            
            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => onNavigate && onNavigate('community')}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${collection.color} rounded-full flex items-center justify-center text-2xl mb-2 shadow-sm`}>
                    {collection.emoji}
                  </div>
                  <h5 className="text-xs font-bold text-gray-900 text-center mb-1 line-clamp-2">{collection.title}</h5>
                  
                  {/* Progression */}
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-base font-bold text-gray-900">{collection.earned}</span>
                    <span className="text-xs text-gray-600">/{collection.total}</span>
                  </div>

                  <p className="text-[10px] text-gray-500">{Math.round(progress)}% complété</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Badges récemment débloqués */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h4 className="font-bold text-gray-900 text-base mb-4">Badges récemment débloqués</h4>
        {profile.badges.length > 0 ? (
          <div className="flex items-center gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {profile.badges.slice(0, 8).map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-2 border border-yellow-200 shadow-sm cursor-pointer flex flex-col items-center justify-center"
                title={badge.name}
              >
                <span className="text-2xl">{badge.emoji}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600 text-xs">Aucun badge encore</p>
          </div>
        )}
      </div>

      {/* CTA - Style similaire au "Prix" des compétitions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border-2 border-blue-200 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Award className="w-6 h-6 text-blue-600" />
          <h4 className="font-bold text-gray-900 text-base">Découvre toutes tes collections !</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Explore tes badges par catégorie et découvre tous les badges à débloquer
        </p>
        <button
          onClick={() => onNavigate && onNavigate('community')}
          className="px-5 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
        >
          Voir ma collection complète →
        </button>
      </div>
    </div>
  );
}

// Composant Compétitions
function CompetitionsTab({ onNavigate }: { onNavigate?: (linkType: string, linkId?: string) => void }) {
  const [selectedCompetition, setSelectedCompetition] = useState<'weekend' | 'faculty' | 'country'>('weekend');
  
  const competitions = {
    weekend: {
      title: 'Sprint du Week-end',
      subtitle: 'Gagne le plus d\'XP ce week-end !',
      timeLeft: '13h 11m restantes',
      participants: 2547,
      prize: 'Badge exclusif + 1000 XP bonus',
      myPosition: 42,
      myPoints: 250,
      topPlayers: [
        { rank: 1, name: 'Sarah M.', school: 'ULB Brussels', points: 2850, avatar: 'https://i.pravatar.cc/150?img=1' },
        { rank: 2, name: 'Alex K.', school: 'UCL Louvain', points: 2720, change: 2, avatar: 'https://i.pravatar.cc/150?img=2' },
        { rank: 3, name: 'Marie L.', school: 'ULB Brussels', points: 2680, change: -1, avatar: 'https://i.pravatar.cc/150?img=3' },
        { rank: 4, name: 'Thomas D.', school: 'UGent', points: 2450, change: 1, avatar: 'https://i.pravatar.cc/150?img=4' },
        { rank: 5, name: 'Emma B.', school: 'KU Leuven', points: 2380, change: -2, avatar: 'https://i.pravatar.cc/150?img=5' },
      ]
    },
    faculty: {
      title: 'Clash des Facultés',
      subtitle: 'Quelle faculté domine cette semaine ?',
      timeLeft: '3j 5h restantes',
      participants: 8943,
      prize: 'Trophée doré + accès VIP 1 mois',
      myPosition: 15,
      myPoints: 1820,
      topPlayers: [
        { rank: 1, name: 'Sciences STEM', school: 'Faculté', points: 45230, avatar: '🔬' },
        { rank: 2, name: 'Médecine', school: 'Faculté', points: 42100, change: 1, avatar: '⚕️' },
        { rank: 3, name: 'Ingénierie', school: 'Faculté', points: 39870, change: -1, avatar: '⚙️' },
        { rank: 4, name: 'Économie', school: 'Faculté', points: 35450, avatar: '📊' },
        { rank: 5, name: 'Droit', school: 'Faculté', points: 32100, avatar: '⚖️' },
      ]
    },
    country: {
      title: 'Défi des Pays',
      subtitle: 'Ton pays peut-il être #1 ?',
      timeLeft: '6j 14h restantes',
      participants: 15782,
      prize: 'Badge national + 2000 XP',
      myPosition: 892,
      myPoints: 420,
      topPlayers: [
        { rank: 1, name: 'Belgique 🇧🇪', school: '892 étudiants', points: 128450, avatar: '🇧🇪' },
        { rank: 2, name: 'France 🇫🇷', school: '1243 étudiants', points: 125680, change: 2, avatar: '🇫🇷' },
        { rank: 3, name: 'Suisse 🇨🇭', school: '534 étudiants', points: 98230, change: -1, avatar: '🇨🇭' },
        { rank: 4, name: 'Canada 🇨🇦', school: '678 étudiants', points: 87340, change: -1, avatar: '🇨🇦' },
        { rank: 5, name: 'Luxembourg 🇱🇺', school: '234 étudiants', points: 65120, change: 1, avatar: '🇱🇺' },
      ]
    }
  };

  const current = competitions[selectedCompetition];

  return (
    <div className="space-y-4">
      {/* Header avec sélection de compétition */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-5 border-2 border-gray-300">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-bold text-gray-900">Compétitions en cours</h3>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['weekend', 'faculty', 'country'] as const).map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedCompetition(comp)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all ${
                selectedCompetition === comp
                  ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {comp === 'weekend' ? 'Sprint du Week-end' : comp === 'faculty' ? 'Clash des Facultés' : 'Défi des Pays'}
            </button>
          ))}
        </div>

        {/* Infos de la compétition */}
        <div>
          <h4 className="font-bold text-gray-900 text-base mb-1">{current.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{current.subtitle}</p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <span className="font-medium text-gray-700">{current.timeLeft}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-medium text-gray-700">{current.participants.toLocaleString()} participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prix */}
      <div className="bg-white rounded-xl p-4 border-2 border-yellow-300 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-md">
            🏆
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-600 mb-1">Prix pour les vainqueurs</p>
            <p className="text-sm font-bold text-gray-900">{current.prize}</p>
          </div>
        </div>
      </div>

      {/* Ma position */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-300">
        <p className="text-xs font-semibold text-blue-700 mb-2">Ta position actuelle</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-black text-blue-900">#{current.myPosition}</div>
            <div className="text-sm text-blue-700">
              <span className="font-bold text-lg text-blue-900">{current.myPoints}</span> points
            </div>
          </div>
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </motion.div>
        </div>
      </div>

      {/* Classement */}
      <div className="space-y-2">
        {current.topPlayers.map((player, index) => (
          <motion.div
            key={player.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-xl p-4 border-2 ${
              player.rank === 1 ? 'border-yellow-400 shadow-lg shadow-yellow-200' :
              player.rank === 2 ? 'border-gray-300 shadow-md' :
              player.rank === 3 ? 'border-orange-300 shadow-md' :
              'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Rank */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                player.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-md' :
                player.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                player.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                'bg-gray-100 text-gray-700'
              }`}>
                {player.rank === 1 ? '👑' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
              </div>

              {/* Avatar/Name */}
              <div className="flex-1 min-w-0">
                {typeof player.avatar === 'string' && player.avatar.startsWith('http') ? (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
                      style={{ backgroundImage: `url(${player.avatar})` }}
                    />
                    <div>
                      <p className="font-bold text-sm text-gray-900 truncate">{player.name}</p>
                      <p className="text-xs text-gray-600">{player.school}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 text-xl flex items-center justify-center">{player.avatar}</div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 truncate">{player.name}</p>
                      <p className="text-xs text-gray-600">{player.school}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Points */}
              <div className="text-right">
                <p className="font-bold text-base text-gray-900">{player.points.toLocaleString()}</p>
                <p className="text-xs text-gray-600">points</p>
              </div>

              {/* Change */}
              {player.change !== undefined && (
                <div className={`flex items-center gap-0.5 ${
                  player.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {player.change > 0 ? '▲' : '▼'}
                  <span className="text-xs font-bold">{Math.abs(player.change)}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA vers le module Communauté */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 text-center"
      >
        <div className="w-12 h-12 bg-gray-900 rounded-xl mx-auto mb-3 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Module Compétitions complet</h3>
        <p className="text-sm text-gray-600 mb-4">
          Historique, statistiques, récompenses et plus encore
        </p>
        <button
          onClick={() => onNavigate && onNavigate('competition')}
          className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
        >
          Voir toutes les compétitions →
        </button>
      </motion.div>
    </div>
  );
}

export default function SocialFeedPanel({ isOpen, onClose, onNavigate, initialTab = 'for-you' }: SocialFeedPanelProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>(initialTab);
  
  // Mettre à jour l'onglet actif quand le panel s'ouvre avec un initialTab différent
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  const [feedData, setFeedData] = useState<SocialFeedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [reactions, setReactions] = useState<{ [eventId: string]: string[] }>({});

  const socialFeedService = SocialFeedService.getInstance();
  const scrollRef = useRef<HTMLDivElement>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadFeedData();
      loadStories();
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }

    return () => stopAutoRefresh();
  }, [isOpen]);

  const loadFeedData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = socialFeedService.getSocialFeed();
      setFeedData(data);
      setIsLoading(false);
    }, 300);
  };

  const loadStories = () => {
    // Simuler les Study Rooms avec toutes les informations
    const now = Date.now();
    const mockStories: Story[] = [
      {
        id: 'room-1',
        userId: 'room-gauss',
        userName: 'Loi de Gauss',
        courseName: 'Électrostatique',
        userAvatar: '⚡',
        activity: '5 participants',
        isLive: true,
        status: 'live',
        timestamp: new Date(now - 1000 * 60 * 2),
        hasBuddies: true,
        isSilent: false,
        isPublic: true,
        participants: [
          { name: 'Sophie', avatar: 'https://i.pravatar.cc/150?img=1', isBuddy: true },
          { name: 'Marc', avatar: 'https://i.pravatar.cc/150?img=2', isBuddy: true },
          { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=3', isBuddy: false },
          { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=4', isBuddy: false },
          { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=5', isBuddy: false }
        ]
      },
      {
        id: 'room-2',
        userId: 'room-integrales',
        userName: 'Intégrales',
        courseName: 'Mathématiques',
        userAvatar: '∫',
        activity: '3 participants',
        isLive: true,
        status: 'live',
        timestamp: new Date(now - 1000 * 60 * 5),
        hasBuddies: false,
        isSilent: true,
        isPublic: false,
        participants: [
          { name: 'Alex', avatar: 'https://i.pravatar.cc/150?img=6', isBuddy: false },
          { name: 'Nina', avatar: 'https://i.pravatar.cc/150?img=7', isBuddy: false },
          { name: 'Paul', avatar: 'https://i.pravatar.cc/150?img=8', isBuddy: false }
        ]
      },
      {
        id: 'room-3',
        userId: 'room-chimie',
        userName: 'Réactions Organiques',
        courseName: 'Chimie Organique',
        userAvatar: '🧪',
        activity: '8 participants',
        isLive: true,
        status: 'live',
        timestamp: new Date(now - 1000 * 60 * 8),
        hasBuddies: true,
        isSilent: false,
        isPublic: true,
        participants: [
          { name: 'Zak', avatar: 'https://i.pravatar.cc/150?img=9', isBuddy: true },
          { name: 'Julia', avatar: 'https://i.pravatar.cc/150?img=10', isBuddy: false },
          { name: 'Max', avatar: 'https://i.pravatar.cc/150?img=11', isBuddy: false },
          { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=12', isBuddy: false },
          { name: 'Chris', avatar: 'https://i.pravatar.cc/150?img=13', isBuddy: false },
          { name: 'Anna', avatar: 'https://i.pravatar.cc/150?img=14', isBuddy: false },
          { name: 'Ben', avatar: 'https://i.pravatar.cc/150?img=15', isBuddy: false },
          { name: 'Eva', avatar: 'https://i.pravatar.cc/150?img=16', isBuddy: false }
        ]
      },
      {
        id: 'room-upcoming-1',
        userId: 'room-bio',
        userName: 'Mitochondries',
        courseName: 'Biologie Cellulaire',
        userAvatar: '🔬',
        activity: '0 participants',
        isLive: false,
        status: 'upcoming',
        timestamp: new Date(now + 1000 * 60 * 15),
        scheduledTime: new Date(now + 1000 * 60 * 15),
        hasBuddies: true,
        isSilent: true,
        isPublic: false,
        participants: []
      },
      {
        id: 'room-upcoming-2',
        userId: 'room-stat',
        userName: 'Probabilités',
        courseName: 'Statistiques',
        userAvatar: '📊',
        activity: '0 participants',
        isLive: false,
        status: 'upcoming',
        timestamp: new Date(now + 1000 * 60 * 30),
        scheduledTime: new Date(now + 1000 * 60 * 30),
        hasBuddies: false,
        isSilent: false,
        isPublic: true,
        participants: []
      }
    ];
    setStories(mockStories);
  };

  const startAutoRefresh = () => {
    refreshIntervalRef.current = setInterval(() => {
      const data = socialFeedService.getSocialFeed();
      const currentUnreadCount = feedData?.unreadCount || 0;
      
      if (data.unreadCount > currentUnreadCount) {
        setHasNewUpdates(true);
      }
      
      setFeedData(data);
    }, 20000);
  };

  const stopAutoRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
  };

  const handleRefresh = () => {
    setHasNewUpdates(false);
    loadFeedData();
    loadStories();
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEventClick = (event: SocialEvent) => {
    if (event.clickableLink && onNavigate) {
      onNavigate(event.clickableLink.type, event.clickableLink.id);
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  const handleReaction = (eventId: string, reaction: string) => {
    setReactions(prev => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), reaction]
    }));
  };

  const getTabIcon = (tab: FeedTab) => {
    switch (tab) {
      case 'for-you': return Sparkles;
      case 'buddies': return Users;
      case 'competitions': return Trophy;
      case 'progression': return Zap;
    }
  };

  const getTabLabel = (tab: FeedTab) => {
    switch (tab) {
      case 'for-you': return 'Pour toi';
      case 'buddies': return 'Buddies';
      case 'competitions': return 'Compétitions';
      case 'progression': return 'Progression';
    }
  };

  const getFilteredEvents = (): SocialEvent[] => {
    if (!feedData) return [];

    const allEvents = [
      ...feedData.founderSessions,
      ...feedData.personalAchievements,
      ...feedData.buddyActivities,
      ...feedData.facultyActivities
    ];

    switch (activeTab) {
      case 'buddies':
        return feedData.buddyActivities;
      case 'for-you':
        // Mix intelligent : notifications + recommandations personnalisées + événements live
        const scoredEvents = allEvents.map(event => {
          let score = 0;
          
          // 🔴 Événements LIVE = priorité absolue (fusion avec "Maintenant")
          if (event.isLive) score += 150;
          
          // 🔔 Notifications non lues = priorité maximale
          if (!event.isRead) score += 100;
          
          // 👥 Activités de buddies = haute priorité
          if (feedData.buddyActivities.includes(event)) score += 50;
          
          // 🎯 Événements avec lien cliquable (actionable) = priorité
          if (event.clickableLink) score += 30;
          
          // 📚 Événements liés aux cours = pertinent
          if (event.message.toLowerCase().includes('cours') || 
              event.message.toLowerCase().includes('leçon') ||
              event.message.toLowerCase().includes('quiz')) {
            score += 20;
          }
          
          // 🏆 Achievements et progress = motivant
          if (event.type === 'achievement' || event.message.includes('complété')) {
            score += 15;
          }
          
          // 📅 Récence = bonus
          const hoursDiff = (Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60);
          if (hoursDiff < 1) score += 10;
          else if (hoursDiff < 6) score += 5;
          else if (hoursDiff < 24) score += 2;
          
          // 💬 Engagement = bonus
          score += (reactions[event.id]?.length || 0) * 2;
          
          return { event, score };
        });
        
        // Trier par score et garder les 30 plus pertinents (augmenté de 25 à 30)
        return scoredEvents
          .sort((a, b) => b.score - a.score)
          .slice(0, 30)
          .map(item => item.event);
      case 'competitions':
        // Événements de compétition uniquement
        return feedData.personalAchievements.filter(e => 
          e.clickableLink?.type === 'competition' || 
          e.message.includes('compétition') || 
          e.message.includes('classement')
        );
      default:
        return allEvents;
    }
  };

  if (!isOpen) return null;
    
    return (
    <AnimatePresence>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-[81px] right-0 bottom-0 w-full max-w-xl bg-white shadow-2xl overflow-hidden border-l border-gray-200 z-30"
          >
          {/* Header Modern Web 3.0 */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 border-b border-gray-200/60 shadow-lg backdrop-blur-xl">
            {/* Top bar */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    Science in Motion
                  </h2>
                    <p className="text-sm text-gray-600 mt-0.5">Ton réseau en temps réel ⚡</p>
                  </div>
          </div>
                <div className="flex items-center gap-2">
                  {/* Refresh button */}
        <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRefresh}
                    className="p-2.5 rounded-xl bg-white hover:bg-gray-50 transition-all relative border border-gray-200 shadow-sm"
                  >
                    <RefreshCw size={18} className="text-gray-700" />
                    {hasNewUpdates && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-lg shadow-orange-500/50"
                      />
                    )}
        </motion.button>

                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-white hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
                  >
                    <X size={18} className="text-gray-700" />
                  </motion.button>
          </div>
                  </div>
                </div>
                
            {/* Study Rooms - Carrousel */}
            <div className="px-4 py-3 bg-gradient-to-br from-orange-50/50 via-white to-red-50/30 border-b border-gray-200/60">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">Study Rooms</h3>
            <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-lg"
            >
                    🔥
            </motion.div>
          </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full border border-green-300">
                    <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse" />
                    {stories.filter(s => s.status === 'live').length}
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] font-medium text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full border border-blue-300">
                    <Calendar className="w-2.5 h-2.5" />
                    {stories.filter(s => s.status === 'upcoming').length}
                  </div>
                </div>
              </div>

              {/* Study Rooms Carousel */}
              <StudyRoomCarousel 
                items={stories as any}
                autoplay={true}
                autoplayDelay={5000}
                pauseOnHover={true}
              />
                </div>

            {/* Tabs */}
            <div className="flex items-center bg-white shadow-sm">
              {(['for-you', 'buddies', 'progression', 'competitions'] as FeedTab[]).map((tab) => {
                const Icon = getTabIcon(tab);
                const isActive = activeTab === tab;
                
                return (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-4 px-2 text-center transition-all relative ${
                      isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon size={20} />
                    </motion.div>
                      <span className="text-xs font-medium hidden sm:block">{getTabLabel(tab)}</span>
                </div>
                    {isActive && (
            <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 to-black rounded-t-full"
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Feed Content */}
            <div 
              ref={scrollRef}
            className="overflow-y-auto h-[calc(100vh-85px-290px)] bg-gradient-to-b from-gray-50/50 to-white p-4"
            >
              {isLoading ? (
              <div className="flex items-center justify-center py-20">
                  <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={32} className="text-blue-600" />
                </motion.div>
              </div>
            ) : activeTab === 'buddies' ? (
              <BuddyActivityTab 
                buddyActivities={feedData?.buddyActivities || []}
                onNavigate={onNavigate}
                reactions={reactions}
              />
            ) : activeTab === 'progression' ? (
              <ProgressionTab onNavigate={onNavigate} />
            ) : activeTab === 'competitions' ? (
              <CompetitionsTab onNavigate={onNavigate} />
            ) : (
              <>
                {getFilteredEvents().length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <AlertCircle size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">Aucune activité pour le moment</p>
                    <p className="text-gray-500 text-sm mt-1">Reviens plus tard !</p>
                </div>
              ) : (
                  <AnimatedList
                    items={getFilteredEvents().map((event, index) => (
                    <SocialEventCard
                        key={event.id}
                      event={event}
                        index={index}
                        reactions={reactions[event.id] || []}
                        onReaction={(reaction) => handleReaction(event.id, reaction)}
                        onClick={() => handleEventClick(event)}
                      />
                    ))}
                    onItemSelect={(item, index) => {
                      const event = getFilteredEvents()[index];
                      if (event) handleEventClick(event);
                    }}
                    showGradients={true}
                    enableArrowNavigation={false}
                    displayScrollbar={true}
                    className="px-4"
                  />
                )}
              </>
            )}
              </div>
            </motion.div>
        </AnimatePresence>
  );
}

// ============================================================================
// SOCIAL EVENT CARD COMPONENTS - FORMATS DIVERSIFIÉS
// ============================================================================

interface SocialEventCardProps {
  event: SocialEvent;
  index: number;
  reactions: string[];
  onReaction: (reaction: string) => void;
  onClick: () => void;
}

// 1. Carte LIVE (format urgent avec fond coloré)
function LiveEventCard({ event, index, onClick }: { event: SocialEvent; index: number; onClick: () => void }) {
  const socialFeedService = SocialFeedService.getInstance();
  const timeAgo = socialFeedService.getTimeAgo(event.timestamp);

  return (
          <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="relative overflow-hidden rounded-xl border-2 border-red-500 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 shadow-lg"
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"
      />
      <div className="relative p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-700 font-bold shadow-lg border-2 border-red-500">
              {event.userName[0]}
            </div>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">{event.userName}</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                🔴 LIVE
              </span>
              <span className="ml-auto text-xs text-gray-600">{timeAgo}</span>
            </div>
            <p className="text-gray-800 font-medium mb-3">{event.message}</p>
            {event.clickableLink && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg py-2.5 px-4 font-bold shadow-lg flex items-center justify-between"
              >
                <span>🚀 {event.clickableLink.action || 'Rejoindre maintenant'}</span>
                <ChevronRight size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 2. Carte Achievement (format célébration)
function AchievementCard({ event, index, onClick }: { event: SocialEvent; index: number; onClick: () => void }) {
  const socialFeedService = SocialFeedService.getInstance();
  const timeAgo = socialFeedService.getTimeAgo(event.timestamp);
  
  return (
          <motion.div
      initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full -mr-16 -mt-16" />
      <div className="relative p-5">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="text-4xl"
          >
            {event.emoji || '🏆'}
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-gray-900">{event.userName}</span>
              <span className="text-amber-600 text-xs font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                Achievement
              </span>
                  </div>
            <p className="text-gray-800 font-medium mb-2">{event.message}</p>
            <p className="text-xs text-gray-500 mb-3">{timeAgo}</p>
                </div>
        </div>
      </div>
                  </motion.div>
  );
}

// 3. Carte Battle (format VS)
function BattleCard({ event, index, onClick }: { event: SocialEvent; index: number; onClick: () => void }) {
  const socialFeedService = SocialFeedService.getInstance();
  const timeAgo = socialFeedService.getTimeAgo(event.timestamp);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl overflow-hidden border-2 border-purple-300 bg-white shadow-md"
    >
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 flex items-center justify-between">
        <span className="text-white font-bold text-sm">⚔️ Battle</span>
        <span className="text-white/90 text-xs font-semibold">{event.battleStatus?.toUpperCase()}</span>
              </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              {event.userName[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{event.userName}</p>
              <p className="text-xs text-gray-600">Toi</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-400">VS</div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-bold text-gray-900 text-sm">{event.battleOpponent}</p>
              <p className="text-xs text-gray-600">Adversaire</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold shadow-md">
              {event.battleOpponent?.[0] || 'A'}
            </div>
          </div>
        </div>
        {event.battleScore && (
          <div className="flex items-center justify-center gap-4 mb-3 py-2 bg-gray-50 rounded-lg">
            <span className="text-2xl font-bold text-blue-600">{event.battleScore.player}</span>
            <span className="text-gray-400">-</span>
            <span className="text-2xl font-bold text-red-600">{event.battleScore.opponent}</span>
          </div>
        )}
        <p className="text-gray-700 text-sm mb-2">{event.message}</p>
        <p className="text-xs text-gray-500 mb-3">{timeAgo}</p>
              </div>
            </motion.div>
  );
}

// 4. Carte Study Room (format participants)
function StudyRoomCard({ event, index, onClick }: { event: SocialEvent; index: number; onClick: () => void }) {
  const socialFeedService = SocialFeedService.getInstance();
  const timeAgo = socialFeedService.getTimeAgo(event.timestamp);
  const gradients = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-green-500 to-green-600', 'from-orange-500 to-orange-600'];
  const gradient = gradients[index % gradients.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all"
    >
      <div className={`bg-gradient-to-r ${gradient} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-white" />
            <span className="text-white font-bold text-sm">Study Room</span>
          </div>
          {event.currentParticipants && event.maxParticipants && (
            <span className="text-white/90 text-xs font-semibold">
              {event.currentParticipants}/{event.maxParticipants} participants
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-gray-700 font-bold">
            {event.userName[0]}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{event.userName}</p>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        <p className="text-gray-700 text-sm mb-3">{event.message}</p>
        {event.clickableLink && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full bg-gradient-to-r ${gradient} text-white rounded-lg py-2 px-4 font-semibold text-sm flex items-center justify-between shadow-md`}
          >
            <span>{event.clickableLink.action || 'Rejoindre'}</span>
            <ChevronRight size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// 5. Carte Recommendation (format riche avec pertinence)
function RecommendationCard({ event, index, onClick }: { event: SocialEvent; index: number; onClick: () => void }) {
  const socialFeedService = SocialFeedService.getInstance();
  const timeAgo = socialFeedService.getTimeAgo(event.timestamp);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md"
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-blue-600" />
          <span className="text-blue-600 text-xs font-bold">Recommandé pour toi</span>
          {event.relevanceScore && (
            <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              {event.relevanceScore}% match
            </span>
          )}
        </div>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-gray-700 font-bold">
            {event.userName[0]}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{event.userName}</p>
            <p className="text-gray-700 text-sm mt-1">{event.message}</p>
            <p className="text-xs text-gray-500 mt-2">{timeAgo}</p>
          </div>
        </div>
        {event.clickableLink && (
                    <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-2.5 px-4 font-semibold text-sm flex items-center justify-between shadow-md"
          >
            <span>{event.clickableLink.action || 'Découvrir'}</span>
            <ChevronRight size={16} />
                    </motion.button>
                  )}
                </div>
    </motion.div>
  );
}

// 6. Carte Challenge (format avec progression)
function ChallengeCard({ event, index, onClick }: { event: SocialEvent; index: number; onClick: () => void }) {
  const socialFeedService = SocialFeedService.getInstance();
  const timeAgo = socialFeedService.getTimeAgo(event.timestamp);
  const progress = event.challengeProgress || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl overflow-hidden border border-green-200 bg-white shadow-md"
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 flex items-center justify-between">
        <span className="text-white font-bold text-sm">🎯 Challenge</span>
        <span className="text-white/90 text-xs font-semibold">{progress}% complété</span>
              </div>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-gray-700 font-bold">
            {event.userName[0]}
            </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{event.userName}</p>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        <p className="text-gray-700 text-sm mb-3">{event.message}</p>
        
        {/* Progress bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: index * 0.05 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
            />
          </div>
        </div>
        
        {event.challengeReward && (
          <p className="text-xs text-gray-600 mb-3">🏆 Récompense: {event.challengeReward}</p>
        )}
        
        {event.clickableLink && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg py-2 px-4 font-semibold text-sm shadow-md"
          >
            {event.clickableLink.action || 'Continuer'}
          </motion.button>
        )}
                </div>
    </motion.div>
  );
}

// Composant principal avec routing vers le bon format
function SocialEventCard({ event, index, reactions, onReaction, onClick }: SocialEventCardProps) {
  // Router vers le bon format selon le type d'événement
  if (event.isLive && event.type === 'study-room') {
    return <LiveEventCard event={event} index={index} onClick={onClick} />;
  }
  
  if (event.type === 'achievement' || event.type === 'personal') {
    return <AchievementCard event={event} index={index} onClick={onClick} />;
  }
  
  if (event.type === 'battle') {
    return <BattleCard event={event} index={index} onClick={onClick} />;
  }
  
  if (event.type === 'study-room' && !event.isLive) {
    return <StudyRoomCard event={event} index={index} onClick={onClick} />;
  }
  
  if (event.type === 'discovery') {
    return <RecommendationCard event={event} index={index} onClick={onClick} />;
  }
  
  if (event.type === 'challenge') {
    return <ChallengeCard event={event} index={index} onClick={onClick} />;
  }
  
  // Carte standard pour les autres types
  return <StandardEventCard event={event} index={index} reactions={reactions} onReaction={onReaction} onClick={onClick} />;
}

// Carte standard (format par défaut)
function StandardEventCard({ event, index, reactions, onReaction, onClick }: SocialEventCardProps) {
  const [showReactions, setShowReactions] = useState(false);
  const socialFeedService = SocialFeedService.getInstance();
  
  const timeAgo = socialFeedService.getTimeAgo(event.timestamp);
  const isLive = event.isLive;
  const isNew = !event.isRead;
  const hasLink = !!event.clickableLink;

  const reactionEmojis = ['🔥', '💡', '🎯', '👏', '🤩', '❤️'];

  return (
                    <motion.div
      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all"
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-gray-700 font-bold shadow-sm"
            >
              {event.userName[0]}
                    </motion.div>
            {isLive && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full border-2 border-white"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{event.userName}</span>
                  {isLive && (
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
                    >
                      🔴 LIVE
                    </motion.span>
                  )}
                  {isNew && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                <p className="text-gray-700 text-sm mt-1">{event.message}</p>
              </div>
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>

            {/* Clickable link */}
                </div>
              </div>
            </div>

      {/* Actions */}
      <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Reactions */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Heart size={16} />
              {reactions.length > 0 && (
                <span className="text-xs font-medium">{reactions.length}</span>
              )}
            </button>
            
            {showReactions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full mb-2 bg-white rounded-xl shadow-xl border border-gray-200 px-2 py-1 flex gap-1"
              >
                {reactionEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReaction(emoji);
                      setShowReactions(false);
                    }}
                    className="w-8 h-8 hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
                    </motion.div>
                  )}
                </div>

          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
            <MessageCircle size={16} />
          </button>

          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
            <Share2 size={16} />
          </button>
                </div>

        <button className="text-gray-600 hover:text-blue-600 transition-colors">
          <Bookmark size={16} />
        </button>
            </div>

      {/* Reactions preview */}
      {reactions.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 flex items-center gap-1 text-xs text-gray-600">
          {reactions.slice(0, 5).join(' ')}
          {reactions.length > 5 && <span>et {reactions.length - 5} autres</span>}
            </div>
      )}
    </motion.div>
  );
}
