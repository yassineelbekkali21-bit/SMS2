// ========================================================================
// HOOK POUR LE SYSTÈME DE PORTEFEUILLE EN EUROS
// Remplace useCreditSystem pour le nouveau modèle monétaire
// ========================================================================

import { useState, useCallback, useEffect } from 'react';
import { UserWallet, WalletTransaction, PurchaseOption } from '@/types';

interface UseEuroWalletReturn {
  wallet: UserWallet;
  canAfford: (amount: number) => boolean;
  processPayment: (option: PurchaseOption) => Promise<boolean>;
  addFunds: (amount: number, bonusPercentage?: number) => void;
  getRecentTransactions: (limit?: number) => WalletTransaction[];
  getBalance: () => number;
  getTotalSpent: () => number;
  getTotalDeposited: () => number;
}

/**
 * Hook personnalisé pour gérer le portefeuille en euros
 */
export function useEuroWallet(initialBalance: number = 0): UseEuroWalletReturn {
  
  // État du portefeuille
  const [wallet, setWallet] = useState<UserWallet>(() => {
    // Charger depuis localStorage si disponible
    const saved = typeof window !== 'undefined' ? localStorage.getItem('userWallet') : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          lastActivity: new Date(parsed.lastActivity),
          transactions: parsed.transactions.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt)
          }))
        };
      } catch (e) {
        console.warn('Erreur lors du chargement du portefeuille:', e);
      }
    }
    
    // Portefeuille par défaut
    return {
      id: `wallet-${Date.now()}`,
      userId: 'user-123',
      balance: initialBalance,
      totalDeposited: initialBalance,
      totalSpent: 0,
      createdAt: new Date(),
      lastActivity: new Date(),
      transactions: initialBalance > 0 ? [{
        id: `tx-initial-${Date.now()}`,
        walletId: `wallet-${Date.now()}`,
        type: 'deposit',
        amount: initialBalance,
        description: 'Solde initial',
        createdAt: new Date()
      }] : []
    };
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userWallet', JSON.stringify(wallet));
    }
  }, [wallet]);

  /**
   * Vérifier si l'utilisateur peut se permettre un montant
   */
  const canAfford = useCallback((amount: number): boolean => {
    return wallet.balance >= amount;
  }, [wallet.balance]);

  /**
   * Traiter un paiement pour une option d'achat
   */
  const processPayment = useCallback(async (option: PurchaseOption): Promise<boolean> => {
    if (!canAfford(option.price)) {
      console.warn('Solde insuffisant pour cet achat');
      return false;
    }

    try {
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Créer la transaction
      const transaction: WalletTransaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        walletId: wallet.id,
        type: 'purchase',
        amount: -option.price, // Négatif pour un débit
        description: `Achat: ${option.title}`,
        relatedItemType: option.type,
        relatedItemId: option.id,
        createdAt: new Date(),
        metadata: {
          originalPrice: option.originalPrice,
          savings: option.savings
        }
      };

      // Mettre à jour le portefeuille
      setWallet(prev => ({
        ...prev,
        balance: prev.balance - option.price,
        totalSpent: prev.totalSpent + option.price,
        lastActivity: new Date(),
        transactions: [transaction, ...prev.transactions]
      }));

      console.log(`✅ Paiement de ${option.price}€ traité avec succès pour "${option.title}"`);
      return true;

    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error);
      return false;
    }
  }, [wallet, canAfford]);

  /**
   * Ajouter des fonds au portefeuille
   */
  const addFunds = useCallback((amount: number, bonusPercentage: number = 0) => {
    const bonusAmount = amount * (bonusPercentage / 100);
    const totalAmount = amount + bonusAmount;

    const transactions: WalletTransaction[] = [
      {
        id: `tx-deposit-${Date.now()}`,
        walletId: wallet.id,
        type: 'deposit',
        amount: amount,
        description: `Rechargement de ${amount}€`,
        createdAt: new Date()
      }
    ];

    if (bonusAmount > 0) {
      transactions.push({
        id: `tx-bonus-${Date.now()}`,
        walletId: wallet.id,
        type: 'bonus',
        amount: bonusAmount,
        description: `Bonus de rechargement (+${bonusPercentage}%)`,
        createdAt: new Date(),
        metadata: { bonusPercentage }
      });
    }

    setWallet(prev => ({
      ...prev,
      balance: prev.balance + totalAmount,
      totalDeposited: prev.totalDeposited + amount,
      lastActivity: new Date(),
      transactions: [...transactions, ...prev.transactions]
    }));

    console.log(`💰 ${totalAmount}€ ajoutés au portefeuille (${amount}€ + ${bonusAmount}€ bonus)`);
  }, [wallet]);

  /**
   * Obtenir les transactions récentes
   */
  const getRecentTransactions = useCallback((limit: number = 10): WalletTransaction[] => {
    return wallet.transactions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }, [wallet.transactions]);

  /**
   * Obtenir le solde actuel
   */
  const getBalance = useCallback((): number => {
    return wallet.balance;
  }, [wallet.balance]);

  /**
   * Obtenir le total dépensé
   */
  const getTotalSpent = useCallback((): number => {
    return wallet.totalSpent;
  }, [wallet.totalSpent]);

  /**
   * Obtenir le total déposé
   */
  const getTotalDeposited = useCallback((): number => {
    return wallet.totalDeposited;
  }, [wallet.totalDeposited]);

  return {
    wallet,
    canAfford,
    processPayment,
    addFunds,
    getRecentTransactions,
    getBalance,
    getTotalSpent,
    getTotalDeposited
  };
}






