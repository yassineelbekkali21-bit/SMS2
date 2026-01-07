'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Users, Lock } from 'lucide-react';
import { Course } from '@/types';

interface StudyRoomButtonProps {
  course: Course;
  studyRoomAccess?: {
    hasFullAccess: boolean;
    accessMessage: string;
  };
  onJoinStudyRoom?: (courseId: string) => void;
  hasActiveStudyRoom?: boolean;
  studyRoomParticipants?: number;
  className?: string;
}

export function StudyRoomButton({
  course,
  studyRoomAccess,
  onJoinStudyRoom,
  hasActiveStudyRoom = false,
  studyRoomParticipants = 0,
  className = ""
}: StudyRoomButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Accès aux Study Rooms disponible pour tous les utilisateurs
  const hasAccess = true;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasAccess && onJoinStudyRoom) {
      onJoinStudyRoom(course.id);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={hasAccess ? { scale: 1.05 } : {}}
        whileTap={hasAccess ? { scale: 0.95 } : {}}
        disabled={!hasAccess}
        className={`
          relative p-2 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[36px] h-9
          ${hasAccess 
            ? 'bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 cursor-pointer shadow-sm hover:shadow-md' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
          ${hasActiveStudyRoom && hasAccess ? 'ring-2 ring-blue-200 bg-blue-100' : ''}
        `}
        title={
          hasAccess 
            ? hasActiveStudyRoom 
              ? `Study Room active (${studyRoomParticipants} participants)`
              : 'Rejoindre Study Room'
            : 'Débloquez le cours complet pour accéder aux Study Rooms'
        }
      >
        {/* Icône principale */}
        <div className="relative">
          {hasAccess ? (
            <Video size={18} />
          ) : (
            <div className="relative">
              <Video size={18} className="opacity-50" />
              <Lock size={10} className="absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
            </div>
          )}
          
          {/* Indicateur Study Room active (point rouge) */}
          {hasActiveStudyRoom && hasAccess && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
            >
              {/* Animation de pulsation pour l'effet "REC" */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-full h-full bg-red-500 rounded-full"
              />
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Tooltip au survol */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="absolute bottom-full right-0 mb-2 z-50"
        >
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap max-w-xs">
            {hasAccess ? (
              <div>
                <div className="font-medium">Study Room - {course.title}</div>
                {hasActiveStudyRoom ? (
                  <div className="text-gray-300 mt-1">
                    🔴 Session active • {studyRoomParticipants} participants
                  </div>
                ) : (
                  <div className="text-gray-300 mt-1">
                    Cliquez pour rejoindre ou créer une session
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="font-medium">🔒 Study Room verrouillée</div>
                <div className="text-gray-300 mt-1">
                  Débloquez le cours complet pour accéder aux Study Rooms
                </div>
              </div>
            )}
          </div>
          {/* Flèche du tooltip */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}
    </div>
  );
}