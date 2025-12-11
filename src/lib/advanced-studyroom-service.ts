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
  private static readonly DATA_VERSION = 15; // Incrémenter pour régénérer les données mock

  // ========================================================================
  // ACCÈS ET ÉLIGIBILITÉ
  // ========================================================================

  static checkStudyRoomAccess(userId: string, courseId: string, purchasedItems: Set<string>): StudyRoomAccess {
    // Le courseId peut déjà contenir le préfixe "course-", donc on le gère intelligemment
    const normalizedCourseId = courseId.startsWith('course-') ? courseId : `course-${courseId}`;
    const packId = this.getCoursePackId(courseId);
    const normalizedPackId = packId.startsWith('pack-') ? packId : `pack-${packId}`;
    
    const hasFullCourse = purchasedItems.has(normalizedCourseId) || purchasedItems.has(normalizedPackId);
    
    console.log('🔍 ACCESS CHECK:', {
      courseId,
      normalizedCourseId,
      packId,
      normalizedPackId,
      purchasedItems: Array.from(purchasedItems),
      hasFullCourse
    });
    
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
    const versionKey = `${this.STORAGE_KEY}_version`;
    const storedVersion = localStorage.getItem(versionKey);
    let rooms: AdvancedStudyRoom[] = [];
    
    console.log('🔍 STUDY ROOMS VERSION CHECK:', {
      storedVersion,
      currentVersion: this.DATA_VERSION,
      needsRegeneration: !stored || storedVersion !== String(this.DATA_VERSION)
    });
    
    // Régénérer si pas de données, ou si la version a changé
    if (!stored || storedVersion !== String(this.DATA_VERSION)) {
      console.log('🔄 REGENERATING Study Rooms with version:', this.DATA_VERSION);
      rooms = this.generateMockStudyRooms();
      this.saveStudyRooms(rooms);
      localStorage.setItem(versionKey, String(this.DATA_VERSION));
      console.log('✅ Study Rooms régénérées:', rooms.length, 'rooms');
    } else {
      try {
        rooms = JSON.parse(stored);
        console.log('📦 Study Rooms chargées depuis cache:', rooms.length, 'rooms');
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
      // Packs Q1
      'course-gauss': 'pack-physique-q1',
      'course-forces': 'pack-physique-q1',
      'course-suites': 'pack-math-q1',
      'course-integrales': 'pack-math-q1',
      'course-equilibres': 'pack-chimie-q1',
      'course-reactions': 'pack-chimie-q1',
      
      // Packs thématiques
      'loi-gauss': 'pack-electromagnetisme',
      'forces': 'pack-electromagnetisme',
      'equilibres': 'pack-sciences',
      'mecanique': 'pack-sciences',
      'integrales': 'pack-mathematiques',
      'analyse-math': 'pack-mathematiques',
      'suites-limites': 'pack-mathematiques'
    };
    return packMapping[courseId] || 'pack-general';
  }

  private static getPackNameById(courseId: string): string {
    const packNames: { [key: string]: string } = {
      // Packs Q1
      'course-gauss': 'Pack Physique Q1',
      'course-forces': 'Pack Physique Q1',
      'course-suites': 'Pack Mathématiques Q1',
      'course-integrales': 'Pack Mathématiques Q1',
      'course-equilibres': 'Pack Chimie Q1',
      'course-reactions': 'Pack Chimie Q1',
      
      // Packs thématiques
      'loi-gauss': 'Pack Électrostatique',
      'forces': 'Pack Électrostatique',
      'equilibres': 'Pack Sciences Expérimentales',
      'mecanique': 'Pack Sciences Expérimentales',
      'integrales': 'Pack Mathématiques Avancées',
      'analyse-math': 'Pack Mathématiques Avancées',
      'suites-limites': 'Pack Mathématiques Avancées'
    };
    return packNames[courseId] || 'Pack Général';
  }

  private static generateMockStudyRooms(): AdvancedStudyRoom[] {
    const now = new Date();
    
    // Cours et packs disponibles sur la plateforme (sans doublons)
    const coursesWithPacks = [
      // Pack Physique Q1
      { courseId: 'course-gauss', courseName: 'Loi de Gauss', packId: 'pack-physique-q1', packName: 'Physique Q1' },
      { courseId: 'course-forces', courseName: 'Forces et Mouvement', packId: 'pack-physique-q1', packName: 'Physique Q1' },
      
      // Pack Mathématiques Q1
      { courseId: 'course-suites', courseName: 'Suites et Limites', packId: 'pack-math-q1', packName: 'Mathématiques Q1' },
      { courseId: 'course-integrales', courseName: 'Intégrales et Applications', packId: 'pack-math-q1', packName: 'Mathématiques Q1' },
      
      // Pack Chimie Q1
      { courseId: 'course-equilibres', courseName: 'Équilibres Chimiques', packId: 'pack-chimie-q1', packName: 'Chimie Q1' },
      { courseId: 'course-reactions', courseName: 'Réactions Chimiques', packId: 'pack-chimie-q1', packName: 'Chimie Q1' },
      
      // Pack Analyse Mathématique
      { courseId: 'analyse-math', courseName: 'Analyse Mathématique I', packId: 'pack-mathematiques', packName: 'Mathématiques Avancées' },
      
      // Pack Mécanique
      { courseId: 'mecanique', courseName: 'Mécanique Classique', packId: 'pack-sciences', packName: 'Sciences Expérimentales' }
    ];

    const studyRooms: AdvancedStudyRoom[] = [];
    const sessionTypes = [
      { title: 'Débat - Concepts Clés', type: 'interactive' as const, desc: 'Discussion ouverte sur les concepts du cours' },
      { title: 'Session Pratique - Applications', type: 'interactive' as const, desc: 'Mise en pratique des théories' },
      { title: 'Session Interactive - Q&A', type: 'interactive' as const, desc: 'Questions-réponses en groupe' },
      { title: 'Atelier Collaboratif', type: 'interactive' as const, desc: 'Travail d\'équipe sur des exercices' }
    ];

    const creators = [
      { userId: 'user_marie', name: 'Marie Dubois', avatar: '/avatars/marie.jpg' },
      { userId: 'user_pierre', name: 'Pierre Martin', avatar: '/avatars/pierre.jpg' },
      { userId: 'user_sophie', name: 'Sophie Laurent', avatar: '/avatars/sophie.jpg' },
      { userId: 'user_alex', name: 'Alex Durand', avatar: '/avatars/alex.jpg' }
    ];

    // Créer 2 Study Rooms par cours pour chaque pack
    coursesWithPacks.forEach((course, courseIndex) => {
      sessionTypes.slice(0, 2).forEach((session, sessionIndex) => {
        const creator = creators[Math.floor(Math.random() * creators.length)];
        const roomId = `room_${course.packId}_${course.courseId}_${sessionIndex + 1}`;
        const isLive = sessionIndex === 0 && courseIndex < 3; // Quelques sessions live
        const isScheduled = !isLive && Math.random() > 0.5;
        
        const room: AdvancedStudyRoom = {
          id: roomId,
          courseId: course.courseId,
          courseName: course.courseName,
          title: `${session.title} - ${course.courseName}`,
          description: `${session.desc} | Pack: ${course.packName}`,
          type: session.type,
          visibility: 'public',
          status: isLive ? 'live' : (isScheduled ? 'scheduled' : 'ended'),
          createdBy: creator.userId,
          creatorName: creator.name,
          creatorAvatar: creator.avatar,
          createdAt: new Date(now.getTime() - (courseIndex + 1) * 2 * 60 * 60 * 1000),
          startsAt: isLive 
            ? new Date(now.getTime() - 1 * 60 * 60 * 1000)
            : new Date(now.getTime() + (sessionIndex + 1) * 2 * 60 * 60 * 1000),
          endsAt: isLive
            ? new Date(now.getTime() + 1 * 60 * 60 * 1000)
            : new Date(now.getTime() + (sessionIndex + 2) * 2 * 60 * 60 * 1000),
          actualStartTime: isLive ? new Date(now.getTime() - 1 * 60 * 60 * 1000) : undefined,
          maxParticipants: session.type === 'silent' ? 8 : 6,
          currentParticipants: isLive ? [
            {
              id: `part_${roomId}_1`,
              roomId,
              userId: creator.userId,
              userName: creator.name,
              userAvatar: creator.avatar,
              role: 'moderator',
              joinedAt: new Date(now.getTime() - 55 * 60 * 1000),
              isBuddy: courseIndex <= 1, // Toujours buddy pour gauss et forces
              isActive: true,
              lastActivity: new Date(now.getTime() - Math.floor(Math.random() * 10) * 60 * 1000)
            },
            // Ajouter des buddies pour les 2 premiers cours (gauss et forces)
            ...(courseIndex <= 1 ? [
              {
                id: `part_${roomId}_2`,
                roomId,
                userId: 'user_marie',
                userName: 'Marie Dubois',
                userAvatar: '/avatars/marie.jpg',
                role: 'participant',
                joinedAt: new Date(now.getTime() - 40 * 60 * 1000),
                isBuddy: true,
                isActive: true,
                lastActivity: new Date(now.getTime() - 5 * 60 * 1000)
              },
              {
                id: `part_${roomId}_3`,
                roomId,
                userId: 'user_pierre',
                userName: 'Pierre Martin',
                userAvatar: '/avatars/pierre.jpg',
                role: 'participant',
                joinedAt: new Date(now.getTime() - 30 * 60 * 1000),
                isBuddy: true,
                isActive: true,
                lastActivity: new Date(now.getTime() - 2 * 60 * 1000)
              }
            ] : [])
          ] : [],
          invitedUsers: isScheduled ? ['user_marie', 'user_sophie'] : [],
          tags: [session.type === 'silent' ? 'focus' : 'discussion', 'pack', course.packName.toLowerCase()],
          isRecorded: session.type === 'interactive',
          replayAddedToCourse: false,
          abusiveReports: [],
          isComplement: false, // Rooms de pack, pas de compléments
          hasActiveBuddies: courseIndex <= 1 ? true : (isLive && Math.random() > 0.5),
          buddyCount: courseIndex <= 1 ? 2 : (isLive ? Math.floor(Math.random() * 3) : 0),
          xpReward: session.type === 'interactive' ? 30 : 20
        };

        studyRooms.push(room);
      });
    });

    // 🔇 Ajouter quelques sessions silencieuses pour 2 cours spécifiques
    const silentSessions = [
      {
        courseId: 'course-gauss',
        courseName: 'Loi de Gauss',
        title: 'Session Focus - Exercices Silencieux',
        desc: 'Travail individuel concentré sur les exercices'
      },
      {
        courseId: 'course-suites',
        courseName: 'Suites et Limites',
        title: 'Focus Groupe - Révisions',
        desc: 'Session silencieuse pour réviser en profondeur'
      },
      // Session programmée bientôt pour suggestions (sur un cours possédé)
      {
        courseId: 'course-forces',
        courseName: 'Forces et Mouvement',
        title: 'Session Interactive - Forces et Dynamique',
        desc: 'Résolution d\'exercices de forces et dynamique en groupe'
      }
    ];

    silentSessions.forEach((session, idx) => {
      const creator = creators[idx % creators.length];
      const roomId = `room_silent_${session.courseId}_${idx}`;
      const isLive = idx === 0;
      const isScheduledSoon = idx === 2; // La session Mécanique programmée dans 15 min
      
      const room: AdvancedStudyRoom = {
        id: roomId,
        courseId: session.courseId,
        courseName: session.courseName,
        title: session.title,
        description: session.desc,
        type: isScheduledSoon ? 'interactive' : 'silent',
        visibility: 'public',
        status: isLive ? 'live' : 'scheduled',
        createdBy: creator.userId,
        creatorName: creator.name,
        creatorAvatar: creator.avatar,
        createdAt: new Date(now.getTime() - idx * 3 * 60 * 60 * 1000),
        startsAt: isLive 
          ? new Date(now.getTime() - 30 * 60 * 1000)
          : isScheduledSoon 
            ? new Date(now.getTime() + 15 * 60 * 1000) // Dans 15 minutes
            : new Date(now.getTime() + (idx + 1) * 5 * 60 * 60 * 1000),
        endsAt: isLive
          ? new Date(now.getTime() + 90 * 60 * 1000)
          : isScheduledSoon
            ? new Date(now.getTime() + 75 * 60 * 1000) // 1h de session
            : new Date(now.getTime() + (idx + 2) * 5 * 60 * 60 * 1000),
        actualStartTime: isLive ? new Date(now.getTime() - 30 * 60 * 1000) : undefined,
        maxParticipants: isScheduledSoon ? 10 : 8,
        currentParticipants: idx === 0 ? [
          {
            id: `part_${roomId}_1`,
            roomId,
            userId: creator.userId,
            userName: creator.name,
            userAvatar: creator.avatar,
            role: 'moderator',
            joinedAt: new Date(now.getTime() - 25 * 60 * 1000),
            isBuddy: false,
            isActive: true,
            lastActivity: new Date(now.getTime() - 5 * 60 * 1000)
          },
          // Ajouter des buddies pour les suggestions
          {
            id: `part_${roomId}_2`,
            roomId,
            userId: 'user_marie',
            userName: 'Marie Dubois',
            userAvatar: '/avatars/marie.jpg',
            role: 'participant',
            joinedAt: new Date(now.getTime() - 20 * 60 * 1000),
            isBuddy: true,
            isActive: true,
            lastActivity: new Date(now.getTime() - 2 * 60 * 1000)
          },
          {
            id: `part_${roomId}_3`,
            roomId,
            userId: 'user_pierre',
            userName: 'Pierre Martin',
            userAvatar: '/avatars/pierre.jpg',
            role: 'participant',
            joinedAt: new Date(now.getTime() - 15 * 60 * 1000),
            isBuddy: true,
            isActive: true,
            lastActivity: new Date(now.getTime() - 1 * 60 * 1000)
          }
        ] : [],
        invitedUsers: isScheduledSoon ? ['user_sophie', 'user_lucas'] : [],
        tags: isScheduledSoon ? ['interactive', 'groupe', 'dynamique'] : ['focus', 'silent', 'revision'],
        isRecorded: isScheduledSoon ? true : false,
        replayAddedToCourse: false,
        abusiveReports: [],
        isComplement: false,
        hasActiveBuddies: idx === 0 || isScheduledSoon ? true : false,
        buddyCount: idx === 0 ? 2 : (isScheduledSoon ? 2 : 0),
        xpReward: isScheduledSoon ? 30 : 20
      };

      studyRooms.push(room);
    });

    // 🎓 Ajouter des sessions "Compléments" de Zak (le fondateur)
    const complementSessions: AdvancedStudyRoom[] = [
      // 🔥 Session Compléments LIVE pour suggestions (sur un cours que l'utilisateur possède)
      {
        id: 'complement_gauss_live',
        courseId: 'course-gauss',
        courseName: 'Loi de Gauss',
        title: '🎓 Session Compléments avec Zak - Applications du Théorème de Gauss',
        description: 'Session exclusive EN DIRECT avec le fondateur : maîtrisez les applications avancées du théorème de Gauss',
        type: 'interactive',
        visibility: 'public',
        status: 'live',
        createdBy: 'founder-zak',
        creatorName: 'Zak (Fondateur)',
        creatorAvatar: '/avatars/zak.jpg',
        createdAt: new Date(now.getTime() - 15 * 60 * 1000),
        startsAt: new Date(now.getTime() - 10 * 60 * 1000),
        endsAt: new Date(now.getTime() + 50 * 60 * 1000),
        actualStartTime: new Date(now.getTime() - 10 * 60 * 1000),
        maxParticipants: 50,
        currentParticipants: [
          {
            id: 'part_comp_live_1',
            roomId: 'complement_gauss_live',
            userId: 'founder-zak',
            userName: 'Zak (Fondateur)',
            userAvatar: '/avatars/zak.jpg',
            role: 'moderator',
            joinedAt: new Date(now.getTime() - 10 * 60 * 1000),
            isBuddy: false,
            isActive: true,
            lastActivity: new Date(now.getTime() - 30 * 1000)
          },
          {
            id: 'part_comp_live_2',
            roomId: 'complement_gauss_live',
            userId: 'user_sophie',
            userName: 'Sophie Laurent',
            userAvatar: '/avatars/sophie.jpg',
            role: 'participant',
            joinedAt: new Date(now.getTime() - 8 * 60 * 1000),
            isBuddy: true,
            isActive: true,
            lastActivity: new Date(now.getTime() - 15 * 1000)
          },
          {
            id: 'part_comp_live_3',
            roomId: 'complement_gauss_live',
            userId: 'user_lucas',
            userName: 'Lucas M.',
            userAvatar: '/avatars/lucas.jpg',
            role: 'participant',
            joinedAt: new Date(now.getTime() - 5 * 60 * 1000),
            isBuddy: false,
            isActive: true,
            lastActivity: new Date(now.getTime() - 10 * 1000)
          }
        ],
        invitedUsers: [],
        tags: ['complement', 'live', 'zak'],
        isRecorded: true,
        replayUrl: undefined,
        replayAddedToCourse: false,
        abusiveReports: [],
        isComplement: true,
        hasActiveBuddies: true,
        buddyCount: 1,
        xpReward: 100
      },
      {
        id: 'complement_loi_gauss_1',
        courseId: 'course-gauss',
        courseName: 'Loi de Gauss',
        title: '🎓 Session Compléments avec Zak - Méthode de résolution avancée',
        description: 'Session exclusive avec le fondateur : découvrez les astuces pour maîtriser les calculs de champ électrique complexes',
        type: 'interactive',
        visibility: 'public',
        status: 'ended',
        createdBy: 'founder-zak',
        creatorName: 'Zak (Fondateur)',
        creatorAvatar: '/avatars/zak.jpg',
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Il y a 1 semaine
        startsAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        endsAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        actualStartTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        actualEndTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        maxParticipants: 50,
        currentParticipants: [],
        invitedUsers: [],
        tags: ['compléments', 'zak', 'fondateur', 'masterclass'],
        isRecorded: true,
        enableRecording: true,
        replayAddedToCourse: true,
        recordingUrl: '/replays/complement-gauss-1.mp4',
        abusiveReports: [],
        isComplement: true,
        hasActiveBuddies: false,
        buddyCount: 0,
        xpReward: 50
      },
      {
        id: 'complement_suites_limites_1',
        courseId: 'course-suites',
        courseName: 'Suites et Limites',
        title: '🎓 Session Compléments avec Zak - Techniques de convergence',
        description: 'Masterclass exclusive : apprenez les techniques avancées pour démontrer la convergence des suites',
        type: 'interactive',
        visibility: 'public',
        status: 'live',
        createdBy: 'founder-zak',
        creatorName: 'Zak (Fondateur)',
        creatorAvatar: '/avatars/zak.jpg',
        createdAt: new Date(now.getTime() - 30 * 60 * 1000), // Il y a 30 minutes
        startsAt: new Date(now.getTime() - 15 * 60 * 1000), // Commencé il y a 15 min
        endsAt: new Date(now.getTime() + 45 * 60 * 1000), // Encore 45 min
        actualStartTime: new Date(now.getTime() - 15 * 60 * 1000),
        maxParticipants: 50,
        currentParticipants: [
          {
            id: 'part_complement_1',
            roomId: 'complement_suites_limites_1',
            userId: 'founder-zak',
            userName: 'Zak (Fondateur)',
            userAvatar: '/avatars/zak.jpg',
            role: 'moderator',
            joinedAt: new Date(now.getTime() - 15 * 60 * 1000),
            isBuddy: false,
            isActive: true,
            lastActivity: new Date(now.getTime() - 1 * 60 * 1000)
          }
        ],
        invitedUsers: [],
        tags: ['compléments', 'zak', 'fondateur', 'masterclass', 'live'],
        isRecorded: true,
        enableRecording: true,
        replayAddedToCourse: false,
        abusiveReports: [],
        isComplement: true,
        hasActiveBuddies: false,
        buddyCount: 0,
        xpReward: 50
      },
      {
        id: 'complement_integrales_1',
        courseId: 'course-integrales',
        courseName: 'Intégrales et Applications',
        title: '🎓 Session Compléments avec Zak - Intégration par parties avancée',
        description: 'Session spéciale : découvrez les cas particuliers et les astuces pour l\'intégration par parties',
        type: 'interactive',
        visibility: 'public',
        status: 'scheduled',
        createdBy: 'founder-zak',
        creatorName: 'Zak (Fondateur)',
        creatorAvatar: '/avatars/zak.jpg',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        startsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
        endsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 1h30
        maxParticipants: 50,
        currentParticipants: [],
        invitedUsers: [],
        tags: ['compléments', 'zak', 'fondateur', 'masterclass', 'à-venir'],
        isRecorded: true,
        enableRecording: true,
        replayAddedToCourse: false,
        abusiveReports: [],
        isComplement: true,
        hasActiveBuddies: false,
        buddyCount: 0,
        xpReward: 50
      }
    ];

    // Ajouter les sessions compléments au début de la liste
    studyRooms.unshift(...complementSessions);

    console.log('🎓 MOCK STUDY ROOMS GENERATED:', {
      total: studyRooms.length,
      byStatus: {
        live: studyRooms.filter(r => r.status === 'live').length,
        scheduled: studyRooms.filter(r => r.status === 'scheduled').length,
        ended: studyRooms.filter(r => r.status === 'ended').length,
      },
      complements: studyRooms.filter(r => r.isComplement).length,
      withBuddies: studyRooms.filter(r => r.buddyCount > 0).length,
      courses: [...new Set(studyRooms.map(r => r.courseId))]
    });

    const sorted = studyRooms.sort((a, b) => {
      // Priorité absolue : Compléments en premier
      if (a.isComplement && !b.isComplement) return -1;
      if (!a.isComplement && b.isComplement) return 1;
      
      // Puis par statut : live > scheduled > ended
      const statusOrder = { 'live': 0, 'scheduled': 1, 'ended': 2, 'cancelled': 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
    
    console.log('📋 TOP 5 STUDY ROOMS:', sorted.slice(0, 5).map(r => ({
      id: r.id,
      course: r.courseId,
      name: r.courseName,
      status: r.status,
      isComplement: r.isComplement,
      buddyCount: r.buddyCount
    })));
    
    return sorted;
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
  // MÉTHODES DE DEBUG ET RÉGÉNÉRATION
  // ========================================================================

  static resetData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.PARTICIPANTS_KEY);
    localStorage.removeItem(this.REPORTS_KEY);
    console.log('✅ Données des Study Rooms réinitialisées');
  }

  static refreshStudyRooms(): AdvancedStudyRoom[] {
    localStorage.removeItem(this.STORAGE_KEY);
    const newRooms = this.generateMockStudyRooms();
    this.saveStudyRooms(newRooms);
    console.log(`✅ ${newRooms.length} Study Rooms régénérées pour tous les packs`);
    return newRooms;
  }

  static debugLog(): void {
    const rooms = this.getAllStudyRooms();
    console.log('🏢 Study Rooms:', rooms);
    console.log(`📊 Total: ${rooms.length} rooms`);
    console.log(`🟢 Live: ${rooms.filter(r => r.status === 'live').length}`);
    console.log(`📅 Scheduled: ${rooms.filter(r => r.status === 'scheduled').length}`);
    console.log(`⏹️ Ended: ${rooms.filter(r => r.status === 'ended').length}`);
    
    // Grouper par pack
    const byPack: { [key: string]: number } = {};
    rooms.forEach(room => {
      const packTag = room.tags.find(t => t.includes('q1') || t.includes('mathematiques') || t.includes('sciences') || t.includes('électrostatique'));
      const packName = packTag || 'autre';
      byPack[packName] = (byPack[packName] || 0) + 1;
    });
    console.log('📦 Par pack:', byPack);
  }
}
