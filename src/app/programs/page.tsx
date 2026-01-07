'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronRight,
  Sparkles,
  Clock,
  Infinity,
  Shield,
  ArrowRight,
  Play,
  BookOpen,
  Users,
  Trophy,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================
interface MasteryProgram {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  chaptersCount: number;
  tracksCount: number;
  studentsCount: string;
  color: string;
  gradient: string;
  features: string[];
  owned?: boolean;
}

// ============================================================================
// DATA - Mastery Programs
// ============================================================================
const MASTERY_PROGRAMS: MasteryProgram[] = [
  {
    id: 'physics',
    name: 'Physics Mastery',
    tagline: 'Maîtrise les lois de l\'univers',
    description: 'De la mécanique newtonienne à la physique quantique. Comprends enfin comment le monde fonctionne.',
    price: 599,
    originalPrice: 999,
    chaptersCount: 47,
    tracksCount: 12,
    studentsCount: '2,400+',
    color: '#3b82f6',
    gradient: 'from-blue-600 to-indigo-700',
    features: [
      'Mécanique & Dynamique',
      'Électromagnétisme',
      'Thermodynamique',
      'Ondes & Optique'
    ],
    owned: false,
  },
  {
    id: 'mathematics',
    name: 'Mathematics Mastery',
    tagline: 'Le langage de la science',
    description: 'Algèbre, analyse, probabilités. Développe une intuition mathématique solide.',
    price: 659,
    originalPrice: 1099,
    chaptersCount: 63,
    tracksCount: 15,
    studentsCount: '3,100+',
    color: '#10b981',
    gradient: 'from-emerald-600 to-teal-700',
    features: [
      'Algèbre linéaire',
      'Calcul différentiel & intégral',
      'Probabilités & Statistiques',
      'Équations différentielles'
    ],
    owned: true, // Example: user already owns this
  },
  {
    id: 'chemistry',
    name: 'Chemistry Mastery',
    tagline: 'La science de la matière',
    description: 'Structure atomique, réactions, chimie organique. Comprends la chimie en profondeur.',
    price: 479,
    originalPrice: 799,
    chaptersCount: 52,
    tracksCount: 10,
    studentsCount: '1,800+',
    color: '#f43f5e',
    gradient: 'from-rose-600 to-pink-700',
    features: [
      'Structure atomique',
      'Réactions chimiques',
      'Chimie organique',
      'Thermochimie'
    ],
    owned: false,
  },
  {
    id: 'biology',
    name: 'Biology Mastery',
    tagline: 'Comprends le vivant',
    description: 'Cellules, génétique, évolution. Explore les mécanismes de la vie.',
    price: 479,
    originalPrice: 799,
    chaptersCount: 45,
    tracksCount: 9,
    studentsCount: '1,500+',
    color: '#8b5cf6',
    gradient: 'from-violet-600 to-purple-700',
    features: [
      'Biologie cellulaire',
      'Génétique & ADN',
      'Évolution',
      'Physiologie'
    ],
    owned: false,
  },
  {
    id: 'economics',
    name: 'Economics Mastery',
    tagline: 'Décode l\'économie',
    description: 'Micro, macro, finance. Comprends les mécanismes économiques modernes.',
    price: 359,
    originalPrice: 599,
    chaptersCount: 38,
    tracksCount: 8,
    studentsCount: '1,200+',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    features: [
      'Microéconomie',
      'Macroéconomie',
      'Finance',
      'Économétrie'
    ],
    owned: false,
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

// Program Card Component
function ProgramCard({ 
  program, 
  isSelected,
  onToggleSelect,
  onViewDetails
}: { 
  program: MasteryProgram;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewDetails: () => void;
}) {
  const discount = Math.round((1 - program.price / program.originalPrice) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-[#1a1f24] rounded-2xl border transition-all duration-300 overflow-hidden group ${
        program.owned 
          ? 'border-[#00c2ff]/50' 
          : isSelected 
            ? 'border-[#00c2ff] ring-2 ring-[#00c2ff]/30' 
            : 'border-gray-700/50 hover:border-gray-600'
      }`}
    >
      {/* Owned Badge */}
      {program.owned && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-[#00c2ff]/20 text-[#00c2ff] text-xs font-semibold rounded-full border border-[#00c2ff]/30 flex items-center gap-1.5">
            <Check size={12} />
            Débloqué
          </span>
        </div>
      )}

      {/* Discount Badge */}
      {!program.owned && discount > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2 py-1 bg-white/10 text-white text-xs font-bold rounded-full">
            -{discount}%
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">
        {/* Program Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${program.gradient} flex items-center justify-center flex-shrink-0`}>
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-1">{program.name}</h3>
            <p className="text-sm text-white/60">{program.tagline}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-4 text-sm text-white/50">
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} />
            {program.chaptersCount} chapitres
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {program.studentsCount}
          </span>
        </div>

        {/* Features Preview */}
        <div className="space-y-2 mb-6">
          {program.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1 h-1 rounded-full bg-[#00c2ff]" />
              {feature}
            </div>
          ))}
          {program.features.length > 3 && (
            <div className="text-sm text-white/40">
              +{program.features.length - 3} autres modules
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="pt-4 border-t border-gray-700/50">
          {program.owned ? (
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Accès à vie activé</span>
              <button 
                onClick={onViewDetails}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors flex items-center gap-2"
              >
                Ouvrir
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{program.price}€</span>
                  <span className="text-sm text-white/40 line-through">{program.originalPrice}€</span>
                </div>
                <span className="text-xs text-white/50">Paiement unique • Accès à vie</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Selection Checkbox */}
                <button
                  onClick={onToggleSelect}
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-[#00c2ff] border-[#00c2ff]' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {isSelected && <Check size={16} className="text-white" />}
                </button>
                <button 
                  onClick={onViewDetails}
                  className="px-4 py-2 bg-[#00c2ff] hover:bg-[#00b0e8] text-white text-sm font-semibold rounded-full transition-colors"
                >
                  Débloquer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Program Detail Modal
function ProgramDetailModal({ 
  program, 
  isOpen, 
  onClose,
  onUnlock 
}: { 
  program: MasteryProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}) {
  if (!program) return null;
  
  const discount = Math.round((1 - program.price / program.originalPrice) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#0d1317] rounded-3xl border border-gray-700/50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header with gradient */}
            <div className={`relative p-8 bg-gradient-to-br ${program.gradient}`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{program.name}</h2>
                  <p className="text-white/80">{program.tagline}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Description */}
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                {program.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{program.chaptersCount}</div>
                  <div className="text-sm text-white/50">Chapitres</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{program.tracksCount}</div>
                  <div className="text-sm text-white/50">Parcours</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{program.studentsCount}</div>
                  <div className="text-sm text-white/50">Étudiants</div>
                </div>
              </div>

              {/* What you unlock */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-[#00c2ff]" />
                  Ce que tu débloques
                </h3>
                <div className="space-y-3">
                  {program.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-white/80">
                      <div className="w-6 h-6 rounded-full bg-[#00c2ff]/20 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-[#00c2ff]" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Play size={18} className="text-[#00c2ff]" />
                  Comment ça fonctionne
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: BookOpen, text: 'Parcours adaptatifs illimités' },
                    { icon: Clock, text: 'Apprends à ton rythme' },
                    { icon: Trophy, text: 'Quizzes & Training Club' },
                    { icon: Users, text: 'Study Rooms communautaires' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-white/70 text-sm">
                      <item.icon size={16} className="text-white/50" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-white/5 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Infinity size={16} />
                    <span>Accès à vie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span>14 jours satisfait ou remboursé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>Mises à jour gratuites</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              {program.owned ? (
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                  Ouvrir le programme
                  <ArrowRight size={18} />
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-white">{program.price}€</span>
                      <span className="text-lg text-white/40 line-through">{program.originalPrice}€</span>
                      <span className="px-2 py-0.5 bg-[#00c2ff]/20 text-[#00c2ff] text-xs font-bold rounded">
                        -{discount}%
                      </span>
                    </div>
                    <span className="text-sm text-white/50">Paiement unique • Accès à vie</span>
                  </div>
                  <button 
                    onClick={onUnlock}
                    className="px-8 py-4 bg-[#00c2ff] hover:bg-[#00b0e8] text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    Débloquer maintenant
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Selection Summary Bar
function SelectionSummary({ 
  selectedPrograms, 
  programs,
  onClearSelection,
  onCheckout 
}: { 
  selectedPrograms: string[];
  programs: MasteryProgram[];
  onClearSelection: () => void;
  onCheckout: () => void;
}) {
  const selectedProgramsData = programs.filter(p => selectedPrograms.includes(p.id) && !p.owned);
  const total = selectedProgramsData.reduce((sum, p) => sum + p.price, 0);
  const originalTotal = selectedProgramsData.reduce((sum, p) => sum + p.originalPrice, 0);
  
  if (selectedPrograms.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1317]/95 backdrop-blur-xl border-t border-gray-700/50 p-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClearSelection}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
          <div>
            <div className="text-sm text-white/60">
              {selectedProgramsData.length} programme{selectedProgramsData.length > 1 ? 's' : ''} sélectionné{selectedProgramsData.length > 1 ? 's' : ''}
            </div>
            <div className="text-white font-medium">
              {selectedProgramsData.map(p => p.name).join(' + ')}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{total}€</span>
              {originalTotal > total && (
                <span className="text-sm text-white/40 line-through">{originalTotal}€</span>
              )}
            </div>
            <span className="text-xs text-white/50">Paiement unique</span>
          </div>
          <button
            onClick={onCheckout}
            className="px-6 py-3 bg-[#00c2ff] hover:bg-[#00b0e8] text-white font-semibold rounded-full transition-colors flex items-center gap-2"
          >
            Continuer
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function ProgramsPage() {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [detailProgram, setDetailProgram] = useState<MasteryProgram | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const toggleProgramSelection = (programId: string) => {
    const program = MASTERY_PROGRAMS.find(p => p.id === programId);
    if (program?.owned) return; // Can't select owned programs
    
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const openProgramDetail = (program: MasteryProgram) => {
    setDetailProgram(program);
    setIsDetailOpen(true);
  };

  const handleCheckout = () => {
    // Navigate to payment with selected programs
    const params = new URLSearchParams();
    params.set('programs', selectedPrograms.join(','));
    window.location.href = `/payment?${params.toString()}`;
  };

  const handleUnlockSingle = (programId: string) => {
    window.location.href = `/payment?programs=${programId}`;
  };

  // Stats
  const ownedCount = MASTERY_PROGRAMS.filter(p => p.owned).length;
  const availableCount = MASTERY_PROGRAMS.filter(p => !p.owned).length;

  return (
    <div className="min-h-screen bg-[#0d1317]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0d1317]/95 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/brand/onboarding-logo.svg" 
                alt="SMS" 
                width={48} 
                height={48}
                className="w-12 h-12"
              />
            </Link>
            
            {/* Back to Dashboard */}
            <Link 
              href="/"
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              ← Retour au dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 pb-32">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-parafina)' }}>
            MASTERY PROGRAMS
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-6">
            Débloque un accès à vie. Génère autant de parcours que nécessaire.
          </p>
          
          {/* Value Props */}
          <div className="flex items-center justify-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <Infinity size={16} className="text-[#00c2ff]" />
              <span>Accès à vie</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#00c2ff]" />
              <span>14 jours satisfait ou remboursé</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#00c2ff]" />
              <span>Mises à jour gratuites à vie</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        {ownedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-4 bg-[#00c2ff]/10 rounded-xl border border-[#00c2ff]/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00c2ff]/20 flex items-center justify-center">
                  <Check size={20} className="text-[#00c2ff]" />
                </div>
                <div>
                  <div className="text-white font-medium">
                    {ownedCount} programme{ownedCount > 1 ? 's' : ''} débloqué{ownedCount > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-white/60">
                    {availableCount} programme{availableCount > 1 ? 's' : ''} disponible{availableCount > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <Link 
                href="/"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors"
              >
                Voir mes programmes
              </Link>
            </div>
          </motion.div>
        )}

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MASTERY_PROGRAMS.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProgramCard
                program={program}
                isSelected={selectedPrograms.includes(program.id)}
                onToggleSelect={() => toggleProgramSelection(program.id)}
                onViewDetails={() => openProgramDetail(program)}
              />
            </motion.div>
          ))}
        </div>

        {/* Secure Checkout Reassurance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center text-sm text-white/40"
        >
          <div className="flex items-center justify-center gap-2">
            <Shield size={14} />
            <span>Paiement sécurisé • Accès instantané après achat</span>
          </div>
        </motion.div>
      </main>

      {/* Selection Summary Bar */}
      <AnimatePresence>
        <SelectionSummary
          selectedPrograms={selectedPrograms}
          programs={MASTERY_PROGRAMS}
          onClearSelection={() => setSelectedPrograms([])}
          onCheckout={handleCheckout}
        />
      </AnimatePresence>

      {/* Program Detail Modal */}
      <ProgramDetailModal
        program={detailProgram}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUnlock={() => {
          if (detailProgram) {
            handleUnlockSingle(detailProgram.id);
          }
        }}
      />
    </div>
  );
}

