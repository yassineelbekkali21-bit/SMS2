import { 
  Course, 
  Lesson, 
  PlannerAccess, 
  StudyPreferences, 
  StudyPlan, 
  StudySession, 
  BuddySystem,
  PlannerNotification,
  PlannerState,
  PlannerBadge,
  AdaptationSuggestion,
  MissedSessionAlert,
  PlannerViewSettings
} from '@/types';
import { PlannerCoachingService } from './planner-coaching-service';
import { AdvancedPlannerService } from './advanced-planner-service';
import { getCoursePacks } from './mock-data';

/**
 * Service de gestion du planificateur stratégique
 * Gère l'accès conditionné, la génération de planning et le coaching
 */
export class PlannerService {
  
  // Cache pour le planning persistant
  private static planCache: Map<string, StudyPlan> = new Map();
  
  /**
   * Vérifie l'accès au planificateur selon les règles stratégiques
   * - Pack complet acheté → accès total
   * - Toutes les leçons d'un cours débloquées → accès pour ce cours
   * - Seulement quelques leçons → pas d'accès (rien à planifier)
   */
  static checkPlannerAccess(
    courses: Course[], 
    purchasedItems: string[], 
    userId: string,
    isConfigured: boolean = false,
    hasPostponed: boolean = false
  ): PlannerAccess {
    const ownedCourses: string[] = [];
    const completeCourses: string[] = [];

    // Analyser chaque cours
    courses.forEach(course => {
      // Vérifier si le cours complet est acheté (cours individuel ou pack)
      // Format des purchasedItems: "course-{courseId}" ou "pack-{packId}"
      
      // 1. Vérifier achat direct du cours
      const hasDirectCourse = course.isOwned || 
                             purchasedItems.includes(`course-${course.id}`) || 
                             purchasedItems.includes(course.id);
      
      // 2. Vérifier si un pack contenant ce cours a été acheté
      const coursePacks = getCoursePacks();
      const hasPackWithCourse = coursePacks.some(pack => 
        pack.courses.includes(course.id) && purchasedItems.includes(pack.id)
      );
      
      if (hasDirectCourse || hasPackWithCourse) {
        ownedCourses.push(course.id);
        completeCourses.push(course.id);
        return;
      }

      // Vérifier si toutes les leçons sont débloquées individuellement
      if (course.lessons && course.lessons.length > 0) {
        const totalLessons = course.lessons.length;
        const ownedLessons = course.lessons.filter(lesson => 
          lesson.isOwned || purchasedItems.includes(lesson.id)
        ).length;

        if (ownedLessons > 0) {
          ownedCourses.push(course.id);
        }

        if (ownedLessons === totalLessons) {
          completeCourses.push(course.id);
        }
      }
    });

    // Déterminer le niveau d'accès
    const hasAccess = completeCourses.length > 0;
    
    let accessReason: PlannerAccess['accessReason'];
    let accessMessage: string;

    if (completeCourses.length === 0 && ownedCourses.length === 0) {
      accessReason = 'no-courses';
      accessMessage = "Aucun cours acheté. Le planificateur est ton coach personnel - débute ton aventure d'apprentissage !";
    } else if (completeCourses.length === 0) {
      accessReason = 'partial-access';
      accessMessage = "Le planificateur est disponible uniquement avec le pack complet. C'est ton coach de productivité personnalisé !";
    } else if (completeCourses.length < courses.length) {
      accessReason = 'all-lessons';
      accessMessage = `Planificateur activé pour ${completeCourses.length} cours complet${completeCourses.length > 1 ? 's' : ''}. Ton coach personnel t'attend !`;
    } else {
      accessReason = 'full-pack';
      if (isConfigured) {
        accessMessage = "Planificateur configuré ! Ton coach stratégique est actif.";
      } else if (hasPostponed) {
        accessMessage = "Planificateur disponible mais non configuré. Tu peux le configurer quand tu veux !";
      } else {
        accessMessage = "Accès complet au planificateur ! Ton coach stratégique va révolutionner tes études.";
      }
    }

    return {
      hasAccess,
      accessReason,
      ownedCourses,
      completeCourses,
      totalCourses: courses.length,
      accessMessage,
      isConfigured,
      hasPostponed
    };
  }

  /**
   * Récupère le planning existant pour un utilisateur
   */
  static getExistingPlan(userId: string): StudyPlan | null {
    const cached = this.planCache.get(userId);
    if (cached) return cached;
    
    // Essayer de récupérer depuis le localStorage
    try {
      const stored = localStorage.getItem(`planner_${userId}`);
      if (stored) {
        const plan = JSON.parse(stored);
        // Reconstruire les dates
        plan.startDate = new Date(plan.startDate);
        plan.examDate = new Date(plan.examDate);
        plan.lastUpdated = new Date(plan.lastUpdated);
        plan.sessions = plan.sessions.map((session: any) => ({
          ...session,
          date: new Date(session.date)
        }));
        this.planCache.set(userId, plan);
        return plan;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du planning:', error);
    }
    return null;
  }

  /**
   * Sauvegarde un planning pour persistance
   */
  static savePlan(plan: StudyPlan): void {
    this.planCache.set(plan.userId, plan);
    try {
      localStorage.setItem(`planner_${plan.userId}`, JSON.stringify(plan));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du planning:', error);
    }
  }

  /**
   * Vérifie si l'utilisateur a déjà un planning
   */
  static hasExistingPlan(userId: string): boolean {
    return this.getExistingPlan(userId) !== null;
  }

  /**
   * Génère un planning personnalisé basé sur les préférences et objectifs
   * UTILISER UNIQUEMENT pour le premier planning !
   */
  static generateStudyPlan(
    courses: Course[],
    completeCourses: string[],
    preferences: StudyPreferences,
    userId: string
  ): StudyPlan {
    const sessions: StudySession[] = [];
    // Commencer par le lundi de cette semaine pour une meilleure distribution
    const startDate = new Date();
    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Lundi = 1, Dimanche = 0
    startDate.setDate(startDate.getDate() + mondayOffset);
    let sessionId = 1;

    // Filtrer les cours accessibles
    const accessibleCourses = courses.filter(course => 
      completeCourses.includes(course.id)
    );

    // Calculer la durée totale disponible jusqu'à l'examen
    const examDate = preferences.examDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours par défaut
    const totalDays = Math.ceil((examDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    const availableDaysCount = preferences.availableDays.length;
    const studyDays = Math.floor((totalDays / 7) * availableDaysCount);

    // Calculer le temps total d'étude disponible
    const dailyHours = preferences.dailyStudyHours;
    const totalStudyHours = studyDays * dailyHours;

    // Répartir les heures entre les cours
    const hoursPerCourse = totalStudyHours / accessibleCourses.length;

    // Générer les sessions pour chaque cours
    accessibleCourses.forEach(course => {
      const courseLessons = course.lessons || [];
      const lessonDuration = courseLessons.length > 0 ? 
        Math.floor((hoursPerCourse * 60) / courseLessons.length) : 
        Math.floor(hoursPerCourse * 60);

      // Créer des sessions pour chaque leçon
      if (courseLessons.length > 0) {
        courseLessons.forEach((lesson, index) => {
          // Calculer la date selon les jours préférés
          const sessionDate = this.getNextAvailableDate(startDate, index, preferences.availableDays);
          
          sessions.push({
            id: `session-${sessionId++}`,
            date: sessionDate,
            startTime: preferences.preferredStartTime,
            endTime: this.addMinutesToTime(preferences.preferredStartTime, lessonDuration),
            courseId: course.id,
            courseName: course.title,
            lessonId: lesson.id,
            lessonName: lesson.title,
            type: 'lesson',
            isCompleted: false,
            isOptional: false,
            difficulty: lesson.difficulty as any || 'medium',
            estimatedMinutes: lessonDuration,
            duration: lessonDuration,
            status: 'upcoming',
            // Nouvelles propriétés vidéo avec variation pour les tests
            videoProgressPercentage: index === 0 ? 75 : index === 1 ? 100 : index === 2 ? 45 : 0,
            videoId: lesson.videoId || `video-${lesson.id}`,
            requiredCompletionThreshold: 100
          });

          // Ajouter une session de révision après quelques leçons
          if ((index + 1) % 3 === 0) {
            const reviewDate = this.getNextAvailableDate(startDate, index + 0.5, preferences.availableDays);
            
            sessions.push({
              id: `session-${sessionId++}`,
              date: reviewDate,
              startTime: preferences.preferredStartTime,
              endTime: this.addMinutesToTime(preferences.preferredStartTime, 30),
              courseId: course.id,
              courseName: course.title,
              type: 'review',
              isCompleted: false,
              isOptional: true,
              difficulty: 'easy',
              estimatedMinutes: 30,
              duration: 30,
              status: 'upcoming',
              // Propriétés vidéo pour révision avec variation
              videoProgressPercentage: index % 2 === 0 ? 90 : 60,
              videoId: `review-${course.id}-${index}`,
              requiredCompletionThreshold: 90
            });
          }
        });
      } else {
        // Cours sans leçons détaillées
        sessions.push({
          id: `session-${sessionId++}`,
          date: new Date(startDate.getTime() + sessions.length * 24 * 60 * 60 * 1000),
          startTime: preferences.preferredStartTime,
          endTime: this.addMinutesToTime(preferences.preferredStartTime, Math.floor(hoursPerCourse * 60)),
          courseId: course.id,
          courseName: course.title,
          type: 'lesson',
          isCompleted: false,
          isOptional: false,
          difficulty: 'medium',
          estimatedMinutes: Math.floor(hoursPerCourse * 60),
          duration: Math.floor(hoursPerCourse * 60),
          status: 'upcoming',
          // Propriétés vidéo pour cours générique
          videoProgressPercentage: 0,
          videoId: `course-${course.id}`,
          requiredCompletionThreshold: 100
        });
      }
    });

    // Ajouter quelques sessions de démonstration pour des dates spécifiques
    sessions.push(...this.generateDemoSessions(startDate, preferences));

    // Trier les sessions par date
    sessions.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Appliquer les couleurs par matière
    const sessionsWithColors = sessions.map(session => 
      PlannerCoachingService.applyColorCoding(session)
    );

    const plan = {
      id: `plan-${userId}-${Date.now()}`,
      userId,
      name: `Plan d'étude ${accessibleCourses.length > 1 ? 'multi-cours' : accessibleCourses[0]?.title}`,
      startDate,
      examDate,
      preferences,
      sessions: sessionsWithColors,
      totalEstimatedHours: Math.round(totalStudyHours * 10) / 10,
      progressPercentage: 0,
      isActive: true,
      lastUpdated: new Date()
    };

    // Sauvegarder automatiquement
    this.savePlan(plan);
    return plan;
  }

  /**
   * Ajoute un nouveau cours au planning existant SANS l'écraser
   * C'est la méthode clé pour la planification cumulative !
   */
  static updatePlanningWithNewCourse(
    userId: string,
    newCourse: Course,
    preferences: StudyPreferences
  ): StudyPlan {
    console.log('🔄 Mise à jour du planning avec le nouveau cours:', newCourse.title);
    
    // Récupérer le planning existant
    const existingPlan = this.getExistingPlan(userId);
    if (!existingPlan) {
      console.log('❌ Aucun planning existant trouvé - génération d\'un nouveau planning');
      // Si pas de planning existant, créer un nouveau avec ce cours
      return this.generateStudyPlan([newCourse], [newCourse.id], preferences, userId);
    }

    console.log('✅ Planning existant trouvé avec', existingPlan.sessions.length, 'sessions');

    // Vérifier si le cours n'est pas déjà dans le planning
    const existingCourseIds = new Set(existingPlan.sessions.map(s => s.courseId));
    if (existingCourseIds.has(newCourse.id)) {
      console.log('⚠️ Cours déjà planifié, pas de mise à jour nécessaire');
      return existingPlan;
    }

    // Générer les nouvelles sessions pour ce cours uniquement
    const newSessions = this.generateSessionsForCourse(
      newCourse,
      preferences,
      existingPlan.sessions.length + 1 // Commencer l'ID après les sessions existantes
    );

    // Trouver la prochaine date disponible après la dernière session existante
    const lastSessionDate = existingPlan.sessions.length > 0 
      ? new Date(Math.max(...existingPlan.sessions.map(s => s.date.getTime())))
      : new Date();

    // Ajuster les dates des nouvelles sessions pour commencer après les existantes
    const adjustedNewSessions = this.adjustSessionDates(
      newSessions, 
      lastSessionDate, 
      preferences
    );

    // Combiner toutes les sessions
    const allSessions = [
      ...existingPlan.sessions,
      ...adjustedNewSessions
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Recalculer les métriques globales
    const totalEstimatedHours = allSessions.reduce((total, session) => 
      total + (session.estimatedMinutes / 60), 0
    );

    const completedSessions = allSessions.filter(s => s.isCompleted).length;
    const progressPercentage = allSessions.length > 0 ? 
      Math.round((completedSessions / allSessions.length) * 100) : 0;

    // Mettre à jour le planning
    const updatedPlan: StudyPlan = {
      ...existingPlan,
      name: `Plan d'étude mis à jour (${new Set(allSessions.map(s => s.courseId)).size} cours)`,
      sessions: allSessions,
      totalEstimatedHours: Math.round(totalEstimatedHours * 10) / 10,
      progressPercentage,
      lastUpdated: new Date()
    };

    // Sauvegarder
    this.savePlan(updatedPlan);
    
    console.log('✅ Planning mis à jour avec', adjustedNewSessions.length, 'nouvelles sessions');
    return updatedPlan;
  }

  /**
   * Génère les sessions pour un cours spécifique
   */
  private static generateSessionsForCourse(
    course: Course,
    preferences: StudyPreferences,
    startingSessionId: number
  ): StudySession[] {
    const sessions: StudySession[] = [];
    const courseLessons = course.lessons || [];
    
    if (courseLessons.length === 0) {
      console.log('⚠️ Cours sans leçons détaillées:', course.title);
      return [];
    }

    console.log('📚 Génération de sessions pour', courseLessons.length, 'leçons du cours', course.title);

    courseLessons.forEach((lesson, index) => {
      // Calculer la durée de session basée sur les préférences
      const lessonDuration = Math.floor(preferences.dailyStudyHours * 60 / 2); // Diviser par 2 pour avoir plusieurs leçons par jour
      
      sessions.push({
        id: `session-${startingSessionId + index}`,
        date: new Date(), // Sera ajustée plus tard
        startTime: preferences.preferredStartTime,
        endTime: this.addMinutesToTime(preferences.preferredStartTime, lessonDuration),
        courseId: course.id,
        courseName: course.title,
        lessonId: lesson.id,
        lessonName: lesson.title,
        type: 'lesson',
        isCompleted: lesson.isCompleted || false,
        isOptional: false,
        difficulty: lesson.difficulty as any || 'medium',
        estimatedMinutes: lessonDuration,
        duration: lessonDuration,
        status: lesson.isCompleted ? 'completed' : 'upcoming',
        videoProgressPercentage: lesson.isCompleted ? 100 : 0,
        videoId: lesson.videoId || `video-${lesson.id}`,
        requiredCompletionThreshold: 100
      });

      // Ajouter une session de révision après quelques leçons
      if ((index + 1) % 3 === 0) {
        sessions.push({
          id: `session-${startingSessionId + index + 1000}`, // Décalage pour éviter les conflits
          date: new Date(), // Sera ajustée plus tard
          startTime: preferences.preferredStartTime,
          endTime: this.addMinutesToTime(preferences.preferredStartTime, 30),
          courseId: course.id,
          courseName: course.title,
          type: 'review',
          isCompleted: false,
          isOptional: true,
          difficulty: 'easy',
          estimatedMinutes: 30,
          duration: 30,
          status: 'upcoming',
          videoProgressPercentage: 0,
          videoId: `review-${course.id}-${index}`,
          requiredCompletionThreshold: 90
        });
      }
    });

    // Appliquer les couleurs
    return sessions.map(session => 
      PlannerCoachingService.applyColorCoding(session)
    );
  }

  /**
   * Ajuste les dates des nouvelles sessions pour les placer après les existantes
   */
  private static adjustSessionDates(
    sessions: StudySession[],
    lastDate: Date,
    preferences: StudyPreferences
  ): StudySession[] {
    console.log('📅 Ajustement des dates à partir du', lastDate.toLocaleDateString());
    
    // Commencer le lendemain de la dernière session
    let currentDate = new Date(lastDate);
    currentDate.setDate(currentDate.getDate() + 1);

    return sessions.map((session, index) => {
      // Trouver la prochaine date disponible selon les préférences
      const sessionDate = this.getNextAvailableDate(currentDate, index, preferences.availableDays);
      
      return {
        ...session,
        date: sessionDate
      };
    });
  }

  /**
   * Adapte le planning en cas de retard ou d'avance
   */
  static adaptPlan(
    currentPlan: StudyPlan,
    completedSessions: string[],
    missedSessions: string[]
  ): StudyPlan {
    const updatedSessions = currentPlan.sessions.map(session => ({
      ...session,
      isCompleted: completedSessions.includes(session.id)
    }));

    // Calculer le pourcentage de progression
    const completedCount = completedSessions.length;
    const totalSessions = currentPlan.sessions.length;
    const progressPercentage = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

    let adaptationReason = '';

    // Vérifier s'il y a du retard
    if (missedSessions.length > 0) {
      adaptationReason = `Rattrapage nécessaire : ${missedSessions.length} session${missedSessions.length > 1 ? 's' : ''} en retard`;
      
      // Redistribuer les sessions manquées
      // TODO: Implémenter la logique de redistribution
    } else if (progressPercentage > this.calculateExpectedProgress(currentPlan)) {
      adaptationReason = 'Excellent ! Tu es en avance sur ton planning. Optimisation en cours...';
    }

    return {
      ...currentPlan,
      sessions: updatedSessions,
      progressPercentage,
      adaptationReason,
      lastUpdated: new Date()
    };
  }

  /**
   * Crée une notification pour le buddy system
   */
  static createBuddyNotification(
    buddy: BuddySystem,
    type: 'missed-session' | 'progress-update',
    sessionName?: string
  ): PlannerNotification {
    const messages = {
      'missed-session': `Ton buddy a manqué sa session d'étude "${sessionName}". Un petit encouragement ? 💪`,
      'progress-update': `Ton buddy fait des progrès fantastiques ! Continue à l'encourager 🎉`
    };

    return {
      id: `buddy-notif-${Date.now()}`,
      userId: buddy.userId,
      type: 'buddy-alert',
      title: type === 'missed-session' ? 'Session manquée' : 'Progrès excellent',
      message: messages[type],
      actionRequired: type === 'missed-session',
      timestamp: new Date(),
      isRead: false,
      metadata: {
        buddyId: buddy.id
      }
    };
  }

  /**
   * Génère un message WhatsApp prédéfini pour le coaching
   */
  static generateWhatsAppMessage(
    plannerAccess: PlannerAccess,
    currentPlan?: StudyPlan
  ): string {
    const baseMessage = "Salut l'équipe SMS ! 👋";
    
    if (!plannerAccess.hasAccess) {
      return `${baseMessage}\n\nJ'aimerais en savoir plus sur le planificateur personnel. Comment ça peut m'aider dans mes études ? 📚`;
    }

    if (currentPlan) {
      return `${baseMessage}\n\nJ'ai besoin d'aide avec mon planning d'étude. Je suis à ${currentPlan.progressPercentage}% de progression et j'aimerais optimiser ma stratégie ! 🎯`;
    }

    return `${baseMessage}\n\nJe viens d'avoir accès au planificateur ! Pouvez-vous m'aider à créer le planning parfait pour réussir mes examens ? 🚀`;
  }

  // Méthodes utilitaires privées
  
  /**
   * Génère quelques sessions de démonstration pour des dates spécifiques
   */
  private static generateDemoSessions(startDate: Date, preferences: StudyPreferences): StudySession[] {
    const demoSessions: StudySession[] = [];
    
    // Créer une session pour le vendredi 19 septembre 2025
    const friday19Sept = new Date(2025, 8, 19); // Mois 8 = septembre (0-indexé)
    
    // Session de mathématiques le vendredi matin
    demoSessions.push({
      id: `demo-friday-math-${Date.now()}`,
      date: friday19Sept,
      startTime: '09:00',
      endTime: '10:30',
      courseId: 'course-gauss',
      courseName: 'Loi de Gauss',
      lessonId: 'lesson-gauss-1',
      lessonName: 'Introduction aux distributions',
      type: 'lesson',
      isCompleted: false,
      isOptional: false,
      difficulty: 'medium',
      estimatedMinutes: 90,
      duration: 90,
      status: 'upcoming',
      videoProgressPercentage: 0,
      videoId: 'video-gauss-intro',
      requiredCompletionThreshold: 100
    });
    
    // Session de révision le vendredi après-midi
    demoSessions.push({
      id: `demo-friday-review-${Date.now()}`,
      date: friday19Sept,
      startTime: '14:00',
      endTime: '15:00',
      courseId: 'course-suites',
      courseName: 'Suites et Limites',
      lessonId: 'lesson-suites-rev',
      lessonName: 'Révision suites convergentes',
      type: 'review',
      isCompleted: false,
      isOptional: true,
      difficulty: 'easy',
      estimatedMinutes: 60,
      duration: 60,
      status: 'upcoming',
      videoProgressPercentage: 65,
      videoId: 'video-suites-review',
      requiredCompletionThreshold: 90
    });
    
    return demoSessions;
  }
  
  /**
   * Calcule la prochaine date disponible selon les préférences utilisateur
   */
  private static getNextAvailableDate(startDate: Date, sessionIndex: number, availableDays: string[]): Date {
    // Mapping des jours string vers numéros
    const dayMapping = {
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6,
      'sunday': 0
    };
    
    const availableDayNumbers = availableDays.map(day => dayMapping[day as keyof typeof dayMapping]).filter(Boolean);
    
    // Convertir l'index en nombre de jours (espacement intelligent)
    const daysToAdd = Math.floor(sessionIndex * 1.2); // Espacement plus serré pour plus de sessions
    
    let currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + daysToAdd);
    
    // Ajuster pour tomber sur un jour disponible
    let attempts = 0;
    while (attempts < 14) { // Max 2 semaines de recherche
      const dayOfWeek = currentDate.getDay();
      
      if (availableDayNumbers.includes(dayOfWeek)) {
        return new Date(currentDate);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
      attempts++;
    }
    
    // Si aucun jour disponible trouvé, retourner la date calculée (fallback)
    return new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  }

  private static addMinutesToTime(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  }

  private static calculateExpectedProgress(plan: StudyPlan): number {
    const daysSinceStart = Math.floor((Date.now() - plan.startDate.getTime()) / (24 * 60 * 60 * 1000));
    const totalDays = plan.examDate ? 
      Math.floor((plan.examDate.getTime() - plan.startDate.getTime()) / (24 * 60 * 60 * 1000)) : 
      30;
    return Math.min(Math.round((daysSinceStart / totalDays) * 100), 100);
  }

  /**
   * Méthode de debugging pour tester le système cumulatif
   */
  static debugCumulativePlanning(userId: string): void {
    console.log('🔧 === DEBUG PLANIFICATION CUMULATIVE ===');
    
    const existingPlan = this.getExistingPlan(userId);
    if (existingPlan) {
      console.log('📅 Planning existant trouvé:');
      console.log('  - Nom:', existingPlan.name);
      console.log('  - Sessions:', existingPlan.sessions.length);
      console.log('  - Cours dans le planning:', new Set(existingPlan.sessions.map(s => s.courseId)).size);
      console.log('  - Dernière mise à jour:', existingPlan.lastUpdated.toLocaleString());
      
      // Grouper par cours
      const sessionsByCourse: { [courseId: string]: number } = {};
      existingPlan.sessions.forEach(session => {
        sessionsByCourse[session.courseId] = (sessionsByCourse[session.courseId] || 0) + 1;
      });
      
      console.log('  - Répartition par cours:');
      Object.entries(sessionsByCourse).forEach(([courseId, count]) => {
        console.log(`    * ${courseId}: ${count} sessions`);
      });
    } else {
      console.log('❌ Aucun planning existant pour cet utilisateur');
    }
    
    console.log('🔧 === FIN DEBUG ===');
  }

  /**
   * Efface complètement le planning d'un utilisateur (pour les tests)
   */
  static clearUserPlanning(userId: string): void {
    this.planCache.delete(userId);
    localStorage.removeItem(`planner_${userId}`);
    console.log('🗑️ Planning effacé pour l\'utilisateur:', userId);
  }
}

/**
 * Hook personnalisé pour gérer l'état du planificateur
 */
export const usePlannerState = (
  courses: Course[],
  purchasedItems: string[],
  userId: string,
  isConfigured: boolean = false,
  hasPostponed: boolean = false
) => {
  // Calculer l'accès au planificateur
  const plannerAccess = PlannerService.checkPlannerAccess(courses, purchasedItems, userId, isConfigured, hasPostponed);

  // Vérifier si un planning existe déjà
  const hasExistingPlan = PlannerService.hasExistingPlan(userId);
  const existingPlan = PlannerService.getExistingPlan(userId);

  return {
    plannerAccess,
    canCreatePlan: plannerAccess.hasAccess,
    hasExistingPlan,
    existingPlan,
    
    // Génération initiale (première fois seulement)
    generatePlan: (preferences: StudyPreferences) => 
      PlannerService.generateStudyPlan(courses, plannerAccess.completeCourses, preferences, userId),
    
    // Mise à jour cumulative (ajouter un nouveau cours)
    updatePlanWithNewCourse: (newCourse: Course, preferences: StudyPreferences) => 
      PlannerService.updatePlanningWithNewCourse(userId, newCourse, preferences),
    
    // Méthode intelligente qui choisit la bonne approche
    createOrUpdatePlan: (preferences: StudyPreferences, newCourse?: Course) => {
      if (newCourse && hasExistingPlan) {
        console.log('🔄 Mise à jour du planning existant avec le nouveau cours');
        return PlannerService.updatePlanningWithNewCourse(userId, newCourse, preferences);
      } else {
        console.log('✨ Génération d\'un nouveau planning complet');
        return PlannerService.generateStudyPlan(courses, plannerAccess.completeCourses, preferences, userId);
      }
    },
    
    generateWhatsAppMessage: () => 
      PlannerService.generateWhatsAppMessage(plannerAccess, existingPlan || undefined)
  };
};
