import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Users,
  Coffee,
  Book,
  Zap,
  ArrowRight,
  Edit3,
  RotateCcw
} from 'lucide-react';
import { StudyPlan, StudySession } from '@/types';

interface GeneratedPlanDisplayProps {
  plan: StudyPlan;
  onEditPlan?: () => void;
  onRegeneratePlan?: () => void;
}

export function GeneratedPlanDisplay({ plan, onEditPlan, onRegeneratePlan }: GeneratedPlanDisplayProps) {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());

  // Simuler l'état d'avancement
  const getSessionStatus = (session: StudySession) => {
    const now = new Date();
    const sessionDate = session.date;
    
    if (completedSessions.has(session.id)) return 'completed';
    if (sessionDate < now) return 'missed';
    if (sessionDate.toDateString() === now.toDateString()) return 'today';
    return 'upcoming';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-green-500" size={16} />;
      case 'missed': return <AlertTriangle className="text-red-500" size={16} />;
      case 'today': return <Zap className="text-blue-500" size={16} />;
      default: return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-l-green-500 bg-green-50';
      case 'missed': return 'border-l-red-500 bg-red-50';
      case 'today': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const toggleSessionCompletion = (sessionId: string) => {
    setCompletedSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  const formatTime = (date: Date) => {
    // Vérifier si la date est valide
    if (!date || isNaN(date.getTime())) {
      console.warn('Date invalide reçue dans formatTime:', date);
      return '--:--';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    // Vérifier si la date est valide
    if (!date || isNaN(date.getTime())) {
      console.warn('Date invalide reçue:', date);
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  // Grouper les sessions par jour
  const sessionsByDay = plan.sessions.reduce((acc, session) => {
    const dayKey = session.date.toDateString();
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(session);
    return acc;
  }, {} as Record<string, StudySession[]>);

  const days = Object.keys(sessionsByDay).sort();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Header du planning - Design moderne */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Planning généré</h2>
            <p className="text-gray-600 text-base mt-2">
              {plan.sessions.length} sessions • {plan.totalEstimatedHours}h au total
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Progression - Design moderne */}
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <div className="text-3xl font-bold text-indigo-600">{plan.progressPercentage || 0}%</div>
              <div className="text-sm text-indigo-700 font-medium">Progression</div>
            </div>
            
            {/* Actions - Boutons modernes */}
            <div className="flex gap-3">
              <motion.button
                onClick={onEditPlan}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all"
              >
                <Edit3 size={16} />
                <span className="text-sm font-medium">Modifier</span>
              </motion.button>
              <motion.button
                onClick={onRegeneratePlan}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
              >
                <RotateCcw size={16} />
                <span className="text-sm font-medium">Régénérer</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Barre de progression moderne */}
        <div className="mt-6">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${plan.progressPercentage || 0}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Contenu du planning */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {days.map((dayKey, dayIndex) => {
            const dayDate = new Date(dayKey);
            const daySessions = sessionsByDay[dayKey];
            
            return (
              <motion.div
                key={dayKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* En-tête du jour - Design moderne */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 capitalize text-lg">
                      {formatDate(dayDate)}
                    </h3>
                    <div className="px-3 py-1 bg-white rounded-full border border-gray-200">
                      <span className="text-sm text-gray-600 font-medium">
                        {daySessions.length} session{daySessions.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sessions du jour */}
                <div className="divide-y divide-gray-100">
                  {daySessions.map((session, sessionIndex) => {
                    const status = getSessionStatus(session);
                    // startTime et endTime sont des strings (format "HH:MM")
                    const startTimeStr = session.startTime;
                    const endTimeStr = session.endTime;
                    
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (dayIndex * 0.1) + (sessionIndex * 0.05) }}
                        className={`p-6 border-l-4 ${getStatusColor(status)} hover:bg-gray-50 transition-all cursor-pointer group`}
                        onClick={() => toggleSessionCompletion(session.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {getStatusIcon(status)}
                              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {session.courseId} - {session.topic}
                              </h4>
                              {status === 'today' && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                                  Aujourd'hui
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <span className="font-medium">{startTimeStr} - {endTimeStr}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Book size={16} className="text-gray-400" />
                                <span>{session.duration} min</span>
                              </div>
                              {session.breakDuration && (
                                <div className="flex items-center gap-2">
                                  <Coffee size={16} className="text-gray-400" />
                                  <span>Pause {session.breakDuration} min</span>
                                </div>
                              )}
                            </div>

                            {session.description && (
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {session.description}
                              </p>
                            )}
                          </div>

                          <div className="ml-6 flex flex-col items-end gap-2">
                            {status === 'completed' && (
                              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                                <CheckCircle2 size={16} />
                                Terminé
                              </div>
                            )}
                            {status === 'missed' && (
                              <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 px-3 py-1 rounded-full">
                                <AlertTriangle size={16} />
                                Manqué
                              </div>
                            )}
                            {status === 'today' && (
                              <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full">
                                <Zap size={16} />
                                En cours
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Message d'encouragement - Design moderne */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-2xl p-8"
        >
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                Ton planning s'adapte en temps réel !
              </h3>
              <p className="text-gray-700 leading-relaxed">
                En retard ? Je propose automatiquement des sessions de rattrapage. 
                En avance ? J'optimise ton planning pour maximiser tes révisions. 
                Tu n'es jamais seul dans tes études ! 🚀
              </p>
              
              {/* Features highlights */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-white/60 rounded-xl">
                  <TrendingUp className="text-indigo-600 mx-auto mb-2" size={20} />
                  <span className="text-xs text-gray-700 font-medium">Adaptation auto</span>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-xl">
                  <Users className="text-purple-600 mx-auto mb-2" size={20} />
                  <span className="text-xs text-gray-700 font-medium">Buddy system</span>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-xl">
                  <Zap className="text-pink-600 mx-auto mb-2" size={20} />
                  <span className="text-xs text-gray-700 font-medium">Motivation</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
