'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Settings, Maximize2, Minimize2, 
  CheckCircle, X, SkipBack, SkipForward, BookOpen, Brain, 
  HelpCircle, FileText, MessageSquare, ChevronLeft
} from 'lucide-react';
import { LogoIntro } from './landing/logo-intro';

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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes par défaut
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // SMS premium intro sound - Trajectory + Fixation
  // Design: Micro whoosh (étoile filante) + Impact doux mat (logo se pose)
  // Durée: ~500ms | Fréquences: médiums/hauts médiums | Volume: modéré
  const playIntroSound = useCallback(async () => {
    console.log('🔊 Playing SMS premium intro sound...');
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('AudioContext not supported');
        return;
      }
      
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
        console.log('🎵 AudioContext resumed');
      }
      
      console.log('🎵 AudioContext ready, state:', ctx.state);
      const now = ctx.currentTime;

      // Master gain - Moderate volume (never dominant)
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.35, now);

      // ========== PHASE 1: TRAJECTORY (Micro Whoosh) ==========
      // Fine, subtle whoosh representing the star's path
      // Duration: ~250ms | Frequency: High-mid bandpass
      
      // Whoosh - Filtered white noise with frequency sweep
      const whooshBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const whooshData = whooshBuffer.getChannelData(0);
      for (let i = 0; i < whooshBuffer.length; i++) {
        // Shaped noise - softer attack, natural decay
        const envelope = Math.sin((i / whooshBuffer.length) * Math.PI) * 0.8;
        whooshData[i] = (Math.random() * 2 - 1) * envelope;
      }
      const whoosh = ctx.createBufferSource();
      whoosh.buffer = whooshBuffer;
      
      // Bandpass filter - High-mid frequencies (no harsh highs)
      const whooshFilter = ctx.createBiquadFilter();
      whooshFilter.type = 'bandpass';
      whooshFilter.frequency.setValueAtTime(3500, now);
      whooshFilter.frequency.exponentialRampToValueAtTime(1200, now + 0.25); // Sweep down
      whooshFilter.Q.setValueAtTime(2, now);
      
      const whooshGain = ctx.createGain();
      whooshGain.gain.setValueAtTime(0, now);
      whooshGain.gain.linearRampToValueAtTime(0.4, now + 0.05); // Quick fade in
      whooshGain.gain.linearRampToValueAtTime(0.3, now + 0.15);
      whooshGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      
      whoosh.connect(whooshFilter);
      whooshFilter.connect(whooshGain);
      whooshGain.connect(masterGain);
      whoosh.start(now);
      whoosh.stop(now + 0.3);

      // Subtle tonal sweep accompanying the whoosh
      const sweepOsc = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweepOsc.type = 'sine';
      sweepOsc.frequency.setValueAtTime(800, now);
      sweepOsc.frequency.exponentialRampToValueAtTime(400, now + 0.2);
      sweepGain.gain.setValueAtTime(0, now);
      sweepGain.gain.linearRampToValueAtTime(0.08, now + 0.03);
      sweepGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      sweepOsc.connect(sweepGain);
      sweepGain.connect(masterGain);
      sweepOsc.start(now);
      sweepOsc.stop(now + 0.22);

      // ========== PHASE 2: FIXATION (Soft Matte Impact) ==========
      // Precise, calm landing - logo settles into place
      // Starts at ~200ms, Duration: ~300ms
      
      // Impact body - Soft, matte thud (mid frequencies, no bass boom)
      const impactOsc = ctx.createOscillator();
      const impactGain = ctx.createGain();
      impactOsc.type = 'sine';
      impactOsc.frequency.setValueAtTime(280, now + 0.2); // Mid-low, not bass-heavy
      impactOsc.frequency.exponentialRampToValueAtTime(180, now + 0.35);
      impactGain.gain.setValueAtTime(0, now);
      impactGain.gain.linearRampToValueAtTime(0.5, now + 0.205); // Sharp attack
      impactGain.gain.exponentialRampToValueAtTime(0.01, now + 0.42);
      impactOsc.connect(impactGain);
      impactGain.connect(masterGain);
      impactOsc.start(now + 0.2);
      impactOsc.stop(now + 0.45);

      // Harmonic overtone - Adds warmth and precision
      const harmOsc = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harmOsc.type = 'triangle';
      harmOsc.frequency.setValueAtTime(560, now + 0.2); // 2nd harmonic
      harmGain.gain.setValueAtTime(0, now);
      harmGain.gain.linearRampToValueAtTime(0.15, now + 0.21);
      harmGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      harmOsc.connect(harmGain);
      harmGain.connect(masterGain);
      harmOsc.start(now + 0.2);
      harmOsc.stop(now + 0.42);

      // Subtle "settle" resonance - The logo finding its place
      const settleOsc = ctx.createOscillator();
      const settleGain = ctx.createGain();
      settleOsc.type = 'sine';
      settleOsc.frequency.setValueAtTime(440, now + 0.25); // A4 - Calm, focused
      settleGain.gain.setValueAtTime(0, now);
      settleGain.gain.linearRampToValueAtTime(0.2, now + 0.28);
      settleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
      settleOsc.connect(settleGain);
      settleGain.connect(masterGain);
      settleOsc.start(now + 0.25);
      settleOsc.stop(now + 0.55);

      console.log('🎵 Premium SMS sound started - Trajectory + Fixation');

      // Cleanup
      setTimeout(() => {
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      }, 800);
    } catch (e) {
      console.error('Audio error:', e);
    }
  }, []);

  // Widget definitions
  const widgets = [
    { id: 'essentials', icon: BookOpen, label: 'Essentiels' },
    { id: 'quiz', icon: Brain, label: 'Quiz' },
    { id: 'qa', icon: HelpCircle, label: 'Q&A' },
    { id: 'resources', icon: FileText, label: 'Ressources' },
    { id: 'notes', icon: MessageSquare, label: 'Notes' }
  ];

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Fullscreen handler
  const toggleFullScreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch((err) => {
        console.error('Erreur fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle intro completion
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setIntroCompleted(true);
    setIsPlaying(true);
  }, []);

  // Auto-complete intro after 3 seconds as fallback
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        handleIntroComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showIntro, handleIntroComplete]);

  // Auto fullscreen when playing
  const handlePlayPause = useCallback(() => {
    if (!isPlaying && !isFullScreen) {
      // Going to play - enter fullscreen
      toggleFullScreen();
      
      // Show intro only on first play
      if (!introCompleted) {
        setShowIntro(true);
        // Play sound immediately when intro starts
        setTimeout(() => {
          playIntroSound();
        }, 300); // Small delay for the star to start moving
        return;
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, isFullScreen, toggleFullScreen, introCompleted, playIntroSound]);

  // Skip forward/backward
  const skipForward = () => setCurrentTime(prev => Math.min(prev + 10, duration));
  const skipBackward = () => setCurrentTime(prev => Math.max(prev - 10, 0));

  // Toggle mute
  const toggleMute = () => setIsMuted(!isMuted);

  // Widget content renderer
  const renderWidgetContent = (widgetId: string) => {
    switch (widgetId) {
      case 'essentials':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Points essentiels</h3>
            <ul className="space-y-3">
              {['Définition de la dérivée', 'Règle de dérivation en chaîne', 'Applications pratiques'].map((point, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'quiz':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Quiz de la leçon</h3>
            <p className="text-gray-600">3 questions pour tester votre compréhension</p>
            <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Commencer le quiz
            </button>
          </div>
        );
      case 'qa':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Questions & Réponses</h3>
            <div className="space-y-3">
              {['Comment appliquer cette formule ?', 'Quelle est la différence avec...?'].map((q, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{q}</p>
                  <p className="text-xs text-gray-500 mt-1">12 réponses</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'resources':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Ressources</h3>
            <div className="space-y-2">
              {['Slides du cours (PDF)', 'Exercices corrigés', 'Formulaire'].map((res, i) => (
                <button key={i} className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <FileText size={18} className="text-gray-600" />
                  <span className="text-gray-700">{res}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Mes notes</h3>
            <textarea 
              className="w-full h-40 p-3 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Prenez vos notes ici..."
            />
            <button className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Sauvegarder
            </button>
          </div>
        );
      default:
        return null;
    }
  };

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
    <div 
      ref={containerRef}
      className={`relative w-full bg-black overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50 flex flex-col' : 'rounded-2xl shadow-2xl'}`}
    >
      {/* Logo Intro Animation - Same as Landing Page */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-[100] bg-[#0a0a0f]"
          >
            <div className="flex items-center justify-center w-full h-full" style={{ transform: 'scale(1.5)' }}>
              <LogoIntro 
                variant="star-shoot"
                autoPlay={true}
                loop={false}
                darkMode={true}
                onComplete={handleIntroComplete}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header fullscreen - Premium minimal */}
      {isFullScreen && (
        <div className="absolute top-0 left-0 right-0 z-30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleFullScreen}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Minimize2 size={18} className="text-white" />
              </button>
              <div>
                <h2 style={{ color: '#ffffff' }} className="font-semibold text-lg">Techniques avancées d'intégration</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }} className="text-sm">Leçon 3 • Ondes mécaniques</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layout principal en fullscreen: Video + Sidebar côte à côte */}
      <div className={`flex ${isFullScreen ? 'flex-1 h-[calc(100vh-100px)]' : ''}`}>
        {/* Zone vidéo principale - Cliquable pour play/pause */}
        <div 
          className={`relative bg-black flex items-center justify-center cursor-pointer group transition-all duration-500 ease-out ${
            isFullScreen 
              ? activeWidget ? 'flex-1' : 'w-full' 
              : 'aspect-video w-full'
          }`}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('.widget-area')) return;
            if (!currentQuiz) handlePlayPause();
          }}
        >
          {/* Background animé subtil */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          
          {/* Contenu vidéo */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="text-center text-white">
              {!isPlaying ? (
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 border-2 border-white/30 rounded-full flex items-center justify-center transition-all group-hover:border-white/60 group-hover:scale-105"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={32} className="ml-1 text-white" />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                >
                  <div className="flex items-center gap-1">
                    {[8, 12, 16, 10, 14].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-white rounded-full"
                        animate={{ height: [h, h * 1.5, h] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              {!isFullScreen && (
                <>
                  <h3 className="text-base font-medium mb-1 text-white/90">Techniques avancées d'intégration</h3>
                  <p className="text-white/50 text-sm">
                    {isPlaying ? `${formatTime(currentTime)} / ${formatTime(duration)}` : 'Cliquez pour commencer'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Widgets flottants - Design premium vertical */}
          {isFullScreen && !activeWidget && (
            <div className="widget-area absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
              {widgets.map((widget) => (
                <button
                  key={widget.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveWidget(widget.id);
                  }}
                  onMouseEnter={() => setHoveredWidget(widget.id)}
                  onMouseLeave={() => setHoveredWidget(null)}
                  className="relative flex items-center"
                >
                  {/* Label - UNIQUEMENT visible au hover de CE widget */}
                  {hoveredWidget === widget.id && (
                    <span className="pointer-events-none absolute right-full mr-4 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap bg-[#48c6ed] text-white shadow-xl">
                      {widget.label}
                    </span>
                  )}
                  {/* Icône - Couleur thème uniquement au hover */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    hoveredWidget === widget.id
                      ? 'bg-[#48c6ed] text-white border border-[#48c6ed]'
                      : 'bg-white/10 border border-white/20 text-white/70'
                  }`}>
                    <widget.icon size={18} />
                  </div>
                </button>
              ))}
        </div>
          )}

        {/* Overlay quiz */}
        <AnimatePresence>
          {currentQuiz && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-40"
            >
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Quiz intégré</h3>
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">?</span>
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
                                ? 'border-gray-900 bg-gray-900 text-white'
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
                        className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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

        {/* Sidebar pour le contenu des widgets - Design premium */}
        <AnimatePresence>
        {isFullScreen && activeWidget && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[400px] h-full bg-white flex flex-col border-l border-gray-100"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            {/* Header sidebar - Élégant */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-4">
                {(() => {
                  const widget = widgets.find(w => w.id === activeWidget);
                  const IconComp = widget?.icon || BookOpen;
                  return (
                    <>
                      <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                        <IconComp size={18} className="text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-lg">{widget?.label}</span>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveWidget(null);
                }}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer z-50"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            {/* Contenu sidebar - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              {renderWidgetContent(activeWidget)}
            </div>
          </motion.div>
        )}
        </AnimatePresence>

      </div>

      {/* Contrôles vidéo - Design premium */}
      <div className={`text-white ${isFullScreen ? 'absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm py-4 px-6' : 'bg-gray-900 p-4'}`}>
        {/* Barre de progression - Premium */}
        <div className={`${isFullScreen ? 'mb-4' : 'mb-3'}`}>
          <div 
            className={`relative w-full bg-white/20 rounded-full cursor-pointer group transition-all ${isFullScreen ? 'h-1 hover:h-1.5' : 'h-1 hover:h-2'}`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              setCurrentTime(Math.floor(percent * duration));
            }}
          >
            {/* Progression */}
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Point de progression */}
            <div 
              className="absolute top-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              style={{ left: `${progressPercentage}%`, transform: 'translate(-50%, -50%)' }}
            />
            {/* Marqueurs de quiz */}
            {quizMarkers.map((position, index) => (
              <div
                key={index}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#48c6ed] rounded-full"
                style={{ left: `${position}%` }}
                title={`Quiz à ${formatTime(questions[index].timestamp)}`}
              />
            ))}
          </div>
        </div>

        {/* Contrôles - Premium minimal */}
        <div className="flex items-center justify-between">
          {/* Gauche: Play, Skip, Volume, Temps */}
          <div className="flex items-center gap-3">
            {/* Skip backward */}
            <button
              onClick={skipBackward}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
              title="-10s"
            >
              <SkipBack size={18} className="text-white/80" />
            </button>
            
            {/* Play/Pause - Plus grand et central */}
            <button
              onClick={handlePlayPause}
              className={`flex items-center justify-center transition-all ${
                isFullScreen 
                  ? 'w-12 h-12 bg-white rounded-full hover:scale-105' 
                  : 'w-10 h-10 bg-white/10 rounded-full hover:bg-white/20'
              }`}
            >
              {isPlaying 
                ? <Pause size={isFullScreen ? 22 : 20} className={isFullScreen ? 'text-gray-900' : 'text-white'} /> 
                : <Play size={isFullScreen ? 22 : 20} className={`ml-0.5 ${isFullScreen ? 'text-gray-900' : 'text-white'}`} />
              }
            </button>
            
            {/* Skip forward */}
            <button
              onClick={skipForward}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
              title="+10s"
            >
              <SkipForward size={18} className="text-white/80" />
            </button>
            
            {/* Volume */}
            <div className="flex items-center gap-2 ml-3">
              <button
                onClick={toggleMute}
                className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} className="text-white/80" /> : <Volume2 size={18} className="text-white/80" />}
              </button>
              <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Temps */}
            <span className="text-sm ml-3 text-white/70 font-medium tabular-nums">
              {formatTime(currentTime)} <span className="text-white/40">/</span> {formatTime(duration)}
            </span>
          </div>

          {/* Droite: Score, Vitesse, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Score quiz */}
            {answeredQuestions.length > 0 && (
              <div className="text-sm bg-white/10 px-3 py-1.5 rounded-lg font-medium">
              Quiz: {correctAnswers}/{answeredQuestions.length}
              </div>
            )}
            
            {/* Vitesse de lecture */}
            <div className="relative">
              <button 
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-3 py-1.5 text-sm font-medium hover:bg-white/10 rounded-lg transition-colors text-white/80"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl overflow-hidden shadow-2xl py-1 min-w-[80px]">
                  {speedOptions.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setPlaybackSpeed(speed);
                        setShowSpeedMenu(false);
                      }}
                      className={`block w-full px-4 py-2 text-sm text-left transition-colors ${
                        playbackSpeed === speed 
                          ? 'bg-gray-900 text-white font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Settings */}
            <button className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors">
              <Settings size={18} className="text-white/80" />
            </button>
            
            {/* Fullscreen - Visible seulement si pas en fullscreen */}
            {!isFullScreen && (
              <button 
                onClick={toggleFullScreen}
                className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
              >
                <Maximize2 size={18} className="text-white/80" />
            </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}








