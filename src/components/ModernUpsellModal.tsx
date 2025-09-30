'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  BookOpen,
  Clock,
  CheckCircle,
  Star,
  Crown,
  Zap,
  Users,
  Calendar,
  Award,
  Wallet,
  MessageCircle,
  FileText,
  Shield,
  Target,
  Lightbulb
} from 'lucide-react';
import { Course, CoursePack } from '@/types';

// Fonctions utilitaires pour calculer la valeur totale
const calculateLessonsTotalValue = (courseId: string): number => {
  // Simulation : 5 leçons à 70€ chacune = 350€
  return 5 * 70;
};

const calculateCoursesTotalValue = (packId: string): number => {
  // Simulation : 3 cours à 700€ chacun = 2100€
  return 3 * 700;
};

interface ModernUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course;
  recommendedPack: CoursePack;
  userBalance: number;
  onPurchaseCourse: (course: Course) => void;
  onPurchasePack: (pack: CoursePack) => void;
  canAffordCourse: boolean;
  canAffordPack: boolean;
}

export function ModernUpsellModal({
  isOpen,
  onClose,
  selectedCourse,
  recommendedPack,
  userBalance,
  onPurchaseCourse,
  onPurchasePack,
  canAffordCourse,
  canAffordPack
}: ModernUpsellModalProps) {
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Choisissez votre parcours d'apprentissage
                </h2>
                <p className="text-gray-600 mt-1">
                  Nous vous recommandons une approche complète pour maximiser votre réussite
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content - 3 colonnes responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 max-h-[calc(90vh-120px)] overflow-y-auto">
            
            {/* Colonne 1 - Leçon unique */}
            <div className="p-6 border-r border-gray-200 relative">
              {/* Badge accès basique */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium z-10 shadow-sm">
                Accès basique
              </div>

              <div className="h-full flex flex-col pt-8">
                {/* Header leçon */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="text-gray-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Leçon seule : Les fondamentaux essentiels</h3>
                      <p className="text-gray-600">Accès basique à cette leçon uniquement</p>
                    </div>
                  </div>
                </div>

                {/* Contenu de la leçon */}
                <div className="flex-1 space-y-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Accès immédiat à la vidéo HD de la leçon</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Quiz d'auto-évaluation</span>
                    </div>
                  </div>
                </div>

                {/* Prix et action leçon */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">70€</div>
                    <div className="text-sm text-gray-600">euros</div>
                  </div>
                  
                  <button
                    onClick={() => onPurchaseCourse(selectedCourse)}
                    disabled={!canAffordCourse}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      canAffordCourse
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Débloquer la leçon pour 70€
                  </button>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Option de repli</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2 - Cours Complet */}
            <div className="p-6 border-r border-gray-200 relative">
              {/* Badge avantage pédagogique */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium z-10 shadow-sm">
                Recommandé
              </div>

              <div className="h-full flex flex-col pt-8">
                {/* Header cours */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Target className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Cours Complet</h3>
                      <p className="text-gray-600">Parcours pédagogique structuré et complet</p>
                    </div>
                  </div>
                </div>

                {/* Contenu du cours */}
                <div className="flex-1 space-y-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Toutes les leçons du cours choisi</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Vidéos HD</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Accès aux Study Rooms liées à ce cours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Accès au groupe WhatsApp du cours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Garantie de réussite</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Support prioritaire</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Planification incluse</span>
                    </div>
                  </div>
                </div>

                {/* Prix et action cours */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">700€</div>
                    <div className="text-sm text-gray-600">euros</div>
                    
                  </div>
                  
                  <button
                    onClick={() => onPurchaseCourse(selectedCourse)}
                    disabled={!canAffordCourse}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      canAffordCourse
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Débloquer le cours pour 700€
                  </button>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Avantage pédagogique</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 3 - Pack Électrostatique */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 relative">
              {/* Badge meilleur investissement */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium z-10 shadow-sm">
                Meilleur investissement
              </div>

              <div className="h-full flex flex-col">
                {/* Header pack */}
                <div className="mb-6 pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Crown className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Pack Électrostatique</h3>
                      <p className="text-gray-600">Formation complète en électrostatique</p>
                    </div>
                  </div>
                </div>

                {/* Contenu du pack */}
                <div className="flex-1 space-y-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 mt-0.5" />
                      <div className="text-gray-700">
                        <div className="font-medium mb-1">Accès à l'ensemble des cours d'électrostatique :</div>
                        <ul className="text-sm text-gray-600 ml-2 space-y-1">
                          <li>• Loi de Gauss</li>
                          <li>• Intégrales et Applications</li>
                          <li>• Forces et Mouvement</li>
                          <li>• Suites et Limites</li>
                          <li>• Champs Électriques</li>
                          <li>• Potentiels et Énergie</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Vidéos HD</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Slides PDF disponibles pour tous les cours du pack</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Accès aux Study Rooms premium</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Accès à tous les groupes WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Garantie de réussite (globale)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Support prioritaire</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-gray-700">Planificateur inclus</span>
                    </div>
                  </div>
                </div>

                {/* Prix et action pack */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">1200€</div>
                    <div className="text-sm text-gray-600">euros</div>
                    
                  </div>
                  
                  <button
                    onClick={() => onPurchasePack(recommendedPack)}
                    disabled={!canAffordPack}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      canAffordPack
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Débloquer le pack pour 1200€
                  </button>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Option de repli</p>
                  </div>
                  
                  {/* Hint Wallet - uniquement pour le pack complet */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={16} className="text-blue-600 mt-0.5" />
                      <div className="text-xs text-blue-800">
                        <p className="font-medium mb-1">💡 Astuce portefeuille</p>
                        <p>En rechargeant ton portefeuille, tu bénéficies d'un bonus additionnel offert. Offre valable pour une durée limitée.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                💡 <strong>Conseil pédagogique :</strong> Une approche progressive et complète est la clé de la réussite ! Nos experts recommandent de maîtriser l'ensemble du sujet. Tu peux toujours commencer petit et évoluer !
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Wallet size={16} className="text-gray-500" />
                <p className="text-xs text-gray-500">
                  Solde actuel du portefeuille : <strong>{userBalance.toFixed(2)}€</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

