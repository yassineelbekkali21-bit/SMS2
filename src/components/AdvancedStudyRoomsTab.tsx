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
  XCircle,
  X,
  Home,
  Zap,
  FileText,
  Calculator,
  Sparkles,
  Brain
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
  onNavigateToCourseReplay?: (courseId: string, replayId: string) => void;
  userCourses?: Course[];
  isAdmin?: boolean;
}

export function AdvancedStudyRoomsTab({
  userId,
  userName,
  purchasedItems,
  onNavigateToUpgrade,
  onNavigateToCourseReplay,
  userCourses = [],
  isAdmin = false
}: AdvancedStudyRoomsTabProps) {
  const [studyRooms, setStudyRooms] = useState<AdvancedStudyRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<AdvancedStudyRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🎯 Filtres horizontaux originaux des Study Rooms
  const [filterType, setFilterType] = useState<'all' | StudyRoomType | 'complement'>('all');
  const [filterVisibility, setFilterVisibility] = useState<'all' | StudyRoomVisibility>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | StudyRoomStatus>('all');
  const [filterSubject, setFilterSubject] = useState<'all' | 'physics' | 'chemistry' | 'mathematics' | 'biology'>('all');
  
  // Anciens filtres avancés
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'participants' | 'buddies' | 'xp'>('buddies');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRoomForReport, setSelectedRoomForReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStudyRoomModal, setShowStudyRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<AdvancedStudyRoom | null>(null);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [accessDeniedCourseId, setAccessDeniedCourseId] = useState<string | null>(null);
  const [accessDeniedType, setAccessDeniedType] = useState<'registration' | 'replay'>('registration');

  useEffect(() => {
    loadStudyRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [studyRooms, searchQuery, filterType, filterVisibility, filterStatus, filterSubject, sortBy]);

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

    // 🎯 FILTRE PAR TYPE (Silent/Interactive/Compléments)
    if (filterType !== 'all') {
      if (filterType === 'complement') {
        // ⭐ SESSIONS SPÉCIALES DE ZAK
        filtered = filtered.filter(room => room.isComplement);
      } else {
      filtered = filtered.filter(room => room.type === filterType);
      }
    }

    // 🎯 FILTRE PAR VISIBILITÉ (Public/Buddies/Private)
    if (filterVisibility !== 'all') {
      filtered = filtered.filter(room => room.visibility === filterVisibility);
    }

    // 🎯 FILTRE PAR STATUT (Scheduled/Live/Ended)
    if (filterStatus !== 'all') {
      filtered = filtered.filter(room => room.status === filterStatus);
    }

    // 🎯 FILTRE PAR MATIÈRE (Physics/Chemistry/Mathematics/Biology)
    if (filterSubject !== 'all') {
      filtered = filtered.filter(room => {
        const courseName = room.courseName.toLowerCase();
        switch (filterSubject) {
          case 'physics':
            return courseName.includes('physique') || courseName.includes('mécanique') || courseName.includes('électro') || courseName.includes('gauss');
          case 'chemistry':
            return courseName.includes('chimie');
          case 'mathematics':
            return courseName.includes('math') || courseName.includes('probabilité') || courseName.includes('algèbre');
          case 'biology':
            return courseName.includes('biologie') || courseName.includes('bio');
          default:
            return true;
        }
      });
    }

    // 🆕 Tri intelligent
    filtered.sort((a, b) => {
      // 1. Priorité absolue : Study Rooms "Compléments"
      if (a.isComplement && !b.isComplement) return -1;
      if (!a.isComplement && b.isComplement) return 1;

      // 2. Tri selon le critère sélectionné
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

  const handleViewReplay = (room: AdvancedStudyRoom) => {
    console.log('📺 Tentative de voir le replay:', room.title);
    
    // Vérification de l'accès au cours
    const access = AdvancedStudyRoomService.checkStudyRoomAccess(userId, room.courseId, purchasedItems);
    
    if (!access.canJoin) {
      // Afficher le modal d'accès refusé pour replay
      setAccessDeniedCourseId(room.courseId);
      setAccessDeniedType('replay');
      setShowAccessDeniedModal(true);
      return;
    }
    
    // Si l'utilisateur a accès, ouvrir le replay
    console.log('✅ Accès autorisé - Ouverture du replay');
    if (onNavigateToCourseReplay) {
      onNavigateToCourseReplay(room.courseId, room.id);
    }
  };

  const handleRegisterForComplement = (room: AdvancedStudyRoom) => {
    console.log('📅 Inscription à la session Compléments:', room.title);
    
    // Vérification de l'accès au cours
    const access = AdvancedStudyRoomService.checkStudyRoomAccess(userId, room.courseId, purchasedItems);
    
    if (!access.canJoin) {
      // Afficher le modal d'accès refusé pour inscription
      setAccessDeniedCourseId(room.courseId);
      setAccessDeniedType('registration');
      setShowAccessDeniedModal(true);
      return;
    }
    
    // Si l'utilisateur a accès, procéder à l'inscription
    handleJoinRoom(room);
  };

  const handleJoinRoom = (room: AdvancedStudyRoom) => {
    console.log('🎯 Rejoindre Study Room:', room.title);
    
    // ⭐ CAS SPÉCIAL : Session "Compléments" terminée → Redirection vers le replay
    if (room.isComplement && room.status === 'ended' && room.replayAddedToCourse) {
      console.log('📺 Redirection vers le replay de la session Compléments');
      if (onNavigateToCourseReplay) {
        onNavigateToCourseReplay(room.courseId, room.id);
      }
      return;
    }
    
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
    return 'bg-gray-100 text-gray-700';
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
    return 'bg-gray-100 text-gray-700';
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
      <div className="flex flex-col items-center justify-center p-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <span className="mt-6 text-gray-700 font-medium">Chargement des Study Rooms...</span>
        <span className="mt-2 text-sm text-gray-500">Préparation de l'espace collaboratif</span>
      </div>
    );
  }

  return (
    <div className="p-6 pt-10 space-y-8">
      {/* Header moderne avec gradient */}
      <div className="relative">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 rounded-3xl -z-10" />
        
        <div className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
                Study Rooms
              </h2>
              <p className="text-gray-600">Espaces collaboratifs d'apprentissage</p>
        </div>
        
            <div className="flex items-center gap-3">
              {/* Bouton de debug temporaire - TRÈS VISIBLE */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔄 BOUTON RELOAD CLIQUÉ - Suppression du cache...');
                  localStorage.removeItem('advanced_study_rooms_v1');
                  localStorage.removeItem('advanced_study_rooms_v1_version');
                  console.log('✅ Cache supprimé, rechargement...');
                  setTimeout(() => window.location.reload(), 100);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(245, 158, 11, 0)',
                    '0 0 0 10px rgba(245, 158, 11, 0)',
                    '0 0 0 0 rgba(245, 158, 11, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all text-base shadow-xl"
                title="CLIQUEZ ICI pour voir les suggestions !"
              >
                🔄 RELOAD DATA (CLIQUEZ-MOI!)
              </motion.button>
              
              <motion.button
          onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg shadow-gray-900/20"
        >
                <Plus size={18} />
          <span>Créer une Room</span>
              </motion.button>
            </div>
      </div>

          {/* Recherche et filtres modernes */}
          <div className="mt-6 space-y-6">
        {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par titre, cours ou créateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm transition-all"
          />
        </div>

            {/* 🎯 Système de filtres horizontaux */}
            <div className="flex items-start gap-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              
              {/* TYPE */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Type</span>
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'Tous', icon: Video },
                    { id: 'silent', label: 'Silencieuse', icon: VolumeX },
                    { id: 'interactive', label: 'Interactive', icon: Volume2 },
                    { id: 'complement', label: 'Compléments', icon: Crown, highlight: true },
                  ].map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setFilterType(type.id as any)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                        filterType === type.id
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <type.icon size={20} />
                      <span className="text-xs font-semibold whitespace-nowrap">{type.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* VISIBILITÉ */}
              <div className="flex flex-col gap-3 border-l border-gray-200 pl-8">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Visibilité</span>
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'Toutes', icon: Eye },
                    { id: 'public', label: 'Publique', icon: Globe },
                    { id: 'buddies', label: 'Buddies', icon: Users },
                    { id: 'private', label: 'Privée', icon: Lock },
                  ].map((visibility) => (
                    <motion.button
                      key={visibility.id}
                      onClick={() => setFilterVisibility(visibility.id as any)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                        filterVisibility === visibility.id
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <visibility.icon size={20} />
                      <span className="text-xs font-semibold whitespace-nowrap">{visibility.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* STATUT */}
              <div className="flex flex-col gap-3 border-l border-gray-200 pl-8">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Statut</span>
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'Tous', icon: Clock },
                    { id: 'live', label: 'En cours', icon: Play },
                    { id: 'scheduled', label: 'Programmée', icon: Calendar },
                    { id: 'ended', label: 'Terminée', icon: CheckCircle },
                  ].map((status) => (
                    <motion.button
                      key={status.id}
                      onClick={() => setFilterStatus(status.id as any)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                        filterStatus === status.id
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <status.icon size={20} />
                      <span className="text-xs font-semibold whitespace-nowrap">{status.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* 🎯 Filtre par MATIÈRE (nouvelle ligne) */}
            <div className="mt-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 block mb-3">Matières</span>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'Toutes', icon: Home },
                  { id: 'physics', label: 'Physique', icon: Zap },
                  { id: 'chemistry', label: 'Chimie', icon: FileText },
                  { id: 'mathematics', label: 'Maths', icon: Calculator },
                  { id: 'biology', label: 'Biologie', icon: Brain },
                ].map((subject) => (
                  <motion.button
                    key={subject.id}
                    onClick={() => setFilterSubject(subject.id as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                      filterSubject === subject.id
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <subject.icon size={20} />
                    <span className="text-xs font-semibold whitespace-nowrap">{subject.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🆕 Filtres Avancés */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-gray-900 rounded-lg">
                  <Filter size={16} className="text-white" />
                </div>
              Filtres Avancés
            </h3>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtre par cours */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Cours</label>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium text-gray-700 transition-all cursor-pointer"
                >
                  <option value="all">Tous les cours</option>
                  {userCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              {/* Tri */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium text-gray-700 transition-all cursor-pointer"
                >
                  <option value="buddies">🤝 Buddies</option>
                  <option value="participants">👥 Participants</option>
                  <option value="xp">⚡ Points XP</option>
                  <option value="recent">🕒 Récent</option>
                </select>
              </div>

              {/* Priorisation buddies */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Priorité</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
                  <input
                    type="checkbox"
                    checked={showBuddyRoomsFirst}
                    onChange={(e) => setShowBuddyRoomsFirst(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm font-medium text-gray-700">Buddies en premier</span>
                </label>
              </div>

              {/* Statistiques */}
              <div className="flex flex-col justify-center p-3 bg-white border border-gray-200 rounded-xl">
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {filteredRooms.length} room{filteredRooms.length > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-gray-600">
                  {filteredRooms.filter(r => r.hasActiveBuddies).length} avec buddies
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions de Study Rooms */}
      {(() => {
        // Algorithme de suggestion intelligent avec scoring
        const allAccessibleRooms = studyRooms.filter(room => {
          const access = AdvancedStudyRoomService.checkStudyRoomAccess(userId, room.courseId, purchasedItems);
          return access.canJoin && !isUserInRoom(room);
        });
        
        console.log('🎯 Study Rooms accessibles pour suggestions:', allAccessibleRooms.length);
        
        const suggestedRooms = allAccessibleRooms
          .map(room => {
            let score = 0;
            const buddiesInRoom = getBuddiesInRoom(room);
            const participantCount = room.currentParticipants.filter(p => !p.leftAt).length;
            
            // 🔥 PRIORITÉ 1 : Compléments live (score très élevé)
            if (room.isComplement && room.status === 'live') {
              score += 1000;
            }
            
            // 👥 PRIORITÉ 2 : Buddies présents (points par buddy)
            if (buddiesInRoom.length > 0) {
              score += buddiesInRoom.length * 100;
            }
            
            // 🔥 PRIORITÉ 3 : Niveau d'interaction (nombre de participants actifs)
            if (room.status === 'live') {
              score += participantCount * 20; // Plus il y a de monde, plus c'est intéressant
              
              // Bonus si room interactive
              if (room.type === 'interactive') {
                score += 50;
              }
            }
            
            // ⏰ PRIORITÉ 4 : Compléments programmé bientôt
            if (room.isComplement && room.status === 'scheduled' && room.startsAt) {
              const timeUntilStart = new Date(room.startsAt).getTime() - Date.now();
              if (timeUntilStart < 3600000 && timeUntilStart > 0) { // Moins d'1h
                score += 500 - (timeUntilStart / 7200); // Plus c'est proche, plus le score est élevé
              }
            }
            
            // ⏰ PRIORITÉ 5 : Session normale programmée bientôt
            if (room.status === 'scheduled' && room.startsAt) {
              const timeUntilStart = new Date(room.startsAt).getTime() - Date.now();
              if (timeUntilStart < 1800000 && timeUntilStart > 0) { // Moins de 30min
                score += 200 - (timeUntilStart / 9000);
              }
            }
            
            return { room, score };
          })
          .filter(({ score }) => score > 0) // Garder uniquement les rooms avec un score
          .sort((a, b) => b.score - a.score) // Trier par score décroissant
          .slice(0, 3) // Maximum 3 suggestions
          .map(({ room }) => room);

        console.log('✨ Suggestions trouvées:', suggestedRooms.length, suggestedRooms.map(r => ({ 
          id: r.id, 
          name: r.courseName, 
          isComplement: r.isComplement, 
          status: r.status,
          buddyCount: r.buddyCount
        })));

        if (suggestedRooms.length === 0) {
          console.log('❌ Aucune suggestion - retour null');
          return null;
        }

        return (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Suggestions pour vous</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedRooms.map((room) => {
                const buddiesInRoom = getBuddiesInRoom(room);
                
                return (
                  <motion.div
                    key={`suggested-${room.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200 shadow-lg shadow-blue-500/10 overflow-hidden"
                  >
                    {/* Badges en haut à droite */}
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      {/* Badge LIVE (rouge) si la session est live */}
                      {room.status === 'live' && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-md shadow-lg animate-pulse">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          LIVE
                        </div>
                      )}
                      {/* Badge "Compléments" (ambre) si c'est une session Compléments */}
                      {room.isComplement && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-600 text-white text-xs font-bold rounded-md shadow-lg">
                          <Crown className="w-3 h-3" />
                          Compléments
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-base text-gray-900 mb-2 pr-28">{room.courseName}</h4>
                    
                    {/* Raison de la suggestion */}
                    <div className="space-y-2 mb-3">
                      {/* Buddies présents */}
                      {buddiesInRoom.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="flex -space-x-1.5">
                            {buddiesInRoom.slice(0, 3).map((buddy) => (
                              <div
                                key={buddy.id}
                                className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                title={buddy.userName}
                              >
                                {buddy.userName.charAt(0)}
                              </div>
                            ))}
                          </div>
                          <span className="font-medium">
                            {buddiesInRoom.length} {buddiesInRoom.length > 1 ? 'buddies' : 'buddy'} 
                            {room.status === 'live' ? ' en ligne' : ' inscrit(s)'}
                          </span>
                        </div>
                      )}
                      
                      {/* Niveau d'activité */}
                      {room.status === 'live' && room.currentParticipants.filter(p => !p.leftAt).length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>
                            {room.currentParticipants.filter(p => !p.leftAt).length} participant{room.currentParticipants.filter(p => !p.leftAt).length > 1 ? 's' : ''} 
                            {room.type === 'interactive' ? ' • Interactive' : ' actif(s)'}
                          </span>
                        </div>
                      )}
                      
                      {/* Commence bientôt */}
                      {room.status === 'scheduled' && room.startsAt && (
                        <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">
                            Commence dans {Math.round((new Date(room.startsAt).getTime() - Date.now()) / 60000)} min
                            {room.isComplement && ' • Avec Zak'}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleJoinRoom(room)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all text-sm shadow-lg shadow-blue-500/30"
                    >
                      Rejoindre maintenant
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Liste des Study Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <Video className="w-20 h-20 text-gray-300 mx-auto mb-5" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune Study Room trouvée</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery || filterType !== 'all' || filterVisibility !== 'all' || filterStatus !== 'all' || filterSubject !== 'all'
                ? 'Essayez de modifier vos filtres pour trouver d\'autres Study Rooms'
                : 'Créez la première Study Room pour commencer à étudier en collaboration'}
            </p>
            <motion.button
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg shadow-gray-900/20"
            >
              <Plus size={18} />
              <span>Créer une Study Room</span>
            </motion.button>
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
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/40 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/0 via-white/0 to-blue-50/0 group-hover:from-gray-50/30 group-hover:via-white/30 group-hover:to-blue-50/30 transition-all duration-500 -z-10 rounded-xl" />
                
                {/* Header - Simplifié */}
                <div className="mb-3 pb-3 border-b border-gray-100">
                  {/* Badges en haut - Tous affichés */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {room.isComplement && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-semibold">
                        <Crown size={12} />
                        Compléments
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${getTypeColor(room.type)}`}>
                      {getTypeIcon(room.type)}
                      {getTypeLabel(room.type)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${getStatusColor(room.status)}`}>
                      {getStatusLabel(room.status)}
                    </span>
                </div>

                  {/* Titre = Nom du cours uniquement */}
                  <h3 className="font-bold text-base text-gray-900 mb-1">{room.courseName}</h3>
                  <p className="text-xs text-gray-500">Par {room.creatorName}</p>
                </div>

                {/* Participants - Épuré */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {room.currentParticipants.filter(p => !p.leftAt).length}
                    </span>
                    <span className="text-gray-500">participant{room.currentParticipants.filter(p => !p.leftAt).length > 1 ? 's' : ''}</span>
                  </div>

                  {/* Buddies dans la room */}
                  {buddiesInRoom.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {buddiesInRoom.slice(0, 3).map((buddy) => (
                          <div
                            key={buddy.id}
                            className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md"
                            title={buddy.userName}
                          >
                            {buddy.userName.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-medium text-orange-600">
                        {buddiesInRoom.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Date et heure pour sessions programmées */}
                {room.status === 'scheduled' && room.startsAt && (
                  <div className="mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 opacity-60 rounded-xl" />
                    <div className="relative bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex flex-col items-center justify-center text-white shadow-lg shadow-gray-900/20">
                          <span className="text-xs font-medium opacity-90 uppercase">
                            {new Date(room.startsAt).toLocaleDateString('fr-FR', { month: 'short' })}
                          </span>
                          <span className="text-lg font-bold leading-none">
                            {new Date(room.startsAt).getDate()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 capitalize mb-1">
                            {new Date(room.startsAt).toLocaleDateString('fr-FR', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-900" />
                              <span className="font-medium">
                                {new Date(room.startsAt).toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            {room.estimatedDuration && (
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                <span>{room.estimatedDuration} min</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions - Uniformes */}
                <div className="flex items-center gap-2">
                  {/* ⭐ CAS 1 : Session "Compléments" terminée avec replay disponible */}
                  {room.isComplement && room.status === 'ended' && room.replayAddedToCourse ? (
                    <button
                      onClick={() => handleViewReplay(room)}
                      className="w-[155px] px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Play size={16} />
                      <span>Voir le replay</span>
                    </button>
                  ) : 
                  /* ⭐ CAS 2 : Session "Compléments" programmée (scheduled) */
                  room.isComplement && room.status === 'scheduled' ? (
                    access.canJoin ? (
                      <button
                        onClick={() => handleJoinRoom(room)}
                        className="w-[155px] px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <Calendar size={16} />
                        <span>Rejoindre</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegisterForComplement(room)}
                        className="w-[155px] px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <Calendar size={16} />
                        <span>S'inscrire</span>
                      </button>
                    )
                  ) : 
                  /* ⭐ CAS 3 : Utilisateur déjà dans la room */
                  userInRoom ? (
                    <button
                      onClick={() => handleLeaveRoom(room.id)}
                      className="w-[155px] px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all text-sm whitespace-nowrap"
                    >
                      Quitter
                    </button>
                  ) : 
                  /* ⭐ CAS 4 : Accès autorisé - Rejoindre (noir) */
                  access.canJoin ? (
                    <button
                      onClick={() => handleJoinRoom(room)}
                      className="w-[155px] px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all text-sm whitespace-nowrap"
                    >
                      Rejoindre
                    </button>
                  ) : 
                  /* ⭐ CAS 5 : Cours non débloqué - Débloquer (bleu) */
                  (
                    <button
                      onClick={() => onNavigateToUpgrade?.(room.courseId)}
                      className="w-[155px] px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all text-sm whitespace-nowrap"
                    >
                      Débloquer cours
                    </button>
                  )}

                  {/* Bouton de signalement - discret */}
                  <button
                    onClick={() => handleReportRoom(room.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Signaler"
                  >
                    <Flag size={14} />
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

      {/* Modal d'accès refusé pour sessions Compléments */}
      {showAccessDeniedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl max-w-lg w-full p-8"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-100/50">
                <Lock className="w-9 h-9 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {accessDeniedType === 'replay' 
                  ? 'Un contenu exclusif vous attend ! 📺'
                  : 'Une session exclusive vous attend ! 🎓'
                }
              </h3>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                {accessDeniedType === 'replay' 
                  ? (
                    <>
                      Ce replay de la session <span className="font-semibold text-gray-900">Compléments avec Zak</span> est réservé aux étudiants ayant débloqué le cours complet.
                    </>
                  )
                  : (
                    <>
                      Cette session <span className="font-semibold text-gray-900">Compléments avec Zak</span> est réservée aux étudiants ayant débloqué le cours complet.
                    </>
                  )
                }
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-2">
                <p className="text-sm text-blue-900 font-medium">
                  ✨ Débloquez maintenant et accédez à :
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1 text-left">
                  <li>• Toutes les sessions Compléments</li>
                  <li>• Les replays exclusifs</li>
                  <li>• L'accompagnement personnalisé de Zak</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowAccessDeniedModal(false);
                  setAccessDeniedCourseId(null);
                }}
                className="flex-1 px-4 py-3 text-gray-600 bg-white rounded-xl hover:bg-gray-50 transition-all font-medium border border-gray-200"
              >
                Plus tard
              </button>
              <button
                onClick={() => {
                  setShowAccessDeniedModal(false);
                  if (accessDeniedCourseId && onNavigateToUpgrade) {
                    onNavigateToUpgrade(accessDeniedCourseId);
                  }
                  setAccessDeniedCourseId(null);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-500/30"
              >
                Débloquer le cours →
              </button>
            </div>
          </motion.div>
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
