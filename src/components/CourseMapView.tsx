'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Play, HelpCircle, Star, CheckCircle, Clock } from 'lucide-react';
import { PurchaseUpsellModal } from './PurchaseUpsellModal';
import { WalletTopUp } from './WalletTopUp';
import { 
  Course, 
  Lesson, 
  User,
  PurchaseOption 
} from '@/types/index';
import { 
  getLessonsByCourseId, 
  generateUpsellOptions,
  simulatePurchase
} from '@/lib/mock-data';

interface CourseMapViewProps {
  course: Course;
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
  purchasedItems: Set<string>;
  onPurchase: (itemType: string, itemId: string, price: number) => void;
}

interface LessonNode {
  lesson: Lesson;
  position: { x: number; y: number };
  isUnlocked: boolean;
  isPurchased: boolean;
  isCompleted: boolean;
}

export function CourseMapView({ 
  course, 
  user, 
  onBack, 
  onUpdateUser,
  purchasedItems,
  onPurchase
}: CourseMapViewProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const lessons = getLessonsByCourseId(course.id);
  
  // Créer les nodes avec positions pour la map Mario
  const lessonNodes: LessonNode[] = lessons.map((lesson, index) => {
    const isCoursePurchased = purchasedItems.has(`course-${course.id}`); // course.id contient déjà le préfixe course-
    const isLessonPurchased = purchasedItems.has(`lesson-${lesson.id}`);
    const isPackPurchased = purchasedItems.has(`pack-${course.packId || 'any'}`);
    const isPurchased = isCoursePurchased || isLessonPurchased || isPackPurchased;
    const isUnlocked = index === 0 || lessons.slice(0, index).every((_, i) => 
      purchasedItems.has(`lesson-${lessons[i].id}`) || isCoursePurchased || isPackPurchased
    );
    
    // Positions pour créer un parcours sinueux comme Mario
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = row % 2 === 0 ? col * 200 + 100 : (2 - col) * 200 + 100;
    const y = row * 150 + 100;

    return {
      lesson,
      position: { x, y },
      isUnlocked,
      isPurchased,
      isCompleted: lesson.progress === 100
    };
  });

  // Auto-sélectionner la première leçon
  useEffect(() => {
    if (lessons.length > 0 && !selectedLesson) {
      setSelectedLesson(lessons[0]);
    }
  }, [lessons, selectedLesson]);

  const handleLessonClick = (lesson: Lesson, isPurchased: boolean) => {
    setSelectedLesson(lesson);
    
    if (!isPurchased) {
      setShowUpsell(true);
    }
  };

  const handlePurchase = (optionId: string, itemType: string, itemId: string, price: number) => {
    const result = simulatePurchase(user.wallet.balance, itemType as any, itemId, price);
    
    if (result.success) {
      // Mettre à jour le portefeuille
      const updatedUser = {
        ...user,
        wallet: {
          ...user.wallet,
          balance: result.newBalance,
          totalSpent: user.wallet.totalSpent + price,
          lastActivity: new Date(),
          transactions: [
            ...user.wallet.transactions,
            result.transaction
          ]
        }
      };
      
      onUpdateUser(updatedUser);
      onPurchase(itemType, itemId, price);
      setShowUpsell(false);
    } else {
      setShowTopUp(true);
      setShowUpsell(false);
    }
  };

  const handleTopUp = (amount: number, bonus: number) => {
    const totalAdded = amount + bonus;
    
    const updatedUser = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + totalAdded,
        totalDeposited: user.wallet.totalDeposited + totalAdded,
        lastActivity: new Date(),
        transactions: [
          ...user.wallet.transactions,
          {
            id: `tx-${Date.now()}-deposit`,
            walletId: user.wallet.id,
            type: 'deposit' as const,
            amount: amount,
            description: 'Rechargement portefeuille',
            createdAt: new Date(),
            metadata: { paymentMethod: 'card' }
          },
          ...(bonus > 0 ? [{
            id: `tx-${Date.now()}-bonus`,
            walletId: user.wallet.id,
            type: 'bonus' as const,
            amount: bonus,
            description: `Bonus de rechargement`,
            createdAt: new Date(),
            metadata: {
              bonusPercentage: Math.round((bonus / amount) * 100),
              originalAmount: amount
            }
          }] : [])
        ]
      }
    };
    
    onUpdateUser(updatedUser);
    setShowTopUp(false);
  };

  const startPreview = (lesson: Lesson) => {
    // Simuler une vidéo de prévisualisation
    setPreviewVideo(`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0`);
  };

  const upsellOptions = selectedLesson ? generateUpsellOptions(selectedLesson.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600">Votre parcours d'apprentissage</p>
            </div>
          </div>
          
          {/* Progression */}
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
        
        {/* Barre de progression */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Map Mario */}
        <div className="flex-1 p-6">
          <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[600px]">
            <svg className="absolute inset-0 w-full h-full" style={{ minHeight: '600px' }}>
              {/* Chemins entre les leçons */}
              {lessonNodes.slice(0, -1).map((node, index) => {
                const nextNode = lessonNodes[index + 1];
                return (
                  <line
                    key={`path-${index}`}
                    x1={node.position.x}
                    y1={node.position.y}
                    x2={nextNode.position.x}
                    y2={nextNode.position.y}
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    strokeDasharray={node.isPurchased ? "0" : "5,5"}
                  />
                );
              })}
            </svg>

            {/* Nodes des leçons */}
            {lessonNodes.map((node, index) => (
              <motion.div
                key={node.lesson.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ 
                  left: node.position.x, 
                  top: node.position.y 
                }}
                whileHover={{ scale: node.isUnlocked ? 1.1 : 1 }}
                whileTap={{ scale: node.isUnlocked ? 0.95 : 1 }}
                onClick={() => node.isUnlocked && handleLessonClick(node.lesson, node.isPurchased)}
              >
                <div className={`
                  relative w-16 h-16 rounded-2xl border-4 flex items-center justify-center font-bold text-white
                  ${node.isCompleted 
                    ? 'bg-green-500 border-green-400 shadow-green-200' 
                    : node.isPurchased 
                      ? 'bg-blue-500 border-blue-400 shadow-blue-200'
                      : node.isUnlocked
                        ? 'bg-gray-400 border-gray-300 shadow-gray-200'
                        : 'bg-gray-300 border-gray-200'
                  } shadow-lg
                  ${selectedLesson?.id === node.lesson.id ? 'ring-4 ring-purple-300' : ''}
                `}>
                  {node.isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : node.isPurchased ? (
                    <Play className="w-6 h-6" />
                  ) : node.isUnlocked ? (
                    <span className="text-lg">{index + 1}</span>
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}
                  
                  {/* Badges */}
                  {node.isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      +25
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-xs font-medium text-gray-700 whitespace-nowrap max-w-24 truncate">
                    {node.lesson.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                  {node.isPurchased && (
                    <div className="text-xs text-green-600 font-medium">Facile</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Panneau de détails */}
        <div className="w-96 p-6">
          {selectedLesson && (
            <motion.div
              key={selectedLesson.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              {/* Header de la leçon */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {selectedLesson.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Étape 1 • Vous avez terminé cette leçon avec succès</span>
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
                  {selectedLesson.description}
                </p>
              </div>

              {/* Ce que vous allez apprendre */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  Ce que vous allez apprendre
                </h4>
                <ul className="space-y-2">
                  {selectedLesson.tags.map((tag, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Informations détaillées */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-500">Durée</div>
                  <div className="text-sm font-semibold text-gray-900">{selectedLesson.duration} min</div>
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

              {/* Actions */}
              <div className="space-y-3">
                {purchasedItems.has(`lesson-${selectedLesson.id}`) || 
                 purchasedItems.has(`course-${course.id}`) ? (
                  <>
                    <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Revoir la leçon</span>
                    </button>
                    
                    <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
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
                
                {selectedLesson.hasPreview && (
                  <button 
                    onClick={() => startPreview(selectedLesson)}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Aperçu gratuit</span>
                  </button>
                )}
              </div>

              {/* Note */}
              <div className="mt-4 text-center text-xs text-gray-500">
                Prêt à commencer cette leçon ?
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modales */}
      {showUpsell && selectedLesson && (
        <PurchaseUpsellModal
          isOpen={showUpsell}
          onClose={() => setShowUpsell(false)}
          userBalance={user.wallet.balance}
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
          currentBalance={user.wallet.balance}
          onTopUp={handleTopUp}
          onCancel={() => setShowTopUp(false)}
        />
      )}

      {/* Aperçu vidéo */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Aperçu - {selectedLesson?.title}</h3>
              <button
                onClick={() => setPreviewVideo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={previewVideo}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
