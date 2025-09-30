'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Calendar, Clock, X } from 'lucide-react';
import { MissedSessionAlert as MissedSessionAlertType } from '@/types';

interface MissedSessionAlertProps {
  alert: MissedSessionAlertType;
  onClose: () => void;
  onAutoReschedule: (newDate: Date) => void;
  onManualReschedule: () => void;
}

export function MissedSessionAlert({ 
  alert, 
  onClose, 
  onAutoReschedule, 
  onManualReschedule 
}: MissedSessionAlertProps) {
  if (!alert.isOpen) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-white/90 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 px-8 py-6 border-b border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Session manquée
                  </h3>
                  <p className="text-orange-600 font-medium text-lg">
                    Tu n'as pas suivi ta session
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/50 hover:bg-white/80 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Session Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                Session manquée
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    {alert.session.startTime} - {alert.session.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    {formatDate(alert.session.date)}
                  </span>
                </div>
                <div className="text-gray-600">
                  <strong className="text-gray-900">{alert.session.courseName}</strong>
                  {alert.session.lessonName && (
                    <span> - {alert.session.lessonName}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <p className="text-xl text-gray-900 mb-2 font-medium">
                Veux-tu la reprogrammer ?
              </p>
              <p className="text-gray-600">
                Ne laisse pas cette session t'échapper ! Choisir une solution maintenant.
              </p>
            </div>

            {/* Suggested Slots Preview */}
            {alert.suggestedRescheduleSlots.length > 0 && (
              <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
                <h5 className="font-semibold text-indigo-900 mb-4">
                  Créneaux disponibles
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  {alert.suggestedRescheduleSlots.slice(0, 4).map((slot, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onAutoReschedule(slot)}
                      className="p-3 bg-white border border-indigo-200 rounded-xl text-sm text-indigo-700 hover:bg-indigo-50 transition-colors"
                    >
                      {formatDate(slot)}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {alert.suggestedRescheduleSlots.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAutoReschedule(alert.suggestedRescheduleSlots[0])}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-6 py-4 font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  ⚡ Replanifier automatiquement
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onManualReschedule}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 rounded-xl px-6 py-4 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                📅 Choisir manuellement
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full text-gray-500 hover:text-gray-700 py-3 font-medium transition-colors"
              >
                Plus tard
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
