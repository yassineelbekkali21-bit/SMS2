'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  MessageCircle,
  Video,
  Calendar,
  BookOpen,
  Bell,
  Check,
  X,
  Clock,
  Heart,
  Plus,
  ExternalLink
} from 'lucide-react';
import { BuddyRelation, UserStatus, SocialNotification } from '@/types';
import { BuddiesService } from '@/lib/buddies-service';
import { AdvancedStudyRoomService } from '@/lib/advanced-studyroom-service';
import { NotificationService } from '@/lib/notification-service';

interface UnifiedSocialWidgetProps {
  userId: string;
  onNavigateToCommunity?: () => void;
  onNavigateToSection?: (section: string) => void;
}

export function UnifiedSocialWidget({
  userId,
  onNavigateToCommunity,
  onNavigateToSection
}: UnifiedSocialWidgetProps) {
  const [buddies, setBuddies] = useState<BuddyRelation[]>([]);
  const [activeBuddies, setActiveBuddies] = useState<BuddyRelation[]>([]);
  const [socialNotifications, setSocialNotifications] = useState<SocialNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'buddies' | 'notifications'>('buddies');
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSocialData();
    const interval = setInterval(loadSocialData, 10000); // Refresh toutes les 10s
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

  const loadSocialData = () => {
    try {
      // Charger les buddies
      const allBuddies = BuddiesService.getAllBuddies(userId);
      setBuddies(allBuddies);
      
      // Trouver les buddies actifs (en ligne ou en Study Room)
      const activeBuddiesList = allBuddies.filter(buddy => 
        buddy.status === 'online' || buddy.status === 'in_study_room'
      );
      setActiveBuddies(activeBuddiesList);

      // Charger les notifications sociales
      const notifications = BuddiesService.getSocialNotifications(userId);
      setSocialNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.isRead).length);

    } catch (error) {
      console.error('Erreur lors du chargement des données sociales:', error);
    }
  };

  const handleNotificationAction = (notification: SocialNotification, action: 'accept' | 'decline') => {
    if (notification.type === 'buddy-request' && notification.actionData?.buddyId) {
      if (action === 'accept') {
        BuddiesService.acceptBuddyRequest(notification.actionData.buddyId);
        
        // Créer une notification système pour l'interface
        NotificationService.addNotification(
          'SUCCESS',
          'SYSTEM',
          `Vous êtes maintenant buddy avec ${notification.fromUserName}`,
          'Demande acceptée',
          { icon: '👥' },
          'ACHIEVEMENTS'
        );
      } else {
        BuddiesService.declineBuddyRequest(notification.actionData.buddyId);
      }
      
      // Marquer comme lue
      BuddiesService.markNotificationAsRead(notification.id);
      loadSocialData();
    }
  };

  const handleNotificationClick = (notification: SocialNotification) => {
    // Marquer comme lue
    BuddiesService.markNotificationAsRead(notification.id);
    
    // Navigation selon le type
    switch (notification.type) {
      case 'buddy-request':
      case 'buddy-accepted':
        onNavigateToSection?.('community');
        break;
      case 'study-room-invite':
      case 'buddy-in-room':
        onNavigateToSection?.('community');
        break;
      case 'course-recommendation':
        onNavigateToSection?.('unlock');
        break;
      case 'planning-alert':
        onNavigateToSection?.('planning');
        break;
    }
    
    setIsOpen(false);
    loadSocialData();
  };

  const getNotificationIcon = (type: SocialNotification['type']) => {
    switch (type) {
      case 'buddy-request':
      case 'buddy-accepted':
        return <Users size={16} className="text-blue-500" />;
      case 'study-room-invite':
      case 'buddy-in-room':
        return <Video size={16} className="text-green-500" />;
      case 'course-recommendation':
        return <BookOpen size={16} className="text-purple-500" />;
      case 'planning-alert':
        return <Calendar size={16} className="text-orange-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}j`;
  };

  const getBuddyStatusColor = (status: UserStatus) => {
    const colors = {
      'online': 'bg-green-500',
      'offline': 'bg-gray-400',
      'in_study_room': 'bg-blue-500',
      'busy': 'bg-orange-500'
    };
    return colors[status] || 'bg-gray-400';
  };

  const getBuddyStatusLabel = (status: UserStatus) => {
    const labels = {
      'online': 'En ligne',
      'offline': 'Hors ligne',
      'in_study_room': 'En Study Room',
      'busy': 'Occupé'
    };
    return labels[status] || 'Inconnu';
  };

  // Créer automatiquement quelques notifications de démonstration si besoin
  useEffect(() => {
    const hasDemo = localStorage.getItem('unified_social_demo');
    if (!hasDemo && socialNotifications.length === 0) {
      // Créer des notifications de démonstration
      BuddiesService.createSocialNotification({
        type: 'buddy-request',
        fromUserId: 'user_marie',
        fromUserName: 'Marie Dubois',
        toUserId: userId,
        title: 'Nouvelle demande de Buddy',
        message: 'Marie Dubois souhaite devenir votre amie proche',
        actionData: { buddyId: 'buddy_demo_1' },
        priority: 'normal'
      });

      BuddiesService.createSocialNotification({
        type: 'buddy-in-room',
        fromUserId: 'user_pierre',
        fromUserName: 'Pierre Martin',
        toUserId: userId,
        title: 'Buddy en Study Room',
        message: 'Pierre Martin vient d\'entrer dans la Study Room "Loi de Gauss"',
        actionData: { roomId: 'room_loi_gauss_1' },
        priority: 'normal'
      });

      localStorage.setItem('unified_social_demo', 'true');
      loadSocialData();
    }
  }, [userId, socialNotifications.length]);

  const hasActivity = activeBuddies.length > 0 || unreadCount > 0;

  return (
    <div className="relative" ref={widgetRef}>
      {/* Bouton social unifié */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors group"
        title={`${buddies.length} buddy${buddies.length > 1 ? 's' : ''} • ${unreadCount} notification${unreadCount > 1 ? 's' : ''}`}
      >
        <Users 
          size={18} 
          className="text-gray-900 transition-colors" 
        />
        
        {/* Badge pour activité */}
        <AnimatePresence>
          {hasActivity && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-blue-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold">
                {unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount) : activeBuddies.length}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Panneau social unifié */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-12 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-50"
          >
            {/* Header avec onglets */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Social</h3>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToCommunity?.();
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Accéder à la communauté"
                >
                  <ExternalLink size={14} className="text-gray-500" />
                </button>
              </div>

              {/* Onglets */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('buddies')}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'buddies'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users size={14} />
                    Buddies
                    {activeBuddies.length > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {activeBuddies.length}
                      </span>
                    )}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Heart size={14} />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="max-h-80 overflow-y-auto">
              {activeTab === 'buddies' ? (
                // Onglet Buddies
                <div className="p-4">
                  {buddies.length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-3">Aucun buddy pour le moment</p>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onNavigateToCommunity?.();
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <UserPlus size={14} />
                        <span>Inviter des amis</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Buddies actifs */}
                      {activeBuddies.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-2">Buddies actifs</p>
                          <div className="space-y-2">
                            {activeBuddies.slice(0, 3).map((buddy) => (
                              <div key={buddy.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                                <div className="relative">
                                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {buddy.buddyName.charAt(0)}
                                  </div>
                                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getBuddyStatusColor(buddy.status)}`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{buddy.buddyName}</p>
                                  <p className="text-xs text-gray-500">{getBuddyStatusLabel(buddy.status)}</p>
                                </div>
                                {buddy.status === 'in_study_room' && (
                                  <Video size={14} className="text-blue-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tous les buddies */}
                      {buddies.length > activeBuddies.length && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-2">Tous les buddies</p>
                          <div className="space-y-2">
                            {buddies.filter(b => !activeBuddies.includes(b)).slice(0, 2).map((buddy) => (
                              <div key={buddy.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                                <div className="relative">
                                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {buddy.buddyName.charAt(0)}
                                  </div>
                                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getBuddyStatusColor(buddy.status)}`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{buddy.buddyName}</p>
                                  <p className="text-xs text-gray-500">{getBuddyStatusLabel(buddy.status)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action d'ajout */}
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onNavigateToCommunity?.();
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                      >
                        <Plus size={16} />
                        <span className="text-sm font-medium">Inviter un buddy</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Onglet Notifications
                <div className="p-4">
                  {socialNotifications.length === 0 ? (
                    <div className="text-center py-6">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Aucune notification sociale</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {socialNotifications.slice(0, 5).map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            notification.isRead 
                              ? 'bg-gray-50 border-gray-200' 
                              : 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icône */}
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Contenu */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                  {getTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                              
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {notification.message}
                              </p>

                              {/* Actions pour les demandes de Buddy */}
                              {notification.type === 'buddy-request' && !notification.isRead && (
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationAction(notification, 'accept');
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                                  >
                                    <Check size={12} />
                                    <span>Accepter</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationAction(notification, 'decline');
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                                  >
                                    <X size={12} />
                                    <span>Refuser</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToCommunity?.();
                }}
                className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Accéder à la communauté
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}





