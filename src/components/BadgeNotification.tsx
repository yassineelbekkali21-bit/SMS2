'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Trophy, Crown, Zap } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgeNotificationProps {
  badge: Badge | null;
  isVisible: boolean;
  onClose: () => void;
}

const getBadgeIcon = (iconName: string) => {
  switch (iconName) {
    case 'award': return Award;
    case 'star': return Star;
    case 'trophy': return Trophy;
    case 'crown': return Crown;
    case 'zap': return Zap;
    default: return Award;
  }
};

const getRarityStyle = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return {
        bg: 'from-gray-400 to-gray-600',
        glow: 'shadow-gray-200',
        text: 'text-gray-700'
      };
    case 'rare':
      return {
        bg: 'from-blue-400 to-blue-600',
        glow: 'shadow-blue-200',
        text: 'text-blue-700'
      };
    case 'epic':
      return {
        bg: 'from-purple-400 to-purple-600',
        glow: 'shadow-purple-200',
        text: 'text-purple-700'
      };
    case 'legendary':
      return {
        bg: 'from-yellow-400 to-orange-500',
        glow: 'shadow-yellow-200',
        text: 'text-yellow-700'
      };
    default:
      return {
        bg: 'from-gray-400 to-gray-600',
        glow: 'shadow-gray-200',
        text: 'text-gray-700'
      };
  }
};

export function BadgeNotification({ badge, isVisible, onClose }: BadgeNotificationProps) {
  if (!badge) return null;

  const IconComponent = getBadgeIcon(badge.icon);
  const rarityStyle = getRarityStyle(badge.rarity);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4">
              {/* Badge Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${rarityStyle.bg} ${rarityStyle.glow} shadow-lg flex items-center justify-center`}
              >
                <IconComponent className="text-white" size={24} />
              </motion.div>
              
              {/* Badge Info */}
              <div className="flex-1">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-bold text-gray-900 mb-1"
                >
                  Badge débloqué ! 🏅
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`font-semibold ${rarityStyle.text} mb-1`}
                >
                  {badge.name}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-gray-600"
                >
                  {badge.description}
                </motion.p>
              </div>
            </div>
            
            {/* Auto-close timer */}
            <motion.div
              className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className={`h-full bg-gradient-to-r ${rarityStyle.bg} rounded-full`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                onAnimationComplete={onClose}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
