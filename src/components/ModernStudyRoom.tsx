'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  MessageCircle,
  Volume2,
  VolumeX,
  ThumbsUp,
  Pin,
  X as XIcon,
  Eye,
  Send,
  Maximize2,
  Music,
  BookOpen,
  Edit3,
  Check,
  Heart,
  Sparkles,
  User,
  Users
} from 'lucide-react';
import { AdvancedStudyRoom } from '@/types';

// Type pour les participants enrichis
interface ModernParticipant {
  id: string;
  name: string;
  avatar?: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  currentMusic?: string; // Musique écoutée
  currentCourse?: string; // Cours suivi
  personalMessage?: string; // Message personnalisable
  isBuddy: boolean; // Est-ce un buddy ?
  encouragements: number; // Nombre d'encouragements reçus
  reactions: { emoji: string; count: number }[]; // Réactions reçues
}

// Type pour les messages de chat
interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isPrivate?: boolean;
  targetUserId?: string;
}

interface ModernStudyRoomProps {
  room: AdvancedStudyRoom;
  userId: string;
  userName: string;
  onLeaveRoom: () => void;
}

export function ModernStudyRoom({
  room,
  userId,
  userName,
  onLeaveRoom
}: ModernStudyRoomProps) {
  // États locaux
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("Studying hard! 💪");
  const [newChatMessage, setNewChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedPrivateChat, setSelectedPrivateChat] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0); // Durée de la session en secondes

  // Mock participants avec données enrichies
  const [participants, setParticipants] = useState<ModernParticipant[]>([
    {
      id: 'user-1',
      name: 'Sarah M.',
      isVideoEnabled: true,
      isAudioEnabled: true,
      currentMusic: 'Lo-fi Hip Hop Radio',
      currentCourse: 'Loi de Gauss',
      personalMessage: '"A little bit of plain, ordinary, everyday kindness"',
      isBuddy: true,
      encouragements: 5,
      reactions: [
        { emoji: '👍', count: 3 },
        { emoji: '🔥', count: 2 }
      ]
    },
    {
      id: 'user-2',
      name: 'Alex K.',
      isVideoEnabled: true,
      isAudioEnabled: false,
      currentMusic: 'June - Briston Maroney',
      currentCourse: 'Équilibres Chimiques',
      personalMessage: 'Bring results now darlin\'',
      isBuddy: false,
      encouragements: 3,
      reactions: [
        { emoji: '👍', count: 1 }
      ]
    },
    {
      id: 'user-3',
      name: 'Marie L.',
      isVideoEnabled: true,
      isAudioEnabled: true,
      currentMusic: 'Only Girl (In The World) - Rihanna',
      currentCourse: 'Intégrales',
      personalMessage: 'anki and lots of coffee, final test soon!',
      isBuddy: true,
      encouragements: 8,
      reactions: [
        { emoji: '☕', count: 4 },
        { emoji: '💪', count: 2 }
      ]
    },
    {
      id: 'user-4',
      name: 'Thomas D.',
      isVideoEnabled: true,
      isAudioEnabled: true,
      currentMusic: 'Capriccio italien - Tchaikovsky',
      currentCourse: 'Forces et Mouvement',
      personalMessage: 'The flower that blooms in adversity is the most rare and beautiful of all 🌸',
      isBuddy: false,
      encouragements: 2,
      reactions: []
    }
  ]);

  // Mock messages de chat
  useEffect(() => {
    setChatMessages([
      {
        id: '1',
        userId: 'user-1',
        userName: 'Sarah M.',
        message: 'Goodluck all of you!!',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        userId: 'user-3',
        userName: 'Marie L.',
        message: '"you must keep going, because you deserve to see what happens when all of your hard work pays off"',
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        id: '3',
        userId: 'user-2',
        userName: 'Alex K.',
        message: 'Hey guys! Anyone using Forest and wants to join the same room to focus together, message me!',
        timestamp: new Date(Date.now() - 900000)
      }
    ]);
  }, []);

  // Timer pour la durée de session
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Formater la durée en heures:minutes:secondes
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
    }
    return `${minutes}min ${secs.toString().padStart(2, '0')}s`;
  };

  // Handlers
  const handleEncourage = (participantId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId 
        ? { ...p, encouragements: p.encouragements + 1 }
        : p
    ));
    
    // Notification
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        message: `${userName} encouraged ${participant.name}! 👏`,
        timestamp: new Date()
      }]);
    }
  };

  const handleReaction = (participantId: string, emoji: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === participantId) {
        const existingReaction = p.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...p,
            reactions: p.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...p,
            reactions: [...p.reactions, { emoji, count: 1 }]
          };
        }
      }
      return p;
    }));
  };

  const handleSendMessage = () => {
    if (!newChatMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      userId,
      userName,
      message: newChatMessage,
      timestamp: new Date(),
      isPrivate: selectedPrivateChat !== null,
      targetUserId: selectedPrivateChat || undefined
    };

    setChatMessages(prev => [...prev, newMsg]);
    setNewChatMessage('');
  };

  const handleSavePersonalMessage = () => {
    setEditingMessage(false);
    // En production, on sauvegarderait via API
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Infos principales */}
          <div className="flex items-center gap-6">
            {/* Icône et titre */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{room.title}</h2>
                <p className="text-sm text-gray-600">{room.courseName || 'Loi de Gauss'}</p>
              </div>
            </div>

            {/* Badges de statut */}
            <div className="flex items-center gap-2">
              {/* Type: Interactif ou Silencieux */}
              <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                room.type === 'silent' 
                  ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {room.type === 'silent' ? (
                  <>
                    <VolumeX size={14} />
                    Silencieux
                  </>
                ) : (
                  <>
                    <Mic size={14} />
                    Interactif
                  </>
                )}
              </div>

              {/* Visibilité: Public ou Privé */}
              <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                room.visibility === 'public'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {room.visibility === 'public' ? (
                  <>
                    <Users size={14} />
                    Public
                  </>
                ) : (
                  <>
                    <Users size={14} />
                    Privé
                  </>
                )}
              </div>

              {/* Nombre de participants */}
              <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-1.5">
                <Users size={14} />
                {participants.length} participants
              </div>

              {/* Timer (durée de session) */}
              <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                LIVE • {formatDuration(sessionDuration)}
              </div>
            </div>
          </div>

          {/* Contrôles utilisateur */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-3 rounded-xl transition-all ${
                isAudioEnabled 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300' 
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-300'
              }`}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`p-3 rounded-xl transition-all ${
                isVideoEnabled 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300' 
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-300'
              }`}
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 transition-all relative"
            >
              <MessageCircle size={20} />
              {chatMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full text-xs flex items-center justify-center text-white">
                  {chatMessages.length}
                </span>
              )}
            </button>

            <button
              onClick={onLeaveRoom}
              className="cursor-target px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all flex items-center gap-2 font-semibold"
            >
              <PhoneOff size={18} />
              Quitter
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Grille des participants */}
        <div className={`flex-1 bg-white p-6 overflow-y-auto transition-all ${
          showChat ? 'mr-96' : ''
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
            {participants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                isExpanded={expandedParticipant === participant.id}
                onExpand={() => setExpandedParticipant(
                  expandedParticipant === participant.id ? null : participant.id
                )}
                onEncourage={() => handleEncourage(participant.id)}
                onReaction={(emoji) => handleReaction(participant.id, emoji)}
                onPrivateMessage={() => setSelectedPrivateChat(participant.id)}
              />
            ))}
          </div>
        </div>

        {/* Chat latéral */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="fixed right-0 top-[73px] bottom-0 w-96 bg-white border-l border-gray-200 flex flex-col"
            >
              {/* Header du chat */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">
                    {selectedPrivateChat ? 'Message privé' : 'Chat de groupe'}
                  </h3>
                  {selectedPrivateChat && (
                    <button
                      onClick={() => setSelectedPrivateChat(null)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Retour au groupe
                    </button>
                  )}
                </div>

                {/* Mon message personnel */}
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Mon message</span>
                    {editingMessage ? (
                      <button
                        onClick={handleSavePersonalMessage}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Check size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingMessage(true)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                  </div>
                  {editingMessage ? (
                    <input
                      type="text"
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      className="w-full text-sm bg-white border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{personalMessage}</p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages
                  .filter(msg => !msg.isPrivate || msg.targetUserId === selectedPrivateChat || msg.userId === userId)
                  .map((msg) => (
                    <div key={msg.id} className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0">
                        {getInitials(msg.userName)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">{msg.userName}</span>
                          <span className="text-xs text-gray-500">
                            {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{msg.message}</p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Input message */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={selectedPrivateChat ? "Message privé..." : "Écris un message..."}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm !cursor-text"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="cursor-target px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Composant Card pour chaque participant
interface ParticipantCardProps {
  participant: ModernParticipant;
  isExpanded: boolean;
  onExpand: () => void;
  onEncourage: () => void;
  onReaction: (emoji: string) => void;
  onPrivateMessage: () => void;
}

function ParticipantCard({
  participant,
  isExpanded,
  onExpand,
  onEncourage,
  onReaction,
  onPrivateMessage
}: ParticipantCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const reactions = ['👍', '❤️', '🔥', '💪', '☕', '🎯'];

  return (
    <motion.div
      layout
      className={`relative bg-white rounded-2xl overflow-hidden border-2 shadow-md transition-all ${
        participant.isBuddy ? 'border-yellow-400 shadow-yellow-100' : 'border-gray-200'
      } ${isExpanded ? 'col-span-2 row-span-2' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Badge Buddy */}
      {participant.isBuddy && (
        <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-lg flex items-center gap-1">
          <Heart size={12} />
          Buddy
        </div>
      )}

      {/* Encouragements badge */}
      {participant.encouragements > 0 && (
        <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-1">
          <Sparkles size={12} />
          {participant.encouragements}
        </div>
      )}

      {/* Zone vidéo simulée */}
      <div className={`relative bg-gradient-to-br from-gray-100 to-gray-200 ${isExpanded ? 'h-96' : 'h-48'} flex items-center justify-center`}>
        {participant.isVideoEnabled ? (
          <div className="text-6xl font-bold text-gray-700">
            {participant.name.charAt(0)}
          </div>
        ) : (
          <div className="text-center">
            <VideoOff size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Caméra désactivée</p>
          </div>
        )}

        {/* Audio indicator */}
        {participant.isAudioEnabled && (
          <div className="absolute bottom-2 left-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Mic size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Infos participant */}
      <div className="p-4 space-y-2">
        {/* Nom */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            {participant.name}
            {!participant.isAudioEnabled && <VolumeX size={14} className="text-gray-400" />}
          </h3>
        </div>

        {/* Musique */}
        {participant.currentMusic && (
          <div className="flex items-center gap-2 text-xs">
            <Music size={12} className="text-green-600" />
            <span className="text-gray-600 truncate">{participant.currentMusic}</span>
          </div>
        )}

        {/* Cours */}
        {participant.currentCourse && (
          <div className="flex items-center gap-2 text-xs">
            <BookOpen size={12} className="text-blue-600" />
            <span className="text-gray-600 truncate">{participant.currentCourse}</span>
          </div>
        )}

        {/* Message personnel */}
        {participant.personalMessage && (
          <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
            <p className="text-xs text-gray-700 italic line-clamp-2">{participant.personalMessage}</p>
          </div>
        )}

        {/* Réactions */}
        {participant.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {participant.reactions.map((reaction, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg text-xs flex items-center gap-1">
                {reaction.emoji} <span className="text-gray-700 font-semibold">{reaction.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions au survol */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center"
          >
            <button
              onClick={onEncourage}
              className="cursor-target p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-1 text-xs font-semibold shadow-lg"
            >
              <ThumbsUp size={14} />
              Encourage
            </button>

            <button
              onClick={onPrivateMessage}
              className="cursor-target p-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-all shadow-md"
              title="Message privé"
            >
              <MessageCircle size={14} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="cursor-target p-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-all shadow-md"
                title="Réagir"
              >
                <Sparkles size={14} />
              </button>

              {showReactions && (
                <div className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-2xl p-2 flex gap-1 border border-gray-200">
                  {reactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onReaction(emoji);
                        setShowReactions(false);
                      }}
                      className="cursor-target hover:scale-125 transition-transform text-xl p-1 hover:bg-gray-50 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onExpand}
              className="cursor-target p-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-all shadow-md"
              title="Agrandir"
            >
              <Maximize2 size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

