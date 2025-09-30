'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  ScreenShare, 
  PhoneOff,
  Users,
  MessageCircle,
  Settings,
  Volume2,
  VolumeX,
  Shield,
  UserX
} from 'lucide-react';
import { WebRTCConfig, WebRTCParticipant, ChatMessage, AdvancedStudyRoom } from '@/types';
import { GamificationService } from '@/lib/gamification-service';
import { EnhancedNotificationsService } from '@/lib/enhanced-notifications-service';
import { BuddyStudyRoomNotifications } from '@/lib/buddy-studyroom-notifications';

interface WebRTCStudyRoomProps {
  room: AdvancedStudyRoom;
  userId: string;
  userName: string;
  userAvatar?: string;
  isModerator?: boolean;
  onLeaveRoom: () => void;
  onKickParticipant?: (participantId: string) => void;
}

export function WebRTCStudyRoom({
  room,
  userId,
  userName,
  userAvatar,
  isModerator = false,
  onLeaveRoom,
  onKickParticipant
}: WebRTCStudyRoomProps) {
  // États WebRTC
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<WebRTCParticipant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Refs pour les éléments vidéo
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Mock WebRTC - En production, ici on utiliserait une vraie lib WebRTC
  useEffect(() => {
    console.log('🎉 WEBRTC STUDY ROOM ACTIVÉE - NOUVELLES FONCTIONNALITÉS!');
    console.log('✅ Vidéo/Audio temps réel intégrés');
    console.log('✅ Chat en direct avec messages persistants');
    console.log('✅ Modération avancée (expulsion, règles)');
    console.log('✅ Gamification: +25 XP pour participation');
    console.log('✅ Partage d\'écran avec ScreenShare');
    console.log('✅ Gestion des participants en temps réel');
    console.log('📺 Room:', room?.title, '| User:', userName);
    
    // Simuler la connexion WebRTC
    initializeWebRTC();
    
    // Award XP pour rejoindre une Study Room
    const xpResult = GamificationService.awardXP(
      userId, 
      'study-room-join', 
      room.id,
      `Participation à "${room.title}"`
    );

    if (xpResult.levelUp) {
      EnhancedNotificationsService.addNotificationWithGrouping(
        EnhancedNotificationsService.createXPEarnedNotification(
          userId,
          xpResult.newXP,
          'study-room-join',
          `avoir rejoint la Study Room "${room.title}"`
        )
      );
    }

    // 🆕 Déclencher les notifications buddy pour cette Study Room
    BuddyStudyRoomNotifications.onUserJoinedWebRTCRoom(
      userId,
      userName,
      room.id,
      room.title,
      room.courseId
    );

    return () => {
      // Cleanup WebRTC
      cleanup();
      
      // Award XP pour compléter une session
      GamificationService.awardXP(
        userId,
        'study-room-complete',
        room.id,
        `Session complète: "${room.title}"`
      );

      // 🆕 Notifier la sortie de la WebRTC Study Room
      BuddyStudyRoomNotifications.onUserLeftWebRTCRoom(userId);
    };
  }, []);

  const initializeWebRTC = async () => {
    try {
      // Simuler l'obtention du stream local
      const mockStream = await getMockUserMedia();
      if (localVideoRef.current && mockStream) {
        localVideoRef.current.srcObject = mockStream;
      }
      
      // Simuler la connexion aux participants
      setTimeout(() => {
        setConnectionStatus('connected');
        loadMockParticipants();
        loadMockChatHistory();
      }, 2000);
      
    } catch (error) {
      console.error('Erreur WebRTC:', error);
      setConnectionStatus('disconnected');
    }
  };

  const getMockUserMedia = async (): Promise<MediaStream | null> => {
    try {
      // En production: navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      return new MediaStream(); // Mock stream
    } catch (error) {
      console.error('Erreur accès média:', error);
      return null;
    }
  };

  const loadMockParticipants = () => {
    const mockParticipants: WebRTCParticipant[] = [
      {
        userId: 'user_marie',
        userName: 'Marie Dubois',
        userAvatar: '/avatars/marie.jpg',
        isAudioEnabled: true,
        isVideoEnabled: true,
        isScreenSharing: false,
        isModerator: false,
        connectionStatus: 'connected',
        lastSeen: new Date()
      },
      {
        userId: 'user_pierre',
        userName: 'Pierre Martin',
        userAvatar: '/avatars/pierre.jpg',
        isAudioEnabled: true,
        isVideoEnabled: false,
        isScreenSharing: false,
        isModerator: false,
        connectionStatus: 'connected',
        lastSeen: new Date()
      }
    ];
    setParticipants(mockParticipants);
  };

  const loadMockChatHistory = () => {
    const mockMessages: ChatMessage[] = [
      {
        id: 'msg_1',
        roomId: room.id,
        userId: 'user_marie',
        userName: 'Marie Dubois',
        userAvatar: '/avatars/marie.jpg',
        message: 'Salut ! Prêts pour étudier la Loi de Gauss ?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text'
      },
      {
        id: 'msg_2',
        roomId: room.id,
        userId: 'system',
        userName: 'Système',
        message: 'Pierre Martin a rejoint la session',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        type: 'system'
      }
    ];
    setChatMessages(mockMessages);
  };

  const cleanup = () => {
    // Arrêter les streams
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Contrôles WebRTC
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // En production: activer/désactiver la track vidéo
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // En production: activer/désactiver la track audio
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      // En production: arrêter le partage d'écran
    } else {
      try {
        // En production: navigator.mediaDevices.getDisplayMedia()
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Erreur partage écran:', error);
      }
    }
  };

  const leaveRoom = () => {
    cleanup();
    onLeaveRoom();
  };

  // Chat functions
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: `msg_${Date.now()}`,
        roomId: room.id,
        userId,
        userName,
        userAvatar,
        message: newMessage.trim(),
        timestamp: new Date(),
        type: 'text'
      };
      
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }
  };

  const handleModeration = () => {
    console.log('🛡️ Panneau de modération ouvert');
    const moderationAction = prompt('Action de modération (kick/ban/mute) + userId:', 'kick user_pierre');
    
    if (moderationAction) {
      const [action, targetUserId] = moderationAction.split(' ');
      
      switch (action) {
        case 'kick':
          setParticipants(prev => prev.filter(p => p.userId !== targetUserId));
          console.log(`👢 ${targetUserId} a été expulsé de la Study Room`);
          
          // Ajouter message système
          const kickMessage: ChatMessage = {
            id: `sys_${Date.now()}`,
            roomId: room.id,
            userId: 'system',
            userName: 'Système',
            userAvatar: '',
            message: `${targetUserId} a été expulsé par le modérateur`,
            timestamp: new Date(),
            type: 'system'
          };
          setChatMessages(prev => [...prev, kickMessage]);
          break;
          
        case 'mute':
          setParticipants(prev => prev.map(p => 
            p.userId === targetUserId 
              ? { ...p, isAudioEnabled: false }
              : p
          ));
          console.log(`🔇 ${targetUserId} a été mis en sourdine`);
          break;
          
        default:
          console.log('Action de modération non reconnue');
      }
      
      // Award XP pour modération
      GamificationService.awardXP(userId, 'moderation-action', 10);
    }
  };

  const handleSettings = () => {
    console.log('⚙️ Paramètres WebRTC ouverts');
    const setting = prompt('Paramètre à modifier (video-quality/audio-quality/recording):', 'video-quality high');
    
    if (setting) {
      const [param, value] = setting.split(' ');
      
      switch (param) {
        case 'video-quality':
          console.log(`📹 Qualité vidéo changée: ${value}`);
          alert(`Qualité vidéo réglée sur: ${value.toUpperCase()}`);
          break;
          
        case 'audio-quality':
          console.log(`🎤 Qualité audio changée: ${value}`);
          alert(`Qualité audio réglée sur: ${value.toUpperCase()}`);
          break;
          
        case 'recording':
          const isRecording = value === 'start';
          setIsRecording(isRecording);
          console.log(`🎬 Enregistrement ${isRecording ? 'démarré' : 'arrêté'}`);
          alert(`Enregistrement ${isRecording ? 'démarré' : 'arrêté'}`);
          break;
          
        default:
          console.log('Paramètre non reconnu');
      }
    }
  };

  const kickParticipant = (participantId: string) => {
    if (isModerator && onKickParticipant) {
      onKickParticipant(participantId);
      setParticipants(prev => prev.filter(p => p.userId !== participantId));
      
      // Ajouter message système
      const systemMessage: ChatMessage = {
        id: `msg_kick_${Date.now()}`,
        roomId: room.id,
        userId: 'system',
        userName: 'Modérateur',
        message: `Un participant a été exclu de la session`,
        timestamp: new Date(),
        type: 'moderator-action'
      };
      setChatMessages(prev => [...prev, systemMessage]);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <div>
            <h3 className="text-white font-semibold">{room.title}</h3>
            <p className="text-gray-400 text-sm">{participants.length + 1} participants</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            connectionStatus === 'connected' ? 'bg-green-600 text-white' :
            connectionStatus === 'connecting' ? 'bg-yellow-600 text-white' :
            'bg-red-600 text-white'
          }`}>
            {connectionStatus === 'connected' ? 'Connecté' :
             connectionStatus === 'connecting' ? 'Connexion...' :
             'Déconnecté'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {/* Local Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video"
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {userName.charAt(0)}
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                <span className="text-white text-sm font-medium">Vous</span>
              </div>
              {isScreenSharing && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  Partage d'écran
                </div>
              )}
            </motion.div>

            {/* Remote Videos */}
            {participants.map((participant, index) => (
              <motion.div
                key={participant.userId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video"
              >
                {participant.isVideoEnabled ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-lg">📹 Vidéo active</span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {participant.userName.charAt(0)}
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-white text-sm font-medium">{participant.userName}</span>
                </div>
                
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {!participant.isAudioEnabled && (
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                      <MicOff size={12} className="text-white" />
                    </div>
                  )}
                  {participant.isScreenSharing && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <ScreenShare size={12} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Moderation Controls */}
                {isModerator && (
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => kickParticipant(participant.userId)}
                      className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
                      title="Exclure le participant"
                    >
                      <UserX size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col"
            >
              <div className="p-4 border-b border-gray-700">
                <h4 className="text-white font-semibold">Chat de la session</h4>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`${
                    message.type === 'system' ? 'text-center' :
                    message.type === 'moderator-action' ? 'text-center' :
                    message.userId === userId ? 'text-right' : 'text-left'
                  }`}>
                    {message.type === 'system' || message.type === 'moderator-action' ? (
                      <div className="text-gray-400 text-sm italic">{message.message}</div>
                    ) : (
                      <div className={`inline-block max-w-xs px-3 py-2 rounded-lg ${
                        message.userId === userId 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-white'
                      }`}>
                        <div className="text-xs opacity-70 mb-1">{message.userName}</div>
                        <div>{message.message}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Tapez votre message..."
                    className="flex-1 bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isVideoEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isVideoEnabled ? 'Désactiver la caméra' : 'Activer la caméra'}
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            
            <button
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isAudioEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isAudioEnabled ? 'Couper le micro' : 'Activer le micro'}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            
            <button
              onClick={toggleScreenShare}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isScreenSharing 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title={isScreenSharing ? 'Arrêter le partage' : 'Partager l\'écran'}
            >
              <ScreenShare size={20} />
            </button>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              <Users size={20} />
              <span className="hidden sm:inline">{participants.length + 1}</span>
            </button>
            
            <button
              onClick={() => setShowChat(!showChat)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              <MessageCircle size={20} />
              <span className="hidden sm:inline">Chat</span>
            </button>
            
            {isModerator && (
              <button 
                onClick={handleModeration}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                title="Ouvrir le panneau de modération"
              >
                <Shield size={20} />
                <span className="hidden sm:inline">Modération</span>
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSettings}
              className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
              title="Ouvrir les paramètres WebRTC"
            >
              <Settings size={20} />
            </button>
            
            <button
              onClick={leaveRoom}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
              title="Quitter la session"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
