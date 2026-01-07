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
  MessageCircleIcon,
  Camera,
  Mic,
  Paperclip,
  Image as ImageIcon
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

// Mock chat messages pour le cercle
interface ChatMessage {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  isMentor: boolean;
}

export function CircleDetailView({ circle, onBack, onOpenMessaging }: CircleDetailViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<CircleSubTab>('discussion');
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      author: 'Zak', 
      authorInitials: 'ZK', 
      content: `Bienvenue dans le cercle ${circle.name} ! N'hésitez pas à poser vos questions et à partager vos ressources.`, 
      timestamp: 'Il y a 2h', 
      isMentor: true 
    },
    { 
      id: '2', 
      author: 'Sarah Martin', 
      authorInitials: 'SM', 
      content: 'Salut tout le monde ! Ravie de rejoindre ce groupe.', 
      timestamp: 'Il y a 1h30', 
      isMentor: false 
    },
    { 
      id: '3', 
      author: 'Thomas Dubois', 
      authorInitials: 'TD', 
      content: 'Quelqu\'un aurait des ressources sur les équations différentielles ?', 
      timestamp: 'Il y a 45min', 
      isMentor: false 
    },
    { 
      id: '4', 
      author: 'Maya Benali', 
      authorInitials: 'MB', 
      content: 'Je peux te partager mon cours, il est vraiment bien fait !', 
      timestamp: 'Il y a 30min', 
      isMentor: false 
    },
    { 
      id: '5', 
      author: 'Zak', 
      authorInitials: 'ZK', 
      content: 'Super initiative Maya ! N\'hésitez pas à partager vos ressources, c\'est comme ça qu\'on progresse ensemble.', 
      timestamp: 'Il y a 15min', 
      isMentor: true 
    }
  ]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

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
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const msg: ChatMessage = {
        id: `msg-${Date.now()}`,
        author: 'Vous',
        authorInitials: 'V',
        content: newMessage.trim(),
        timestamp: 'À l\'instant',
        isMentor: false
      };
      setChatMessages([...chatMessages, msg]);
      setNewMessage('');
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header simplifié */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{circle.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{circle.name}</h2>
                <p className="text-sm text-gray-500">{circle.memberCount} membres</p>
              </div>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium">
            <Share2 size={16} />
            Inviter
          </button>
        </div>
      </div>

      {/* Sous-onglets en pills */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex-shrink-0">
        <div className="flex gap-2">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  activeSubTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeSubTab === 'discussion' && (
            <motion.div
              key="discussion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col"
            >
              {/* Chat Container - Style simplifié */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col flex-1 m-4">
                {/* Header compact */}
                <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0 bg-white flex items-center justify-between">
                  <p className="text-gray-500 text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-gray-600 font-medium">{MOCK_MEMBERS.filter(m => m.isOnline).length} en ligne</span>
                    </span>
                  </p>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 font-medium rounded-full text-xs">
                    {chatMessages.length} messages
                  </span>
                </div>
                
                {/* Liste des messages */}
                <div 
                  className="flex-1 p-5 space-y-5 overflow-y-auto"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundColor: '#fafafa'
                  }}
                >
                  {/* System message */}
                  <div className="flex justify-center">
                    <span className="px-4 py-2 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                      🎉 Bienvenue dans {circle.name}
                    </span>
                  </div>
                  
                  {chatMessages.map((msg, index) => (
                    <React.Fragment key={msg.id}>
                      <div className={`flex gap-3 ${msg.author === 'Vous' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-semibold ${
                          msg.isMentor ? 'bg-gray-900 text-white' : msg.author === 'Vous' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                        }`} style={{ fontSize: '14px' }}>
                          {msg.authorInitials}
                        </div>
                        
                        {/* Message bubble */}
                        <div className={`max-w-[75%] ${msg.author === 'Vous' ? 'items-end' : ''}`}>
                          <div className={`flex items-center gap-2 mb-1.5 ${msg.author === 'Vous' ? 'justify-end' : ''}`}>
                            <span className="font-semibold text-gray-800" style={{ fontSize: '14px' }}>{msg.author}</span>
                            {msg.isMentor && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-medium rounded-md border border-gray-200" style={{ fontSize: '11px' }}>
                                Fondateur
                              </span>
                            )}
                            <span className="text-gray-400" style={{ fontSize: '12px' }}>{msg.timestamp}</span>
                          </div>
                          <div className={`px-4 py-3 rounded-2xl leading-relaxed ${
                            msg.author === 'Vous' 
                              ? 'bg-gray-900 text-white rounded-tr-md' 
                              : 'bg-white border border-gray-200 text-gray-900 rounded-tl-md'
                          }`} style={{ fontSize: '15px' }}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                      
                      {/* System message after some messages */}
                      {index === 2 && (
                        <div className="flex justify-center">
                          <span className="px-4 py-2 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                            👋 3 nouveaux membres cette semaine
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Zone d'input */}
                <div className="p-5 border-t border-gray-200 bg-white flex-shrink-0">
                  <div className="flex gap-2 items-end">
                    {/* Boutons d'attachement */}
                    <div className="flex gap-0.5">
                      <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Joindre un fichier">
                        <Paperclip size={20} />
                      </button>
                      <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Envoyer une image">
                        <ImageIcon size={20} />
                      </button>
                      <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Message vocal">
                        <Mic size={20} />
                      </button>
                    </div>
                    <input 
                      value={newMessage} 
                      onChange={(e) => setNewMessage(e.target.value)} 
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Écris ton message..." 
                      className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm" 
                    />
                    <button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim()} 
                      className={`p-3 rounded-xl transition-colors ${newMessage.trim() ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400'}`}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSubTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Événements à venir</h3>
                </div>
                <button className="px-5 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all text-sm font-medium hover:scale-[1.02] active:scale-[0.98]">
                  + Suggérer
                </button>
              </div>

              {/* Events List - Minimal Cards */}
              <div className="space-y-3">
                {MOCK_EVENTS.map((event, index) => {
                  const isUpcoming = event.date.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000; // within 3 days
                  return (
                  <motion.div
                    key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all overflow-hidden"
                  >
                      <div className="flex">
                        {/* Date Block - Left */}
                        <div 
                          className="w-20 flex-shrink-0 flex flex-col items-center justify-center py-5 border-r border-gray-100"
                          style={{ backgroundColor: isUpcoming ? '#48c6ed' : '#f9fafb' }}
                        >
                          <span 
                            className="text-2xl font-bold"
                            style={{ color: isUpcoming ? 'white' : '#111827' }}
                          >
                            {event.date.getDate()}
                      </span>
                          <span 
                            className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: isUpcoming ? 'rgba(255,255,255,0.8)' : '#6b7280' }}
                          >
                            {event.date.toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                    </div>

                        {/* Content - Right */}
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              {/* Type badge - minimal */}
                              <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium mb-2">
                                {event.type === 'study' ? 'Étude' :
                                 event.type === 'workshop' ? 'Atelier' :
                                 event.type === 'social' ? 'Social' :
                                 'En ligne'}
                              </span>
                              
                              <h4 className="font-bold text-gray-900 text-base mb-1 truncate">{event.title}</h4>
                              <p className="text-sm text-gray-500 line-clamp-1">{event.description}</p>
                              
                              {/* Meta row */}
                              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1.5">
                                  <Clock size={12} />
                        {event.time}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <MapPin size={12} />
                        {event.location}
                                </span>
                      </div>
                    </div>

                            {/* Right side - Participants & CTA */}
                            <div className="flex flex-col items-end gap-3">
                              {/* Participants */}
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">{event.attendees}</div>
                                <div className="text-xs text-gray-400">/ {event.maxAttendees}</div>
                              </div>
                              
                              {/* CTA Button */}
                              <button 
                                className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{ backgroundColor: '#48c6ed', color: 'white' }}
                              >
                      Participer
                    </button>
                            </div>
                          </div>
                        </div>
                      </div>
                  </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeSubTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 overflow-y-auto"
            >
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Classement</h3>
                <p className="text-gray-500 text-sm">Les membres les plus actifs ce mois-ci</p>
              </div>

              {/* Podium - Top 3 */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {MOCK_MEMBERS.slice(0, 3).map((member, index) => {
                  const positions = [1, 0, 2]; // Order: 2nd, 1st, 3rd for visual
                  const actualIndex = positions[index];
                  const actualMember = MOCK_MEMBERS[actualIndex];
                  const isFirst = actualIndex === 0;
                  
                  return (
                    <motion.div
                      key={actualMember.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-2xl border transition-all text-center ${
                        isFirst ? 'border-gray-900 py-6' : 'border-gray-100 py-5'
                      }`}
                      style={isFirst ? { 
                        transform: 'scale(1.05)', 
                        boxShadow: '0 8px 30px rgba(0,0,0,0.08)' 
                      } : {}}
                    >
                      {/* Rank */}
                      <div 
                        className="w-8 h-8 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold"
                        style={{ 
                          backgroundColor: isFirst ? '#48c6ed' : '#f3f4f6',
                          color: isFirst ? 'white' : '#6b7280'
                        }}
                      >
                        {actualIndex + 1}
                      </div>
                      
                      {/* Avatar */}
                      <div className="relative inline-block mb-3">
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ 
                            backgroundColor: isFirst ? '#111827' : '#e5e7eb',
                            color: isFirst ? 'white' : '#374151'
                          }}
                        >
                          {getInitials(actualMember.name)}
                        </div>
                        {actualMember.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      
                      {/* Name */}
                      <h4 className="font-semibold text-gray-900 text-sm mb-0.5 truncate px-3">
                        {actualMember.name.split(' ')[0]}
                      </h4>
                      
                      {/* Points */}
                      <div 
                        className="text-lg font-bold"
                        style={{ color: isFirst ? '#48c6ed' : '#111827' }}
                      >
                        {actualMember.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">pts</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Rest of the list */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {MOCK_MEMBERS.slice(3).map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors group"
                  >
                    {/* Rank */}
                    <span className="w-6 text-center font-mono text-sm font-medium text-gray-400">
                      {index + 4}
                    </span>

                    {/* Avatar */}
                        <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            {getInitials(member.name)}
                          </div>
                          {member.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-medium">
                              {member.badge}
                            </span>
                          </div>
                      <span className="text-xs text-gray-400">{member.contributions} contributions</span>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                      <span className="font-bold text-gray-900">{member.points.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1">pts</span>
                      </div>

                    {/* Message button */}
                      <button
                        onClick={() => onOpenMessaging(member.id)}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Envoyer un message"
                      >
                      <MessageCircleIcon size={18} />
                      </button>
                  </motion.div>
                ))}
              </div>
              
              {/* Your rank */}
              <div className="mt-4 p-4 bg-gray-900 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: '#48c6ed' }}
                    >
                      YS
                    </div>
                    <div>
                      <span className="font-medium">Ton classement</span>
                      <div className="text-sm text-gray-400">12ème ce mois-ci</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">420</span>
                    <span className="text-sm text-gray-400 ml-1">pts</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

