'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  MessageCircle,
  Volume2,
  VolumeX,
  Monitor,
  ChevronUp,
  ChevronDown,
  Users,
  Send,
  Settings,
  Maximize2,
  Copy,
  Check,
  PenTool,
  Eraser,
  Square,
  Circle,
  Type,
  Undo2,
  Redo2,
  Trash2,
  Download
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isSpeaking?: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface TrackStudyRoomProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
  bundleTitle?: string;
}

export function TrackStudyRoom({ 
  isOpen, 
  onClose, 
  trackId, 
  trackTitle,
  bundleTitle 
}: TrackStudyRoomProps) {
  // États vidéo/audio
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  
  // États UI
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [meetingId] = useState(() => `${trackId.slice(0, 3)}-${Math.random().toString(36).slice(2, 5)}-${Math.random().toString(36).slice(2, 5)}`);
  const [copied, setCopied] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  // États whiteboard
  const [whiteboardTool, setWhiteboardTool] = useState<'pen' | 'eraser' | 'square' | 'circle' | 'text'>('pen');
  const [whiteboardColor, setWhiteboardColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  
  // Chat
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', userId: 'user-2', userName: 'Sarah M.', message: 'Hello everyone! Ready to study? 📚', timestamp: new Date(Date.now() - 300000) },
    { id: '2', userId: 'user-3', userName: 'Alex K.', message: 'Yes! Let\'s go!', timestamp: new Date(Date.now() - 240000) },
  ]);
  
  // Participants mock
  const [participants] = useState<Participant[]>([
    { id: 'user-1', name: 'Yassine ElBekkali', isVideoEnabled: true, isAudioEnabled: true, isSpeaking: true },
    { id: 'user-2', name: 'Sarah M.', avatar: '/avatars/sarah.jpg', isVideoEnabled: true, isAudioEnabled: true },
    { id: 'user-3', name: 'Alex K.', avatar: '/avatars/alex.jpg', isVideoEnabled: true, isAudioEnabled: false },
    { id: 'user-4', name: 'Marie L.', avatar: '/avatars/marie.jpg', isVideoEnabled: false, isAudioEnabled: true },
  ]);

  // Timer de session
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Copy meeting link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://app.sciencemadesimple.io/room?id=${meetingId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      userId: 'user-1',
      userName: 'Yassine ElBekkali',
      message: newMessage,
      timestamp: new Date()
    }]);
    setNewMessage('');
  };

  // Whiteboard drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setIsDrawing(true);
    setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = whiteboardTool === 'eraser' ? '#ffffff' : whiteboardColor;
    ctx.lineWidth = whiteboardTool === 'eraser' ? 20 : 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-gray-900"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-6 z-10">
          {/* Left: Logo + Track Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-white font-semibold hidden sm:block">SMS</span>
            </div>
            <div className="h-6 w-px bg-gray-600" />
            <div>
              <p className="text-white font-medium text-sm">{trackTitle}</p>
              {bundleTitle && (
                <p className="text-gray-400 text-xs">{bundleTitle}</p>
              )}
            </div>
          </div>

          {/* Center: Meeting Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Meeting connected</span>
            </div>
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Right: Close */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Main Content */}
        <div className="pt-16 pb-24 h-full flex">
          {/* Left Sidebar - Participants */}
          <AnimatePresence>
            {showParticipants && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-gray-800/50 border-r border-gray-700 flex flex-col overflow-hidden"
              >
                {/* Participants Header */}
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">Present</span>
                    <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full text-xs font-medium">
                      {participants.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                      <Users size={16} className="text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                      <X size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Participants List */}
                <div className="flex-1 overflow-y-auto p-2">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`flex items-center justify-between p-3 rounded-xl mb-1 ${
                        participant.isSpeaking ? 'bg-cyan-500/10 border border-cyan-500/30' : 'hover:bg-gray-700/50'
                      } transition-all`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`relative w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center ${
                          participant.isSpeaking ? 'ring-2 ring-cyan-500' : ''
                        }`}>
                          <span className="text-white font-medium text-sm">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                          {participant.isSpeaking && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                              <Volume2 size={10} className="text-white" />
                            </div>
                          )}
                        </div>
                        <span className="text-white text-sm font-medium">{participant.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {participant.isAudioEnabled ? (
                          <Mic size={14} className="text-gray-400" />
                        ) : (
                          <MicOff size={14} className="text-red-400" />
                        )}
                        {participant.isVideoEnabled ? (
                          <Video size={14} className="text-gray-400" />
                        ) : (
                          <VideoOff size={14} className="text-red-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Toggle */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Chat</span>
                    <button 
                      onClick={() => setShowChat(!showChat)}
                      className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Video/Whiteboard Area */}
          <div className="flex-1 flex flex-col p-6">
            {showWhiteboard ? (
              /* Whiteboard View */
              <div className="flex-1 bg-white rounded-2xl overflow-hidden relative">
                {/* Whiteboard Toolbar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-xl z-10">
                  <button
                    onClick={() => setWhiteboardTool('pen')}
                    className={`p-2 rounded-lg transition-colors ${whiteboardTool === 'pen' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                  >
                    <PenTool size={18} />
                  </button>
                  <button
                    onClick={() => setWhiteboardTool('eraser')}
                    className={`p-2 rounded-lg transition-colors ${whiteboardTool === 'eraser' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                  >
                    <Eraser size={18} />
                  </button>
                  <button
                    onClick={() => setWhiteboardTool('square')}
                    className={`p-2 rounded-lg transition-colors ${whiteboardTool === 'square' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                  >
                    <Square size={18} />
                  </button>
                  <button
                    onClick={() => setWhiteboardTool('circle')}
                    className={`p-2 rounded-lg transition-colors ${whiteboardTool === 'circle' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                  >
                    <Circle size={18} />
                  </button>
                  <button
                    onClick={() => setWhiteboardTool('text')}
                    className={`p-2 rounded-lg transition-colors ${whiteboardTool === 'text' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                  >
                    <Type size={18} />
                  </button>
                  <div className="w-px h-6 bg-gray-600 mx-2" />
                  <input
                    type="color"
                    value={whiteboardColor}
                    onChange={(e) => setWhiteboardColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer"
                  />
                  <div className="w-px h-6 bg-gray-600 mx-2" />
                  <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors">
                    <Undo2 size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors">
                    <Redo2 size={18} />
                  </button>
                  <button 
                    onClick={clearWhiteboard}
                    className="p-2 text-gray-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors">
                    <Download size={18} />
                  </button>
                </div>
                
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={800}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full cursor-crosshair"
                />
              </div>
            ) : (
              /* Video Grid View */
              <div className="flex-1 grid grid-cols-2 gap-4">
                {participants.slice(0, 4).map((participant, index) => (
                  <div
                    key={participant.id}
                    className={`relative bg-gray-800 rounded-2xl overflow-hidden ${
                      participant.isSpeaking ? 'ring-2 ring-cyan-500' : ''
                    }`}
                  >
                    {participant.isVideoEnabled ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                          <VideoOff size={32} className="text-gray-500" />
                        </div>
                      </div>
                    )}
                    
                    {/* Participant Name Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <span className="text-white text-sm font-medium">{participant.name}</span>
                      {!participant.isAudioEnabled && (
                        <MicOff size={14} className="text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Meeting Info Card */}
            <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-white text-xl font-semibold mb-2">Meeting information</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-400 text-sm">Meeting ID:</span>
                <span className="text-white font-mono">{meetingId}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-700/50 rounded-xl p-3">
                <input
                  type="text"
                  readOnly
                  value={`https://app.sciencemadesimple.io/room?id=${meetingId}`}
                  className="flex-1 bg-transparent text-white font-mono text-sm outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Chat */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-gray-800/50 border-l border-gray-700 flex flex-col overflow-hidden"
              >
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <span className="text-white font-medium">Chat</span>
                  <button 
                    onClick={() => setShowChat(false)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">
                          {msg.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm font-medium">{msg.userName}</span>
                          <span className="text-gray-500 text-xs">
                            {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 bg-gray-700/50 rounded-xl p-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Message all attendees"
                      className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none px-2"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                    >
                      <Send size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 flex items-center justify-center gap-2 px-6">
          {/* Mute */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isAudioEnabled ? <Mic size={20} className="text-white" /> : <MicOff size={20} className="text-white" />}
            </button>
            <span className="text-gray-400 text-xs mt-1">Mute</span>
          </div>

          {/* Video */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isVideoEnabled ? <Video size={20} className="text-white" /> : <VideoOff size={20} className="text-white" />}
            </button>
            <span className="text-gray-400 text-xs mt-1">Video</span>
          </div>

          {/* Content/Whiteboard */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowWhiteboard(!showWhiteboard)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                showWhiteboard ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Monitor size={20} className="text-white" />
            </button>
            <span className="text-gray-400 text-xs mt-1">Content</span>
          </div>

          {/* Speaker */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isSpeakerEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isSpeakerEnabled ? <Volume2 size={20} className="text-white" /> : <VolumeX size={20} className="text-white" />}
            </button>
            <span className="text-gray-400 text-xs mt-1">Speaker</span>
          </div>

          {/* Leave */}
          <div className="flex flex-col items-center ml-4">
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
            >
              <PhoneOff size={20} className="text-white" />
            </button>
            <span className="text-gray-400 text-xs mt-1">Leave</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

