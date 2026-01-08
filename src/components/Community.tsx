'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FullBadgesTab from './BadgesTab';
import CircleDomeGallery from './CircleDomeGallery';
import { 
  Users, 
  MessageCircle, 
  Video, 
  Award, 
  Calendar,
  Search,
  Filter,
  Plus,
  Clock,
  TrendingUp,
  Heart,
  Star,
  ChevronRight,
  ChevronLeft,
  Crown,
  Timer,
  Settings,
  Camera,
  Mic,
  MicOff,
  CameraOff,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckCircle,
  Globe,
  ThumbsUp,
  ThumbsDown,
  Send,
  BookOpen,
  Megaphone,
  Trophy,
  Sparkles,
  ExternalLink,
  UserPlus,
  Flame,
  Gift,
  X
} from 'lucide-react';
import { 
  getCurrentUserProfile,
  getMockCircles,
  getMockStudyRooms,
  getMockCommunityQuestions,
  getMockCommunityActivities,
  getMockSocialBadges,
  getMockCommunityChallenge,
  getMockAlumniProfiles,
  getMockCourseStudyRooms
} from '@/lib/mock-data';
import ModernBuddiesTab from './ModernBuddiesTab';
import { AdvancedStudyRoomsTab } from './AdvancedStudyRoomsTab';
import { StudyRoomModal } from './StudyRoomModal';
import { CircleDetailView } from './CircleDetailView';
import { 
  StudentProfile,
  Circle,
  StudyRoom,
  CommunityQuestion,
  CommunityActivity,
  SocialBadge,
  CommunityChallenge,
  AlumniProfile
} from '@/types';
import { CommunityFeed } from './CommunityFeed';
import { CompetitionLeaderboard } from './CompetitionLeaderboard';
import { XPService } from '@/lib/xp-service';
import { RewardsTeaser } from './RewardsTeaser';

type CommunityTab = 'overview' | 'buddies' | 'circles' | 'qa' | 'competitions' | 'badges';

// Fonction utilitaire pour filtrer les utilisateurs valides
const getValidUsers = (users: any[]) => {
  return users ? users.filter(user => user && user.id) : [];
};

interface CommunityProps {
  onOpenMessaging?: (contactId?: string) => void;
  userId?: string;
  initialTab?: CommunityTab;
  hideHeader?: boolean;
}

// Composant FullCompetitionsTab - Version enrichie
function FullCompetitionsTab({ userId, onNavigateToBadges }: { userId: string; onNavigateToBadges?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<'current' | 'upcoming' | 'history' | 'stats'>('current');

  // Mock data pour les compétitions à venir (enrichies)
  const upcomingCompetitions = [
    { 
      id: 1, 
      title: 'Marathon de la Connaissance', 
      subtitle: 'Course d\'endurance sur 48h',
      date: 'Débute dans 2 jours', 
      startDate: '24 Oct', 
      endDate: '26 Oct',
      participants: 1234, 
      maxParticipants: 2000,
      reward: 'Badge Diamant + 2000 XP', 
      bonusReward: '50 € de crédit',
      status: 'upcoming',
      difficulty: 'Expert',
      category: 'Multi-matières'
    },
    { 
      id: 2, 
      title: 'Duel International', 
      subtitle: 'Bataille entre pays',
      date: 'Débute dans 5 jours', 
      startDate: '27 Oct',
      endDate: '3 Nov', 
      participants: 3567, 
      maxParticipants: 5000,
      reward: 'Badge Platine + 1500 XP', 
      bonusReward: 'Accès exclusif nouveau pack',
      status: 'upcoming',
      difficulty: 'Avancé',
      category: 'Pays vs Pays'
    },
    { 
      id: 3, 
      title: 'Sprint Week-end', 
      subtitle: 'Challenge rapide et intense',
      date: 'Débute dans 7 jours', 
      startDate: '29 Oct',
      endDate: '30 Oct', 
      participants: 892, 
      maxParticipants: 1500,
      reward: 'Badge Or + 1000 XP', 
      bonusReward: '30 € de crédit',
      status: 'upcoming',
      difficulty: 'Intermédiaire',
      category: 'Sprint 24h'
    },
  ];

  // Mock data pour l'historique
  const pastCompetitions = [
    { id: 1, title: 'Sprint du Week-end', date: '12-14 Oct', myRank: 23, participants: 2341, reward: 'Badge Bronze', status: 'completed' },
    { id: 2, title: 'Clash des Facultés', date: '5-11 Oct', myRank: 8, participants: 8543, reward: 'Badge Argent + 500 XP', status: 'completed' },
    { id: 3, title: 'Défi des Pays', date: '28 Sept - 4 Oct', myRank: 156, participants: 15234, reward: 'Participation', status: 'completed' },
  ];

  // Mock data pour les statistiques
  const myStats = {
    totalCompetitions: 15,
    totalWins: 2,
    totalPodiums: 5,
    bestRank: 1,
    totalPoints: 18450,
    averageRank: 42,
    winRate: 13,
  };

  // Mock data pour les récompenses
  const myRewards = [
    { id: 1, title: 'Champion du Week-end', emoji: '👑', description: '1ère place Sprint', date: '23 Sept', rarity: 'legendary' as const },
    { id: 2, title: 'Top 10 Faculté', emoji: '🥇', description: 'Top 10 Clash Facultés', date: '10 Oct', rarity: 'epic' as const },
    { id: 3, title: 'Participant Actif', emoji: '⭐', description: '10 compétitions participées', date: '15 Oct', rarity: 'rare' as const },
    { id: 4, title: 'Sprint Master', emoji: '⚡', description: '3 Sprints consécutifs', date: '18 Oct', rarity: 'rare' as const },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header moderne */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Compétitions
        </h2>
        <p className="text-gray-600 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-gray-500" />
          Défie la communauté et gagne des récompenses
        </p>
      </div>

      {/* Navigation - Style horizontal avec icônes (sans container) */}
      <div className="flex flex-col gap-4">
        
        {/* CATÉGORIE */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Catégorie</span>
          <div className="flex gap-3 flex-wrap">
            {[
              { id: 'current', label: 'En cours', icon: Flame },
              { id: 'upcoming', label: 'À venir', icon: Sparkles },
              { id: 'history', label: 'Historique', icon: Clock },
              { id: 'stats', label: 'Mes stats', icon: TrendingUp },
            ].map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`cursor-target relative flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all min-w-[110px] ${
                  selectedCategory === cat.id
                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <cat.icon size={24} strokeWidth={2} />
                <span className="text-sm font-bold whitespace-nowrap tracking-wide">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu selon la catégorie */}
      <AnimatePresence mode="wait">
        {selectedCategory === 'current' && (
          <motion.div
            key="current"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CompetitionLeaderboard userId={userId} hideHeader={true} />
          </motion.div>
        )}

        {selectedCategory === 'upcoming' && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {upcomingCompetitions.map((comp, idx) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative overflow-hidden cursor-pointer group"
              >
                {/* Background avec effet subtil */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white rounded-2xl" />
                <div className="absolute inset-0 rounded-2xl border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-300" />
                
                {/* Accent latéral coloré selon difficulté */}
                <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${
                  comp.difficulty === 'Expert' ? 'bg-gradient-to-b from-gray-900 to-gray-700' :
                  comp.difficulty === 'Avancé' ? 'bg-gradient-to-b from-gray-700 to-gray-500' :
                  'bg-gradient-to-b from-blue-600 to-blue-400'
                }`} />
                
                <div className="relative p-6 pl-8">
                  {/* Header compact et impactant */}
                  <div className="flex items-start justify-between gap-6 mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-semibold text-gray-900" style={{ 
                          fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
                          letterSpacing: '-0.02em'
                        }}>
                          {comp.title}
                        </h4>
                        <motion.span 
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full"
                        >
                          {comp.date}
                        </motion.span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3" style={{ 
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }}>
                        {comp.subtitle} • {comp.startDate} - {comp.endDate}
                      </p>
                      
                      {/* Tags horizontaux compacts */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-lg">
                          <Users className="w-3.5 h-3.5 text-gray-600" />
                          <span className="text-sm text-gray-700 font-medium tabular-nums">
                            {comp.participants.toLocaleString()}/{comp.maxParticipants.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-lg">
                          <Trophy className="w-3.5 h-3.5 text-gray-600" />
                          <span className="text-sm text-gray-700 font-medium">{comp.category}</span>
                        </div>
                        
                        <span className={`px-2.5 py-1 text-sm font-semibold rounded-lg ${
                          comp.difficulty === 'Expert' ? 'bg-gray-900 text-white' :
                          comp.difficulty === 'Avancé' ? 'bg-gray-700 text-white' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {comp.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* CTA principal repositionné */}
                    <div className="flex flex-col items-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                        style={{ 
                          fontFamily: 'Inter, system-ui, sans-serif'
                        }}
                      >
                        S'inscrire →
                      </motion.button>
                    </div>
                  </div>

                  {/* Récompenses mise en avant */}
                  <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 uppercase" style={{ letterSpacing: '0.05em' }}>
                            Récompenses
                          </span>
                        </div>
                        <div className="space-y-1.5 pl-10">
                          <p className="text-sm text-gray-900 font-semibold">{comp.reward}</p>
                          {comp.bonusReward && (
                            <p className="text-sm text-gray-600">+ {comp.bonusReward}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Barre de remplissage */}
                      <div className="flex flex-col items-end gap-1 min-w-[120px]">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-gray-500">Places restantes</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(comp.participants / comp.maxParticipants) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 + 0.3 }}
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"
                          />
                        </div>
                        <span className="text-sm text-gray-500 font-medium tabular-nums">
                          {comp.maxParticipants - comp.participants} places
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {selectedCategory === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Compétitions à venir */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 px-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                À venir
              </h3>
              {upcomingCompetitions.map((comp, idx) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900">{comp.title}</h4>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                          Bientôt
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 font-semibold mb-3">{comp.date}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{comp.participants.toLocaleString()} inscrits</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-yellow-600" />
                          <span>{comp.reward}</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-bold hover:shadow-md transition-all">
                      S'inscrire
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Compétitions terminées */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 px-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Historique
              </h3>
              {pastCompetitions.map((comp, idx) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (upcomingCompetitions.length + idx) * 0.05 }}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900">{comp.title}</h4>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                          Terminé
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{comp.date}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{comp.participants.toLocaleString()} participants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-yellow-600" />
                          <span>{comp.reward}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-black mb-1 ${
                        comp.myRank <= 3 ? 'text-yellow-600' : 
                        comp.myRank <= 10 ? 'text-blue-600' : 
                        'text-gray-700'
                      }`}>
                        #{comp.myRank}
                      </div>
                      <p className="text-sm text-gray-500">Ma position</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedCategory === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Teaser Récompenses */}
            <RewardsTeaser
              rewards={myRewards}
              onViewAll={() => {
                if (onNavigateToBadges) {
                  onNavigateToBadges();
                }
              }}
            />

            <h3 className="text-lg font-bold text-gray-900 px-1">Mes statistiques</h3>
            
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                <p className="text-sm text-gray-600 mb-1">Victoires</p>
                <p className="text-3xl font-black text-yellow-700">{myStats.totalWins}</p>
                <p className="text-sm text-gray-600 mt-1">sur {myStats.totalCompetitions}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Podiums</p>
                <p className="text-3xl font-black text-orange-700">{myStats.totalPodiums}</p>
                <p className="text-sm text-gray-600 mt-1">Top 3</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Meilleur rang</p>
                <p className="text-3xl font-black text-blue-700">#{myStats.bestRank}</p>
                <p className="text-sm text-gray-600 mt-1">Record</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Points totaux</p>
                <p className="text-3xl font-black text-purple-700">{(myStats.totalPoints / 1000).toFixed(1)}k</p>
                <p className="text-sm text-gray-600 mt-1">XP gagnés</p>
              </div>
            </div>

            {/* Graphique de performance */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">Performance récente</h4>
              <div className="flex items-end gap-2 h-40">
                {[23, 8, 156, 45, 12, 67, 34, 18].map((rank, idx) => {
                  const height = Math.max(10, 100 - (rank / 200) * 100);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex-1 rounded-t-lg ${
                        rank <= 10 ? 'bg-gradient-to-t from-yellow-400 to-yellow-600' :
                        rank <= 50 ? 'bg-gradient-to-t from-blue-400 to-blue-600' :
                        'bg-gradient-to-t from-gray-300 to-gray-400'
                      }`}
                      title={`Position #${rank}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Il y a 8 compétitions</span>
                <span>Aujourd'hui</span>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}

export function Community({ onOpenMessaging: onOpenMessagingProp, userId = 'user-1', initialTab = 'buddies', hideHeader = false }: CommunityProps = {}) {
  // Default to 'buddies' since overview is hidden
  const validInitialTab = ['buddies', 'circles', 'qa'].includes(initialTab) ? initialTab : 'buddies';
  const [activeTab, setActiveTab] = useState<CommunityTab>(validInitialTab);
  
  // Sync activeTab with initialTab when it changes (for external control)
  React.useEffect(() => {
    if (['buddies', 'circles', 'qa'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [selectedStudyRoom, setSelectedStudyRoom] = useState<any>(null);
  const [showStudyRoomModal, setShowStudyRoomModal] = useState(false);
  const [showCircleDetail, setShowCircleDetail] = useState(false);

  const currentUser = getCurrentUserProfile();
  const circles = getMockCircles();
  const studyRooms = getMockStudyRooms();
  const courseStudyRooms = getMockCourseStudyRooms();
  const questions = getMockCommunityQuestions();
  const activities = getMockCommunityActivities();
  const badges = getMockSocialBadges();
  const challenge = getMockCommunityChallenge();
  const alumniProfiles = getMockAlumniProfiles();

  const joinedCircles = circles.filter(c => c.isJoined);
  const availableCircles = circles.filter(c => !c.isJoined);

  // Fonctions pour gérer les Study Rooms
  const handleJoinStudyRoom = (roomId: string) => {
    console.log('Rejoindre Study Room:', roomId);
    
    // Chercher d'abord dans les Study Rooms normales
    let room = studyRooms.find(r => r.id === roomId);
    
    // Si pas trouvé, chercher dans les Course Study Rooms
    if (!room) {
      room = courseStudyRooms.find(r => r.id === roomId);
    }
    
    if (room) {
      setSelectedStudyRoom(room);
      setShowStudyRoomModal(true);
    } else {
      alert('Study Room introuvable');
    }
  };

  const handleCloseStudyRoom = () => {
    setShowStudyRoomModal(false);
    setSelectedStudyRoom(null);
  };

  const handleOpenCircleDetail = (circleId: string | null) => {
    if (circleId) {
      // Vérifier si le cercle est déjà rejoint
      const isJoined = circles.find(c => c.id === circleId)?.isJoined;
      
      if (isJoined) {
        // Si déjà membre → Ouvrir la vue détaillée
        setSelectedCircle(circleId);
        setShowCircleDetail(true);
      } else {
        // Si pas encore membre → Ouvrir le modal de confirmation uniquement
        setSelectedCircle(circleId);
        setShowCircleDetail(false); // Ne pas ouvrir la vue détaillée
      }
    }
  };

  const handleCloseCircleDetail = () => {
    setShowCircleDetail(false);
    setSelectedCircle(null);
  };

  const handleOpenMessaging = (contactId?: string) => {
    // Fermer la vue détaillée du cercle si elle est ouverte
    if (showCircleDetail) {
      setShowCircleDetail(false);
      setSelectedCircle(null);
    }
    // Appeler la callback pour ouvrir la messagerie dans SimpleDashboard
    if (onOpenMessagingProp) {
      onOpenMessagingProp(contactId);
    }
  };

  // Tabs simplifiés : Buddies, Circles, Chat (masque Overview, Competitions, Badges)
  const tabs = [
    { id: 'buddies', label: 'Buddies', icon: UserPlus },
    { id: 'circles', label: 'Cercles', icon: Users },
    { id: 'qa', label: 'Chat', icon: MessageCircle }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}j`;
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`h-full ${hideHeader ? 'bg-transparent' : 'bg-gray-50'} flex flex-col`}>
      {/* Header Social Club - pleine largeur (caché si hideHeader) */}
      {!hideHeader && (
        <div className="bg-white border-b border-gray-200 px-6 py-6 flex-shrink-0">
          <div className="mb-6">
            <h1 
              className="font-bold text-gray-900 uppercase tracking-wide" 
              style={{ fontFamily: 'var(--font-parafina)', fontSize: '64px' }}
            >
              Social Club
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-gray-200 bg-white pt-4">
            <div className="flex space-x-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as CommunityTab)}
                    className={`flex items-center gap-2 py-3 px-4 rounded-full transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal - pleine largeur avec scroll */}
      <div className={`flex-1 overflow-y-auto ${hideHeader ? '' : 'px-6 py-8'} min-h-0`}>
        <AnimatePresence mode="wait">
          {activeTab === 'buddies' && (
            <ModernBuddiesTab 
              userId={currentUser.id}
              userName={currentUser.firstName || 'Étudiant'}
            />
          )}
          {activeTab === 'circles' && (
            <>
              {showCircleDetail && selectedCircle ? (
                <motion.div
                  key="circle-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <CircleDetailView
                    circle={circles.find(c => c.id === selectedCircle)!}
                    onBack={handleCloseCircleDetail}
                    onOpenMessaging={handleOpenMessaging}
                  />
                </motion.div>
              ) : (
            <CirclesTab 
              joinedCircles={joinedCircles}
              availableCircles={availableCircles}
              selectedCircle={selectedCircle}
                  onSelectCircle={handleOpenCircleDetail}
                  onCloseModal={() => {
                    setSelectedCircle(null);
                    setShowCircleDetail(false);
                  }}
              alumniProfiles={alumniProfiles}
            />
          )}
            </>
          )}
          {activeTab === 'qa' && (
            <ChatTab 
              questions={questions}
              currentUser={currentUser}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Modal Study Room */}
      <StudyRoomModal
        isOpen={showStudyRoomModal}
        onClose={handleCloseStudyRoom}
        room={selectedStudyRoom}
        currentUserId={currentUser.id}
      />
    </div>
  );
}

// ========================================================================
// COMPOSANTS DES ONGLETS
// ========================================================================

function OverviewTab({ 
  currentUser, 
  circles, 
  activities, 
  challenge, 
  studyRooms,
  userId 
}: { 
  currentUser: StudentProfile;
  circles: Circle[];
  activities: CommunityActivity[];
  challenge: CommunityChallenge;
  studyRooms: StudyRoom[];
  userId: string;
}) {
  const activeRooms = studyRooms.filter(room => room.currentUsers.length > 0);
  const xpService = XPService.getInstance();
  const profile = xpService.getUserXPProfile();

  // Mock recent badges (top 3)
  const recentBadges = profile.badges.slice(0, 3);

  // Mock buddies data (top 3 most active)
  const topBuddies = [
    { id: 'user-sophie', name: 'Sophie Martin', level: 12, xp: 2450, activity: 'Complété Thermodynamique', timeAgo: '5 min' },
    { id: 'user-thomas', name: 'Thomas Bernard', level: 18, xp: 4200, activity: 'Study Room active', timeAgo: 'Maintenant' },
    { id: 'user-emma', name: 'Emma Laurent', level: 10, xp: 1980, activity: 'A débloqué un badge', timeAgo: '30 min' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Bento Grid - Premium Layout Optimisé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Compétition en cours - Large 2x2 */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="md:col-span-2 lg:col-span-2 md:row-span-2 relative overflow-hidden group cursor-pointer"
          style={{ minHeight: '400px' }}
        >
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/5 rounded-3xl" />
          <div className="absolute inset-0 rounded-3xl border border-white/20 shadow-2xl shadow-black/5" />
          
          {/* Abstract shapes */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl opacity-40" />
          
          <div className="relative p-7 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
              <div>
                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
                    Clash des Facultés
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
                    Se termine dans 2j 14h
                  </p>
              </div>
            </div>
              
            <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Ton rang</div>
                <div className="text-3xl font-bold text-gray-900 tabular-nums">#23</div>
            </div>
          </div>
          
            {/* Mini Leaderboard */}
            <div className="flex-1 space-y-2 mb-6">
              {[
                { rank: 1, name: 'Polytechnique', xp: 45200, color: 'from-yellow-400 to-yellow-600' },
                { rank: 2, name: 'ENS', xp: 42100, color: 'from-gray-300 to-gray-500' },
                { rank: 3, name: 'HEC', xp: 39800, color: 'from-amber-600 to-amber-800' },
              ].map((faculty) => (
                <div key={faculty.rank} className="flex items-center gap-3 p-2.5 bg-white/50 rounded-xl border border-gray-200/50">
                  <div className={`w-7 h-7 bg-gradient-to-br ${faculty.color} rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                    {faculty.rank}
            </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{faculty.name}</h4>
                    <p className="text-sm text-gray-500">{faculty.xp.toLocaleString()} XP</p>
            </div>
                  <Trophy size={14} className={`${faculty.rank === 1 ? 'text-yellow-500' : 'text-gray-400'}`} />
                </div>
              ))}
          </div>

            {/* CTA - Bottom Right */}
            <div className="flex justify-end">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 transition-colors">
                Voir plus
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mes Buddies Actifs - Vertical 1x2 */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="lg:col-span-1 lg:row-span-2 relative overflow-hidden cursor-pointer"
          style={{ minHeight: '400px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl" />
          <div className="absolute inset-0 rounded-3xl border border-white/20 shadow-2xl shadow-black/5" />
          
          <div className="relative p-6 h-full flex flex-col">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight mb-1" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
                Buddies actifs
              </h3>
              <p className="text-sm uppercase tracking-widest text-gray-400" style={{ letterSpacing: '0.1em' }}>
                Activité récente
              </p>
          </div>

            <div className="flex-1 space-y-3">
              {topBuddies.map((buddy) => (
                <div key={buddy.id} className="p-3 bg-white/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {buddy.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{buddy.name}</h4>
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 rounded text-sm font-semibold text-gray-700">
                          Niv. {buddy.level}
                        </span>
                    </div>
                      <p className="text-sm text-gray-600 mb-1">{buddy.activity}</p>
                      <p className="text-sm text-gray-400">{buddy.timeAgo}</p>
                  </div>
                      </div>
                </div>
              ))}
                </div>

            {/* CTA - Bottom Right */}
            <div className="flex justify-end mt-4">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 transition-colors">
                Voir plus
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Badges Récents - 1x1 */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="lg:col-span-1 relative overflow-hidden cursor-pointer"
          style={{ minHeight: '200px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl" />
          <div className="absolute inset-0 rounded-3xl border border-white/20 shadow-2xl shadow-black/5" />
          
          <div className="relative p-6 h-full flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight mb-1" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
                Badges récents
              </h3>
              <p className="text-sm uppercase tracking-widest text-gray-400" style={{ letterSpacing: '0.1em' }}>
                Derniers débloqués
              </p>
          </div>

            <div className="flex-1 flex items-center justify-center gap-3">
              {recentBadges.map((badge, idx) => (
              <motion.div
                  key={badge.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.1, type: 'spring' }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-3xl shadow-md mb-2">
                    {badge.emoji || '🏆'}
                    </div>
                  <p className="text-[9px] text-gray-600 text-center font-medium line-clamp-2">{badge.name}</p>
              </motion.div>
            ))}
                  </div>
                  
            {/* CTA - Bottom Right */}
            <div className="flex justify-end mt-4">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 transition-colors">
                Voir plus
                <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>

        {/* Ma Streak & Stats - 1x1 */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="lg:col-span-1 relative overflow-hidden"
          style={{ minHeight: '200px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl" />
          <div className="absolute inset-0 rounded-3xl border border-white/20 shadow-2xl shadow-black/5" />
          
          <div className="relative p-6 h-full flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight mb-1" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
                Ma progression
              </h3>
              <p className="text-sm uppercase tracking-widest text-gray-400" style={{ letterSpacing: '0.1em' }}>
                Stats personnelles
              </p>
          </div>

            <div className="flex-1 flex flex-col justify-center space-y-4">
              {/* Streak */}
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-2xl font-bold text-gray-900 tabular-nums">{currentUser.studyStreak}</div>
                <p className="text-sm text-gray-600 font-medium">jours de série</p>
        </div>

              {/* XP & Level */}
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white/50 rounded-lg border border-gray-200/50">
                  <div className="text-lg font-bold text-gray-900 tabular-nums">{Math.floor(currentUser.totalXP / 1000)}</div>
                  <p className="text-[9px] text-gray-500">Niveau</p>
      </div>
                <div className="text-center p-2 bg-white/50 rounded-lg border border-gray-200/50">
                  <div className="text-lg font-bold text-gray-900 tabular-nums">{currentUser.totalXP}</div>
                  <p className="text-[9px] text-gray-500">XP Total</p>
                </div>
          </div>
        </div>
      </div>
        </motion.div>

        {/* Mes Cercles - 1x1 */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="lg:col-span-1 relative overflow-hidden cursor-pointer"
          style={{ minHeight: '200px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl" />
          <div className="absolute inset-0 rounded-3xl border border-white/20 shadow-2xl shadow-black/5" />
          
          <div className="relative p-6 h-full flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight mb-1" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
                Mes cercles
              </h3>
              <p className="text-sm uppercase tracking-widest text-gray-400" style={{ letterSpacing: '0.1em' }}>
                {circles.length} communautés
              </p>
                </div>
            
            <div className="flex-1 space-y-2">
              {circles.slice(0, 3).map((circle) => (
                <div key={circle.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/50 border border-gray-200/50 hover:shadow-md transition-all group">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                    {circle.icon}
              </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{circle.name}</h4>
                    <p className="text-sm text-gray-500">{circle.memberCount} membres</p>
          </div>
                  <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
        </div>

            {/* CTA - Bottom Right */}
            <div className="flex justify-end mt-4">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 transition-colors">
                Voir plus
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Study Rooms Live - 1x1 */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="lg:col-span-1 relative overflow-hidden cursor-pointer"
          style={{ minHeight: '200px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl" />
          <div className="absolute inset-0 rounded-3xl border border-white/20 shadow-2xl shadow-black/5" />
          
          <div className="relative p-6 h-full flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900 tracking-tight" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
                  Study Rooms
                </h3>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
              <p className="text-sm uppercase tracking-widest text-gray-400" style={{ letterSpacing: '0.1em' }}>
                {activeRooms.length} actives maintenant
              </p>
            </div>
            
            <div className="flex-1 space-y-2">
              {activeRooms.slice(0, 2).map((room) => (
                <div key={room.id} className="p-2.5 rounded-xl bg-white/50 border border-gray-200/50 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative flex-shrink-0">
                      <Video className="text-gray-600" size={14} />
                      {room.pomodoroTimer.isActive && (
                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      )}
            </div>
                    <h4 className="text-sm font-medium text-gray-900 truncate flex-1">{room.name}</h4>
          </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{room.subject}</span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Users size={10} />
                      <span className="tabular-nums">{room.currentUsers.length}</span>
            </div>
          </div>
        </div>
              ))}
            </div>

            {/* CTA - Bottom Right */}
            <div className="flex justify-end mt-4">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 transition-colors">
                Voir plus
                <ChevronRight size={14} />
              </button>
        </div>
      </div>
        </motion.div>
      </div>

      {/* Fil Communautaire - Full Width */}
      <CommunityFeed activities={activities} />
    </motion.div>
  );
}

// Fonction utilitaire pour formater le timer
function formatTimer(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Fonction utilitaire pour formater le temps écoulé
function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}j`;
}

function CirclesTab({ 
  joinedCircles, 
  availableCircles, 
  selectedCircle, 
  onSelectCircle,
  onCloseModal,
  alumniProfiles 
}: {
  joinedCircles: Circle[];
  availableCircles: Circle[];
  selectedCircle: string | null;
  onSelectCircle: (circleId: string | null) => void;
  onCloseModal: () => void;
  alumniProfiles: AlumniProfile[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'faculty' | 'course'>('all');

  const filteredAvailable = availableCircles.filter(circle => {
    const matchesSearch = circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         circle.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || circle.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleJoinCircle = (circleId: string) => {
    console.log('Rejoindre le cercle:', circleId);
    // TODO: Implémenter la logique de rejoindre un cercle (API call)
    // Pour l'instant, on simule juste un succès
    alert(`✅ Vous avez rejoint le cercle avec succès !`);
  };

  const handleLeaveCircle = (circleId: string) => {
    console.log('Quitter le cercle:', circleId);
    // TODO: Implémenter la logique de quitter un cercle
  };

  // Combine tous les cercles pour l'affichage
  const allCircles = [...joinedCircles, ...filteredAvailable];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Container 1: Tes cercles actifs - Navigation horizontale */}
      {joinedCircles.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-200"
             style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Tes cercles actifs</h3>
              <span className="text-sm text-gray-500">({joinedCircles.length})</span>
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex items-center gap-1">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                Voir tout
              </button>
              <div className="h-5 w-px bg-gray-200 mx-1" />
              <button 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => {
                  const container = document.getElementById('circles-scroll-container');
                  if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => {
                  const container = document.getElementById('circles-scroll-container');
                  if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
          {/* Scroll horizontal - 7 cercles par ligne */}
          <div 
            id="circles-scroll-container"
            className="grid grid-cols-7 gap-4 mt-3"
          >
            {joinedCircles.map((circle, index) => {
              // Mock micro-signals pour chaque cercle
              const activitySignals = [
                { type: 'active', label: '🟢 Actif aujourd\'hui' },
                { type: 'hot', label: '🔥 Très actif' },
                { type: 'online', label: '👥 12 en ligne' },
                { type: 'recent', label: '⏱ Il y a 3 min' },
              ];
              const signal = activitySignals[index % activitySignals.length];
              
              return (
              <motion.button
                key={circle.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCircle(circle.id)}
                  className="cursor-pointer group"
              >
                  <div className="w-full aspect-square rounded-full flex flex-col items-center justify-center text-center p-3 transition-all shadow-lg hover:shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 relative">
                    <h4 className="font-bold leading-tight line-clamp-2 px-1" style={{ color: '#ffffff', fontSize: '18px' }}>
                    {circle.name}
                  </h4>
                    {/* Micro-signal d'activité */}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-0.5 rounded-full shadow-sm border border-gray-100">
                      {signal.label}
                    </span>
                </div>
              </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Container 2: Découvrir avec Dome Gallery */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
           style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.03)' }}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-4">
            {/* Header à gauche */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Découvrir des cercles actifs par matière, école ou objectif</h3>
              </div>
            </div>
            
            {/* Barre de recherche à droite */}
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input
                type="text"
                placeholder="Rechercher un cercle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Dome Gallery */}
        <div className="h-[500px] relative">
          <CircleDomeGallery 
            circles={filteredAvailable.map(c => ({
              id: c.id,
              name: c.name,
              description: c.description,
              icon: c.icon,
              memberCount: c.memberCount,
              type: c.type as 'faculty' | 'course' | 'alumni',
              color: '#1f2937'
            }))}
            onCircleClick={(circle) => onSelectCircle(circle.id)}
            recommendedCircleId={filteredAvailable.length > 0 ? filteredAvailable[0].id : undefined}
          />
        </div>
      </div>

      {/* Message si aucun cercle */}
      {joinedCircles.length === 0 && filteredAvailable.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Users className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-600 font-medium">Aucun cercle trouvé</p>
          <p className="text-sm text-gray-500 mt-1">Essayez un autre terme de recherche</p>
        </div>
      )}

        {/* Modal de confirmation pour rejoindre un cercle - SMS Style */}
        {selectedCircle && availableCircles.find(c => c.id === selectedCircle) && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
            onClick={(e) => {
              e.stopPropagation();
              onCloseModal();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const circle = availableCircles.find(c => c.id === selectedCircle)!;
                // Mock data pour les infos émotionnelles
                const mockBuddiesInCircle = Math.floor(Math.random() * 5) + 1;
                const mockActiveToday = Math.floor(Math.random() * 30) + 10;
                const mockSharedCourses = Math.floor(Math.random() * 4) + 1;
                
                return (
                  <>
                    {/* Header avec fond dark */}
                    <div className="bg-gray-900 px-6 py-8 text-center rounded-t-2xl">
                      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Parafina, serif', color: '#FFFFFF' }}>{circle.name}</h2>
                      <p className="text-gray-400 text-sm">{circle.description}</p>
                      </div>

                    {/* Stats grid - Emotional connection */}
                    <div className="px-6 py-5">
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                          <div className="text-lg font-bold text-gray-900">{circle.memberCount}</div>
                          <div className="text-xs text-gray-500">Membres</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                          <div className="text-lg font-bold text-gray-900">{mockActiveToday}</div>
                          <div className="text-xs text-gray-500">Actifs aujourd'hui</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                          <div className="text-lg font-bold" style={{ color: '#00c2ff' }}>{mockSharedCourses}</div>
                          <div className="text-xs text-gray-500">Cours communs</div>
                        </div>
                    </div>

                      {/* Buddies already in circle */}
                      {mockBuddiesInCircle > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-5">
                          <div className="flex -space-x-2">
                            {[...Array(Math.min(mockBuddiesInCircle, 3))].map((_, i) => (
                              <div 
                                key={i}
                                className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500"
                              >
                                {['SM', 'TD', 'EL'][i]}
                      </div>
                            ))}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm text-gray-900 font-medium">
                              {mockBuddiesInCircle} de tes buddies
                        </span>
                            <span className="text-sm text-gray-500"> sont déjà ici</span>
                      </div>
                    </div>
                      )}

                      {/* Type badge */}
                      <div className="flex items-center justify-center gap-2 mb-5">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {circle.type === 'faculty' ? '🏛️ Faculté' : 
                           circle.type === 'course' ? '📖 Cours' : '🎓 Alumni'}
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onCloseModal();
                        }}
                        type="button"
                          className="flex-1 px-4 py-3.5 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all text-sm"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleJoinCircle(circle.id);
                          onCloseModal();
                        }}
                        type="button"
                          className="flex-1 px-4 py-3.5 text-white rounded-full font-semibold transition-all text-sm hover:opacity-90"
                          style={{ backgroundColor: '#00c2ff' }}
                      >
                        Rejoindre
                      </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}

      {/* Section Alumni - Affiché uniquement si le cercle Alumni est sélectionné */}
      {selectedCircle === 'alumni-network' && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            Réseau Alumni SMS - Nos Réussites ({alumniProfiles.length})
          </h3>
          <p className="text-gray-600 mb-6">
            Découvrez les parcours inspirants de nos anciens étudiants qui excellent aujourd'hui dans leurs domaines.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumniProfiles.map((alumni) => (
              <AlumniCard key={alumni.id} alumni={alumni} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Composant pour une carte de cercle - Version Apple Vision / Science Made Simple
function CircleCard({
  circle,
  isJoined,
  onAction,
  onSelect
}: {
  circle: Circle;
  isJoined: boolean;
  onAction: () => void;
  onSelect: () => void;
}) {
  // Déterminer le type de logo à afficher
  const renderLogo = () => {
    // Si c'est un pays → Drapeau
    if (circle.name.includes('France') || circle.name.includes('Français') || circle.icon === '🇫🇷') {
      return <span className="text-5xl">🇫🇷</span>;
    }
    if (circle.name.includes('Maroc') || circle.name.includes('Marocain') || circle.icon === '🇲🇦') {
      return <span className="text-5xl">🇲🇦</span>;
    }
    if (circle.name.includes('Belgique') || circle.name.includes('Belge') || circle.icon === '🇧🇪') {
      return <span className="text-5xl">🇧🇪</span>;
    }
    if (circle.icon === '🎓') {
      return <span className="text-5xl">🎓</span>;
    }
    
    // Si c'est une université → Initiales dans cercle
    if (circle.type === 'faculty' && !circle.icon.match(/[\u{1F1E0}-\u{1F1FF}]/u)) {
      const initials = circle.name.split(' ').map(w => w[0]).join('').slice(0, 3);
      return (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-black text-xl">{initials}</span>
        </div>
      );
    }
    
    // Si c'est un cours → Badge avec emoji
    return (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
        <span className="text-3xl">{circle.icon}</span>
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="cursor-target group relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 hover:border-gray-300/80 hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onSelect}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-gray-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Status badge - Actif */}
      {isJoined && (
        <div className="absolute top-4 right-4 z-10">
          <div className="px-2.5 py-1 bg-green-500 rounded-full flex items-center gap-1.5 shadow-lg shadow-green-500/20">
            <CheckCircle className="text-white" size={12} />
            <span className="text-sm font-bold text-white uppercase tracking-wide">Actif</span>
          </div>
          </div>
      )}

      <div className="relative p-5">
        {/* Logo/Icon centré */}
        <div className="flex justify-center mb-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {renderLogo()}
          </motion.div>
        </div>
        
        {/* Titre et badge */}
        <div className="text-center mb-2">
          <h4 className="font-bold text-base text-gray-900 mb-1.5 line-clamp-1 group-hover:text-black transition-colors">
            {circle.name}
          </h4>
          <span className="inline-block px-2.5 py-0.5 bg-gray-900 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
            {circle.type === 'faculty' ? 'Faculté' : circle.type === 'course' ? 'Cours' : 'Alumni'}
          </span>
      </div>

        {/* Description */}
        <p className="text-gray-600 text-sm text-center mb-3 line-clamp-2 leading-relaxed">
          {circle.description}
        </p>

        {/* Séparateur */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />

        {/* Membres */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <div className="p-1 bg-gray-100 rounded-lg">
            <Users size={12} className="text-gray-700" />
          </div>
          <span className="text-sm font-bold text-gray-900">{circle.memberCount.toLocaleString()}</span>
          <span className="text-sm text-gray-500 font-medium">membres</span>
        </div>

        {/* Bouton action - Uniquement "Rejoindre" pour les cercles non rejoints */}
        {!isJoined && (
          <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-target w-full py-2.5 rounded-2xl text-sm font-bold bg-gray-900 text-white hover:bg-black shadow-lg shadow-black/10 transition-all duration-200"
          >
            Rejoindre
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Composant pour une carte Alumni
function AlumniCard({ alumni }: { alumni: AlumniProfile }) {
  const getDomainColor = (domain: string) => {
    switch(domain) {
      case 'engineering': return 'text-blue-600 bg-blue-100';
      case 'medicine': return 'text-red-600 bg-red-100';
      case 'business': return 'text-green-600 bg-green-100';
      case 'research': return 'text-purple-600 bg-purple-100';
      case 'tech': return 'text-indigo-600 bg-indigo-100';
      case 'law': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDomainIcon = (domain: string) => {
    switch(domain) {
      case 'engineering': return '⚙️';
      case 'medicine': return '⚕️';
      case 'business': return '💼';
      case 'research': return '🔬';
      case 'tech': return '💻';
      case 'law': return '⚖️';
      default: return '🎯';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
      whileHover={{ y: -4 }}
    >
      {/* Header avec avatar et info principale */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{alumni.avatar}</div>
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-900">
            {alumni.firstName} {alumni.lastName}
          </h4>
          <p className="text-sm text-gray-600 font-medium">{alumni.currentPosition}</p>
          <p className="text-sm text-gray-500">{alumni.company}</p>
        </div>
        
        {/* Badge domaine */}
        <div className={`px-2 py-1 rounded-full text-sm font-medium ${getDomainColor(alumni.domain)}`}>
          <span className="mr-1">{getDomainIcon(alumni.domain)}</span>
          {alumni.domain}
        </div>
      </div>

      {/* Formation */}
      <div className="mb-4 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🎓</span>
          <span className="font-medium text-gray-900">{alumni.university}</span>
        </div>
        <p className="text-sm text-gray-600">{alumni.degree}</p>
        <p className="text-sm text-gray-500">Diplômé en {alumni.graduationYear}</p>
      </div>

      {/* Cours SMS suivis */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">📚 Cours SMS suivis :</p>
        <div className="flex flex-wrap gap-1">
          {alumni.smsCoursesCompleted.slice(0, 3).map((course, index) => (
            <span key={index} className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {course}
            </span>
          ))}
          {alumni.smsCoursesCompleted.length > 3 && (
            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              +{alumni.smsCoursesCompleted.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Témoignage */}
      <div className="mb-4 p-3 bg-blue-50 rounded-xl border-l-4 border-blue-500">
        <p className="text-sm text-gray-700 italic">"{alumni.testimonial}"</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={alumni.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>💼</span>
          LinkedIn
        </a>
        {alumni.email && (
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <span>📧</span>
            Contact
          </button>
        )}
      </div>

      {/* Footer avec année SMS */}
      <div className="mt-3 pt-3 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Ancien étudiant SMS • Depuis {alumni.joinedSmsYear}
        </p>
      </div>
    </motion.div>
  );
}

function StudyRoomsTab({ 
  studyRooms, 
  circles, 
  currentUser,
  onJoinRoom
}: {
  studyRooms: StudyRoom[];
  circles: Circle[];
  currentUser: StudentProfile;
  onJoinRoom?: (roomId: string) => void;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterCircle, setFilterCircle] = useState<string>('all');

  const filteredRooms = studyRooms.filter(room => 
    filterCircle === 'all' || room.circleId === filterCircle
  );

  const handleJoinRoom = (roomId: string) => {
    console.log('Rejoindre la room:', roomId);
    if (onJoinRoom) {
      onJoinRoom(roomId);
    } else {
      console.log('Fonction onJoinRoom non définie');
    }
  };

  const handleCreateRoom = () => {
    setShowCreateModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Study Rooms</h2>
          <p className="text-gray-600">Rejoins ou crée une session d'étude collaborative</p>
        </div>

        <div className="flex gap-3">
          <select
            value={filterCircle}
            onChange={(e) => setFilterCircle(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les cercles</option>
            {circles.map((circle) => (
              <option key={circle.id} value={circle.id}>{circle.name}</option>
            ))}
          </select>

          <button
            onClick={handleCreateRoom}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            Créer une room
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Video className="text-blue-600" size={16} />
            <span className="text-sm text-gray-600">Rooms actives</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {studyRooms.filter(r => r.currentUsers.length > 0).length}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-green-600" size={16} />
            <span className="text-sm text-gray-600">Étudiants en ligne</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {studyRooms.reduce((total, room) => total + room.currentUsers.length, 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="text-orange-600" size={16} />
            <span className="text-sm text-gray-600">Sessions Pomodoro</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {studyRooms.filter(r => r.pomodoroTimer.isActive).length}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-purple-600" size={16} />
            <span className="text-sm text-gray-600">Total rooms</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{studyRooms.length}</div>
        </div>
      </div>

      {/* Liste des Study Rooms */}
      <div className="space-y-4">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <StudyRoomCard
              key={room.id}
              room={room}
              circle={circles.find(c => c.id === room.circleId)}
              currentUser={currentUser}
              onJoin={() => handleJoinRoom(room.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Video className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune Study Room active</h3>
            <p className="text-gray-600 mb-6">Sois le premier à créer une session d'étude !</p>
            <button
              onClick={handleCreateRoom}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              Créer ma première room
            </button>
          </div>
        )}
      </div>

      {/* Modal de création (placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Créer une Study Room</h3>
            <p className="text-gray-600 mb-6">Cette fonctionnalité sera bientôt disponible !</p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Composant pour une carte de Study Room
function StudyRoomCard({
  room,
  circle,
  currentUser,
  onJoin
}: {
  room: StudyRoom;
  circle?: Circle;
  currentUser: StudentProfile;
  onJoin: () => void;
}) {
  const validUsers = getValidUsers(room.currentUsers);
  const isUserInRoom = validUsers.some(user => user.id === currentUser.id);
  const isCourseRoom = !!(room as any).courseId; // Détecte si c'est une Course Study Room

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Video className="text-gray-600" size={24} />
            </div>
            {room.pomodoroTimer.isActive && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 rounded-full animate-pulse"></div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-900">{room.name}</h4>
              {isCourseRoom && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  📚 Cours
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{room.subject}</p>
            {isCourseRoom && (room as any).courseName && (
              <p className="text-sm text-blue-600 mb-2">
                🎯 {(room as any).courseName}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {circle && (
                <span className="flex items-center gap-1">
                  {circle.icon} {circle.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formatTimeAgo(room.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {room.pomodoroTimer.isActive && (
            <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-medium">
              🍅 {formatTimer(room.pomodoroTimer.timeRemaining)}
            </div>
          )}
          
          <div className="flex items-center gap-1 text-gray-500">
            <Users size={16} />
            <span className="text-sm">{validUsers.length}/{room.maxUsers}</span>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {validUsers.slice(0, 4).map((user, index) => (
              <div
                key={user.id}
                className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold"
                title={user.firstName}
              >
                {user.firstName[0]}
              </div>
            ))}
            {validUsers.length > 4 && (
              <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-sm">
                +{validUsers.length - 4}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            {room.settings.cameraEnabled && <Camera size={12} />}
            {room.settings.micEnabled ? <Mic size={12} /> : <MicOff size={12} />}
            {room.settings.chatEnabled && <MessageCircle size={12} />}
          </div>
        </div>

        <button
          onClick={onJoin}
          disabled={validUsers.length >= room.maxUsers && !isUserInRoom}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isUserInRoom
              ? 'bg-green-50 text-green-600 border border-green-200'
              : validUsers.length >= room.maxUsers
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isUserInRoom ? 'Déjà connecté' : 
           validUsers.length >= room.maxUsers ? 'Complet' : 'Rejoindre'}
        </button>
      </div>
    </motion.div>
  );
}

// ========================================================================
// CHAT TAB - Visual identique au learning track chat
// ========================================================================
function ChatTab({ 
  questions, 
  currentUser 
}: {
  questions: CommunityQuestion[];
  currentUser: StudentProfile;
}) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      author: 'Zak', 
      authorInitials: 'ZK', 
      content: 'Bienvenue dans le chat général ! N\'hésitez pas à poser vos questions et à aider les autres.', 
      timestamp: 'Il y a 2h', 
      isMentor: true 
    },
    { 
      id: '2', 
      author: 'Sophie M.', 
      authorInitials: 'SM', 
      content: 'Salut tout le monde ! Comment ça va ?', 
      timestamp: 'Il y a 1h', 
      isMentor: false 
    },
    { 
      id: '3', 
      author: 'Thomas B.', 
      authorInitials: 'TB', 
      content: 'Quelqu\'un peut m\'expliquer rapidement les différences entre les cercles et les buddies ?', 
      timestamp: 'Il y a 45min', 
      isMentor: false 
    },
    { 
      id: '4', 
      author: 'Zak', 
      authorInitials: 'ZK', 
      content: 'Les Buddies sont tes amis d\'étude - tu les choisis personnellement. Les Cercles sont des groupes thématiques (par faculté, cours, etc.) où tu retrouves des étudiants avec les mêmes intérêts.', 
      timestamp: 'Il y a 30min', 
      isMentor: true 
    }
  ]);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const msg = {
      id: `msg-${Date.now()}`,
      author: 'Vous',
      authorInitials: currentUser.firstName?.[0] || 'V',
      content: newMessage.trim(),
      timestamp: 'À l\'instant',
      isMentor: false
    };
    
    setMessages([...messages, msg]);
    setNewMessage('');
    setTimeout(scrollToBottom, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col"
    >
      {/* Chat Container - Style identique au learning track */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col flex-1">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex-shrink-0 bg-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <MessageCircle size={24} className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900" style={{ fontSize: '22px' }}>Chat général</h3>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-blue-600 text-white font-medium rounded-full flex-shrink-0" style={{ fontSize: '13px' }}>
              {messages.length} messages
            </span>
          </div>
          {/* Présence */}
          <p className="text-gray-500 mt-1" style={{ fontSize: '14px' }}>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-600 font-medium">12 en ligne</span>
            </span>
            <span className="mx-2 text-gray-300">·</span>
            <span className="text-gray-600">Tous les étudiants</span>
          </p>
        </div>
        
        {/* Liste des messages */}
        <div 
          className="flex-1 p-5 space-y-5 overflow-y-auto"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#fafafa'
          }}
        >
          {/* System message */}
          <div className="flex justify-center">
            <span className="px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">
              🔥 Discussion active aujourd'hui
            </span>
          </div>
          
          {messages.map((msg, index) => (
            <React.Fragment key={msg.id}>
              <div className={`flex gap-3 ${msg.author === 'Vous' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-semibold ${
                  msg.isMentor ? 'bg-gray-900 text-white' : msg.author === 'Vous' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                }`} style={{ fontSize: '14px' }}>
                  {msg.authorInitials}
                </div>
                
                {/* Message bubble */}
                <div className={`max-w-[75%] ${msg.author === 'Vous' ? 'items-end' : ''}`}>
                  <div className={`flex items-center gap-2 mb-1.5 ${msg.author === 'Vous' ? 'justify-end' : ''}`}>
                    <span className="font-semibold text-gray-800" style={{ fontSize: '14px' }}>{msg.author}</span>
                    {msg.isMentor && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-medium rounded-md border border-gray-200" style={{ fontSize: '11px' }}>
                        Fondateur
                      </span>
                    )}
                    <span className="text-gray-400" style={{ fontSize: '12px' }}>{msg.timestamp}</span>
                  </div>
                  <div className={`px-4 py-3 rounded-2xl leading-relaxed ${
                    msg.author === 'Vous' 
                      ? 'bg-gray-900 text-white rounded-tr-md' 
                      : 'bg-white border border-gray-200 text-gray-900 rounded-tl-md'
                  }`} style={{ fontSize: '15px' }}>
                    {msg.content}
                  </div>
                </div>
              </div>
              
              {/* System message after some messages */}
              {index === 1 && (
                <div className="flex justify-center">
                  <span className="px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">
                    👋 5 nouveaux membres cette semaine
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Zone d'input */}
        <div className="p-5 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex gap-2 items-end">
            {/* Boutons d'attachement */}
            <div className="flex gap-0.5">
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Joindre un fichier">
                <Camera size={20} />
              </button>
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Message vocal">
                <Mic size={20} />
              </button>
            </div>
            <input 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Écris ton message..." 
              className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm" 
            />
            <button 
              onClick={sendMessage} 
              disabled={!newMessage.trim()} 
              className={`p-3 rounded-xl transition-colors ${newMessage.trim() ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400'}`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ========================================================================
// ANCIEN Q&A TAB (conservé pour référence mais masqué)
// ========================================================================
function QATab({ 
  questions, 
  currentUser 
}: {
  questions: CommunityQuestion[];
  currentUser: StudentProfile;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', courseId: '' });

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'resolved' && question.isResolved) ||
                         (filterStatus === 'unresolved' && !question.isResolved);
    return matchesSearch && matchesStatus;
  });

  const handleLikeQuestion = (questionId: string) => {
    console.log('Like question:', questionId);
    // TODO: Implémenter la logique de like
  };

  const handleSubmitQuestion = () => {
    console.log('Nouvelle question:', newQuestion);
    setShowNewQuestion(false);
    setNewQuestion({ title: '', content: '', courseId: '' });
    // TODO: Implémenter la logique d'ajout de question
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Q&A Communautaire</h2>
          <p className="text-gray-600">Pose tes questions et aide les autres étudiants</p>
        </div>

        <button
          onClick={() => setShowNewQuestion(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Poser une question
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'resolved' | 'unresolved')}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Toutes</option>
          <option value="unresolved">Non résolues</option>
          <option value="resolved">Résolues</option>
        </select>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="text-blue-600" size={16} />
            <span className="text-sm text-gray-600">Questions totales</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{questions.length}</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-600" size={16} />
            <span className="text-sm text-gray-600">Résolues</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {questions.filter(q => q.isResolved).length}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-orange-600" size={16} />
            <span className="text-sm text-gray-600">En attente</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {questions.filter(q => !q.isResolved).length}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="text-purple-600" size={16} />
            <span className="text-sm text-gray-600">Likes totaux</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {questions.reduce((total, q) => total + q.likes, 0)}
          </div>
        </div>
      </div>

      {/* Liste des questions */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              currentUser={currentUser}
              onLike={() => handleLikeQuestion(question.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune question trouvée</h3>
            <p className="text-gray-600 mb-6">Sois le premier à poser une question !</p>
            <button
              onClick={() => setShowNewQuestion(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              Poser ma première question
            </button>
          </div>
        )}
      </div>

      {/* Modal nouvelle question */}
      {showNewQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Poser une nouvelle question</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la question</label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Comment résoudre une équation du second degré ?"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée</label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Décris ton problème en détail..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewQuestion(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitQuestion}
                disabled={!newQuestion.title.trim() || !newQuestion.content.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publier la question
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Composant pour une carte de question
function QuestionCard({
  question,
  currentUser,
  onLike
}: {
  question: CommunityQuestion;
  currentUser: StudentProfile;
  onLike: () => void;
}) {
  const [showAnswers, setShowAnswers] = useState(false);
  const hasUserLiked = question.likedBy.includes(currentUser.id);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-gray-900">{question.title}</h4>
            {question.isResolved && (
              <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full">
                Résolu
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{question.content}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatTimeAgo(question.createdAt)}
            </span>
            
            {question.tags.length > 0 && (
              <div className="flex gap-1">
                {question.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
              hasUserLiked
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <ThumbsUp size={14} />
            <span>{question.likes}</span>
          </button>

          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle size={14} />
            <span>{question.answers.length} réponse{question.answers.length !== 1 ? 's' : ''}</span>
          </button>
        </div>

        {question.answers.length > 0 && (
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
          >
            {showAnswers ? 'Masquer' : 'Voir les réponses'}
          </button>
        )}
      </div>

      {/* Réponses */}
      {showAnswers && question.answers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200 space-y-3"
        >
          {question.answers.map((answer) => (
            <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 text-sm mb-2">{answer.content}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatTimeAgo(answer.createdAt)}</span>
                  {answer.isAccepted && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✓ Réponse acceptée
                    </span>
                  )}
                  {answer.isMentorVerified && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      👨‍🎓 Vérifiée par un mentor
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <ThumbsUp size={12} />
                  <span>{answer.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}



