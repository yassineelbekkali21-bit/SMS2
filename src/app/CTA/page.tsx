'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Rocket, Play, Sparkles, ArrowRight, Heart } from 'lucide-react';

export default function CTAShowcasePage() {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Options CTA - "Commencer l'aventure"
        </h1>
        <p className="text-center text-gray-500 mb-12">
          Survole chaque option pour voir les animations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Option A: + Géant avec texte */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-sm font-bold text-[#00c2ff] mb-2">OPTION A</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">+ Géant avec texte</h3>
            
            <div className="relative bg-gray-100 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
              {/* Fake skeleton cards behind */}
              <div className="absolute inset-4 flex gap-3 opacity-30">
                {[1,2,3].map(i => (
                  <div key={i} className="flex-1 bg-gray-300 rounded-xl" />
                ))}
              </div>
              
              {/* CTA */}
              <motion.div 
                className="relative z-10 flex flex-col items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredOption('A')}
                onHoverEnd={() => setHoveredOption(null)}
              >
                <motion.div 
                  className="w-24 h-24 rounded-full bg-[#00c2ff] flex items-center justify-center mb-4 shadow-xl shadow-[#00c2ff]/30"
                  animate={hoveredOption === 'A' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Plus size={48} className="text-white" strokeWidth={3} />
                </motion.div>
                <span className="text-lg font-bold text-gray-900 mb-1">Commencer mon aventure</span>
                <span className="text-sm text-gray-500">5 min • Gratuit</span>
              </motion.div>
            </div>
          </div>

          {/* Option B: Icône Fusée */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-sm font-bold text-[#00c2ff] mb-2">OPTION B</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Icône Fusée animée</h3>
            
            <div className="relative bg-gray-100 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
              {/* Fake skeleton cards behind */}
              <div className="absolute inset-4 flex gap-3 opacity-30">
                {[1,2,3].map(i => (
                  <div key={i} className="flex-1 bg-gray-300 rounded-xl" />
                ))}
              </div>
              
              {/* CTA */}
              <motion.div 
                className="relative z-10 flex flex-col items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredOption('B')}
                onHoverEnd={() => setHoveredOption(null)}
              >
                <motion.div 
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#0088cc] flex items-center justify-center mb-4 shadow-xl shadow-[#00c2ff]/30"
                  animate={hoveredOption === 'B' ? { y: [0, -10, 0] } : {}}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Rocket size={40} className="text-white" />
                </motion.div>
                <span className="text-lg font-bold text-gray-900 mb-1">Commencer mon aventure</span>
                <span className="text-sm text-gray-500">5 min • Gratuit</span>
              </motion.div>
            </div>
          </div>

          {/* Option C: Cercle pulsant + Play */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-sm font-bold text-[#00c2ff] mb-2">OPTION C</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Cercle pulsant + Play</h3>
            
            <div className="relative bg-gray-100 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
              {/* Fake skeleton cards behind */}
              <div className="absolute inset-4 flex gap-3 opacity-30">
                {[1,2,3].map(i => (
                  <div key={i} className="flex-1 bg-gray-300 rounded-xl" />
                ))}
              </div>
              
              {/* CTA */}
              <div className="relative z-10 flex flex-col items-center cursor-pointer">
                <div className="relative mb-4">
                  {/* Pulse rings */}
                  <motion.div 
                    className="absolute inset-0 w-24 h-24 rounded-full bg-[#00c2ff]/20"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute inset-0 w-24 h-24 rounded-full bg-[#00c2ff]/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.2, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  />
                  {/* Main circle */}
                  <motion.div 
                    className="relative w-24 h-24 rounded-full bg-[#00c2ff] flex items-center justify-center shadow-xl shadow-[#00c2ff]/40"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Play size={36} className="text-white ml-1" fill="white" />
                  </motion.div>
                </div>
                <span className="text-lg font-bold text-gray-900 mb-1">Commencer mon aventure</span>
                <span className="text-sm text-gray-500">5 min • Gratuit</span>
              </div>
            </div>
          </div>

          {/* Option D: Card minimaliste avec Sparkles */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-sm font-bold text-[#00c2ff] mb-2">OPTION D</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Card + Sparkles</h3>
            
            <div className="relative bg-gray-100 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
              {/* Fake skeleton cards behind */}
              <div className="absolute inset-4 flex gap-3 opacity-30">
                {[1,2,3].map(i => (
                  <div key={i} className="flex-1 bg-gray-300 rounded-xl" />
                ))}
              </div>
              
              {/* CTA Card */}
              <motion.div 
                className="relative z-10 bg-white rounded-2xl p-8 shadow-xl text-center max-w-xs"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 194, 255, 0.25)" }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <Sparkles size={48} className="text-[#00c2ff]" />
                </motion.div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Personnalise ton parcours</h4>
                <p className="text-gray-500 text-sm mb-6">Réponds à quelques questions pour créer ton programme</p>
                <motion.button 
                  className="w-full py-3 bg-[#00c2ff] hover:bg-[#00b0e8] text-white font-semibold rounded-full flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Commencer l'aventure
                  <ArrowRight size={18} />
                </motion.button>
                <p className="text-xs text-gray-400 mt-3">5 min • 100% gratuit</p>
              </motion.div>
            </div>
          </div>

          {/* Option E: Empty State épuré */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-sm font-bold text-[#00c2ff] mb-2">OPTION E</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Empty State épuré</h3>
            
            <div className="relative bg-gray-100 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
              {/* Fake skeleton cards behind */}
              <div className="absolute inset-4 flex gap-3 opacity-30">
                {[1,2,3].map(i => (
                  <div key={i} className="flex-1 bg-gray-300 rounded-xl" />
                ))}
              </div>
              
              {/* CTA */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div 
                  className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4"
                  whileHover={{ borderColor: '#00c2ff', scale: 1.1 }}
                >
                  <Plus size={24} className="text-gray-400" />
                </motion.div>
                <p className="text-gray-500 mb-4">Aucun parcours pour l'instant</p>
                <motion.button 
                  className="py-3 px-8 bg-gray-900 hover:bg-black text-white font-semibold rounded-full flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Créer mon premier parcours
                  <ArrowRight size={18} />
                </motion.button>
                <p className="text-xs text-gray-400 mt-3">5 min • 100% gratuit</p>
              </div>
            </div>
          </div>

          {/* Option F: Gradient animé (style Stripe) */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-sm font-bold text-[#00c2ff] mb-2">OPTION F</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Gradient animé (Stripe)</h3>
            
            <div className="relative bg-gray-100 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
              {/* Fake skeleton cards behind */}
              <div className="absolute inset-4 flex gap-3 opacity-30">
                {[1,2,3].map(i => (
                  <div key={i} className="flex-1 bg-gray-300 rounded-xl" />
                ))}
              </div>
              
              {/* CTA */}
              <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
                <motion.button 
                  className="relative w-full py-5 px-8 rounded-2xl font-bold text-white text-lg overflow-hidden shadow-xl"
                  style={{
                    background: 'linear-gradient(90deg, #00c2ff, #00e5ff, #00c2ff)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0, 194, 255, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-3">
                    Commencer l'aventure
                    <ArrowRight size={22} />
                  </span>
                </motion.button>
                <p className="text-sm text-gray-500 mt-4">5 min • 100% gratuit</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bonus: Current implementation */}
        <div className="mt-12 bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-sm font-bold text-gray-400 mb-2">ACTUEL</h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Implémentation actuelle (pour comparaison)</h3>
          
          <div className="relative bg-gray-100 rounded-2xl p-8 min-h-[200px] flex items-center justify-center">
            {/* Fake skeleton cards behind */}
            <div className="absolute inset-4 flex gap-3 opacity-30">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex-1 bg-gray-300 rounded-xl" />
              ))}
            </div>
            
            {/* Current CTA */}
            <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-xl p-8">
              <div className="text-center">
                <button
                  className="group inline-flex items-center gap-4 px-12 py-5 bg-[#00c2ff] hover:bg-[#00b0e8] text-white font-bold text-lg rounded-full transition-all duration-300 shadow-xl shadow-[#00c2ff]/30 hover:shadow-2xl hover:shadow-[#00c2ff]/40 hover:scale-[1.03]"
                >
                  <span>Commencer l'aventure</span>
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-gray-500 text-sm mt-4">
                  5 minutes • 100% gratuit
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
