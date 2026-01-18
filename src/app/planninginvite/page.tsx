'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X, Check, ChevronRight, Plus, Search } from 'lucide-react';

// Data
const DAYS = [
  { id: 'mon', label: 'Lundi' },
  { id: 'tue', label: 'Mardi' },
  { id: 'wed', label: 'Mercredi' },
  { id: 'thu', label: 'Jeudi' },
  { id: 'fri', label: 'Vendredi' },
  { id: 'sat', label: 'Samedi' },
  { id: 'sun', label: 'Dimanche' },
];

const TRACKS = [
  { id: '1', title: 'Mécanique du point', duration: '6h' },
  { id: '2', title: 'Analyse - Limites', duration: '4h' },
  { id: '3', title: 'Thermodynamique', duration: '5h' },
];

const RECOMMENDED = [
  { id: '4', title: 'Algèbre linéaire', duration: '7h' },
  { id: '5', title: 'Électromagnétisme', duration: '8h' },
];

const ALL_TRACKS = [
  { id: '6', title: 'Optique', duration: '4h' },
  { id: '7', title: 'Ondes', duration: '6h' },
  { id: '8', title: 'Cinématique', duration: '3h' },
];

const BUDDIES = [
  { id: '1', name: 'Marie D.' },
  { id: '2', name: 'Pierre M.' },
];

export default function PlanningInvitePage() {
  const [activeProposal, setActiveProposal] = useState(1);
  const [selectedDays, setSelectedDays] = useState(['mon', 'wed', 'fri']);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Proposal Selector */}
      <div className="flex gap-4 mb-8 justify-center">
        {[1, 2, 3].map(num => (
          <button
            key={num}
            onClick={() => setActiveProposal(num)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeProposal === num
                ? 'bg-[#00c2ff] text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Proposition {num}
          </button>
        ))}
      </div>

      {/* ==================== PROPOSITION 1 ==================== */}
      {/* Bento Grid - Modern asymmetric layout */}
      {activeProposal === 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            top: '5%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            background: 'linear-gradient(145deg, #0a0f14 0%, #0d1820 50%, #091218 100%)',
            borderRadius: '32px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(0,194,255,0.15)',
            boxShadow: '0 0 80px rgba(0,194,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Floating Header */}
          <header style={{
            padding: '20px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #00c2ff 0%, #0066ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,194,255,0.3)',
              }}>
                <Image src="/brand/onboarding-logo.svg" alt="SMS" width={36} height={36} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 500 }}>Planification</span>
                <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-parafina)', letterSpacing: '-0.5px' }}>PHYSICS</h1>
              </div>
            </div>
            <button style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '14px', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: 'rgba(255,255,255,0.6)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              <X size={18} />
            </button>
          </header>

          {/* Bento Grid Content */}
          <div style={{ flex: 1, padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
            
            {/* Top Left: Jours - Compact Calendar Style */}
            <div style={{ 
              gridRow: '1 / 2',
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '24px', 
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00c2ff' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Jours</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', flex: 1 }}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <button key={i} style={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    background: [0, 2, 4].includes(i) 
                      ? 'linear-gradient(135deg, #00c2ff 0%, #0088cc 100%)' 
                      : 'rgba(255,255,255,0.04)',
                    color: [0, 2, 4].includes(i) ? '#FFF' : 'rgba(255,255,255,0.3)',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: [0, 2, 4].includes(i) ? '0 4px 12px rgba(0,194,255,0.25)' : 'none',
                    transition: 'all 0.2s',
                  }}>{d}</button>
                ))}
              </div>
            </div>

            {/* Center: Mes Tracks - Hero Section */}
            <div style={{ 
              gridRow: '1 / 3',
              background: 'linear-gradient(180deg, rgba(0,194,255,0.08) 0%, rgba(0,194,255,0.02) 100%)', 
              borderRadius: '24px', 
              padding: '28px',
              border: '1px solid rgba(0,194,255,0.2)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0,194,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0, marginBottom: '4px' }}>Mes tracks</h3>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Tracks sélectionnés pour ton planning</span>
                </div>
                <span style={{ fontSize: '48px', fontWeight: 900, color: '#00c2ff', lineHeight: 1, fontFamily: 'var(--font-parafina)' }}>{TRACKS.length}</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
                {TRACKS.map((t, i) => (
                  <motion.div 
                    key={t.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ 
                      padding: '18px 20px', 
                      borderRadius: '16px', 
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '17px', fontWeight: 600, color: '#FFF' }}>{t.title}</span>
                      <button style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,100,100,0.1)', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={14} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="date" defaultValue="2026-03-15" style={{ flex: 1, padding: '10px 14px', fontSize: '13px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }} />
                      <select style={{ padding: '10px 14px', fontSize: '13px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}>
                        <option>Modéré</option>
                        <option>Tranquille</option>
                        <option>Intense</option>
                      </select>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top Right: Recommandés */}
            <div style={{ 
              gridRow: '1 / 2',
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '24px', 
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Recommandés</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                {RECOMMENDED.map(t => (
                  <div key={t.id} style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFF' }}>{t.title}</span>
                    <button style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #a855f7, #7c3aed)', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(168,85,247,0.3)' }}>
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Left: Buddy */}
            <div style={{ 
              gridRow: '2 / 3',
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '24px', 
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Buddy</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {BUDDIES.map(b => (
                  <div key={b.id} style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '14px' }}>{b.name[0]}</div>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFF' }}>{b.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Right: Tous les tracks */}
            <div style={{ 
              gridRow: '2 / 3',
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '24px', 
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tous</span>
                </div>
                <Search size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                {ALL_TRACKS.map(t => (
                  <div key={t.id} style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{t.title}</span>
                    <button style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Footer */}
          <footer style={{ 
            padding: '20px 32px', 
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00c2ff' }} />
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}><strong style={{ color: '#FFF' }}>3</strong> tracks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}><strong style={{ color: '#FFF' }}>3</strong> jours/sem</span>
              </div>
            </div>
            <button style={{ 
              padding: '14px 32px', 
              background: 'linear-gradient(135deg, #00c2ff 0%, #0088cc 100%)', 
              color: '#FFF', 
              border: 'none', 
              borderRadius: '16px', 
              fontWeight: 700, 
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,194,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              Créer mon planning
              <ChevronRight size={18} />
            </button>
          </footer>
        </motion.div>
      )}

      {/* ==================== PROPOSITION 2 ==================== */}
      {/* Kanban-inspired with drag zones + glassmorphism */}
      {activeProposal === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            top: '5%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            background: '#0d1317',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Gradient background effects */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,194,255,0.08) 0%, transparent 60%)', filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)', filter: 'blur(60px)' }} />
          </div>

          {/* Header - Style OnboardingPopup */}
          <header style={{
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 10,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(13,19,23,0.95)',
            backdropFilter: 'blur(10px)',
          }}>
            <Image src="/brand/onboarding-logo.svg" alt="SMS" width={70} height={70} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.85)', margin: 0 }}>Planification</span>
              <span style={{ fontSize: '32px', color: 'rgba(255,255,255,0.5)', fontWeight: 900, lineHeight: 1 }}>•</span>
              <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-parafina), system-ui', textTransform: 'uppercase' }}>PHYSICS</h1>
            </div>

            <button style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              color: 'rgba(255,255,255,0.5)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              <X size={20} />
            </button>
          </header>

          {/* Main Content - Horizontal Flow */}
          <div style={{ flex: 1, padding: '0 40px 24px', display: 'flex', gap: '20px', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
            
            {/* Panel 1: Setup - Sidebar */}
            <div style={{ 
              width: '280px',
              flexShrink: 0,
              borderRight: '1px solid rgba(255,255,255,0.05)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Jours d'étude - 1 colonne */}
              <h3 style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>Jours d'étude</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {DAYS.map((day) => {
                  const isSelected = selectedDays.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      onClick={() => setSelectedDays(prev => prev.includes(day.id) ? prev.filter(d => d !== day.id) : [...prev, day.id])}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        fontSize: '18px',
                        fontFamily: 'var(--font-parafina), system-ui',
                        fontWeight: 900,
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#00c2ff' : 'rgba(255,255,255,0.05)',
                        color: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                        transition: 'all 0.2s',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                      }}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel 2: Designed for you */}
            <div style={{ 
              flex: 1,
              background: 'linear-gradient(180deg, rgba(0,194,255,0.05) 0%, rgba(0,194,255,0.01) 100%)', 
              borderRadius: '20px', 
              padding: '24px',
              border: '1px solid rgba(0,194,255,0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              margin: '0 8px',
            }}>
              <h3 style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px' }}>Conçus pour toi</h3>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '8px' }}>
                {TRACKS.map((t, i) => (
                  <motion.div 
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                    style={{ 
                      padding: '16px 20px', 
                      borderRadius: '14px', 
                      background: 'rgba(255,255,255,0.03)',
                      display: 'flex',
                      gap: '16px',
                    }}
                  >
                    {/* Timeline indicator */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', paddingTop: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00c2ff', boxShadow: '0 0 12px rgba(0,194,255,0.5)' }} />
                      <div style={{ width: '2px', flex: 1, background: 'linear-gradient(180deg, #00c2ff 0%, transparent 100%)', minHeight: '40px' }} />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      {/* Header row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontSize: '17px', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>{t.title}</h4>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>{t.duration}</span>
                        </div>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                          <X size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                        </button>
                      </div>
                      
                      {/* Editable fields */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginBottom: '4px', display: 'block' }}>Date objectif</label>
                          <input 
                            type="date" 
                            defaultValue="2026-03-16" 
                            style={{ 
                              width: '100%',
                              padding: '8px 12px', 
                              fontSize: '13px', 
                              background: 'rgba(0,0,0,0.3)', 
                              border: '1px solid rgba(255,255,255,0.1)', 
                              borderRadius: '8px', 
                              color: '#FFF',
                              cursor: 'pointer',
                            }} 
                          />
                        </div>
                        <div style={{ width: '120px' }}>
                          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginBottom: '4px', display: 'block' }}>Intensité</label>
                          <select 
                            defaultValue="moderate"
                            style={{ 
                              width: '100%',
                              padding: '8px 12px', 
                              fontSize: '13px', 
                              background: 'rgba(0,194,255,0.1)', 
                              border: '1px solid rgba(0,194,255,0.3)', 
                              borderRadius: '8px', 
                              color: '#00c2ff',
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}
                          >
                            <option value="light">Tranquille</option>
                            <option value="moderate">Modéré</option>
                            <option value="intense">Intense</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Panel 3: Recommandés */}
            <div style={{ 
              flex: 0.8,
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '20px', 
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              marginRight: '8px',
            }}>
              <h3 style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px' }}>Recommandés</h3>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                {RECOMMENDED.map(t => (
                  <div key={t.id} style={{ 
                    padding: '14px 16px', 
                    borderRadius: '14px', 
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}>
                    <div>
                      <span style={{ fontSize: '17px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '2px' }}>{t.title}</span>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>{t.duration}</span>
                    </div>
                    <button style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '10px', 
                      background: '#00c2ff', 
                      border: 'none', 
                      color: '#FFF', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Plus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 4: Tous les tracks */}
            <div style={{ 
              flex: 0.8,
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '20px', 
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <h3 style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>Tous les sujets</h3>

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input 
                  placeholder="Rechercher..." 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px 12px 42px', 
                    fontSize: '14px', 
                    background: 'rgba(255,255,255,0.04)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: '12px', 
                    color: '#FFF',
                  }} 
                />
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                {ALL_TRACKS.map(t => (
                  <div key={t.id} style={{ 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.04)',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', display: 'block' }}>{t.title}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>{t.duration}</span>
                    </div>
                    <button style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      background: 'rgba(255,255,255,0.08)', 
                      border: 'none', 
                      color: 'rgba(255,255,255,0.5)', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer - Clean */}
          <footer style={{ 
            padding: '20px 40px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '28px', fontWeight: 900, color: '#00c2ff', fontFamily: 'var(--font-parafina)' }}>3</span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>tracks</span>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '28px', fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-parafina)' }}>3</span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>jours/semaine</span>
              </div>
            </div>
            <button style={{ 
              padding: '16px 32px', 
              background: '#00c2ff', 
              color: '#FFF', 
              border: 'none', 
              borderRadius: '9999px', 
              fontWeight: 600, 
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}>
              Générer mon planning
              <ChevronRight size={18} />
            </button>
          </footer>
        </motion.div>
      )}

      {/* ==================== PROPOSITION 3 ==================== */}
      {/* Card-based compact layout */}
      {activeProposal === 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: '5%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            backgroundColor: '#0d1317',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header compact */}
          <header style={{
            padding: '20px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Image src="/brand/onboarding-logo.svg" alt="SMS" width={50} height={50} />
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Planification</p>
                <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-parafina)' }}>PHYSICS</h1>
              </div>
            </div>
            <button style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
          </header>

          {/* Content - Horizontal scroll cards */}
          <div style={{ flex: 1, padding: '24px 32px', display: 'flex', gap: '24px', overflow: 'hidden' }}>
            
            {/* Card 1: Configuration */}
            <div style={{ 
              width: '260px', 
              flexShrink: 0,
              backgroundColor: 'rgba(255,255,255,0.03)', 
              borderRadius: '20px', 
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#00c2ff', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Configuration</h3>
              
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>Jours d'étude</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <button key={i} style={{
                    width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    backgroundColor: [0, 2, 4].includes(i) ? '#00c2ff' : 'rgba(255,255,255,0.08)',
                    color: [0, 2, 4].includes(i) ? '#FFF' : 'rgba(255,255,255,0.4)',
                    fontWeight: 600, fontSize: '13px',
                  }}>{d}</button>
                ))}
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>Buddy motivation</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BUDDIES.map(b => (
                  <div key={b.id} style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFF', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '12px', fontWeight: 600 }}>{b.name[0]}</div>
                    {b.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Mes tracks */}
            <div style={{ 
              flex: 1,
              minWidth: '300px',
              backgroundColor: 'rgba(0,194,255,0.05)', 
              borderRadius: '20px', 
              padding: '24px',
              border: '1px solid rgba(0,194,255,0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#00c2ff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Mes tracks</h3>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#00c2ff' }}>{TRACKS.length}</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TRACKS.map(t => (
                  <div key={t.id} style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>{t.title}</span>
                      <X size={16} style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="date" defaultValue="2026-03-15" style={{ flex: 1, padding: '8px 12px', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF' }} />
                      <select style={{ padding: '8px 12px', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF' }}>
                        <option>Modéré</option>
                        <option>Tranquille</option>
                        <option>Intense</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Ajouter des tracks */}
            <div style={{ 
              width: '320px',
              flexShrink: 0,
              backgroundColor: 'rgba(255,255,255,0.03)', 
              borderRadius: '20px', 
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Ajouter des tracks</h3>
              
              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input placeholder="Rechercher..." style={{ width: '100%', padding: '10px 12px 10px 36px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }} />
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button style={{ flex: 1, padding: '8px', borderRadius: '8px', backgroundColor: '#00c2ff', color: '#FFF', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Recommandés</button>
                <button style={{ flex: 1, padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: 'none', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Tous</button>
              </div>

              {/* List */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...RECOMMENDED, ...ALL_TRACKS].map(t => (
                  <div key={t.id} style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '14px', color: '#FFF', display: 'block' }}>{t.title}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{t.duration}</span>
                    </div>
                    <button style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(0,194,255,0.2)', color: '#00c2ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer style={{ padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block' }}>Tracks sélectionnés</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#00c2ff' }}>3</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block' }}>Jours/semaine</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#FFF' }}>3</span>
              </div>
            </div>
            <button style={{ padding: '14px 32px', backgroundColor: '#00c2ff', color: '#FFF', border: 'none', borderRadius: '999px', fontWeight: 600, fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Créer mon planning
              <ChevronRight size={18} />
            </button>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
