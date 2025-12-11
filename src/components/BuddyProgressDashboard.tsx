'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Trophy, Flame, Zap, BookOpen, Target,
  Clock, Star, Award, CheckCircle, MessageCircle, Video,
  Gift, Sparkles, Bell, ChevronRight
} from 'lucide-react';

interface BuddyProgress {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToday: number;
  streak: number;
  isOnline: boolean;
  courses: {
    id: string;
    name: string;
    progress: number;
    lastActivity: Date;
  }[];
  recentAchievements: {
    id: string;
    type: 'course_complete' | 'quiz_perfect' | 'level_up' | 'badge_earned';
    title: string;
    description: string;
    timestamp: Date;
    icon: string;
  }[];
}

interface SocialNotification {
  id: string;
  buddyId: string;
  buddyName: string;
  type: 'progress' | 'achievement' | 'study_room' | 'milestone';
  message: string;
  timestamp: Date;
  icon: string;
  actionUrl?: string;
}

interface BuddyProgressDashboardProps {
  buddies: BuddyProgress[];
  notifications: SocialNotification[];
  onMessage: (buddyId: string) => void;
  onJoinStudyRoom: (roomId: string) => void;
}

// Données mock pour démonstration
const MOCK_BUDDIES: BuddyProgress[] = [
  {
    id: 'buddy-1',
    name: 'Sophie Laurent',
    avatar: '👩‍🎓',
    level: 12,
    xp: 2450,
    xpToday: 350,
    streak: 7,
    isOnline: true,
    courses: [
      { id: 'prob', name: 'Probabilités', progress: 75, lastActivity: new Date(Date.now() - 3600000) },
      { id: 'stats', name: 'Statistiques', progress: 45, lastActivity: new Date(Date.now() - 7200000) },
    ],
    recentAchievements: [
      {
        id: 'ach-1',
        type: 'course_complete',
        title: 'Pack complété',
        description: 'A terminé "Probabilités Avancées"',
        timestamp: new Date(Date.now() - 5400000),
        icon: '🎓',
      },
      {
        id: 'ach-2',
        type: 'quiz_perfect',
        title: 'Quiz parfait',
        description: '100% au quiz de Statistiques',
        timestamp: new Date(Date.now() - 7200000),
        icon: '⭐',
      },
    ],
  },
  {
    id: 'buddy-2',
    name: 'Zak El Amrani',
    avatar: '👨‍💼',
    level: 15,
    xp: 3120,
    xpToday: 280,
    streak: 12,
    isOnline: false,
    courses: [
      { id: 'meca', name: 'Mécanique', progress: 92, lastActivity: new Date(Date.now() - 86400000) },
      { id: 'thermo', name: 'Thermodynamique', progress: 68, lastActivity: new Date(Date.now() - 43200000) },
    ],
    recentAchievements: [
      {
        id: 'ach-3',
        type: 'level_up',
        title: 'Niveau supérieur',
        description: 'A atteint le niveau 15',
        timestamp: new Date(Date.now() - 10800000),
        icon: '🔥',
      },
    ],
  },
  {
    id: 'buddy-3',
    name: 'Emma Dubois',
    avatar: '👩‍🔬',
    level: 9,
    xp: 1890,
    xpToday: 420,
    streak: 3,
    isOnline: true,
    courses: [
      { id: 'bio', name: 'Biologie', progress: 55, lastActivity: new Date(Date.now() - 1800000) },
      { id: 'chimie', name: 'Chimie Organique', progress: 38, lastActivity: new Date(Date.now() - 10800000) },
    ],
    recentAchievements: [
      {
        id: 'ach-4',
        type: 'badge_earned',
        title: 'Nouveau badge',
        description: 'A débloqué "Scientifique Assidu"',
        timestamp: new Date(Date.now() - 14400000),
        icon: '🏆',
      },
    ],
  },
];

const MOCK_NOTIFICATIONS: SocialNotification[] = [
  {
    id: 'notif-1',
    buddyId: 'buddy-1',
    buddyName: 'Sophie',
    type: 'progress',
    message: 'Sophie a complété 75% du pack Probabilités',
    timestamp: new Date(Date.now() - 3600000),
    icon: '📚',
  },
  {
    id: 'notif-2',
    buddyId: 'buddy-2',
    buddyName: 'Zak',
    type: 'study_room',
    message: 'Zak a créé une Study Room sur ton pack actuel "Mécanique"',
    timestamp: new Date(Date.now() - 7200000),
    icon: '🎥',
    actionUrl: 'study-room-123',
  },
  {
    id: 'notif-3',
    buddyId: 'buddy-3',
    buddyName: 'Emma',
    type: 'achievement',
    message: 'Emma a obtenu un nouveau badge !',
    timestamp: new Date(Date.now() - 10800000),
    icon: '🏆',
  },
  {
    id: 'notif-4',
    buddyId: 'buddy-1',
    buddyName: 'Sophie',
    type: 'milestone',
    message: 'Sophie est sur une série de 7 jours ! Félicite-la 🔥',
    timestamp: new Date(Date.now() - 14400000),
    icon: '🔥',
  },
];

export function BuddyProgressDashboard({
  buddies = MOCK_BUDDIES,
  notifications = MOCK_NOTIFICATIONS,
  onMessage,
  onJoinStudyRoom,
}: BuddyProgressDashboardProps) {
  const [selectedBuddy, setSelectedBuddy] = useState<string | null>(null);

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `Il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'course_complete': return 'from-green-400 to-emerald-500';
      case 'quiz_perfect': return 'from-yellow-400 to-orange-500';
      case 'level_up': return 'from-red-400 to-pink-500';
      case 'badge_earned': return 'from-purple-400 to-indigo-500';
      default: return 'from-blue-400 to-cyan-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* 🔔 Notifications Sociales */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Bell className="text-blue-600" size={20} />
            Activités de tes buddies
          </h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            {notifications.length} nouvelles
          </span>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="text-2xl flex-shrink-0">{notif.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notif.timestamp)}</p>
              </div>
              {notif.actionUrl && (
                <button
                  onClick={() => onJoinStudyRoom(notif.actionUrl!)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
                >
                  Rejoindre
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 📊 Mini-Dashboard des Buddies */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={20} />
          Progression de tes buddies
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {buddies.map((buddy) => (
            <motion.div
              key={buddy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border-2 border-gray-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              {/* Header du buddy */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                      {buddy.avatar}
                    </div>
                    {buddy.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{buddy.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                        Niv. {buddy.level}
                      </span>
                      <span className="text-xs text-gray-500">{buddy.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onMessage(buddy.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageCircle size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Stats du jour */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-3 border border-yellow-200">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <Zap size={16} />
                    <span className="text-xs font-medium">XP aujourd'hui</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">{buddy.xpToday}</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-3 border border-red-200">
                  <div className="flex items-center gap-2 text-red-600 mb-1">
                    <Flame size={16} />
                    <span className="text-xs font-medium">Série</span>
                  </div>
                  <p className="text-2xl font-bold text-red-900">{buddy.streak} jours</p>
                </div>
              </div>

              {/* Progression des cours */}
              <div className="mb-4">
                <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <BookOpen size={14} />
                  Cours en cours
                </h5>
                <div className="space-y-2">
                  {buddy.courses.map((course) => (
                    <div key={course.id}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span className="font-medium">{course.name}</span>
                        <span className="font-bold text-blue-600">{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            course.progress >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            course.progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                            'bg-gradient-to-r from-yellow-500 to-orange-500'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Dernière activité : {formatTimeAgo(course.lastActivity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accomplissements récents */}
              {buddy.recentAchievements.length > 0 && (
                <div>
                  <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Trophy size={14} />
                    Derniers accomplissements
                  </h5>
                  <div className="space-y-2">
                    {buddy.recentAchievements.slice(0, 2).map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`flex items-start gap-2 p-2 bg-gradient-to-r ${getAchievementColor(achievement.type)} bg-opacity-10 rounded-lg border border-opacity-20`}
                      >
                        <span className="text-xl flex-shrink-0">{achievement.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900">{achievement.title}</p>
                          <p className="text-xs text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(achievement.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton détails */}
              <button
                onClick={() => setSelectedBuddy(buddy.id)}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
              >
                Voir tous les détails
                <ChevronRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}









