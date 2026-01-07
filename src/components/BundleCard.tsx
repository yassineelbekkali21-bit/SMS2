'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers,
  Clock,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Bundle } from '@/types';

// ============================================================================
// TYPES
// ============================================================================
interface BundleCardProps {
  bundle: Bundle;
  onClick: (bundle: Bundle) => void;
  isSelected?: boolean;
}

// ============================================================================
// COMPONENT - Format carte PAYSAGE - Fond noir style Learning Track
// ============================================================================
export function BundleCard({ bundle, onClick, isSelected = false }: BundleCardProps) {
  return (
    <motion.div
      onClick={() => onClick(bundle)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={`flex-shrink-0 cursor-pointer group ${isSelected ? 'ring-2 ring-white/50 rounded-2xl' : ''}`}
      style={{ fontFamily: 'DM Sans, sans-serif' }}
    >
      {/* Carte PAYSAGE - Fond noir comme les learning tracks */}
      <div className="relative w-[280px] sm:w-[320px] md:w-[360px] h-[160px] sm:h-[180px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl">
        
        {/* Contenu principal */}
        <div className="relative h-full p-5 flex flex-col justify-between">
          
          {/* Header */}
          <div>
            {/* Badge SÉRIE + ESSAI si applicable */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-md text-[10px] font-bold text-gray-900 uppercase tracking-wider">
                <Layers size={10} />
                Série
              </span>
              {bundle.isTrial && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-md text-[13px] font-bold text-white uppercase tracking-wider shadow-lg">
                  Essai
                </span>
              )}
            </div>
            
            {/* Titre */}
            <h3 className="text-xl sm:text-2xl font-bold mb-1 leading-tight" style={{ color: '#ffffff' }}>
              {bundle.title}
            </h3>
          </div>
          
          {/* Footer - Stats + Actions */}
          <div className="flex items-end justify-between">
            {/* Stats */}
            <div className="flex items-center gap-4 text-white/70 text-xs">
              <span className="flex items-center gap-1 text-white">
                <BookOpen size={12} />
                {bundle.tracks.length} learning tracks
              </span>
              <span className="flex items-center gap-1 text-white">
                <Clock size={12} />
                {bundle.totalDuration}
              </span>
            </div>
            
            {/* Chevron */}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ChevronRight size={16} className="text-white" />
            </div>
          </div>
        </div>
        
        {/* Indicateur de sélection */}
        {isSelected && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="w-3 h-3 bg-white rotate-45 shadow-lg" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BundleCard;
