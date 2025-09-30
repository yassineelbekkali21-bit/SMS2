'use client';

import { 
  ExamDate, 
  ExamDateProposal, 
  ExamDateConfirmation, 
  ExamDateCorrection,
  ExamDateStatus,
  ProposeExamDateData
} from '@/types';

export class ExamDatesService {
  private static readonly STORAGE_KEY = 'exam_dates_v1';
  private static readonly VALIDATION_THRESHOLD = 3; // Nombre de confirmations nécessaires

  // ========================================================================
  // MÉTHODES PRINCIPALES
  // ========================================================================

  static getAllExamDates(facultyId: string): ExamDate[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      const mockData = this.generateMockData(facultyId);
      this.saveToStorage(mockData);
      return mockData;
    }
    
    try {
      const data = JSON.parse(stored);
      return data.filter((exam: ExamDate) => exam.faculty === facultyId);
    } catch (error) {
      console.error('Erreur lors du chargement des dates d\'examen:', error);
      return this.generateMockData(facultyId);
    }
  }

  static getExamDateByCourse(courseId: string, facultyId: string): ExamDate | null {
    const examDates = this.getAllExamDates(facultyId);
    return examDates.find(exam => exam.courseId === courseId) || null;
  }

  static proposeExamDate(data: ProposeExamDateData): ExamDateProposal {
    const allData = this.loadAllData();
    const examDate = allData.find(exam => 
      exam.courseId === data.courseId && exam.faculty === data.faculty
    );

    const newProposal: ExamDateProposal = {
      id: `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      courseId: data.courseId,
      facultyId: data.faculty,
      proposedDate: data.proposedDate,
      proposedBy: data.proposedBy,
      proposedByName: data.proposedByName,
      proposedAt: new Date(),
      status: 'pending',
      confirmations: [],
      corrections: []
    };

    if (examDate) {
      // Archiver l'ancienne proposition si elle existe
      if (examDate.currentProposal) {
        examDate.previousProposals.push(examDate.currentProposal);
      }
      
      examDate.currentProposal = newProposal;
      examDate.status = 'proposed';
      examDate.lastUpdated = new Date();
    } else {
      // Créer une nouvelle entrée d'examen
      const newExamDate: ExamDate = {
        courseId: data.courseId,
        courseName: this.getCourseNameById(data.courseId),
        faculty: data.faculty,
        status: 'proposed',
        currentProposal: newProposal,
        previousProposals: [],
        lastUpdated: new Date(),
        totalStudentsInCourse: 45, // Simulé
        participatingStudents: 1
      };
      
      allData.push(newExamDate);
    }

    this.saveToStorage(allData);
    return newProposal;
  }

  static confirmExamDate(proposalId: string, userId: string, userName: string, faculty: string): boolean {
    const allData = this.loadAllData();
    const examDate = allData.find(exam => 
      exam.currentProposal?.id === proposalId
    );

    if (!examDate || !examDate.currentProposal) {
      return false;
    }

    // Vérifier que l'utilisateur n'a pas déjà confirmé
    const alreadyConfirmed = examDate.currentProposal.confirmations.some(
      conf => conf.confirmedBy === userId
    );

    if (alreadyConfirmed || examDate.currentProposal.proposedBy === userId) {
      return false; // Ne peut pas confirmer sa propre proposition ou confirmer deux fois
    }

    const confirmation: ExamDateConfirmation = {
      id: `conf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      proposalId,
      confirmedBy: userId,
      confirmedByName: userName,
      confirmedAt: new Date(),
      faculty
    };

    examDate.currentProposal.confirmations.push(confirmation);
    examDate.participatingStudents = Math.max(
      examDate.participatingStudents,
      examDate.currentProposal.confirmations.length + 1
    );

    // Vérifier si la proposition doit être validée par la communauté
    if (examDate.currentProposal.confirmations.length >= this.VALIDATION_THRESHOLD) {
      examDate.currentProposal.status = 'community-validated';
      examDate.status = 'community-validated';
    }

    examDate.lastUpdated = new Date();
    this.saveToStorage(allData);
    return true;
  }

  static correctExamDate(originalProposalId: string, newDate: Date, userId: string, userName: string, reason?: string): ExamDateCorrection | null {
    const allData = this.loadAllData();
    const examDate = allData.find(exam => 
      exam.currentProposal?.id === originalProposalId
    );

    if (!examDate || !examDate.currentProposal) {
      return null;
    }

    // L'utilisateur ne peut pas corriger sa propre proposition
    if (examDate.currentProposal.proposedBy === userId) {
      return null;
    }

    const correction: ExamDateCorrection = {
      id: `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalProposalId,
      correctedBy: userId,
      correctedByName: userName,
      correctedAt: new Date(),
      newProposedDate: newDate,
      reason
    };

    examDate.currentProposal.corrections.push(correction);

    // Créer une nouvelle proposition basée sur la correction
    const newProposal: ExamDateProposal = {
      id: `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      courseId: examDate.courseId,
      facultyId: examDate.faculty,
      proposedDate: newDate,
      proposedBy: userId,
      proposedByName: userName,
      proposedAt: new Date(),
      status: 'pending',
      confirmations: [],
      corrections: []
    };

    // Archiver l'ancienne proposition
    examDate.previousProposals.push(examDate.currentProposal);
    examDate.currentProposal = newProposal;
    examDate.status = 'proposed';
    examDate.lastUpdated = new Date();

    this.saveToStorage(allData);
    return correction;
  }

  static canUserInteract(examDate: ExamDate, userId: string): { canConfirm: boolean; canCorrect: boolean } {
    if (!examDate.currentProposal || examDate.status === 'official') {
      return { canConfirm: false, canCorrect: false };
    }

    const isProposer = examDate.currentProposal.proposedBy === userId;
    const hasConfirmed = examDate.currentProposal.confirmations.some(
      conf => conf.confirmedBy === userId
    );

    return {
      canConfirm: !isProposer && !hasConfirmed,
      canCorrect: !isProposer
    };
  }

  // ========================================================================
  // MÉTHODES UTILITAIRES
  // ========================================================================

  private static loadAllData(): ExamDate[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return [];
    }
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      return [];
    }
  }

  private static saveToStorage(data: ExamDate[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  private static getCourseNameById(courseId: string): string {
    const courseNames: { [key: string]: string } = {
      'suites-limites': 'Suites et Limites',
      'loi-gauss': 'Loi de Gauss',
      'integrales': 'Intégrales et Applications',
      'mecanique': 'Mécanique Classique',
      'analyse-math': 'Analyse Mathématique I',
      'equilibres': 'Équilibres Chimiques',
      'forces': 'Forces et Mouvement'
    };
    return courseNames[courseId] || 'Cours Inconnu';
  }

  private static generateMockData(facultyId: string): ExamDate[] {
    const now = new Date();
    
    return [
      // Cas 1: Date officielle (passée)
      {
        courseId: 'suites-limites',
        courseName: 'Suites et Limites',
        faculty: facultyId,
        status: 'official' as ExamDateStatus,
        officialDate: new Date('2025-01-08'),
        officialSource: 'Secrétariat Académique',
        previousProposals: [],
        lastUpdated: new Date('2024-12-01'),
        totalStudentsInCourse: 67,
        participatingStudents: 0
      },
      
      // Cas 1 bis: Date officielle (future) - Loi de Gauss
      {
        courseId: 'loi-gauss',
        courseName: 'Loi de Gauss',
        faculty: facultyId,
        status: 'official' as ExamDateStatus,
        officialDate: new Date('2025-01-28'),
        officialSource: 'Base de Données Académique',
        previousProposals: [],
        lastUpdated: new Date('2024-12-15'),
        totalStudentsInCourse: 45,
        participatingStudents: 0
      },
      
      // Cas 1 ter: Date officielle (future) - Intégrales et Applications
      {
        courseId: 'integrales',
        courseName: 'Intégrales et Applications',
        faculty: facultyId,
        status: 'official' as ExamDateStatus,
        officialDate: new Date('2025-02-12'),
        officialSource: 'Système d\'Information Étudiant',
        previousProposals: [],
        lastUpdated: new Date('2024-12-20'),
        totalStudentsInCourse: 38,
        participatingStudents: 0
      },

      // Cas 3: Date proposée par un étudiant (en attente de validation) - Équilibres Chimiques
      {
        courseId: 'equilibres',
        courseName: 'Équilibres Chimiques',
        faculty: facultyId,
        status: 'proposed' as ExamDateStatus,
        currentProposal: {
          id: 'proposal_equilibres_1',
          courseId: 'equilibres',
          facultyId: facultyId,
          proposedDate: new Date('2025-01-30'),
          proposedBy: 'student_sophie',
          proposedByName: 'Sophie Laurent',
          proposedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
          status: 'pending',
          confirmations: [
            {
              id: 'conf_equilibres_1',
              proposalId: 'proposal_equilibres_1',
              confirmedBy: 'student_alex',
              confirmedByName: 'Alex Durand',
              confirmedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              faculty: facultyId
            }
          ],
          corrections: []
        },
        previousProposals: [],
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        totalStudentsInCourse: 52,
        participatingStudents: 2
      },

      // Cas 2: Aucune date définie - Analyse Mathématique I
      {
        courseId: 'analyse-math',
        courseName: 'Analyse Mathématique I',
        faculty: facultyId,
        status: 'undefined' as ExamDateStatus,
        previousProposals: [],
        lastUpdated: new Date(),
        totalStudentsInCourse: 34,
        participatingStudents: 0
      },

      // Cas 2: Aucune date définie - Mécanique Classique
      {
        courseId: 'mecanique',
        courseName: 'Mécanique Classique',
        faculty: facultyId,
        status: 'undefined' as ExamDateStatus,
        previousProposals: [],
        lastUpdated: new Date(),
        totalStudentsInCourse: 28,
        participatingStudents: 0
      },

      // Cas 2: Aucune date définie - Forces et Mouvement
      {
        courseId: 'forces',
        courseName: 'Forces et Mouvement',
        faculty: facultyId,
        status: 'undefined' as ExamDateStatus,
        previousProposals: [],
        lastUpdated: new Date(),
        totalStudentsInCourse: 41,
        participatingStudents: 0
      }
    ];
  }

  // ========================================================================
  // MÉTHODES DE DEBUGGING ET RESET
  // ========================================================================

  static resetData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static forceReloadData(facultyId: string): void {
    localStorage.removeItem(this.STORAGE_KEY);
    const newData = this.generateMockData(facultyId);
    this.saveToStorage(newData);
  }

  static debugLog(): void {
    const data = this.loadAllData();
    console.log('📅 Données des dates d\'examen:', data);
  }
}
