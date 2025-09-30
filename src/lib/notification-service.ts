import { 
  Notification, 
  NotificationState, 
  NotificationType, 
  NotificationCategory,
  Course,
  StudySession,
  PlannerBadge
} from '@/types';

export class NotificationService {
  private static notifications: Notification[] = [];
  private static listeners: ((state: NotificationState) => void)[] = [];

  // ========================================================================
  // CORE NOTIFICATION MANAGEMENT
  // ========================================================================

  static addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): string {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
      priority: notification.priority || 'normal'
    };

    this.notifications.unshift(newNotification);
    
    // Limiter à 100 notifications max
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    this.notifyListeners();
    return id;
  }

  static markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.notifyListeners();
    }
  }

  static markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.notifyListeners();
  }

  static removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
  }

  static clearExpiredNotifications(): void {
    const now = new Date();
    this.notifications = this.notifications.filter(n => 
      !n.expiresAt || n.expiresAt > now
    );
    // Ne pas appeler notifyListeners() ici pour éviter la récursion infinie
    // getState() appelle déjà cette méthode
  }

  static getState(): NotificationState {
    this.clearExpiredNotifications();
    
    return {
      notifications: [...this.notifications],
      unreadCount: this.notifications.filter(n => !n.isRead).length,
      isLoading: false,
      lastUpdated: new Date()
    };
  }

  static subscribe(listener: (state: NotificationState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  // ========================================================================
  // NOTIFICATION GENERATORS PAR MODULE
  // ========================================================================

  // 📚 COURS & DÉBLOCAGE
  static notifyCourseUnlocked(course: Course, type: 'lesson' | 'course' | 'pack'): string {
    const titles = {
      lesson: '🎯 Nouvelle leçon débloquée !',
      course: '📚 Cours complet débloqué !',
      pack: '🎁 Pack complet débloqué !'
    };

    const messages = {
      lesson: `Tu as débloqué une nouvelle leçon du cours "${course.title}".`,
      course: `Le cours "${course.title}" est maintenant entièrement accessible !`,
      pack: `Tous les cours du pack incluant "${course.title}" sont débloqués !`
    };

    return this.addNotification({
      userId: 'current-user',
      title: titles[type],
      message: messages[type],
      type: NotificationType.COURSE,
      category: NotificationCategory.COURSES,
      isRead: false,
      actionUrl: `/course/${course.id}`,
      actionData: { courseId: course.id, type },
      icon: '📚',
      priority: type === 'pack' ? 'high' : 'normal'
    });
  }

  // 📅 PLANIFICATION
  static notifySessionReminder(session: StudySession, minutesBefore: number): string {
    return this.addNotification({
      userId: 'current-user',
      title: '⏰ Session de révision bientôt !',
      message: `Ta session "${session.sessionTitle}" commence dans ${minutesBefore} minutes.`,
      type: NotificationType.REMINDER,
      category: NotificationCategory.PLANNING,
      isRead: false,
      actionUrl: '/planning',
      actionData: { sessionId: session.id },
      icon: '📅',
      priority: 'high',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // Expire dans 30 min
    });
  }

  static notifySessionMissed(session: StudySession): string {
    return this.addNotification({
      userId: 'current-user',
      title: '😔 Session manquée',
      message: `Tu as manqué ta session "${session.sessionTitle}". Veux-tu la reprogrammer ?`,
      type: NotificationType.PLANNING,
      category: NotificationCategory.PLANNING,
      isRead: false,
      actionUrl: '/planning',
      actionData: { sessionId: session.id, action: 'reschedule' },
      icon: '📅',
      priority: 'normal'
    });
  }

  static notifyPlannerConfigNeeded(): string {
    return this.addNotification({
      userId: 'current-user',
      title: '⚡ Planification non configurée',
      message: 'Tu as débloqué le planificateur ! Configure ton planning pour maximiser tes révisions.',
      type: NotificationType.REMINDER,
      category: NotificationCategory.PLANNING,
      isRead: false,
      actionUrl: '/planning',
      actionData: { action: 'configure' },
      icon: '📅',
      priority: 'normal'
    });
  }

  // 🎓 PROGRESSION & COACHING
  static notifyProgressMilestone(courseName: string, percentage: number): string {
    const milestones = {
      25: { emoji: '🚀', title: 'Bon départ !', message: 'Tu as complété 25% du cours' },
      50: { emoji: '💪', title: 'À mi-parcours !', message: 'Tu as atteint 50% du cours' },
      75: { emoji: '🏃‍♂️', title: 'Presque au bout !', message: '75% du cours terminé, continue !' },
      100: { emoji: '🎉', title: 'Cours terminé !', message: 'Félicitations, tu as terminé le cours' }
    };

    const milestone = milestones[percentage as keyof typeof milestones] || milestones[25];

    return this.addNotification({
      userId: 'current-user',
      title: `${milestone.emoji} ${milestone.title}`,
      message: `${milestone.message} "${courseName}" !`,
      type: NotificationType.PROGRESS,
      category: NotificationCategory.PROGRESS,
      isRead: false,
      actionUrl: `/course/${courseName}`,
      actionData: { courseName, percentage },
      icon: milestone.emoji,
      priority: percentage === 100 ? 'high' : 'normal'
    });
  }

  static notifyBadgeUnlocked(badge: PlannerBadge): string {
    return this.addNotification({
      userId: 'current-user',
      title: '🏆 Nouveau badge débloqué !',
      message: `Tu as gagné le badge "${badge.name}" : ${badge.description}`,
      type: NotificationType.ACHIEVEMENT,
      category: NotificationCategory.ACHIEVEMENTS,
      isRead: false,
      actionUrl: '/planning',
      actionData: { badgeId: badge.id },
      icon: badge.icon,
      priority: 'high'
    });
  }

  // 👥 COMMUNAUTÉ / STUDY ROOM
  static notifyStudyRoomOpened(roomName: string, friendsCount: number = 0): string {
    const message = friendsCount > 0 
      ? `La Study Room "${roomName}" est ouverte avec ${friendsCount} ami(s) présent(s) !`
      : `La Study Room "${roomName}" est maintenant ouverte.`;

    return this.addNotification({
      userId: 'current-user',
      title: '🎓 Study Room ouverte !',
      message,
      type: NotificationType.SOCIAL,
      category: NotificationCategory.COMMUNITY,
      isRead: false,
      actionUrl: '/community',
      actionData: { roomName, friendsCount },
      icon: '👥',
      priority: friendsCount > 0 ? 'high' : 'normal'
    });
  }

  static notifyFriendsInStudyRoom(roomName: string, friendNames: string[]): string {
    const friendsText = friendNames.length === 1 
      ? friendNames[0] 
      : `${friendNames.slice(0, -1).join(', ')} et ${friendNames[friendNames.length - 1]}`;

    return this.addNotification({
      userId: 'current-user',
      title: '👋 Amis présents !',
      message: `${friendsText} ${friendNames.length === 1 ? 'est' : 'sont'} dans la Study Room "${roomName}".`,
      type: NotificationType.SOCIAL,
      category: NotificationCategory.COMMUNITY,
      isRead: false,
      actionUrl: '/community',
      actionData: { roomName, friends: friendNames },
      icon: '👥',
      priority: 'normal'
    });
  }

  // 💳 PAIEMENTS / WALLET
  static notifyPaymentSuccess(amount: number, item: string): string {
    return this.addNotification({
      userId: 'current-user',
      title: '✅ Paiement réussi !',
      message: `Achat de "${item}" pour ${amount}€ confirmé. Ton contenu est maintenant accessible !`,
      type: NotificationType.PAYMENT,
      category: NotificationCategory.WALLET,
      isRead: false,
      actionUrl: '/wallet',
      actionData: { amount, item },
      icon: '💳',
      priority: 'normal'
    });
  }

  static notifyWalletTopUp(amount: number): string {
    return this.addNotification({
      userId: 'current-user',
      title: '💰 Recharge réussie !',
      message: `Ton portefeuille a été rechargé de ${amount}€.`,
      type: NotificationType.PAYMENT,
      category: NotificationCategory.WALLET,
      isRead: false,
      actionUrl: '/wallet',
      actionData: { amount },
      icon: '💰',
      priority: 'normal'
    });
  }

  static notifyInsufficientFunds(requiredAmount: number, currentBalance: number): string {
    const missing = requiredAmount - currentBalance;
    return this.addNotification({
      userId: 'current-user',
      title: '⚠️ Solde insuffisant',
      message: `Il te manque ${missing.toFixed(2)}€ pour cette transaction. Recharge ton portefeuille !`,
      type: NotificationType.PAYMENT,
      category: NotificationCategory.WALLET,
      isRead: false,
      actionUrl: '/wallet',
      actionData: { required: requiredAmount, current: currentBalance, missing },
      icon: '⚠️',
      priority: 'high'
    });
  }

  // 🎯 GAMIFICATION
  static notifyStreakAchievement(streakDays: number): string {
    const streakEmojis = {
      3: '🔥', 7: '💪', 14: '🏆', 30: '👑'
    };
    
    const emoji = Object.entries(streakEmojis)
      .reverse()
      .find(([days]) => streakDays >= parseInt(days))?.[1] || '⭐';

    return this.addNotification({
      userId: 'current-user',
      title: `${emoji} Série de ${streakDays} jours !`,
      message: `Incroyable ! Tu as étudié ${streakDays} jours d'affilée. Continue comme ça !`,
      type: NotificationType.ACHIEVEMENT,
      category: NotificationCategory.ACHIEVEMENTS,
      isRead: false,
      actionUrl: '/planning',
      actionData: { streakDays },
      icon: emoji,
      priority: streakDays >= 7 ? 'high' : 'normal'
    });
  }

  // 🔔 SYSTÈME
  static notifySystemUpdate(version: string, features: string[]): string {
    return this.addNotification({
      userId: 'current-user',
      title: '🆕 Mise à jour disponible !',
      message: `Nouvelle version ${version} : ${features.slice(0, 2).join(', ')}${features.length > 2 ? '...' : ''}`,
      type: NotificationType.SYSTEM,
      category: NotificationCategory.SYSTEM,
      isRead: false,
      actionUrl: '/updates',
      actionData: { version, features },
      icon: '🔔',
      priority: 'low'
    });
  }

  // ========================================================================
  // UTILITAIRES
  // ========================================================================

  static getNotificationsByCategory(category: NotificationCategory): Notification[] {
    return this.notifications.filter(n => n.category === category);
  }

  static getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  static getHighPriorityNotifications(): Notification[] {
    return this.notifications.filter(n => n.priority === 'high' && !n.isRead);
  }

  // Méthode pour générer des notifications de test
  static generateTestNotifications(): void {
    // Effacer les notifications existantes
    this.notifications = [];

    // Cours débloqués
    this.notifyCourseUnlocked({ id: '1', title: 'Loi de Gauss' } as Course, 'course');
    this.notifyCourseUnlocked({ id: '2', title: 'Électrostatique' } as Course, 'pack');

    // Planification
    this.notifySessionReminder({
      id: 'session-1',
      sessionTitle: 'Révision Loi de Gauss',
      courseName: 'Électrostatique'
    } as StudySession, 15);
    
    this.notifyPlannerConfigNeeded();

    // Progression
    this.notifyProgressMilestone('Suites et Limites', 50);
    this.notifyProgressMilestone('Analyse Complexe', 100);

    // Study Room
    this.notifyStudyRoomOpened('Électrostatique', 3);
    this.notifyFriendsInStudyRoom('Mathématiques', ['Marie', 'Thomas']);

    // Wallet
    this.notifyWalletTopUp(100);
    this.notifyInsufficientFunds(70, 45);

    // Gamification
    this.notifyStreakAchievement(7);
    this.notifyBadgeUnlocked({
      id: 'disciplined',
      name: 'Discipliné',
      description: '7 jours consécutifs de révisions',
      icon: '💪'
    } as PlannerBadge);

    // Système
    this.notifySystemUpdate('2.1.0', ['Nouvelles notifications', 'Planificateur amélioré', 'Study Rooms']);
  }
}

// Hook React pour utiliser les notifications
export function useNotifications() {
  const [state, setState] = React.useState<NotificationState>(NotificationService.getState());

  React.useEffect(() => {
    const unsubscribe = NotificationService.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    markAsRead: NotificationService.markAsRead,
    markAllAsRead: NotificationService.markAllAsRead,
    removeNotification: NotificationService.removeNotification,
    generateTestNotifications: NotificationService.generateTestNotifications
  };
}

// Importer React pour le hook
import React from 'react';
