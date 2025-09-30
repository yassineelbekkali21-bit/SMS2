'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw,
  Trophy,
  Target,
  Brain
} from 'lucide-react';

export interface MiniQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface MiniQuizProps {
  questions: MiniQuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
  onClose: () => void;
  courseTitle: string;
  existingScore?: { score: number; total: number };
  showDiagnosticImmediately?: boolean;
}

export function MiniQuiz({ questions, onComplete, onClose, courseTitle, existingScore, showDiagnosticImmediately }: MiniQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [isComplete, setIsComplete] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Initialiser directement au diagnostic si demandé
  React.useEffect(() => {
    if (showDiagnosticImmediately && existingScore) {
      setQuizCompleted(true);
      setIsComplete(false); // On va directement au mode "quiz terminé"
    }
  }, [showDiagnosticImmediately, existingScore]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        } else {
          // Quiz terminé - afficher le diagnostic
          setIsComplete(true);
          setShowDiagnostic(true);
          const score = answers.reduce((acc, answer, index) => {
            return acc + (answer === questions[index].correctAnswer ? 1 : 0);
          }, 0);
          onComplete(score, questions.length);
          
          // Fermer automatiquement le diagnostic après 2 secondes
          setTimeout(() => {
            setShowDiagnostic(false);
            setQuizCompleted(true);
          }, 2000);
        }
      }, 2000);
    }
  };

  const handleViewDiagnostic = () => {
    setShowDiagnostic(true);
    setIsComplete(true); // Nécessaire pour afficher l'écran de diagnostic
    setQuizCompleted(false); // Sortir du mode "quiz terminé"
  };

  const handleCloseDiagnostic = () => {
    setShowDiagnostic(false);
    setIsComplete(false);
    setQuizCompleted(true); // Retourner au mode "quiz terminé"
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers(new Array(questions.length).fill(null));
    setIsComplete(false);
    setShowDiagnostic(false);
    setQuizCompleted(false);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers(new Array(questions.length).fill(null));
    setIsComplete(false);
  };

  const calculateScore = () => {
    // Si on a un score existant (mode diagnostic), l'utiliser
    if (existingScore) {
      return existingScore.score;
    }
    // Sinon, calculer à partir des réponses
    return answers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    const wrongAnswers = total - score;
    
    if (percentage >= 80) {
      return { 
        message: "Excellent niveau ! 🎯", 
        color: "text-green-600", 
        bg: "bg-green-50",
        diagnosis: "Vous maîtrisez déjà bien les bases. Ce cours vous permettra d'approfondir et de structurer vos connaissances.",
        recommendation: "Idéal pour viser l'excellence"
      };
    }
    if (percentage >= 60) {
      return { 
        message: "Bases solides 💪", 
        color: "text-blue-600", 
        bg: "bg-blue-50",
        diagnosis: `Vous avez de bonnes bases mais ${wrongAnswers} point${wrongAnswers > 1 ? 's' : ''} à consolider. Ce cours comblera parfaitement vos lacunes.`,
        recommendation: "Progression assurée avec ce cours"
      };
    }
    if (percentage >= 40) {
      return { 
        message: "Potentiel à développer 🌱", 
        color: "text-yellow-600", 
        bg: "bg-yellow-50",
        diagnosis: `Quelques notions acquises mais ${wrongAnswers} concepts fondamentaux à maîtriser. Ce cours vous donnera les clés de la réussite.`,
        recommendation: "Ce cours est fait pour vous accompagner"
      };
    }
    return { 
      message: "Nouveau départ 🚀", 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      diagnosis: "Pas d'inquiétude ! Nous partons des fondamentaux. Ce test révèle simplement que ce cours vous sera particulièrement bénéfique.",
      recommendation: "Investissement stratégique pour votre réussite"
    };
  };

  const getDiagnosticInfo = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    const wrongAnswers = total - score;
    
    if (percentage >= 80) {
      return { 
        message: "📈 Niveau confirmé - Prêt pour l'excellence", 
        color: "text-green-600", 
        bg: "bg-green-50",
        verdict: "✅ RECOMMANDÉ",
        reasoning: "Même avec votre excellent niveau, ce cours vous apportera la structure et les subtilités nécessaires pour briller aux examens.",
        urgency: "Perfectionnement stratégique",
        examPreparation: "Ce cours vous donnera l'avantage décisif pour les 20% de questions les plus complexes de l'examen final."
      };
    }
    if (percentage >= 60) {
      return { 
        message: "⚡ Bases solides - Quelques zones d'ombre à éclaircir", 
        color: "text-blue-600", 
        bg: "bg-blue-50",
        verdict: "🎯 FORTEMENT RECOMMANDÉ",
        reasoning: `Attention ! ${wrongAnswers} question${wrongAnswers > 1 ? 's' : ''} ratée${wrongAnswers > 1 ? 's' : ''} = ${wrongAnswers * 20}% de votre note d'examen en danger.`,
        urgency: "Action recommandée maintenant",
        examPreparation: "Ce cours comblera précisément les lacunes qui peuvent vous coûter votre mention."
      };
    }
    if (percentage >= 40) {
      return { 
        message: "🚨 Alerte : Lacunes importantes détectées", 
        color: "text-orange-600", 
        bg: "bg-orange-50",
        verdict: "🔥 URGENT - COURS INDISPENSABLE",
        reasoning: `${wrongAnswers} questions ratées sur ${total} = risque d'échec élevé. Ces concepts sont FONDAMENTAUX pour votre examen.`,
        urgency: "Intervention immédiate nécessaire",
        examPreparation: "Sans ce cours, vous risquez de ne pas valider cette matière. Ces questions reflètent le niveau minimum requis."
      };
    }
    return { 
      message: "💀 Niveau critique - Échec programmé sans action", 
      color: "text-red-600", 
      bg: "bg-red-50",
      verdict: "🆘 CRITIQUE - COURS VITAL",
      reasoning: `Score de ${percentage.toFixed(0)}% = échec quasi-certain à l'examen. Ces questions représentent le strict minimum universitaire.`,
      urgency: "URGENCE ABSOLUE",
      examPreparation: "SANS ce cours, l'échec est presque garanti. Chaque jour de retard diminue vos chances de rattrapage."
    };
  };

  // Vérifications de sécurité
  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz non disponible</h3>
          <p className="text-gray-600 mb-6">Aucune question n'est disponible pour ce cours pour le moment.</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  if (!currentQ) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Erreur de quiz</h3>
          <p className="text-gray-600 mb-6">Une erreur s'est produite lors du chargement de la question.</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQ.correctAnswer;
  const score = calculateScore();
  const totalQuestions = existingScore ? existingScore.total : questions.length;
  const scoreInfo = getScoreMessage(score, totalQuestions);
  const diagnosticInfo = getDiagnosticInfo(score, totalQuestions);

  if (isComplete && showDiagnostic) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed inset-0 bg-white flex z-50"
      >
        <div 
          className="w-full h-full overflow-y-auto"
        >
        {/* Header avec score */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-100 relative">
          {/* Bouton fermer */}
          <button
            onClick={handleCloseDiagnostic}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <motion.div 
            className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Test Terminé
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Voici votre profil de compétences en <span className="font-semibold text-gray-800">{courseTitle}</span>
          </motion.p>
        </div>
        
        {/* Dashboard de résultats avec padding généreux */}
        <div className="p-12 space-y-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score principal */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full ${scoreInfo.bg} flex items-center justify-center mx-auto mb-4 ring-4 ring-white shadow-lg`}>
                <span className="text-3xl">📊</span>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-1">{score}<span className="text-2xl text-gray-500">/{totalQuestions}</span></div>
                <div className={`text-lg font-semibold mb-2 ${diagnosticInfo.color}`}>
                  {diagnosticInfo.message}
                </div>
                <div className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${diagnosticInfo.bg} ${diagnosticInfo.color} border-2 border-current`}>
                  {diagnosticInfo.verdict}
                </div>
              </div>
              
              {/* Barre de progression circulaire */}
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    className="text-indigo-500"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 40 * (1 - (score / questions.length))
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">
                    {Math.round((score / questions.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Diagnostic Stratégique - Version Lisible */}
          <motion.div 
            className="bg-white border-2 border-blue-200 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Header avec icône */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="text-xl font-bold text-white">Diagnostic Stratégique</h4>
              </div>
            </div>
            
            {/* Contenu principal avec padding généreux */}
            <div className="p-8 space-y-6">
              {/* Analyse principale */}
              <div>
                <h5 className="text-lg font-semibold text-gray-900 mb-3">📊 Analyse de votre performance</h5>
                <p className="text-gray-700 text-base leading-relaxed mb-4">{diagnosticInfo.reasoning}</p>
              </div>
              
              {/* Sections organisées verticalement */}
              <div className="space-y-4">
                <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">⏰</span>
                    <div className="flex-1">
                      <h6 className="font-semibold text-orange-800 text-base mb-2">Niveau d'urgence</h6>
                      <p className="text-orange-700 text-base leading-relaxed">{diagnosticInfo.urgency}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">📚</span>
                    <div className="flex-1">
                      <h6 className="font-semibold text-red-800 text-base mb-2">Impact sur l'examen final</h6>
                      <p className="text-red-700 text-base leading-relaxed">{diagnosticInfo.examPreparation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>

        {/* Section des statistiques avec padding */}
        <div className="p-12 border-t border-gray-100 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Concepts maîtrisés</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-500">{questions.length - score}</div>
              <div className="text-sm text-gray-600">Points à renforcer</div>
            </div>
          </div>

          {/* Analyse détaillée des lacunes */}
          {questions.length - score > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6 text-left">
              <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <span className="text-orange-600">⚠️</span>
                Concepts à renforcer
              </h4>
              <div className="space-y-2">
                {answers.map((answer, index) => (
                  answer !== questions[index].correctAnswer && (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-100 rounded-lg">
                      <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-orange-800 text-sm font-medium mb-1">
                          {questions[index].question}
                        </p>
                        <p className="text-orange-700 text-xs">
                          💡 {questions[index].explanation}
                        </p>
                      </div>
                    </div>
                  )
                ))}
              </div>
              <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                <p className="text-orange-700 text-sm">
                  <strong>Bonne nouvelle :</strong> Ce cours couvre exactement ces points ! 
                  Vous saurez où concentrer vos efforts pour une progression optimale.
                </p>
              </div>
            </div>
          )}

        {/* Actions finales */}
        <div className="p-12 border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto">
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={handleRetakeQuiz}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-3 py-5 px-8 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white border border-gray-200 transition-all duration-200 shadow-sm text-base font-medium"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refaire l'évaluation
          </motion.button>
          
          <motion.button
            onClick={handleCloseDiagnostic}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 flex items-center justify-center gap-3 py-5 px-8 text-white rounded-xl transition-all duration-200 shadow-lg font-semibold text-base ${
              diagnosticInfo.verdict.includes('CRITIQUE') || diagnosticInfo.verdict.includes('URGENT') 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-200/50' 
                : diagnosticInfo.verdict.includes('FORTEMENT')
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-200/50'
                : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-indigo-200/50'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {diagnosticInfo.verdict.includes('CRITIQUE') || diagnosticInfo.verdict.includes('URGENT') 
              ? '🆘 Sauver mon année - Débloquer le cours' 
              : diagnosticInfo.verdict.includes('FORTEMENT')
              ? '🎯 Sécuriser ma réussite - Voir le cours'
              : '✨ Viser l\'excellence - Explorer le cours'
            }
          </motion.button>
        </motion.div>
        </div>
        </div>
        </div>
        </div>
      </motion.div>
    );
  }

  // État final après fermeture du diagnostic
  if (quizCompleted) {
    const score = calculateScore();
    const totalQuestions = existingScore ? existingScore.total : questions.length;
    const scoreInfo = getScoreMessage(score, totalQuestions);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 text-center"
        >
          <div className={`w-16 h-16 rounded-full ${scoreInfo.bg} flex items-center justify-center mx-auto mb-4`}>
            <span className="text-2xl">🎯</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz terminé !</h3>
          <p className="text-gray-600 mb-6">Votre score : <span className="font-bold text-gray-900">{score}/{totalQuestions}</span></p>
          
          <div className="space-y-3">
            <motion.button
              onClick={handleViewDiagnostic}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 11H1v2h8v8h2v-8h8v-2h-8V3H9v8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              📊 Revoir mon diagnostic
            </motion.button>
            
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Fermer
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Barre de progression moderne */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Question {currentQuestion + 1} sur {questions.length}</p>
              <p className="text-xs text-gray-500">Progression de votre évaluation</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</p>
            <p className="text-xs text-gray-500">Complété</p>
          </div>
        </div>
        
        {/* Barre de progression fluide */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          {/* Points de progression */}
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {Array.from({ length: questions.length }, (_, i) => (
              <div 
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i <= currentQuestion 
                    ? 'bg-white shadow-sm' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Carte de question moderne */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100/50 ring-1 ring-black/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header de question avec difficulté */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Question d'évaluation</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  currentQ.difficulty === 'easy' ? 'bg-emerald-400' :
                  currentQ.difficulty === 'medium' ? 'bg-blue-400' :
                  'bg-purple-400'
                }`} />
                <span className="text-xs font-medium text-gray-500">
                  {currentQ.difficulty === 'easy' ? 'Niveau accessible' : 
                   currentQ.difficulty === 'medium' ? 'Niveau intermédiaire' : 'Niveau avancé'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Question principale */}
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-gray-900 leading-relaxed mb-3">
            {currentQ.question}
          </h3>
          
          {/* Options de réponse */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                whileHover={!showResult ? { scale: 1.005, y: -1 } : {}}
                whileTap={!showResult ? { scale: 0.995 } : {}}
                transition={{ duration: 0.2 }}
                className={`group relative w-full p-5 text-left rounded-xl transition-all duration-300 ${
                  showResult
                    ? index === currentQ.correctAnswer
                      ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 shadow-sm'
                      : selectedAnswer === index
                      ? 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 shadow-sm'
                      : 'bg-gray-50/50 border-2 border-gray-100 text-gray-400'
                    : selectedAnswer === index
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md'
                    : 'bg-white/80 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      showResult
                        ? index === currentQ.correctAnswer
                          ? 'border-emerald-500 bg-emerald-500'
                          : selectedAnswer === index
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                        : selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {(showResult && index === currentQ.correctAnswer) || (!showResult && selectedAnswer === index) ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : null}
                    </div>
                    <span className={`font-medium ${
                      showResult && selectedAnswer === index && index !== currentQ.correctAnswer
                        ? 'text-red-700'
                        : showResult && index === currentQ.correctAnswer
                        ? 'text-emerald-700'
                        : selectedAnswer === index
                        ? 'text-blue-700'
                        : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </div>
                  
                  {/* Icônes de résultat */}
                  {showResult && (
                    <div className="flex-shrink-0">
                      {index === currentQ.correctAnswer ? (
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-emerald-600" size={18} />
                        </div>
                      ) : selectedAnswer === index ? (
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <XCircle className="text-red-600" size={18} />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Explication après réponse */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-xl mb-6 ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? 
                <CheckCircle className="text-green-600 mt-0.5" size={20} /> :
                <XCircle className="text-red-600 mt-0.5" size={20} />
              }
              <div>
                <div className={`font-medium mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct ! 🎉' : 'Incorrect 😔'}
                </div>
                <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation moderne */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50">
        <motion.button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          whileHover={currentQuestion === 0 ? {} : { scale: 1.05 }}
          whileTap={currentQuestion === 0 ? {} : { scale: 0.95 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            currentQuestion === 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Précédent
        </motion.button>

        {/* Indicateurs de progression minimalistes */}
        <div className="flex items-center gap-2">
          {questions.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < currentQuestion 
                  ? 'bg-emerald-500 shadow-sm' 
                  : index === currentQuestion 
                  ? 'bg-indigo-500 shadow-sm ring-2 ring-indigo-200' 
                  : 'bg-gray-200'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          whileHover={selectedAnswer === null ? {} : { scale: 1.05 }}
          whileTap={selectedAnswer === null ? {} : { scale: 0.95 }}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
            selectedAnswer === null
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-indigo-200/50'
          }`}
        >
          {currentQuestion === questions.length - 1 ? 'Terminer l\'évaluation' : 'Question suivante'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
