'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Volume2,
  LogOut,
  Search,
  X,
  Send,
  ChevronUp,
  Users,
  MessageCircle,
  Settings,
  Copy,
  Check,
  PenTool,
  Eraser,
  Circle,
  Square,
  Type,
  Minus,
  Trash2,
  Download
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised?: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

interface StudyRoomMeetingProps {
  roomId: string;
  roomTitle: string;
  currentUser: {
    id: string;
    name: string;
  };
  onLeave: () => void;
}

export function StudyRoomMeeting({ 
  roomId, 
  roomTitle,
  currentUser,
  onLeave 
}: StudyRoomMeetingProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showMicOptions, setShowMicOptions] = useState(false);
  const [showVideoOptions, setShowVideoOptions] = useState(false);
  const [showSpeakerOptions, setShowSpeakerOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<'participants' | 'chat' | 'settings'>('participants');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [whiteboardTool, setWhiteboardTool] = useState<'pen' | 'eraser' | 'line' | 'circle' | 'square' | 'text'>('pen');
  const [whiteboardColor, setWhiteboardColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  
  const [participants] = useState<Participant[]>([
    { id: currentUser.id, name: currentUser.name, isMuted: false, isVideoOn: true }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const meetingUrl = `https://app.sciencemadesimple.io/room?id=${roomId}`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        message: message.trim(),
        timestamp: new Date()
      }]);
      setMessage('');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      {/* Sidebar gauche */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/favicon.svg" alt="SMS" className="w-14 h-14" />
          </div>
        </div>

        {/* Tabs de navigation */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex-1 p-3 flex items-center justify-center transition-colors ${
              activeTab === 'participants' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <Users size={18} className={activeTab === 'participants' ? 'text-gray-900' : 'text-gray-400'} />
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 p-3 flex items-center justify-center transition-colors ${
              activeTab === 'chat' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <MessageCircle size={18} className={activeTab === 'chat' ? 'text-gray-900' : 'text-gray-400'} />
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 p-3 flex items-center justify-center transition-colors ${
              activeTab === 'settings' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <Settings size={18} className={activeTab === 'settings' ? 'text-gray-900' : 'text-gray-400'} />
          </button>
        </div>

        {/* Contenu de l'onglet */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'participants' && (
            <>
              {/* Header Présents */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">Présents</span>
                  <span className="w-5 h-5 rounded-full bg-gray-200 text-xs font-medium text-gray-600 flex items-center justify-center">
                    {participants.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <Search size={14} className="text-gray-400" />
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <X size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Liste des participants */}
              <div className="flex-1 overflow-y-auto px-4">
                {participants.map((participant) => (
                  <div 
                    key={participant.id}
                    className="flex items-center justify-between py-3 border-b border-gray-50"
                  >
                    <span className="text-sm font-medium text-gray-900">{participant.name}</span>
                    <div className="flex items-center gap-2">
                      <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
                        {participant.isMuted ? (
                          <MicOff size={14} className="text-gray-400" />
                        ) : (
                          <Mic size={14} className="text-gray-600" />
                        )}
                      </button>
                      <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
                        {participant.isVideoOn ? (
                          <Video size={14} className="text-gray-600" />
                        ) : (
                          <VideoOff size={14} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'chat' && (
            <>
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <span className="text-sm font-medium text-gray-900">Chat</span>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                  <X size={14} className="text-gray-400" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Aucun message pour le moment
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      <span className="font-medium text-gray-900">{msg.senderName}: </span>
                      <span className="text-gray-600">{msg.message}</span>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <div className="p-4">
              <span className="text-sm font-medium text-gray-900">Paramètres</span>
              <p className="text-sm text-gray-400 mt-2">
                Les paramètres audio et vidéo sont disponibles dans la barre de contrôle.
              </p>
            </div>
          )}
        </div>

        {/* Input Chat */}
        {activeTab === 'chat' && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message à tous..."
                className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 text-white disabled:bg-gray-300 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Contenu central - Meeting Info */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Parafina, serif' }}>
              Informations de la room
            </h1>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Room ID:</p>
              <p className="text-lg font-medium text-gray-900">{roomId}</p>
            </div>

            <div className="flex items-center gap-2 p-4 bg-white rounded-xl border border-gray-200">
              <code className="flex-1 text-sm text-gray-600 font-mono truncate">
                {meetingUrl}
              </code>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copié' : 'Copier'}
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-4 text-center">
              Partagez ce lien pour inviter d'autres participants
            </p>
          </div>
        </div>

        {/* Whiteboard Modal */}
        <AnimatePresence>
          {showWhiteboard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-20 flex flex-col"
            >
              {/* Whiteboard Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Parafina, serif' }}>
                  Tableau blanc
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const canvas = canvasRef.current;
                      if (canvas) {
                        const link = document.createElement('a');
                        link.download = 'whiteboard.png';
                        link.href = canvas.toDataURL();
                        link.click();
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Télécharger"
                  >
                    <Download size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => {
                      const canvas = canvasRef.current;
                      const ctx = canvas?.getContext('2d');
                      if (ctx && canvas) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Effacer tout"
                  >
                    <Trash2 size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowWhiteboard(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Whiteboard Toolbar */}
              <div className="flex items-center justify-center gap-2 p-3 border-b border-gray-100 bg-gray-50">
                {/* Tools */}
                <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm">
                  {[
                    { id: 'pen' as const, icon: PenTool, label: 'Crayon' },
                    { id: 'eraser' as const, icon: Eraser, label: 'Gomme' },
                    { id: 'line' as const, icon: Minus, label: 'Ligne' },
                    { id: 'circle' as const, icon: Circle, label: 'Cercle' },
                    { id: 'square' as const, icon: Square, label: 'Rectangle' },
                    { id: 'text' as const, icon: Type, label: 'Texte' },
                  ].map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setWhiteboardTool(tool.id)}
                      className={`p-2.5 rounded-lg transition-colors ${
                        whiteboardTool === tool.id 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title={tool.label}
                    >
                      <tool.icon size={18} />
                    </button>
                  ))}
                </div>

                {/* Colors */}
                <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm">
                  {['#000000', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setWhiteboardColor(color)}
                      className={`w-7 h-7 rounded-lg transition-all ${
                        whiteboardColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  style={{ touchAction: 'none' }}
                  onMouseDown={(e) => {
                    isDrawingRef.current = true;
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (rect) {
                      lastPosRef.current = { 
                        x: e.clientX - rect.left, 
                        y: e.clientY - rect.top 
                      };
                    }
                  }}
                  onMouseMove={(e) => {
                    if (!isDrawingRef.current) return;
                    const canvas = canvasRef.current;
                    const ctx = canvas?.getContext('2d');
                    const rect = canvas?.getBoundingClientRect();
                    if (!ctx || !rect) return;

                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    if (whiteboardTool === 'pen') {
                      ctx.beginPath();
                      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
                      ctx.lineTo(x, y);
                      ctx.strokeStyle = whiteboardColor;
                      ctx.lineWidth = 2;
                      ctx.lineCap = 'round';
                      ctx.stroke();
                    } else if (whiteboardTool === 'eraser') {
                      ctx.beginPath();
                      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
                      ctx.lineTo(x, y);
                      ctx.strokeStyle = '#ffffff';
                      ctx.lineWidth = 20;
                      ctx.lineCap = 'round';
                      ctx.stroke();
                    }

                    lastPosRef.current = { x, y };
                  }}
                  onMouseUp={() => {
                    isDrawingRef.current = false;
                  }}
                  onMouseLeave={() => {
                    isDrawingRef.current = false;
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barre de contrôle en bas */}
        <div className="flex items-center justify-center p-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-2">
            {/* Mute */}
            <div className="relative">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                  isMuted ? 'bg-red-100 text-red-600' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                onClick={() => setShowMicOptions(!showMicOptions)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronUp size={12} className="text-gray-400" />
              </button>
              {showMicOptions && (
                <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                  <p className="px-3 py-1 text-xs text-gray-400">Microphone</p>
                  <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                    Microphone MacBook Air
                  </button>
                </div>
              )}
              <span className="block text-xs text-gray-500 text-center mt-1">Mute</span>
            </div>

            {/* Video */}
            <div className="relative">
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                  !isVideoOn ? 'bg-red-100 text-red-600' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
              </button>
              <button
                onClick={() => setShowVideoOptions(!showVideoOptions)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronUp size={12} className="text-gray-400" />
              </button>
              <span className="block text-xs text-gray-500 text-center mt-1">Video</span>
            </div>

            {/* Content */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Monitor size={18} />
              </button>
              <span className="block text-xs text-gray-500 text-center mt-1">Partager</span>
            </div>

            {/* Whiteboard */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowWhiteboard(true);
                  // Initialize canvas size on open
                  setTimeout(() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const rect = canvas.getBoundingClientRect();
                      canvas.width = rect.width;
                      canvas.height = rect.height;
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                      }
                    }
                  }, 100);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                  showWhiteboard ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={showWhiteboard ? { backgroundColor: '#48c6ed' } : undefined}
              >
                <PenTool size={18} />
              </button>
              <span className="block text-xs text-gray-500 text-center mt-1">Tableau</span>
            </div>

            {/* Speaker */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Volume2 size={18} />
              </button>
              <button
                onClick={() => setShowSpeakerOptions(!showSpeakerOptions)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronUp size={12} className="text-gray-400" />
              </button>
              <span className="block text-xs text-gray-500 text-center mt-1">Audio</span>
            </div>

            {/* Leave */}
            <div className="relative">
              <button
                onClick={onLeave}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
              </button>
              <span className="block text-xs text-gray-500 text-center mt-1">Quitter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

