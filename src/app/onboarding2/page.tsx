'use client';

import React, { useState } from 'react';
import { OnboardingPopup } from '@/components/OnboardingPopup';
import { useRouter } from 'next/navigation';

export default function Onboarding2Page() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleComplete = () => {
    setIsOpen(false);
    router.push('/table');
  };

  return (
    <div className="min-h-screen bg-[#0d1317]">
      <OnboardingPopup 
        isOpen={isOpen} 
        onComplete={handleComplete}
        flowType="old"
      />
    </div>
  );
}
