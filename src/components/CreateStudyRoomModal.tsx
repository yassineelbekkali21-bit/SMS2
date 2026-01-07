'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  Users,
  VolumeX,
  Volume2,
  Globe,
  Lock,
  Crown,
  BookOpen,
  Settings,
  AlertCircle,
  Check
} from 'lucide-react';
import { StudyRoomType, StudyRoomVisibility, Course } from '@/types';

interface CreateStudyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomData: StudyRoomFormData) => void;
  userCourses: Course[];
  isAdmin?: boolean;
  // Props pour contexte Learning Track (pré-sélection)
  preSelectedCourseId?: string;
  preSelectedCourseName?: string;
  defaultTitlePrefix?: string;
  hideBackdrop?: boolean;
}

export interface StudyRoomFormData {
  title: string;
  courseId: string;
  courseName: string;
  type: StudyRoomType;
  visibility: StudyRoomVisibility;
  description?: string;
  startsAt?: Date;
  estimatedDuration: number; // en minutes
  isImmediate: boolean;
  isComplement?: boolean; // pour les admins
  enableRecording?: boolean; // pour les admins
}

export function CreateStudyRoomModal({
  isOpen,
  onClose,
  onCreateRoom,
  userCourses,
  isAdmin = false,
  preSelectedCourseId,
  preSelectedCourseName,
  defaultTitlePrefix,
  hideBackdrop = false
}: CreateStudyRoomModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudyRoomFormData>({
    title: '',
    courseId: '',
    courseName: '',
    type: 'interactive',
    visibility: 'public',
    description: '',
    estimatedDuration: 60,
    isImmediate: true,
    isComplement: false,
    enableRecording: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Détermine si le cours est pré-sélectionné (contexte Learning Track)
  const hasPreSelectedCourse = !!(preSelectedCourseId && preSelectedCourseName);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setCurrentStep(1);
      setFormData({
        title: defaultTitlePrefix ? `${defaultTitlePrefix} / ` : '',
        courseId: preSelectedCourseId || '',
        courseName: preSelectedCourseName || '',
        type: 'interactive',
        visibility: 'public',
        description: '',
        estimatedDuration: 60,
        isImmediate: true,
        isComplement: false,
        enableRecording: false
      });
      setErrors({});
    }
  }, [isOpen, preSelectedCourseId, preSelectedCourseName, defaultTitlePrefix]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Le titre est requis';
      } else if (formData.title.length < 3) {
        newErrors.title = 'Le titre doit contenir au moins 3 caractères';
      }

      // Skip courseId validation if pre-selected
      if (!hasPreSelectedCourse && !formData.courseId) {
        newErrors.courseId = 'Veuillez sélectionner un cours';
      }
    }

    if (step === 2) {
      if (formData.estimatedDuration < 15) {
        newErrors.estimatedDuration = 'La durée minimum est de 15 minutes';
      } else if (formData.estimatedDuration > 300) {
        newErrors.estimatedDuration = 'La durée maximum est de 5 heures';
      }

      if (!formData.isImmediate && formData.startsAt) {
        const now = new Date();
        if (formData.startsAt <= now) {
          newErrors.startsAt = 'La date doit être dans le futur';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onCreateRoom(formData);
      onClose();
    }
  };

  const handleCourseSelect = (courseId: string) => {
    const course = userCourses.find(c => c.id === courseId);
    setFormData(prev => ({
      ...prev,
      courseId,
      courseName: course?.title || ''
    }));
  };

  const getTypeIcon = (type: StudyRoomType) => {
    return type === 'silent' ? <VolumeX size={20} /> : <Volume2 size={20} />;
  };

  const getVisibilityIcon = (visibility: StudyRoomVisibility) => {
    switch (visibility) {
      case 'public': return <Globe size={20} />;
      case 'buddies': return <Users size={20} />;
      case 'private': return <Lock size={20} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-[110] p-2 md:p-4 ${hideBackdrop ? 'bg-black/20' : 'bg-black/50'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isAdmin ? 'Créer une Study Room' : 'Nouvelle Study Room'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentStep === 1 ? 'Informations de base' :
                 currentStep === 2 ? 'Configuration avancée' :
                 'Récapitulatif et confirmation'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Titre de la Study Room <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={hasPreSelectedCourse ? `${preSelectedCourseName} / Votre titre...` : "Ex: Session focus - Calculs de champ"}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Cours associé - Masqué si pré-sélectionné */}
                {!hasPreSelectedCourse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cours associé <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={(e) => handleCourseSelect(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.courseId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionner un cours</option>
                      {userCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    {errors.courseId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.courseId}
                      </p>
                    )}
                  </div>
                )}


                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Type de Study Room
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, type: 'silent' }))}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        formData.type === 'silent'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          formData.type === 'silent' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <VolumeX size={20} />
                        </div>
                        <span className="font-medium">Silencieuse</span>
                      </div>
                      <p className="text-sm text-gray-600 text-left">
                        Ambiance bibliothèque, micros coupés
                      </p>
                    </button>

                    <button
                      onClick={() => setFormData(prev => ({ ...prev, type: 'interactive' }))}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        formData.type === 'interactive'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          formData.type === 'interactive' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Volume2 size={20} />
                        </div>
                        <span className="font-medium">Interactive</span>
                      </div>
                      <p className="text-sm text-gray-600 text-left">
                        Discussion ouverte et échange
                      </p>
                    </button>
                  </div>
                </div>

                {/* Visibilité */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Visibilité
                  </label>
                  <div className="space-y-2">
                    {(['public', 'buddies', 'private'] as StudyRoomVisibility[]).map((visibility) => (
                      <button
                        key={visibility}
                        onClick={() => setFormData(prev => ({ ...prev, visibility }))}
                        className={`w-full p-3 border rounded-lg transition-all text-left ${
                          formData.visibility === visibility
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded ${
                            formData.visibility === visibility ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {getVisibilityIcon(visibility)}
                          </div>
                          <div>
                            <div className="font-medium">
                              {visibility === 'public' ? 'Publique' :
                               visibility === 'buddies' ? 'Buddies uniquement' :
                               'Privée'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {visibility === 'public' ? 'Tous les étudiants du cours' :
                               visibility === 'buddies' ? 'Uniquement vos amis proches' :
                               'Invitation manuelle uniquement'}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options admin */}
                {isAdmin && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <h4 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
                      <Crown size={16} />
                      Options administrateur
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isComplement}
                          onChange={(e) => setFormData(prev => ({ ...prev, isComplement: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Study Room "Compléments"</div>
                          <div className="text-sm text-gray-600">Session spéciale avec notification à tous les étudiants</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.enableRecording}
                          onChange={(e) => setFormData(prev => ({ ...prev, enableRecording: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Enregistrer la session</div>
                          <div className="text-sm text-gray-600">Le replay sera ajouté au cours</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez l'objectif de cette session..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Moment de création */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Quand créer la Study Room ?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isImmediate}
                        onChange={() => setFormData(prev => ({ ...prev, isImmediate: true }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium">Maintenant</div>
                        <div className="text-sm text-gray-600">La Study Room sera créée immédiatement</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.isImmediate}
                        onChange={() => setFormData(prev => ({ ...prev, isImmediate: false }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium">Programmer</div>
                        <div className="text-sm text-gray-600">Définir une date et heure de début</div>
                      </div>
                    </label>
                  </div>

                  {!formData.isImmediate && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                              const date = new Date(e.target.value);
                              setFormData(prev => ({ ...prev, startsAt: date }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                          <input
                            type="time"
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const date = formData.startsAt || new Date();
                              date.setHours(parseInt(hours), parseInt(minutes));
                              setFormData(prev => ({ ...prev, startsAt: date }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      {errors.startsAt && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.startsAt}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Durée estimée */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Durée estimée
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="15"
                      max="300"
                      step="15"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <div className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                      {Math.floor(formData.estimatedDuration / 60)}h {formData.estimatedDuration % 60}min
                    </div>
                  </div>
                  {errors.estimatedDuration && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.estimatedDuration}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Récapitulatif</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Titre :</span>
                      <span className="font-medium">{formData.title}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cours :</span>
                      <span className="font-medium">{formData.courseName}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type :</span>
                      <span className="flex items-center gap-2">
                        {getTypeIcon(formData.type)}
                        {formData.type === 'silent' ? 'Silencieuse' : 'Interactive'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visibilité :</span>
                      <span className="flex items-center gap-2">
                        {getVisibilityIcon(formData.visibility)}
                        {formData.visibility === 'public' ? 'Publique' :
                         formData.visibility === 'buddies' ? 'Buddies' : 'Privée'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée :</span>
                      <span className="font-medium">
                        {Math.floor(formData.estimatedDuration / 60)}h {formData.estimatedDuration % 60}min
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Début :</span>
                      <span className="font-medium">
                        {formData.isImmediate ? 'Immédiatement' : 
                         formData.startsAt?.toLocaleString('fr-FR') || 'Non défini'}
                      </span>
                    </div>

                    {formData.isComplement && (
                      <div className="bg-orange-100 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-orange-800">
                          <Crown size={16} />
                          <span className="font-medium">Study Room "Compléments"</span>
                        </div>
                        <p className="text-sm text-orange-700 mt-1">
                          Tous les étudiants du cours seront notifiés
                        </p>
                      </div>
                    )}

                    {formData.enableRecording && (
                      <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Settings size={16} />
                          <span className="font-medium">Enregistrement activé</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          Le replay sera ajouté au cours après la session
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-medium text-blue-900">Rappel important</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        En tant que créateur, vous serez automatiquement modérateur de cette Study Room. 
                        Vous pourrez gérer les participants et définir les règles de la session.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Précédent
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Annuler
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Créer la Study Room
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

