'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import DiagnosticFlow from '@/components/DiagnosticFlow';

interface DiagnosticContextType {
  isOpen: boolean;
  openDiagnostic: () => void;
  closeDiagnostic: () => void;
}

const DiagnosticContext = createContext<DiagnosticContextType | undefined>(undefined);

interface DiagnosticProviderProps {
  children: ReactNode;
  onComplete?: (data: Record<string, unknown>) => void;
  onEnterApp?: () => void;
}

export function DiagnosticProvider({ children, onComplete, onEnterApp }: DiagnosticProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open diagnostic if URL has ?diagnostic=true
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const shouldOpenDiagnostic = urlParams.get('diagnostic') === 'true';
      if (shouldOpenDiagnostic) {
        setIsOpen(true);
        // Clean up URL without refreshing
        const url = new URL(window.location.href);
        url.searchParams.delete('diagnostic');
        window.history.replaceState({}, '', url.pathname);
      }
    }
  }, []);

  const openDiagnostic = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDiagnostic = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleComplete = useCallback((data: Record<string, unknown>) => {
    setIsOpen(false);
    if (onComplete) {
      onComplete(data);
    }
    if (onEnterApp) {
      onEnterApp();
    }
  }, [onComplete, onEnterApp]);

  return (
    <DiagnosticContext.Provider value={{ isOpen, openDiagnostic, closeDiagnostic }}>
      {children}
      <DiagnosticFlow
        isOpen={isOpen}
        onClose={closeDiagnostic}
        onComplete={handleComplete}
      />
    </DiagnosticContext.Provider>
  );
}

export function useDiagnostic() {
  const context = useContext(DiagnosticContext);
  if (context === undefined) {
    throw new Error('useDiagnostic must be used within a DiagnosticProvider');
  }
  return context;
}

