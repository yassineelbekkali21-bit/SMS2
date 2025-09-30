'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const savedAuth = localStorage.getItem('sms_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        if (authData.isAuthenticated) {
          setUser(authData.user);
        }
      } catch (error) {
        console.error('Erreur lors de la lecture des données d\'authentification:', error);
        localStorage.removeItem('sms_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    const userData: User = {
      id: 'user_sms_2026',
      name: 'Étudiant SMS',
      email: 'etudiant@sms.fr',
      isAuthenticated: true
    };

    setUser(userData);
    
    // Sauvegarder en localStorage
    localStorage.setItem('sms_auth', JSON.stringify({
      user: userData,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    }));

    console.log('✅ Connexion réussie:', userData.name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sms_auth');
    console.log('👋 Déconnexion réussie');
  };

  const isAuthenticated = user?.isAuthenticated ?? false;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}


