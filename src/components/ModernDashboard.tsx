'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Target, 
  Users, 
  Crown, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  X,
  Search,
  Bell,
  Settings,
  User,
  Zap,
  Star,
  Heart,
  Globe,
  Compass,
  Award,
  Brain,
  Sparkles,
  Play,
  MessageCircle,
  Filter,
  Plus
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CourseCard } from './CourseCard';
import { CourseViewer } from './CourseViewer';
import { PreviewModal } from './PreviewModal';
import { ClientOnly } from './ClientOnly';
import { Course, StudentProgress, CourseSuggestion, DashboardData } from '@/types';
import { cn, formatRelativeTime } from '@/lib/utils';

interface ModernDashboardProps {
  data: DashboardData;
  onUpdateCourseOrder: (courseId: string, newIndex: number) => void;
  onToggleCourseFavorite: (courseId: string) => void;
  onPreviewCourse: (courseId: string) => void;
  onEnrollCourse: (courseId: string) => void;
}

// Composant Bento Card réutilisable
const BentoCard = ({ 
  children, 
  className = "", 
  gradient = "from-white/95 to-white/80",
  hover = true,
  onClick
}: { 
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
  onClick?: () => void;
}) => (
  <motion.div
    whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-2xl border border-white/20
      backdrop-blur-xl bg-gradient-to-br ${gradient}
      shadow-lg hover:shadow-xl transition-all duration-300
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
  >
    {children}
  </motion.div>
);

// Particules flottantes subtiles
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Métrique animée
const AnimatedMetric = ({ 
  icon: Icon, 
  value, 
  label, 
  color = "blue",
  trend,
  delay = 0 
}: { 
  icon: any;
  value: string | number;
  label: string;
  color?: string;
  trend?: number;
  delay?: number;
}) => {
  const colorClasses = {
    blue: "from-blue-500/80 to-blue-600/80",
    green: "from-emerald-500/80 to-emerald-600/80", 
    purple: "from-purple-500/80 to-purple-600/80",
    orange: "from-orange-500/80 to-orange-600/80"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring" }}
    >
      <BentoCard className="p-6" gradient={colorClasses[color as keyof typeof colorClasses]}>
        <div className="flex items-start justify-between text-white">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon size={20} />
              </div>
              {trend && (
                <div className={`text-xs px-2 py-1 rounded-full ${
                  trend > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </div>
              )}
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-white/80 text-sm">{label}</div>
          </div>
        </div>
      </BentoCard>
    </motion.div>
  );
};

export function ModernDashboard({ 
  data,
  onUpdateCourseOrder,
  onToggleCourseFavorite,
  onPreviewCourse,
  onEnrollCourse 
}: ModernDashboardProps) {
  const [primaryCourses, setPrimaryCourses] = useState(data.primaryCourses);
  const [suggestedExpanded, setSuggestedExpanded] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseViewerOpen, setCourseViewerOpen] = useState(false);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = primaryCourses.findIndex(course => course.id === active.id);
      const newIndex = primaryCourses.findIndex(course => course.id === over.id);
      const newOrder = arrayMove(primaryCourses, oldIndex, newIndex);
      setPrimaryCourses(newOrder);
      onUpdateCourseOrder(active.id as string, newIndex);
    }
  };

  const handleToggleFavorite = (courseId: string) => {
    onToggleCourseFavorite(courseId);
  };

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseViewerOpen(true);
  };

  const handleCloseCourseViewer = () => {
    setCourseViewerOpen(false);
    setSelectedCourse(null);
  };

  const handlePreviewCourse = (courseId: string) => {
    const course = [...primaryCourses, ...data.suggestedCourses.map(s => s.course)]
      .find(c => c.id === courseId);
    if (course) {
      setPreviewCourse(course);
      setPreviewModalOpen(true);
    }
  };

  const handleClosePreviewModal = () => {
    setPreviewModalOpen(false);
    setPreviewCourse(null);
  };

  // Calculs de statistiques
  const totalHours = data.progress.reduce((acc, p) => acc + p.timeSpent, 0) / 60;
  const averageProgress = primaryCourses.length > 0 
    ? Math.round(primaryCourses.reduce((acc, course) => acc + course.progress, 0) / primaryCourses.length)
    : 0;
  const bestRanking = data.progress.length > 0 
    ? Math.min(...data.progress.map(p => p.facultyRanking))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Design épuré sans éléments décoratifs */}

      {/* Sidebar Navigation - Moderne et aérée */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside 
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50"
            >
              <div className="h-full m-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-6 h-full flex flex-col">
                  {/* Header Sidebar */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {data.user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{data.user.name}</h3>
                        <p className="text-sm text-gray-500">{data.user.faculty}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSidebarOpen(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  {/* Navigation Modules */}
                  <nav className="space-y-2 flex-1">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <BookOpen size={20} />
                        <span className="font-medium">Mes Cours</span>
                      </div>
                      <p className="text-white/80 text-sm mt-1">Module actuel</p>
                    </div>
                    
                    {[
                      { icon: Target, label: 'Planification', desc: 'Organisez votre apprentissage' },
                      { icon: TrendingUp, label: 'Progression', desc: 'Suivez vos performances' },
                      { icon: Users, label: 'Communauté', desc: 'Échangez avec d\'autres étudiants' },
                      { icon: Award, label: 'Certifications', desc: 'Vos accomplissements' },
                      { icon: Settings, label: 'Paramètres', desc: 'Personnalisation' }
                    ].map(({ icon: Icon, label, desc }) => (
                      <button key={label} className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3 text-gray-700 group-hover:text-gray-900">
                          <Icon size={20} />
                          <span className="font-medium">{label}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1 ml-8">{desc}</p>
                      </button>
                    ))}
                  </nav>

                  {/* Web 3.0 Preview */}
                  <div className="mt-auto">
                    <BentoCard className="p-4" gradient="from-purple-600/80 to-pink-600/80">
                      <div className="text-white text-center">
                        <Globe size={24} className="mx-auto mb-2" />
                        <div className="text-sm font-medium mb-1">Web 3.0 Ready</div>
                        <div className="text-xs text-white/80">Certifications blockchain</div>
                      </div>
                    </BentoCard>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content Area */}
      <div className="relative z-10">
        {/* Header moderne et aéré */}
        <header className="p-6">
          <div className="max-w-7xl mx-auto">
            <BentoCard className="p-6" gradient="from-white/90 to-white/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Menu size={20} />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Brain className="text-white" size={20} />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Science Made Simple</h1>
                      <p className="text-sm text-gray-500">Tableau de bord</p>
                    </div>
                  </div>
                </div>
                
                {/* Barre de recherche moderne */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Rechercher un cours..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                  
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors relative">
                    <Bell size={20} className="text-gray-600" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-900">Bonjour, {data.user.name}</p>
                    <p className="text-xs text-gray-500">{data.user.year}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {data.user.name.charAt(0)}
                  </div>
                </div>
              </div>
            </BentoCard>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Message de bienvenue personnalisé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <BentoCard className="p-8" gradient="from-gradient-to-br from-blue-500/80 via-purple-500/80 to-indigo-600/80">
                <div className="text-white">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {averageProgress >= 75 ? '🚀 Excellent travail !' : 
                     averageProgress >= 50 ? '💪 Continuez comme ça !' : 
                     averageProgress > 0 ? '🌱 Bon début !' : 
                     '👋 Bienvenue dans votre parcours !'}
                  </h2>
                  <p className="text-white/90 text-lg">
                    {averageProgress >= 75 ? 'Vous maîtrisez très bien vos sujets. Peut-être temps d\'explorer de nouveaux domaines ?' : 
                     averageProgress >= 50 ? 'Votre progression est remarquable. Gardez ce rythme pour atteindre l\'excellence !' : 
                     averageProgress > 0 ? 'Votre aventure d\'apprentissage prend forme. Chaque pas compte !' : 
                     'Votre parcours d\'apprentissage personnalisé vous attend. Prêt à commencer ?'}
                  </p>
                </div>
              </BentoCard>
            </motion.div>

            {/* Métriques principales - Style Bento */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
            >
              <AnimatedMetric
                icon={BookOpen}
                value={primaryCourses.length}
                label="Cours actifs"
                color="blue"
                trend={12}
                delay={0.3}
              />
              <AnimatedMetric
                icon={TrendingUp}
                value={bestRanking ? `#${bestRanking}` : 'N/A'}
                label="Classement"
                color="purple"
                trend={bestRanking ? -2 : undefined}
                delay={0.4}
              />
              <AnimatedMetric
                icon={Clock}
                value={`${Math.round(totalHours)}h`}
                label="Temps d'étude"
                color="green"
                trend={8}
                delay={0.5}
              />
              <AnimatedMetric
                icon={Target}
                value={`${averageProgress}%`}
                label="Progression moyenne"
                color="orange"
                trend={15}
                delay={0.6}
              />
            </motion.div>

            {/* Section Mes Cours Favoris - Repensée */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Star className="text-yellow-500" size={28} />
                    Mes Cours Favoris
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {primaryCourses.length} cours • Réorganisez par glisser-déposer
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white transition-all text-gray-700">
                  <Plus size={16} />
                  <span className="hidden sm:inline">Ajouter un cours</span>
                </button>
              </div>

              {primaryCourses.length > 0 ? (
                <ClientOnly fallback={
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {primaryCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <CourseCard 
                          course={course}
                          progress={data.progress.find(p => p.courseId === course.id)}
                          isDraggable={false}
                          onToggleFavorite={handleToggleFavorite}
                          onPreview={handlePreviewCourse}
                          onEnroll={onEnrollCourse}
                          onOpenCourse={handleOpenCourse}
                        />
                      </motion.div>
                    ))}
                  </div>
                }>
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={primaryCourses.map(course => course.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {primaryCourses.map((course, index) => (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <CourseCard 
                              course={course}
                              progress={data.progress.find(p => p.courseId === course.id)}
                              isDraggable={true}
                              onToggleFavorite={handleToggleFavorite}
                              onPreview={handlePreviewCourse}
                              onEnroll={onEnrollCourse}
                              onOpenCourse={handleOpenCourse}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </ClientOnly>
              ) : (
                <BentoCard className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun cours favori
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Sélectionnez des cours ci-dessous pour les ajouter à vos favoris
                  </p>
                </BentoCard>
              )}
            </motion.section>

            {/* Section Cours Suggérés - Modernisée */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <BentoCard className="p-6" gradient="from-white/90 to-white/70">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSuggestedExpanded(!suggestedExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Les autres étudiants de votre faculté suivent également les cours suivants
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Basé sur {data.facultyStats.totalStudents} étudiants de {data.user.faculty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500 hidden md:block">
                      {data.suggestedCourses.length} suggestions
                    </div>
                    {suggestedExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </BentoCard>

              <AnimatePresence>
                {suggestedExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pt-4">
                      {data.suggestedCourses.map((suggestion, index) => (
                        <motion.div
                          key={suggestion.course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="relative mt-3"
                        >
                          <CourseCard 
                            course={suggestion.course}
                            onToggleFavorite={handleToggleFavorite}
                            onPreview={handlePreviewCourse}
                            onEnroll={onEnrollCourse}
                            onOpenCourse={handleOpenCourse}
                          />
                          
                          {/* Badge de popularité */}
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                            {suggestion.enrolledStudents} étudiants
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Call to action modernisé */}
                    <BentoCard className="p-8 text-center mt-8" gradient="from-blue-50/80 to-purple-50/80">
                      <div className="max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          Prêt à exceller ? 🚀
                        </h3>
                        <p className="text-gray-700 mb-6 text-lg">
                          Rejoignez ces cours populaires et dépassez la moyenne de votre faculté
                        </p>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                          Explorer tous les cours
                        </button>
                      </div>
                    </BentoCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CourseViewer
        course={selectedCourse}
        isOpen={courseViewerOpen}
        onClose={handleCloseCourseViewer}
      />

      <PreviewModal
        course={previewCourse}
        isOpen={previewModalOpen}
        onClose={handleClosePreviewModal}
        onEnroll={onEnrollCourse}
        onNavigateToUnlock={() => {
          handleClosePreviewModal();
          // Pas de module "Débloquer" dans ModernDashboard pour l'instant
        }}
        onShowUpsell={(courseId) => {
          handleClosePreviewModal();
          // Logique d'upsell à implémenter si nécessaire
        }}
        onNavigateToCourse={(courseId) => {
          handleClosePreviewModal();
          // Navigation vers le course viewer
        }}
      />
    </div>
  );
}
