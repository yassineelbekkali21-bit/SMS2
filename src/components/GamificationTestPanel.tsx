'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Zap, 
  Star, 
  Target, 
  Gift, 
  Gamepad2,
  Award,
  TrendingUp,
  CheckCircle,
  Users,
  Video,
  BookOpen,
  Clock
} from 'lucide-react';
import { GamificationService } from '@/lib/gamification-service';
import { EnhancedNotificationsService } from '@/lib/enhanced-notifications-service';

interface GamificationTestPanelProps {
  userId: string;
  userName: string;
}

export function GamificationTestPanel({ userId, userName }: GamificationTestPanelProps) {
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [showTestPanel, setShowTestPanel] = useState(false);

  useEffect(() => {
    loadGamificationData();
  }, [userId]);

  const loadGamificationData = () => {
    const xpData = GamificationService.getUserXP(userId);
    const levelData = GamificationService.getCurrentLevel(userId);
    const badges = GamificationService.getUserBadges(userId);
    const activities = GamificationService.getXPActivities(userId);

    setUserXP(xpData); // getUserXP retourne directement un nombre
    setUserLevel(levelData.level);
    setUserBadges(badges);
    setRecentActivity(activities.slice(-5));
  };

  const handleTestAction = (action: string, points: number) => {
    console.log(`🎮 Test de gamification: ${action} (+${points} XP)`);
    
    const result = GamificationService.awardXP(userId, action as any, undefined, `Test: ${action}`);
    
    if (result.levelUp) {
      console.log('🎉 LEVEL UP!', result);
      alert(`🎉 FÉLICITATIONS!\n\nVous avez atteint le niveau ${result.newLevel}!`);
    }

    // Notification enrichie
    EnhancedNotificationsService.addNotification({
      id: `test-${Date.now()}`,
      userId,
      type: 'xp-earned',
      title: 'XP Gagné!',
      message: `+${points} XP pour ${action}`,
      createdAt: new Date(),
      isRead: false,
      actionData: { xpAmount: points }
    });

    loadGamificationData();
  };

  const testActions = [
    { name: 'Rejoindre Study Room', action: 'study-room-join', points: 10, icon: Video, color: 'bg-blue-500' },
    { name: 'Créer Study Room', action: 'study-room-create', points: 25, icon: Users, color: 'bg-green-500' },
    { name: 'Terminer une leçon', action: 'lesson-complete', points: 30, icon: BookOpen, color: 'bg-purple-500' },
    { name: 'Quiz parfait', action: 'quiz-perfect', points: 40, icon: TrendingUp, color: 'bg-orange-500' },
    { name: 'Aider un buddy', action: 'buddy-help', points: 15, icon: Star, color: 'bg-red-500' },
    { name: 'Terminer un cours', action: 'course-complete', points: 200, icon: Clock, color: 'bg-indigo-500' }
  ];

  if (!showTestPanel) {
    return (
      <button
        onClick={() => setShowTestPanel(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
      >
        <Gamepad2 size={20} />
        <span className="font-medium">🎮 Test Gamification</span>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-4 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-300" size={24} />
            <div>
              <h2 className="text-xl font-bold">Panneau de Test Gamification</h2>
              <p className="text-purple-100">Testez toutes les fonctionnalités XP & Badges</p>
            </div>
          </div>
          <button
            onClick={() => setShowTestPanel(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Stats actuelles */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <Zap className="text-yellow-300 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold">{userXP}</div>
            <div className="text-sm text-purple-100">Total XP</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <Star className="text-yellow-300 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold">{userLevel}</div>
            <div className="text-sm text-purple-100">Niveau</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <Award className="text-yellow-300 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold">{userBadges.length}</div>
            <div className="text-sm text-purple-100">Badges</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[calc(100vh-280px)] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actions de test */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={20} />
              Actions de Test
            </h3>
            
            <div className="space-y-3">
              {testActions.map((test, index) => {
                const IconComponent = test.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleTestAction(test.action, test.points)}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className={`w-10 h-10 ${test.color} rounded-lg flex items-center justify-center text-white`}>
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{test.name}</div>
                      <div className="text-sm text-gray-600">+{test.points} XP</div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Tester
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                GamificationService.resetUserProgress(userId);
                loadGamificationData();
                console.log('🔄 Progression réinitialisée');
              }}
              className="w-full mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              Réinitialiser la progression
            </button>
          </div>

          {/* Badges & Activité */}
          <div className="space-y-6">
            {/* Badges débloqués */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Gift size={20} />
                Badges Débloqués ({userBadges.length})
              </h3>
              
              {userBadges.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {userBadges.map((badge, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{badge.icon}</div>
                        <div>
                          <div className="font-medium text-gray-900">{badge.name}</div>
                          <div className="text-xs text-gray-600">{badge.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award size={48} className="mx-auto mb-2 opacity-30" />
                  <p>Aucun badge débloqué</p>
                  <p className="text-sm">Effectuez des actions pour gagner des badges!</p>
                </div>
              )}
            </div>

            {/* Activité récente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Activité Récente
              </h3>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="text-green-500" size={16} />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                        <div className="text-xs text-gray-600">+{activity.xpEarned} XP</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock size={48} className="mx-auto mb-2 opacity-30" />
                  <p>Aucune activité récente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
