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
    <div className="space-y-6">
      {/* En-tête avec statistiques - Design chaleureux */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
              <Heart className="text-white" size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Soutien de ton Buddy</h4>
              <p className="text-sm text-gray-600">Partage ton parcours et reste motivé</p>
            </div>
          </div>
          
          <button
            onClick={onNavigateToBuddies}
            className="text-sm text-green-600 hover:text-green-700 font-medium bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            Gérer mes Buddies
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">{buddies.length}</div>
            <div className="text-sm text-gray-600 font-medium">Buddies de soutien</div>
          </div>
          <div className="text-center bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">{selectedBuddiesForAlerts.length}</div>
            <div className="text-sm text-gray-600 font-medium">Alertes activées</div>
          </div>
        </div>
      </div>

      {/* Section principale */}
      {buddies.length === 0 ? (
        <div className="text-center py-10 px-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-100">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <Heart className="text-blue-500" size={16} />
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-3">Tu n'as pas encore de Buddy</h4>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Invite quelqu'un pour partager ton avancée et rester motivé ensemble. Ton Buddy recevra des notifications et t'encouragera tout au long de ta progression.
          </p>
          <button
            onClick={onNavigateToBuddies}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Heart size={18} />
            <span>Inviter un Buddy</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Explication chaleureuse */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                <Heart className="text-white" size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Soutien et encouragement</h4>
                <p className="text-gray-700 leading-relaxed">
                  Invite un ami, un proche ou un parent à suivre ton parcours. Ton Buddy reçoit des notifications, t'encourage, et t'aide à rester motivé tout au long de ta progression.
                </p>
              </div>
            </div>
          </div>

          {/* Liste des buddies avec possibilité d'activer les alertes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="text-green-600" size={18} />
                Tes Buddies de soutien
              </h4>
              <button
                onClick={() => setShowBuddySelection(!showBuddySelection)}
                className="text-sm text-green-600 hover:text-green-700 font-medium bg-green-50 px-3 py-2 rounded-lg transition-colors"
              >
                {showBuddySelection ? 'Masquer' : 'Configurer alertes'}
              </button>
            </div>

            <AnimatePresence>
              {showBuddySelection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {getEligibleBuddiesForAlerts().map((buddy) => (
                    <div
                      key={buddy.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {buddy.buddyName.charAt(0)}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{buddy.buddyName}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBuddyTypeColor(buddy.type)}`}>
                              {getBuddyTypeLabel(buddy.type)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {buddy.type === 'parent' ? 'Peut recevoir des alertes' : 'A consenti aux alertes'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleBuddyAlert(buddy.buddyId)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedBuddiesForAlerts.includes(buddy.buddyId)
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {selectedBuddiesForAlerts.includes(buddy.buddyId) && (
                          <Check size={12} />
                        )}
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions rapides */}
          {selectedBuddiesForAlerts.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Bell size={16} />
                Actions rapides
              </h4>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => sendPlanningAlert('missed-session', 'Session d\'exemple')}
                  className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
                >
                  Test alerte session manquée
                </button>
                
                <button
                  onClick={() => sendPlanningAlert('progress-update')}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Test alerte progression
                </button>
              </div>
              
              <p className="text-xs text-gray-600 mt-2">
                {selectedBuddiesForAlerts.length} buddy(s) sélectionné(s) pour les alertes
              </p>
            </div>
          )}

          {/* Surface de cross-sell pour cours en commun */}
          {buddies.some(buddy => buddy.commonCourses.length > 0) && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="font-medium text-emerald-900 mb-2 flex items-center gap-2">
                <BookOpen size={16} />
                Cours en commun avec vos Buddies
              </h4>
              
              <div className="space-y-2">
                {buddies.filter(buddy => buddy.commonCourses.length > 0).slice(0, 2).map((buddy) => (
                  <div key={buddy.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-900">{buddy.buddyName}</p>
                      <p className="text-xs text-emerald-700">
                        {buddy.commonCourses.length} cours en commun
                      </p>
                    </div>
                    
                    <button className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium hover:bg-emerald-200 transition-colors">
                      Planifier ensemble
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



