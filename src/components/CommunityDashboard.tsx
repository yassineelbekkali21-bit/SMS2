'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Search, Users, MessageCircle, Clock, 
  ChevronRight, ChevronLeft, BookOpen, Video,
  Plus, Target, ArrowRight, Menu, X,
  Calendar, MessageSquare, Settings, HelpCircle,
  Upload, Play, Gift, TrendingUp,
  Radio, Swords, Trophy, Flame, Bell, Zap,
  CheckCircle, Circle, Activity, Heart
} from 'lucide-react';

// Navigation Items
const navigationItems = [
  { id: 'dashboard', label: 'Cockpit', icon: Target, hasAccess: true },
  { id: 'tracks', label: 'Mes Tracks', icon: BookOpen, hasAccess: true },
  { id: 'study-rooms', label: 'Study Rooms', icon: Video, hasAccess: true },
  { id: 'community', label: 'Communauté', icon: Users, hasAccess: true },
  { id: 'planning', label: 'Planification', icon: Calendar, hasAccess: true },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, hasAccess: true, isWhatsApp: true },
];

// Mock Data
const mockLearningTracks = [
  { id: '1', name: 'Électromagnétisme', progress: 67, membersOnline: 156, newMessages: 12, nextStep: 'Quiz 3 — Loi de Gauss', studyRoomTonight: true, studyRoomTime: '19:00' },
  { id: '2', name: 'Analyse II — Intégrales', progress: 45, membersOnline: 89, newMessages: 5, nextStep: 'Exo type 2 — Paramétrage', studyRoomTonight: false },
  { id: '3', name: 'Chimie Organique', progress: 23, membersOnline: 67, newMessages: 3, nextStep: 'Leçon 4 — Mécanismes SN1/SN2', studyRoomTonight: true, studyRoomTime: '20:30' },
];

const mockStudyRooms = [
  { id: '1', name: 'Électrostatique — QCM', isLive: true, participants: 34, host: 'Communauté', objective: '15 QCM type exam' },
  { id: '2', name: 'Intégrales curvilignes', isLive: true, participants: 28, host: 'Mentor Zak', objective: 'Paramétrage' },
  { id: '3', name: 'Chimie Orga — SN1/SN2', isLive: false, startsIn: '1h30', participants: 12, host: 'Communauté', objective: 'Révisions' },
  { id: '4', name: 'Thermodynamique', isLive: false, startsIn: '3h', participants: 8, host: 'Communauté', objective: 'Exercices' },
];

const mockActivities = [
  { id: '1', user: 'Sana', action: 'a partagé un exercice', track: 'Intégrales', time: '2 min', type: 'share' },
  { id: '2', user: 'Nassim', action: 'a trouvé une astuce', track: 'Gauss', time: '5 min', type: 'tip' },
  { id: '3', user: 'Mentor Zak', action: 'a répondu à une question', track: 'Électromagnétisme', time: '8 min', type: 'answer' },
  { id: '4', user: 'Marie', action: 'a créé une room', track: 'Thermo', time: '12 min', type: 'room' },
];

const mockChallenges = [
  { id: '1', title: 'Défi du week-end', description: 'Complète 5 quiz', progress: 60, reward: '+100 XP', deadline: '2j' },
  { id: '2', title: 'Streak Master', description: '7 jours consécutifs', progress: 85, reward: 'Badge Streak', deadline: '1j' },
];

const mockBuddies = [
  { id: '1', name: 'Thomas', initials: 'TB', isOnline: true, activity: 'Study Room: Probabilités', xpToday: 200 },
  { id: '2', name: 'Sophie', initials: 'SM', isOnline: true, activity: 'Quiz en cours', xpToday: 150 },
  { id: '3', name: 'Emma', initials: 'EL', isOnline: false, lastSeen: '2h', xpToday: 80 },
];

const mockInvitations = [
  { id: '1', from: 'Emma', initials: 'EL', type: 'study-room', title: 'Study Room: Probabilités', time: 'Dans 5 min' },
  { id: '2', from: 'Thomas', initials: 'TB', type: 'battle', title: 'Défi 1v1 — Électro', time: 'Maintenant' },
];

// Domaines d'exploration avec leurs cours associés
const masteryPrograms = [
  { 
    id: 'physique', 
    name: 'Physique', 
    icon: Zap, 
    activeUsers: 1245, 
    messagesPerMin: 32, 
    roomsLive: 3,
    courses: [
      { id: 'phy-1', title: 'Mécanique du point', lessons: 12, duration: '4h30', progress: 65 },
      { id: 'phy-2', title: 'Électrostatique', lessons: 10, duration: '3h45', progress: 35 },
      { id: 'phy-3', title: 'Magnétostatique', lessons: 8, duration: '3h', progress: 0 },
      { id: 'phy-4', title: 'Thermodynamique', lessons: 12, duration: '5h', progress: 15 },
      { id: 'phy-5', title: 'Ondes mécaniques', lessons: 10, duration: '4h', progress: 0 },
      { id: 'phy-6', title: 'Optique géométrique', lessons: 8, duration: '3h', progress: 0 },
    ]
  },
  { 
    id: 'chimie', 
    name: 'Chimie', 
    icon: Activity, 
    activeUsers: 892, 
    messagesPerMin: 24, 
    roomsLive: 2,
    courses: [
      { id: 'chim-1', title: 'Chimie générale', lessons: 10, duration: '4h', progress: 100 },
      { id: 'chim-2', title: 'Chimie organique I', lessons: 12, duration: '5h', progress: 45 },
      { id: 'chim-3', title: 'Chimie organique II', lessons: 12, duration: '5h', progress: 0 },
      { id: 'chim-4', title: 'Chimie analytique', lessons: 8, duration: '3h', progress: 0 },
      { id: 'chim-5', title: 'Thermochimie', lessons: 10, duration: '4h', progress: 0 },
    ]
  },
  { 
    id: 'mathematiques', 
    name: 'Mathématiques', 
    icon: TrendingUp, 
    activeUsers: 1567, 
    messagesPerMin: 28, 
    roomsLive: 2,
    courses: [
      { id: 'math-1', title: 'Analyse I', lessons: 15, duration: '6h', progress: 72 },
      { id: 'math-2', title: 'Analyse II', lessons: 15, duration: '6h', progress: 28 },
      { id: 'math-3', title: 'Algèbre linéaire', lessons: 14, duration: '5h30', progress: 0 },
      { id: 'math-4', title: 'Équations différentielles', lessons: 12, duration: '5h', progress: 0 },
      { id: 'math-5', title: 'Intégrales multiples', lessons: 10, duration: '4h', progress: 0 },
    ]
  },
  { 
    id: 'statistiques', 
    name: 'Statistiques', 
    icon: Target, 
    activeUsers: 534, 
    messagesPerMin: 12, 
    roomsLive: 1,
    courses: [
      { id: 'stat-1', title: 'Statistiques descriptives', lessons: 8, duration: '3h', progress: 50 },
      { id: 'stat-2', title: 'Probabilités', lessons: 10, duration: '4h', progress: 0 },
      { id: 'stat-3', title: 'Lois de probabilité', lessons: 10, duration: '4h', progress: 0 },
      { id: 'stat-4', title: 'Estimation', lessons: 8, duration: '3h30', progress: 0 },
      { id: 'stat-5', title: 'Tests d\'hypothèses', lessons: 10, duration: '4h', progress: 0 },
    ]
  },
  { 
    id: 'informatique', 
    name: 'Informatique', 
    icon: Circle, 
    activeUsers: 756, 
    messagesPerMin: 18, 
    roomsLive: 1,
    courses: [
      { id: 'info-1', title: 'Python - Les bases', lessons: 12, duration: '4h30', progress: 85 },
      { id: 'info-2', title: 'Algorithmique', lessons: 14, duration: '5h30', progress: 40 },
      { id: 'info-3', title: 'Structures de données', lessons: 10, duration: '4h', progress: 0 },
      { id: 'info-4', title: 'Bases de données', lessons: 10, duration: '4h', progress: 0 },
      { id: 'info-5', title: 'Programmation orientée objet', lessons: 12, duration: '5h', progress: 0 },
    ]
  },
  { 
    id: 'economie', 
    name: 'Économie', 
    icon: Flame, 
    activeUsers: 423, 
    messagesPerMin: 9, 
    roomsLive: 0,
    courses: [
      { id: 'eco-1', title: 'Microéconomie', lessons: 12, duration: '5h', progress: 30 },
      { id: 'eco-2', title: 'Macroéconomie', lessons: 12, duration: '5h', progress: 0 },
      { id: 'eco-3', title: 'Économétrie', lessons: 10, duration: '4h', progress: 0 },
      { id: 'eco-4', title: 'Finance d\'entreprise', lessons: 10, duration: '4h', progress: 0 },
    ]
  },
  { 
    id: 'comptabilite', 
    name: 'Comptabilité', 
    icon: BookOpen, 
    activeUsers: 312, 
    messagesPerMin: 7, 
    roomsLive: 0,
    courses: [
      { id: 'compta-1', title: 'Comptabilité générale', lessons: 14, duration: '5h30', progress: 0 },
      { id: 'compta-2', title: 'Comptabilité analytique', lessons: 10, duration: '4h', progress: 0 },
      { id: 'compta-3', title: 'Fiscalité', lessons: 10, duration: '4h', progress: 0 },
      { id: 'compta-4', title: 'Gestion financière', lessons: 12, duration: '5h', progress: 0 },
    ]
  },
];

export function CommunityDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showSocialOverlay, setShowSocialOverlay] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  
  const userStats = { level: 12, xp: 2450, streak: 7, freeHoursRemaining: 4, tracksCreated: 2 };
  const [liveStats, setLiveStats] = useState({ activeStudents: 2847, messagesPerMin: 24, liveRooms: 3, quizToday: 412 });
  
  // Get courses for selected program
  const selectedProgramData = selectedProgram 
    ? masteryPrograms.find(p => p.id === selectedProgram) 
    : null;

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeStudents: prev.activeStudents + Math.floor(Math.random() * 10) - 4,
        messagesPerMin: Math.max(15, prev.messagesPerMin + Math.floor(Math.random() * 6) - 3),
        liveRooms: prev.liveRooms,
        quizToday: prev.quizToday + Math.floor(Math.random() * 3)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'share': return <Upload size={14} />;
      case 'tip': return <Zap size={14} />;
      case 'answer': return <CheckCircle size={14} />;
      case 'room': return <Video size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 md:px-8">
          <div className="flex items-center justify-between relative h-[72px] md:h-[88px]">
            <div className="flex items-center gap-4 flex-shrink-0">
              <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors md:hidden"><Menu size={20} className="text-gray-900" /></button>
              <div className="relative h-[40px] w-[100px] md:h-[60px] md:w-[280px]"><Image src="/brand/sms-logo2.svg" alt="Science Made Simple" fill className="object-contain object-left" /></div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-4 px-5 py-2.5 bg-gray-50 rounded-full">
                <span className="text-sm font-medium text-gray-600">Niveau {userStats.level}</span>
                <span className="w-px h-4 bg-gray-200"></span>
                <span className="text-sm font-bold text-gray-900">{userStats.xp.toLocaleString()} XP</span>
                <span className="w-px h-4 bg-gray-200"></span>
                <div className="flex items-center gap-1.5">
                  <Flame size={14} className="text-orange-500" />
                  <span className="text-sm font-semibold text-orange-600">{userStats.streak}</span>
                </div>
              </div>
              <button onClick={() => setShowSocialOverlay(!showSocialOverlay)} className="relative p-2.5 rounded-full hover:bg-gray-50 transition-colors border border-gray-200">
                <Activity size={18} className="text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">5</span>
              </button>
              <button className="relative p-2.5 rounded-full hover:bg-gray-50 transition-colors border border-gray-200">
                <Users size={18} className="text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">3</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2.5 px-5 py-2.5 bg-gray-900 rounded-full"><Clock size={16} className="text-white" /><span className="text-base font-bold text-white tabular-nums">00:00:00</span></div>
              <button className="hidden md:flex items-center gap-2 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-full font-medium transition-colors"><Users size={14} /><span className="text-sm">Inviter</span></button>
              <button className="hidden md:block px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full transition-colors text-sm">Débloquer</button>
              <div className="relative">
                <button onClick={() => setShowSettings(!showSettings)} className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold hover:bg-gray-800 transition-colors text-sm">T</button>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-12 right-0 bg-white rounded-xl shadow-xl border border-gray-100 p-5 w-72 z-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3"><div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm">T</div><div><h3 className="text-sm font-semibold text-gray-900">Thomas</h3><p className="text-xs text-gray-500">2024-2025</p></div></div>
                        <button onClick={() => setShowSettings(false)}><X size={14} className="text-gray-400" /></button>
                      </div>
                      <hr className="border-gray-100 mb-3" />
                      <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-left"><Settings size={14} className="text-gray-400" /><span className="text-sm text-gray-700">Paramètres</span></button>
                        <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-left"><HelpCircle size={14} className="text-gray-400" /><span className="text-sm text-gray-700">Aide</span></button>
                        <hr className="border-gray-100 my-2" />
                        <button className="text-sm text-red-600 hover:text-red-700 font-medium p-2.5">Se déconnecter</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SOCIAL OVERLAY */}
      <AnimatePresence>
        {showSocialOverlay && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/10 z-40" onClick={() => setShowSocialOverlay(false)} />
            <motion.div initial={{ opacity: 0, x: 20, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.98 }} className="fixed right-6 top-[100px] w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-semibold text-gray-900">Science in Motion</h3><p className="text-xs text-gray-500 mt-0.5">Réseau en temps réel</p></div>
                  <button onClick={() => setShowSocialOverlay(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} className="text-gray-400" /></button>
                </div>
              </div>
              
              {/* Live Stats */}
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-sm text-gray-700">{liveStats.activeStudents.toLocaleString()} actifs</span></div>
                  <div className="flex items-center gap-2"><Flame size={12} className="text-orange-500" /><span className="text-sm text-gray-700">{liveStats.messagesPerMin} msg/min</span></div>
                  <div className="flex items-center gap-2"><Video size={12} className="text-blue-500" /><span className="text-sm text-gray-700">{liveStats.liveRooms} rooms live</span></div>
                  <div className="flex items-center gap-2"><CheckCircle size={12} className="text-green-500" /><span className="text-sm text-gray-700">{liveStats.quizToday} quiz</span></div>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {/* Invitations */}
                {mockInvitations.length > 0 && (
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3"><Bell size={14} className="text-gray-400" /><span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Invitations</span></div>
                    <div className="space-y-2">
                      {mockInvitations.map(inv => (
                        <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">{inv.initials}</div>
                            <div><p className="text-sm font-medium text-gray-900">{inv.title}</p><p className="text-xs text-gray-500">{inv.from} · {inv.time}</p></div>
                          </div>
                          <button className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800">Rejoindre</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buddies actifs */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Buddies en ligne</span></div>
                  <div className="flex items-center gap-2">
                    {mockBuddies.filter(b => b.isOnline).map(buddy => (
                      <div key={buddy.id} className="relative group cursor-pointer">
                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold">{buddy.initials}</div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                    ))}
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"><Plus size={16} /></button>
                  </div>
                </div>

                {/* Battles */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3"><Swords size={14} className="text-gray-400" /><span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Défis 1v1</span></div>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-900 text-white rounded-xl">
                      <div className="flex items-center justify-between">
                        <div><p className="text-sm font-medium">vs Thomas</p><p className="text-xs text-white/60">Électromagnétisme</p></div>
                        <div className="text-right"><p className="text-lg font-bold">450 - 420</p><p className="text-xs text-cyan-400">Finit dans 2h</p></div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div><p className="text-sm font-medium text-gray-900">vs Sophie</p><p className="text-xs text-gray-500">Intégrales</p></div>
                        <button className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold">Accepter</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 md:hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8"><Image src="/brand/sms-logo2.svg" alt="SMS" width={120} height={40} /><button onClick={() => setSidebarOpen(false)}><X size={20} className="text-gray-400" /></button></div>
                <div className="space-y-1">{navigationItems.map((item) => { const Icon = item.icon; return (<button key={item.id} onClick={() => { if (item.isWhatsApp) window.open('https://wa.me/32477025622', '_blank'); else { setActiveSection(item.id); setSidebarOpen(false); } }} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm ${item.isWhatsApp ? 'bg-green-500 text-white' : activeSection === item.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}><Icon size={18} /><span className="font-medium">{item.label}</span></button>); })}</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-60 bg-white border-r border-gray-100 flex-col fixed left-0 top-[88px] h-[calc(100vh-88px)] z-30">
        <div className="p-5 flex-1">
          <div className="space-y-1">{navigationItems.map((item) => { const Icon = item.icon; return (<button key={item.id} onClick={() => { if (item.isWhatsApp) window.open('https://wa.me/32477025622', '_blank'); else setActiveSection(item.id); }} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm ${item.isWhatsApp ? 'bg-green-500 text-white hover:bg-green-600' : activeSection === item.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}><Icon size={18} /><span className="font-medium">{item.label}</span></button>); })}</div>
        </div>
        <div className="border-t border-gray-100 p-4">
          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center"><Plus size={16} className="text-gray-500" /></div>
            <div className="flex-1 text-left"><p className="text-sm font-medium text-gray-900">Mastery Boosters</p><p className="text-xs text-gray-500">Booste ton apprentissage</p></div>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="md:ml-60 pt-[72px] md:pt-[88px]">
        <div className="px-6 lg:px-8 py-8 space-y-8">

          {/* HERO COCKPIT */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Qu'est-ce qu'on apprend <span className="text-gray-400">aujourd'hui ?</span></h1>
                <p className="text-gray-500 text-sm mb-5">Crée un track et rejoins une communauté. Cours, quiz, chat, rooms.</p>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Je veux maîtriser…" className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all" />
                  </div>
                  <button className="flex items-center gap-2 px-5 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors whitespace-nowrap"><Plus size={18} /><span className="hidden sm:inline">Créer un track</span></button>
                </div>
              </div>
              <div className="flex lg:flex-col gap-3 lg:min-w-[180px]">
                <div className="flex-1 lg:flex-none flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-sm text-gray-700 font-medium">{liveStats.activeStudents.toLocaleString()} actifs</span></div>
                <div className="flex-1 lg:flex-none flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl"><Flame size={14} className="text-orange-500" /><span className="text-sm text-gray-700 font-medium">{liveStats.messagesPerMin} msg/min</span></div>
                <div className="flex-1 lg:flex-none flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl"><Video size={14} className="text-blue-500" /><span className="text-sm text-gray-700 font-medium">{liveStats.liveRooms} rooms</span></div>
              </div>
            </div>
          </motion.section>

          {/* COUCHE 1 — ACTION */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* MISSION DU JOUR */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="xl:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-6 lg:p-8 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center"><Target size={20} className="text-white" /></div>
                  <div><h2 className="font-semibold" style={{ color: '#ffffff' }}>Mission du jour</h2><p className="text-xs text-white/50">Choisis ta mission</p></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Mission 1 */}
                  <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 cursor-pointer transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[10px] font-medium rounded-full">Mathématiques</span>
                      <div className="flex items-center gap-1 text-white/50 text-xs"><Users size={12} /><span>47</span></div>
                    </div>
                    <h3 className="font-semibold text-base mb-2" style={{ color: '#ffffff' }}>Intégrales curvilignes</h3>
                    <p className="text-white/60 text-xs mb-3">Calculer le travail sur un cercle</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-xs flex items-center gap-1"><Clock size={12} />18 min</span>
                      <button className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-semibold group-hover:bg-cyan-400 group-hover:text-white transition-colors">Choisir</button>
                    </div>
                  </div>
                  {/* Mission 2 */}
                  <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 cursor-pointer transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-medium rounded-full">Physique</span>
                      <div className="flex items-center gap-1 text-white/50 text-xs"><Users size={12} /><span>32</span></div>
                    </div>
                    <h3 className="font-semibold text-base mb-2" style={{ color: '#ffffff' }}>Électrostatique</h3>
                    <p className="text-white/60 text-xs mb-3">QCM sur le champ électrique</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-xs flex items-center gap-1"><Clock size={12} />12 min</span>
                      <button className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-semibold group-hover:bg-cyan-400 group-hover:text-white transition-colors">Choisir</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* DÉFIS & BATTLES */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 h-full flex flex-col justify-between border border-gray-700">
                <div>
                  <div className="flex items-center gap-2 mb-4"><Swords size={20} className="text-cyan-400" /><h3 className="font-semibold text-white">Défis & Battles</h3></div>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-cyan-400">Quiz du jour</span>
                        <span className="text-[10px] text-white/50">+50 XP</span>
                      </div>
                      <p className="text-sm text-white font-medium">Électrostatique</p>
                      <p className="text-[10px] text-white/50">10 questions · 5 min</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-orange-400">Battle 1v1</span>
                        <span className="text-[10px] text-white/50">+100 XP</span>
                      </div>
                      <p className="text-sm text-white font-medium">Thomas te défie</p>
                      <p className="text-[10px] text-white/50">Intégrales · Expire dans 2h</p>
                    </div>
                  </div>
                </div>
                <button className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors"><Swords size={16} />Lancer un défi</button>
              </div>
            </motion.div>
          </div>

          {/* REPRENDRE MA PROGRESSION - Netflix Style */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Reprendre ma progression <span className="text-gray-400 font-normal text-sm">({mockLearningTracks.length}/5)</span></h2>
              <div className="flex items-center gap-2">
                <button className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">Voir tout</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronLeft size={16} className="text-gray-500" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronRight size={16} className="text-gray-500" /></button>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {mockLearningTracks.map((track) => (
                <div key={track.id} className="flex-shrink-0 w-[220px] group/card cursor-pointer">
                  {/* Card Netflix Style */}
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl overflow-hidden mb-2 transition-transform group-hover/card:scale-[1.02]">
                    {/* Play button on hover */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <Play size={24} className="text-gray-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="w-8 h-0.5 bg-white/40 mb-2" />
                      <h3 className="font-bold text-base leading-tight line-clamp-2 mb-1" style={{ color: '#ffffff' }}>{track.name}</h3>
                      <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Next: {track.nextStep}</p>
                      
                      {/* Social signals */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                          <Users size={10} />{track.membersOnline}
                        </span>
                        {track.newMessages > 0 && (
                          <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            <MessageCircle size={10} />{track.newMessages}
                          </span>
                        )}
                        {track.studyRoomTonight && (
                          <span className="text-xs px-2 py-0.5 bg-cyan-500/30 rounded-full flex items-center gap-1" style={{ color: '#00c2ff' }}>
                            <Video size={10} />{track.studyRoomTime}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <div 
                        className="h-full transition-all" 
                        style={{ 
                          width: `${track.progress}%`, 
                          backgroundColor: track.progress >= 100 ? '#10b981' : '#00c2ff' 
                        }} 
                      />
                    </div>
                  </div>
                  
                  {/* Progress text */}
                  <p className="text-sm font-medium" style={{ color: track.progress >= 100 ? '#10b981' : '#00c2ff' }}>
                    {track.progress}% complété
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* COUCHE 2 — COMMUNAUTÉ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[95%] mx-auto">
            {/* STUDY ROOMS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Video size={14} className="text-gray-400" /><h2 className="text-sm font-semibold text-gray-900">Study Rooms</h2><span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-semibold rounded-full"><Radio size={8} className="animate-pulse" />{mockStudyRooms.filter(r => r.isLive).length}</span></div>
                <button className="text-[10px] font-medium text-gray-500 hover:text-gray-900">Voir tout</button>
              </div>
              <div className="space-y-2">
                {mockStudyRooms.slice(0, 3).map((room) => (
                  <div key={room.id} className={`rounded-lg p-2.5 transition-all ${room.isLive ? 'bg-gray-900' : 'bg-white border border-gray-100 hover:border-gray-200'}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {room.isLive ? <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-semibold"><span className="w-1 h-1 bg-white rounded-full animate-pulse" />LIVE</span> : <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">{room.startsIn}</span>}
                      <span className={`text-[10px] truncate ${room.isLive ? 'text-white/50' : 'text-gray-400'}`}>{room.host}</span>
                    </div>
                    <h3 className="font-medium text-xs mb-0.5 truncate" style={{ color: room.isLive ? '#ffffff' : '#111827' }}>{room.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] flex items-center gap-0.5 ${room.isLive ? 'text-white/50' : 'text-gray-400'}`}><Users size={10} />{room.participants}</span>
                      <button className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${room.isLive ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>{room.isLive ? 'Rejoindre' : 'Réserver'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ACTIVITÉ RÉCENTE */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Activity size={14} className="text-gray-400" /><h2 className="text-sm font-semibold text-gray-900">Activité récente</h2></div>
                <button className="text-[10px] font-medium text-gray-500 hover:text-gray-900">Voir tout</button>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
                {mockActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-2 p-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 truncate"><span className="font-medium text-gray-900">{activity.user}</span> {activity.action}</p>
                      <p className="text-[10px] text-gray-400">{activity.track} · {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* DÉFIS EN COURS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={14} className="text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">Défis en cours</h2>
              </div>
              <div className="space-y-2">
                {mockChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-white border border-gray-100 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-medium text-xs text-gray-900">{challenge.title}</h4>
                      <span className="text-[10px] text-gray-500">{challenge.deadline}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-2 line-clamp-1">{challenge.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${challenge.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-900">{challenge.progress}%</span>
                    </div>
                    <p className="text-[10px] text-cyan-600 mt-1.5 font-medium">{challenge.reward}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* COUCHE 3 — EXPLORATION */}
          
          {/* CONÇUS POUR L'ÉTUDIANT */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            <div className="flex items-center justify-between mb-4">
              <div><h2 className="text-lg font-semibold text-gray-900">Conçus pour l'étudiant</h2><p className="text-xs text-gray-500">Learning tracks personnalisés selon tes besoins</p></div>
              <button className="text-xs font-medium text-gray-500 hover:text-gray-900">Voir tout</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {[
                { id: 'lt-1', title: 'Réactions SN1/SN2', subject: 'Chimie', lessons: 6, duration: '2h30', activeUsers: 54 },
                { id: 'lt-2', title: 'Probabilités conditionnelles', subject: 'Statistiques', lessons: 8, duration: '3h', activeUsers: 72 },
                { id: 'lt-3', title: 'Thermodynamique', subject: 'Physique', lessons: 10, duration: '4h', activeUsers: 89 },
                { id: 'lt-4', title: 'Équations différentielles', subject: 'Mathématiques', lessons: 12, duration: '5h', activeUsers: 156 },
                { id: 'lt-5', title: 'Bases de données SQL', subject: 'Informatique', lessons: 8, duration: '3h30', activeUsers: 67 },
                { id: 'lt-6', title: 'Microéconomie', subject: 'Économie', lessons: 10, duration: '4h', activeUsers: 43 },
              ].map((track) => (
                <div key={track.id} className="flex-shrink-0 w-[200px] group/card cursor-pointer">
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl overflow-hidden mb-2 transition-transform group-hover/card:scale-[1.02]">
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl"><Play size={20} className="text-gray-900 ml-0.5" fill="currentColor" /></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 bg-cyan-500/90 text-white text-[10px] font-medium rounded-full">{track.subject}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-bold text-sm leading-tight line-clamp-2" style={{ color: '#ffffff' }}>{track.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        <span>{track.lessons} leçons</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
                        <span>{track.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <Users size={10} /><span>{track.activeUsers} actifs</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* EXPLORATION - Filtres cliquables */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
            <div className="flex items-center justify-between mb-4">
              <div><h2 className="text-lg font-semibold text-gray-900">Exploration</h2><p className="text-xs text-gray-500">Sélectionne un domaine pour voir les cours</p></div>
              {selectedProgram && (
                <button 
                  onClick={() => setSelectedProgram(null)}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
                >
                  <X size={14} /> Réinitialiser
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {masteryPrograms.map((program) => {
                const isSelected = selectedProgram === program.id;
                return (
                  <div 
                    key={program.id} 
                    onClick={() => setSelectedProgram(isSelected ? null : program.id)}
                    className={`rounded-lg p-3 cursor-pointer transition-all text-center ${
                      isSelected 
                        ? 'bg-gray-900 border-2 border-gray-900 shadow-lg' 
                        : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <h3 className="font-medium text-xs mb-1.5 truncate" style={{ color: isSelected ? '#ffffff' : '#111827' }}>{program.name}</h3>
                    <div className="flex items-center justify-center gap-1 text-[10px]" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
                      <Users size={9} /><span>{program.activeUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[10px] mt-0.5" style={{ color: isSelected ? 'rgba(255,255,255,0.5)' : '#9ca3af' }}>
                      <Flame size={9} /><span>{program.messagesPerMin}/min</span>
                    </div>
                    {program.roomsLive > 0 && (
                      <span className={`inline-flex items-center gap-0.5 mt-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                        isSelected ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600'
                      }`}>
                        <Radio size={7} className="animate-pulse" />{program.roomsLive}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* COURS DU PROGRAMME SÉLECTIONNÉ */}
          <AnimatePresence mode="wait">
            {selectedProgramData && (
              <motion.section 
                key={selectedProgramData.id}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedProgramData.name}</h2>
                    <p className="text-xs text-gray-500">{selectedProgramData.courses.length} cours dans ce programme</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronLeft size={16} className="text-gray-500" /></button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronRight size={16} className="text-gray-500" /></button>
                  </div>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {selectedProgramData.courses.map((course) => (
                    <div key={course.id} className="flex-shrink-0 w-[180px] group/card cursor-pointer">
                      <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl overflow-hidden mb-2 transition-transform group-hover/card:scale-[1.02]">
                        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover/card:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl"><Play size={20} className="text-gray-900 ml-0.5" fill="currentColor" /></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="w-8 h-0.5 bg-white/40 mb-2" />
                          <h3 className="font-bold text-sm leading-tight line-clamp-2" style={{ color: '#ffffff' }}>{course.title}</h3>
                          <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            <span>{course.lessons} leçons</span>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
                            <span>{course.duration}</span>
                          </div>
                        </div>
                        {course.progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                            <div className="h-full transition-all" style={{ width: `${course.progress}%`, backgroundColor: course.progress >= 100 ? '#10b981' : '#00c2ff' }} />
                          </div>
                        )}
                      </div>
                      {course.progress > 0 && <p className="text-xs font-medium" style={{ color: course.progress >= 100 ? '#10b981' : '#00c2ff' }}>{course.progress >= 100 ? 'Terminé' : `${course.progress}%`}</p>}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Message quand aucun programme sélectionné */}
          {!selectedProgram && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Sélectionne un Mastery Program ci-dessus</p>
              <p className="text-gray-400 text-sm mt-1">pour voir les cours associés</p>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
