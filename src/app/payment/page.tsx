'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Shield, 
  Star, 
  Clock, 
  Lock,
  Gift,
  ArrowRight,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';

// ============================================================================
// TYPES
// ============================================================================
interface Program {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  recommended?: boolean;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
  program: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ============================================================================
// DATA
// ============================================================================
const PROGRAMS: Program[] = [
  {
    id: 'physics',
    name: 'Physics Mastery',
    originalPrice: 999,
    discountedPrice: 599,
    recommended: true,
  },
  {
    id: 'math',
    name: 'Mathematics Mastery',
    originalPrice: 1099,
    discountedPrice: 659,
    recommended: true,
  },
  {
    id: 'chemistry',
    name: 'Chemistry Mastery',
    originalPrice: 799,
    discountedPrice: 479,
    recommended: true,
  },
  {
    id: 'biology',
    name: 'Biology Mastery',
    originalPrice: 799,
    discountedPrice: 479,
  },
  {
    id: 'economics',
    name: 'Economics Mastery',
    originalPrice: 599,
    discountedPrice: 359,
  },
];

const BOOSTER_PACK = {
  name: 'Pack Complet (4 Boosters)',
  description: 'Planification · Study Rooms · Suivi Apprentissage · Examen blanc',
  originalPrice: 60,
  discountedPrice: 45,
  discount: 25,
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Mensah',
    role: 'Étudiante en Médecine',
    text: 'J\'ai validé ma PASS du premier coup grâce à SMS. Les cours de physique et chimie sont incroyablement bien structurés.',
    avatar: '👩‍⚕️',
    rating: 5,
    program: 'Physics + Chemistry',
  },
  {
    name: 'Thomas Lefebvre',
    role: 'Prépa MPSI',
    text: 'Le Training Club m\'a fait gagner un temps fou. Je fais mes quiz dans le métro et je vois ma progression chaque semaine.',
    avatar: '👨‍🎓',
    rating: 5,
    program: 'Mathematics',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Terminale S',
    text: 'De 8 à 16 en physique en 3 mois. Les Study Rooms m\'ont vraiment aidée à rester motivée.',
    avatar: '👩‍🔬',
    rating: 5,
    program: 'Physics',
  },
  {
    name: 'Karim Benali',
    role: 'L2 Économie',
    text: 'Enfin des cours qui expliquent clairement ! J\'aurais aimé découvrir SMS plus tôt.',
    avatar: '👨‍💼',
    rating: 5,
    program: 'Economics',
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'L\'accès est-il vraiment à vie ?',
    answer: 'Oui, une fois que vous achetez un programme, vous y avez accès pour toujours. Cela inclut toutes les mises à jour futures du contenu.',
  },
  {
    question: 'Puis-je annuler les boosters à tout moment ?',
    answer: 'Absolument. Le pack boosters est un abonnement mensuel sans engagement. Vous pouvez l\'annuler en un clic depuis votre espace personnel.',
  },
  {
    question: 'Comment fonctionne la garantie satisfait ou remboursé ?',
    answer: 'Vous avez 30 jours pour tester nos cours. Si vous n\'êtes pas satisfait, nous vous remboursons intégralement, sans questions.',
  },
  {
    question: 'Les programmes sont-ils adaptés à mon niveau ?',
    answer: 'Nos programmes couvrent tous les niveaux, du lycée aux études supérieures. Le diagnostic initial permet d\'adapter le contenu à votre niveau.',
  },
  {
    question: 'Puis-je accéder aux cours sur mobile ?',
    answer: 'Oui, notre plateforme est 100% responsive. Vous pouvez apprendre sur ordinateur, tablette ou smartphone.',
  },
];

const BENEFITS = [
  'Tu paies une fois, tu accèdes pour toujours.',
  '15+ cours vidéo, enseignés par des experts',
  'Mises à jour gratuites incluses à vie',
  '14 jours satisfait ou remboursé',
  'Accessible partout : ordinateur, tablette, mobile',
];

// ============================================================================
// COMPONENTS
// ============================================================================

// Countdown Timer
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono font-bold text-white">
      <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
      <span>:</span>
      <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
      <span>:</span>
      <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
}

// Program Card - Clean style matching screenshot
function ProgramCard({ 
  program, 
  selected, 
  onToggle 
}: { 
  program: Program; 
  selected: boolean; 
  onToggle: () => void;
}) {
  const discount = Math.round((1 - program.discountedPrice / program.originalPrice) * 100);
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`relative px-5 py-4 rounded-xl cursor-pointer transition-all border-2 ${
        selected
          ? 'bg-[#00c2ff]/10 border-[#00c2ff]'
          : 'bg-transparent border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Left: Checkbox + Name */}
        <div className="flex items-center gap-4">
          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
            selected 
              ? 'bg-[#00c2ff] border-[#00c2ff]' 
              : 'border-white/30 bg-transparent'
          }`}>
            {selected && <Check size={16} className="text-white" strokeWidth={3} />}
          </div>
          <span className="font-semibold text-white" style={{ fontSize: '19px' }}>{program.name}</span>
        </div>
        
        {/* Right: Prices + Badge */}
        <div className="flex items-center gap-3">
          <span className="text-white/40 line-through text-sm">${program.originalPrice}</span>
          <span className="text-xl font-bold text-white">${program.discountedPrice}</span>
          <span className="px-2.5 py-1 bg-[#00c2ff] text-white text-xs font-bold rounded-md">
            -{discount}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Booster Pack Card - All or nothing
function BoosterPackCard({ 
  selected, 
  onToggle 
}: { 
  selected: boolean; 
  onToggle: () => void;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`relative px-5 py-4 rounded-xl cursor-pointer transition-all border-2 ${
        selected
          ? 'bg-[#00c2ff]/10 border-[#00c2ff]'
          : 'bg-transparent border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Left: Checkbox + Name + Description */}
        <div className="flex items-center gap-4">
          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
            selected 
              ? 'bg-[#00c2ff] border-[#00c2ff]' 
              : 'border-white/30 bg-transparent'
          }`}>
            {selected && <Check size={16} className="text-white" strokeWidth={3} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white" style={{ fontSize: '19px' }}>{BOOSTER_PACK.name}</span>
              <span className="px-2 py-0.5 bg-[#00c2ff] text-white text-xs font-bold rounded-md">
                -{BOOSTER_PACK.discount}%
              </span>
            </div>
            <p className="text-sm !text-white/90 mt-0.5">{BOOSTER_PACK.description}</p>
          </div>
        </div>
        
        {/* Right: Prices */}
        <div className="flex items-center gap-2">
          <span className="text-white/40 line-through text-sm">${BOOSTER_PACK.originalPrice}</span>
          <span className="text-xl font-bold text-white">${BOOSTER_PACK.discountedPrice}</span>
          <span className="text-white/50 text-sm">/mois</span>
        </div>
      </div>
    </motion.div>
  );
}

// Testimonial Card
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="p-5 bg-[#0d1318] rounded-2xl border border-white/10 min-w-[300px]">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00c2ff]/20 to-blue-500/20 flex items-center justify-center text-2xl">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-semibold text-white">{testimonial.name}</div>
          <div className="text-sm text-white/50">{testimonial.role}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      
      <p className="text-white/70 text-sm mb-3">"{testimonial.text}"</p>
      
      <div className="text-xs text-[#00c2ff]">{testimonial.program}</div>
    </div>
  );
}

// FAQ Item
function FAQItemComponent({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-white pr-4">{item.question}</span>
        <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={18} className="text-white/60" />
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-white/60 text-sm">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function PaymentPage() {
  // Pre-select recommended programs
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(
    PROGRAMS.filter(p => p.recommended).map(p => p.id)
  );
  const [boosterSelected, setBoosterSelected] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleProgram = (id: string) => {
    setSelectedPrograms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Calculate totals
  const programsTotal = PROGRAMS
    .filter(p => selectedPrograms.includes(p.id))
    .reduce((sum, p) => sum + p.discountedPrice, 0);
  
  const programsOriginalTotal = PROGRAMS
    .filter(p => selectedPrograms.includes(p.id))
    .reduce((sum, p) => sum + p.originalPrice, 0);

  const boosterMonthly = boosterSelected ? BOOSTER_PACK.discountedPrice : 0;
  const totalSavings = programsOriginalTotal - programsTotal;

  return (
    <div className="min-h-screen bg-[#0a0c10]">
      {/* Urgency Banner */}
      <div className="bg-[#00c2ff] py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-white">
          <div className="flex items-center gap-2">
            <Gift size={18} />
            <span className="font-medium">Offre Spéciale -40%</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} />
            <span className="text-sm">Expire dans</span>
            <CountdownTimer />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="py-6 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Image src="/brand/sms-logo.svg" alt="SMS" width={120} height={40} className="h-10 w-auto brightness-0 invert" />
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Lock size={14} />
            Paiement sécurisé
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Mobile Layout - uses flex with order */}
        <div className="flex flex-col lg:hidden gap-10">
          {/* 1. Benefits - "Paiement unique. Accès à vie." */}
          <section className="order-1">
            <h3 className="font-bold !text-white mb-6" style={{ fontSize: '26px' }}>Paiement unique. Accès à vie.</h3>
            <div className="space-y-4">
              {BENEFITS.map((benefit, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Check size={20} className="text-blue-400 flex-shrink-0" />
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Programs Section - "Choisis tes programmes" */}
          <section className="order-2">
            <h2 className="text-3xl font-bold !text-white mb-6">Choisis tes programmes</h2>
            <div className="space-y-3">
              {PROGRAMS.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  selected={selectedPrograms.includes(program.id)}
                  onToggle={() => toggleProgram(program.id)}
                />
              ))}
            </div>
          </section>

          {/* 3. Boosters Section */}
          <section className="order-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold !text-white">Boosters</h2>
              <span className="text-sm text-white/50">Optionnel</span>
            </div>
            <BoosterPackCard
              selected={boosterSelected}
              onToggle={() => setBoosterSelected(!boosterSelected)}
            />
          </section>

          {/* 4. Testimonials - "Ils ont réussi avec SMS" */}
          <section className="order-4">
            <h3 className="text-lg font-semibold !text-white mb-4">Ils ont réussi avec SMS</h3>
            <div className="space-y-3">
              {TESTIMONIALS.slice(0, 2).map((testimonial, i) => (
                <div key={i} className="p-4 bg-[#12161a] rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                      <div className="text-xs text-white/50">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="!text-white/90 text-sm mb-2">"{testimonial.text}"</p>
                  <div className="text-xs text-[#00c2ff]">{testimonial.program}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Récapitulatif (Summary) */}
          <section className="order-5">
            <div className="bg-[#12161a] rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <h3 className="text-xl font-bold !text-white">Récapitulatif</h3>
              </div>
              <div className="p-5 space-y-3 border-b border-white/10">
                {selectedPrograms.length === 0 ? (
                  <p className="text-white/40 text-sm text-center py-4">
                    Sélectionne au moins un programme
                  </p>
                ) : (
                  <>
                    {PROGRAMS.filter(p => selectedPrograms.includes(p.id)).map((program) => (
                      <div key={program.id} className="flex items-center justify-between">
                        <span className="text-white" style={{ fontSize: '13px' }}>{program.name}</span>
                        <span className="text-white font-medium" style={{ fontSize: '16px' }}>${program.discountedPrice}</span>
                      </div>
                    ))}
                    {boosterSelected && (
                      <div className="pt-3 mt-3 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Pack Boosters</span>
                          <span className="text-white/70">${BOOSTER_PACK.discountedPrice}/mois</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="p-5 space-y-3 border-b border-white/10">
                {totalSavings > 0 && (
                  <div className="flex items-center justify-between text-sm text-green-400">
                    <span>Économies</span>
                    <span>-${totalSavings}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Total aujourd'hui</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">${programsTotal}</span>
                      {boosterMonthly > 0 && (
                        <p className="text-xs text-white/50">+ ${boosterMonthly}/mois</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProcessing(true)}
                  disabled={selectedPrograms.length === 0 || isProcessing}
                  className={`w-full py-4 font-bold text-lg rounded-full flex items-center justify-center gap-2 transition-all ${
                    selectedPrograms.length === 0
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-[#00c2ff] text-white hover:bg-[#00d4ff]'
                  }`}
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Continuer
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-4 text-xs text-white/40">
                    <span>Stripe</span>
                    <span>•</span>
                    <span>PayPal</span>
                    <span>•</span>
                    <span>Apple Pay</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. FAQ - "Questions fréquentes" */}
          <section className="order-6">
            <h3 className="font-semibold !text-white mb-4" style={{ fontSize: '26px' }}>Questions fréquentes</h3>
            <div className="bg-[#0d1318] rounded-2xl border border-white/5 p-4">
              {FAQ_ITEMS.map((item, i) => (
                <FAQItemComponent
                  key={i}
                  item={item}
                  isOpen={openFAQ === i}
                  onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Desktop Layout - grid with 2 columns */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-10">
          {/* Left Column: Programs & Boosters */}
          <div className="lg:col-span-2 space-y-10">
            {/* Programs Section */}
            <section>
              <h2 className="text-3xl font-bold !text-white mb-6">Choisis tes programmes</h2>
              
              <div className="space-y-3">
                {PROGRAMS.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    selected={selectedPrograms.includes(program.id)}
                    onToggle={() => toggleProgram(program.id)}
                  />
                ))}
              </div>
            </section>

            {/* Boosters Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold !text-white">Boosters</h2>
                <span className="text-sm text-white/50">Optionnel</span>
              </div>
              
              <BoosterPackCard
                selected={boosterSelected}
                onToggle={() => setBoosterSelected(!boosterSelected)}
              />
            </section>

            {/* Benefits */}
            <section>
              <h3 className="font-bold !text-white mb-6" style={{ fontSize: '26px' }}>Paiement unique. Accès à vie.</h3>
              <div className="space-y-4">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Check size={20} className="text-blue-400 flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h3 className="font-semibold !text-white mb-4" style={{ fontSize: '26px' }}>Questions fréquentes</h3>
              <div className="bg-[#0d1318] rounded-2xl border border-white/5 p-4">
                {FAQ_ITEMS.map((item, i) => (
                  <FAQItemComponent
                    key={i}
                    item={item}
                    isOpen={openFAQ === i}
                    onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-[#12161a] rounded-2xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-white/10">
                  <h3 className="text-xl font-bold !text-white">Récapitulatif</h3>
                </div>

                {/* Selected Items */}
                <div className="p-5 space-y-3 border-b border-white/10">
                  {selectedPrograms.length === 0 ? (
                    <p className="text-white/40 text-sm text-center py-4">
                      Sélectionne au moins un programme
                    </p>
                  ) : (
                    <>
                      {PROGRAMS.filter(p => selectedPrograms.includes(p.id)).map((program) => (
                        <div key={program.id} className="flex items-center justify-between">
                          <span className="text-white" style={{ fontSize: '13px' }}>{program.name}</span>
                          <span className="text-white font-medium" style={{ fontSize: '16px' }}>${program.discountedPrice}</span>
                        </div>
                      ))}
                      
                      {boosterSelected && (
                        <div className="pt-3 mt-3 border-t border-white/10">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/70">Pack Boosters</span>
                            <span className="text-white/70">${BOOSTER_PACK.discountedPrice}/mois</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Totals */}
                <div className="p-5 space-y-3 border-b border-white/10">
                  {totalSavings > 0 && (
                    <div className="flex items-center justify-between text-sm text-green-400">
                      <span>Économies</span>
                      <span>-${totalSavings}</span>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">Total aujourd'hui</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-white">${programsTotal}</span>
                        {boosterMonthly > 0 && (
                          <p className="text-xs text-white/50">+ ${boosterMonthly}/mois</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="p-5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsProcessing(true)}
                    disabled={selectedPrograms.length === 0 || isProcessing}
                    className={`w-full py-4 font-bold text-lg rounded-full flex items-center justify-center gap-2 transition-all ${
                      selectedPrograms.length === 0
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-[#00c2ff] text-white hover:bg-[#00d4ff]'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Continuer
                        <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>

                  {/* Trust signals */}
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-4 text-xs text-white/40">
                      <span>Stripe</span>
                      <span>•</span>
                      <span>PayPal</span>
                      <span>•</span>
                      <span>Apple Pay</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold !text-white mb-4">Ils ont réussi avec SMS</h3>
                <div className="space-y-3">
                  {TESTIMONIALS.slice(0, 2).map((testimonial, i) => (
                    <div key={i} className="p-4 bg-[#12161a] rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                          <div className="text-xs text-white/50">{testimonial.role}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      
                      <p className="!text-white/90 text-sm mb-2">"{testimonial.text}"</p>
                      
                      <div className="text-xs text-[#00c2ff]">{testimonial.program}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">CGV</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={14} />
            Paiement 100% sécurisé
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/33612345678"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 top-[60%] -translate-y-1/2 z-50 px-6 py-4 bg-[#25D366] rounded-full text-white font-semibold flex items-center gap-3 hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/30 hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        On t'écoute
      </a>
    </div>
  );
}
