'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  Heart, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Gift,
  Sparkles,
  Crown,
  Lock,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';

interface CheckoutItem {
  type: 'pack' | 'bundle';
  name: string;
  price: number;
  credits?: number;
  bonusCredits?: number;
  features: string[];
}

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  savings: string;
  features: string[];
  popularity: string;
  timeLeft?: string;
}

const specialOffers: SpecialOffer[] = [
  {
    id: 'coaching-addon',
    title: 'Session Coaching Personnalisé',
    description: 'Une heure avec un expert pour optimiser ton parcours',
    originalPrice: 49,
    offerPrice: 19,
    savings: '61% d\'économies',
    features: [
      'Analyse personnalisée de tes besoins',
      'Plan d\'étude sur mesure',
      'Techniques d\'apprentissage avancées',
      'Suivi de progression'
    ],
    popularity: '80% des étudiants ajoutent cette option',
    timeLeft: 'Offre valable pendant 10 minutes'
  },
  {
    id: 'study-guide',
    title: 'Guide Méthodes d\'Excellence',
    description: 'PDF exclusif avec toutes nos techniques secrètes',
    originalPrice: 29,
    offerPrice: 9,
    savings: '69% d\'économies',
    features: [
      'Plus de 100 pages de contenu',
      'Techniques de mémorisation',
      'Gestion du stress aux examens',
      'Planning optimal'
    ],
    popularity: '92% de nos étudiants excellent utilisent ce guide'
  }
];

export const PremiumCheckout = ({ 
  item, 
  onClose, 
  onConfirm 
}: { 
  item: CheckoutItem;
  onClose: () => void;
  onConfirm: (finalItems: (CheckoutItem | SpecialOffer)[]) => void;
}) => {
  const [currentStep, setCurrentStep] = useState<'review' | 'offers' | 'payment'>('review');
  const [selectedOffers, setSelectedOffers] = useState<SpecialOffer[]>([]);
  const [showGuarantee, setShowGuarantee] = useState(false);

  const totalPrice = item.price + selectedOffers.reduce((sum, offer) => sum + offer.offerPrice, 0);
  const totalSavings = selectedOffers.reduce((sum, offer) => sum + (offer.originalPrice - offer.offerPrice), 0);

  const handleOfferToggle = (offer: SpecialOffer) => {
    setSelectedOffers(prev => 
      prev.find(o => o.id === offer.id)
        ? prev.filter(o => o.id !== offer.id)
        : [...prev, offer]
    );
  };

  const handleContinue = () => {
    if (currentStep === 'review') {
      setCurrentStep('offers');
    } else if (currentStep === 'offers') {
      setCurrentStep('payment');
    } else {
      onConfirm([item, ...selectedOffers]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header avec progression */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Ton Capital Cognitif</h2>
                <p className="text-purple-100 text-sm">Investissement dans ton avenir</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Barre de progression */}
          <div className="flex items-center gap-2">
            {['Révision', 'Optimisation', 'Finalisation'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index <= ['review', 'offers', 'payment'].indexOf(currentStep)
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 text-white'
                }`}>
                  {index + 1}
                </div>
                <span className="ml-2 text-sm">{step}</span>
                {index < 2 && <ArrowRight size={16} className="mx-2" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[600px]">
          <AnimatePresence mode="wait">
            {/* Étape 1: Révision de la commande */}
            {currentStep === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Excellente décision ! 🎯
                  </h3>
                  <p className="text-gray-600">
                    Tu es sur le point d'investir dans ton avenir académique
                  </p>
                </div>

                {/* Résumé de la commande */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">{item.name}</h4>
                  
                  {item.credits && (
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🧠</span>
                      <div>
                        <div className="font-bold text-gray-900">
                          {item.credits + (item.bonusCredits || 0)} crédits au total
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.credits} crédits + {item.bonusCredits || 0} bonus
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    {item.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{item.price}€</span>
                  </div>
                </div>

                {/* Témoignages sociaux */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-green-600" />
                    <span className="font-medium text-green-800">Ce que disent nos étudiants</span>
                  </div>
                  <p className="text-green-700 text-sm italic">
                    "Grâce à mes crédits, j'ai pu débloquer exactement les cours dont j'avais besoin. 
                    Mon niveau en maths a explosé !" - Sarah, 17 ans
                  </p>
                </div>

                {/* Garantie */}
                <div 
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 cursor-pointer"
                  onClick={() => setShowGuarantee(!showGuarantee)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-blue-600" />
                      <span className="font-medium text-blue-800">Garantie Réussite 100%</span>
                    </div>
                    <motion.div
                      animate={{ rotate: showGuarantee ? 180 : 0 }}
                      className="text-blue-600"
                    >
                      <ArrowRight size={16} className="transform rotate-90" />
                    </motion.div>
                  </div>
                  
                  <AnimatePresence>
                    {showGuarantee && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 text-sm text-blue-700"
                      >
                        <p>
                          Si tu n'es pas satisfait de tes progrès dans les 30 jours, 
                          nous te remboursons intégralement ET tu gardes tes crédits. 
                          Notre mission : ta réussite, pas ton argent.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Étape 2: Offres spéciales */}
            {currentStep === 'offers' && (
              <motion.div
                key="offers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Optimisons ton investissement ! ✨
                  </h3>
                  <p className="text-gray-600">
                    Des offres exclusives disponibles uniquement maintenant
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {specialOffers.map((offer) => (
                    <motion.div
                      key={offer.id}
                      whileHover={{ scale: 1.02 }}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedOffers.find(o => o.id === offer.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => handleOfferToggle(offer)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{offer.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
                          
                          {/* Prix */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-gray-900">{offer.offerPrice}€</span>
                            <span className="text-sm text-gray-500 line-through">{offer.originalPrice}€</span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                              {offer.savings}
                            </span>
                          </div>

                          {/* Popularité */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                            <p className="text-yellow-800 text-xs font-medium">{offer.popularity}</p>
                          </div>

                          {/* Features */}
                          <div className="space-y-1">
                            {offer.features.slice(0, 2).map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle size={12} className="text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Checkbox */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedOffers.find(o => o.id === offer.id)
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedOffers.find(o => o.id === offer.id) && (
                            <CheckCircle size={16} className="text-white" />
                          )}
                        </div>
                      </div>

                      {offer.timeLeft && (
                        <div className="flex items-center gap-1 text-xs text-orange-600">
                          <Clock size={12} />
                          <span>{offer.timeLeft}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Récapitulatif */}
                {selectedOffers.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h5 className="font-medium text-green-800 mb-2">Ton optimisation :</h5>
                    <div className="flex justify-between text-sm text-green-700">
                      <span>Économies supplémentaires :</span>
                      <span className="font-bold">-{totalSavings}€</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Étape 3: Finalisation */}
            {currentStep === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Prêt pour le décollage ! 🚀
                  </h3>
                  <p className="text-gray-600">
                    Un dernier récapitulatif avant de booster ton apprentissage
                  </p>
                </div>

                {/* Récapitulatif final */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">Récapitulatif</h4>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-medium">{item.price}€</span>
                    </div>
                    
                    {selectedOffers.map((offer) => (
                      <div key={offer.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{offer.title}</span>
                        <span className="text-green-600">{offer.offerPrice}€</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{totalPrice}€</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="text-green-600 text-sm text-right">
                        Tu économises {totalSavings}€ !
                      </div>
                    )}
                  </div>
                </div>

                {/* Accompagnement rassurant */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart size={16} className="text-blue-600" />
                    <span className="font-medium text-blue-800">Notre engagement</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Nous ne te laissons pas seul. Notre équipe t'accompagne jusqu'à ta réussite. 
                    C'est notre mission, pas juste un service.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer avec bouton d'action */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-lg font-bold text-gray-900">
                Total : {totalPrice}€
              </div>
              {totalSavings > 0 && (
                <div className="text-green-600 text-sm">
                  Économies : {totalSavings}€
                </div>
              )}
            </div>
            
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {currentStep === 'payment' ? 'Investir maintenant' : 'Continuer'}
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Éléments rassurants */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Lock size={12} className="text-green-500" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={12} className="text-blue-500" />
              <span>Garantie 30 jours</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={12} className="text-red-500" />
              <span>Support bienveillant</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

