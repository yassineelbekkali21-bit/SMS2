'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Calendar, 
  Trophy, 
  ArrowLeft,
  Send,
  ThumbsUp,
  MessageSquare,
  Clock,
  MapPin,
  Users,
  Medal,
  Star,
  Crown,
  Shield,
  Heart,
  Flame,
  Sparkles,
  UserCheck,
  Share2,
  ExternalLink,
  MessageCircleIcon
} from 'lucide-react';
import { Circle } from '@/types';

interface CircleDetailViewProps {
  circle: Circle;
  onBack: () => void;
  onOpenMessaging: (userId: string) => void;
}

type CircleSubTab = 'discussion' | 'events' | 'leaderboard';

interface CircleActivity {
  id: string;
  type: 'resource' | 'join' | 'achievement' | 'question' | 'event';
  user: {
    id: string;
    name: string;
    avatar: string;
    badges: string[];
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

interface CircleEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  type: 'study' | 'workshop' | 'social' | 'online';
}

interface CircleMember {
  id: string;
  name: string;
  avatar: string;
  points: number;
  contributions: number;
  badge: 'Engagé' | 'Mentor' | 'Animateur' | 'Nouveau' | 'Expert';
  isOnline: boolean;
}

const MOCK_ACTIVITIES: CircleActivity[] = [
  {
    id: '1',
    type: 'resource',
    user: {
      id: 'sarah-1',
      name: 'Sarah Martin',
      avatar: '👩‍🎓',
      badges: ['Mentor', 'Engagé']
    },
    content: 'a partagé une ressource sur les équations différentielles',
    timestamp: new Date(Date.now() - 15 * 60000),
    likes: 12,
    comments: 3
  },
  {
    id: '2',
    type: 'join',
    user: {
      id: 'zak-1',
      name: 'Zak El Amrani',
      avatar: '👨‍💼',
      badges: ['Nouveau']
    },
    content: 'a rejoint ton groupe',
    timestamp: new Date(Date.now() - 45 * 60000),
    likes: 8,
    comments: 1
  },
  {
    id: '3',
    type: 'achievement',
    user: {
      id: 'maya-1',
      name: 'Maya Benali',
      avatar: '👩‍🔬',
      badges: ['Expert', 'Animateur']
    },
    content: 'a obtenu le badge "Contributeur Exceptionnel" 🏆',
    timestamp: new Date(Date.now() - 120 * 60000),
    likes: 24,
    comments: 7
  },
  {
    id: '4',
    type: 'question',
    user: {
      id: 'leo-1',
      name: 'Léo Dubois',
      avatar: '👨‍🎓',
      badges: ['Engagé']
    },
    content: 'a posé une question sur la thermodynamique',
    timestamp: new Date(Date.now() - 180 * 60000),
    likes: 5,
    comments: 9
  }
];

const MOCK_EVENTS: CircleEvent[] = [
  {
    id: 'e1',
    title: 'Session de révision collective - Physique',
    description: 'Révisons ensemble les chapitres sur l\'électromagnétisme avant le partiel',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '18h00 - 20h00',
    location: 'Bibliothèque Centrale',
    attendees: 12,
    maxAttendees: 20,
    type: 'study'
  },
  {
    id: 'e2',
    title: 'Atelier: Méthodes de résolution de problèmes',
    description: 'Workshop animé par un ancien étudiant devenu ingénieur',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: '14h00 - 16h00',
    location: 'Salle A201',
    attendees: 8,
    maxAttendees: 15,
    type: 'workshop'
  },
  {
    id: 'e3',
    title: 'Rencontre informelle - Café Étudiant',
    description: 'Moment convivial pour faire connaissance et échanger',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '17h30 - 19h00',
    location: 'Café du Campus',
    attendees: 15,
    maxAttendees: 25,
    type: 'social'
  },
  {
    id: 'e4',
    title: 'Webinaire: Orientation et débouchés en sciences',
    description: 'Découvre les opportunités de carrière avec nos intervenants',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: '19h00 - 20h30',
    location: 'En ligne (Zoom)',
    attendees: 45,
    maxAttendees: 100,
    type: 'online'
  }
];

const MOCK_MEMBERS: CircleMember[] = [
  { id: '1', name: 'Maya Benali', avatar: '👩‍🔬', points: 2450, contributions: 87, badge: 'Animateur', isOnline: true },
  { id: '2', name: 'Sarah Martin', avatar: '👩‍🎓', points: 2180, contributions: 65, badge: 'Mentor', isOnline: true },
  { id: '3', name: 'Thomas Dubois', avatar: '👨‍🎓', points: 1920, contributions: 54, badge: 'Expert', isOnline: false },
  { id: '4', name: 'Léo Bernard', avatar: '👨‍💼', points: 1650, contributions: 43, badge: 'Engagé', isOnline: true },
  { id: '5', name: 'Emma Laurent', avatar: '👩', points: 1480, contributions: 38, badge: 'Engagé', isOnline: false },
  { id: '6', name: 'Zak El Amrani', avatar: '👨‍💼', points: 850, contributions: 12, badge: 'Nouveau', isOnline: true },
];

const getInitials = (name: string) => {
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (index: number) => {
  const colors = [
    'bg-blue-500 text-white',
    'bg-purple-500 text-white',
    'bg-green-500 text-white',
    'bg-orange-500 text-white',
    'bg-pink-500 text-white',
    'bg-indigo-500 text-white',
  ];
  return colors[index % colors.length];
};

const getBadgeIcon = (badge: string) => {
  switch (badge) {
    case 'Animateur': return <Sparkles size={14} className="text-purple-500" />;
    case 'Mentor': return <Crown size={14} className="text-yellow-500" />;
    case 'Expert': return <Medal size={14} className="text-blue-500" />;
    case 'Engagé': return <Heart size={14} className="text-red-500" />;
    case 'Nouveau': return <Star size={14} className="text-gray-500" />;
    default: return null;
  }
};

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case 'Animateur': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Mentor': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Expert': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Engagé': return 'bg-red-100 text-red-700 border-red-200';
    case 'Nouveau': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export function CircleDetailView({ circle, onBack, onOpenMessaging }: CircleDetailViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<CircleSubTab>('discussion');
  const [newMessage, setNewMessage] = useState('');

  const subTabs = [
    { id: 'discussion' as CircleSubTab, label: 'Discussion', icon: MessageCircle },
    { id: 'events' as CircleSubTab, label: 'Événements', icon: Calendar },
    { id: 'leaderboard' as CircleSubTab, label: 'Classement', icon: Trophy }
  ];

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `Il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Envoi du message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Retour aux cercles</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{circle.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{circle.name}</h2>
              <p className="text-gray-600 mt-1">{circle.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Users size={14} />
                  {circle.memberCount} membres
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{circle.activityLevel} activité</span>
              </div>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Share2 size={16} />
            Inviter des amis
          </button>
        </div>

        {/* Sous-onglets */}
        <div className="flex gap-1 mt-6 border-b border-gray-200">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                  activeSubTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {activeSubTab === tab.id && (
                  <motion.div
                    layoutId="activeSubTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeSubTab === 'discussion' && (
            <motion.div
              key="discussion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Champ de saisie */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Partage une idée, pose une question..."
                  className="w-full resize-none border-none focus:ring-0 text-gray-900 placeholder-gray-400"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Send size={16} />
                    Publier
                  </button>
                </div>
              </div>

              {/* Flux d'activités */}
              <div className="space-y-4">
                {MOCK_ACTIVITIES.map((activity, activityIndex) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(activityIndex)}`}>
                        {getInitials(activity.user.name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900">{activity.user.name}</span>
                          {activity.user.badges.map((badge, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${getBadgeColor(badge)}`}
                            >
                              {getBadgeIcon(badge)}
                              {badge}
                            </span>
                          ))}
                          <button
                            onClick={() => onOpenMessaging(activity.user.id)}
                            className="ml-auto text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Envoyer un message"
                          >
                            <MessageCircleIcon size={16} />
                          </button>
                        </div>
                        <p className="text-gray-600 mt-1">{activity.content}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <ThumbsUp size={14} />
                            {activity.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <MessageSquare size={14} />
                            {activity.comments}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSubTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Événements à venir</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Créer un événement
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {MOCK_EVENTS.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.type === 'study' ? 'bg-blue-100 text-blue-700' :
                        event.type === 'workshop' ? 'bg-purple-100 text-purple-700' :
                        event.type === 'social' ? 'bg-green-100 text-green-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {event.type === 'study' ? '📚 Étude' :
                         event.type === 'workshop' ? '🛠️ Atelier' :
                         event.type === 'social' ? '🎉 Social' :
                         '💻 En ligne'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.attendees}/{event.maxAttendees} participants
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-2">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        {event.location}
                      </div>
                    </div>

                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Participer
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSubTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="text-yellow-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Classement du cercle</h3>
                </div>
                <p className="text-gray-600">
                  Les membres les plus actifs et engagés ce mois-ci
                </p>
              </div>

              <div className="space-y-3">
                {MOCK_MEMBERS.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl border-2 p-4 hover:border-blue-300 transition-all ${
                      index === 0 ? 'border-yellow-300 shadow-lg' :
                      index === 1 ? 'border-gray-300 shadow-md' :
                      index === 2 ? 'border-orange-300 shadow-md' :
                      'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rang */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>

                      {/* Avatar et nom */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(index)}`}>
                            {getInitials(member.name)}
                          </div>
                          {member.isOnline && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{member.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${getBadgeColor(member.badge)}`}>
                              {getBadgeIcon(member.badge)}
                              {member.badge}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-0.5">
                            {member.contributions} contributions
                          </div>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 flex items-center gap-1">
                          <Flame className="text-orange-500" size={18} />
                          {member.points}
                        </div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>

                      {/* Bouton message */}
                      <button
                        onClick={() => onOpenMessaging(member.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Envoyer un message"
                      >
                        <MessageCircleIcon size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

