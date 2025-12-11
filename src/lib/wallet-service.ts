import { XPService } from './xp-service';

import { PurchaseOption } from '@/types';
import { RechargeBonusService, type RechargeBonusCalculation } from './recharge-bonus-service';
import { ProgressionBonusService } from './progression-bonus-service';

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
  type: 'purchase' | 'topup' | 'bonus' | 'recharge_bonus' | 'progression_bonus';
  amount: number;
  description: string;
  timestamp: Date;
  relatedId?: string; // ID de la leçon/cours/pack acheté
  bonusInfo?: { // Informations sur le bonus de recharge
    bonusNumber: 1 | 2;
    bonusPercentage: number;
    baseAmount: number;
  };
  progressionInfo?: { // Informations sur le bonus de progression
    packId: string;
    packTitle: string;
  };
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
   * Obtenir le solde total (portefeuille + bonus de progression)
   */
  static getTotalBalance(userId: string = 'user-default'): { walletBalance: number; progressionBonus: number; total: number } {
    const walletBalance = this.getBalance();
    const progressionBonusSummary = ProgressionBonusService.getProgressionBonusSummary(userId);
    const progressionBonus = progressionBonusSummary.totalAvailableAmount;
    
    return {
      walletBalance,
      progressionBonus,
      total: walletBalance + progressionBonus
    };
  }

  /**
   * Vérifier si l'utilisateur peut se permettre un achat (avec bonus de progression)
   */
  static canAfford(amount: number, userId: string = 'user-default'): boolean {
    const totalBalance = this.getTotalBalance(userId);
    return totalBalance.total >= amount;
  }

  /**
   * Effectuer un achat (débiter le portefeuille et les bonus de progression)
   */
  static makePurchase(option: PurchaseOption, userId: string = 'user-default'): { 
    success: boolean; 
    newBalance: number; 
    error?: string;
    usedProgressionBonus?: number;
    remainingProgressionBonus?: number;
  } {
    console.log(`🛒 WALLET: makePurchase appelé - ${option.title} pour ${option.price}€`);
    
    const totalBalance = this.getTotalBalance(userId);
    console.log(`💰 WALLET: Solde total disponible: ${totalBalance.total}€ (Portefeuille: ${totalBalance.walletBalance}€ + Bonus: ${totalBalance.progressionBonus}€)`);
    
    if (totalBalance.total < option.price) {
      console.log(`❌ WALLET: Solde insuffisant pour ${option.title} - ${totalBalance.total}€ < ${option.price}€`);
      return {
        success: false,
        newBalance: totalBalance.walletBalance,
        error: `Solde insuffisant. Il vous manque ${(option.price - totalBalance.total).toFixed(2)}€`
      };
    }

    let remainingPrice = option.price;
    let usedProgressionBonus = 0;
    
    // 1. Utiliser d'abord les bonus de progression
    if (totalBalance.progressionBonus > 0 && remainingPrice > 0) {
      const bonusToUse = Math.min(remainingPrice, totalBalance.progressionBonus);
      usedProgressionBonus = bonusToUse;
      remainingPrice -= bonusToUse;
      
      // Consommer les bonus de progression nécessaires
      let bonusConsumed = 0;
      while (bonusConsumed < bonusToUse) {
        const nextBonus = ProgressionBonusService.consumeNextProgressionBonus(userId);
        if (nextBonus) {
          bonusConsumed += nextBonus.bonusAmount;
          console.log(`💎 WALLET: Bonus de progression utilisé - ${nextBonus.bonusAmount}€ (${nextBonus.packTitle})`);
        } else {
          break;
        }
      }
    }
    
    // 2. Utiliser le solde du portefeuille pour le reste
    const state = this.getWalletState();
    if (remainingPrice > 0) {
      if (state.balance < remainingPrice) {
        return {
          success: false,
          newBalance: state.balance,
          error: `Solde portefeuille insuffisant. Il vous manque ${(remainingPrice - state.balance).toFixed(2)}€`
        };
      }
      
      state.balance -= remainingPrice;
      console.log(`💰 WALLET: Solde portefeuille débité - ${remainingPrice.toFixed(2)}€`);
    }
    
    // Ajouter la transaction
    const transaction: WalletTransaction = {
      id: `purchase_${Date.now()}`,
      type: 'purchase',
      amount: -option.price,
      description: `Achat: ${option.title}${usedProgressionBonus > 0 ? ` (dont ${usedProgressionBonus}€ bonus progression)` : ''}`,
      timestamp: new Date(),
      relatedId: option.itemId
    };
    
    state.transactions.push(transaction);
    this.saveWalletState(state);

    // 🔑 CRUCIAL: Ajouter l'item acheté à purchasedItems
    const existingPurchases = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
    let purchaseKey: string;
    
    if (option.type === 'lesson') {
      purchaseKey = option.itemId.startsWith('lesson-') ? option.itemId : `lesson-${option.itemId}`;
    } else {
      // Pour les packs et cours, utiliser l'itemId directement s'il contient déjà le préfixe
      purchaseKey = option.itemId.startsWith(option.type) ? option.itemId : `${option.type}-${option.itemId}`;
    }
    
    if (!existingPurchases.includes(purchaseKey)) {
      existingPurchases.push(purchaseKey);
      localStorage.setItem('purchasedItems', JSON.stringify(existingPurchases));
      console.log(`🔑 WALLET: Item ajouté à purchasedItems: ${purchaseKey}`);
      
      // Déclencher un événement pour notifier les composants de la mise à jour
      window.dispatchEvent(new CustomEvent('purchasedItemsChanged'));
    }

    const newTotalBalance = this.getTotalBalance(userId);
    console.log(`💰 WALLET: Achat effectué - ${option.title} pour ${option.price}€. Nouveau solde: ${state.balance.toFixed(2)}€ + ${newTotalBalance.progressionBonus}€ bonus = ${newTotalBalance.total.toFixed(2)}€ total`);

    return {
      success: true,
      newBalance: state.balance,
      usedProgressionBonus,
      remainingProgressionBonus: newTotalBalance.progressionBonus
    };
  }

  /**
   * Ajouter une transaction de bonus de progression au portefeuille
   */
  static addProgressionBonusTransaction(bonusAmount: number, packId: string, packTitle: string): void {
    const state = this.getWalletState();
    
    // Créditer le bonus au portefeuille
    state.balance += bonusAmount;
    
    // Ajouter la transaction de bonus de progression
    const progressionBonusTransaction: WalletTransaction = {
      id: `progression_bonus_${Date.now()}`,
      type: 'progression_bonus',
      amount: bonusAmount,
      description: `Bonus de progression - Pack ${packTitle.replace('Pack ', '')} complété`,
      timestamp: new Date(),
      relatedId: packId,
      progressionInfo: {
        packId,
        packTitle: packTitle.replace('Pack ', '')
      }
    };
    
    state.transactions.push(progressionBonusTransaction);
    
    // Sauvegarder l'état
    this.saveWalletState(state);
    
    console.log(`💎 WALLET: Bonus de progression ajouté - ${bonusAmount}€ pour le pack "${packTitle}". Nouveau solde: ${state.balance.toFixed(2)}€`);
  }

  /**
   * Recharger le portefeuille avec bonus de bienvenue (2 premières recharges)
   */
  static topUpWalletWithWelcomeBonus(
    amount: number,
    userId: string,
    source: 'header' | 'purchase' = 'header'
  ): {
    success: boolean;
    newBalance: number;
    calculation: RechargeBonusCalculation;
    confirmationMessage: string;
    error?: string;
  } {
    const state = this.getWalletState();
    
    if (amount <= 0) {
      return {
        success: false,
        newBalance: state.balance,
        calculation: {
          baseAmount: amount,
          bonusAmount: 0,
          totalCredited: amount,
          bonusInfo: RechargeBonusService.getBonusInfo(userId)
        },
        confirmationMessage: '',
        error: 'Le montant doit être positif'
      };
    }

    // Calculer le bonus
    const calculation = RechargeBonusService.calculateBonus(userId, amount);
    
    // Créditer le montant total (base + bonus)
    state.balance += calculation.totalCredited;
    
    // Ajouter la transaction de recharge
    const topUpTransaction: WalletTransaction = {
      id: `topup_${Date.now()}`,
      type: 'topup',
      amount: calculation.baseAmount,
      description: `Recharge portefeuille`,
      timestamp: new Date()
    };
    
    state.transactions.push(topUpTransaction);

    // Si il y a un bonus, ajouter une transaction séparée
    if (calculation.bonusAmount > 0) {
      const bonusTransaction: WalletTransaction = {
        id: `recharge_bonus_${Date.now()}`,
        type: 'recharge_bonus',
        amount: calculation.bonusAmount,
        description: `Bonus de bienvenue (${calculation.bonusInfo.bonusNumber}/2)`,
        timestamp: new Date(),
        bonusInfo: {
          bonusNumber: calculation.bonusInfo.bonusNumber!,
          bonusPercentage: calculation.bonusInfo.bonusPercentage,
          baseAmount: calculation.baseAmount
        }
      };
      
      state.transactions.push(bonusTransaction);
    }

    // Sauvegarder l'état du portefeuille
    this.saveWalletState(state);

    // Enregistrer la recharge dans l'historique des bonus
    RechargeBonusService.recordSuccessfulRecharge(userId, calculation.baseAmount, calculation.bonusAmount);

    // Générer le message de confirmation
    const confirmationMessage = RechargeBonusService.getConfirmationMessage(calculation);

    console.log(`💰 WALLET: Recharge avec bonus - Montant: ${calculation.baseAmount}€, Bonus: ${calculation.bonusAmount}€. Nouveau solde: ${state.balance.toFixed(2)}€`);

    return {
      success: true,
      newBalance: state.balance,
      calculation,
      confirmationMessage
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


