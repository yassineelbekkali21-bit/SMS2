'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Clock, Trophy, Star, Flame, Sparkles, X, Gift,
  TrendingUp, Target, Award, Calendar
} from 'lucide-react';

interface XPBoostEvent {
  id: string;
  title: string;
  description: string;
  multiplier: number; // 2x, 3x, etc.
  startDate: Date;
  endDate: Date;
  type: 'weekend' | 'special' | 'challenge';
  icon: string;
  color: string;
  rewards?: string[];
  conditions?: string[];
}

interface XPBoostEventProps {
  events: XPBoostEvent[];
  onDismiss?: (eventId: string) => void;
}

// Événements mock
const MOCK_EVENTS: XPBoostEvent[] = [
  {
    id: 'weekend-boost',
    title: 'XP Boost Week-end',
    description: 'Gagne 2× plus d\'XP sur toutes tes activités !',
    multiplier: 2,
    startDate: new Date(Date.now() - 3600000),
    endDate: new Date(Date.now() + 86400000 * 2),
    type: 'weekend',
    icon: '⚡',
    color: 'from-yellow-400 to-orange-500',
    rewards: ['Badge spécial week-end', 'Bonus permanent +5% XP'],
    conditions: ['Compléter au moins 3 leçons', 'Obtenir 100% à un quiz'],
  },
  {
    id: 'study-marathon',
    title: 'Marathon d\'Étude',
    description: 'Triple XP pendant 24h pour les participants !',
    multiplier: 3,
    startDate: new Date(Date.now() + 86400000 * 3),
    endDate: new Date(Date.now() + 86400000 * 4),
    type: 'challenge',
    icon: '🏃',
    color: 'from-purple-400 to-pink-500',
    rewards: ['Couronne Marathon', '1000 XP bonus', 'Accès premium 7 jours'],
    conditions: ['Étudier pendant 4h minimum', 'Compléter 10 exercices'],
  },
];

export function XPBoostEvent({ events = MOCK_EVENTS, onDismiss }: XPBoostEventProps) {
  const [activeEvents, setActiveEvents] = useState<XPBoostEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<XPBoostEvent[]>([]);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});

  useEffect(() => {
    const now = new Date();
    const active = events.filter(e => e.startDate <= now && e.endDate > now);
    const upcoming = events.filter(e => e.startDate > now);
    
    setActiveEvents(active);
    setUpcomingEvents(upcoming);
  }, [events]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: Record<string, string> = {};
      
      [...activeEvents, ...upcomingEvents].forEach(event => {
        const targetDate = event.startDate > new Date() ? event.startDate : event.endDate;
        const diff = targetDate.getTime() - new Date().getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          if (days > 0) {
            newTimeLeft[event.id] = `${days}j ${hours}h`;
          } else if (hours > 0) {
            newTimeLeft[event.id] = `${hours}h ${minutes}m`;
          } else {
            newTimeLeft[event.id] = `${minutes}m ${seconds}s`;
          }
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeEvents, upcomingEvents]);

  if (activeEvents.length === 0 && upcomingEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Événements actifs */}
      {activeEvents.map((event) => (
        <motion.div
          key={event.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl border-2 border-gray-300 shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-900 p-6 relative">
            {onDismiss && (
              <button
                onClick={() => onDismiss(event.id)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                style={{ color: 'white' }}
              >
                <X size={18} style={{ color: 'white' }} />
              </button>
            )}

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center text-4xl">
                {event.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold" style={{ color: 'white' }}>{event.title}</h3>
                  <div className="px-2 py-1 bg-blue-600 rounded-lg text-xs font-bold" style={{ color: 'white' }}>
                    {event.multiplier}× XP
                  </div>
                </div>
                <p style={{ color: 'white', opacity: 0.75 }}>{event.description}</p>
              </div>
            </div>

            {/* Compte à rebours */}
            <div className="mt-4 flex items-center gap-2" style={{ color: 'white', opacity: 0.75 }}>
              <Clock size={16} />
              <span className="font-semibold">Se termine dans : {timeLeft[event.id] || 'Calcul...'}</span>
            </div>
          </div>

          {/* Contenu détaillé */}
          <div className="p-6 bg-gray-50">
            {/* Conditions */}
            {event.conditions && event.conditions.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Target size={16} className="text-blue-600" />
                  Conditions
                </h4>
                <ul className="space-y-1">
                  {event.conditions.map((condition, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Récompenses */}
            {event.rewards && event.rewards.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Gift size={16} className="text-blue-600" />
                  Récompenses
                </h4>
                <ul className="space-y-1">
                  {event.rewards.map((reward, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      {reward}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <button className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
              Participer maintenant
            </button>
          </div>
        </motion.div>
      ))}

      {/* Événements à venir */}
      {upcomingEvents.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-blue-600" />
            Événements à venir
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="text-2xl">{event.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                  <p className="text-xs text-gray-500">Démarre dans : {timeLeft[event.id] || 'Calcul...'}</p>
                </div>
                <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                  {event.multiplier}× XP
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
