'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS, Question } from '@/lib/assessment-data';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  X,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { TestimonialsSectionMultilang } from '@/components/landing/sections/TestimonialsSectionMultilang';

interface QuizRunnerProps {
  selectedTopicIds: string[];
}

type WizardStep = 'quiz' | 'transition' | 'guided' | 'gate' | 'results';

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

  if (questions.length === 0 || !guidedQuestion) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-500">Loading diagnostic...</p>
    </div>;
  }

  // 1. RAPID QUIZ PHASE - Style from image
  if (step === 'quiz') {
    const currentQ = questions[currentQIndex];
    const hasAnswered = answers[currentQ.id] !== undefined;

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        {/* Main Card Container */}
        <div className="w-full max-w-2xl border border-gray-200 rounded-3xl p-8 md:p-10 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              Basic Physics Quiz
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">
            {currentQ.text}
          </h2>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {currentQ.options.map((option, idx) => {
              const isSelected = answers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-gray-300 transition-colors text-left"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-gray-900' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                  </div>
                  <span className="text-base font-medium text-gray-900">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={!hasAnswered}
              className={`px-6 py-3 rounded-full font-medium text-base transition-colors ${
                hasAnswered 
                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. TRANSITION PHASE
  if (step === 'transition') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-4 text-black">
          First steps completed.
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          You've answered the basics.
        </p>
        <p className="text-xl font-bold text-black mb-10">
          Now, let's see how this topic looks in real exam conditions.
        </p>

        <div className="w-full space-y-4">
          <button
            onClick={() => setStep('guided')}
            className="w-full bg-blue-600 text-white font-bold py-5 px-10 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 text-lg"
          >
            <span>Try an exam-style question</span>
            <span className="bg-blue-500 text-xs py-1 px-2 rounded">Recommended</span>
          </button>
          
          <button
            onClick={() => setStep('gate')}
            className="w-full bg-white text-gray-500 font-medium py-4 px-10 rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Skip to my results
          </button>
        </div>
      </motion.div>
    );
  }

  // 3. GUIDED QUESTION PHASE - Same style as quiz
  if (step === 'guided') {
    const isSelected = answers[guidedQuestion.id] !== undefined;

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl border border-gray-200 rounded-3xl p-8 md:p-10 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setStep('transition')} 
              className="text-gray-400 hover:text-gray-900"
            >
              ← Back
            </button>
            <span className="text-sm font-medium text-gray-700">
              Exam Style Question
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">
            {guidedQuestion.text}
          </h2>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {guidedQuestion.options.map((opt, idx) => {
              const selected = answers[guidedQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleGuidedAnswer(idx)}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-gray-300 transition-colors text-left"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selected ? 'border-gray-900' : 'border-gray-300'
                  }`}>
                    {selected && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                  </div>
                  <span className="text-base font-medium text-gray-900">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Reveal Resolution */}
          <AnimatePresence mode="wait">
            {!showResolution ? (
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={() => setShowResolution(true)}
                  className="px-6 py-3 rounded-full bg-gray-200 text-gray-900 font-medium hover:bg-gray-300 transition-colors"
                >
                  Reveal Resolution
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-black mb-3">SMS Method</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {guidedQuestion.explanation}
                  </p>
                </div>

                <button
                  onClick={() => setStep('gate')}
                  className="w-full px-6 py-3 rounded-full bg-gray-200 text-gray-900 font-medium hover:bg-gray-300 transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // 4. GATE PHASE - Contact Form + OTP Popup
  if (step === 'gate') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        {/* Main Content */}
        <div className="w-full max-w-lg">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Quiz terminé!
            </h1>
            <p className="text-lg text-gray-700">
              Vos réponses ont été enregistrées.
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-6">
              Veuillez fournir vos informations de contact pour voir vos résultats
            </h2>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 text-black"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Téléphone
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <span className="text-2xl">🇧🇪</span>
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent border-none outline-none text-black font-medium"
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
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 text-black"
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
                  className="mt-1 w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-gray-300"
                />
                <label htmlFor="marketing" className="text-sm text-gray-700">
                  J'accepte de recevoir des communications marketing
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full text-black font-medium hover:bg-gray-50 transition-colors"
              >
                Voir mes résultats
              </button>
            </form>
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
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              />

              {/* Popup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowOtpPopup(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X size={18} className="text-gray-600" />
                  </button>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-black mb-3">
                    Vérifiez votre adresse email
                  </h3>

                  {/* Instruction */}
                  <p className="text-gray-600 mb-6">
                    Un code de vérification a été envoyé à votre adresse email. Entrez-le ci-dessous.
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
                          className="w-12 h-12 rounded-full border-2 border-gray-200 text-center text-xl font-bold text-black focus:border-gray-400 focus:outline-none"
                        />
                      ))}
                    </div>

                    {/* Resend Link */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          // Resend logic
                          setOtp(['', '', '', '', '', '']);
                          otpInputRefs[0]?.current?.focus();
                        }}
                        className="text-sm text-gray-600 hover:text-black transition-colors"
                      >
                        Vous n'avez pas reçu le code ? <span className="font-semibold underline">Renvoyer</span>
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={otp.some(d => !d) || isSubmitting}
                      className={`w-full px-6 py-3 rounded-full font-medium transition-colors ${
                        otp.every(d => d) && !isSubmitting
                          ? 'bg-gray-200 text-black hover:bg-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
      <div className="min-h-screen bg-white text-black">
        <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest mb-4">
              <CheckCircle size={14} /> Diagnostic Complete
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4">
              This is a starting point — not a verdict.
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              You scored <span className="text-black font-bold">{score}/{totalQuestions}</span> correct answers.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            {/* LEFT: Question Breakdown */}
            <div className="md:col-span-7 space-y-6">
              <h3 className="text-lg font-bold text-black flex items-center gap-2">
                Your Questions Breakdown
              </h3>
              
              <div className="space-y-4">
                {allQuestions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;
                  const isGuided = guidedQuestion && q.id === guidedQuestion.id;

                  return (
                    <div key={q.id} className="bg-white border border-gray-200 p-6 rounded-2xl">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="font-bold text-black text-base leading-snug">
                          {isGuided && <span className="text-purple-600 mr-2">[Exam Style]</span>}
                          {q.text}
                        </h4>
                        {isCorrect ? (
                          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle size={20} className="text-red-600 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-bold uppercase text-gray-400">Your Answer:</span>
                        <span className={`text-sm font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                          {q.options[userAnswer] || "Skipped"}
                        </span>
                      </div>

                      <button className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-600 transition-colors">
                        <span>Watch explanation</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: CTA */}
            <div className="md:col-span-5">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-black mb-3">
                    Let's create your learning path
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                    We now have a clear idea of your level. Message us on WhatsApp to build a personalized roadmap based on your results.
                  </p>
                  
                  <a 
                    href="https://wa.me/32477025622"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-4 px-6 rounded-full text-lg shadow-lg hover:bg-[#20bd5a] transition-all mb-4"
                  >
                    <MessageCircle size={24} fill="white" />
                    <span>Talk to a Mentor on WhatsApp</span>
                  </a>
                  
                  <div className="flex flex-col gap-1 text-xs text-gray-400 font-medium">
                    <span className="flex items-center justify-center gap-1"><CheckCircle size={10}/> Free diagnostic</span>
                    <span className="flex items-center justify-center gap-1"><CheckCircle size={10}/> No commitment</span>
                    <span className="flex items-center justify-center gap-1"><CheckCircle size={10}/> Real human response</span>
                  </div>
                </div>

                <Link href="/" className="block text-center text-sm font-bold text-gray-400 hover:text-black transition-colors">
                  ← Back to landing page
                </Link>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-24 border-t border-gray-200 pt-16">
            <TestimonialsSectionMultilang />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
