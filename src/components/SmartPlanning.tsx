'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Composant sortable pour les événements
interface SortableEventProps {
  event: CalendarEvent;
  onDelete?: (id: string) => void;
  onEdit?: (event: CalendarEvent) => void;
}

const SortableEvent: React.FC<SortableEventProps> = ({ event, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `event-${event.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'study': return '📚';
      case 'exam': return '📝';
      case 'deadline': return '⏰';
      case 'break': return '☕';
      default: return '📅';
    }
  };

  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-orange-500 to-amber-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200';
      case 'medium': return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
      case 'low': return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative p-5 rounded-2xl cursor-move transition-all duration-300 border-2
        hover:shadow-xl hover:scale-[1.02] group
        ${getPriorityBg(event.priority)}
        ${isDragging ? 'z-10 shadow-2xl scale-105 rotate-2' : ''}
      `}
    >
      {/* Barre de priorité */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getPriorityGradient(event.priority)} rounded-t-2xl`}></div>
      
      {/* Icône de drag flottante */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-6 h-6 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
          ⋮⋮
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-12 h-12 bg-gradient-to-r ${getPriorityGradient(event.priority)} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-900 text-lg">{event.title}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                event.priority === 'high' ? 'bg-red-100 text-red-800' :
                event.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
              }`}>
                {event.priority === 'high' ? 'Urgent' : 
                 event.priority === 'medium' ? 'Important' : 'Normal'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <span>🕐</span>
                <span className="font-medium">
                  {event.start.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })} - {event.end.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>{event.start.toLocaleDateString('fr-FR', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short' 
                })}</span>
              </div>
            </div>
            {event.course && (
              <div className="text-sm text-gray-700 bg-white/60 px-3 py-1 rounded-lg inline-block">
                📚 {event.course}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
              title="Modifier l'événement"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event.id);
              }}
              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
              title="Supprimer l'événement"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
import { 
  Calendar,
  Clock,
  Target,
  MessageCircle,
  Send,
  Bot,
  User,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Settings,
  Save,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Brain
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  message: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface StudyPreferences {
  // Horaires & rythme
  preferredHours: string[];
  sessionDuration: 25 | 50 | 90;
  sessionsPerDay: number;
  dailyStudyTime: number;
  weekendStudy: boolean;
  blockedDays: string[];
  
  // Style d'apprentissage
  subjectOrder: 'difficult-first' | 'favorite-first' | 'mixed';
  studyStyle: 'immersion' | 'variety';
  
  // Adaptation & flexibilité
  flexibilityLevel: 'strict' | 'flexible';
  notificationStyle: 'minimal' | 'motivating';
  
  // Suivi personnalisé
  dailyFeedback: boolean;
  examModeActive: boolean;
  examModeIntensityDays: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'study' | 'exam' | 'deadline' | 'break';
  course?: string;
  priority: 'low' | 'medium' | 'high';
  isGenerated?: boolean;
}

const defaultPreferences: StudyPreferences = {
  preferredHours: ['09:00', '14:00', '19:00'],
  sessionDuration: 50,
  sessionsPerDay: 3,
  dailyStudyTime: 2,
  weekendStudy: false,
  blockedDays: [],
  subjectOrder: 'difficult-first',
  studyStyle: 'variety',
  flexibilityLevel: 'flexible',
  notificationStyle: 'motivating',
  dailyFeedback: true,
  examModeActive: false,
  examModeIntensityDays: 7
};

const mockExams = [
  { 
    name: 'Analyse Mathématique', 
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
    priority: 'high' as const 
  },
  { 
    name: 'Physique Quantique', 
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), 
    priority: 'medium' as const 
  }
];

// Composant droppable pour les jours du calendrier
interface DroppableDayProps {
  date: Date;
  children: React.ReactNode;
  className?: string;
}

const DroppableDay: React.FC<DroppableDayProps & { 
  onClick?: () => void; 
  isSelected?: boolean; 
}> = ({ date, children, className, onClick, isSelected }) => {
  const dayId = `day-${date.toISOString().split('T')[0]}`;
  const { setNodeRef, isOver } = useDroppable({
    id: dayId,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`${className} ${
        isOver ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : ''
      } ${
        isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : ''
      } ${
        onClick ? 'cursor-pointer hover:bg-gray-50' : ''
      } transition-all duration-200`}
    >
      {children}
    </div>
  );
};

// Composant draggable pour les événements du calendrier
interface DraggableCalendarEventProps {
  event: CalendarEvent;
  formatTime: (date: Date) => string;
  sessionDuration: number;
  compact?: boolean; // Pour la vue mensuelle compacte
}

const DraggableCalendarEvent: React.FC<DraggableCalendarEventProps> = ({ 
  event, 
  formatTime, 
  sessionDuration,
  compact = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (compact) {
    // Version compacte pour la vue mensuelle
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`text-xs p-1 rounded text-white truncate cursor-move transition-all hover:scale-105 ${
          event.type === 'exam' ? 'bg-red-500' :
          event.priority === 'high' ? 'bg-orange-500' :
          event.type === 'study' ? 'bg-blue-500' : 'bg-gray-500'
        } ${isDragging ? 'z-10 shadow-lg' : ''}`}
        title={`${event.title} - ${formatTime(event.start)} (Glisser pour réorganiser)`}
      >
        {event.title}
      </div>
    );
  }

  // Version complète pour la vue hebdomadaire
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`text-xs p-3 rounded-lg text-white cursor-move transition-all hover:scale-105 ${
        event.type === 'exam' ? 'bg-red-500' :
        event.priority === 'high' ? 'bg-orange-500' :
        event.type === 'study' ? 'bg-blue-500' : 'bg-gray-500'
      } ${isDragging ? 'z-10 shadow-lg' : ''}`}
      title={`${event.title} - ${formatTime(event.start)} à ${formatTime(event.end)} (Glisser pour réorganiser)`}
    >
      <div className="font-medium">{formatTime(event.start)}</div>
      <div className="opacity-90 mt-1">{event.title}</div>
      <div className="text-xs opacity-75 mt-1">
        {sessionDuration}min
      </div>
    </div>
  );
};

export function SmartPlanning() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('month');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: "Salut ! 👋 Je suis ton assistant de planification. Je vais t'aider à organiser ton calendrier d'études de manière optimale. Peux-tu me dire quand tu préfères étudier ?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [preferences, setPreferences] = useState<StudyPreferences>(defaultPreferences);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [generatedEvents, setGeneratedEvents] = useState<CalendarEvent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Configuration pour le drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Récupérer l'événement qui est déplacé (en retirant le préfixe event-)
    const eventId = typeof active.id === 'string' && active.id.startsWith('event-') 
      ? active.id.replace('event-', '') 
      : active.id;
    const draggedEvent = generatedEvents.find(e => e.id === eventId);
    if (!draggedEvent) return;

    // Si on fait juste un réordonnement dans la liste
    if (over.id && typeof over.id === 'string' && over.id.startsWith('event-')) {
      if (active.id !== over?.id) {
        const oldIndex = generatedEvents.findIndex((item) => `event-${item.id}` === active.id);
        const newIndex = generatedEvents.findIndex((item) => `event-${item.id}` === over?.id);

        const newEvents = arrayMove(generatedEvents, oldIndex, newIndex);
        setGeneratedEvents(newEvents);
      }
      return;
    }

    // Si on déplace vers un jour spécifique (nouveau système pour drag entre jours)
    if (over.id && typeof over.id === 'string' && over.id.startsWith('day-')) {
      const targetDateStr = over.id.replace('day-', '');
      const targetDate = new Date(targetDateStr);
      
      // Créer un nouvel événement avec la nouvelle date
      const newEvent = {
        ...draggedEvent,
        start: new Date(targetDate.setHours(
          draggedEvent.start.getHours(),
          draggedEvent.start.getMinutes()
        )),
        end: new Date(targetDate.setHours(
          draggedEvent.end.getHours(),
          draggedEvent.end.getMinutes()
        ))
      };

      // Remplacer l'ancien événement par le nouveau
      setGeneratedEvents(events => 
        events.map(event => event.id === draggedEvent.id ? newEvent : event)
      );
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setGeneratedEvents(events => events.filter(event => event.id !== eventId));
  };

  const handleEditEvent = (editedEvent: CalendarEvent) => {
    setGeneratedEvents(events => 
      events.map(event => event.id === editedEvent.id ? editedEvent : event)
    );
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const botResponses = {
    morning: "Parfait ! Les matinées sont excellentes pour la concentration. À quelle heure préfères-tu commencer ? 8h, 9h ou 10h ?",
    afternoon: "L'après-midi c'est bien aussi ! Tu es plutôt 14h-16h ou 16h-18h ?",
    evening: "Les soirées peuvent être productives ! Plutôt 19h-21h ou 21h-23h ?",
    duration: "Combien de temps veux-tu étudier par session ? Je recommande 25min (Pomodoro), 50min ou 90min pour du travail profond.",
    breaks: "Excellente habitude ! Des pauses de 15min toutes les heures ou 30min toutes les 2h ?",
    weekend: "Et les week-ends ? Tu préfères te reposer ou continuer à étudier mais plus légèrement ?",
    exams: "J'ai vu que tu as des examens bientôt. Veux-tu que je prioritise automatiquement les révisions ?",
    generated: "Super ! J'ai généré ton planning personnalisé. Regarde le calendrier pour voir tes créneaux optimisés ! 📅"
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const message = inputMessage.toLowerCase();
      let botResponse = "Je comprends ! Laisse-moi noter ça. Autre chose à me dire sur tes préférences ?";

      if (message.includes('matin')) {
        botResponse = botResponses.morning;
      } else if (message.includes('après-midi') || message.includes('aprem')) {
        botResponse = botResponses.afternoon;
      } else if (message.includes('soir')) {
        botResponse = botResponses.evening;
      } else if (message.includes('session') || message.includes('durée')) {
        botResponse = botResponses.duration;
      } else if (message.includes('pause') || message.includes('repos')) {
        botResponse = botResponses.breaks;
      } else if (message.includes('week') || message.includes('samedi') || message.includes('dimanche')) {
        botResponse = botResponses.weekend;
      } else if (message.includes('examen') || message.includes('test')) {
        botResponse = botResponses.exams;
      } else if (message.includes('génère') || message.includes('planning') || message.includes('calendrier')) {
        botResponse = botResponses.generated;
        generateCalendar();
      }

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateCalendar = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const events: CalendarEvent[] = [];
      const startDate = new Date();
      
      for (let i = 0; i < 14; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        if (!preferences.weekendStudy && (date.getDay() === 0 || date.getDay() === 6)) {
          continue;
        }

        preferences.preferredHours.slice(0, preferences.sessionsPerDay).forEach((hour, index) => {
          const [h, m] = hour.split(':').map(Number);
          const start = new Date(date);
          start.setHours(h, m, 0, 0);
          
          const end = new Date(start);
          end.setMinutes(start.getMinutes() + preferences.sessionDuration);

          const courses = ['Mathématiques', 'Physique', 'Chimie'];
          const course = courses[index % courses.length];

          events.push({
            id: `study-${i}-${index}`,
            title: `${course}`,
            start,
            end,
            type: 'study',
            course,
            priority: 'medium',
            isGenerated: true
          });
        });
      }

      mockExams.forEach(exam => {
        events.push({
          id: `exam-${exam.name}`,
          title: `📝 ${exam.name}`,
          start: exam.date,
          end: new Date(exam.date.getTime() + 2 * 60 * 60 * 1000),
          type: 'exam',
          course: exam.name,
          priority: exam.priority,
          isGenerated: false
        });

        for (let i = preferences.examModeIntensityDays; i >= 1; i--) {
          const revisionDate = new Date(exam.date);
          revisionDate.setDate(revisionDate.getDate() - i);
          
          const start = new Date(revisionDate);
          start.setHours(19, 0, 0, 0);
          const end = new Date(start);
          end.setHours(21, 0, 0, 0);

          events.push({
            id: `revision-${exam.name}-${i}`,
            title: `🔥 ${exam.name}`,
            start,
            end,
            type: 'study',
            course: exam.name,
            priority: 'high',
            isGenerated: true
          });
        }
      });

      setGeneratedEvents(events);
      setIsGenerating(false);
    }, 2000);
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      week.push(weekDay);
    }
    
    return week;
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Premier lundi de la grille (peut être dans le mois précédent)
    const startDay = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDay.setDate(firstDay.getDate() + diff);
    
    const days = [];
    const current = new Date(startDay);
    
    // Générer 42 jours (6 semaines)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDay = (date: Date) => {
    return generatedEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
  };

  const getSelectedDayEvents = () => {
    if (!selectedDate) return [];
    return getEventsForDay(selectedDate);
  };

  return (
    <div className="h-[calc(100vh-73px)] flex bg-gray-50">
      {/* Sidebar IA à gauche */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header de l'assistant */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Assistant IA</h2>
                <p className="text-xs text-gray-500">Planification personnalisée</p>
              </div>
            </div>
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className={`p-2 rounded-lg transition-colors ${
                showPreferences 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
        
        {/* Préférences ou Chat */}
        {showPreferences ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-4">Préférences d'étude</h3>
            
            <div className="space-y-4">
              {/* Durée des sessions */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Durée des sessions
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[25, 50, 90].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setPreferences(prev => ({ ...prev, sessionDuration: duration as any }))}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        preferences.sessionDuration === duration
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {duration}min
                    </button>
                  ))}
                </div>
              </div>

              {/* Sessions par jour */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Sessions/jour: {preferences.sessionsPerDay}
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={preferences.sessionsPerDay}
                  onChange={(e) => setPreferences(prev => ({ ...prev, sessionsPerDay: parseInt(e.target.value) }))}
                  className="w-full accent-black"
                />
              </div>

              {/* Ordre des matières */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Ordre des matières
                </label>
                <div className="space-y-1">
                  {[
                    { key: 'difficult-first', label: 'Difficiles d\'abord' },
                    { key: 'favorite-first', label: 'Préférées d\'abord' },
                    { key: 'mixed', label: 'Mélangé' }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setPreferences(prev => ({ ...prev, subjectOrder: option.key as any }))}
                      className={`w-full p-2 rounded-lg text-sm text-left transition-colors ${
                        preferences.subjectOrder === option.key
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style d'étude */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Style d'étude
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, studyStyle: 'immersion' }))}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      preferences.studyStyle === 'immersion'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Immersion
                  </button>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, studyStyle: 'variety' }))}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      preferences.studyStyle === 'variety'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Variété
                  </button>
                </div>
              </div>

              {/* Week-end */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Week-end</span>
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, weekendStudy: !prev.weekendStudy }))}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    preferences.weekendStudy ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    preferences.weekendStudy ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Mode strict */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Mode strict</span>
                <button
                  onClick={() => setPreferences(prev => ({ 
                    ...prev, 
                    flexibilityLevel: prev.flexibilityLevel === 'strict' ? 'flexible' : 'strict' 
                  }))}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    preferences.flexibilityLevel === 'strict' ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    preferences.flexibilityLevel === 'strict' ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Mode examen */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Mode examen</span>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, examModeActive: !prev.examModeActive }))}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      preferences.examModeActive ? 'bg-black' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      preferences.examModeActive ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                {preferences.examModeActive && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Intensifier {preferences.examModeIntensityDays}j avant
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="14"
                      value={preferences.examModeIntensityDays}
                      onChange={(e) => setPreferences(prev => ({ ...prev, examModeIntensityDays: parseInt(e.target.value) }))}
                      className="w-full accent-black"
                    />
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowPreferences(false)}
                className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Retour au chat
              </button>
            </div>
          </div>
        ) : (
          /* Zone de chat */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      message.type === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      message.type === 'bot' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {message.type === 'bot' ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.type === 'bot'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-black text-white'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <span className="text-xs opacity-60 mt-1 block">
                        {message.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Bot size={14} />
                    </div>
                    <div className="bg-gray-100 px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={chatEndRef} />
            </div>

            {/* Input zone */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Dis-moi tes préférences..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {[
                  'Matin préféré',
                  'Pauses fréquentes', 
                  'Pas weekend',
                  'Génère planning'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      const messages = {
                        'Matin préféré': 'Je préfère étudier le matin',
                        'Pauses fréquentes': 'J\'aime les pauses fréquentes',
                        'Pas weekend': 'Les week-ends je me repose',
                        'Génère planning': 'Génère mon planning optimal'
                      };
                      setInputMessage(messages[suggestion as keyof typeof messages]);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone principale - Calendrier pleine largeur */}
      <div className="flex-1 flex flex-col">
        {/* Header du calendrier */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Planification Intelligente</h1>
              <p className="text-gray-600">Calendrier optimisé par l'IA selon tes préférences</p>
            </div>
            <button
              onClick={generateCalendar}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {isGenerating ? 'Génération...' : 'Générer Planning'}
            </button>
          </div>
        </div>

        {/* Contenu du calendrier */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 text-lg">Génération de votre planning optimal...</p>
                <p className="text-gray-500 text-sm mt-2">Analyse de vos préférences en cours</p>
              </div>
            </div>
          ) : generatedEvents.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Aucun planning généré
                </h3>
                <p className="text-gray-600 mb-6">
                  Discutez avec l'assistant IA ou générez un planning par défaut
                </p>
                <button
                  onClick={generateCalendar}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Générer Planning
                </button>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="max-w-7xl mx-auto">
              {/* Header calendrier avec navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      if (calendarView === 'week') {
                        newDate.setDate(newDate.getDate() - 7);
                      } else {
                        newDate.setMonth(newDate.getMonth() - 1);
                      }
                      setCurrentDate(newDate);
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors border border-gray-200"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentDate.toLocaleDateString('fr-FR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </h2>
                  
                  <button
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      if (calendarView === 'week') {
                        newDate.setDate(newDate.getDate() + 7);
                      } else {
                        newDate.setMonth(newDate.getMonth() + 1);
                      }
                      setCurrentDate(newDate);
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors border border-gray-200"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sélecteur de vue */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setCalendarView('week')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        calendarView === 'week'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Semaine
                    </button>
                    <button
                      onClick={() => setCalendarView('month')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        calendarView === 'month'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Mois
                    </button>
                  </div>

                  {/* Légende */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Étude</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Révision</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Examen</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vue conditionnelle */}
              {calendarView === 'week' ? (
                /* Vue semaine */
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                      <div key={day} className="bg-gray-50 p-4 text-center font-medium text-gray-700">
                        {day}
                      </div>
                    ))}
                    
                    {getWeekDays(currentDate).map((date, index) => {
                      const dayEvents = getEventsForDay(date);
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      return (
                        <DroppableDay
                          key={index}
                          date={date}
                          className={`bg-white p-4 min-h-48 ${
                            isToday ? 'ring-2 ring-black ring-inset' : ''
                          }`}
                          onClick={() => handleDaySelect(date)}
                          isSelected={selectedDate?.toDateString() === date.toDateString()}
                        >
                          <div className={`text-lg font-medium mb-3 ${
                            isToday ? 'text-black' : 'text-gray-900'
                          }`}>
                            {date.getDate()}
                          </div>
                          
                          <SortableContext 
                            items={dayEvents.map(event => event.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2">
                              {dayEvents.map((event) => (
                                <DraggableCalendarEvent
                                  key={event.id}
                                  event={event}
                                  formatTime={formatTime}
                                  sessionDuration={preferences.sessionDuration}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DroppableDay>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Vue mensuelle */
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                      <div key={day} className="bg-gray-50 p-3 text-center font-medium text-gray-700 text-sm">
                        {day}
                      </div>
                    ))}
                    
                    {getMonthDays(currentDate).map((date, index) => {
                      const dayEvents = getEventsForDay(date);
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                      
                      return (
                        <DroppableDay
                          key={index}
                          date={date}
                          className={`bg-white p-2 min-h-24 ${
                            isToday ? 'ring-2 ring-black ring-inset' : ''
                          } ${
                            !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                          }`}
                          onClick={() => handleDaySelect(date)}
                          isSelected={selectedDate?.toDateString() === date.toDateString()}
                        >
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? 'text-black' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {date.getDate()}
                          </div>
                          
                          <SortableContext 
                            items={dayEvents.slice(0, 3).map(event => event.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-1">
                              {dayEvents.slice(0, 3).map((event) => (
                                <DraggableCalendarEvent
                                  key={event.id}
                                  event={event}
                                  formatTime={formatTime}
                                  sessionDuration={preferences.sessionDuration}
                                  compact={true}
                                />
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{dayEvents.length - 3}
                                </div>
                              )}
                            </div>
                          </SortableContext>
                        </DroppableDay>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Liste des événements du jour sélectionné */}
              <div className="mt-8">
                {selectedDate ? (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Événements du {selectedDate.toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Glissez-déposez pour réorganiser ou déplacer vers d'autres jours
                      </p>
                    </div>

                    <SortableContext 
                      items={getSelectedDayEvents().map(event => `event-${event.id}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4">
                        {getSelectedDayEvents().map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                          >
                            <SortableEvent
                              event={event}
                              onDelete={handleDeleteEvent}
                              onEdit={handleEditEvent}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </SortableContext>

                    {getSelectedDayEvents().length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          📅
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun événement ce jour</h4>
                        <p className="text-gray-600">
                          Glissez-déposez des événements depuis d'autres jours ou générez un nouveau planning
                        </p>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      👆
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un jour</h4>
                    <p className="text-gray-600">
                      Cliquez sur un jour du calendrier pour voir ses événements
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
