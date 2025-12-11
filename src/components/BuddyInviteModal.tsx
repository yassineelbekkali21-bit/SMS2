'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, Trophy, Mail, Phone, Copy, Check, Globe, UserPlus, MessageCircle, Search
} from 'lucide-react';
import { BuddyType } from '@/types';
import { UserAvatar } from './UserAvatar';
import { InviteQRCode } from './InviteQRCode';

interface BuddyInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

// Mock data des utilisateurs de la plateforme
const mockPlatformUsers = [
  { id: 'user-1', name: 'Sophie Martin', faculty: 'Polytechnique', level: 12, isOnPlatform: true },
  { id: 'user-2', name: 'Thomas Bernard', faculty: 'ENS', level: 18, isOnPlatform: true },
  { id: 'user-3', name: 'Emma Laurent', faculty: 'Sorbonne', level: 10, isOnPlatform: true },
  { id: 'user-4', name: 'Lucas Mercier', faculty: 'Polytechnique', level: 15, isOnPlatform: true },
  { id: 'user-5', name: 'Léa Moreau', faculty: 'Paris-Dauphine', level: 9, isOnPlatform: true },
  { id: 'user-6', name: 'Marie Dubois', faculty: 'Sciences Po', level: 8, isOnPlatform: true },
  { id: 'user-7', name: 'Alexandre Durand', faculty: 'HEC', level: 14, isOnPlatform: true },
  { id: 'user-8', name: 'Camille Rousseau', faculty: 'Centrale', level: 11, isOnPlatform: true },
  { id: 'user-9', name: 'Julien Petit', faculty: 'Polytechnique', level: 16, isOnPlatform: true },
  { id: 'user-10', name: 'Chloé Leroy', faculty: 'Sorbonne', level: 13, isOnPlatform: true },
  { id: 'user-11', name: 'Antoine Girard', faculty: 'ENS', level: 17, isOnPlatform: true },
  { id: 'user-12', name: 'Laura Fabre', faculty: 'Centrale', level: 12, isOnPlatform: true },
  { id: 'user-13', name: 'Maxime Bonnet', faculty: 'Paris-Dauphine', level: 10, isOnPlatform: true },
  { id: 'user-14', name: 'Sarah Cohen', faculty: 'Sciences Po', level: 14, isOnPlatform: true },
  { id: 'user-15', name: 'Nicolas Blanc', faculty: 'HEC', level: 15, isOnPlatform: true },
  { id: 'user-16', name: 'Manon Roux', faculty: 'Polytechnique', level: 11, isOnPlatform: true },
  { id: 'user-17', name: 'Hugo Lambert', faculty: 'Sorbonne', level: 13, isOnPlatform: true },
  { id: 'user-18', name: 'Anaïs Fontaine', faculty: 'ENS', level: 19, isOnPlatform: true },
  { id: 'user-19', name: 'Pierre Morel', faculty: 'Centrale', level: 12, isOnPlatform: true },
  { id: 'user-20', name: 'Océane Garnier', faculty: 'Paris-Dauphine', level: 10, isOnPlatform: true },
];

export function BuddyInviteModal({ isOpen, onClose, userId }: BuddyInviteModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockPlatformUsers[0] | null>(null);
  const [isExternalInvite, setIsExternalInvite] = useState(false);
  const [selectedRole, setSelectedRole] = useState<BuddyType>('buddy');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('Hey! 👋 Rejoins-moi sur Science Made Simple pour étudier ensemble!');
  const [copiedLink, setCopiedLink] = useState(false);

  const inviteLink = `https://sciencemadesimple.com/invite/${userId}`;

  // Filtrer les utilisateurs selon la recherche
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return mockPlatformUsers.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.faculty.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmit = () => {
    if (selectedUser) {
      console.log('Invitation envoyée à utilisateur plateforme:', { user: selectedUser, role: selectedRole });
      alert(`Invitation ${selectedRole} envoyée à ${selectedUser.name} !`);
    } else {
      console.log('Invitation externe envoyée:', { role: selectedRole, email, phone, message });
      alert(`Invitation externe envoyée en tant que ${selectedRole === 'buddy' ? 'Buddy' : 'Tuteur'}`);
    }
    
    // Reset form
    setCurrentStep(1);
    setSearchQuery('');
    setSelectedUser(null);
    setIsExternalInvite(false);
    setEmail('');
    setPhone('');
    setMessage('Hey! 👋 Rejoins-moi sur Science Made Simple pour étudier ensemble!');
    setSelectedRole('buddy');
    onClose();
  };

  const handleUserSelect = (user: typeof mockPlatformUsers[0]) => {
    setSelectedUser(user);
    setIsExternalInvite(false);
    setCurrentStep(2);
  };

  const handleExternalInvite = () => {
    setSelectedUser(null);
    setIsExternalInvite(true);
    setCurrentStep(2);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Inviter une personne</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentStep === 1 && 'Rechercher un utilisateur'}
                    {currentStep === 2 && (selectedUser ? 'Choisir le rôle et confirmer' : 'Choisir le rôle')}
                    {currentStep === 3 && 'Informations de contact'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Steps */}
              <div className="flex items-center gap-4 mt-6">
                {(selectedUser ? [1, 2] : [1, 2, 3]).map((step) => (
                  <div
                    key={step}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                      currentStep === step
                        ? 'bg-gray-900 text-white'
                        : currentStep > step
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Step 1: Recherche */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* Barre de recherche */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher par nom ou faculté..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      autoFocus
                    />
                  </div>

                  {/* Résultats de recherche */}
                  {searchQuery && (
                    <div className="space-y-2">
                      {filteredUsers.length > 0 ? (
                        <>
                          <p className="text-sm font-medium text-gray-700">{filteredUsers.length} résultat(s) trouvé(s)</p>
                          <div className="max-h-64 overflow-y-auto space-y-2">
                            {filteredUsers.map((user) => (
                              <motion.button
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => handleUserSelect(user)}
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-4 text-left"
                              >
                                <UserAvatar name={user.name} size="lg" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{user.name}</h4>
                                  <p className="text-sm text-gray-600">{user.faculty}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs font-medium text-gray-500 mb-1">Niveau {user.level}</div>
                                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                    Sur la plateforme
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 text-center">
                          <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-2">Aucun utilisateur trouvé</p>
                          <p className="text-xs text-gray-500 mb-4">Cette personne n'est pas encore sur la plateforme</p>
                          <button
                            onClick={handleExternalInvite}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Inviter "{searchQuery}" par email/téléphone
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message d'aide */}
                  {!searchQuery && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-gray-700">
                        🔍 Commence à taper pour rechercher un utilisateur déjà inscrit sur Science Made Simple
                      </p>
                    </div>
                  )}

                  {/* Bouton invitation externe */}
                  {!searchQuery && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={handleExternalInvite}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-700 font-medium"
                      >
                        <Mail className="w-5 h-5" />
                        Inviter une personne externe (email/téléphone)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Choix du rôle + Confirmation pour utilisateurs plateforme */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Si utilisateur plateforme sélectionné, afficher son profil */}
                  {selectedUser && (
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-4 mb-4">
                        <UserAvatar name={selectedUser.name} size="xl" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                          <p className="text-sm text-gray-600">{selectedUser.faculty} • Niveau {selectedUser.level}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Rôle sur la plateforme <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedRole('buddy')}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          selectedRole === 'buddy'
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <Users size={28} className={`mb-3 ${selectedRole === 'buddy' ? 'text-gray-900' : 'text-gray-600'}`} />
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Buddy</h3>
                        <p className="text-sm text-gray-600">Autre étudiant qui suit des cours</p>
                      </button>

                      <button
                        onClick={() => setSelectedRole('tutor')}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          selectedRole === 'tutor'
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <Trophy size={28} className={`mb-3 ${selectedRole === 'tutor' ? 'text-gray-900' : 'text-gray-600'}`} />
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Tuteur</h3>
                        <p className="text-sm text-gray-600">Accès suivi et progression</p>
                      </button>
                    </div>
                  </div>

                  {/* Description du rôle sélectionné */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-700">
                      {selectedRole === 'buddy' 
                        ? '👥 Un Buddy peut étudier avec vous, voir vos cours actifs et rejoindre vos Study Rooms.'
                        : '🎓 Un Tuteur aura accès à votre progression détaillée, vos statistiques et pourra suivre votre parcours d\'apprentissage.'}
                    </p>
                  </div>

                  {/* Message de confirmation pour utilisateur plateforme */}
                  {selectedUser && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <p className="text-sm text-green-800 flex items-center gap-2">
                        <Check size={16} />
                        Une notification sera envoyée à {selectedUser.name} sur la plateforme
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Formulaire externe uniquement */}
              {currentStep === 3 && !selectedUser && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      <Mail className="inline mr-2" size={16} />
                      Email (optionnel)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemple@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      <Phone className="inline mr-2" size={16} />
                      Téléphone WhatsApp (optionnel)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+32 XXX XX XX XX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Message d'invitation
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-700"
                      />
                      <button
                        onClick={copyInviteLink}
                        className="px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all flex items-center gap-2 font-medium shadow-lg shadow-gray-900/20"
                      >
                        {copiedLink ? <Check size={18} /> : <Copy size={18} />}
                        {copiedLink ? 'Copié!' : 'Copier'}
                      </button>
                    </div>
                  </div>

                  {/* Séparateur visuel */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">OU</span>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-gray-900 mb-4 text-center">
                      📱 Partage ce QR Code (pour scan direct)
                    </label>
                    <InviteQRCode
                      inviteUrl={inviteLink}
                      inviterName="Yassine"
                      size={180}
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600">
                      💡 Vous devez fournir au moins un moyen de contact (email ou téléphone)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-between z-10">
              <button
                onClick={() => {
                  if (currentStep === 1) {
                    onClose();
                  } else {
                    setCurrentStep(currentStep - 1);
                  }
                }}
                className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
              >
                {currentStep === 1 ? 'Annuler' : 'Précédent'}
              </button>

              <button
                onClick={() => {
                  // Si à l'étape 2 avec un utilisateur plateforme sélectionné, envoyer directement
                  if (currentStep === 2 && selectedUser) {
                    handleSubmit();
                  }
                  // Si à l'étape 2 avec invitation externe, passer à l'étape 3
                  else if (currentStep === 2 && isExternalInvite) {
                    setCurrentStep(3);
                  }
                  // Si à l'étape 3, envoyer l'invitation externe
                  else if (currentStep === 3) {
                    handleSubmit();
                  }
                  // Sinon, passer à l'étape suivante
                  else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                disabled={
                  (currentStep === 1 && !selectedUser && !isExternalInvite) ||
                  (currentStep === 3 && !email && !phone)
                }
                className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(currentStep === 2 && selectedUser) || currentStep === 3 
                  ? 'Envoyer l\'invitation' 
                  : 'Suivant'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

