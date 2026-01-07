'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS, Question } from '@/lib/assessment-data';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  X,
  MessageCircle,
  ArrowLeft,
  Target
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { TestimonialsSectionMultilang } from '@/components/landing/sections/TestimonialsSectionMultilang';

interface QuizRunnerProps {
  selectedTopicIds: string[];
}

type WizardStep = 'quiz' | 'transition' | 'guided' | 'gate' | 'results';

const STEPS = [
  { label: 'Sujets', step: 0 },
  { label: 'Quiz', step: 1 },
  { label: 'Résultats', step: 2 },
];

export function QuizRunner({ selectedTopicIds }: QuizRunnerProps) {
  // State Machine
  const [step, setStep] = useState<WizardStep>('quiz');
  
  // Quiz State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  // Guided Question State
  const [guidedQuestion, setGuidedQuestion] = useState<Question | null>(null);
  const [showResolution, setShowResolution] = useState(false);
  
  // Gate State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+32');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpInputRefs, setOtpInputRefs] = useState<React.RefObject<HTMLInputElement>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize OTP input refs
  useEffect(() => {
    setOtpInputRefs(Array(6).fill(null).map(() => React.createRef<HTMLInputElement>()));
  }, []);

  // Initialize Data
  useEffect(() => {
    let pool = QUESTIONS.filter(q => 
      q.topicIds.some(tid => selectedTopicIds.includes(tid))
    );
    if (pool.length < 4) pool = QUESTIONS;
    
    const shuffled = pool.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 3));
    setGuidedQuestion(shuffled[3] || shuffled[0]);
  }, [selectedTopicIds]);

  // OTP Input Handler
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  // Actions
  const handleQuizAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentQIndex].id]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setStep('transition');
    }
  };

  const handleBackQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const handleGuidedAnswer = (optionIndex: number) => {
    if (guidedQuestion) {
      setAnswers(prev => ({ ...prev, [guidedQuestion.id]: optionIndex }));
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtpPopup(true);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('results');
    }, 1000);
  };

  // Score Calculation
  const score = useMemo(() => {
    let s = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) s++;
    });
    if (guidedQuestion && answers[guidedQuestion.id] === guidedQuestion.correctAnswer) {
      s++;
    }
    return s;
  }, [answers, questions, guidedQuestion]);

  const totalQuestions = questions.length + (guidedQuestion ? 1 : 0);

  // Current step for progress indicator
  const getCurrentProgressStep = () => {
    if (step === 'quiz' || step === 'transition' || step === 'guided') return 1;
    if (step === 'gate') return 1;
    if (step === 'results') return 2;
    return 1;
  };

  const progressStep = getCurrentProgressStep();

  if (questions.length === 0 || !guidedQuestion) {
    return (
      <div className="min-h-screen bg-[#0d1317] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full"></div>
      </div>
    );
  }

  // Header Component
  const Header = () => (
    <header className="sticky top-0 bg-[#0d1317]/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image 
            src="/brand/onboarding-logo.svg" 
            alt="Science Made Simple" 
            width={85} 
            height={85}
          />
        </Link>

        {/* Progress Steps - Fil d'Ariane */}
        <div className="flex items-center gap-2">
          {STEPS.map((item, idx) => {
            const isCompleted = progressStep > item.step;
            const isCurrent = progressStep === item.step;
            
            return (
              <React.Fragment key={item.label}>
                {/* Dot */}
                <div className="flex flex-col items-center">
                  <motion.div 
                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-blue-600' 
                        : isCurrent 
                          ? 'bg-blue-600 ring-[4px] ring-blue-600/30' 
                          : 'bg-gray-600'
                    }`}
                    animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <span className={`text-[10px] md:text-xs mt-1.5 font-semibold hidden md:block ${
                    isCompleted || isCurrent ? 'text-white' : 'text-white/50'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {/* Line connector */}
                {idx < STEPS.length - 1 && (
                  <div className={`w-8 md:w-16 h-1 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Close */}
        <Link
          href="/"
          className="text-white/70 hover:text-white transition-opacity"
        >
          <X size={24} />
        </Link>
      </div>
    </header>
  );

  // 1. RAPID QUIZ PHASE
  if (step === 'quiz') {
    const currentQ = questions[currentQIndex];
    const hasAnswered = answers[currentQ.id] !== undefined;

    return (
      <div className="min-h-screen bg-[#0d1317] text-white flex flex-col">
        <Header />
        
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
          <div className="w-full max-w-2xl">
            {/* Card Container */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              {/* Decorative gradient line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#48c6ed]/50 to-transparent" />
              
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[...Array(questions.length)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-all ${
                          i < currentQIndex ? 'bg-[#48c6ed]' : 
                          i === currentQIndex ? 'bg-[#48c6ed] ring-4 ring-[#48c6ed]/20' : 
                          'bg-white/20'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium !text-white/50">
                    {currentQIndex + 1} sur {questions.length}
                  </span>
                </div>
                <span className="px-4 py-1.5 bg-[#48c6ed]/10 text-[#48c6ed] border border-[#48c6ed]/20 rounded-full text-xs font-bold">
                  Quiz Rapide
                </span>
              </div>

              {/* Question */}
              <h2 className="text-2xl md:text-3xl font-bold !text-white mb-8 leading-tight">
                {currentQ.text}
              </h2>

              {/* Answer Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {currentQ.options.map((option, idx) => {
                  const isSelected = answers[currentQ.id] === idx;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuizAnswer(idx)}
                      className={`border-2 rounded-2xl p-4 flex items-center gap-4 transition-all text-left ${
                        isSelected 
                          ? 'bg-[#48c6ed]/10 border-[#48c6ed] shadow-lg shadow-[#48c6ed]/10' 
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected ? 'border-[#48c6ed] bg-[#48c6ed]' : 'border-white/30'
                      }`}>
                        {isSelected && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full" 
                          />
                        )}
                      </div>
                      <span className={`text-base font-medium ${isSelected ? '!text-white' : '!text-white/70'}`}>
                        {option}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <button
                  onClick={handleBackQuestion}
                  disabled={currentQIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                    currentQIndex > 0
                      ? '!text-white/60 hover:!text-white hover:bg-white/5'
                      : '!text-white/20 cursor-not-allowed'
                  }`}
                >
                  <ArrowLeft size={18} />
                  <span className="font-medium">Précédent</span>
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={!hasAnswered}
                  className={`px-8 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2 ${
                    hasAnswered 
                      ? 'bg-gradient-to-r from-[#48c6ed] to-blue-600 !text-white hover:from-[#3ab5dc] hover:to-blue-700 shadow-lg shadow-blue-500/25' 
                      : 'bg-white/5 !text-white/30 cursor-not-allowed border border-white/10'
                  }`}
                >
                  <span>Suivant</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // 2. TRANSITION PHASE
  if (step === 'transition') {
    return (
      <div className="min-h-screen bg-[#0d1317] text-white flex flex-col">
        <Header />
        
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xl"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-6xl mb-6"
            >
              🎯
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4 !text-white">
              Premières questions terminées !
            </h2>
            <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Tu as répondu aux questions de base.
            </p>
            <p className="text-xl font-semibold mb-10" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Maintenant, voyons comment tu te débrouilles dans des conditions d'examen.
            </p>

            <div className="w-full space-y-4">
              <button
                onClick={() => setStep('guided')}
                className="w-full bg-[#48c6ed] !text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-[#48c6ed]/25 hover:bg-[#3ab5dc] transition-all flex items-center justify-center gap-3 text-lg"
              >
                <span>Essayer une question d'examen</span>
                <span className="bg-white/20 text-xs py-1 px-2 rounded-full">Recommandé</span>
              </button>
              
              <button
                onClick={() => setStep('gate')}
                className="w-full !text-white/50 font-medium py-4 px-10 rounded-2xl border border-white/10 hover:bg-white/5 transition-all"
              >
                Passer directement aux résultats
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 3. GUIDED QUESTION PHASE
  if (step === 'guided') {
    const isSelected = answers[guidedQuestion.id] !== undefined;

    return (
      <div className="min-h-screen bg-[#0d1317] text-white flex flex-col">
        <Header />
        
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
          <div className="w-full max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              {/* Decorative gradient line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setStep('transition')} 
                  className="!text-white/50 hover:!text-white flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Retour
                </button>
                <span className="px-4 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold">
                  Style Examen
                </span>
              </div>

              {/* Question */}
              <h2 className="text-2xl md:text-3xl font-bold !text-white mb-8 leading-tight">
                {guidedQuestion.text}
              </h2>

              {/* Answer Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {guidedQuestion.options.map((opt, idx) => {
                  const selected = answers[guidedQuestion.id] === idx;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGuidedAnswer(idx)}
                      className={`border-2 rounded-2xl p-4 flex items-center gap-4 transition-all text-left ${
                        selected 
                          ? 'bg-[#48c6ed]/10 border-[#48c6ed] shadow-lg shadow-[#48c6ed]/10' 
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selected ? 'border-[#48c6ed] bg-[#48c6ed]' : 'border-white/30'
                      }`}>
                        {selected && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full" 
                          />
                        )}
                      </div>
                      <span className={`text-base font-medium ${selected ? '!text-white' : '!text-white/70'}`}>
                        {opt}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Reveal Resolution */}
              <div className="pt-4 border-t border-white/5">
                <AnimatePresence mode="wait">
                  {!showResolution ? (
                    <div className="flex flex-col items-center gap-4">
                      <button 
                        onClick={() => setShowResolution(true)}
                        className="px-8 py-3 rounded-xl bg-white/5 !text-white font-medium hover:bg-white/10 border border-white/10 transition-all"
                      >
                        Révéler la correction
                      </button>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold !text-white mb-3 flex items-center gap-2">
                          <span className="text-xl">💡</span>
                          Méthode SMS
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)' }} className="leading-relaxed">
                          {guidedQuestion.explanation}
                        </p>
                      </div>

                      <button
                        onClick={() => setStep('gate')}
                        className="w-full px-6 py-4 rounded-xl bg-[#48c6ed] !text-white font-bold hover:bg-[#3ab5dc] transition-all shadow-lg shadow-[#48c6ed]/25 flex items-center justify-center gap-2"
                      >
                        <span>Continuer</span>
                        <ArrowRight size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // 4. GATE PHASE - Contact Form + OTP Popup
  if (step === 'gate') {
    return (
      <div className="min-h-screen bg-[#0d1317] text-white flex flex-col">
        <Header />
        
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
          <div className="w-full max-w-lg">
            {/* Title */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold !text-white mb-2">
                Quiz terminé !
              </h1>
              <p className="text-lg" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Tes réponses ont été enregistrées.
              </p>
            </motion.div>

            {/* Contact Form Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              {/* Decorative line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-[#48c6ed]" />
              
              <h2 className="text-xl font-bold !text-white mb-6">
                Entre tes coordonnées pour voir tes résultats
              </h2>

              <form onSubmit={handleContactSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium !text-white/80 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#48c6ed]/30 focus:border-[#48c6ed] !text-white placeholder-white/40 transition-all"
                    placeholder="ton@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium !text-white/80 mb-2">
                    Téléphone
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl">
                      <span className="text-2xl">🇧🇪</span>
                      <select 
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-transparent border-none outline-none !text-white font-medium"
                      >
                        <option value="+32">+32</option>
                        <option value="+33">+33</option>
                        <option value="+1">+1</option>
                      </select>
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#48c6ed]/30 focus:border-[#48c6ed] !text-white placeholder-white/40 transition-all"
                      placeholder="123 45 67 89"
                    />
                  </div>
                </div>

                {/* Marketing Consent */}
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="marketing"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 border-white/20 rounded bg-white/10 text-[#48c6ed] focus:ring-[#48c6ed]"
                  />
                  <label htmlFor="marketing" className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    J'accepte de recevoir des communications marketing
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="w-full px-6 py-4 bg-[#48c6ed] rounded-xl !text-white font-bold hover:bg-[#3ab5dc] transition-all shadow-lg shadow-[#48c6ed]/25 flex items-center justify-center gap-2"
                >
                  <span>Voir mes résultats</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* OTP Popup Overlay */}
        <AnimatePresence>
          {showOtpPopup && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOtpPopup(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />

              {/* Popup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden">
                  {/* Decorative top line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#48c6ed] via-[#48c6ed] to-transparent" />
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setShowOtpPopup(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X size={18} className="!text-white/60" />
                  </button>

                  {/* Icon */}
                  <div className="text-center mb-4">
                    <span className="text-5xl">📧</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold !text-white mb-3 text-center">
                    Vérifie ton email
                  </h3>

                  {/* Instruction */}
                  <p className="text-center mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Un code de vérification a été envoyé à ton adresse email. Entre-le ci-dessous.
                  </p>

                  {/* OTP Inputs */}
                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="flex gap-3 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={otpInputRefs[index]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-14 rounded-xl border-2 border-white/10 bg-white/5 text-center text-xl font-bold !text-white focus:border-[#48c6ed] focus:bg-white/10 focus:outline-none transition-all"
                        />
                      ))}
                    </div>

                    {/* Resend Link */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setOtp(['', '', '', '', '', '']);
                          otpInputRefs[0]?.current?.focus();
                        }}
                        className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        Tu n'as pas reçu le code ? <span className="font-semibold underline text-[#48c6ed] hover:text-[#3ab5dc]">Renvoyer</span>
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={otp.some(d => !d) || isSubmitting}
                      className={`w-full px-6 py-4 rounded-xl font-bold transition-all ${
                        otp.every(d => d) && !isSubmitting
                          ? 'bg-[#48c6ed] !text-white hover:bg-[#3ab5dc] shadow-lg shadow-[#48c6ed]/25'
                          : 'bg-white/10 !text-white/40 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? 'Vérification...' : 'Vérifier'}
                    </button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 5. RESULTS PHASE
  if (step === 'results') {
    const allQuestions = [...questions];
    if (guidedQuestion) allQuestions.push(guidedQuestion);

    return (
      <div className="min-h-screen bg-[#0d1317] text-white flex flex-col">
        <Header />
        
        <div className="flex-1 flex flex-col justify-center px-6 py-4">
          <div className="max-w-5xl mx-auto w-full">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#48c6ed]/10 text-[#48c6ed] text-xs font-bold uppercase tracking-widest mb-3 border border-[#48c6ed]/20">
                <CheckCircle size={14} /> Diagnostic Terminé
              </div>
              <h1 className="text-2xl md:text-3xl font-bold !text-white mb-2">
                C'est un point de départ — pas un verdict.
              </h1>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Tu as obtenu <span className="!text-white font-bold text-lg">{score}/{totalQuestions}</span> bonnes réponses.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-12 gap-4">
              {/* LEFT: Question Breakdown */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-7"
              >
                <h3 className="text-sm font-bold !text-white/60 uppercase tracking-wider mb-3">
                  Détail de tes réponses
                </h3>
                
                <div className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-2 custom-scrollbar">
                  {allQuestions.map((q) => {
                    const userAnswer = answers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    const isGuided = guidedQuestion && q.id === guidedQuestion.id;

                    return (
                      <div 
                        key={q.id} 
                        className={`relative bg-white/5 border rounded-xl p-4 transition-all hover:bg-white/10 ${
                          isCorrect ? 'border-green-500/30' : 'border-red-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            {isCorrect ? (
                              <CheckCircle size={14} className="text-green-400" />
                            ) : (
                              <XCircle size={14} className="text-red-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium !text-white text-sm leading-snug mb-1 line-clamp-2">
                              {isGuided && <span className="text-purple-400 text-xs mr-1">[Examen]</span>}
                              {q.text}
                            </h4>
                            <p className={`text-xs font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                              {q.options[userAnswer] || "Non répondu"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* RIGHT: CTA */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-5"
              >
                <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-6 text-center overflow-hidden">
                  {/* Decorative line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#48c6ed] via-[#48c6ed] to-transparent" />
                  
                  <h3 className="text-xl font-bold !text-white mb-2">
                    Prêt à progresser ?
                  </h3>
                  <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Découvre un programme personnalisé adapté à ton niveau et tes objectifs.
                  </p>
                  
                  {/* Primary CTA - Diagnostic Flow */}
                  <Link 
                    href="/?diagnostic=true"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#48c6ed] !text-white font-bold py-3 px-5 rounded-xl text-base shadow-lg shadow-[#48c6ed]/25 hover:bg-[#3ab5dc] transition-all mb-3"
                  >
                    <Target size={20} />
                    <span>Créer mon parcours</span>
                  </Link>
                  
                  {/* Secondary CTA - WhatsApp */}
                  <a 
                    href="https://wa.me/32477025622"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 !text-white/70 font-medium py-2.5 px-5 rounded-xl text-sm hover:bg-white/10 hover:!text-white transition-all"
                  >
                    <MessageCircle size={16} />
                    <span>Parler à un mentor</span>
                  </a>
                </div>

                <Link href="/" className="mt-4 block text-center text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  ← Retour à l'accueil
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
