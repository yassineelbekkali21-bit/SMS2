'use client';

import React from 'react';

interface PlannerDebugInfoProps {
  plannerAccess: any;
  generatedPlan: any;
  isGeneratingPlan: boolean;
}

export function PlannerDebugInfo({ plannerAccess, generatedPlan, isGeneratingPlan }: PlannerDebugInfoProps) {
  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">🐛 Debug Planificateur</h3>
      <div className="text-xs space-y-1">
        <div>
          <strong>hasAccess:</strong> {plannerAccess?.hasAccess ? '✅' : '❌'}
        </div>
        <div>
          <strong>accessMessage:</strong> {plannerAccess?.accessMessage}
        </div>
        <div>
          <strong>generatedPlan:</strong> {generatedPlan ? '✅' : '❌'}
        </div>
        <div>
          <strong>isGeneratingPlan:</strong> {isGeneratingPlan ? '✅' : '❌'}
        </div>
      </div>
    </div>
  );
}






