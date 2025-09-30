// Types pour le système Study Rooms

export interface StudyRoomParticipant {
  id: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  isModerator: boolean;
  joinedAt: Date;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isFriend?: boolean;
}

export interface StudyRoomMessage {
  id: string;
  participantId: string;
  participantName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system';
}

export interface StudyRoom {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description?: string;
  isActive: boolean;
  startedAt?: Date;
  scheduledAt?: Date;
  endedAt?: Date;
  maxParticipants: number;
  currentParticipants: number;
  participants: StudyRoomParticipant[];
  messages: StudyRoomMessage[];
  createdBy: string;
  createdByName: string;
  accessLevel: 'public' | 'course-owners' | 'invitation-only';
}

export interface StudyRoomAccess {
  userId: string;
  courseId: string;
  hasFullAccess: boolean; // true si pack complet ou toutes les leçons débloquées
  ownedLessons: string[]; // IDs des leçons possédées
  totalLessons: number; // Nombre total de leçons du cours
  accessReason: 'full-course' | 'all-lessons' | 'partial'; // Raison de l'accès
}

export interface StudyRoomNotification {
  id: string;
  studyRoomId: string;
  courseId: string;
  courseName: string;
  type: 'room-opened' | 'friend-joined' | 'room-starting' | 'room-ending';
  message: string;
  timestamp: Date;
  isRead: boolean;
  targetUserId: string;
}

// Types pour la gestion globale des Study Rooms
export interface StudyRoomState {
  activeRooms: StudyRoom[];
  userNotifications: StudyRoomNotification[];
  currentRoom: StudyRoom | null;
  userAccess: Record<string, StudyRoomAccess>; // courseId -> access info
}

// Types pour les badges de gamification
export interface StudyRoomBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: {
    type: 'time-spent' | 'sessions-attended' | 'active-participation' | 'help-given';
    threshold: number;
  };
  earnedAt?: Date;
}

export interface UserStudyRoomStats {
  userId: string;
  totalTimeSpent: number; // en minutes
  sessionsAttended: number;
  messagesPosted: number;
  helpfulVotes: number;
  badges: StudyRoomBadge[];
}




