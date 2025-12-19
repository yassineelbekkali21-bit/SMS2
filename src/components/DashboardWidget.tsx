'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export function DashboardWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-[999]"
    >
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          // Trigger the dashboard view in the main page
          const event = new CustomEvent('showDashboard');
          window.dispatchEvent(event);
        }}
        className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 font-bold text-sm group"
      >
        <LayoutDashboard size={18} className="group-hover:rotate-12 transition-transform" />
        <span>Post Diagnostic</span>
      </Link>
    </motion.div>
  );
}

