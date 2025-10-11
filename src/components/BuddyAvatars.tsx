'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { BuddyProgressSnapshot } from './BuddyProgressSnapshot';

interface Buddy {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
  courseProgress: number;
  joinedRecently?: boolean;
}

interface BuddyAvatarsProps {
  courseId: string;
  buddies: Buddy[];
  cardState: 'unlocked' | 'partiallyUnlocked' | 'favoriteNotUnlocked' | 'normal';
  maxAvatars?: number;
}

export function BuddyAvatars({ 
  courseId, 
  buddies, 
  cardState, 
  maxAvatars = 3
}: BuddyAvatarsProps) {
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);

  const handleBuddyClick = (buddy: Buddy, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBuddy(buddy);
    setIsSnapshotOpen(true);
  };

  const handleCloseSnapshot = () => {
    setIsSnapshotOpen(false);
    setSelectedBuddy(null);
  };
  
  if (!buddies || buddies.length === 0) {
    return null; // Pas d'avatars si aucun buddy ne suit le cours
  }

  // Trier les buddies par degré d'engagement (plus avancés d'abord, puis récents)
  const sortedBuddies = [...buddies].sort((a, b) => {
    // 1. Buddies actifs en priorité
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    
    // 2. Parmi les actifs, les plus avancés d'abord
    if (a.isActive && b.isActive) {
      return b.courseProgress - a.courseProgress;
    }
    
    // 3. Parmi les inactifs, les plus avancés d'abord
    if (!a.isActive && !b.isActive) {
      return b.courseProgress - a.courseProgress;
    }
    
    return 0;
  });

  const visibleBuddies = sortedBuddies.slice(0, maxAvatars);
  const remainingCount = Math.max(0, buddies.length - maxAvatars);

  // Pour les cartes partiellement débloquées, choisir un avatar aléatoire pour le badge ⚡
  const randomActiveIndex = cardState === 'partiallyUnlocked' && visibleBuddies.length > 0 
    ? Math.floor(Math.random() * Math.min(visibleBuddies.length, 2)) // Parmi les 2 premiers
    : -1;

  // Taille responsive des avatars
  const avatarSize = visibleBuddies.length === 1 ? 'w-7 h-7' : 'w-6 h-6';
  const avatarSpacing = visibleBuddies.length === 1 ? 'space-x-0' : '-space-x-2';

  // Styles selon l'état de la carte
  const getAvatarStyle = () => {
    switch (cardState) {
      case 'unlocked':
        return 'opacity-100 filter-none'; // Avatars nets (pleine couleur)
      case 'partiallyUnlocked':
        return 'opacity-100 filter-none'; // Avatars nets + icône ⚡
      case 'favoriteNotUnlocked':
        return 'opacity-80 blur-[0.5px] saturate-75'; // Léger flou réduit + désaturé
      case 'normal':
        return 'opacity-70 blur-[1px] group-hover:opacity-100 group-hover:blur-none'; // Flou + hover éveil
      default:
        return 'opacity-100';
    }
  };

  const getTooltipText = () => {
    if (buddies.length === 1) {
      return `Suivi aussi par ${buddies[0].name}`;
    } else if (buddies.length === 2) {
      return `Suivi aussi par ${buddies[0].name} et ${buddies[1].name}`;
    } else if (buddies.length === 3) {
      return `Suivi aussi par ${buddies[0].name}, ${buddies[1].name} et ${buddies[2].name}`;
    } else {
      return `Suivi aussi par ${buddies[0].name}, ${buddies[1].name} et ${buddies.length - 2} autres buddies`;
    }
  };

  return (
    <div className="absolute bottom-2 left-2 z-10 group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className={`flex items-center ${avatarSpacing} hover:scale-105 hover:z-10 transition-transform duration-200`}
        title={getTooltipText()}
      >
        {/* Avatars des buddies */}
        {visibleBuddies.map((buddy, index) => (
          <motion.div
            key={buddy.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
            className="relative group/avatar"
            title={`${buddy.name} – ${buddy.courseProgress}% du cours terminé • Clique pour voir le détail`}
          >
            <div
              onClick={(e) => handleBuddyClick(buddy, e)}
              className={`${avatarSize} rounded-full border-2 border-white shadow-sm transition-all duration-200 hover:scale-110 hover:opacity-100 hover:filter-none cursor-pointer ${getAvatarStyle()} ${
                buddy.isActive ? 'ring-2 ring-green-400' : ''
              }`}
              style={{
                backgroundImage: `url(${buddy.avatar})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            {/* Icône activité récente pour les cartes partiellement débloquées */}
            {cardState === 'partiallyUnlocked' && (
              (buddy.joinedRecently || index === randomActiveIndex) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
                  <Zap size={8} className="text-white" />
                </div>
              )
            )}
            
            {/* Badge "new" pour les nouveaux buddies */}
            {buddy.joinedRecently && cardState !== 'partiallyUnlocked' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-[6px] text-white font-bold">N</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Cercle "+X" si plus de buddies */}
        {remainingCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 + visibleBuddies.length * 0.1, type: "spring" }}
            className={`${avatarSize} bg-gray-100 text-xs font-medium text-gray-600 flex items-center justify-center rounded-full border-2 border-white shadow-sm transition-all duration-200 hover:scale-110 cursor-pointer ${getAvatarStyle()}`}
            title={`+${remainingCount} autres buddies`}
          >
            +{remainingCount}
          </motion.div>
        )}
      </motion.div>
      
      {/* Tooltip spécial pour les cartes non débloquées */}
      {(cardState === 'favoriteNotUnlocked' || cardState === 'normal') && (
        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity duration-200 pointer-events-none z-20">
          {cardState === 'normal' ? 'Ces buddies suivent ce cours' : 'Tes buddies suivent déjà ce cours'}
        </div>
      )}

      {/* Modal Buddy Progress Snapshot */}
      <BuddyProgressSnapshot
        buddy={selectedBuddy}
        isOpen={isSnapshotOpen}
        onClose={handleCloseSnapshot}
      />
    </div>
  );
}
