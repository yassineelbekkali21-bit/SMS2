'use client';

import { useState, useCallback } from 'react';
import { CreditMovement } from '@/components/CreditSystem';

export const useCreditSystem = (initialCredits: number = 12) => {
  const [credits, setCredits] = useState(initialCredits);
  const [showLowCreditWarning, setShowLowCreditWarning] = useState(false);
  const [movements, setMovements] = useState<CreditMovement[]>([
    {
      id: '1',
      type: 'gain',
      amount: 2,
      reason: 'Bonus de progression - Quiz Mathématiques terminé',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'spend',
      amount: 1,
      reason: 'Cours "Physique pour Ingénieurs" débloqué',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      courseId: 'physics-eng'
    },
    {
      id: '3',
      type: 'gain',
      amount: 1,
      reason: 'Connexion quotidienne - Bonus fidélité',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  ]);
  
  const [showAnimation, setShowAnimation] = useState<{ type: 'gain' | 'spend'; amount: number } | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Dépenser des crédits
  const spendCredits = useCallback((amount: number, reason: string, courseId?: string) => {
    if (credits < amount) {
      return false; // Pas assez de crédits
    }

    setCredits(prev => prev - amount);
    
    const newMovement: CreditMovement = {
      id: Date.now().toString(),
      type: 'spend',
      amount,
      reason,
      timestamp: new Date(),
      courseId
    };
    
    setMovements(prev => [newMovement, ...prev]);
    setShowAnimation({ type: 'spend', amount });
    
    // Vérifier si les crédits sont faibles après la dépense
    const newCreditAmount = credits - amount;
    if (newCreditAmount <= 5 && newCreditAmount > 0) {
      setTimeout(() => {
        setShowLowCreditWarning(true);
      }, 2000); // Afficher après l'animation de dépense
    }
    
    // Masquer l'animation après un délai
    setTimeout(() => setShowAnimation(null), 1500);
    
    return true; // Succès
  }, [credits]);

  // Gagner des crédits
  const gainCredits = useCallback((amount: number, reason: string) => {
    setCredits(prev => prev + amount);
    
    const newMovement: CreditMovement = {
      id: Date.now().toString(),
      type: 'gain',
      amount,
      reason,
      timestamp: new Date()
    };
    
    setMovements(prev => [newMovement, ...prev]);
    setShowAnimation({ type: 'gain', amount });
    
    // Masquer l'animation après un délai
    setTimeout(() => setShowAnimation(null), 1500);
  }, []);

  // Générer des suggestions personnalisées
  const getSuggestions = useCallback(() => {
    const suggestions = [];
    
    if (credits >= 3) {
      suggestions.push("Avec tes 3+ crédits, tu peux débloquer une série complète en Sciences pour construire une base solide.");
    } else if (credits >= 2) {
      suggestions.push("Tes 2 crédits te permettent de choisir 2 cours complémentaires pour renforcer tes compétences.");
    } else if (credits === 1) {
      suggestions.push("Avec ton crédit restant, concentre-toi sur le cours qui t'apportera le plus de valeur immédiate.");
    } else {
      suggestions.push("Termine tes cours actuels pour gagner de nouveaux crédits et débloquer plus de contenu !");
    }

    // Suggestions basées sur l'historique
    const recentSpends = movements.filter(m => m.type === 'spend').slice(0, 3);
    if (recentSpends.length > 0) {
      suggestions.push("Basé sur tes derniers choix, nous recommandons de continuer dans la même thématique pour approfondir tes connaissances.");
    }

    return suggestions;
  }, [credits, movements]);

  return {
    credits,
    movements,
    showAnimation,
    showModal,
    setShowModal,
    showLowCreditWarning,
    setShowLowCreditWarning,
    spendCredits,
    gainCredits,
    getSuggestions,
    canAfford: (amount: number) => credits >= amount
  };
};

