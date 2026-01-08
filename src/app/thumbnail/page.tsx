'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Check, Sparkles, Zap, Atom, Calculator, FlaskConical, TrendingUp, Binary, Brain } from 'lucide-react';

/**
 * Page de démonstration des styles de thumbnails
 * Inspiration: Spotify, Apple Music, Netflix
 */

// Données des bundles pour les démos
const bundles = [
  { id: 'mecanique', name: 'Mécanique', icon: Zap, tracks: 3 },
  { id: 'electrostatique', name: 'Électrostatique', icon: Atom, tracks: 3 },
  { id: 'analyse', name: 'Analyse', icon: Calculator, tracks: 3 },
  { id: 'chimie-orga', name: 'Chimie Organique', icon: FlaskConical, tracks: 4 },
  { id: 'stats', name: 'Statistiques', icon: TrendingUp, tracks: 2 },
  { id: 'algo', name: 'Algorithmique', icon: Binary, tracks: 3 },
];

// ============================================================================
// STYLE 1: GRADIENT MESH (Style Spotify Wrapped)
// ============================================================================
const GradientMeshThumbnail = ({ bundle, index }: { bundle: typeof bundles[0], index: number }) => {
  const gradients = [
    'from-purple-600 via-pink-500 to-orange-400',
    'from-blue-600 via-[#00c2ff] to-emerald-400',
    'from-rose-500 via-fuchsia-500 to-indigo-500',
    'from-amber-500 via-orange-500 to-red-500',
    'from-teal-500 via-cyan-400 to-blue-500',
    'from-violet-600 via-purple-500 to-fuchsia-400',
  ];
  
  return (
    <div className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br ${gradients[index % gradients.length]}`}>
      {/* Mesh overlay */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-white/20 rounded-full blur-3xl transform -translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-black/20 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4" />
      </div>
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <bundle.icon size={32} className="text-white/80 mb-3" />
        <h3 className="text-white font-bold text-2xl tracking-tight">{bundle.name}</h3>
        <p className="text-white/60 text-sm mt-1">{bundle.tracks} learning tracks</p>
      </div>
    </div>
  );
};

// ============================================================================
// STYLE 2: BOLD TYPOGRAPHY (Style Apple Music)
// ============================================================================
const BoldTypographyThumbnail = ({ bundle, index }: { bundle: typeof bundles[0], index: number }) => {
  const colors = [
    { bg: '#1a1a2e', accent: '#e94560' },
    { bg: '#0f0e17', accent: '#ff8906' },
    { bg: '#16213e', accent: '#00fff5' },
    { bg: '#1b1b2f', accent: '#c8b6ff' },
    { bg: '#10002b', accent: '#e0aaff' },
    { bg: '#03071e', accent: '#ffba08' },
  ];
  const color = colors[index % colors.length];
  
  // Première lettre du bundle
  const initial = bundle.name.charAt(0).toUpperCase();
  
  return (
    <div 
      className="relative w-full aspect-square rounded-2xl overflow-hidden"
      style={{ backgroundColor: color.bg }}
    >
      {/* Giant letter */}
      <div 
        className="absolute -right-8 -bottom-16 text-[280px] font-black leading-none select-none"
        style={{ color: color.accent, opacity: 0.15 }}
      >
        {initial}
      </div>
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <bundle.icon size={28} style={{ color: color.accent }} />
        <div>
          <h3 className="text-white font-black text-3xl tracking-tight leading-tight">{bundle.name}</h3>
          <p className="text-white/40 text-sm mt-2 uppercase tracking-widest">{bundle.tracks} tracks</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STYLE 3: GEOMETRIC MINIMAL (Style Bauhaus/Modern)
// ============================================================================
const GeometricThumbnail = ({ bundle, index }: { bundle: typeof bundles[0], index: number }) => {
  const schemes = [
    { bg: '#fef3c7', shapes: ['#f59e0b', '#dc2626', '#1e3a8a'] },
    { bg: '#ecfccb', shapes: ['#84cc16', '#0891b2', '#6d28d9'] },
    { bg: '#fce7f3', shapes: ['#ec4899', '#8b5cf6', '#0ea5e9'] },
    { bg: '#e0e7ff', shapes: ['#6366f1', '#14b8a6', '#f43f5e'] },
    { bg: '#fef9c3', shapes: ['#eab308', '#22c55e', '#3b82f6'] },
    { bg: '#f0fdfa', shapes: ['#14b8a6', '#f97316', '#a855f7'] },
  ];
  const scheme = schemes[index % schemes.length];
  
  return (
    <div 
      className="relative w-full aspect-square rounded-2xl overflow-hidden"
      style={{ backgroundColor: scheme.bg }}
    >
      {/* Geometric shapes */}
      <div 
        className="absolute top-4 right-4 w-24 h-24 rounded-full"
        style={{ backgroundColor: scheme.shapes[0] }}
      />
      <div 
        className="absolute bottom-12 left-8 w-16 h-16"
        style={{ backgroundColor: scheme.shapes[1] }}
      />
      <div 
        className="absolute top-1/2 right-1/3 w-12 h-32 -rotate-12"
        style={{ backgroundColor: scheme.shapes[2] }}
      />
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-gray-900 font-bold text-2xl">{bundle.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{bundle.tracks} learning tracks</p>
      </div>
    </div>
  );
};

// ============================================================================
// STYLE 4: GLASSMORPHISM (Style iOS/Modern)
// ============================================================================
const GlassmorphismThumbnail = ({ bundle, index }: { bundle: typeof bundles[0], index: number }) => {
  const backgrounds = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ];
  
  return (
    <div 
      className="relative w-full aspect-square rounded-2xl overflow-hidden"
      style={{ background: backgrounds[index % backgrounds.length] }}
    >
      {/* Floating orbs */}
      <div className="absolute top-8 left-8 w-20 h-20 bg-white/30 rounded-full blur-xl" />
      <div className="absolute bottom-16 right-4 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
      
      {/* Glass card */}
      <div className="absolute inset-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 flex flex-col justify-end p-5">
        <bundle.icon size={28} className="text-white mb-3" />
        <h3 className="text-white font-bold text-xl">{bundle.name}</h3>
        <p className="text-white/60 text-sm mt-1">{bundle.tracks} learning tracks</p>
      </div>
    </div>
  );
};

// ============================================================================
// STYLE 5: NEON GLOW (Style Cyberpunk)
// ============================================================================
const NeonGlowThumbnail = ({ bundle, index }: { bundle: typeof bundles[0], index: number }) => {
  const neons = [
    { glow: '#ff00ff', secondary: '#00ffff' },
    { glow: '#00ff88', secondary: '#ff6b00' },
    { glow: '#00d4ff', secondary: '#ff0080' },
    { glow: '#ffff00', secondary: '#ff00ff' },
    { glow: '#ff3366', secondary: '#33ccff' },
    { glow: '#00ffcc', secondary: '#ff6699' },
  ];
  const neon = neons[index % neons.length];
  
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#0a0a0f]">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${neon.glow}22 1px, transparent 1px), linear-gradient(90deg, ${neon.glow}22 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Neon glow effect */}
      <div 
        className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: neon.glow }}
      />
      <div 
        className="absolute bottom-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-40"
        style={{ backgroundColor: neon.secondary }}
      />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <bundle.icon 
          size={32} 
          className="mb-3"
          style={{ color: neon.glow, filter: `drop-shadow(0 0 10px ${neon.glow})` }} 
        />
        <h3 
          className="font-black text-2xl tracking-tight"
          style={{ color: neon.glow, textShadow: `0 0 20px ${neon.glow}` }}
        >
          {bundle.name}
        </h3>
        <p className="text-white/40 text-sm mt-1">{bundle.tracks} learning tracks</p>
      </div>
    </div>
  );
};

// ============================================================================
// STYLE 6: DUOTONE (Style Editorial)
// ============================================================================
const DuotoneThumbnail = ({ bundle, index }: { bundle: typeof bundles[0], index: number }) => {
  const duotones = [
    { primary: '#ff6b6b', secondary: '#4ecdc4' },
    { primary: '#845ec2', secondary: '#ffc75f' },
    { primary: '#2c3e50', secondary: '#e74c3c' },
    { primary: '#1abc9c', secondary: '#9b59b6' },
    { primary: '#3498db', secondary: '#f39c12' },
    { primary: '#e91e63', secondary: '#00bcd4' },
  ];
  const duo = duotones[index % duotones.length];
  
  return (
    <div 
      className="relative w-full aspect-square rounded-2xl overflow-hidden"
      style={{ backgroundColor: duo.primary }}
    >
      {/* Diagonal split */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${duo.primary} 50%, ${duo.secondary} 50%)`
        }}
      />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="flex items-center gap-3 mb-2">
          <bundle.icon size={24} className="text-white" />
          <div className="h-px flex-1 bg-white/30" />
        </div>
        <h3 className="text-white font-black text-2xl uppercase tracking-wide">{bundle.name}</h3>
        <p className="text-white/60 text-xs mt-2 uppercase tracking-widest">{bundle.tracks} learning tracks</p>
      </div>
    </div>
  );
};

// ============================================================================
// STYLE 7: 3D ABSTRACT (Style Tech/Futuriste)
// ============================================================================
const Abstract3DThumbnail = ({ bundle, index }: { bundle: typeof bundles[0], index: number }) => {
  const colors = [
    { bg: '#1a1a2e', accent: '#e94560', sphere: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { bg: '#0d1117', accent: '#58a6ff', sphere: 'linear-gradient(135deg, #00d4ff, #090979)' },
    { bg: '#161b22', accent: '#7ee787', sphere: 'linear-gradient(135deg, #11998e, #38ef7d)' },
    { bg: '#21262d', accent: '#f778ba', sphere: 'linear-gradient(135deg, #ee0979, #ff6a00)' },
    { bg: '#0d1117', accent: '#d2a8ff', sphere: 'linear-gradient(135deg, #8e2de2, #4a00e0)' },
    { bg: '#161b22', accent: '#ffa657', sphere: 'linear-gradient(135deg, #f12711, #f5af19)' },
  ];
  const color = colors[index % colors.length];
  
  return (
    <div 
      className="relative w-full aspect-square rounded-2xl overflow-hidden"
      style={{ backgroundColor: color.bg }}
    >
      {/* 3D sphere */}
      <div 
        className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          background: color.sphere,
          boxShadow: `0 20px 60px -20px ${color.accent}80, inset 0 -20px 40px -20px rgba(0,0,0,0.5), inset 0 20px 40px -20px rgba(255,255,255,0.3)`
        }}
      />
      
      {/* Orbit ring */}
      <div 
        className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full border transform -translate-x-1/2 -translate-y-1/2 -rotate-12"
        style={{ borderColor: `${color.accent}30` }}
      />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-white font-bold text-xl">{bundle.name}</h3>
        <p style={{ color: color.accent }} className="text-sm mt-1">{bundle.tracks} learning tracks</p>
      </div>
    </div>
  );
};

// ============================================================================
// STYLE 8: GRAIN TEXTURE (Style Rétro/Vintage)
// ============================================================================
const GrainTextureThumbnail = ({ bundle, index }: { bundle: typeof bundles[0], index: number }) => {
  const palettes = [
    { bg: '#f4a261', text: '#264653' },
    { bg: '#e9c46a', text: '#2a9d8f' },
    { bg: '#e76f51', text: '#1d3557' },
    { bg: '#a8dadc', text: '#1d3557' },
    { bg: '#457b9d', text: '#f1faee' },
    { bg: '#2a9d8f', text: '#e9c46a' },
  ];
  const palette = palettes[index % palettes.length];
  
  return (
    <div 
      className="relative w-full aspect-square rounded-2xl overflow-hidden"
      style={{ backgroundColor: palette.bg }}
    >
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Retro circle */}
      <div 
        className="absolute top-8 right-8 w-24 h-24 rounded-full border-4"
        style={{ borderColor: palette.text }}
      />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 
          className="font-black text-3xl uppercase"
          style={{ color: palette.text }}
        >
          {bundle.name}
        </h3>
        <p 
          className="text-sm mt-2 uppercase tracking-widest opacity-70"
          style={{ color: palette.text }}
        >
          {bundle.tracks} tracks
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// STYLE 9: MINIMAL LINE ART
// ============================================================================
const LineArtThumbnail = ({ bundle, index }: { bundle: typeof bundles[0], index: number }) => {
  const colors = [
    { bg: '#fafafa', line: '#18181b' },
    { bg: '#18181b', line: '#fafafa' },
    { bg: '#fef2f2', line: '#dc2626' },
    { bg: '#eff6ff', line: '#2563eb' },
    { bg: '#f0fdf4', line: '#16a34a' },
    { bg: '#faf5ff', line: '#9333ea' },
  ];
  const color = colors[index % colors.length];
  const isDark = color.bg === '#18181b';
  
  return (
    <div 
      className="relative w-full aspect-square rounded-2xl overflow-hidden"
      style={{ backgroundColor: color.bg }}
    >
      {/* Line art decoration */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
        <circle 
          cx="150" cy="50" r="30" 
          fill="none" 
          stroke={color.line} 
          strokeWidth="1"
          opacity="0.3"
        />
        <line 
          x1="20" y1="100" x2="180" y2="100" 
          stroke={color.line} 
          strokeWidth="1"
          opacity="0.2"
        />
        <line 
          x1="100" y1="20" x2="100" y2="180" 
          stroke={color.line} 
          strokeWidth="1"
          opacity="0.2"
        />
        <path 
          d="M 20 150 Q 100 100 180 150" 
          fill="none" 
          stroke={color.line} 
          strokeWidth="1.5"
          opacity="0.4"
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div 
          className="w-12 h-0.5 mb-4"
          style={{ backgroundColor: color.line }}
        />
        <h3 
          className="font-light text-2xl tracking-tight"
          style={{ color: color.line }}
        >
          {bundle.name}
        </h3>
        <p 
          className="text-sm mt-2 opacity-50"
          style={{ color: color.line }}
        >
          {bundle.tracks} learning tracks
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// STYLE 10: BRUTALIST (Style Anti-Design Bold)
// ============================================================================
const BrutalistThumbnail = ({ bundle, index }: { bundle: typeof bundles[0], index: number }) => {
  const schemes = [
    { bg: '#ff0000', text: '#000000', accent: '#ffff00' },
    { bg: '#0000ff', text: '#ffffff', accent: '#00ff00' },
    { bg: '#000000', text: '#ff00ff', accent: '#00ffff' },
    { bg: '#ffff00', text: '#000000', accent: '#ff0000' },
    { bg: '#00ff00', text: '#000000', accent: '#ff00ff' },
    { bg: '#ff00ff', text: '#000000', accent: '#00ff00' },
  ];
  const scheme = schemes[index % schemes.length];
  
  return (
    <div 
      className="relative w-full aspect-square rounded-none overflow-hidden border-4 border-black"
      style={{ backgroundColor: scheme.bg }}
    >
      {/* Brutalist elements */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-8"
        style={{ backgroundColor: scheme.accent }}
      />
      <div 
        className="absolute bottom-0 left-0 w-8 h-1/2"
        style={{ backgroundColor: scheme.accent }}
      />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <h3 
          className="font-black text-4xl uppercase leading-none"
          style={{ color: scheme.text }}
        >
          {bundle.name}
        </h3>
        <p 
          className="text-xs mt-3 uppercase tracking-[0.3em] font-bold"
          style={{ color: scheme.text }}
        >
          {bundle.tracks} TRK
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const styles = [
  { id: 'gradient-mesh', name: 'Gradient Mesh', description: 'Style Spotify Wrapped — Dégradés fluides et colorés', component: GradientMeshThumbnail },
  { id: 'bold-typography', name: 'Bold Typography', description: 'Style Apple Music — Typographie massive et impactante', component: BoldTypographyThumbnail },
  { id: 'geometric', name: 'Geometric Minimal', description: 'Style Bauhaus — Formes géométriques colorées', component: GeometricThumbnail },
  { id: 'glassmorphism', name: 'Glassmorphism', description: 'Style iOS — Effet verre dépoli moderne', component: GlassmorphismThumbnail },
  { id: 'neon-glow', name: 'Neon Glow', description: 'Style Cyberpunk — Néons et grille futuriste', component: NeonGlowThumbnail },
  { id: 'duotone', name: 'Duotone', description: 'Style Editorial — Deux couleurs contrastées', component: DuotoneThumbnail },
  { id: '3d-abstract', name: '3D Abstract', description: 'Style Tech — Sphères et formes 3D', component: Abstract3DThumbnail },
  { id: 'grain-texture', name: 'Grain Texture', description: 'Style Rétro — Textures vintage et grain', component: GrainTextureThumbnail },
  { id: 'line-art', name: 'Line Art Minimal', description: 'Style Élégant — Lignes fines et épuré', component: LineArtThumbnail },
  { id: 'brutalist', name: 'Brutalist', description: 'Style Anti-Design — Bold, brut et impactant', component: BrutalistThumbnail },
];

export default function ThumbnailShowcase() {
  const [likedStyles, setLikedStyles] = useState<Set<string>>(new Set());
  
  const toggleLike = (styleId: string) => {
    setLikedStyles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(styleId)) {
        newSet.delete(styleId);
      } else {
        newSet.add(styleId);
      }
      return newSet;
    });
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Thumbnail Styles</h1>
              <p className="text-white/50 mt-1">Choisis le style qui te plaît pour les bundles SMS</p>
            </div>
            {likedStyles.size > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full">
                <Heart size={18} className="text-pink-500 fill-pink-500" />
                <span className="text-pink-300 font-medium">{likedStyles.size} style{likedStyles.size > 1 ? 's' : ''} sélectionné{likedStyles.size > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Styles Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        {styles.map((style) => (
          <section key={style.id} className="relative">
            {/* Style Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{style.name}</h2>
                  {likedStyles.has(style.id) && (
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-400 text-xs font-bold rounded-full flex items-center gap-1">
                      <Check size={12} />
                      SÉLECTIONNÉ
                    </span>
                  )}
                </div>
                <p className="text-white/50 mt-1">{style.description}</p>
              </div>
              <button
                onClick={() => toggleLike(style.id)}
                className={`
                  px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2
                  ${likedStyles.has(style.id) 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }
                `}
              >
                <Heart size={18} className={likedStyles.has(style.id) ? 'fill-white' : ''} />
                {likedStyles.has(style.id) ? 'J\'aime !' : 'J\'aime'}
              </button>
            </div>
            
            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {bundles.map((bundle, index) => (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <style.component bundle={bundle} index={index} />
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </main>
      
      {/* Fixed Summary Bar */}
      {likedStyles.size > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10 p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Styles sélectionnés :</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from(likedStyles).map(id => {
                  const style = styles.find(s => s.id === id);
                  return (
                    <span key={id} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">
                      {style?.name}
                    </span>
                  );
                })}
              </div>
            </div>
            <button className="px-8 py-3 bg-[#00c2ff] hover:bg-[#3bb5dc] text-white font-bold rounded-full transition-colors flex items-center gap-2">
              <Sparkles size={18} />
              Valider mes choix
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

