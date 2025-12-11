'use client';

import React, { useState } from 'react';
import { NewMarketingLandingMultilang } from '@/components/landing/NewMarketingLandingMultilang';
import { SimpleDashboard } from '@/components/SimpleDashboard';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleEnterApp = () => {
    setShowDashboard(true);
  };

  if (showDashboard) {
    return <SimpleDashboard />;
  }

  return <NewMarketingLandingMultilang onEnterApp={handleEnterApp} />;
}