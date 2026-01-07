'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  MessageCircle,
  Bell,
  Settings,
  Check,
  X,
  Heart,
  AlertTriangle,
  Shield,
  Clock,
  Target,
  BookOpen
} from 'lucide-react';
import { BuddyRelation, BuddyType } from '@/types';
import { BuddiesService } from '@/lib/buddies-service';

interface SocialPlannerIntegrationProps {
  userId: string;
  userName: string;
  onNavigateToBuddies?: () => void;
}

export function SocialPlannerIntegration({ 
  userId, 
  userName, 
  onNavigateToBuddies 
}: SocialPlannerIntegrationProps) {
  const [buddies, setBuddies] = useState<BuddyRelation[]>([]);
  const [selectedBuddiesForAlerts, setSelectedBuddiesForAlerts] = useState<string[]>([]);
  const [showBuddySelection, setShowBuddySelection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBuddiesData();
  }, [userId]);

  const loadBuddiesData = () => {
    setIsLoading(true);
    try {
      const userBuddies = BuddiesService.getAllBuddies(userId);
      setBuddies(userBuddies);
      
      // Charger les buddies déjà sélectionnés pour les alertes depuis localStorage
      const savedSelection = localStorage.getItem(`planner_alert_buddies_${userId}`);
      if (savedSelection) {
        setSelectedBuddiesForAlerts(JSON.parse(savedSelection));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des buddies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBuddyAlert = (buddyId: string) => {
    const newSelection = selectedBuddiesForAlerts.includes(buddyId)
      ? selectedBuddiesForAlerts.filter(id => id !== buddyId)
      : [...selectedBuddiesForAlerts, buddyId];
    
    setSelectedBuddiesForAlerts(newSelection);
    
    // Sauvegarder dans localStorage
    localStorage.setItem(`planner_alert_buddies_${userId}`, JSON.stringify(newSelection));
  };

  const getBuddyTypeLabel = (type: BuddyType) => {
    const labels = {
      'parent': 'Parent/Tuteur',
      'friend': 'Ami',
      'closeFriend': 'Ami Proche'
    };
    return labels[type];
  };

  const getBuddyTypeColor = (type: BuddyType) => {
    const colors = {
      'parent': 'bg-purple-100 text-purple-700',
      'friend': 'bg-blue-100 text-blue-700',
      'closeFriend': 'bg-green-100 text-green-700'
    };
    return colors[type];
  };

  const getEligibleBuddiesForAlerts = () => {
    return buddies.filter(buddy => 
      buddy.consents.planningAlerts || buddy.type === 'parent'
    );
  };

  const sendPlanningAlert = (type: 'missed-session' | 'progress-update', sessionName?: string) => {
    const eligibleBuddies = getEligibleBuddiesForAlerts();
    const selectedEligibleBuddies = eligibleBuddies.filter(buddy => 
      selectedBuddiesForAlerts.includes(buddy.buddyId)
    );

    selectedEligibleBuddies.forEach(buddy => {
      const message = type === 'missed-session' 
        ? `${userName} a manqué une session de planning${sessionName ? ` : ${sessionName}` : ''}`
        : `Mise à jour de progression de ${userName} sur le planning`;

      // Créer une notification pour le buddy
      BuddiesService.createSocialNotification({
        type: 'planning-alert',
        fromUserId: userId,
        fromUserName: userName,
        toUserId: buddy.buddyId,
        title: type === 'missed-session' ? 'Session manquée' : 'Progression mise à jour',
        message,
        actionData: { sessionName },
        priority: type === 'missed-session' ? 'high' : 'normal'
      });
    });

    console.log(`📢 Alerte planning envoyée à ${selectedEligibleBuddies.length} buddy(s):`, { type, sessionName });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-sm text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* État sans buddy */}
      {buddies.length === 0 ? (
        <div className="space-y-4">
          {/* Input d'invitation élégant */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email de ton buddy..."
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          <button
            onClick={onNavigateToBuddies}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
              Inviter
          </button>
        </div>
        
          <p className="text-center text-sm text-gray-400">
            Ou <button onClick={onNavigateToBuddies} className="text-gray-600 underline hover:text-gray-900">partager un lien d'invitation</button>
          </p>
        </div>
      ) : (
          <div className="space-y-3">
          {/* Liste compacte des buddies */}
          {buddies.slice(0, 3).map((buddy) => (
                    <div
                      key={buddy.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {buddy.buddyName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{buddy.buddyName}</p>
                  <p className="text-xs text-gray-500">{getBuddyTypeLabel(buddy.type)}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleBuddyAlert(buddy.buddyId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedBuddiesForAlerts.includes(buddy.buddyId)
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                <Bell size={14} />
                {selectedBuddiesForAlerts.includes(buddy.buddyId) ? 'Alertes on' : 'Alertes off'}
                      </button>
                    </div>
                  ))}

          {/* Ajouter un buddy */}
                <button
            onClick={onNavigateToBuddies}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
          >
            <UserPlus size={18} />
            <span className="font-medium">Ajouter un buddy</span>
                    </button>
        </div>
      )}
    </div>
  );
}



