'use client';

import {
  BuddyRelation,
  BuddyInvitation,
  BuddyDiscovery,
  BuddyType,
  BuddyStatus,
  BuddyConsents,
  SocialNotification,
  UserStatus
} from '@/types';
import { AdvancedBuddyDiscovery } from './advanced-buddy-discovery';

export class BuddiesService {
  private static readonly STORAGE_KEY = 'buddies_system_v1';
  private static readonly INVITATIONS_KEY = 'buddy_invitations_v1';
  private static readonly NOTIFICATIONS_KEY = 'social_notifications_v1';

  // ========================================================================
  // GESTION DES BUDDIES
  // ========================================================================

  static getAllBuddies(userId: string): BuddyRelation[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      const mockData = this.generateMockBuddies(userId);
      this.saveBuddies(mockData);
      return mockData.filter(b => b.userId === userId);
    }
    
    try {
      const data = JSON.parse(stored);
      return data.filter((buddy: BuddyRelation) => buddy.userId === userId && buddy.status === 'accepted');
    } catch (error) {
      console.error('Erreur lors du chargement des buddies:', error);
      return [];
    }
  }

  static getPendingRequests(userId: string): BuddyRelation[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const data = JSON.parse(stored);
      return data.filter((buddy: BuddyRelation) => 
        buddy.buddyId === userId && buddy.status === 'pending'
      );
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      return [];
    }
  }

  static sendBuddyRequest(fromUserId: string, toUserId: string, type: BuddyType): BuddyRelation {
    const newRelation: BuddyRelation = {
      id: `buddy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: fromUserId,
      buddyId: toUserId,
      type,
      status: 'pending',
      createdAt: new Date(),
      consents: {
        activity: type !== 'parent',
        notifications: true,
        studyRoomInvites: type !== 'parent',
        planningAlerts: type === 'parent'
      },
      buddyName: this.getUserName(toUserId),
      buddyStatus: 'offline',
      commonCourses: this.getCommonCourses(fromUserId, toUserId)
    };

    const allBuddies = this.loadAllBuddies();
    allBuddies.push(newRelation);
    this.saveBuddies(allBuddies);

    // Créer notification pour le destinataire
    this.createSocialNotification({
      type: 'buddy-request',
      fromUserId,
      fromUserName: this.getUserName(fromUserId),
      toUserId,
      title: 'Nouvelle demande de Buddy',
      message: `${this.getUserName(fromUserId)} souhaite devenir votre ${this.getBuddyTypeLabel(type)}`,
      actionData: { buddyId: newRelation.id },
      priority: 'normal'
    });

    return newRelation;
  }

  static acceptBuddyRequest(relationId: string): boolean {
    const allBuddies = this.loadAllBuddies();
    const relationIndex = allBuddies.findIndex(b => b.id === relationId);
    
    if (relationIndex === -1) return false;

    const relation = allBuddies[relationIndex];
    relation.status = 'accepted';
    relation.acceptedAt = new Date();

    // Créer la relation inverse
    const reverseRelation: BuddyRelation = {
      id: `buddy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: relation.buddyId,
      buddyId: relation.userId,
      type: relation.type,
      status: 'accepted',
      createdAt: new Date(),
      acceptedAt: new Date(),
      consents: relation.consents,
      buddyName: this.getUserName(relation.userId),
      buddyStatus: 'online',
      commonCourses: relation.commonCourses
    };

    allBuddies[relationIndex] = relation;
    allBuddies.push(reverseRelation);
    this.saveBuddies(allBuddies);

    // Notification d'acceptation
    this.createSocialNotification({
      type: 'buddy-accepted',
      fromUserId: relation.buddyId,
      fromUserName: this.getUserName(relation.buddyId),
      toUserId: relation.userId,
      title: 'Demande acceptée !',
      message: `${this.getUserName(relation.buddyId)} a accepté votre demande de Buddy`,
      actionData: { buddyId: relationId },
      priority: 'normal'
    });

    return true;
  }

  static declineBuddyRequest(relationId: string): boolean {
    const allBuddies = this.loadAllBuddies();
    const relationIndex = allBuddies.findIndex(b => b.id === relationId);
    
    if (relationIndex === -1) return false;

    allBuddies[relationIndex].status = 'declined';
    this.saveBuddies(allBuddies);
    return true;
  }

  // ========================================================================
  // INVITATIONS EXTERNES (PHONE)
  // ========================================================================

  static createPhoneInvitation(inviterId: string, phone: string, type: BuddyType, message?: string): BuddyInvitation {
    const invitation: BuddyInvitation = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      inviterId,
      inviterName: this.getUserName(inviterId),
      phone,
      token: Math.random().toString(36).substr(2, 16),
      type,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      createdAt: new Date(),
      message
    };

    const allInvitations = this.loadAllInvitations();
    allInvitations.push(invitation);
    this.saveInvitations(allInvitations);

    return invitation;
  }

  static getInvitationByToken(token: string): BuddyInvitation | null {
    const allInvitations = this.loadAllInvitations();
    const invitation = allInvitations.find(inv => inv.token === token && !inv.acceptedAt && inv.expiresAt > new Date());
    return invitation || null;
  }

  static acceptInvitation(token: string, acceptedUserId: string): boolean {
    const allInvitations = this.loadAllInvitations();
    const invitationIndex = allInvitations.findIndex(inv => inv.token === token);
    
    if (invitationIndex === -1) return false;

    const invitation = allInvitations[invitationIndex];
    invitation.acceptedAt = new Date();

    // Créer la relation buddy
    this.sendBuddyRequest(invitation.inviterId, acceptedUserId, invitation.type);
    this.acceptBuddyRequest(this.loadAllBuddies().find(b => 
      b.userId === invitation.inviterId && b.buddyId === acceptedUserId
    )?.id || '');

    allInvitations[invitationIndex] = invitation;
    this.saveInvitations(allInvitations);

    return true;
  }

  static generateInvitationLink(invitation: BuddyInvitation): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sms.app';
    return `${baseUrl}/invite/${invitation.token}`;
  }

  static generateWhatsAppInvite(invitation: BuddyInvitation): string {
    const inviteLink = this.generateInvitationLink(invitation);
    const message = `Salut ! Je t'invite à me rejoindre sur Science Made Simple pour qu'on puisse travailler ensemble 🎓\n\nRejoins-moi ici : ${inviteLink}\n\nÀ bientôt ! 😊`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  // ========================================================================
  // DÉCOUVERTE D'UTILISATEURS
  // ========================================================================

  static discoverUsers(userId: string, query: string = ''): BuddyDiscovery[] {
    const mockUsers: BuddyDiscovery[] = [
      {
        userId: 'user_marie',
        name: 'Marie Dubois',
        avatar: '/avatars/marie.jpg',
        faculty: 'Sciences',
        commonCourses: ['loi-gauss', 'integrales'],
        mutualBuddies: 2,
        isOnPlatform: true
      },
      {
        userId: 'user_pierre',
        name: 'Pierre Martin',
        avatar: '/avatars/pierre.jpg',
        faculty: 'Sciences',
        commonCourses: ['mecanique', 'forces'],
        mutualBuddies: 1,
        isOnPlatform: true
      },
      {
        userId: 'user_sophie',
        name: 'Sophie Laurent',
        avatar: '/avatars/sophie.jpg',
        faculty: 'Sciences',
        commonCourses: ['equilibres'],
        mutualBuddies: 0,
        isOnPlatform: true
      }
    ];

    const currentBuddies = this.getAllBuddies(userId).map(b => b.buddyId);
    
    return mockUsers
      .filter(user => 
        user.userId !== userId && 
        !currentBuddies.includes(user.userId) &&
        (query === '' || user.name.toLowerCase().includes(query.toLowerCase()))
      )
      .sort((a, b) => b.commonCourses.length - a.commonCourses.length);
  }

  // ========================================================================
  // NOTIFICATIONS SOCIALES
  // ========================================================================

  static createSocialNotification(data: Omit<SocialNotification, 'id' | 'isRead' | 'createdAt'>): SocialNotification {
    const notification: SocialNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      isRead: false,
      createdAt: new Date()
    };

    const allNotifications = this.loadAllNotifications();
    allNotifications.push(notification);
    this.saveNotifications(allNotifications);

    return notification;
  }

  static getSocialNotifications(userId: string): SocialNotification[] {
    const allNotifications = this.loadAllNotifications();
    return allNotifications
      .filter(notif => notif.toUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static markNotificationAsRead(notificationId: string): boolean {
    const allNotifications = this.loadAllNotifications();
    const notificationIndex = allNotifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex === -1) return false;

    allNotifications[notificationIndex].isRead = true;
    this.saveNotifications(allNotifications);
    return true;
  }

  // ========================================================================
  // GESTION DES COURS COMMUNS
  // ========================================================================

  static getBuddyCourses(buddyId: string): string[] {
    // Mock data - en réalité viendrait de la base de données
    const buddyCourses: { [key: string]: string[] } = {
      'user_marie': ['loi-gauss', 'integrales', 'analyse-math'],
      'user_pierre': ['mecanique', 'forces', 'suites-limites'],
      'user_sophie': ['equilibres', 'loi-gauss'],
      'user_alex': ['integrales', 'equilibres', 'mecanique'],
      'user_lisa': ['analyse-math', 'suites-limites']
    };
    
    return buddyCourses[buddyId] || [];
  }

  static getCommonCourses(userId1: string, userId2: string): string[] {
    const user1Courses = this.getBuddyCourses(userId1);
    const user2Courses = this.getBuddyCourses(userId2);
    
    return user1Courses.filter(course => user2Courses.includes(course));
  }

  // ========================================================================
  // NOUVELLES FONCTIONNALITÉS - CROSS SELLING & AMÉLIORATIONS
  // ========================================================================

  static getBuddyCrossSellingOpportunities(userId: string): Array<{
    buddyId: string;
    buddyName: string;
    courseId: string;
    courseName: string;
    priceEuros: number;
  }> {
    const buddies = this.getAllBuddies(userId);
    const opportunities: Array<{
      buddyId: string;
      buddyName: string;
      courseId: string;
      courseName: string;
      priceEuros: number;
    }> = [];

    buddies.forEach(buddy => {
      buddy.coursesNotOwned.forEach(courseId => {
        const courseName = this.getCourseNameById(courseId);
        opportunities.push({
          buddyId: buddy.buddyId,
          buddyName: buddy.buddyName,
          courseId,
          courseName,
          priceEuros: 700 // Prix standard cours
        });
      });
    });

    return opportunities.slice(0, 3); // Limiter à 3 suggestions max
  }

  static getImprovedBuddyDiscovery(userId: string, limit = 10): BuddyDiscovery[] {
    console.log('🔍 IMPROVED BUDDY DISCOVERY: Utilisation de l\'algorithme avancé pour', userId);
    
    try {
      // Utiliser le nouveau système de découverte avancé
      const userProfile = AdvancedBuddyDiscovery.getMockUserProfile(userId);
      const availableProfiles = AdvancedBuddyDiscovery.generateMockProfiles();
      
      // Exclure les buddies existants
      const existingBuddies = this.getAllBuddies(userId).map(b => b.buddyId);
      const filteredProfiles = availableProfiles.filter(profile => 
        !existingBuddies.includes(profile.userId)
      );
      
      const discoveries = AdvancedBuddyDiscovery.discoverBuddies(
        userId, 
        userProfile, 
        filteredProfiles, 
        limit
      );

      // Enrichir avec les données de cours communs
      const enrichedDiscoveries = discoveries.map(discovery => {
        const profile = availableProfiles.find(p => p.userId === discovery.userId);
        if (profile) {
          const commonCourses = userProfile.courses.filter(course => 
            profile.courses.includes(course)
          );
          
          return {
            ...discovery,
            commonCourses,
            progressionSimilarity: Math.round(discovery.compatibilityScore! * 100),
            compatibilityReasons: discovery.compatibilityReasons || []
          };
        }
        return discovery;
      });

      console.log('✅ Découverte avancée terminée:', enrichedDiscoveries.length, 'candidats');
      return enrichedDiscoveries;
      
    } catch (error) {
      console.error('❌ Erreur dans la découverte avancée:', error);
      
      // Fallback vers l'ancien système
      return this.getFallbackBuddyDiscovery(userId, limit);
    }
  }

  // Méthode de fallback en cas d'erreur
  private static getFallbackBuddyDiscovery(userId: string, limit = 10): BuddyDiscovery[] {
    console.log('🔄 FALLBACK: Utilisation de l\'ancien algorithme');
    
    const mockDiscoveries: BuddyDiscovery[] = [
      {
        userId: 'user_sophie_new',
        name: 'Sophie Dubois',
        avatar: '/avatars/sophie.jpg',
        faculty: 'Sciences',
        commonCourses: ['loi-gauss', 'integrales', 'analyse-math'],
        mutualBuddies: 2,
        isOnPlatform: true,
        progressionSimilarity: 92,
        recentActivity: true,
        studyRoomCompatibility: 88
      },
      {
        userId: 'user_alex_new',
        name: 'Alex Moreau',
        avatar: '/avatars/alex.jpg',
        faculty: 'Sciences',
        commonCourses: ['mecanique', 'forces'],
        mutualBuddies: 1,
        isOnPlatform: true,
        progressionSimilarity: 78,
        recentActivity: true,
        studyRoomCompatibility: 85
      },
      {
        userId: 'user_lea',
        name: 'Léa Martinez',
        avatar: '/avatars/lea.jpg',
        faculty: 'Sciences',
        commonCourses: ['loi-gauss'],
        mutualBuddies: 0,
        isOnPlatform: true,
        progressionSimilarity: 86,
        recentActivity: false,
        studyRoomCompatibility: 72
      }
    ];

    return mockDiscoveries
      .map(discovery => ({
        ...discovery,
        compatibilityScore: this.calculateCompatibilityScore(discovery)
      }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);
  }

  private static calculateCompatibilityScore(discovery: BuddyDiscovery): number {
    const commonCoursesWeight = discovery.commonCourses.length * 0.4;
    const progressionWeight = discovery.progressionSimilarity * 0.3 / 100;
    const activityWeight = discovery.recentActivity ? 0.2 : 0.1;
    const studyRoomWeight = discovery.studyRoomCompatibility * 0.1 / 100;
    
    return commonCoursesWeight + progressionWeight + activityWeight + studyRoomWeight;
  }

  static updateBuddyRealTimeStatus(buddyId: string, status: 'online' | 'in-study-room' | 'offline', roomId?: string, roomName?: string): void {
    const allBuddies = this.loadAllBuddies();
    
    allBuddies.forEach(buddy => {
      if (buddy.buddyId === buddyId) {
        buddy.realTimeStatus = status;
        buddy.currentStudyRoomId = roomId;
        buddy.currentStudyRoomName = roomName;
        buddy.lastActivity = new Date();
      }
    });
    
    this.saveBuddies(allBuddies);
  }

  static getBuddiesInStudyRooms(userId: string): BuddyRelation[] {
    return this.getAllBuddies(userId).filter(buddy => 
      buddy.realTimeStatus === 'in-study-room' && buddy.currentStudyRoomId
    );
  }

  private static getCourseNameById(courseId: string): string {
    const courseNames: { [key: string]: string } = {
      'loi-gauss': 'Loi de Gauss',
      'integrales': 'Intégrales et Applications',
      'analyse-math': 'Analyse Mathématique',
      'mecanique': 'Mécanique Classique',
      'forces': 'Forces et Équilibres',
      'suites-limites': 'Suites et Limites',
      'equilibres': 'Équilibres Chimiques',
      'analyse-vectorielle': 'Analyse Vectorielle',
      'mecanique-quantique': 'Mécanique Quantique',
      'algebre-lineaire': 'Algèbre Linéaire'
    };
    return courseNames[courseId] || courseId;
  }

  // ========================================================================
  // UTILITAIRES
  // ========================================================================

  private static getUserName(userId: string): string {
    const userNames: { [key: string]: string } = {
      'current_user': 'Vous',
      'user_marie': 'Marie Dubois',
      'user_pierre': 'Pierre Martin',
      'user_sophie': 'Sophie Laurent',
      'user_alex': 'Alex Durand',
      'user_lisa': 'Lisa Chen',
      'user_thomas': 'Thomas Rousseau'
    };
    return userNames[userId] || 'Utilisateur Inconnu';
  }

  private static getBuddyTypeLabel(type: BuddyType): string {
    const labels = {
      'parent': 'parent/tuteur',
      'friend': 'ami',
      'closeFriend': 'ami proche'
    };
    return labels[type];
  }

  private static generateMockBuddies(userId: string): BuddyRelation[] {
    return [
      {
        id: 'buddy_1',
        userId,
        buddyId: 'user_marie',
        type: 'closeFriend',
        status: 'accepted',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        acceptedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        consents: {
          activity: true,
          notifications: true,
          studyRoomInvites: true,
          planningAlerts: false
        },
        buddyName: 'Marie Dubois',
        buddyAvatar: '/avatars/marie.jpg',
        buddyFaculty: 'Sciences',
        buddyStatus: 'in-study-room',
        commonCourses: ['loi-gauss', 'integrales'],
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
        // Nouvelles propriétés
        realTimeStatus: 'in-study-room',
        currentStudyRoomId: 'room_123',
        currentStudyRoomName: 'Session Loi de Gauss',
        level: 8,
        totalXP: 1250,
        badges: [
          {
            id: 'active-participant',
            name: 'Participant Actif',
            description: 'Participe à 10 Study Rooms',
            icon: '⚡',
            color: 'bg-yellow-500',
            rarity: 'rare',
            category: 'study-rooms',
            unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ],
        progressionSimilarity: 85,
        coursesNotOwned: ['analyse-vectorielle', 'mecanique-quantique']
      },
      {
        id: 'buddy_2',
        userId,
        buddyId: 'user_pierre',
        type: 'friend',
        status: 'accepted',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        acceptedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        consents: {
          activity: true,
          notifications: true,
          studyRoomInvites: true,
          planningAlerts: false
        },
        buddyName: 'Pierre Martin',
        buddyAvatar: '/avatars/pierre.jpg',
        buddyFaculty: 'Sciences',
        buddyStatus: 'online',
        commonCourses: ['mecanique'],
        lastActivity: new Date(Date.now() - 30 * 60 * 1000),
        // Nouvelles propriétés
        realTimeStatus: 'online',
        level: 5,
        totalXP: 680,
        badges: [
          {
            id: 'first-room',
            name: 'Première Session',
            description: 'Rejoins ta première Study Room',
            icon: '🎥',
            color: 'bg-blue-500',
            rarity: 'common',
            category: 'study-rooms',
            unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        ],
        progressionSimilarity: 72,
        coursesNotOwned: ['algebre-lineaire']
      }
    ];
  }

  private static loadAllBuddies(): BuddyRelation[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private static saveBuddies(buddies: BuddyRelation[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(buddies));
  }

  private static loadAllInvitations(): BuddyInvitation[] {
    const stored = localStorage.getItem(this.INVITATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private static saveInvitations(invitations: BuddyInvitation[]): void {
    localStorage.setItem(this.INVITATIONS_KEY, JSON.stringify(invitations));
  }

  private static loadAllNotifications(): SocialNotification[] {
    const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private static saveNotifications(notifications: SocialNotification[]): void {
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }

  // ========================================================================
  // MÉTHODES DE DEBUG
  // ========================================================================

  static resetAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.INVITATIONS_KEY);
    localStorage.removeItem(this.NOTIFICATIONS_KEY);
  }

  static debugLog(): void {
    console.log('👥 Buddies:', this.loadAllBuddies());
    console.log('📩 Invitations:', this.loadAllInvitations());
    console.log('🔔 Notifications:', this.loadAllNotifications());
  }
}


