'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  UserPlus
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
import { BuddiesTab } from './BuddiesTab';
import { AdvancedStudyRoomsTab } from './AdvancedStudyRoomsTab';
import { StudyRoomModal } from './StudyRoomModal';
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

type CommunityTab = 'overview' | 'buddies' | 'circles' | 'study-rooms' | 'qa' | 'badges';

// Fonction utilitaire pour filtrer les utilisateurs valides
const getValidUsers = (users: any[]) => {
  return users ? users.filter(user => user && user.id) : [];
};

export function Community() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [selectedStudyRoom, setSelectedStudyRoom] = useState<any>(null);
  const [showStudyRoomModal, setShowStudyRoomModal] = useState(false);

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

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'buddies', label: 'Buddies', icon: UserPlus },
    { id: 'circles', label: 'Cercles', icon: Users },
    { id: 'study-rooms', label: 'Study Rooms', icon: Video },
    { id: 'qa', label: 'Q&A', icon: MessageCircle },
    { id: 'badges', label: 'Badges', icon: Award }
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
    <div className="h-[calc(100vh-73px)] bg-gray-50 flex flex-col">
      {/* Header Communauté - pleine largeur */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Communauté
            </h1>
            <p className="text-gray-600">
              Tu n'es pas seul. Ensemble, on vise plus haut. 🚀
            </p>
          </div>
          
          {/* Profil utilisateur compact */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="text-3xl">{currentUser.avatar}</div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{currentUser.firstName}</h3>
                <p className="text-sm text-gray-600">{currentUser.faculty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Niveau {currentUser.level}
                  </span>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    🔥 {currentUser.studyStreak}j
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-200 bg-white">
          <div className="px-6 flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as CommunityTab)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
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

      {/* Contenu principal - pleine largeur avec scroll */}
      <div className="flex-1 overflow-y-auto px-6 py-8 min-h-0">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewTab 
              currentUser={currentUser}
              circles={joinedCircles}
              activities={activities}
              challenge={challenge}
              studyRooms={studyRooms}
            />
          )}
          {activeTab === 'circles' && (
            <CirclesTab 
              joinedCircles={joinedCircles}
              availableCircles={availableCircles}
              selectedCircle={selectedCircle}
              onSelectCircle={setSelectedCircle}
              alumniProfiles={alumniProfiles}
            />
          )}
          {activeTab === 'study-rooms' && (
            <AdvancedStudyRoomsTab 
              userId={currentUser.id}
              userName={currentUser.firstName || currentUser.name || 'Étudiant'}
              purchasedItems={new Set(['course-loi-gauss', 'course-integrales'])}
              onNavigateToUpgrade={(courseId) => {
                console.log('Navigation vers upgrade pour:', courseId);
              }}
              userCourses={[
                { id: 'loi-gauss', title: 'Loi de Gauss', description: 'Électrostatique et champs', difficulty: 'intermediate', lessons: [], instructor: 'Dr. Physics', duration: 120, price: 700 },
                { id: 'integrales', title: 'Intégrales et Applications', description: 'Calcul intégral avancé', difficulty: 'advanced', lessons: [], instructor: 'Dr. Math', duration: 150, price: 700 },
                { id: 'suites-limites', title: 'Suites et Limites', description: 'Analyse mathématique', difficulty: 'intermediate', lessons: [], instructor: 'Dr. Math', duration: 100, price: 700 }
              ]}
              isAdmin={currentUser.id === 'admin_zak'} // Simuler un utilisateur admin
            />
          )}
          {activeTab === 'buddies' && (
            <BuddiesTab 
              userId={currentUser.id}
              userName={currentUser.firstName || currentUser.name || 'Étudiant'}
              userCourses={[
                { id: 'loi-gauss', title: 'Loi de Gauss', description: 'Électrostatique et champs', difficulty: 'intermediate', lessons: [], instructor: 'Dr. Physics', duration: 120, price: 700 },
                { id: 'integrales', title: 'Intégrales et Applications', description: 'Calcul intégral avancé', difficulty: 'advanced', lessons: [], instructor: 'Dr. Math', duration: 150, price: 700 },
                { id: 'suites-limites', title: 'Suites et Limites', description: 'Analyse mathématique', difficulty: 'intermediate', lessons: [], instructor: 'Dr. Math', duration: 100, price: 700 },
                { id: 'thermodynamique', title: 'Thermodynamique', description: 'Physique statistique', difficulty: 'advanced', lessons: [], instructor: 'Dr. Physics', duration: 180, price: 700 }
              ]}
            />
          )}
          {activeTab === 'qa' && (
            <QATab 
              questions={questions}
              currentUser={currentUser}
            />
          )}
          {activeTab === 'badges' && (
            <BadgesTab 
              badges={badges}
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
  studyRooms 
}: { 
  currentUser: StudentProfile;
  circles: Circle[];
  activities: CommunityActivity[];
  challenge: CommunityChallenge;
  studyRooms: StudyRoom[];
}) {
  const activeRooms = studyRooms.filter(room => room.currentUsers.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Colonne principale */}
      <div className="lg:col-span-2 space-y-6">
        {/* Défi collectif */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{challenge.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900">{challenge.title}</h3>
                <p className="text-sm text-gray-600">{challenge.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{challenge.current}h</div>
              <div className="text-sm text-gray-600">/ {challenge.target}h</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progression collective</span>
              <span>{Math.round((challenge.current / challenge.target) * 100)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gray-900 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {challenge.participants.slice(0, 3).map((participantId, index) => (
                <div key={participantId} className="w-8 h-8 bg-gray-700 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
              ))}
              {challenge.participants.length > 3 && (
                <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                  +{challenge.participants.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600 font-medium">{challenge.reward}</span>
          </div>
        </motion.div>

        {/* Fil Communautaire */}
        <CommunityFeed activities={activities} />

        {/* Study Rooms actives */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Study Rooms actives</h3>
            <span className="text-sm text-gray-600">{activeRooms.length} rooms ouvertes</span>
          </div>

          <div className="space-y-4">
            {activeRooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Video className="text-gray-600" size={20} />
                      {room.pomodoroTimer.isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{room.name}</h4>
                      <p className="text-sm text-gray-600">{room.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {room.pomodoroTimer.isActive && (
                      <div className="flex items-center gap-2 text-red-600">
                        <Timer size={16} />
                        <span className="text-sm font-mono">{formatTimer(room.pomodoroTimer.timeRemaining)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{room.currentUsers.length}/{room.maxUsers}</span>
                    </div>
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                      Rejoindre
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Mes cercles */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Mes cercles</h3>
          
          <div className="space-y-3">
            {circles.map((circle) => (
              <div key={circle.id} className="flex items-center gap-3">
                <div className="text-lg">{circle.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{circle.name}</h4>
                  <p className="text-xs text-gray-500">{circle.memberCount} membres</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Motto personnalisé */}
        {currentUser.motto && (
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="text-center">
              <Star className="text-gray-600 mx-auto mb-2" size={24} />
              <p className="text-gray-700 italic">"{currentUser.motto}"</p>
              <p className="text-xs text-gray-500 mt-2">Ton motto</p>
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tes stats</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Cours terminés</span>
              <span className="font-bold text-green-600">{currentUser.coursesCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">XP total</span>
              <span className="font-bold text-purple-600">{currentUser.totalXP}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Streak actuelle</span>
              <span className="font-bold text-orange-600">🔥 {currentUser.studyStreak}</span>
            </div>
          </div>
        </div>
      </div>
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
  alumniProfiles 
}: {
  joinedCircles: Circle[];
  availableCircles: Circle[];
  selectedCircle: string | null;
  onSelectCircle: (circleId: string | null) => void;
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
    // TODO: Implémenter la logique de rejoindre un cercle
  };

  const handleLeaveCircle = (circleId: string) => {
    console.log('Quitter le cercle:', circleId);
    // TODO: Implémenter la logique de quitter un cercle
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header avec recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cercles de la communauté</h2>
          <p className="text-gray-600">Rejoins des cercles pour échanger avec d'autres étudiants</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher un cercle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'faculty' | 'course')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous</option>
            <option value="faculty">Facultés</option>
            <option value="course">Cours</option>
          </select>
        </div>
      </div>

      {/* Mes cercles */}
      {joinedCircles.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={24} />
            Mes cercles ({joinedCircles.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedCircles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                isJoined={true}
                onAction={() => handleLeaveCircle(circle.id)}
                onSelect={() => onSelectCircle(circle.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cercles disponibles */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="text-blue-600" size={24} />
          Cercles disponibles ({filteredAvailable.length})
        </h3>
        
        {filteredAvailable.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailable.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                isJoined={false}
                onAction={() => handleJoinCircle(circle.id)}
                onSelect={() => onSelectCircle(circle.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Aucun cercle trouvé pour votre recherche</p>
          </div>
        )}
      </div>

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

// Composant pour une carte de cercle
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
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`text-2xl p-3 rounded-xl bg-${circle.color}-100`}>
            {circle.icon}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{circle.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              circle.type === 'faculty' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-purple-100 text-purple-700'
            }`}>
              {circle.type === 'faculty' ? 'Faculté' : 'Cours'}
            </span>
          </div>
        </div>
        
        {isJoined && <CheckCircle className="text-green-600" size={20} />}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{circle.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-gray-500">
          <Users size={16} />
          <span className="text-sm">{circle.memberCount} membres</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isJoined
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isJoined ? 'Quitter' : 'Rejoindre'}
        </button>
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
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDomainColor(alumni.domain)}`}>
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
        <p className="text-xs text-gray-500">Diplômé en {alumni.graduationYear}</p>
      </div>

      {/* Cours SMS suivis */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">📚 Cours SMS suivis :</p>
        <div className="flex flex-wrap gap-1">
          {alumni.smsCoursesCompleted.slice(0, 3).map((course, index) => (
            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {course}
            </span>
          ))}
          {alumni.smsCoursesCompleted.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
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
        <p className="text-xs text-gray-500">
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
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  📚 Cours
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{room.subject}</p>
            {isCourseRoom && (room as any).courseName && (
              <p className="text-xs text-blue-600 mb-2">
                🎯 {(room as any).courseName}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
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
              <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                +{validUsers.length - 4}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
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
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Résolu
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{question.content}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
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
                <div className="flex items-center gap-2 text-xs text-gray-500">
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
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
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

function BadgesTab({ 
  badges, 
  currentUser 
}: {
  badges: SocialBadge[];
  currentUser: StudentProfile;
}) {
  const [filterRarity, setFilterRarity] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');

  const unlockedBadges = badges.filter(badge => badge.unlockedAt);
  const lockedBadges = badges.filter(badge => !badge.unlockedAt);

  const filteredUnlocked = unlockedBadges.filter(badge => 
    filterRarity === 'all' || badge.rarity === filterRarity
  );

  const filteredLocked = lockedBadges.filter(badge => 
    filterRarity === 'all' || badge.rarity === filterRarity
  );

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-gray-700 bg-gray-200';
      case 'epic': return 'text-gray-800 bg-gray-300';
      case 'legendary': return 'text-gray-900 bg-gray-400';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-gray-400';
      case 'epic': return 'border-gray-500';
      case 'legendary': return 'border-gray-600 shadow-gray-200';
      default: return 'border-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header avec filtre */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Badges Sociaux</h2>
          <p className="text-gray-600">Débloquez des badges en participant à la communauté</p>
        </div>

        <select
          value={filterRarity}
          onChange={(e) => setFilterRarity(e.target.value as typeof filterRarity)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Toutes les raretés</option>
          <option value="common">Commun</option>
          <option value="rare">Rare</option>
          <option value="epic">Épique</option>
          <option value="legendary">Légendaire</option>
        </select>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-green-600" size={16} />
            <span className="text-sm text-gray-600">Badges obtenus</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{unlockedBadges.length}</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-orange-600" size={16} />
            <span className="text-sm text-gray-600">En progression</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{lockedBadges.length}</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="text-yellow-600" size={16} />
            <span className="text-sm text-gray-600">Badges rares+</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {unlockedBadges.filter(b => ['rare', 'epic', 'legendary'].includes(b.rarity)).length}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="text-purple-600" size={16} />
            <span className="text-sm text-gray-600">Progression</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {Math.round((unlockedBadges.length / badges.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Badges obtenus */}
      {filteredUnlocked.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="text-green-600" size={24} />
            Badges obtenus ({filteredUnlocked.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnlocked.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={true}
                getRarityColor={getRarityColor}
                getRarityBorder={getRarityBorder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Badges à débloquer */}
      {filteredLocked.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="text-orange-600" size={24} />
            À débloquer ({filteredLocked.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocked.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={false}
                getRarityColor={getRarityColor}
                getRarityBorder={getRarityBorder}
              />
            ))}
          </div>
        </div>
      )}

      {/* État vide */}
      {filteredUnlocked.length === 0 && filteredLocked.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Award className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun badge trouvé</h3>
          <p className="text-gray-600">Changez le filtre de rareté pour voir plus de badges</p>
        </div>
      )}
    </motion.div>
  );
}

// Composant pour une carte de badge
function BadgeCard({
  badge,
  isUnlocked,
  getRarityColor,
  getRarityBorder
}: {
  badge: SocialBadge;
  isUnlocked: boolean;
  getRarityColor: (rarity: string) => string;
  getRarityBorder: (rarity: string) => string;
}) {
  const progressPercent = badge.criteria.current && badge.criteria.target 
    ? (badge.criteria.current / badge.criteria.target) * 100
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-2xl p-6 border-2 transition-all ${
        isUnlocked 
          ? `${getRarityBorder(badge.rarity)} shadow-lg` 
          : 'border-gray-200 opacity-60'
      }`}
    >
      <div className="text-center">
        <div className={`text-4xl mb-3 ${isUnlocked ? '' : 'grayscale'}`}>
          {badge.icon}
        </div>
        
        <h4 className="font-bold text-gray-900 mb-1">{badge.name}</h4>
        
        <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(badge.rarity)}`}>
          {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
        </span>
        
        <p className="text-gray-600 text-sm mt-3 mb-4">{badge.description}</p>

        {!isUnlocked && badge.criteria.current !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progression</span>
              <span className="font-medium">
                {badge.criteria.current}/{badge.criteria.target}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2 rounded-full bg-gradient-to-r ${
                  badge.rarity === 'legendary' ? 'from-yellow-400 to-yellow-600' :
                  badge.rarity === 'epic' ? 'from-purple-400 to-purple-600' :
                  badge.rarity === 'rare' ? 'from-blue-400 to-blue-600' :
                  'from-gray-400 to-gray-600'
                }`}
              />
            </div>
            
            <p className="text-xs text-gray-500">
              {Math.round(progressPercent)}% complété
            </p>
          </div>
        )}

        {isUnlocked && badge.unlockedAt && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-700 text-sm font-medium">
              ✓ Obtenu le {badge.unlockedAt.toLocaleDateString('fr-FR')}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
