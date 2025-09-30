'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { PlannerBadge } from '@/types';

interface PlannerBadgesProps {
  badges: PlannerBadge[];
  onBadgeClick?: (badge: PlannerBadge) => void;
}

export function PlannerBadges({ badges, onBadgeClick }: PlannerBadgesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const earnedBadges = badges.filter(b => b.isEarned);
  const availableBadges = badges.filter(b => !b.isEarned);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Badges</h3>
            <p className="text-gray-600 text-sm">
              {earnedBadges.length} / {badges.length} débloqués
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
          />
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            Badges obtenus
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {earnedBadges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => onBadgeClick?.(badge)}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-1">
                    {badge.name}
                  </h5>
                  <p className="text-xs text-gray-600 mb-2">
                    {badge.description}
                  </p>
                  {badge.earnedAt && (
                    <div className="flex items-center justify-center gap-1 text-xs text-yellow-700">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(badge.earnedAt)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            À débloquer
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {availableBadges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => onBadgeClick?.(badge)}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-all opacity-75"
              >
                <div className="text-center">
                  <div className="relative">
                    <div className="text-2xl mb-2 filter grayscale">
                      {badge.icon}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <h5 className="font-semibold text-gray-700 text-sm mb-1">
                    {badge.name}
                  </h5>
                  <p className="text-xs text-gray-500">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

              {/* Empty State */}
              {badges.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    Aucun badge disponible pour le moment
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
