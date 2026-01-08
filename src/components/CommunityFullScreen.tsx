'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  MessageCircle,
  Video,
  Users,
  Send,
  Crown,
  Trophy,
  Menu,
  X,
  Calendar,
  BookOpen,
  Plus,
  ChevronRight,
  Play,
  Clock,
  MessageSquare,
  UserPlus,
  ChevronLeft,
  Zap,
  Volume2,
  VolumeX,
  Flag,
  Award,
  CheckCircle,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Copy,
  Check,
  Eye,
  Sparkles
} from 'lucide-react';
import { BuddyInviteModal } from './BuddyInviteModal';
import { CompetitionLeaderboard } from './CompetitionLeaderboard';
import { CreateStudyRoomModal, StudyRoomFormData } from './CreateStudyRoomModal';

// === PETITS COMPOSANTS RÉUTILISABLES ===

// Chips de présence (en ligne / lecteurs)
function PresenceChips({ onlineCount, readersCount }: { onlineCount: number; readersCount: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full font-medium" style={{ fontSize: '14px' }}>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        {onlineCount} en ligne
      </span>
      {readersCount > 0 && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full font-medium" style={{ fontSize: '14px' }}>
          <Eye size={14} />
          {readersCount} lisent
        </span>
      )}
    </div>
  );
}

// Message système (entre les messages)
function SystemMessage({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center py-3">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs">
        {icon}
        {text}
      </span>
    </div>
  );
}

// Quick prompts cliquables
function QuickPromptChips({ onSelect }: { onSelect: (text: string) => void }) {
  const prompts = [
    { label: "Un exercice bloquant ?", template: "Je bloque sur … (où exactement ?)" },
    { label: "Besoin d'aide ?", template: "Quelqu'un peut m'expliquer … ?" },
  ];
  
  return (
    <div className="flex gap-2 mb-3 flex-wrap">
      {prompts.map((prompt) => (
        <button 
          key={prompt.label}
          onClick={() => onSelect(prompt.template)}
          className="px-3.5 py-2 bg-gray-100 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-200 hover:border-gray-300 transition-colors text-sm font-medium"
        >
          {prompt.label}
        </button>
      ))}
    </div>
  );
}

// Mini avatars en ligne
function MiniAvatarRow({ users, max = 4 }: { users: { id: string; name: string; initial: string }[]; max?: number }) {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;
  
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-2">
        {displayUsers.map((user) => (
          <div 
            key={user.id} 
            className="w-7 h-7 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-600 font-semibold text-xs"
            title={user.name}
          >
            {user.initial}
          </div>
        ))}
        {remaining > 0 && (
          <div className="w-7 h-7 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-gray-500 font-medium text-xs">
            +{remaining}
          </div>
        )}
      </div>
    </div>
  );
}

interface CommunityFullScreenProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle: string;
  trackId: string;
  initialTab?: 'discussion' | 'rooms' | 'members' | 'competitions';
  embedded?: boolean; // If true, renders inline without modal wrapper
  skipIntro?: boolean; // If true, skips the onboarding screen
  onBack?: () => void; // Callback for the back button in embedded mode
}

type ViewMode = 'hub' | 'discussion' | 'rooms' | 'members' | 'competitions';

interface Message {
  id: string;
  author: string;
  authorInitials: string;
  isMentor: boolean;
  content: string;
  timestamp: string;
}

interface StudyRoom {
  id: string;
  name: string;
  host: string;
  hostRole?: string;
  participants: number;
  isLive: boolean;
  isComplement?: boolean;
  isInteractive?: boolean;
  isSilent?: boolean;
  isRecommended?: boolean;
  status: 'live' | 'scheduled' | 'ended';
  scheduledDate?: Date;
  scheduledTime?: string;
  duration?: string;
  hasReplay?: boolean;
  buddies?: { id: string; name: string; initial: string }[];
}

interface Member {
  id: string;
  name: string;
  initials: string;
  isMentor: boolean;
  isOnline: boolean;
  xp: number;
  faculty?: string;
  level?: 'advanced' | 'new' | 'regular';
}

// Mock data
const MESSAGES: Message[] = [
  { id: '1', author: 'Zak', authorInitials: 'Z', isMentor: true, content: 'Bienvenue ! N\'hésitez pas à poser vos questions. 🎓', timestamp: '14:30' },
  { id: '2', author: 'Sarah M.', authorInitials: 'SM', isMentor: false, content: 'Différence ondes transversales / longitudinales ?', timestamp: '14:45' },
  { id: '3', author: 'Zak', authorInitials: 'Z', isMentor: true, content: 'Transversales = perpendiculaires à la propagation.', timestamp: '14:48' },
  { id: '4', author: 'Thomas D.', authorInitials: 'TD', isMentor: false, content: 'Merci, c\'est plus clair !', timestamp: '14:52' },
];

// Les rooms seront générées dynamiquement avec le titre du track
const createMockRooms = (trackTitle: string): StudyRoom[] => [
  // Session Compléments LIVE avec buddies - Recommandée
  { id: '1', name: 'Session Compléments', host: 'Zak', hostRole: 'Fondateur', participants: 6, isLive: true, isComplement: true, isInteractive: true, isRecommended: true, status: 'live', duration: '17 min', buddies: [{ id: 'b1', name: 'Sarah', initial: 'S' }, { id: 'b2', name: 'Marc', initial: 'M' }, { id: 'b3', name: 'Léa', initial: 'L' }] },
  // Session Interactive LIVE avec buddies
  { id: '2', name: 'Session Interactive', host: 'Marie Dubois', participants: 4, isLive: true, isInteractive: true, status: 'live', duration: '31 min', buddies: [{ id: 'b4', name: 'Pierre', initial: 'P' }, { id: 'b5', name: 'Emma', initial: 'E' }] },
  // Session Silencieuse LIVE avec buddy
  { id: '3', name: 'Session Silencieuse', host: 'Thomas Bernard', participants: 3, isLive: true, isSilent: true, status: 'live', duration: '12 min', buddies: [{ id: 'b6', name: 'Lucas', initial: 'L' }] },
  // Session avec Replay
  { id: '4', name: 'Révision Chapitre 2', host: 'Zak', hostRole: 'Fondateur', participants: 0, isLive: false, isComplement: true, isInteractive: true, status: 'ended', hasReplay: true },
  // Sessions programmées
  { id: '5', name: 'Session Compléments', host: 'Zak', hostRole: 'Fondateur', participants: 2, isLive: false, isComplement: true, isInteractive: true, status: 'scheduled', scheduledDate: new Date(Date.now() + 86400000), scheduledTime: 'sam. 3' },
  { id: '6', name: 'Exercices Pratiques', host: 'Sophie Laurent', participants: 0, isLive: false, isInteractive: true, status: 'scheduled', scheduledDate: new Date(Date.now() + 86400000 * 2), scheduledTime: 'dim. 4' },
  { id: '7', name: 'Révision Silencieuse', host: 'Lucas Petit', participants: 1, isLive: false, isSilent: true, status: 'scheduled', scheduledDate: new Date(Date.now() + 86400000 * 3), scheduledTime: 'lun. 5', buddies: [{ id: 'b7', name: 'Julie', initial: 'J' }] },
  // Sessions terminées
  { id: '8', name: 'Q&A Session', host: 'Alex Durand', participants: 0, isLive: false, isInteractive: true, status: 'ended' },
  { id: '9', name: 'Focus Study', host: 'Emma Martin', participants: 0, isLive: false, isSilent: true, status: 'ended' },
  { id: '10', name: 'Recap Leçon 3', host: 'Julie Moreau', participants: 0, isLive: false, isComplement: true, status: 'ended', hasReplay: true },
];

const MEMBERS: Member[] = [
  { id: '1', name: 'Zak', initials: 'Z', isMentor: true, isOnline: true, xp: 5000, faculty: 'Fondateur' },
  { id: '2', name: 'Sarah M.', initials: 'SM', isMentor: false, isOnline: true, xp: 1200, faculty: 'Polytechnique', level: 'advanced' },
  { id: '3', name: 'Thomas D.', initials: 'TD', isMentor: false, isOnline: true, xp: 800, faculty: 'ENS' },
  { id: '4', name: 'Emma R.', initials: 'ER', isMentor: false, isOnline: true, xp: 650, faculty: 'CentraleSupélec' },
  { id: '5', name: 'Lucas P.', initials: 'LP', isMentor: false, isOnline: true, xp: 450, faculty: 'Mines' },
  { id: '6', name: 'Marie L.', initials: 'ML', isMentor: false, isOnline: false, xp: 1500, faculty: 'Sorbonne', level: 'advanced' },
  { id: '7', name: 'Alex K.', initials: 'AK', isMentor: false, isOnline: false, xp: 100, faculty: 'HEC', level: 'new' },
  { id: '8', name: 'Julie M.', initials: 'JM', isMentor: false, isOnline: false, xp: 50, faculty: 'ESSEC', level: 'new' },
];

// Helper pour membres en avatars simples
const getMemberAvatars = (members: Member[]) => 
  members.map(m => ({ id: m.id, name: m.name, initial: m.initials[0] }));

// Composant StudyRoomCard - Identique aux cartes de AdvancedStudyRoomsTab
function StudyRoomCard({ room }: { room: StudyRoom }) {
  // Logique des boutons : on est dans le learning track donc pas de "Débloquer cours"
  const getButtonConfig = () => {
    if (room.status === 'ended' && room.hasReplay) {
      return { label: 'Voir le replay', icon: Play, className: 'bg-purple-600 text-white hover:bg-purple-700' };
    }
    if (room.status === 'scheduled') {
      return { label: "S'inscrire", icon: Calendar, className: 'bg-amber-500 text-white hover:bg-amber-600' };
    }
    // Live ou autre → Rejoindre
    return { label: 'Rejoindre', icon: Play, className: 'bg-gray-900 text-white hover:bg-gray-800' };
  };

  const buttonConfig = getButtonConfig();
  const ButtonIcon = buttonConfig.icon;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
      {/* Badges - Type de room + LIVE rouge si en cours */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Badge LIVE rouge en premier si la room est en cours */}
        {room.status === 'live' && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-white rounded-md text-xs font-bold animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full" />
            LIVE
          </span>
        )}
        {/* Badge Compléments (session par Zak) */}
        {room.isComplement && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-semibold">
            <Crown size={12} />
            Compléments
          </span>
        )}
        {/* Badge type: Silencieuse ou Interactive */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
          {room.isSilent ? <VolumeX size={12} /> : <Volume2 size={12} />}
          {room.isSilent ? 'Silencieuse' : 'Interactive'}
        </span>
        {/* Badge Programmée si applicable */}
        {room.status === 'scheduled' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
            <Calendar size={12} />
            Programmée
          </span>
        )}
        {/* Badge Terminée si applicable */}
        {room.status === 'ended' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs font-medium">
            Terminée
          </span>
        )}
      </div>

      {/* Type de session lisible - GRAND */}
      <h4 className="text-base font-bold text-gray-900 mb-3">
        {room.isComplement ? 'Session Compléments' : room.isSilent ? 'Session Silencieuse' : 'Session Interactive'}
      </h4>

      {/* Participants + Buddies */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Users size={14} className="text-gray-400" />
          <span className="text-gray-600">{room.participants} participant{room.participants !== 1 ? 's' : ''}</span>
        </div>
        {room.buddies && room.buddies.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1.5">
              {room.buddies.slice(0, 3).map((buddy) => (
                <div key={buddy.id} className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold" title={buddy.name}>
                  {buddy.initial}
                </div>
              ))}
            </div>
            <span className="text-xs font-medium text-orange-600">{room.buddies.length}</span>
          </div>
        )}
      </div>

      {/* Date block pour sessions programmées */}
      {room.status === 'scheduled' && room.scheduledDate && (
        <div className="mb-3 flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0">
            <span className="text-[10px] font-medium uppercase">{room.scheduledDate.toLocaleDateString('fr-FR', { month: 'short' })}</span>
            <span className="text-sm font-bold leading-none">{room.scheduledDate.getDate()}</span>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900 capitalize">{room.scheduledDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} />{room.scheduledDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      )}

      {/* Actions - Toujours Rejoindre/S'inscrire/Voir le replay (pas de Débloquer) */}
      <div className="flex items-center gap-2">
        <button className={`flex-1 px-5 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors ${buttonConfig.className}`}>
          <ButtonIcon size={14} />
          {buttonConfig.label}
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Flag size={14} />
        </button>
      </div>
    </div>
  );
}

// Navigation - EXACTEMENT comme SimpleDashboard
const NAV_ITEMS = [
  { id: 'courses', label: 'Mes cours', icon: BookOpen },
  { id: 'planning', label: 'Planification', icon: Calendar },
  { id: 'study-rooms', label: 'Study Rooms', icon: Video },
  { id: 'community', label: 'Social Club', icon: Users },
  { id: 'training', label: 'Training Club', icon: Trophy },
];

export function CommunityFullScreen({ 
  isOpen, 
  onClose, 
  trackTitle,
  initialTab = 'discussion',
  embedded = false,
  skipIntro = false,
  onBack,
}: CommunityFullScreenProps) {
  const [view, setView] = useState<ViewMode>('hub');
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [hasIntroduced, setHasIntroduced] = useState(skipIntro);
  const [introMessage, setIntroMessage] = useState(`Salut 👋 Je commence ${trackTitle} !`);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fonction pour copier le lien d'invitation
  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://sms.app/invite/${trackTitle.toLowerCase().replace(/\s+/g, '-')}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  
  // Fonction pour pré-remplir le message avec un prompt
  const handleQuickPrompt = (template: string) => {
    setNewMessage(template);
  };

  const mockCourses = [{ id: '1', title: trackTitle, description: '', lessons: [], thumbnail: '', duration: '' }];
  
  // Rooms contextuelles au learning track
  const ROOMS = useMemo(() => createMockRooms(trackTitle), [trackTitle]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (isOpen || embedded) {
      // In embedded mode with skipIntro, keep hasIntroduced true
      if (!skipIntro) {
        setHasIntroduced(false);
      }
      setIntroMessage(`Salut 👋 Je commence ${trackTitle} !`);
      setView(initialTab === 'competitions' ? 'competitions' : 'hub');
      if (initialTab === 'competitions' || skipIntro) setHasIntroduced(true);
    }
  }, [isOpen, trackTitle, initialTab, embedded, skipIntro]);

  const sendIntro = () => {
    if (!introMessage.trim()) return;
    setMessages(prev => [...prev, { id: `${Date.now()}`, author: 'Vous', authorInitials: 'Y', isMentor: false, content: introMessage, timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]);
    setHasIntroduced(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: `${Date.now() + 1}`, author: 'Zak', authorInitials: 'Z', isMentor: true, content: 'Bienvenue ! 🎉', timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { id: `${Date.now()}`, author: 'Vous', authorInitials: 'Y', isMentor: false, content: newMessage, timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMessage('');
  };

  if (!isOpen && !embedded) return null;

  const onlineCount = MEMBERS.filter(m => m.isOnline).length;
  const mentor = MEMBERS.find(m => m.isMentor);

  // === MODE EMBEDDED: Rendu inline sans wrapper modal ===
  if (embedded) {
    return (
      <div className="h-full flex flex-col overflow-hidden relative">
        {/* Header contextuel avec bouton Retour */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 pt-16 pb-4 md:pt-20 md:pb-5 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Retour</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'var(--font-parafina)', fontSize: 'clamp(24px, 5vw, 40px)' }}>
              Social Club
              <span className="text-[#00c2ff] ml-3">• {trackTitle}</span>
            </h1>
          </div>
        </div>
        
        {/* === ONBOARDING - Écran de bienvenue communauté === */}
        {!hasIntroduced && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 max-w-2xl w-full shadow-sm">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users size={32} className="text-gray-700" />
                </div>
                <h2 className="font-bold text-gray-900 mb-4" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                  Bienvenue dans la communauté {trackTitle} 👋
                </h2>
                <p className="text-gray-600" style={{ fontSize: '16px' }}>
                  Ici, chaque question trouve une réponse. Tu avances avec d'autres étudiants, au même moment que toi.
                </p>
              </div>

              {/* Avantages */}
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <MessageCircle size={20} className="text-gray-500" />
                  <span className="text-gray-700">Poser tes questions à la communauté</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <Video size={20} className="text-gray-500" />
                  <span className="text-gray-700">Rejoindre des Study Rooms en direct</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <span className="text-xl">🤝</span>
                  <span className="text-gray-700">Avancer avec des étudiants de ton niveau</span>
                </div>
              </div>

              {/* Message d'intro */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Ton premier message à la communauté</label>
                <input 
                  value={introMessage} 
                  onChange={(e) => setIntroMessage(e.target.value)}
                  placeholder={`Salut 👋 je commence ${trackTitle} !`}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white" 
                  style={{ fontSize: '16px' }}
                />
              </div>
              
              <button 
                onClick={sendIntro} 
                className="w-full py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                style={{ fontSize: '18px' }}
              >
                Commencer à apprendre ensemble
              </button>
              
              <p className="text-center text-gray-400 mt-3" style={{ fontSize: '14px' }}>
                Tu pourras modifier ou supprimer ton message à tout moment.
              </p>
            </div>
          </motion.div>
        )}

        {/* Contenu principal - Grille 2 colonnes (affiché après onboarding) */}
        {hasIntroduced && (
        <div className="flex-1 min-h-0 overflow-hidden py-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full grid lg:grid-cols-[1fr_380px] gap-4 px-4 md:px-6">
            
            {/* COLONNE GAUCHE - QUESTIONS & ENTRAIDE */}
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-full">
              <div className="p-5 border-b border-gray-200 flex-shrink-0 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <MessageCircle size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900" style={{ fontSize: '28px' }}>{trackTitle}</h3>
                      <PresenceChips onlineCount={onlineCount} readersCount={2} />
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 bg-[#00c2ff] text-white font-semibold rounded-full" style={{ fontSize: '14px' }}>
                    {messages.length > 5 ? messages.length - 5 : 3} nouveaux
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.author === 'Vous' ? 'justify-end' : ''}`}>
                    {msg.author !== 'Vous' && (
                      <div className={`w-11 h-11 ${msg.isMentor ? 'bg-blue-600' : 'bg-gray-200'} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className={`font-semibold ${msg.isMentor ? 'text-white' : 'text-gray-600'}`} style={{ fontSize: '15px' }}>{msg.authorInitials}</span>
                      </div>
                    )}
                    <div className={msg.author === 'Vous' ? 'flex flex-col items-end' : ''}>
                      <div className="flex items-center gap-2 mb-1.5">
                        {msg.author === 'Vous' && <span className="text-gray-400" style={{ fontSize: '16px' }}>{msg.timestamp}</span>}
                        <span className="font-semibold text-gray-900" style={{ fontSize: '16px' }}>{msg.author}</span>
                        {msg.isMentor && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded" style={{ fontSize: '13px' }}>Fondateur</span>}
                        {msg.author !== 'Vous' && <span className="text-gray-400" style={{ fontSize: '16px' }}>{msg.timestamp}</span>}
                      </div>
                      <div className={`rounded-2xl px-5 py-3 ${msg.author === 'Vous' ? 'bg-[#00c2ff] text-white' : 'bg-white text-gray-900 shadow-sm border border-gray-100'}`}>
                        <p style={{ fontSize: '16px' }}>{msg.content}</p>
                      </div>
                    </div>
                    {msg.author === 'Vous' && (
                      <div className="w-11 h-11 bg-[#00c2ff] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-white" style={{ fontSize: '15px' }}>Y</span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600"><Paperclip size={20} /></button>
                  <button className="p-2 text-gray-400 hover:text-gray-600"><ImageIcon size={20} /></button>
                  <button className="p-2 text-gray-400 hover:text-gray-600"><Mic size={20} /></button>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Pose ta question ou aide un autre étudiant..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00c2ff]/20"
                  />
                  <button onClick={sendMessage} className="p-2.5 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* COLONNE DROITE - STUDY ROOMS */}
            <div className="space-y-5 overflow-y-auto h-full">
              {/* Bouton Inviter - même fond que Study Rooms */}
              <button 
                onClick={() => setShowInviteModal(true)}
                className="w-full px-5 py-4 bg-[#1a1a1a] text-white rounded-2xl font-semibold hover:bg-[#252525] transition-all flex items-center justify-center gap-2"
                style={{ fontSize: '18px' }}
              >
                <UserPlus size={22} />
                Inviter un ami
              </button>
              
              {/* Study Rooms - DARK MODE */}
              <div className="bg-[#1a1a1a] rounded-2xl p-5">
                {/* Header avec titre + subtitle */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold" style={{ fontSize: '20px', color: '#FFFFFF' }}>Study Rooms</h3>
                  <button 
                    onClick={() => setShowCreateRoomModal(true)} 
                    className="text-[#00c2ff] hover:text-[#00b0e8] font-medium flex items-center gap-1.5 flex-shrink-0"
                    style={{ fontSize: '14px' }}
                  >
                    <Plus size={16} />
                    Créer une room
                  </button>
                </div>
                <p className="mb-5" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)' }}>
                  Rejoins une room live ou programme ta prochaine session.
                </p>
                
                <div className="space-y-4">
                  {ROOMS.map((room) => (
                    <div key={room.id} className={`p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors ${!room.isLive ? 'opacity-80' : ''}`}>
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {room.isLive ? (
                          <span className="px-3 py-1 bg-red-500 text-white font-bold rounded flex items-center gap-1.5" style={{ fontSize: '12px' }}>
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            LIVE
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-white/10 text-white/60 font-medium rounded" style={{ fontSize: '12px' }}>
                            {room.scheduledTime}
                          </span>
                        )}
                        {room.isRecommended && <span className="text-amber-400 font-medium" style={{ fontSize: '13px' }}>★ Recommandée</span>}
                      </div>
                      
                      {/* Titre de la session */}
                      <h4 className="font-semibold mb-2" style={{ fontSize: '17px', color: '#FFFFFF' }}>{room.name}</h4>
                      
                      {/* Meta info */}
                      <p className="mb-4" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)' }}>
                        {room.isLive 
                          ? `Démarrée il y a ${room.duration || '5 min'} · ${room.host}`
                          : room.scheduledTime 
                            ? `${room.scheduledTime} · ${room.host}`
                            : room.hasReplay 
                              ? `Replay disponible · ${room.host}`
                              : `Terminée · ${room.host}`
                        }
                      </p>
                      
                      {room.isLive ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex -space-x-2">
                              {Array.from({ length: Math.min(room.participants, 3) }).map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-7 h-7 bg-gradient-to-br from-white/20 to-white/10 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center font-semibold text-white/70"
                                  style={{ fontSize: '11px' }}
                                >
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                              {room.participants > 3 && (
                                <div 
                                  className="w-7 h-7 bg-white/10 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center font-medium text-white/50"
                                  style={{ fontSize: '11px' }}
                                >
                                  +{room.participants - 3}
                                </div>
                              )}
                            </div>
                            <span className="text-white/60 font-medium" style={{ fontSize: '14px' }}>{room.participants} dedans</span>
                          </div>
                          <button 
                            className="px-5 py-2.5 bg-[#00c2ff] text-white font-semibold rounded-full hover:bg-[#00b0e8] transition-colors"
                            style={{ fontSize: '14px' }}
                          >
                            Rejoindre
                          </button>
                        </div>
                      ) : room.hasReplay ? (
                        <div className="flex justify-end mt-2">
                          <button 
                            className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 flex items-center gap-2 transition-colors"
                            style={{ fontSize: '14px' }}
                          >
                            <Play size={16} />
                            Replay
                          </button>
                        </div>
                      ) : room.scheduledTime ? (
                        <div className="flex justify-end mt-2">
                          <button 
                            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-full transition-colors flex items-center gap-2"
                            style={{ fontSize: '14px' }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                            Rappel
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        )}
        
        {/* Modals */}
        <BuddyInviteModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />
        <CreateStudyRoomModal 
          isOpen={showCreateRoomModal} 
          onClose={() => setShowCreateRoomModal(false)} 
          courses={[{ id: '1', title: trackTitle, description: '', lessons: [], thumbnail: '', duration: '' }]} 
          onCreateRoom={(data: StudyRoomFormData) => { console.log('Create room:', data); setShowCreateRoomModal(false); }}
        />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-gray-50" onClick={(e) => e.stopPropagation()}>
        
        {/* === HEADER - Identique au dashboard === */}
        <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
          <div className="px-4 md:px-6">
            <div className="flex items-center justify-between h-[72px] md:h-[85px]">
              {/* Left - Logo */}
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors lg:hidden">
                  <Menu size={20} />
                </button>
                <div className="relative h-[55px] w-[120px] md:h-[85px] md:w-[340px]">
                  <Image src="/brand/sms-logo2.svg" alt="Science Made Simple" fill className="object-contain object-left" />
                </div>
              </div>

              {/* Center - XP + Social */}
              <div className="hidden md:flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
                {/* Widget XP */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                  <span className="text-sm text-gray-600">Niveau 1</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-sm font-semibold text-gray-900">0 XP</span>
                </div>
                {/* Buddies */}
                <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                  <Users size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                </button>
              </div>

              {/* Right - Timer + Inviter + Débloquer + Avatar */}
              <div className="flex items-center gap-3">
                {/* Timer */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
                  <Clock size={18} className="text-gray-600" />
                  <span className="text-base font-semibold text-gray-900 tabular-nums">00:00:00</span>
                </div>

                {/* Bouton Inviter */}
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors text-sm">
                  <Users size={16} />
                  <span>Inviter</span>
                </button>

                {/* Débloquer CTA */}
                <button className="hidden md:block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors text-sm">
                  Débloquer
                </button>

                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">Y</div>
              </div>
            </div>
          </div>
        </header>

        {/* === SIDEBAR Desktop - Identique au dashboard === */}
        <nav className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col fixed left-0 top-[85px] h-[calc(100vh-85px)] z-30">
          <div className="p-6">
            <div className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === 'community';
                return (
                  <button key={item.id}
                    onClick={() => { 
                      if (item.id === 'whatsapp') window.open('https://wa.me/33123456789', '_blank');
                      else if (!isActive) onClose();
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      item.id === 'whatsapp' ? 'bg-green-500 text-white hover:bg-green-600'
                        : isActive ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mastery Boosters */}
          <div className="mt-auto border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-6 py-5 hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Plus size={18} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Mastery Boosters</p>
                <p className="text-xs text-gray-500 truncate">Booste ton apprentissage</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </nav>

        {/* === MAIN CONTENT === */}
        <main className="md:ml-64 pt-[72px] md:pt-[85px] h-screen overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 lg:px-8 py-4 flex-1 flex flex-col overflow-hidden">
            
            {/* Titre de la page */}
            <div className="mb-4 flex-shrink-0">
              <h1 className="font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'var(--font-parafina)', fontSize: '56px' }}>Social Club</h1>
            </div>

            {/* === INTRO - Écran de bienvenue communauté === */}
            {!hasIntroduced && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-10 md:p-14 max-w-2xl w-full shadow-sm">
                  {/* Header */}
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Users size={32} className="text-gray-700" />
                    </div>
                    <h2 className="font-bold text-gray-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
                      Bienvenue dans la communauté Ondes mécaniques 👋
                    </h2>
                    <p className="text-gray-500 leading-relaxed" style={{ fontSize: '18px' }}>
                      Ici, chaque question trouve une réponse. Tu avances avec d'autres étudiants, au même moment que toi.
                    </p>
                  </div>

                  {/* Projection - Ce que tu peux faire */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-xl">💬</span>
                        <span className="text-gray-700" style={{ fontSize: '16px' }}>Poser tes questions à la communauté</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl">🎥</span>
                        <span className="text-gray-700" style={{ fontSize: '16px' }}>Rejoindre des Study Rooms en direct</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl">🤝</span>
                        <span className="text-gray-700" style={{ fontSize: '16px' }}>Avancer avec des étudiants de ton niveau</span>
                      </div>
                    </div>
                  </div>

                  {/* Zone de message */}
                  <div className="space-y-5">
                    <div>
                      <label className="block font-medium text-gray-700 mb-3" style={{ fontSize: '15px' }}>Ton premier message à la communauté</label>
                      <input 
                        value={introMessage} 
                        onChange={(e) => setIntroMessage(e.target.value)}
                        placeholder={`Salut 👋 je commence le parcours ${trackTitle} !`}
                        className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white" 
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    
                    <button 
                      onClick={sendIntro} 
                      className="w-full py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                      style={{ fontSize: '18px' }}
                    >
                      Commencer à apprendre ensemble
                    </button>
                    
                    {/* Micro-réassurance */}
                    <p className="text-center text-gray-400" style={{ fontSize: '14px' }}>Tu pourras modifier ou supprimer ton message à tout moment.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* === HUB 2 COLONNES === */}
            {hasIntroduced && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 grid lg:grid-cols-[1fr_380px] gap-6 min-h-0">
                
                {/* COLONNE GAUCHE - QUESTIONS & ENTRAIDE (~60-65%) */}
                <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-400px)]">
                  <div className="p-5 border-b border-gray-200 flex-shrink-0 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <MessageCircle size={24} className="text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900" style={{ fontSize: '28px' }}>{trackTitle}</h3>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-[#00c2ff] text-white font-semibold rounded-full flex-shrink-0" style={{ fontSize: '14px' }}>3 nouveaux</span>
                    </div>
                    {/* Présence - texte simple */}
                    <p className="text-gray-500 mt-1" style={{ fontSize: '14px' }}>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-gray-600 font-medium">{onlineCount} en ligne</span>
                      </span>
                      <span className="mx-2 text-gray-300">·</span>
                      <span className="text-gray-600">3 buddies dans ce groupe</span>
                    </p>
                  </div>
                  
                  {/* Liste des messages - Plus d'espace et de respiration */}
                  <div 
                    className="flex-1 p-5 space-y-5 overflow-y-auto"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundColor: '#fafafa'
                    }}
                  >
                    {messages.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                        <MessageCircle size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-2" style={{ fontSize: '18px' }}>Pose ta première question au groupe.</p>
                        <p className="text-gray-400" style={{ fontSize: '14px' }}>Les autres étudiants et le mentor pourront t'aider.</p>
                      </div>
                    ) : (
                      <>
                        {/* System message en haut */}
                        <SystemMessage 
                          text="🔥 Discussion active aujourd'hui" 
                        />
                        
                        {messages.map((msg, index) => (
                          <React.Fragment key={msg.id}>
                            <div className={`flex gap-3 ${msg.author === 'Vous' ? 'flex-row-reverse' : ''}`}>
                              {/* Avatar */}
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-semibold ${
                                msg.isMentor ? 'bg-blue-600 text-white' : msg.author === 'Vous' ? 'bg-[#00c2ff] text-white' : 'bg-gray-200 text-gray-600'
                              }`} style={{ fontSize: '15px' }}>
                                {msg.authorInitials}
                              </div>
                              
                              {/* Message bubble */}
                              <div className={`max-w-[75%] ${msg.author === 'Vous' ? 'items-end' : ''}`}>
                                <div className={`flex items-center gap-2 mb-1.5 ${msg.author === 'Vous' ? 'justify-end' : ''}`}>
                                  <span className="font-semibold text-gray-900" style={{ fontSize: '16px' }}>{msg.author}</span>
                                  {msg.isMentor && (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-medium rounded-md border border-gray-200" style={{ fontSize: '13px' }}>
                                      Fondateur
                                    </span>
                                  )}
                                  <span className="text-gray-400" style={{ fontSize: '16px' }}>{msg.timestamp}</span>
                                </div>
                                <div className={`px-5 py-3.5 rounded-2xl leading-relaxed ${
                                  msg.author === 'Vous' 
                                    ? 'bg-[#00c2ff] text-white rounded-tr-md' 
                                    : 'bg-white text-gray-900 rounded-tl-md shadow-sm border border-gray-100'
                                }`} style={{ fontSize: '16px' }}>
                                  {msg.content}
                                </div>
                              </div>
                            </div>
                            
                            {/* System message après quelques messages */}
                            {index === 1 && (
                              <SystemMessage 
                                text="👋 2 étudiants ont rejoint le track cette semaine"
                              />
                            )}
                          </React.Fragment>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>
                  
                  {/* Zone d'input - Plus riche */}
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
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Pose ta question ou aide un autre étudiant..." 
                        className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm" 
                      />
                      <button 
                        onClick={sendMessage} 
                        disabled={!newMessage.trim()} 
                        className={`p-3 rounded-xl transition-colors ${newMessage.trim() ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400'}`}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                    
                  </div>
                </div>

                {/* COLONNE DROITE - INVITE + STUDY ROOMS (~35-40%) */}
                <div className="flex flex-col gap-4 min-h-0">

                  {/* INVITER UN AMI - Même fond que Study Rooms */}
                  <button 
                    onClick={() => setShowInviteModal(true)} 
                    className="w-full py-4 bg-[#1a1a1a] hover:bg-[#252525] text-white rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                    style={{ fontSize: '18px' }}
                  >
                    <UserPlus size={22} />
                    Inviter un ami
                  </button>
                  
                  {/* STUDY ROOMS - Liste verticale - DARK MODE */}
                  <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col flex-1">
                    <div className="p-6 border-b border-white/10 flex-shrink-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold" style={{ fontSize: '22px', color: '#FFFFFF' }}>Study Rooms</h3>
                        </div>
                        <button 
                          onClick={() => setShowCreateRoomModal(true)} 
                          className="text-[#00c2ff] hover:text-[#00b0e8] font-medium transition-colors flex items-center gap-1.5 flex-shrink-0"
                          style={{ fontSize: '15px' }}
                        >
                          <Plus size={18} />
                          Créer une room
                        </button>
                      </div>
                      <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)' }}>
                        Rejoins une room live ou programme ta prochaine session.
                      </p>
                    </div>
                    
                    {/* Liste des rooms (1 colonne) */}
                    <div className="flex-1 p-5 overflow-y-auto">
                      {ROOMS.filter(r => r.status === 'live' || r.status === 'scheduled' || (r.status === 'ended' && r.hasReplay)).length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                          <Video size={48} className="text-white/30 mb-4" />
                          <p className="text-white/50 mb-4" style={{ fontSize: '15px' }}>Aucune room en cours.</p>
                          <button 
                            onClick={() => setShowCreateRoomModal(true)} 
                            className="px-6 py-3 bg-[#00c2ff] text-white rounded-full font-semibold hover:bg-[#00b0e8] transition-colors"
                            style={{ fontSize: '15px' }}
                          >
                            Créer une room
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-5">
                          {/* Tri: LIVE d'abord, puis scheduled bientôt, puis scheduled, puis replay - max 4 items */}
                          {[...ROOMS]
                            .sort((a, b) => {
                              // LIVE first
                              if (a.status === 'live' && b.status !== 'live') return -1;
                              if (b.status === 'live' && a.status !== 'live') return 1;
                              // Then scheduled soon (< 60min)
                              const now = Date.now();
                              const aIsSoon = a.scheduledDate && (a.scheduledDate.getTime() - now < 60 * 60 * 1000);
                              const bIsSoon = b.scheduledDate && (b.scheduledDate.getTime() - now < 60 * 60 * 1000);
                              if (aIsSoon && !bIsSoon) return -1;
                              if (bIsSoon && !aIsSoon) return 1;
                              // Then scheduled
                              if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
                              if (b.status === 'scheduled' && a.status !== 'scheduled') return 1;
                              // Then replay
                              return 0;
                            })
                            .filter(r => r.status === 'live' || r.status === 'scheduled' || (r.status === 'ended' && r.hasReplay))
                            .slice(0, 4)
                            .map((room, index) => {
                              const isRecommended = index === 0 && room.status === 'live';
                              const isSoon = room.scheduledDate && (room.scheduledDate.getTime() - Date.now() < 60 * 60 * 1000);
                              
                              return (
                                <div 
                                  key={room.id} 
                                  className={`bg-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors ${
                                    isRecommended ? 'ring-1 ring-red-500/30 bg-red-500/10' : ''
                                  }`}
                                >
                                  {/* Header: Badges */}
                                  <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                                    {room.status === 'live' && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded font-bold" style={{ fontSize: '13px' }}>
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        LIVE
                                      </span>
                                    )}
                                    {room.status === 'ended' && room.hasReplay && (
                                      <span className="inline-flex items-center px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded font-medium" style={{ fontSize: '13px' }}>
                                        Replay
                                      </span>
                                    )}
                                    {room.status === 'scheduled' && isSoon && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded font-medium" style={{ fontSize: '13px' }}>
                                        <Clock size={14} />
                                        Commence bientôt
                                      </span>
                                    )}
                                    {room.status === 'scheduled' && !isSoon && (
                                      <span className="inline-flex items-center px-3 py-1.5 bg-white/10 text-white/60 rounded font-medium" style={{ fontSize: '13px' }}>
                                        {room.scheduledDate?.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                                      </span>
                                    )}
                                    {isRecommended && (
                                      <span className="text-amber-400 font-medium" style={{ fontSize: '14px' }}>★ Recommandée</span>
                                    )}
                                  </div>

                                  {/* Titre du type de session */}
                                  <h4 className="font-semibold mb-2" style={{ fontSize: '18px', color: '#FFFFFF' }}>
                                    {room.isComplement ? 'Session Compléments' : room.isSilent ? 'Session Silencieuse' : 'Session Interactive'}
                                  </h4>

                                  {/* Meta info */}
                                  <p className="mb-4" style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)' }}>
                                    {room.status === 'live' && `Démarrée il y a ${Math.floor(Math.random() * 30) + 5} min`}
                                    {room.status === 'scheduled' && room.scheduledDate && `${room.scheduledDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                                    {room.status === 'ended' && 'Session terminée'}
                                    {room.hostRole === 'Fondateur' && ' · Avec Zak (mentor)'}
                                  </p>

                                  {/* Participants + Buddies */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {room.participants > 0 && (
                                        <>
                                          <div className="flex -space-x-2">
                                            {Array.from({ length: Math.min(room.participants, 3) }).map((_, i) => (
                                              <div 
                                                key={i} 
                                                className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center font-semibold text-white/70"
                                                style={{ fontSize: '12px' }}
                                              >
                                                {String.fromCharCode(65 + i)}
                                              </div>
                                            ))}
                                            {room.participants > 3 && (
                                              <div className="w-8 h-8 bg-white/10 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center font-medium text-white/50" style={{ fontSize: '12px' }}>
                                                +{room.participants - 3}
                                              </div>
                                            )}
                                          </div>
                                          <div style={{ fontSize: '15px' }}>
                                            <span className="text-white/70 font-medium">{room.participants} dedans</span>
                                            {room.buddies && room.buddies.length > 0 && (
                                              <span className="text-amber-400 ml-2">· {room.buddies.length} buddy{room.buddies.length > 1 ? 's' : ''}</span>
                                            )}
                                          </div>
                                        </>
                                      )}
                                      {room.participants === 0 && room.status !== 'ended' && (
                                        <span className="text-white/40" style={{ fontSize: '15px' }}>Sois le premier à rejoindre</span>
                                      )}
                                    </div>

                                    {/* CTA */}
                                    <button 
                                      className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                                        room.status === 'ended' && room.hasReplay 
                                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                                          : room.status === 'scheduled' 
                                          ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                                          : 'bg-[#00c2ff] text-white hover:bg-[#00b0e8]'
                                      }`}
                                      style={{ fontSize: '15px' }}
                                    >
                                      {room.status === 'ended' && room.hasReplay 
                                        ? 'Replay' 
                                        : room.status === 'scheduled' 
                                        ? "S'inscrire" 
                                        : 'Rejoindre'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </div>
        </main>

        {/* === SIDEBAR Mobile === */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
              <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 md:hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-8 w-32 relative"><Image src="/brand/sms-text-logo.svg" alt="SMS" fill className="object-contain object-left" /></div>
                    <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
                  </div>
                  <div className="space-y-2">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.id === 'community';
                      return (
                        <button key={item.id} onClick={() => { if (item.id === 'whatsapp') window.open('https://wa.me/33123456789', '_blank'); else if (!isActive) onClose(); setSidebarOpen(false); }}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${item.id === 'whatsapp' ? 'bg-green-500 text-white' : isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                          <Icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODALS */}
        <BuddyInviteModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} userId="current_user" />
        <CreateStudyRoomModal isOpen={showCreateRoomModal} onClose={() => setShowCreateRoomModal(false)} onCreateRoom={() => setShowCreateRoomModal(false)}
          userCourses={mockCourses} preSelectedCourseId="1" preSelectedCourseName={trackTitle} defaultTitlePrefix={trackTitle} hideBackdrop />
      </motion.div>
    </AnimatePresence>
  );
}
