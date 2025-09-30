'use client';

import { BuddiesService } from './buddies-service';
import { GamificationService } from './gamification-service';

export interface ParentReport {
  id: string;
  studentId: string;
  parentId: string;
  weekStartDate: Date;
  weekEndDate: Date;
  generatedAt: Date;
  
  // Données de progression
  coursesProgress: {
    courseId: string;
    courseName: string;
    lessonsCompleted: number;
    totalLessons: number;
    progressPercentage: number;
    timeSpent: number; // en minutes
  }[];
  
  // Données de gamification
  xpGained: number;
  levelProgress: {
    currentLevel: number;
    xpToNextLevel: number;
    progressPercentage: number;
  };
  badgesEarned: {
    id: string;
    name: string;
    earnedAt: Date;
  }[];
  
  // Activité sociale
  studyRoomParticipations: number;
  studyRoomHours: number;
  buddiesInteractions: number;
  helpGiven: number; // Nombre de fois où l'étudiant a aidé d'autres
  helpReceived: number; // Nombre de fois où l'étudiant a été aidé
  
  // Habitudes d'étude
  studyStreak: number; // Jours consécutifs d'activité
  averageSessionDuration: number; // en minutes
  mostActiveTimeSlot: string; // 'morning', 'afternoon', 'evening', 'night'
  consistencyScore: number; // 0-100, basé sur la régularité
  
  // Insights et recommandations
  insights: string[];
  recommendations: string[];
  
  // Flags de préoccupation
  concerns: {
    type: 'low-activity' | 'declining-progress' | 'social-isolation' | 'irregular-schedule';
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
}

export interface ParentReportSettings {
  studentId: string;
  parentEmail: string;
  parentName: string;
  isEnabled: boolean;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  preferredDay: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  includeDetailed: boolean; // Rapport détaillé vs résumé
  includeSocialActivity: boolean;
  includeStudyRoomActivity: boolean;
  language: 'fr' | 'en';
  
  // Consentements
  studentConsent: boolean;
  parentConsent: boolean;
  consentDate: Date;
}

export class ParentReportsService {
  private static readonly SETTINGS_KEY = 'parent_reports_settings_v1';
  private static readonly REPORTS_KEY = 'parent_reports_history_v1';

  // ========================================================================
  // GESTION DES PARAMÈTRES
  // ========================================================================

  static getParentReportSettings(studentId: string): ParentReportSettings | null {
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    if (!stored) return null;

    try {
      const allSettings = JSON.parse(stored);
      return allSettings[studentId] || null;
    } catch (error) {
      console.error('Erreur lecture paramètres rapports parents:', error);
      return null;
    }
  }

  static saveParentReportSettings(settings: ParentReportSettings): void {
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    let allSettings = {};

    if (stored) {
      try {
        allSettings = JSON.parse(stored);
      } catch (error) {
        console.error('Erreur parsing paramètres rapports parents:', error);
      }
    }

    allSettings[settings.studentId] = settings;
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(allSettings));

    console.log('✅ Paramètres rapports parents sauvegardés pour', settings.studentId);
  }

  static disableParentReports(studentId: string): void {
    const settings = this.getParentReportSettings(studentId);
    if (settings) {
      settings.isEnabled = false;
      this.saveParentReportSettings(settings);
    }
  }

  // ========================================================================
  // GÉNÉRATION DE RAPPORTS
  // ========================================================================

  static generateWeeklyReport(studentId: string): ParentReport | null {
    console.log('📊 PARENT REPORT: Génération du rapport hebdomadaire pour', studentId);

    const settings = this.getParentReportSettings(studentId);
    if (!settings || !settings.isEnabled) {
      console.log('⚠️ Rapports parents désactivés pour', studentId);
      return null;
    }

    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - 7);
    const weekEndDate = new Date();

    const report: ParentReport = {
      id: `report_${studentId}_${Date.now()}`,
      studentId,
      parentId: settings.parentEmail,
      weekStartDate,
      weekEndDate,
      generatedAt: new Date(),
      
      coursesProgress: this.generateCoursesProgress(studentId),
      xpGained: this.calculateWeeklyXPGain(studentId),
      levelProgress: this.getLevelProgress(studentId),
      badgesEarned: this.getWeeklyBadges(studentId, weekStartDate),
      
      studyRoomParticipations: this.getWeeklyStudyRoomParticipations(studentId),
      studyRoomHours: this.getWeeklyStudyRoomHours(studentId),
      buddiesInteractions: this.getWeeklyBuddiesInteractions(studentId),
      helpGiven: this.getWeeklyHelpGiven(studentId),
      helpReceived: this.getWeeklyHelpReceived(studentId),
      
      studyStreak: this.calculateStudyStreak(studentId),
      averageSessionDuration: this.calculateAverageSessionDuration(studentId),
      mostActiveTimeSlot: this.getMostActiveTimeSlot(studentId),
      consistencyScore: this.calculateConsistencyScore(studentId),
      
      insights: this.generateInsights(studentId),
      recommendations: this.generateRecommendations(studentId),
      concerns: this.identifyConcerns(studentId)
    };

    // Sauvegarder le rapport
    this.saveReport(report);

    console.log('✅ Rapport hebdomadaire généré:', report.id);
    return report;
  }

  // ========================================================================
  // CALCULS DE DONNÉES
  // ========================================================================

  private static generateCoursesProgress(studentId: string): ParentReport['coursesProgress'] {
    // Mock data - en production, viendrait de la vraie base de données
    return [
      {
        courseId: 'loi-gauss',
        courseName: 'Loi de Gauss',
        lessonsCompleted: 8,
        totalLessons: 15,
        progressPercentage: 53,
        timeSpent: 240 // 4h cette semaine
      },
      {
        courseId: 'integrales',
        courseName: 'Intégrales et Applications',
        lessonsCompleted: 12,
        totalLessons: 20,
        progressPercentage: 60,
        timeSpent: 180 // 3h cette semaine
      },
      {
        courseId: 'mecanique',
        courseName: 'Mécanique Classique',
        lessonsCompleted: 5,
        totalLessons: 18,
        progressPercentage: 28,
        timeSpent: 90 // 1.5h cette semaine
      }
    ];
  }

  private static calculateWeeklyXPGain(studentId: string): number {
    // En production, calculer la différence d'XP sur la semaine
    return 350; // Mock: 350 XP gagnés cette semaine
  }

  private static getLevelProgress(studentId: string): ParentReport['levelProgress'] {
    const currentLevel = GamificationService.calculateLevel(GamificationService.getUserXP(studentId));
    const currentXP = GamificationService.getUserXP(studentId);
    const nextLevelXP = GamificationService.LEVEL_THRESHOLDS[currentLevel + 1] || GamificationService.LEVEL_THRESHOLDS[GamificationService.LEVEL_THRESHOLDS.length - 1];
    const currentLevelXP = GamificationService.LEVEL_THRESHOLDS[currentLevel];
    
    const xpToNextLevel = nextLevelXP - currentXP;
    const progressPercentage = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return {
      currentLevel,
      xpToNextLevel,
      progressPercentage: Math.round(progressPercentage)
    };
  }

  private static getWeeklyBadges(studentId: string, weekStart: Date): ParentReport['badgesEarned'] {
    // Mock data - en production, filtrer les badges par date
    return [
      {
        id: 'active-participant',
        name: 'Participant Actif',
        earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Il y a 2 jours
      }
    ];
  }

  private static getWeeklyStudyRoomParticipations(studentId: string): number {
    return 5; // Mock: 5 participations cette semaine
  }

  private static getWeeklyStudyRoomHours(studentId: string): number {
    return 3.5; // Mock: 3.5h en Study Rooms cette semaine
  }

  private static getWeeklyBuddiesInteractions(studentId: string): number {
    return 12; // Mock: 12 interactions avec des buddies
  }

  private static getWeeklyHelpGiven(studentId: string): number {
    return 3; // Mock: a aidé 3 fois
  }

  private static getWeeklyHelpReceived(studentId: string): number {
    return 2; // Mock: a reçu de l'aide 2 fois
  }

  private static calculateStudyStreak(studentId: string): number {
    return 6; // Mock: 6 jours consécutifs d'activité
  }

  private static calculateAverageSessionDuration(studentId: string): number {
    return 85; // Mock: 85 minutes en moyenne
  }

  private static getMostActiveTimeSlot(studentId: string): string {
    return 'afternoon'; // Mock: plus actif l'après-midi
  }

  private static calculateConsistencyScore(studentId: string): number {
    return 78; // Mock: 78% de consistance
  }

  // ========================================================================
  // INSIGHTS ET RECOMMANDATIONS
  // ========================================================================

  private static generateInsights(studentId: string): string[] {
    return [
      "📈 Excellente progression en mathématiques avec 53% du cours de Loi de Gauss terminé",
      "🤝 Très bon engagement social avec 5 participations aux Study Rooms cette semaine",
      "⚡ Forte motivation visible avec 350 XP gagnés, soit +40% par rapport à la semaine dernière",
      "🎯 Constance remarquable avec 6 jours d'activité consécutifs"
    ];
  }

  private static generateRecommendations(studentId: string): string[] {
    return [
      "💡 Encourager la poursuite du cours de Mécanique Classique (seulement 28% terminé)",
      "👥 Féliciter pour l'entraide : a aidé 3 camarades cette semaine",
      "⏰ Maintenir le rythme d'étude l'après-midi qui semble être le plus productif",
      "🏆 Proche du niveau suivant ! Encore 150 XP pour débloquer de nouvelles fonctionnalités"
    ];
  }

  private static identifyConcerns(studentId: string): ParentReport['concerns'] {
    const concerns: ParentReport['concerns'] = [];

    // Exemple de logique de détection de préoccupations
    const consistencyScore = this.calculateConsistencyScore(studentId);
    if (consistencyScore < 50) {
      concerns.push({
        type: 'irregular-schedule',
        severity: 'medium',
        description: 'Horaires d\'étude irréguliers détectés. Encourager une routine plus stable.'
      });
    }

    const studyRoomParticipations = this.getWeeklyStudyRoomParticipations(studentId);
    if (studyRoomParticipations === 0) {
      concerns.push({
        type: 'social-isolation',
        severity: 'low',
        description: 'Aucune participation aux Study Rooms cette semaine. Encourager l\'apprentissage collaboratif.'
      });
    }

    return concerns;
  }

  // ========================================================================
  // SAUVEGARDE ET HISTORIQUE
  // ========================================================================

  private static saveReport(report: ParentReport): void {
    const stored = localStorage.getItem(this.REPORTS_KEY);
    let allReports: ParentReport[] = [];

    if (stored) {
      try {
        allReports = JSON.parse(stored);
      } catch (error) {
        console.error('Erreur parsing historique rapports:', error);
      }
    }

    allReports.push(report);
    
    // Garder seulement les 12 derniers rapports (3 mois)
    allReports = allReports
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
      .slice(0, 12);

    localStorage.setItem(this.REPORTS_KEY, JSON.stringify(allReports));
  }

  static getReportsHistory(studentId: string): ParentReport[] {
    const stored = localStorage.getItem(this.REPORTS_KEY);
    if (!stored) return [];

    try {
      const allReports = JSON.parse(stored);
      return allReports
        .filter((report: ParentReport) => report.studentId === studentId)
        .sort((a: ParentReport, b: ParentReport) => 
          new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
        );
    } catch (error) {
      console.error('Erreur lecture historique rapports:', error);
      return [];
    }
  }

  // ========================================================================
  // FORMATAGE POUR EMAIL
  // ========================================================================

  static formatReportForEmail(report: ParentReport, settings: ParentReportSettings): string {
    const studentName = 'Votre enfant'; // En production, récupérer le vrai nom
    const weekRange = `${report.weekStartDate.toLocaleDateString('fr-FR')} - ${report.weekEndDate.toLocaleDateString('fr-FR')}`;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rapport hebdomadaire - Science Made Simple</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; max-width: 600px; margin: 0 auto; }
        .section { margin-bottom: 30px; }
        .progress-bar { background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden; }
        .progress-fill { background: #4CAF50; height: 100%; transition: width 0.3s ease; }
        .insight { background: #f8f9ff; border-left: 4px solid #667eea; padding: 15px; margin: 10px 0; }
        .concern { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 10px 0; }
        .badge { display: inline-block; background: #667eea; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; margin: 2px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Rapport Hebdomadaire</h1>
        <p>Science Made Simple • ${weekRange}</p>
    </div>
    
    <div class="content">
        <div class="section">
            <h2>👋 Bonjour ${settings.parentName},</h2>
            <p>Voici le résumé de l'activité de ${studentName} sur Science Made Simple cette semaine.</p>
        </div>

        <div class="section">
            <h3>📚 Progression des Cours</h3>
            ${report.coursesProgress.map(course => `
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${course.courseName}</strong>
                        <span>${course.progressPercentage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progressPercentage}%"></div>
                    </div>
                    <small>${course.lessonsCompleted}/${course.totalLessons} leçons • ${Math.round(course.timeSpent/60)}h cette semaine</small>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h3>🎮 Gamification & Motivation</h3>
            <p><strong>XP gagné cette semaine:</strong> +${report.xpGained} points</p>
            <p><strong>Niveau actuel:</strong> ${report.levelProgress.currentLevel} (${report.levelProgress.progressPercentage}% vers le niveau suivant)</p>
            <p><strong>Badges débloqués:</strong> ${report.badgesEarned.map(badge => `<span class="badge">${badge.name}</span>`).join('')}</p>
        </div>

        <div class="section">
            <h3>👥 Activité Sociale</h3>
            <ul>
                <li><strong>${report.studyRoomParticipations}</strong> participations aux Study Rooms (${report.studyRoomHours}h au total)</li>
                <li><strong>${report.helpGiven}</strong> fois où ${studentName} a aidé d'autres étudiants</li>
                <li><strong>${report.helpReceived}</strong> fois où ${studentName} a reçu de l'aide</li>
                <li><strong>${report.studyStreak}</strong> jours consécutifs d'activité</li>
            </ul>
        </div>

        <div class="section">
            <h3>💡 Insights de la Semaine</h3>
            ${report.insights.map(insight => `<div class="insight">${insight}</div>`).join('')}
        </div>

        <div class="section">
            <h3>🎯 Recommandations</h3>
            ${report.recommendations.map(rec => `<div class="insight">${rec}</div>`).join('')}
        </div>

        ${report.concerns.length > 0 ? `
        <div class="section">
            <h3>⚠️ Points d'Attention</h3>
            ${report.concerns.map(concern => `<div class="concern"><strong>${concern.severity.toUpperCase()}:</strong> ${concern.description}</div>`).join('')}
        </div>
        ` : ''}

        <div class="section">
            <p style="text-align: center; color: #666; font-size: 14px;">
                Ce rapport est généré automatiquement chaque semaine.<br>
                Pour modifier vos préférences ou vous désabonner, contactez-nous à support@sciencemadesimple.com
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  // ========================================================================
  // UTILITAIRES
  // ========================================================================

  static createDefaultSettings(studentId: string, parentEmail: string, parentName: string): ParentReportSettings {
    return {
      studentId,
      parentEmail,
      parentName,
      isEnabled: false, // Désactivé par défaut, nécessite activation explicite
      frequency: 'weekly',
      preferredDay: 'sunday',
      includeDetailed: true,
      includeSocialActivity: true,
      includeStudyRoomActivity: true,
      language: 'fr',
      studentConsent: false,
      parentConsent: false,
      consentDate: new Date()
    };
  }

  static debugReports(studentId: string): void {
    console.log('🔍 DEBUG PARENT REPORTS pour', studentId);
    
    const settings = this.getParentReportSettings(studentId);
    console.log('⚙️ Paramètres:', settings);
    
    const history = this.getReportsHistory(studentId);
    console.log('📚 Historique:', history.length, 'rapports');
    
    if (settings && settings.isEnabled) {
      const report = this.generateWeeklyReport(studentId);
      console.log('📊 Rapport généré:', report);
      
      if (report) {
        const emailContent = this.formatReportForEmail(report, settings);
        console.log('📧 Contenu email:', emailContent.substring(0, 500) + '...');
      }
    }
  }
}
