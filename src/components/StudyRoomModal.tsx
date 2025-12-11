import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  MessageCircle, 
  Send, 
  Settings,
  Monitor,
  Phone,
  PhoneOff,
  MoreVertical,
  Volume2,
  VolumeX
} from 'lucide-react';
import { CourseStudyRoom, StudyRoomMessage, AdvancedStudyRoom } from '@/types';
import { WebRTCStudyRoom } from './WebRTCStudyRoom';
import { ModernStudyRoom } from './ModernStudyRoom';

interface StudyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: CourseStudyRoom | null;
  currentUserId: string;
}

export function StudyRoomModal({ isOpen, onClose, room, currentUserId }: StudyRoomModalProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [useWebRTC, setUseWebRTC] = useState(false);
  const [useModernRoom, setUseModernRoom] = useState(true); // Utiliser ModernStudyRoom par défaut
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<StudyRoomMessage[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Simuler des messages existants
  useEffect(() => {
    if (room && messages.length === 0) {
      setMessages([
        {
          id: '1',
          participantId: 'marie-l',
          participantName: 'Marie Leclerc',
          message: 'Salut tout le monde ! Prêts pour réviser les suites ?',
          timestamp: new Date(Date.now() - 300000),
          type: 'text'
        },
        {
          id: '2',
          participantId: 'system',
          participantName: 'Système',
          message: `${room.createdByName} a démarré la session d'étude`,
          timestamp: new Date(Date.now() - 180000),
          type: 'system'
        },
        {
          id: '3',
          participantId: 'alex-m',
          participantName: 'Alex Martin',
          message: 'Oui ! J\'ai quelques questions sur les limites',
          timestamp: new Date(Date.now() - 120000),
          type: 'text'
        }
      ]);
    }
  }, [room, messages.length]);

  // Auto-scroll du chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && room) {
      const newMessage: StudyRoomMessage = {
        id: Date.now().toString(),
        participantId: currentUserId,
        participantName: 'Vous',
        message: message.trim(),
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      messageInputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!room) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Video className="text-green-600" size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{room.name}</h2>
                  <p className="text-sm text-gray-500">
                    {room.courseName} • {room.currentUsers.length}/{room.maxUsers} participants
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseWebRTC(!useWebRTC)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    useWebRTC ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {useWebRTC ? '📹 WebRTC ON' : '🚀 WebRTC OFF'}
                </button>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  ACTIF
                </span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Contenu principal */}
            {useModernRoom ? (
              // Vue Modern Study Room (nouvelle)
              <ModernStudyRoom
                room={{
                  id: room.id,
                  courseId: room.courseName,
                  courseName: room.courseName,
                  title: room.name,
                  type: room.type || 'interactive',
                  visibility: 'public',
                  status: 'live',
                  createdBy: currentUserId,
                  creatorName: 'Vous',
                  createdAt: new Date(),
                  startsAt: new Date(),
                  currentParticipants: [],
                  invitedUsers: [],
                  tags: [],
                  isRecorded: false,
                  replayAddedToCourse: false,
                  abusiveReports: [],
                  moderationRules: ['Respecter les autres participants', 'Pas de contenu inapproprié'],
                  xpReward: 25,
                  buddyCount: 0,
                  hasActiveBuddies: false
                } as AdvancedStudyRoom}
                userId={currentUserId}
                userName="Yassine"
                onLeaveRoom={onClose}
              />
            ) : useWebRTC ? (
              // Vue WebRTC complète
              <WebRTCStudyRoom
                room={{
                  id: room.id,
                  courseId: room.courseName,
                  courseName: room.courseName,
                  title: room.name,
                  type: 'interactive',
                  visibility: 'public',
                  status: 'live',
                  createdBy: currentUserId,
                  creatorName: 'Vous',
                  createdAt: new Date(),
                  startsAt: new Date(),
                  currentParticipants: [],
                  invitedUsers: [],
                  tags: [],
                  isRecorded: false,
                  replayAddedToCourse: false,
                  abusiveReports: [],
                  moderationRules: ['Respecter les autres participants', 'Pas de contenu inapproprié'],
                  xpReward: 25,
                  buddyCount: 0,
                  hasActiveBuddies: false
                } as AdvancedStudyRoom}
                userId={currentUserId}
                userName="Étudiant"
                isModerator={true}
                onLeaveRoom={() => setUseWebRTC(false)}
              />
            ) : (
              // Vue existante
              <div className="flex h-[calc(90vh-80px)]">
              {/* Zone vidéo */}
              <div className="flex-1 bg-gray-900 relative">
                {/* Vidéo principale */}
                <div className="absolute inset-4 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-gray-400">Interface vidéo en développement</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Intégration WebRTC prévue
                    </p>
                  </div>
                </div>

                {/* Grille des participants */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {room.currentUsers.slice(0, 4).map((user, index) => {
                    if (!user || !user.id) return null;
                    
                    return (
                      <div 
                        key={user.id}
                        className="w-20 h-16 bg-gray-700 rounded-lg flex items-center justify-center relative"
                      >
                        <div className="text-white text-sm font-medium">
                          {user.firstName ? user.firstName.substring(0, 2).toUpperCase() : (user.id ? user.id.substring(0, 2).toUpperCase() : '??')}
                        </div>
                        {index === 0 && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                            <Mic size={8} className="text-white ml-0.5 mt-0.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Contrôles vidéo */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2">
                  <button
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isAudioOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {isAudioOn ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>
                  
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isVideoOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
                  </button>

                  <button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isSpeakerOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {isSpeakerOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>

                  <div className="w-px h-6 bg-gray-600"></div>

                  <button className="w-10 h-10 rounded-full bg-gray-700 text-white hover:bg-gray-600 flex items-center justify-center transition-colors">
                    <Monitor size={18} />
                  </button>

                  <button className="w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-colors">
                    <PhoneOff size={18} />
                  </button>
                </div>
              </div>

              {/* Panneau latéral */}
              {showChat && (
                <div className="w-80 border-l border-gray-200 flex flex-col">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200">
                    <button className="flex-1 py-3 px-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                      <MessageCircle size={16} className="inline mr-2" />
                      Chat
                    </button>
                    <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                      <Users size={16} className="inline mr-2" />
                      Participants
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`${msg.type === 'system' ? 'text-center' : ''}`}>
                        {msg.type === 'system' ? (
                          <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">
                            {msg.message}
                          </div>
                        ) : (
                          <div className={`${msg.participantId === currentUserId ? 'ml-8' : 'mr-8'}`}>
                            <div className={`p-3 rounded-lg ${
                              msg.participantId === currentUserId 
                                ? 'bg-blue-500 text-white ml-auto' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              {msg.participantId !== currentUserId && (
                                <div className="text-xs font-medium mb-1 opacity-70">
                                  {msg.participantName}
                                </div>
                              )}
                              <div className="text-sm">{msg.message}</div>
                              <div className={`text-xs mt-1 opacity-70 ${
                                msg.participantId === currentUserId ? 'text-right' : 'text-left'
                              }`}>
                                {formatTime(msg.timestamp)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input de message */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        ref={messageInputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
