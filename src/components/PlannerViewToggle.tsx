'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';

interface PlannerViewToggleProps {
  currentView: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
}

export function PlannerViewToggle({ currentView, onViewChange }: PlannerViewToggleProps) {
  const views = [
    { key: 'day' as const, label: 'Jour', icon: Calendar },
    { key: 'week' as const, label: 'Semaine', icon: CalendarDays },
    { key: 'month' as const, label: 'Mois', icon: CalendarRange }
  ];

  return (
    <div className="bg-gray-100 rounded-xl p-1 flex">
      {views.map((view) => {
        const IconComponent = view.icon;
        const isActive = currentView === view.key;
        
        return (
          <motion.button
            key={view.key}
            onClick={() => onViewChange(view.key)}
            className={`
              relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${isActive 
                ? 'text-gray-900' 
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeView"
                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-200"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <div className="relative flex items-center gap-2">
              <IconComponent className="w-4 h-4" />
              <span className="text-sm">{view.label}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}






