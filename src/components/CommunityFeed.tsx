'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, TrendingUp, Clock, Trophy } from 'lucide-react';
import { CommunityActivity } from '@/types';
import { CommunityFeedCard } from './CommunityFeedCard';

interface CommunityFeedProps {
  activities: CommunityActivity[];
  className?: string;
}

type FilterType = 'all' | 'announcements' | 'celebrations' | 'achievements';

export function CommunityFeed({ activities, className = "" }: CommunityFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [reactions, setReactions] = useState<Record<string, { likes: number; hearts: number; celebrates: number; likedBy: string[] }>>({});

  const filters = [
    { id: 'all', label: 'Tout', icon: TrendingUp },
    { id: 'announcements', label: 'Annonces', icon: Filter },
    { id: 'celebrations', label: 'Célébrations', icon: Trophy },
    { id: 'achievements', label: 'Réussites', icon: Clock }
  ];

  const getFilteredActivities = () => {
    let filtered = [...activities];
    
    switch (activeFilter) {
      case 'announcements':
        filtered = filtered.filter(activity => activity.type === 'announcement');
        break;
      case 'celebrations':
        filtered = filtered.filter(activity => 
          activity.type === 'celebration' || 
          activity.type === 'milestone' || 
          activity.type === 'level_up'
        );
        break;
      case 'achievements':
        filtered = filtered.filter(activity => 
          activity.type === 'course_completed' || 
          activity.type === 'badge_earned' || 
          activity.type === 'achievement'
        );
        break;
      default:
        break;
    }
    
    // Trier par priorité puis par date
    return filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority || 'low'];
      const bPriority = priorityOrder[b.priority || 'low'];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  const handleReaction = (activityId: string, reactionType: 'likes' | 'hearts' | 'celebrates') => {
    setReactions(prev => {
      const current = prev[activityId] || { likes: 0, hearts: 0, celebrates: 0, likedBy: [] };
      return {
        ...prev,
        [activityId]: {
          ...current,
          [reactionType]: current[reactionType] + 1
        }
      };
    });
  };

  const enrichedActivities = getFilteredActivities().map(activity => ({
    ...activity,
    reactions: {
      ...activity.reactions,
      ...reactions[activity.id]
    }
  }));

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl rounded-3xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/5 rounded-3xl" />
      <div className="absolute inset-0 rounded-3xl border border-white/20 shadow-2xl shadow-black/5" />
      
      {/* Abstract shape */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-gray-500/5 to-gray-600/5 rounded-full blur-3xl opacity-40" />

      <div className="relative">
        {/* Header avec filtres */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 tracking-tight mb-1" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
                Fil Communautaire
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-400" style={{ letterSpacing: '0.1em' }}>
                Suivez l'actualité de votre communauté
              </p>
            </div>
            
            {/* Filtres */}
            <div className="flex items-center gap-1.5 bg-gray-900/5 p-1 rounded-xl border border-gray-900/10">
              {filters.map(filter => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id as FilterType)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeFilter === filter.id
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon size={12} />
                    <span className="hidden sm:inline">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feed d'activités */}
        <div className="p-6">
          {enrichedActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-gray-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Aucune activité pour ce filtre
              </h4>
              <p className="text-xs text-gray-500">
                Changez de filtre ou revenez plus tard !
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {enrichedActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <CommunityFeedCard 
                    activity={activity}
                    onReaction={handleReaction}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
