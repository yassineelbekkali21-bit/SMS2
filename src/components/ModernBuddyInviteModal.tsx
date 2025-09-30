'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Users,
  UserPlus,
  BookOpen,
  TrendingUp,
  Star,
  MessageCircle,
  Phone,
  ExternalLink,
  Crown,
  Award,
  Zap,
  Heart,
  GraduationCap,
  Activity
} from 'lucide-react';
import { BuddyRelation, Course } from '@/types';
import { BuddiesService } from '@/lib/buddies-service';

interface BuddySearchResult {
  id: string;
  name: string;
  email?: string;
  faculty: string;
  avatar?: string;
  commonCourses: Course[];
  progressionPercentile?: number;
  isActive: boolean;
  lastSeen?: Date;
  mutualBuddies: number;
  badges: string[];
}

interface BuddySuggestion extends BuddySearchResult {
  suggestionReason: 'same_faculty' | 'common_courses' | 'mutual_buddies' | 'high_activity';
}

interface ModernBuddyInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userCourses: Course[];
  onBuddyAdded?: (buddy: BuddyRelation | string) => void;
}

export function ModernBuddyInviteModal({
  isOpen,
  onClose,
  userId,
  userName,
  userCourses,
  onBuddyAdded
}: ModernBuddyInviteModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BuddySearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<BuddySuggestion[]>([]);
  const [showExternalInvite, setShowExternalInvite] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [addingBuddies, setAddingBuddies] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus sur la barre de recherche quand le modal s'ouvre
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      
      // Charger les suggestions par défaut
      loadSuggestions();
    }
  }, [isOpen]);

  useEffect(() => {
    // Recherche en temps réel avec debounce
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadSuggestions = () => {
    // Générer des suggestions intelligentes
    const mockSuggestions: BuddySuggestion[] = [
      {
        id: 'user_sophie',
        name: 'Sophie Laurent',
        email: 'sophie.laurent@univ.fr',
        faculty: 'Sciences',
        commonCourses: [userCourses[0] || { id: 'course1', title: 'Thermodynamique', description: '', difficulty: 'intermediate', lessons: [], instructor: '', duration: 0, price: 0 }],
        progressionPercentile: 85,
        isActive: true,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        mutualBuddies: 2,
        badges: ['Top 10%', 'Active'],
        suggestionReason: 'same_faculty'
      },
      {
        id: 'user_thomas',
        name: 'Thomas Moreau',
        email: 'thomas.moreau@univ.fr',
        faculty: 'Sciences',
        commonCourses: userCourses.slice(0, 2),
        progressionPercentile: 92,
        isActive: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        mutualBuddies: 1,
        badges: ['Expert', '3 cours en commun'],
        suggestionReason: 'common_courses'
      },
      {
        id: 'user_camille',
        name: 'Camille Dubois',
        email: 'camille.dubois@univ.fr',
        faculty: 'Mathématiques',
        commonCourses: [],
        progressionPercentile: 78,
        isActive: true,
        lastSeen: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
        mutualBuddies: 3,
        badges: ['3 amis en commun', 'Active'],
        suggestionReason: 'mutual_buddies'
      },
      {
        id: 'user_alex',
        name: 'Alex Martin',
        email: 'alex.martin@univ.fr',
        faculty: 'Physique',
        commonCourses: [userCourses[1] || { id: 'course2', title: 'Mécanique', description: '', difficulty: 'intermediate', lessons: [], instructor: '', duration: 0, price: 0 }],
        progressionPercentile: 95,
        isActive: true,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        mutualBuddies: 0,
        badges: ['Top 5%', 'Très actif'],
        suggestionReason: 'high_activity'
      }
    ];

    setSuggestions(mockSuggestions);
  };

  const performSearch = async (query: string) => {
    setIsSearching(true);

    // Simuler une recherche avec délai réaliste
    await new Promise(resolve => setTimeout(resolve, 200));

    const mockResults: BuddySearchResult[] = [
      {
        id: 'user_marie',
        name: 'Marie Dubois',
        email: 'marie.dubois@univ.fr',
        faculty: 'Sciences',
        commonCourses: userCourses.slice(0, 2),
        progressionPercentile: 88,
        isActive: true,
        lastSeen: new Date(Date.now() - 15 * 60 * 1000),
        mutualBuddies: 1,
        badges: ['2 cours en commun', 'Active']
      },
      {
        id: 'user_pierre',
        name: 'Pierre Martin',
        email: 'pierre.martin@univ.fr',
        faculty: 'Sciences',
        commonCourses: [userCourses[0] || { id: 'course1', title: 'Physique', description: '', difficulty: 'intermediate', lessons: [], instructor: '', duration: 0, price: 0 }],
        progressionPercentile: 72,
        isActive: false,
        lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000),
        mutualBuddies: 0,
        badges: ['1 cours en commun']
      }
    ].filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleAddBuddy = async (buddy: BuddySearchResult) => {
    console.log('🎯 handleAddBuddy appelé avec:', buddy);
    setAddingBuddies(prev => new Set(prev).add(buddy.id));

    try {
      // Simuler l'ajout avec un délai
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(`✅ Demande de Buddy envoyée à ${buddy.name}`);
      console.log('📤 Envoi de l\'ID via callback:', buddy.id);
      
      // Envoyer directement l'ID pour déclencher notre système direct
      if (onBuddyAdded) {
        onBuddyAdded(buddy.id);
        console.log('✅ Callback onBuddyAdded exécuté');
      } else {
        console.log('❌ Pas de callback onBuddyAdded');
      }

      // Retirer de la liste des suggestions
      setSuggestions(prev => prev.filter(s => s.id !== buddy.id));
      setSearchResults(prev => prev.filter(s => s.id !== buddy.id));

    } catch (error) {
      console.error('Erreur lors de l\'ajout du buddy:', error);
    } finally {
      setAddingBuddies(prev => {
        const newSet = new Set(prev);
        newSet.delete(buddy.id);
        return newSet;
      });
    }
  };

  const handleExternalInvite = () => {
    if (!phoneNumber.trim()) return;

    // Générer un lien d'invitation unique
    const inviteLink = `https://sms.app/invite/${userId}_${Date.now()}`;
    
    console.log('📱 Invitation externe générée:');
    console.log(`Téléphone: ${phoneNumber}`);
    console.log(`Lien: ${inviteLink}`);
    console.log(`Message: ${userName} t'invite à rejoindre Science Made Simple ! Clique ici: ${inviteLink}`);
    
    // Reset et fermer
    setPhoneNumber('');
    setShowExternalInvite(false);
    
    // Dans un vrai système, on enverrait le SMS ici
    alert(`Invitation envoyée à ${phoneNumber} ! 📱`);
  };

  const getAvatarDisplay = (buddy: BuddySearchResult) => {
    if (buddy.avatar) {
      return <img src={buddy.avatar} alt={buddy.name} className="w-full h-full object-cover" />;
    }
    
    const initials = buddy.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-orange-500', 'bg-teal-500', 'bg-red-500'
    ];
    const colorIndex = buddy.id.charCodeAt(0) % colors.length;
    
    return (
      <div className={`w-full h-full ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-lg`}>
        {initials}
      </div>
    );
  };

  const getBadgeIcon = (badge: string) => {
    if (badge.includes('Top') || badge.includes('%')) return <TrendingUp size={12} />;
    if (badge.includes('Active') || badge.includes('actif')) return <Activity size={12} />;
    if (badge.includes('cours')) return <BookOpen size={12} />;
    if (badge.includes('amis')) return <Users size={12} />;
    if (badge.includes('Expert')) return <Crown size={12} />;
    return <Star size={12} />;
  };

  const getSuggestionReasonLabel = (reason: BuddySuggestion['suggestionReason']) => {
    switch (reason) {
      case 'same_faculty': return 'Même faculté';
      case 'common_courses': return 'Cours en commun';
      case 'mutual_buddies': return 'Amis en commun';
      case 'high_activity': return 'Très actif';
    }
  };

  const getSuggestionReasonIcon = (reason: BuddySuggestion['suggestionReason']) => {
    switch (reason) {
      case 'same_faculty': return <GraduationCap size={14} className="text-blue-500" />;
      case 'common_courses': return <BookOpen size={14} className="text-green-500" />;
      case 'mutual_buddies': return <Users size={14} className="text-purple-500" />;
      case 'high_activity': return <Zap size={14} className="text-orange-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="text-blue-600" size={24} />
                Ajouter un Buddy
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Constitue ton réseau social académique
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher par nom, email ou pseudo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Résultats de recherche */}
          {searchQuery && (
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Search size={16} />
                Résultats de recherche
                {searchResults.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {searchResults.length}
                  </span>
                )}
              </h3>

              {searchResults.length === 0 && !isSearching ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Aucun résultat pour "{searchQuery}"</p>
                  <p className="text-sm text-gray-500 mt-1">Essaie avec un autre nom ou email</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((buddy) => (
                    <motion.div
                      key={buddy.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        {getAvatarDisplay(buddy)}
                      </div>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">{buddy.name}</h4>
                          {buddy.isActive && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{buddy.faculty}</p>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-1">
                          {buddy.badges.map((badge, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {getBadgeIcon(badge)}
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => handleAddBuddy(buddy)}
                        disabled={addingBuddies.has(buddy.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingBuddies.has(buddy.id) ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Heart size={16} />
                        )}
                        <span className="font-medium">Ajouter</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          <div className="p-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Star className="text-yellow-500" size={16} />
              Suggestions de Buddies
            </h3>

            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {getAvatarDisplay(suggestion)}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{suggestion.name}</h4>
                      {suggestion.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        {getSuggestionReasonIcon(suggestion.suggestionReason)}
                        {getSuggestionReasonLabel(suggestion.suggestionReason)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      Faculté : {suggestion.faculty}
                      {suggestion.progressionPercentile && (
                        <span className="ml-2 text-green-600">
                          | Top {100 - suggestion.progressionPercentile}% progression
                        </span>
                      )}
                    </p>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1">
                      {suggestion.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {getBadgeIcon(badge)}
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleAddBuddy(suggestion)}
                    disabled={addingBuddies.has(suggestion.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingBuddies.has(suggestion.id) ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Heart size={16} />
                    )}
                    <span className="font-medium">Ajouter</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Invitation externe */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          {!showExternalInvite ? (
            <button
              onClick={() => setShowExternalInvite(true)}
              className="w-full flex items-center justify-center gap-3 p-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <div className="p-2 bg-gray-200 group-hover:bg-gray-300 rounded-lg transition-colors">
                <ExternalLink size={16} />
              </div>
              <div className="text-left">
                <div className="font-medium">Inviter un ami externe</div>
                <div className="text-sm text-gray-500">Ta pote n'est pas encore sur la plateforme ?</div>
              </div>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} />
                <span className="font-medium">Invitation par SMS/WhatsApp</span>
              </div>
              
              <div className="flex gap-3">
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleExternalInvite}
                  disabled={!phoneNumber.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Envoyer
                </button>
              </div>
              
              <p className="text-xs text-gray-500">
                Ton ami recevra une invitation pour te rejoindre sur Science Made Simple. 
                Il devra créer un compte pour accepter.
              </p>
              
              <button
                onClick={() => setShowExternalInvite(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Annuler
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}


