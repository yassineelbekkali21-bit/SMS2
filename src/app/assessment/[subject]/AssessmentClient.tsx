'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AssessmentSetup } from '@/components/assessment/AssessmentSetup';
import { QuizRunner } from '@/components/assessment/QuizRunner';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { DashboardWidget } from '@/components/DashboardWidget';
import Link from 'next/link';
import { TOPICS } from '@/lib/assessment-data';

interface AssessmentClientProps {
  subject: string;
}

// Composant interne qui utilise useSearchParams
function AssessmentContent({ subject }: { subject: string }) {
  const searchParams = useSearchParams();
  const urlMode = searchParams.get('mode');
  
  const [mode, setMode] = useState<'setup' | 'quiz'>('setup');
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  // Gérer le mode quick depuis l'URL
  useEffect(() => {
    if (urlMode === 'quick') {
      // Mode rapide : sélectionner automatiquement tous les topics du subject et démarrer
      const subjectTopics = TOPICS.filter(t => t.category === subject);
      const topicIds = subjectTopics.map(t => t.id);
      setSelectedTopicIds(topicIds.length > 0 ? topicIds : ['all']);
      setMode('quiz');
    }
  }, [urlMode, subject]);

  const handleStart = (ids: string[]) => {
    setSelectedTopicIds(ids);
    setMode('quiz');
  };

  return (
    <>
      {mode === 'setup' ? (
        <AssessmentSetup subject={subject} onStart={handleStart} />
      ) : (
        <QuizRunner selectedTopicIds={selectedTopicIds} />
      )}
    </>
  );
}

export function AssessmentClient({ subject }: AssessmentClientProps) {
  return (
    <LanguageProvider>
      <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full"></div></div>}>
        <AssessmentContent subject={subject} />
      </Suspense>
      
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

