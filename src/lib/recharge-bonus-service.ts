/**
 * Service de gestion des bonus de recharge
 * Gère les bonus limités aux 2 premières recharges d'un utilisateur
 */

export interface RechargeBonusInfo {
  isEligible: boolean;
  bonusNumber: 1 | 2 | null; // Numéro du bonus (1 ou 2) ou null si terminé
  bonusPercentage: number; // Pourcentage du bonus (20% ou 10%)
  bonusCapAmount: number; // Plafond du bonus (200€ ou 100€)
  remainingBonuses: number; // Nombre de bonus restants (0, 1 ou 2)
}

export interface RechargeBonusCalculation {
  baseAmount: number; // Montant à payer
  bonusAmount: number; // Montant du bonus offert
  totalCredited: number; // Total crédité au portefeuille
  bonusInfo: RechargeBonusInfo;
}

export interface UserBonusHistory {
  userId: string;
  rechargesCount: number; // Nombre total de recharges réussies
  bonusesUsed: number; // Nombre de bonus utilisés (0, 1 ou 2)
  firstRechargeDate?: Date;
  secondRechargeDate?: Date;
  totalBonusReceived: number; // Total des bonus reçus en €
}

export class RechargeBonusService {
  
  /**
   * Configuration des bonus
   */
  private static readonly BONUS_CONFIG = {
    FIRST_RECHARGE: {
      percentage: 20, // 20%
      cap: 200, // 200€ max
      label: "Bonus de bienvenue (1/2)"
    },
    SECOND_RECHARGE: {
      percentage: 10, // 10%
      cap: 100, // 100€ max
      label: "Bonus de bienvenue (2/2)"
    }
  };

  /**
   * Obtient l'historique des bonus d'un utilisateur depuis localStorage
   */
  static getUserBonusHistory(userId: string): UserBonusHistory {
    try {
      const stored = localStorage.getItem(`userBonusHistory_${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          firstRechargeDate: parsed.firstRechargeDate ? new Date(parsed.firstRechargeDate) : undefined,
          secondRechargeDate: parsed.secondRechargeDate ? new Date(parsed.secondRechargeDate) : undefined,
        };
      }
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'historique bonus:', error);
    }

    // Retourner un historique vide pour un nouvel utilisateur
    return {
      userId,
      rechargesCount: 0,
      bonusesUsed: 0,
      totalBonusReceived: 0
    };
  }

  /**
   * Sauvegarde l'historique des bonus d'un utilisateur
   */
  static saveUserBonusHistory(history: UserBonusHistory): void {
    try {
      localStorage.setItem(`userBonusHistory_${history.userId}`, JSON.stringify(history));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique bonus:', error);
    }
  }

  /**
   * Vérifie l'éligibilité aux bonus et retourne les informations
   */
  static getBonusInfo(userId: string): RechargeBonusInfo {
    const history = this.getUserBonusHistory(userId);
    
    if (history.bonusesUsed >= 2) {
      // Plus de bonus disponibles
      return {
        isEligible: false,
        bonusNumber: null,
        bonusPercentage: 0,
        bonusCapAmount: 0,
        remainingBonuses: 0
      };
    }

    const bonusNumber = (history.bonusesUsed + 1) as 1 | 2;
    const config = bonusNumber === 1 ? this.BONUS_CONFIG.FIRST_RECHARGE : this.BONUS_CONFIG.SECOND_RECHARGE;

    return {
      isEligible: true,
      bonusNumber,
      bonusPercentage: config.percentage,
      bonusCapAmount: config.cap,
      remainingBonuses: 2 - history.bonusesUsed
    };
  }

  /**
   * Calcule le bonus pour un montant de recharge donné
   */
  static calculateBonus(userId: string, rechargeAmount: number): RechargeBonusCalculation {
    const bonusInfo = this.getBonusInfo(userId);
    
    if (!bonusInfo.isEligible) {
      return {
        baseAmount: rechargeAmount,
        bonusAmount: 0,
        totalCredited: rechargeAmount,
        bonusInfo
      };
    }

    // Calculer le bonus avec plafond
    const bonusAmount = Math.min(
      (rechargeAmount * bonusInfo.bonusPercentage) / 100,
      bonusInfo.bonusCapAmount
    );

    return {
      baseAmount: rechargeAmount,
      bonusAmount: Math.round(bonusAmount), // Arrondir à l'euro
      totalCredited: rechargeAmount + Math.round(bonusAmount),
      bonusInfo
    };
  }

  /**
   * Enregistre une recharge réussie avec bonus
   */
  static recordSuccessfulRecharge(userId: string, rechargeAmount: number, bonusAmount: number): void {
    const history = this.getUserBonusHistory(userId);
    
    // Mettre à jour l'historique
    const updatedHistory: UserBonusHistory = {
      ...history,
      rechargesCount: history.rechargesCount + 1,
      totalBonusReceived: history.totalBonusReceived + bonusAmount
    };

    // Si c'était un bonus, l'enregistrer
    if (bonusAmount > 0) {
      updatedHistory.bonusesUsed = history.bonusesUsed + 1;
      
      if (updatedHistory.bonusesUsed === 1) {
        updatedHistory.firstRechargeDate = new Date();
      } else if (updatedHistory.bonusesUsed === 2) {
        updatedHistory.secondRechargeDate = new Date();
      }
    }

    this.saveUserBonusHistory(updatedHistory);
  }

  /**
   * Obtient le message d'affichage du bonus
   */
  static getBonusDisplayMessage(bonusInfo: RechargeBonusInfo): string {
    if (!bonusInfo.isEligible) {
      return "🎓 Bonus terminé (2/2 utilisés) — Merci pour ta confiance !";
    }

    const config = bonusInfo.bonusNumber === 1 
      ? this.BONUS_CONFIG.FIRST_RECHARGE 
      : this.BONUS_CONFIG.SECOND_RECHARGE;

    return `💎 ${config.label} — +${bonusInfo.bonusPercentage}% offerts (jusqu'à ${bonusInfo.bonusCapAmount}€)`;
  }

  /**
   * Obtient le message de confirmation après recharge
   */
  static getConfirmationMessage(calculation: RechargeBonusCalculation): string {
    if (calculation.bonusAmount > 0) {
      return `✅ Recharge réussie ! +${calculation.baseAmount}€ ajoutés +${calculation.bonusAmount}€ offerts (bonus)`;
    }
    return `✅ Recharge réussie ! +${calculation.baseAmount}€ ajoutés à votre portefeuille`;
  }

  /**
   * Obtient le message pour recharge contextuelle (pendant achat)
   */
  static getContextualRechargeMessage(bonusInfo: RechargeBonusInfo, missingAmount: number): string {
    if (!bonusInfo.isEligible) {
      return `⚡ Il te manque ${missingAmount}€. Recharge maintenant pour continuer ton achat.`;
    }

    return `⚡ Il te manque ${missingAmount}€. Recharge maintenant et profite de ton bonus de bienvenue (${bonusInfo.bonusNumber}/2) — +${bonusInfo.bonusPercentage}% offerts !`;
  }

  /**
   * Réinitialise l'historique des bonus (pour les tests)
   */
  static resetUserBonusHistory(userId: string): void {
    try {
      localStorage.removeItem(`userBonusHistory_${userId}`);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation de l\'historique bonus:', error);
    }
  }

  /**
   * Obtient les statistiques globales des bonus (pour debug/admin)
   */
  static getBonusStats(): { totalUsers: number; totalBonusAmount: number } {
    let totalUsers = 0;
    let totalBonusAmount = 0;

    try {
      // Parcourir toutes les clés localStorage pour trouver les historiques bonus
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('userBonusHistory_')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const history: UserBonusHistory = JSON.parse(stored);
            totalUsers++;
            totalBonusAmount += history.totalBonusReceived;
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques bonus:', error);
    }

    return { totalUsers, totalBonusAmount };
  }
}
