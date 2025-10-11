'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import { CoachingMessage } from '@/types';

interface CoachingBannerProps {
  message: CoachingMessage | null;
  onAction?: () => void;
  onDismiss?: () => void;
}

export function CoachingBanner({ message, onAction, onDismiss }: CoachingBannerProps) {
  if (!message || !message.isVisible) return null;

  const getIcon = () => {
    switch (message.type) {
      case 'congratulation':
        return <TrendingUp className="text-green-600" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-orange-600" size={20} />;
      case 'suggestion':
        return <Target className="text-blue-600" size={20} />;
      case 'motivation':
        return <Zap className="text-purple-600" size={20} />;
      default:
        return <Target className="text-gray-600" size={20} />;
    }
  };

  const getBannerStyle = () => {
    switch (message.type) {
      case 'congratulation':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      case 'warning':
        return 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200';
      case 'suggestion':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
      case 'motivation':
        return 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getActionButtonStyle = () => {
    switch (message.type) {
      case 'congratulation':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'suggestion':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'motivation':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`mb-6 border rounded-xl p-4 shadow-sm ${getBannerStyle()}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                {message.title}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {message.message}
              </p>
            </div>

            {message.actionLabel && onAction && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAction}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getActionButtonStyle()}`}
              >
                {message.actionLabel}
              </motion.button>
            )}
          </div>

          {onDismiss && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDismiss}
              className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}






