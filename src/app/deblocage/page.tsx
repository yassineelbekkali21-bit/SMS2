'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react';

// ============================================================================
// DEMO PAGE: Options visuelles pour programmes débloqués
// ============================================================================

interface Program {
  id: string;
  name: string;
  owned: boolean;
}

const DEMO_PROGRAMS: Program[] = [
  { id: 'physics', name: 'Physics', owned: true },
  { id: 'mathematics', name: 'Mathematics', owned: false },
  { id: 'chemistry', name: 'Chemistry', owned: true },
  { id: 'biology', name: 'Biology', owned: false },
];

// ============================================================================
// OPTION A: Badge "Débloqué" (discret)
// ============================================================================
function OptionA({ program }: { program: Program }) {
  return (
    <button
      className={`group text-left bg-gray-100 hover:bg-gray-900 rounded-3xl p-10 min-h-[220px] flex flex-col justify-end transition-all duration-200 relative ${
        program.owned ? 'ring-2 ring-[#00c2ff]/30' : ''
      }`}
    >
      {program.owned && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1.5 bg-[#00c2ff]/10 text-[#00c2ff] text-xs font-semibold rounded-full border border-[#00c2ff]/30 flex items-center gap-1.5">
            <Check size={12} />
            Débloqué
          </span>
        </div>
      )}
      <div className="flex items-end justify-between">
        <span 
          className="text-3xl lg:text-4xl text-gray-900 group-hover:text-[#00c2ff] transition-colors"
          style={{ fontFamily: 'var(--font-parafina), system-ui', fontWeight: 900 }}
        >
          {program.name.toUpperCase()}
        </span>
        <ArrowRight size={28} className="text-gray-300 group-hover:text-[#00c2ff] transition-colors" />
      </div>
    </button>
  );
}

// ============================================================================
// OPTION B: Fond + badge (forte différenciation)
// ============================================================================
function OptionB({ program }: { program: Program }) {
  return (
    <button
      className={`group text-left rounded-3xl p-10 min-h-[220px] flex flex-col justify-end transition-all duration-200 relative ${
        program.owned 
          ? 'bg-gray-900 hover:bg-gray-800' 
          : 'bg-gray-100 hover:bg-gray-900'
      }`}
    >
      {program.owned && (
        <>
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1.5 bg-[#00c2ff] text-white text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Check size={12} />
              Accès à vie
            </span>
          </div>
          <div className="absolute top-4 left-4 z-10">
            <CheckCircle2 size={20} className="text-[#00c2ff]" />
          </div>
        </>
      )}
      <div className="flex items-end justify-between">
        <span 
          className={`text-3xl lg:text-4xl transition-colors ${
            program.owned 
              ? 'text-[#00c2ff] group-hover:text-[#00c2ff]' 
              : 'text-gray-900 group-hover:text-[#00c2ff]'
          }`}
          style={{ fontFamily: 'var(--font-parafina), system-ui', fontWeight: 900 }}
        >
          {program.name.toUpperCase()}
        </span>
        <ArrowRight 
          size={28} 
          className={`transition-colors ${
            program.owned 
              ? 'text-[#00c2ff]' 
              : 'text-gray-300 group-hover:text-[#00c2ff]'
          }`} 
        />
      </div>
    </button>
  );
}

// ============================================================================
// OPTION C: Fond bleu SMS (minimaliste)
// ============================================================================
function OptionC({ program }: { program: Program }) {
  return (
    <button
      className={`group text-left rounded-3xl p-10 min-h-[220px] flex flex-col justify-end transition-all duration-200 relative ${
        program.owned 
          ? 'bg-[#00c2ff] hover:bg-[#00b0e8]' 
          : 'bg-gray-100 hover:bg-gray-900'
      }`}
    >
      {program.owned && (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
            <Check size={16} className="text-white" strokeWidth={3} />
          </div>
        </div>
      )}
      <div className="flex items-end justify-between">
        <span 
          className={`text-3xl lg:text-4xl transition-colors ${
            program.owned
              ? 'text-white group-hover:text-white'
              : 'text-gray-900 group-hover:text-[#00c2ff]'
          }`}
          style={{ fontFamily: 'var(--font-parafina), system-ui', fontWeight: 900 }}
        >
          {program.name.toUpperCase()}
        </span>
        <ArrowRight 
          size={28} 
          className={`transition-colors ${
            program.owned
              ? 'text-white/80 group-hover:text-white'
              : 'text-gray-300 group-hover:text-[#00c2ff]'
          }`} 
        />
      </div>
    </button>
  );
}

// ============================================================================
// OPTION D: Overlay "Accès à vie" (premium)
// ============================================================================
function OptionD({ program }: { program: Program }) {
  return (
    <button
      className="group text-left bg-gray-100 hover:bg-gray-900 rounded-3xl p-10 min-h-[220px] flex flex-col justify-end transition-all duration-200 relative overflow-hidden"
    >
      {program.owned && (
        <>
          <div className="absolute top-4 right-4 z-10">
            <div className="w-8 h-8 rounded-full bg-[#00c2ff] flex items-center justify-center shadow-lg">
              <Check size={16} className="text-white" strokeWidth={3} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00c2ff]/20 to-transparent px-6 py-4">
            <span className="text-xs font-semibold text-[#00c2ff] uppercase tracking-wider">
              Accès à vie
            </span>
          </div>
        </>
      )}
      <div className="flex items-end justify-between relative z-10">
        <span 
          className="text-3xl lg:text-4xl text-gray-900 group-hover:text-[#00c2ff] transition-colors"
          style={{ fontFamily: 'var(--font-parafina), system-ui', fontWeight: 900 }}
        >
          {program.name.toUpperCase()}
        </span>
        <ArrowRight size={28} className="text-gray-300 group-hover:text-[#00c2ff] transition-colors" />
      </div>
    </button>
  );
}

// ============================================================================
// OPTION E: Couleur de fond inversée (contraste fort)
// ============================================================================
function OptionE({ program }: { program: Program }) {
  return (
    <button
      className={`group text-left rounded-3xl p-10 min-h-[220px] flex flex-col justify-end transition-all duration-200 relative ${
        program.owned 
          ? 'bg-[#00c2ff]/10 hover:bg-[#00c2ff]/15' 
          : 'bg-gray-100 hover:bg-gray-900'
      }`}
    >
      {program.owned && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1.5 bg-[#00c2ff] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-lg">
            <Check size={12} />
            Débloqué
          </span>
        </div>
      )}
      <div className="flex items-end justify-between">
        <span 
          className={`text-3xl lg:text-4xl transition-colors ${
            program.owned 
              ? 'text-gray-900' 
              : 'text-gray-900 group-hover:text-[#00c2ff]'
          }`}
          style={{ fontFamily: 'var(--font-parafina), system-ui', fontWeight: 900 }}
        >
          {program.name.toUpperCase()}
        </span>
        <ArrowRight 
          size={28} 
          className={`transition-colors ${
            program.owned 
              ? 'text-gray-700' 
              : 'text-gray-300 group-hover:text-[#00c2ff]'
          }`} 
        />
      </div>
    </button>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function DeblocageDemoPage() {
  const options = [
    { id: 'A', title: 'Option A: Badge "Débloqué" (discret)', component: OptionA },
    { id: 'B', title: 'Option B: Fond + badge (forte différenciation)', component: OptionB },
    { id: 'C', title: 'Option C: Icône + bordure (minimaliste)', component: OptionC },
    { id: 'D', title: 'Option D: Overlay "Accès à vie" (premium)', component: OptionD },
    { id: 'E', title: 'Option E: Couleur de fond inversée (contraste fort)', component: OptionE },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Options visuelles - Programmes débloqués</h1>
          <p className="text-sm text-gray-600 mt-1">
            Comparaison des différentes options pour différencier visuellement les programmes débloqués
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-16">
          {options.map((option) => {
            const Component = option.component;
            return (
              <div key={option.id} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#00c2ff]"></div>
                      Débloqué (2 cartes)
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      Non débloqué (2 cartes)
                    </span>
                  </div>
                </div>
                
                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {DEMO_PROGRAMS.map((program) => (
                    <Component key={program.id} program={program} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-16 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Résumé des options</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-2">Option A (Badge discret)</p>
              <p className="text-gray-600">✅ Élégant, peu intrusif, reste fidèle au style actuel</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Option B (Fond inversé)</p>
              <p className="text-gray-600">✅ Très visible, différenciation claire, moderne</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Option C (Icône + bordure)</p>
              <p className="text-gray-600">✅ Minimaliste, professionnel, SMS-style</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Option D (Overlay premium)</p>
              <p className="text-gray-600">✅ Premium, informatif, ajoute de la valeur</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Option E (Fond cyan clair)</p>
              <p className="text-gray-600">✅ Contraste fort, très visible, joue sur la couleur SMS</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
