'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight,
  ArrowRight,
  Calendar,
  Map,
  FileCheck,
  Users,
  Play
} from 'lucide-react';

interface Booster {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  comingSoon: boolean;
  price: number;
  originalPrice: number;
}

interface MasteryBoostersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock?: (boosterId: string, price: number) => void;
  unlockedBoosters?: string[];
}

const boosters: Booster[] = [
  {
    id: 'planner',
    title: 'Smart Planner',
    subtitle: 'IA qui planifie pour toi',
    description: 'Planification automatique de tes révisions basée sur ton énergie et tes objectifs.',
    icon: Calendar,
    comingSoon: false,
    price: 0,
    originalPrice: 10
  },
  {
    id: 'path',
    title: 'Learning Path Creator',
    subtitle: 'Parcours personnalisé',
    description: 'Création automatique de parcours d\'apprentissage sur mesure.',
    icon: Map,
    comingSoon: true,
    price: 12,
    originalPrice: 15
  },
  {
    id: 'exams',
    title: 'Mock Exams',
    subtitle: 'Examens blancs IA',
    description: 'Entraîne-toi avec des examens générés par l\'IA.',
    icon: FileCheck,
    comingSoon: true,
    price: 8,
    originalPrice: 10
  },
  {
    id: 'community',
    title: 'Study Community',
    subtitle: 'Apprends en groupe',
    description: 'Rejoins une communauté avec accès à des mentors experts.',
    icon: Users,
    comingSoon: true,
    price: 4,
    originalPrice: 5
  }
];

// Prix total si achetés séparément (avec prix originaux)
const totalPrice = boosters.reduce((sum, b) => sum + b.originalPrice, 0); // 40€
// Prix du pack
const packPrice = 19.99;

export function MasteryBoostersModal({ 
  isOpen, 
  onClose,
  onUnlock
}: MasteryBoostersModalProps) {

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-3xl max-w-7xl w-full mx-4 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-8 pb-6 border-b border-gray-100">
            <div className="absolute top-6 right-6 flex items-center gap-3">
              {/* Support WhatsApp */}
              <a 
                href="https://wa.me/33123456789?text=Bonjour%2C%20j%27ai%20une%20question%20sur%20les%20Mastery%20Boosters"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold rounded-xl transition-colors text-base"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Support WhatsApp</span>
              </a>
              
              {/* Bouton fermer */}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Des bases solides. Une progression accélérée.
            </h1>
          </div>

          {/* Grid 2x2 */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {boosters.map((booster, index) => {
                const Icon = booster.icon;
                
                return (
                  <motion.div
                    key={booster.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden group hover:border-gray-300 hover:shadow-lg transition-all"
                  >
                    {/* Card Header */}
                    <div className="p-5 pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                            <Icon size={20} className="text-white" />
                          </div>
                          <div className="h-6 w-px bg-gray-200" />
                          <span className="text-gray-400 text-sm font-medium">SMS</span>
                        </div>
                        
                        {/* Prix individuel */}
                        <div className="text-right">
                          {booster.comingSoon ? (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm line-through">${booster.originalPrice}</span>
                              <span className="text-gray-900 text-sm font-bold">${booster.price}</span>
                              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded">
                                Bientôt
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm line-through">${booster.originalPrice}</span>
                              <span className="text-[#00c2ff] text-sm font-bold">Gratuit</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-1">{booster.title}</h3>
                      <p className="text-gray-500 text-sm">{booster.description}</p>
                    </div>

                    {/* Visual Preview - Video */}
                    <div 
                      className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200 mx-4 mb-4 rounded-xl overflow-hidden group-hover:from-gray-200 group-hover:to-gray-300 transition-colors cursor-pointer"
                      onClick={() => {
                        // Ouvrir la vidéo de démo
                        console.log(`Voir la démo de ${booster.title}`);
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                            <Play size={20} className="text-gray-900 ml-1" fill="currentColor" />
                          </div>
                          <p className="text-gray-500 text-sm font-medium">Voir la démo</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pack CTA - Style exact du process de paiement */}
            <div className="mt-8">
              <div className="bg-[#1E252E] rounded-2xl p-6 shadow-lg">
                <div className="flex items-start">
                  {/* Contenu principal */}
                  <div className="flex-1">
                    {/* Titre + Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>Pack Complet (4 Boosters)</h3>
                      <span className="px-2.5 py-1 bg-[#404B57] text-white text-xs font-bold rounded">
                        -50%
                      </span>
                    </div>
                    
                    {/* Prix */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span 
                          className="text-2xl relative" 
                          style={{ 
                            color: '#A6AAAD',
                            textDecoration: 'line-through',
                            textDecorationThickness: '3px',
                            textDecorationColor: '#A6AAAD',
                            opacity: 0.7
                          }}
                        >
                          ${totalPrice}
                        </span>
                        <span className="text-white text-3xl font-bold">${packPrice}</span>
                        <span className="text-sm" style={{ color: '#A6AAAD' }}>par mois · sans engagement</span>
                      </div>
                      
                      {/* Bouton CTA Paiement */}
                      <button
                        onClick={() => {
                          // Redirection vers le process de paiement
                          onUnlock?.('pack-all', packPrice);
                          window.location.href = '/checkout?pack=mastery-boosters';
                        }}
                        className="w-full md:w-auto px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        Procéder au paiement
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-3">
                {/* Cercles colorés qui se chevauchent */}
                <div className="flex items-center -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-white"></div>
                </div>
                
                {/* Texte social proof */}
                <p className="text-gray-700 text-sm">
                  <span className="font-bold text-gray-900">+2,400</span> étudiants ont déjà décollé avec nous
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
