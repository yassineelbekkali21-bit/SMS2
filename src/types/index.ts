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
  walletHint?: string; // Message pour encourager la recharge du portefeuille
}

// ========================================================================
// SYSTÈME DE CATALOGUE UNIFIÉ (FACULTÉ + HORS FACULTÉ)
// ========================================================================

export type CatalogType = 'faculty' | 'external';

export interface CatalogItem {
  type: CatalogType;
  source: string; // Nom de l'université/institut
  category?: string; // Ex: "Hors programme", "Autre faculté"
  whatsappNumber?: string; // Numéro WhatsApp pour contact
  whatsappMessage?: string; // Message prédéfini
}

export interface ExternalCourse extends Course {
  catalogInfo: CatalogItem;
}

export interface ExternalLesson extends Lesson {
  catalogInfo: CatalogItem;
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
  isTrial?: boolean; // Mode essai - première leçon gratuite, reste en preview
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
  slidesUrl?: string; // URL des slides PDF de la leçon
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
  quizCompleted?: boolean; // Quiz de la leçon terminé
  quizScore?: number; // Score du quiz (0-100)
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
// BUNDLES - Séquences de Learning Tracks
// ========================================================================

export interface Bundle {
  id: string;
  title: string;
  description: string;
  subject: string; // Physique, Maths, Chimie, etc.
  tracks: Course[]; // Learning tracks dans l'ordre séquentiel
  totalDuration: string; // Durée totale du bundle
  totalLessons: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number; // 0-100, calculé à partir des tracks
  currentTrackIndex: number; // Index du track en cours (0-based)
  isStarted: boolean;
  isCompleted: boolean;
  icon?: string; // Emoji ou icône
  color?: string; // Couleur du bundle (pour le gradient)
  objectives?: string[]; // Ce que l'étudiant va maîtriser
  isTrial?: boolean; // Mode essai - accès limité avec 10h gratuites
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
  savings?: number; // Économies en crédits (optionnel)
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
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionData?: any;
  icon?: string;
  priority: 'low' | 'normal' | 'high';
  expiresAt?: Date;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  lastUpdated: Date;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
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
  SOCIAL = 'social',
  COURSE = 'course',
  PLANNING = 'planning',
  PAYMENT = 'payment',
  PROGRESS = 'progress',
  SYSTEM = 'system'
}

export enum NotificationCategory {
  COURSES = 'courses',
  PLANNING = 'planning',
  PROGRESS = 'progress',
  COMMUNITY = 'community',
  WALLET = 'wallet',
  ACHIEVEMENTS = 'achievements',
  REMINDERS = 'reminders',
  SYSTEM = 'system'
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

// ========================================================================
// SYSTÈME DE DATES D'EXAMEN PARTICIPATIF
// ========================================================================

export type ExamDateStatus = 'official' | 'proposed' | 'community-validated' | 'undefined';

export interface ExamDateProposal {
  id: string;
  courseId: string;
  facultyId: string;
  proposedDate: Date;
  proposedBy: string; // ID de l'étudiant
  proposedByName: string; // Nom de l'étudiant
  proposedAt: Date;
  status: 'pending' | 'community-validated' | 'rejected';
  confirmations: ExamDateConfirmation[];
  corrections: ExamDateCorrection[];
}

export interface ExamDateConfirmation {
  id: string;
  proposalId: string;
  confirmedBy: string; // ID de l'étudiant
  confirmedByName: string; // Nom de l'étudiant
  confirmedAt: Date;
  faculty: string;
}

export interface ExamDateCorrection {
  id: string;
  originalProposalId: string;
  correctedBy: string; // ID de l'étudiant
  correctedByName: string; // Nom de l'étudiant
  correctedAt: Date;
  newProposedDate: Date;
  reason?: string;
}

export interface ExamDate {
  courseId: string;
  courseName: string;
  faculty: string;
  status: ExamDateStatus;
  
  // Pour les dates officielles
  officialDate?: Date;
  officialSource?: string;
  
  // Pour les dates proposées par la communauté
  currentProposal?: ExamDateProposal;
  
  // Historique des propositions
  previousProposals: ExamDateProposal[];
  
  // Métadonnées
  lastUpdated: Date;
  totalStudentsInCourse: number;
  participatingStudents: number;
}

export interface ExamDatesState {
  examDates: ExamDate[];
  isLoading: boolean;
  error: string | null;
  userCanPropose: boolean;
  userFaculty: string;
  userId: string;
}

export interface ProposeExamDateData {
  courseId: string;
  proposedDate: Date;
  proposedBy: string;
  proposedByName: string;
  faculty: string;
}

// ========================================================================
// SYSTÈME BUDDIES - ÉCOSYSTÈME SOCIAL D'APPRENTISSAGE
// ========================================================================

// Distinction Buddy (autre étudiant) vs Tuteur (accès suivi/progression)
export type BuddyType = 'buddy' | 'tutor';
export type BuddyStatus = 'pending' | 'accepted' | 'blocked' | 'declined';
export type UserStatus = 'online' | 'in-study-room' | 'offline';

// Statut social de l'utilisateur - contrôle les interactions sociales
export type SocialStatus = 'available' | 'busy' | 'focus' | 'invisible';

export interface SocialStatusConfig {
  status: SocialStatus;
  allowDuelRequests: boolean;
  allowStudyRoomInvites: boolean;
  allowNotifications: boolean;
  allowBuddyRequests: boolean;
  showActivityStatus: boolean;
}

export const SOCIAL_STATUS_PRESETS: Record<SocialStatus, SocialStatusConfig> = {
  available: {
    status: 'available',
    allowDuelRequests: true,
    allowStudyRoomInvites: true,
    allowNotifications: true,
    allowBuddyRequests: true,
    showActivityStatus: true,
  },
  busy: {
    status: 'busy',
    allowDuelRequests: false,
    allowStudyRoomInvites: true,
    allowNotifications: true,
    allowBuddyRequests: true,
    showActivityStatus: true,
  },
  focus: {
    status: 'focus',
    allowDuelRequests: false,
    allowStudyRoomInvites: false,
    allowNotifications: false,
    allowBuddyRequests: false,
    showActivityStatus: true,
  },
  invisible: {
    status: 'invisible',
    allowDuelRequests: false,
    allowStudyRoomInvites: false,
    allowNotifications: false,
    allowBuddyRequests: false,
    showActivityStatus: false,
  },
};

export interface BuddyConsents {
  activity: boolean; // Voir dernière connexion, progression
  notifications: boolean; // Recevoir alertes motivation
  studyRoomInvites: boolean; // Invitations Study Rooms
  planningAlerts: boolean; // Alertes planning non respecté (tuteurs uniquement)
  progressTracking: boolean; // Suivi détaillé de progression (tuteurs uniquement)
  analytics: boolean; // Accès aux analytics et rapports (tuteurs uniquement)
}

export interface BuddyRelation {
  id: string;
  userId: string;
  buddyId: string;
  type: BuddyType;
  status: BuddyStatus;
  createdAt: Date;
  acceptedAt?: Date;
  consents: BuddyConsents;
  // Données du buddy
  buddyName: string;
  buddyAvatar?: string;
  buddyFaculty?: string;
  buddyStatus: UserStatus;
  commonCourses: string[]; // IDs des cours en commun
  lastActivity?: Date;
  // Nouvelles propriétés pour gamification et statut temps réel
  realTimeStatus: 'online' | 'in-study-room' | 'offline';
  currentStudyRoomId?: string;
  currentStudyRoomName?: string;
  level: number;
  totalXP: number;
  badges: StudyBadge[];
  progressionSimilarity: number; // Pourcentage de similarité de progression (0-100)
  coursesNotOwned: string[]; // Cours que le buddy suit mais pas l'utilisateur
}

export interface BuddyInvitation {
  id: string;
  inviterId: string;
  inviterName: string;
  phone?: string; // Optionnel, pour WhatsApp
  email?: string; // Optionnel, pour invitation email
  token: string;
  type: BuddyType; // 'buddy' ou 'tutor'
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  message?: string;
  // Métadonnées d'invitation
  role: BuddyType; // Explicite le rôle demandé
  roleDescription?: string; // Description du rôle pour le destinataire
}

export interface BuddyDiscovery {
  userId: string;
  name: string;
  avatar?: string;
  faculty: string;
  commonCourses: string[];
  mutualBuddies: number;
  isOnPlatform: boolean;
  // Améliorations discovery algorithm
  progressionSimilarity: number;
  recentActivity: boolean;
  studyRoomCompatibility: number; // Score de compatibilité pour Study Rooms
}

// ========================================================================
// GAMIFICATION & BADGES SYSTÈME
// ========================================================================

export interface StudyBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'study-rooms' | 'progression' | 'social' | 'achievement';
  unlockedAt: Date;
  progress?: number; // Pour les badges avec progression (0-100)
  maxProgress?: number;
}

export interface XPActivity {
  id: string;
  userId: string;
  type: 'study-room-join' | 'study-room-create' | 'lesson-complete' | 'quiz-perfect' | 'buddy-help';
  xpEarned: number;
  description: string;
  timestamp: Date;
  relatedId?: string; // ID de la room, leçon, etc.
}

// ========================================================================
// STUDY ROOMS AMÉLIORÉES - SYSTÈME SOCIAL AVANCÉ
// ========================================================================

export type StudyRoomType = 'silent' | 'interactive';
export type StudyRoomVisibility = 'public' | 'buddies' | 'private';
export type StudyRoomStatus = 'scheduled' | 'live' | 'ended' | 'cancelled';
export type ParticipantRole = 'moderator' | 'participant';

export interface AdvancedStudyRoom {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description?: string;
  type: StudyRoomType;
  visibility: StudyRoomVisibility;
  status: StudyRoomStatus;
  createdBy: string;
  creatorName: string;
  creatorAvatar?: string;
  createdAt: Date;
  startsAt: Date;
  endsAt?: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  estimatedDuration?: number; // en minutes
  maxParticipants?: number;
  currentParticipants: StudyRoomParticipant[];
  invitedUsers: string[]; // Pour les rooms privées
  tags: string[];
  isRecorded: boolean;
  recordingUrl?: string;
  replayAddedToCourse: boolean;
  abusiveReports: AbuseReport[];
  // Nouvelles propriétés pour les fonctionnalités avancées
  isComplement?: boolean; // Pour les sessions "Compléments" d'admin
  enableRecording?: boolean; // Pour activer l'enregistrement explicitement
  // WebRTC et modération
  webRTCRoomId?: string; // ID de la room WebRTC
  moderationRules: string[];
  xpReward: number; // XP gagné en participant
  buddyCount: number; // Nombre de buddies dans la room
  hasActiveBuddies: boolean; // Si l'utilisateur a des buddies dans cette room
}

export interface StudyRoomParticipant {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: ParticipantRole;
  joinedAt: Date;
  leftAt?: Date;
  isBuddy: boolean; // Si c'est un buddy de l'utilisateur connecté
  isActive: boolean;
  lastActivity: Date;
}

export interface AbuseReport {
  id: string;
  roomId: string;
  reporterId: string;
  reporterName: string;
  reportedUserId?: string;
  reportedUserName?: string;
  type: 'inappropriate-content' | 'harassment' | 'spam' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  actions?: string[];
}

export interface StudyRoomAccess {
  canJoin: boolean;
  canCreate: boolean;
  hasFullCourse: boolean;
  reason?: string;
  upgradeOptions?: PurchaseOption[];
}

// ========================================================================
// NOTIFICATIONS SOCIALES
// ========================================================================

export interface SocialNotification {
  id: string;
  type: 'buddy-request' | 'buddy-accepted' | 'study-room-invite' | 'buddy-in-room' | 'course-recommendation' | 'planning-alert' | 'xp-earned' | 'badge-unlocked' | 'multiple-buddies-in-room';
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  toUserId: string;
  title: string;
  message: string;
  actionData?: {
    buddyId?: string;
    roomId?: string;
    courseId?: string;
    invitationId?: string;
    xpAmount?: number;
    badgeId?: string;
    groupedBuddies?: string[]; // Pour les notifications groupées
  };
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
  priority: 'low' | 'normal' | 'high';
  isGrouped?: boolean; // Si cette notification regroupe plusieurs actions
  groupCount?: number; // Nombre d'éléments groupés
}

// ========================================================================
// WEBRTC & COMMUNICATION TEMPS RÉEL
// ========================================================================

export interface WebRTCConfig {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isModerator: boolean;
}

export interface WebRTCParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isModerator: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  lastSeen: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'moderator-action';
  isModerated?: boolean;
}

// ========================================================================
// ÉTAT GLOBAL SOCIAL
// ========================================================================

export interface SocialState {
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
    faculty: string;
    status: UserStatus;
    lastActivity: Date;
  };
  buddies: BuddyRelation[];
  pendingInvitations: BuddyInvitation[];
  studyRooms: AdvancedStudyRoom[];
  activeStudyRoom?: AdvancedStudyRoom;
  socialNotifications: SocialNotification[];
  discoveredUsers: BuddyDiscovery[];
  isLoading: boolean;
  error?: string;
}
