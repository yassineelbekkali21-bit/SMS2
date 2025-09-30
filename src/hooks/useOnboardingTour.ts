'use client';

import { useState, useEffect } from 'react';

interface OnboardingTourState {
  hasCompletedTour: boolean;
  isTourActive: boolean;
  shouldShowTour: boolean;
}

export function useOnboardingTour(userId?: string) {
  const [tourState, setTourState] = useState<OnboardingTourState>({
    hasCompletedTour: false,
    isTourActive: false,
    shouldShowTour: false
  });

  useEffect(() => {
    if (userId) {
      const hasCompleted = localStorage.getItem(`onboarding_completed_${userId}`) === 'true';
      const shouldShow = !hasCompleted;
      
      setTourState({
        hasCompletedTour: hasCompleted,
        isTourActive: false,
        shouldShowTour: shouldShow
      });

      // Auto-démarrer le tour pour les nouveaux utilisateurs après un délai
      if (shouldShow) {
        const timer = setTimeout(() => {
          setTourState(prev => ({ ...prev, isTourActive: true }));
        }, 1500); // Délai de 1.5s pour laisser le temps à la page de se charger

        return () => clearTimeout(timer);
      }
    }
  }, [userId]);

  const startTour = () => {
    setTourState(prev => ({ 
      ...prev, 
      isTourActive: true,
      shouldShowTour: true 
    }));
  };

  const completeTour = () => {
    if (userId) {
      localStorage.setItem(`onboarding_completed_${userId}`, 'true');
    }
    
    setTourState({
      hasCompletedTour: true,
      isTourActive: false,
      shouldShowTour: false
    });

    // Petite animation de succès
    console.log('🎉 Tour guidé terminé avec succès !');
  };

  const skipTour = () => {
    if (userId) {
      localStorage.setItem(`onboarding_completed_${userId}`, 'true');
    }
    
    setTourState(prev => ({
      ...prev,
      isTourActive: false,
      shouldShowTour: false
    }));

    console.log('Tour guidé ignoré');
  };

  const resetTour = () => {
    if (userId) {
      localStorage.removeItem(`onboarding_completed_${userId}`);
    }
    
    setTourState({
      hasCompletedTour: false,
      isTourActive: false,
      shouldShowTour: true
    });
  };

  return {
    ...tourState,
    startTour,
    completeTour,
    skipTour,
    resetTour
  };
}



