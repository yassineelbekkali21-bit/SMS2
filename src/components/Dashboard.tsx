'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Clock, Target, Users, Crown, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
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

interface DashboardProps {
  data: DashboardData;
  onUpdateCourseOrder: (courseId: string, newIndex: number) => void;
  onToggleCourseFavorite: (courseId: string) => void;
  onPreviewCourse: (courseId: string) => void;
  onEnrollCourse: (courseId: string) => void;
}

export function Dashboard({ 
  data,
  onUpdateCourseOrder,
  onToggleCourseFavorite,
  onPreviewCourse,
  onEnrollCourse 
}: DashboardProps) {
  const [primaryCourses, setPrimaryCourses] = useState(data.primaryCourses);
  const [suggestedExpanded, setSuggestedExpanded] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseViewerOpen, setCourseViewerOpen] = useState(false);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    // Optionally update local state for immediate UI feedback
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
    console.log('Preview clicked for course:', courseId);
    const course = [...primaryCourses, ...data.suggestedCourses.map(s => s.course)]
      .find(c => c.id === courseId);
    console.log('Found course:', course);
    if (course) {
      setPreviewCourse(course);
      setPreviewModalOpen(true);
      console.log('Preview modal should open');
    } else {
      console.error('Course not found for preview:', courseId);
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation - Responsive Intégrée */}
      <motion.aside 
        initial={{ width: sidebarOpen ? 320 : 0 }}
        animate={{ width: sidebarOpen ? 320 : 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white border-r border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="w-80 p-6">
          {/* Header Sidebar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold">
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
          <nav className="space-y-2">
            <div className="bg-black text-white rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BookOpen size={20} />
                <span className="font-medium">Mes Cours</span>
              </div>
              <p className="text-gray-300 text-sm mt-1">Module actuel</p>
            </div>
            
            <button className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 text-gray-700">
                <Target size={20} />
                <span className="font-medium">Planification</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Organisez votre apprentissage</p>
            </button>
            
            <button className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 text-gray-700">
                <TrendingUp size={20} />
                <span className="font-medium">Progression</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Suivez vos performances</p>
            </button>
            
            <button className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 text-gray-700">
                <Users size={20} />
                <span className="font-medium">Communauté</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Échangez avec d'autres étudiants</p>
            </button>
          </nav>
        </div>
      </motion.aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Clean */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">X</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Science Made Simple</h1>
                <p className="text-sm text-gray-500">Catalogue</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Bonjour, {data.user.name}</p>
              <p className="text-xs text-gray-500">{data.user.year}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {data.user.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Métriques simplifiées */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
          >
            {/* Métriques Clean */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{primaryCourses.length}</h3>
                  <p className="text-gray-500 text-sm">Cours actifs</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {bestRanking ? `#${bestRanking}` : 'N/A'}
                  </h3>
                  <p className="text-gray-500 text-sm">Rang</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Clock className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{Math.round(totalHours)}h</h3>
                  <p className="text-gray-500 text-sm">Temps d'étude</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Target className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{averageProgress}%</h3>
                  <p className="text-gray-500 text-sm">Progression</p>
                </div>
              </div>
            </div>
        </motion.div>

        {/* Section Mes Cours Favoris avec Drag & Drop */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="text-yellow-500" size={24} />
              Mes Cours Favoris
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {primaryCourses.length} cours • Réorganisez par glisser-déposer
              </span>
            </div>
          </div>

          {primaryCourses.length > 0 ? (
            <ClientOnly fallback={
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
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
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
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
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun cours favori
              </h3>
              <p className="text-gray-600 mb-4">
                Sélectionnez des cours ci-dessous pour les ajouter à vos favoris
              </p>
            </div>
          )}
        </motion.section>

        {/* Section Cours Suggérés par Faculté */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div 
            className="flex items-center justify-between mb-6 cursor-pointer"
            onClick={() => setSuggestedExpanded(!suggestedExpanded)}
          >
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-500" size={24} />
              Les étudiants de votre faculté suivent également
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Basé sur {data.facultyStats.totalStudents} étudiants de {data.user.faculty}
              </span>
              {suggestedExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>

          {suggestedExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {data.suggestedCourses.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="relative"
                  >
                    <CourseCard 
                      course={suggestion.course}
                      onToggleFavorite={handleToggleFavorite}
                      onPreview={handlePreviewCourse}
                      onEnroll={onEnrollCourse}
                      onOpenCourse={handleOpenCourse}
                    />
                    
                    {/* Stats de suggestion */}
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {suggestion.enrolledStudents} étudiants
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Call to action */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Envie de dépasser vos camarades ? 🚀
                </h3>
                <p className="text-gray-600 mb-4">
                  Ajoutez ces cours à vos favoris et voyez votre progression comparée à la moyenne faculté
                </p>
                <button className="px-4 py-2.5 text-sm bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-sm hover:shadow-md rounded-lg transition-all duration-200">
                  Découvrir tous les cours disponibles
                </button>
              </div>
            </motion.div>
          )}
        </motion.section>
        
        </div>
      </div>

      {/* Course Viewer Modal */}
      <CourseViewer
        course={selectedCourse}
        isOpen={courseViewerOpen}
        onClose={handleCloseCourseViewer}
      />

      {/* Preview Modal */}
      <PreviewModal
        course={previewCourse}
        isOpen={previewModalOpen}
        onClose={handleClosePreviewModal}
        onEnroll={onEnrollCourse}
        onNavigateToUnlock={() => {
          handleClosePreviewModal();
          // Pas de module "Débloquer" dans Dashboard pour l'instant
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

// Import manquant pour Star
const Star = ({ className, size }: { className?: string; size?: number }) => (
  <svg width={size || 24} height={size || 24} className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
