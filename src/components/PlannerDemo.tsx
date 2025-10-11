'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Users, Award, Zap, TrendingUp } from 'lucide-react';

export function PlannerDemo() {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: 'Vues multiples',
      description: 'Navigation fluide entre jour, semaine et mois',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Sessions manquées',
      description: 'Alertes proactives avec replanification auto/manuelle',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Adaptation temps réel',
      description: 'Optimisation si avance, rattrapage si retard',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Buddy system',
      description: 'Notifications de soutien pour encourager',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Gamification',
      description: 'Badges Discipliné, Résilient, Coaché, etc.',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Play className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Planificateur Intelligent
        </h2>
        <p className="text-gray-600">
          Système de coaching avancé avec adaptation temps réel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDemo(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-8 py-3 font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          ✨ Découvrir le planificateur
        </motion.button>
      </div>

      {showDemo && (
        <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Tests d'acceptation réussis
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-700">Vue Jour/Semaine/Mois avec toggle</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-700">Alerte session manquée → replanification auto/manuelle</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-700">Adaptation temps réel selon progrès</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-700">Notification buddy pour sessions multiples manquées</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-700">Badges de planification (Discipliné, Résilient, Coaché)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-700">Design minimaliste blanc avec ombres légères</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






