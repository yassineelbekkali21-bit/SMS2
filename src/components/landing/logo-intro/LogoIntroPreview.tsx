'use client';

/**
 * LogoIntroPreview - Écran de preview pour tester les variants
 * 
 * Permet de:
 * - Sélectionner un variant dans un dropdown
 * - Rejouer l'animation
 * - Basculer dark/light mode
 * - Voir les cues SFX en temps réel
 */

import React, { useState, useCallback } from 'react';
import { LogoIntro } from './LogoIntro';
import { LogoIntroVariant } from './useLogoIntroAnimation';
import { Play, RotateCcw, Sun, Moon, Volume2 } from 'lucide-react';

const VARIANTS: { id: LogoIntroVariant; label: string; description: string; category: 'classic' | 'sticker' | 'draw' | 'star' }[] = [
  // Classic variants
  { 
    id: 'netflix-punch', 
    label: 'A · Netflix', 
    description: 'Impact signature avec glow et light sweep',
    category: 'classic',
  },
  { 
    id: 'hand-drawn', 
    label: 'B · Manuscrit', 
    description: '✏️ Tracé progressif DrawSVG style manuscrit',
    category: 'draw',
  },
  { 
    id: 'community-assemble', 
    label: 'C · Community', 
    description: 'Particules qui convergent vers le logo',
    category: 'classic',
  },
  { 
    id: 'scan-hud', 
    label: 'D · Scan', 
    description: 'Style laboratoire avec scan et glitch',
    category: 'classic',
  },
  { 
    id: 'blur-focus', 
    label: 'E · Focus', 
    description: 'Transformation de flou vers netteté',
    category: 'classic',
  },
  { 
    id: 'tilt-3d', 
    label: 'F · 3D', 
    description: 'Entrée avec perspective et ombre portée',
    category: 'classic',
  },
  // Sticker variants
  { 
    id: 'sticker-slap', 
    label: 'G · Slap', 
    description: '🎯 Sticker claqué sur l\'écran avec rebond',
    category: 'sticker',
  },
  { 
    id: 'sticker-peel', 
    label: 'H · Peel', 
    description: '🎯✏️ Décollage 3D + tracé DrawSVG',
    category: 'draw',
  },
  { 
    id: 'sticker-stamp', 
    label: 'I · Stamp', 
    description: '🎯 Tampon qui s\'écrase avec impact',
    category: 'sticker',
  },
  { 
    id: 'sticker-drop', 
    label: 'J · Drop', 
    description: '🎯 Chute avec rotation et rebonds',
    category: 'sticker',
  },
  { 
    id: 'sticker-wiggle', 
    label: 'K · Wiggle', 
    description: '🎯 Collage + petit wiggle comme mal collé',
    category: 'sticker',
  },
  { 
    id: 'sticker-zoom', 
    label: 'L · Zoom', 
    description: '🎯 Zoom rapide depuis loin → impact brutal',
    category: 'sticker',
  },
  // DrawSVG variants
  { 
    id: 'draw-reveal', 
    label: 'M · Draw Reveal', 
    description: '✏️ Tracé élégant lettre par lettre avec flash final',
    category: 'draw',
  },
  { 
    id: 'draw-write', 
    label: 'N · Draw Write', 
    description: '✏️ Écriture manuscrite naturelle comme Zak',
    category: 'draw',
  },
  { 
    id: 'draw-neon', 
    label: 'O · Draw Neon', 
    description: '✏️ Tracé néon lumineux avec flicker effect',
    category: 'draw',
  },
  { 
    id: 'draw-star', 
    label: 'P · Quest ⭐', 
    description: '⭐ L\'étoile vole librement, se fixe, SMS l\'embrasse',
    category: 'star',
  },
  // Star variants (nouveaux) - L'étoile comme symbole de la quête
  { 
    id: 'star-orbit', 
    label: 'Q · Orbit 🌙', 
    description: '⭐ L\'étoile orbite comme une planète avant de se fixer',
    category: 'star',
  },
  { 
    id: 'star-spiral', 
    label: 'R · Spiral 🌀', 
    description: '⭐ Descente en spirale hypnotique vers le centre',
    category: 'star',
  },
  { 
    id: 'star-bounce', 
    label: 'S · Bounce 🏀', 
    description: '⭐ Rebonds énergiques avant de trouver sa place',
    category: 'star',
  },
  { 
    id: 'star-shoot', 
    label: 'T · Shoot 💫', 
    description: '⭐ Étoile filante traverse l\'écran puis se fixe',
    category: 'star',
  },
  { 
    id: 'star-pulse', 
    label: 'U · Pulse 💓', 
    description: '⭐ L\'étoile pulse comme un cœur, l\'objectif est vivant',
    category: 'star',
  },
  { 
    id: 'star-magnet', 
    label: 'V · Magnet 🧲', 
    description: '⭐ Attirée magnétiquement, résiste puis cède',
    category: 'star',
  },
];

export const LogoIntroPreview: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<LogoIntroVariant>('netflix-punch');
  const [darkMode, setDarkMode] = useState(true);
  const [key, setKey] = useState(0);
  const [cueLog, setCueLog] = useState<{ cue: string; time: number }[]>([]);

  const handleReplay = useCallback(() => {
    setKey(prev => prev + 1);
    setCueLog([]);
  }, []);

  const handleCue = useCallback((cue: string, time: number) => {
    setCueLog(prev => [...prev, { cue, time }]);
    console.log(`🔊 SFX Cue: "${cue}" at ${time.toFixed(2)}s`);
  }, []);

  const handleVariantChange = useCallback((variant: LogoIntroVariant) => {
    setSelectedVariant(variant);
    setCueLog([]);
    setKey(prev => prev + 1);
  }, []);

  const currentVariantInfo = VARIANTS.find(v => v.id === selectedVariant);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
      {/* Header Controls */}
      <div className={`
        sticky top-0 z-50 backdrop-blur-xl border-b
        ${darkMode 
          ? 'bg-gray-900/80 border-gray-800' 
          : 'bg-white/80 border-gray-200'
        }
      `}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title */}
            <div>
              <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Logo Intro Preview
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Durée: 2.4s | {VARIANTS.length} variants
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Variant Selector */}
              <select
                value={selectedVariant}
                onChange={(e) => handleVariantChange(e.target.value as LogoIntroVariant)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium border
                  ${darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                {VARIANTS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>

              {/* Replay Button */}
              <button
                onClick={handleReplay}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                `}
              >
                <RotateCcw size={16} />
                Replay
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`
                  p-2 rounded-lg transition-colors
                  ${darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }
                `}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Variant Description */}
          <div className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="font-medium">{currentVariantInfo?.label}:</span>{' '}
            {currentVariantInfo?.description}
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Animation Preview */}
          <div className="lg:col-span-2">
            <div 
              className={`
                aspect-video rounded-2xl overflow-hidden shadow-2xl border-2
                ${darkMode ? 'border-gray-800' : 'border-gray-200'}
              `}
            >
              <LogoIntro
                key={key}
                variant={selectedVariant}
                autoPlay={true}
                darkMode={darkMode}
                onCue={handleCue}
              />
            </div>

            {/* Quick variant buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVariantChange(v.id)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium transition-all
                    ${selectedVariant === v.id
                      ? 'bg-blue-600 text-white'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {v.label.split(' — ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* SFX Cue Log */}
          <div>
            <div 
              className={`
                rounded-xl p-4 border
                ${darkMode 
                  ? 'bg-gray-900 border-gray-800' 
                  : 'bg-white border-gray-200'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-3">
                <Volume2 size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  SFX Cues
                </h3>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cueLog.length === 0 ? (
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Les cues SFX apparaîtront ici...
                  </p>
                ) : (
                  cueLog.map((log, index) => (
                    <div 
                      key={index}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-lg text-sm
                        ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}
                      `}
                    >
                      <span className={`font-mono font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {log.cue}
                      </span>
                      <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                        {log.time.toFixed(2)}s
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Variant-specific cues info */}
              <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Cues pour ce variant:
                </p>
                <div className="flex flex-wrap gap-1">
                  {getVariantCues(selectedVariant).map((cue) => (
                    <span
                      key={cue}
                      className={`
                        px-2 py-0.5 rounded text-xs font-mono
                        ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}
                      `}
                    >
                      {cue}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Info */}
            <div 
              className={`
                mt-4 rounded-xl p-4 border
                ${darkMode 
                  ? 'bg-gray-900 border-gray-800' 
                  : 'bg-white border-gray-200'
                }
              `}
            >
              <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Détails techniques
              </h3>
              <ul className={`text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Durée totale: <strong>2.4s</strong></li>
                <li>• Pose finale: <strong>0.3-0.5s</strong></li>
                <li>• Ease default: <strong>power3.out</strong></li>
                <li>• prefers-reduced-motion: <strong>fade 0.4s</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get cues for each variant
function getVariantCues(variant: LogoIntroVariant): string[] {
  switch (variant) {
    // Classic variants
    case 'netflix-punch':
      return ['whoosh', 'impact', 'shine'];
    case 'hand-drawn':
      return ['marker', 'finish'];
    case 'community-assemble':
      return ['spark', 'snap'];
    case 'scan-hud':
      return ['beep', 'scan'];
    case 'blur-focus':
      return ['focus', 'lock'];
    case 'tilt-3d':
      return [];
    // DrawSVG variants
    case 'draw-reveal':
      return ['start', 'complete'];
    case 'draw-write':
      return ['write', 'done'];
    case 'draw-neon':
      return ['buzz', 'flicker'];
    case 'draw-star':
      return ['quest', 'lock', 'embrace'];
    // Star variants
    case 'star-orbit':
      return ['orbit', 'lock', 'embrace'];
    case 'star-spiral':
      return ['spiral', 'lock', 'embrace'];
    case 'star-bounce':
      return ['bounce', 'lock', 'embrace'];
    case 'star-shoot':
      return ['shoot', 'impact', 'embrace'];
    case 'star-pulse':
      return ['heartbeat', 'bloom', 'embrace'];
    case 'star-magnet':
      return ['attract', 'snap', 'embrace'];
    // Sticker variants
    case 'sticker-slap':
      return ['slap'];
    case 'sticker-peel':
      return ['peel', 'stick'];
    case 'sticker-stamp':
      return ['stamp'];
    case 'sticker-drop':
      return ['drop'];
    case 'sticker-wiggle':
      return ['pop', 'wiggle'];
    case 'sticker-zoom':
      return ['slam'];
    default:
      return [];
  }
}

export default LogoIntroPreview;

