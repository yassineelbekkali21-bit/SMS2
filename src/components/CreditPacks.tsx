'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Gift, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle,
  Star,
  TrendingUp,
  Heart,
  Zap,
  Crown,
  Target,
  Award,
  BookOpen,
  X
} from 'lucide-react';
import { CoursePack } from '@/types';
import { getCoursePacks } from '@/lib/mock-data';

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  bonusCredits: number;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
  icon: React.ReactNode;
  color: string;
  savings?: string;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  bundlePrice: number;
  items: {
    name: string;
    description: string;
    value: number;
  }[];
  highlight: string;
  savings: string;
  icon: React.ReactNode;
  color: string;
}

const creditPacks: CreditPack[] = [
  {
    id: 'starter',
    name: 'Pack Découverte',
    credits: 5,
    bonusCredits: 1,
    price: 15,
    description: 'Parfait pour commencer ton aventure d\'apprentissage',
    features: [
      '5 crédits + 1 bonus de bienvenue',
      'Accès à tous les cours de base',
      'Support par chat 24/7',
      'Valable 6 mois'
    ],
    icon: <Sparkles size={24} />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'student',
    name: 'Pack Étudiant',
    credits: 12,
    bonusCredits: 3,
    price: 29,
    description: 'L\'essentiel pour une année scolaire réussie',
    features: [
      '12 crédits + 3 bonus progression',
      'Accès prioritaire aux nouveaux cours',
      'Session de coaching mensuelle',
      'Certificats personnalisés',
      'Valable 12 mois'
    ],
    popular: true,
    icon: <Brain size={24} />,
    color: 'from-purple-500 to-pink-500',
    savings: '30% d\'économies'
  },
  {
    id: 'excellence',
    name: 'Pack Excellence',
    credits: 25,
    bonusCredits: 8,
    price: 49,
    description: 'Pour les ambitieux qui visent l\'excellence',
    features: [
      '25 crédits + 8 bonus excellence',
      'Accès illimité à tous les cours premium',
      'Coaching personnalisé hebdomadaire',
      'Groupe privé d\'excellence',
      'Certificats NFT blockchain',
      'Valable 12 mois'
    ],
    recommended: true,
    icon: <Crown size={24} />,
    color: 'from-yellow-500 to-orange-500',
    savings: '45% d\'économies'
  }
];

const bundles: Bundle[] = [
  {
    id: 'back-to-school',
    name: 'Bundle Rentrée Scolaire',
    description: 'Tout ce dont tu as besoin pour une rentrée réussie',
    originalPrice: 89,
    bundlePrice: 59,
    items: [
      { name: 'Pack Étudiant (15 crédits)', description: '12 crédits + 3 bonus', value: 29 },
      { name: 'Guide Méthodes d\'Étude', description: 'PDF exclusif 50 pages', value: 19 },
      { name: 'Planning Personnalisé', description: 'Créé par nos experts', value: 25 },
      { name: 'Session Coaching Privée', description: '1h avec un expert', value: 35 }
    ],
    highlight: '80% des étudiants choisissent ce bundle pour leur rentrée',
    savings: '34% d\'économies',
    icon: <Target size={24} />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'exam-prep',
    name: 'Bundle Préparation Examens',
    description: 'Maximise tes chances de réussite aux examens',
    originalPrice: 129,
    bundlePrice: 79,
    items: [
      { name: 'Pack Excellence (33 crédits)', description: '25 crédits + 8 bonus', value: 49 },
      { name: 'Méthodes Anti-Stress', description: 'Techniques de gestion du stress', value: 29 },
      { name: 'Banque de Sujets', description: '500+ exercices corrigés', value: 39 },
      { name: 'Coaching Intensif', description: '3 sessions avant examens', value: 75 }
    ],
    highlight: '95% de réussite chez nos étudiants qui prennent ce bundle',
    savings: '39% d\'économies',
    icon: <Award size={24} />,
    color: 'from-red-500 to-pink-500'
  }
];

// Composant Pack de Crédits
const CreditPackCard = ({ 
  pack, 
  onSelect, 
  isSelected 
}: { 
  pack: CreditPack; 
  onSelect: (pack: CreditPack) => void;
  isSelected: boolean;
}) => (
  <motion.div
    whileHover={{ y: -8 }}
    whileTap={{ scale: 0.98 }}
    className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${
      isSelected 
        ? 'border-gray-900 shadow-2xl shadow-gray-900/25' 
        : 'border-gray-200 hover:border-gray-400 hover:shadow-xl'
    } ${pack.popular ? 'ring-2 ring-gray-300' : ''}`}
    onClick={() => onSelect(pack)}
  >
    {/* Badge populaire */}
    {pack.popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          <Star size={12} />
          Plus populaire
        </div>
      </div>
    )}

    {/* Badge recommandé */}
    {pack.recommended && (
      <div className="absolute -top-3 right-4">
        <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Crown size={12} />
          Recommandé
        </div>
      </div>
    )}

    {/* Header avec icône */}
    <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
      <div className="text-2xl">{pack.icon}</div>
    </div>

    {/* Contenu */}
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{pack.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{pack.description}</p>

      {/* Prix et crédits */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">🧠</span>
          <span className="text-2xl font-bold text-gray-900">
            {pack.credits + pack.bonusCredits}
          </span>
          <span className="text-gray-600">crédits</span>
        </div>
        <div className="text-sm text-gray-500">
          {pack.credits} crédits + {pack.bonusCredits} bonus
        </div>
        {pack.savings && (
          <div className="text-green-600 text-sm font-medium mt-1">
            {pack.savings}
          </div>
        )}
      </div>

      {/* Prix */}
      <div className="text-3xl font-bold text-gray-900 mb-4">
        {pack.price}€
      </div>

      {/* Features */}
      <div className="space-y-2 text-left mb-6">
        {pack.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Composant Bundle
const BundleCard = ({ 
  bundle, 
  onSelect, 
  isSelected 
}: { 
  bundle: Bundle; 
  onSelect: (bundle: Bundle) => void;
  isSelected: boolean;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${
      isSelected 
        ? 'border-green-500 shadow-2xl shadow-green-500/25' 
        : 'border-gray-200 hover:border-green-300 hover:shadow-xl'
    }`}
    onClick={() => onSelect(bundle)}
  >
    {/* Header */}
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${bundle.color} rounded-xl flex items-center justify-center text-white`}>
        {bundle.icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900">{bundle.name}</h3>
        <p className="text-gray-600 text-sm">{bundle.description}</p>
      </div>
    </div>

    {/* Prix */}
    <div className="flex items-center gap-3 mb-4">
      <span className="text-2xl font-bold text-gray-900">{bundle.bundlePrice}€</span>
      <span className="text-lg text-gray-500 line-through">{bundle.originalPrice}€</span>
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
        {bundle.savings}
      </span>
    </div>

    {/* Highlight */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <p className="text-blue-800 text-sm font-medium">{bundle.highlight}</p>
    </div>

    {/* Items inclus */}
    <div className="space-y-2">
      <h4 className="font-medium text-gray-900 text-sm">Inclus dans ce bundle :</h4>
      {bundle.items.map((item, index) => (
        <div key={index} className="flex items-center justify-between text-sm">
          <div>
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-gray-600 text-xs">{item.description}</div>
          </div>
          <span className="text-gray-500 font-medium">{item.value}€</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// Composant principal
export const CreditPacks = ({ 
  onClose, 
  onPurchase 
}: { 
  onClose: () => void;
  onPurchase: (type: 'pack' | 'bundle', item: CreditPack | Bundle) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'packs' | 'bundles' | 'courses'>('packs');
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [selectedCoursePack, setSelectedCoursePack] = useState<CoursePack | null>(null);
  const coursePacks = getCoursePacks();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-[90vw] w-full max-h-[98vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-900 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🧠</span>
              <div>
                <h2 className="text-3xl font-bold text-white !text-white" style={{ color: 'white !important' }}>Investis dans ton Capital Cognitif</h2>
                <p className="text-white !text-white mt-2" style={{ color: 'white !important' }}>Des packs conçus pour ton succès</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-3xl font-bold !text-white"
              style={{ color: 'white !important' }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('packs')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'packs'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Brain size={20} />
              Packs de Crédits
            </div>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'courses'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen size={20} />
              Packs de Cours
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bundles')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'bundles'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Gift size={20} />
              Bundles Spéciaux
            </div>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-8 overflow-y-auto max-h-[80vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'packs' && (
              <motion.div
                key="packs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Choisis ton Pack de Crédits
                  </h3>
                  <p className="text-gray-600">
                    Chaque crédit représente une opportunité d'apprentissage. Plus tu investis, plus tu économises !
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {creditPacks.map((pack) => (
                    <CreditPackCard
                      key={pack.id}
                      pack={pack}
                      onSelect={setSelectedPack}
                      isSelected={selectedPack?.id === pack.id}
                    />
                  ))}
                </div>

                {selectedPack && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <button
                      onClick={() => onPurchase('pack', selectedPack)}
                      className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                    >
                      Investir dans mon apprentissage - {selectedPack.price}€
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Packs de Cours Thématiques
                  </h3>
                  <p className="text-gray-600">
                    Débloquez des cours regroupés par thème avec des économies de crédits
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {coursePacks.map((pack) => (
                    <motion.div
                      key={pack.id}
                      whileHover={{ y: -4 }}
                      className={`relative bg-white border-2 p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                        selectedCoursePack?.id === pack.id
                          ? 'border-gray-900 shadow-2xl scale-105'
                          : 'border-gray-200 hover:border-gray-400 hover:shadow-xl'
                      }`}
                      onClick={() => setSelectedCoursePack(pack)}
                    >
                      {pack.badge && (
                        <div className="absolute -top-3 -right-3 bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          {pack.badge}
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className="text-4xl mb-4">{pack.icon}</div>
                        <h4 className="text-xl font-bold mb-2 text-gray-900">{pack.title}</h4>
                        <p className="text-gray-600 text-sm mb-4">{pack.description}</p>
                        
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-gray-900">{pack.creditCost}</span>
                          <Brain className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-600">crédits</span>
                        </div>
                        
                        {pack.savings > 0 && (
                          <div className="bg-gray-100 rounded-lg p-2 mb-4">
                            <span className="text-sm text-emerald-600 font-medium">
                              Économisez {pack.savings} crédits !
                            </span>
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          {pack.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {selectedCoursePack && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <button
                      onClick={() => onPurchase('pack', selectedCoursePack as any)}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Débloquer ce pack - {selectedCoursePack.creditCost} 🧠 crédits
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'bundles' && (
              <motion.div
                key="bundles"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Bundles Exclusifs
                  </h3>
                  <p className="text-gray-600">
                    Des offres spéciales qui combinent crédits et ressources pour maximiser ton potentiel
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {bundles.map((bundle) => (
                    <BundleCard
                      key={bundle.id}
                      bundle={bundle}
                      onSelect={setSelectedBundle}
                      isSelected={selectedBundle?.id === bundle.id}
                    />
                  ))}
                </div>

                {selectedBundle && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <button
                      onClick={() => onPurchase('bundle', selectedBundle)}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Prendre ce bundle - {selectedBundle.bundlePrice}€
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer rassurant */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-500" />
              <span>Paiement 100% sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-500" />
              <span>Garantie satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

