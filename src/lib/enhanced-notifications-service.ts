'use client';

import { SocialNotification } from '@/types';

export class EnhancedNotificationsService {
  private static readonly STORAGE_KEY = 'enhanced_notifications_v1';
  private static readonly GROUPING_WINDOW_HOURS = 24; // Fenêtre pour grouper les notifications

  // ========================================================================
  // GESTION DES NOTIFICATIONS ENRICHIES
  // ========================================================================

  static createBuddyInRoomNotification(
    userId: string,
    buddyId: string,
    buddyName: string,
    roomId: string,
    roomName: string,
    courseId: string
  ): SocialNotification {
    return {
      id: `buddy-room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'buddy-in-room',
      fromUserId: buddyId,
      fromUserName: buddyName,
      toUserId: userId,
      title: '👋 Ton buddy est en Study Room !',
      message: `${buddyName} a rejoint la session "${roomName}". Rejoins-le pour étudier ensemble !`,
      actionData: {
        buddyId,
        roomId,
        courseId
      },
      isRead: false,
      createdAt: new Date(),
      priority: 'high'
    };
  }

  static createMultipleBuddiesInRoomNotification(
    userId: string,
    buddies: Array<{ id: string; name: string }>,
    roomName: string,
    roomId: string,
    courseId: string
  ): SocialNotification {
    const buddyNames = buddies.slice(0, 2).map(b => b.name).join(' et ');
    const additionalCount = buddies.length - 2;
    
    return {
      id: `multiple-buddies-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'multiple-buddies-in-room',
      fromUserId: buddies[0].id,
      fromUserName: buddies[0].name,
      toUserId: userId,
      title: '🔥 Tes buddies étudient ensemble !',
      message: `${buddyNames}${additionalCount > 0 ? ` et ${additionalCount} autre${additionalCount > 1 ? 's' : ''}` : ''} sont dans "${roomName}". C'est le moment idéal pour les rejoindre !`,
      actionData: {
        roomId,
        courseId,
        groupedBuddies: buddies.map(b => b.id)
      },
      isRead: false,
      createdAt: new Date(),
      priority: 'high',
      isGrouped: true,
      groupCount: buddies.length
    };
  }

  static createXPEarnedNotification(
    userId: string,
    xpAmount: number,
    activityType: string,
    description: string
  ): SocialNotification {
    return {
      id: `xp-earned-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'xp-earned',
      fromUserId: 'system',
      fromUserName: 'Science Made Simple',
      toUserId: userId,
      title: '⚡ XP Gagné !',
      message: `Tu as gagné ${xpAmount} XP pour ${description}`,
      actionData: {
        xpAmount
      },
      isRead: false,
      createdAt: new Date(),
      priority: 'normal'
    };
  }

  static createBadgeUnlockedNotification(
    userId: string,
    badgeId: string,
    badgeName: string,
    badgeIcon: string
  ): SocialNotification {
    return {
      id: `badge-unlocked-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'badge-unlocked',
      fromUserId: 'system',
      fromUserName: 'Science Made Simple',
      toUserId: userId,
      title: '🏆 Nouveau Badge Débloqué !',
      message: `Félicitations ! Tu as débloqué le badge "${badgeName}" ${badgeIcon}`,
      actionData: {
        badgeId
      },
      isRead: false,
      createdAt: new Date(),
      priority: 'high'
    };
  }

  static createCrossSellingNotification(
    userId: string,
    buddyId: string,
    buddyName: string,
    courseId: string,
    courseName: string,
    priceEuros: number
  ): SocialNotification {
    return {
      id: `cross-sell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'course-recommendation',
      fromUserId: buddyId,
      fromUserName: buddyName,
      toUserId: userId,
      title: '💡 Cours recommandé par ton buddy',
      message: `${buddyName} suit "${courseName}". Débloquer maintenant pour ${priceEuros}€ ?`,
      actionData: {
        buddyId,
        courseId
      },
      isRead: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expire dans 7 jours
      priority: 'normal'
    };
  }

  // ========================================================================
  // GESTION DU GROUPEMENT DES NOTIFICATIONS
  // ========================================================================

  static addNotificationWithGrouping(notification: SocialNotification): void {
    const notifications = this.getAllNotifications(notification.toUserId);
    
    // Vérifier si on peut grouper avec une notification existante
    const groupableNotification = this.findGroupableNotification(notifications, notification);
    
    if (groupableNotification && notification.type === 'buddy-in-room') {
      // Grouper les notifications buddy-in-room en multiple-buddies-in-room
      this.groupBuddyInRoomNotifications(notifications, notification);
    } else {
      // Ajouter la notification normalement
      notifications.unshift(notification);
    }
    
    // Nettoyer les notifications expirées
    const activeNotifications = notifications.filter(notif => 
      !notif.expiresAt || notif.expiresAt > new Date()
    );
    
    this.saveNotifications(activeNotifications);
  }

  private static findGroupableNotification(
    notifications: SocialNotification[],
    newNotification: SocialNotification
  ): SocialNotification | null {
    const cutoffTime = new Date(Date.now() - this.GROUPING_WINDOW_HOURS * 60 * 60 * 1000);
    
    return notifications.find(notif => 
      notif.type === 'buddy-in-room' &&
      newNotification.type === 'buddy-in-room' &&
      notif.actionData?.roomId === newNotification.actionData?.roomId &&
      notif.createdAt > cutoffTime &&
      !notif.isRead
    ) || null;
  }

  private static groupBuddyInRoomNotifications(
    notifications: SocialNotification[],
    newNotification: SocialNotification
  ): void {
    const roomId = newNotification.actionData?.roomId;
    const courseId = newNotification.actionData?.courseId;
    
    // Trouver toutes les notifications buddy-in-room pour cette room
    const roomNotifications = notifications.filter(notif => 
      notif.type === 'buddy-in-room' &&
      notif.actionData?.roomId === roomId &&
      !notif.isRead
    );
    
    if (roomNotifications.length > 0) {
      // Collecter tous les buddies
      const buddies = [
        ...roomNotifications.map(notif => ({
          id: notif.fromUserId,
          name: notif.fromUserName
        })),
        {
          id: newNotification.fromUserId,
          name: newNotification.fromUserName
        }
      ];
      
      // Supprimer les anciennes notifications individuelles
      const filteredNotifications = notifications.filter(notif => 
        !(notif.type === 'buddy-in-room' && notif.actionData?.roomId === roomId)
      );
      
      // Créer une notification groupée
      const groupedNotification = this.createMultipleBuddiesInRoomNotification(
        newNotification.toUserId,
        buddies,
        'Study Room', // On pourrait récupérer le vrai nom
        roomId!,
        courseId!
      );
      
      filteredNotifications.unshift(groupedNotification);
      
      // Mettre à jour le tableau
      notifications.splice(0, notifications.length, ...filteredNotifications);
    } else {
      // Première notification pour cette room
      notifications.unshift(newNotification);
    }
  }

  // ========================================================================
  // GESTION STANDARD DES NOTIFICATIONS
  // ========================================================================

  static getAllNotifications(userId: string): SocialNotification[] {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored).map((notif: any) => ({
        ...notif,
        createdAt: new Date(notif.createdAt),
        expiresAt: notif.expiresAt ? new Date(notif.expiresAt) : undefined
      }));
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
      return [];
    }
  }

  static getUnreadCount(userId: string): number {
    return this.getAllNotifications(userId).filter(notif => !notif.isRead).length;
  }

  static markAsRead(userId: string, notificationId: string): void {
    const notifications = this.getAllNotifications(userId);
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.isRead = true;
      this.saveNotifications(notifications);
    }
  }

  static markAllAsRead(userId: string): void {
    const notifications = this.getAllNotifications(userId);
    notifications.forEach(notif => notif.isRead = true);
    this.saveNotifications(notifications);
  }

  static addNotification(notification: SocialNotification): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const allNotifications = stored ? JSON.parse(stored) : [];
    
    // Ajouter la nouvelle notification
    allNotifications.push(notification);
    
    // Sauvegarder
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allNotifications));
    
    console.log('📢 Notification ajoutée:', notification.title);
  }

  static deleteNotification(userId: string, notificationId: string): void {
    const notifications = this.getAllNotifications(userId);
    const filteredNotifications = notifications.filter(n => n.id !== notificationId);
    this.saveNotifications(filteredNotifications);
  }

  private static saveNotifications(notifications: SocialNotification[]): void {
    if (notifications.length > 0) {
      const userId = notifications[0].toUserId;
      localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(notifications));
    }
  }

  // ========================================================================
  // UTILITAIRES & ANALYTICS
  // ========================================================================

  static getNotificationsByType(userId: string, type: SocialNotification['type']): SocialNotification[] {
    return this.getAllNotifications(userId).filter(notif => notif.type === type);
  }

  static getNotificationStats(userId: string): {
    total: number;
    unread: number;
    byType: Record<string, number>;
    groupedCount: number;
  } {
    const notifications = this.getAllNotifications(userId);
    
    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      byType: {} as Record<string, number>,
      groupedCount: notifications.filter(n => n.isGrouped).length
    };
    
    notifications.forEach(notif => {
      stats.byType[notif.type] = (stats.byType[notif.type] || 0) + 1;
    });
    
    return stats;
  }

  static simulateRealtimeUpdate(userId: string): void {
    // Simuler des notifications en temps réel pour la démo
    setTimeout(() => {
      const randomNotifications = [
        this.createBuddyInRoomNotification(
          userId,
          'user_marie',
          'Marie Dubois',
          'room_123',
          'Session Loi de Gauss',
          'loi-gauss'
        ),
        this.createXPEarnedNotification(
          userId,
          25,
          'study-room-create',
          'avoir créé une Study Room'
        )
      ];
      
      const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      this.addNotificationWithGrouping(randomNotif);
    }, 5000); // 5 secondes après l'initialisation
  }
}
