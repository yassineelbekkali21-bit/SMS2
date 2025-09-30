import { useState, useEffect, useCallback } from 'react';
import { 
  StudyPlan, 
  PlannerBadge, 
  AdaptationSuggestion, 
  MissedSessionAlert,
  PlannerViewSettings,
  BuddySystem,
  StudySession,
  PlannerAccess
} from '@/types';
import { AdvancedPlannerService } from './advanced-planner-service';

interface UseAdvancedPlannerProps {
  plan?: StudyPlan;
  buddy?: BuddySystem;
  plannerAccess: PlannerAccess;
}

export function useAdvancedPlanner({ plan, buddy, plannerAccess }: UseAdvancedPlannerProps) {
  const [badges, setBadges] = useState<PlannerBadge[]>([]);
  const [adaptationSuggestions, setAdaptationSuggestions] = useState<AdaptationSuggestion[]>([]);
  const [missedSessionAlert, setMissedSessionAlert] = useState<MissedSessionAlert | undefined>();
  const [viewSettings, setViewSettings] = useState<PlannerViewSettings>({
    currentView: 'week',
    showCompleted: true,
    showMissed: true,
    showOptional: true
  });

  // Initialiser les badges
  useEffect(() => {
    setBadges(AdvancedPlannerService.initializeBadges());
  }, []);

  // Vérifier les sessions manquées et les adaptations
  useEffect(() => {
    if (!plan) return;

    // Vérifier les sessions manquées
    const missedSessions = AdvancedPlannerService.checkMissedSessions(plan);
    if (missedSessions.length > 0 && !missedSessionAlert) {
      const alert = AdvancedPlannerService.createMissedSessionAlert(missedSessions[0], plan);
      setMissedSessionAlert(alert);
    }

    // Analyser les progrès pour les suggestions d'adaptation
    const suggestions = AdvancedPlannerService.analyzeProgress(plan);
    setAdaptationSuggestions(suggestions);

    // Mettre à jour les badges
    setBadges(prev => AdvancedPlannerService.checkBadgeProgress(prev, plan, buddy));
  }, [plan, buddy, missedSessionAlert]);

  // Vérifier si le buddy doit être notifié
  const shouldNotifyBuddy = useCallback(() => {
    if (!plan || !buddy) return false;
    return AdvancedPlannerService.shouldNotifyBuddy(plan, buddy);
  }, [plan, buddy]);

  // Générer le message pour le buddy
  const generateBuddyMessage = useCallback(() => {
    if (!plan || !buddy) return '';
    return AdvancedPlannerService.generateBuddyMessage(plan, buddy);
  }, [plan, buddy]);

  // Gérer les sessions manquées
  const handleSessionReschedule = useCallback((
    sessionId: string, 
    newDate: Date, 
    isAutomatic: boolean = false
  ) => {
    if (!plan) return plan;

    const updatedPlan = AdvancedPlannerService.rescheduleSession(
      sessionId, 
      newDate, 
      plan, 
      isAutomatic
    );

    // Fermer l'alerte
    setMissedSessionAlert(undefined);

    return updatedPlan;
  }, [plan]);

  // Appliquer une suggestion d'adaptation
  const handleApplyAdaptation = useCallback((
    suggestion: AdaptationSuggestion, 
    action: any
  ) => {
    if (!plan) return plan;

    const updatedPlan = AdvancedPlannerService.applyAdaptationSuggestion(
      suggestion, 
      action, 
      plan
    );

    // Marquer la suggestion comme inactive
    setAdaptationSuggestions(prev => 
      prev.map(s => 
        s.id === suggestion.id 
          ? { ...s, isActive: false }
          : s
      )
    );

    return updatedPlan;
  }, [plan]);

  // Supprimer une suggestion
  const handleDismissSuggestion = useCallback((suggestionId: string) => {
    setAdaptationSuggestions(prev => 
      prev.map(s => 
        s.id === suggestionId 
          ? { ...s, isActive: false }
          : s
      )
    );
  }, []);

  // Fermer l'alerte de session manquée
  const handleCloseMissedAlert = useCallback(() => {
    setMissedSessionAlert(undefined);
  }, []);

  // Marquer une session comme complétée
  const handleSessionComplete = useCallback((sessionId: string) => {
    if (!plan) return plan;

    const updatedSessions = plan.sessions.map(session => 
      session.id === sessionId 
        ? { ...session, isCompleted: !session.isCompleted, status: session.isCompleted ? 'upcoming' : 'completed' as const }
        : session
    );

    const updatedPlan = {
      ...plan,
      sessions: updatedSessions,
      lastUpdated: new Date()
    };

    // Recalculer les badges
    setBadges(prev => AdvancedPlannerService.checkBadgeProgress(prev, updatedPlan, buddy));

    return updatedPlan;
  }, [plan, buddy]);

  // Démarrer la replanification manuelle
  const handleManualReschedule = useCallback(() => {
    // Logic pour ouvrir une interface de sélection de date
    // Pour l'instant, fermer l'alerte
    setMissedSessionAlert(undefined);
  }, []);

  // Obtenir les sessions pour une vue spécifique
  const getSessionsForView = useCallback((
    viewType: 'day' | 'week' | 'month',
    referenceDate: Date = new Date()
  ) => {
    if (!plan) return [];
    return AdvancedPlannerService.getSessionsForView(plan.sessions, viewType, referenceDate);
  }, [plan]);

  return {
    // État
    badges,
    adaptationSuggestions: adaptationSuggestions.filter(s => s.isActive),
    missedSessionAlert,
    viewSettings,
    shouldNotifyBuddy: shouldNotifyBuddy(),
    buddyMessage: generateBuddyMessage(),

    // Actions
    handleSessionReschedule,
    handleApplyAdaptation,
    handleDismissSuggestion,
    handleCloseMissedAlert,
    handleSessionComplete,
    handleManualReschedule,
    setViewSettings,
    getSessionsForView,

    // Utilitaires
    formatViewTitle: (viewType: 'day' | 'week' | 'month', date: Date) => 
      AdvancedPlannerService.formatViewTitle(viewType, date)
  };
}




