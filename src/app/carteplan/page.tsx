'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Calendar, Zap, Clock, ChevronRight, GripVertical, Star } from 'lucide-react';

export default function CartePlanPage() {
  return (
    <div className="min-h-screen bg-[#0d1317] p-8">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">Propositions de cartes "Mes tracks"</h1>
      <p className="text-white/50 text-center mb-12">10 variations de design</p>
      
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
        
        {/* ========== PROPOSITION 1 ========== */}
        {/* Style actuel amélioré - Numéro + Infos inline */}
        <div className="space-y-3">
          <span className="text-sm text-white/40 uppercase tracking-wider">Proposition 1 - Numéro badge</span>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{ 
              padding: '16px 20px', 
              borderRadius: '16px', 
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Number badge */}
            <div style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '14px', 
              background: 'linear-gradient(135deg, #00c2ff 0%, #0088cc 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-parafina)' }}>01</span>
            </div>
            
            {/* Content */}
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '17px', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>Mécanique du point</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>16 mars 2026</span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>•</span>
                <span style={{ fontSize: '14px', color: '#00c2ff', fontWeight: 500 }}>Modéré</span>
              </div>
            </div>
            
            {/* X button */}
            <button style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', background: 'none', border: 'none' }}>
              <X size={18} />
            </button>
          </motion.div>
        </div>

        {/* ========== PROPOSITION 2 ========== */}
        {/* Minimaliste avec accent gauche */}
        <div className="space-y-3">
          <span className="text-sm text-white/40 uppercase tracking-wider">Proposition 2 - Accent latéral</span>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{ 
              padding: '16px 20px', 
              borderRadius: '14px', 
              background: 'rgba(255,255,255,0.03)',
              borderLeft: '4px solid #00c2ff',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#00c2ff', fontWeight: 600, background: 'rgba(0,194,255,0.15)', padding: '2px 8px', borderRadius: '4px' }}>01</span>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>Mécanique du point</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                <span>📅 16/03/2026</span>
                <span>⚡ Modéré</span>
              </div>
            </div>
            <X size={16} style={{ color: 'rgba(255,255,255,0.25)' }} />
          </motion.div>
        </div>

        {/* ========== PROPOSITION 3 ========== */}
        {/* Card avec progression */}
        <div className="space-y-3">
          <span className="text-sm text-white/40 uppercase tracking-wider">Proposition 3 - Avec progression</span>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{ 
              padding: '18px 20px', 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, rgba(0,194,255,0.1) 0%, rgba(0,194,255,0.02) 100%)',
              border: '1px solid rgba(0,194,255,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#FFF', marginBottom: '2px' }}>Mécanique du point</h4>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>6 leçons • 3h estimées</span>
              </div>
              <X size={16} style={{ color: 'rgba(255,255,255,0.25)' }} />
            </div>
            {/* Progress bar */}
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '10px' }}>
              <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg, #00c2ff, #0088cc)', borderRadius: '2px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Objectif: 16 mars 2026</span>
              <span style={{ color: '#00c2ff', fontWeight: 600 }}>Modéré</span>
            </div>
          </motion.div>
        </div>

        {/* ========== PROPOSITION 4 ========== */}
        {/* Style Notion/Linear */}
        <div className="space-y-3">
          <span className="text-sm text-white/40 uppercase tracking-wider">Proposition 4 - Style Notion</span>
          <motion.div 
            whileHover={{ background: 'rgba(255,255,255,0.06)' }}
            style={{ 
              padding: '12px 16px', 
              borderRadius: '10px', 
              background: 'rgba(255,255,255,0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
            }}
          >
            <GripVertical size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
            <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#00c2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={12} color="#FFF" />
            </div>
            <span style={{ flex: 1, fontSize: '15px', color: '#FFF' }}>Mécanique du point</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '6px' }}>16 mars</span>
            <span style={{ fontSize: '12px', color: '#00c2ff', background: 'rgba(0,194,255,0.1)', padding: '4px 8px', borderRadius: '6px' }}>Modéré</span>
          </motion.div>
        </div>

        {/* ========== PROPOSITION 5 ========== */}
        {/* Glassmorphism */}
        <div className="space-y-3">
          <span className="text-sm text-white/40 uppercase tracking-wider">Proposition 5 - Glass effect</span>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{ 
              padding: '20px', 
              borderRadius: '20px', 
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(0,194,255,0.3) 0%, transparent 70%)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,194,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,194,255,0.3)' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#00c2ff' }}>01</span>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>Mécanique du point</h4>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '20px' }}>16 mars 2026</span>
                  <span style={{ fontSize: '11px', color: '#00c2ff', background: 'rgba(0,194,255,0.15)', padding: '3px 8px', borderRadius: '20px' }}>Modéré</span>
                </div>
              </div>
              <X size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
            </div>
          </motion.div>
        </div>

        {/* ========== PROPOSITION 6 ========== */}
        {/* Compact row */}
        <div className="space-y-3">
          <span className="text-sm text-white/40 uppercase tracking-wider">Proposition 6 - Ultra compact</span>
          <motion.div 
            whileHover={{ background: 'rgba(0,194,255,0.08)' }}
            style={{ 
              padding: '14px 18px', 
              borderRadius: '12px', 
              background: 'rgba(255,255,255,0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00c2ff', boxShadow: '0 0 10px rgba(0,194,255,0.5)' }} />
            <span style={{ flex: 1, fontSize: '15px', fontWeight: 500, color: '#FFF' }}>Mécanique du point</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>16/03</span>
            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '13px', color: '#00c2ff' }}>Modéré</span>
            <X size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
          </motion.div>
        </div>

        {/* ========== PROPOSITION 7 ========== */}
        {/* Card avec icône catégorie */}
        <div className="space-y-3">
          <span className="text-sm text-white/40 uppercase tracking-wider">Proposition 7 - Icône physique</span>
          <motion.div 
            whileHover={{ scale: 1.02, borderColor: 'rgba(0,194,255,0.3)' }}
            style={{ 
              padding: '16px 20px', 
              borderRadius: '16px', 
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1f33 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              ⚙️
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>Mécanique du point</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                <Calendar size={12} />
                <span>16 mars 2026</span>
                <span style={{ margin: '0 4px' }}>•</span>
                <Zap size={12} style={{ color: '#00c2ff' }} />
                <span style={{ color: '#00c2ff' }}>Modéré</span>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.2)' }} />
          </motion.div>
        </div>

        {/* ========== PROPOSITION 8 ========== */}
        {/* Style iOS Widget */}
        <div className="space-y-3">
          <span className="text-sm text-white/40 uppercase tracking-wider">Proposition 8 - iOS Widget</span>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{ 
              padding: '18px', 
              borderRadius: '22px', 
              background: 'linear-gradient(145deg, #1a2530 0%, #0f1820 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#00c2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>1</span>
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Track</span>
              </div>
              <X size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>Mécanique du point</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                📅 16 mars
              </div>
              <div style={{ padding: '6px 10px', borderRadius: '8px', background: 'rgba(0,194,255,0.1)', fontSize: '12px', color: '#00c2ff' }}>
                ⚡ Modéré
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========== PROPOSITION 9 ========== */}
        {/* Timeline style */}
        <div className="space-y-3">
          <span className="text-sm text-white/40 uppercase tracking-wider">Proposition 9 - Timeline</span>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{ 
              padding: '16px 20px', 
              borderRadius: '14px', 
              background: 'rgba(255,255,255,0.03)',
              display: 'flex',
              gap: '16px',
            }}
          >
            {/* Timeline indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00c2ff', boxShadow: '0 0 12px rgba(0,194,255,0.5)' }} />
              <div style={{ width: '2px', flex: 1, background: 'linear-gradient(180deg, #00c2ff 0%, transparent 100%)' }} />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>Mécanique du point</h4>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Objectif: 16 mars 2026</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#00c2ff', background: 'rgba(0,194,255,0.1)', padding: '4px 10px', borderRadius: '20px', fontWeight: 500 }}>Modéré</span>
                  <X size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========== PROPOSITION 10 ========== */}
        {/* Gradient border */}
        <div className="space-y-3">
          <span className="text-sm text-white/40 uppercase tracking-wider">Proposition 10 - Gradient border</span>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{ 
              padding: '2px', 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, #00c2ff 0%, #0066ff 50%, #a855f7 100%)',
            }}
          >
            <div style={{ 
              padding: '16px 20px', 
              borderRadius: '14px', 
              background: '#0d1317',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(0,194,255,0.2), rgba(168,85,247,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={20} style={{ color: '#00c2ff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>Mécanique du point</h4>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  16 mars 2026 <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span> <span style={{ color: '#00c2ff' }}>Modéré</span>
                </div>
              </div>
              <X size={16} style={{ color: 'rgba(255,255,255,0.25)' }} />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
