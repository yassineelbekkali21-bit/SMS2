'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleBlockProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleBlock({
  title,
  icon,
  iconBgColor = 'bg-gray-100',
  iconTextColor = 'text-gray-600',
  defaultExpanded = false,
  children,
  className = ''
}: CollapsibleBlockProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {/* Header dépliable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <div className={iconTextColor}>
              {icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-500"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      {/* Contenu dépliable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




