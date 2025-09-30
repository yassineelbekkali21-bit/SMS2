'use client';

import {
  AdvancedStudyRoom,
  StudyRoomParticipant,
  StudyRoomAccess,
  AbuseReport,
  StudyRoomType,
  StudyRoomVisibility,
  StudyRoomStatus,
  ParticipantRole,
  PurchaseOption
} from '@/types';

export class AdvancedStudyRoomService {
  private static readonly STORAGE_KEY = 'advanced_study_rooms_v1';
  private static readonly PARTICIPANTS_KEY = 'study_room_participants_v1';
  private static readonly REPORTS_KEY = 'abuse_reports_v1';

  // ========================================================================
  // ACCÈS ET ÉLIGIBILITÉ
  // ========================================================================

  static checkStudyRoomAccess(userId: string, courseId: string, purchasedItems: Set<string>): StudyRoomAccess {
    const hasFullCourse = purchasedItems.has(`course-${courseId}`) || purchasedItems.has(`pack-${this.getCoursePackId(courseId)}`);
    
    if (hasFullCourse) {
      return {
        canJoin: true,
        canCreate: true,
        hasFullCourse: true
      };
    }

    // Générer options d'upgrade
    const upgradeOptions: PurchaseOption[] = [
      {
        type: 'course',
        itemId: courseId,
        title: `Cours Complet ${this.getCourseNameById(courseId)}`,
        price: 700,
        features: [
          'Accès à toutes les leçons',
          'Study Rooms illimitées',
          'Sessions avec des experts',
          'Replay des sessions'
        ]
      },
      {
        type: 'pack',
        itemId: this.getCoursePackId(courseId),
        title: `Pack Complet - ${this.getPackNameById(courseId)}`,
        price: 1200,
        features: [
          'Accès à tous les cours du pack',
          'Study Rooms premium',
          'Coaching personnalisé',
          'Mentorat communautaire'
        ]
      }
    ];

    return {
      canJoin: false,
      canCreate: false,
      hasFullCourse: false,
      reason: 'Accès Study Rooms réservé aux possesseurs du cours complet',
      upgradeOptions
    };
  }

  // ========================================================================
  // GESTION DES STUDY ROOMS
  // ========================================================================

  static getAllStudyRooms(courseId?: string): AdvancedStudyRoom[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    let rooms: AdvancedStudyRoom[] = [];
    
    if (!stored) {
      rooms = this.generateMockStudyRooms();
      this.saveStudyRooms(rooms);
    } else {
      try {
        rooms = JSON.parse(stored);
      } catch (error) {
        console.error('Erreur lors du chargement des Study Rooms:', error);
        rooms = this.generateMockStudyRooms();
      }
    }

    if (courseId) {
      rooms = rooms.filter(room => room.courseId === courseId);
    }

    return rooms
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getActiveStudyRooms(): AdvancedStudyRoom[] {
    return this.getAllStudyRooms().filter(room => room.status === 'live');
  }

  static getStudyRoomById(roomId: string): AdvancedStudyRoom | null {
    const rooms = this.getAllStudyRooms();
    return rooms.find(room => room.id === roomId) || null;
  }

  static createStudyRoom(data: {
    courseId: string;
    title: string;
    description?: string;
    type: StudyRoomType;
    visibility: StudyRoomVisibility;
    createdBy: string;
    creatorName: string;
    startsAt: Date;
    estimatedDuration?: number;
    maxParticipants?: number;
    invitedUsers?: string[];
    tags?: string[];
    isComplement?: boolean;
    enableRecording?: boolean;
  }): AdvancedStudyRoom {
    const duration = data.estimatedDuration || 120; // en minutes
    const endTime = new Date(data.startsAt.getTime() + duration * 60 * 1000);

    const newRoom: AdvancedStudyRoom = {
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      courseName: this.getCourseNameById(data.courseId),
      status: data.startsAt <= new Date() ? 'live' : 'scheduled',
      createdAt: new Date(),
      endsAt: endTime,
      currentParticipants: [],
      invitedUsers: data.invitedUsers || [],
      tags: data.tags || (data.isComplement ? ['Compléments'] : []),
      isRecorded: data.enableRecording || false,
      replayAddedToCourse: false,
      abusiveReports: [],
      creatorAvatar: `/avatars/${data.createdBy}.jpg`,
      isComplement: data.isComplement || false,
      enableRecording: data.enableRecording || false,
      estimatedDuration: duration,
      ...data
    };

    // Ajouter le créateur comme modérateur
    const creatorParticipant: StudyRoomParticipant = {
      id: `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId: newRoom.id,
      userId: data.createdBy,
      userName: data.creatorName,
      userAvatar: newRoom.creatorAvatar,
      role: 'moderator',
      joinedAt: new Date(),
      isBuddy: false,
      isActive: true,
      lastActivity: new Date()
    };

    newRoom.currentParticipants.push(creatorParticipant);

    const allRooms = this.getAllStudyRooms();
    allRooms.push(newRoom);
    this.saveStudyRooms(allRooms);

    // Si c'est une Study Room "Compléments", envoyer des notifications
    if (newRoom.isComplement) {
      this.sendComplementNotifications(newRoom);
    }

    return newRoom;
  }

  static joinStudyRoom(roomId: string, userId: string, userName: string, isBuddy: boolean = false): boolean {
    const allRooms = this.getAllStudyRooms();
    const roomIndex = allRooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return false;

    const room = allRooms[roomIndex];
    
    // Vérifier si l'utilisateur est déjà dans la room
    if (room.currentParticipants.some(p => p.userId === userId && !p.leftAt)) {
      return false;
    }

    // Vérifier les limites
    if (room.maxParticipants && room.currentParticipants.filter(p => !p.leftAt).length >= room.maxParticipants) {
      return false;
    }

    const newParticipant: StudyRoomParticipant = {
      id: `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      userId,
      userName,
      userAvatar: `/avatars/${userId}.jpg`,
      role: 'participant',
      joinedAt: new Date(),
      isBuddy,
      isActive: true,
      lastActivity: new Date()
    };

    room.currentParticipants.push(newParticipant);
    
    // Démarrer automatiquement si c'était programmé
    if (room.status === 'scheduled' && new Date() >= room.startsAt) {
      room.status = 'live';
      room.actualStartTime = new Date();
    }

    allRooms[roomIndex] = room;
    this.saveStudyRooms(allRooms);

    return true;
  }

  static leaveStudyRoom(roomId: string, userId: string): boolean {
    const allRooms = this.getAllStudyRooms();
    const roomIndex = allRooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return false;

    const room = allRooms[roomIndex];
    const participantIndex = room.currentParticipants.findIndex(p => p.userId === userId && !p.leftAt);
    
    if (participantIndex === -1) return false;

    room.currentParticipants[participantIndex].leftAt = new Date();
    room.currentParticipants[participantIndex].isActive = false;

    // Si c'était le dernier participant, terminer la room
    const activeParticipants = room.currentParticipants.filter(p => !p.leftAt);
    if (activeParticipants.length === 0) {
      room.status = 'ended';
      room.actualEndTime = new Date();
    }

    allRooms[roomIndex] = room;
    this.saveStudyRooms(allRooms);

    return true;
  }

  // ========================================================================
  // MODÉRATION ET SIGNALEMENT
  // ========================================================================

  static reportAbuse(data: {
    roomId: string;
    reporterId: string;
    reporterName: string;
    reportedUserId?: string;
    reportedUserName?: string;
    type: 'inappropriate-content' | 'harassment' | 'spam' | 'other';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }): AbuseReport {
    const report: AbuseReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date(),
      ...data
    };

    const allRooms = this.getAllStudyRooms();
    const roomIndex = allRooms.findIndex(room => room.id === data.roomId);
    
    if (roomIndex !== -1) {
      allRooms[roomIndex].abusiveReports.push(report);
      this.saveStudyRooms(allRooms);
    }

    return report;
  }

  static kickParticipant(roomId: string, moderatorId: string, participantId: string): boolean {
    const allRooms = this.getAllStudyRooms();
    const roomIndex = allRooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return false;

    const room = allRooms[roomIndex];
    
    // Vérifier que l'utilisateur est modérateur
    const moderator = room.currentParticipants.find(p => p.userId === moderatorId && p.role === 'moderator');
    if (!moderator) return false;

    // Kicker le participant
    const participantIndex = room.currentParticipants.findIndex(p => p.userId === participantId);
    if (participantIndex !== -1) {
      room.currentParticipants[participantIndex].leftAt = new Date();
      room.currentParticipants[participantIndex].isActive = false;
    }

    allRooms[roomIndex] = room;
    this.saveStudyRooms(allRooms);

    return true;
  }

  // ========================================================================
  // FONCTIONNALITÉS AVANCÉES
  // ========================================================================

  static addReplayToCourse(roomId: string, recordingUrl: string): boolean {
    const allRooms = this.getAllStudyRooms();
    const roomIndex = allRooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return false;

    const room = allRooms[roomIndex];
    room.recordingUrl = recordingUrl;
    room.replayAddedToCourse = true;

    allRooms[roomIndex] = room;
    this.saveStudyRooms(allRooms);

    return true;
  }

  static getStudyRoomsWithBuddies(userId: string, buddyIds: string[]): AdvancedStudyRoom[] {
    const allRooms = this.getActiveStudyRooms();
    
    return allRooms.filter(room => 
      room.currentParticipants.some(p => 
        buddyIds.includes(p.userId) && !p.leftAt
      )
    );
  }

  static notifyStudentsOfLiveSession(roomId: string): string[] {
    const room = this.getStudyRoomById(roomId);
    if (!room) return [];

    // Simuler l'envoi de notifications
    const notifiedStudents = ['user_marie', 'user_pierre', 'user_sophie'];
    
    console.log(`📢 Notification envoyée pour la Study Room "${room.title}" du cours ${room.courseName}`);
    
    return notifiedStudents;
  }

  // ========================================================================
  // UTILITAIRES
  // ========================================================================

  private static getCourseNameById(courseId: string): string {
    const courseNames: { [key: string]: string } = {
      'suites-limites': 'Suites et Limites',
      'loi-gauss': 'Loi de Gauss',
      'integrales': 'Intégrales et Applications',
      'mecanique': 'Mécanique Classique',
      'equilibres': 'Équilibres Chimiques',
      'forces': 'Forces et Mouvement',
      'analyse-math': 'Analyse Mathématique I'
    };
    return courseNames[courseId] || 'Cours Inconnu';
  }

  private static getCoursePackId(courseId: string): string {
    const packMapping: { [key: string]: string } = {
      'loi-gauss': 'electrostatique',
      'equilibres': 'chimie-generale',
      'mecanique': 'physique-classique',
      'forces': 'physique-classique',
      'integrales': 'mathematiques-avancees',
      'analyse-math': 'mathematiques-avancees',
      'suites-limites': 'mathematiques-fondamentales'
    };
    return packMapping[courseId] || 'pack-general';
  }

  private static getPackNameById(courseId: string): string {
    const packNames: { [key: string]: string } = {
      'loi-gauss': 'Pack Électrostatique',
      'equilibres': 'Pack Chimie Générale',
      'mecanique': 'Pack Physique Classique',
      'forces': 'Pack Physique Classique',
      'integrales': 'Pack Mathématiques Avancées',
      'analyse-math': 'Pack Mathématiques Avancées',
      'suites-limites': 'Pack Mathématiques Fondamentales'
    };
    return packNames[courseId] || 'Pack Général';
  }

  private static generateMockStudyRooms(): AdvancedStudyRoom[] {
    const now = new Date();
    
    return [
      {
        id: 'room_loi_gauss_1',
        courseId: 'loi-gauss',
        courseName: 'Loi de Gauss',
        title: 'Session Focus - Calculs de Champ',
        description: 'Session silencieuse dédiée aux exercices de calcul de champ électrique',
        type: 'silent',
        visibility: 'public',
        status: 'live',
        createdBy: 'user_marie',
        creatorName: 'Marie Dubois',
        creatorAvatar: '/avatars/marie.jpg',
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        startsAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        endsAt: new Date(now.getTime() + 1 * 60 * 60 * 1000),
        actualStartTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        maxParticipants: 8,
        currentParticipants: [
          {
            id: 'part_1',
            roomId: 'room_loi_gauss_1',
            userId: 'user_marie',
            userName: 'Marie Dubois',
            userAvatar: '/avatars/marie.jpg',
            role: 'moderator',
            joinedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
            isBuddy: true,
            isActive: true,
            lastActivity: new Date(now.getTime() - 5 * 60 * 1000)
          },
          {
            id: 'part_2',
            roomId: 'room_loi_gauss_1',
            userId: 'user_alex',
            userName: 'Alex Durand',
            userAvatar: '/avatars/alex.jpg',
            role: 'participant',
            joinedAt: new Date(now.getTime() - 45 * 60 * 1000),
            isBuddy: false,
            isActive: true,
            lastActivity: new Date(now.getTime() - 2 * 60 * 1000)
          }
        ],
        invitedUsers: [],
        tags: ['focus', 'exercices'],
        isRecorded: false,
        replayAddedToCourse: false,
        abusiveReports: []
      },
      {
        id: 'room_integrales_1',
        courseId: 'integrales',
        courseName: 'Intégrales et Applications',
        title: 'Débat - Applications Pratiques',
        description: 'Discussion ouverte sur les applications des intégrales en ingénierie',
        type: 'interactive',
        visibility: 'buddies',
        status: 'scheduled',
        createdBy: 'user_pierre',
        creatorName: 'Pierre Martin',
        creatorAvatar: '/avatars/pierre.jpg',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        startsAt: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        endsAt: new Date(now.getTime() + 4 * 60 * 60 * 1000),
        maxParticipants: 6,
        currentParticipants: [],
        invitedUsers: ['user_marie', 'user_sophie'],
        tags: ['débat', 'applications'],
        isRecorded: true,
        replayAddedToCourse: false,
        abusiveReports: []
      }
    ];
  }

  private static saveStudyRooms(rooms: AdvancedStudyRoom[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rooms));
  }

  static sendComplementNotifications(room: AdvancedStudyRoom): void {
    // Simuler l'envoi de notifications à tous les étudiants du cours
    const notificationMessage = `📚 Nouvelle session "Compléments" disponible : ${room.title}`;
    
    console.log(`🔔 Notification Study Room "Compléments" envoyée:`);
    console.log(`📧 Email push envoyé à tous les étudiants du cours "${room.courseName}"`);
    console.log(`📱 Notification mobile: ${notificationMessage}`);
    console.log(`⏰ Début: ${room.startsAt.toLocaleString('fr-FR')}`);
    console.log(`🎯 Type: ${room.type === 'silent' ? 'Silencieuse (focus)' : 'Interactive (échange)'}`);
    console.log(`👥 Visibilité: ${room.visibility === 'public' ? 'Publique' : room.visibility === 'buddies' ? 'Buddies uniquement' : 'Privée'}`);
    console.log(`🎬 Enregistrement: ${room.enableRecording ? 'Activé (replay ajouté au cours)' : 'Désactivé'}`);
    
    // Dans un vrai système, ici on ferait appel aux services de notification
    // EmailService.sendToAllStudents(room.courseId, notificationMessage);
    // PushNotificationService.sendToAllStudents(room.courseId, notificationMessage);
    // SMSService.sendToOptedInStudents(room.courseId, notificationMessage);
  }

  // ========================================================================
  // MÉTHODES DE DEBUG
  // ========================================================================

  static resetData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.PARTICIPANTS_KEY);
    localStorage.removeItem(this.REPORTS_KEY);
  }

  static debugLog(): void {
    console.log('🏢 Study Rooms:', this.getAllStudyRooms());
  }
}
