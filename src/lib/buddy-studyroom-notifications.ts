'use client';

import { BuddiesService } from './buddies-service';
import { EnhancedNotificationsService } from './enhanced-notifications-service';
import { AdvancedStudyRoomService } from './advanced-studyroom-service';

export class BuddyStudyRoomNotifications {
  private static readonly NOTIFICATION_COOLDOWN_MINUTES = 30; // Éviter le spam
  private static readonly LAST_NOTIFICATION_KEY = 'buddy_room_notifications_v1';

  // ========================================================================
  // NOTIFICATIONS INTELLIGENTES BUDDY + STUDY ROOMS
  // ========================================================================

  /**
   * Déclenche une notification quand un buddy rejoint une Study Room
   * d'un cours que l'utilisateur suit
   */
  static notifyBuddyJoinedStudyRoom(
    buddyId: string,
    buddyName: string,
    roomId: string,
    roomName: string,
    courseId: string
  ): void {
    console.log('🔔 BUDDY ROOM NOTIFICATION: Buddy rejoint room', {
      buddyId,
      buddyName,
      roomId,
      roomName,
      courseId
    });

    // Trouver tous les utilisateurs qui ont ce buddy ET suivent ce cours
    const allBuddyRelations = BuddiesService.loadAllBuddies();
    const usersToNotify = allBuddyRelations
      .filter(relation => 
        relation.buddyId === buddyId && 
        relation.status === 'accepted' &&
        relation.consents.studyRoomInvites &&
        relation.commonCourses.includes(courseId)
      )
      .map(relation => relation.userId);

    console.log('👥 Utilisateurs à notifier:', usersToNotify);

    usersToNotify.forEach(userId => {
      // Vérifier le cooldown pour éviter le spam
      if (this.isInCooldown(userId, roomId)) {
        console.log('⏰ Notification en cooldown pour', userId, roomId);
        return;
      }

      // Créer et ajouter la notification
      const notification = EnhancedNotificationsService.createBuddyInRoomNotification(
        userId,
        buddyId,
        buddyName,
        roomId,
        roomName,
        courseId
      );

      EnhancedNotificationsService.addNotificationWithGrouping(notification);

      // Enregistrer le timestamp pour le cooldown
      this.recordNotification(userId, roomId);

      console.log('✅ Notification envoyée à', userId, 'pour buddy', buddyName);
    });
  }

  /**
   * Déclenche une notification groupée quand plusieurs buddies 
   * sont dans la même Study Room
   */
  static notifyMultipleBuddiesInRoom(
    roomId: string,
    roomName: string,
    courseId: string,
    buddiesInRoom: Array<{ id: string; name: string }>
  ): void {
    console.log('🔔 MULTIPLE BUDDIES NOTIFICATION:', {
      roomId,
      roomName,
      courseId,
      buddiesCount: buddiesInRoom.length
    });

    // Trouver les utilisateurs qui ont au moins 2 de ces buddies
    const allBuddyRelations = BuddiesService.loadAllBuddies();
    const userBuddyMap = new Map<string, Array<{ id: string; name: string }>>();

    // Construire la map des buddies par utilisateur
    allBuddyRelations
      .filter(relation => 
        relation.status === 'accepted' &&
        relation.consents.studyRoomInvites &&
        relation.commonCourses.includes(courseId) &&
        buddiesInRoom.some(buddy => buddy.id === relation.buddyId)
      )
      .forEach(relation => {
        const buddy = buddiesInRoom.find(b => b.id === relation.buddyId);
        if (buddy) {
          if (!userBuddyMap.has(relation.userId)) {
            userBuddyMap.set(relation.userId, []);
          }
          userBuddyMap.get(relation.userId)!.push(buddy);
        }
      });

    // Notifier les utilisateurs qui ont 2+ buddies dans la room
    userBuddyMap.forEach((userBuddies, userId) => {
      if (userBuddies.length >= 2) {
        // Vérifier le cooldown
        if (this.isInCooldown(userId, roomId, 'multiple')) {
          return;
        }

        const notification = EnhancedNotificationsService.createMultipleBuddiesInRoomNotification(
          userId,
          userBuddies,
          roomName,
          roomId,
          courseId
        );

        EnhancedNotificationsService.addNotificationWithGrouping(notification);
        this.recordNotification(userId, roomId, 'multiple');

        console.log('✅ Notification groupée envoyée à', userId, 'pour', userBuddies.length, 'buddies');
      }
    });
  }

  /**
   * Surveille en temps réel les changements dans les Study Rooms
   * et déclenche les notifications appropriées
   */
  static monitorStudyRoomActivity(): void {
    console.log('🔍 MONITORING: Surveillance des Study Rooms activée');

    // Simuler la surveillance en temps réel
    // En production, ceci serait connecté à WebSocket ou polling
    setInterval(() => {
      this.checkForNewBuddyActivity();
    }, 30000); // Vérifier toutes les 30 secondes
  }

  private static checkForNewBuddyActivity(): void {
    const allRooms = AdvancedStudyRoomService.getAllStudyRooms();
    const activeRooms = allRooms.filter(room => room.status === 'live');

    activeRooms.forEach(room => {
      const buddiesInRoom = room.currentParticipants
        .filter(participant => participant.isBuddy && !participant.leftAt)
        .map(participant => ({
          id: participant.userId,
          name: participant.userName
        }));

      if (buddiesInRoom.length === 1) {
        // Un seul buddy - notification individuelle
        const buddy = buddiesInRoom[0];
        this.notifyBuddyJoinedStudyRoom(
          buddy.id,
          buddy.name,
          room.id,
          room.title,
          room.courseId
        );
      } else if (buddiesInRoom.length >= 2) {
        // Plusieurs buddies - notification groupée
        this.notifyMultipleBuddiesInRoom(
          room.id,
          room.title,
          room.courseId,
          buddiesInRoom
        );
      }
    });
  }

  // ========================================================================
  // GESTION DU COOLDOWN
  // ========================================================================

  private static isInCooldown(userId: string, roomId: string, type: string = 'single'): boolean {
    const key = `${userId}-${roomId}-${type}`;
    const stored = localStorage.getItem(this.LAST_NOTIFICATION_KEY);
    
    if (!stored) return false;

    try {
      const data = JSON.parse(stored);
      const lastNotification = data[key];
      
      if (!lastNotification) return false;

      const cooldownMs = this.NOTIFICATION_COOLDOWN_MINUTES * 60 * 1000;
      const timeSinceLastNotification = Date.now() - lastNotification;
      
      return timeSinceLastNotification < cooldownMs;
    } catch (error) {
      console.error('Erreur lecture cooldown notifications:', error);
      return false;
    }
  }

  private static recordNotification(userId: string, roomId: string, type: string = 'single'): void {
    const key = `${userId}-${roomId}-${type}`;
    const stored = localStorage.getItem(this.LAST_NOTIFICATION_KEY);
    
    let data = {};
    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch (error) {
        console.error('Erreur parsing cooldown notifications:', error);
      }
    }

    data[key] = Date.now();
    localStorage.setItem(this.LAST_NOTIFICATION_KEY, JSON.stringify(data));
  }

  // ========================================================================
  // UTILITAIRES DE DEBUG
  // ========================================================================

  static debugNotifications(): void {
    console.log('🔔 BUDDY ROOM NOTIFICATIONS DEBUG:');
    console.log('- Cooldown minutes:', this.NOTIFICATION_COOLDOWN_MINUTES);
    console.log('- Storage key:', this.LAST_NOTIFICATION_KEY);
    
    const stored = localStorage.getItem(this.LAST_NOTIFICATION_KEY);
    if (stored) {
      console.log('- Dernières notifications:', JSON.parse(stored));
    }
  }

  static resetCooldowns(): void {
    localStorage.removeItem(this.LAST_NOTIFICATION_KEY);
    console.log('✅ Cooldowns des notifications buddy rooms réinitialisés');
  }

  // ========================================================================
  // INTÉGRATION AVEC WEBRTC STUDY ROOMS
  // ========================================================================

  /**
   * À appeler quand un utilisateur rejoint une WebRTC Study Room
   */
  static onUserJoinedWebRTCRoom(
    userId: string,
    userName: string,
    roomId: string,
    roomName: string,
    courseId: string
  ): void {
    console.log('🎥 WEBRTC JOIN:', { userId, userName, roomId, roomName, courseId });

    // Vérifier si cet utilisateur est un buddy d'autres utilisateurs
    const allBuddyRelations = BuddiesService.loadAllBuddies();
    const isBuddy = allBuddyRelations.some(relation => 
      relation.buddyId === userId && relation.status === 'accepted'
    );

    if (isBuddy) {
      // Déclencher les notifications pour les buddies
      this.notifyBuddyJoinedStudyRoom(userId, userName, roomId, roomName, courseId);

      // Mettre à jour le statut temps réel du buddy
      BuddiesService.updateBuddyRealTimeStatus(userId, 'in-study-room', roomId, roomName);
    }
  }

  /**
   * À appeler quand un utilisateur quitte une WebRTC Study Room
   */
  static onUserLeftWebRTCRoom(userId: string): void {
    console.log('🎥 WEBRTC LEAVE:', { userId });

    // Mettre à jour le statut temps réel
    BuddiesService.updateBuddyRealTimeStatus(userId, 'online');
  }
}


