'use client';

import React, { useState, useEffect } from 'react';
import { LandingPageB } from '@/components/landing/LandingPageB';
import { SimpleDashboard } from '@/components/SimpleDashboard';
import { DashboardWidget } from '@/components/DashboardWidget';

interface DiagnosticData {
  school?: string;
  year?: string;
  goal?: string;
  struggles?: string[];
  blockingPoint?: string;
  email?: string;
  phone?: string;
  recommendedLevel?: 'beginner' | 'intermediate' | 'advanced';
  prescribedPrograms?: string[];
}

export default function Home() {
  // Check if user has account (new flow)
  const [showDashboard, setShowDashboard] = useState(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('sms_user');
      return !!userData; // Show dashboard if user account exists
    }
    return false;
  });
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);

  const handleEnterApp = () => {
    setShowDashboard(true);
  };

  const handleDiagnosticComplete = (data: DiagnosticData) => {
    console.log('📋 Diagnostic completed:', data);
    setDiagnosticData(data);
    setShowDashboard(true);
  };

  // Listen for dashboard widget click + check for user account on mount
  useEffect(() => {
    const handleShowDashboard = () => {
      setShowDashboard(true);
    };

    // Check if user was redirected after account creation
    const userData = localStorage.getItem('sms_user');
    if (userData) {
      setShowDashboard(true);
    }

    window.addEventListener('showDashboard', handleShowDashboard);
    return () => window.removeEventListener('showDashboard', handleShowDashboard);
  }, []);

  if (showDashboard) {
    return (
      <SimpleDashboard 
        initialDiagnosticData={diagnosticData}
        showOnboardingOnMount={!!diagnosticData}
      />
    );
  }

  return (
    <>
      <LandingPageB 
        onEnterApp={handleEnterApp}
        onDiagnosticComplete={handleDiagnosticComplete}
      />
      <DashboardWidget />
    </>
  );
}
