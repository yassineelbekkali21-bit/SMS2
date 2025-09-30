'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Settings, Maximize2, CheckCircle, X } from 'lucide-react';

interface QuizQuestion {
  id: string;
  timestamp: number; // En secondes
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface VideoWithQuizProps {
  videoUrl?: string;
  questions: QuizQuestion[];
  onQuizComplete?: (score: number) => void;
}

const mockQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    timestamp: 30,
    question: 'Quelle est la formule de la dérivée d\'une fonction composée ?',
    options: [
      '(f ∘ g)\'(x) = f\'(g(x))',
      '(f ∘ g)\'(x) = f\'(g(x)) × g\'(x)',
      '(f ∘ g)\'(x) = f\'(x) × g\'(x)',
      '(f ∘ g)\'(x) = f(g\'(x))'
    ],
    correctAnswer: 1,
    explanation: 'La règle de dérivation en chaîne stipule que (f ∘ g)\'(x) = f\'(g(x)) × g\'(x)'
  },
  {
    id: 'q2',
    timestamp: 90,
    question: 'Dans quel cas utilise-t-on l\'intégration par parties ?',
    options: [
      'Pour toutes les fonctions polynomiales',
      'Quand on a un produit de fonctions',
      'Uniquement pour les fonctions exponentielles',
      'Pour les fonctions trigonométriques seulement'
    ],
    correctAnswer: 1,
    explanation: 'L\'intégration par parties est utilisée pour intégrer un produit de deux fonctions : ∫u dv = uv - ∫v du'
  },
  {
    id: 'q3',
    timestamp: 150,
    question: 'Que représente la constante d\'intégration ?',
    options: [
      'Une erreur de calcul',
      'L\'ensemble des primitives possibles',
      'La valeur initiale de la fonction',
      'Le coefficient directeur'
    ],
    correctAnswer: 1,
    explanation: 'La constante d\'intégration représente toutes les primitives possibles d\'une fonction, car elles diffèrent d\'une constante.'
  }
];

export function VideoWithQuiz({ 
  videoUrl = '/placeholder-video.mp4', 
  questions = mockQuestions,
  onQuizComplete 
}: VideoWithQuizProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes par défaut
  const [volume, setVolume] = useState(1);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Simulation du temps vidéo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // Vérifier s'il y a un quiz à afficher
          const nextQuiz = questions.find(q => 
            q.timestamp === newTime && !answeredQuestions.includes(q.id)
          );
          
          if (nextQuiz) {
            setCurrentQuiz(nextQuiz);
            setIsPlaying(false); // Pause automatique pour le quiz
          }
          
          return newTime >= duration ? duration : newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, questions, answeredQuestions, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentQuiz) return;
    
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setAnsweredQuestions(prev => [...prev, currentQuiz.id]);
    setShowExplanation(true);
  };

  const handleQuizClose = () => {
    setCurrentQuiz(null);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsPlaying(true); // Reprendre la vidéo
  };

  const progressPercentage = (currentTime / duration) * 100;
  const quizMarkers = questions.map(q => (q.timestamp / duration) * 100);

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl">
      {/* Zone vidéo principale */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        {/* Simulation d'une vraie vidéo */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              {isPlaying ? (
                <div className="text-green-400">📹 EN DIRECT</div>
              ) : (
                <Play size={32} className="ml-1" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-2">Techniques avancées d'intégration</h3>
            <p className="text-gray-300 text-sm">
              {isPlaying ? 'Visionnage en cours...' : 'Cliquez sur play pour commencer'}
            </p>
            {isPlaying && (
              <div className="mt-4 text-green-400 text-sm">
                ⏱️ {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            )}
          </div>
        </div>

        {/* Overlay quiz */}
        <AnimatePresence>
          {currentQuiz && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-10"
            >
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Quiz intégré</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">?</span>
                  </div>
                </div>
                
                {!showExplanation ? (
                  <>
                    <p className="text-gray-700 mb-4">{currentQuiz.question}</p>
                    <div className="space-y-2 mb-4">
                      {currentQuiz.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            selectedAnswer === index
                              ? 'border-blue-500 bg-blue-50 text-blue-900'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Valider ma réponse
                    </button>
                  </>
                ) : (
                  <>
                    <div className={`p-3 rounded-lg mb-4 ${
                      selectedAnswer === currentQuiz.correctAnswer
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {selectedAnswer === currentQuiz.correctAnswer ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <X size={20} className="text-red-600" />
                        )}
                        <span className={`font-medium ${
                          selectedAnswer === currentQuiz.correctAnswer ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {selectedAnswer === currentQuiz.correctAnswer ? 'Correct !' : 'Incorrect'}
                        </span>
                      </div>
                      {currentQuiz.explanation && (
                        <p className="text-sm text-gray-700">{currentQuiz.explanation}</p>
                      )}
                    </div>
                    <button
                      onClick={handleQuizClose}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Continuer la vidéo
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contrôles vidéo */}
      <div className="bg-gray-900 text-white p-4">
        {/* Barre de progression */}
        <div className="mb-3">
          <div className="relative w-full h-2 bg-gray-700 rounded-full cursor-pointer">
            {/* Progression */}
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Marqueurs de quiz */}
            {quizMarkers.map((position, index) => (
              <div
                key={index}
                className="absolute top-0 w-1 h-full bg-yellow-400 rounded-full"
                style={{ left: `${position}%` }}
                title={`Quiz à ${formatTime(questions[index].timestamp)}`}
              />
            ))}
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            
            <div className="flex items-center gap-2">
              <Volume2 size={16} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
            
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Score quiz */}
            <div className="text-sm bg-white/10 px-3 py-1 rounded-full">
              Quiz: {correctAnswers}/{answeredQuestions.length}
            </div>
            
            <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors">
              <Settings size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}








