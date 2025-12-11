'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users } from 'lucide-react';
import { SocialEvent, SocialFeedService } from '@/lib/social-feed-service';

interface SocialEventCardProps {
  event: SocialEvent;
  onEventClick?: (event: SocialEvent) => void;
  isCompact?: boolean; // Nouveau prop pour le mode compact
}

export default function SocialEventCard({ event, onEventClick, isCompact = false }: SocialEventCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showBuddyInfo, setShowBuddyInfo] = useState(false);
  const socialFeedService = SocialFeedService.getInstance();
  
  const handleClick = () => {
    // Mark as read when clicked
    if (!event.isRead) {
      socialFeedService.markEventAsRead(event.id);
    }
    
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    console.log(`🪩 SOCIAL FEED: ${isLiked ? 'Annulé félicitation' : 'Félicitation'} pour ${event.userName}`);
  };

  const handleBuddyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBuddyInfo(!showBuddyInfo);
    console.log(`🪩 SOCIAL FEED: Affichage info buddy pour ${event.userName}`);
  };

  const getEventTypeStyle = () => {
    switch (event.type) {
      case 'buddy':
        return 'border-l-4 border-l-blue-400 bg-blue-50/20';
      case 'faculty':
        return 'border-l-4 border-l-purple-400 bg-purple-50/20';
      case 'personal':
        return 'border-l-4 border-l-green-400 bg-green-50/30';
      case 'founder-session':
        return event.isLive 
          ? 'border-l-4 border-l-red-500 bg-red-50/30 shadow-red-100/50' // LIVE avec shadow spéciale
          : 'border-l-4 border-l-orange-400 bg-orange-50/20'; // Séance programmée
      case 'study-room':
        return 'border-l-4 border-l-indigo-400 bg-indigo-50/20';
      default:
        return 'border-l-4 border-l-gray-400 bg-gray-50/20';
    }
  };

  // Fonction pour obtenir la priorité visuelle (pour le mode compact)
  const getEventPriority = () => {
    if (event.type === 'founder-session' && event.isLive) return 'high'; // LIVE = priorité max
    if (event.type === 'founder-session') return 'medium-high'; // Fondateur programmé
    if (event.type === 'personal') return 'medium'; // Personnel
    if (event.type === 'buddy') return 'medium-low'; // Buddies
    return 'low'; // Faculté
  };

  const timeAgo = socialFeedService.getTimeAgo(event.timestamp);
  const isGrouped = event.participants && event.participants.length > 1;

  // Mode compact - Carte réduite 60-80px
  if (isCompact) {
    const priority = getEventPriority();
    const priorityStyles = {
      'high': 'shadow-md border-red-300', // LIVE sessions
      'medium-high': 'shadow-sm border-orange-300', // Founder sessions
      'medium': 'shadow-sm border-green-300', // Personal
      'medium-low': 'border-blue-200', // Buddies
      'low': 'border-purple-200' // Faculty
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ 
          scale: 1.01, 
          boxShadow: priority === 'high' ? "0 6px 20px rgba(239, 68, 68, 0.15)" : "0 4px 12px rgba(0,0,0,0.08)",
          transition: { duration: 0.15 }
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
               className={`
                 relative p-4 mb-3 rounded-lg cursor-pointer transition-all duration-200
                 border hover:border-gray-300
                 ${getEventTypeStyle()}
                 ${priorityStyles[priority]}
                 ${!event.isRead ? 'bg-white shadow-sm' : 'bg-gray-50/30'}
                 h-20 flex items-center // Hauteur augmentée et padding augmenté
               `}
        onClick={handleClick}
      >
        {/* Badge non lu simplifié pour mode compact */}
        {!event.isRead && event.type !== 'founder-session' && (
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
        )}
        {!event.isRead && event.type === 'founder-session' && (
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        )}

                <div className="flex items-center space-x-4 w-full">
                  {/* Avatar compact agrandi */}
                  <div className="flex-shrink-0">
                    {event.type === 'founder-session' ? (
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          Z
                        </div>
                        {event.isLive && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                        {event.userName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Contenu compact */}
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-medium text-gray-900 truncate">
                          {event.userName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-tight truncate mt-0.5">
                        {event.message}
                      </p>
                    </div>

            {/* Temps et actions à droite */}
            <div className="flex-shrink-0 text-right flex flex-col items-end space-y-1">
              <span className="text-xs text-gray-400">
                {timeAgo}
              </span>
              {event.type === 'founder-session' && (
                <div className="flex items-center">
                  {event.isLive ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`🔴 SOCIAL FEED: Rejoindre session LIVE: ${event.studyRoomId}`);
                      }}
                      className="flex items-center space-x-1 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full hover:bg-red-600 transition-colors"
                    >
                      <span>🔴</span>
                      <span>Rejoindre</span>
                    </button>
                  ) : event.startTime && event.startTime.getTime() > Date.now() ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`🔔 SOCIAL FEED: S'inscrire à la session: ${event.studyRoomId}`);
                      }}
                      className="flex items-center space-x-1 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full hover:bg-orange-600 transition-colors"
                    >
                      <span>📝</span>
                      <span>S'inscrire</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`📺 SOCIAL FEED: Voir le replay: ${event.studyRoomId}`);
                      }}
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded-full hover:bg-gray-600 transition-colors"
                    >
                      <span>📺</span>
                      <span>Replay</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] // Easing plus fluide
      }}
      className={`
        relative p-4 mb-3 rounded-xl cursor-pointer transition-all duration-300
        border hover:border-gray-300
        ${getEventTypeStyle()}
        ${!event.isRead ? 'bg-white shadow-sm' : 'bg-gray-50/50'}
      `}
      onClick={handleClick}
    >
      {/* Badge non lu avec lueur bleue Science Made Simple (sauf séances du fondateur) */}
      {!event.isRead && event.type !== 'founder-session' && (
        <>
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 rounded-xl bg-blue-500/5 pointer-events-none"></div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-xl"></div>
        </>
      )}

      {/* Badge non lu simple pour les séances du fondateur */}
      {!event.isRead && event.type === 'founder-session' && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-gray-400 rounded-full"></div>
      )}

      <div className="flex items-start space-x-3">
        {/* Avatar(s) */}
        <div className="flex-shrink-0">
          {isGrouped ? (
            <div className="flex -space-x-2">
              {event.participants!.slice(0, 3).map((participant, index) => (
                <div
                  key={participant}
                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                  style={{ zIndex: 10 - index }}
                >
                  {participant.charAt(0)}
                </div>
              ))}
              {event.participants!.length > 3 && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white">
                  +{event.participants!.length - 3}
                </div>
              )}
            </div>
          ) : event.type === 'founder-session' ? (
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white">
                Z
              </div>
              {/* Badge fondateur */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs">👑</span>
              </div>
              {/* Indicateur LIVE */}
              {event.isLive && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
          ) : event.type === 'personal' ? (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {event.userName.charAt(0)}
            </div>
          ) : (
            <div 
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold cursor-pointer hover:bg-gray-300 transition-colors"
              onClick={handleBuddyClick}
              title="Voir les infos du buddy"
            >
              {event.userName.charAt(0)}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <motion.span 
              className="text-lg"
              animate={{ 
                rotate: event.type === 'founder-session' && event.isLive ? [0, 5, -5, 0] : 0,
                scale: event.type === 'founder-session' && event.isLive ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                duration: 2, 
                repeat: event.type === 'founder-session' && event.isLive ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {event.emoji}
            </motion.span>
            <span className="text-sm font-medium text-gray-900 truncate">
              {event.userName}
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {timeAgo}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 leading-relaxed">
            {event.message}
          </p>

          {/* Participants détaillés pour les événements groupés */}
          {isGrouped && (
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Users className="w-3 h-3 mr-1" />
              <span>{event.participants!.join(', ')}</span>
            </div>
          )}

          {/* Informations spéciales pour les séances du fondateur */}
          {event.type === 'founder-session' && (
            <div className="mt-2 space-y-1">
              {/* Indicateur LIVE ou timing */}
              {event.isLive ? (
                <div className="flex items-center text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-red-600 font-medium">EN DIRECT</span>
                  {event.endTime && (
                    <span className="text-gray-500 ml-2">
                      • Se termine dans {Math.max(0, Math.floor((event.endTime.getTime() - Date.now()) / (1000 * 60)))} min
                    </span>
                  )}
                </div>
              ) : event.startTime && event.startTime.getTime() > Date.now() ? (
                <div className="flex items-center text-xs text-orange-600">
                  <span>🕒</span>
                  <span className="ml-1 font-medium">
                    Débute dans {Math.floor((event.startTime.getTime() - Date.now()) / (1000 * 60))} min
                  </span>
                </div>
              ) : null}
              
              {/* Participants */}
              {event.maxParticipants && event.currentParticipants !== undefined && (
                <div className="flex items-center text-xs text-gray-600">
                  <Users className="w-3 h-3 mr-1" />
                  <span>
                    {event.currentParticipants}/{event.maxParticipants} participants
                  </span>
                  {event.currentParticipants === event.maxParticipants && (
                    <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      Complet
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-2">
            {/* Lien cliquable */}
            {event.clickableLink && (
              <span className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium">
                {event.clickableLink.type === 'course' && '📚'}
                {event.clickableLink.type === 'pack' && '📦'}
                {event.clickableLink.type === 'buddy' && '👤'}
                {event.clickableLink.type === 'achievement' && '🏆'}
                {event.clickableLink.type === 'study-room' && '🏫'}
                <span className="ml-1">{event.clickableLink.title}</span>
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}

            {/* Actions spéciales pour les séances du fondateur */}
            {event.type === 'founder-session' && (
              <div className="flex items-center space-x-2">
                {event.isLive ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`🔴 SOCIAL FEED: Rejoindre session LIVE: ${event.studyRoomId}`);
                    }}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full hover:bg-red-600 transition-colors"
                  >
                    <span>🔴</span>
                    <span>Rejoindre LIVE</span>
                  </motion.button>
                ) : event.startTime && event.startTime.getTime() > Date.now() ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`🔔 SOCIAL FEED: S'inscrire à la session: ${event.studyRoomId}`);
                    }}
                    className="flex items-center space-x-1 px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full hover:bg-orange-600 transition-colors"
                    disabled={event.currentParticipants === event.maxParticipants}
                  >
                    <span>🔔</span>
                    <span>S'inscrire</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`📚 SOCIAL FEED: Voir replay: ${event.studyRoomId}`);
                    }}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <span>📚</span>
                    <span>Voir replay</span>
                  </motion.button>
                )}
              </div>
            )}

            {/* Micro-interaction féliciter (seulement pour les buddies) */}
            {event.type === 'buddy' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`
                  flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors
                  ${isLiked 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }
                `}
                title="Féliciter"
              >
                <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                <span>👏</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Mini-fiche buddy (apparaît au hover/clic) */}
      {showBuddyInfo && event.type === 'buddy' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {event.userName.charAt(0)}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{event.userName}</h4>
              <p className="text-sm text-gray-500">Étudiant actif</p>
              <div className="flex items-center mt-1 text-xs text-gray-400">
                <span>📚 3 cours en commun</span>
                <span className="mx-2">•</span>
                <span>🏆 250 XP cette semaine</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
