'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Zap,
  Check,
  ArrowLeft,
  Trophy
} from 'lucide-react';

// Types
interface Opponent {
  id: string;
  name: string;
  initials: string;
  level: number;
  wins: number;
  losses: number;
}

interface DuelQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface DuelFullScreenProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle: string;
}

// Mock data
const MOCK_QUESTIONS: DuelQuestion[] = [
  {
    id: 'q1',
    question: 'Quelle est la dérivée de f(x) = x² ?',
    options: ['2x', 'x', '2', 'x²'],
    correctIndex: 0
  },
  {
    id: 'q2',
    question: 'Quel est le théorème fondamental du calcul intégral ?',
    options: [
      'La dérivée d\'une intégrale est la fonction',
      'L\'intégrale d\'une dérivée est constante',
      'Toute fonction continue est intégrable',
      'L\'aire sous une courbe est toujours positive'
    ],
    correctIndex: 0
  },
  {
    id: 'q3',
    question: 'Si F\'(x) = f(x), alors ∫f(x)dx = ?',
    options: ['F(x) + C', 'f(x) + C', 'F\'(x)', 'f\'(x)'],
    correctIndex: 0
  },
  {
    id: 'q4',
    question: 'Quelle est la limite de (sin x)/x quand x → 0 ?',
    options: ['1', '0', '∞', 'n\'existe pas'],
    correctIndex: 0
  },
  {
    id: 'q5',
    question: 'La dérivée de e^x est égale à :',
    options: ['e^x', 'xe^(x-1)', 'ln(x)', '1/x'],
    correctIndex: 0
  }
];

const MOCK_OPPONENTS: Opponent[] = [
  { id: 'o1', name: 'Sarah M.', initials: 'SM', level: 12, wins: 3, losses: 1 },
  { id: 'o2', name: 'Alex K.', initials: 'AK', level: 10, wins: 2, losses: 2 },
  { id: 'o3', name: 'Thomas D.', initials: 'TD', level: 8, wins: 1, losses: 0 },
  { id: 'o4', name: 'Marie L.', initials: 'ML', level: 15, wins: 7, losses: 2 },
  { id: 'o5', name: 'Lucas B.', initials: 'LB', level: 9, wins: 4, losses: 3 },
];

// Duel states
type DuelState = 'lobby' | 'searching' | 'matched' | 'countdown' | 'playing' | 'feedback' | 'result';

export function DuelFullScreen({ 
  isOpen, 
  onClose, 
  trackTitle 
}: DuelFullScreenProps) {
  // Duel state
  const [duelState, setDuelState] = useState<DuelState>('lobby');
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<DuelQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [roundTimer, setRoundTimer] = useState(10);
  const [xpEarned, setXpEarned] = useState(0);
  const [playerAnswerDots, setPlayerAnswerDots] = useState<(boolean | null)[]>([null, null, null, null, null]);
  const [opponentAnswerDots, setOpponentAnswerDots] = useState<(boolean | null)[]>([null, null, null, null, null]);

  // Reset duel state
  const resetDuel = useCallback(() => {
    setDuelState('lobby');
    setOpponent(null);
    setCountdown(5);
    setCurrentRound(1);
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setRoundTimer(10);
    setXpEarned(0);
    setPlayerAnswerDots([null, null, null, null, null]);
    setOpponentAnswerDots([null, null, null, null, null]);
  }, []);

  // Search for opponent
  const startMatchmaking = useCallback(() => {
    setDuelState('searching');
    
    setTimeout(() => {
      const randomOpponent = MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];
      setOpponent(randomOpponent);
      setDuelState('matched');
      
      setTimeout(() => {
        setDuelState('countdown');
      }, 2000);
    }, 2000 + Math.random() * 1500);
  }, []);

  // Challenge specific opponent
  const challengeOpponent = useCallback((opp: Opponent) => {
    setOpponent(opp);
    setDuelState('matched');
    setTimeout(() => {
      setDuelState('countdown');
    }, 1500);
  }, []);

  // Countdown effect
  useEffect(() => {
    if (duelState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (duelState === 'countdown' && countdown === 0) {
      setCurrentQuestion(MOCK_QUESTIONS[0]);
      setDuelState('playing');
    }
  }, [duelState, countdown]);

  // Round timer effect
  useEffect(() => {
    if (duelState === 'playing' && roundTimer > 0) {
      const timer = setTimeout(() => setRoundTimer(roundTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (duelState === 'playing' && roundTimer === 0 && selectedAnswer === null) {
      handleAnswerSelect(-1);
    }
  }, [duelState, roundTimer, selectedAnswer]);

  // Handle answer selection
  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = currentQuestion && index === currentQuestion.correctIndex;
    setIsAnswerCorrect(correct || false);
    
    // Update player dots
    const newPlayerDots = [...playerAnswerDots];
    newPlayerDots[questionIndex] = correct || false;
    setPlayerAnswerDots(newPlayerDots);
    
    // Calculate scores
    if (correct) {
      const timeBonus = Math.floor(roundTimer * 0.7);
      const answerBonus = 10;
      setPlayerScore(prev => prev + answerBonus + timeBonus);
      setXpEarned(prev => prev + answerBonus + timeBonus);
    }
    
    // Simulate opponent answer
    const opponentCorrect = Math.random() > 0.4;
    const newOpponentDots = [...opponentAnswerDots];
    newOpponentDots[questionIndex] = opponentCorrect;
    setOpponentAnswerDots(newOpponentDots);
    
    if (opponentCorrect) {
      const oppTimeBonus = Math.floor(Math.random() * 7);
      setOpponentScore(prev => prev + 10 + oppTimeBonus);
    }
    
    setDuelState('feedback');
    
    // Move to next question or end
    setTimeout(() => {
      if (questionIndex < MOCK_QUESTIONS.length - 1) {
        setQuestionIndex(prev => prev + 1);
        setCurrentQuestion(MOCK_QUESTIONS[questionIndex + 1]);
        setCurrentRound(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setRoundTimer(10);
        setDuelState('playing');
      } else {
        setDuelState('result');
      }
    }, 2500);
  };

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      resetDuel();
    }
  }, [isOpen, resetDuel]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* === LOBBY STATE === */}
        {duelState === 'lobby' && (
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <button 
                onClick={onClose}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Retour</span>
              </button>
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">Duel</h1>
                <p className="text-xs text-gray-500">{trackTitle}</p>
              </div>
              <div className="w-20" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
              {/* Title */}
              <div className="text-center mb-10">
                <div className="text-6xl font-black text-white mb-4 tracking-tight">
                  DUEL
                </div>
                <p className="text-gray-400 text-lg">
                  Affronte un autre étudiant sur des questions de ton niveau.
                </p>
              </div>

              {/* Main CTA */}
              <button 
                onClick={startMatchmaking}
                className="w-full max-w-sm p-5 bg-green-500 text-white rounded-2xl hover:bg-green-400 transition-colors mb-10"
              >
                <div className="flex items-center justify-center gap-3">
                  <Zap size={24} />
                  <span className="font-bold text-xl">Trouver un adversaire</span>
                </div>
                <p className="text-sm text-green-100 mt-1">Matchmaking automatique</p>
              </button>

              {/* Recent opponents */}
              <div className="w-full max-w-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 text-center">
                  Ou défier un étudiant
                </p>
                <div className="space-y-2">
                  {MOCK_OPPONENTS.slice(0, 4).map((opp) => (
                    <button
                      key={opp.id}
                      onClick={() => challengeOpponent(opp)}
                      className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `hsl(${opp.id.charCodeAt(1) * 30}, 60%, 50%)` }}
                        >
                          <span className="text-white text-sm font-bold">{opp.initials}</span>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white">{opp.name}</p>
                          <p className="text-xs text-gray-500">Niveau {opp.level} · {opp.wins}V - {opp.losses}D</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-400 font-medium">Défier</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === SEARCHING STATE === */}
        {duelState === 'searching' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-gray-700 border-t-green-400 animate-spin" />
            </div>
            <p className="text-2xl font-bold text-white mb-2">Recherche d'un adversaire...</p>
            <p className="text-gray-500">Cela peut prendre quelques secondes</p>
            <button 
              onClick={() => { resetDuel(); }}
              className="mt-8 px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
          </div>
        )}

        {/* === MATCHED STATE === */}
        {duelState === 'matched' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-700 to-purple-900">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-white mb-12">Adversaire trouvé !</p>
              
              <div className="flex items-center justify-center gap-12">
                {/* Player */}
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-green-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-400/30">
                    <span className="text-white text-2xl font-bold">Y</span>
                  </div>
                  <p className="text-white font-medium">Vous</p>
                </div>
                
                {/* VS */}
                <div className="text-4xl font-black text-white/40">VS</div>
                
                {/* Opponent */}
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-white text-2xl font-bold">{opponent?.initials}</span>
                  </div>
                  <p className="text-white font-medium">{opponent?.name}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* === COUNTDOWN STATE === */}
        {duelState === 'countdown' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <p className="text-xl text-gray-400 mb-6">Le duel commence dans</p>
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-9xl font-black text-white"
              >
                {countdown}
              </motion.div>
              
              {/* VS Bar */}
              <div className="mt-12 flex items-center justify-center gap-8 px-8 py-4 bg-purple-600 rounded-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">Y</span>
                  </div>
                  <span className="text-white font-medium">Vous</span>
                </div>
                <span className="text-white/50 font-bold text-xl">VS</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{opponent?.initials}</span>
                  </div>
                  <span className="text-white font-medium">{opponent?.name}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* === PLAYING STATE === */}
        {duelState === 'playing' && (
          <div className="min-h-screen flex flex-col bg-gray-900">
            {/* Header with scores */}
            <div className="flex items-center justify-between p-4 bg-gray-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-700 rounded-full pl-2 pr-4 py-1">
                  <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Y</span>
                  </div>
                  <span className="text-white text-sm font-medium truncate max-w-[80px]">Vous</span>
                </div>
                <span className="text-2xl font-bold text-white">{playerScore}</span>
                {/* Player answer dots */}
                <div className="flex gap-1">
                  {playerAnswerDots.map((dot, idx) => (
                    <div 
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        dot === null ? 'bg-gray-600' : dot ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Round indicator */}
              <div className="text-center">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#374151" strokeWidth="4" fill="none" />
                    <circle 
                      cx="32" cy="32" r="28" 
                      stroke="#10b981" 
                      strokeWidth="4" 
                      fill="none"
                      strokeDasharray={175.9}
                      strokeDashoffset={175.9 * (1 - roundTimer / 10)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white">{currentRound}</span>
                    <span className="text-[10px] text-gray-400">Round</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Opponent answer dots */}
                <div className="flex gap-1">
                  {opponentAnswerDots.map((dot, idx) => (
                    <div 
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        dot === null ? 'bg-gray-600' : dot ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-white">{opponentScore}</span>
                <div className="flex items-center gap-2 bg-gray-700 rounded-full pl-4 pr-2 py-1">
                  <span className="text-white text-sm font-medium truncate max-w-[80px]">{opponent?.name}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{opponent?.initials}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
              <div className="bg-gray-800 rounded-3xl p-8 mb-8 w-full">
                <p className="text-xl md:text-2xl font-medium text-white text-center leading-relaxed">
                  {currentQuestion?.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {currentQuestion?.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-5 rounded-2xl text-left transition-all flex items-center gap-4 ${
                      selectedAnswer === null 
                        ? 'bg-gray-800 border-2 border-gray-700 hover:border-gray-500 hover:bg-gray-700'
                        : selectedAnswer === idx
                          ? isAnswerCorrect 
                            ? 'bg-green-500/20 border-2 border-green-500 text-green-300'
                            : 'bg-red-500/20 border-2 border-red-500 text-red-300'
                          : idx === currentQuestion?.correctIndex && selectedAnswer !== null
                            ? 'bg-green-500/20 border-2 border-green-500 text-green-300'
                            : 'bg-gray-800/50 border-2 border-gray-700 text-gray-500'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedAnswer === null 
                        ? 'bg-gray-700 text-gray-400'
                        : selectedAnswer === idx
                          ? isAnswerCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          : idx === currentQuestion?.correctIndex && selectedAnswer !== null
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-500'
                    }`}>
                      {selectedAnswer !== null && (idx === currentQuestion?.correctIndex || selectedAnswer === idx) ? (
                        idx === currentQuestion?.correctIndex ? <Check size={20} /> : <X size={20} />
                      ) : (
                        <span className="font-bold">{String.fromCharCode(65 + idx)}</span>
                      )}
                    </div>
                    <span className={`font-medium text-lg ${selectedAnswer === null ? 'text-white' : ''}`}>{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === FEEDBACK STATE === */}
        {duelState === 'feedback' && (
          <div className="min-h-screen flex flex-col bg-gray-900">
            {/* Same header */}
            <div className="flex items-center justify-between p-4 bg-gray-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-700 rounded-full pl-2 pr-4 py-1">
                  <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Y</span>
                  </div>
                  <span className="text-white text-sm font-medium">Vous</span>
                </div>
                <span className="text-2xl font-bold text-white">{playerScore}</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-white">Round {currentRound}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-white">{opponentScore}</span>
                <div className="flex items-center gap-2 bg-gray-700 rounded-full pl-4 pr-2 py-1">
                  <span className="text-white text-sm font-medium">{opponent?.name}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{opponent?.initials}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feedback */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                {isAnswerCorrect ? (
                  <>
                    <div className="text-6xl font-black text-green-400 mb-6">CORRECT !</div>
                    <div className="space-y-3 text-lg">
                      <p className="flex items-center justify-center gap-3 text-gray-300">
                        <span>Réponse bonus</span>
                        <span className="text-green-400 font-bold">+10 XP</span>
                      </p>
                      <p className="flex items-center justify-center gap-3 text-gray-300">
                        <span>Bonus temps</span>
                        <span className="text-green-400 font-bold">+{Math.floor(roundTimer * 0.7)} XP</span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-6xl font-black text-red-400 mb-6">INCORRECT</div>
                    <p className="text-gray-400 text-lg">La bonne réponse était :</p>
                    <p className="text-white font-medium text-xl mt-3">
                      {currentQuestion?.options[currentQuestion?.correctIndex]}
                    </p>
                  </>
                )}
                
                <p className="mt-10 text-gray-500">Question suivante dans 2s...</p>
              </motion.div>
            </div>
          </div>
        )}

        {/* === RESULT STATE === */}
        {duelState === 'result' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center w-full max-w-md"
            >
              {/* Result */}
              {playerScore > opponentScore ? (
                <>
                  <div className="text-6xl font-black text-green-400 mb-3">VICTOIRE !</div>
                  <div className="flex items-center justify-center gap-2 text-yellow-400 mb-8">
                    <Trophy size={24} />
                    <span className="font-bold text-lg">+1 victoire</span>
                  </div>
                </>
              ) : playerScore === opponentScore ? (
                <div className="text-6xl font-black text-gray-400 mb-10">ÉGALITÉ</div>
              ) : (
                <div className="text-6xl font-black text-red-400 mb-10">DÉFAITE</div>
              )}
              
              {/* Score comparison */}
              <div className="flex items-center justify-center gap-12 my-10">
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full ${playerScore > opponentScore ? 'bg-green-400' : 'bg-gray-600'} flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-white text-2xl font-bold">Y</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{playerScore}</p>
                  <p className="text-gray-500">Vous</p>
                </div>
                
                <div className="text-gray-600 text-3xl">—</div>
                
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full ${opponentScore > playerScore ? 'bg-green-400' : 'bg-gray-600'} flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-white text-2xl font-bold">{opponent?.initials}</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{opponentScore}</p>
                  <p className="text-gray-500">{opponent?.name}</p>
                </div>
              </div>
              
              {/* XP earned */}
              <div className="bg-gray-800 rounded-2xl p-6 mb-8">
                <p className="text-gray-500 mb-2">XP gagnés</p>
                <p className="text-3xl font-bold text-green-400">+{xpEarned} XP</p>
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                <button 
                  onClick={() => { resetDuel(); startMatchmaking(); }}
                  className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-400 transition-colors"
                >
                  Rejouer
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-colors"
                >
                  Retour
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

