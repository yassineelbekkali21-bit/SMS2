'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

export function PlannerStatusDemo() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">État du planificateur</h3>
          <p className="text-indigo-600 text-sm">Système de coaching intelligent</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-gray-700 text-sm">
            ✅ Bouton "Générer mon planning" ajouté
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-gray-700 text-sm">
            ✅ Bloc badges maintenant dépliable/repliable
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-gray-700 text-sm">
            🎯 Cliquez sur "Générer le planning" pour commencer
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p className="text-emerald-700 text-sm">
          <strong>Instructions :</strong> Configurez vos préférences d'étude dans la sidebar gauche, 
          puis cliquez sur le bouton "✨ Générer mon planning" pour créer votre planning personnalisé !
        </p>
      </div>
    </div>
  );
}




