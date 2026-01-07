'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Paperclip, 
  Search,
  Check,
  CheckCheck,
  Users,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isMentor?: boolean;
  replyTo?: {
    userName: string;
    message: string;
  };
}

interface ChatMember {
  id: string;
  name: string;
  isOnline: boolean;
  lastSeen?: Date;
  isMentor?: boolean;
  role?: string;
}

interface TrackChatViewProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
}

export function TrackChatView({ 
  isOpen, 
  onClose, 
  trackTitle 
}: TrackChatViewProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [members] = useState<ChatMember[]>([
    { id: 'mentor-1', name: 'Zak (Mentor)', isOnline: true, isMentor: true, role: 'Mentor Principal' },
    { id: 'user-1', name: 'Yassine ElBekkali', isOnline: true },
    { id: 'user-2', name: 'Sarah M.', isOnline: true },
    { id: 'user-3', name: 'Alex K.', isOnline: false, lastSeen: new Date(Date.now() - 3600000) },
    { id: 'user-4', name: 'Marie L.', isOnline: true },
    { id: 'user-5', name: 'Thomas D.', isOnline: false, lastSeen: new Date(Date.now() - 7200000) },
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'mentor-1',
      userName: 'Zak (Mentor)',
      message: '👋 Bienvenue dans le groupe du cours ! N\'hésitez pas à poser vos questions ici.',
      timestamp: new Date(Date.now() - 86400000),
      isRead: true,
      isMentor: true
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'Sarah M.',
      message: 'Salut tout le monde ! Quelqu\'un a compris l\'exercice 3 sur les intégrales ?',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true
    },
    {
      id: '3',
      userId: 'user-3',
      userName: 'Alex K.',
      message: 'Oui ! En fait il faut d\'abord décomposer en fractions partielles.',
      timestamp: new Date(Date.now() - 3500000),
      isRead: true,
      replyTo: {
        userName: 'Sarah M.',
        message: 'Quelqu\'un a compris l\'exercice 3...'
      }
    },
    {
      id: '4',
      userId: 'mentor-1',
      userName: 'Zak (Mentor)',
      message: 'Exactement Alex ! Je vous ai préparé une vidéo explicative pour cet exercice, elle sera disponible demain 📹',
      timestamp: new Date(Date.now() - 3400000),
      isRead: true,
      isMentor: true
    },
    {
      id: '5',
      userId: 'user-4',
      userName: 'Marie L.',
      message: 'Trop bien merci Zak ! 🙏',
      timestamp: new Date(Date.now() - 3300000),
      isRead: true
    },
    {
      id: '6',
      userId: 'user-2',
      userName: 'Sarah M.',
      message: 'Qui est dispo pour une session study room ce soir vers 20h ?',
      timestamp: new Date(Date.now() - 1800000),
      isRead: true
    },
    {
      id: '7',
      userId: 'user-5',
      userName: 'Thomas D.',
      message: 'Moi je suis partant ! 🙋‍♂️',
      timestamp: new Date(Date.now() - 1700000),
      isRead: true
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      userId: 'user-1',
      userName: 'Yassine ElBekkali',
      message: newMessage,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const onlineCount = members.filter(m => m.isOnline).length;

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
          className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl h-[80vh] flex shadow-xl"
        >
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header - Minimal */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{trackTitle}</h2>
                  <p className="text-xs text-gray-500">{members.length} membres · {onlineCount} en ligne</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Search size={18} className="text-gray-500" />
                </button>
                <button 
                  onClick={() => setShowMembers(!showMembers)}
                  className={`p-2 rounded-lg transition-colors ${showMembers ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <Users size={18} />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Messages - Clean */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg, index) => {
                const isOwn = msg.userId === 'user-1';
                const showAvatar = index === 0 || messages[index - 1].userId !== msg.userId;
                
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    {showAvatar && !isOwn ? (
                      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                        msg.isMentor ? 'bg-blue-600' : 'bg-gray-800'
                      }`}>
                        <span className="text-white text-[10px] font-medium">
                          {msg.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    ) : !isOwn ? (
                      <div className="w-7" />
                    ) : null}

                    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                      {msg.replyTo && (
                        <div className={`mb-1 px-3 py-1.5 rounded-lg border-l-2 ${
                          isOwn ? 'bg-gray-100 border-gray-400' : 'bg-white border-gray-300'
                        }`}>
                          <p className="text-[10px] font-medium text-gray-500">{msg.replyTo.userName}</p>
                          <p className="text-[10px] text-gray-400 truncate">{msg.replyTo.message}</p>
                        </div>
                      )}

                      {showAvatar && !isOwn && (
                        <p className="text-[10px] font-medium mb-1 text-gray-500">
                          {msg.userName}
                          {msg.isMentor && (
                            <span className="ml-1.5 px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[9px]">
                              Mentor
                            </span>
                          )}
                        </p>
                      )}

                      <div className={`px-4 py-2.5 rounded-2xl ${
                        isOwn 
                          ? 'bg-gray-900 text-white rounded-br-sm' 
                          : msg.isMentor
                            ? 'bg-white text-gray-800 border border-blue-100 rounded-bl-sm'
                            : 'bg-white text-gray-800 rounded-bl-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>

                      <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                        <span className="text-[10px] text-gray-400">{formatTime(msg.timestamp)}</span>
                        {isOwn && (
                          <CheckCheck size={12} className={msg.isRead ? 'text-blue-500' : 'text-gray-400'} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input - Minimal */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip size={18} className="text-gray-400" />
                </button>
                
                <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Écrivez votre message..."
                    className="flex-1 py-2.5 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm"
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-gray-900 rounded-xl text-white hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Members Sidebar - Minimal */}
          <AnimatePresence>
            {showMembers && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-gray-100 bg-white flex flex-col overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900 text-sm">Membres</h3>
                  <p className="text-xs text-gray-500">{members.length} participants</p>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  <div className="px-2 py-2">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                      En ligne — {onlineCount}
                    </p>
                    {members.filter(m => m.isOnline).map((member) => (
                      <button
                        key={member.id}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            member.isMentor ? 'bg-blue-600' : 'bg-gray-800'
                          }`}>
                            <span className="text-white text-[10px] font-medium">
                              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-xs font-medium text-gray-900">{member.name}</p>
                          {member.role && (
                            <p className="text-[10px] text-blue-600">{member.role}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="px-2 py-2 mt-2">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                      Hors ligne
                    </p>
                    {members.filter(m => !m.isOnline).map((member) => (
                      <button
                        key={member.id}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors opacity-50"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 text-[10px] font-medium">
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-xs font-medium text-gray-600">{member.name}</p>
                          {member.lastSeen && (
                            <p className="text-[10px] text-gray-400">
                              Vu il y a {Math.round((Date.now() - member.lastSeen.getTime()) / 3600000)}h
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
