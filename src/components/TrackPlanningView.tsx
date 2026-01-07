'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Video,
  BookOpen,
  Target,
  Plus,
  ChevronLeft,
  ChevronRight,
  Bell,
  CheckCircle2,
  Circle,
  CalendarPlus,
  Play
} from 'lucide-react';

interface StudySession {
  id: string;
  title: string;
  type: 'study-room' | 'deadline' | 'quiz' | 'lesson' | 'buddy-session';
  date: Date;
  duration?: number;
  participants?: number;
  buddies?: { id: string; name: string }[];
}

interface LessonMilestone {
  id: string;
  title: string;
  recommendedDate: Date;
  isCompleted: boolean;
  lessonId: string;
}

interface TrackPlanningViewProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
  totalLessons?: number;
  completedLessons?: number;
}

export function TrackPlanningView({ 
  isOpen, 
  onClose, 
  trackTitle,
  totalLessons = 12,
  completedLessons = 4
}: TrackPlanningViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [sessions] = useState<StudySession[]>([
    {
      id: '1',
      title: 'Study Room - Révision Chapitre 3',
      type: 'study-room',
      date: new Date(Date.now() + 3600000 * 2),
      duration: 60,
      participants: 5,
      buddies: [
        { id: 'b1', name: 'Sarah M.' },
        { id: 'b2', name: 'Alex K.' }
      ]
    },
    {
      id: '2',
      title: 'Quiz - Intégrales doubles',
      type: 'quiz',
      date: new Date(Date.now() + 86400000),
      duration: 20
    },
    {
      id: '3',
      title: 'Session avec Thomas',
      type: 'buddy-session',
      date: new Date(Date.now() + 86400000 * 2),
      duration: 45,
      buddies: [{ id: 'b3', name: 'Thomas D.' }]
    },
    {
      id: '4',
      title: 'Deadline - Exercices Série 4',
      type: 'deadline',
      date: new Date(Date.now() + 86400000 * 3),
    },
    {
      id: '5',
      title: 'Leçon 5 - Théorème de Green',
      type: 'lesson',
      date: new Date(Date.now() + 86400000 * 4),
      duration: 35
    }
  ]);

  const [milestones] = useState<LessonMilestone[]>([
    { id: 'm1', title: 'Chapitre 1 - Introduction', recommendedDate: new Date(Date.now() - 86400000 * 7), isCompleted: true, lessonId: 'l1' },
    { id: 'm2', title: 'Chapitre 2 - Fondamentaux', recommendedDate: new Date(Date.now() - 86400000 * 5), isCompleted: true, lessonId: 'l2' },
    { id: 'm3', title: 'Chapitre 3 - Applications', recommendedDate: new Date(Date.now() - 86400000 * 3), isCompleted: true, lessonId: 'l3' },
    { id: 'm4', title: 'Chapitre 4 - Exercices pratiques', recommendedDate: new Date(Date.now() - 86400000), isCompleted: true, lessonId: 'l4' },
    { id: 'm5', title: 'Chapitre 5 - Théorème de Green', recommendedDate: new Date(Date.now() + 86400000 * 2), isCompleted: false, lessonId: 'l5' },
    { id: 'm6', title: 'Chapitre 6 - Théorème de Stokes', recommendedDate: new Date(Date.now() + 86400000 * 5), isCompleted: false, lessonId: 'l6' },
    { id: 'm7', title: 'Chapitre 7 - Révisions', recommendedDate: new Date(Date.now() + 86400000 * 8), isCompleted: false, lessonId: 'l7' },
    { id: 'm8', title: 'Examen final', recommendedDate: new Date(Date.now() + 86400000 * 10), isCompleted: false, lessonId: 'l8' }
  ]);

  const getSessionIcon = (type: StudySession['type']) => {
    switch (type) {
      case 'study-room': return <Video size={14} />;
      case 'quiz': return <Target size={14} />;
      case 'deadline': return <Clock size={14} />;
      case 'lesson': return <BookOpen size={14} />;
      case 'buddy-session': return <Users size={14} />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);

    if (days === 0 && hours < 0) return 'Passé';
    if (days === 0 && hours <= 2) return `Dans ${hours}h`;
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Demain';
    if (days < 7) return `Dans ${days} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const today = new Date();

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
          className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl"
        >
          {/* Header - Minimal */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Calendar size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Planning</h2>
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

            {/* Progress - Clean */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-600">Progression</span>
                  <span className="text-xs font-bold text-gray-900">{progressPercent}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-900 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">{completedLessons}/{totalLessons} leçons</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto flex">
            {/* Left: Calendar & Sessions */}
            <div className="flex-1 p-6 border-r border-gray-100">
              {/* Week Navigation */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 text-sm">Cette semaine</h3>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft size={16} className="text-gray-500" />
                  </button>
                  <span className="text-xs text-gray-600 min-w-[100px] text-center">
                    {weekDays[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Week Days - Minimal */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {weekDays.map((day, index) => {
                  const isToday = day.toDateString() === today.toDateString();
                  const hasSessions = sessions.some(s => s.date.toDateString() === day.toDateString());
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        isToday 
                          ? 'bg-gray-900 text-white' 
                          : selectedDate.toDateString() === day.toDateString()
                            ? 'bg-gray-100 text-gray-900'
                            : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className={`text-[10px] ${isToday ? 'text-gray-400' : 'text-gray-400'}`}>
                        {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </p>
                      <p className="text-sm font-medium">
                        {day.getDate()}
                      </p>
                      {hasSessions && !isToday && (
                        <div className="w-1 h-1 bg-blue-600 rounded-full mx-auto mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Upcoming Sessions */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 text-sm">Prochaines sessions</h3>
                <button className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                  <Plus size={12} />
                  Créer
                </button>
              </div>

              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                        {getSessionIcon(session.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{session.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {formatDate(session.date)}
                            {session.duration && ` · ${session.duration}min`}
                          </span>
                          {session.participants && (
                            <span className="flex items-center gap-1">
                              <Users size={10} />
                              {session.participants}
                            </span>
                          )}
                        </div>
                        {session.buddies && session.buddies.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex -space-x-1.5">
                              {session.buddies.slice(0, 3).map((buddy) => (
                                <div
                                  key={buddy.id}
                                  className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center ring-2 ring-white"
                                >
                                  <span className="text-white text-[8px] font-medium">
                                    {buddy.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400">
                              avec {session.buddies.map(b => b.name.split(' ')[0]).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      {session.type === 'study-room' && (
                        <button className="px-2.5 py-1.5 bg-gray-900 rounded-lg text-xs font-medium text-white hover:bg-gray-800 transition-colors">
                          Rejoindre
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Roadmap */}
            <div className="w-72 p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 text-sm">Roadmap</h3>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell size={14} className="text-gray-500" />
                </button>
              </div>

              {/* Milestones Timeline - Clean */}
              <div className="space-y-0">
                {milestones.map((milestone, index) => {
                  const isNext = !milestone.isCompleted && milestones.slice(0, index).every(m => m.isCompleted);
                  
                  return (
                    <div key={milestone.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          milestone.isCompleted 
                            ? 'bg-gray-900 text-white'
                            : isNext
                              ? 'bg-blue-600 text-white ring-2 ring-blue-100'
                              : 'bg-gray-200 text-gray-400'
                        }`}>
                          {milestone.isCompleted ? (
                            <CheckCircle2 size={10} />
                          ) : isNext ? (
                            <Play size={8} />
                          ) : (
                            <Circle size={10} />
                          )}
                        </div>
                        {index < milestones.length - 1 && (
                          <div className={`w-0.5 h-10 ${
                            milestone.isCompleted ? 'bg-gray-300' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      
                      <div className={`flex-1 pb-3 ${isNext ? 'bg-white -mx-2 px-2 py-1.5 rounded-lg border border-blue-100' : ''}`}>
                        <h4 className={`text-xs font-medium ${
                          milestone.isCompleted ? 'text-gray-400' : isNext ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {milestone.title}
                        </h4>
                        <p className={`text-[10px] ${
                          milestone.isCompleted ? 'text-gray-300' : isNext ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {milestone.isCompleted ? 'Complété' : formatDate(milestone.recommendedDate)}
                        </p>
                        {isNext && (
                          <button className="mt-1.5 flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-medium hover:bg-blue-700 transition-colors">
                            <Play size={8} />
                            Commencer
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions - Minimal */}
              <div className="mt-6 space-y-1.5">
                <button className="w-full flex items-center justify-between p-2.5 bg-white rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <div className="flex items-center gap-2">
                    <CalendarPlus size={14} className="text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">Ajouter au calendrier</span>
                  </div>
                  <ChevronRight size={12} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-2.5 bg-white rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">Proposer une session</span>
                  </div>
                  <ChevronRight size={12} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
