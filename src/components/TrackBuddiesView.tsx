'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  UserPlus, 
  Users, 
  Search,
  Check,
  Clock,
  MessageCircle,
  BookOpen,
  Send,
  Copy,
  Share2,
  Heart
} from 'lucide-react';

interface TrackMember {
  id: string;
  name: string;
  progress: number;
  lastActive: Date;
  lessonsCompleted: number;
  totalLessons: number;
  isBuddy: boolean;
  buddyRequestSent?: boolean;
  matchScore?: number;
  studyStyle?: 'morning' | 'evening' | 'flexible';
  strengths?: string[];
}

interface TrackBuddiesViewProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
}

export function TrackBuddiesView({ 
  isOpen, 
  onClose, 
  trackId, 
  trackTitle 
}: TrackBuddiesViewProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'buddies' | 'invite'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteLink] = useState(`https://app.sciencemadesimple.io/join/${trackId}?ref=user123`);
  const [linkCopied, setLinkCopied] = useState(false);

  const [members, setMembers] = useState<TrackMember[]>([
    { 
      id: 'user-2', 
      name: 'Sarah Martinez', 
      progress: 75, 
      lastActive: new Date(Date.now() - 600000),
      lessonsCompleted: 9,
      totalLessons: 12,
      isBuddy: true,
      matchScore: 92,
      studyStyle: 'morning',
      strengths: ['Intégrales', 'Équations différentielles']
    },
    { 
      id: 'user-3', 
      name: 'Alex Kim', 
      progress: 58, 
      lastActive: new Date(Date.now() - 3600000),
      lessonsCompleted: 7,
      totalLessons: 12,
      isBuddy: false,
      buddyRequestSent: true,
      matchScore: 78,
      studyStyle: 'evening',
      strengths: ['Probabilités']
    },
    { 
      id: 'user-4', 
      name: 'Marie Lefebvre', 
      progress: 42, 
      lastActive: new Date(Date.now() - 7200000),
      lessonsCompleted: 5,
      totalLessons: 12,
      isBuddy: false,
      matchScore: 85,
      studyStyle: 'flexible',
      strengths: ['Algèbre linéaire', 'Calcul matriciel']
    },
    { 
      id: 'user-5', 
      name: 'Thomas Dubois', 
      progress: 92, 
      lastActive: new Date(Date.now() - 1800000),
      lessonsCompleted: 11,
      totalLessons: 12,
      isBuddy: true,
      matchScore: 88,
      studyStyle: 'morning',
      strengths: ['Statistiques', 'Analyse']
    },
    { 
      id: 'user-6', 
      name: 'Julie Petit', 
      progress: 33, 
      lastActive: new Date(Date.now() - 86400000),
      lessonsCompleted: 4,
      totalLessons: 12,
      isBuddy: false,
      matchScore: 65,
      studyStyle: 'evening',
      strengths: ['Géométrie']
    },
  ]);

  const handleSendBuddyRequest = (userId: string) => {
    setMembers(prev => prev.map(m => 
      m.id === userId ? { ...m, buddyRequestSent: true } : m
    ));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const formatLastActive = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 5) return 'Actif maintenant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const getStudyStyleLabel = (style?: string) => {
    switch (style) {
      case 'morning': return 'Matinal';
      case 'evening': return 'Nocturne';
      case 'flexible': return 'Flexible';
      default: return '';
    }
  };

  const buddies = members.filter(m => m.isBuddy);
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl overflow-hidden w-full max-w-xl max-h-[85vh] flex flex-col shadow-xl"
        >
          {/* Header - Minimal */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Communauté</h2>
                  <p className="text-xs text-gray-500">{trackTitle}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Tabs - Clean */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {[
                { id: 'members', label: 'Tous', count: members.length },
                { id: 'buddies', label: 'Buddies', count: buddies.length },
                { id: 'invite', label: 'Inviter' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="text-xs text-gray-400">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Search */}
            {(activeTab === 'members' || activeTab === 'buddies') && (
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>
            )}

            {/* Members List */}
            {activeTab === 'members' && (
              <div className="p-4 space-y-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {member.isBuddy && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <Heart size={8} className="text-white" fill="white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 text-sm truncate">{member.name}</h3>
                          {member.isBuddy && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px] font-medium">
                              Buddy
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <BookOpen size={10} />
                            {member.lessonsCompleted}/{member.totalLessons}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {formatLastActive(member.lastActive)}
                          </span>
                          {member.studyStyle && (
                            <span className="text-gray-400">{getStudyStyleLabel(member.studyStyle)}</span>
                          )}
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gray-800 rounded-full"
                              style={{ width: `${member.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-gray-600">{member.progress}%</span>
                        </div>

                        {/* Strengths */}
                        {member.strengths && member.strengths.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {member.strengths.slice(0, 2).map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white rounded text-[10px] text-gray-500 border border-gray-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-1">
                        {member.isBuddy ? (
                          <button className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                            <MessageCircle size={14} />
                          </button>
                        ) : member.buddyRequestSent ? (
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock size={10} />
                            En attente
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleSendBuddyRequest(member.id)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <UserPlus size={14} />
                          </button>
                        )}
                        {member.matchScore && (
                          <span className={`text-[10px] font-medium ${
                            member.matchScore >= 85 ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {member.matchScore}% match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Buddies List */}
            {activeTab === 'buddies' && (
              <div className="p-4 space-y-2">
                {buddies.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Heart size={20} className="text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">Pas encore de buddies</h3>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      Envoyez des invitations pour étudier ensemble
                    </p>
                    <button
                      onClick={() => setActiveTab('members')}
                      className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Trouver des buddies
                    </button>
                  </div>
                ) : (
                  buddies.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((member) => (
                    <div
                      key={member.id}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                            {member.name}
                            <Heart size={12} className="text-blue-600" fill="currentColor" />
                          </h3>
                          <p className="text-xs text-gray-500">
                            {member.lessonsCompleted}/{member.totalLessons} leçons · {formatLastActive(member.lastActive)}
                          </p>
                        </div>
                        <button className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                          <MessageCircle size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Invite Tab */}
            {activeTab === 'invite' && (
              <div className="p-6 space-y-6">
                {/* Invite Link */}
                <div>
                  <h3 className="font-medium text-gray-900 text-sm mb-2">Lien d'invitation</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Partagez ce lien pour inviter des amis
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2.5 text-xs text-gray-600 font-mono truncate">
                      {inviteLink}
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm flex items-center gap-2 ${
                        linkCopied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {linkCopied ? <Check size={14} /> : <Copy size={14} />}
                      {linkCopied ? 'Copié' : 'Copier'}
                    </button>
                  </div>
                </div>

                {/* Share Options */}
                <div>
                  <h3 className="font-medium text-gray-900 text-sm mb-3">Partager via</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <Send size={16} className="text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <MessageCircle size={16} className="text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">SMS</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <Share2 size={16} className="text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Autre</span>
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">3</p>
                      <p className="text-[10px] text-gray-500">Invitations</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">2</p>
                      <p className="text-[10px] text-gray-500">Ont rejoint</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
