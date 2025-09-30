'use client';

import { PurchaseOption } from '@/types';

// Configuration des campagnes de bonus
interface BonusCampaign {
  id: string;
  isActive: boolean;
  minTopUpAmount: number;
  bonusAmount: number;
  description: string;
  validUntil?: Date;
}

interface WalletTransaction {
  id: string;
  type: 'purchase' | 'topup' | 'bonus';
  amount: number;
  description: string;
  timestamp: Date;
  relatedId?: string; // ID de la leçon/cours/pack acheté
}

interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
  hasInitialBalance: boolean;
  lastUpdated: Date;
}

export class WalletService {
  private static readonly STORAGE_KEY = 'wallet_state_v1';
  private static readonly INITIAL_BALANCE = 150.00;

  // Configuration des campagnes de bonus (feature flags)
  private static readonly BONUS_CAMPAIGNS: { [key: string]: BonusCampaign } = {
    pack_bonus_2024: {
      id: 'pack_bonus_2024',
      isActive: true,
      minTopUpAmount: 1000,
      bonusAmount: 200,
      description: 'Bonus +200€ pour recharge ≥1000€ depuis le Pack Électrostatique',
      validUntil: new Date('2024-12-31')
    }
  };

  /**
   * Obtenir l'état actuel du portefeuille
   */
  static getWalletState(): WalletState {
    if (typeof window === 'undefined') {
      return this.getDefaultWalletState();
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored);
      // Convertir les dates de string vers Date
      state.lastUpdated = new Date(state.lastUpdated);
      state.transactions = state.transactions.map((t: any) => ({
        ...t,
        timestamp: new Date(t.timestamp)
      }));
      return state;
    }

    // Première visite : créer le portefeuille avec solde initial
    const initialState = this.getDefaultWalletState();
    this.saveWalletState(initialState);
    return initialState;
  }

  /**
   * État par défaut du portefeuille pour nouveaux utilisateurs
   */
  private static getDefaultWalletState(): WalletState {
    return {
      balance: this.INITIAL_BALANCE,
      transactions: [
        {
          id: 'initial_balance',
          type: 'bonus',
          amount: this.INITIAL_BALANCE,
          description: 'Solde de bienvenue',
          timestamp: new Date()
        }
      ],
      hasInitialBalance: true,
      lastUpdated: new Date()
    };
  }

  /**
   * Sauvegarder l'état du portefeuille
   */
  private static saveWalletState(state: WalletState): void {
    if (typeof window === 'undefined') return;
    
    state.lastUpdated = new Date();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  /**
   * Obtenir le solde actuel
   */
  static getBalance(): number {
    return this.getWalletState().balance;
  }

  /**
   * Vérifier si l'utilisateur peut se permettre un achat
   */
  static canAfford(amount: number): boolean {
    return this.getBalance() >= amount;
  }

  /**
   * Effectuer un achat (débiter le portefeuille)
   */
  static makePurchase(option: PurchaseOption): { success: boolean; newBalance: number; error?: string } {
    const state = this.getWalletState();
    
    if (state.balance < option.price) {
      return {
        success: false,
        newBalance: state.balance,
        error: `Solde insuffisant. Il vous manque ${(option.price - state.balance).toFixed(2)}€`
      };
    }

    // Débiter le portefeuille
    state.balance -= option.price;
    
    // Ajouter la transaction
    const transaction: WalletTransaction = {
      id: `purchase_${Date.now()}`,
      type: 'purchase',
      amount: -option.price,
      description: `Achat: ${option.title}`,
      timestamp: new Date(),
      relatedId: option.itemId
    };
    
    state.transactions.push(transaction);
    this.saveWalletState(state);

    console.log(`💰 WALLET: Achat effectué - ${option.title} pour ${option.price}€. Nouveau solde: ${state.balance.toFixed(2)}€`);

    return {
      success: true,
      newBalance: state.balance
    };
  }

  /**
   * Recharger le portefeuille (avec bonus optionnel)
   */
  static topUpWallet(
    amount: number, 
    source: 'lesson' | 'course' | 'pack' | 'general' = 'general'
  ): { 
    success: boolean; 
    newBalance: number; 
    bonusApplied?: number; 
    bonusDescription?: string; 
    error?: string 
  } {
    const state = this.getWalletState();
    
    if (amount <= 0) {
      return {
        success: false,
        newBalance: state.balance,
        error: 'Le montant doit être positif'
      };
    }

    // Créditer le montant principal
    state.balance += amount;
    
    // Ajouter la transaction de recharge
    const topUpTransaction: WalletTransaction = {
      id: `topup_${Date.now()}`,
      type: 'topup',
      amount: amount,
      description: `Recharge portefeuille`,
      timestamp: new Date()
    };
    
    state.transactions.push(topUpTransaction);

    let bonusApplied = 0;
    let bonusDescription = '';

    // Vérifier et appliquer le bonus uniquement pour les recharges depuis le Pack
    if (source === 'pack') {
      const campaign = this.BONUS_CAMPAIGNS.pack_bonus_2024;
      
      if (campaign.isActive && amount >= campaign.minTopUpAmount) {
        // Vérifier si la campagne n'est pas expirée
        if (!campaign.validUntil || new Date() <= campaign.validUntil) {
          bonusApplied = campaign.bonusAmount;
          state.balance += bonusApplied;
          bonusDescription = campaign.description;

          // Ajouter la transaction de bonus
          const bonusTransaction: WalletTransaction = {
            id: `bonus_${Date.now()}`,
            type: 'bonus',
            amount: bonusApplied,
            description: `Bonus Pack: +${bonusApplied}€`,
            timestamp: new Date()
          };
          
          state.transactions.push(bonusTransaction);

          console.log(`🎁 WALLET: Bonus appliqué - +${bonusApplied}€ pour recharge de ${amount}€ depuis le Pack`);
        }
      }
    }

    this.saveWalletState(state);

    console.log(`💰 WALLET: Recharge effectuée - +${amount}€${bonusApplied ? ` + bonus ${bonusApplied}€` : ''}. Nouveau solde: ${state.balance.toFixed(2)}€`);

    return {
      success: true,
      newBalance: state.balance,
      bonusApplied: bonusApplied > 0 ? bonusApplied : undefined,
      bonusDescription: bonusApplied > 0 ? bonusDescription : undefined
    };
  }

  /**
   * Obtenir l'historique des transactions
   */
  static getTransactions(): WalletTransaction[] {
    return this.getWalletState().transactions;
  }

  /**
   * Vérifier si une campagne de bonus est active pour le Pack
   */
  static getPackBonusCampaign(): BonusCampaign | null {
    const campaign = this.BONUS_CAMPAIGNS.pack_bonus_2024;
    
    if (!campaign.isActive) return null;
    if (campaign.validUntil && new Date() > campaign.validUntil) return null;
    
    return campaign;
  }

  /**
   * Générer le hint de bonus pour le Pack
   */
  static getPackBonusHint(): string | null {
    const campaign = this.getPackBonusCampaign();
    if (!campaign) return null;

    return `Astuce : en rechargeant ton portefeuille maintenant, un bonus est ajouté pour compléter ton pack (offre en quantité limitée).`;
  }

  /**
   * Réinitialiser le portefeuille (pour les tests)
   */
  static resetWallet(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🔄 WALLET: Portefeuille réinitialisé');
  }

  /**
   * Obtenir les statistiques du portefeuille
   */
  static getWalletStats(): {
    totalSpent: number;
    totalTopUps: number;
    totalBonuses: number;
    transactionCount: number;
  } {
    const transactions = this.getTransactions();
    
    return {
      totalSpent: transactions
        .filter(t => t.type === 'purchase')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
      totalTopUps: transactions
        .filter(t => t.type === 'topup')
        .reduce((sum, t) => sum + t.amount, 0),
      totalBonuses: transactions
        .filter(t => t.type === 'bonus')
        .reduce((sum, t) => sum + t.amount, 0),
      transactionCount: transactions.length
    };
  }
}
