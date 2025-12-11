'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SocialFeedService } from '@/lib/social-feed-service';

interface SocialFeedIconProps {
  onClick: () => void;
  className?: string;
}

export default function SocialFeedIcon({ onClick, className = '' }: SocialFeedIconProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const socialFeedService = SocialFeedService.getInstance();

  useEffect(() => {
    // Load initial unread count
    updateUnreadCount();

    // Set up polling for new activities (in a real app, this would be WebSocket)
    const interval = setInterval(() => {
      updateUnreadCount();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateUnreadCount = () => {
    const feedData = socialFeedService.getSocialFeed();
    const newUnreadCount = feedData.unreadCount;
    
    if (newUnreadCount > unreadCount) {
      // New activities detected, animate
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
    
    setUnreadCount(newUnreadCount);
  };

  const handleClick = () => {
    onClick();
    // Reset animation state when clicked
    setIsAnimating(false);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        relative p-2 rounded-lg transition-colors duration-200
        hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Science in Motion — Fil d'activité intelligent"
    >
      {/* Icône principale */}
      <motion.div
        animate={isAnimating ? { rotate: [0, -10, 10, -10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="text-2xl"
      >
        🪩
      </motion.div>

      {/* Badge de notification */}
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.div>
      )}

      {/* Animation de pulsation pour les nouvelles activités */}
      {isAnimating && (
        <motion.div
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-blue-400 rounded-lg"
        />
      )}
    </motion.button>
  );
}
