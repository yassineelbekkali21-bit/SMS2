'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight,
  Play, 
  Check, 
  Clock,
  Target,
  Users,
  MessageCircle,
  Calendar,
  ArrowRight
} from 'lucide-react';

// Mock data
const mockTrack = {
  id: 'ondes-mecaniques',
  title: 'Ondes mécaniques',
  examDate: new Date('2025-02-15'),
  lessons: [
    { id: '1', title: 'Introduction aux ondes', lessonNumber: '1.1', duration: '25 min', scheduledDate: new Date('2024-12-23'), status: 'completed' as const },
    { id: '2', title: 'Types d\'ondes mécaniques', lessonNumber: '1.2', duration: '30 min', scheduledDate: new Date('2024-12-26'), status: 'completed' as const },
    { id: '3', title: 'Caractéristiques des ondes', lessonNumber: '2.1', duration: '35 min', scheduledDate: new Date('2024-12-28'), status: 'completed' as const },
    { id: '4', title: 'Propagation des ondes', lessonNumber: '3.2', duration: '40 min', scheduledDate: new Date('2024-12-31'), status: 'current' as const },
    { id: '5', title: 'Réflexion et réfraction', lessonNumber: '3.3', duration: '35 min', scheduledDate: new Date('2025-01-03'), status: 'upcoming' as const },
    { id: '6', title: 'Interférences', lessonNumber: '4.1', duration: '45 min', scheduledDate: new Date('2025-01-07'), status: 'upcoming' as const },
    { id: '7', title: 'Diffraction', lessonNumber: '4.2', duration: '40 min', scheduledDate: new Date('2025-01-10'), status: 'upcoming' as const },
    { id: '8', title: 'Ondes stationnaires', lessonNumber: '5.1', duration: '50 min', scheduledDate: new Date('2025-01-14'), status: 'upcoming' as const },
    { id: '9', title: 'Applications pratiques', lessonNumber: '5.2', duration: '45 min', scheduledDate: new Date('2025-01-17'), status: 'upcoming' as const },
    { id: '10', title: 'Révision générale', lessonNumber: '6.1', duration: '60 min', scheduledDate: new Date('2025-01-20'), status: 'upcoming' as const },
  ]
};

export default function PlanningBisPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  
  const completedCount = mockTrack.lessons.filter(l => l.status === 'completed').length;
  const totalCount = mockTrack.lessons.length;
  const progressPercent = (completedCount / totalCount) * 100;
  const daysUntilExam = Math.max(0, Math.ceil((mockTrack.examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  
  const currentLesson = mockTrack.lessons.find(l => l.status === 'current');

  // Group lessons by week
  const getWeekKey = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${date.getFullYear()}-W${weekNumber}`;
  };

  const formatWeekLabel = (weekKey: string) => {
    const [year, week] = weekKey.split('-W');
    const firstDayOfYear = new Date(parseInt(year), 0, 1);
    const daysOffset = (parseInt(week) - 1) * 7 - firstDayOfYear.getDay() + 1;
    const weekStart = new Date(parseInt(year), 0, 1 + daysOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const formatDay = (d: Date) => d.getDate();
    const formatMonth = (d: Date) => d.toLocaleDateString('fr-FR', { month: 'short' });
    
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${formatDay(weekStart)} - ${formatDay(weekEnd)} ${formatMonth(weekEnd)}`.toUpperCase();
    }
    return `${formatDay(weekStart)} ${formatMonth(weekStart)} - ${formatDay(weekEnd)} ${formatMonth(weekEnd)}`.toUpperCase();
  };

  const groupedByWeek = mockTrack.lessons.reduce((acc, lesson) => {
    const weekKey = getWeekKey(lesson.scheduledDate);
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(lesson);
    return acc;
  }, {} as Record<string, typeof mockTrack.lessons>);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                <ChevronLeft size={18} />
                Retour
              </button>
              <div className="w-px h-6 bg-gray-200" />
              <Image 
                src="/brand/onboarding-logo.svg" 
                alt="SMS" 
                width={40} 
                height={40}
              />
            </div>
            
            {/* Mini progress */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Progression</p>
                <p className="text-sm font-bold text-gray-900">{completedCount}/{totalCount}</p>
              </div>
              <div className="w-24 h-2 rounded-full bg-gray-200">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progressPercent}%`, backgroundColor: '#00c2ff' }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {mockTrack.title}
          </h1>
          <p className="text-lg text-gray-500">
            Ton planning personnalisé vers la maîtrise
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          
          {/* Countdown Card */}
          <div className="rounded-2xl p-6 bg-white border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(72,198,237,0.15)' }}>
                <Target size={20} style={{ color: '#00c2ff' }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Examen dans</p>
                <p className="text-2xl font-bold text-gray-900">{daysUntilExam} jours</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {mockTrack.examDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          {/* Current Lesson Card */}
          {currentLesson && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#00c2ff' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
                  <Play size={20} className="text-white" fill="white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/70">En cours</p>
                  <p className="text-lg font-bold text-white">{currentLesson.title}</p>
                </div>
              </div>
              <button className="w-full py-3 rounded-xl text-sm font-bold bg-white text-gray-900 hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                Continuer
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Study Room Card */}
          <div className="rounded-2xl p-6 bg-white border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(72,198,237,0.15)' }}>
                <Users size={20} style={{ color: '#00c2ff' }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Study Room</p>
                <p className="text-lg font-bold text-gray-900">12 actifs</p>
              </div>
            </div>
            <button 
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: 'rgba(72,198,237,0.15)', color: '#00c2ff' }}
            >
              <MessageCircle size={16} />
              Rejoindre
            </button>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="rounded-2xl overflow-hidden bg-white border border-gray-200">
          
          {/* Timeline Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Ton parcours</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg transition-colors bg-gray-50 hover:bg-gray-100">
                <Calendar size={18} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Lessons List - Grouped by Week */}
          <div>
            {Object.entries(groupedByWeek).sort(([a], [b]) => a.localeCompare(b)).map(([weekKey, weekLessons], weekIndex) => (
              <div key={weekKey}>
                {/* Week Header */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gray-200 text-gray-600">
                    {formatWeekLabel(weekKey)}
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">{weekLessons.length} leçon{weekLessons.length > 1 ? 's' : ''}</span>
                </div>

                {/* Week Lessons */}
                <div className="divide-y divide-gray-100">
                  {weekLessons.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime()).map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (weekIndex * weekLessons.length + index) * 0.03 }}
                      onClick={() => setSelectedLesson(lesson.id === selectedLesson ? null : lesson.id)}
                      className={`flex items-center gap-5 px-6 py-5 cursor-pointer transition-all ${
                        lesson.status === 'current' 
                          ? 'bg-[#00c2ff]/5' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* Date Column */}
                      <div className="w-14 flex-shrink-0 text-center">
                        <p className="text-2xl font-bold" style={{ color: lesson.status === 'completed' ? '#d1d5db' : lesson.status === 'current' ? '#00c2ff' : '#374151' }}>
                          {lesson.scheduledDate.getDate()}
                        </p>
                        <p className="text-[10px] uppercase text-gray-400">
                          {lesson.scheduledDate.toLocaleDateString('fr-FR', { weekday: 'short' })}
                        </p>
                      </div>

                {/* Status Indicator */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: lesson.status === 'completed' 
                        ? '#1f2937' 
                        : lesson.status === 'current'
                        ? '#00c2ff'
                        : '#f3f4f6',
                      border: lesson.status === 'upcoming' ? '2px solid #e5e7eb' : 'none'
                    }}
                  >
                    {lesson.status === 'completed' ? (
                      <Check size={18} className="text-white" />
                    ) : lesson.status === 'current' ? (
                      <Play size={16} className="text-white ml-0.5" fill="white" />
                    ) : (
                      <Clock size={14} className="text-gray-400" />
                    )}
                  </div>
                </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold mb-1 ${
                          lesson.status === 'completed' ? 'text-gray-400' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Leçon {lesson.lessonNumber} · {lesson.duration}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0">
                        {lesson.status === 'current' && (
                          <button 
                            className="px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:brightness-110"
                            style={{ backgroundColor: '#00c2ff', color: '#ffffff' }}
                          >
                            <Play size={14} fill="white" />
                            Continuer
                          </button>
                        )}
                        {lesson.status === 'completed' && (
                          <button 
                            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            Revoir
                          </button>
                        )}
                        {lesson.status === 'upcoming' && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock size={14} />
                            Bientôt
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm mb-4 text-gray-500">
            Tu as des questions sur ce parcours ?
          </p>
          <button 
            className="px-6 py-3 rounded-full text-sm font-medium transition-all inline-flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <MessageCircle size={16} />
            Parler à un conseiller
          </button>
        </div>

      </main>
    </div>
  );
}

