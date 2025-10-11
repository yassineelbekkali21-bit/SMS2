'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, X } from 'lucide-react';

interface ProfileNotificationProps {
  type: 'success' | 'error' | null;
  message: string;
  onClose: () => void;
}

export function ProfileNotification({ type, message, onClose }: ProfileNotificationProps) {
  if (!type) return null;

  const config = {
    success: {
      icon: Check,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    }
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div className={`${bgColor} ${borderColor} border rounded-lg p-4 shadow-lg`}>
          <div className="flex items-center gap-3">
            <Icon size={20} className={iconColor} />
            <p className={`${textColor} text-sm font-medium flex-1`}>
              {message}
            </p>
            <button
              onClick={onClose}
              className={`${textColor} hover:opacity-70 transition-opacity`}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


