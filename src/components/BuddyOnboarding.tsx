'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Heart, 
  Sparkles, 
  Target,
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react';
import { BuddiesService } from '@/lib/buddies-service';
import { GamificationService } from '@/lib/gamification-service';

interface BuddyOnboardingProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function BuddyOnboarding({ userId, userName, isOpen, onClose, onComplete }: BuddyOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [addedBuddies, setAddedBuddies] = useState<string[]>([]);

  const steps = [
    {
      id: 'welcome',
      title: '👋 Bienvenue dans ton réseau d\'étude !',
      description: 'Connecte-toi avec tes amis pour étudier ensemble et progresser plus rapidement.',
      icon: <Users className="text-blue-600" size={48} />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Science Made Simple est bien plus qu'une plateforme de cours. 
            C'est une communauté d'étudiants qui s'entraident !
          </p>
          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <UserPlus className="text-blue-600" size={24} />
              </div>
              <p className="text-sm font-medium">Ajoute tes amis</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="text-green-600" size={24} />
              </div>
              <p className="text-sm font-medium">Étudiez ensemble</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="text-purple-600" size={24} />
              </div>
              <p className="text-sm font-medium">Progressez plus vite</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'target',
      title: '🎯 Objectif : Ajoute 3 buddies',
      description: 'Pour débloquer ton réseau d\'étude, trouve et ajoute au moins 3 amis qui étudient comme toi.',
      icon: <Target className="text-green-600" size={48} />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Pourquoi 3 buddies ?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Motivation mutuelle pour rester régulier</li>
              <li>• Partage de conseils et d'astuces</li>
              <li>• Sessions d'étude en groupe plus efficaces</li>
              <li>• Découverte de nouveaux cours recommandés</li>
            </ul>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  addedBuddies.length >= num 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {addedBuddies.length >= num ? <CheckCircle size={16} /> : num}
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600">
            {addedBuddies.length}/3 buddies ajoutés
          </p>
        </div>
      )
    },
    {
      id: 'suggestions',
      title: '✨ Découvre tes futurs buddies',
      description: 'Voici des étudiants qui partagent tes intérêts et pourraient devenir tes partenaires d\'étude.',
      icon: <Sparkles className="text-yellow-600" size={48} />,
      content: (
        <div className="space-y-4">
          {/* Suggestions de buddies mockées */}
          {[
            { id: 'sophie', name: 'Sophie Laurent', faculty: 'Sciences', common: 3, similarity: 92 },
            { id: 'alex', name: 'Alex Moreau', faculty: 'Sciences', common: 2, similarity: 85 },
            { id: 'lea', name: 'Léa Martinez', faculty: 'Sciences', common: 2, similarity: 78 }
          ].map((buddy) => (
            <div key={buddy.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {buddy.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{buddy.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{buddy.faculty}</span>
                    <span>•</span>
                    <span>{buddy.common} cours en commun</span>
                    <span>•</span>
                    <span className="text-green-600">{buddy.similarity}% compatible</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleAddBuddy(buddy.id, buddy.name)}
                disabled={addedBuddies.includes(buddy.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  addedBuddies.includes(buddy.id)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {addedBuddies.includes(buddy.id) ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle size={16} />
                    <span>Ajouté</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <UserPlus size={16} />
                    <span>Ajouter</span>
                  </div>
                )}
              </button>
            </div>
          ))}
          
          {addedBuddies.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
            >
              <CheckCircle className="text-green-600 mx-auto mb-2" size={32} />
              <h4 className="font-semibold text-green-900 mb-1">Objectif atteint ! 🎉</h4>
              <p className="text-sm text-green-700">
                Tu as ajouté 3 buddies. Ton réseau d'étude est maintenant actif !
              </p>
            </motion.div>
          )}
        </div>
      )
    },
    {
      id: 'complete',
      title: '🎉 Ton réseau est prêt !',
      description: 'Félicitations ! Tu peux maintenant profiter de toutes les fonctionnalités sociales.',
      icon: <Heart className="text-red-600" size={48} />,
      content: (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-4">Ce que tu peux faire maintenant :</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="text-blue-600" size={24} />
                </div>
                <p className="text-sm font-medium">Study Rooms en groupe</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="text-green-600" size={24} />
                </div>
                <p className="text-sm font-medium">Notifications d'activité</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="text-purple-600" size={24} />
                </div>
                <p className="text-sm font-medium">Recommandations de cours</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="text-yellow-600" size={24} />
                </div>
                <p className="text-sm font-medium">Objectifs partagés</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-600 text-white p-4 rounded-lg">
            <h4 className="font-semibold mb-1">🏆 Badge débloqué !</h4>
            <p className="text-sm opacity-90">"Papillon Social" - Pour avoir créé ton réseau d'étude</p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  const handleAddBuddy = (buddyId: string, buddyName: string) => {
    if (!addedBuddies.includes(buddyId)) {
      setAddedBuddies(prev => [...prev, buddyId]);
      
      // Simuler l'ajout du buddy
      console.log(`Buddy ajouté: ${buddyName}`);
      
      // Award XP
      GamificationService.awardXP(
        userId,
        'buddy-help',
        buddyId,
        `Ajout de ${buddyName} comme buddy`
      );
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Débloquer le badge "Papillon Social"
    GamificationService.unlockBadge(userId, 'social-butterfly');
    
    // Marquer l'onboarding comme terminé
    localStorage.setItem(`buddy_onboarding_completed_${userId}`, 'true');
    
    onComplete();
    onClose();
  };

  const canProceed = () => {
    if (currentStep === 2) { // Étape des suggestions
      return addedBuddies.length >= 3;
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                <p className="opacity-90">{currentStepData.description}</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm opacity-75 mb-2">
                <span>Étape {currentStep + 1} sur {steps.length}</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Commencer l'aventure ! 🚀
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <span>Continuer</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

