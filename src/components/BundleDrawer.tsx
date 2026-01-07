'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  ChevronRight, 
  CheckCircle, 
  Lock, 
  Clock, 
  BookOpen,
  Target,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Bundle, Course } from '@/types';

// ============================================================================
// TYPES
// ============================================================================
interface BundleDrawerProps {
  bundle: Bundle | null;
  isOpen: boolean;
  onClose: () => void;
  onStartBundle: (bundle: Bundle) => void;
  onStartTrack: (track: Course, bundle: Bundle) => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getBundleGradient = (subject: string): string => {
  const gradients: { [key: string]: string } = {
    'Physique': 'from-blue-600 to-cyan-500',
    'Mathématiques': 'from-purple-600 to-pink-500',
    'Chimie': 'from-emerald-600 to-teal-500',
    'Informatique': 'from-orange-600 to-amber-500',
    'Économie': 'from-indigo-600 to-blue-500',
    'Biologie': 'from-green-600 to-lime-500',
  };
  return gradients[subject] || 'from-gray-600 to-gray-500';
};

const getSubjectIcon = (subject: string): string => {
  const icons: { [key: string]: string } = {
    'Physique': '⚛️',
    'Mathématiques': '📐',
    'Chimie': '🧪',
    'Informatique': '💻',
    'Économie': '📊',
    'Biologie': '🧬',
  };
  return icons[subject] || '📚';
};

// ============================================================================
// TRACK CARD COMPONENT
// ============================================================================
const TrackCard: React.FC<{
  track: Course;
  index: number;
  isLocked: boolean;
  onClick: () => void;
}> = ({ track, index, isLocked, onClick }) => {
  const getStatus = () => {
    if (track.progress === 100) return 'completed';
    if (track.progress > 0) return 'in-progress';
    if (!isLocked) return 'available';
    return 'locked';
  };
  
  const status = getStatus();
  
  const statusConfig = {
    completed: {
      bg: 'bg-gray-100',
      border: 'border-gray-200',
      icon: <CheckCircle size={18} className="text-gray-700" />,
      badge: <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-bold rounded-full">TERMINÉ</span>,
      action: 'Revoir'
    },
    'in-progress': {
      bg: 'bg-[#48c6ed]/5',
      border: 'border-[#48c6ed]/30',
      icon: <Play size={18} className="text-[#48c6ed]" />,
      badge: <span className="px-2 py-0.5 bg-[#48c6ed] text-white text-[10px] font-bold rounded-full">EN COURS</span>,
      action: 'Continuer'
    },
    available: {
      bg: 'bg-white hover:bg-gray-50',
      border: 'border-gray-200',
      icon: <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300" />,
      badge: null,
      action: 'Commencer'
    },
    locked: {
      bg: 'bg-gray-50 opacity-60',
      border: 'border-gray-100',
      icon: <Lock size={16} className="text-gray-400" />,
      badge: <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-medium rounded-full">Verrouillé</span>,
      action: null
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={status !== 'locked' ? onClick : undefined}
      className={`relative flex items-center gap-4 p-4 rounded-xl border ${config.bg} ${config.border} ${status !== 'locked' ? 'cursor-pointer' : 'cursor-not-allowed'} transition-all`}
    >
      {/* Numéro de séquence */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        status === 'completed' ? 'bg-gray-800 text-white' :
        status === 'in-progress' ? 'bg-[#48c6ed] text-white' :
        'bg-gray-200 text-gray-600'
      }`}>
        {status === 'completed' ? <CheckCircle size={16} /> : index + 1}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-medium truncate ${status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>
            {track.title}
          </h4>
          {config.badge}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {track.totalLessons} leçons
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {track.duration}
          </span>
          {status === 'in-progress' && (
            <span className="text-[#48c6ed] font-medium">{track.progress}%</span>
          )}
        </div>
      </div>
      
      {/* Action */}
      {config.action && (
        <button className={`flex items-center gap-1 text-sm font-medium ${
          status === 'in-progress' ? 'text-[#48c6ed]' : 'text-gray-600'
        }`}>
          {config.action}
          <ChevronRight size={16} />
        </button>
      )}
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function BundleDrawer({ 
  bundle, 
  isOpen, 
  onClose, 
  onStartBundle, 
  onStartTrack 
}: BundleDrawerProps) {
  if (!bundle) return null;
  
  const gradient = getBundleGradient(bundle.subject);
  const icon = bundle.icon || getSubjectIcon(bundle.subject);
  const completedTracks = bundle.tracks.filter(t => t.progress === 100).length;
  const currentTrack = bundle.tracks.find(t => t.progress > 0 && t.progress < 100) || 
                       bundle.tracks.find(t => t.progress === 0);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header avec gradient */}
            <div className={`relative bg-gradient-to-r ${gradient} p-6 pb-8`}>
              {/* Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              </div>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X size={20} />
              </button>
              
              {/* Content */}
              <div className="relative">
                {/* Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-wider">
                    <Layers size={12} />
                    Bundle • {bundle.subject}
                  </span>
                </div>
                
                {/* Icon & Title */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{bundle.title}</h2>
                    <p className="text-white/80 text-sm line-clamp-2">{bundle.description}</p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Layers size={16} />
                    <span>{bundle.tracks.length} tracks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={16} />
                    <span>{bundle.totalLessons} leçons</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{bundle.totalDuration}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progression du bundle</span>
                <span className="text-sm font-bold text-gray-900">{completedTracks}/{bundle.tracks.length} tracks</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 rounded-full transition-all"
                  style={{ width: `${(completedTracks / bundle.tracks.length) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Tracks list */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Parcours séquentiel
              </h3>
              
              <div className="space-y-3">
                {bundle.tracks.map((track, index) => {
                  // Un track est verrouillé si le précédent n'est pas complété (sauf le premier)
                  const previousTrack = index > 0 ? bundle.tracks[index - 1] : null;
                  const isLocked = previousTrack ? previousTrack.progress < 100 : false;
                  
                  return (
                    <TrackCard
                      key={track.id}
                      track={track}
                      index={index}
                      isLocked={isLocked}
                      onClick={() => onStartTrack(track, bundle)}
                    />
                  );
                })}
              </div>
              
              {/* Objectives section */}
              {bundle.objectives && bundle.objectives.length > 0 && (
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Target size={16} />
                    Ce que tu vas maîtriser
                  </h3>
                  <ul className="space-y-2">
                    {bundle.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* CTA Footer */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <motion.button
                onClick={() => onStartBundle(bundle)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {completedTracks === bundle.tracks.length ? (
                  <>
                    <Play size={20} />
                    Revoir le bundle
                  </>
                ) : completedTracks > 0 ? (
                  <>
                    <ArrowRight size={20} />
                    Continuer le bundle
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Commencer le bundle
                  </>
                )}
              </motion.button>
              
              {currentTrack && completedTracks < bundle.tracks.length && (
                <p className="text-center text-xs text-gray-500 mt-2">
                  Prochain : {currentTrack.title}
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BundleDrawer;

