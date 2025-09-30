'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Users,
  Plus,
  Search,
  Filter,
  Clock,
  Settings,
  Lock,
  Globe,
  VolumeX,
  Volume2,
  Calendar,
  Play,
  Eye,
  EyeOff,
  Crown,
  AlertTriangle,
  Flag,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  AdvancedStudyRoom,
  StudyRoomType,
  StudyRoomVisibility,
  StudyRoomStatus,
  StudyRoomAccess,
  Course
} from '@/types';
import { AdvancedStudyRoomService } from '@/lib/advanced-studyroom-service';
import { CreateStudyRoomModal, StudyRoomFormData } from './CreateStudyRoomModal';
import { StudyRoomModal } from './StudyRoomModal';
import { GamificationService } from '@/lib/gamification-service';

interface AdvancedStudyRoomsTabProps {
  userId: string;
  userName: string;
  purchasedItems: Set<string>;
  onNavigateToUpgrade?: (courseId: string) => void;
  userCourses?: Course[];
  isAdmin?: boolean;
}

export function AdvancedStudyRoomsTab({
  userId,
  userName,
  purchasedItems,
  onNavigateToUpgrade,
  userCourses = [],
  isAdmin = false
}: AdvancedStudyRoomsTabProps) {
  const [studyRooms, setStudyRooms] = useState<AdvancedStudyRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<AdvancedStudyRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | StudyRoomType>('all');
  const [filterVisibility, setFilterVisibility] = useState<'all' | StudyRoomVisibility>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | StudyRoomStatus>('all');
  
  // Nouveaux filtres avancés
  const [filterCourse, setFilterCourse] = useState<'all' | string>('all');
  const [showBuddyRoomsFirst, setShowBuddyRoomsFirst] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'participants' | 'buddies' | 'xp'>('buddies');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRoomForReport, setSelectedRoomForReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStudyRoomModal, setShowStudyRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<AdvancedStudyRoom | null>(null);

  useEffect(() => {
    loadStudyRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [studyRooms, searchQuery, filterType, filterVisibility, filterStatus, filterCourse, showBuddyRoomsFirst, sortBy]);

  const loadStudyRooms = () => {
    setIsLoading(true);
    try {
      const rooms = AdvancedStudyRoomService.getAllStudyRooms();
      setStudyRooms(rooms);
    } catch (error) {
      console.error('Erreur lors du chargement des Study Rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = studyRooms;

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(room =>
        room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.creatorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par type
    if (filterType !== 'all') {
      filtered = filtered.filter(room => room.type === filterType);
    }

    // Filtre par visibilité
    if (filterVisibility !== 'all') {
      filtered = filtered.filter(room => room.visibility === filterVisibility);
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(room => room.status === filterStatus);
    }

    // 🆕 Filtre par cours
    if (filterCourse !== 'all') {
      filtered = filtered.filter(room => room.courseId === filterCourse);
    }

    // 🆕 Tri intelligent avec priorisation des buddies
    filtered.sort((a, b) => {
      // 1. Priorité absolue : Study Rooms "Compléments"
      if (a.isComplement && !b.isComplement) return -1;
      if (!a.isComplement && b.isComplement) return 1;

      // 2. Priorisation des buddies si activée
      if (showBuddyRoomsFirst) {
        const aBuddies = a.hasActiveBuddies ? 1 : 0;
        const bBuddies = b.hasActiveBuddies ? 1 : 0;
        if (aBuddies !== bBuddies) return bBuddies - aBuddies;
      }

      // 3. Tri selon le critère sélectionné
      switch (sortBy) {
        case 'buddies':
          return (b.buddyCount || 0) - (a.buddyCount || 0);
        case 'participants':
          return b.currentParticipants.length - a.currentParticipants.length;
        case 'xp':
          return (b.xpReward || 0) - (a.xpReward || 0);
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredRooms(filtered);
  };


  const handleLeaveRoom = (roomId: string) => {
    const success = AdvancedStudyRoomService.leaveStudyRoom(roomId, userId);
    if (success) {
      loadStudyRooms();
    }
  };

  const handleReportRoom = (roomId: string) => {
    setSelectedRoomForReport(roomId);
    setShowReportModal(true);
  };

  const handleCreateRoom = (formData: StudyRoomFormData) => {
    try {
      const newRoom = AdvancedStudyRoomService.createStudyRoom({
        courseId: formData.courseId,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        visibility: formData.visibility,
        createdBy: userId,
        creatorName: userName,
        startsAt: formData.isImmediate ? new Date() : (formData.startsAt || new Date()),
        estimatedDuration: formData.estimatedDuration,
        isComplement: formData.isComplement,
        enableRecording: formData.enableRecording
      });

      console.log('✅ Study Room créée avec succès:', newRoom);
      loadStudyRooms();
      setShowCreateModal(false);
    } catch (error) {
      console.error('❌ Erreur lors de la création de la Study Room:', error);
    }
  };

  const handleJoinRoom = (room: AdvancedStudyRoom) => {
    console.log('🎯 Rejoindre Study Room:', room.title);
    
    // Vérification de l'accès
    const access = AdvancedStudyRoomService.checkStudyRoomAccess(userId, room.courseId, purchasedItems);
    
    if (!access.canJoin) {
      alert('Vous devez avoir un cours complet ou un pack pour accéder aux Study Rooms.');
      if (onNavigateToUpgrade) {
        onNavigateToUpgrade(room.courseId);
      }
      return;
    }
    
    // Award XP pour rejoindre une Study Room
    const xpResult = GamificationService.awardXP(userId, 'study-room-join', 20);
    if (xpResult.levelUp) {
      console.log('🎉 Level Up! Nouveau niveau:', xpResult.newLevel);
    }
    
    // Ouvrir la Study Room sélectionnée
    setSelectedRoom(room);
    setShowStudyRoomModal(true);
    
    console.log('✅ Connexion à la Study Room:', room.title);
  };

  const getTypeIcon = (type: StudyRoomType) => {
    return type === 'silent' ? <VolumeX size={16} /> : <Volume2 size={16} />;
  };

  const getTypeLabel = (type: StudyRoomType) => {
    return type === 'silent' ? 'Silencieuse' : 'Interactive';
  };

  const getTypeColor = (type: StudyRoomType) => {
    return type === 'silent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
  };

  const getVisibilityIcon = (visibility: StudyRoomVisibility) => {
    switch (visibility) {
      case 'public': return <Globe size={14} />;
      case 'buddies': return <Users size={14} />;
      case 'private': return <Lock size={14} />;
    }
  };

  const getVisibilityLabel = (visibility: StudyRoomVisibility) => {
    const labels = {
      'public': 'Publique',
      'buddies': 'Buddies uniquement',
      'private': 'Privée'
    };
    return labels[visibility];
  };

  const getStatusColor = (status: StudyRoomStatus) => {
    const colors = {
      'scheduled': 'bg-yellow-100 text-yellow-700',
      'live': 'bg-green-100 text-green-700',
      'ended': 'bg-gray-100 text-gray-700',
      'cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status];
  };

  const getStatusLabel = (status: StudyRoomStatus) => {
    const labels = {
      'scheduled': 'Programmée',
      'live': 'En cours',
      'ended': 'Terminée',
      'cancelled': 'Annulée'
    };
    return labels[status];
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short'
    }).format(new Date(date));
  };

  const isUserInRoom = (room: AdvancedStudyRoom) => {
    return room.currentParticipants.some(p => p.userId === userId && !p.leftAt);
  };

  const getUserRoomRole = (room: AdvancedStudyRoom) => {
    const participant = room.currentParticipants.find(p => p.userId === userId && !p.leftAt);
    return participant?.role;
  };

  const getBuddiesInRoom = (room: AdvancedStudyRoom) => {
    return room.currentParticipants.filter(p => p.isBuddy && !p.leftAt);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Chargement des Study Rooms...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Rooms</h2>
          <p className="text-gray-600 mt-1">Espaces collaboratifs d'apprentissage</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>Créer une Room</span>
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Barre de recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par titre, cours ou créateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous types</option>
            <option value="silent">Silencieuse</option>
            <option value="interactive">Interactive</option>
          </select>

          <select
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes visibilités</option>
            <option value="public">Publique</option>
            <option value="buddies">Buddies</option>
            <option value="private">Privée</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous statuts</option>
            <option value="scheduled">Programmée</option>
            <option value="live">En cours</option>
            <option value="ended">Terminée</option>
          </select>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3 py-2 border rounded-lg transition-colors ${
              showAdvancedFilters 
                ? 'bg-blue-100 border-blue-300 text-blue-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* 🆕 Filtres Avancés */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-xl p-4 space-y-4"
          >
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Filter size={14} />
              Filtres Avancés
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtre par cours */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cours</label>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les cours</option>
                  {userCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              {/* Tri */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="buddies">🤝 Buddies</option>
                  <option value="participants">👥 Participants</option>
                  <option value="xp">⚡ Points XP</option>
                  <option value="recent">🕒 Récent</option>
                </select>
              </div>

              {/* Priorisation buddies */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priorité</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBuddyRoomsFirst}
                    onChange={(e) => setShowBuddyRoomsFirst(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Rooms avec buddies en premier</span>
                </label>
              </div>

              {/* Statistiques */}
              <div className="flex flex-col justify-center">
                <div className="text-xs text-gray-500">
                  {filteredRooms.length} room{filteredRooms.length > 1 ? 's' : ''} trouvée{filteredRooms.length > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-gray-500">
                  {filteredRooms.filter(r => r.hasActiveBuddies).length} avec buddies
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des Study Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune Study Room trouvée</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterType !== 'all' || filterVisibility !== 'all' || filterStatus !== 'all'
                ? 'Essayez de modifier vos filtres'
                : 'Créez la première Study Room pour commencer'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              <span>Créer une Study Room</span>
            </button>
          </div>
        ) : (
          filteredRooms.map((room) => {
            const userInRoom = isUserInRoom(room);
            const userRole = getUserRoomRole(room);
            const buddiesInRoom = getBuddiesInRoom(room);
            const access = AdvancedStudyRoomService.checkStudyRoomAccess(userId, room.courseId, purchasedItems);
            
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{room.title}</h3>
                    {room.isComplement && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        <Crown size={12} />
                        Compléments
                      </span>
                    )}
                    {room.hasActiveBuddies && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        <Users size={12} />
                        Buddies
                      </span>
                    )}
                    {userRole === 'moderator' && !room.isComplement && (
                      <Crown className="text-yellow-500" size={16} />
                    )}
                  </div>
                    <p className="text-sm text-gray-600">{room.courseName}</p>
                    <p className="text-xs text-gray-500">Par {room.creatorName}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Badges de type et visibilité */}
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(room.type)}`}>
                      {getTypeIcon(room.type)}
                      {getTypeLabel(room.type)}
                    </span>
                    
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {getVisibilityIcon(room.visibility)}
                      {getVisibilityLabel(room.visibility)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {room.description && (
                  <p className="text-sm text-gray-600 mb-4">{room.description}</p>
                )}

                {/* Infos temporelles */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(room.startsAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{formatTime(room.startsAt)} - {formatTime(room.endsAt || room.startsAt)}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {getStatusLabel(room.status)}
                  </span>
                </div>

                {/* Participants */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {room.currentParticipants.filter(p => !p.leftAt).length} participant(s)
                    </span>
                    {room.maxParticipants && (
                      <span className="text-xs text-gray-500">/ {room.maxParticipants}</span>
                    )}
                  </div>

                  {/* Buddies dans la room */}
                  {buddiesInRoom.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        {buddiesInRoom.slice(0, 3).map((buddy) => (
                          <div
                            key={buddy.id}
                            className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                            title={buddy.userName}
                          >
                            {buddy.userName.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-blue-600 font-medium">
                        {buddiesInRoom.length} buddy{buddiesInRoom.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {userInRoom ? (
                    <button
                      onClick={() => handleLeaveRoom(room.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                    >
                      Quitter
                    </button>
                  ) : access.canJoin ? (
                    <button
                      onClick={() => handleJoinRoom(room)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Rejoindre
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateToUpgrade?.(room.courseId)}
                      className="flex-1 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors"
                    >
                      Débloquer cours
                    </button>
                  )}

                  {/* Bouton de signalement */}
                  <button
                    onClick={() => handleReportRoom(room.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Signaler un abus"
                  >
                    <Flag size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal de signalement (simplifié) */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Signaler un abus</h3>
            <p className="text-gray-600 mb-6">
              Votre signalement sera examiné par notre équipe de modération.
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedRoomForReport(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Logique de signalement
                  console.log('Signalement envoyé pour:', selectedRoomForReport);
                  setShowReportModal(false);
                  setSelectedRoomForReport(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Signaler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de Study Room */}
      <CreateStudyRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleCreateRoom}
        userCourses={userCourses}
        isAdmin={isAdmin}
      />

      {/* Modal Study Room */}
      {selectedRoom && (
        <StudyRoomModal
          isOpen={showStudyRoomModal}
          onClose={() => {
            setShowStudyRoomModal(false);
            setSelectedRoom(null);
          }}
          room={{
            id: selectedRoom.id,
            name: selectedRoom.title,
            courseName: selectedRoom.courseName,
            currentUsers: [`${userId}`],
            maxUsers: 10,
            isActive: selectedRoom.status === 'live'
          }}
          currentUserId={userId}
        />
      )}
    </div>
  );
}
