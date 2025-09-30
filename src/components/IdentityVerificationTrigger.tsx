'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Settings } from 'lucide-react';

interface IdentityVerificationTriggerProps {
  onTriggerVerification: () => void;
}

export function IdentityVerificationTrigger({ onTriggerVerification }: IdentityVerificationTriggerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[9999]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 300 }}
    >
      <motion.button
        onClick={onTriggerVerification}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Sécuriser mon compte"
      >
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-white" />
          
          {/* Texte qui apparaît au hover */}
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: isHovered ? 'auto' : 0, 
              opacity: isHovered ? 1 : 0 
            }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            Sécuriser mon compte
          </motion.span>
        </div>
      </motion.button>

      {/* Tooltip professionnel */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap"
        >
          Sécurisez votre compte en 2 minutes
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </motion.div>
      )}
    </motion.div>
  );
}
