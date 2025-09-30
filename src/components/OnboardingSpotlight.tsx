'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Star,
  Users,
  Brain,
  Calendar,
  Wallet,
  MessageCircle,
  Video,
  Sparkles,
  Heart,
  Rocket,
  HelpCircle
} from 'lucide-react';

export interface TourStep {
  id: string;
  target: string;
  title: string;
  message: string;
  icon?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingSpotlightProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  userName?: string;
}

export function OnboardingSpotlight({
  isActive,
  onComplete,
  onSkip,
  userName = 'Étudiant'
}: OnboardingSpotlightProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      target: '[data-tour="mes-cours"]',
      title: `Bienvenue ${userName} ! 👋`,
      message: 'Voici tes cours favoris, spécialement sélectionnés pour toi, pour coller à tes ambitions.',
      icon: <Star className="text-yellow-500" size={20} />,
      position: 'bottom'
    },
    {
      id: 'faculty-courses',
      target: '[data-tour="faculty-courses"]',
      title: 'Découverte communautaire',
      message: 'Ici, tu vois aussi ce que tes pairs explorent chez nous.',
      icon: <Users className="text-blue-500" size={20} />,
      position: 'top'
    },
    {
      id: 'planning',
      target: '[data-tour="planning"]',
      title: 'Planification intelligente',
      message: 'Planifie ton apprentissage. Tu pourras organiser tes cours et tes examens facilement.',
      icon: <Calendar className="text-purple-500" size={20} />,
      position: 'right'
    },
    {
      id: 'community',
      target: '[data-tour="community"]',
      title: 'Rejoins la communauté',
      message: 'Discute, trouve des buddies et progresse avec les autres.',
      icon: <Users className="text-green-500" size={20} />,
      position: 'right'
    },
    {
      id: 'unlock',
      target: '[data-tour="unlock"]',
      title: 'Catalogue complet',
      message: 'Ici, tu peux explorer l\'intégralité de notre catalogue : leçons, cours, packs… tout est là.',
      icon: <Brain className="text-orange-500" size={20} />,
      position: 'right'
    },
    {
      id: 'wallet',
      target: '[data-tour="wallet"]',
      title: 'Ton portefeuille 💸',
      message: 'Ton portefeuille a été crédité — utilise-le pour débloquer tes premiers contenus.',
      icon: <Wallet className="text-emerald-500" size={20} />,
      position: 'bottom'
    },
    {
      id: 'whatsapp',
      target: '[data-tour="whatsapp"]',
      title: 'Support instantané',
      message: 'Un doute ? Une question ? Clique ici pour discuter avec nous directement sur WhatsApp.',
      icon: <MessageCircle className="text-green-600" size={20} />,
      position: 'bottom'
    },
    {
      id: 'study-rooms',
      target: '[data-tour="study-rooms"]',
      title: 'Study Rooms 🚀',
      message: 'Travaille en live avec d\'autres étudiants dans les Study Rooms. L\'apprentissage est encore plus fort ensemble !',
      icon: <Video className="text-blue-600" size={20} />,
      position: 'bottom'
    }
  ];

  useEffect(() => {
    if (isActive && currentStep < tourSteps.length) {
      const step = tourSteps[currentStep];
      setTimeout(() => {
        findAndHighlightTarget(step);
      }, 300);
    }
  }, [isActive, currentStep]);

  const findAndHighlightTarget = (step: TourStep) => {
    const element = document.querySelector(step.target) as HTMLElement;
    
    if (element) {
      setTargetElement(element);
      
      // Scroll vers l'élément
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });

      // Mettre à jour le rectangle après le scroll
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      }, 500);
    } else {
      console.warn(`Tour element not found: ${step.target}`);
      setTimeout(() => nextStep(), 1000);
    }
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setTargetElement(null);
    setTargetRect(null);
    onComplete();
  };

  const skipTour = () => {
    setTargetElement(null);
    setTargetRect(null);
    onSkip();
  };

  const currentTourStep = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  if (!isActive || currentStep >= tourSteps.length) {
    return null;
  }

  return (
    <>
      {/* Overlay avec découpe spotlight */}
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0"
        >
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              {targetRect && (
                <ellipse
                  cx={targetRect.left + targetRect.width / 2}
                  cy={targetRect.top + targetRect.height / 2}
                  rx={targetRect.width / 2 + 20}
                  ry={targetRect.height / 2 + 20}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.7)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      </div>

      {/* Bordure autour de l'élément ciblé */}
      {targetRect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-[9999] pointer-events-none border-4 border-blue-500 rounded-xl"
          style={{
            left: targetRect.left - 10,
            top: targetRect.top - 10,
            width: targetRect.width + 20,
            height: targetRect.height + 20,
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
          }}
        />
      )}

      {/* Tooltip flottant */}
      <AnimatePresence>
        {currentTourStep && targetRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed z-[10000] max-w-sm pointer-events-auto"
            style={{
              left: Math.max(10, Math.min(
                targetRect.left + targetRect.width / 2 - 160,
                window.innerWidth - (window.innerWidth < 768 ? window.innerWidth - 20 : 320)
              )),
              top: currentTourStep.position === 'top' 
                ? targetRect.top - 280
                : targetRect.bottom + 20,
              width: window.innerWidth < 768 ? window.innerWidth - 20 : 320,
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 relative">
              {/* Flèche pointer */}
              <div
                className="absolute w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                  [currentTourStep.position === 'top' ? 'bottom' : 'top']: '-8px',
                }}
              />

              {/* Contenu */}
              <div className="flex items-center gap-3 mb-3">
                {currentTourStep.icon}
                <h3 className="text-lg font-bold text-gray-900">
                  {currentTourStep.title}
                </h3>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {currentTourStep.message}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500">
                    Étape {currentStep + 1} sur {tourSteps.length}
                  </span>
                  <button
                    onClick={skipTour}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Ignorer
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                  Précédent
                </button>

                {isLastStep ? (
                  <button
                    onClick={completeTour}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                  >
                    <Sparkles size={16} />
                    Terminé !
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Suivant
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {/* Bouton fermer */}
              <button
                onClick={skipTour}
                className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message final */}
      {isLastStep && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10001] pointer-events-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Tu connais maintenant les bases ! 🎉
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Explore, progresse, et souviens-toi : tu n'es jamais seul dans ton parcours.
            </p>
            <button
              onClick={completeTour}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700"
            >
              <Heart className="text-red-200" size={16} />
              Commencer mon aventure
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}

