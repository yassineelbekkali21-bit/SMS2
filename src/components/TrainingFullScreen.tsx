'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Brain,
  Swords,
  ChevronRight,
  Target,
  Menu,
  X,
  Calendar,
  BookOpen,
  Plus,
  Video,
  Users,
  MessageCircle,
  Clock,
  Zap,
  Trophy,
  ArrowLeft
} from 'lucide-react';

// Navigation - EXACTEMENT comme SimpleDashboard
const NAV_ITEMS = [
  { id: 'courses', label: 'Mes cours', icon: BookOpen },
  { id: 'planning', label: 'Planification', icon: Calendar },
  { id: 'study-rooms', label: 'Study Rooms', icon: Video },
  { id: 'community', label: 'Communauté', icon: Users },
  { id: 'training', label: 'Entraînement', icon: Target },
];

interface TrainingFullScreenProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle: string;
  onOpenDuel?: () => void;
}

export function TrainingFullScreen({ 
  isOpen, 
  onClose, 
  trackTitle,
  onOpenDuel
}: TrainingFullScreenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'main' | 'solo'>('main');

  // Stats (mock data)
  const stats = {
    quizDone: 24,
    successRate: 78,
    victories: 5
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-gray-50" 
        onClick={(e) => e.stopPropagation()}
      >
        
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
                const isActive = item.id === 'training';
                return (
                  <button key={item.id}
                    onClick={() => { 
                      if (!isActive) onClose();
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isActive ? 'bg-black text-white'
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
          <div className="px-4 md:px-6 lg:px-8 py-6 flex-1 flex flex-col overflow-hidden">
            
            {/* Titre de la page */}
            <div className="mb-6 flex-shrink-0">
              <h1 className="font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'var(--font-parafina)', fontSize: '56px' }}>Entraînement</h1>
              <p className="text-gray-500 mt-1" style={{ fontSize: '16px' }}>{trackTitle}</p>
            </div>

            {/* === CONTENU PRINCIPAL === */}
            <div className="flex-1 overflow-y-auto">
              {activeMode === 'main' ? (
                // === ÉCRAN PRINCIPAL ===
                <div className="max-w-2xl">
                  <p className="text-gray-600 mb-8" style={{ fontSize: '18px' }}>
                    Choisis comment tu veux progresser aujourd'hui.
                  </p>

                  <div className="space-y-4">
                    {/* Quiz Solo */}
                    <button
                      onClick={() => setActiveMode('solo')}
                      className="w-full flex items-center gap-5 p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <Brain size={26} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900" style={{ fontSize: '18px' }}>Quiz solo</h3>
                        <p className="text-gray-500 mt-1" style={{ fontSize: '15px' }}>Tester et renforcer tes connaissances à ton rythme</p>
                      </div>
                      <ChevronRight size={24} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Duel */}
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDuel?.();
                      }}
                      className="w-full flex items-center gap-5 p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <Swords size={26} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900" style={{ fontSize: '18px' }}>Défie un adversaire</h3>
                        <p className="text-gray-500 mt-1" style={{ fontSize: '15px' }}>Affronte un autre étudiant en temps réel sur des quiz</p>
                      </div>
                      <ChevronRight size={24} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-6">
                      Tes statistiques
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-6 bg-white rounded-2xl border border-gray-200">
                        <p className="text-3xl font-bold text-gray-900">{stats.quizDone}</p>
                        <p className="text-sm text-gray-500 mt-1">Quiz faits</p>
                      </div>
                      <div className="text-center p-6 bg-white rounded-2xl border border-gray-200">
                        <p className="text-3xl font-bold text-gray-900">{stats.successRate}%</p>
                        <p className="text-sm text-gray-500 mt-1">Réussite</p>
                      </div>
                      <div className="text-center p-6 bg-white rounded-2xl border border-gray-200">
                        <p className="text-3xl font-bold text-gray-900">{stats.victories}</p>
                        <p className="text-sm text-gray-500 mt-1">Victoires</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // === ÉCRAN QUIZ SOLO ===
                <div className="max-w-2xl">
                  {/* Back button */}
                  <button
                    onClick={() => setActiveMode('main')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
                    style={{ fontSize: '15px' }}
                  >
                    <ArrowLeft size={18} />
                    Retour
                  </button>

                  <h2 className="font-bold text-gray-900 mb-2" style={{ fontSize: '28px' }}>Quiz solo</h2>
                  <p className="text-gray-500 mb-8" style={{ fontSize: '16px' }}>Choisis le format qui te convient.</p>

                  <div className="space-y-4">
                    {/* Quiz Rapide */}
                    <button
                      className="w-full flex items-center gap-5 p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Zap size={26} className="text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900" style={{ fontSize: '18px' }}>Vérifie tes acquis</h3>
                        <p className="text-gray-500 mt-1" style={{ fontSize: '15px' }}>5 questions · ~3 min</p>
                      </div>
                      <ChevronRight size={24} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Quiz Approfondi */}
                    <button
                      className="w-full flex items-center gap-5 p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Brain size={26} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900" style={{ fontSize: '18px' }}>Quiz approfondi</h3>
                        <p className="text-gray-500 mt-1" style={{ fontSize: '15px' }}>15 questions · ~10 min</p>
                      </div>
                      <ChevronRight size={24} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Exam Blanc */}
                    <button
                      className="w-full flex items-center gap-5 p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Trophy size={26} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900" style={{ fontSize: '18px' }}>Simule ton examen</h3>
                        <p className="text-gray-500 mt-1" style={{ fontSize: '15px' }}>Conditions réelles · 30+ questions</p>
                      </div>
                      <ChevronRight size={24} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* === MOBILE SIDEBAR === */}
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/50 z-50 lg:hidden" 
              onClick={() => setSidebarOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-xl lg:hidden"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="relative h-[45px] w-[100px]">
                  <Image src="/brand/sms-logo2.svg" alt="SMS" fill className="object-contain object-left" />
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === 'training';
                    return (
                      <button key={item.id} onClick={() => { if (!isActive) onClose(); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
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

      </motion.div>
    </AnimatePresence>
  );
}

