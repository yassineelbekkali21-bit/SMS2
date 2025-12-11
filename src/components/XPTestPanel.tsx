'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XPService, UserXPProfile } from '@/lib/xp-service';
import XPWidget from './XPWidget';
import XPFeedback from './XPFeedback';

export default function XPTestPanel() {
  const [userProfile, setUserProfile] = useState<UserXPProfile | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const xpService = XPService.getInstance();

  useEffect(() => {
    setUserProfile(xpService.getUserXPProfile());
  }, []);

  const handleTestAction = (actionType: string) => {
    const result = xpService.addXP(actionType);
    setUserProfile(result.profile);
    
    if (result.xpGained > 0) {
      setFeedback({
        show: true,
        xpGained: result.xpGained,
        action: result.profile.recentActions[0],
        newLevel: result.newLevel,
        newBadges: result.newBadges
      });
    }
  };

  const testActions = [
    { key: 'lesson_unlock', label: '🎓 Débloquer leçon (+10 XP)' },
    { key: 'lesson_complete', label: '📘 Terminer leçon (+20 XP)' },
    { key: 'course_complete', label: '📦 Compléter cours (+50 XP)' },
    { key: 'pack_complete', label: '🧠 Compléter pack (+150 XP)' },
    { key: 'study_room', label: '💬 Study Room (+15 XP)' },
    { key: 'buddy_support', label: '🫶 Aider buddy (+5 XP)' },
    { key: 'wallet_recharge', label: '💰 Recharge 100€ (+5 XP)' },
    { key: 'goal_achieved', label: '🏆 Objectif atteint (+50 XP)' }
  ];

  const resetProfile = () => {
    localStorage.removeItem('userXPProfile');
    setUserProfile(xpService.getUserXPProfile());
  };

  return (
    <>
      {userProfile && isVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl border p-4 w-80 max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">🎯 Test XP System</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetProfile}
                  className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-50"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                  title="Fermer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <XPWidget profile={userProfile} compact={false} className="mb-4" />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Actions de test :</h4>
              {testActions.map(action => (
                <button
                  key={action.key}
                  onClick={() => handleTestAction(action.key)}
                  className="w-full text-left text-xs p-2 rounded hover:bg-blue-50 border border-gray-200 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {feedback?.show && (
        <XPFeedback
          xpGained={feedback.xpGained}
          action={feedback.action}
          newLevel={feedback.newLevel}
          newBadges={feedback.newBadges}
          onComplete={() => setFeedback(null)}
        />
      )}
    </>
  );
}
