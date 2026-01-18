'use client';

/**
 * PlanningInvitePopup - Petit modal d'invitation à planifier après unlock
 * Style SMS (DA Account Creation Modal)
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';

interface PlanningInvitePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanNow: () => void;
  onPlanLater: () => void;
  programName?: string;
}

export function PlanningInvitePopup({
  isOpen,
  onClose,
  onPlanNow,
  onPlanLater,
  programName = 'ton programme'
}: PlanningInvitePopupProps) {
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop - Style SMS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal - Style SMS Account Creation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="px-8 pt-8 pb-8">
              {/* Logo SMS */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 relative">
                  <Image 
                    src="/brand/onboarding-logo.svg" 
                    alt="SMS" 
                    fill 
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
                  SMS {programName} débloqué !
                </h2>
              </div>

              {/* Question */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  Veux-tu planifier tes cours maintenant ?
                </h3>
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  On va t'aider à organiser tes learning tracks pour atteindre tes objectifs.
                </p>
              </div>

              {/* Features preview */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-[#00c2ff]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-[#00c2ff]" />
                  </div>
                  <span className="text-white/80">Définis tes dates d'examens cibles</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-[#00c2ff]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles size={18} className="text-[#00c2ff]" />
                  </div>
                  <span className="text-white/80">Choisis ton rythme d'apprentissage</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-[#00c2ff]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-[#00c2ff]" />
                  </div>
                  <span className="text-white/80">Planification automatique adaptée</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onPlanNow}
                  className="w-full py-4 bg-[#00c2ff] hover:bg-[#00b0e8] text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  Planifier maintenant
                  <ArrowRight size={18} />
                </button>
                
                <button
                  onClick={onPlanLater}
                  className="w-full py-3 text-white/50 hover:text-white/80 font-medium transition-colors"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PlanningInvitePopup;
