'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Edit, Users, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { ExamDate, ExamDateProposal } from '@/types';
import { ProposeExamDateModal } from './ProposeExamDateModal';

interface ExamDateValidationActionsProps {
  examDate: ExamDate;
  userId: string;
  userName: string;
  faculty: string;
  onConfirm: (proposalId: string) => void;
  onCorrect: (originalProposalId: string, newDate: Date, reason?: string) => void;
  canConfirm: boolean;
  canCorrect: boolean;
}

export function ExamDateValidationActions({
  examDate,
  userId,
  userName,
  faculty,
  onConfirm,
  onCorrect,
  canConfirm,
  canCorrect
}: ExamDateValidationActionsProps) {
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const proposal = examDate.currentProposal;
  
  if (!proposal || examDate.status === 'official') {
    return null;
  }

  const handleConfirm = async () => {
    if (!canConfirm || !proposal) return;
    
    setIsConfirming(true);
    try {
      onConfirm(proposal.id);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCorrection = (newData: any) => {
    if (!proposal) return;
    
    onCorrect(proposal.id, newData.proposedDate, "Date corrigée par un pair");
    setShowCorrectionModal(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusInfo = () => {
    if (!proposal) return null;

    const confirmationsCount = proposal.confirmations.length;
    const isValidated = proposal.status === 'community-validated';

    if (isValidated) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        title: 'Date validée par la communauté',
        subtitle: `Confirmée par ${confirmationsCount} étudiant(s)`
      };
    } else {
      return {
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        title: 'Date proposée (en attente de validation)',
        subtitle: `${confirmationsCount} confirmation(s) - 3 nécessaires pour valider`
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo?.icon || Clock;

  return (
    <div className="space-y-4">
      {/* Affichage de la date proposée */}
      <div className={`p-4 rounded-xl border ${statusInfo?.borderColor} ${statusInfo?.bgColor}`}>
        <div className="flex items-start gap-3">
          <StatusIcon className={`${statusInfo?.color} mt-0.5`} size={20} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{statusInfo?.title}</h4>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users size={12} />
                <span>{examDate.participatingStudents} participants</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="font-medium text-gray-900">
                  {formatDate(proposal.proposedDate)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">
                Proposé par <span className="font-medium">{proposal.proposedByName}</span> • {statusInfo?.subtitle}
              </p>
            </div>

            {/* Liste des confirmations */}
            {proposal.confirmations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Confirmations :</p>
                <div className="flex flex-wrap gap-1">
                  {proposal.confirmations.map((confirmation, index) => (
                    <span
                      key={confirmation.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                    >
                      <CheckCircle size={10} />
                      {confirmation.confirmedByName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions utilisateur */}
      {proposal.status === 'pending' && (canConfirm || canCorrect) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          {canConfirm && (
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isConfirming ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <CheckCircle size={16} />
              )}
              <span>Confirmer</span>
            </button>
          )}
          
          {canCorrect && (
            <button
              onClick={() => setShowCorrectionModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
            >
              <Edit size={16} />
              <span>Corriger</span>
            </button>
          )}
        </motion.div>
      )}

      {/* Limitation des actions */}
      {!canConfirm && !canCorrect && proposal.status === 'pending' && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
          <AlertTriangle size={16} />
          <span className="text-sm">
            {proposal.proposedBy === userId 
              ? "Vous ne pouvez pas valider votre propre proposition"
              : "Vous avez déjà interagi avec cette proposition"}
          </span>
        </div>
      )}

      {/* Modal de correction */}
      <ProposeExamDateModal
        isOpen={showCorrectionModal}
        onClose={() => setShowCorrectionModal(false)}
        onPropose={handleCorrection}
        courseId={examDate.courseId}
        courseName={examDate.courseName}
        faculty={faculty}
        userId={userId}
        userName={userName}
      />
    </div>
  );
}



