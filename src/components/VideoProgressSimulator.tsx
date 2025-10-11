'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, CheckCircle } from 'lucide-react';
import { StudySession } from '@/types';
import { VideoProgressService } from '@/lib/video-progress-service';

interface VideoProgressSimulatorProps {
  session: StudySession;
  onProgressUpdate: (updatedSession: StudySession) => void;
}

export function VideoProgressSimulator({ session, onProgressUpdate }: VideoProgressSimulatorProps) {
  if (!VideoProgressService.canLaunchSession(session)) return null;

  const simulateProgress = (targetProgress: number) => {
    const updatedSession = VideoProgressService.updateVideoProgress(session, targetProgress);
    onProgressUpdate(updatedSession);
  };

  const progressOptions = [
    { label: '25%', value: 25, color: 'bg-red-500' },
    { label: '50%', value: 50, color: 'bg-orange-500' },
    { label: '75%', value: 75, color: 'bg-yellow-500' },
    { label: '100%', value: 100, color: 'bg-green-500' }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
      <div className="flex items-center gap-2 mb-2">
        <Play size={14} className="text-blue-600" />
        <span className="text-xs font-medium text-blue-800">Simulateur de progression</span>
      </div>
      
      <div className="flex gap-1">
        {progressOptions.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => simulateProgress(option.value)}
            className={`px-2 py-1 text-xs font-medium text-white rounded ${option.color} hover:opacity-90 transition-opacity`}
          >
            {option.label}
          </motion.button>
        ))}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => simulateProgress(0)}
          className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          <RotateCcw size={12} />
        </motion.button>
      </div>
      
      <div className="text-xs text-blue-600 mt-1">
        💡 Cliquez pour simuler la progression vidéo
      </div>
    </div>
  );
}






