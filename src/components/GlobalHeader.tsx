'use client';

/**
 * GlobalHeader - Navigation principale flottante inspirée d'Apple Music
 * 
 * 3 blocs distincts flottants :
 * - Gauche : Avatar utilisateur
 * - Centre : Logo SMS + Navigation principale
 * - Droite : Actions (Cadeau, Sign Up)
 * 
 * Responsive :
 * - Desktop : Layout original
 * - Mobile : Menu hamburger + Overlay style Landing Page
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Target, 
  Video, 
  Gift, 
  User,
  Settings,
  LogOut,
  Star,
  Zap,
  Menu,
  X,
  ChevronRight,
  Clock,
  Shield,
  Moon,
  HelpCircle,
  FileText,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

// Types
interface NavigationItem {
  id: string;
  label: string;
}

interface GlobalHeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  userName?: string;
  userAvatar?: string;
  userLevel?: number;
  userXP?: number;
  isSubscribed?: boolean;
  isIdentityVerified?: boolean;
  onOpenGuestPass?: () => void;
  onFinishSignup?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  onStartTour?: () => void;
  onOpenParentReports?: () => void;
  onOpenHelpCenter?: () => void;
  onVerifyIdentity?: () => void;
  themeColor?: string;
}

type SocialStatus = 'available' | 'busy' | 'focus' | 'invisible';

const SOCIAL_STATUSES = [
  { id: 'available' as const, label: 'Disponible', icon: '🟢', desc: 'Visible et joignable' },
  { id: 'busy' as const, label: 'Occupé', icon: '🟠', desc: 'Pas de duels' },
  { id: 'focus' as const, label: 'Focus', icon: '🔴', desc: 'Mode concentration' },
  { id: 'invisible' as const, label: 'Invisible', icon: '⚫', desc: 'Hors ligne' },
];

// Navigation items - ORDRE EXACT demandé
const navigationItems: NavigationItem[] = [
  { id: 'courses', label: 'Mon parcours' },
  { id: 'planning', label: 'Planification' },
  { id: 'study-rooms', label: 'Study Rooms' },
  { id: 'community', label: 'Social Club' },
  { id: 'training', label: 'Training Club' },
  { id: 'programs', label: 'Programmes' },
];

export function GlobalHeader({
  activeSection,
  onNavigate,
  userName = 'Utilisateur',
  userAvatar,
  userLevel = 1,
  userXP = 0,
  isSubscribed = false,
  isIdentityVerified = false,
  onOpenGuestPass,
  onFinishSignup,
  onOpenProfile,
  onOpenSettings,
  onLogout,
  onStartTour,
  onOpenParentReports,
  onOpenHelpCenter,
  onVerifyIdentity,
  themeColor = '#48c6ed',
}: GlobalHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [socialStatus, setSocialStatus] = useState<SocialStatus>('available');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu utilisateur si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Initiales de l'utilisateur
  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-2 pb-1 px-4 md:pt-4 md:px-6 bg-white">
        {/* Container global */}
        <div className="max-w-[1800px] mx-auto flex items-center justify-between md:justify-center relative min-h-[60px] md:min-h-[85px]">
          
          {/* ========== MOBILE HEADER (Visible < md) ========== */}
          <div className="md:hidden flex items-center justify-between w-full bg-[#0d1317]/95 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 shadow-lg">
             {/* Left: Hamburger */}
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-white/80 hover:text-white transition-colors"
             >
               <Menu size={24} />
             </button>

             {/* Center: Logo */}
             <div className="relative w-24 h-8">
               <Image 
                 src="/brand/sms-logo.svg" 
                 alt="SMS" 
                 fill 
                 className="object-contain" 
               />
             </div>

             {/* Right: Avatar (Mini) */}
             <div 
                onClick={onOpenProfile}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden border border-white/20"
                style={{ 
                  background: userAvatar ? 'transparent' : `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}cc 100%)`,
                }}
              >
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt={userName}
                    width={32}
                    height={32}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white">{userInitials}</span>
                )}
              </div>
          </div>


          {/* ========== DESKTOP HEADER (Visible >= md) ========== */}

          {/* 1. BLOC GAUCHE — AVATAR + CADEAU (positionné à gauche) */}
          <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 items-center gap-3" ref={userMenuRef}>
            {/* Avatar */}
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="group"
            >
              <div 
                className="w-[85px] h-[85px] rounded-full flex items-center justify-center text-xl font-semibold transition-all duration-200 group-hover:ring-2 group-hover:ring-white/40 overflow-hidden"
                style={{ 
                  background: userAvatar ? 'transparent' : `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}cc 100%)`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt={userName}
                    width={85}
                    height={85}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white">{userInitials}</span>
                )}
              </div>
            </button>

            {/* Bouton Cadeau - à droite de l'avatar */}
            <button
              onClick={onOpenGuestPass}
              className="w-14 h-14 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-all duration-200"
              style={{
                background: 'rgba(13, 19, 23, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              }}
              title="Inviter un ami"
            >
              <Gift size={20} />
            </button>

            {/* Menu déroulant utilisateur - Style Spotify */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-52 py-1 rounded-md shadow-xl"
                  style={{
                    background: 'rgba(13, 19, 23, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Compte - avec lien externe */}
                  <button
                    onClick={() => { setIsUserMenuOpen(false); onOpenSettings?.(); }}
                    className="w-full px-3 py-3 flex items-center justify-between text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm">Compte</span>
                    <ExternalLink size={16} className="text-white/70" />
                  </button>

                  {/* Profil */}
                  <button
                    onClick={() => { setIsUserMenuOpen(false); onOpenProfile?.(); }}
                    className="w-full px-3 py-3 flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm">Profil</span>
                  </button>

                  {/* Assistance - avec lien externe */}
                  <button
                    onClick={() => { setIsUserMenuOpen(false); onOpenHelpCenter?.(); }}
                    className="w-full px-3 py-3 flex items-center justify-between text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm">Assistance</span>
                    <ExternalLink size={16} className="text-white/70" />
                  </button>

                  {/* Session d'écoute privée (Mode focus) */}
                  <button
                    onClick={() => {
                      setSocialStatus(socialStatus === 'focus' ? 'available' : 'focus');
                    }}
                    className="w-full px-3 py-3 flex items-center justify-between text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm">Session d'écoute privée</span>
                    {socialStatus === 'focus' && (
                      <CheckCircle size={16} className="text-green-500" />
                    )}
                  </button>

                  {/* Préférences */}
                  <button
                    onClick={() => { setIsUserMenuOpen(false); onOpenSettings?.(); }}
                    className="w-full px-3 py-3 flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm">Préférences</span>
                  </button>

                  {/* Séparateur */}
                  <div className="my-1 border-t border-white/10" />

                  {/* Déconnexion */}
                  <button
                    onClick={() => { setIsUserMenuOpen(false); onLogout?.(); }}
                    className="w-full px-3 py-3 flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm">Déconnexion</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. BLOC CENTRAL — NAVIGATION PRINCIPALE */}
          <nav 
            className="hidden md:flex items-center gap-2 px-4 py-8 rounded-full"
            style={{
              background: 'rgba(13, 19, 23, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            }}
          >
            {/* Logo SMS - à gauche de la navigation - agrandi avec marge négative pour ne pas augmenter la hauteur du header */}
            <div className="flex items-center pr-4 mr-2 -my-16 lg:-my-20">
              <div className="w-44 h-44 lg:w-52 lg:h-52 relative">
                <Image
                  src="/brand/sms-logo.svg"
                  alt="SMS"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Items de navigation */}
            {navigationItems.map((item) => {
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    relative px-5 py-2.5 rounded-full font-medium
                    transition-all duration-200 ease-out
                    ${isActive 
                      ? 'text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                  style={{ fontSize: '17px' }}
                >
                  {/* Background actif avec animation */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: themeColor }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Label */}
                  <span className="relative z-10">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* 3. BLOC DROIT — ACTIONS (positionné à droite) */}
          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center gap-3">
            {/* Timer heures gratuites disponibles */}
            <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-900 rounded-full">
              <Clock size={20} className="text-white" />
              <span className="text-lg font-bold text-white tabular-nums tracking-tight">10:00:00</span>
            </div>

            {/* Débloquer OU Level/XP */}
            {!isSubscribed ? (
              <button
                onClick={onFinishSignup}
                className="px-5 py-2.5 rounded-full font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`,
                  color: 'white',
                  fontSize: '14px',
                  boxShadow: `0 4px 15px ${themeColor}30`,
                }}
              >
                Débloquer
              </button>
            ) : (
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(13, 19, 23, 0.95)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Zap size={16} style={{ color: themeColor }} />
                <span className="text-sm font-medium text-white/80">
                  Niv. {userLevel}
                </span>
                <span className="text-sm text-white/50">·</span>
                <span className="text-sm text-white/60">{userXP} XP</span>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* ========== MOBILE OVERLAY MENU (Landing Page Style) ========== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#0d1317] flex flex-col md:hidden"
          >
            {/* Header du Menu Mobile */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
               <div className="relative w-28 h-8">
                 <Image 
                   src="/brand/sms-logo.svg" 
                   alt="SMS" 
                   fill 
                   className="object-contain object-left" 
                 />
               </div>
               <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
               >
                 <X size={24} />
               </button>
            </div>

            {/* Contenu Scrollable */}
            <div className="flex-1 overflow-y-auto py-6 px-6">
              
              {/* Profile Card Rapide */}
              <div 
                onClick={() => { setIsMobileMenuOpen(false); onOpenProfile?.(); }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 mb-8"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold overflow-hidden"
                  style={{ 
                    background: userAvatar ? 'transparent' : `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}cc 100%)`,
                  }}
                >
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt={userName}
                      width={48}
                      height={48}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white">{userInitials}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{userName}</h3>
                  {isSubscribed ? (
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Zap size={14} className="text-amber-400" />
                      <span>Niveau {userLevel} · {userXP} XP</span>
                    </div>
                  ) : (
                    <p className="text-sm text-white/50">Étudiant</p>
                  )}
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                {navigationItems.map((item) => {
                   const isActive = activeSection === item.id;
                   return (
                     <button
                       key={item.id}
                       onClick={() => {
                         onNavigate(item.id);
                         setIsMobileMenuOpen(false);
                       }}
                       className={`
                         w-full text-left p-4 rounded-xl text-xl font-medium flex items-center justify-between group
                         transition-all duration-200
                         ${isActive 
                           ? 'bg-white/10 text-white' 
                           : 'text-white/60 hover:text-white hover:bg-white/5'
                         }
                       `}
                     >
                       <span>{item.label}</span>
                       <ChevronRight 
                          size={20} 
                          className={`
                            transition-transform duration-200 
                            ${isActive ? 'text-white translate-x-1' : 'text-white/20 group-hover:text-white/50'}
                          `} 
                       />
                     </button>
                   );
                })}
              </nav>

              {/* Badge vérification (Mobile) */}
              <div className="mt-6 mb-4">
                {isIdentityVerified ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm">
                    <CheckCircle size={16} />
                    <span>Compte vérifié</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); onVerifyIdentity?.(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400 text-sm"
                  >
                    <Shield size={16} />
                    <span>Vérifier mon identité</span>
                  </button>
                )}
              </div>

              {/* Statut social (Mobile) */}
              <div className="mb-6 p-4 bg-white/5 rounded-xl">
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Statut social</p>
                <div className="grid grid-cols-2 gap-2">
                  {SOCIAL_STATUSES.map((status) => (
                    <button
                      key={status.id}
                      onClick={() => setSocialStatus(status.id)}
                      className={`p-2.5 rounded-lg text-left transition-all ${
                        socialStatus === status.id
                          ? 'bg-white/10 ring-1 ring-white/20'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{status.icon}</span>
                        <span className="text-sm font-medium text-white/80">{status.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions Secondaires */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                 <button
                    onClick={() => { setIsMobileMenuOpen(false); onOpenGuestPass?.(); }}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center gap-3 text-purple-200"
                 >
                   <Gift size={20} />
                   <span className="font-medium">Inviter un ami</span>
                 </button>

                 {!isSubscribed && (
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); onFinishSignup?.(); }}
                      className="w-full p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-lg shadow-blue-500/20 mt-2"
                      style={{ background: themeColor }}
                    >
                      <span>Terminer l'inscription</span>
                      <ChevronRight size={20} />
                    </button>
                 )}
              </div>

              {/* Paramètres rapides (Mobile) */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-1">
                 {/* Mode sombre */}
                 <div className="w-full p-3 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-white/70 text-sm">
                     <Moon size={18} />
                     <span>Mode sombre</span>
                   </div>
                   <button 
                     onClick={() => setIsDarkMode(!isDarkMode)}
                     className={`w-11 h-6 rounded-full relative transition-colors ${
                       isDarkMode ? 'bg-[#48c6ed]' : 'bg-white/20'
                     }`}
                   >
                     <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                       isDarkMode ? 'right-0.5' : 'left-0.5'
                     }`} />
                   </button>
                 </div>

                 <button
                    onClick={() => { setIsMobileMenuOpen(false); onStartTour?.(); }}
                    className="w-full p-3 flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                 >
                   <HelpCircle size={18} />
                   <span>Visite guidée</span>
                 </button>

                 <button
                    onClick={() => { setIsMobileMenuOpen(false); onOpenParentReports?.(); }}
                    className="w-full p-3 flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                 >
                   <FileText size={18} />
                   <span>Rapports Parents</span>
                 </button>

                 <button
                    onClick={() => { setIsMobileMenuOpen(false); onOpenHelpCenter?.(); }}
                    className="w-full p-3 flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                 >
                   <HelpCircle size={18} />
                   <span>Centre d'aide</span>
                 </button>

                 <button
                    onClick={() => { setIsMobileMenuOpen(false); onOpenSettings?.(); }}
                    className="w-full p-3 flex items-center gap-3 text-white/50 hover:text-white transition-colors"
                 >
                   <Settings size={18} />
                   <span>Paramètres</span>
                 </button>

                 <button
                    onClick={() => { setIsMobileMenuOpen(false); onLogout?.(); }}
                    className="w-full p-3 flex items-center gap-3 text-red-400/70 hover:text-red-400 transition-colors"
                 >
                   <LogOut size={18} />
                   <span>Déconnexion</span>
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GlobalHeader;
