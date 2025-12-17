'use client';

import React, { useState, useEffect } from 'react';
import { NewMarketingLandingMultilang } from '@/components/landing/NewMarketingLandingMultilang';
import { SimpleDashboard } from '@/components/SimpleDashboard';
import { DashboardWidget } from '@/components/DashboardWidget';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleEnterApp = () => {
    setShowDashboard(true);
  };

  // Listen for dashboard widget click
  useEffect(() => {
    const handleShowDashboard = () => {
      setShowDashboard(true);
    };

    window.addEventListener('showDashboard', handleShowDashboard);
    return () => window.removeEventListener('showDashboard', handleShowDashboard);
  }, []);

  if (showDashboard) {
    return <SimpleDashboard />;
  }

  return (
    <>
      <NewMarketingLandingMultilang onEnterApp={handleEnterApp} />
      <DashboardWidget />
    </>
  );
}
