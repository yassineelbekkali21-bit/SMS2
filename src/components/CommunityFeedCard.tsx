'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone,
  Trophy,
  Sparkles,
  CheckCircle,
  Award,
  Video,
  Target,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import { CommunityActivity } from '@/types';

interface CommunityFeedCardProps {
  activity: CommunityActivity;
  onReaction: (activityId: string, reactionType: 'likes' | 'hearts' | 'celebrates') => void;
}

export function CommunityFeedCard({ activity, onReaction }: CommunityFeedCardProps) {
  const getActivityIcon = (type: string, priority?: string) => {
    switch (type) {
      case 'announcement': return <Megaphone className={`${priority === 'high' ? 'text-red-500' : 'text-blue-500'}`} size={20} />;
      case 'celebration': 
      case 'milestone': return <Trophy className="text-yellow-500" size={20} />;
      case 'level_up': return <Sparkles className="text-purple-500" size={20} />;
      case 'welcome': return <span className="text-2xl">👋</span>;
      case 'course_completed': return <CheckCircle className="text-green-500" size={20} />;
      case 'badge_earned': return <Award className="text-orange-500" size={20} />;
      case 'room_created': return <Video className="text-blue-500" size={20} />;
      case 'achievement': return <Target className="text-purple-500" size={20} />;
      case 'question_asked': return <MessageCircle className="text-indigo-500" size={20} />;
      case 'answer_given': return <span className="text-2xl">💡</span>;
      default: return <span className="text-2xl">🎯</span>;
    }
  };

  const getActivityPriorityBorder = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-red-400 bg-red-50';
      case 'medium': return 'border-l-4 border-l-blue-400 bg-blue-50';
      default: return 'border-l-4 border-l-gray-300 bg-white';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const diffInMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}j`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl transition-all hover:shadow-md ${getActivityPriorityBorder(activity.priority)}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {getActivityIcon(activity.type, activity.priority)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {activity.priority === 'high' && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                ⚡ Important
              </span>
            )}
            {activity.type === 'announcement' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                📢 Annonce
              </span>
            )}
            {(activity.type === 'celebration' || activity.type === 'milestone') && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                🎉 Célébration
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-3 leading-relaxed">{activity.content}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</span>
            
            {/* Réactions */}
            {activity.reactions && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onReaction(activity.id, 'likes')}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <ThumbsUp size={14} />
                  <span className="text-xs">{activity.reactions.likes}</span>
                </button>
                <button 
                  onClick={() => onReaction(activity.id, 'hearts')}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <span className="text-sm">❤️</span>
                  <span className="text-xs">{activity.reactions.hearts}</span>
                </button>
                <button 
                  onClick={() => onReaction(activity.id, 'celebrates')}
                  className="flex items-center gap-1 text-gray-500 hover:text-yellow-500 transition-colors"
                >
                  <span className="text-sm">🎉</span>
                  <span className="text-xs">{activity.reactions.celebrates}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
