'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Users, BookOpen, Building, MapPin,
  UserPlus, ExternalLink, Copy, Mail, MessageCircle, Share2, Check
} from 'lucide-react';

interface BuddySearchResult {
  id: string;
  name: string;
  avatar: string;
  faculty: string;
  university: string;
  courses: string[];
  xp: number;
  level: number;
  compatibility: number;
  isOnline: boolean;
}

interface EnhancedBuddySearchProps {
  onInvite: (userId: string) => void;
  onExternalInvite: () => void;
}

// Données mock pour démonstration
const MOCK_USERS: BuddySearchResult[] = [
  {
    id: 'user-1',
    name: 'Sophie Laurent',
    avatar: '👩‍🎓',
    faculty: 'Sciences',
    university: 'ULB Brussels',
    courses: ['Mathématiques', 'Physique', 'Chimie'],
    xp: 2450,
    level: 12,
    compatibility: 85,
    isOnline: true,
  },
  {
    id: 'user-2',
    name: 'Thomas Martin',
    avatar: '👨‍💼',
    faculty: 'Ingénierie',
    university: 'UCL Louvain',
    courses: ['Mécanique', 'Thermodynamique', 'Mathématiques'],
    xp: 3120,
    level: 15,
    compatibility: 78,
    isOnline: false,
  },
  {
    id: 'user-3',
    name: 'Emma Dubois',
    avatar: '👩‍🔬',
    faculty: 'Sciences',
    university: 'UGent',
    courses: ['Biologie', 'Chimie Organique', 'Génétique'],
    xp: 1890,
    level: 9,
    compatibility: 92,
    isOnline: true,
  },
  {
    id: 'user-4',
    name: 'Lucas Chen',
    avatar: '👨‍🎓',
    faculty: 'Médecine',
    university: 'KU Leuven',
    courses: ['Anatomie', 'Physiologie', 'Biochimie'],
    xp: 4200,
    level: 18,
    compatibility: 65,
    isOnline: true,
  },
  {
    id: 'user-5',
    name: 'Marie Rousseau',
    avatar: '👩',
    faculty: 'Sciences',
    university: 'ULB Brussels',
    courses: ['Mathématiques', 'Statistiques', 'Probabilités'],
    xp: 2780,
    level: 13,
    compatibility: 88,
    isOnline: false,
  },
];

export function EnhancedBuddySearch({ onInvite, onExternalInvite }: EnhancedBuddySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showExternalInvite, setShowExternalInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState('https://sciencemadesimple.com/invite/ABC123');
  const [inviteMessage, setInviteMessage] = useState(
    `Hey! 👋 Rejoins-moi sur Science Made Simple! C'est génial pour étudier ensemble. Utilise mon code: ABC123\n\n${inviteLink}`
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Extraction des facultés et cours uniques
  const faculties = useMemo(
    () => ['all', ...Array.from(new Set(MOCK_USERS.map(u => u.faculty)))],
    []
  );
  
  const courses = useMemo(
    () => ['all', ...Array.from(new Set(MOCK_USERS.flatMap(u => u.courses)))],
    []
  );

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.courses.some(course => course.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFaculty = selectedFaculty === 'all' || user.faculty === selectedFaculty;
      const matchesCourse = selectedCourse === 'all' || user.courses.includes(selectedCourse);
      
      return matchesSearch && matchesFaculty && matchesCourse;
    }).sort((a, b) => b.compatibility - a.compatibility);
  }, [searchQuery, selectedFaculty, selectedCourse]);

  const copyToClipboard = (text: string, type: 'link' | 'message') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche et actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Recherche par nom, faculté ou matière..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border-2 font-medium transition-all flex items-center gap-2 ${
              showFilters
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <Filter size={20} />
            Filtres
          </button>

          <button
            onClick={() => setShowExternalInvite(!showExternalInvite)}
            className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <ExternalLink size={20} />
            Inviter par lien
          </button>
        </div>

        {/* Filtres déroulants */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building size={16} className="inline mr-2" />
                Faculté
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {faculties.map(faculty => (
                  <option key={faculty} value={faculty}>
                    {faculty === 'all' ? 'Toutes les facultés' : faculty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen size={16} className="inline mr-2" />
                Matière
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {courses.map(course => (
                  <option key={course} value={course}>
                    {course === 'all' ? 'Toutes les matières' : course}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Invitation externe */}
        {showExternalInvite && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
          >
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Share2 className="text-green-600" size={20} />
              Inviter des amis externes
            </h4>
            
            {/* Lien d'invitation */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lien d'invitation</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
                />
                <button
                  onClick={() => copyToClipboard(inviteLink, 'link')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  {copiedLink ? <Check size={18} /> : <Copy size={18} />}
                  {copiedLink ? 'Copié !' : 'Copier'}
                </button>
              </div>
            </div>

            {/* Message prérempli */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message prérempli</label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Actions d'envoi */}
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(inviteMessage, 'message')}
                className="flex-1 px-4 py-2 bg-white border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {copiedMessage ? <Check size={18} /> : <Copy size={18} />}
                {copiedMessage ? 'Copié !' : 'Copier le message'}
              </button>
              
              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(inviteMessage)}`, '_blank')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <MessageCircle size={18} />
                WhatsApp
              </button>
              
              <button
                onClick={() => window.location.href = `mailto:?subject=Rejoins-moi sur Science Made Simple&body=${encodeURIComponent(inviteMessage)}`}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Mail size={18} />
                Email
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Résultats de recherche */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {filteredUsers.length} utilisateurs trouvés
          </h3>
          <span className="text-sm text-gray-500">
            Triés par compatibilité
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl">
                    {user.avatar}
                  </div>
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                  {/* Badge de compatibilité */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white">
                    {user.compatibility}%
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1">{user.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Building size={14} />
                    {user.faculty} • {user.university}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <BookOpen size={14} />
                    <span className="truncate">{user.courses.slice(0, 2).join(', ')}</span>
                    {user.courses.length > 2 && <span>+{user.courses.length - 2}</span>}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                      Niv. {user.level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onInvite(user.id)}
                className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <UserPlus size={18} />
                Envoyer une invitation
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}









