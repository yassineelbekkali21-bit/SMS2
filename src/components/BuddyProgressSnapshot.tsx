'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, TrendingUp, Zap, Target, Award, BookOpen, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Buddy } from '@/lib/buddy-data';

interface BuddyProgressSnapshotProps {
  buddy: Buddy | null;
  isOpen: boolean;
  onClose: () => void;
  clickPosition?: { x: number; y: number };
  onNavigate?: (direction: 'prev' | 'next') => void;
  currentIndex?: number;
  totalBuddies?: number;
}

// 🎨 Helper pour obtenir les initiales
const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export function BuddyProgressSnapshot({ 
  buddy, 
  isOpen, 
  onClose, 
  clickPosition,
  onNavigate,
  currentIndex = 0,
  totalBuddies = 1
}: BuddyProgressSnapshotProps) {
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0, placement: 'right' });
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  useEffect(() => {
    if (isOpen && clickPosition) {
      const modalWidth = 420; // w-[420px]
      const modalHeight = 720; // Hauteur plus précise du popup complet
      const padding = 20;
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Determine horizontal placement
      const spaceRight = viewportWidth - clickPosition.x;
      const spaceLeft = clickPosition.x;
      
      let x = clickPosition.x;
      let placement = 'right';
      
      if (spaceRight >= modalWidth + padding) {
        // Place to the right
        x = clickPosition.x + padding;
        placement = 'right';
      } else if (spaceLeft >= modalWidth + padding) {
        // Place to the left
        x = clickPosition.x - modalWidth - padding;
        placement = 'left';
      } else {
        // Center if no space on either side
        x = Math.max(padding, Math.min(viewportWidth - modalWidth - padding, clickPosition.x - modalWidth / 2));
        placement = 'center';
      }
      
      // 🔧 Determine vertical placement - AMÉLIORATION POUR ÉVITER COUPURE
      let y = clickPosition.y;
      const spaceBelow = viewportHeight - clickPosition.y;
      const spaceAbove = clickPosition.y;
      
      // Vérifier si le modal tient en dessous avec marge confortable
      if (spaceBelow >= modalHeight + padding * 2) {
        // Aligner en haut avec le clic, légèrement décalé vers le haut
        y = Math.max(padding, clickPosition.y - 40);
      } else if (spaceAbove >= modalHeight + padding * 2) {
        // Placer au-dessus si plus de place
        y = Math.max(padding, clickPosition.y - modalHeight + 40);
      } else {
        // Centrer verticalement si pas assez de place
        y = Math.max(padding, (viewportHeight - modalHeight) / 2);
      }
      
      // S'assurer que le modal reste dans les limites de la fenêtre avec marge confortable
      y = Math.min(y, viewportHeight - modalHeight - padding * 2);
      y = Math.max(y, padding);
      
      setModalPosition({ x, y, placement });
    }
  }, [isOpen, clickPosition]);
  
  if (!buddy || !mounted) return null;

  // 🎯 Messages FOMO bienveillants style Science Made Simple
  const getFomoMessage = () => {
    if (buddy.courseProgress >= 85) {
      return {
        title: `${buddy.name} a presque terminé !`,
        subtitle: "Rejoins-le pour finir ensemble 🎯",
        cta: "Terminer le cours",
        mood: "success"
      };
    } else if (buddy.isActive && buddy.courseProgress >= 50) {
      return {
        title: `${buddy.name} progresse vite !`,
        subtitle: "Il/Elle t'a peut-être dépassé(e) 😊",
        cta: "Rattraper mon retard",
        mood: "active"
      };
    } else if (buddy.joinedRecently) {
      return {
        title: `${buddy.name} vient de commencer`,
        subtitle: "Lance-toi aussi pour progresser ensemble !",
        cta: "Commencer maintenant",
        mood: "new"
      };
    } else if (buddy.isActive) {
      return {
        title: `${buddy.name} est actif(ve) en ce moment`,
        subtitle: "C'est le bon moment pour étudier ensemble",
        cta: "Me lancer aussi",
        mood: "active"
      };
    } else {
      return {
        title: `${buddy.name} fait une pause`,
        subtitle: "Tu peux le/la dépasser facilement 💪",
        cta: "Prendre de l'avance",
        mood: "paused"
      };
    }
  };

  const fomoData = getFomoMessage();

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[9999]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              position: 'fixed',
              left: `${modalPosition.x}px`,
              top: `${modalPosition.y}px`,
            }}
            className="bg-white rounded-3xl shadow-2xl w-[420px] overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Flèche pointant vers l'avatar */}
            {modalPosition.placement === 'right' && (
              <div className="absolute left-0 top-12 -translate-x-full">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-white" />
              </div>
            )}
            {modalPosition.placement === 'left' && (
              <div className="absolute right-0 top-12 translate-x-full">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-white" />
              </div>
            )}
            
            {/* 🎨 Header avec FOMO bienveillant */}
            <div className="relative p-8 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
              {/* Boutons de navigation et fermeture */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {/* Navigation Buddies */}
                {totalBuddies > 1 && onNavigate && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('prev');
                      }}
                      className="p-2 rounded-xl bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110 group"
                      title="Buddy précédent"
                    >
                      <ChevronLeft size={18} className="text-gray-600 group-hover:text-orange-600 transition-colors" />
                    </button>
                    
                    <div className="px-3 py-1 bg-white/90 rounded-lg text-xs font-semibold text-gray-600">
                      {currentIndex + 1}/{totalBuddies}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('next');
                      }}
                      className="p-2 rounded-xl bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110 group"
                      title="Buddy suivant"
                    >
                      <ChevronRight size={18} className="text-gray-600 group-hover:text-orange-600 transition-colors" />
                    </button>
                  </>
                )}
                
                {/* Bouton fermer */}
              <button
                onClick={onClose}
                  className="p-2 rounded-xl bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110"
              >
                  <X size={18} className="text-gray-600" />
              </button>
              </div>
              
              {/* Avatar avec initiales orange */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl relative overflow-hidden"
                  >
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0" />
                    <span className="relative z-10">{getInitials(buddy.name)}</span>
                  </motion.div>
                  
                  {/* Badge activité */}
                  {buddy.isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg"
                    >
                      <Zap size={14} className="text-white" fill="white" />
                    </motion.div>
                  )}
                </div>
                
                {/* Nom et titre FOMO */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900 mb-2 text-center"
                >
                  {fomoData.title}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-sm text-gray-600 text-center max-w-xs"
                >
                  {fomoData.subtitle}
                </motion.p>
              </div>

              {/* Barre de progression circulaire */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative flex items-center justify-center"
              >
                <svg className="w-24 h-24 -rotate-90">
                  {/* Cercle de fond */}
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/60"
                  />
                  {/* Cercle de progression */}
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "264", strokeDashoffset: "264" }}
                    animate={{ strokeDashoffset: `${264 - (264 * buddy.courseProgress) / 100}` }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Pourcentage au centre */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {buddy.courseProgress}%
                  </motion.span>
                  <span className="text-xs text-gray-600 font-medium">du cours</span>
                </div>
              </motion.div>
            </div>

            {/* 📊 Stats & CTA */}
            <div className="p-8 space-y-6">
              {/* Stats pertinentes - Grid 2x2 - Style épuré */}
              <div className="grid grid-cols-2 gap-3">
                {/* Leçons terminées - INFO CLÉE */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen size={18} className="text-gray-900" />
                    <span className="text-xs text-gray-500 font-medium">Leçons</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.ceil((buddy.courseProgress / 100) * 8)}/8
                  </div>
                  <div className="text-xs text-gray-600">terminées</div>
                </motion.div>
                
                {/* Dernière activité - FOMO temporel */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className={`rounded-2xl p-4 border transition-colors ${
                    buddy.isActive 
                      ? 'bg-white border-green-500 hover:border-green-600' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {buddy.isActive ? (
                      <Zap size={18} className="text-green-500" fill="currentColor" />
                    ) : (
                      <Clock size={18} className="text-gray-900" />
                    )}
                    <span className="text-xs text-gray-500 font-medium">Activité</span>
                  </div>
                  <div className={`text-xl font-bold ${buddy.isActive ? 'text-green-600' : 'text-gray-900'}`}>
                    {buddy.isActive ? "Hier" : "Il y a 3j"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {buddy.isActive ? 'Très actif' : 'En pause'}
                  </div>
                </motion.div>
                
                {/* Temps d'étude estimé - INFO ACTIONNABLE */}
                  <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Clock size={18} className="text-gray-900" />
                    <span className="text-xs text-gray-500 font-medium">Temps</span>
                </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ~{Math.ceil((buddy.courseProgress / 100) * 6)}h
              </div>
                  <div className="text-xs text-gray-600">d'étude</div>
                </motion.div>
                
                {/* Rang relatif - COMPÉTITION AMICALE */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Award size={18} className="text-gray-900" />
                    <span className="text-xs text-gray-500 font-medium">Rang</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {buddy.courseProgress >= 85 ? '🥇' : buddy.courseProgress >= 60 ? '🥈' : '🥉'}
                    </div>
                  <div className="text-xs text-gray-600">
                    {buddy.courseProgress >= 85 ? 'Leader' : buddy.courseProgress >= 60 ? 'Avancé' : 'Débutant'}
                  </div>
                </motion.div>
              </div>

              {/* Comparaison directe - Toi vs Buddy - Style épuré */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Comparaison</span>
                  <TrendingUp size={14} className="text-gray-400" />
                </div>
                
                <div className="space-y-2">
                  {/* Leçons terminées */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Leçons terminées</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        Toi: 3/8
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm font-bold text-gray-900">
                        {buddy.name.split(' ')[0]}: {Math.ceil((buddy.courseProgress / 100) * 8)}/8
                      </span>
                    </div>
                  </div>
                  
                  {/* Avance/Retard */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Différence</span>
                    <div className="flex items-center gap-1.5">
                      {buddy.courseProgress >= 50 ? (
                        <>
                          <span className="text-sm font-bold text-red-600">
                            -{Math.ceil(((buddy.courseProgress - 50) / 100) * 8)} leçons
                          </span>
                          <span className="text-xs text-gray-500">(tu es en retard)</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-bold text-green-600">
                            +{Math.ceil(((50 - buddy.courseProgress) / 100) * 8)} leçons
                          </span>
                          <span className="text-xs text-gray-500">(tu es en avance !)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Principal - FOMO bienveillant */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Zap size={18} fill="white" />
                {fomoData.cta}
              </motion.button>
              
              {/* Message bienveillant - Style épuré */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <p className="text-sm text-center text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">Science Made Simple</span>
                  {' '}·{' '}
                  {buddy.isActive 
                    ? "Progressez ensemble, c'est plus motivant !" 
                    : "Prends de l'avance, tu peux y arriver !"}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}


