'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users,
  MessageCircle,
  Video,
  Send,
  UserPlus,
  Clock,
  ChevronRight,
  Search,
  Heart
} from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isMentor?: boolean;
}

interface Member {
  id: string;
  name: string;
  isOnline: boolean;
  isBuddy?: boolean;
}

interface StudyRoom {
  id: string;
  title: string;
  participants: number;
  isLive: boolean;
}

interface TrackCommunityViewProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
}

export function TrackCommunityView({ 
  isOpen, 
  onClose, 
  trackTitle 
}: TrackCommunityViewProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'rooms' | 'members'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', userId: 'mentor-1', userName: 'Zak (Mentor)', message: '👋 Bienvenue ! N\'hésitez pas à poser vos questions.', timestamp: new Date(Date.now() - 86400000), isMentor: true },
    { id: '2', userId: 'user-2', userName: 'Sarah M.', message: 'Quelqu\'un a compris l\'exercice 3 ?', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', userId: 'user-3', userName: 'Alex K.', message: 'Il faut décomposer en fractions partielles.', timestamp: new Date(Date.now() - 3500000) },
    { id: '4', userId: 'mentor-1', userName: 'Zak (Mentor)', message: 'Exactement Alex ! Je vous prépare une vidéo explicative.', timestamp: new Date(Date.now() - 3400000), isMentor: true },
    { id: '5', userId: 'user-4', userName: 'Marie L.', message: 'Merci Zak ! 🙏', timestamp: new Date(Date.now() - 3300000) },
  ]);

  const [members] = useState<Member[]>([
    { id: 'mentor-1', name: 'Zak (Mentor)', isOnline: true },
    { id: 'user-2', name: 'Sarah M.', isOnline: true, isBuddy: true },
    { id: 'user-3', name: 'Alex K.', isOnline: false },
    { id: 'user-4', name: 'Marie L.', isOnline: true },
    { id: 'user-5', name: 'Thomas D.', isOnline: true, isBuddy: true },
  ]);

  const [studyRooms] = useState<StudyRoom[]>([
    { id: 'r1', title: 'Révision Chapitre 3', participants: 5, isLive: true },
    { id: 'r2', title: 'Exercices intégrales', participants: 3, isLive: true },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      userId: 'user-1',
      userName: 'Yassine',
      message: newMessage,
      timestamp: new Date()
    }]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Hier';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const onlineCount = members.filter(m => m.isOnline).length;
  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl overflow-hidden w-full max-w-lg h-[80vh] flex flex-col shadow-xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Social Club</h2>
                  <p className="text-xs text-gray-500">{trackTitle} · {onlineCount} en ligne</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {[
                { id: 'chat', label: 'Discussion', icon: MessageCircle },
                { id: 'rooms', label: 'Study Rooms', icon: Video },
                { id: 'members', label: 'Membres', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {activeTab === 'chat' && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.map((msg) => {
                    const isOwn = msg.userId === 'user-1';
                    return (
                      <div key={msg.id} className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                        {!isOwn && (
                          <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                            msg.isMentor ? 'bg-blue-600' : 'bg-gray-800'
                          }`}>
                            <span className="text-white text-[9px] font-medium">
                              {msg.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                        )}
                        <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
                          {!isOwn && (
                            <p className="text-[10px] font-medium text-gray-500 mb-0.5 flex items-center gap-1">
                              {msg.userName}
                              {msg.isMentor && (
                                <span className="px-1 py-0.5 bg-blue-100 text-blue-600 rounded text-[8px]">Mentor</span>
                              )}
                            </p>
                          )}
                          <div className={`px-3 py-2 rounded-xl text-sm ${
                            isOwn 
                              ? 'bg-gray-900 text-white rounded-br-sm' 
                              : 'bg-white text-gray-800 rounded-bl-sm'
                          }`}>
                            {msg.message}
                          </div>
                          <p className={`text-[9px] text-gray-400 mt-0.5 ${isOwn ? 'text-right' : ''}`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-gray-100 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Écrivez..."
                      className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-gray-900 rounded-lg text-white hover:bg-gray-800 disabled:opacity-30"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'rooms' && (
              <div className="p-4 space-y-3">
                {/* Live rooms */}
                {studyRooms.filter(r => r.isLive).length > 0 && (
                  <>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                      En cours maintenant
                    </p>
                    {studyRooms.filter(r => r.isLive).map((room) => (
                      <div
                        key={room.id}
                        className="p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-green-600 font-medium">LIVE</span>
                          </div>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Users size={10} />
                            {room.participants}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-3">{room.title}</h4>
                        <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                          Rejoindre
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {/* Create room */}
                <button className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Video size={18} />
                    <span className="text-sm font-medium">Créer une Study Room</span>
                  </div>
                </button>
              </div>
            )}

            {activeTab === 'members' && (
              <div className="p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                </div>

                {/* Members list */}
                <div className="space-y-1">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                            <span className="text-white text-[10px] font-medium">
                              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          {member.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                            {member.name}
                            {member.isBuddy && <Heart size={10} className="text-blue-600" fill="currentColor" />}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {member.isOnline ? 'En ligne' : 'Hors ligne'}
                          </p>
                        </div>
                      </div>
                      {!member.isBuddy && member.id !== 'mentor-1' && (
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <UserPlus size={14} className="text-gray-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

