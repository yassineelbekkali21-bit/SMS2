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
  target: string; // Sélecteur CSS pour l'élément à cibler
  title: string;
  message: string;
  icon?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  delay?: number;
}

interface OnboardingTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  userName?: string;
}

export function OnboardingTour({
  isActive,
  onComplete,
  onSkip,
  userName = 'Étudiant'
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      target: '[data-tour="mes-cours"]',
      title: `Bienvenue ${userName} ! 👋`,
      message: 'Voici tes cours favoris, spécialement sélectionnés pour toi, pour coller à tes ambitions.',
      icon: <Star className="text-yellow-500" size={20} />,
      position: 'bottom',
      delay: 500
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
      const timeout = setTimeout(() => {
        findAndHighlightTarget(step);
      }, step.delay || 100);

      return () => clearTimeout(timeout);
    }
  }, [isActive, currentStep]);

  const findAndHighlightTarget = (step: TourStep) => {
    const element = document.querySelector(step.target) as HTMLElement;
    
    if (element) {
      setTargetElement(element);
      
      // Calculer la position du tooltip
      const rect = element.getBoundingClientRect();
      const position = calculateTooltipPosition(rect, step.position || 'bottom');
      setTooltipPosition(position);

      // Scroll vers l'élément si nécessaire avec délai
      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }, 200);
    } else {
      console.warn(`Tour element not found: ${step.target}`);
      // Passer à l'étape suivante si l'élément n'est pas trouvé
      setTimeout(() => nextStep(), 1000);
    }
  };

  const calculateTooltipPosition = (rect: DOMRect, position: string) => {
    const offset = 20;
    
    switch (position) {
      case 'top':
        return { x: rect.left + rect.width / 2, y: rect.top - offset };
      case 'bottom':
        return { x: rect.left + rect.width / 2, y: rect.bottom + offset };
      case 'left':
        return { x: rect.left - offset, y: rect.top + rect.height / 2 };
      case 'right':
        return { x: rect.right + offset, y: rect.top + rect.height / 2 };
      case 'center':
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      default:
        return { x: rect.left + rect.width / 2, y: rect.bottom + offset };
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
    onComplete();
  };

  const skipTour = () => {
    setTargetElement(null);
    onSkip();
  };

  const currentTourStep = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  if (!isActive || currentStep >= tourSteps.length) {
    return null;
  }

  return (
    <>
      {/* Highlight de l'élément ciblé avec overlay intelligent */}
      {targetElement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: targetElement.getBoundingClientRect().left - 8,
            top: targetElement.getBoundingClientRect().top - 8,
            width: targetElement.getBoundingClientRect().width + 16,
            height: targetElement.getBoundingClientRect().height + 16,
            borderRadius: '12px',
            border: '3px solid #3B82F6',
            backgroundColor: 'white',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(59, 130, 246, 0.6)',
          }}
        />
      )}

      {/* Tooltip avec message */}
      <AnimatePresence>
        {currentTourStep && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed z-[10000] max-w-sm pointer-events-auto"
            style={{
              left: Math.max(20, Math.min(tooltipPosition.x - 150, window.innerWidth - 320)),
              top: Math.max(20, Math.min(tooltipPosition.y, window.innerHeight - 200)),
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 relative">
              {/* Icône et titre */}
              <div className="flex items-center gap-3 mb-3">
                {currentTourStep.icon}
                <h3 className="text-lg font-bold text-gray-900">
                  {currentTourStep.title}
                </h3>
              </div>

              {/* Message */}
              <p className="text-gray-700 leading-relaxed mb-6">
                {currentTourStep.message}
              </p>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500">
                    Étape {currentStep + 1} sur {tourSteps.length}
                  </span>
                  <button
                    onClick={skipTour}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Ignorer le tour
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={16} />
                  <span>Précédent</span>
                </button>

                {isLastStep ? (
                  <button
                    onClick={completeTour}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    <Sparkles size={16} />
                    <span>C'est parti !</span>
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    <span>Suivant</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {/* Bouton fermer */}
              <button
                onClick={skipTour}
                className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message de conclusion pour la dernière étape */}
      {isLastStep && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10001] pointer-events-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Tu connais maintenant les bases ! 🎉
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Explore, progresse, et souviens-toi : tu n'es jamais seul dans ton parcours.
              </p>
            </div>

            <button
              onClick={completeTour}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Heart className="text-red-200" size={16} />
              <span>Commencer mon aventure</span>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
