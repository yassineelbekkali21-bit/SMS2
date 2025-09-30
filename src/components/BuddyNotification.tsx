'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X } from 'lucide-react';

interface BuddyNotificationProps {
  isVisible: boolean;
  buddyName: string;
  message: string;
  onSendWhatsApp: () => void;
  onDismiss: () => void;
}

export function BuddyNotification({ 
  isVisible, 
  buddyName, 
  message, 
  onSendWhatsApp, 
  onDismiss 
}: BuddyNotificationProps) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-[200] max-w-sm"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 px-6 py-4 border-b border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Coaching moment</h3>
                  <p className="text-sm text-emerald-600">Soutien de {buddyName}</p>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="w-8 h-8 bg-white/50 hover:bg-white/80 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Message */}
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed mb-6">
              {message}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSendWhatsApp}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-green-700 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contacter sur WhatsApp</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}




