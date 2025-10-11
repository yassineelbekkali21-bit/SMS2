import { 
  Course, 
  Lesson, 
  StudyRoomCourseAccess, 
  StudyRoomNotification, 
  StudyRoomState,
  CourseStudyRoom,
  StudyRoomHeaderState,
  User
} from '@/types';

/**
 * Service de gestion des Study Rooms
 * Gère l'accès conditionné, les notifications et l'état global des Study Rooms
 */
export class StudyRoomService {
  
  /**
   * Vérifie si un utilisateur a accès à la Study Room d'un cours
   * Règles d'accès :
   * - Pack complet du cours acheté → accès total
   * - Toutes les leçons du cours débloquées individuellement → accès total
   * - Seulement quelques leçons → pas d'accès
   */
  static checkCourseAccess(
    course: Course, 
    purchasedItems: string[], 
    userId: string
  ): StudyRoomCourseAccess {
    const courseId = course.id;
    const totalLessons = course.lessons?.length || course.totalLessons || 0;
    
    // Vérifier si le pack complet du cours est acheté
    // L'accès Study Room nécessite OBLIGATOIREMENT l'achat du cours complet ou d'un pack contenant ce cours
    // Format des purchasedItems: "course-{courseId}" ou "pack-{packId}"
    const hasFullCourse = purchasedItems.includes(`course-${courseId}`) || 
                         purchasedItems.includes(courseId) || // Fallback pour l'ancien format
                         (course.packId && purchasedItems.includes(`pack-${course.packId}`)); // Pack spécifique du cours
    
    // Compter les leçons possédées individuellement
    const ownedLessons = course.lessons?.filter(lesson => 
      lesson.isOwned || purchasedItems.includes(lesson.id)
    ).map(lesson => lesson.id) || [];
    
    // Déterminer le type d'accès
    let accessReason: 'full-course' | 'all-lessons' | 'partial';
    let hasFullAccess = false;
    
    if (hasFullCourse) {
      accessReason = 'full-course';
      hasFullAccess = true;
    } else if (ownedLessons.length === totalLessons && totalLessons > 0) {
      accessReason = 'all-lessons';
      hasFullAccess = true;
    } else {
      accessReason = 'partial';
      hasFullAccess = false;
    }
    
    return {
      userId,
      courseId,
      hasFullAccess,
      ownedLessons,
      totalLessons,
      accessReason,
      purchasedItems: purchasedItems.filter(item => 
        item === courseId || ownedLessons.includes(item)
      )
    };
  }

  /**
   * Obtient toutes les Study Rooms actives auxquelles l'utilisateur a accès
   */
  static getAccessibleStudyRooms(
    activeRooms: CourseStudyRoom[],
    userAccess: Record<string, StudyRoomCourseAccess>,
    userId: string
  ): CourseStudyRoom[] {
    return activeRooms.filter(room => {
      // Si la room n'est pas liée à un cours, l'accès est libre
      if (!room.courseId) return true;
      
      // Vérifier l'accès au cours
      const courseAccess = userAccess[room.courseId];
      if (!courseAccess) return false;
      
      // Si la room nécessite un accès complet et que l'utilisateur ne l'a pas
      if (room.requiresFullAccess && !courseAccess.hasFullAccess) {
        return false;
      }
      
      // Vérifier la liste blanche si elle existe
      if (room.allowedUserIds && !room.allowedUserIds.includes(userId)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Calcule l'état du header Study Room
   */
  static getHeaderState(
    accessibleRooms: CourseStudyRoom[],
    notifications: StudyRoomNotification[],
    friends: User[] = []
  ): StudyRoomHeaderState {
    const hasActiveRooms = accessibleRooms.length > 0;
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    // Compter les amis présents dans les Study Rooms accessibles
    const friendsInRooms = accessibleRooms.reduce((count, room) => {
      const friendsInThisRoom = room.currentUsers.filter(user => 
        friends.some(friend => friend.id === user.id)
      ).length;
      return count + friendsInThisRoom;
    }, 0);
    
    return {
      hasActiveRooms,
      friendsInRooms,
      accessibleRoomsCount: accessibleRooms.length,
      notifications: unreadNotifications
    };
  }

  /**
   * Crée une notification pour une Study Room
   */
  static createNotification(
    type: StudyRoomNotification['type'],
    studyRoomId: string,
    targetUserId: string,
    metadata?: {
      courseId?: string;
      courseName?: string;
      roomName?: string;
      friendsPresent?: number;
      totalParticipants?: number;
    }
  ): StudyRoomNotification {
    const messages = {
      'room-opened': `Une Study Room "${metadata?.roomName}" vient de s'ouvrir pour ${metadata?.courseName || 'votre cours'}`,
      'friend-joined': `Un ami a rejoint la Study Room "${metadata?.roomName}"`,
      'room-starting': `La Study Room "${metadata?.roomName}" va commencer dans 5 minutes`,
      'room-ending': `La Study Room "${metadata?.roomName}" se termine dans 10 minutes`,
      'course-room-available': `Une Study Room est maintenant disponible pour ${metadata?.courseName}`
    };

    return {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studyRoomId,
      courseId: metadata?.courseId,
      courseName: metadata?.courseName,
      type,
      message: messages[type],
      timestamp: new Date(),
      isRead: false,
      targetUserId,
      metadata
    };
  }

  /**
   * Vérifie si un utilisateur peut créer une Study Room pour un cours
   */
  static canCreateStudyRoom(
    courseAccess: StudyRoomCourseAccess,
    user: User,
    isAdmin: boolean = false
  ): boolean {
    // Les admins peuvent toujours créer des Study Rooms
    if (isAdmin) return true;
    
    // L'utilisateur doit avoir un accès complet au cours
    return courseAccess.hasFullAccess;
  }

  /**
   * Génère un message d'accès refusé personnalisé
   */
  static getAccessDeniedMessage(
    courseAccess: StudyRoomCourseAccess,
    courseName: string
  ): string {
    if (courseAccess.accessReason === 'partial') {
      const ownedCount = courseAccess.ownedLessons.length;
      const totalCount = courseAccess.totalLessons;
      const remaining = totalCount - ownedCount;
      
      return `Accès Study Room refusé. Vous avez débloqué ${ownedCount}/${totalCount} leçons. Il vous manque ${remaining} leçon${remaining > 1 ? 's' : ''} pour accéder à la Study Room de "${courseName}". Débloquezz le pack complet ou les leçons restantes.`;
    }
    
    return `Accès refusé à la Study Room de "${courseName}". Vous devez posséder le pack complet ou toutes les leçons du cours.`;
  }

  /**
   * Filtre les Study Rooms par cours
   */
  static getRoomsForCourse(
    rooms: CourseStudyRoom[],
    courseId: string
  ): CourseStudyRoom[] {
    return rooms.filter(room => room.courseId === courseId);
  }

  /**
   * Vérifie si une Study Room est actuellement active
   */
  static isRoomActive(room: CourseStudyRoom): boolean {
    const now = new Date();
    
    // Si c'est une room programmée, vérifier les horaires
    if (room.isScheduled && room.scheduledStart && room.scheduledEnd) {
      return now >= room.scheduledStart && now <= room.scheduledEnd;
    }
    
    // Sinon, vérifier s'il y a des participants actifs
    return room.currentUsers.length > 0;
  }

  /**
   * Obtient les statistiques d'une Study Room pour affichage
   */
  static getRoomStats(room: CourseStudyRoom) {
    return {
      participantsCount: room.currentUsers.length,
      maxParticipants: room.maxUsers,
      isNearCapacity: room.currentUsers.length >= room.maxUsers * 0.8,
      isFull: room.currentUsers.length >= room.maxUsers,
      hasCamera: room.settings.cameraEnabled,
      hasMic: room.settings.micEnabled,
      hasChat: room.settings.chatEnabled,
      isPrivate: room.settings.isPrivate
    };
  }
}

/**
 * Hook personnalisé pour gérer l'état des Study Rooms (à utiliser dans les composants React)
 */
export const useStudyRoomState = (
  courses: Course[],
  purchasedItems: string[],
  userId: string,
  activeRooms: CourseStudyRoom[],
  notifications: StudyRoomNotification[] = []
) => {
  // Calculer l'accès pour chaque cours
  const userAccess = courses.reduce((acc, course) => {
    acc[course.id] = StudyRoomService.checkCourseAccess(course, purchasedItems, userId);
    return acc;
  }, {} as Record<string, StudyRoomCourseAccess>);

  // Filtrer les Study Rooms accessibles
  const accessibleRooms = StudyRoomService.getAccessibleStudyRooms(
    activeRooms,
    userAccess,
    userId
  );

  // Filtrer les notifications pour l'utilisateur actuel
  const userNotifications = notifications.filter(notif => notif.targetUserId === userId);

  // Calculer l'état du header
  const headerState = StudyRoomService.getHeaderState(
    accessibleRooms,
    userNotifications
  );

  return {
    userAccess,
    accessibleRooms,
    headerState,
    notifications: userNotifications,
    canCreateRoom: (courseId: string) => {
      const courseAccess = userAccess[courseId];
      return courseAccess ? StudyRoomService.canCreateStudyRoom(courseAccess, { id: userId } as User) : false;
    },
    getAccessMessage: (courseId: string) => {
      const course = courses.find(c => c.id === courseId);
      const courseAccess = userAccess[courseId];
      if (!course || !courseAccess) return '';
      
      if (courseAccess.hasFullAccess) {
        return `Accès complet à la Study Room de "${course.title}"`;
      } else {
        return StudyRoomService.getAccessDeniedMessage(courseAccess, course.title);
      }
    }
  };
};
