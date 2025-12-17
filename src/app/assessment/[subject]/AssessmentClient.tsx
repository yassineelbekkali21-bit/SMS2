'use client';

import React, { useState } from 'react';
import { AssessmentSetup } from '@/components/assessment/AssessmentSetup';
import { QuizRunner } from '@/components/assessment/QuizRunner';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { DashboardWidget } from '@/components/DashboardWidget';
import Link from 'next/link';

interface AssessmentClientProps {
  subject: string;
}

export function AssessmentClient({ subject }: AssessmentClientProps) {
  const [mode, setMode] = useState<'setup' | 'quiz'>('setup');
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  const handleStart = (ids: string[]) => {
    setSelectedTopicIds(ids);
    setMode('quiz');
  };

  return (
    <LanguageProvider>
      {mode === 'setup' ? (
        <AssessmentSetup subject={subject} onStart={handleStart} />
      ) : (
        <QuizRunner selectedTopicIds={selectedTopicIds} />
      )}
      
      {/* Dashboard Access Widget */}
      <Link
        href="/"
        className="fixed bottom-6 right-6 z-[999] flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 font-bold text-sm group"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Dashboard</span>
      </Link>
    </LanguageProvider>
  );
}

