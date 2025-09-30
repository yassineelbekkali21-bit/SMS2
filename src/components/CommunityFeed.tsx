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
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {/* Header avec filtres */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Fil Communautaire
            </h3>
            <p className="text-sm text-gray-500">
              Suivez l'actualité et les réussites de votre communauté
            </p>
          </div>
          
          {/* Filtres */}
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
            {filters.map(filter => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as FilterType)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={14} />
                  {filter.label}
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
            <div className="text-4xl mb-4">🌟</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Aucune activité pour ce filtre
            </h4>
            <p className="text-gray-500">
              Changez de filtre ou revenez plus tard !
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrichedActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
  );
}
