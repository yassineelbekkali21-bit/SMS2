'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DiagnosticFlow from '@/components/DiagnosticFlow';
import { AccountCreationModal } from '@/components/AccountCreationModal';

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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Auto-open diagnostic if URL has ?diagnostic=true
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const shouldOpenDiagnostic = urlParams.get('diagnostic') === 'true';
      if (shouldOpenDiagnostic) {
        // NEW FLOW: Show account creation modal instead of diagnostic
        setShowAccountModal(true);
        // Clean up URL without refreshing
        const url = new URL(window.location.href);
        url.searchParams.delete('diagnostic');
        window.history.replaceState({}, '', url.pathname);
      }
    }
  }, []);

  const openDiagnostic = useCallback(() => {
    // NEW FLOW: Open account creation modal instead of diagnostic
    setShowAccountModal(true);
  }, []);

  const closeDiagnostic = useCallback(() => {
    setIsOpen(false);
    setShowAccountModal(false);
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

  const handleAccountCreated = useCallback(() => {
    setShowAccountModal(false);
    // Redirect to Simple Dashboard (white version)
    router.push('/dashboard');
  }, [router]);

  return (
    <DiagnosticContext.Provider value={{ isOpen, openDiagnostic, closeDiagnostic }}>
      {children}
      
      {/* OLD FLOW: DiagnosticFlow (hidden in new flow) */}
      <DiagnosticFlow
        isOpen={isOpen}
        onClose={closeDiagnostic}
        onComplete={handleComplete}
      />
      
      {/* NEW FLOW: AccountCreationModal */}
      <AccountCreationModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSuccess={handleAccountCreated}
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

