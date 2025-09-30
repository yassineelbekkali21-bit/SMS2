import { useState, useEffect, useCallback } from 'react';

export interface FavoritesState {
  favorites: string[];
  isFavorite: (courseId: string) => boolean;
  toggleFavorite: (courseId: string, courseTitle?: string) => void;
  addFavorite: (courseId: string, courseTitle?: string) => void;
  removeFavorite: (courseId: string, courseTitle?: string) => void;
}

export function useFavorites(): FavoritesState {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadFavorites = () => {
        const storedFavorites = localStorage.getItem('favoriteCourses');
        if (storedFavorites) {
          try {
            const parsed = JSON.parse(storedFavorites);
            setFavorites(Array.isArray(parsed) ? parsed : []);
          } catch (error) {
            console.error('Erreur lors du chargement des favoris:', error);
            setFavorites([]);
          }
        }
      };

      // Charger au montage
      loadFavorites();

      // Écouter les changements du localStorage (pour synchronisation cross-component)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'favoriteCourses') {
          loadFavorites();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Écouter les changements personnalisés (pour même onglet)
      const handleCustomStorageChange = () => {
        loadFavorites();
      };
      
      window.addEventListener('favoritesChanged', handleCustomStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('favoritesChanged', handleCustomStorageChange);
      };
    }
  }, []);

  // Sauvegarder dans localStorage
  const saveFavorites = useCallback((newFavorites: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteCourses', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      
      // Déclencher un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('favoritesChanged'));
    }
  }, []);

  // Vérifier si un cours est favori
  const isFavorite = useCallback((courseId: string): boolean => {
    return favorites.includes(courseId);
  }, [favorites]);

  // Ajouter aux favoris
  const addFavorite = useCallback((courseId: string, courseTitle?: string) => {
    if (!favorites.includes(courseId)) {
      const newFavorites = [...favorites, courseId];
      saveFavorites(newFavorites);
      console.log(`💜 Cours ajouté aux favoris: ${courseTitle || courseId} (ID: ${courseId})`);
    }
  }, [favorites, saveFavorites]);

  // Retirer des favoris
  const removeFavorite = useCallback((courseId: string, courseTitle?: string) => {
    const newFavorites = favorites.filter(id => id !== courseId);
    saveFavorites(newFavorites);
    console.log(`🤍 Cours retiré des favoris: ${courseTitle || courseId}`);
  }, [favorites, saveFavorites]);

  // Toggle favori
  const toggleFavorite = useCallback((courseId: string, courseTitle?: string) => {
    if (isFavorite(courseId)) {
      removeFavorite(courseId, courseTitle);
    } else {
      addFavorite(courseId, courseTitle);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite
  };
}
