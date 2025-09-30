'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Award,
  BookOpen,
  Clock,
  Target,
  Camera,
  Check,
  AlertCircle
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

  // Initialiser le profil au chargement
  useEffect(() => {
    const loadedProfile = StudentProfileService.initializeProfile();
    setProfile(loadedProfile);
    setEditedProfile(loadedProfile);
  }, []);

  // Auto-hide notification après 5 secondes
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
    
    // Simulation de la sauvegarde avec délai
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sauvegarder avec le service
    const success = StudentProfileService.saveProfile(editedProfile);
    
    if (success) {
      setProfile(editedProfile);
      setIsEditing(false);
      setNotification({
        type: 'success',
        message: 'Profil sauvegardé avec succès !'
      });
      console.log('✅ Profil sauvegardé avec succès');
    } else {
      setNotification({
        type: 'error',
        message: 'Erreur lors de la sauvegarde du profil'
      });
      console.error('❌ Erreur lors de la sauvegarde du profil');
    }
    
    setIsSaving(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof StudentProfile] as any,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
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
                <p className="text-gray-600">Gérer mes informations personnelles</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 size={16} />
                Modifier
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne gauche - Avatar et stats */}
          <div className="space-y-6">
            {/* Avatar et infos de base */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <Camera size={14} />
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 mb-2">{profile.academic.program}</p>
                <p className="text-sm text-gray-500">{profile.academic.faculty}</p>
                
                {/* Statut de vérification */}
                <div className="mt-4">
                  <IdentityStatusBadge />
                </div>
              </div>
            </div>

            {/* Statistiques académiques */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="text-purple-600" size={20} />
                Statistiques
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-600" />
                    <span className="text-sm text-gray-600">Cours complétés</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.coursesCompleted}/{stats.totalCourses}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-green-600" />
                    <span className="text-sm text-gray-600">Moyenne</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.averageGrade}/20</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-orange-600" />
                    <span className="text-sm text-gray-600">Heures d'étude</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.studyHours}h</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-purple-600" />
                    <span className="text-sm text-gray-600">Cours favoris</span>
                  </div>
                  <span className="font-semibold text-gray-900">{favorites.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informations personnelles */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="text-blue-600" size={20} />
                Informations personnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de famille
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.lastName}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={14} />
                    Adresse email
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      Non modifiable
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Shield size={16} className="text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    L'adresse email est unique et ne peut pas être modifiée pour des raisons de sécurité.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedProfile.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">
                      {new Date(profile.dateOfBirth).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-green-600" size={20} />
                Adresse
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rue et numéro
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.address.street}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.address.city}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.address.postalCode}
                      onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.address.postalCode}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.address.country}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Belgique">Belgique</option>
                      <option value="France">France</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Pays-Bas">Pays-Bas</option>
                      <option value="Allemagne">Allemagne</option>
                    </select>
                  ) : (
                    <p className="py-2 text-gray-900">{profile.address.country}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informations académiques */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap className="text-purple-600" size={20} />
                Informations académiques
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Université
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.academic.university}
                      onChange={(e) => handleInputChange('academic.university', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.academic.university}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faculté
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.academic.faculty}
                      onChange={(e) => handleInputChange('academic.faculty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.academic.faculty}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année d'étude
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.academic.year}
                      onChange={(e) => handleInputChange('academic.year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>1ère année</option>
                      <option value={2}>2ème année</option>
                      <option value={3}>3ème année</option>
                      <option value={4}>4ème année</option>
                      <option value={5}>5ème année</option>
                    </select>
                  ) : (
                    <p className="py-2 text-gray-900">{profile.academic.year}ère année</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Programme
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.academic.program}
                      onChange={(e) => handleInputChange('academic.program', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.academic.program}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro étudiant
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profile.academic.studentId}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Shield size={16} className="text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Le numéro étudiant ne peut pas être modifié.
                  </p>
                </div>
              </div>
            </div>

            {/* Informations de compte */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="text-indigo-600" size={20} />
                Informations de compte
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membre depuis
                  </label>
                  <p className="py-2 text-gray-900">
                    {profile.createdAt.toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dernière connexion
                  </label>
                  <p className="py-2 text-gray-900">
                    {profile.lastLogin.toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
