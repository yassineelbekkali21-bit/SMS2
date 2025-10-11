'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendBadge, getBadgeInfo } from '@/lib/faculty-sorting';

interface TrendBadgeComponentProps {
  badge: TrendBadge;
  animationDelay?: number;
}

export function TrendBadgeComponent({ badge, animationDelay = 0 }: TrendBadgeComponentProps) {
  if (!badge) return null;

  const badgeInfo = getBadgeInfo(badge);
  if (!badgeInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: animationDelay, 
        duration: 0.3, 
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={`absolute top-2 left-2 z-20 px-2 py-0.5 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm ${badgeInfo.bgColor} ${badgeInfo.textColor}`}
    >
      <span className="text-xs font-semibold flex items-center gap-1">
        <span className="text-[10px]">{badgeInfo.emoji}</span>
        {badgeInfo.text}
      </span>
    </motion.div>
  );
}
