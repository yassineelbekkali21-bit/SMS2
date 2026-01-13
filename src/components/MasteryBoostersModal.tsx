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
  Play,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';

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
    description: 'Un planning intelligent qui s\'adapte à ton rythme et tes objectifs.\nMoins de stress, plus de régularité.',
    icon: Calendar,
    comingSoon: false,
    price: 0,
    originalPrice: 10
  },
  {
    id: 'path',
    title: 'Learning Path Creator',
    subtitle: 'Parcours personnalisé',
    description: 'Crée des parcours personnalisés à partir de tes besoins et de tes cours.\nTu sais toujours quoi travailler, et dans quel ordre.',
    icon: Map,
    comingSoon: true,
    price: 12,
    originalPrice: 15
  },
  {
    id: 'exams',
    title: 'Mock Exams',
    subtitle: 'Examens blancs IA',
    description: 'Entraîne-toi dans des conditions proches de l\'examen.\nIdentifie tes lacunes avant le jour J.',
    icon: FileCheck,
    comingSoon: true,
    price: 8,
    originalPrice: 10
  },
  {
    id: 'community',
    title: 'Study Community',
    subtitle: 'Apprends en groupe',
    description: 'Avance avec d\'autres étudiants et pose tes questions quand tu bloques.\nTu n\'es jamais seul face à une difficulté.',
    icon: Users,
    comingSoon: true,
    price: 4,
    originalPrice: 5
  }
];

// Prix total si achetés séparément (avec prix originaux)
const totalPrice = 50; // Prix total initial
// Prix du pack
const packPrice = 30;

export function MasteryBoostersModal({ 
  isOpen, 
  onClose,
  onUnlock
}: MasteryBoostersModalProps) {

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
      <motion.div
        key="mastery-boosters-modal"
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
          className="bg-[#0d1317] rounded-3xl w-[90%] max-w-7xl mx-auto shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Style Diagnostic/Onboarding */}
          <header className="sticky top-0 bg-[#0d1317]/95 backdrop-blur-sm border-b border-white/5 px-6 py-4 z-20">
            <div className="flex items-center justify-between">
              <Image 
                src="/brand/onboarding-logo.svg" 
                alt="Science Made Simple" 
                width={85} 
                height={85}
              />
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="px-6 pt-8 pb-6">
            {/* Title */}
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h1 
                  className="text-3xl md:text-4xl font-bold !text-white leading-tight flex-1"
                  style={{ fontFamily: 'var(--font-parafina), system-ui', fontWeight: 900 }}
                >
                  DES BASES SOLIDES.<br />UNE PROGRESSION ACCÉLÉRÉE.
                </h1>
                
                {/* Social Proof - Right aligned */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-[#0d1317]"></div>
                    <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-[#0d1317]"></div>
                    <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-[#0d1317]"></div>
                    <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-[#0d1317]"></div>
                  </div>
                  
                  <p className="text-sm whitespace-nowrap">
                    <span className="font-bold text-white">+2,400</span> <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>étudiants ont déjà décollé avec nous</span>
                  </p>
                </div>
              </div>
              <p 
                className="text-base max-w-5xl whitespace-pre-line"
                style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)' }}
              >
                Tu les actives uniquement si et quand tu en as besoin, selon ta façon d'apprendre.
              </p>
            </div>

            {/* Grid 2x2 - Dark Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {boosters.map((booster, index) => {
                const Icon = booster.icon;
                
                return (
                  <motion.div
                    key={booster.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#12161a] border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 hover:shadow-lg transition-all"
                  >
                    {/* Card Header */}
                    <div className="p-5 pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#00c2ff] flex items-center justify-center">
                            <Icon size={20} className="text-white" />
                          </div>
                          <div className="h-6 w-px bg-white/20" />
                          <span className="font-medium" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.95)' }}>{booster.title}</span>
                        </div>
                        
                        {/* Prix individuel */}
                        <div className="text-right">
                          {booster.comingSoon ? (
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 line-through" style={{ fontSize: '14px' }}>${booster.originalPrice}</span>
                              <span className="text-white font-bold" style={{ fontSize: '14px' }}>${booster.price}</span>
                              <span className="ml-2 px-2 py-0.5 bg-white/10 text-white/70 text-[10px] font-bold uppercase rounded">
                                Bientôt
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 line-through" style={{ fontSize: '14px' }}>${booster.originalPrice}</span>
                              <span className="text-[#00c2ff] font-bold" style={{ fontSize: '14px' }}>Gratuit</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="whitespace-pre-line" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '12px' }}>{booster.description}</p>
                    </div>

                    {/* Visual Preview - Video */}
                    <div 
                      className="relative h-36 bg-gradient-to-br from-[#1a1f24] to-[#0f1418] mx-4 mb-4 rounded-xl overflow-hidden group-hover:from-[#1f252a] group-hover:to-[#14191d] transition-colors cursor-pointer border border-white/5"
                      onClick={() => {
                        console.log(`Voir la démo de ${booster.title}`);
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                            <Play size={20} className="text-white ml-1" fill="currentColor" />
                          </div>
                          <p className="text-white/70 text-sm font-medium">Voir comment ça marche</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pack CTA - Dark Style */}
            <div className="mb-0">
              <div className="bg-[#1a1f24] border border-white/10 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold !text-white">Pack Complet (4 Boosters)</h3>
                      <span className="px-2.5 py-1 bg-white/10 text-white text-xs font-bold rounded flex-shrink-0">
                        -40%
                      </span>
                    </div>
                    
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
                        <span className="text-sm text-white/60">par mois · Résiliable à tout moment</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          onUnlock?.('pack-all', packPrice);
                          window.location.href = '/checkout?pack=mastery-boosters';
                        }}
                        className="w-full md:w-auto px-8 py-3 bg-[#00c2ff] hover:bg-[#00a8e0] text-white font-bold rounded-full transition-colors flex items-center justify-center gap-2"
                      >
                        Procéder au paiement
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bouton WhatsApp - Style DiagnosticFlow */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.open('https://wa.me/32477025622', '_blank')}
          className="fixed bottom-32 md:bottom-40 right-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-4 rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-105 font-medium text-base"
        >
          <MessageCircle size={22} className="flex-shrink-0" />
          <span>On t'écoute</span>
        </motion.button>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
