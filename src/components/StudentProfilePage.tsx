'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Edit3, 
  Save, 
  X, 
  Shield, 
  Heart,
  BookOpen,
  Clock,
  Target,
  Camera,
  Check,
  ChevronRight
} from 'lucide-react';
import { IdentityStatusBadge } from './IdentityStatusBadge';
import { ProfileNotification } from './ProfileNotification';
import { useFavorites } from '@/hooks/useFavorites';
import { IdentityVerificationService } from '@/lib/identity-verification-service';
import { StudentProfileService, type StudentProfile } from '@/lib/student-profile-service';

export function StudentProfilePage() {
  const { favorites } = useFavorites();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>(StudentProfileService.getDefaultProfile());
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const [editedProfile, setEditedProfile] = useState<StudentProfile>(profile);

  useEffect(() => {
    const loadedProfile = StudentProfileService.initializeProfile();
    setProfile(loadedProfile);
    setEditedProfile(loadedProfile);
  }, []);

  useEffect(() => {
    if (notification.type) {
      const timer = setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.type]);

  const handleEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const success = StudentProfileService.saveProfile(editedProfile);
    
    if (success) {
      setProfile(editedProfile);
      setIsEditing(false);
      setNotification({
        type: 'success',
        message: 'Profil sauvegardé avec succès'
      });
    } else {
      setNotification({
        type: 'error',
        message: 'Erreur lors de la sauvegarde'
      });
    }
    setIsSaving(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof StudentProfile] as object,
          [child]: value
        }
      }));
    } else {
      setEditedProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const getAcademicStats = () => {
    const identityState = IdentityVerificationService.getState();
    return {
      coursesCompleted: 3,
      totalCourses: 12,
      averageGrade: 14.2,
      studyHours: 127,
      identityVerified: identityState.status === 'verified'
    };
  };

  const stats = getAcademicStats();
  
  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 10;
    
    if (profile.firstName) completed++;
    if (profile.lastName) completed++;
    if (profile.email) completed++;
    if (profile.phone) completed++;
    if (profile.dateOfBirth) completed++;
    if (profile.address?.city) completed++;
    if (profile.academic?.university) completed++;
    if (profile.academic?.faculty) completed++;
    if (profile.academic?.program) completed++;
    if (profile.academic?.year) completed++;
    
    return Math.round((completed / total) * 100);
  };
  
  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Ton profil est la base de ton parcours personnalisé sur SMS.
                </p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                <Edit3 size={16} />
                Modifier
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  <X size={16} />
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full px-6 lg:px-12 py-8">
        {/* Top Row: Identity Card + Activity Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Identity Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-start gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </div>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <Camera size={12} />
                  </button>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 mt-1">Étudiant en {profile.academic.program}</p>
                <p className="text-sm text-gray-500">{profile.academic.faculty}</p>
                
                {/* Profile Status Badge */}
                <div className="flex items-center gap-2 mt-3">
                  {profileCompletion === 100 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      <Check size={12} className="text-gray-600" />
                      Profil vérifié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Complété à {profileCompletion}%
                    </span>
                  )}
                  <IdentityStatusBadge />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Stats - Spans 2 columns on large screens */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Ton activité sur SMS
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">Heures d'étude</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.studyHours}h</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">Cours complétés</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}/{stats.totalCourses}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">Moyenne</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.averageGrade}/20</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={16} className="text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">Cours favoris</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              Ces données servent à ajuster ton rythme et tes recommandations.
            </p>
          </motion.div>
        </div>

        {/* Middle Row: Personal Info + Academic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Personal Information */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <User size={18} className="text-gray-500" />
              <h3 className="text-base font-semibold text-gray-900">Informations personnelles</h3>
            </div>
            
            <div className="space-y-5">
              {/* Identity Group */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Prénom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 font-medium">{profile.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 font-medium">{profile.lastName}</p>
                  )}
                </div>
              </div>
              
              {/* Contact Group */}
              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
                      <Mail size={12} />
                      Email
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">fixe</span>
                    </label>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
                      <Phone size={12} />
                      Téléphone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium">{profile.phone}</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">
                      Utilisé uniquement pour ton compte et les notifications importantes.
                    </p>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
                      <Calendar size={12} />
                      Date de naissance
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedProfile.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium">
                        {new Date(profile.dateOfBirth).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Address Group */}
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
                  <MapPin size={12} />
                  Adresse
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedProfile.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      placeholder="Rue et numéro"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editedProfile.address.postalCode}
                        onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                        placeholder="Code postal"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        value={editedProfile.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        placeholder="Ville"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-900 font-medium">
                    {profile.address.street}, {profile.address.postalCode} {profile.address.city}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Academic Information */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={18} className="text-gray-500" />
              <h3 className="text-base font-semibold text-gray-900">Informations académiques</h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Ces informations nous aident à te proposer des parcours et examens adaptés à ton niveau.
            </p>
            
            <div className="space-y-5">
              {/* Main Academic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Université</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.academic.university}
                      onChange={(e) => handleInputChange('academic.university', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 font-medium">{profile.academic.university}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Faculté</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.academic.faculty}
                        onChange={(e) => handleInputChange('academic.faculty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium">{profile.academic.faculty}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Année d'étude</label>
                    {isEditing ? (
                      <select
                        value={editedProfile.academic.year}
                        onChange={(e) => handleInputChange('academic.year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm bg-white"
                      >
                        <option value={1}>1ère année</option>
                        <option value={2}>2ème année</option>
                        <option value={3}>3ème année</option>
                        <option value={4}>4ème année</option>
                        <option value={5}>5ème année</option>
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900 font-medium">{profile.academic.year}ère année</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Programme</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.academic.program}
                      onChange={(e) => handleInputChange('academic.program', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 font-medium">{profile.academic.program}</p>
                  )}
                </div>
              </div>
              
              {/* Secondary Info - Visually demoted */}
              <div className="pt-4 border-t border-gray-100">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-1.5">
                    <Shield size={12} />
                    Numéro étudiant
                    <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">fixe</span>
                  </label>
                  <p className="text-sm text-gray-500">{profile.academic.studentId}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Account Info (Compact) + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Account Information - Compact */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-600">Compte</h3>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Membre depuis</span>
              <span className="text-gray-700 font-medium">
                {profile.createdAt.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </motion.div>

          {/* CTA Card */}
          {profileCompletion < 100 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Compléter mon profil</h3>
                  <p className="text-sm text-gray-400">
                    Plus ton profil est complet, plus ton parcours est précis.
                  </p>
                </div>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  Continuer
                  <ChevronRight size={16} />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span>Progression</span>
                  <span>{profileCompletion}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#48c6ed' }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Notification */}
      <ProfileNotification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: null, message: '' })}
      />
    </div>
  );
}
