'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, Search, Filter, TrendingUp, Flame, Zap,
  BookOpen, MessageCircle, Trophy, ExternalLink, Copy, Mail,
  Phone, Check, Building, MapPin, Bell, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { BuddyType } from '@/types';
import { BuddyInviteModal } from './BuddyInviteModal';

interface UnifiedBuddiesTabProps {
  userId: string;
  userName: string;
}

export function UnifiedBuddiesTab({ userId, userName }: UnifiedBuddiesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<BuddyType | 'all'>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  // Mock data
  const mockBuddies = [
    {
      id: 'buddy-1',
      name: 'Sophie Laurent',
      avatar: '👩‍🎓',
      role: 'buddy' as BuddyType,
      faculty: 'Sciences',
      level: 12,
      xpToday: 350,
      streak: 7,
      isOnline: true,
      courses: [
        { name: 'Probabilités', progress: 75 },
        { name: 'Statistiques', progress: 45 }
      ]
    },
    {
      id: 'tutor-1',
      name: 'Marie Dubois',
      avatar: '👨‍🏫',
      role: 'tutor' as BuddyType,
      faculty: 'Tuteur',
      level: 18,
      xpToday: 0,
      streak: 0,
      isOnline: false,
      courses: []
    },
    {
      id: 'buddy-2',
      name: 'Alex Mercier',
      avatar: '👨‍💻',
      role: 'buddy' as BuddyType,
      faculty: 'Ingénierie',
      level: 15,
      xpToday: 420,
      streak: 12,
      isOnline: true,
      courses: [
        { name: 'Analyse', progress: 60 },
        { name: 'Algèbre', progress: 80 }
      ]
    },
    {
      id: 'buddy-3',
      name: 'Emma Martin',
      avatar: '👩‍🔬',
      role: 'buddy' as BuddyType,
      faculty: 'Médecine',
      level: 10,
      xpToday: 280,
      streak: 5,
      isOnline: false,
      courses: [
        { name: 'Anatomie', progress: 55 },
        { name: 'Physiologie', progress: 40 }
      ]
    },
    {
      id: 'buddy-4',
      name: 'Lucas Dubois',
      avatar: '👨‍🎓',
      role: 'buddy' as BuddyType,
      faculty: 'Économie',
      level: 14,
      xpToday: 310,
      streak: 9,
      isOnline: true,
      courses: [
        { name: 'Microéconomie', progress: 70 },
        { name: 'Macroéconomie', progress: 65 }
      ]
    },
    {
      id: 'buddy-5',
      name: 'Chloé Bernard',
      avatar: '👩‍💼',
      role: 'buddy' as BuddyType,
      faculty: 'Sciences',
      level: 11,
      xpToday: 290,
      streak: 4,
      isOnline: true,
      courses: [
        { name: 'Chimie organique', progress: 50 },
        { name: 'Biologie', progress: 58 }
      ]
    },
    {
      id: 'buddy-6',
      name: 'Thomas Petit',
      avatar: '👨‍🔧',
      role: 'buddy' as BuddyType,
      faculty: 'Ingénierie',
      level: 16,
      xpToday: 390,
      streak: 14,
      isOnline: false,
      courses: [
        { name: 'Mécanique', progress: 85 },
        { name: 'Thermodynamique', progress: 72 }
      ]
    },
    {
      id: 'tutor-2',
      name: 'Dr. Jean Dupont',
      avatar: '👨‍⚕️',
      role: 'tutor' as BuddyType,
      faculty: 'Tuteur',
      level: 22,
      xpToday: 0,
      streak: 0,
      isOnline: true,
      courses: []
    }
  ];

  const mockAvailablePeople = [
    {
      id: 'available-1',
      name: 'Julie Leroy',
      avatar: '👩‍🎨',
      role: 'buddy' as BuddyType,
      faculty: 'Sciences',
      level: 13,
      isOnline: true
    },
    {
      id: 'available-2',
      name: 'Marc Fontaine',
      avatar: '👨‍🚀',
      role: 'buddy' as BuddyType,
      faculty: 'Ingénierie',
      level: 17,
      isOnline: false
    },
    {
      id: 'available-3',
      name: 'Léa Moreau',
      avatar: '👩‍⚖️',
      role: 'buddy' as BuddyType,
      faculty: 'Droit',
      level: 9,
      isOnline: true
    },
    {
      id: 'available-4',
      name: 'Antoine Rousseau',
      avatar: '👨‍🎤',
      role: 'buddy' as BuddyType,
      faculty: 'Économie',
      level: 12,
      isOnline: true
    },
    {
      id: 'available-5',
      name: 'Camille Girard',
      avatar: '👩‍🏫',
      role: 'buddy' as BuddyType,
      faculty: 'Sciences',
      level: 14,
      isOnline: false
    },
    {
      id: 'available-6',
      name: 'Nicolas Lambert',
      avatar: '👨‍🔬',
      role: 'buddy' as BuddyType,
      faculty: 'Médecine',
      level: 11,
      isOnline: true
    },
    {
      id: 'available-7',
      name: 'Sarah Cohen',
      avatar: '👩‍💻',
      role: 'buddy' as BuddyType,
      faculty: 'Ingénierie',
      level: 18,
      isOnline: true
    },
    {
      id: 'available-8',
      name: 'Prof. Claire Martin',
      avatar: '👩‍🏫',
      role: 'tutor' as BuddyType,
      faculty: 'Tuteur',
      level: 25,
      isOnline: false
    }
  ];

  const mockPendingRequestsInitial = [
    {
      id: 'req-1',
      name: 'Lucas Martin',
      role: 'buddy' as BuddyType,
      avatar: '👨‍💼',
      faculty: 'Ingénierie'
    }
  ];

  const mockNotifications = [
    {
      id: 'notif-1',
      buddyName: 'Sophie',
      message: 'Sophie a complété 75% du pack Probabilités',
      icon: '📚',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 'notif-2',
      buddyName: 'Zak',
      message: 'Zak a créé une Study Room sur ton pack actuel',
      icon: '🎥',
      timestamp: new Date(Date.now() - 7200000)
    }
  ];

  const faculties = ['all', 'Sciences', 'Ingénierie', 'Médecine', 'Économie', 'Droit'];

  const filteredBuddies = mockBuddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = selectedFaculty === 'all' || buddy.faculty === selectedFaculty;
    const matchesRole = selectedRole === 'all' || buddy.role === selectedRole;
    return matchesSearch && matchesFaculty && matchesRole;
  });

  const alreadyConnectedIds = mockBuddies.map(b => b.id);
  const pendingRequestIds = [...mockPendingRequestsInitial, ...pendingRequests].map(r => r.id);
  
  const filteredAvailablePeople = mockAvailablePeople.filter(person => {
    if (alreadyConnectedIds.includes(person.id) || pendingRequestIds.includes(person.id)) {
      return false;
    }
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = selectedFaculty === 'all' || person.faculty === selectedFaculty;
    const matchesRole = selectedRole === 'all' || person.role === selectedRole;
    return matchesSearch && matchesFaculty && matchesRole;
  });

  const showAvailablePeople = searchQuery.length > 0 && filteredAvailablePeople.length > 0;

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `Il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  const handleSendInvitation = (person: any) => {
    setPendingRequests([...pendingRequests, person]);
    console.log('Invitation envoyée à:', person.name);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 1. Recherche et filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom sur la plateforme..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <UserPlus size={18} />
              <span>Inviter un externe</span>
            </button>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {faculties.map(fac => (
                <option key={fac} value={fac}>
                  {fac === 'all' ? 'Toutes facultés' : fac}
                </option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as BuddyType | 'all')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Tous les rôles</option>
              <option value="buddy">Buddies</option>
              <option value="tutor">Tuteurs</option>
            </select>
          </div>

          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="text-blue-600">💡</span>
            Recherchez des étudiants sur la plateforme ou invitez quelqu'un d'externe
          </p>
        </div>
      </div>

      {/* 2. Résultats de recherche */}
      {showAvailablePeople && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="text-blue-600" size={20} />
            Personnes disponibles sur la plateforme ({filteredAvailablePeople.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAvailablePeople.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-xl border border-gray-300 p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                        {person.avatar}
                      </div>
                      {person.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{person.name}</h4>
                      <p className="text-xs text-gray-500">
                        {person.role === 'buddy' ? '👥 Buddy' : '🎓 Tuteur'} • {person.faculty}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Trophy className="text-yellow-600" size={14} />
                    <span className="text-gray-700 font-medium">Niv. {person.level}</span>
                  </div>
                  {person.isOnline && (
                    <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      En ligne
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSendInvitation(person)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <UserPlus size={16} />
                  Inviter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Mes connexions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {filteredBuddies.length} {filteredBuddies.length > 1 ? 'connexions' : 'connexion'}
        </h3>

        {filteredBuddies.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Users className="mx-auto mb-3 text-gray-400" size={48} />
            <p className="text-gray-600 font-medium mb-2">Aucune connexion trouvée</p>
            <p className="text-sm text-gray-500">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBuddies.map((buddy) => (
              <div
                key={buddy.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                        {buddy.avatar}
                      </div>
                      {buddy.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{buddy.name}</h4>
                      <p className="text-xs text-gray-500">
                        {buddy.role === 'buddy' ? '👥 Buddy' : '🎓 Tuteur'} • {buddy.faculty}
                      </p>
                    </div>
                  </div>
                </div>

                {buddy.role === 'buddy' && (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <div className="flex items-center gap-1 text-orange-600 mb-0.5">
                          <Zap size={12} />
                          <span className="text-xs font-medium">XP</span>
                        </div>
                        <p className="text-lg font-bold text-orange-900">{buddy.xpToday}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <div className="flex items-center gap-1 text-red-600 mb-0.5">
                          <Flame size={12} />
                          <span className="text-xs font-medium">Série</span>
                        </div>
                        <p className="text-lg font-bold text-red-900">{buddy.streak}j</p>
                      </div>
                    </div>

                    {buddy.courses.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Cours actifs</p>
                        {buddy.courses.slice(0, 2).map((course, i) => (
                          <div key={i} className="mb-1">
                            <div className="flex justify-between text-xs mb-0.5">
                              <span className="text-gray-600">{course.name}</span>
                              <span className="font-bold text-blue-600">{course.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4 & 5. Demandes et Activités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demandes en attente */}
        {([...mockPendingRequestsInitial, ...pendingRequests].length > 0) && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <Clock size={16} />
              Demandes en attente ({[...mockPendingRequestsInitial, ...pendingRequests].length})
            </h3>
            <div className="space-y-2">
              {[...mockPendingRequestsInitial, ...pendingRequests].map((request) => (
                <div key={request.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                      {request.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request.name}</p>
                      <p className="text-xs text-gray-500">
                        {request.role === 'buddy' ? '👥 Buddy' : '🎓 Tuteur'} • {request.faculty}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    En attente
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activités récentes */}
        {mockNotifications.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Bell className="text-blue-600" size={16} />
                Activités récentes
              </h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                {mockNotifications.length}
              </span>
            </div>
            <div className="space-y-2">
              {mockNotifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg text-sm">
                  <span className="text-lg flex-shrink-0">{notif.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatTimeAgo(notif.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BuddyInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        userId={userId}
      />
    </div>
  );
}
