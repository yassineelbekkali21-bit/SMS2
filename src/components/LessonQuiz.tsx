'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock, Award, RotateCcw } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonQuizProps {
  lessonTitle: string;
  questions: QuizQuestion[];
  onClose: () => void;
  onComplete: (score: number) => void;
}

export function LessonQuiz({ lessonTitle, questions, onClose, onComplete }: LessonQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  // Timer
  useState(() => {
    if (!quizStarted) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  });

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    const score = calculateScore();
    onComplete(score);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeElapsed(0);
    setQuizStarted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizStarted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl max-w-2xl w-full p-8"
        >
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Award className="w-10 h-10 text-purple-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quiz d'entraînement
            </h2>
            
            <h3 className="text-lg text-gray-700 mb-6">
              {lessonTitle}
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">~5 min</div>
                  <div className="text-sm text-gray-600">Durée estimée</div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8">
              Testez vos connaissances sur cette leçon. Vous pouvez reprendre le quiz autant de fois que vous le souhaitez.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Plus tard
              </button>
              <button
                onClick={() => setQuizStarted(true)}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
              >
                Commencer le quiz
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const isSuccess = score >= 70;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl max-w-2xl w-full p-8"
        >
          <div className="text-center">
            <div className={`p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center ${
              isSuccess ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {isSuccess ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <RotateCcw className="w-10 h-10 text-orange-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isSuccess ? 'Félicitations !' : 'Continuez vos efforts !'}
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${isSuccess ? 'text-green-600' : 'text-orange-600'}`}>
                    {score}%
                  </div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedAnswers.filter((answer, i) => answer === questions[i].correctAnswer).length}/{questions.length}
                  </div>
                  <div className="text-sm text-gray-600">Bonnes réponses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-gray-600">Temps</div>
                </div>
              </div>
            </div>
            
            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-green-800 font-medium">
                  🎉 Excellent travail ! Vous maîtrisez bien cette leçon.
                </p>
                <p className="text-green-700 text-sm mt-1">
                  +10 XP gagnés pour ce quiz réussi !
                </p>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <p className="text-orange-800 font-medium">
                  💪 Pas mal ! Révisez la leçon et retentez le quiz.
                </p>
                <p className="text-orange-700 text-sm mt-1">
                  Il faut au moins 70% pour valider la leçon.
                </p>
              </div>
            )}
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={restartQuiz}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recommencer</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Quiz d'entraînement</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Progression */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} sur {questions.length}</span>
            <span>{Math.round(progress)}% complété</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`
                  w-full text-left p-4 rounded-xl border-2 transition-all
                  ${selectedAnswer === index
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                `}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${selectedAnswer === index
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                    }
                  `}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`
                px-6 py-3 rounded-xl font-medium transition-colors
                ${currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              Précédent
            </button>

            <div className="text-sm text-gray-500">
              {selectedAnswer !== undefined ? '✓ Réponse sélectionnée' : 'Choisissez une réponse'}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedAnswer === undefined}
              className={`
                px-6 py-3 rounded-xl font-medium transition-colors
                ${selectedAnswer === undefined
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                }
              `}
            >
              {currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}









