import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Target, 
  Sparkles, 
  ArrowRight,
  X,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';

interface PlannerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlanning: () => void;
  onPostpone: () => void; // Nouvelle prop pour "Plus tard"
  courseName?: string;
  showCelebration?: boolean; // Nouvelle prop pour la célébration
  packTitle?: string; // Titre du pack pour la célébration
}

export function PlannerOnboardingModal({ 
  isOpen, 
  onClose, 
  onStartPlanning,
  onPostpone,
  courseName,
  showCelebration = false,
  packTitle
}: PlannerOnboardingModalProps) {
  console.log('🎯 ONBOARDING MODAL: Rendu avec isOpen:', isOpen, 'courseName:', courseName);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Sparkles className="text-emerald-600" size={40} />,
      title: showCelebration ? "🎉 Félicitations !" : "Félicitations !",
      subtitle: showCelebration && packTitle 
        ? `Tu viens de débloquer le pack "${packTitle}"` 
        : courseName 
          ? `Tu viens de débloquer "${courseName}"` 
          : "Tu as débloqué un cours complet",
      description: showCelebration 
        ? "🎁 En récompense, tu reçois +100€ sur ta prochaine recharge ! Et maintenant, organise ton apprentissage avec le planificateur intelligent."
        : "Et avec ça, tu as maintenant accès à ton planificateur personnel !",
      color: showCelebration 
        ? "bg-gradient-to-br from-yellow-50 to-orange-50" 
        : "bg-gradient-to-br from-emerald-50 to-green-50",
      iconBg: showCelebration 
        ? "bg-yellow-100" 
        : "bg-emerald-100"
    },
    {
      icon: <Calendar className="text-blue-600" size={40} />,
      title: "Construisons ton planning ensemble !",
      subtitle: "Ton GPS personnel pour réussir",
      description: courseName ? 
        "Veux-tu ajouter ce nouveau cours à ton planning existant ou créer un nouveau planning personnalisé maintenant ?" :
        "Maintenant que tu as accès au planificateur, veux-tu configurer ton planning personnalisé maintenant ou préfères-tu le faire plus tard ?",
      color: "bg-gradient-to-br from-blue-50 to-indigo-50",
      iconBg: "bg-blue-100"
    },
    {
      icon: <Target className="text-blue-600" size={40} />,
      title: "Prêt pour le succès ?",
      subtitle: "Planification intelligente activée",
      description: "Deadlines automatiques, adaptation en temps réel, et buddy system pour te motiver !",
      color: "bg-gradient-to-br from-blue-50 to-indigo-50",
      iconBg: "bg-blue-100"
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartPlanning();
      onClose();
    }
  };

  const handlePlanNow = () => {
    // Aller directement à l'étape 3 depuis l'étape 2
    setCurrentStep(2);
  };

  const handlePostpone = () => {
    // Sortir de l'onboarding et mémoriser que l'utilisateur a reporté
    onPostpone();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 md:p-8"
        style={{ position: 'fixed', zIndex: 9999 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200"
        >
          {/* Header avec fond clair et accents colorés */}
          <div className={`${currentStepData.color} p-8 text-center relative border-b border-gray-100`}>
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            
            <motion.div
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", damping: 20 }}
              className={`w-20 h-20 ${currentStepData.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm`}
            >
              {currentStepData.icon}
            </motion.div>
            
            <motion.h2
              key={`title-${currentStep}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-semibold text-gray-900 mb-3"
            >
              {currentStepData.title}
            </motion.h2>
            
            <motion.p
              key={`subtitle-${currentStep}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 font-medium text-lg"
            >
              {currentStepData.subtitle}
            </motion.p>
          </div>

          {/* Contenu avec fond blanc */}
          <div className="p-8 bg-white">
            <motion.p
              key={`desc-${currentStep}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-center leading-relaxed mb-8 text-base"
            >
              {currentStepData.description}
            </motion.p>

            {/* Features highlight pour l'étape finale - Design moderne */}
            {currentStep === 2 && (
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-4 mb-8"
              >
                <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Clock className="text-blue-600 mx-auto mb-2" size={24} />
                  <span className="text-xs text-blue-700 font-medium">Horaires optimisés</span>
                </div>
                <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <TrendingUp className="text-emerald-600 mx-auto mb-2" size={24} />
                  <span className="text-xs text-emerald-700 font-medium">Suivi progrès</span>
                </div>
                <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Users className="text-blue-600 mx-auto mb-2" size={24} />
                  <span className="text-xs text-blue-700 font-medium">Buddy system</span>
                </div>
              </motion.div>
            )}

            {/* Progress dots - Design moderne */}
            <div className="flex justify-center space-x-3 mb-8">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: index === currentStep ? 1.2 : 1 }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-gray-900 w-8' 
                      : index < currentStep 
                        ? 'bg-gray-400' 
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Actions - Boutons adaptatifs selon l'étape */}
            {currentStep === 1 ? (
              // Étape 2 : Choix entre planifier maintenant ou plus tard
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={handlePlanNow}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3"
                >
                  <Calendar size={18} />
                  Oui, je planifie maintenant
                </motion.button>
                <button
                  onClick={handlePostpone}
                  className="w-full py-3 px-4 text-gray-500 hover:text-gray-700 transition-colors font-medium border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Clock size={16} />
                  Plus tard
                </button>
              </div>
            ) : (
              // Autres étapes : navigation normale
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 px-4 text-gray-500 hover:text-gray-700 transition-colors font-medium border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Passer
                </button>
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-medium hover:from-gray-800 hover:to-gray-700 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
