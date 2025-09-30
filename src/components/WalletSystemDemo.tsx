'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Lock } from 'lucide-react';
import { WalletTopUp } from './WalletTopUp';
import { PurchaseUpsellModal } from './PurchaseUpsellModal';
import { WalletBalance } from './WalletBalance';
import { 
  mockUser, 
  mockLessons, 
  generateUpsellOptions, 
  simulatePurchase,
  getLessonById,
  getCourseById,
  getPackById
} from '@/lib/mock-data';

export function WalletSystemDemo() {
  const [user, setUser] = useState(mockUser);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set(['course-suites']));

  const handleTopUp = (amount: number, bonus: number) => {
    const totalAdded = amount + bonus;
    
    setUser(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: prev.wallet.balance + totalAdded,
        totalDeposited: prev.wallet.totalDeposited + totalAdded,
        lastActivity: new Date(),
        transactions: [
          ...prev.wallet.transactions,
          {
            id: `tx-${Date.now()}-deposit`,
            walletId: prev.wallet.id,
            type: 'deposit' as const,
            amount: amount,
            description: 'Rechargement portefeuille',
            createdAt: new Date(),
            metadata: {
              paymentMethod: 'card'
            }
          },
          ...(bonus > 0 ? [{
            id: `tx-${Date.now()}-bonus`,
            walletId: prev.wallet.id,
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
    }));
    
    setShowTopUp(false);
  };

  const handleLessonClick = (lessonId: string) => {
    // Vérifier si l'item est déjà acheté
    const lesson = getLessonById(lessonId);
    if (!lesson) return;

    const course = getCourseById(lesson.courseId);
    const pack = course?.packId ? getPackById(course.packId) : null;

    const isLessonPurchased = purchasedItems.has(`lesson-${lessonId}`);
    const isCoursePurchased = purchasedItems.has(`course-${lesson.courseId}`);
    const isPackPurchased = pack ? purchasedItems.has(`pack-${pack.id}`) : false;

    if (isLessonPurchased || isCoursePurchased || isPackPurchased) {
      alert('✅ Vous avez déjà accès à cette leçon !');
      return;
    }

    setSelectedLessonId(lessonId);
    setShowUpsell(true);
  };

  const handlePurchase = (optionId: string, itemType: string, itemId: string, price: number) => {
    const result = simulatePurchase(user.wallet.balance, itemType as any, itemId, price);
    
    if (result.success) {
      // Mettre à jour le portefeuille
      setUser(prev => ({
        ...prev,
        wallet: {
          ...prev.wallet,
          balance: result.newBalance,
          totalSpent: prev.wallet.totalSpent + price,
          lastActivity: new Date(),
          transactions: [
            ...prev.wallet.transactions,
            result.transaction
          ]
        }
      }));

      // Marquer l'item comme acheté
      setPurchasedItems(prev => new Set([...prev, `${itemType}-${itemId}`]));
      setShowUpsell(false);
      
      alert(`🎉 Achat réussi ! Vous avez maintenant accès au contenu.`);
    } else {
      alert('❌ Solde insuffisant. Rechargez votre portefeuille.');
    }
  };

  const upsellOptions = selectedLessonId ? generateUpsellOptions(selectedLessonId) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header avec portefeuille */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Démonstration du Système de Portefeuille SMS
              </h1>
              <p className="text-gray-600 mt-2">
                Testez le nouveau modèle de paiement avec rechargement et bonus
              </p>
            </div>
            
            <WalletBalance 
              balance={user.wallet.balance}
              onAddFunds={() => setShowTopUp(true)}
            />
          </div>
        </div>

        {/* Statistiques du portefeuille */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total déposé</div>
                <div className="text-xl font-bold text-gray-900">
                  {user.wallet.totalDeposited.toFixed(2)}€
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total dépensé</div>
                <div className="text-xl font-bold text-gray-900">
                  {user.wallet.totalSpent.toFixed(2)}€
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Contenu acheté</div>
                <div className="text-xl font-bold text-gray-900">
                  {purchasedItems.size} éléments
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des leçons de démonstration */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Leçons disponibles - Testez l'upsell !
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLessons.slice(0, 6).map((lesson) => {
              const course = getCourseById(lesson.courseId);
              const pack = course?.packId ? getPackById(course.packId) : null;
              
              const isLessonPurchased = purchasedItems.has(`lesson-${lesson.id}`);
              const isCoursePurchased = purchasedItems.has(`course-${lesson.courseId}`);
              const isPackPurchased = pack ? purchasedItems.has(`pack-${pack.id}`) : false;
              const isPurchased = isLessonPurchased || isCoursePurchased || isPackPurchased;

              return (
                <motion.div
                  key={lesson.id}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    bg-gradient-to-br from-gray-50 to-white border-2 rounded-xl p-6 cursor-pointer transition-all
                    ${isPurchased 
                      ? 'border-green-200 shadow-green-100' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                    }
                  `}
                  onClick={() => handleLessonClick(lesson.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {lesson.price}€
                      </div>
                      <div className="text-xs text-gray-500">
                        {lesson.duration} min
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">
                    {lesson.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {lesson.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {lesson.tags.slice(0, 2).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className={`
                      text-xs font-medium px-3 py-1 rounded-full
                      ${isPurchased 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                      }
                    `}>
                      {isPurchased ? '✅ Acheté' : '🔒 Voir options'}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modales */}
      {showTopUp && (
        <WalletTopUp
          currentBalance={user.wallet.balance}
          onTopUp={handleTopUp}
          onCancel={() => setShowTopUp(false)}
        />
      )}

      {showUpsell && selectedLessonId && (
        <PurchaseUpsellModal
          isOpen={showUpsell}
          onClose={() => setShowUpsell(false)}
          purchaseOptions={upsellOptions}
          onPurchase={handlePurchase}
          onAddFunds={() => {
            setShowUpsell(false);
            setShowTopUp(true);
          }}
        />
      )}
    </div>
  );
}







