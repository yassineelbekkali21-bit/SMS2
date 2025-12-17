'use client';

import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

type Theme = 'blue' | 'purple' | 'turquoise' | 'coral' | 'mauve' | 'bluepremium' | 'yellow';

export function ColorSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('turquoise');

  const themes: { id: Theme; color: string; name: string }[] = [
    { id: 'blue', color: '#2563EB', name: 'SMS Blue' },
    { id: 'purple', color: '#7C3AED', name: 'Revolut' },
    { id: 'turquoise', color: '#0891b2', name: 'Turquoise' },
    { id: 'coral', color: '#FF6B6B', name: 'Corail' },
    { id: 'mauve', color: '#6d28d9', name: 'Mauve Premium' },
    { id: 'bluepremium', color: '#1e40af', name: 'Bleu Premium' },
    { id: 'yellow', color: '#FFEB3B', name: 'Jaune Fluo' },
  ];

  useEffect(() => {
    // Nettoyer les anciennes classes
    document.body.classList.remove('theme-blue', 'theme-purple', 'theme-turquoise', 'theme-coral', 'theme-mauve', 'theme-bluepremium', 'theme-yellow');
    // Ajouter la nouvelle
    if (currentTheme !== 'blue') {
      document.body.classList.add(`theme-${currentTheme}`);
    }

    // Mettre à jour la meta theme-color
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      const colors: Record<Theme, string> = {
        blue: '#2563EB',
        purple: '#7C3AED',
        turquoise: '#0891b2',
        coral: '#FF6B6B',
        mauve: '#6d28d9',
        bluepremium: '#1e40af',
        yellow: '#FFEB3B',
      };
      themeColorMeta.setAttribute('content', colors[currentTheme]);
    }
  }, [currentTheme]);

  return (
    <div className="fixed bottom-20 right-6 z-[100] flex items-end gap-2">
      {isOpen && (
        <div className="bg-white p-3 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-3 mb-14 absolute bottom-0 right-0 w-max animate-in fade-in slide-in-from-bottom-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Theme Color</p>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setCurrentTheme(theme.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                  currentTheme === theme.id ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: theme.color }}
                title={theme.name}
              >
                {currentTheme === theme.id && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-105"
      >
        <Palette size={20} />
      </button>
    </div>
  );
}

