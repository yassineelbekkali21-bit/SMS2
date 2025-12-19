/**
 * useLogoIntroAnimation - Hook GSAP pour l'animation d'intro du logo SMS
 * 
 * Durée cible: 2.4s max
 * 22 variants disponibles:
 * - Classic (6): netflix-punch, hand-drawn, community-assemble, scan-hud, blur-focus, tilt-3d
 * - Sticker (6): sticker-slap, sticker-peel, sticker-stamp, sticker-drop, sticker-wiggle, sticker-zoom
 * - DrawSVG (4): draw-reveal, draw-write, draw-neon, draw-star
 * - Star (6): star-orbit, star-spiral, star-bounce, star-shoot, star-pulse, star-magnet
 * 
 * Star variants: L'étoile représente la quête/objectif de l'étudiant
 * "Ton objectif existe. SMS t'y emmène."
 * 
 * Chaque variant communique: maîtrise, transformation, rigueur, communauté
 */

import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';

export type LogoIntroVariant = 
  // Classic variants
  | 'netflix-punch'      // A - Impact signature
  | 'hand-drawn'         // B - Pédagogie manuscrite (DrawSVG)
  | 'community-assemble' // C - La communauté construit
  | 'scan-hud'           // D - Rigueur scientifique
  | 'blur-focus'         // E - Transformation
  | 'tilt-3d'            // F - Premium modern
  // Sticker variants
  | 'sticker-slap'       // G - Sticker claqué sur l'écran
  | 'sticker-peel'       // H - Décollage + collage (DrawSVG)
  | 'sticker-stamp'      // I - Tampon qui s'écrase
  | 'sticker-drop'       // J - Tombe + rebondit
  | 'sticker-wiggle'     // K - Collage + wiggle
  | 'sticker-zoom'       // L - Zoom slam impact
  // DrawSVG variants
  | 'draw-reveal'        // M - Tracé progressif avec reveal
  | 'draw-write'         // N - Écriture manuscrite
  | 'draw-neon'          // O - Tracé néon lumineux
  | 'draw-star'          // P - Étoile vole → se fixe → SMS embrasse
  // Star variants (nouveaux) - L'étoile représente la quête
  | 'star-orbit'         // Q - Orbite autour du centre
  | 'star-spiral'        // R - Descente en spirale
  | 'star-bounce'        // S - Rebonds avant fixation
  | 'star-shoot'         // T - Étoile filante
  | 'star-pulse'         // U - Pulse comme un cœur
  | 'star-magnet';       // V - Attirée magnétiquement

export interface LogoIntroRefs {
  container: React.RefObject<HTMLDivElement>;
  logo: React.RefObject<HTMLDivElement>;
  logoSvg?: React.RefObject<SVGSVGElement>;
  glow: React.RefObject<HTMLDivElement>;
  particles: React.RefObject<HTMLDivElement>;
  scanLine: React.RefObject<HTMLDivElement>;
  flash: React.RefObject<HTMLDivElement>;
}

export interface UseLogoIntroAnimationOptions {
  variant: LogoIntroVariant;
  refs: LogoIntroRefs;
  onCue?: (cue: string, time: number) => void;
  reducedMotion?: boolean;
}

export interface UseLogoIntroAnimationReturn {
  play: () => void;
  replay: () => void;
  pause: () => void;
  kill: () => void;
  timeline: React.MutableRefObject<gsap.core.Timeline | null>;
  durationTotal: number;
}

const DURATION_TOTAL = 2.4;

export function useLogoIntroAnimation({
  variant,
  refs,
  onCue,
  reducedMotion = false,
}: UseLogoIntroAnimationOptions): UseLogoIntroAnimationReturn {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const contextRef = useRef<gsap.Context | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      contextRef.current?.revert();
    };
  }, []);

  /**
   * Variant A — "Netflix Punch" (impact + glow)
   * Intention: impact signature premium
   */
  const createNetflixPunchTimeline = useCallback(() => {
    const { logo, glow, flash } = refs;
    if (!logo.current || !glow.current || !flash.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      paused: true,
    });

    // Initial state
    gsap.set(logo.current, { 
      opacity: 0, 
      scale: 0.92,
      filter: 'blur(0px)',
    });
    gsap.set(glow.current, { opacity: 0, scale: 0.8 });
    gsap.set(flash.current, { opacity: 0 });

    // 0.0–0.3s: Logo apparition rapide
    tl.to(logo.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, 0);

    // 0.3–0.8s: Impact avec overshoot + glow
    tl.call(() => onCue?.('whoosh', 0.35), [], 0.35);
    
    tl.to(logo.current, {
      scale: 1.03,
      duration: 0.15,
      ease: 'power2.out',
    }, 0.3);

    tl.call(() => onCue?.('impact', 0.45), [], 0.45);

    tl.to(logo.current, {
      scale: 1,
      duration: 0.35,
      ease: 'elastic.out(1, 0.5)',
    }, 0.45);

    // Glow bref
    tl.to(glow.current, {
      opacity: 0.8,
      scale: 1.2,
      duration: 0.2,
      ease: 'power2.out',
    }, 0.4);

    tl.to(glow.current, {
      opacity: 0.3,
      scale: 1,
      duration: 0.4,
    }, 0.6);

    // 0.8–1.4s: Light sweep horizontal
    tl.call(() => onCue?.('shine', 1.0), [], 1.0);
    
    tl.to(logo.current, {
      '--sweep-pos': '150%',
      duration: 0.6,
      ease: 'power2.inOut',
    }, 0.8);

    // 1.4–2.4s: Pose finale + glow fade
    tl.to(glow.current, {
      opacity: 0.15,
      duration: 0.5,
    }, 1.4);

    // Micro breathing final
    tl.to(logo.current, {
      scale: 1.01,
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
    }, 1.9);

    return tl;
  }, [refs, onCue]);

  /**
   * Variant B — "Hand-drawn Reveal"
   * Intention: pédagogie manuscrite / Zak / proximité
   * Tracé progressif avec DrawSVGPlugin
   */
  const createHandDrawnTimeline = useCallback(() => {
    const { logo, logoSvg, glow } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    // Check if DrawSVGPlugin is available
    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current && hasDrawSVG) {
      // DrawSVGPlugin version
      const strokePaths = logoSvg.current.querySelectorAll('.sms-stroke');
      const framePath = logoSvg.current.querySelector('.sms-stroke-frame');
      const s1Path = logoSvg.current.querySelector('.sms-stroke-s1');
      const mPath = logoSvg.current.querySelector('.sms-stroke-m');
      const s2Path = logoSvg.current.querySelector('.sms-stroke-s2');
      const filledLogo = logo.current.querySelector('#logo-filled');

      // Initial state - all strokes hidden (drawSVG: 0)
      gsap.set(logo.current, { opacity: 1 });
      gsap.set(strokePaths, { drawSVG: 0, opacity: 1 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0 });

      tl.call(() => onCue?.('marker', 0.1), [], 0.1);
      
      // Draw frame
      if (framePath) {
        tl.to(framePath, {
          drawSVG: '100%',
          duration: 0.5,
          ease: 'power1.inOut',
        }, 0);
      }

      // Draw S1
      if (s1Path) {
        tl.to(s1Path, {
          drawSVG: '100%',
          duration: 0.5,
          ease: 'power1.inOut',
        }, 0.2);
      }

      // Draw M
      if (mPath) {
        tl.to(mPath, {
          drawSVG: '100%',
          duration: 0.6,
          ease: 'power1.inOut',
        }, 0.4);
      }

      // Draw S2
      if (s2Path) {
        tl.to(s2Path, {
          drawSVG: '100%',
          duration: 0.5,
          ease: 'power1.inOut',
        }, 0.7);
      }

      tl.call(() => onCue?.('finish', 1.3), [], 1.3);

      // Crossfade to filled logo
      tl.to(filledLogo, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, 1.3);

      tl.to(strokePaths, {
        opacity: 0,
        duration: 0.2,
      }, 1.5);

      // Ink settle
      tl.to(logo.current, {
        y: -3,
        duration: 0.1,
        ease: 'power2.out',
      }, 1.6);

      tl.to(logo.current, {
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)',
      }, 1.7);

      // Glow
      tl.to(glow.current, {
        opacity: 0.25,
        duration: 0.4,
      }, 2.0);

    } else if (logoSvg?.current) {
      // Fallback with native stroke-dashoffset
      const strokePaths = logoSvg.current.querySelectorAll('.sms-stroke') as NodeListOf<SVGPathElement>;
      const filledLogo = logo.current.querySelector('#logo-filled');

      strokePaths.forEach(path => {
        if (path && path.getTotalLength) {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 1,
          });
        }
      });

      gsap.set(logo.current, { opacity: 1 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0 });

      tl.call(() => onCue?.('marker', 0.1), [], 0.1);

      tl.to(strokePaths, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power1.inOut',
      }, 0);

      tl.call(() => onCue?.('finish', 1.3), [], 1.3);

      tl.to(filledLogo, { opacity: 1, duration: 0.3 }, 1.3);
      tl.to(strokePaths, { opacity: 0, duration: 0.2 }, 1.5);
      tl.to(logo.current, { y: -3, duration: 0.1 }, 1.6);
      tl.to(logo.current, { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' }, 1.7);
      tl.to(glow.current, { opacity: 0.25, duration: 0.4 }, 2.0);

    } else {
      // Fallback without SVG - clip-path reveal
      gsap.set(logo.current, { 
        opacity: 1,
        clipPath: 'inset(0 100% 0 0)',
      });
      gsap.set(glow.current, { opacity: 0 });

      tl.call(() => onCue?.('marker', 0.1), [], 0.1);
      tl.to(logo.current, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power1.inOut' }, 0);
      tl.call(() => onCue?.('finish', 1.5), [], 1.5);
      tl.to(logo.current, { y: -3, duration: 0.1 }, 1.6);
      tl.to(logo.current, { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' }, 1.7);
      tl.to(glow.current, { opacity: 0.25, duration: 0.4 }, 2.0);
    }

    return tl;
  }, [refs, onCue]);

  /**
   * Variant C — "Community Particles → Assemble"
   * Intention: la communauté construit la maîtrise
   */
  const createCommunityAssembleTimeline = useCallback(() => {
    const { logo, particles, flash } = refs;
    if (!logo.current || !particles.current || !flash.current) return null;

    const particleEls = particles.current.querySelectorAll('.particle');
    
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      paused: true,
    });

    // Initial state
    gsap.set(logo.current, { opacity: 0, scale: 0.9 });
    gsap.set(flash.current, { opacity: 0 });
    gsap.set(particleEls, { 
      opacity: 0,
      scale: 0,
    });

    // 0.0–0.8s: Particules apparaissent autour
    tl.to(particleEls, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      stagger: {
        each: 0.03,
        from: 'random',
      },
      ease: 'back.out(2)',
    }, 0);

    // Particules flottent légèrement
    tl.to(particleEls, {
      y: '+=random(-10, 10)',
      x: '+=random(-10, 10)',
      duration: 0.4,
      ease: 'sine.inOut',
    }, 0.4);

    // 0.8–1.4s: Convergence + snap
    tl.call(() => onCue?.('spark', 0.9), [], 0.9);

    tl.to(particleEls, {
      x: 0,
      y: 0,
      scale: 0.5,
      duration: 0.45,
      ease: 'power3.in',
    }, 0.8);

    tl.call(() => onCue?.('snap', 1.35), [], 1.35);

    // Flash au moment du snap
    tl.to(flash.current, {
      opacity: 0.6,
      duration: 0.05,
    }, 1.3);

    tl.to(flash.current, {
      opacity: 0,
      duration: 0.2,
    }, 1.35);

    // Particules disparaissent, logo apparaît
    tl.to(particleEls, {
      opacity: 0,
      scale: 0,
      duration: 0.15,
    }, 1.25);

    tl.to(logo.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.5)',
    }, 1.3);

    // 1.4–2.4s: Logo stable
    tl.to(logo.current, {
      scale: 1.02,
      duration: 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
    }, 1.9);

    return tl;
  }, [refs, onCue]);

  /**
   * Variant D — "Scan / HUD" (rigueur + science)
   * Intention: laboratoire / précision
   */
  const createScanHudTimeline = useCallback(() => {
    const { logo, scanLine, glow } = refs;
    if (!logo.current || !scanLine.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    // Initial state
    gsap.set(logo.current, { 
      opacity: 0,
      filter: 'brightness(0.5)',
    });
    gsap.set(scanLine.current, { 
      opacity: 0,
      top: '0%',
    });
    gsap.set(glow.current, { opacity: 0 });

    // 0.0–0.6s: Logo apparaît + lignes scan
    tl.to(logo.current, {
      opacity: 0.6,
      duration: 0.3,
    }, 0);

    tl.to(scanLine.current, {
      opacity: 1,
      duration: 0.2,
    }, 0.2);

    // 0.6–1.2s: Scan vertical
    tl.call(() => onCue?.('beep', 0.65), [], 0.65);

    tl.to(scanLine.current, {
      top: '100%',
      duration: 0.5,
      ease: 'power1.inOut',
    }, 0.6);

    tl.call(() => onCue?.('scan', 0.85), [], 0.85);

    // Glitch micro (1 frame)
    tl.to(logo.current, {
      x: 3,
      filter: 'brightness(1.5) hue-rotate(10deg)',
      duration: 0.03,
    }, 0.9);

    tl.to(logo.current, {
      x: -2,
      filter: 'brightness(0.8) hue-rotate(-5deg)',
      duration: 0.03,
    }, 0.93);

    tl.to(logo.current, {
      x: 0,
      filter: 'brightness(1)',
      duration: 0.04,
    }, 0.96);

    // Scan line disparaît
    tl.to(scanLine.current, {
      opacity: 0,
      duration: 0.2,
    }, 1.1);

    // 1.2–2.4s: Stabilisation, logo full brightness
    tl.to(logo.current, {
      opacity: 1,
      filter: 'brightness(1)',
      duration: 0.3,
    }, 1.2);

    // Glow s'allume puis s'éteint
    tl.to(glow.current, {
      opacity: 0.4,
      duration: 0.3,
    }, 1.3);

    tl.to(glow.current, {
      opacity: 0.1,
      duration: 0.8,
    }, 1.6);

    return tl;
  }, [refs, onCue]);

  /**
   * Variant E — "From Confusion → Mastery" (blur → sharp)
   * Intention: transformation
   */
  const createBlurFocusTimeline = useCallback(() => {
    const { logo, glow } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      paused: true,
    });

    // Initial state - flou et faible opacité
    gsap.set(logo.current, { 
      opacity: 0.3,
      filter: 'blur(14px) contrast(0.8)',
      scale: 1.1,
    });
    gsap.set(glow.current, { opacity: 0 });

    // 0.0–0.7s: Logo arrive flou
    tl.to(logo.current, {
      opacity: 0.5,
      scale: 1.05,
      duration: 0.7,
      ease: 'power1.out',
    }, 0);

    // 0.7–1.4s: Mise au point rapide
    tl.call(() => onCue?.('focus', 0.9), [], 0.9);

    tl.to(logo.current, {
      filter: 'blur(0px) contrast(1)',
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.7);

    tl.call(() => onCue?.('lock', 1.3), [], 1.3);

    // Flash subtil au moment du lock
    tl.to(glow.current, {
      opacity: 0.5,
      duration: 0.1,
    }, 1.2);

    tl.to(glow.current, {
      opacity: 0.15,
      duration: 0.4,
    }, 1.3);

    // 1.4–2.4s: Pose finale
    tl.to(logo.current, {
      scale: 1.01,
      duration: 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
    }, 1.9);

    return tl;
  }, [refs, onCue]);

  /**
   * Variant F — "3D Tilt + Shadow"
   * Intention: premium modern
   */
  const createTilt3DTimeline = useCallback(() => {
    const { logo, glow } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      paused: true,
    });

    // Initial state
    gsap.set(logo.current, { 
      opacity: 0,
      rotateX: 15,
      rotateY: -10,
      scale: 0.95,
      transformPerspective: 1000,
      filter: 'drop-shadow(0 0 0 transparent)',
    });
    gsap.set(glow.current, { opacity: 0 });

    // 0.0–0.8s: Tilt entrance
    tl.to(logo.current, {
      opacity: 1,
      rotateX: -5,
      rotateY: 5,
      scale: 1.02,
      filter: 'drop-shadow(10px 20px 30px rgba(0,0,0,0.4))',
      duration: 0.8,
      ease: 'power2.out',
    }, 0);

    // Glow accompagne
    tl.to(glow.current, {
      opacity: 0.3,
      duration: 0.6,
    }, 0.2);

    // 0.8–1.2s: Settle to neutral
    tl.to(logo.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      filter: 'drop-shadow(5px 10px 20px rgba(0,0,0,0.3))',
      duration: 0.4,
      ease: 'power2.inOut',
    }, 0.8);

    // 1.2–2.4s: Pose avec shadow subtile
    tl.to(logo.current, {
      filter: 'drop-shadow(2px 5px 15px rgba(0,0,0,0.2))',
      duration: 0.6,
    }, 1.2);

    tl.to(glow.current, {
      opacity: 0.1,
      duration: 0.6,
    }, 1.4);

    // Micro breathing
    tl.to(logo.current, {
      scale: 1.01,
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
    }, 2.0);

    return tl;
  }, [refs, onCue]);

  // ============================================
  // DRAWSVG VARIANTS - Tracé animé
  // ============================================

  /**
   * Variant M — "Draw Reveal"
   * Intention: Tracé progressif élégant avec reveal final
   */
  const createDrawRevealTimeline = useCallback(() => {
    const { logo, logoSvg, glow, flash } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current && hasDrawSVG) {
      const framePath = logoSvg.current.querySelector('.sms-stroke-frame');
      const s1Path = logoSvg.current.querySelector('.sms-stroke-s1');
      const mPath = logoSvg.current.querySelector('.sms-stroke-m');
      const s2Path = logoSvg.current.querySelector('.sms-stroke-s2');
      const allStrokes = logoSvg.current.querySelectorAll('.sms-stroke');
      const filledLogo = logo.current.querySelector('#logo-filled');

      // Initial state with DrawSVGPlugin
      gsap.set(logo.current, { opacity: 1, scale: 0.95 });
      gsap.set(allStrokes, { drawSVG: 0, opacity: 1 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0 });

      tl.call(() => onCue?.('start', 0.05), [], 0.05);

      // Draw all strokes with stagger
      if (framePath) tl.to(framePath, { drawSVG: '100%', duration: 0.5, ease: 'power1.inOut' }, 0);
      if (s1Path) tl.to(s1Path, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, 0.2);
      if (mPath) tl.to(mPath, { drawSVG: '100%', duration: 0.7, ease: 'power2.inOut' }, 0.3);
      if (s2Path) tl.to(s2Path, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, 0.4);

      tl.call(() => onCue?.('complete', 1.1), [], 1.1);

      // Scale up
      tl.to(logo.current, { scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, 1.0);

      // Flash + crossfade
      if (flash?.current) {
        tl.to(flash.current, { opacity: 0.3, duration: 0.08 }, 1.2);
        tl.to(flash.current, { opacity: 0, duration: 0.15 }, 1.28);
      }

      tl.to(filledLogo, { opacity: 1, duration: 0.25 }, 1.2);
      tl.to(allStrokes, { opacity: 0, duration: 0.15 }, 1.35);
      tl.to(glow.current, { opacity: 0.3, duration: 0.3 }, 1.3);
      tl.to(glow.current, { opacity: 0.15, duration: 0.5 }, 1.8);

    } else {
      // Fallback
      gsap.set(logo.current, { opacity: 0, scale: 0.9 });
      tl.to(logo.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0);
    }

    return tl;
  }, [refs, onCue]);

  /**
   * Variant N — "Draw Write"
   * Intention: Écriture manuscrite naturelle, comme Zak qui écrit
   */
  const createDrawWriteTimeline = useCallback(() => {
    const { logo, logoSvg, glow } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current && hasDrawSVG) {
      const framePath = logoSvg.current.querySelector('.sms-stroke-frame');
      const s1Path = logoSvg.current.querySelector('.sms-stroke-s1');
      const mPath = logoSvg.current.querySelector('.sms-stroke-m');
      const s2Path = logoSvg.current.querySelector('.sms-stroke-s2');
      const s2Detail = logoSvg.current.querySelector('.sms-stroke-s2-detail');
      const allStrokes = logoSvg.current.querySelectorAll('.sms-stroke');
      const filledLogo = logo.current.querySelector('#logo-filled');

      // Initial state with DrawSVGPlugin
      gsap.set(logo.current, { opacity: 1, rotation: -2, scale: 0.98 });
      gsap.set(allStrokes, { drawSVG: 0, opacity: 1 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0 });

      tl.call(() => onCue?.('write', 0.1), [], 0.1);

      // Write sequence with DrawSVG
      if (framePath) tl.to(framePath, { drawSVG: '100%', duration: 0.4, ease: 'power1.in' }, 0);
      if (s1Path) tl.to(s1Path, { drawSVG: '100%', duration: 0.5, ease: 'power1.inOut' }, 0.15);
      if (mPath) tl.to(mPath, { drawSVG: '100%', duration: 0.65, ease: 'power1.inOut' }, 0.4);
      if (s2Path) tl.to(s2Path, { drawSVG: '100%', duration: 0.5, ease: 'power1.inOut' }, 0.7);
      if (s2Detail) tl.to(s2Detail, { drawSVG: '100%', duration: 0.25, ease: 'power1.out' }, 1.0);

      tl.call(() => onCue?.('done', 1.3), [], 1.3);

      // Straighten and settle
      tl.to(logo.current, { rotation: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.7)' }, 1.3);

      // Crossfade to filled
      tl.to(filledLogo, { opacity: 1, duration: 0.3 }, 1.5);
      tl.to(allStrokes, { opacity: 0, duration: 0.2 }, 1.7);
      tl.to(glow.current, { opacity: 0.2, duration: 0.4 }, 1.8);

    } else {
      // Fallback
      gsap.set(logo.current, { opacity: 0, rotation: -3 });
      tl.to(logo.current, { opacity: 1, rotation: 0, duration: 1.0, ease: 'power2.out' }, 0);
    }

    return tl;
  }, [refs, onCue]);

  /**
   * Variant O — "Draw Neon"
   * Intention: Tracé lumineux style néon, premium et moderne
   */
  const createDrawNeonTimeline = useCallback(() => {
    const { logo, logoSvg, glow, flash } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current && hasDrawSVG) {
      const allStrokes = logoSvg.current.querySelectorAll('.sms-stroke');
      const filledLogo = logo.current.querySelector('#logo-filled');

      // Initial state with DrawSVGPlugin
      gsap.set(logo.current, { opacity: 1 });
      gsap.set(allStrokes, { drawSVG: 0, opacity: 1 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0.3, scale: 1.2 });

      tl.call(() => onCue?.('buzz', 0.1), [], 0.1);

      // Draw all strokes with stagger using DrawSVG
      tl.to(allStrokes, {
        drawSVG: '100%',
        duration: 1.2,
        stagger: 0.1,
        ease: 'power1.inOut',
      }, 0);

      // Pulsing glow during draw
      tl.to(glow.current, {
        opacity: 0.6,
        scale: 1.3,
        duration: 0.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      }, 0);

      tl.call(() => onCue?.('flicker', 1.3), [], 1.3);

      // Neon flicker effect
      tl.to(allStrokes, { opacity: 0.5, duration: 0.05 }, 1.3);
      tl.to(allStrokes, { opacity: 1, duration: 0.05 }, 1.35);
      tl.to(allStrokes, { opacity: 0.7, duration: 0.03 }, 1.4);
      tl.to(allStrokes, { opacity: 1, duration: 0.05 }, 1.43);

      // Flash and reveal filled
      if (flash?.current) {
        tl.to(flash.current, { opacity: 0.4, duration: 0.08, backgroundColor: 'rgba(59, 130, 246, 0.3)' }, 1.5);
        tl.to(flash.current, { opacity: 0, duration: 0.2 }, 1.58);
      }

      tl.to(filledLogo, { opacity: 1, duration: 0.3 }, 1.5);
      tl.to(allStrokes, { opacity: 0, duration: 0.2 }, 1.7);
      tl.to(glow.current, { opacity: 0.2, scale: 1, duration: 0.5 }, 1.8);

    } else {
      // Fallback with glow effect
      gsap.set(logo.current, { opacity: 0, filter: 'blur(10px) brightness(1.5)' });
      gsap.set(glow.current, { opacity: 0.5 });

      tl.to(logo.current, { opacity: 1, filter: 'blur(0px) brightness(1)', duration: 0.8, ease: 'power2.out' }, 0);
      tl.to(glow.current, { opacity: 0.15, duration: 0.6 }, 0.6);
    }

    return tl;
  }, [refs, onCue]);

  /**
   * Variant P — "Draw Star" (Quest / Objectif)
   * Intention: L'étoile représente la quête/l'objectif de l'étudiant
   * L'étoile vole librement, puis se fixe, et SMS l'embrasse
   * 
   * Storytelling: "Ton objectif existe. SMS t'y emmène."
   */
  const createDrawStarTimeline = useCallback(() => {
    const { logo, logoSvg, glow, flash, container } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current) {
      const framePath = logoSvg.current.querySelector('.sms-stroke-frame');
      const s1Path = logoSvg.current.querySelector('.sms-stroke-s1');
      const mPath = logoSvg.current.querySelector('.sms-stroke-m');
      const s2Path = logoSvg.current.querySelector('.sms-stroke-s2');
      const starPath = logoSvg.current.querySelector('.sms-stroke-s2-detail') as SVGPathElement;
      const mainStrokes = logoSvg.current.querySelectorAll('.sms-stroke:not(.sms-stroke-s2-detail)');
      const allStrokes = logoSvg.current.querySelectorAll('.sms-stroke');
      const filledLogo = logo.current.querySelector('#logo-filled');

      // === PHASE 0: État initial ===
      // Le logo est invisible, seule l'étoile existe
      gsap.set(logo.current, { opacity: 1 });
      gsap.set(mainStrokes, { opacity: 0 }); // Logo caché
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0.3, scale: 0.5 });

      if (hasDrawSVG) {
        gsap.set(mainStrokes, { drawSVG: 0 });
      }

      // L'étoile commence en haut à gauche, petite et brillante
      if (starPath) {
        gsap.set(starPath, { 
          opacity: 1,
          scale: 0.6,
          x: -80,
          y: -60,
          rotation: 0,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.9))',
        });
        if (hasDrawSVG) {
          gsap.set(starPath, { drawSVG: '100%' }); // L'étoile est déjà dessinée
        } else if (starPath.getTotalLength) {
          const len = starPath.getTotalLength();
          gsap.set(starPath, { strokeDasharray: len, strokeDashoffset: 0 });
        }
      }

      // === PHASE 1: L'étoile vole (la quête) ===
      tl.call(() => onCue?.('quest', 0.1), [], 0.1);

      if (starPath) {
        // Mouvement flottant de l'étoile (cherche sa place)
        tl.to(starPath, {
          x: 40,
          y: -30,
          rotation: 120,
          scale: 0.7,
          duration: 0.3,
          ease: 'power1.inOut',
        }, 0);

        tl.to(starPath, {
          x: -20,
          y: 20,
          rotation: 200,
          scale: 0.8,
          duration: 0.25,
          ease: 'power1.inOut',
        }, 0.3);

        tl.to(starPath, {
          x: 30,
          y: -10,
          rotation: 280,
          scale: 0.75,
          duration: 0.2,
          ease: 'power1.inOut',
        }, 0.55);

        // Glow suit l'étoile
        tl.to(glow.current, {
          opacity: 0.5,
          scale: 0.8,
          duration: 0.75,
          ease: 'sine.inOut',
        }, 0);
      }

      // === PHASE 2: L'étoile se fixe (l'objectif est clair) ===
      tl.call(() => onCue?.('lock', 0.8), [], 0.8);

      if (starPath) {
        // L'étoile ralentit et se fixe à sa position finale
        tl.to(starPath, {
          x: 0,
          y: 0,
          rotation: 360,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(2)',
        }, 0.8);

        // Flash doré au moment où elle se fixe
        if (flash?.current) {
          tl.to(flash.current, { 
            opacity: 0.4, 
            duration: 0.08,
            backgroundColor: 'rgba(255, 215, 0, 0.3)',
          }, 0.95);
          tl.to(flash.current, { opacity: 0, duration: 0.15 }, 1.03);
        }

        // L'étoile pulse une fois (confirmation)
        tl.to(starPath, {
          scale: 1.2,
          filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 1))',
          duration: 0.15,
        }, 1.0);

        tl.to(starPath, {
          scale: 1,
          filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
          duration: 0.2,
          ease: 'power2.out',
        }, 1.15);
      }

      // === PHASE 3: SMS embrasse l'objectif ===
      tl.call(() => onCue?.('embrace', 1.2), [], 1.2);

      // Le glow s'intensifie pour accueillir le logo
      tl.to(glow.current, {
        opacity: 0.7,
        scale: 1.3,
        duration: 0.3,
      }, 1.2);

      // Les strokes du logo apparaissent et se dessinent AUTOUR de l'étoile
      tl.to(mainStrokes, {
        opacity: 1,
        duration: 0.1,
      }, 1.25);

      if (hasDrawSVG) {
        // Dessiner le logo qui "enveloppe" l'étoile
        if (framePath) tl.to(framePath, { drawSVG: '100%', duration: 0.35, ease: 'power2.out' }, 1.3);
        if (s1Path) tl.to(s1Path, { drawSVG: '100%', duration: 0.3, ease: 'power2.out' }, 1.35);
        if (mPath) tl.to(mPath, { drawSVG: '100%', duration: 0.35, ease: 'power2.out' }, 1.4);
        if (s2Path) tl.to(s2Path, { drawSVG: '100%', duration: 0.3, ease: 'power2.out' }, 1.5);
      } else {
        // Fallback
        const paths = [framePath, s1Path, mPath, s2Path].filter(Boolean) as SVGPathElement[];
        paths.forEach((path, i) => {
          if (path.getTotalLength) {
            const len = path.getTotalLength();
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
            tl.to(path, { strokeDashoffset: 0, duration: 0.3 }, 1.3 + i * 0.08);
          }
        });
      }

      // === PHASE 4: Unification finale ===
      // L'étoile s'intègre parfaitement
      if (starPath) {
        tl.to(starPath, {
          filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))',
          duration: 0.3,
        }, 1.8);
      }

      // Crossfade vers le logo filled
      tl.to(filledLogo, {
        opacity: 1,
        duration: 0.3,
      }, 1.9);

      tl.to(allStrokes, {
        opacity: 0,
        duration: 0.2,
      }, 2.1);

      // Glow final subtil
      tl.to(glow.current, {
        opacity: 0.15,
        scale: 1,
        duration: 0.3,
      }, 2.0);

    } else {
      // Fallback simple
      gsap.set(logo.current, { opacity: 0, scale: 0.9 });
      tl.to(logo.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0);
    }

    return tl;
  }, [refs, onCue]);

  // ============================================
  // STAR VARIANTS - L'étoile comme quête/objectif
  // ============================================

  /**
   * Variant Q — "Star Orbit"
   * Intention: L'étoile orbite autour du centre comme une planète
   * Puis se fixe au cœur de SMS
   */
  const createStarOrbitTimeline = useCallback(() => {
    const { logo, logoSvg, glow, flash } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current) {
      const mainStrokes = logoSvg.current.querySelectorAll('.sms-stroke:not(.sms-stroke-s2-detail)');
      const allStrokes = logoSvg.current.querySelectorAll('.sms-stroke');
      const starPath = logoSvg.current.querySelector('.sms-stroke-s2-detail') as SVGPathElement;
      const filledLogo = logo.current.querySelector('#logo-filled');

      gsap.set(logo.current, { opacity: 1 });
      gsap.set(mainStrokes, { opacity: 0 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0.2, scale: 1.5 });

      if (hasDrawSVG) gsap.set(mainStrokes, { drawSVG: 0 });

      // L'étoile commence à droite
      if (starPath) {
        gsap.set(starPath, { 
          opacity: 1, scale: 0.5, x: 100, y: 0, rotation: 0,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
        });
        if (hasDrawSVG) gsap.set(starPath, { drawSVG: '100%' });
      }

      tl.call(() => onCue?.('orbit', 0.1), [], 0.1);

      // Orbite elliptique
      if (starPath) {
        tl.to(starPath, { x: 0, y: -70, rotation: 90, scale: 0.6, duration: 0.2, ease: 'sine.inOut' }, 0);
        tl.to(starPath, { x: -100, y: 0, rotation: 180, scale: 0.5, duration: 0.2, ease: 'sine.inOut' }, 0.2);
        tl.to(starPath, { x: 0, y: 50, rotation: 270, scale: 0.6, duration: 0.2, ease: 'sine.inOut' }, 0.4);
        tl.to(starPath, { x: 60, y: -20, rotation: 320, scale: 0.7, duration: 0.15, ease: 'sine.inOut' }, 0.6);
        
        // Spirale vers le centre
        tl.to(starPath, { x: 20, y: 10, rotation: 340, scale: 0.85, duration: 0.12, ease: 'power2.in' }, 0.75);
        
        tl.call(() => onCue?.('lock', 0.9), [], 0.9);
        
        // Fixation finale
        tl.to(starPath, { 
          x: 0, y: 0, rotation: 360, scale: 1,
          filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 1))',
          duration: 0.25, ease: 'back.out(2)',
        }, 0.87);

        if (flash?.current) {
          tl.to(flash.current, { opacity: 0.4, backgroundColor: 'rgba(255, 215, 0, 0.3)', duration: 0.08 }, 1.0);
          tl.to(flash.current, { opacity: 0, duration: 0.15 }, 1.08);
        }
      }

      // SMS apparaît
      tl.call(() => onCue?.('embrace', 1.15), [], 1.15);
      tl.to(mainStrokes, { opacity: 1, duration: 0.1 }, 1.15);

      if (hasDrawSVG) {
        tl.to(mainStrokes, { drawSVG: '100%', duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 1.2);
      } else {
        (mainStrokes as NodeListOf<SVGPathElement>).forEach((path, i) => {
          if (path.getTotalLength) {
            const len = path.getTotalLength();
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
            tl.to(path, { strokeDashoffset: 0, duration: 0.4 }, 1.2 + i * 0.08);
          }
        });
      }

      // Finalisation
      if (starPath) tl.to(starPath, { filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))', duration: 0.3 }, 1.7);
      tl.to(filledLogo, { opacity: 1, duration: 0.3 }, 1.8);
      tl.to(allStrokes, { opacity: 0, duration: 0.2 }, 2.0);
      tl.to(glow.current, { opacity: 0.15, scale: 1, duration: 0.3 }, 1.9);

    } else {
      gsap.set(logo.current, { opacity: 0, scale: 0.9 });
      tl.to(logo.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0);
    }

    return tl;
  }, [refs, onCue]);

  /**
   * Variant R — "Star Spiral"
   * Intention: L'étoile descend en spirale hypnotique
   */
  const createStarSpiralTimeline = useCallback(() => {
    const { logo, logoSvg, glow, flash } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current) {
      const mainStrokes = logoSvg.current.querySelectorAll('.sms-stroke:not(.sms-stroke-s2-detail)');
      const allStrokes = logoSvg.current.querySelectorAll('.sms-stroke');
      const starPath = logoSvg.current.querySelector('.sms-stroke-s2-detail') as SVGPathElement;
      const filledLogo = logo.current.querySelector('#logo-filled');

      gsap.set(logo.current, { opacity: 1 });
      gsap.set(mainStrokes, { opacity: 0 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0.1, scale: 2 });

      if (hasDrawSVG) gsap.set(mainStrokes, { drawSVG: 0 });

      // L'étoile commence en haut, loin
      if (starPath) {
        gsap.set(starPath, { 
          opacity: 1, scale: 0.3, x: 0, y: -120, rotation: 0,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
        });
        if (hasDrawSVG) gsap.set(starPath, { drawSVG: '100%' });
      }

      tl.call(() => onCue?.('spiral', 0.1), [], 0.1);

      // Spirale descendante
      if (starPath) {
        // Tour 1 (large)
        tl.to(starPath, { x: 80, y: -80, rotation: 180, scale: 0.4, duration: 0.18, ease: 'sine.inOut' }, 0);
        tl.to(starPath, { x: 0, y: -40, rotation: 360, scale: 0.5, duration: 0.18, ease: 'sine.inOut' }, 0.18);
        // Tour 2 (moyen)
        tl.to(starPath, { x: -50, y: -20, rotation: 540, scale: 0.6, duration: 0.15, ease: 'sine.inOut' }, 0.36);
        tl.to(starPath, { x: 30, y: 10, rotation: 720, scale: 0.7, duration: 0.15, ease: 'sine.inOut' }, 0.51);
        // Tour 3 (serré)
        tl.to(starPath, { x: -15, y: 5, rotation: 900, scale: 0.85, duration: 0.12, ease: 'sine.inOut' }, 0.66);
        
        tl.call(() => onCue?.('lock', 0.85), [], 0.85);
        
        // Atterrissage
        tl.to(starPath, { 
          x: 0, y: 0, rotation: 1080, scale: 1,
          filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 1))',
          duration: 0.2, ease: 'back.out(1.5)',
        }, 0.78);

        // Pulse de confirmation
        tl.to(starPath, { scale: 1.15, duration: 0.1 }, 1.0);
        tl.to(starPath, { scale: 1, filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))', duration: 0.15 }, 1.1);

        if (flash?.current) {
          tl.to(flash.current, { opacity: 0.3, backgroundColor: 'rgba(255, 215, 0, 0.25)', duration: 0.08 }, 0.95);
          tl.to(flash.current, { opacity: 0, duration: 0.12 }, 1.03);
        }
      }

      // Glow suit la spirale
      tl.to(glow.current, { opacity: 0.5, scale: 1.2, duration: 0.8, ease: 'sine.inOut' }, 0);

      // SMS apparaît
      tl.call(() => onCue?.('embrace', 1.2), [], 1.2);
      tl.to(mainStrokes, { opacity: 1, duration: 0.1 }, 1.2);

      if (hasDrawSVG) {
        tl.to(mainStrokes, { drawSVG: '100%', duration: 0.5, stagger: 0.06, ease: 'power2.out' }, 1.25);
      }

      // Finalisation
      if (starPath) tl.to(starPath, { filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))', duration: 0.3 }, 1.75);
      tl.to(filledLogo, { opacity: 1, duration: 0.3 }, 1.85);
      tl.to(allStrokes, { opacity: 0, duration: 0.2 }, 2.05);
      tl.to(glow.current, { opacity: 0.15, scale: 1, duration: 0.3 }, 1.95);

    } else {
      gsap.set(logo.current, { opacity: 0, scale: 0.9 });
      tl.to(logo.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0);
    }

    return tl;
  }, [refs, onCue]);

  /**
   * Variant S — "Star Bounce"
   * Intention: L'étoile rebondit comme une balle avant de trouver sa place
   */
  const createStarBounceTimeline = useCallback(() => {
    const { logo, logoSvg, glow, flash } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current) {
      const mainStrokes = logoSvg.current.querySelectorAll('.sms-stroke:not(.sms-stroke-s2-detail)');
      const allStrokes = logoSvg.current.querySelectorAll('.sms-stroke');
      const starPath = logoSvg.current.querySelector('.sms-stroke-s2-detail') as SVGPathElement;
      const filledLogo = logo.current.querySelector('#logo-filled');

      gsap.set(logo.current, { opacity: 1 });
      gsap.set(mainStrokes, { opacity: 0 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0.2, scale: 0.8 });

      if (hasDrawSVG) gsap.set(mainStrokes, { drawSVG: 0 });

      // L'étoile commence en haut
      if (starPath) {
        gsap.set(starPath, { 
          opacity: 1, scale: 0.6, x: 0, y: -150, rotation: 0,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
        });
        if (hasDrawSVG) gsap.set(starPath, { drawSVG: '100%' });
      }

      tl.call(() => onCue?.('bounce', 0.1), [], 0.1);

      if (starPath) {
        // Chute + rebond 1 (grand)
        tl.to(starPath, { y: 30, scale: 0.9, rotation: 180, duration: 0.25, ease: 'power2.in' }, 0);
        tl.to(starPath, { y: -40, scale: 0.7, rotation: 270, duration: 0.18, ease: 'power2.out' }, 0.25);
        
        // Rebond 2 (moyen)
        tl.to(starPath, { y: 20, scale: 0.85, rotation: 360, duration: 0.15, ease: 'power2.in' }, 0.43);
        tl.to(starPath, { y: -15, scale: 0.75, rotation: 420, duration: 0.12, ease: 'power2.out' }, 0.58);
        
        // Rebond 3 (petit)
        tl.to(starPath, { y: 8, scale: 0.9, rotation: 480, duration: 0.1, ease: 'power2.in' }, 0.7);
        
        tl.call(() => onCue?.('lock', 0.85), [], 0.85);
        
        // Settle final
        tl.to(starPath, { 
          y: 0, scale: 1, rotation: 540,
          filter: 'drop-shadow(0 0 18px rgba(255, 215, 0, 1))',
          duration: 0.2, ease: 'elastic.out(1, 0.6)',
        }, 0.8);

        // Squash & stretch au settle
        tl.to(starPath, { scaleY: 0.85, scaleX: 1.15, duration: 0.05 }, 0.8);
        tl.to(starPath, { scaleY: 1, scaleX: 1, duration: 0.15, ease: 'elastic.out(1.2, 0.5)' }, 0.85);

        if (flash?.current) {
          tl.to(flash.current, { opacity: 0.35, backgroundColor: 'rgba(255, 215, 0, 0.3)', duration: 0.06 }, 0.82);
          tl.to(flash.current, { opacity: 0, duration: 0.12 }, 0.88);
        }
      }

      // SMS apparaît
      tl.call(() => onCue?.('embrace', 1.1), [], 1.1);
      tl.to(mainStrokes, { opacity: 1, duration: 0.1 }, 1.1);

      if (hasDrawSVG) {
        tl.to(mainStrokes, { drawSVG: '100%', duration: 0.5, stagger: 0.07, ease: 'power2.out' }, 1.15);
      }

      // Finalisation
      if (starPath) tl.to(starPath, { filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))', duration: 0.3 }, 1.65);
      tl.to(filledLogo, { opacity: 1, duration: 0.3 }, 1.75);
      tl.to(allStrokes, { opacity: 0, duration: 0.2 }, 1.95);
      tl.to(glow.current, { opacity: 0.15, scale: 1, duration: 0.3 }, 1.85);

    } else {
      gsap.set(logo.current, { opacity: 0, scale: 0.9 });
      tl.to(logo.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0);
    }

    return tl;
  }, [refs, onCue]);

  /**
   * Variant T — "Star Shoot" (Étoile filante)
   * Intention: L'étoile traverse l'écran comme une étoile filante, laisse une traînée
   */
  const createStarShootTimeline = useCallback(() => {
    const { logo, logoSvg, glow, flash } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current) {
      const mainStrokes = logoSvg.current.querySelectorAll('.sms-stroke:not(.sms-stroke-s2-detail)');
      const allStrokes = logoSvg.current.querySelectorAll('.sms-stroke');
      const starPath = logoSvg.current.querySelector('.sms-stroke-s2-detail') as SVGPathElement;
      const filledLogo = logo.current.querySelector('#logo-filled');

      gsap.set(logo.current, { opacity: 1 });
      gsap.set(mainStrokes, { opacity: 0 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0, scale: 0.5 });

      if (hasDrawSVG) gsap.set(mainStrokes, { drawSVG: 0 });

      // L'étoile commence en haut à gauche, hors écran
      if (starPath) {
        gsap.set(starPath, { 
          opacity: 0, scale: 0.3, x: -180, y: -120, rotation: -45,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
        });
        if (hasDrawSVG) gsap.set(starPath, { drawSVG: '100%' });
      }

      tl.call(() => onCue?.('shoot', 0.05), [], 0.05);

      if (starPath) {
        // Apparition rapide
        tl.to(starPath, { opacity: 1, duration: 0.05 }, 0);

        // Traversée diagonale ultra-rapide avec traînée lumineuse
        tl.to(starPath, { 
          x: 120, y: 80, rotation: 45, scale: 0.5,
          filter: 'drop-shadow(-30px -20px 15px rgba(255, 215, 0, 0.8)) drop-shadow(-60px -40px 20px rgba(255, 200, 0, 0.4))',
          duration: 0.3, ease: 'power2.in',
        }, 0);

        // Disparaît momentanément
        tl.to(starPath, { opacity: 0.3, duration: 0.08 }, 0.3);

        // Réapparaît au centre avec impact
        tl.to(starPath, { 
          x: 0, y: 0, opacity: 1, scale: 1.3, rotation: 180,
          filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 1))',
          duration: 0.15, ease: 'power4.out',
        }, 0.4);

        tl.call(() => onCue?.('impact', 0.55), [], 0.55);

        if (flash?.current) {
          tl.to(flash.current, { opacity: 0.6, backgroundColor: 'rgba(255, 215, 0, 0.4)', duration: 0.06 }, 0.5);
          tl.to(flash.current, { opacity: 0, duration: 0.2 }, 0.56);
        }

        // Settle
        tl.to(starPath, { 
          scale: 1, rotation: 360,
          filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.7))',
          duration: 0.3, ease: 'elastic.out(1.2, 0.6)',
        }, 0.55);
      }

      // Glow explose puis settle
      tl.to(glow.current, { opacity: 0.8, scale: 1.5, duration: 0.15 }, 0.5);
      tl.to(glow.current, { opacity: 0.4, scale: 1.1, duration: 0.3 }, 0.65);

      // SMS apparaît
      tl.call(() => onCue?.('embrace', 1.0), [], 1.0);
      tl.to(mainStrokes, { opacity: 1, duration: 0.1 }, 1.0);

      if (hasDrawSVG) {
        tl.to(mainStrokes, { drawSVG: '100%', duration: 0.5, stagger: 0.06, ease: 'power2.out' }, 1.05);
      }

      // Finalisation
      if (starPath) tl.to(starPath, { filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))', duration: 0.3 }, 1.55);
      tl.to(filledLogo, { opacity: 1, duration: 0.3 }, 1.65);
      tl.to(allStrokes, { opacity: 0, duration: 0.2 }, 1.85);
      tl.to(glow.current, { opacity: 0.15, scale: 1, duration: 0.3 }, 1.75);

    } else {
      gsap.set(logo.current, { opacity: 0, scale: 0.9 });
      tl.to(logo.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0);
    }

    return tl;
  }, [refs, onCue]);

  /**
   * Variant U — "Star Pulse" (Battement de cœur)
   * Intention: L'étoile pulse comme un cœur qui bat, l'objectif est vivant
   */
  const createStarPulseTimeline = useCallback(() => {
    const { logo, logoSvg, glow, flash } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current) {
      const mainStrokes = logoSvg.current.querySelectorAll('.sms-stroke:not(.sms-stroke-s2-detail)');
      const allStrokes = logoSvg.current.querySelectorAll('.sms-stroke');
      const starPath = logoSvg.current.querySelector('.sms-stroke-s2-detail') as SVGPathElement;
      const filledLogo = logo.current.querySelector('#logo-filled');

      gsap.set(logo.current, { opacity: 1 });
      gsap.set(mainStrokes, { opacity: 0 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0.1, scale: 0.8 });

      if (hasDrawSVG) gsap.set(mainStrokes, { drawSVG: 0 });

      // L'étoile est au centre, petite
      if (starPath) {
        gsap.set(starPath, { 
          opacity: 1, scale: 0.4, x: 0, y: 0, rotation: 0,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.4))',
        });
        if (hasDrawSVG) gsap.set(starPath, { drawSVG: '100%' });
      }

      tl.call(() => onCue?.('heartbeat', 0.1), [], 0.1);

      if (starPath) {
        // Battement 1 - systole
        tl.to(starPath, { 
          scale: 0.7, filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
          duration: 0.12, ease: 'power2.out',
        }, 0);
        tl.to(starPath, { scale: 0.45, filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))', duration: 0.1, ease: 'power2.in' }, 0.12);
        tl.to(glow.current, { opacity: 0.4, scale: 1.1, duration: 0.12 }, 0);
        tl.to(glow.current, { opacity: 0.15, scale: 0.9, duration: 0.1 }, 0.12);

        // Battement 2 - plus fort
        tl.to(starPath, { 
          scale: 0.85, filter: 'drop-shadow(0 0 18px rgba(255, 215, 0, 0.9))',
          duration: 0.12, ease: 'power2.out',
        }, 0.3);
        tl.to(starPath, { scale: 0.5, filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))', duration: 0.1, ease: 'power2.in' }, 0.42);
        tl.to(glow.current, { opacity: 0.55, scale: 1.2, duration: 0.12 }, 0.3);
        tl.to(glow.current, { opacity: 0.2, scale: 0.95, duration: 0.1 }, 0.42);

        // Battement 3 - BOOM! L'étoile s'épanouit
        tl.call(() => onCue?.('bloom', 0.6), [], 0.6);
        
        tl.to(starPath, { 
          scale: 1.3, rotation: 180,
          filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 1))',
          duration: 0.2, ease: 'back.out(2)',
        }, 0.6);

        if (flash?.current) {
          tl.to(flash.current, { opacity: 0.5, backgroundColor: 'rgba(255, 215, 0, 0.35)', duration: 0.08 }, 0.65);
          tl.to(flash.current, { opacity: 0, duration: 0.15 }, 0.73);
        }

        tl.to(glow.current, { opacity: 0.7, scale: 1.4, duration: 0.2 }, 0.6);

        // Settle
        tl.to(starPath, { 
          scale: 1, rotation: 360,
          filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.7))',
          duration: 0.3, ease: 'elastic.out(1, 0.5)',
        }, 0.8);
      }

      // SMS apparaît
      tl.call(() => onCue?.('embrace', 1.15), [], 1.15);
      tl.to(mainStrokes, { opacity: 1, duration: 0.1 }, 1.15);

      if (hasDrawSVG) {
        tl.to(mainStrokes, { drawSVG: '100%', duration: 0.5, stagger: 0.07, ease: 'power2.out' }, 1.2);
      }

      // Finalisation
      if (starPath) tl.to(starPath, { filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))', duration: 0.3 }, 1.7);
      tl.to(filledLogo, { opacity: 1, duration: 0.3 }, 1.8);
      tl.to(allStrokes, { opacity: 0, duration: 0.2 }, 2.0);
      tl.to(glow.current, { opacity: 0.15, scale: 1, duration: 0.3 }, 1.9);

    } else {
      gsap.set(logo.current, { opacity: 0, scale: 0.9 });
      tl.to(logo.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0);
    }

    return tl;
  }, [refs, onCue]);

  /**
   * Variant V — "Star Magnet"
   * Intention: L'étoile est attirée magnétiquement, résiste puis cède
   */
  const createStarMagnetTimeline = useCallback(() => {
    const { logo, logoSvg, glow, flash } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current) {
      const mainStrokes = logoSvg.current.querySelectorAll('.sms-stroke:not(.sms-stroke-s2-detail)');
      const allStrokes = logoSvg.current.querySelectorAll('.sms-stroke');
      const starPath = logoSvg.current.querySelector('.sms-stroke-s2-detail') as SVGPathElement;
      const filledLogo = logo.current.querySelector('#logo-filled');

      gsap.set(logo.current, { opacity: 1 });
      gsap.set(mainStrokes, { opacity: 0 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0.3, scale: 1 });

      if (hasDrawSVG) gsap.set(mainStrokes, { drawSVG: 0 });

      // L'étoile flotte au loin
      if (starPath) {
        gsap.set(starPath, { 
          opacity: 1, scale: 0.5, x: 120, y: -60, rotation: 0,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.7))',
        });
        if (hasDrawSVG) gsap.set(starPath, { drawSVG: '100%' });
      }

      tl.call(() => onCue?.('attract', 0.1), [], 0.1);

      if (starPath) {
        // L'aimant tire - l'étoile résiste
        tl.to(starPath, { 
          x: 80, y: -40, rotation: 30, scale: 0.55,
          duration: 0.2, ease: 'power1.out',
        }, 0);

        // Tire plus fort - l'étoile avance un peu
        tl.to(starPath, { 
          x: 40, y: -20, rotation: 60, scale: 0.65,
          duration: 0.2, ease: 'power2.out',
        }, 0.2);

        // L'étoile tente de s'échapper
        tl.to(starPath, { 
          x: 60, y: -35, rotation: 40, scale: 0.6,
          duration: 0.12, ease: 'power2.out',
        }, 0.4);

        // Force magnétique ultime - SNAP!
        tl.call(() => onCue?.('snap', 0.6), [], 0.6);

        tl.to(starPath, { 
          x: 0, y: 0, rotation: 360, scale: 1.2,
          filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 1))',
          duration: 0.25, ease: 'power4.in',
        }, 0.52);

        if (flash?.current) {
          tl.to(flash.current, { opacity: 0.5, backgroundColor: 'rgba(255, 215, 0, 0.35)', duration: 0.06 }, 0.72);
          tl.to(flash.current, { opacity: 0, duration: 0.15 }, 0.78);
        }

        // Vibration magnétique après snap
        tl.to(starPath, { x: 3, rotation: 365, duration: 0.04 }, 0.77);
        tl.to(starPath, { x: -2, rotation: 358, duration: 0.04 }, 0.81);
        tl.to(starPath, { x: 0, rotation: 360, scale: 1, filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))', duration: 0.15, ease: 'power2.out' }, 0.85);
      }

      // Glow magnétique
      tl.to(glow.current, { opacity: 0.6, scale: 1.3, duration: 0.25 }, 0.5);
      tl.to(glow.current, { opacity: 0.4, scale: 1.1, duration: 0.3 }, 0.77);

      // SMS apparaît
      tl.call(() => onCue?.('embrace', 1.1), [], 1.1);
      tl.to(mainStrokes, { opacity: 1, duration: 0.1 }, 1.1);

      if (hasDrawSVG) {
        tl.to(mainStrokes, { drawSVG: '100%', duration: 0.5, stagger: 0.07, ease: 'power2.out' }, 1.15);
      }

      // Finalisation
      if (starPath) tl.to(starPath, { filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))', duration: 0.3 }, 1.65);
      tl.to(filledLogo, { opacity: 1, duration: 0.3 }, 1.75);
      tl.to(allStrokes, { opacity: 0, duration: 0.2 }, 1.95);
      tl.to(glow.current, { opacity: 0.15, scale: 1, duration: 0.3 }, 1.85);

    } else {
      gsap.set(logo.current, { opacity: 0, scale: 0.9 });
      tl.to(logo.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0);
    }

    return tl;
  }, [refs, onCue]);

  // ============================================
  // STICKER VARIANTS - Style autocollant
  // ============================================

  /**
   * Variant G — "Sticker Slap"
   * Intention: Impact, énergie - sticker qui claque sur l'écran
   */
  const createStickerSlapTimeline = useCallback(() => {
    const { logo, glow, flash } = refs;
    if (!logo.current || !glow.current || !flash.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      paused: true,
    });

    // Initial state - vient de la droite, légèrement incliné
    gsap.set(logo.current, { 
      opacity: 0,
      x: 200,
      y: -50,
      rotation: 15,
      scale: 1.3,
      transformOrigin: 'center center',
    });
    gsap.set(glow.current, { opacity: 0 });
    gsap.set(flash.current, { opacity: 0 });

    // 0.0–0.3s: Sticker arrive très vite
    tl.to(logo.current, {
      opacity: 1,
      x: 5,
      y: 2,
      rotation: -3,
      scale: 1.05,
      duration: 0.25,
      ease: 'power4.out',
    }, 0);

    // 0.25s: SLAP! Impact
    tl.call(() => onCue?.('slap', 0.25), [], 0.25);

    // Flash blanc au moment de l'impact
    tl.to(flash.current, {
      opacity: 0.7,
      duration: 0.05,
    }, 0.25);

    tl.to(flash.current, {
      opacity: 0,
      duration: 0.15,
    }, 0.3);

    // 0.3–0.6s: Rebond et settle
    tl.to(logo.current, {
      x: -3,
      y: -2,
      rotation: 2,
      scale: 0.98,
      duration: 0.15,
      ease: 'power2.out',
    }, 0.3);

    tl.to(logo.current, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.25,
      ease: 'elastic.out(1, 0.6)',
    }, 0.45);

    // Ombre portée qui apparaît
    tl.to(logo.current, {
      filter: 'drop-shadow(4px 6px 8px rgba(0,0,0,0.3))',
      duration: 0.3,
    }, 0.3);

    // Glow subtil
    tl.to(glow.current, {
      opacity: 0.2,
      duration: 0.3,
    }, 0.5);

    // 1.0–2.4s: Pose finale
    tl.to(glow.current, {
      opacity: 0.1,
      duration: 0.8,
    }, 1.0);

    return tl;
  }, [refs, onCue]);

  /**
   * Variant H — "Sticker Peel & Stick" (with stroke drawing)
   * Intention: Crafty, fait-main - décollage avec tracé qui apparaît
   */
  const createStickerPeelTimeline = useCallback(() => {
    const { logo, logoSvg, glow } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    const hasDrawSVG = typeof window !== 'undefined' && (window as any).DrawSVGPlugin;

    if (logoSvg?.current && hasDrawSVG) {
      // DrawSVG version - peel reveals the drawing
      const strokePaths = logoSvg.current.querySelectorAll('.sms-stroke');
      const filledLogo = logo.current.querySelector('#logo-filled');

      // Initial state with DrawSVGPlugin
      gsap.set(logo.current, { 
        opacity: 1,
        rotateX: 45,
        rotateY: -25,
        scale: 0.85,
        transformOrigin: 'bottom left',
        transformPerspective: 800,
        filter: 'drop-shadow(15px 25px 20px rgba(0,0,0,0.5))',
      });
      gsap.set(strokePaths, { drawSVG: 0, opacity: 1 });
      gsap.set(filledLogo, { opacity: 0 });
      gsap.set(glow.current, { opacity: 0 });

      tl.call(() => onCue?.('peel', 0.1), [], 0.1);

      // Peel while drawing strokes
      tl.to(logo.current, {
        rotateX: 20,
        rotateY: -10,
        scale: 0.95,
        duration: 0.6,
        ease: 'power2.out',
      }, 0);

      tl.to(strokePaths, {
        drawSVG: '60%',
        duration: 0.6,
        stagger: 0.05,
        ease: 'power1.out',
      }, 0);

      tl.call(() => onCue?.('stick', 0.8), [], 0.8);

      // Stick down + complete drawing
      tl.to(logo.current, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        filter: 'drop-shadow(3px 5px 8px rgba(0,0,0,0.25))',
        duration: 0.4,
        ease: 'back.out(1.5)',
      }, 0.6);

      tl.to(strokePaths, {
        drawSVG: '100%',
        duration: 0.4,
        stagger: 0.03,
        ease: 'power2.out',
      }, 0.6);

      // Crossfade to filled
      tl.to(filledLogo, { opacity: 1, duration: 0.3 }, 1.0);
      tl.to(strokePaths, { opacity: 0, duration: 0.2 }, 1.2);
      tl.to(logo.current, { filter: 'drop-shadow(2px 3px 6px rgba(0,0,0,0.2))', duration: 0.4 }, 1.4);
      tl.to(glow.current, { opacity: 0.15, duration: 0.4 }, 1.6);

    } else {
      // Fallback - original peel animation (no SVG)
      gsap.set(logo.current, { 
        opacity: 1,
        rotateX: 60,
        rotateY: -30,
        scale: 0.9,
        transformOrigin: 'bottom left',
        transformPerspective: 800,
        filter: 'drop-shadow(10px 20px 15px rgba(0,0,0,0.4))',
      });
      gsap.set(glow.current, { opacity: 0 });

      tl.call(() => onCue?.('peel', 0.1), [], 0.1);

      tl.to(logo.current, { rotateX: 40, rotateY: -20, scale: 0.95, duration: 0.3, ease: 'power1.inOut' }, 0.2);
      tl.to(logo.current, { rotateX: 20, rotateY: -10, duration: 0.3, ease: 'power1.inOut' }, 0.5);

      tl.call(() => onCue?.('stick', 1.0), [], 1.0);

      tl.to(logo.current, { rotateX: -5, rotateY: 3, scale: 1.02, filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.25))', duration: 0.2, ease: 'power2.out' }, 0.8);
      tl.to(logo.current, { rotateX: 0, rotateY: 0, scale: 1, filter: 'drop-shadow(2px 3px 5px rgba(0,0,0,0.2))', duration: 0.3, ease: 'elastic.out(1, 0.7)' }, 1.0);
      tl.to(glow.current, { opacity: 0.15, duration: 0.4 }, 1.2);
    }

    return tl;
  }, [refs, onCue]);

  /**
   * Variant I — "Sticker Stamp"
   * Intention: Signature, validation - comme un tampon qui s'écrase
   */
  const createStickerStampTimeline = useCallback(() => {
    const { logo, glow, flash } = refs;
    if (!logo.current || !glow.current || !flash.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      paused: true,
    });

    // Initial state - vient d'en haut, plus grand
    gsap.set(logo.current, { 
      opacity: 0,
      y: -150,
      scale: 1.4,
      rotateX: -20,
      transformPerspective: 600,
    });
    gsap.set(glow.current, { opacity: 0 });
    gsap.set(flash.current, { opacity: 0 });

    // 0.0–0.3s: Descente rapide
    tl.to(logo.current, {
      opacity: 1,
      y: 0,
      scale: 1.1,
      rotateX: 0,
      duration: 0.25,
      ease: 'power3.in',
    }, 0);

    // 0.25s: STAMP! Impact
    tl.call(() => onCue?.('stamp', 0.25), [], 0.25);

    // Flash + impact
    tl.to(flash.current, {
      opacity: 0.5,
      duration: 0.05,
    }, 0.25);

    tl.to(flash.current, {
      opacity: 0,
      duration: 0.2,
    }, 0.3);

    // 0.3–0.5s: Compression puis rebond
    tl.to(logo.current, {
      scale: 0.95,
      y: 5,
      duration: 0.08,
      ease: 'power2.in',
    }, 0.25);

    tl.to(logo.current, {
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: 'elastic.out(1.2, 0.5)',
    }, 0.33);

    // Ombre qui apparaît au moment du stamp
    tl.to(logo.current, {
      filter: 'drop-shadow(3px 5px 8px rgba(0,0,0,0.35))',
      duration: 0.1,
    }, 0.25);

    tl.to(logo.current, {
      filter: 'drop-shadow(2px 3px 6px rgba(0,0,0,0.2))',
      duration: 0.5,
    }, 0.5);

    // Glow
    tl.to(glow.current, {
      opacity: 0.25,
      duration: 0.2,
    }, 0.3);

    tl.to(glow.current, {
      opacity: 0.1,
      duration: 0.6,
    }, 0.8);

    return tl;
  }, [refs, onCue]);

  /**
   * Variant J — "Sticker Drop & Bounce"
   * Intention: Playful, fun - tombe d'en haut avec rotation
   */
  const createStickerDropTimeline = useCallback(() => {
    const { logo, glow } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    // Initial state - en haut, légèrement tourné
    gsap.set(logo.current, { 
      opacity: 0,
      y: -300,
      rotation: -25,
      scale: 0.8,
    });
    gsap.set(glow.current, { opacity: 0 });

    // 0.0–0.5s: Chute avec légère rotation
    tl.to(logo.current, {
      opacity: 1,
      y: 0,
      rotation: 8,
      scale: 1,
      duration: 0.5,
      ease: 'bounce.out',
    }, 0);

    tl.call(() => onCue?.('drop', 0.4), [], 0.4);

    // 0.5–0.9s: Rebonds et settle de la rotation
    tl.to(logo.current, {
      rotation: -4,
      duration: 0.15,
      ease: 'power2.out',
    }, 0.5);

    tl.to(logo.current, {
      rotation: 2,
      duration: 0.12,
      ease: 'power2.out',
    }, 0.65);

    tl.to(logo.current, {
      rotation: 0,
      duration: 0.2,
      ease: 'power2.out',
    }, 0.77);

    // Ombre portée
    tl.to(logo.current, {
      filter: 'drop-shadow(3px 5px 8px rgba(0,0,0,0.25))',
      duration: 0.3,
    }, 0.4);

    // Glow
    tl.to(glow.current, {
      opacity: 0.15,
      duration: 0.4,
    }, 0.6);

    return tl;
  }, [refs, onCue]);

  /**
   * Variant K — "Sticker Stick & Wiggle"
   * Intention: Authentique, humain - collage + petit wiggle comme si mal collé
   */
  const createStickerWiggleTimeline = useCallback(() => {
    const { logo, glow } = refs;
    if (!logo.current || !glow.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      paused: true,
    });

    // Initial state
    gsap.set(logo.current, { 
      opacity: 0,
      scale: 0.7,
      rotation: -5,
    });
    gsap.set(glow.current, { opacity: 0 });

    // 0.0–0.4s: Apparition avec pop
    tl.to(logo.current, {
      opacity: 1,
      scale: 1.05,
      rotation: 3,
      duration: 0.3,
      ease: 'back.out(2)',
    }, 0);

    tl.call(() => onCue?.('pop', 0.3), [], 0.3);

    // 0.4–0.6s: Settle
    tl.to(logo.current, {
      scale: 1,
      rotation: 0,
      duration: 0.2,
      ease: 'power2.out',
    }, 0.4);

    // 0.6–1.2s: Wiggle comme si mal collé
    tl.call(() => onCue?.('wiggle', 0.7), [], 0.7);

    // Séquence de wiggle
    tl.to(logo.current, {
      rotation: 3,
      x: 2,
      duration: 0.08,
      ease: 'power1.inOut',
    }, 0.7);

    tl.to(logo.current, {
      rotation: -2.5,
      x: -1.5,
      duration: 0.08,
      ease: 'power1.inOut',
    }, 0.78);

    tl.to(logo.current, {
      rotation: 2,
      x: 1,
      duration: 0.07,
      ease: 'power1.inOut',
    }, 0.86);

    tl.to(logo.current, {
      rotation: -1,
      x: -0.5,
      duration: 0.06,
      ease: 'power1.inOut',
    }, 0.93);

    tl.to(logo.current, {
      rotation: 0,
      x: 0,
      duration: 0.15,
      ease: 'elastic.out(1, 0.8)',
    }, 0.99);

    // Ombre
    tl.to(logo.current, {
      filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))',
      duration: 0.3,
    }, 0.4);

    // Glow
    tl.to(glow.current, {
      opacity: 0.12,
      duration: 0.4,
    }, 1.0);

    return tl;
  }, [refs, onCue]);

  /**
   * Variant L — "Sticker Zoom Slam"
   * Intention: Premium, Netflix-like - zoom depuis loin → impact brutal
   */
  const createStickerZoomTimeline = useCallback(() => {
    const { logo, glow, flash } = refs;
    if (!logo.current || !glow.current || !flash.current) return null;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      paused: true,
    });

    // Initial state - très loin, petit
    gsap.set(logo.current, { 
      opacity: 0,
      scale: 0.1,
      filter: 'blur(8px)',
    });
    gsap.set(glow.current, { opacity: 0, scale: 0.5 });
    gsap.set(flash.current, { opacity: 0 });

    // 0.0–0.4s: Zoom rapide vers la caméra
    tl.to(logo.current, {
      opacity: 1,
      scale: 1.15,
      filter: 'blur(0px)',
      duration: 0.35,
      ease: 'power4.out',
    }, 0);

    // 0.35s: SLAM!
    tl.call(() => onCue?.('slam', 0.35), [], 0.35);

    // Flash d'impact
    tl.to(flash.current, {
      opacity: 0.8,
      duration: 0.05,
    }, 0.35);

    tl.to(flash.current, {
      opacity: 0,
      duration: 0.2,
    }, 0.4);

    // Glow intense
    tl.to(glow.current, {
      opacity: 0.6,
      scale: 1.3,
      duration: 0.15,
    }, 0.35);

    // 0.4–0.7s: Rebond arrière puis settle
    tl.to(logo.current, {
      scale: 0.97,
      duration: 0.12,
      ease: 'power2.in',
    }, 0.4);

    tl.to(logo.current, {
      scale: 1,
      duration: 0.3,
      ease: 'elastic.out(1, 0.6)',
    }, 0.52);

    // Ombre qui s'installe
    tl.to(logo.current, {
      filter: 'drop-shadow(4px 6px 10px rgba(0,0,0,0.3))',
      duration: 0.3,
    }, 0.5);

    // Glow fade
    tl.to(glow.current, {
      opacity: 0.15,
      scale: 1,
      duration: 0.6,
    }, 0.6);

    // Pose finale
    tl.to(logo.current, {
      filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.2))',
      duration: 0.5,
    }, 1.2);

    return tl;
  }, [refs, onCue]);

  /**
   * Reduced Motion Fallback - Simple fade
   */
  const createReducedMotionTimeline = useCallback(() => {
    const { logo } = refs;
    if (!logo.current) return null;

    const tl = gsap.timeline({ paused: true });

    gsap.set(logo.current, { opacity: 0 });

    tl.to(logo.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, 0);

    return tl;
  }, [refs]);

  // Create timeline based on variant
  const createTimeline = useCallback(() => {
    if (reducedMotion) {
      return createReducedMotionTimeline();
    }

    switch (variant) {
      // Classic variants
      case 'netflix-punch':
        return createNetflixPunchTimeline();
      case 'hand-drawn':
        return createHandDrawnTimeline();
      case 'community-assemble':
        return createCommunityAssembleTimeline();
      case 'scan-hud':
        return createScanHudTimeline();
      case 'blur-focus':
        return createBlurFocusTimeline();
      case 'tilt-3d':
        return createTilt3DTimeline();
      // DrawSVG variants
      case 'draw-reveal':
        return createDrawRevealTimeline();
      case 'draw-write':
        return createDrawWriteTimeline();
      case 'draw-neon':
        return createDrawNeonTimeline();
      case 'draw-star':
        return createDrawStarTimeline();
      // Star variants
      case 'star-orbit':
        return createStarOrbitTimeline();
      case 'star-spiral':
        return createStarSpiralTimeline();
      case 'star-bounce':
        return createStarBounceTimeline();
      case 'star-shoot':
        return createStarShootTimeline();
      case 'star-pulse':
        return createStarPulseTimeline();
      case 'star-magnet':
        return createStarMagnetTimeline();
      // Sticker variants
      case 'sticker-slap':
        return createStickerSlapTimeline();
      case 'sticker-peel':
        return createStickerPeelTimeline();
      case 'sticker-stamp':
        return createStickerStampTimeline();
      case 'sticker-drop':
        return createStickerDropTimeline();
      case 'sticker-wiggle':
        return createStickerWiggleTimeline();
      case 'sticker-zoom':
        return createStickerZoomTimeline();
      default:
        return createNetflixPunchTimeline();
    }
  }, [
    variant,
    reducedMotion,
    // Classic
    createNetflixPunchTimeline,
    createHandDrawnTimeline,
    createCommunityAssembleTimeline,
    createScanHudTimeline,
    createBlurFocusTimeline,
    createTilt3DTimeline,
    // DrawSVG
    createDrawRevealTimeline,
    createDrawWriteTimeline,
    createDrawNeonTimeline,
    createDrawStarTimeline,
    // Star
    createStarOrbitTimeline,
    createStarSpiralTimeline,
    createStarBounceTimeline,
    createStarShootTimeline,
    createStarPulseTimeline,
    createStarMagnetTimeline,
    // Sticker
    createStickerSlapTimeline,
    createStickerPeelTimeline,
    createStickerStampTimeline,
    createStickerDropTimeline,
    createStickerWiggleTimeline,
    createStickerZoomTimeline,
    // Fallback
    createReducedMotionTimeline,
  ]);

  const play = useCallback(() => {
    contextRef.current?.revert();
    
    contextRef.current = gsap.context(() => {
      timelineRef.current = createTimeline();
      timelineRef.current?.play();
    });
  }, [createTimeline]);

  const replay = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.restart();
    } else {
      play();
    }
  }, [play]);

  const pause = useCallback(() => {
    timelineRef.current?.pause();
  }, []);

  const kill = useCallback(() => {
    timelineRef.current?.kill();
    contextRef.current?.revert();
  }, []);

  return {
    play,
    replay,
    pause,
    kill,
    timeline: timelineRef,
    durationTotal: DURATION_TOTAL,
  };
}

