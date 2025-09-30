'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Users, Plus, Clock, Play, Crown, ExternalLink } from 'lucide-react';
import { AdvancedStudyRoom, StudyRoomStatus } from '@/types';
import { AdvancedStudyRoomService } from '@/lib/advanced-studyroom-service';
import { BuddiesService } from '@/lib/buddies-service';

interface StudyRoomHeaderWidgetProps {
  userId: string;
  userName: string;
  purchasedItems: Set<string>;
  onNavigateToStudyRooms?: () => void;
  onNavigateToUpgrade?: (courseId: string) => void;
}

export function StudyRoomHeaderWidget({
  userId,
  userName,
  purchasedItems,
  onNavigateToStudyRooms,
  onNavigateToUpgrade
}: StudyRoomHeaderWidgetProps) {
  const [activeRooms, setActiveRooms] = useState<AdvancedStudyRoom[]>([]);
  const [roomsWithBuddies, setRoomsWithBuddies] = useState<AdvancedStudyRoom[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userActiveRoom, setUserActiveRoom] = useState<AdvancedStudyRoom | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadStudyRoomsData();
    const interval = setInterval(loadStudyRoomsData, 30000); // Refresh toutes les 30s
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadStudyRoomsData = () => {
    try {
      // Charger les rooms actives
      const allActiveRooms = AdvancedStudyRoomService.getActiveStudyRooms();
      setActiveRooms(allActiveRooms);

      // Trouver la room où l'utilisateur est connecté
      const userRoom = allActiveRooms.find(room => 
        room.currentParticipants.some(p => p.userId === userId && !p.leftAt)
      );
      setUserActiveRoom(userRoom || null);

      // Charger les buddies et trouver les rooms avec des buddies
      const buddies = BuddiesService.getAllBuddies(userId);
      const buddyIds = buddies.map(b => b.buddyId);
      
      const roomsWithBuddiesInside = allActiveRooms.filter(room =>
        room.currentParticipants.some(p => 
          buddyIds.includes(p.userId) && !p.leftAt
        )
      );
      setRoomsWithBuddies(roomsWithBuddiesInside);

    } catch (error) {
      console.error('Erreur lors du chargement des Study Rooms:', error);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    const room = activeRooms.find(r => r.id === roomId);
    if (!room) return;

    // Vérifier l'accès
    const access = AdvancedStudyRoomService.checkStudyRoomAccess(userId, room.courseId, purchasedItems);
    
    if (!access.canJoin) {
      if (onNavigateToUpgrade) {
        onNavigateToUpgrade(room.courseId);
      }
      setIsOpen(false);
      return;
    }

    const success = AdvancedStudyRoomService.joinStudyRoom(roomId, userId, userName);
    if (success) {
      loadStudyRoomsData();
      setIsOpen(false);
    }
  };

  const handleLeaveRoom = (roomId: string) => {
    const success = AdvancedStudyRoomService.leaveStudyRoom(roomId, userId);
    if (success) {
      loadStudyRoomsData();
    }
  };

  const getTypeIcon = (type: 'silent' | 'interactive') => {
    return type === 'silent' ? '🔇' : '🎤';
  };

  const getTypeLabel = (type: 'silent' | 'interactive') => {
    return type === 'silent' ? 'Silencieuse' : 'Interactive';
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getBuddiesInRoom = (room: AdvancedStudyRoom) => {
    const buddies = BuddiesService.getAllBuddies(userId);
    const buddyIds = buddies.map(b => b.buddyId);
    
    return room.currentParticipants.filter(p => 
      buddyIds.includes(p.userId) && !p.leftAt
    );
  };

  const hasActiveIndicator = roomsWithBuddies.length > 0 || userActiveRoom !== null;
  const totalActiveRooms = activeRooms.length;

  return (
    <div className="relative" ref={widgetRef}>
      {/* Bouton Study Rooms avec indicateurs */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors group"
        title={`${totalActiveRooms} Study Room${totalActiveRooms > 1 ? 's' : ''} active${totalActiveRooms > 1 ? 's' : ''}`}
      >
        <Video 
          size={18} 
          className={`transition-colors ${hasActiveIndicator ? 'text-green-600' : 'text-gray-600'} group-hover:text-gray-900`} 
        />
        
        {/* Badge pour activité */}
        <AnimatePresence>
          {hasActiveIndicator && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge pour buddies */}
        <AnimatePresence>
          {roomsWithBuddies.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold">
                {roomsWithBuddies.length}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Panneau des Study Rooms */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-12 w-96 bg-white rounded-xl border border-gray-200 shadow-lg z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Study Rooms</h3>
                  <p className="text-sm text-gray-600">{totalActiveRooms} room{totalActiveRooms > 1 ? 's' : ''} active{totalActiveRooms > 1 ? 's' : ''}</p>
                </div>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToStudyRooms?.();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Voir toutes les Study Rooms"
                >
                  <ExternalLink size={16} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="max-h-80 overflow-y-auto">
              {/* Room de l'utilisateur */}
              {userActiveRoom && (
                <div className="p-4 bg-green-50 border-b border-green-100">
                  <p className="text-sm font-medium text-green-800 mb-2">Vous êtes connecté</p>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{userActiveRoom.title}</h4>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        {getTypeIcon(userActiveRoom.type)} {getTypeLabel(userActiveRoom.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{userActiveRoom.courseName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {userActiveRoom.currentParticipants.filter(p => !p.leftAt).length} participants
                      </span>
                      <button
                        onClick={() => handleLeaveRoom(userActiveRoom.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        Quitter
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rooms avec des buddies */}
              {roomsWithBuddies.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <Users size={14} />
                    Buddies connectés
                  </p>
                  
                  <div className="space-y-3">
                    {roomsWithBuddies.slice(0, 3).map((room) => {
                      const buddiesInRoom = getBuddiesInRoom(room);
                      const userInThisRoom = room.currentParticipants.some(p => p.userId === userId && !p.leftAt);
                      
                      return (
                        <div key={room.id} className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{room.title}</h4>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {getTypeIcon(room.type)}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2">{room.courseName}</p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex -space-x-1">
                              {buddiesInRoom.slice(0, 3).map((buddy) => (
                                <div
                                  key={buddy.id}
                                  className="w-5 h-5 bg-blue-500 rounded-full border border-white flex items-center justify-center text-white text-xs font-medium"
                                  title={buddy.userName}
                                >
                                  {buddy.userName.charAt(0)}
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-blue-700">
                              {buddiesInRoom.length} buddy{buddiesInRoom.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          {!userInThisRoom && (
                            <button
                              onClick={() => handleJoinRoom(room.id)}
                              className="w-full px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                            >
                              Rejoindre
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Autres rooms actives */}
              {activeRooms.filter(room => 
                !roomsWithBuddies.includes(room) && 
                room.id !== userActiveRoom?.id
              ).length > 0 && (
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Autres rooms actives</p>
                  
                  <div className="space-y-2">
                    {activeRooms
                      .filter(room => 
                        !roomsWithBuddies.includes(room) && 
                        room.id !== userActiveRoom?.id
                      )
                      .slice(0, 3)
                      .map((room) => {
                        const access = AdvancedStudyRoomService.checkStudyRoomAccess(userId, room.courseId, purchasedItems);
                        
                        return (
                          <div key={room.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 text-sm">{room.title}</h4>
                              <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                                {getTypeIcon(room.type)}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2">{room.courseName}</p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {room.currentParticipants.filter(p => !p.leftAt).length} participants
                              </span>
                              
                              {access.canJoin ? (
                                <button
                                  onClick={() => handleJoinRoom(room.id)}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                                >
                                  Rejoindre
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    onNavigateToUpgrade?.(room.courseId);
                                    setIsOpen(false);
                                  }}
                                  className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium hover:bg-orange-200 transition-colors"
                                >
                                  Débloquer
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* État vide */}
              {totalActiveRooms === 0 && (
                <div className="p-6 text-center">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-3">Aucune Study Room active</p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onNavigateToStudyRooms?.();
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Créer une Room</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {totalActiveRooms > 0 && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToStudyRooms?.();
                  }}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Voir toutes les Study Rooms
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



