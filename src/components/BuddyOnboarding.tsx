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
      title: 'Bienvenue dans ton réseau d\'étude',
      description: 'Connecte-toi avec tes amis pour étudier ensemble et progresser plus rapidement.',
      icon: <Users className="text-white opacity-90" size={32} />,
      content: (
        <div className="text-center space-y-8">
          <div className="max-w-md mx-auto">
            <p className="text-gray-800 text-lg leading-relaxed font-medium">
              Science Made Simple est bien plus qu'une plateforme de cours.
            </p>
            <p className="text-gray-600 mt-3">
              C'est une communauté d'étudiants qui s'entraident pour réussir ensemble.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="text-gray-700" size={32} />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Ajoute tes amis</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Trouve tes camarades d'étude dans ta faculté</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-gray-700" size={32} />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Étudiez ensemble</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Sessions de groupe plus efficaces</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="text-gray-700" size={32} />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Progressez plus vite</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Entraide et motivation mutuelle</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'target',
      title: 'Objectif : Ajoute 3 buddies',
      description: 'Pour débloquer ton réseau d\'étude, trouve et ajoute au moins 3 amis qui étudient comme toi.',
      icon: <Target className="text-white opacity-90" size={32} />,
      content: (
        <div className="space-y-8">
          <div className="bg-white border border-gray-300 p-8 rounded-2xl">
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Pourquoi 3 buddies ?</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-1">Motivation mutuelle</h5>
                  <p className="text-sm text-gray-600">Restez réguliers ensemble</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-1">Partage d'astuces</h5>
                  <p className="text-sm text-gray-600">Conseils et méthodes efficaces</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-1">Sessions de groupe</h5>
                  <p className="text-sm text-gray-600">Étude collaborative optimisée</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-1">Recommandations</h5>
                  <p className="text-sm text-gray-600">Nouveaux cours suggérés</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-4 mb-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all ${
                  addedBuddies.length >= num 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                    : 'bg-white text-gray-400 border-gray-300'
                }`}>
                  {addedBuddies.length >= num ? <CheckCircle size={20} /> : num}
                </div>
              ))}
            </div>
            
            <div className="w-full max-w-sm mx-auto">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                <span>Progression</span>
                <span>{addedBuddies.length}/3 buddies ajoutés</span>
              </div>
              <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-700 ease-out rounded-full"
                  style={{ width: `${(addedBuddies.length / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'suggestions',
      title: 'Découvre tes futurs buddies',
      description: 'Voici des étudiants qui partagent tes intérêts et pourraient devenir tes partenaires d\'étude.',
      icon: <Sparkles className="text-white opacity-90" size={32} />,
      content: (
        <div className="space-y-6">
          {/* Suggestions de buddies mockées */}
          {[
            { id: 'sophie', name: 'Sophie Laurent', faculty: 'Sciences', common: 3, similarity: 92 },
            { id: 'alex', name: 'Alex Moreau', faculty: 'Sciences', common: 2, similarity: 85 },
            { id: 'lea', name: 'Léa Martinez', faculty: 'Sciences', common: 2, similarity: 78 }
          ].map((buddy) => (
            <div key={buddy.id} className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {buddy.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">{buddy.name}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-gray-700">{buddy.faculty}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{buddy.common} cours en commun</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-blue-600 font-semibold">{buddy.similarity}% compatible</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleAddBuddy(buddy.id, buddy.name)}
                disabled={addedBuddies.includes(buddy.id)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  addedBuddies.includes(buddy.id)
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm hover:shadow-md'
                }`}
              >
                {addedBuddies.includes(buddy.id) ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    <span>Ajouté</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus size={18} />
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
              className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Objectif atteint !</h4>
              <p className="text-gray-700 leading-relaxed">
                Tu as ajouté 3 buddies. Ton réseau d'étude est maintenant actif et prêt à être utilisé.
              </p>
            </motion.div>
          )}
        </div>
      )
    },
    {
      id: 'complete',
      title: 'Ton réseau est prêt',
      description: 'Félicitations ! Tu peux maintenant profiter de toutes les fonctionnalités sociales.',
      icon: <Heart className="text-white opacity-90" size={32} />,
      content: (
        <div className="text-center space-y-8">
          <div className="bg-white border border-gray-200 p-8 rounded-2xl">
            <h4 className="font-bold text-gray-900 mb-8 text-xl">Fonctionnalités débloquées</h4>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gray-900" size={28} />
                </div>
                <h5 className="text-base font-bold text-gray-900 mb-2">Study Rooms en groupe</h5>
                <p className="text-sm text-gray-600 leading-relaxed">Sessions collaboratives avec tes buddies</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-gray-900" size={28} />
                </div>
                <h5 className="text-base font-bold text-gray-900 mb-2">Notifications d'activité</h5>
                <p className="text-sm text-gray-600 leading-relaxed">Suivi des progressions en temps réel</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-gray-900" size={28} />
                </div>
                <h5 className="text-base font-bold text-gray-900 mb-2">Recommandations</h5>
                <p className="text-sm text-gray-600 leading-relaxed">Cours suggérés par ton réseau</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="text-gray-900" size={28} />
                </div>
                <h5 className="text-base font-bold text-gray-900 mb-2">Objectifs partagés</h5>
                <p className="text-sm text-gray-600 leading-relaxed">Défis et challenges en équipe</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-8 rounded-2xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900 text-lg">Badge débloqué</h4>
                <p className="text-gray-700 font-medium">"Papillon Social"</p>
                <p className="text-sm text-gray-600">Pour avoir créé ton réseau d'étude</p>
              </div>
            </div>
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
          className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden"
        >
          {/* Header premium noir avec texte blanc forcé */}
          <div className="bg-gray-900 border-b border-gray-800 p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              style={{ color: '#E5E7EB' }}
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-800 border border-gray-700 rounded-xl">
                <div style={{ color: 'white', opacity: 0.9 }}>
                  {currentStepData.icon}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'white' }}>{currentStepData.title}</h2>
                <p style={{ color: '#E5E7EB' }}>{currentStepData.description}</p>
              </div>
            </div>
            
            {/* Barre de progression premium */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-3" style={{ color: '#E5E7EB' }}>
                <span>Étape {currentStep + 1} sur {steps.length}</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Content - Plus de limitation de hauteur */}
          <div className="p-8">
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

          {/* Footer Premium avec CTA uniformisés */}
          <div className="border-t border-gray-200 p-8 bg-white">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium bg-transparent border border-transparent hover:bg-blue-50 rounded-lg"
              >
                Précédent
              </button>
              
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleComplete}
                  className="px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-sm hover:shadow-md text-lg"
                >
                  Commencer l'aventure
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm hover:shadow-md text-lg"
                >
                  <span>Continuer</span>
                  <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}



