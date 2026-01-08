'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play,
  CheckCircle,
  Lock,
  X,
  Clock
} from 'lucide-react';
import { Bundle, Course } from '@/types';
import { BundleCard } from './BundleCard';

// ============================================================================
// TYPES
// ============================================================================
interface BundleRowProps {
  subject: string;
  bundles: Bundle[];
  onTrackClick: (track: Course) => void;
  onToggleFavorite?: (trackId: string) => void;
}

// ============================================================================
// MINI TRACK CARD - Carte de learning track dans l'accordéon
// ============================================================================
const MiniTrackCard: React.FC<{
  track: Course;
  index: number;
  isLocked: boolean;
  onClick: () => void;
}> = ({ track, index, isLocked, onClick }) => {
  const progress = track.progress || 0;
  const isCompleted = progress === 100;
  const isInProgress = progress > 0 && progress < 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={!isLocked ? onClick : undefined}
      className={`flex-shrink-0 cursor-pointer group/track ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {/* Card - 140px × 170px */}
      <div className={`relative w-[140px] h-[170px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg ${!isLocked ? 'group-hover/track:shadow-xl group-hover/track:scale-[1.03]' : ''} transition-all`}>
        
        {/* Numéro de séquence - Style badge premium */}
        <div className="absolute top-3 left-3 z-20">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-lg ${
            isCompleted ? 'bg-white text-gray-900' :
            isInProgress ? 'bg-[#00c2ff] text-white' :
            isLocked ? 'bg-gray-600/80 text-white/60' :
            'bg-white/20 backdrop-blur-sm text-white'
          }`}>
            {isCompleted ? <CheckCircle size={16} /> : index + 1}
          </div>
        </div>
        
        {/* Badge EN COURS ou ESSAI */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
          {isInProgress && (
            <span className="px-2 py-1 bg-[#00c2ff] text-white text-[9px] font-bold rounded-md uppercase tracking-wider">
              En cours
            </span>
          )}
          {track.isTrial && !isInProgress && (
            <span className="inline-flex items-center px-3 py-1.5 bg-white text-gray-900 text-[13px] font-bold rounded-md uppercase tracking-wider shadow-lg">
              Essai
            </span>
          )}
        </div>
        
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
            <div className="w-10 h-10 bg-gray-700/90 rounded-full flex items-center justify-center">
              <Lock size={18} className="text-white/70" />
            </div>
          </div>
        )}
        
        {/* Play button au hover */}
        {!isLocked && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-all z-10">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl"
            >
              <Play size={20} className="text-gray-900 ml-0.5" fill="currentColor" />
            </motion.div>
          </div>
        )}
        
        {/* Gradient overlay en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Barre de progression */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50">
            <div 
              className={`h-full ${isCompleted ? 'bg-white' : 'bg-[#00c2ff]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      
      {/* Titre et durée sous la carte */}
      <div className="mt-2 px-0.5">
        <h4 className={`text-sm font-medium leading-tight line-clamp-2 ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
          {track.title}
        </h4>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <Clock size={10} />
          {track.duration}
        </p>
      </div>
    </motion.div>
  );
};

// ============================================================================
// EXPANDED ACCORDION CONTENT - Style premium
// ============================================================================
const ExpandedBundleContent: React.FC<{
  bundle: Bundle;
  onTrackClick: (track: Course) => void;
  onClose: () => void;
}> = ({ bundle, onTrackClick, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  useEffect(() => {
    checkScroll();
  }, []);
  
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };
  
  const nextTrack = bundle.tracks.find(t => (t.progress || 0) < 100);
  
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-4 relative">
        
        {/* Header avec navigation et close button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{bundle.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
              {bundle.description}
            </p>
          </div>
          
          {/* Navigation arrows + Close button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                canScrollLeft 
                  ? 'border-gray-300 hover:bg-gray-100 text-gray-700' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                canScrollRight 
                  ? 'border-gray-300 hover:bg-gray-100 text-gray-700' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Tracks carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bundle.tracks.map((track, index) => {
            const previousTrack = index > 0 ? bundle.tracks[index - 1] : null;
            const isLocked = previousTrack ? (previousTrack.progress || 0) < 100 : false;
            
            return (
              <MiniTrackCard
                key={track.id}
                track={track}
                index={index}
                isLocked={isLocked}
                onClick={() => onTrackClick(track)}
              />
            );
          })}
        </div>
        
        {/* CTA Footer */}
        {nextTrack && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Prochaine étape</p>
              <p className="text-sm font-medium text-gray-900">{nextTrack.title}</p>
            </div>
            <motion.button
              onClick={() => onTrackClick(nextTrack)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium flex items-center gap-2 transition-colors text-sm"
            >
              <Play size={16} fill="currentColor" />
              {bundle.isStarted ? 'Continuer' : 'Commencer'}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT - BundleRow avec accordéon
// ============================================================================
export function BundleRow({ subject, bundles, onTrackClick }: BundleRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expandedBundleId, setExpandedBundleId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  useEffect(() => {
    checkScroll();
  }, []);
  
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };
  
  const handleBundleClick = (bundle: Bundle) => {
    if (expandedBundleId === bundle.id) {
      setExpandedBundleId(null);
    } else {
      setExpandedBundleId(bundle.id);
    }
  };
  
  const expandedBundle = bundles.find(b => b.id === expandedBundleId);
  
  return (
    <div className="space-y-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{subject}</h2>
        
        {/* Navigation arrows - Style MasterClass */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
              canScrollLeft 
                ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700' 
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
              canScrollRight 
                ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700' 
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Bundle cards row - Aligné avec CourseRow (pl-4 pr-8) */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 overflow-x-auto pb-3 pt-4 pl-4 pr-8 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {bundles.map((bundle) => (
          <BundleCard
            key={bundle.id}
            bundle={bundle}
            onClick={handleBundleClick}
            isSelected={expandedBundleId === bundle.id}
          />
        ))}
      </div>
      
      {/* Accordion content */}
      <AnimatePresence>
        {expandedBundle && (
          <ExpandedBundleContent
            bundle={expandedBundle}
            onTrackClick={onTrackClick}
            onClose={() => setExpandedBundleId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default BundleRow;
