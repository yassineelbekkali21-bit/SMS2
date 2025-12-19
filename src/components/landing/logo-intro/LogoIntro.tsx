'use client';

/**
 * LogoIntro - Animation d'intro identitaire SMS
 * 
 * Usage:
 * <LogoIntro 
 *   variant="netflix-punch" 
 *   autoPlay={true}
 *   onCue={(cue, time) => playSFX(cue)} 
 * />
 * 
 * Variants disponibles:
 * Classic:
 * - netflix-punch: Impact signature style Netflix
 * - hand-drawn: Tracé progressif DrawSVG
 * - community-assemble: La communauté construit la maîtrise
 * - scan-hud: Rigueur scientifique / laboratoire
 * - blur-focus: Transformation confusion → maîtrise
 * - tilt-3d: Premium modern avec shadow
 * 
 * Sticker:
 * - sticker-slap, sticker-peel, sticker-stamp, sticker-drop, sticker-wiggle, sticker-zoom
 * 
 * DrawSVG:
 * - draw-reveal, draw-write, draw-neon, draw-star
 * 
 * Star (L'étoile comme quête):
 * - star-orbit: Orbite elliptique autour du centre
 * - star-spiral: Descente en spirale hypnotique
 * - star-bounce: Rebonds énergiques
 * - star-shoot: Étoile filante traverse l'écran
 * - star-pulse: Pulse comme un cœur
 * - star-magnet: Attirée magnétiquement
 */

import React, { useRef, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { 
  useLogoIntroAnimation, 
  LogoIntroVariant,
  LogoIntroRefs 
} from './useLogoIntroAnimation';
import { SMSLogoOutline } from './SMSLogoOutline';

// Load DrawSVGPlugin from CDN
const loadDrawSVGPlugin = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as any).DrawSVGPlugin) {
      gsap.registerPlugin((window as any).DrawSVGPlugin);
      resolve();
      return;
    }

    // Load script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/DrawSVGPlugin.min.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).DrawSVGPlugin) {
        gsap.registerPlugin((window as any).DrawSVGPlugin);
        console.log('✅ DrawSVGPlugin loaded and registered');
        resolve();
      } else {
        reject(new Error('DrawSVGPlugin not found after load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load DrawSVGPlugin'));
    document.head.appendChild(script);
  });
};

export interface LogoIntroProps {
  variant?: LogoIntroVariant;
  autoPlay?: boolean;
  loop?: boolean;
  loopDelay?: number;
  onCue?: (cue: string, time: number) => void;
  onComplete?: () => void;
  className?: string;
  darkMode?: boolean;
}

// Variants qui utilisent DrawSVGPlugin et/ou le SVG outline (pour l'étoile)
const DRAW_VARIANTS: LogoIntroVariant[] = [
  'hand-drawn',
  'sticker-peel', 
  'draw-reveal',
  'draw-write',
  'draw-neon',
  'draw-star',
  // Star variants - tous utilisent l'étoile du SVG
  'star-orbit',
  'star-spiral',
  'star-bounce',
  'star-shoot',
  'star-pulse',
  'star-magnet',
];

export const LogoIntro: React.FC<LogoIntroProps> = ({
  variant = 'netflix-punch',
  autoPlay = true,
  loop = false,
  loopDelay = 2000,
  onCue,
  onComplete,
  className = '',
  darkMode = true,
}) => {
  // State pour DrawSVGPlugin
  const [pluginReady, setPluginReady] = useState(false);
  
  // Refs pour les éléments animés
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoSvgRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // Check if this variant uses DrawSVG
  const usesDrawSVG = DRAW_VARIANTS.includes(variant);

  const refs: LogoIntroRefs = useMemo(() => ({
    container: containerRef,
    logo: logoRef,
    logoSvg: logoSvgRef,
    glow: glowRef,
    particles: particlesRef,
    scanLine: scanLineRef,
    flash: flashRef,
  }), []);

  // Detect prefers-reduced-motion
  const reducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Animation hook
  const { play, replay, durationTotal } = useLogoIntroAnimation({
    variant,
    refs,
    onCue,
    reducedMotion,
  });

  // Load DrawSVGPlugin for draw variants
  useEffect(() => {
    if (usesDrawSVG && !pluginReady) {
      loadDrawSVGPlugin()
        .then(() => setPluginReady(true))
        .catch(err => {
          console.warn('DrawSVGPlugin failed to load, using fallback:', err);
          setPluginReady(true); // Continue anyway with fallback
        });
    } else if (!usesDrawSVG) {
      setPluginReady(true);
    }
  }, [usesDrawSVG, pluginReady]);

  // Auto-play on mount (wait for plugin if needed)
  useEffect(() => {
    if (autoPlay && pluginReady) {
      const timer = setTimeout(() => {
        play();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, play, pluginReady]);

  // Loop handling
  useEffect(() => {
    if (loop && autoPlay) {
      const interval = setInterval(() => {
        replay();
      }, (durationTotal * 1000) + loopDelay);
      return () => clearInterval(interval);
    }
  }, [loop, autoPlay, replay, durationTotal, loopDelay]);

  // Generate particles for community-assemble variant
  const particles = useMemo(() => {
    const count = 16;
    const items = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 120 + Math.random() * 40;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const size = 6 + Math.random() * 6;
      
      items.push(
        <div
          key={i}
          className="particle absolute rounded-full"
          style={{
            width: size,
            height: size,
            left: '50%',
            top: '50%',
            marginLeft: -size / 2,
            marginTop: -size / 2,
            transform: `translate(${x}px, ${y}px)`,
            background: `hsl(${210 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%)`,
            boxShadow: `0 0 ${size * 2}px hsl(${210 + Math.random() * 30}, 80%, 60%)`,
          }}
        />
      );
    }
    return items;
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`
        relative w-full h-full flex items-center justify-center overflow-hidden
        ${darkMode ? 'bg-[#0a0a0f]' : 'bg-gray-50'}
        ${className}
      `}
      style={{ willChange: 'transform' }}
    >
      {/* Background gradient */}
      <div 
        className={`
          absolute inset-0 
          ${darkMode 
            ? 'bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f]' 
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
          }
        `}
      />
      
      {/* Subtle grid pattern (HUD style) */}
      {variant === 'scan-hud' && (
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Glow layer */}
      <div 
        ref={glowRef}
        className="absolute w-72 h-72 rounded-full opacity-0 pointer-events-none"
        style={{
          background: darkMode 
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
          willChange: 'opacity, transform',
        }}
      />

      {/* Particles container (for community-assemble) */}
      <div 
        ref={particlesRef} 
        className="absolute inset-0 pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        {variant === 'community-assemble' && particles}
      </div>

      {/* Scan line (for scan-hud) */}
      {variant === 'scan-hud' && (
        <div
          ref={scanLineRef}
          className="absolute left-0 right-0 h-[2px] opacity-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)',
            willChange: 'top, opacity',
          }}
        />
      )}

      {/* Main Logo Container */}
      <div 
        ref={logoRef}
        className="relative z-10 w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 opacity-0"
        style={{ 
          willChange: 'transform, opacity, filter',
          '--sweep-pos': '-50%',
          // Light sweep mask for netflix-punch
          ...(variant === 'netflix-punch' && {
            maskImage: `linear-gradient(
              110deg, 
              rgba(0,0,0,1) 0%, 
              rgba(0,0,0,1) calc(var(--sweep-pos) - 10%), 
              rgba(0,0,0,0.7) var(--sweep-pos), 
              rgba(0,0,0,1) calc(var(--sweep-pos) + 10%), 
              rgba(0,0,0,1) 100%
            )`,
            WebkitMaskImage: `linear-gradient(
              110deg, 
              rgba(0,0,0,1) 0%, 
              rgba(0,0,0,1) calc(var(--sweep-pos) - 10%), 
              rgba(0,0,0,0.7) var(--sweep-pos), 
              rgba(0,0,0,1) calc(var(--sweep-pos) + 10%), 
              rgba(0,0,0,1) 100%
            )`,
          }),
        } as React.CSSProperties}
      >
        {/* SVG Outline for DrawSVG animations */}
        {usesDrawSVG && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              filter: variant === 'draw-neon' 
                ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.4))'
                : 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))',
            }}
          >
            <SMSLogoOutline 
              ref={logoSvgRef}
              strokeColor={darkMode ? '#ffffff' : '#1a1a2e'}
              strokeWidth={variant === 'draw-neon' ? 4 : 3}
              fillColor={darkMode ? '#ffffff' : '#1a1a2e'}
              showFill={false}
              className="w-full h-full p-4"
            />
          </div>
        )}
        
        {/* Filled Logo (hidden during draw, shown after) */}
        <Image 
          src="/brand/sms-logo.svg" 
          alt="Science Made Simple"
          fill
          className={`object-contain transition-opacity duration-300 ${
            usesDrawSVG ? 'opacity-0' : ''
          }`}
          style={{
            filter: darkMode 
              ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.2))' 
              : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
          id="logo-filled"
          priority
        />
      </div>

      {/* Flash overlay */}
      <div 
        ref={flashRef}
        className="absolute inset-0 bg-white opacity-0 pointer-events-none z-20"
        style={{ willChange: 'opacity' }}
      />

      {/* Tagline */}
      <div 
        className={`
          absolute bottom-6 left-0 right-0 text-center
          ${darkMode ? 'text-gray-500' : 'text-gray-400'}
        `}
      >
        <p 
          className="text-xs font-medium tracking-[0.3em] uppercase opacity-0"
          style={{
            animation: autoPlay ? `fadeInUp 0.6s ease-out ${durationTotal - 0.4}s forwards` : 'none',
          }}
        >
          Learn Different
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LogoIntro;

