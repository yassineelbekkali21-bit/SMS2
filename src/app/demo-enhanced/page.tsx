'use client';

import { useState } from 'react';
import { EnhancedCourseView } from '@/components/EnhancedCourseView';
import { mockUser } from '@/lib/mock-data';

export default function DemoEnhancedPage() {
  const [user, setUser] = useState(mockUser);
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(
    new Set(['lesson-fundamentals']) // La première leçon est déjà achetée
  );

  const handlePurchase = (itemType: string, itemId: string, price: number) => {
    setPurchasedItems(prev => new Set([...prev, `${itemType}-${itemId}`]));
    
    // Déduire du portefeuille
    setUser(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: prev.wallet.balance - price,
        totalSpent: prev.wallet.totalSpent + price,
        lastActivity: new Date(),
        transactions: [
          ...prev.wallet.transactions,
          {
            id: `tx-${Date.now()}`,
            walletId: prev.wallet.id,
            type: 'purchase' as const,
            amount: -price,
            description: `Achat ${itemType}: ${itemId}`,
            relatedItemType: itemType as any,
            relatedItemId: itemId,
            createdAt: new Date()
          }
        ]
      }
    }));
  };

  const handleBack = () => {
    console.log('Retour au dashboard');
  };

  return (
    <div>
      {/* Info debug en haut à gauche */}
      <div className="fixed top-4 left-4 bg-black text-white p-4 rounded-lg z-50 text-sm">
        <div className="font-bold mb-2">💳 Portefeuille: {user.wallet.balance.toFixed(2)}€</div>
        <div className="text-xs space-y-1">
          <div>🎯 Design identique à votre screenshot</div>
          <div>💰 Système d'upsell intégré</div>
          <div>🎮 Quiz fonctionnels</div>
          <div>🔐 Achat de leçons</div>
        </div>
      </div>

      <EnhancedCourseView
        onBack={handleBack}
        userBalance={user.wallet.balance}
        onUpdateUser={setUser}
        purchasedItems={purchasedItems}
        onPurchase={handlePurchase}
      />
    </div>
  );
}









