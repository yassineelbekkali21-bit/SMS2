'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Play, HelpCircle, Star, CheckCircle, Clock, Award } from 'lucide-react';
import { PurchaseUpsellModal } from './PurchaseUpsellModal';
import { WalletTopUp } from './WalletTopUp';
import { LessonQuiz } from './LessonQuiz';
import { 
  generateUpsellOptions,
  simulatePurchase,
  getQuizByLessonId
} from '@/lib/mock-data';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  isCompleted: boolean;
  isPurchased: boolean;
  hasPreview: boolean;
  tags: string[];
  price: number;
}

interface EnhancedCourseViewProps {
  onBack: () => void;
  userBalance: number;
  onUpdateUser: (user: any) => void;
  purchasedItems: Set<string>;
  onPurchase: (itemType: string, itemId: string, price: number) => void;
}

export function EnhancedCourseView({ 
  onBack, 
  userBalance, 
  onUpdateUser,
  purchasedItems,
  onPurchase 
}: EnhancedCourseViewProps) {
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  // Données d'exemple basées sur votre screenshot
  const lessons: Lesson[] = [
    {
      id: 'lesson-fundamentals',
      title: "Les fondamentaux essentiels",
      description: "Découvrez les concepts de base qui forment le socle solide de votre apprentissage. Cette leçon introductive vous permettra de maîtriser les notions clés avant d'aborder des sujets plus complexes.",
      duration: 15,
      isCompleted: true,
      isPurchased: true,
      hasPreview: true,
      tags: [
        "Comprendre les concepts fondamentaux du sujet",
        "Identifier les éléments clés à retenir", 
        "Établir une base solide pour la suite du cours",
        "Acquérir le vocabulaire technique essentiel"
      ],
      price: 70
    },
    {
      id: 'lesson-advanced',
      title: "Concepts avancés",
      description: "Approfondissez vos connaissances avec des concepts plus complexes et des applications pratiques.",
      duration: 25,
      isCompleted: false,
      isPurchased: false,
      hasPreview: true,
      tags: [
        "Maîtriser les concepts avancés",
        "Appliquer les formules complexes",
        "Résoudre des problèmes difficiles"
      ],
      price: 85
    },
    {
      id: 'lesson-practice',
      title: "Applications pratiques",
      description: "Mettez en pratique vos connaissances avec des exercices concrets et des cas d'étude.",
      duration: 30,
      isCompleted: false,
      isPurchased: false,
      hasPreview: false,
      tags: [
        "Exercices pratiques",
        "Cas d'étude réels",
        "Mise en application"
      ],
      price: 95
    }
  ];

  const handleLessonClick = (lesson: Lesson, index: number) => {
    setSelectedLesson(index);
    
    if (!lesson.isPurchased && !purchasedItems.has(`lesson-${lesson.id}`)) {
      setShowUpsell(true);
    }
  };

  const handlePurchase = (optionId: string, itemType: string, itemId: string, price: number) => {
    const result = simulatePurchase(userBalance, itemType as any, itemId, price);
    
    if (result.success) {
      onPurchase(itemType, itemId, price);
      setShowUpsell(false);
    } else {
      setShowTopUp(true);
      setShowUpsell(false);
    }
  };

  const handleTopUp = (amount: number, bonus: number) => {
    // Ce handler sera géré par le parent
    setShowTopUp(false);
  };

  const startQuiz = () => {
    setShowQuiz(true);
  };

  const currentLesson = lessons[selectedLesson];
  const isLessonPurchased = currentLesson.isPurchased || purchasedItems.has(`lesson-${currentLesson.id}`);
  const upsellOptions = generateUpsellOptions(currentLesson.id);
  const quizQuestions = getQuizByLessonId(currentLesson.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header identique à votre design */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Suites et Limites</h1>
              <p className="text-gray-600">Votre parcours d'apprentissage</p>
            </div>
          </div>
          
          {/* Progression - exacte de votre design */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-500">Niveau 1</div>
              <div className="text-xl font-bold text-gray-900">1/5</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">25 / 210 XP</div>
              <div className="text-xl font-bold text-blue-600">20%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Étapes</div>
              <div className="text-xl font-bold text-gray-900">Progression</div>
            </div>
          </div>
        </div>
        
        {/* Barre de progression identique */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Map Mario - design identique à votre screenshot */}
        <div className="flex-1 p-6">
          <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[600px]">
            {/* Background de la map */}
            <svg className="absolute inset-0 w-full h-full" style={{ minHeight: '600px' }}>
              {/* Chemins entre les leçons */}
              {lessons.slice(0, -1).map((lesson, index) => {
                const x1 = (index % 3) * 200 + 150;
                const y1 = Math.floor(index / 3) * 150 + 150;
                const x2 = ((index + 1) % 3) * 200 + 150;
                const y2 = Math.floor((index + 1) / 3) * 150 + 150;
                
                return (
                  <line
                    key={`path-${index}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#e5e7eb" strokeWidth="3"
                    strokeDasharray={lesson.isPurchased ? "0" : "5,5"}
                  />
                );
              })}
            </svg>

            {/* Nodes des leçons */}
            {lessons.map((lesson, index) => {
              const x = (index % 3) * 200 + 150;
              const y = Math.floor(index / 3) * 150 + 150;
              const isPurchased = lesson.isPurchased || purchasedItems.has(`lesson-${lesson.id}`);
              
              return (
                <motion.div
                  key={lesson.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: x, top: y }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLessonClick(lesson, index)}
                >
                  <div className={`
                    relative w-16 h-16 rounded-2xl border-4 flex items-center justify-center font-bold text-white
                    ${lesson.isCompleted 
                      ? 'bg-green-500 border-green-400 shadow-green-200' 
                      : isPurchased 
                        ? 'bg-blue-500 border-blue-400 shadow-blue-200'
                        : 'bg-gray-400 border-gray-300 shadow-gray-200'
                    } shadow-lg
                    ${selectedLesson === index ? 'ring-4 ring-purple-300' : ''}
                  `}>
                    {lesson.isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : isPurchased ? (
                      <Play className="w-6 h-6" />
                    ) : (
                      <span className="text-lg">{index + 1}</span>
                    )}
                    
                    {/* Badge XP exactement comme votre design */}
                    {lesson.isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        +25
                      </div>
                    )}
                  </div>

                  {/* Label de la leçon */}
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="text-xs font-medium text-gray-700 whitespace-nowrap max-w-24 truncate">
                      {lesson.title.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Panneau de détails - Design EXACT de votre screenshot */}
        <div className="w-96 p-6">
          <motion.div
            key={selectedLesson}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            {/* Header exact de votre design */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {currentLesson.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Étape {selectedLesson + 1} • {currentLesson.isCompleted ? 'Vous avez terminé cette leçon avec succès' : 'Vous avez terminé cette leçon avec succès'}</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  Terminé
                </div>
                <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                  Facile
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                {currentLesson.description}
              </p>
            </div>

            {/* Ce que vous allez apprendre - Design exact */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                Ce que vous allez apprendre
              </h4>
              <ul className="space-y-2">
                {currentLesson.tags.map((tag, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{tag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Informations détaillées - Layout exact de votre design */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-xs text-gray-500">Durée</div>
                <div className="text-sm font-semibold text-gray-900">{currentLesson.duration} min</div>
                <div className="text-xs text-gray-500">15-35 min</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-xs text-purple-500">Récompense</div>
                <div className="text-sm font-semibold text-gray-900">+25 XP</div>
                <div className="text-xs text-gray-500">Points d'expérience</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                </div>
                <div className="text-xs text-orange-500">Niveau</div>
                <div className="text-sm font-semibold text-gray-900">Facile</div>
                <div className="text-xs text-gray-500">Parfait pour débuter</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                    <Play className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div className="text-xs text-gray-500">Type</div>
                <div className="text-sm font-semibold text-gray-900">Vidéo</div>
                <div className="text-xs text-gray-500">Format du contenu</div>
              </div>
            </div>

            {/* Actions - avec système d'upsell intégré */}
            <div className="space-y-3">
              {isLessonPurchased ? (
                <>
                  <button 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    onClick={() => alert('Lecture de la leçon...')}
                  >
                    <Play className="w-4 h-4" />
                    <span>Revoir la leçon</span>
                  </button>
                  
                  <button 
                    onClick={startQuiz}
                    className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Quiz d'entraînement</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setShowUpsell(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Débloquer cette leçon</span>
                </button>
              )}
              
              {currentLesson.hasPreview && (
                <button 
                  onClick={() => setPreviewVideo('demo')}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Aperçu gratuit</span>
                </button>
              )}
            </div>

            {/* Note en bas - design exact */}
            <div className="mt-4 text-center text-xs text-gray-500">
              Prêt à commencer cette leçon ?
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modales du portefeuille avec design conforme */}
      {showUpsell && (
        <PurchaseUpsellModal
          isOpen={showUpsell}
          onClose={() => setShowUpsell(false)}
          userBalance={userBalance}
          purchaseOptions={upsellOptions}
          onPurchase={handlePurchase}
          onAddFunds={() => {
            setShowUpsell(false);
            setShowTopUp(true);
          }}
        />
      )}

      {showTopUp && (
        <WalletTopUp
          currentBalance={userBalance}
          onTopUp={handleTopUp}
          onCancel={() => setShowTopUp(false)}
        />
      )}

      {showQuiz && quizQuestions.length > 0 && (
        <LessonQuiz
          lessonTitle={currentLesson.title}
          questions={quizQuestions}
          onClose={() => setShowQuiz(false)}
          onComplete={(score) => {
            console.log(`Quiz terminé avec un score de ${score}%`);
            setShowQuiz(false);
          }}
        />
      )}

      {/* Aperçu vidéo */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Aperçu - {currentLesson.title}</h3>
              <button
                onClick={() => setPreviewVideo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Play className="w-20 h-20 mx-auto mb-4" />
                <p>Aperçu vidéo de la leçon</p>
                <p className="text-sm">(Intégration vidéo ici)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







