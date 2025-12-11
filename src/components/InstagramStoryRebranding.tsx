'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Brand colors based on specifications
const BRAND_COLORS = {
  deepBlue: '#1e3a8a', // Deep blue for accents
  white: '#FFFFFF',
  lightGrey: '#f5f5f5',
  darkGrey: '#666666',
  black: '#000000',
};

const InstagramStoryRebranding: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 6;

  // Auto-advance frames (optional, can be removed for manual control)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentFrame < totalFrames - 1) {
        setCurrentFrame(currentFrame + 1);
      }
    }, 5000); // 5 seconds per frame

    return () => clearTimeout(timer);
  }, [currentFrame]);

  const nextFrame = () => {
    if (currentFrame < totalFrames - 1) {
      setCurrentFrame(currentFrame + 1);
    }
  };

  const prevFrame = () => {
    if (currentFrame > 0) {
      setCurrentFrame(currentFrame - 1);
    }
  };

  const goToFrame = (index: number) => {
    setCurrentFrame(index);
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl">
      {/* Instagram Story Container - 9:16 aspect ratio */}
      <div className="relative w-full aspect-[9/16] bg-black overflow-hidden">
        
        {/* Progress Indicators */}
        <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
          {Array.from({ length: totalFrames }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToFrame(index)}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden transition-all"
              aria-label={`Go to frame ${index + 1}`}
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: '0%' }}
                animate={{ 
                  width: index === currentFrame ? '100%' : index < currentFrame ? '100%' : '0%' 
                }}
                transition={{ duration: index === currentFrame ? 5 : 0.3 }}
              />
            </button>
          ))}
        </div>

        {/* Navigation Controls */}
        <button
          onClick={prevFrame}
          disabled={currentFrame === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-black/50"
          aria-label="Previous frame"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextFrame}
          disabled={currentFrame === totalFrames - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-black/50"
          aria-label="Next frame"
        >
          <ChevronRight size={24} />
        </button>

        {/* Frames */}
        <AnimatePresence mode="wait">
          {currentFrame === 0 && <Frame1 key="frame-1" />}
          {currentFrame === 1 && <Frame2 key="frame-2" />}
          {currentFrame === 2 && <Frame3 key="frame-3" />}
          {currentFrame === 3 && <Frame4 key="frame-4" />}
          {currentFrame === 4 && <Frame5 key="frame-5" />}
          {currentFrame === 5 && <Frame6 key="frame-6" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Frame 1: Announcement
const Frame1: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center relative"
      style={{ backgroundColor: BRAND_COLORS.lightGrey }}
    >
      {/* Large silhouette background - number 3 */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-2/3 flex items-center justify-end overflow-hidden"
        style={{ opacity: 0.08 }}
      >
        <span 
          className="text-[60rem] font-bold leading-none"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            color: BRAND_COLORS.darkGrey,
            transform: 'translateX(20%)'
          }}
        >
          3
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
        <h2 
          className="text-sm font-light tracking-wider mb-8 uppercase"
          style={{ color: BRAND_COLORS.darkGrey, letterSpacing: '0.2em' }}
        >
          LES CLASSES SCIENTIFIQUES<br />DEVIENNENT
        </h2>
        
        <h1 
          className="text-6xl mb-16"
          style={{ 
            fontFamily: 'Brush Script MT, cursive',
            color: BRAND_COLORS.black,
            fontWeight: 'normal'
          }}
        >
          Science Made Simple
        </h1>

        {/* Blue quote marks */}
        <div className="flex justify-start mb-8">
          <svg width="60" height="45" viewBox="0 0 60 45" fill="none">
            <path d="M0 45V27C0 12 6 3 18 0L21 6C16 9 13.5 12.5 13 16.5C17 17 21 20.5 21 27C21 33.5 17 38 10.5 38C4 38 0 33.5 0 27V45Z" fill={BRAND_COLORS.deepBlue}/>
            <path d="M30 45V27C30 12 36 3 48 0L51 6C46 9 43.5 12.5 43 16.5C47 17 51 20.5 51 27C51 33.5 47 38 40.5 38C34 38 30 33.5 30 27V45Z" fill={BRAND_COLORS.deepBlue}/>
          </svg>
        </div>

        <p 
          className="text-left text-base leading-relaxed uppercase"
          style={{ 
            color: BRAND_COLORS.black,
            fontFamily: 'Arial, sans-serif',
            fontWeight: '300',
            letterSpacing: '0.05em'
          }}
        >
          PENDANT DES ANNÉES, VOUS NOUS AVEZ CONFIÉ VOS DOUTES, VOS DIFFICULTÉS, VOS AMBITIONS.
        </p>
        <br />
        <p 
          className="text-left text-base leading-relaxed uppercase"
          style={{ 
            color: BRAND_COLORS.black,
            fontFamily: 'Arial, sans-serif',
            fontWeight: '300',
            letterSpacing: '0.05em'
          }}
        >
          ENSEMBLE, NOUS AVONS CONSTRUIT UNE MÉTHODE, UNE COMMUNAUTÉ, ET DES MILLIERS DE RÉUSSITES.
        </p>
        <br />
        <p 
          className="text-left text-base leading-relaxed uppercase"
          style={{ 
            color: BRAND_COLORS.black,
            fontFamily: 'Arial, sans-serif',
            fontWeight: '300',
            letterSpacing: '0.05em'
          }}
        >
          NOUS VOUS AVONS AIDÉS À PASSER DE LA CONFUSION À LA MAÎTRISE.
        </p>
        <br />
        <p 
          className="text-left text-base leading-relaxed uppercase font-semibold"
          style={{ 
            color: BRAND_COLORS.black,
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          AUJOURD'HUI, NOUS FRANCHISSONS UNE NOUVELLE ÉTAPE.
        </p>

        {/* Decorative arrow line */}
        <div className="flex justify-end mt-12">
          <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
            <path d="M0 20 L100 20 M100 20 L90 10 M100 20 L90 30" 
                  stroke={BRAND_COLORS.deepBlue} 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Frame 2: Evolution text
const Frame2: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-12 text-left relative"
      style={{ backgroundColor: BRAND_COLORS.lightGrey }}
    >
      {/* Large silhouette background - number 3 */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-2/3 flex items-center justify-start overflow-hidden"
        style={{ opacity: 0.08 }}
      >
        <span 
          className="text-[60rem] font-bold leading-none"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            color: BRAND_COLORS.darkGrey,
            transform: 'translateX(-20%)'
          }}
        >
          3
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
        <p 
          className="text-base leading-relaxed uppercase mb-6"
          style={{ 
            color: BRAND_COLORS.black,
            fontFamily: 'Arial, sans-serif',
            fontWeight: '300',
            letterSpacing: '0.05em',
            lineHeight: '1.8'
          }}
        >
          NOUS AVONS CRÉÉ UNE PLATEFORME, UNE APPLICATION ET UNE IDENTITÉ QUI REFLÈTENT ENFIN CE QUE NOUS SOMMES DEVENUS :
        </p>
        
        <p 
          className="text-base leading-relaxed mb-6"
          style={{ 
            color: BRAND_COLORS.black,
            fontFamily: 'Arial, sans-serif',
            fontWeight: '300',
            letterSpacing: '0.05em',
            lineHeight: '1.8'
          }}
        >
          UN ENDROIT OÙ LES SCIENCES SONT <span className="underline decoration-2 underline-offset-4">ENSEIGNÉES</span> COMME ELLES AURAIENT TOUJOURS DÛ L'ÊTRE: <span className="font-bold">CLAIRES, ACCESSIBLES, MAÎTRISABLES.</span>
        </p>
      </motion.div>
    </motion.div>
  );
};

// Frame 3: Concrètement pour toi
const Frame3: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-12 relative"
      style={{ backgroundColor: BRAND_COLORS.lightGrey }}
    >
      {/* Large silhouette background - number 4 */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-2/3 flex items-center justify-end overflow-hidden"
        style={{ opacity: 0.08 }}
      >
        <span 
          className="text-[60rem] font-bold leading-none"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            color: BRAND_COLORS.darkGrey,
            transform: 'translateX(20%)'
          }}
        >
          4
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
        <h2 
          className="text-2xl font-bold mb-10 uppercase"
          style={{ 
            color: BRAND_COLORS.black,
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          CONCRÈTEMENT POUR TOI :
        </h2>
        
        <div className="space-y-6 text-left">
          <p 
            className="text-lg uppercase"
            style={{ 
              color: BRAND_COLORS.black,
              fontFamily: 'Arial, sans-serif',
              fontWeight: '300',
              letterSpacing: '0.05em'
            }}
          >
            • MÊME ÉQUIPE
          </p>
          <p 
            className="text-lg uppercase"
            style={{ 
              color: BRAND_COLORS.black,
              fontFamily: 'Arial, sans-serif',
              fontWeight: '300',
              letterSpacing: '0.05em'
            }}
          >
            • MÊME PÉDAGOGIE
          </p>
          <p 
            className="text-lg uppercase"
            style={{ 
              color: BRAND_COLORS.black,
              fontFamily: 'Arial, sans-serif',
              fontWeight: '300',
              letterSpacing: '0.05em'
            }}
          >
            • MÊME ACCOMPAGNEMENT HUMAIN
          </p>
          <p 
            className="text-xl uppercase font-bold mt-8"
            style={{ 
              color: BRAND_COLORS.black,
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.05em'
            }}
          >
            • SIMPLEMENT MIEUX. PLUS CLAIR. PLUS PUISSANT.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Frame 4: Merci
const Frame4: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center relative"
      style={{ backgroundColor: BRAND_COLORS.lightGrey }}
    >
      {/* Large silhouette background - number 5 */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        style={{ opacity: 0.08 }}
      >
        <span 
          className="text-[60rem] font-bold leading-none block"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            color: BRAND_COLORS.darkGrey
          }}
        >
          5
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
        <p 
          className="text-3xl leading-relaxed uppercase font-light"
          style={{ 
            color: BRAND_COLORS.black,
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          MERCI À TOUS CEUX QUI ONT GRANDI AVEC NOUS.
        </p>
      </motion.div>
    </motion.div>
  );
};

// Frame 5: Bienvenue
const Frame5: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-12 text-left relative"
      style={{ backgroundColor: BRAND_COLORS.lightGrey }}
    >
      {/* Large silhouette background - number 6 */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-2/3 flex items-center justify-end overflow-hidden"
        style={{ opacity: 0.08 }}
      >
        <span 
          className="text-[60rem] font-bold leading-none"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            color: BRAND_COLORS.darkGrey,
            transform: 'translateX(20%)'
          }}
        >
          6
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
        <p 
          className="text-base leading-relaxed uppercase mb-4"
          style={{ 
            color: BRAND_COLORS.black,
            fontFamily: 'Arial, sans-serif',
            fontWeight: '300',
            letterSpacing: '0.05em',
            lineHeight: '1.8'
          }}
        >
          BIENVENUE DANS <span className="font-bold">SCIENCE MADE SIMPLE:</span>
        </p>
        
        <p 
          className="text-base leading-relaxed uppercase font-bold"
          style={{ 
            color: BRAND_COLORS.black,
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '0.05em',
            lineHeight: '1.8'
          }}
        >
          LA MÊME PASSION, UNE NOUVELLE ÉNERGIE, ET L'AMBITION D'ALLER ENCORE PLUS LOIN ENSEMBLE.
        </p>

        {/* Blue quote marks closing */}
        <div className="flex justify-end mt-12">
          <svg width="60" height="45" viewBox="0 0 60 45" fill="none" style={{ transform: 'rotate(180deg)' }}>
            <path d="M0 45V27C0 12 6 3 18 0L21 6C16 9 13.5 12.5 13 16.5C17 17 21 20.5 21 27C21 33.5 17 38 10.5 38C4 38 0 33.5 0 27V45Z" fill={BRAND_COLORS.deepBlue}/>
            <path d="M30 45V27C30 12 36 3 48 0L51 6C46 9 43.5 12.5 43 16.5C47 17 51 20.5 51 27C51 33.5 47 38 40.5 38C34 38 30 33.5 30 27V45Z" fill={BRAND_COLORS.deepBlue}/>
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Frame 6: Logo SMS
const Frame6: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center relative"
      style={{ backgroundColor: BRAND_COLORS.lightGrey }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10"
      >
        {/* SMS Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8"
        >
          <svg width="300" height="180" viewBox="0 0 300 180" fill="none">
            {/* SMS text in bold modern style */}
            <text 
              x="150" 
              y="100" 
              textAnchor="middle" 
              style={{ 
                fontFamily: 'Arial Black, sans-serif',
                fontSize: '110px',
                fontWeight: '900',
                fill: BRAND_COLORS.black
              }}
            >
              SMS
            </text>
            {/* Small star/sparkle accent */}
            <circle cx="260" cy="50" r="3" fill={BRAND_COLORS.black}/>
            <path d="M260 40 L260 60 M250 50 L270 50" stroke={BRAND_COLORS.black} strokeWidth="2"/>
          </svg>
          
          {/* Science Made Simple subtitle */}
          <p 
            className="text-lg tracking-widest mt-2"
            style={{ 
              fontFamily: 'Brush Script MT, cursive',
              color: BRAND_COLORS.black,
              fontSize: '28px'
            }}
          >
            Science Made Simple
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default InstagramStoryRebranding;

