'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Edit, 
  CheckCircle, 
  Clock, 
  Users, 
  AlertCircle, 
  Plus,
  Badge,
  Info
} from 'lucide-react';
import { ExamDate, ExamDatesState, ProposeExamDateData } from '@/types';
import { ExamDatesService } from '@/lib/exam-dates-service';
import { ProposeExamDateModal } from './ProposeExamDateModal';
import { ExamDateValidationActions } from './ExamDateValidationActions';

interface ParticipativeExamDatesProps {
  favoriteCourses: Array<{
    id: string;
    title: string;
    progress?: number;
    examDate?: Date;
  }>;
  focusedCourse?: {
    id: string;
    title: string;
    examDate?: Date;
  } | null;
  userId: string;
  userName: string;
  faculty: string;
}

export function ParticipativeExamDates({
  favoriteCourses,
  focusedCourse,
  userId,
  userName,
  faculty
}: ParticipativeExamDatesProps) {
  const [examDatesState, setExamDatesState] = useState<ExamDatesState>({
    examDates: [],
    isLoading: true,
    error: null,
    userCanPropose: true,
    userFaculty: faculty,
    userId
  });

  const [showProposeModal, setShowProposeModal] = useState(false);
  const [selectedCourseForProposal, setSelectedCourseForProposal] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Charger les données au montage et forcer reload pour les nouvelles données
  useEffect(() => {
    // Force un reload avec les nouvelles données mockées
    ExamDatesService.forceReloadData(faculty);
    loadExamDates();
  }, [faculty]);

  const loadExamDates = () => {
    setExamDatesState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const examDates = ExamDatesService.getAllExamDates(faculty);
      setExamDatesState(prev => ({
        ...prev,
        examDates,
        isLoading: false
      }));
    } catch (error) {
      setExamDatesState(prev => ({
        ...prev,
        error: 'Erreur lors du chargement des dates d\'examen',
        isLoading: false
      }));
    }
  };

  const handleProposeDate = (data: ProposeExamDateData) => {
    try {
      ExamDatesService.proposeExamDate(data);
      loadExamDates(); // Recharger les données
      setShowProposeModal(false);
      setSelectedCourseForProposal(null);
    } catch (error) {
      console.error('Erreur lors de la proposition:', error);
    }
  };

  const handleConfirmDate = (proposalId: string) => {
    try {
      const success = ExamDatesService.confirmExamDate(proposalId, userId, userName, faculty);
      if (success) {
        loadExamDates();
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
    }
  };

  const handleCorrectDate = (originalProposalId: string, newDate: Date, reason?: string) => {
    try {
      const correction = ExamDatesService.correctExamDate(originalProposalId, newDate, userId, userName, reason);
      if (correction) {
        loadExamDates();
      }
    } catch (error) {
      console.error('Erreur lors de la correction:', error);
    }
  };

  const getExamDateForCourse = (courseId: string): ExamDate | null => {
    return examDatesState.examDates.find(exam => exam.courseId === courseId) || null;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short'
    }).format(new Date(date));
  };

  const getTimeUntilExam = (date: Date) => {
    const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Passé';
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Demain';
    if (days < 7) return `${days} jours`;
    if (days < 30) return `${Math.ceil(days / 7)} sem.`;
    return `${Math.ceil(days / 30)} mois`;
  };

  const openProposeModal = (courseId: string, courseName: string) => {
    setSelectedCourseForProposal({ id: courseId, title: courseName });
    setShowProposeModal(true);
  };

  if (examDatesState.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Chargement des dates d'examen...</span>
      </div>
    );
  }

  if (examDatesState.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle size={16} />
          <span className="text-sm">{examDatesState.error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Message si un cours focalisé est fourni */}
      {focusedCourse && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="text-emerald-600" size={16} />
            <p className="text-sm font-medium text-emerald-800">
              Configuration pour le cours : <span className="font-semibold">{focusedCourse.title}</span>
            </p>
          </div>
          
          {(() => {
            const examDate = getExamDateForCourse(focusedCourse.id);
            if (examDate?.status === 'official' && examDate.officialDate) {
              return (
                <p className="text-xs text-emerald-700">
                  Examen officiel le {formatDate(examDate.officialDate)}
                </p>
              );
            } else if (examDate?.currentProposal) {
              return (
                <p className="text-xs text-emerald-700">
                  Date proposée le {formatDate(examDate.currentProposal.proposedDate)}
                </p>
              );
            } else {
              return (
                <p className="text-xs text-emerald-700">
                  Aucune date définie - Vous pouvez en proposer une
                </p>
              );
            }
          })()}
        </div>
      )}

      {/* Liste des cours avec leurs dates d'examen */}
      {favoriteCourses.map((course) => {
        const isFocused = focusedCourse && course.id === focusedCourse.id;
        const examDate = getExamDateForCourse(course.id);
        
        return (
          <div key={course.id} className="space-y-3">
            {/* En-tête du cours */}
            <div className={`p-3 rounded-lg transition-all ${
              isFocused 
                ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 ring-2 ring-emerald-200' 
                : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{course.title}</h4>
                  {course.progress !== undefined && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{course.progress}%</span>
                    </div>
                  )}
                </div>

                {/* Affichage de la date selon le statut */}
                <div className="text-right ml-4">
                  {(() => {
                    // Cas 1: Date officielle
                    if (examDate?.status === 'official' && examDate.officialDate) {
                      return (
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {formatDate(examDate.officialDate)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {getTimeUntilExam(examDate.officialDate)}
                            </div>
                          </div>
                          <CheckCircle className="text-green-600" size={16} />
                        </div>
                      );
                    }

                    // Cas 2: Date proposée par la communauté
                    if (examDate?.currentProposal) {
                      const isValidated = examDate.currentProposal.status === 'community-validated';
                      return (
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {formatDate(examDate.currentProposal.proposedDate)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              {isValidated ? (
                                <>
                                  <CheckCircle size={10} className="text-green-600" />
                                  <span>Validée</span>
                                </>
                              ) : (
                                <>
                                  <Clock size={10} className="text-orange-600" />
                                  <span>Proposée</span>
                                </>
                              )}
                            </div>
                          </div>
                          {isValidated ? (
                            <CheckCircle className="text-green-600" size={16} />
                          ) : (
                            <Info className="text-orange-600" size={16} />
                          )}
                        </div>
                      );
                    }

                    // Cas 3: Aucune date définie
                    return (
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-400">Non définie</div>
                        <button
                          onClick={() => openProposeModal(course.id, course.title)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Proposer une date"
                        >
                          <Edit className="text-gray-500" size={14} />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Actions de validation si la date est proposée */}
            {examDate?.currentProposal && examDate.status !== 'official' && (
              <ExamDateValidationActions
                examDate={examDate}
                userId={userId}
                userName={userName}
                faculty={faculty}
                onConfirm={handleConfirmDate}
                onCorrect={handleCorrectDate}
                canConfirm={ExamDatesService.canUserInteract(examDate, userId).canConfirm}
                canCorrect={ExamDatesService.canUserInteract(examDate, userId).canCorrect}
              />
            )}
          </div>
        );
      })}

      {/* Modal de proposition de date */}
      {selectedCourseForProposal && (
        <ProposeExamDateModal
          isOpen={showProposeModal}
          onClose={() => {
            setShowProposeModal(false);
            setSelectedCourseForProposal(null);
          }}
          onPropose={handleProposeDate}
          courseId={selectedCourseForProposal.id}
          courseName={selectedCourseForProposal.title}
          faculty={faculty}
          userId={userId}
          userName={userName}
        />
      )}
    </div>
  );
}
