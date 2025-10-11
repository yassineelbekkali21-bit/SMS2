'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';
import { ProposeExamDateData } from '@/types';

interface ProposeExamDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropose: (data: ProposeExamDateData) => void;
  courseId: string;
  courseName: string;
  faculty: string;
  userId: string;
  userName: string;
}

export function ProposeExamDateModal({
  isOpen,
  onClose,
  onPropose,
  courseId,
  courseName,
  faculty,
  userId,
  userName
}: ProposeExamDateModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setError('Veuillez sélectionner une date');
      return;
    }

    const proposedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    const now = new Date();

    if (proposedDateTime <= now) {
      setError('La date d\'examen doit être dans le futur');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data: ProposeExamDateData = {
        courseId,
        proposedDate: proposedDateTime,
        proposedBy: userId,
        proposedByName: userName,
        faculty
      };

      onPropose(data);
      onClose();
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('09:00');
    } catch (err) {
      setError('Erreur lors de la proposition de date');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedDate('');
      setSelectedTime('09:00');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="text-blue-600" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Proposer une date</h2>
                  <p className="text-sm text-gray-600">{courseName}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Info explicative */}
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="text-blue-600" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Proposition participative</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Votre proposition sera visible aux autres étudiants de votre faculté inscrits à ce cours. 
                  Elle sera validée si plusieurs étudiants la confirment.
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Date d'examen *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Heure */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Heure d'examen
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="08:00">08h00</option>
                  <option value="09:00">09h00</option>
                  <option value="10:00">10h00</option>
                  <option value="11:00">11h00</option>
                  <option value="13:00">13h00</option>
                  <option value="14:00">14h00</option>
                  <option value="15:00">15h00</option>
                  <option value="16:00">16h00</option>
                </select>
              </div>

              {/* Message d'erreur */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Note pédagogique */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm text-gray-700 font-medium mb-1">
                      Conseil collaboratif
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Proposez une date réaliste en tenant compte des autres examens et du temps de révision nécessaire. 
                      Les autres étudiants pourront confirmer ou proposer une correction.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedDate}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Proposition...</span>
                  </>
                ) : (
                  <>
                    <Calendar size={16} />
                    <span>Proposer cette date</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}





