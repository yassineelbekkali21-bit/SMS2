/**
 * Service de gestion des bonus de progression
 * Gère les bonus obtenus après complétion complète d'un pack
 */

export interface ProgressionBonusInfo {
  packId: string;
  packTitle: string;
  bonusAmount: number; // Montant du bonus (100€)
  completionDate: Date;
  isUsed: boolean; // Si le bonus a été consommé
  usedDate?: Date;
}

export interface ProgressionBonusSummary {
  availableBonuses: ProgressionBonusInfo[]; // Bonus en attente
  totalAvailableAmount: number; // Montant total disponible
  nextBonusAmount: number; // Montant du prochain bonus à appliquer
  nextBonusPackTitle: string; // Titre du pack du prochain bonus
  hasAvailableBonus: boolean; // Si un bonus est disponible
}

export interface ProgressionBonusHistory {
  userId: string;
  bonuses: ProgressionBonusInfo[];
  totalBonusesEarned: number; // Nombre total de bonus gagnés
  totalBonusesUsed: number; // Nombre total de bonus utilisés
  totalAmountReceived: number; // Montant total reçu en €
}

export class ProgressionBonusService {
  
  /**
   * Configuration du bonus de progression
   */
  private static readonly PROGRESSION_BONUS_CONFIG = {
    AMOUNT: 100, // 100€ par pack complété
    DESCRIPTION: "Bonus de progression"
  };

  /**
   * Obtient l'historique des bonus de progression d'un utilisateur
   */
  static getUserProgressionBonusHistory(userId: string): ProgressionBonusHistory {
    try {
      const stored = localStorage.getItem(`progressionBonusHistory_${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          bonuses: parsed.bonuses.map((bonus: any) => ({
            ...bonus,
            completionDate: new Date(bonus.completionDate),
            usedDate: bonus.usedDate ? new Date(bonus.usedDate) : undefined,
          }))
        };
      }
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'historique bonus progression:', error);
    }

    // Retourner un historique vide pour un nouvel utilisateur
    return {
      userId,
      bonuses: [],
      totalBonusesEarned: 0,
      totalBonusesUsed: 0,
      totalAmountReceived: 0
    };
  }

  /**
   * Sauvegarde l'historique des bonus de progression
   */
  static saveUserProgressionBonusHistory(history: ProgressionBonusHistory): void {
    try {
      localStorage.setItem(`progressionBonusHistory_${history.userId}`, JSON.stringify(history));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique bonus progression:', error);
    }
  }

  /**
   * Ajoute un bonus de progression après complétion d'un pack
   */
  static addProgressionBonus(userId: string, packId: string, packTitle: string): ProgressionBonusInfo {
    const history = this.getUserProgressionBonusHistory(userId);
    
    // Vérifier si le bonus pour ce pack n'existe pas déjà
    const existingBonus = history.bonuses.find(bonus => bonus.packId === packId);
    if (existingBonus) {
      console.log(`💎 PROGRESSION BONUS: Bonus déjà existant pour le pack ${packId}`);
      return existingBonus;
    }

    // Créer le nouveau bonus
    const newBonus: ProgressionBonusInfo = {
      packId,
      packTitle: packTitle.replace('Pack ', ''), // Enlever "Pack" du titre
      bonusAmount: this.PROGRESSION_BONUS_CONFIG.AMOUNT,
      completionDate: new Date(),
      isUsed: false
    };

    // Ajouter à l'historique
    history.bonuses.push(newBonus);
    history.totalBonusesEarned++;

    // Sauvegarder
    this.saveUserProgressionBonusHistory(history);

    console.log(`🎉 PROGRESSION BONUS: Nouveau bonus de ${newBonus.bonusAmount}€ ajouté pour le pack "${packTitle}"`);
    
    return newBonus;
  }

  /**
   * Obtient le résumé des bonus de progression disponibles
   */
  static getProgressionBonusSummary(userId: string): ProgressionBonusSummary {
    const history = this.getUserProgressionBonusHistory(userId);
    
    // Filtrer les bonus non utilisés, triés par date de complétion
    const availableBonuses = history.bonuses
      .filter(bonus => !bonus.isUsed)
      .sort((a, b) => a.completionDate.getTime() - b.completionDate.getTime());

    const totalAvailableAmount = availableBonuses.reduce((sum, bonus) => sum + bonus.bonusAmount, 0);
    const nextBonus = availableBonuses[0]; // Le plus ancien bonus non utilisé

    return {
      availableBonuses,
      totalAvailableAmount,
      nextBonusAmount: nextBonus ? nextBonus.bonusAmount : 0,
      nextBonusPackTitle: nextBonus ? nextBonus.packTitle : '',
      hasAvailableBonus: availableBonuses.length > 0
    };
  }

  /**
   * Consomme le prochain bonus de progression disponible
   */
  static consumeNextProgressionBonus(userId: string): ProgressionBonusInfo | null {
    const history = this.getUserProgressionBonusHistory(userId);
    
    // Trouver le plus ancien bonus non utilisé
    const nextBonus = history.bonuses
      .filter(bonus => !bonus.isUsed)
      .sort((a, b) => a.completionDate.getTime() - b.completionDate.getTime())[0];

    if (!nextBonus) {
      return null;
    }

    // Marquer comme utilisé
    nextBonus.isUsed = true;
    nextBonus.usedDate = new Date();
    
    // Mettre à jour les statistiques
    history.totalBonusesUsed++;
    history.totalAmountReceived += nextBonus.bonusAmount;

    // Sauvegarder
    this.saveUserProgressionBonusHistory(history);

    console.log(`💰 PROGRESSION BONUS: Bonus de ${nextBonus.bonusAmount}€ consommé pour le pack "${nextBonus.packTitle}"`);
    
    return nextBonus;
  }

  /**
   * Obtient le message de célébration pour un pack complété
   */
  static getPackCompletionMessage(packTitle: string): string {
    const cleanTitle = packTitle.replace('Pack ', '');
    return `🎉 Félicitations ! Tu viens de compléter le pack ${cleanTitle}.\nPour te récompenser, tu bénéficies de +${this.PROGRESSION_BONUS_CONFIG.AMOUNT}€ offerts sur ta prochaine recharge.\nContinue sur ta lancée 💪`;
  }

  /**
   * Obtient le message d'affichage du bonus disponible dans la recharge
   */
  static getRechargeDisplayMessage(bonusSummary: ProgressionBonusSummary): string {
    if (!bonusSummary.hasAvailableBonus) {
      return '';
    }

    if (bonusSummary.availableBonuses.length === 1) {
      return `💎 Bonus de progression actif — +${bonusSummary.nextBonusAmount}€ sur cette recharge !`;
    }

    return `💎 Bonus de progression actif — +${bonusSummary.nextBonusAmount}€ sur cette recharge !\n🎁 Tu as encore ${bonusSummary.availableBonuses.length - 1} bonus disponibles pour tes prochaines recharges.`;
  }

  /**
   * Obtient le message de confirmation après utilisation du bonus
   */
  static getConfirmationMessage(consumedBonus: ProgressionBonusInfo, rechargeAmount: number): string {
    return `✅ Recharge réussie : +${rechargeAmount}€ ajoutés • Bonus progression : +${consumedBonus.bonusAmount}€ 🎉\nMerci d'avoir complété le pack ${consumedBonus.packTitle} !`;
  }

  /**
   * Vérifie si un pack est complètement terminé
   */
  static isPackCompleted(packCourses: any[], purchasedItems: Set<string>, packId?: string): boolean {
    if (!packCourses || packCourses.length === 0) {
      return false;
    }

    console.log(`🔍 PACK COMPLETION DEBUG: packId=${packId}, purchasedItems:`, Array.from(purchasedItems));

    // 🎯 PRIORITÉ 1: Vérifier si le pack entier est acheté
    if (packId && purchasedItems.has(packId)) {
      console.log(`✅ PACK COMPLETION: Pack ${packId} acheté en entier`);
      return true;
    }

    console.log(`🔍 PACK COMPLETION DEBUG: Pack ${packId} pas trouvé dans purchasedItems, vérification cours individuels...`);

    // 🎯 PRIORITÉ 2: Vérifier que tous les cours du pack sont possédés/débloqués
    const allCoursesOwned = packCourses.every(course => {
      // Vérifier si le cours complet est acheté
      if (purchasedItems.has(course.id)) {
        console.log(`✅ PACK COMPLETION: Cours ${course.id} acheté individuellement`);
        return true;
      }
      
      // Vérifier si toutes les leçons du cours sont achetées
      if (course.lessons && course.lessons.length > 0) {
        const allLessonsOwned = course.lessons.every((lesson: any) => 
          purchasedItems.has(`${course.id}-lesson-${lesson.id}`) || 
          purchasedItems.has(`lesson-${lesson.id}`)
        );
        if (allLessonsOwned) {
          console.log(`✅ PACK COMPLETION: Toutes les leçons du cours ${course.id} achetées`);
          return true;
        }
      }
      
      // Fallback: vérifier avec le nombre total de leçons
      if (course.totalLessons) {
        let allLessonsOwned = true;
        for (let i = 1; i <= course.totalLessons; i++) {
          if (!purchasedItems.has(`${course.id}-lesson-${i}`) && !purchasedItems.has(`lesson-${i}`)) {
            allLessonsOwned = false;
            break;
          }
        }
        if (allLessonsOwned) {
          console.log(`✅ PACK COMPLETION: Toutes les leçons du cours ${course.id} achetées (fallback)`);
          return true;
        }
      }
      
      console.log(`❌ PACK COMPLETION: Cours ${course.id} pas complètement acheté`);
      return false;
    });

    return allCoursesOwned;
  }

  /**
   * Créer un nouveau bonus de progression pour un pack complété
   */
  static createProgressionBonus(userId: string, packId: string, packTitle: string, bonusAmount: number): ProgressionBonus {
    const bonus: ProgressionBonus = {
      id: `progression_${packId}_${Date.now()}`,
      userId,
      packId,
      packTitle,
      bonusAmount,
      createdAt: new Date(),
      isConsumed: false
    };

    // Ajouter à l'historique
    const history = this.getUserProgressionBonusHistory(userId);
    history.bonuses.push(bonus);
    
    try {
      localStorage.setItem(`progressionBonusHistory_${userId}`, JSON.stringify(history));
      console.log(`💎 PROGRESSION BONUS: Bonus de ${bonusAmount}€ créé pour le pack "${packTitle}"`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du bonus de progression:', error);
    }

    return bonus;
  }

  /**
   * Réinitialise l'historique des bonus de progression (pour les tests)
   */
  static resetUserProgressionBonusHistory(userId: string): void {
    try {
      localStorage.removeItem(`progressionBonusHistory_${userId}`);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation de l\'historique bonus progression:', error);
    }
  }

  /**
   * Obtient les statistiques globales des bonus de progression (pour debug/admin)
   */
  static getProgressionBonusStats(): { totalUsers: number; totalBonusAmount: number; totalPacksCompleted: number } {
    let totalUsers = 0;
    let totalBonusAmount = 0;
    let totalPacksCompleted = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('progressionBonusHistory_')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const history: ProgressionBonusHistory = JSON.parse(stored);
            totalUsers++;
            totalBonusAmount += history.totalAmountReceived;
            totalPacksCompleted += history.totalBonusesEarned;
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques bonus progression:', error);
    }

    return { totalUsers, totalBonusAmount, totalPacksCompleted };
  }
}
