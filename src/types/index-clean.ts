// ========================================================================
// SCIENCE MADE SIMPLE - SYSTÈME DE TYPES
// Architecture moderne pour l'écosystème éducatif révolutionnaire
// ========================================================================

// ========================================================================
// SYSTÈME D'ACHAT UNIFIÉ (EUROS)
// ========================================================================

// OPTION D'ACHAT : Proposée dans les modales d'upsell
export interface PurchaseOption {
  type: 'lesson' | 'course' | 'pack';
  itemId: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  badge?: string | null; // Ex: "Recommandé", "Meilleur investissement"
}

export interface User {
  id: string;
  name: string;
  email: string;
  faculty: string;
  year: string;
  avatar?: string;
  isKYCCompleted: boolean;
  preferences: UserPreferences;
  wallet: UserWallet;
}

export interface UserPreferences {
  notifications: boolean;
  studyReminders: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en';
}

// ========================================================================
// SYSTÈME DE PORTEFEUILLE (Modèle PlayStation)
// ========================================================================

export interface UserWallet {
  id: string;
  userId: string;
  balance: number; // Solde en euros
  totalDeposited: number; // Total des dépôts effectués
  totalSpent: number; // Total dépensé
  createdAt: Date;
  lastActivity: Date;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'deposit' | 'bonus' | 'purchase' | 'refund';
  amount: number; // Montant en euros (positif pour crédit, négatif pour débit)
  description: string;
  relatedItemType?: 'lesson' | 'course' | 'pack';
  relatedItemId?: string;
  createdAt: Date;
  metadata?: {
    bonusPercentage?: number; // Pour les bonus de rechargement
    originalAmount?: number; // Montant original avant bonus
    paymentMethod?: string;
    stripePaymentId?: string;
  };
}

export interface WalletTopUpBonus {
  minAmount: number; // Montant minimum pour déclencher ce bonus
  bonusAmount: number; // Montant du bonus en euros
  bonusPercentage: number; // Pourcentage du bonus
  description: string;
}

// ========================================================================
// COURS & PROGRESSION
// ========================================================================

export interface Course {
  id: string;
  title: string;
  description: string;
  faculty: string;
  year: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  isOwned: boolean;
  isPrimary: boolean; // Favori de l'étudiant
  progress: number; // 0-100
  price?: number;
  creditCost?: number; // Coût en crédits cognitifs 🧠
  thumbnail?: string;
  lastAccessed?: Date;
  examDate?: Date; // Date d'examen pour le planificateur
  previewAvailable: boolean;
  previewDuration?: string; // "5-10 minutes"
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  packId?: string; // ID du pack auquel appartient ce cours
  lessons?: Lesson[]; // Leçons du cours pour la vue escalier
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number; // en minutes (changé de string à number)
  price: number; // Prix individuel de la leçon
  order: number;
  isOwned: boolean; // Si l'étudiant possède cette leçon
  progress: number; // 0-100
  isCompleted?: boolean;
  completed?: boolean; // Alias pour compatibilité avec StaircaseProgress
  isAccessible?: boolean;
  unlocked?: boolean; // Alias pour compatibilité avec StaircaseProgress
  hasPreview: boolean;
  previewAvailable: boolean; // Alias pour consistance
  previewUrl?: string;
  videoUrl?: string;
  documents?: LessonDocument[]; // Optionnel
  quiz?: Quiz;
  videoQuizzes?: VideoQuizQuestion[];
  type?: 'video' | 'exercise' | 'quiz' | 'reading';
  tags: string[]; // Tags pour la recherche
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  // Gamification
  xpReward?: number; // Points d'expérience gagnés (optionnel)
  objectives?: string[]; // Objectifs de la leçon (optionnel)
  prerequisites?: string[]; // Prérequis
  isInProgress?: boolean; // Leçon commencée mais pas terminée
}

export interface LessonDocument {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'text' | 'exercise';
  url: string;
  isPreview: boolean;
  tags: string[];
}

// ========================================================================
// PACKS DE COURS (Nouveaux bundles)
// ========================================================================

export interface Pack {
  id: string;
  title: string;
  description: string;
  courses: string[]; // IDs des cours inclus
  totalPrice: number; // Prix total si achat séparé
  packPrice: number; // Prix du pack
  savings: number; // Économies réalisées
  totalLessons: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  icon: string;
  color: string; // Classes Tailwind pour le gradient
  features: string[]; // Avantages du pack
  isPopular: boolean;
  isPremium?: boolean;
  tags?: string[];
}

// ========================================================================
// GAMIFICATION & PROGRESSION
// ========================================================================

export interface StudentProgress {
  userId: string;
  courseId: string;
  currentLesson: number;
  totalLessons: number;
  percentComplete: number;
  facultyAverage: number;
  facultyRanking: number;
  totalStudents: number;
  timeSpent: number; // en minutes
  lastActivity: Date;
  streakDays: number;
  totalPoints: number;
}

export interface FacultyStats {
  faculty: string;
  year: string;
  totalStudents: number;
  averageProgress: number;
  topPerformers: string[]; // user IDs
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number; // 0-100
  target: number;
}

// ========================================================================
// SUGGESTIONS & RECOMMENDATIONS
// ========================================================================

export interface CourseSuggestion {
  course: Course;
  reason: 'faculty_popular' | 'similar_students' | 'prerequisite' | 'continuation';
  enrolledStudents: number;
  averageProgress: number;
  isPopular: boolean;
  hasFreeTrial: boolean;
  priority: number; // 1-10, pour l'ordre d'affichage
}

// ========================================================================
// SYSTÈME COMMUNAUTAIRE
// ========================================================================

export interface StudentProfile {
  id: string;
  firstName: string;
  faculty: string;
  avatar: string;
  totalXP: number;
  level: number;
  coursesCompleted: number;
  socialBadges: SocialBadge[];
  joinDate: Date;
  lastActive: Date;
  bio?: string;
  motto?: string;
  isOnline: boolean;
  studyStreak: number;
}

export interface Circle {
  id: string;
  name: string;
  type: 'faculty' | 'course' | 'alumni';
  description: string;
  memberCount: number;
  icon: string;
  color: string;
  isJoined: boolean;
  recentActivity: CommunityActivity[];
  moderators: string[]; // Student IDs
}

export interface AlumniProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  currentPosition: string;
  company: string;
  university: string;
  degree: string;
  graduationYear: number;
  smsCoursesCompleted: string[];
  linkedinUrl: string;
  email?: string;
  testimonial: string;
  domain: string; // 'engineering', 'business', 'medicine', etc.
  joinedSmsYear: number;
}

export interface MiniQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudyRoom {
  id: string;
  name: string;
  circleId: string;
  createdBy: string;
  currentUsers: StudentProfile[];
  maxUsers: number;
  subject: string;
  pomodoroTimer: {
    isActive: boolean;
    currentSession: number;
    totalSessions: number;
    sessionDuration: number; // minutes
    breakDuration: number; // minutes
    timeRemaining: number; // seconds
  };
  settings: {
    cameraEnabled: boolean;
    micEnabled: boolean;
    chatEnabled: boolean;
    isPrivate: boolean;
  };
  createdAt: Date;
}

export interface CommunityQuestion {
  id: string;
  courseId: string;
  studentId: string;
  title: string;
  content: string;
  answers: CommunityAnswer[];
  likes: number;
  likedBy: string[];
  tags: string[];
  isResolved: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export interface CommunityAnswer {
  id: string;
  questionId: string;
  studentId: string;
  content: string;
  likes: number;
  likedBy: string[];
  isAccepted: boolean;
  isMentorVerified: boolean;
  createdAt: Date;
}

export interface SocialBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: {
    type: 'questions_answered' | 'rooms_created' | 'study_streak' | 'community_helper' | 'course_champion';
    target: number;
    current?: number;
  };
  unlockedAt?: Date;
}

export interface CommunityActivity {
  id: string;
  type: 'course_completed' | 'question_asked' | 'answer_given' | 'room_created' | 'badge_earned' | 'achievement' | 'announcement' | 'celebration' | 'milestone' | 'welcome' | 'level_up';
  studentId: string;
  content: string;
  metadata?: any;
  circleId?: string;
  createdAt: Date;
  priority?: 'low' | 'medium' | 'high';
  reactions?: {
    likes: number;
    hearts: number;
    celebrates: number;
    likedBy: string[];
  };
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'collective';
  target: number;
  current: number;
  participants: string[];
  reward: string;
  icon: string;
  color: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Mentorship {
  id: string;
  mentorId: string;
  menteeId: string;
  subject: string;
  status: 'pending' | 'active' | 'completed';
  sessions: MentorshipSession[];
  createdAt: Date;
}

export interface MentorshipSession {
  id: string;
  mentorshipId: string;
  scheduledAt: Date;
  duration: number; // minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
}

// ========================================================================
// SYSTÈME DE GAMIFICATION
// ========================================================================

export interface PlayerProgress {
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  badges: Badge[];
  completedCourses: string[];
  streak: number; // Jours consécutifs d'activité
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  criteria: BadgeCriteria;
}

export interface BadgeCriteria {
  type: 'lessons_completed' | 'course_completed' | 'streak' | 'xp_earned' | 'perfect_quiz';
  target: number;
  courseId?: string; // Pour les badges spécifiques à un cours
}

export interface LessonNode {
  lesson: Lesson;
  position: { x: number; y: number };
  connections: string[]; // IDs des leçons suivantes
  isCheckpoint?: boolean; // Points de contrôle importants
}

// ========================================================================
// PACKS DE COURS
// ========================================================================

export interface CoursePack {
  id: string;
  title: string;
  description: string;
  courses: string[]; // IDs des cours inclus
  creditCost: number;
  originalCreditCost: number; // Prix individuel total
  savings: number; // Économies en crédits
  badge?: string; // "Populaire", "Nouveau", etc.
  icon: string;
  color: string;
  features: string[];
}

// ========================================================================
// QUIZ & ÉVALUATION
// ========================================================================

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  attempts: number;
  maxAttempts: number;
  lastScore?: number;
  bestScore?: number;
  isPreview: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  points: number;
}

// ========================================================================
// PLANIFICATION & CALENDRIER
// ========================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'course' | 'lesson' | 'exam' | 'deadline' | 'study_session';
  courseId?: string;
  lessonId?: string;
  description?: string;
  isCompleted?: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  goals: string[];
  targetDate: Date;
  coursesIncluded: string[];
  weeklyHours: number;
  schedule: StudySession[];
  isActive: boolean;
}

export interface StudySession {
  id: string;
  courseId: string;
  lessonId?: string;
  scheduledDate: Date;
  duration: number; // en minutes
  isCompleted: boolean;
  actualDuration?: number;
}

// ========================================================================
// CHAT & COMMUNICATION
// ========================================================================

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'teacher';
  message: string;
  timestamp: Date;
  courseId?: string;
  type: 'text' | 'suggestion' | 'reminder' | 'achievement';
  metadata?: Record<string, any>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'update' | 'social';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// ========================================================================
// DASHBOARD & UI STATE
// ========================================================================

export interface DashboardData {
  user: User;
  primaryCourses: Course[];
  suggestedCourses: CourseSuggestion[];
  progress: StudentProgress[];
  facultyStats: FacultyStats;
  recentActivity: Activity[];
  achievements: Achievement[];
  upcomingEvents: CalendarEvent[];
}

export interface Activity {
  id: string;
  type: 'lesson_completed' | 'quiz_taken' | 'course_started' | 'achievement_unlocked';
  title: string;
  description: string;
  timestamp: Date;
  courseId?: string;
  lessonId?: string;
}

// ========================================================================
// PREVIEW & TRIAL SYSTEM
// ========================================================================

export interface PreviewSession {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  accessGranted: Date;
  expiresAt: Date;
  timeWatched: number; // en secondes
  converted: boolean; // si l'utilisateur a acheté après
}

// ========================================================================
// DRAG & DROP
// ========================================================================

export interface DragDropItem {
  id: string;
  type: 'course' | 'lesson';
  data: Course | Lesson;
}

// ========================================================================
// QUIZ VIDÉO & Q&A
// ========================================================================

export interface VideoQuizQuestion {
  id: string;
  timestamp: number; // Moment dans la vidéo (en secondes)
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: number; // Index de la bonne réponse
  explanation: string;
  points: number;
}

export interface QAQuestion {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  question: string;
  timestamp: number; // Moment dans la vidéo où la question a été posée
  createdAt: Date;
  likes: number;
  dislikes: number;
  isAnswered: boolean;
  isPinned: boolean;
  isPopular: boolean; // Question avec beaucoup de likes
  answers: QAAnswer[];
  tags: string[];
  userLiked?: boolean;
  userDisliked?: boolean;
}

export interface QAAnswer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isInstructor: boolean;
  answer: string;
  createdAt: Date;
  likes: number;
  isAccepted: boolean; // Marquée comme réponse correcte par l'instructeur
  userLiked?: boolean;
}

// ========================================================================
// ENUMS & CONSTANTS
// ========================================================================

export enum CourseStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PAUSED = 'paused'
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export enum NotificationType {
  REMINDER = 'reminder',
  ACHIEVEMENT = 'achievement',
  UPDATE = 'update',
  SOCIAL = 'social'
}

// ========================================================================
// SYSTÈME STUDY ROOMS
// ========================================================================

export interface StudyRoomCourseAccess {
  userId: string;
  courseId: string;
  hasFullAccess: boolean; // true si pack complet ou toutes les leçons débloquées
  ownedLessons: string[]; // IDs des leçons possédées
  totalLessons: number; // Nombre total de leçons du cours
  accessReason: 'full-course' | 'all-lessons' | 'partial'; // Raison de l'accès
  purchasedItems: string[]; // IDs des items achetés (cours, packs, leçons)
}

export interface StudyRoomNotification {
  id: string;
  studyRoomId: string;
  courseId?: string; // Study Room liée à un cours spécifique
  courseName?: string;
  type: 'room-opened' | 'friend-joined' | 'room-starting' | 'room-ending' | 'course-room-available';
  message: string;
  timestamp: Date;
  isRead: boolean;
  targetUserId: string;
  metadata?: {
    friendsPresent?: number;
    totalParticipants?: number;
    roomName?: string;
  };
}

export interface StudyRoomState {
  activeRooms: StudyRoom[];
  userNotifications: StudyRoomNotification[];
  currentRoom: StudyRoom | null;
  userAccess: Record<string, StudyRoomCourseAccess>; // courseId -> access info
  courseRooms: Record<string, StudyRoom[]>; // courseId -> active rooms for this course
}

export interface CourseStudyRoom extends StudyRoom {
  courseId?: string; // ID du cours associé
  courseName?: string; // Nom du cours pour affichage
  requiresFullAccess: boolean; // Si true, nécessite le pack complet ou toutes les leçons
  allowedUserIds?: string[]; // Liste blanche d'utilisateurs autorisés
  isScheduled: boolean; // Si la room est programmée ou ouverte spontanément
  scheduledStart?: Date;
  scheduledEnd?: Date;
}

export interface StudyRoomHeaderState {
  hasActiveRooms: boolean;
  friendsInRooms: number;
  accessibleRoomsCount: number;
  notifications: StudyRoomNotification[];
}

// ========================================================================
// SYSTÈME PLANIFICATEUR STRATÉGIQUE
// ========================================================================

export interface PlannerAccess {
  hasAccess: boolean;
  accessReason: 'no-courses' | 'partial-access' | 'full-pack' | 'all-lessons';
  ownedCourses: string[];
  completeCourses: string[]; // Cours avec toutes les leçons ou pack complet
  totalCourses: number;
  accessMessage: string;
  isConfigured?: boolean;
  hasPostponed?: boolean;
}

export interface StudyPreferences {
  availableDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  preferredStartTime: string; // Format HH:MM
  preferredEndTime: string;
  dailyStudyHours: number;
  preferredStudySlots: ('morning' | 'afternoon' | 'evening')[];
  breakDuration: number; // en minutes
  examDate?: Date;
  studyIntensity: 'light' | 'moderate' | 'intensive';
}

export interface StudySession {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  courseId: string;
  courseName: string;
  lessonId?: string;
  lessonName?: string;
  type: 'lesson' | 'review' | 'practice' | 'break' | 'bonus-review';
  isCompleted: boolean;
  isOptional: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  duration: number; // Durée en minutes
  isMissed?: boolean;
  missedDate?: Date;
  isRescheduled?: boolean;
  originalDate?: Date;
  status: 'upcoming' | 'today' | 'completed' | 'missed' | 'rescheduled';
  subject?: 'mathematics' | 'physics' | 'chemistry' | 'biology' | 'other';
  colorCode?: string;
  videoProgressPercentage: number; // 0-100, progression vidéo réelle
  videoId?: string; // ID de la vidéo associée
  videoWatchedAt?: Date; // Date de dernière progression
  requiredCompletionThreshold: number; // Seuil requis (défaut 100%)
}

export interface StudyPlan {
  id: string;
  userId: string;
  name: string;
  startDate: Date;
  examDate?: Date;
  preferences: StudyPreferences;
  sessions: StudySession[];
  totalEstimatedHours: number;
  progressPercentage: number;
  isActive: boolean;
  lastUpdated: Date;
  adaptationReason?: string;
}

export interface BuddySystem {
  id: string;
  userId: string;
  buddyName: string;
  buddyContact: string; // Email ou téléphone
  contactMethod: 'email' | 'sms' | 'whatsapp';
  alertFrequency: 'immediate' | 'daily' | 'weekly';
  isActive: boolean;
  lastNotificationSent?: Date;
}

export interface PlannerNotification {
  id: string;
  userId: string;
  type: 'session-reminder' | 'missed-session' | 'adaptation-suggestion' | 'buddy-alert' | 'progress-update';
  title: string;
  message: string;
  actionRequired: boolean;
  actionUrl?: string;
  timestamp: Date;
  isRead: boolean;
  metadata?: {
    sessionId?: string;
    courseId?: string;
    buddyId?: string;
    adaptationType?: string;
  };
}

export interface PlannerBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'discipline' | 'resilience' | 'coaching' | 'progress' | 'consistency';
  criteria: {
    sessionsCompleted?: number;
    consecutiveDays?: number;
    sessionsMissedAndRescheduled?: number;
    buddyInteractions?: number;
  };
  earnedAt?: Date;
  isEarned: boolean;
}

export interface PlannerViewSettings {
  currentView: 'day' | 'week' | 'month';
  showCompleted: boolean;
  showMissed: boolean;
  showOptional: boolean;
}

export interface MissedSessionAlert {
  sessionId: string;
  session: StudySession;
  isOpen: boolean;
  suggestedRescheduleSlots: Date[];
}

export interface AdaptationSuggestion {
  id: string;
  type: 'ahead-of-schedule' | 'behind-schedule' | 'missed-sessions' | 'intensity-adjustment';
  title: string;
  description: string;
  actionText: string;
  priority: 'low' | 'medium' | 'high';
  autoApply: boolean;
  sessions?: StudySession[];
}

export interface CoachingMessage {
  id: string;
  type: 'motivational' | 'warning' | 'congratulations' | 'guidance';
  title: string;
  message: string;
  icon: string;
  color: string;
  isVisible: boolean;
  dismissible: boolean;
}

export interface BadgeNotification {
  badge: PlannerBadge;
  isVisible: boolean;
  timestamp: Date;
}

export interface PlannerState {
  plannerAccess: PlannerAccess;
  studyPreferences: StudyPreferences | null;
  generatedPlan: StudyPlan | null;
  buddySystem: BuddySystem | null;
  badges: PlannerBadge[];
  notifications: PlannerNotification[];
  viewSettings: PlannerViewSettings;
  isOnboardingVisible: boolean;
  currentOnboardingStep: number;
  selectedDate: Date;
  missedSessionAlerts: MissedSessionAlert[];
  adaptationSuggestions: AdaptationSuggestion[];
  coachingMessage: CoachingMessage | null;
  badgeNotification: BadgeNotification | null;
  plannerOnboardingOpen: boolean;
  selectedSessionForDetails: StudySession | null;
  isSessionDetailsOpen: boolean;
}






