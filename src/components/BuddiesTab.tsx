'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  MessageCircle,
  VideoIcon,
  Clock,
  Heart,
  BookOpen,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Sparkles,
  UserPlus,
  ExternalLink,
  Zap,
  Trophy,
  Star,
  ShoppingCart,
  CircleDot,
  Wifi,
  WifiOff
} from 'lucide-react';
import { BuddyRelation, BuddyInvitation, BuddyDiscovery, BuddyType, UserStatus, Course } from '@/types';
import { BuddiesService } from '@/lib/buddies-service';
import { ModernBuddyInviteModal } from './ModernBuddyInviteModal';
import { AdvancedStudyRoomService } from '@/lib/advanced-studyroom-service';
import { GamificationService } from '@/lib/gamification-service';
import { EnhancedNotificationsService } from '@/lib/enhanced-notifications-service';

interface BuddiesTabProps {
  userId: string;
  userName: string;
  userCourses?: Course[];
}

export function BuddiesTab({ userId, userName, userCourses = [] }: BuddiesTabProps) {
  const [buddies, setBuddies] = useState<BuddyRelation[]>([]);
  const [pendingRequests, setPendingRequests] = useState<BuddyRelation[]>([]);
  const [discoveredUsers, setDiscoveredUsers] = useState<BuddyDiscovery[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showModernInviteModal, setShowModernInviteModal] = useState(false);
  const [inviteType, setInviteType] = useState<'search' | 'phone'>('search');
  const [isLoading, setIsLoading] = useState(true);
  const [crossSellingOpportunities, setCrossSellingOpportunities] = useState<Array<{
    buddyId: string;
    buddyName: string;
    courseId: string;
    courseName: string;
    priceEuros: number;
  }>>([]);

  // Helper function pour récupérer le nom d'un buddy
  const getBuddyName = (buddyId: string): string => {
    const userNames: { [key: string]: string } = {
      'user_marie': 'Marie Dubois',
      'user_pierre': 'Pierre Martin',
      'user_sophie': 'Sophie Laurent',
      'user_alex': 'Alex Durand',
      'user_lisa': 'Lisa Chen',
      'user_thomas': 'Thomas Rousseau'
    };
    return userNames[buddyId] || 'Buddy Test';
  };

  useEffect(() => {
    console.log('🎉 NOUVELLES FONCTIONNALITÉS ACTIVÉES DANS BUDDIES!');
    console.log('✅ Profils buddy enrichis avec XP, niveau, badges');
    console.log('✅ Statut temps réel (en ligne, en Study Room, hors ligne)');
    console.log('✅ Cross-selling intelligent basé sur les cours des buddies');
    console.log('✅ Notifications groupées et améliorées');
    console.log('✅ Algorithme de découverte optimisé');
    console.log('📊 Données chargées:', { userId, userCourses: userCourses?.length || 0 });
    loadBuddiesData();
  }, [userId]);

  const loadBuddiesData = () => {
    setIsLoading(true);
    try {
      console.log('🔄 Rechargement des données buddies pour userId:', userId);
      
      const userBuddies = BuddiesService.getAllBuddies(userId);
      const pending = BuddiesService.getPendingRequests(userId);
      const discovered = BuddiesService.getImprovedBuddyDiscovery(userId, 10);
      const opportunities = BuddiesService.getBuddyCrossSellingOpportunities(userId);
      
      console.log('📊 Données chargées:');
      console.log('  - Buddies:', userBuddies.length, userBuddies);
      console.log('  - Demandes en attente:', pending.length, pending);
      console.log('  - Utilisateurs découverts:', discovered.length, discovered);
      console.log('  - Opportunités cross-selling:', opportunities.length, opportunities);
      
      setBuddies(userBuddies);
      setPendingRequests(pending);
      setDiscoveredUsers(discovered);
      setCrossSellingOpportunities(opportunities);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des buddies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = (relationId: string) => {
    const success = BuddiesService.acceptBuddyRequest(relationId);
    if (success) {
      loadBuddiesData();
    }
  };

  const handleDeclineRequest = (relationId: string) => {
    const success = BuddiesService.declineBuddyRequest(relationId);
    if (success) {
      loadBuddiesData();
    }
  };

  const handleSendRequest = (targetUserId: string, type: BuddyType) => {
    BuddiesService.sendBuddyRequest(userId, targetUserId, type);
    loadBuddiesData();
  };

  const handleBuddyAdded = (newBuddyId: string, buddyType: BuddyType = 'friend') => {
    console.log('🤝 Nouveau buddy ajouté:', newBuddyId, buddyType);
    
    // Pour les tests, créer directement une relation acceptée
    // (bypasser le système de demandes pour simplifier)
    const buddyRelation: BuddyRelation = {
      id: `buddy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      buddyId: newBuddyId,
      type: buddyType,
      status: 'accepted', // Directement accepté pour les tests
      createdAt: new Date(),
      acceptedAt: new Date(),
      consents: {
        activity: buddyType !== 'parent',
        notifications: true,
        studyRoomInvites: buddyType !== 'parent',
        planningAlerts: buddyType === 'parent'
      },
      buddyName: getBuddyName(newBuddyId),
      buddyStatus: 'online',
      commonCourses: [],
      // Ajout des nouvelles propriétés pour l'enrichissement
      realTimeStatus: 'online',
      currentStudyRoomId: null,
      currentStudyRoomName: null,
      level: Math.floor(Math.random() * 10) + 1,
      totalXP: Math.floor(Math.random() * 1000) + 100,
      badges: [],
      progressionSimilarity: Math.floor(Math.random() * 40) + 60,
      coursesNotOwned: []
    };

    // Sauvegarder manuellement avec la bonne clé
    const stored = localStorage.getItem('buddies_system_v1') || '[]';
    const allBuddies = JSON.parse(stored);
    allBuddies.push(buddyRelation);
    localStorage.setItem('buddies_system_v1', JSON.stringify(allBuddies));
    
    console.log('✅ Buddy relation créée directement:', buddyRelation);
    
    // Recharger les données
    loadBuddiesData();
    
    // Award XP pour l'ajout d'un buddy
    const xpResult = GamificationService.awardXP(userId, 'buddy-help', undefined, 'Test: Buddy ajouté');
    if (xpResult.levelUp) {
      console.log('🎉 Level Up! Nouveau niveau:', xpResult.newLevel);
    }
    
    // Notification de succès
    EnhancedNotificationsService.addNotification({
      id: `buddy-added-${Date.now()}`,
      type: 'buddy-added',
      fromUserId: 'system',
      fromUserName: 'Science Made Simple',
      toUserId: userId,
      title: 'Buddy ajouté !',
      message: `Votre nouveau buddy ${getBuddyName(newBuddyId)} a été ajouté avec succès (+15 XP)`,
      actionData: { buddyId: newBuddyId, xpAmount: 15 },
      isRead: false,
      createdAt: new Date(),
      priority: 'normal'
    });
  };

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'online':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'in-study-room':
        return <VideoIcon className="w-3 h-3 text-blue-500" />;
      case 'offline':
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  const getStatusLabel = (status: UserStatus) => {
    const labels = {
      'online': 'En ligne',
      'in-study-room': 'En Study Room',
      'offline': 'Hors ligne'
    };
    return labels[status];
  };

  const getBuddyTypeLabel = (type: BuddyType) => {
    const labels = {
      'parent': 'Parent/Tuteur',
      'friend': 'Ami',
      'closeFriend': 'Ami Proche'
    };
    return labels[type];
  };

  const getCourseNameById = (courseId: string) => {
    const courseNames: { [key: string]: string } = {
      'loi-gauss': 'Loi de Gauss',
      'integrales': 'Intégrales et Applications',
      'mecanique': 'Mécanique Classique',
      'equilibres': 'Équilibres Chimiques',
      'analyse-math': 'Analyse Mathématique I',
      'forces': 'Forces et Mouvement',
      'suites-limites': 'Suites et Limites'
    };
    return courseNames[courseId] || courseId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Chargement de vos buddies...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Buddies</h2>
          <p className="text-gray-600 mt-1">Travaillez ensemble, progressez plus vite</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModernInviteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={16} />
            <span>Ajouter un Buddy</span>
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 p-3 rounded-lg text-xs text-gray-600">
        <strong>🐛 Debug:</strong> userId: {userId}, Buddies: {buddies.length}, Pending: {pendingRequests.length}, Loading: {isLoading.toString()}
      </div>

      {/* Demandes en attente */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
            <Clock size={20} />
            Demandes en attente ({pendingRequests.length})
          </h3>
          
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="text-gray-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{request.buddyName}</p>
                    <p className="text-sm text-gray-600">
                      Souhaite devenir votre {getBuddyTypeLabel(request.type).toLowerCase()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(request.id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mes Buddies */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Heart className="text-red-500" size={20} />
          Mes Buddies ({buddies.length})
        </h3>
        
        {buddies.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun buddy pour l'instant</h3>
            <p className="text-gray-600 mb-6">Invitez vos amis pour travailler ensemble !</p>
            <div className="space-y-3">
              <button
                onClick={() => setShowModernInviteModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <UserPlus size={18} />
                <span>Ajouter votre premier Buddy</span>
              </button>
              
              {/* Boutons de test pour demo */}
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-sm font-medium text-purple-900 mb-2">🧪 Tests Demo</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleBuddyAdded('user_marie', 'friend')}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors"
                  >
                    + Marie Dubois
                  </button>
                  <button
                    onClick={() => handleBuddyAdded('user_pierre', 'friend')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
                  >
                    + Pierre Martin
                  </button>
                  <button
                    onClick={() => handleBuddyAdded('user_sophie', 'parent')}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm hover:bg-orange-200 transition-colors"
                  >
                    + Sophie Laurent (Parent)
                  </button>
                  <button
                    onClick={() => handleBuddyAdded('user_alex', 'closeFriend')}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    + Alex Durand (Ami proche)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buddies.map((buddy) => (
              <motion.div
                key={buddy.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
              >
                {/* Avatar et statut temps réel */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {buddy.buddyName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 bg-white rounded-full border border-gray-200">
                      {buddy.realTimeStatus === 'online' && <CircleDot size={12} className="text-green-500" />}
                      {buddy.realTimeStatus === 'in-study-room' && <VideoIcon size={12} className="text-blue-500" />}
                      {buddy.realTimeStatus === 'offline' && <WifiOff size={12} className="text-gray-400" />}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{buddy.buddyName}</h4>
                      <div className="flex items-center gap-1">
                        <Zap size={12} className="text-yellow-500" />
                        <span className="text-xs font-medium text-gray-600">Niv. {buddy.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">
                        {buddy.realTimeStatus === 'online' && 'En ligne'}
                        {buddy.realTimeStatus === 'in-study-room' && buddy.currentStudyRoomName && `Dans "${buddy.currentStudyRoomName}"`}
                        {buddy.realTimeStatus === 'offline' && 'Hors ligne'}
                      </p>
                      {buddy.badges.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Trophy size={12} className="text-yellow-500" />
                          <span className="text-xs text-gray-500">{buddy.badges.length}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{getBuddyTypeLabel(buddy.type)}</p>
                  </div>
                </div>

                {/* Cours en commun */}
                {buddy.commonCourses.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Cours en commun ({buddy.commonCourses.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {buddy.commonCourses.slice(0, 2).map((courseId) => (
                        <span
                          key={courseId}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {getCourseNameById(courseId)}
                        </span>
                      ))}
                      {buddy.commonCourses.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{buddy.commonCourses.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                    <MessageCircle size={14} />
                    <span>Message</span>
                  </button>
                  
                  {buddy.realTimeStatus === 'in-study-room' && buddy.currentStudyRoomId && (
                    <button 
                      onClick={() => handleJoinBuddyStudyRoom(buddy.currentStudyRoomId!, buddy.buddyName)}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                      title={`Rejoindre ${buddy.buddyName} dans "${buddy.currentStudyRoomName}"`}
                    >
                      <VideoIcon size={14} />
                    </button>
                  )}
                </div>

                {/* Cross-selling intelligent */}
                {buddy.coursesNotOwned.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-600 mb-2">
                      {buddy.buddyName} suit aussi :
                    </p>
                    <div className="space-y-1">
                      {buddy.coursesNotOwned.slice(0, 2).map((courseId) => (
                        <button 
                          key={courseId}
                          onClick={() => handleCrossSellingClick(courseId, buddy.buddyName)}
                          className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShoppingCart size={12} className="text-blue-600" />
                              <span className="text-xs font-medium text-blue-800">
                                {getCourseNameById(courseId)}
                              </span>
                            </div>
                            <span className="text-xs text-blue-600 font-bold">700€</span>
                          </div>
                          <p className="text-xs text-blue-600 mt-1 group-hover:text-blue-700">
                            Débloquer maintenant ?
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Découvrir de nouveaux Buddies */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={20} />
          Découvrir de nouveaux Buddies
        </h3>
        
        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discoveredUsers.slice(0, 6).map((user) => (
            <div key={user.userId} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.faculty}</p>
                </div>
              </div>

              {user.commonCourses.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">{user.commonCourses.length} cours en commun</p>
                  <div className="flex flex-wrap gap-1">
                    {user.commonCourses.slice(0, 2).map((courseId) => (
                      <span
                        key={courseId}
                        className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                      >
                        {getCourseNameById(courseId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleSendRequest(user.userId, 'friend')}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Ajouter comme Buddy
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal d'invitation (à implémenter) */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Inviter un Buddy</h3>
            <p className="text-gray-600 mb-6">
              Invitez vos amis pour travailler ensemble et progresser plus vite !
            </p>
            
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setInviteType('search')}
                className={`flex-1 p-3 rounded-lg border ${
                  inviteType === 'search' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <Search className="mx-auto mb-1" size={20} />
                <p className="text-sm font-medium">Rechercher</p>
                <p className="text-xs">Sur la plateforme</p>
              </button>
              
              <button
                onClick={() => setInviteType('phone')}
                className={`flex-1 p-3 rounded-lg border ${
                  inviteType === 'phone' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <Phone className="mx-auto mb-1" size={20} />
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-xs">Ami/Parent</p>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nouveau modal moderne d'invitation */}
      <ModernBuddyInviteModal
        isOpen={showModernInviteModal}
        onClose={() => setShowModernInviteModal(false)}
        userId={userId}
        userName={userName}
        userCourses={userCourses}
        onBuddyAdded={(buddy) => {
          console.log('Nouveau buddy ajouté via modal:', buddy);
          
          // Si on reçoit juste un ID (string), utiliser notre système direct
          if (typeof buddy === 'string') {
            handleBuddyAdded(buddy, 'friend');
          } else if (buddy && buddy.buddyId) {
            // Si on reçoit un objet BuddyRelation, accepter immédiatement
            BuddiesService.acceptBuddyRequest(buddy.id);
            loadBuddiesData();
          }
          
          setShowModernInviteModal(false);
        }}
      />
    </div>
  );

  // ========================================================================
  // NOUVELLES FONCTIONS DE GESTION
  // ========================================================================

  function handleJoinBuddyStudyRoom(roomId: string, buddyName: string) {
    console.log(`Rejoindre la Study Room de ${buddyName}: ${roomId}`);
    // Ici on redirigerait vers la Study Room
    
    // Award XP pour rejoindre via buddy
    GamificationService.awardXP(
      userId,
      'study-room-join',
      roomId,
      `Rejoint ${buddyName} dans une Study Room`
    );

    // Notification pour cross-selling si applicable
    const opportunity = crossSellingOpportunities.find(op => op.buddyId === 'buddy_' + buddyName.toLowerCase());
    if (opportunity) {
      setTimeout(() => {
        EnhancedNotificationsService.addNotificationWithGrouping(
          EnhancedNotificationsService.createCrossSellingNotification(
            userId,
            opportunity.buddyId,
            opportunity.buddyName,
            opportunity.courseId,
            opportunity.courseName,
            opportunity.priceEuros
          )
        );
      }, 30000); // Après 30 secondes dans la room
    }
  }

  function handleCrossSellingClick(courseId: string, buddyName: string) {
    console.log(`Cross-selling: cours ${courseId} recommandé par ${buddyName}`);
    
    // Créer notification de cross-selling
    EnhancedNotificationsService.addNotificationWithGrouping(
      EnhancedNotificationsService.createCrossSellingNotification(
        userId,
        'buddy_' + buddyName.toLowerCase(),
        buddyName,
        courseId,
        getCourseNameById(courseId),
        700
      )
    );

    // Ici on ouvrirait la modal d'achat du cours
    alert(`${buddyName} suit "${getCourseNameById(courseId)}". Voulez-vous le débloquer pour 700€ ?`);
  }
}
