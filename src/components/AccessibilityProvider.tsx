'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  // Préférences d'accessibilité
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReaderMode: boolean;
  
  // Actions
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleScreenReaderMode: () => void;
  
  // Focus management
  focusRing: boolean;
  announceLiveRegion: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [focusRing, setFocusRing] = useState(false);

  // Détecter les préférences système
  useEffect(() => {
    // Détecter la préférence de mouvement réduit
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    motionQuery.addEventListener('change', handleMotionChange);

    // Détecter le contraste élevé
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(contrastQuery.matches);
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };
    
    contrastQuery.addEventListener('change', handleContrastChange);

    // Détecter l'utilisation du clavier pour la navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setFocusRing(true);
      }
    };

    const handleMouseDown = () => {
      setFocusRing(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // Charger les préférences sauvegardées
    const savedPreferences = localStorage.getItem('accessibility-preferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setLargeText(preferences.largeText || false);
      setScreenReaderMode(preferences.screenReaderMode || false);
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Sauvegarder les préférences
  useEffect(() => {
    const preferences = {
      largeText,
      screenReaderMode,
    };
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
  }, [largeText, screenReaderMode]);

  // Appliquer les classes CSS pour les préférences
  useEffect(() => {
    const body = document.body;
    
    body.classList.toggle('reduced-motion', reducedMotion);
    body.classList.toggle('high-contrast', highContrast);
    body.classList.toggle('large-text', largeText);
    body.classList.toggle('screen-reader-mode', screenReaderMode);
    body.classList.toggle('focus-ring', focusRing);
  }, [reducedMotion, highContrast, largeText, screenReaderMode, focusRing]);

  const toggleReducedMotion = () => setReducedMotion(!reducedMotion);
  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleLargeText = () => setLargeText(!largeText);
  const toggleScreenReaderMode = () => setScreenReaderMode(!screenReaderMode);

  // Fonction pour annoncer des messages aux lecteurs d'écran
  const announceLiveRegion = (message: string) => {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      // Effacer après un délai pour permettre de nouvelles annonces
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  };

  const value = {
    reducedMotion,
    highContrast,
    largeText,
    screenReaderMode,
    focusRing,
    toggleReducedMotion,
    toggleHighContrast,
    toggleLargeText,
    toggleScreenReaderMode,
    announceLiveRegion,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Live region pour les annonces aux lecteurs d'écran */}
      <div
        id="live-region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Hook pour les animations respectueuses de l'accessibilité
export function useResponsiveAnimation() {
  const { reducedMotion } = useAccessibility();
  
  return {
    // Retourne des valeurs de transition adaptées
    transition: reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 },
    
    // Animations de base respectueuses
    fadeIn: reducedMotion 
      ? { opacity: 1 }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        },
        
    slideUp: reducedMotion
      ? { y: 0 }
      : {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -20, opacity: 0 }
        },
        
    scale: reducedMotion
      ? { scale: 1 }
      : {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 }
        }
  };
}

