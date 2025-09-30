'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Filter,
  Search,
  Clock,
  User,
  CheckCircle,
  Pin,
  MoreVertical,
  Heart,
  BookOpen,
  TrendingUp,
  Users,
  Star,
  Zap,
  Eye,
  Reply
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface QAQuestion {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  question: string;
  timestamp: number; // Moment dans la vidéo où la question a été posée
  createdAt: Date;
  likes: number;
  dislikes: number;
  isAnswered: boolean;
  isPinned: boolean;
  isPopular: boolean; // Question avec beaucoup de likes
  answers: QAAnswer[];
  tags: string[];
  userLiked?: boolean;
  userDisliked?: boolean;
}

interface QAAnswer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isInstructor: boolean;
  answer: string;
  createdAt: Date;
  likes: number;
  isAccepted: boolean; // Marquée comme réponse correcte par l'instructeur
  userLiked?: boolean;
}

interface LessonQAProps {
  lessonId: string;
  currentVideoTime: number;
  onSeekToQuestion: (timestamp: number) => void;
  isInstructor?: boolean;
}

// Mock data pour la démo
const mockQuestions: QAQuestion[] = [
  {
    id: '1',
    lessonId: '1',
    userId: 'user1',
    userName: 'Marie Dubois',
    userAvatar: '',
    question: 'Pourquoi utilise-t-on la règle de L\'Hôpital seulement pour les formes indéterminées ?',
    timestamp: 245,
    createdAt: new Date(Date.now() - 3600000),
    likes: 12,
    dislikes: 0,
    isAnswered: true,
    isPinned: true,
    isPopular: true,
    userLiked: false,
    answers: [
      {
        id: 'a1',
        questionId: '1',
        userId: 'instructor',
        userName: 'Prof. Martin',
        isInstructor: true,
        answer: 'Excellente question ! La règle de L\'Hôpital ne s\'applique que pour les formes indéterminées car c\'est seulement dans ces cas que les limites des dérivées nous donnent une information utile. Pour les autres formes, on peut calculer directement la limite.',
        createdAt: new Date(Date.now() - 3300000),
        likes: 8,
        isAccepted: true,
        userLiked: false
      }
    ],
    tags: ['règle-lhopital', 'limites', 'formes-indéterminées']
  },
  {
    id: '2',
    lessonId: '1',
    userId: 'user2',
    userName: 'Thomas Chen',
    question: 'Comment savoir si une fonction est continue en un point sans calculer la limite ?',
    timestamp: 180,
    createdAt: new Date(Date.now() - 1800000),
    likes: 5,
    dislikes: 0,
    isAnswered: false,
    isPinned: false,
    isPopular: false,
    answers: [],
    tags: ['continuité', 'fonctions'],
    userLiked: true
  },
  {
    id: '3',
    lessonId: '1',
    userId: 'user3',
    userName: 'Sophie Laurent',
    question: 'Y a-t-il une méthode systématique pour factoriser les expressions dans le calcul de limites ?',
    timestamp: 320,
    createdAt: new Date(Date.now() - 900000),
    likes: 8,
    dislikes: 1,
    isAnswered: true,
    isPinned: false,
    isPopular: false,
    answers: [
      {
        id: 'a2',
        questionId: '3',
        userId: 'user4',
        userName: 'Alex Rivera',
        isInstructor: false,
        answer: 'Je recommande de d\'abord chercher les facteurs communs, puis d\'utiliser les identités remarquables comme a²-b² = (a+b)(a-b)',
        createdAt: new Date(Date.now() - 600000),
        likes: 3,
        isAccepted: false,
        userLiked: false
      }
    ],
    tags: ['factorisation', 'limites', 'méthode']
  }
];

export function LessonQA({ 
  lessonId, 
  currentVideoTime, 
  onSeekToQuestion, 
  isInstructor = false 
}: LessonQAProps) {
  const [questions, setQuestions] = useState<QAQuestion[]>(mockQuestions);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState<{ [questionId: string]: string }>({});
  const [filter, setFilter] = useState<'all' | 'answered' | 'unanswered' | 'popular' | 'pinned'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [selectedQuestionForAnswer, setSelectedQuestionForAnswer] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const filteredQuestions = questions
    .filter(q => {
      if (filter === 'answered') return q.isAnswered;
      if (filter === 'unanswered') return !q.isAnswered;
      if (filter === 'popular') return q.isPopular;
      if (filter === 'pinned') return q.isPinned;
      return true;
    })
    .filter(q => 
      searchTerm === '' || 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      // Tri : épinglées d'abord, puis par popularité, puis par date
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return;

    const question: QAQuestion = {
      id: Date.now().toString(),
      lessonId,
      userId: 'current-user',
      userName: 'Vous',
      question: newQuestion,
      timestamp: Math.floor(currentVideoTime),
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      isAnswered: false,
      isPinned: false,
      isPopular: false,
      answers: [],
      tags: [],
      userLiked: false,
      userDisliked: false
    };

    setQuestions(prev => [question, ...prev]);
    setNewQuestion('');
    setShowQuestionForm(false);
  };

  const handleSubmitAnswer = (questionId: string) => {
    const answerText = newAnswer[questionId];
    if (!answerText?.trim()) return;

    const answer: QAAnswer = {
      id: Date.now().toString(),
      questionId,
      userId: 'current-user',
      userName: isInstructor ? 'Prof. Vous' : 'Vous',
      isInstructor,
      answer: answerText,
      createdAt: new Date(),
      likes: 0,
      isAccepted: false,
      userLiked: false
    };

    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, answers: [...q.answers, answer], isAnswered: true }
        : q
    ));

    setNewAnswer(prev => ({ ...prev, [questionId]: '' }));
    setSelectedQuestionForAnswer(null);
  };

  const handleLikeQuestion = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            likes: q.userLiked ? q.likes - 1 : q.likes + 1,
            userLiked: !q.userLiked,
            userDisliked: false
          }
        : q
    ));
  };

  const handleLikeAnswer = (questionId: string, answerId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            answers: q.answers.map(a => 
              a.id === answerId 
                ? { 
                    ...a, 
                    likes: a.userLiked ? a.likes - 1 : a.likes + 1,
                    userLiked: !a.userLiked 
                  }
                : a
            )
          }
        : q
    ));
  };

  const formatVideoTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header avec statistiques */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Questions & Réponses</h2>
              <p className="text-sm text-gray-600">
                {questions.length} questions • {questions.filter(q => q.isAnswered).length} répondues
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowQuestionForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Poser une question
          </button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{questions.length}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{questions.filter(q => q.isAnswered).length}</div>
            <div className="text-xs text-green-600">Répondues</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">{questions.filter(q => q.isPopular).length}</div>
            <div className="text-xs text-yellow-600">Populaires</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{questions.filter(q => q.isPinned).length}</div>
            <div className="text-xs text-purple-600">Épinglées</div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="p-4 border-b border-gray-100 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher dans les questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'Toutes', icon: Users },
              { key: 'unanswered', label: 'Sans réponse', icon: MessageCircle },
              { key: 'answered', label: 'Répondues', icon: CheckCircle },
              { key: 'popular', label: 'Populaires', icon: TrendingUp },
              { key: 'pinned', label: 'Épinglées', icon: Pin }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  filter === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des questions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              {/* Header de la question */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {question.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{question.userName}</h3>
                      {question.isPinned && (
                        <Pin className="text-yellow-500" size={14} />
                      )}
                      {question.isPopular && (
                        <Star className="text-yellow-500" size={14} />
                      )}
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(question.createdAt)}
                      </span>
                      <button
                        onClick={() => onSeekToQuestion(question.timestamp)}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1"
                      >
                        <Clock size={12} />
                        {formatVideoTime(question.timestamp)}
                      </button>
                    </div>
                    <p className="text-gray-800 leading-relaxed mb-3">{question.question}</p>
                    
                    {/* Tags */}
                    {question.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        {question.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions de la question */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLikeQuestion(question.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      question.userLiked
                        ? 'bg-blue-100 text-blue-600'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ThumbsUp size={14} />
                    <span className="text-sm font-medium">{question.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedQuestionForAnswer(
                      selectedQuestionForAnswer === question.id ? null : question.id
                    )}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Reply size={14} />
                    <span className="text-sm font-medium">Répondre</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {question.isAnswered ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={14} />
                      <span>{question.answers.length} réponse{question.answers.length > 1 ? 's' : ''}</span>
                    </div>
                  ) : (
                    <span>Pas encore de réponse</span>
                  )}
                </div>
              </div>

              {/* Réponses */}
              {question.answers.length > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  {question.answers.map(answer => (
                    <div key={answer.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                        answer.isInstructor 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                        {answer.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`font-semibold ${
                            answer.isInstructor ? 'text-green-600' : 'text-gray-700'
                          }`}>
                            {answer.userName}
                          </span>
                          {answer.isInstructor && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                              Instructeur
                            </span>
                          )}
                          {answer.isAccepted && (
                            <CheckCircle className="text-green-500" size={14} />
                          )}
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(answer.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">{answer.answer}</p>
                        <button
                          onClick={() => handleLikeAnswer(question.id, answer.id)}
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                            answer.userLiked
                              ? 'bg-blue-100 text-blue-600'
                              : 'hover:bg-gray-100 text-gray-500'
                          }`}
                        >
                          <ThumbsUp size={12} />
                          {answer.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulaire de réponse */}
              {selectedQuestionForAnswer === question.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100 pt-4 mt-4"
                >
                  <div className="space-y-3">
                    <textarea
                      value={newAnswer[question.id] || ''}
                      onChange={(e) => setNewAnswer(prev => ({
                        ...prev,
                        [question.id]: e.target.value
                      }))}
                      placeholder="Votre réponse..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedQuestionForAnswer(null)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleSubmitAnswer(question.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Send size={14} />
                        Répondre
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Aucune question trouvée' : 'Aucune question pour le moment'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Essayez un autre terme de recherche'
                : 'Soyez le premier à poser une question sur cette leçon !'
              }
            </p>
            <button
              onClick={() => setShowQuestionForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Poser la première question
            </button>
          </div>
        )}
      </div>

      {/* Modal pour nouvelle question */}
      <AnimatePresence>
        {showQuestionForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowQuestionForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Poser une question</h3>
                  <p className="text-gray-600">
                    À {formatVideoTime(Math.floor(currentVideoTime))} dans la vidéo
                  </p>
                </div>
              </div>

              <textarea
                ref={inputRef}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Votre question sur cette partie du cours..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
                rows={4}
                autoFocus
              />

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Votre question sera visible par tous les étudiants
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowQuestionForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmitQuestion}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Send size={16} />
                    Publier
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

